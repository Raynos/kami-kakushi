// The cold open (PRD §3.1, §5 T0.2 beat 1): the amnesiac wakes in the Kurosawa
// grain-store. The PROSE is authored in `narrative/cold-open.md` (FB-5 — the source
// of truth) and compiled to `coldOpen.gen.ts`; this module keeps the real logic
// (`rakeLine`) and re-exports the generated constants. One verb against the dark, then the body/rest bar + rice counter
// ink in. The physician grounds the folklore (no kami — a flood + a blow); the
// first dream-fragment foreshadows Origin with ZERO mechanical effect.

export { COLD_OPEN } from './coldOpen.gen';
import { FLAVOR } from './flavor.gen';

export function rakeLine(amount: number): string {
  // The rake credits RICE (RICE_PER_RAKE) — the honest noun now (ADR-107): what you clear off the
  // grain-store floor is rice, the real resource. Shares the multiply-able "(+N rice)" suffix the
  // renderer tallies on a coalesced run. Coin arrives later, as the first wage (haul stores).
  return `You rake the spilled rice back toward the basket. (+${amount} rice)`;
}

// FB-324 — spoken once, on the rake that clears the last of the spill (balance.RAKE_CAP).
// Take (a) of the fb324-rake-cap bundle (ADR-139) — alternates live in
// narrative/takes/fb324-rake-cap/, switchable in DEV → Story via the override below.
// FB-361 (TST1): the canon string lives in narrative/flavor.md → the generated FLAVOR
// registry (the one home the DEV story reader resolves); this const is the same binding.
// Imported from flavor.gen directly (not ./flavor) so this leaf module adds no cycle.
export const RAKE_CAP_LINE: string = FLAVOR.rakeCapLine;

// ADR-139 — the cap line is CORE-emitted log text, so the DEV story switcher swaps it at
// EMIT time through the declaring-module override (the discoveries.ts/requirements.ts
// pattern): FUTURE emits voice the selected take; already-logged lines stay (TST2).
let RAKE_CAP_LINE_OVERRIDE: string | null = null;

/** DEV-only: overlay the rake-cap line by its `rakeCapLine` flavor key (null = canon). */
export function __setRakeCapLineOverride(text: string | null): void {
  RAKE_CAP_LINE_OVERRIDE = text;
}

/** The line the capping rake emits — the DEV overlay's take if set, else canon. */
export function rakeCapLine(): string {
  return RAKE_CAP_LINE_OVERRIDE ?? RAKE_CAP_LINE;
}
// The disabled rake button says why (AC-6 — same predicate as the reducer refusal).
export const RAKE_DONE_REASON = 'Nothing left to rake — the boards are clean.';
