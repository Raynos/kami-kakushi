// The slim in-gate pacing tripwire (F4 §5a) — ONE greedy run on the canonical seed inside the
// vitest gate, asserting the per-rung T0 band + the arc closing. Deliberately rationed (A17):
// the full gating matrix (all personas × SIM_SEEDS + margins) lives in `npm run verify:balance`
// (on-demand); this is the always-on drift alarm that costs ~40 ms. Genuinely RED-able: flip a
// RUNG_METER_THRESHOLDS entry ×3 and the band assert names that rung (proven in Ph2's DoD).

import { describe, it, expect } from 'vitest';
import { greedy } from './personas';
import { runPersona } from './run';
import { CANONICAL_SEED } from './seeds';
import { greedyBandVerdicts, structuralVerdict, phase2RatioVerdict } from './envelopes';
import type { RunMetrics } from './metrics';
import { balance } from '../core';

// ONE greedy run, shared across the tripwires below (A17 — don't re-run the sim per describe).
const { metrics } = runPersona(greedy, CANONICAL_SEED);

/** A minimal RunMetrics stub — `phase2RatioVerdict` reads only these three fields, so the RED-able
 *  cases below don't need a full simulated run. */
const ratioStub = (
  totalIntents: number,
  phase2Intents: number | null,
  ascended = true,
): RunMetrics => ({ ascended, totalIntents, economy: { phase2Intents } }) as unknown as RunMetrics;

describe('T0 pacing envelope tripwire (greedy, canonical seed)', () => {
  it('every climb rung lands inside the signed T0 band (D-056)', () => {
    for (const v of greedyBandVerdicts([metrics])) {
      expect(
        v.ok,
        `${v.rung}: measured [${v.measuredMin.toFixed(1)}–${v.measuredMax.toFixed(1)}] min ` +
          `outside the band [${v.bandMin}, ${v.bandMax}] — a pacing lever moved outside ` +
          'signed intent (re-derive the threshold or re-sign the band; never fudge the test)',
      ).toBe(true);
    }
  });

  it('the arc closes: full ladder, ascension, no soft-lock', () => {
    const s = structuralVerdict(metrics);
    expect(s.fullLadder, 'a rung was never reached').toBe(true);
    expect(s.ascended, 'the arc never ascended').toBe(true);
    expect(s.softLock, 'soft-locked').toBeNull();
  });
});

describe('Phase 2 ≈ Phase 1 ratio gate (D-133 / H19)', () => {
  it('the real greedy arc lands inside the signed ratio band', () => {
    const v = phase2RatioVerdict([metrics]);
    expect(v.built, 'greedy never reached a built Phase 2').toBeGreaterThan(0);
    expect(
      v.ok,
      `ratio [${v.measuredMin.toFixed(2)}–${v.measuredMax.toFixed(2)}] outside ` +
        `[${v.bandMin}, ${v.bandMax}] — Phase 2 drifted from ~1:1 with Phase 1 (re-tune the ` +
        'Phase-2 economy or re-sign PHASE2_PHASE1_RATIO_*; never fudge the test)',
    ).toBe(true);
  });

  it('is RED-able: a thin Phase 2 (the pre-D-133 anticlimax) FAILS the band', () => {
    // ~50-intent Phase 2 against an ~10440 Phase 1 → ratio ≈ 0.005, far below the 0.8 floor.
    const v = phase2RatioVerdict([ratioStub(10490, 50)]);
    expect(v.built).toBe(1);
    expect(v.ok).toBe(false);
    expect(v.measuredMax).toBeLessThan(balance.PHASE2_PHASE1_RATIO_MIN);
  });

  it('no-ops GREEN when no run has a built Phase 2 — never cries wolf on an unbuilt tier', () => {
    const v = phase2RatioVerdict([ratioStub(1000, null, false)]);
    expect(v.built).toBe(0);
    expect(v.ok).toBe(true);
  });
});
