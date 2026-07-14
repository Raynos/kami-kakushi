// porter-math.ts — the PURE walk math for the FB-340 v2 travel presence (the
// porter piece). No DOM, no rng: position along the walked edge from the
// ActionClock fraction, the gait envelope from wall time, and the resting
// placement offset — unit-tested in porter-math.test.ts, consumed by
// sheet-map.ts's presence player and the resting mount.

export interface Pt {
  readonly x: number;
  readonly y: number;
}

/** The piece stands ON the seal — feet at the kanji baseline (drawSeal puts the
 *  kanji at y+16), body rising over the box, ABOVE the English caption (which
 *  sits at ~y+73). Human call 2026-07-11 ("on top of the kanji"), superseding
 *  the first south-lane placement (y+128 — it read as below the caption). The
 *  piece is pointer-events:none, so the seal stays fully tappable under it. */
export const PORTER_STAND_Y = 16;

/** Sculpt scale in sheet world units. The prototype locked 0.82 against the
 *  DEV sheet's smaller seals; the live map's 132×78 seals warrant a touch
 *  more so the piece stays "smaller than the label, not lost". */
export const PORTER_SCALE = 1.05;

/** LINEAR position along the walked edge at clock fraction `p` (the human
 *  ask: constant-speed travel, no easing on the piece itself). */
export function walkPoint(from: Pt, to: Pt, p: number): Pt {
  const f = clamp01(p);
  return { x: from.x + (to.x - from.x) * f, y: from.y + (to.y - from.y) * f };
}

/** The walking gait at wall time `tMs` — the prototype's heavy netsuke waddle:
 *  a bob (translate-y, world units) + a rock (degrees about the feet). Bounded
 *  and periodic; zero when not walking (the caller gates on `running`).
 *  FB-389 (drain 2026-07-11) — frequencies halved with the ×2 walk table: the
 *  0.4s/0.8s cycles read frantic; ~0.8s bob / ~1.6s rock reads heavy. */
export function gaitAt(tMs: number): {
  readonly bob: number;
  readonly rock: number;
} {
  return {
    bob: Math.sin(tMs * 0.008) * 3.5,
    rock: Math.sin(tMs * 0.004) * 6,
  };
}

export function clamp01(n: number): number {
  return Math.min(1, Math.max(0, n));
}
