// map-sheets/t0-sheet.ts — the T0 sheet: the ONE world (ground.ts) seen through the
// T0 window, plus the sheet furniture pinned to that frame (spec §1). Thin by
// design: geography lives in layout.ts, drawing in the primitives, scene order in
// ground.ts — this file only marries them to the T0 crop.

import type { Pt } from './brush';
import { sv } from './brush';
import {
  cartouche,
  distanceNote,
  foldCreases,
  legendBox,
  northArrow,
  scaleBar,
  sheetBorder,
} from './furniture';
import { paintWorld } from './ground';
import { NOTES } from './layout';

interface Frame {
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
}

export const LEGEND_ENTRIES = [
  { mark: '戦', gloss: 'fighting ground' },
  { mark: '人', gloss: 'folk work here' },
  { mark: '怪', markClass: 'shu', gloss: 'something is wrong here' },
  { mark: '新', markClass: 'gold', gloss: 'new in this survey' },
  { mark: '夜', markClass: 'shu', gloss: 'the night round (its post at the gate)' },
];

/** Sheet furniture for a given frame — shared by both tiers (T0's frame is the
 *  window, so the border/cartouche/legend pin to the visible sheet, not world 0,0). */
export function paintFurniture(art: SVGElement, frame: Frame, tier: 'T0' | 'T1'): void {
  const fg = sv('g', { transform: `translate(${frame.x} ${frame.y})` });
  sheetBorder(fg, frame.w, frame.h, { seed: `border-${tier}` });
  foldCreases(fg, frame.w, frame.h, { seed: `creases-${tier}` });
  northArrow(fg, 84, 96, `north-${tier}`);
  cartouche(fg, frame.w - 112, 48, {
    seed: `cart-${tier}`,
    title: '黒沢家領内絵図・改',
    sub: tier === 'T0' ? '安永九年' : '天明二年', // 1780 · 1782 — the survey's date
  });
  legendBox(fg, 42, frame.h - 238, {
    seed: `legend-${tier}`,
    title: '凡例',
    entries: LEGEND_ENTRIES,
  });
  scaleBar(fg, 264, frame.h - 54, { seed: `scale-${tier}`, label: '一町', ticks: 2 });
  art.append(fg);
  // period distance notes at the exits — world coords (the crop does the rest)
  for (const n of NOTES) {
    if (n.t1Only && tier === 'T0') continue;
    distanceNote(art, n.x, n.y, n.text, {
      seed: `note-${n.x}`,
      ...(n.vertical ? { vertical: true } : {}),
    });
  }
}

/** Paint the T0 ground; returns seal-anchor refinements for the shell. */
export function paintT0Ground(art: SVGElement, frame: Frame): Map<string, Pt> {
  const overrides = paintWorld(art, 'T0');
  paintFurniture(art, frame, 'T0');
  return overrides;
}
