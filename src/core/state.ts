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
import { HP_BASE, COLD_OPEN_SATIETY, type StanceId } from './content/balance';
import type { RankId } from './content/ranks';
import type { ActivityId } from './content/activities';
import type { SkillId } from './content/skills';
import type { MobId } from './content/enemies';
import { getWeapon, type WeaponId } from './content/weapons';

export type SurfaceId = string;
export type ResourceId = string;
export type FlagId = string;

export interface Clock {
  /** Sub-day abstract tick (0 .. TICKS_PER_DAY-1 within a day; monotonic overall via day). */
  readonly tick: number;
  /** Absolute monotonic day since the cold open. Season/week/year derive from this (D-Q6). */
  readonly day: number;
}

export interface Character {
  readonly hp: number;
  readonly satiety: number;
  /** Unspent allocation POOL (granted on level-up); spent into might/guard/vigor. */
  readonly attributePoints: number;
  /** Spent allocations — the manual Might/Guard/Vigor build (audit #5). Feed combat. */
  readonly might: number;
  readonly guard: number;
  readonly vigor: number;
  /** The combat (character) level — fed by combat-XP only (Q1/FU14). Floors at 1. */
  readonly level: number;
  /** Total combat XP earned from kills (level derives from it). */
  readonly combatXp: number;
}

export interface GameState {
  readonly schemaVersion: number;
  readonly rng: Rng;
  readonly clock: Clock;
  readonly character: Character;
  readonly resources: Readonly<Record<ResourceId, number>>;
  readonly flags: Readonly<Record<FlagId, boolean>>;
  /** Write-once reveal latch, in reveal order (PRD §6.2 core/unlock). A set, kept ordered. */
  readonly unlocked: readonly SurfaceId[];
  readonly log: LogState;

  // ── progression (M1+, additive) ──
  /** Per-skill XP; level is derived (PRD §4.5). */
  readonly skillXp: Readonly<Partial<Record<SkillId, number>>>;
  /** Current estate rung (Phase-1 ladder, PRD §3.2). */
  readonly rung: RankId;
  /** The per-rung-reset Estate Service meter toward the next rung (PRD §4.1.1). */
  readonly rungMeter: number;
  /** Estate growth stage E0…E3 (flavour, not a sim; PRD §2.17). */
  readonly estateStage: number;
  /** The tab-open auto-repeat labour target, or null (FU23). */
  readonly autoActivity: ActivityId | null;

  // ── combat (M2+, additive) ──
  readonly equippedWeapon: WeaponId;
  readonly weaponDurability: number;
  /** The tab-open auto-fight target, or null (the combat "leave it running", FU23). */
  readonly autoCombat: MobId | null;
  /** Active combat stance (kendo kamae; PRD §2.8 D-Q-active-combat). */
  readonly stance: StanceId;
}

export function createInitialState(seed: number): GameState {
  return {
    schemaVersion: SCHEMA_VERSION,
    rng: createRng(seed),
    clock: { tick: 0, day: 0 },
    character: {
      hp: HP_BASE,
      satiety: COLD_OPEN_SATIETY,
      attributePoints: 0,
      might: 0,
      guard: 0,
      vigor: 0,
      level: 1,
      combatXp: 0,
    },
    resources: { koku: 0 },
    flags: {},
    // The cold open shows exactly one verb against the dark of the kura.
    unlocked: ['screen-cold-open', 'verb-open-eyes'],
    log: emptyLog(),
    skillXp: {},
    rung: 'R0',
    rungMeter: 0,
    estateStage: 0,
    autoActivity: null,
    equippedWeapon: 'carrying_pole',
    weaponDurability: getWeapon('carrying_pole').durabilityMax,
    autoCombat: null,
    stance: 'chudan',
  };
}

// ── tiny immutable helpers (structural sharing) ─────────────────────────────────

export function withResource(state: GameState, id: ResourceId, delta: number): GameState {
  const current = state.resources[id] ?? 0;
  return { ...state, resources: { ...state.resources, [id]: current + delta } };
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
