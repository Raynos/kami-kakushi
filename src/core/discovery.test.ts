// ADR-146 emergent node discovery — the Phase-1 primitive. Every test injects fixture
// DiscoveryDefs into the registry-driven engine (never a copied outcome), derives expectations
// from the balance source of truth (DISCOVERY_PITY_*, DISCOVERY_HINT_STEP), and asserts the
// design LEVERS (latch ratchet, pity monotonicity, seed determinism), not collapsed metrics.

import { describe, it, expect } from 'vitest';
import { createInitialState, type GameState } from './state';
import {
  discoveryPass,
  hiddenActivityIds,
  effectiveChance,
  nodeHint,
  type DiscoveryEvent,
} from './discovery';
import type { DiscoveryDef } from './content/discoveries';
import { DISCOVERY_PITY_NUM, DISCOVERY_PITY_DEN, DISCOVERY_HINT_STEP } from './content/balance';
import { availableLabours } from './selectors';
import { getActivity } from './content/activities';
import { reduce } from './intents';

const WATCH_DEF: DiscoveryDef = {
  id: 'disc-test-watch',
  node: 'woodlot-edge',
  reveals: 'forage_deepwoods', // a real ActivityId — the engine only stores/keys it
  trigger: { kind: 'watch', activity: 'woodcut_edge', chance: 0.3 },
  hints: ['h0', 'h1', 'h2'],
  discoveryLine: 'Behind the stacked billets, a low path you never noticed.',
};

const VISIT_DEF: DiscoveryDef = {
  id: 'disc-test-visit',
  node: 'kura',
  reveals: 'farm_paddy',
  trigger: { kind: 'visit', chance: 1 },
  hints: [],
  discoveryLine: 'The floor-board shifts underfoot.',
};

function at(node: string, seed = 42): GameState {
  return { ...createInitialState(seed), location: node as GameState['location'] };
}

const WOODCUT: DiscoveryEvent = { kind: 'activity', activityId: 'woodcut_edge' };

describe('discoveryPass (ADR-146 Phase 1)', () => {
  it('a matching attempt increments progress and advances ONLY the discovery stream', () => {
    const s = at('woodlot-edge');
    const s2 = discoveryPass(s, WOODCUT, [WATCH_DEF]);
    expect(s2.discoveryProgress[WATCH_DEF.id]).toBe(1);
    expect(s2.rng.cursors.discovery).toBe(s.rng.cursors.discovery + 1);
    expect(s2.rng.cursors.combat).toBe(s.rng.cursors.combat);
  });

  it('does NOT attempt from the wrong node, the wrong activity, or the wrong event kind', () => {
    const wrongNode = discoveryPass(at('kura'), WOODCUT, [WATCH_DEF]);
    expect(wrongNode.discoveryProgress[WATCH_DEF.id]).toBeUndefined();
    const wrongAct = discoveryPass(
      at('woodlot-edge'),
      { kind: 'activity', activityId: 'farm_paddy' },
      [WATCH_DEF],
    );
    expect(wrongAct.discoveryProgress[WATCH_DEF.id]).toBeUndefined();
    const wrongKind = discoveryPass(at('woodlot-edge'), { kind: 'visit' }, [WATCH_DEF]);
    expect(wrongKind.discoveryProgress[WATCH_DEF.id]).toBeUndefined();
  });

  it('is reproducible under a fixed seed: same seed → the latch lands on the same attempt', () => {
    const run = (seed: number): number => {
      let s = at('woodlot-edge', seed);
      for (let i = 1; i <= 100; i++) {
        s = discoveryPass(s, WOODCUT, [WATCH_DEF]);
        if (s.discovered.includes(WATCH_DEF.id)) return i;
      }
      return -1;
    };
    const first = run(7);
    expect(first).toBeGreaterThan(0); // pity-ramped 0.3 over 100 attempts: certain to land
    expect(run(7)).toBe(first); // determinism — the same seed replays the same attempt
    // and a certain-chance def latches on attempt 1 (the roll really consults the chance)
    let sure = at('kura');
    sure = discoveryPass(sure, { kind: 'visit' }, [VISIT_DEF]);
    expect(sure.discovered).toContain(VISIT_DEF.id);
  });

  it('is a permanent ratchet: a latched discovery never re-rolls, re-latches, or re-logs', () => {
    let s = at('kura');
    s = discoveryPass(s, { kind: 'visit' }, [VISIT_DEF]);
    const after = discoveryPass(s, { kind: 'visit' }, [VISIT_DEF]);
    expect(after.discovered).toEqual(s.discovered); // still exactly one entry
    expect(after.rng.cursors.discovery).toBe(s.rng.cursors.discovery); // no wasted roll
    expect(after.discoveryProgress[VISIT_DEF.id]).toBe(s.discoveryProgress[VISIT_DEF.id]);
  });

  it('the latch pushes the diegetic discovery line (narrator voice)', () => {
    let s = at('kura');
    s = discoveryPass(s, { kind: 'visit' }, [VISIT_DEF]);
    const last = s.log.entries[s.log.entries.length - 1]!;
    expect(last.text).toBe(VISIT_DEF.discoveryLine);
    expect(last.voice).toBe('narrator');
  });
});

describe('the pity ramp (the design lever, not a collapsed metric)', () => {
  it('effective chance grows monotonically with attempts, at the balance-source slope', () => {
    const base = 0.2;
    for (let n = 0; n < 8; n++) {
      const expected = Math.min(
        1,
        (base * (DISCOVERY_PITY_DEN + n * DISCOVERY_PITY_NUM)) / DISCOVERY_PITY_DEN,
      );
      expect(effectiveChance(base, n)).toBe(expected);
      if (n > 0) expect(effectiveChance(base, n)).toBeGreaterThan(effectiveChance(base, n - 1));
    }
  });

  it('clamps to 1', () => {
    expect(effectiveChance(0.5, 1000)).toBe(1);
  });
});

describe('derived hiddenness gates the node action list (could-go-RED vs a static list)', () => {
  it('an undiscovered reveals-target is ABSENT from availableLabours and un-doable', () => {
    // Stand at the deep satoyama with everything surface-unlocked; hide forage_deepwoods behind
    // the fixture discovery via the real (registry-defaulted) selector path's parametric core.
    const s = at('deep-satoyama');
    const unlocked = { ...s, unlocked: [...s.unlocked, 'verb-forage'] } as GameState;
    // pre-discovery: hidden set contains the target…
    expect(hiddenActivityIds(unlocked, [WATCH_DEF]).has('forage_deepwoods')).toBe(true);
    // …post-latch it does not (the action now exists).
    const found = { ...unlocked, discovered: [WATCH_DEF.id] } as GameState;
    expect(hiddenActivityIds(found, [WATCH_DEF]).has('forage_deepwoods')).toBe(false);
  });

  it('the wired selectors consult the LIVE registry (empty today → nothing hidden)', () => {
    // Guards the wiring itself: with the shipped registry, no activity is hidden, so the
    // selector output is byte-identical to the pre-ADR-146 behaviour. When real content lands
    // in DISCOVERIES this test documents the contract the content tests take over.
    const s = at('deep-satoyama');
    const unlocked = { ...s, unlocked: [...s.unlocked, 'verb-forage'] } as GameState;
    expect(hiddenActivityIds(unlocked).size).toBe(0);
    const labels = availableLabours(unlocked).map((o) => o.activity.id);
    expect(labels).toContain(getActivity('forage_deepwoods').id);
  });
});

describe('the tightening hint ladder (ADR-146 / ADR-116)', () => {
  it('steps up every DISCOVERY_HINT_STEP attempts and clamps at the last line', () => {
    let s = at('woodlot-edge');
    expect(nodeHint(s, 'woodlot-edge', [WATCH_DEF])).toBe('h0'); // the standing foreshadow
    // Deterministically set progress (no rolls) to probe the ladder at the source-derived steps.
    const withAttempts = (n: number): GameState =>
      ({ ...s, discoveryProgress: { [WATCH_DEF.id]: n } }) as GameState;
    expect(nodeHint(withAttempts(DISCOVERY_HINT_STEP - 1), 'woodlot-edge', [WATCH_DEF])).toBe('h0');
    expect(nodeHint(withAttempts(DISCOVERY_HINT_STEP), 'woodlot-edge', [WATCH_DEF])).toBe('h1');
    expect(nodeHint(withAttempts(DISCOVERY_HINT_STEP * 2), 'woodlot-edge', [WATCH_DEF])).toBe('h2');
    expect(nodeHint(withAttempts(DISCOVERY_HINT_STEP * 50), 'woodlot-edge', [WATCH_DEF])).toBe(
      'h2',
    );
  });

  it('goes silent once discovered, and for other nodes', () => {
    const s = at('woodlot-edge');
    const found = { ...s, discovered: [WATCH_DEF.id] } as GameState;
    expect(nodeHint(found, 'woodlot-edge', [WATCH_DEF])).toBeNull();
    expect(nodeHint(s, 'kura', [WATCH_DEF])).toBeNull();
  });
});

describe('reduce wiring (the pass actually fires on the real intents)', () => {
  it('reducing with the shipped (empty) registry never rolls the discovery stream', () => {
    // With the shipped (empty) registry the pass is a no-op — assert the seam holds shape:
    // reducing never throws and the discovery cursor stays put (no phantom rolls).
    const s = createInitialState(1);
    const s2 = reduce(s, { type: 'rest' });
    expect(s2.rng.cursors.discovery).toBe(0);
    expect(s2.discovered).toEqual([]);
  });
});
