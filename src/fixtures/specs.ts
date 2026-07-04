// Scenario-save SPECS (F6) — the single source the generator, the round-trip test, and the
// DEV panel all read. Each spec is a NAMED waypoint reached by driving the REAL engine through
// REAL intents from a fixed seed — never hand-authored state, never a field poke. The generator
// (src/scripts/gen-fixtures.ts) runs `play` from createInitialState(seed), asserts `expect`, and
// writes the resulting envelope to saves/<name>.json, so `npm run fixtures:regen` rebuilds the
// whole library from scratch after any balance retune / schema bump / content rename.
//
// Pure-core boundary: this imports ONLY the core's public index (like src/sim/). Nothing in
// src/core imports fixtures. Deliberately NO import.meta.glob here (that lives in index.ts) so the
// tsx generator can run this module outside Vite.

import {
  createInitialState,
  reduce,
  hasFlag,
  ascensionAvailable,
  estateGrade,
  applyGrindFight,
  focusedOptimalIntent,
  getMob,
  balance,
  type GameState,
  type Intent,
  type MobId,
} from '../core';

export interface FixtureSpec {
  /** 'fresh-R3-pre-wolf' — the file stem, the DEV-panel label, and the `__qa` key (one namespace). */
  readonly name: string;
  /** The one-line panel description. */
  readonly blurb: string;
  /** Fixed per fixture ⇒ regen determinism (the RNG is seed + integer cursors in GameState). */
  readonly seed: number;
  /** Drive from `createInitialState(seed)` to the waypoint via REAL intents (reduce) — the shared
   *  `drive` loop below, a stop predicate, and `applyGrindFight` only where t0-arc uses it. NO state
   *  surgery: no field pokes, no forced flags. */
  readonly play: (s0: GameState) => GameState;
  /** Waypoint truths, asserted at GEN time AND at TEST time. Written on STABLE invariants (rung id,
   *  location, flag booleans, band names, predicate results) — NOT exact numerics — so a routine
   *  balance tweak doesn't cry wolf. Throws on a miss. */
  readonly expect: (s: GameState) => void;
}

/** Tiny throw-on-miss assert so `expect` reads as a list of waypoint truths. */
function must(cond: boolean, msg: string): void {
  if (!cond) throw new Error(msg);
}

// ── the shared drive loop ──────────────────────────────────────────────────────────────────────
// A faithful mirror of `t0-arc.test.ts`'s `playToAscension` (the proven full-arc auto-pilot): the
// shared `focusedOptimalIntent` policy, plus the one sanctioned non-intent helper (`applyGrindFight`
// for the R3 `combat-blooded` gate-watch duty), and the ascend gate. The ONLY addition is a `stop`
// predicate that PEEKS the next step and halts BEFORE performing it — this is how a spec stops one
// click short of a scripted beat (e.g. `pre-wolf` stops before `face_wolf`).

/** What the drive loop is about to do next — handed to `stop` so a spec can halt one click short. */
export type NextStep =
  | { readonly kind: 'ascend' }
  | { readonly kind: 'grind'; readonly mobId: MobId }
  | { readonly kind: 'intent'; readonly intent: Intent };

export type StopFn = (s: GameState, next: NextStep) => boolean;

/** Drive the real engine from `s0` (after the cold-open `open_eyes`, exactly as t0-arc does) until
 *  `stop` fires or the arc terminates. Returns the state AT the stop (before the stopped action). */
export function drive(s0: GameState, stop: StopFn): GameState {
  let s = reduce(s0, { type: 'open_eyes' });
  let guard = 0;
  while (s.tier === 0 && guard++ < 1_000_000) {
    let next: NextStep;
    if (ascensionAvailable(s)) {
      next = { kind: 'ascend' };
    } else if (s.rung === 'R3' && !hasFlag(s, 'combat-blooded')) {
      // R3→R4 needs real combat duty, not just meter — one grind fight sets `combat-blooded`.
      next = { kind: 'grind', mobId: 'monkey' };
    } else {
      const intent = focusedOptimalIntent(s);
      if (!intent) return s; // a genuine dead-end — the spec's `expect` catches a missed waypoint
      next = { kind: 'intent', intent };
    }
    if (stop(s, next)) return s;
    if (next.kind === 'ascend') return reduce(s, { type: 'ascend' });
    s = next.kind === 'grind' ? applyGrindFight(s, next.mobId) : reduce(s, next.intent);
  }
  return s;
}

// ── the v1 scenario set (§2.3) — Ph1 ships the two full-arc-policy waypoints ────────────────────
// The set is deliberately small; growth comes from capture graduation + persona bots, not
// speculation. The seed is the t0-arc seed (proven to climb the whole ladder R0…R7).
const T0_ARC_SEED = 20260626;

export const FIXTURE_SPECS: readonly FixtureSpec[] = [
  {
    name: 'fresh-R3-pre-wolf',
    // The wolf is faced AT R2 (the fight that OPENS R3); the blurb states it plainly (Risk #7).
    blurb: 'R2, wolf-ready — the fight that opens R3, stopped one click short of facing the wolf.',
    seed: T0_ARC_SEED,
    play: (s0) =>
      drive(s0, (_s, next) => next.kind === 'intent' && next.intent.type === 'face_wolf'),
    expect: (s) => {
      must(s.rung === 'R2', `expected rung R2, got ${s.rung}`);
      // the scripted wolf's node (== the kura) — derived, not a magic string.
      const wolfNode = getMob('wolf_scripted').area;
      must(
        s.location === wolfNode,
        `expected to stand at the wolf node ${wolfNode}, got ${s.location}`,
      );
      must(
        !hasFlag(s, 'first-fight-survived'),
        'the wolf should be unfought (first-fight-survived false)',
      );
      must(
        s.rungMeter >= balance.rungThreshold('R2'),
        'the R2 rung meter should be full (wolf-ready)',
      );
    },
  },
  {
    name: 'pre-ascension',
    blurb:
      'The full T0 arc climbed to the ascension threshold — Estate EXCELLENT, capstone earned, before the ceremony.',
    seed: T0_ARC_SEED,
    play: (s0) => drive(s0, (_s, next) => next.kind === 'ascend'),
    expect: (s) => {
      must(s.tier === 0, `expected tier 0 (pre-ceremony), got ${s.tier}`);
      must(ascensionAvailable(s), 'ascension should be available at this waypoint');
      must(estateGrade(s) === 'EXCELLENT', `expected Estate EXCELLENT, got ${estateGrade(s)}`);
      must(hasFlag(s, 't0-capstone'), 'the R7 capstone flag should be set');
    },
  },
];

export function getSpec(name: string): FixtureSpec | undefined {
  return FIXTURE_SPECS.find((spec) => spec.name === name);
}

/** Create the seeded initial state + drive it to the waypoint, asserting `expect` on the way out.
 *  Shared by the generator (GEN-time assert) and any test that wants the live state (not the JSON). */
export function buildFixtureState(spec: FixtureSpec): GameState {
  const s = spec.play(createInitialState(spec.seed));
  spec.expect(s); // fail loudly if a spec no longer reaches its own waypoint
  return s;
}
