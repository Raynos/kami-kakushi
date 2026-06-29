// Public surface of the pure core (PRD §6.2). The ui/app/persistence layers import
// from here; `core` imports from none of them (one-directional, ESLint-enforced).
// Everything is pure, deterministic, immutable-in/out.

export { ipow, clamp } from './math';
export { formatKMB, formatRate } from './format';

export type {
  GameState,
  Character,
  Clock,
  SurfaceId,
  ResourceId,
  FlagId,
  PillarState,
  Influence,
  QuestState,
} from './state';
export { QUESTS, QUEST_IDS, getQuest, advanceQuest, isQuestComplete } from './content/quests';
export type { QuestKind, QuestStep, QuestDef } from './content/quests';
export { acceptQuest, applyQuestEvent } from './quest-engine';
export {
  MARKET_ITEMS,
  MARKET_ITEM_IDS,
  getItem,
  canBuy,
  MARKET_KOKU_SINK_NOTE,
} from './content/market';
export type { MarketItem, MarketItemId } from './content/market';
export { createInitialState, hasFlag, setFlag, withResource, addSkillXp } from './state';

export type { Intent, IntentType } from './intents';
export { reduce, availableActions } from './intents';

export { tick, advanceClock } from './step';

// ── progression (M1) ──
export {
  levelForXp,
  skillXp,
  skillLevel,
  skillVisible,
  skillProgress,
  skillYieldNum,
} from './skills';
export type { SkillProgress } from './skills';
export { currentRank, accrueRungMeter, promoteRungs, rungProgress, phaseOf } from './ranks';
export {
  gradeOf,
  perDeedCap,
  accrueDeed,
  applyEstateDeed,
  seasonalJudge,
  estateGrade,
} from './pillars';
export type { Grade, GradeBands } from './pillars';
export { ascensionAvailable, ascensionBoon, ascend } from './ascension';
export { ESTATE_STAGES, MAX_ESTATE_STAGE } from './content/estate';
export type { EstateStageDef } from './content/estate';

export { SKILLS, getSkill, SKILL_IDS } from './content/skills';
export type { SkillId, SkillDef } from './content/skills';
export { ACTIVITIES, getActivity, activityLine, ACTIVITY_IDS } from './content/activities';
export type { ActivityId, ActivityDef, LabourResource } from './content/activities';
export { AREAS, AREA_IDS } from './content/areas';
export type { AreaId, AreaDef } from './content/areas';
export { RANKS, getRank, nextRankId, RANK_IDS } from './content/ranks';
export type { RankId, RankDef } from './content/ranks';

// ── combat (M2) ──
export {
  mcCombatStats,
  mobCombatStats,
  analyticWinRate,
  sampledWinRate,
  combatLevelForXp,
  combatXpProgress,
  combatSatietyRate,
  durabilityBand,
  resolveFight,
  foeForecasts,
} from './combat';
export type { CombatStats, FightResult, FoeForecast } from './combat';
export { WEAPONS, getWeapon, WEAPON_IDS } from './content/weapons';
export type { WeaponId, WeaponDef } from './content/weapons';
export { STANCE_MODS, STANCE_ORDER } from './content/balance';
export type { StanceId, StanceMod } from './content/balance';
export type { BalanceProfile } from './content/balance';
export { MOBS, GRINDABLE_MOBS, getMob, MOB_IDS } from './content/enemies';
export type { MobId, MobDef } from './content/enemies';
export { applyGrindFight, applyScriptedWolf } from './fight';
export {
  MATERIALS,
  getMaterial,
  MATERIAL_IDS,
  RECIPES,
  getRecipe,
  canCraft,
  missingMaterials,
  MATERIAL_DROPS,
  rollMaterialDrop,
} from './content/crafting';
export type { MaterialId, MaterialDef, RecipeDef, MaterialDrop } from './content/crafting';

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
  estateSatietyBonus,
  estateYieldNum,
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
export {
  DIALOGUES,
  DIALOGUE_IDS,
  getDialogue,
  nextDialogueLines,
  COLD_OPEN_DIALOGUE_ID,
} from './content/dialogue';
export type { DialogueLine, DialogueDef } from './content/dialogue';
export * as balance from './content/balance';

export {
  APP_ID,
  SCHEMA_VERSION,
  LOG_RING_MAX,
  LOG_MAX_IDENTICAL_RUN,
  TICKS_PER_DAY,
  DAYS_PER_WEEK,
  DAYS_PER_SEASON,
  SEASONS,
  LUNAR_PERIOD_DAYS,
} from './constants';
export type { Season } from './constants';
