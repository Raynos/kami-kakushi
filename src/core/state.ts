// GameState — the stored vs. computed split (PRD §6.4). The M0 surface is
// deliberately minimal (FU5): schemaVersion, the seeded RNG, the clock (tick+day
// only — season/year DERIVED), the character vitals, the cold-open resources,
// story flags, the write-once `unlocked` latch, and the event log. Rich per-system
// fields (subEngines / combat / dialogue / quests) are added ADDITIVELY at their
// milestone, never pre-declared here.
//
// Everything is immutable-in/immutable-out (structural sharing). Derived values
// (satietyMax, hpMax, season, year, what's unlocked-by-predicate) are computed by
// selectors — never stored.

import type { Rng } from './rng';
import { createRng } from './rng';
import { clamp } from './math';
import type { LogState } from './log';
import { emptyLog } from './log';
import { SCHEMA_VERSION, type Season } from './constants';
import {
  HP_BASE,
  HP_PER_LEVEL,
  STR_HP,
  ATTR_BASE,
  COLD_OPEN_SATIETY,
  type StanceId,
  type AttrId,
} from './content/balance';
import type { RankId } from './content/ranks';
import type { ActivityId } from './content/activities';
import { refillSitePools } from './content/activities';
import type { SkillId } from './content/skills';
import type { MobId } from './content/enemies';
import { getWeapon, type WeaponId } from './content/weapons';
import type { MapNodeId } from './content/map';
import type { NpcId } from './content/voices';
import type { SceneId } from './content/scenes';

export type SurfaceId = string;
export type ResourceId = string;
export type FlagId = string;

/** One House-Influence pillar's accrued standing (ADR-049/ADR-055). `value` is the live grade
 *  total (deeds + seasonal), in whole koku; `highWater` is the best `value` ever reached; `judged`
 *  is the high-water as of the LAST seasonal judge — the season judge fires only on a NEW high-water
 *  (highWater > judged), the 30% seasonal share. `frac` is the sub-koku deed accumulator (0 ≤ frac
 *  < 1): a single labour deed banks a fraction of a koku (ADR-133), carried here until it crosses a
 *  whole koku into `value`. Optional/additive — absent on a pre-D-133 save = 0. Phase-2-gated
 *  accrual (post-capstone, FU7). */
export interface PillarState {
  readonly value: number;
  readonly highWater: number;
  readonly judged: number;
  readonly frac?: number;
}

/** House Influence (家威) — one pillar per tier (ADR-048). T0 lights only the Estate (家産)
 *  pillar; Arms/Office/Name are added ADDITIVELY at their tier (T1+), never pre-declared. */
export interface Influence {
  readonly estate: PillarState;
}

/** What a single NPC remembers of what you said to THEM (interactive-intro plan §3.2). Per-NPC
 *  and independent — Beat 1 writes `soan`, Beat 3 writes `genemon`, never cross-feeding. Persists
 *  across ascension (the MC's history is durable — human decision 2026-07-02). */
export interface NpcMemory {
  /** The disposition tag an intro choice wrote — read by this NPC's later lines (per-NPC enum). */
  readonly regard: string; // e.g. 'grateful' | 'curt' | 'worried' (Sōan) | 'earnest' | 'wary' | 'steady' (Genemon)
  /** Signed warmth, -1|0|+1 — a coarse lever a later greeting can read. */
  readonly warmth: number;
}

/** Quest progress (T0-M4-F1 / ADR-037). `progress` holds the done STEP ids per quest (a set,
 *  stored as a JSON-friendly array); `completed` guards the one-time reward grant. */
export interface QuestState {
  readonly accepted: readonly string[];
  readonly progress: Readonly<Record<string, readonly string[]>>;
  readonly completed: readonly string[];
}

export interface Clock {
  /** Sub-day abstract tick (0 .. TICKS_PER_DAY-1 within a day; monotonic overall via day). */
  readonly tick: number;
  /** Absolute monotonic day since the cold open. Season/week/year derive from this (D-Q6). */
  readonly day: number;
}

export interface Character {
  readonly hp: number;
  readonly satiety: number;
  /** Unspent allocation POOL (granted +1 every 2 character levels, §4.4); spent into `attrs`. */
  readonly attributePoints: number;
  /** The manual 5-attribute build STR/AGI/INT/SPD/LUCK (§4.6.1). Each starts at ATTR_BASE (5),
   *  soft-cap ~30; feeds every derived combat stat (attackPower / defense / hpMax / accuracy /
   *  evasion / attackSpeed / crit / the INT bestiary bonus). No cross-feed from labour, no respec. */
  readonly attrs: Readonly<Record<AttrId, number>>;
  /** The combat (character) level — fed by combat-XP only (Q1/FU14). Floors at 1. */
  readonly level: number;
  /** Total combat XP earned from kills (level derives from it). */
  readonly combatXp: number;
}

/** The base 5-attribute block a fresh MC starts with (every attribute at ATTR_BASE). */
export function baseAttrs(): Record<AttrId, number> {
  return { str: ATTR_BASE, agi: ATTR_BASE, int: ATTR_BASE, spd: ATTR_BASE, luck: ATTR_BASE };
}

export interface GameState {
  readonly schemaVersion: number;
  readonly rng: Rng;
  readonly clock: Clock;
  /** The current season — STORED, MANUAL state (storywave G1 / ADR-153): a container the
   *  player ends with the `advance_season` intent, never derived from the day. */
  readonly season: Season;
  /** Count of season boundaries crossed (one per `advance_season`). `year()` derives from it;
   *  the seasonal judge + spoilage fire once per increment (the exit pipeline). */
  readonly seasonsPassed: number;
  readonly character: Character;
  /** Carried wealth — on you, at RISK on a lost fight (ADR-076 / batch-2 call 7). The carried
   *  pocket holds COIN (mon) + goods/materials (wood/sansai) ONLY — NEVER rice (ADR-163): rice is
   *  a commodity held solely in the kura, so a lost fight can never bleed the household's grain. */
  readonly resources: Readonly<Record<ResourceId, number>>;
  /** The kura (蔵) — the house STORES (ADR-163 / G4.5): rice held canonically in SHŌ (`banked.rice`,
   *  one integer; bales/koku are display conversions, never stored) + finished house goods. This is
   *  the KIND lane's reservoir — one-way barn-filling at T0 (no withdrawal verb): labour deposits,
   *  consumption/spoilage/the nengu draw. Loss-sheltered (a lost fight never touches it). */
  readonly banked: Readonly<Record<ResourceId, number>>;
  /** Per-(site, season) remaining production POOL (ADR-163 / G4.5), keyed by the labour site's
   *  `area` string. Working a site draws its pool down by diminishing returns (the yield curve
   *  reads it); it REFILLS to the season's peak at each `advance_season`. The soft cap on the KIND
   *  lane — output asymptotes within a season, so grinding one site flattens. */
  readonly sitePools: Readonly<Record<string, number>>;
  /** MON lane (ADR-163 / G4.5): game-days worked but not yet collected as wage. Incremented once
   *  per game-day the MC completes ≥1 timed labour act while waged (R5+); zeroed by the
   *  collect-at-the-board `collect_wage` verb. The fixed day-wage is a bounded faucet (no compounding). */
  readonly wageDaysAccrued: number;
  /** FB-324: total rakes this run — the spill is finite (balance.RAKE_CAP); the reducer refuses
   *  past it. Additive; a pre-cap save defaults 0. */
  readonly rakesDone: number;
  /** The last absolute `day` that credited a wage-day (dedupe — one accrual per game-day). -1 = none
   *  yet. Additive; a pre-wage save defaults it -1. */
  readonly lastWageDay: number;
  readonly flags: Readonly<Record<FlagId, boolean>>;
  /** Write-once reveal latch, in reveal order (PRD §6.2 core/unlock). A set, kept ordered. */
  readonly unlocked: readonly SurfaceId[];
  readonly log: LogState;

  // ── progression (M1+, additive) ──
  /** Per-skill XP; level is derived (PRD §4.5). */
  readonly skillXp: Readonly<Partial<Record<SkillId, number>>>;
  /** Ids of dialogue lines already delivered (the diegetic-mentor cursor, ADR-039/ADR-063). */
  readonly deliveredDialogue: readonly string[];
  /** Per-NPC memory written by the interactive intro's choices, read by that NPC's later lines
   *  (plan §3.2). Default `{}`; NEVER cleared on ascension (persists across the whole run). */
  readonly npcMemory: Readonly<Partial<Record<NpcId, NpcMemory>>>;
  /** The interactive-intro cursor (plan §3.3): -1 = pre-wake; 0..N-1 = at scene i;
   *  N (= DIALOGUE_SCENES.length) = intro done. `open_eyes` sets it to 0; the decisions advance it.
   *  The unit is now a dialogue SCENE (npc-dialogue-tree plan); the field name is kept `introBeat`
   *  so the migration + cursor stay trivial (scene order == old beat order). */
  readonly introBeat: number;
  /** The active rung-up story beat's TARGET rank, or `null` when no beat is live (ADR-110). A rung
   *  beat is ONE scene (greeting → optional ask-hub → one decision → apply), so a single nullable
   *  rank suffices (unlike the intro's 3-scene numeric `introBeat`). Set by `begin_rung_beat` when
   *  a promotion is ready + triggered; cleared by `choose_rung_option` after the promotion applies.
   *  Additive (default `null`); the ask-hub reuses `askedTopics`, story flags reuse `flags`, and
   *  relationships reuse `npcMemory` — so `rungBeat` is the ONLY new stored field. */
  readonly rungBeat: RankId | null;
  /** Topic ids the player has ASKED in the dialogue tree (across all scenes; ids are globally
   *  unique). Drives the hub's DIM state (asked topics stay + are re-askable — human fork
   *  2026-07-02) and the branch gates. Default `[]`; NEVER cleared on ascension (part of the run's
   *  history — `ascend` spreads state, so it carries through). */
  readonly askedTopics: readonly string[];
  /** Quest acceptance + per-step progress + completion (T0-M4-F1 / ADR-037). */
  readonly quests: QuestState;
  /** Per-RUN buy counts per market item — the stockCap clamp (TRADE taste, T0-M4-F3 / ADR-008). */
  readonly marketBought: Readonly<Record<string, number>>;
  /** Owned BELONGINGS — the ids of comfort furniture you've BOUGHT for your home (ADR-111 / FB-89). A
   *  category DISTINCT from resources + equipment: never consumed, never carried into a fight, never
   *  bitten by the ADR-113 loss. GRANTED keepsakes (the mat + bowl) are NOT stored here — they are
   *  auto-owned once the home surface latches (see selectors.ownedBelongingIds). Additive (default
   *  []); a lost fight never touches it. SCHEMA_VERSION 7. */
  readonly belongings: readonly string[];
  /** Where you stand on the small walkable estate map (T0-M4-F4 / ADR-065). Default the kura. */
  readonly location: MapNodeId;
  /** Current estate rung (Phase-1 ladder, PRD §3.2). */
  readonly rung: RankId;
  /** Per-requirement progress for the CURRENT rung (FB-121 / ADR-137) — keyed by the
   *  authored requirement id; count reqs 0..target, atomic (state/flag) reqs 0|1,
   *  completion latched. Reset to {} on promotion, exactly like the old meter.
   *  SCHEMA_VERSION 8 (replaces `rungMeter`). */
  readonly rungReqs: Readonly<Record<string, number>>;
  /** Kura-works PURCHASE stage U0…U4 (the coin upgrade ladder; ADR-098/ADR-107). The narrative
   *  CONDITION ladder E0–E5 is a SEPARATE axis (docs only). Flavour, not a sim; PRD §2.17. */
  readonly estateStage: number;
  /** Write-once DISCOVERY latch (ADR-146, mirrors `unlocked`): ids of node discoveries the player
   *  has found, in found order. Permanent ratchet — never cleared, survives ascension.
   *  SCHEMA_VERSION 9. */
  readonly discovered: readonly string[];
  /** Per-discovery qualifying-attempt counters (ADR-146): drives the seeded pity roll AND the
   *  tightening blurb hint. Plain counts (the roll itself rides the 'discovery' RNG stream).
   *  SCHEMA_VERSION 9. */
  readonly discoveryProgress: Readonly<Record<string, number>>;
  /** The tab-open auto-repeat labour target, or null (FU23). */
  readonly autoActivity: ActivityId | null;
  /** Auto-repeat the R0 rake (the meta verb has no ActivityId). Additive (default false); clears
   *  itself once raking is no longer legal (R1). Makes the ~5-min cold-open not a blind click-grind. */
  readonly autoRake: boolean;

  // ── combat (M2+, additive) ──
  readonly equippedWeapon: WeaponId;
  readonly weaponDurability: number;
  /** The tab-open auto-fight target, or null (the combat "leave it running", FU23). */
  readonly autoCombat: MobId | null;
  /** Auto-combat mode (batch-2 call 6): false = fight-to-death, true = auto-retreat @AUTO_RETREAT_FRAC.
   *  Additive (default false). */
  readonly autoCombatRetreat: boolean;
  /** Active combat stance (kendo kamae; PRD §2.8 D-Q-active-combat). */
  readonly stance: StanceId;

  // ── the tier spine (T0-M3+, additive; SCHEMA_VERSION 2) ──
  /** Current tier 0..6 (the seven-tier bible spine, ADR-150/ADR-152; enum widened from 0..5
   *  by the storywave rewrite — T1+ content is unaffected). Stored, bumped by the manual
   *  opt-in ascension. */
  readonly tier: number;
  /** House-Influence pillar accrual (Phase-2-gated; the macro engine, ADR-049/ADR-055). */
  readonly influence: Influence;

  // ── generalized VN scenes + the night-round runner (storywave G2, additive; DORMANT) ──
  /** The queue of scene ids waiting to open (FIFO — drains in enqueue order). Additive
   *  (default []); the registries ship EMPTY at G2, so nothing enqueues in the live arc. */
  readonly sceneQueue: SceneId[];
  /** The scene currently on screen + its beat cursor, or null when none is live (mirrors the
   *  rung-beat `rungBeat` cursor, but scene ids are strings). Additive (default null). */
  readonly activeScene: { id: SceneId; beat: number } | null;
  /** Write-once latch of scene ids already played (mirrors `unlocked`) — a `once` scene never
   *  re-fires. Additive (default []). */
  readonly scenesPlayed: string[];
  /** The in-flight night round + its stage cursor, or null when no round is running.
   *  Additive (default null); the gate surface + quest wiring arrive at G4. */
  readonly roundState: { roundId: string; stage: number } | null;

  /** Sōan's ledger (storywave G3 — ADR-155/ADR-164): a monotonic counter of DEFEATS — each lost
   *  fight / fallen night-round "grows Sōan's ledger", the sickroom's running tally of what the MC
   *  owes. The treatment/debt lane reads it from G4. Additive (default 0). */
  readonly soanLedger: number;
}

export function createInitialState(seed: number): GameState {
  return {
    schemaVersion: SCHEMA_VERSION,
    // The wheel opens on Winter (bible 05-world: Winter → New Year → Spring → Summer →
    // Bon → Autumn); the arc runs a full lived year, R7 gating on Autumn's nengu.
    season: 'winter',
    seasonsPassed: 0,
    rng: createRng(seed),
    clock: { tick: 0, day: 0 },
    character: {
      // level-1 hpMax = HP_BASE + HP_PER_LEVEL·1 + STR_HP·ATTR_BASE (§4.6.1) — a fresh MC opens
      // at full HP.
      hp: HP_BASE + HP_PER_LEVEL + STR_HP * ATTR_BASE,
      satiety: COLD_OPEN_SATIETY,
      attributePoints: 0,
      attrs: baseAttrs(),
      level: 1,
      combatXp: 0,
    },
    // ADR-163: the carried pocket holds COIN (mon) only at the cold open — goods/materials arrive as
    // labour earns them. Rice is NEVER carried; it lives only in the kura (`banked.rice`, in shō).
    resources: { coin: 0 },
    banked: { rice: 0 },
    // The season-turn production pools, filled for the opening Winter (ADR-163 / G4.5).
    sitePools: refillSitePools('winter'),
    wageDaysAccrued: 0,
    rakesDone: 0,
    lastWageDay: -1,
    flags: {},
    // The cold open shows exactly one verb against the dark of the kura.
    unlocked: ['screen-cold-open', 'verb-open-eyes'],
    log: emptyLog(),
    skillXp: {},
    deliveredDialogue: [],
    npcMemory: {},
    introBeat: -1, // pre-wake; open_eyes starts the intro at scene 0
    rungBeat: null, // no rung beat live until a ready promotion is triggered (ADR-110)
    askedTopics: [],
    quests: { accepted: [], progress: {}, completed: [] },
    marketBought: {},
    belongings: [], // no bought furniture yet; the granted mat + bowl arrive with the home at R1
    location: 'kura',
    rung: 'R0',
    rungReqs: {},
    estateStage: 0,
    discovered: [],
    discoveryProgress: {},
    autoActivity: null,
    autoRake: false,
    equippedWeapon: 'carrying_pole',
    weaponDurability: getWeapon('carrying_pole').durabilityMax,
    autoCombat: null,
    autoCombatRetreat: false,
    stance: 'chudan',
    tier: 0,
    influence: { estate: { value: 0, highWater: 0, judged: 0, frac: 0 } },
    // storywave G2 — dormant scene + night-round state (empty registries; nothing enqueues).
    sceneQueue: [],
    activeScene: null,
    scenesPlayed: [],
    roundState: null,
    soanLedger: 0,
  };
}

// ── tiny immutable helpers (structural sharing) ─────────────────────────────────

export function withResource(state: GameState, id: ResourceId, delta: number): GameState {
  const current = state.resources[id] ?? 0;
  return { ...state, resources: { ...state.resources, [id]: current + delta } };
}

/** Move into/out of the kura storehouse (the sheltered `banked` pool). Mirrors withResource;
 *  deposit/withdraw pair a +withBanked with a −withResource (and vice-versa). */
export function withBanked(state: GameState, id: ResourceId, delta: number): GameState {
  const current = state.banked[id] ?? 0;
  return { ...state, banked: { ...state.banked, [id]: current + delta } };
}

/** Draw down (or refill) a labour site's production pool by `delta` (ADR-163). Floors at 0 — a
 *  worked-out site yields nothing until the season refills it. */
export function withSitePool(state: GameState, site: string, delta: number): GameState {
  const current = state.sitePools[site] ?? 0;
  return { ...state, sitePools: { ...state.sitePools, [site]: Math.max(0, current + delta) } };
}

export function setFlag(state: GameState, id: FlagId, value = true): GameState {
  if (state.flags[id] === value) return state;
  return { ...state, flags: { ...state.flags, [id]: value } };
}

export function hasFlag(state: GameState, id: FlagId): boolean {
  return state.flags[id] === true;
}

export function addSkillXp(state: GameState, id: SkillId, amount: number): GameState {
  if (amount === 0) return state;
  const current = state.skillXp[id] ?? 0;
  return { ...state, skillXp: { ...state.skillXp, [id]: current + amount } };
}

/** Immutably fold a patch into one NPC's memory (plan §3.2). Independent per key: writing `soan`
 *  never touches `genemon`. Merges onto any prior memory for that NPC. */
export function rememberNpc(state: GameState, npc: NpcId, patch: Partial<NpcMemory>): GameState {
  const prior = state.npcMemory[npc] ?? { regard: '', warmth: 0 };
  const merged: NpcMemory = { ...prior, ...patch };
  return { ...state, npcMemory: { ...state.npcMemory, [npc]: merged } };
}

/** The disposition tag an NPC remembers for you — `''` when you've never spoken to them. */
export function npcRegard(state: GameState, npc: NpcId): string {
  return state.npcMemory[npc]?.regard ?? '';
}

/** DEEPEN one NPC's relationship (ADR-110 rung beats). Distinct from the intro's overwrite-only
 *  `rememberNpc`: `warmthDelta` ACCUMULATES onto the prior warmth (clamped to [-3, +3]), so a
 *  recurring granter's trust visibly deepens across rungs (Genemon R1→R4, Kihei R3→R5) rather than
 *  being re-stamped each meeting. `regard` overwrites only when present; absent ⇒ warmth-only. */
export function deepenNpc(
  state: GameState,
  npc: NpcId,
  patch: { readonly warmthDelta: number; readonly regard?: string },
): GameState {
  const prior = state.npcMemory[npc] ?? { regard: '', warmth: 0 };
  const merged: NpcMemory = {
    regard: patch.regard ?? prior.regard,
    warmth: clamp(prior.warmth + patch.warmthDelta, -3, 3),
  };
  return { ...state, npcMemory: { ...state.npcMemory, [npc]: merged } };
}

/** Mark a dialogue topic ASKED (npc-dialogue-tree plan §3.2). Idempotent — appends the id once, so
 *  re-asking a (re-askable) topic doesn't grow the set. Drives the hub's dim state + the branch
 *  gates; NEVER touches stats or memory (only the scene's decision does). */
export function markTopicAsked(state: GameState, topicId: string): GameState {
  if (state.askedTopics.includes(topicId)) return state;
  return { ...state, askedTopics: [...state.askedTopics, topicId] };
}
