import { describe, it, expect } from 'vitest';
import { COLD_OPEN } from './coldOpen';
import { DIALOGUE_SCENES } from './intro';

// The 1780 setting anchor (ADR-105 / plan 2026-07-02-anchor-1780-code-surfacing)
// surfaces to the player exactly once — as FLAVOUR. In the storywave rewrite the anchor
// moved OFF the cold-open wake line and INTO the intro exam (Sōan: "An'ei nine" = the
// ninth year of An'ei = 1780), where the physician grounds the folklore. These assert the
// grounding INTENT (the era present, kept diegetic), not a brittle full-string copy: each
// goes RED if the anchor is dropped or a Western year leaks on-screen, but neither pins the
// calendar model (B1 — year()/SEASON_TAG stay relative and are untested here on purpose).

/** Every narrator/speaker line in the intro greetings, flattened — the source of truth for
 *  what the player reads before the first verb. */
const introText = DIALOGUE_SCENES.flatMap((s) => s.greeting.map((l) => l.text)).join('\n');

describe('the 1780 anchor grounding (D-105) — surfaced in the intro exam', () => {
  it("grounds the era in An'ei nine (the physician's exam line)", () => {
    expect(introText).toContain("An'ei"); // the era anchor is present, diegetic
    // and it lands in the FIRST scene (the exam), not buried later — the cold open's own beat.
    expect(DIALOGUE_SCENES[0]!.greeting.some((l) => l.text.includes("An'ei"))).toBe(true);
  });

  it('keeps the anchor diegetic — no Western year digits anywhere in the cold open + intro (B2 declined)', () => {
    const surfaced = [COLD_OPEN.weir, COLD_OPEN.wake, COLD_OPEN.dream, introText].join('\n');
    expect(surfaced).not.toMatch(/\b1[678]\d\d\b/);
  });

  it('the cold-open wake line no longer carries the era anchor (it moved to the exam)', () => {
    // A regression that re-duplicated the anchor onto the wake line would go RED here — the
    // anchor surfaces EXACTLY once (the exam), never twice.
    expect(COLD_OPEN.wake).not.toContain("An'ei");
  });
});
