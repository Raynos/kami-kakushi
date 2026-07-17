// Action timing (ADR-148 / FB-174, plan: fable-2026-07-07-timed-actions.md Phase 1).
// Every player action is either TIMED (a duration the shell clock runs, then a
// cooldown before the next press) or declared INSTANT — the taxonomy is total, so
// an unclassified action is a COMPILE error, never a silent instant. The core owns
// only this DATA; the wall clock lives in the shell (the pure core stays
// deterministic and time-free). The sim/pacing lane converts action-counts →
// seconds through this same table, so the felt game and the measurement can never
// desync (AC-6).
//
// Seeds are the human-locked fast-idle band (small 3–5s · labour 5–10s · big
// 30–90s · 2s cooldown) — SEEDS ONLY: the human tunes via the balance cockpit
// (ADR-134), and Phase 4 holds rung wall-time targets by boosting yields (fewer,
// slower actions per rung), never by compressing the band.

import type { ActivityId } from './activities';
import type { IntentType } from '../intents';

export type ActionTiming =
  | {
      readonly kind: 'timed';
      readonly durationMs: number;
      readonly cooldownMs: number;
    }
  | { readonly kind: 'instant' };

const INSTANT: ActionTiming = { kind: 'instant' };
/** The ADR-148 cooldown seed — per-action data (each entry carries its own copy so
 *  any one action can diverge later without a schema change), uniform 2s today. */
export const COOLDOWN_SEED_MS = 2000;
const timed = (
  durationMs: number,
  cooldownMs = COOLDOWN_SEED_MS,
): ActionTiming => ({
  kind: 'timed',
  durationMs,
  cooldownMs,
});

/** Per-labour durations — the fast-idle labour band (5–10s), textured by effort:
 *  the deeper/heavier the work, the longer the swing. */
export const ACTIVITY_TIMING: Readonly<Record<ActivityId, ActionTiming>> = {
  farm_paddy: timed(8000),
  haul_stores: timed(6000),
  woodcut_edge: timed(7000),
  forage_satoyama: timed(6000),
  forage_deepwoods: timed(9000),
  tap_lacquer: timed(7000),
  search_reeds: timed(6000), // C5a — reed-wading sits with the light forage swings
  clear_sluice: timed(9000), // C5a — silt work is the heavy end of the band
};

/** The night-round seed duration (storywave G2) — a BIG scripted sequence in the 30–90s
 *  band (ADR-148: night rounds are TIMED). SEED ONLY; the human tunes via the cockpit. */
export const NIGHT_ROUND_SEED_MS = 30000;

/** FB-224 — the cold-open teach cooldown: while Genemon's three raked-gated teach
 *  lines (dialogue.ts RAKE_TEACH_LINE_IDS, one per rake) are still landing, the
 *  rake press cools down long enough for the arriving line to finish typing —
 *  the human's cold-open pacing beat ("slow enough for the text to render",
 *  pre-auto). Sized to cover the LONGEST teach line at the log typewriter cadence
 *  (a render.test derives that bound from the registry, so a longer authored line
 *  REDs it). SEED ONLY; the human tunes via the cockpit. The pacing sim's
 *  intentWallMs deliberately ignores it — a one-off ≤ ~30s across the whole run. */
export const RAKE_TEACH_COOLDOWN_MS = 12000;

/** The fallback hop (an edge missing from EDGE_WALK_MS — the coverage test makes
 *  that a RED, so this only guards an unrevealed/DEV teleport path). */
export const TRAVEL_SEED_MS = 12000;

/** ADR-148 Phase 3 — travel is PER-EDGE data from day one (the human's call):
 *  each map edge declares its own walk seconds; distance texture is content,
 *  not a constant. Undirected (walking back takes as long); keys are sorted
 *  "a|b". Travel carries NO cooldown seed — you arrive and keep moving; a
 *  per-edge cooldown stays one number away if the map ever wants weary roads.
 *  The timing.test derives edge coverage from MAP_NODES: a new edge without a
 *  walk time here is RED.
 *  2026-07-11 (human order, transcribed — ADR-134): the whole table slowed ×2
 *  (revised down from a first ×5 ask in the same session) — travel reads as a
 *  real walk, not a flicker. The original 3–7s texture is preserved ×2 (6–14s);
 *  the R3 band was re-signed [3, 25] with it (the walking-est rung honestly
 *  runs longer in a slower world — see decisions.md). */
export const EDGE_WALK_MS: Readonly<Record<string, number>> = {
  // The estate core — steps apart around the forecourt hub.
  'forecourt|gate': 6000,
  'forecourt|kura': 8000, // the forecourt is steps from the kura door
  'forecourt|kitchen': 6000,
  'forecourt|woodshed': 6000,
  'forecourt|sickroom': 6000,
  'drill-yard|forecourt': 8000, // the yard adjoins the forecourt
  'kitchen|shrine': 6000, // the alcove is just off the kitchen threshold
  // Out to the working ground.
  'forecourt|paddies': 10000,
  'field-margins|paddies': 10000,
  'paddies|woodlot': 12000,
  'paddies|weir': 12000, // down the work path to the river
  'weir|weir-reeds': 8000,
  // The old compound's wild edge — farther, past the danger ring (ADR-078).
  'orchard|woodlot': 12000,
  'grove|orchard': 12000,
  'field-margins|ruined': 14000, // locked scenery, but the graph edge is timed for coverage
  'orchard|ruined': 14000,
};

export function edgeKey(a: string, b: string): string {
  return a < b ? `${a}|${b}` : `${b}|${a}`;
}

export function walkMs(from: string | undefined, to: string): number {
  if (!from) return TRAVEL_SEED_MS;
  return EDGE_WALK_MS[edgeKey(from, to)] ?? TRAVEL_SEED_MS;
}

/** The total intent classification. Every intent the reducer accepts appears here —
 *  `Record<IntentType, …>` makes a new unclassified intent a compile error.
 *  Notes on the deliberate instants:
 *  - trade/inventory (`sell_rice`, `buy_*`, `deposit`, `withdraw`) — the human's
 *    locked "instant action" class (ADR-148).
 *  - combat (`fight`, `set_auto_combat`) — EXCLUDED from timing
 *    pending its own review (ADR-148); today's behavior holds.
 *  - VN/meta intents (intro, rung beats, toggles, equips) — UI narration or
 *    zero-fiction bookkeeping; time would be chrome, not fiction (TST3).
 *  `do_activity` and `move_to` are routed by `timingFor` (per-activity /
 *  per-edge); their entries here are the fallbacks for that routing. */
export const INTENT_TIMING: Readonly<Record<IntentType, ActionTiming>> = {
  open_eyes: INSTANT,
  advance_intro: INSTANT,
  ask_topic: INSTANT,
  choose_intro: INSTANT,
  begin_rung_beat: INSTANT,
  advance_rung_beat: INSTANT,
  ask_rung_topic: INSTANT,
  choose_rung_option: INSTANT,
  // storywave G2 scene VN intents — UI narration / zero-fiction bookkeeping (TST3), like the
  // intro/rung VN intents above; time would be chrome, not fiction.
  begin_scene: INSTANT,
  ask_scene_topic: INSTANT,
  advance_scene_beat: INSTANT,
  choose_scene_option: INSTANT,
  // storywave G2: the on-rails night round is TIMED (ADR-148) — a big scripted sequence.
  begin_night_round: timed(NIGHT_ROUND_SEED_MS),
  rake_rice: timed(5000), // the capture's own example: "takes 5 seconds"
  rest: timed(4000),
  // ADR-187 — sleeping the day away is INSTANT, deliberately. A "waiting" bar (the rejected
  // option C) would convert dead GAME time into dead REAL time — strictly worse than playing,
  // and against the active-only contract (PRD §6.9). The safety on a costly, irreversible press
  // is LEGIBILITY, not delay: the button's hover reads the exact price (AC-6, sleepForecast).
  sleep: INSTANT,
  do_activity: timed(7000), // fallback — timingFor routes to ACTIVITY_TIMING
  set_auto: INSTANT,
  set_auto_rake: INSTANT,
  fight: INSTANT, // combat — excluded (ADR-148)
  set_auto_combat: INSTANT,
  repair_weapon: timed(8000),
  equip_weapon: INSTANT,
  set_stance: INSTANT,
  cook_meal: timed(6000),
  // ADR-164/ADR-197 — the paid treatment is a real tended act (the repair-class band);
  // the pallet day is INSTANT for the same reason sleep is: its price is GAME days, and a
  // real-time bar would only stack dead REAL time on top — the safety is legibility (the
  // row reads the exact cost via restSickroomForecast, AC-6), not delay.
  treat: timed(8000),
  rest_sickroom: INSTANT,
  eat_rice: timed(3000),
  sell_rice: INSTANT, // trade is instant (ADR-148)
  collect_wage: INSTANT, // MON lane (ADR-163): handed the coin at the board — a tactile transaction
  improve_estate: timed(30000), // the COMMISSIONING half (ADR-177 F3) — still a big act
  work_project: timed(8000), // one sited act of the commissioned work (the labour band)
  spend_attribute: INSTANT,
  craft_weapon: timed(45000), // a BIG action — the 30–90s band
  accept_quest: INSTANT,
  buy_item: INSTANT, // trade is instant (ADR-148)
  buy_belonging: INSTANT, // trade is instant (ADR-148)
  deposit: INSTANT, // trade is instant (ADR-148)
  withdraw: INSTANT, // trade is instant (ADR-148)
  move_to: timed(TRAVEL_SEED_MS), // Phase 3 replaces with per-edge walk seconds
  ascend: INSTANT, // the ascension ceremony owns its own theater (ADR-062)
  advance_season: INSTANT, // storywave G1: instant dispatch — the VN overlay IS the time (ADR-148)
  talk_to: INSTANT, // C4.2: a spoken line is narration, not labour — time would be chrome (TST3)
  ask: INSTANT, // FB-415 D7: asks are FREE — no clock, no satiety; info never costs fiction time
};

/** The one lookup the shell clock (Phase 2) and the sim consume: intent → timing.
 *  Routes `do_activity` to its per-activity entry; everything else reads the
 *  intent table. (Phase 3 teaches this the per-edge `move_to` walk seconds.) */
/** ADR-148 Phase 4 — one intent's modeled WALL cost (the sim/pacing lane's unit):
 *  timed = duration + cooldown from this same table; instant = one heartbeat of the
 *  auto loop (AUTO_REPEAT_MS). Both the pacing report and the balance sim consume
 *  THIS, so the measurement can never desync from the shell clock's data. */
export function intentWallMs(
  intent: {
    readonly type: IntentType;
    readonly activityId?: string | null;
    readonly to?: string;
  },
  location: string,
  heartbeatMs: number,
): number {
  const opts: { activityId?: ActivityId; from?: string; to?: string } = {
    from: location,
  };
  if (typeof intent.activityId === 'string')
    opts.activityId = intent.activityId as ActivityId;
  if (intent.to !== undefined) opts.to = intent.to;
  const t = timingFor(intent.type, opts);
  return t.kind === 'timed' ? t.durationMs + t.cooldownMs : heartbeatMs;
}

export function timingFor(
  type: IntentType,
  opts?: {
    readonly activityId?: ActivityId;
    readonly from?: string;
    readonly to?: string;
  },
): ActionTiming {
  if (type === 'do_activity' && opts?.activityId)
    return ACTIVITY_TIMING[opts.activityId];
  if (type === 'move_to' && opts?.to)
    // per-edge walk seconds (Phase 3); no cooldown — you arrive and keep moving
    return {
      kind: 'timed',
      durationMs: walkMs(opts.from, opts.to),
      cooldownMs: 0,
    };
  return INTENT_TIMING[type];
}
