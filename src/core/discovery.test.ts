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
import { DISCOVERIES, type DiscoveryDef } from './content/discoveries';
import { FLAVOR } from './content/flavor.gen';
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

  it('the minAttempts floor: no roll (and no cursor movement) until the floor is paid', () => {
    // Even at chance 1 a floored def cannot pop early — the first `minAttempts` acts only count.
    const FLOORED: DiscoveryDef = {
      ...VISIT_DEF,
      id: 'disc-test-floored',
      minAttempts: 3,
    };
    let s = at('kura');
    for (let i = 1; i <= 3; i++) {
      s = discoveryPass(s, { kind: 'visit' }, [FLOORED]);
      expect(s.discovered).toEqual([]); // still counting, never rolling…
      expect(s.rng.cursors.discovery).toBe(0); // …and the stream never moves during the floor
      expect(s.discoveryProgress[FLOORED.id]).toBe(i);
    }
    s = discoveryPass(s, { kind: 'visit' }, [FLOORED]); // attempt 4 — the first real roll
    expect(s.discovered).toContain(FLOORED.id); // chance 1 latches on it
    expect(s.rng.cursors.discovery).toBe(1);
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

  it('the wired selectors consult the LIVE registry: tap_lacquer hides until its latch', () => {
    // The real content path (could-go-RED against a static list): at the woodlot with the
    // woodcut verb revealed, the lacquer action is ABSENT pre-discovery and appears post-latch.
    const s = at('woodlot-edge');
    const unlocked = { ...s, unlocked: [...s.unlocked, 'verb-woodcut'] } as GameState;
    expect(availableLabours(unlocked).map((o) => o.activity.id)).not.toContain('tap_lacquer');
    const found = { ...unlocked, discovered: ['disc-woodlot-lacquer'] } as GameState;
    expect(availableLabours(found).map((o) => o.activity.id)).toContain('tap_lacquer');
  });
});

describe('the shipped content (disc-woodlot-lacquer) — registry invariants', () => {
  it('every discovery resolves: a real activity, at the discovery node, watched at the same node', () => {
    for (const d of DISCOVERIES) {
      const revealed = getActivity(d.reveals);
      expect(revealed.area).toBe(d.node); // the grown action belongs to the growing node
      expect(d.trigger.chance).toBeGreaterThan(0);
      expect(d.trigger.chance).toBeLessThanOrEqual(1);
      if (d.trigger.kind === 'watch') {
        expect(getActivity(d.trigger.activity).area).toBe(d.node); // attempts happen where you stand
      }
    }
  });

  it('flavor keys and canon text stay in sync (TST1 — one source, pinned)', () => {
    for (const d of DISCOVERIES) {
      if (d.hintKeys !== undefined) {
        expect(d.hintKeys.length).toBe(d.hints.length);
        d.hintKeys.forEach((k, i) => {
          expect(FLAVOR[k as keyof typeof FLAVOR]).toBe(d.hints[i]);
        });
      }
      if (d.lineKey !== undefined) {
        expect(FLAVOR[d.lineKey as keyof typeof FLAVOR]).toBe(d.discoveryLine);
      }
    }
  });

  it('the full player path (done-when): repeat woodcutting discovers the lacquer tree, which then pays', () => {
    // The REAL engine end-to-end under a fixed seed: stand at the woodlot with the woodcut verb,
    // cut until the discovery latches (pity-ramped 12% — certain well inside the act budget),
    // then perform the grown action and watch coin move. RED against a static action list, a
    // broken reduce wiring, or a latch that doesn't gate the selector.
    let s = at('woodlot-edge', 20260707);
    s = { ...s, unlocked: [...s.unlocked, 'verb-woodcut'] } as GameState;
    expect(availableLabours(s).map((o) => o.activity.id)).not.toContain('tap_lacquer');
    let acts = 0;
    while (!s.discovered.includes('disc-woodlot-lacquer') && acts < 200) {
      s = reduce(s, { type: 'do_activity', activityId: 'woodcut_edge' });
      s = { ...s, character: { ...s.character, satiety: 50 } }; // hold satiety (rate never gates legality)
      acts++;
    }
    expect(s.discovered).toContain('disc-woodlot-lacquer');
    expect(acts).toBeGreaterThan(0);
    // the found line landed in the log, permanent narrator prose
    expect(s.log.entries.some((e) => e.text === FLAVOR.lacquerFound)).toBe(true);
    // the hint is gone (latched), and the action now exists and pays
    expect(nodeHint(s, 'woodlot-edge')).toBeNull();
    expect(availableLabours(s).map((o) => o.activity.id)).toContain('tap_lacquer');
    const coinBefore = s.resources.coin ?? 0;
    const after = reduce(s, { type: 'do_activity', activityId: 'tap_lacquer' });
    expect(after.resources.coin ?? 0).toBeGreaterThan(coinBefore);
  });
});

describe('the tightening hint ladder (ADR-146 / ADR-116)', () => {
  it('steps up every DISCOVERY_HINT_STEP attempts and clamps at the last line', () => {
    const s = at('woodlot-edge');
    expect(nodeHint(s, 'woodlot-edge', [WATCH_DEF])?.text).toBe('h0'); // the standing foreshadow
    // Deterministically set progress (no rolls) to probe the ladder at the source-derived steps.
    const withAttempts = (n: number): GameState =>
      ({ ...s, discoveryProgress: { [WATCH_DEF.id]: n } }) as GameState;
    const hintAt = (n: number): string | undefined =>
      nodeHint(withAttempts(n), 'woodlot-edge', [WATCH_DEF])?.text;
    expect(hintAt(DISCOVERY_HINT_STEP - 1)).toBe('h0');
    expect(hintAt(DISCOVERY_HINT_STEP)).toBe('h1');
    expect(hintAt(DISCOVERY_HINT_STEP * 2)).toBe('h2');
    expect(hintAt(DISCOVERY_HINT_STEP * 50)).toBe('h2');
  });

  it('goes silent once discovered, and for other nodes', () => {
    const s = at('woodlot-edge');
    const found = { ...s, discovered: [WATCH_DEF.id] } as GameState;
    expect(nodeHint(found, 'woodlot-edge', [WATCH_DEF])).toBeNull();
    expect(nodeHint(s, 'kura', [WATCH_DEF])).toBeNull();
  });
});

describe('reduce wiring (the pass actually fires on the real intents)', () => {
  it('a non-qualifying intent never rolls the discovery stream (no phantom rolls)', () => {
    // `rest` matches no trigger, and the fresh state stands at the kura (no discovery there):
    // the cursor must not move — a wasted roll would silently reshuffle every later draw.
    const s = createInitialState(1);
    const s2 = reduce(s, { type: 'rest' });
    expect(s2.rng.cursors.discovery).toBe(0);
    expect(s2.discovered).toEqual([]);
  });
});
