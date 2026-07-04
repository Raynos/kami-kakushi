// TEMPORARY (F5 Ph1) — the migration equivalence proof: the generated RUNG_BEATS
// (compiled from narrative/rung-beats.md) is behavior-identical to the hand-written
// registry. RETIRES AT THE FLIP (once rungBeats.ts re-exports the generated data it
// would compare a re-export to itself); the standing seal afterwards is the untouched
// rung-beats.test.ts D-110 suite staying green over the generated data.
//
// Byte-identical module output is NOT the bar (the hand file uses narr()/says()
// helpers and comments the emitter doesn't imitate): deep-equal over all serializable
// fields + BEHAVIORAL equality for the gate closures is the honest proof. The gate
// domain is complete for the `asked.has(<id>)` form: the empty set + every singleton
// topic-id set (plus a foreign id + one pair as insurance).

import { describe, it, expect } from 'vitest';
import { RUNG_BEATS } from './rungBeats';
import { RUNG_BEATS as RUNG_BEATS_GEN } from './rungBeats.gen';

/** Drop closures (JSON can't carry them) — gates are compared behaviorally below. */
const serializable = (v: unknown): unknown => JSON.parse(JSON.stringify(v));

describe('narrative equivalence — generated rung beats ≡ hand-written registry', () => {
  it('deep-equals over all serializable fields', () => {
    expect(serializable(RUNG_BEATS_GEN)).toEqual(serializable(RUNG_BEATS));
  });

  it('gate closures are present on the same topics and agree over the complete domain', () => {
    const ranks = Object.keys(RUNG_BEATS) as (keyof typeof RUNG_BEATS)[];
    expect(Object.keys(RUNG_BEATS_GEN)).toEqual(ranks);
    for (const rank of ranks) {
      const hand = RUNG_BEATS[rank]!;
      const gen = RUNG_BEATS_GEN[rank]!;
      expect(gen.topics.length).toBe(hand.topics.length);
      const allIds = hand.topics.map((t) => t.id);
      const domain: ReadonlySet<string>[] = [
        new Set<string>(),
        ...allIds.map((id) => new Set([id])),
        new Set(['not-a-real-topic']),
        new Set(allIds.slice(0, 2)),
      ];
      for (let i = 0; i < hand.topics.length; i++) {
        const ht = hand.topics[i]!;
        const gt = gen.topics[i]!;
        expect(gt.gate === undefined, `${rank}/${ht.id} gate presence`).toBe(ht.gate === undefined);
        if (!ht.gate) continue;
        for (const asked of domain) {
          expect(gt.gate!(asked), `${rank}/${ht.id} over {${[...asked].join(',')}}`).toBe(
            ht.gate(asked),
          );
        }
      }
    }
  });
});
