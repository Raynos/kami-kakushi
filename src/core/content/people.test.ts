// Vendors-as-people (D-114) + location-flavor routing (D-116) — pure-core tests. Fixtures derive
// from the source of truth (the PEOPLE registry, getNode's blurb, each person's own placeGate /
// presence predicate), never copied literals, so a mis-gated selector or a re-channelled move line
// fails RED.

import { describe, it, expect } from 'vitest';
import { createInitialState, type GameState } from '../state';
import { reduce } from '../intents';
import { peopleHere } from '../selectors';
import { getPerson } from './people';
import { getNode } from './map';

function awakeAt(location: string, extraUnlocked: string[] = []): GameState {
  const base = createInitialState(1);
  return {
    ...base,
    location,
    flags: { ...base.flags, awake: true },
    unlocked: [...base.unlocked, ...extraUnlocked],
  };
}

describe('peopleHere (D-114) — the spatial "who\'s here" selector, mirroring foesHere', () => {
  it('returns the pedlar at HIS node once present, and NOT at any other node', () => {
    const pedlar = getPerson('pedlar'); // source of truth: his node + presence gate
    // stand at the pedlar's node with his presence satisfied → he is present.
    const present = awakeAt(pedlar.node, ['panel-estate']);
    expect(pedlar.presence!(present)).toBe(true); // the coupling this test rides on
    expect(peopleHere(present).map((p) => p.id)).toContain('pedlar');

    // same unlocks, but standing on the KURA floor (not his node) → spatial: he is absent.
    const elsewhere = awakeAt('kura', ['panel-estate']);
    expect(elsewhere.location).not.toBe(pedlar.node);
    expect(peopleHere(elsewhere).map((p) => p.id)).not.toContain('pedlar');
  });

  it('respects PRESENCE — the pedlar is absent until his presence predicate holds', () => {
    const pedlar = getPerson('pedlar');
    const notYet = awakeAt(pedlar.node); // at his node, but presence gate NOT yet satisfied
    expect(pedlar.presence!(notYet)).toBe(false); // documents the coupling (else the test is moot)
    expect(peopleHere(notYet).map((p) => p.id)).not.toContain('pedlar');
  });

  it('respects the PLACE-GATE — the smith is absent until his placeGate surface unlocks', () => {
    const smith = getPerson('smith');
    const gate = smith.placeGate!; // source of truth: the surface his place is gated on
    expect(gate).toBeDefined();

    // at the smith's node, before the smithy is yours → he is NOT reachable.
    const before = awakeAt(smith.node);
    expect(before.unlocked).not.toContain(gate);
    expect(peopleHere(before).map((p) => p.id)).not.toContain('smith');

    // reach/build the place (unlock the gate) → the smith appears (earned + sited).
    const after = awakeAt(smith.node, [gate]);
    expect(peopleHere(after).map((p) => p.id)).toContain('smith');
  });
});

describe('D-116 — location flavor routes to a transient Now line, never the Story log', () => {
  it('move_to emits the destination blurb as an EPHEMERAL narration entry (the Now channel)', () => {
    // stand at the kura with the gate open, then walk to the forecourt.
    const dest = 'gate-forecourt';
    const s0 = awakeAt('kura', [getNode(dest).revealFlag!]);
    const s1 = reduce(s0, { type: 'move_to', to: dest });
    expect(s1.location).toBe(dest); // the move actually happened

    const blurb = getNode(dest).blurb; // source of truth for the arrival line's text
    const blurbEntries = s1.log.entries.filter((e) => e.text === blurb);
    expect(blurbEntries.length).toBeGreaterThan(0); // an arrival line WAS emitted
    // …and EVERY such entry is a fleeting Now line, never a permanent Story entry. Could-go-RED:
    // the old code emitted `{ channel: 'narration' }` with no `ephemeral`, which fails here.
    for (const e of blurbEntries) {
      expect(e.ephemeral).toBe(true);
      expect(e.channel).toBe('narration');
    }
  });
});
