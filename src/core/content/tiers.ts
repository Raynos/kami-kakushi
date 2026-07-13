// The seven-tier bible spine (ADR-150/ADR-152) — the tier ID type and the display-name
// table, as the SINGLE SOURCE for tier naming (AC-21: never hand-type "T2 · The Valley"
// at a call site). Names follow the story bible's tier headings
// (docs/story-bible/03-tiers.md); T0–T3 are canon-named, T4–T6 name theirs at their
// design sittings and are carried here under their bible working titles.

/** A tier index on the seven-tier spine. Narrow on purpose (M3): an out-of-range tier
 *  literal is a compile error, where the old bare `number` accepted anything. */
export type TierId = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/** Clamp an untrusted number (a save field, a QA teleport arg) onto the spine.
 *  Floors fractions, pins below 0 to T0 and past-the-end to T6. */
export function toTierId(n: number): TierId {
  return Math.min(6, Math.max(0, Math.floor(n))) as TierId;
}

/** Display names per tier — the bible headings, the one place they're written in code. */
export const TIER_NAMES: Record<TierId, string> = {
  0: 'The Estate — the household',
  1: 'The Estate — the land',
  2: 'The Valley',
  3: 'The Region',
  4: 'The Castle Town',
  5: 'The Domain',
  6: 'Edo',
};
