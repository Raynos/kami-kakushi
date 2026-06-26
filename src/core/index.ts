// Public surface of the pure core (PRD §6.2). The ui/app/persistence layers import
// from here; `core` imports from none of them (one-directional, ESLint-enforced).
// Everything is pure, deterministic, immutable-in/out.

export { ipow, clamp } from './math';
export { formatKMB, formatRate } from './format';

export type { GameState, Character, Clock, SurfaceId, ResourceId, FlagId } from './state';
export { createInitialState, hasFlag, setFlag, withResource, addSkillXp } from './state';

export type { Intent, IntentType } from './intents';
export { reduce, availableActions } from './intents';

export { tick, advanceClock } from './step';

// ── progression (M1) ──
export { levelForXp, skillXp, skillLevel, skillVisible, skillProgress } from './skills';
export type { SkillProgress } from './skills';
export { currentRank, accrueRungMeter, promoteRungs, rungProgress, phaseOf } from './ranks';

export { SKILLS, getSkill, SKILL_IDS } from './content/skills';
export type { SkillId, SkillDef } from './content/skills';
export { ACTIVITIES, getActivity, activityLine, ACTIVITY_IDS } from './content/activities';
export type { ActivityId, ActivityDef, LabourResource } from './content/activities';
export { AREAS, AREA_IDS } from './content/areas';
export type { AreaId, AreaDef } from './content/areas';
export { RANKS, getRank, nextRankId, RANK_IDS } from './content/ranks';
export type { RankId, RankDef } from './content/ranks';

export type { Rng, RngStream } from './rng';
export {
  createRng,
  nextFloat,
  nextInt,
  nextChance,
  nextPick,
  nextWeighted,
  deriveDayKeyed,
} from './rng';

export { isUnlocked, unlockedSurfaces, revealPass } from './unlock';
export { SURFACES, SURFACE_IDS } from './content/surfaces';
export type { Surface, SurfaceKind } from './content/surfaces';

export { applyRewards } from './rewards';
export type { RewardBundle } from './rewards';

export {
  hpMax,
  satietyMax,
  season,
  week,
  year,
  lunarPhase,
  staminaRate,
  availableLabours,
  canDoActivity,
} from './selectors';
export type { LabourOption } from './selectors';

export type { LogEntry, LogState, LogChannel } from './log';

export { NAMES } from './content/names';
export * as balance from './content/balance';

export {
  APP_ID,
  SCHEMA_VERSION,
  LOG_RING_MAX,
  TICKS_PER_DAY,
  DAYS_PER_WEEK,
  DAYS_PER_SEASON,
  SEASONS,
  LUNAR_PERIOD_DAYS,
} from './constants';
export type { Season } from './constants';
