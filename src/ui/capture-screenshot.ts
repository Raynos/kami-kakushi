// The real DOM→PNG snapshotter for the capture overlay (FB-3 Ph2b). Kept in its own module so
// capture.ts stays dependency-free and fully unit-testable — main.ts injects this at the mount
// (as the overlay's `DomSnapshotter`). DEV-ONLY: imported only from main.ts's
// `import.meta.env.DEV` branch, so modern-screenshot dead-code-eliminates from the prod bundle
// with the rest of the overlay (verify-dev-strip.sh proves it) — the prod zero-runtime-dep
// guarantee holds; modern-screenshot is a devDependency.

import { domToPng } from 'modern-screenshot';
import {
  MARKUP_COLOR,
  MARKUP_WIDTH,
  type DomSnapshotter,
  type ScreenshotCompositor,
} from './capture';

/** Rasterise `el` (the shotRoot — main passes document.body so modals mounted
 *  outside #app ride the shot, FB-195) to a PNG data URL, or null on failure —
 *  a screenshot is a best-effort viewing aid (§2.3), never allowed to break the
 *  capture; the deterministic save in the .md is the authoritative repro.
 *
 *  Every node the OVERLAY owns is filtered out, so a body-rooted shot never
 *  photographs itself: the note box, the error dialog, and — since the shot now
 *  runs at submit (FB-215), with the pen's canvas still mounted — the markup
 *  canvas, whose strokes `compositeStrokes` re-draws into the PNG below. Leaving
 *  it in would ink every annotation twice. The pick HIGHLIGHT is deliberately
 *  NOT filtered: it is the whole point of the picture. */
const OVERLAY_MARKS = ['kamiCapture', 'kamiCaptureError', 'kamiCaptureMenu', 'kamiMarkup'] as const;

/** An SVG with more descendants than this gets pre-rasterised (FB-337) instead
 *  of walked. The map sheet is ~15k elements; everything else in the UI is two
 *  orders of magnitude below, so the threshold has a wide safe band. */
const HEAVY_SVG_NODES = 500;

/** Escape a CSS value for substitution into a serialized XML attribute. */
const xmlAttrEscape = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

/** FB-337 — pre-rasterise element-heavy SVGs so the DOM walker never sees them.
 *  `domToPng` clones every node and inlines its computed styles one by one; the
 *  map sheet's ~15k-element SVG turned a ~0.7s shot into a ~10s stall. The
 *  browser's own renderer draws that same SVG in ~160ms, so: serialize the SVG
 *  (resolving `var(--…)` tokens against the live cascade — an SVG-as-image is a
 *  separate document with no access to the page's custom properties), draw it
 *  through an Image onto a canvas at its on-screen rect × DPR, drop the flat
 *  <img> in its place, and hide + mark the original so the shot filter skips it
 *  (hiding alone is not enough — the cloner walks display:none subtrees too).
 *  The world is frozen during capture and the img is pixel-identical, so the
 *  swap is invisible; the returned restore fns undo it after the shot. The flat
 *  img is inserted in-flow with the SVG's on-screen box — the map sheet (the
 *  only heavy SVG today) fills its wrap in normal flow, which is what makes
 *  that placement exact. Per-SVG failures fall back to the slow walked path. */
async function flattenHeavySvgs(root: HTMLElement): Promise<(() => void)[]> {
  const restores: (() => void)[] = [];
  for (const svg of root.querySelectorAll('svg')) {
    if (svg.querySelectorAll('*').length < HEAVY_SVG_NODES) continue;
    const rect = svg.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) continue; // hidden (incl. inside an already-flattened svg)
    try {
      const clone = svg.cloneNode(true) as SVGSVGElement;
      clone.setAttribute('width', String(rect.width));
      clone.setAttribute('height', String(rect.height));
      // The sheet's class-styled internals (the zone pills' kanji + captions,
      // `.t0v2-kanji { fill: var(--ink) }` & co) are styled by PAGE stylesheets
      // a standalone SVG document never sees — without them the text rasterises
      // default-black on the near-black ground and reads as lost. Embed every
      // same-origin rule into the clone so the cascade rides along; the var()
      // pass below then resolves custom properties inside those rules too.
      let css = '';
      for (const sheet of Array.from(document.styleSheets)) {
        try {
          for (const rule of Array.from(sheet.cssRules)) css += `${rule.cssText}\n`;
        } catch {
          /* cross-origin sheet — skip */
        }
      }
      const styleEl = document.createElementNS('http://www.w3.org/2000/svg', 'style');
      styleEl.textContent = css;
      clone.insertBefore(styleEl, clone.firstChild);
      const cascade = getComputedStyle(svg);
      const markup = new XMLSerializer()
        .serializeToString(clone)
        .replace(/var\((--[\w-]+)(?:,[^)]*)?\)/g, (token, name: string) => {
          const v = cascade.getPropertyValue(name).trim();
          return v ? xmlAttrEscape(v) : token;
        });
      const url = URL.createObjectURL(new Blob([markup], { type: 'image/svg+xml;charset=utf-8' }));
      const img = new Image();
      try {
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => reject(new Error('heavy-svg raster failed to load'));
          img.src = url;
        });
      } finally {
        URL.revokeObjectURL(url);
      }
      const dpr = window.devicePixelRatio || 1;
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      const ctx = canvas.getContext('2d');
      if (!ctx) continue;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const flat = document.createElement('img');
      flat.src = canvas.toDataURL('image/png');
      flat.style.cssText = `display:block;width:${rect.width}px;height:${rect.height}px;`;
      const prevDisplay = svg.style.display;
      svg.before(flat);
      svg.dataset.kamiHeavySvg = '';
      svg.style.display = 'none';
      restores.push(() => {
        flat.remove();
        svg.style.display = prevDisplay;
        delete svg.dataset.kamiHeavySvg;
      });
    } catch {
      /* this svg rides the slow walked path instead */
    }
  }
  return restores;
}

export const snapshotDom: DomSnapshotter = async (el) => {
  let restores: (() => void)[] = [];
  try {
    restores = await flattenHeavySvgs(el);
    return await domToPng(el, {
      filter: (node) =>
        !(
          (node instanceof HTMLElement || node instanceof SVGElement) &&
          (OVERLAY_MARKS.some((mark) => node.dataset[mark] !== undefined) ||
            node.dataset.kamiHeavySvg !== undefined)
        ),
    });
  } catch {
    return null;
  } finally {
    for (const restore of restores) restore();
  }
};

/** Bake markup strokes onto the frozen screenshot (FB — the ✎ Draw pen). Draws the base PNG to a
 *  canvas at its natural pixels, then re-draws the strokes scaled from host-CSS space → PNG pixels
 *  (so the annotation lands where the human drew it, whatever the shot's DPR/scale), and re-exports
 *  a PNG. Falls back to the un-annotated shot if the image or a 2D context is unavailable — the
 *  drawing is a viewing aid, never allowed to break the capture. */
export const compositeStrokes: ScreenshotCompositor = async (basePng, strokes, source) => {
  const img = new Image();
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error('markup: base image failed to load'));
    img.src = basePng;
  });
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) return basePng; // no 2D context — send the un-annotated shot
  ctx.drawImage(img, 0, 0);

  // strokes are in the host's CSS-pixel space; scale to the PNG's natural pixels
  const sx = source.width > 0 ? img.naturalWidth / source.width : 1;
  const sy = source.height > 0 ? img.naturalHeight / source.height : 1;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.strokeStyle = MARKUP_COLOR;
  ctx.lineWidth = MARKUP_WIDTH * sx; // keep the ink the same visual weight as on-screen
  for (const stroke of strokes) {
    if (stroke.length === 0) continue;
    ctx.beginPath();
    ctx.moveTo(stroke[0]!.x * sx, stroke[0]!.y * sy);
    for (let i = 1; i < stroke.length; i++) ctx.lineTo(stroke[i]!.x * sx, stroke[i]!.y * sy);
    if (stroke.length === 1) ctx.lineTo(stroke[0]!.x * sx + 0.1, stroke[0]!.y * sy + 0.1);
    ctx.stroke();
  }
  return canvas.toDataURL('image/png');
};
