// stamp-book/concertina.ts — VARIANT A (the shipped default): the run as a
// small folded concertina strip, reading RIGHT → LEFT (the genre's rule
// survives the shrink): R0's seal at the right edge, the run growing
// leftward through the pressed seals to the named next slot, then the
// mystery silhouettes. The thread runs under the seals, knotting where the
// record knotted, thinning through the lean stretches. Natural drawing
// width, horizontal scroll inside its own box (P6/P20); opens at the
// frontier. Seeded-deterministic (TST2).

import { inkLine, sv, wash } from '../map-sheets/brush';
import type { Pt } from '../map-sheets/geom';
import {
  drawAwaitFrame,
  drawSeal,
  drawSilhouette,
  drawStretch,
  openSealPopover,
  sealText,
} from './compact-draw';
import type { StripData } from './from-state';

const SLOT_W = 88;
const STRIP_H = 168;
const SEAL_CY = 66;
const SEAL_SIZE = 46;

/** slot i (ladder order, R0 first) → its panel's left x (R0 rightmost). */
function panelX(i: number, total: number): number {
  return (total - 1 - i) * SLOT_W;
}

/** Paint the concertina into `host` (cleared). `host` must live inside the
 *  positioned section card so the shared popover can anchor.
 *  `opts.pressRung` marks that rung's seal as FRESHLY PRESSED (the ADR-201
 *  afterglow): its group carries `.sbc-pressing`, which CSS animates once —
 *  the drawing itself is identical (the golden pin sees no class-only
 *  difference in geometry). */
export function paintConcertina(
  host: HTMLElement,
  data: StripData,
  opts?: { pressRung?: string },
): void {
  host.textContent = '';
  const total = data.slots.length;
  const w = total * SLOT_W;

  // wrap + edge fades: the clipped panel must read as "more book this way",
  // not as a defect (blind pass) — pointer-inert gradients over each edge.
  const wrap = document.createElement('div');
  wrap.className = 'sbc-wrap';
  const scroll = document.createElement('div');
  scroll.className = 'sbc-scroll';
  const svg = sv('svg', {
    viewBox: `0 0 ${w} ${STRIP_H}`,
    width: String(w),
    height: String(STRIP_H),
    class: 'sbc-strip',
  }) as SVGSVGElement;
  scroll.append(svg);
  wrap.append(scroll);
  const fadeL = document.createElement('div');
  fadeL.className = 'sbc-fade sbc-fade-l';
  const fadeR = document.createElement('div');
  fadeR.className = 'sbc-fade sbc-fade-r';
  wrap.append(fadeL, fadeR);
  host.append(wrap);

  // panels — alternating washi shades, fold creases between (the folded book)
  for (let i = 0; i < total; i++) {
    const x0 = panelX(i, total);
    wash(
      svg,
      [
        [x0 + 4, 4],
        [x0 + SLOT_W - 4, 4],
        [x0 + SLOT_W - 4, STRIP_H - 4],
        [x0 + 4, STRIP_H - 4],
      ],
      {
        seed: `sbc-page-${i}`,
        fill: i % 2 === 0 ? 'var(--washi)' : 'var(--washi-shade)',
        amp: 2,
      },
    );
  }
  for (let i = 1; i < total; i++) {
    const x = panelX(i, total) + SLOT_W;
    inkLine(
      svg,
      [
        [x, 7],
        [x, STRIP_H - 7],
      ],
      {
        seed: `sbc-crease-${i}`,
        color: 'var(--steel-0)',
        w: 1.8,
        opacity: 0.9,
        amp: 0.8,
      },
    );
  }

  // seal anchors — one per panel, a fixed calm mid band (the seal's own
  // seeded rotation carries the hand; the line stays level)
  const anchors: Pt[] = data.slots.map((_slot, i) => [
    panelX(i, total) + SLOT_W / 2,
    SEAL_CY,
  ]);

  // the thread first (under the seals), pressed ground only + one dry reach
  // into the next slot's frame
  const lastPressed = data.slots.reduce(
    (acc, s, i) => (s.state === 'pressed' ? i : acc),
    0,
  );
  for (let i = 0; i < data.stretches.length; i++) {
    const reachesNext = i === lastPressed && i + 1 < total;
    if (i < lastPressed || reachesNext)
      drawStretch(
        svg,
        anchors[i]!,
        anchors[i + 1]!,
        `${data.slots[i]!.rung}`,
        reachesNext
          ? { ...data.stretches[i]!, lean: true } // the still-open reach is dry
          : data.stretches[i]!,
      );
  }

  // the slots
  for (let i = 0; i < total; i++) {
    const slot = data.slots[i]!;
    const [cx, cy] = anchors[i]!;
    const ground = i % 2 === 0 ? 'var(--washi)' : 'var(--washi-shade)';
    if (slot.state === 'pressed') {
      const g = drawSeal(
        svg,
        cx,
        cy,
        SEAL_SIZE,
        slot.rung,
        slot.kanji ?? '',
        ground,
      );
      if (opts?.pressRung === slot.rung) {
        // wrap for the press animation: the wrapper carries no attribute
        // transform, so CSS can scale it without stomping the seal's rotation
        const press = sv('g', { class: 'sbc-pressing' });
        svg.insertBefore(press, g);
        press.append(g);
      }
      sealText(svg, cx, cy + SEAL_SIZE / 2 + 24, slot.title ?? '', {
        size: 10.5,
        color: 'var(--ink)',
        font: 'body',
      });
      if (slot.day !== undefined && slot.season !== undefined)
        sealText(svg, cx, cy + SEAL_SIZE / 2 + 40, `day ${slot.day}`, {
          size: 9,
          color: 'var(--ink-soft)',
          font: 'body',
        });
    } else if (slot.state === 'next') {
      drawAwaitFrame(svg, cx, cy, SEAL_SIZE, slot.rung);
      sealText(svg, cx, cy + SEAL_SIZE / 2 + 24, slot.title ?? '', {
        size: 10.5,
        color: 'var(--ink-soft)',
        font: 'body',
      });
      sealText(
        svg,
        cx,
        cy + SEAL_SIZE / 2 + 40,
        `${slot.reqsDone ?? 0} of ${slot.reqsTotal ?? 0}`,
        // --ink-soft, not --ink-faint: the count is load-bearing (blind pass)
        { size: 9, color: 'var(--ink-soft)', font: 'body' },
      );
    } else {
      drawSilhouette(svg, cx, cy, SEAL_SIZE * 0.86, slot.rung);
    }
    // hit target → the shared popover (host-local coordinates)
    const hot = sv('rect', {
      x: String(panelX(i, total)),
      y: '0',
      width: String(SLOT_W),
      height: String(STRIP_H),
      fill: 'transparent',
      class: slot.state === 'future' ? '' : 'sbc-hot',
    });
    hot.addEventListener('click', (e) => {
      const hostBox = host.getBoundingClientRect();
      const me = e as MouseEvent;
      openSealPopover(
        host,
        slot,
        { x: me.clientX - hostBox.left, y: me.clientY - hostBox.top + 10 },
        i > 0 ? data.stretches[i - 1]!.knots : undefined,
        hot,
      );
    });
    svg.append(hot);
  }

  // open at the frontier — the next slot (or the last pressed seal) visible
  const frontier = Math.min(lastPressed + 1, total - 1);
  const frontierX = panelX(frontier, total);
  // after attach, clientWidth is real; center the frontier in the box
  requestAnimationFrame(() => {
    scroll.scrollLeft = Math.max(
      0,
      frontierX - Math.max(0, scroll.clientWidth / 2 - SLOT_W / 2),
    );
  });
}
