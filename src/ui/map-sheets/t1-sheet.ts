// map-sheets/t1-sheet.ts — the T1 sheet: the SAME world (ground.ts), seen whole,
// re-surveyed at the tier's end — the reviser's red + fresh ink record what the
// tier changed (spec §2). Geography identical to T0 by construction: this file is
// only the full frame + the furniture.

import type { Pt } from './geom';
import { paintWorld } from './ground';
import { paintFurniture } from './t0-sheet';

/** Paint the T1 ground; returns seal-anchor refinements for the shell. */
export function paintT1Ground(
  art: SVGElement,
  frame: { readonly x: number; readonly y: number; readonly w: number; readonly h: number },
): Map<string, Pt> {
  const overrides = paintWorld(art, 'T1');
  paintFurniture(art, frame, 'T1');
  return overrides;
}
