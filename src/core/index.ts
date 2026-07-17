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
export {
  QUESTS,
  QUEST_IDS,
  getQuest,
  advanceQuest,
  isQuestComplete,
} from './content/quests';
export type { QuestKind, QuestStep, QuestDef } from './content/quests';
export { acceptQuest, applyQuestEvent } from './quest-engine';
export {
  MARKET_ITEMS,
  MARKET_ITEM_IDS,
  getItem,
  canBuy,
  isMarketDay,
  MARKET_COIN_SINK_NOTE,
  YOHEI_PURSE_MON,
  initialMerchants,
  merchantOffer,
  merchantRestock,
  MERCHANT_SAG_STEP_SHO,
} from './content/market';
export type {
  MarketItem,
  MarketItemId,
  MerchantId,
  MerchantState,
} from './content/market';
export {
  MAP_NODES,
  MAP_NODE_CEILING,
  MAP_NODE_IDS,
  SICKROOM_NODE, // ADR-164/ADR-197 — where defeat lands you and the mend verbs live
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
export type { NpcMemory, RungPress } from './state';

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

export type { Intent, IntentType, MetaVerb } from './intents';
export { reduce, availableActions } from './intents';
export type { AskDef, AskAnswerLine, AvailableAsk } from './asks';
export { availableAsks, unheardAskCount, askFreshnessKey } from './asks';
export { ASKS, ASK_IDS, askById } from './content/asks';
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
  requirementById,
  requirementFlavor,
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
export type {
  RequirementDef,
  RequirementProgress,
  StatePredicate,
} from './requirements-engine';
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
} from './works';
export { isWaged, WAGE_START_RUNG, DAY_WAGE_MON } from './content/wage';
export {
  FLAVOR,
  judgeLine,
  restOpenLine,
  sleepLine,
  sleepAnnounceLine,
} from './content/flavor';
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
export type {
  BelongingDef,
  ComfortBonus,
  ComfortKind,
  HomeTierDef,
} from './content/home';

export { TIER_NAMES, toTierId } from './content/tiers';
export type { TierId } from './content/tiers';

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
export type {
  ActivityId,
  ActivityDef,
  LabourResource,
} from './content/activities';
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
export type {
  CombatStats,
  FightResult,
  FoeForecast,
  BestiaryEntry,
} from './combat';
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
export {
  resolveNightStage,
  nightStageReward,
  beginNightRound,
} from './night-rounds';
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
export type {
  MaterialId,
  MaterialDef,
  RecipeDef,
  MaterialDrop,
} from './content/crafting';

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

export {
  isUnlocked,
  unlockedSurfaces,
  visibleSet,
  announcePass,
  factsForSurfaces,
} from './unlock';
// ADR-184 (HR-32b) — the zone-ANNOUNCE diverge, both modes live behind the DEV toggle.
export {
  __setZoneRevealMode,
  zoneRevealMode,
  type ZoneRevealMode,
} from './unlock';
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
} from './content/discoveries';
export type {
  DiscoveryDef,
  DiscoveryId,
  DiscoveryTrigger,
} from './content/discoveries';
export type { NodeHint } from './discovery';

export { applyRewards } from './rewards';
export type { RewardBundle } from './rewards';

export {
  hpMax,
  satietyMax,
  hungerMax,
  restQuality,
  restRefill,
  canSleep, // ADR-187 — the day-skip's gate (a bed, at your corner, R4+)
  sleepForecast, // ADR-187 — its price; the reducer AND the hover read THIS (AC-6)
  canTreat, // ADR-164/ADR-197 — the paid sickroom mend's gate (mon-only: no coin, no row)
  treatForecast, // its price + gain; reducer AND row read THIS (AC-6)
  canRestSickroom, // ADR-164 — the free pallet-day trickle's gate
  restSickroomForecast, // its day + trickle; reducer AND row read THIS (AC-6)
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
  peopleAwayHere,
  ownsBelonging,
  ownedBelongingIds,
  ownedBelongings,
  homeRestBonus,
  cornerRestBonus,
  homeSatietyBonus,
  homeStorageBonus,
  homeHasCook,
  cookLoci, // ADR-184 — where a meal can be boiled (kitchen board / your hearth)
  canCookHere,
  estateBuild,
  riceSellQuote, // ADR-194 / AC-6 — the ONE quote behind the sell trade and its display
} from './selectors';
export type {
  LabourOption,
  ActivityForecast,
  EstateBuild,
  EstateBuildRow,
  RiceSellQuote,
} from './selectors';
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
  dialogueLineText,
} from './content/dialogue';
// step B (session-200) — the ONE story overlay: dev.ts flattens the effective takes into a
// single contentKey→text map (+ narration-run sequences); every reader consults
// storyText/storySeq and falls back to canon. The ten per-concern setters are retired.
export {
  __setStoryOverlay,
  storyText,
  storySeq,
} from './content/story-overlay';
export type {
  DialogueLine,
  DialogueDef,
  NpcMemoryMap,
} from './content/dialogue';
export * as balance from './content/balance';
export { rakeCapLine, RAKE_CAP_LINE } from './content/coldOpen';
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
