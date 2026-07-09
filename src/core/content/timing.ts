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
  | { readonly kind: 'timed'; readonly durationMs: number; readonly cooldownMs: number }
  | { readonly kind: 'instant' };

const INSTANT: ActionTiming = { kind: 'instant' };
/** The ADR-148 cooldown seed — per-action data (each entry carries its own copy so
 *  any one action can diverge later without a schema change), uniform 2s today. */
export const COOLDOWN_SEED_MS = 2000;
const timed = (durationMs: number, cooldownMs = COOLDOWN_SEED_MS): ActionTiming => ({
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
};

/** The night-round seed duration (storywave G2) — a BIG scripted sequence in the 30–90s
 *  band (ADR-148: night rounds are TIMED). SEED ONLY; the human tunes via the cockpit. */
export const NIGHT_ROUND_SEED_MS = 30000;

/** The fallback hop (an edge missing from EDGE_WALK_MS — the coverage test makes
 *  that a RED, so this only guards an unrevealed/DEV teleport path). */
export const TRAVEL_SEED_MS = 6000;

/** ADR-148 Phase 3 — travel is PER-EDGE data from day one (the human's call):
 *  each map edge declares its own walk seconds; distance texture is content,
 *  not a constant. Undirected (walking back takes as long); keys are sorted
 *  "a|b". Travel carries NO cooldown seed — you arrive and keep moving; a
 *  per-edge cooldown stays one number away if the map ever wants weary roads.
 *  The timing.test derives edge coverage from MAP_NODES: a new edge without a
 *  walk time here is RED. */
export const EDGE_WALK_MS: Readonly<Record<string, number>> = {
  // The estate core — steps apart around the forecourt hub.
  'forecourt|gate': 3000,
  'forecourt|kura': 4000, // the forecourt is steps from the kura door
  'forecourt|kitchen': 3000,
  'forecourt|woodshed': 3000,
  'forecourt|sickroom': 3000,
  'drill-yard|forecourt': 4000, // the yard adjoins the forecourt
  'kitchen|shrine': 3000, // the alcove is just off the kitchen threshold
  // Out to the working ground.
  'forecourt|paddies': 5000,
  'field-margins|paddies': 5000,
  'paddies|woodlot': 6000,
  'paddies|weir': 6000, // down the work path to the river
  'weir|weir-reeds': 4000,
  // The old compound's wild edge — farther, past the danger ring (ADR-078).
  'orchard|woodlot': 6000,
  'grove|orchard': 6000,
  'field-margins|ruined': 7000, // locked scenery, but the graph edge is timed for coverage
  'orchard|ruined': 7000,
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
 *  - combat (`face_wolf`, `fight`, `set_auto_combat`) — EXCLUDED from timing
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
  advance_scene_beat: INSTANT,
  choose_scene_option: INSTANT,
  // storywave G2: the on-rails night round is TIMED (ADR-148) — a big scripted sequence.
  begin_night_round: timed(NIGHT_ROUND_SEED_MS),
  rake_rice: timed(5000), // the capture's own example: "takes 5 seconds"
  rest: timed(4000),
  do_activity: timed(7000), // fallback — timingFor routes to ACTIVITY_TIMING
  set_auto: INSTANT,
  set_auto_rake: INSTANT,
  face_wolf: INSTANT, // combat — excluded (ADR-148)
  fight: INSTANT, // combat — excluded (ADR-148)
  set_auto_combat: INSTANT,
  repair_weapon: timed(8000),
  equip_weapon: INSTANT,
  set_stance: INSTANT,
  cook_meal: timed(6000),
  eat_rice: timed(3000),
  sell_rice: INSTANT, // trade is instant (ADR-148)
  improve_estate: timed(60000), // a BIG action — the 30–90s band
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
};

/** The one lookup the shell clock (Phase 2) and the sim consume: intent → timing.
 *  Routes `do_activity` to its per-activity entry; everything else reads the
 *  intent table. (Phase 3 teaches this the per-edge `move_to` walk seconds.) */
/** ADR-148 Phase 4 — one intent's modeled WALL cost (the sim/pacing lane's unit):
 *  timed = duration + cooldown from this same table; instant = one heartbeat of the
 *  auto loop (AUTO_REPEAT_MS). Both the pacing report and the balance sim consume
 *  THIS, so the measurement can never desync from the shell clock's data. */
export function intentWallMs(
  intent: { readonly type: IntentType; readonly activityId?: string | null; readonly to?: string },
  location: string,
  heartbeatMs: number,
): number {
  const opts: { activityId?: ActivityId; from?: string; to?: string } = { from: location };
  if (typeof intent.activityId === 'string') opts.activityId = intent.activityId as ActivityId;
  if (intent.to !== undefined) opts.to = intent.to;
  const t = timingFor(intent.type, opts);
  return t.kind === 'timed' ? t.durationMs + t.cooldownMs : heartbeatMs;
}

export function timingFor(
  type: IntentType,
  opts?: { readonly activityId?: ActivityId; readonly from?: string; readonly to?: string },
): ActionTiming {
  if (type === 'do_activity' && opts?.activityId) return ACTIVITY_TIMING[opts.activityId];
  if (type === 'move_to' && opts?.to)
    // per-edge walk seconds (Phase 3); no cooldown — you arrive and keep moving
    return { kind: 'timed', durationMs: walkMs(opts.from, opts.to), cooldownMs: 0 };
  return INTENT_TIMING[type];
}
