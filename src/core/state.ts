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
import type { LogState } from './log';
import { emptyLog } from './log';
import { SCHEMA_VERSION } from './constants';
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
import type { SkillId } from './content/skills';
import type { MobId } from './content/enemies';
import { getWeapon, type WeaponId } from './content/weapons';
import type { MapNodeId } from './content/map';
import type { NpcId } from './content/voices';

export type SurfaceId = string;
export type ResourceId = string;
export type FlagId = string;

/** One House-Influence pillar's accrued standing (D-049/D-055). `value` is the live grade
 *  total (deeds + seasonal); `highWater` is the best `value` ever reached; `judged` is the
 *  high-water as of the LAST seasonal judge — the season judge fires only on a NEW high-water
 *  (highWater > judged), the 30% seasonal share. Phase-2-gated accrual (post-capstone, FU7). */
export interface PillarState {
  readonly value: number;
  readonly highWater: number;
  readonly judged: number;
}

/** House Influence (家威) — one pillar per tier (D-048). T0 lights only the Estate (家産)
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

/** Quest progress (T0-M4-F1 / D-037). `progress` holds the done STEP ids per quest (a set,
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
  readonly character: Character;
  /** Carried wealth — on you, at RISK on a lost fight (D-076 / batch-2 call 7). */
  readonly resources: Readonly<Record<ResourceId, number>>;
  /** The kura storehouse — resources SHELTERED from the lost-fight penalty. Deposit/withdraw move
   *  between this and `resources` (carried); spending + earning use carried (banked is a safe
   *  reserve). Additive (default {}); spatially gated to the kura node in Step 5. */
  readonly banked: Readonly<Record<ResourceId, number>>;
  readonly flags: Readonly<Record<FlagId, boolean>>;
  /** Write-once reveal latch, in reveal order (PRD §6.2 core/unlock). A set, kept ordered. */
  readonly unlocked: readonly SurfaceId[];
  readonly log: LogState;

  // ── progression (M1+, additive) ──
  /** Per-skill XP; level is derived (PRD §4.5). */
  readonly skillXp: Readonly<Partial<Record<SkillId, number>>>;
  /** Ids of dialogue lines already delivered (the diegetic-mentor cursor, D-039/D-063). */
  readonly deliveredDialogue: readonly string[];
  /** Per-NPC memory written by the interactive intro's choices, read by that NPC's later lines
   *  (plan §3.2). Default `{}`; NEVER cleared on ascension (persists across the whole run). */
  readonly npcMemory: Readonly<Partial<Record<NpcId, NpcMemory>>>;
  /** The interactive-intro cursor (plan §3.3): -1 = pre-wake; 0..N-1 = at beat i;
   *  N (= INTRO_BEATS.length) = intro done. `open_eyes` sets it to 0; the choices advance it. */
  readonly introBeat: number;
  /** Quest acceptance + per-step progress + completion (T0-M4-F1 / D-037). */
  readonly quests: QuestState;
  /** Per-RUN buy counts per market item — the stockCap clamp (TRADE taste, T0-M4-F3 / D-008). */
  readonly marketBought: Readonly<Record<string, number>>;
  /** Where you stand on the small walkable estate map (T0-M4-F4 / D-065). Default the kura. */
  readonly location: MapNodeId;
  /** Current estate rung (Phase-1 ladder, PRD §3.2). */
  readonly rung: RankId;
  /** The per-rung-reset Estate Service meter toward the next rung (PRD §4.1.1). */
  readonly rungMeter: number;
  /** Kura-works PURCHASE stage U0…U4 (the koku upgrade ladder; D-098). The narrative
   *  CONDITION ladder E0–E5 is a SEPARATE axis (docs only). Flavour, not a sim; PRD §2.17. */
  readonly estateStage: number;
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
  /** Current tier 0..5 (Estate-tut → Estate → Village → Region → Castle-town → Edo, D-048).
   *  Stored, bumped by the manual opt-in ascension; v1 ships T0→T3 (D-013a). */
  readonly tier: number;
  /** House-Influence pillar accrual (Phase-2-gated; the macro engine, D-049/D-055). */
  readonly influence: Influence;
}

export function createInitialState(seed: number): GameState {
  return {
    schemaVersion: SCHEMA_VERSION,
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
    resources: { koku: 0 },
    banked: {},
    flags: {},
    // The cold open shows exactly one verb against the dark of the kura.
    unlocked: ['screen-cold-open', 'verb-open-eyes'],
    log: emptyLog(),
    skillXp: {},
    deliveredDialogue: [],
    npcMemory: {},
    introBeat: -1, // pre-wake; open_eyes starts the intro at beat 0
    quests: { accepted: [], progress: {}, completed: [] },
    marketBought: {},
    location: 'kura',
    rung: 'R0',
    rungMeter: 0,
    estateStage: 0,
    autoActivity: null,
    autoRake: false,
    equippedWeapon: 'carrying_pole',
    weaponDurability: getWeapon('carrying_pole').durabilityMax,
    autoCombat: null,
    autoCombatRetreat: false,
    stance: 'chudan',
    tier: 0,
    influence: { estate: { value: 0, highWater: 0, judged: 0 } },
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
