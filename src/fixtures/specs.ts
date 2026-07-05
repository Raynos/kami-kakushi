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
  nextHopToward,
  getMob,
  getWeapon,
  durabilityBand,
  skillLevel,
  promotionReady,
  pendingPromotionTarget,
  phaseOf,
  balance,
  ESTATE_STAGES,
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

/** Walk to `node` via REAL `move_to` hops along the revealed graph (the same BFS the DEV panel's
 *  walk-to uses). A no-op if already there or unreachable (danger-gated / un-revealed). */
export function walkTo(s: GameState, node: string): GameState {
  let guard = 0;
  while (s.location !== node && guard++ < 64) {
    const hop = nextHopToward(s.location, node, new Set(s.unlocked));
    if (!hop) break;
    s = reduce(s, { type: 'move_to', to: hop });
  }
  return s;
}

/** The equipped weapon's current durability band name (Pristine / Worn / Battered / Broken). */
function bandName(s: GameState): string {
  return durabilityBand(s.weaponDurability, getWeapon(s.equippedWeapon).durabilityMax).name;
}

/** Walk to `mobId`'s node, then grind REAL fights until `stop(s)` or a guard trips. Repairs a worn
 *  blade when wood allows (a real intent) so the loop keeps swinging — mirrors the auto-combat rule. */
export function grindUntil(s: GameState, mobId: MobId, stop: (s: GameState) => boolean): GameState {
  s = walkTo(s, getMob(mobId).area);
  let guard = 0;
  while (!stop(s) && guard++ < 200) {
    if ((s.resources.wood ?? 0) >= balance.REPAIR_WOOD_COST && bandName(s) !== 'Pristine') {
      s = reduce(s, { type: 'repair_weapon' });
    }
    s = applyGrindFight(s, mobId);
  }
  return s;
}

/** The "rich" bar — 2× the dearest estate-stage cost (no magic number; §5.3). */
const WEALTHY_COIN_THRESHOLD = 2 * Math.max(...ESTATE_STAGES.map((e) => e.coinCost));

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
  {
    name: 'rung-beat-ready',
    blurb:
      'The first rung-up story beat is READY — stopped on the trigger affordance, before the VN modal.',
    seed: T0_ARC_SEED,
    play: (s0) =>
      drive(s0, (_s, next) => next.kind === 'intent' && next.intent.type === 'begin_rung_beat'),
    expect: (s) => {
      must(promotionReady(s), 'a rung promotion should be ready to trigger');
      must(
        s.rungBeat === null,
        'the rung beat should NOT yet be begun (stopped before begin_rung_beat)',
      );
      must(pendingPromotionTarget(s) !== null, 'a pending promotion target should exist');
    },
  },
  {
    name: 'post-loss-broke',
    blurb:
      'The post-loss slump (D-113): HP at the floor, carried rice bled in the rout, the kura hoard sheltered — sansai on hand so the cook-to-heal answer (D-076) is one press away.',
    seed: T0_ARC_SEED,
    // Drive to R3 (a lvl-1 gate-watch never grinds combat, so it truly LOSES), earn the
    // conditioning gate by hauling (real labour) so the satoyama opens, forage enough sansai
    // to cook, bank some rice in the kura (so the shelter is legible), then take the
    // documented rout against the monkey. The sansai makes the D-076 recovery loop (cook →
    // heal) drivable from this waypoint through visible controls alone — the journey lane
    // (fable-2026-07-05-desktop-journey-e2e P2) boots it and presses Cook.
    play: (s0) => {
      let s = drive(s0, (st) => st.rung === 'R3');
      s = walkTo(s, 'gate-forecourt');
      let guard = 0;
      while (skillLevel(s, 'conditioning') < balance.CONDITIONING_GATE_LEVEL && guard++ < 200) {
        s = reduce(s, { type: 'do_activity', activityId: 'haul_stores' });
      }
      s = walkTo(s, 'near-satoyama');
      guard = 0;
      while ((s.resources.sansai ?? 0) < balance.COOK_SANSAI_COST && guard++ < 10) {
        s = reduce(s, { type: 'do_activity', activityId: 'forage_satoyama' });
      }
      s = walkTo(s, 'kura');
      s = reduce(s, { type: 'deposit', resource: 'rice' }); // shelter a slice under the kura cap
      s = walkTo(s, getMob('monkey').area);
      return applyGrindFight(s, 'monkey'); // the lvl-1 MC is beaten — the setback fires
    },
    expect: (s) => {
      must(
        s.character.hp === balance.SETBACK_HP,
        `expected HP at the setback floor ${balance.SETBACK_HP}, got ${s.character.hp}`,
      );
      must(
        (s.banked.rice ?? 0) > 0,
        'the kura should shelter banked rice (the rout cannot touch it)',
      );
      must(
        (s.resources.rice ?? 0) > 0,
        'carried rice should remain (bled by a fraction, not zeroed)',
      );
      must(
        (s.resources.sansai ?? 0) >= balance.COOK_SANSAI_COST,
        'sansai on hand — the cook-to-heal answer must be pressable from this waypoint',
      );
    },
  },
  {
    name: 'worn-weapon-no-wood',
    blurb:
      'A Battered blade with no wood to mend it — the repair-loop bind (win-rate cliff + the repair CTA).',
    seed: T0_ARC_SEED,
    // R4, not R3: `verb-repair` is an R4 unlock BY DESIGN (ranks.ts — repair waits for R4),
    // so the UI-layer bind — a Battered blade, a visible Repair CTA, and no wood to feed
    // it — only exists from R4 on. (At R3 the reducer can repair but no player can; the
    // journey lane drives visible controls only, so the waypoint moved up one rung.)
    play: (s0) => {
      const s = drive(s0, (st) => st.rung === 'R4');
      return grindUntil(s, 'monkey', (st) => bandName(st) === 'Battered');
    },
    expect: (s) => {
      must(bandName(s) === 'Battered', `expected a Battered weapon, got ${bandName(s)}`);
      must(
        (s.resources.wood ?? 0) < balance.REPAIR_WOOD_COST,
        `expected carried wood < ${balance.REPAIR_WOOD_COST} (can't repair), got ${s.resources.wood ?? 0}`,
      );
      must(s.unlocked.includes('verb-repair'), 'the Repair CTA must be revealed (R4 unlock)');
    },
  },
  {
    name: 'wealthy-idler',
    blurb:
      'Phase 2, coffers full — rice sold and coin banked past 2× the dearest estate stage; idle at the kura.',
    seed: T0_ARC_SEED,
    // Full arc to the Phase-2 threshold, then run the coin faucet: sell the rice hoard and bank the
    // coin until rich. Idles at the kura (F32 resets in-flight automation on every load — genuinely idle).
    play: (s0) => {
      let s = walkTo(
        drive(s0, (_st, next) => next.kind === 'ascend'),
        'kura',
      );
      let guard = 0;
      while ((s.banked.coin ?? 0) < WEALTHY_COIN_THRESHOLD && guard++ < 30) {
        if ((s.resources.rice ?? 0) > 0) s = reduce(s, { type: 'sell_rice' });
        if ((s.resources.coin ?? 0) <= 0) break;
        s = reduce(s, { type: 'deposit', resource: 'coin' });
      }
      return s;
    },
    expect: (s) => {
      must(phaseOf(s) === 2, `expected Phase 2, got phase ${phaseOf(s)}`);
      must(s.location === 'kura', `expected to idle at the kura, got ${s.location}`);
      must(
        (s.banked.coin ?? 0) >= WEALTHY_COIN_THRESHOLD,
        `expected banked coin >= ${WEALTHY_COIN_THRESHOLD}, got ${s.banked.coin ?? 0}`,
      );
    },
  },
  {
    name: 'rice-at-gate',
    blurb:
      'R3 with the rice hoard carried to the forecourt — Tokubei one press away (the D-114 talk-to-open market loop).',
    seed: T0_ARC_SEED,
    // The market-loop journey's start (fable-2026-07-05-desktop-journey-e2e P2): standing at
    // the gate where the pedlar keeps his ground, rice on the back, nothing yet sold.
    play: (s0) =>
      walkTo(
        drive(s0, (st) => st.rung === 'R3'),
        'gate-forecourt',
      ),
    expect: (s) => {
      must(s.location === 'gate-forecourt', `expected the gate-forecourt, got ${s.location}`);
      must((s.resources.rice ?? 0) > 0, 'carried rice to sell — the loop needs stock');
      must(
        s.unlocked.includes('panel-estate'),
        'panel-estate must be revealed (Tokubei stands the gate on it)',
      );
    },
  },
  {
    name: 'at-kura-with-coin',
    blurb: 'R3, standing in the kura with sale-coin in the sleeve — the deposit one press away.',
    seed: T0_ARC_SEED,
    // The kura-deposit journey's start (P2): rice sold at the gate, the coin walked home.
    play: (s0) => {
      let s = walkTo(
        drive(s0, (st) => st.rung === 'R3'),
        'gate-forecourt',
      );
      s = reduce(s, { type: 'sell_rice' });
      return walkTo(s, 'kura');
    },
    expect: (s) => {
      must(s.location === 'kura', `expected the kura, got ${s.location}`);
      must((s.resources.coin ?? 0) > 0, 'carried coin — the deposit needs something to store');
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
