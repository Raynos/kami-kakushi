// Public surface of the pure core (PRD §6.2). The ui/app/persistence layers import
// from here; `core` imports from none of them (one-directional, oxlint-enforced).
// Everything is pure, deterministic, immutable-in/out.

export { ipow, clamp } from './math';
export { formatKMB, formatRate, formatCoin } from './format';

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
  isMarketDay,
  MARKET_COIN_SINK_NOTE,
} from './content/market';
export type { MarketItem, MarketItemId } from './content/market';
export {
  MAP_NODES,
  MAP_NODE_CEILING,
  MAP_NODE_IDS,
  getNode,
  canMove,
  reachableFrom,
  nodeSeasonalBlurb,
} from './content/map';
export type { MapNode, MapNodeId } from './content/map';
export {
  createInitialState,
  hasFlag,
  setFlag,
  withResource,
  addSkillXp,
  rememberNpc,
  deepenNpc,
  npcRegard,
  markTopicAsked,
} from './state';
export type { NpcMemory } from './state';

// ── interactive intro + speaker/voice model (interactive-intro plan §3) ──
export {
  DIALOGUE_SCENES,
  INTRO_SCENE_COUNT,
  INTRO_BEATS,
  INTRO_BEAT_COUNT,
  introActive,
  introSceneAt,
  introTopic,
  introSceneOption,
  availableTopics,
  introBeatAt,
  introOption,
  introStatLine,
  introStatDelta,
  introPerkLine,
  introSceneTitle,
  __setIntroTitleOverride,
  beatReactVoice,
  beatReactSpeaker,
} from './content/intro';
export type {
  DialogueScene,
  DialogueTopic,
  DialogueDecision,
  IntroBeat,
  IntroOption,
  IntroStat,
  IntroSetupLine,
} from './content/intro';
export { NPC_IDS, NPC_NAME, NPC_VOICE, PLAYER_SPEAKER } from './content/voices';
export type { NpcId, VoiceCategory } from './content/voices';

export type { Intent, IntentType } from './intents';
export { reduce, availableActions } from './intents';
export {
  focusedOptimalIntent,
  autoModeIntent,
  nextHopToward,
  cheapestEligibleGlobal,
} from './autoplay';

export { tick, advanceClock, advanceSeason } from './step';

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
export {
  currentRank,
  applyPromotion,
  promotionReady,
  pendingPromotionTarget,
  rungProgress,
  remainingRequirements,
  phaseOf,
  rungNumber,
} from './ranks';
// ── the rung requirements (FB-121 / ADR-137) ──
export {
  RUNG_REQUIREMENTS,
  rungRequirements,
  requirementFlavor,
  __setRequirementFlavorOverride,
} from './content/requirements';
export {
  advanceOnToken,
  settleOnState,
  allRequirementsDone,
  isRequirementDone,
  requirementTarget,
  rungPercentOf,
  chunkCount,
  NATIVE_PREDICATES,
} from './requirements-engine';
export type { RequirementDef, RequirementProgress, StatePredicate } from './requirements-engine';
export { applyProgressEvent, settleRequirements } from './progress-events';
// ── the rung-up story beats (ADR-110) ──
export {
  RUNG_BEATS,
  rungBeatFor,
  availableRungTopics,
  rungTopic,
  rungOption,
} from './content/rungBeats';
export type { RungScene, RungDecision, RungOption } from './content/rungBeats';
// storywave — the generalized VN scene registry + the MON-lane wage helpers (G4.9 render sweep
// wires these into the one VN modal + the wage board / season / night-round controls).
export { SCENES, sceneById } from './content/scenes';
export type { SceneDef, SceneId, SceneTrigger } from './content/scenes';
// ADR-177 — the works discovery chain (day-book names → walk sees → beat opens).
export {
  WORKS_PROJECTS,
  canWorkProject,
  worksSiteZones,
  stageOpen,
  stageDiscovery,
  stageLabel,
  stageBlurb,
  stageLogLine,
  worksPass,
  worksLine,
  __setWorksFlavorOverride,
} from './works';
export { isWaged, WAGE_START_RUNG, DAY_WAGE_MON } from './content/wage';
export { FLAVOR, judgeLine, __setJudgeFlavorOverride } from './content/flavor';
export {
  gradeOf,
  perDeedCap,
  accrueDeed,
  applyEstateDeed,
  estateDeedMagnitude,
  bankEstateDeed,
  seasonalJudge,
  estateGrade,
} from './pillars';
export type { Grade, GradeBands, EstateDeedSource } from './pillars';
export { ascensionAvailable, ascensionBoon, ascend } from './ascension';
export { ESTATE_STAGES, MAX_ESTATE_STAGE } from './content/estate';
export type { EstateStageDef } from './content/estate';

// ── the player HOME + belongings (ADR-111 / FB-89) ──
export {
  BELONGINGS,
  BELONGING_IDS,
  getBelonging,
  comfortBonus,
  homeHasCookLocus,
  homeSetComplete,
  SETTLED_HOME_SET,
  SETTLED_HOME_REST_BONUS,
  CHEST_STORAGE_CAPACITY,
  HOME_TIERS,
  HOME_SURFACE,
  HOME_REVEAL_LINE,
  homeRestLine,
} from './content/home';
export type { BelongingDef, ComfortBonus, ComfortKind, HomeTierDef } from './content/home';

export { SKILLS, getSkill, SKILL_IDS } from './content/skills';
export type { SkillId, SkillDef } from './content/skills';
export {
  ACTIVITIES,
  getActivity,
  activityLine,
  ACTIVITY_IDS,
  LABOUR_SITES,
  refillSitePools,
} from './content/activities';
export type { ActivityId, ActivityDef, LabourResource } from './content/activities';
export {
  ACTIVITY_TIMING,
  INTENT_TIMING,
  timingFor,
  COOLDOWN_SEED_MS,
  RAKE_TEACH_COOLDOWN_MS,
  TRAVEL_SEED_MS,
  EDGE_WALK_MS,
  edgeKey,
  walkMs,
  intentWallMs,
} from './content/timing';
export type { ActionTiming } from './content/timing';
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
  foesHere,
  foeTell,
  bestiaryEntries,
} from './combat';
export type { CombatStats, FightResult, FoeForecast, BestiaryEntry } from './combat';
export { WEAPONS, getWeapon, WEAPON_IDS } from './content/weapons';
export type { WeaponId, WeaponDef } from './content/weapons';
export {
  STANCE_MODS,
  STANCE_ORDER,
  ATTR_IDS,
  ATTR_BASE,
  ATTR_META,
  COLD_OPEN_HUNGER,
  HUNGER_MAX,
} from './content/balance';
export type { StanceId, StanceMod, AttrId } from './content/balance';
export { baseAttrs } from './state';
export { MOBS, GRINDABLE_MOBS, getMob, MOB_IDS } from './content/enemies';
export type { MobId, MobDef } from './content/enemies';
export { applyGrindFight } from './fight';
export { resolveNightStage, nightStageReward, beginNightRound } from './night-rounds';
export { NIGHT_ROUNDS, nightRoundById } from './content/nightRounds';
export type { NightRoundDef, NightRoundStage } from './content/nightRounds';
export { playerSpeaker } from './content/voices';
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

// ADR-146 — emergent node discovery (the reveal engine at finer grain)
export {
  isDiscovered,
  hiddenActivityIds,
  effectiveChance,
  discoveryPass,
  nodeHint,
} from './discovery';
export type { DiscoveryEvent } from './discovery';
export {
  DISCOVERIES,
  getDiscovery,
  discoveryEmitLine,
  __setDiscoveryFlavorOverride,
} from './content/discoveries';
export type { DiscoveryDef, DiscoveryId, DiscoveryTrigger } from './content/discoveries';
export type { NodeHint } from './discovery';

export { applyRewards } from './rewards';
export type { RewardBundle } from './rewards';

export {
  hpMax,
  satietyMax,
  hungerMax,
  restQuality,
  restRefill,
  estateSatietyBonus,
  estateYieldNum,
  season,
  week,
  year,
  lunarPhase,
  kuraBales,
  kuraKoku,
  kuraRiceSho,
  siteYield,
  activityForecast,
  staminaRate,
  lowHpWorkMult,
  workRate,
  availableLabours,
  canDoActivity,
  canAffordAct,
  rakeExhausted,
  OUT_OF_STRENGTH_REASON,
  peopleHere,
  ownsBelonging,
  ownedBelongingIds,
  ownedBelongings,
  homeRestBonus,
  homeSatietyBonus,
  homeStorageBonus,
  homeHasCook,
  estateBuild,
} from './selectors';
export type { LabourOption, ActivityForecast, EstateBuild, EstateBuildRow } from './selectors';
export { PEOPLE, PEOPLE_IDS, getPerson, presenceCtx } from './content/people';
export type { NodePerson, PersonDepth, PresenceCtx } from './content/people';

export type { LogEntry, LogState, LogChannel } from './log';

export { NAMES } from './content/names';
export {
  DIALOGUES,
  DIALOGUE_IDS,
  getDialogue,
  getDialogueLine,
  nextDialogueLines,
  COLD_OPEN_DIALOGUE_ID,
  RAKE_TEACH_LINE_IDS,
  rakeTeachPending,
} from './content/dialogue';
export type { DialogueLine, DialogueDef, NpcMemoryMap } from './content/dialogue';
export * as balance from './content/balance';
export { __setRakeCapLineOverride, rakeCapLine, RAKE_CAP_LINE } from './content/coldOpen';
// FB-7 balance cockpit (DEV-only, ADR-059) — the live-tuning hook. Named exports so the cockpit imports
// them tree-shakably; unused by prod code, so Rollup strips them (verify-dev-strip.sh proves it).
export {
  readBalanceLever,
  __setBalanceLever,
  __resetBalanceLevers,
  BALANCE_CANON,
} from './content/balance';

export {
  APP_ID,
  SCHEMA_VERSION,
  APP_GENERATION,
  LOG_EPHEMERAL_MAX,
  LOG_MAX_IDENTICAL_RUN,
  TICKS_PER_DAY,
  DAYS_PER_WEEK,
  dayOfWeek,
  DAY_OF_WEEK_NAMES,
  SEASONS,
  LUNAR_PERIOD_DAYS,
} from './constants';
export type { Season } from './constants';
