// The cold open (PRD §3.1, §5 T0.2 beat 1): the amnesiac wakes in the Kurosawa
// grain-store. One verb against the dark, then the body/rest bar + rice counter
// ink in. The physician grounds the folklore (no kami — a flood + a blow); the
// first dream-fragment foreshadows Origin with ZERO mechanical effect.

import { NAMES } from './names';

export const COLD_OPEN = {
  // The 1780 setting anchor (ADR D-105) surfaces to the player exactly here, as
  // FLAVOUR: spring, the ninth year of An'ei (= 1780). Diegetic nengō only — no
  // Western year on screen (B2 declined), no calendar-model claim (B1: year()/
  // SEASON_TAG stay relative), no real place or person named (D-018/D-105).
  wake: "You open your eyes. Straw beneath you, the smell of wet rice, a low roof you do not know. A cold spring — the ninth year of An'ei — though the year is as lost to you as your name.",
  grounding: `"You're awake." ${NAMES.physician} the physician sits back on his heels. "No kami carried you off, whatever the village wants to believe. A flood took you, and a blow to the head took the rest. Bodies forget. Given work and rice, they also mend."`,
  dream:
    "Something surfaces and is gone — a porter's knot, a road in grey rain, a name you cannot keep hold of.",
  bodyReveal: 'You take stock of yourself: bruised, hollow, half-starved — but breathing.',
  riceReveal: `Rice lies scattered across the ${NAMES.house} grain-store floor. Spilled stores are waste — and clearing waste is a kind of work, if you set your hands to it.`,
  restReveal: 'Your arms are leaden. You could rest a moment against the cool post.',
  restAct: 'You rest against the post. The ache dulls; the light through the slats shifts.',
} as const;

export function rakeLine(amount: number): string {
  // The rake credits koku (RICE_PER_RAKE), so the line names koku — and shares the
  // multiply-able "(+N koku)" suffix the renderer tallies on a coalesced run.
  return `You rake the spilled rice back toward the basket. (+${amount} koku)`;
}
