// Scenario-save SPECS (FB-6) — the single source the generator, the round-trip test, and the
// DEV panel all read. Each spec is a NAMED waypoint reached by driving the REAL engine through
// REAL intents from a fixed seed — never hand-authored state, never a field poke. The generator
// (src/scripts/gen-fixtures.ts) runs `play` from createInitialState(seed), asserts `expect`, and
// writes the resulting envelope to saves/<name>.json, so `pnpm run fixtures:regen` rebuilds the
// whole library from scratch after any balance retune / schema bump / content rename.
//
// Pure-core boundary: this imports ONLY the core's public index (like src/sim/). Nothing in
// src/core imports fixtures. Deliberately NO import.meta.glob here (that lives in index.ts) so the
// tsx generator can run this module outside Vite.

import {
  createInitialState,
  reduce,
  sceneById,
  hasFlag,
  ascensionAvailable,
  estateGrade,
  applyGrindFight,
  focusedOptimalIntent,
  nextHopToward,
  getActivity,
  getMob,
  getWeapon,
  durabilityBand,
  isMarketDay,
  promotionReady,
  pendingPromotionTarget,
  phaseOf,
  balance,
  ESTATE_STAGES,
  RANKS,
  introActive,
  introSceneAt,
  INTRO_SCENE_COUNT,
  resolveNightStage,
  nightRoundById,
  type GameState,
  type Intent,
  type MobId,
  remainingRequirements,
} from '../core';

export interface FixtureSpec {
  /** 'fresh-R3-pre-wolf' — the file stem, the DEV-panel label, and the `__qa` key (one namespace). */
  readonly name: string;
  /** The one-line panel description. */
  readonly blurb: string;
  /** The Scenarios-pane section header this fixture sits under. Specs sharing a `group` render as one
   *  block; groups (and the specs within them) are AUTHORED earliest-in-game first, so the pane sorts
   *  itself by progression (§ FB-6 grouping) with no extra sort key. */
  readonly group: string;
  /** DEV-only MECHANICAL scenarios (the R0–R7 rung-start set) — loadable by name (the rung buttons +
   *  `?fixture=rung-RX` route here) but HIDDEN from the Scenarios pane list, which stays the
   *  hand-authored playtest waypoints. */
  readonly hidden?: boolean;
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
// click short of a scripted beat (e.g. `pre-wolf` stops before the night-round wolf stage).

/** What the drive loop is about to do next — handed to `stop` so a spec can halt one click short. */
export type NextStep =
  | { readonly kind: 'ascend' }
  | { readonly kind: 'grind'; readonly mobId: MobId }
  | { readonly kind: 'night-stage'; readonly foe: MobId }
  | { readonly kind: 'intent'; readonly intent: Intent };

export type StopFn = (s: GameState, next: NextStep) => boolean;

/** Drive the real engine from `s0` (after the cold-open `open_eyes`, exactly as t0-arc does) until
 *  `stop` fires or the arc terminates. Returns the state AT the stop (before the stopped action).
 *  G4 cutover: the R3 `combat-blooded` monkey-grind hack is GONE (the new R3 opens on the on-rails
 *  NIGHT ROUND, resolved stage-by-stage through the engine like the app loop / t0-arc.test.ts), and
 *  the beatless silent rungs (R2, R5) promote through `focusedOptimalIntent`'s own path. */
export function drive(s0: GameState, stop: StopFn): GameState {
  let s = reduce(s0, { type: 'open_eyes' });
  let guard = 0;
  while (s.tier === 0 && guard++ < 3_000_000) {
    if (s.roundState !== null) {
      // the R3 grain-watch night round — resolve its current stage through the engine (no intent).
      const def = nightRoundById(s.roundState.roundId)!;
      const foe = def.stages[s.roundState.stage]?.foe;
      if (foe && stop(s, { kind: 'night-stage', foe })) return s;
      s = resolveNightStage(s, def);
      continue;
    }
    let next: NextStep;
    if (ascensionAvailable(s)) {
      next = { kind: 'ascend' };
    } else {
      const intent = focusedOptimalIntent(s);
      if (!intent) return s; // a genuine dead-end — the spec's `expect` catches a missed waypoint
      next = { kind: 'intent', intent };
    }
    if (stop(s, next)) return s;
    if (next.kind === 'ascend') return reduce(s, { type: 'ascend' });
    s = reduce(s, next.intent);
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

// ── Scenarios-pane section headers (authored earliest-in-game first) ─────────────────────────────
const G_FRESH = 'Fresh start';
const G_RUNG_STARTS = 'Rung starts (R0–R7) · DEV';
const G_EARLY = 'Early climb (R1–R2)';
const G_ECONOMY = 'Economy loop (R3)';
const G_SETBACKS = 'Setbacks (R3–R4)';
const G_ENDGAME = 'Endgame (R7 → Phase 2)';

/** Section order for the DEV Scenarios pane — earliest-in-game first. The single source both the
 *  pane's grouping and the `qa.fixtures()` sort read, so a new group slots in one place. A fixture
 *  whose group is absent here sorts last (defensive; shouldn't happen). */
export const FIXTURE_GROUP_ORDER: readonly string[] = [
  G_FRESH,
  G_RUNG_STARTS,
  G_EARLY,
  G_ECONOMY,
  G_SETBACKS,
  G_ENDGAME,
];

// ── the "post-cold-open" fresh start (human ask, 2026-07-07) ─────────────────────────────────────
// New game with the cold open already ANSWERED: `open_eyes`, then walk each intro scene — ASK the
// first hub topic on every scene that has one (exactly the two NPC scenes, Sōan then Genemon, so
// "one question to each character"), then close the scene on its first option. Lands at the first
// tick of the main game with the intro cursor done — the exact state a player reaches on finishing
// the cold open, minus the reading. Driven through REAL intents only (no state surgery).
const POST_COLD_OPEN_SPEC: FixtureSpec = {
  name: 'post-cold-open',
  blurb:
    'New game, cold open already answered — Sōan and Genemon each asked one question, then dropped straight into the main game.',
  group: G_FRESH,
  seed: T0_ARC_SEED,
  play: (s0) => {
    let s = reduce(s0, { type: 'open_eyes' });
    let guard = 0;
    while (introActive(s.introBeat) && guard++ < 32) {
      const scene = introSceneAt(s.introBeat);
      if (!scene) break;
      // HD-37: three acts again — on each scene with a hub (Sōan, Genemon), ask up to
      // two questions (exploration is free), then decide; the dream act is decide-only.
      for (const topic of scene.topics.slice(0, 2)) {
        s = reduce(s, { type: 'ask_topic', topicId: topic.id });
      }
      const opt = scene.decision.options[0];
      if (!opt) break;
      s = reduce(s, { type: 'choose_intro', optionId: opt.id });
    }
    return s;
  },
  expect: (s) => {
    must(hasFlag(s, 'awake'), 'the player should be awake (open_eyes fired)');
    must(
      !introActive(s.introBeat) && s.introBeat === INTRO_SCENE_COUNT,
      `the cold open should be finished (introBeat at the done cursor ${INTRO_SCENE_COUNT}, got ${s.introBeat})`,
    );
    must(
      s.askedTopics.length >= 2,
      `expected at least two asked topics (the sickroom hub grilled), got ${s.askedTopics.length}`,
    );
  },
};

// ── the R0–R7 rung-start scenarios (human ask, 2026-07-07) ───────────────────────────────────────
// One mechanical waypoint per rung: drive the REAL climb from the cold open and stop at the FIRST
// tick the run reaches that rung — so the DEV panel's rung buttons land in a COHERENT run (real
// unlocks/panels/resources for that rung) instead of the applyPromotion-only state the old `toRung`
// teleport left behind. HIDDEN from the pane (mechanical, not a playtest waypoint); loaded by name.
const RUNG_START_SPECS: readonly FixtureSpec[] = RANKS.map((r) => ({
  name: `rung-${r.id}`,
  blurb: `Mechanical DEV start — the real climb driven to the first tick at ${r.id} ${r.kanji} (${r.title}).`,
  group: G_RUNG_STARTS,
  hidden: true,
  seed: T0_ARC_SEED,
  play: (s0: GameState) => drive(s0, (s) => s.rung === r.id),
  expect: (s: GameState) => must(s.rung === r.id, `expected rung ${r.id}, got ${s.rung}`),
}));

export const FIXTURE_SPECS: readonly FixtureSpec[] = [
  POST_COLD_OPEN_SPEC,
  ...RUNG_START_SPECS,
  {
    name: 'fresh-R3-pre-wolf',
    group: G_EARLY,
    // G4 cutover: the wolf moved to R3's on-rails NIGHT ROUND (the grain-watch), which OPENS R3→R4.
    // This waypoint is the grain-watch blooded + round-ready, stopped one click short of POSTING the
    // first night round — the R3 countables (the rat/tanuki kills, the field + timber work) all done,
    // only the survive-the-wolf flag left. (Name kept — the DEV button / ?fixture= route resolves it.)
    blurb:
      'R3 grain-watch, night-round-ready — blooded and stopped one click short of posting the wolf round.',
    seed: T0_ARC_SEED,
    play: (s0) =>
      drive(s0, (_s, next) => next.kind === 'intent' && next.intent.type === 'begin_night_round'),
    expect: (s) => {
      must(s.rung === 'R3', `expected rung R3, got ${s.rung}`);
      must(
        !hasFlag(s, 'wolf-survived-not-won'),
        'the wolf should be unfaced (wolf-survived-not-won false)',
      );
      must(
        remainingRequirements(s).every((r) => r.type === 'flag'),
        'the R3 countable requirements should be done (round-ready)',
      );
    },
  },
  {
    name: 'pre-ascension',
    group: G_ENDGAME,
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
    group: G_EARLY,
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
    group: G_SETBACKS,
    blurb:
      'The post-loss slump (D-113): HP at the floor, carried coin/goods bled in the rout, the kura RICE hoard sheltered — sansai on hand so the cook-to-heal answer (D-076) is one press away.',
    seed: T0_ARC_SEED,
    // G4 cutover: rice is KURA-ONLY now (never carried), so the rout bleeds carried coin/goods but
    // can't touch the granary — the shelter is the whole kura pile. Drive to R3, forage sansai on the
    // woodlot (real labour) so the cook-to-heal loop is pressable, then take a real rout against a
    // REACHABLE foe (the field-margins badger, which walls a lvl-1 gate-watch) until the setback fires.
    play: (s0) => {
      let s = drive(s0, (st) => st.rung === 'R3');
      // forage sansai on the woodlot; if the season pool's worked out, turn the wheel to refill it.
      let guard = 0;
      const forageArea = getActivity('forage_satoyama').area;
      while ((s.resources.sansai ?? 0) < balance.COOK_SANSAI_COST && guard++ < 60) {
        if ((s.sitePools[forageArea] ?? 0) <= 0 && s.location === forageArea) {
          s = reduce(s, { type: 'advance_season' });
          continue;
        }
        s =
          s.location === forageArea
            ? reduce(s, { type: 'do_activity', activityId: 'forage_satoyama' })
            : walkTo(s, forageArea);
      }
      // take the documented rout — grind the badger (reachable at the field margins) to the setback.
      s = walkTo(s, getMob('badger').area);
      guard = 0;
      while (s.character.hp !== balance.SETBACK_HP && guard++ < 80) {
        s = applyGrindFight(s, 'badger');
      }
      return s;
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
        (s.resources.rice ?? 0) === 0,
        'rice is never carried (kura-only) — there is nothing on the back to bleed',
      );
      must(
        (s.resources.sansai ?? 0) >= balance.COOK_SANSAI_COST,
        'sansai on hand — the cook-to-heal answer must be pressable from this waypoint',
      );
    },
  },
  {
    name: 'worn-weapon-no-wood',
    group: G_SETBACKS,
    blurb:
      'A Battered blade with no wood to mend it — the repair-loop bind (win-rate cliff + the repair CTA).',
    seed: T0_ARC_SEED,
    // R4, not R3: `verb-repair` is an R4 unlock BY DESIGN (ranks.ts — repair waits for R4),
    // so the UI-layer bind — a Battered blade, a visible Repair CTA, and no wood to feed
    // it — only exists from R4 on. (At R3 the reducer can repair but no player can; the
    // journey lane drives visible controls only, so the waypoint moved up one rung.)
    play: (s0) => {
      let s = drive(s0, (st) => st.rung === 'R4');
      // FB-121: the climb now arrives at R4 with a deep wood pile (the R2/R3 woodcut
      // requirements), which would let grindUntil mend forever — STORE the wood in the
      // kura first, then grind unrepairable to the Battered bind.
      s = walkTo(s, 'kura');
      if ((s.resources.wood ?? 0) >= balance.REPAIR_WOOD_COST) {
        s = reduce(s, { type: 'deposit', resource: 'wood' });
      }
      return grindUntil(s, 'badger', (st) => bandName(st) === 'Battered');
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
    group: G_ENDGAME,
    blurb:
      'Phase 2, coffers full — rice sold and coin banked past 2× the dearest estate stage; idle at the kura.',
    seed: T0_ARC_SEED,
    // Full arc to the Phase-2 threshold, then run the coin faucet: G4 cutover — rice is KURA-ONLY, so
    // the faucet is `sell_rice` (kura shō → coin at Yohei's market-day stall), the wage board, and the
    // deposit. Sell/collect/bank on the spot; pass time with a haul when the stall's shut, until rich.
    // Idles at the kura (FB-32 resets in-flight automation on every load — genuinely idle).
    play: (s0) => {
      let s = walkTo(
        drive(s0, (_st, next) => next.kind === 'ascend'),
        'kura',
      );
      let guard = 0;
      while ((s.banked.coin ?? 0) < WEALTHY_COIN_THRESHOLD && guard++ < 4000) {
        if (isMarketDay(s.clock.day) && (s.banked.rice ?? 0) > 0) {
          s = reduce(s, { type: 'sell_rice' }); // kura shō → coin (Yohei's purse-clamped)
        } else if (s.wageDaysAccrued > 0) {
          s = reduce(s, { type: 'collect_wage' });
        } else if ((s.resources.coin ?? 0) > 0 && s.location === 'kura') {
          s = reduce(s, { type: 'deposit', resource: 'coin' });
        } else {
          // pass time (reach the next market day) with a coin-paying haul, then walk home to bank.
          s = walkTo(s, getActivity('haul_stores').area);
          s = reduce(s, { type: 'do_activity', activityId: 'haul_stores' });
          s = walkTo(s, 'kura');
        }
      }
      return walkTo(s, 'kura');
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
    group: G_ECONOMY,
    blurb:
      'R4 standing at the gate on Yohei’s market ground, the kura rice ready to sell — the market loop’s start.',
    seed: T0_ARC_SEED,
    // G4 cutover: rice is KURA-ONLY (never carried), sold at Yohei's gate stall — so the market-loop
    // start is standing at the GATE with a stocked kura, not rice "on the back". (`gate` is the real
    // node id; `gate-forecourt` was the pre-cutover name.)
    // ADR-177 Schedule A — driven to R4 (was R3): the Inventory 蔵 tab (the sale's
    // readout home in the e2e market loop) now reveals at R4.
    play: (s0) =>
      walkTo(
        drive(s0, (st) => st.rung === 'R4'),
        'gate',
      ),
    expect: (s) => {
      must(s.location === 'gate', `expected the gate, got ${s.location}`);
      must((s.banked.rice ?? 0) > 0, 'kura rice to sell — the loop needs stock');
      must(
        s.unlocked.includes('panel-estate'),
        'panel-estate must be revealed (Yohei stands the gate on it)',
      );
    },
  },
  {
    name: 'at-kura-with-coin',
    group: G_ECONOMY,
    blurb: 'R4, standing in the kura with wage-coin in the sleeve — the deposit one press away.',
    seed: T0_ARC_SEED,
    // The kura-deposit journey's start (P2): coin earned by the coin-paying haul (the wage labour),
    // walked home to the storehouse. (G4: coin comes from the haul/market, not carried-rice sales.)
    // ADR-177 Schedule A — driven to R4 (was R3): the deposit UI lives on the
    // Inventory 蔵 tab, which now reveals at R4.
    play: (s0) => {
      let s = drive(s0, (st) => st.rung === 'R4');
      s = walkTo(s, getActivity('haul_stores').area); // forecourt — the coin-paying wage labour
      let guard = 0;
      while ((s.resources.coin ?? 0) <= 0 && guard++ < 20) {
        s = reduce(s, { type: 'do_activity', activityId: 'haul_stores' });
      }
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

/** Drain any live/queued VN scene the drive left pending (C5a: side-beats fire from
 *  arrivals — a drive that walks THROUGH the kura queues sb-crest, and a fixture that
 *  boots into a surprise VN defeats its load-X-look-at-Y purpose). A fixture is a
 *  START-STATE: it loads with the shell visible, every mid-drive scene already played. */
function drainScenes(s0: GameState): GameState {
  let s = s0;
  let guard = 0;
  while ((s.activeScene !== null || s.sceneQueue.length > 0) && guard++ < 32) {
    if (s.activeScene === null) {
      s = reduce(s, { type: 'begin_scene', sceneId: s.sceneQueue[0]! });
      continue;
    }
    const def = sceneById(s.activeScene.id);
    const opts = def?.scene.decision.options ?? [];
    s = reduce(
      s,
      opts.length > 0
        ? { type: 'choose_scene_option', optionId: opts[0]!.id }
        : { type: 'advance_scene_beat' },
    );
  }
  return s;
}

/** Create the seeded initial state + drive it to the waypoint, asserting `expect` on the way out.
 *  Shared by the generator (GEN-time assert) and any test that wants the live state (not the JSON). */
export function buildFixtureState(spec: FixtureSpec): GameState {
  const s = drainScenes(spec.play(createInitialState(spec.seed)));
  spec.expect(s); // fail loudly if a spec no longer reaches its own waypoint
  return s;
}
