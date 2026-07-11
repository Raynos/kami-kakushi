// map-sheets/t0-sheet.ts — the T0 sheet: the ONE world (ground.ts) seen through the
// T0 window, plus the sheet furniture pinned to that frame (spec §1). Thin by
// design: geography lives in layout.ts, drawing in the primitives, scene order in
// ground.ts — this file only marries them to the T0 crop.

import type { Pt } from './geom';
import { sv } from './brush';
import { cartouche, foldCreases, northArrow, scaleBar, sheetBorder } from './furniture';
import { paintWorld } from './ground';
import type { Tier } from './nodes';

interface Frame {
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
}

const CART_SUB: Record<Tier, string> = { T0: '安永九年', T1: '天明二年', T2: '天明四年' }; // 1780·1782·1784
const CART_GLOSS: Record<Tier, string> = {
  T0: 'The Kurosawa lands — 1780',
  T1: 'The Kurosawa lands — resurveyed 1782',
  T2: 'The Kurosawa valley — surveyed 1784',
};

/** Sheet furniture for a given frame — shared by all tiers (T0's frame is the
 *  window, so the border/cartouche pin to the visible sheet, not world 0,0).
 *  The 凡例 legend box + the vertical distance notes are GONE (FB drain
 *  2026-07-07: the sheet is player-bound and unexplained kanji marginalia
 *  read as clutter — the mark grammar they decoded is gone with them). */
export function paintFurniture(art: SVGElement, frame: Frame, tier: Tier): void {
  const fg = sv('g', { transform: `translate(${frame.x} ${frame.y})` });
  sheetBorder(fg, frame.w, frame.h, { seed: `border-${tier}` });
  foldCreases(fg, frame.w, frame.h, { seed: `creases-${tier}` });
  northArrow(fg, 84, 96, { seed: `north-${tier}` });
  cartouche(fg, frame.w - 112, 48, {
    seed: `cart-${tier}`,
    title: '黒沢家領内絵図・改',
    sub: CART_SUB[tier],
    gloss: CART_GLOSS[tier],
  });
  // valley scale reads in 里 (a wider sheet); the estate sheets in 町
  scaleBar(fg, 264, frame.h - 54, {
    seed: `scale-${tier}`,
    label: tier === 'T2' ? '一里' : '一町',
    ticks: 2,
  });
  art.append(fg);
}

/** Paint the T0 ground; returns seal-anchor refinements for the shell.
 *  The world is CLIPPED to the frame (FB-378 root cause): paintWorld draws the
 *  whole T1 geography and the viewBox alone was the only crop, so panning or
 *  zooming leaked beyond-window world art (the east woods, the north hills)
 *  onto a sheet that is fictionally the T0 survey. The sheet furniture pins to
 *  the frame OUTSIDE the clip (the border rides the edge). */
export function paintT0Ground(art: SVGElement, frame: Frame): Map<string, Pt> {
  const uid = `t0-window-clip-${frame.x}-${frame.y}`;
  const clip = sv('clipPath', { id: uid });
  clip.append(
    sv('rect', {
      x: String(frame.x),
      y: String(frame.y),
      width: String(frame.w),
      height: String(frame.h),
    }),
  );
  const world = sv('g', { 'clip-path': `url(#${uid})` });
  art.append(clip, world);
  const overrides = paintWorld(world, 'T0');
  paintFurniture(art, frame, 'T0');
  return overrides;
}
