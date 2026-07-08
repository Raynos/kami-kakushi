// map-sheets/t0-sheet.ts — the T0 sheet: the ONE world (ground.ts) seen through the
// T0 window, plus the sheet furniture pinned to that frame (spec §1). Thin by
// design: geography lives in layout.ts, drawing in the primitives, scene order in
// ground.ts — this file only marries them to the T0 crop.

import type { Pt } from './geom';
import { sv } from './brush';
import { cartouche, foldCreases, northArrow, scaleBar, sheetBorder } from './furniture';
import { paintWorld } from './ground';

interface Frame {
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
}

/** Sheet furniture for a given frame — shared by both tiers (T0's frame is the
 *  window, so the border/cartouche pin to the visible sheet, not world 0,0).
 *  The 凡例 legend box + the vertical distance notes are GONE (FB drain
 *  2026-07-07: the sheet is player-bound and unexplained kanji marginalia
 *  read as clutter — the mark grammar they decoded is gone with them). */
export function paintFurniture(art: SVGElement, frame: Frame, tier: 'T0' | 'T1'): void {
  const fg = sv('g', { transform: `translate(${frame.x} ${frame.y})` });
  sheetBorder(fg, frame.w, frame.h, { seed: `border-${tier}` });
  foldCreases(fg, frame.w, frame.h, { seed: `creases-${tier}` });
  northArrow(fg, 84, 96, `north-${tier}`);
  cartouche(fg, frame.w - 112, 48, {
    seed: `cart-${tier}`,
    title: '黒沢家領内絵図・改',
    sub: tier === 'T0' ? '安永九年' : '天明二年', // 1780 · 1782 — the survey's date
    gloss: tier === 'T0' ? 'The Kurosawa lands — 1780' : 'The Kurosawa lands — resurveyed 1782',
  });
  scaleBar(fg, 264, frame.h - 54, { seed: `scale-${tier}`, label: '一町', ticks: 2 });
  art.append(fg);
}

/** Paint the T0 ground; returns seal-anchor refinements for the shell. */
export function paintT0Ground(art: SVGElement, frame: Frame): Map<string, Pt> {
  const overrides = paintWorld(art, 'T0');
  paintFurniture(art, frame, 'T0');
  return overrides;
}
