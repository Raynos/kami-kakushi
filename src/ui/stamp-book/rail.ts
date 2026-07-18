// stamp-book/rail.ts — VARIANT B (DEV-only alternate): the pure COLLECTION
// register — no book fiction on screen, no thread: the eight seals as a
// dense badge rail on one board, right → left, wrapping to two rows at
// narrow widths (the gym-badge case at its most literal). Dates in tiny
// chrome type; knots surface only in the shared popover. Distinct APPROACH
// from A (panorama with thread) — hierarchy and density, not palette.

import { sv } from '../map-sheets/brush';
import {
  drawAwaitFrame,
  drawSeal,
  drawSilhouette,
  openSealPopover,
} from './compact-draw';
import type { StripData } from './from-state';

const CELL_SVG = 58;
const SEAL_SIZE = 44;

export function paintRail(host: HTMLElement, data: StripData): void {
  host.textContent = '';
  const rail = document.createElement('div');
  rail.className = 'sbc-rail';
  host.append(rail);

  data.slots.forEach((slot, i) => {
    const cell = document.createElement('div');
    cell.className = `sbc-cell sbc-cell-${slot.state}`;
    const svg = sv('svg', {
      viewBox: `0 0 ${CELL_SVG} ${CELL_SVG}`,
      class: 'sbc-cell-seal',
    }) as SVGSVGElement;
    const c = CELL_SVG / 2;
    if (slot.state === 'pressed')
      drawSeal(svg, c, c, SEAL_SIZE, `rail-${slot.rung}`, slot.kanji ?? '');
    else if (slot.state === 'next')
      drawAwaitFrame(svg, c, c, SEAL_SIZE, `rail-${slot.rung}`);
    else drawSilhouette(svg, c, c, SEAL_SIZE * 0.86, `rail-${slot.rung}`);
    cell.append(svg);

    const name = document.createElement('div');
    name.className = 'sbc-cell-name';
    name.textContent = slot.state === 'future' ? '—' : (slot.title ?? '');
    cell.append(name);

    const sub = document.createElement('div');
    sub.className = 'sbc-cell-sub numeric';
    sub.textContent =
      slot.state === 'pressed'
        ? slot.day !== undefined
          ? `day ${slot.day}`
          : ''
        : slot.state === 'next'
          ? `${slot.reqsDone ?? 0}/${slot.reqsTotal ?? 0}`
          : '';
    cell.append(sub);

    if (slot.state !== 'future') {
      cell.classList.add('sbc-hot');
      cell.addEventListener('click', (e) => {
        const hostBox = host.getBoundingClientRect();
        const me = e as MouseEvent;
        openSealPopover(
          host,
          slot,
          { x: me.clientX - hostBox.left, y: me.clientY - hostBox.top + 10 },
          i > 0 ? data.stretches[i - 1]!.knots : undefined,
          cell,
        );
      });
    }
    rail.append(cell);
  });
}
