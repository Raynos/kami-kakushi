// map-sheets/t2-sheet.ts — the T2 sheet: the VALLEY (t2-ground.ts), the same world
// pulled back — the estate demoted to a compound, Asagiri downstream (spec §6). Thin
// by design: geography lives in valley.ts + layout.ts, drawing in the primitives,
// scene order in t2-ground.ts — this file only marries them to the valley frame +
// the shared furniture.

import type { Pt } from './geom';
import { paintValley } from './t2-ground';
import { paintFurniture } from './t0-sheet';

interface Frame {
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
}

/** Paint the T2 valley ground. Returns an (empty) seal-anchor override map: T2 seals
 *  sit on their layout ANCHORS directly (no room-scale refinement at valley zoom).
 *  `revealed` defaults true — the sheet is the end-of-tier survey, drawn honest. */
export function paintT2Ground(art: SVGElement, frame: Frame, revealed = true): Map<string, Pt> {
  paintValley(art, revealed);
  paintFurniture(art, frame, 'T2');
  return new Map<string, Pt>();
}
