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
 *  capture; the deterministic save in the .md is the authoritative repro. The
 *  capture overlay's own UI (the note box, marked data-kami-capture) is
 *  filtered out so a body-rooted shot never photographs itself. */
export const snapshotDom: DomSnapshotter = async (el) => {
  try {
    return await domToPng(el, {
      filter: (node) => !(node instanceof HTMLElement && node.dataset.kamiCapture !== undefined),
    });
  } catch {
    return null;
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
