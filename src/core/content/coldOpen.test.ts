import { describe, it, expect } from 'vitest';
import { COLD_OPEN } from './coldOpen';

// The 1780 setting anchor (ADR ADR-105 / plan 2026-07-02-anchor-1780-code-surfacing)
// surfaces to the player exactly once — in the cold open — as FLAVOUR: spring, the
// ninth year of An'ei (= 1780). These assert the grounding INTENT (season + era
// present, kept diegetic), not a brittle full-string copy: each goes RED if the
// anchor is dropped or a Western year leaks on-screen, but neither pins the
// calendar model (B1 — year()/SEASON_TAG stay relative and are untested here on
// purpose).
describe('COLD_OPEN.wake — the 1780 anchor grounding (D-105)', () => {
  it("grounds the open in spring, the ninth year of An'ei", () => {
    expect(COLD_OPEN.wake).toContain('spring');
    expect(COLD_OPEN.wake).toContain("An'ei");
  });

  it('keeps the anchor diegetic — no Western year digits on screen (B2 declined)', () => {
    expect(COLD_OPEN.wake).not.toMatch(/\b1[678]\d\d\b/);
  });
});
