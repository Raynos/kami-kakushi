// The cold open (PRD §3.1, §5 T0.2 beat 1): the amnesiac wakes in the Kurosawa
// grain-store. The PROSE is authored in `narrative/cold-open.md` (F5 — the source
// of truth) and compiled to `coldOpen.gen.ts`; this module keeps the real logic
// (`rakeLine`) and re-exports the generated constants. One verb against the dark, then the body/rest bar + rice counter
// ink in. The physician grounds the folklore (no kami — a flood + a blow); the
// first dream-fragment foreshadows Origin with ZERO mechanical effect.

export { COLD_OPEN } from './coldOpen.gen';

export function rakeLine(amount: number): string {
  // The rake credits RICE (RICE_PER_RAKE) — the honest noun now (D-107): what you clear off the
  // grain-store floor is rice, the real resource. Shares the multiply-able "(+N rice)" suffix the
  // renderer tallies on a coalesced run. Coin arrives later, as the first wage (haul stores).
  return `You rake the spilled rice back toward the basket. (+${amount} rice)`;
}
