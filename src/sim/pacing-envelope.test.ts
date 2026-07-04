// The slim in-gate pacing tripwire (F4 §5a) — ONE greedy run on the canonical seed inside the
// vitest gate, asserting the per-rung T0 band + the arc closing. Deliberately rationed (A17):
// the full gating matrix (all personas × SIM_SEEDS + margins) lives in `npm run verify:balance`
// (on-demand); this is the always-on drift alarm that costs ~40 ms. Genuinely RED-able: flip a
// RUNG_METER_THRESHOLDS entry ×3 and the band assert names that rung (proven in Ph2's DoD).

import { describe, it, expect } from 'vitest';
import { greedy } from './personas';
import { runPersona } from './run';
import { CANONICAL_SEED } from './seeds';
import { greedyBandVerdicts, structuralVerdict } from './envelopes';

describe('T0 pacing envelope tripwire (greedy, canonical seed)', () => {
  const { metrics } = runPersona(greedy, CANONICAL_SEED);

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
