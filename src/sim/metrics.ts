// RunMetrics (F4 §2) — what one persona × seed run measures. Collected by classifying each
// dispatched intent + the state diff around its reduce (the playcheck reward-trace technique).
// The wall-time model is walkPacing's: the active loop dispatches ONE intent per AUTO_REPEAT_MS,
// so modeled wall-minutes = intents × AUTO_REPEAT_MS / 60000. Two intent counts are kept per rung:
// `intents` counts EVERY dispatch (moves + beats included — the truthful wall model), while the
// walkPacing-compatible buckets (acts/rests/meta) reproduce the pacing report's rows exactly, so
// the sim and the in-roster G-PACING gate can be equality-checked against each other (Ph1 DoD).

import type { GameState, Intent, RankId } from '../core';
import { balance, durabilityBand, getWeapon, hasFlag, satietyMax } from '../core';

export interface RungMetric {
  rung: RankId;
  threshold: number;
  /** walkPacing-compatible buckets: productive acts (rake/do_activity), rests, meta
   *  (open_eyes/face_wolf). walkCompatIntents = acts + rests + meta — MUST equal
   *  walkPacing()'s `intents` for R0–R2 on the canonical seed (the Ph1 equality DoD). */
  acts: number;
  rests: number;
  meta: number;
  /** The dispatches walkPacing does NOT bucket: map hops, VN beats (intro/rung/topic), fights,
   *  and everything else — counted so the wall model reflects EVERY dispatched intent. */
  moves: number;
  beats: number;
  fights: number;
  other: number;
  /** ALL intents dispatched while at this rung (the truthful wall-time numerator). */
  intents: number;
  wallMin: number;
}

export interface EconomySample {
  intent: number;
  rice: number;
  coin: number;
  bankedRice: number;
  bankedCoin: number;
  estate: number;
}

export interface RunMetrics {
  personaId: string;
  seed: number;
  ascended: boolean;
  totalIntents: number;
  totalWallMin: number;
  totalTicks: number;
  rungs: RungMetric[];
  economy: {
    samples: EconomySample[];
    endCoin: number;
    endRice: number;
    endEstate: number;
    maxCarriedCoin: number;
    maxCarriedRice: number;
    /** Intent index at which carried+banked coin first went positive (null = never). */
    firstCoinIntent: number | null;
    /** Intents spent inside Phase 2 (capstone → ascension) — the balance-watch #4 number. */
    phase2Intents: number | null;
  };
  combat: {
    fights: number;
    wins: number;
    losses: number;
    retreats: number;
    lossCoinBled: number;
    lossRiceBled: number;
  };
  starvation: {
    /** Intents dispatched at satiety 0 (crawling at the rate floor). */
    zeroSatietyIntents: number;
    /** Intents dispatched below the STAMINA_FLAT_ABOVE knee (throttled at all). */
    belowKneeIntents: number;
  };
  durability: {
    /** Intents dispatched with the weapon in the Battered/Broken bands. */
    batteredIntents: number;
  };
  /** The longest run of consecutive intents with NO progress signal — the raw number the Ph3
   *  soft-lock detector (SIM_SOFTLOCK_INTENTS) is calibrated against. Report-only in Ph1. */
  maxIntentsWithoutProgress: number;
  softLock: null | {
    reason: 'no-intent' | 'guard' | 'no-progress';
    atIntent: number;
    rung: RankId;
  };
}

/** Sample the economy curve every this-many intents (report terseness — F4 risk 6). */
export const SAMPLE_EVERY = 250;

const SAMPLE_MINUTES = (SAMPLE_EVERY * balance.AUTO_REPEAT_MS) / 60_000;
void SAMPLE_MINUTES; // ≈2 min of modeled play between samples at the 480 ms cadence

export function wallMinutes(intents: number): number {
  return (intents * balance.AUTO_REPEAT_MS) / 60_000;
}

/** walkPacing's bucket classification (pacing-report.ts) — kept byte-compatible on purpose. */
export function classifyIntent(
  intent: Intent,
): 'act' | 'rest' | 'meta' | 'move' | 'beat' | 'fight' | 'other' {
  switch (intent.type) {
    case 'rake_rice':
    case 'do_activity':
      return 'act';
    case 'rest':
      return 'rest';
    case 'open_eyes':
    case 'face_wolf':
      return 'meta';
    case 'move_to':
      return 'move';
    case 'advance_intro':
    case 'ask_topic':
    case 'choose_intro':
    case 'begin_rung_beat':
    case 'advance_rung_beat':
    case 'ask_rung_topic':
    case 'choose_rung_option':
      return 'beat';
    case 'fight':
      return 'fight';
    default:
      return 'other';
  }
}

/** Total wealth on hand — carried + banked coin (the first-coin signal reads this). */
function totalCoin(s: GameState): number {
  return (s.resources.coin ?? 0) + (s.banked.coin ?? 0);
}

/** Any forward movement a player would recognise — the progress-signal set (F4 §2 soft-lock).
 *  hp UP counts (mending is progress toward a fight); hp down does not (losing isn't). */
export function madeProgress(before: GameState, after: GameState): boolean {
  if (after.tier !== before.tier || after.rung !== before.rung) return true;
  if (after.rungMeter > before.rungMeter) return true;
  if (after.influence.estate.value > before.influence.estate.value) return true;
  const wealth = (s: GameState): number =>
    (s.resources.coin ?? 0) + (s.resources.rice ?? 0) + (s.banked.coin ?? 0) + (s.banked.rice ?? 0);
  if (wealth(after) > wealth(before)) return true;
  for (const [k, v] of Object.entries(after.skillXp)) {
    if ((v ?? 0) > (before.skillXp[k as keyof typeof before.skillXp] ?? 0)) return true;
  }
  if (after.character.combatXp > before.character.combatXp) return true;
  if (after.character.hp > before.character.hp) return true;
  if (after.unlocked.length > before.unlocked.length) return true;
  if (after.introBeat !== before.introBeat || after.rungBeat !== before.rungBeat) return true;
  return false;
}

/** The mutable accumulator one run drives. Pure inputs, plain-data output (JSON-comparable —
 *  the determinism assert diffs two of these byte-for-byte). */
export interface Collector {
  record(before: GameState, after: GameState, intent: Intent, index: number): void;
  finish(final: GameState, softLock: RunMetrics['softLock']): RunMetrics;
}

export function createCollector(personaId: string, seed: number): Collector {
  const rungs = new Map<RankId, RungMetric>();
  const samples: EconomySample[] = [];
  let maxCarriedCoin = 0;
  let maxCarriedRice = 0;
  let firstCoinIntent: number | null = null;
  let capstoneAtIntent: number | null = null;
  const combat = { fights: 0, wins: 0, losses: 0, retreats: 0, lossCoinBled: 0, lossRiceBled: 0 };
  const starvation = { zeroSatietyIntents: 0, belowKneeIntents: 0 };
  const durability = { batteredIntents: 0 };
  let sinceProgress = 0;
  let maxSinceProgress = 0;
  let total = 0;

  const touch = (rung: RankId): RungMetric => {
    let r = rungs.get(rung);
    if (!r) {
      r = {
        rung,
        threshold: balance.rungThreshold(rung),
        acts: 0,
        rests: 0,
        meta: 0,
        moves: 0,
        beats: 0,
        fights: 0,
        other: 0,
        intents: 0,
        wallMin: 0,
      };
      rungs.set(rung, r);
    }
    return r;
  };

  return {
    record(before, after, intent, index) {
      total = index + 1;
      const r = touch(before.rung);
      r.intents++;
      const kind = classifyIntent(intent);
      if (kind === 'act') r.acts++;
      else if (kind === 'rest') r.rests++;
      else if (kind === 'meta') r.meta++;
      else if (kind === 'move') r.moves++;
      else if (kind === 'beat') r.beats++;
      else if (kind === 'fight') r.fights++;
      else r.other++;

      // starvation + durability are read on the BEFORE state (the condition you acted under).
      if (before.character.satiety === 0) starvation.zeroSatietyIntents++;
      if (before.character.satiety < satietyMax(before) * balance.STAMINA_FLAT_ABOVE) {
        starvation.belowKneeIntents++;
      }
      const weapon = getWeapon(before.equippedWeapon);
      if (durabilityBand(before.weaponDurability, weapon.durabilityMax).mult <= 0.75) {
        durability.batteredIntents++;
      }

      // combat outcomes — grindable `fight` intents only (face_wolf is a scripted story beat).
      if (intent.type === 'fight') {
        combat.fights++;
        if (after.character.combatXp > before.character.combatXp) combat.wins++;
        else if (after.character.hp === balance.SETBACK_HP) {
          combat.losses++;
          combat.lossCoinBled += Math.max(
            0,
            (before.resources.coin ?? 0) - (after.resources.coin ?? 0),
          );
          combat.lossRiceBled += Math.max(
            0,
            (before.resources.rice ?? 0) - (after.resources.rice ?? 0),
          );
        } else combat.retreats++;
      }

      // economy signals
      maxCarriedCoin = Math.max(maxCarriedCoin, after.resources.coin ?? 0);
      maxCarriedRice = Math.max(maxCarriedRice, after.resources.rice ?? 0);
      if (firstCoinIntent === null && totalCoin(after) > 0) firstCoinIntent = total;
      if (capstoneAtIntent === null && hasFlag(after, 't0-capstone')) capstoneAtIntent = total;
      if (total % SAMPLE_EVERY === 0) {
        samples.push({
          intent: total,
          rice: after.resources.rice ?? 0,
          coin: after.resources.coin ?? 0,
          bankedRice: after.banked.rice ?? 0,
          bankedCoin: after.banked.coin ?? 0,
          estate: after.influence.estate.value,
        });
      }

      if (madeProgress(before, after)) sinceProgress = 0;
      else maxSinceProgress = Math.max(maxSinceProgress, ++sinceProgress);
    },

    finish(final, softLock) {
      for (const r of rungs.values()) r.wallMin = wallMinutes(r.intents);
      const ascended = final.tier > 0;
      return {
        personaId,
        seed,
        ascended,
        totalIntents: total,
        totalWallMin: wallMinutes(total),
        totalTicks: final.clock.day * 24 + final.clock.tick,
        // RANKS order is R0…R7 and Map preserves insertion order (rungs are entered in order),
        // but sort defensively so the output shape never depends on traversal order.
        rungs: [...rungs.values()].sort((a, b) => a.rung.localeCompare(b.rung)),
        economy: {
          samples,
          endCoin: (final.resources.coin ?? 0) + (final.banked.coin ?? 0),
          endRice: (final.resources.rice ?? 0) + (final.banked.rice ?? 0),
          endEstate: final.influence.estate.value,
          maxCarriedCoin,
          maxCarriedRice,
          firstCoinIntent,
          phase2Intents: ascended && capstoneAtIntent !== null ? total - capstoneAtIntent : null,
        },
        combat,
        starvation,
        durability,
        maxIntentsWithoutProgress: maxSinceProgress,
        softLock,
      };
    },
  };
}
