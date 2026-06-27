// Load-validation at the persistence→core boundary (PRD §6.8 / D-Q9). Coerce-safe
// cosmetic out-of-range fields (clamp/default); route the structurally-broken to the
// recovery flow (never a dead wall, honours Q44). A foreign/wrong `app` id is
// rejected to recovery (Q46). Re-asserting up-only / trade-≤⅓ lands additively once
// pillars exist (M3+); the M0 shape is validated structurally here.

import type { GameState, StanceId } from '../core';
import { APP_ID, SCHEMA_VERSION, balance } from '../core';
import type { SaveEnvelope } from './codec';

export type ValidateResult =
  | { ok: true; state: GameState; coerced: boolean }
  | { ok: false; reason: string };

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}

function num(v: unknown, fallback: number): { value: number; coerced: boolean } {
  if (typeof v === 'number' && Number.isFinite(v)) return { value: v, coerced: false };
  return { value: fallback, coerced: true };
}

/** Validate a candidate envelope; returns the (possibly coerced) GameState or a reject reason. */
export function validateEnvelope(raw: unknown): ValidateResult {
  if (!isObject(raw)) return { ok: false, reason: 'not-an-object' };
  if (raw.app !== APP_ID) return { ok: false, reason: 'foreign-or-missing-app-id' };
  if (typeof raw.schemaVersion !== 'number') return { ok: false, reason: 'missing-schema-version' };
  if (raw.schemaVersion > SCHEMA_VERSION) return { ok: false, reason: 'from-a-newer-version' };
  return validateState(raw.state);
}

/** Structural M0 validation + cosmetic coercion. */
export function validateState(rawState: unknown): ValidateResult {
  if (!isObject(rawState)) return { ok: false, reason: 'state-not-an-object' };
  let coerced = false;

  // --- RNG (structural; corruption here is unsalvageable) ---
  const rng = rawState.rng;
  if (
    !isObject(rng) ||
    typeof rng.seed !== 'number' ||
    !isObject(rng.cursors) ||
    typeof (rng.cursors as Record<string, unknown>).combat !== 'number'
  ) {
    return { ok: false, reason: 'rng-corrupt' };
  }

  // --- clock (structural) ---
  const clock = rawState.clock;
  if (!isObject(clock) || typeof clock.tick !== 'number' || typeof clock.day !== 'number') {
    return { ok: false, reason: 'clock-corrupt' };
  }

  // --- character (cosmetic-coercible) ---
  const character = rawState.character;
  if (!isObject(character)) return { ok: false, reason: 'character-corrupt' };
  const hp = num(character.hp, 1);
  const satiety = num(character.satiety, 0);
  const attributePoints = num(character.attributePoints, 0);
  const might = num(character.might, 0);
  const guard = num(character.guard, 0);
  const vigor = num(character.vigor, 0);
  const level = num(character.level, 1);
  const combatXp = num(character.combatXp, 0);
  coerced =
    coerced ||
    hp.coerced ||
    satiety.coerced ||
    attributePoints.coerced ||
    might.coerced ||
    guard.coerced ||
    vigor.coerced ||
    level.coerced;

  // --- collections (structural shape; default-safe) ---
  if (!isObject(rawState.resources)) return { ok: false, reason: 'resources-corrupt' };
  if (!isObject(rawState.flags)) return { ok: false, reason: 'flags-corrupt' };
  if (!Array.isArray(rawState.unlocked)) return { ok: false, reason: 'unlocked-corrupt' };
  const log = rawState.log;
  if (!isObject(log) || !Array.isArray(log.entries) || typeof log.seq !== 'number') {
    return { ok: false, reason: 'log-corrupt' };
  }

  // Spread the raw state FIRST so additive (M1+) fields ride along, then override
  // the validated/coerced core fields and default any missing additive fields
  // (additive-schema hydration, PRD §6.8.2).
  const base = rawState as unknown as GameState;
  const state: GameState = {
    ...base,
    schemaVersion:
      typeof rawState.schemaVersion === 'number' ? rawState.schemaVersion : SCHEMA_VERSION,
    rng: rng as unknown as GameState['rng'],
    clock: { tick: clock.tick, day: clock.day },
    character: {
      hp: Math.max(0, hp.value),
      satiety: Math.max(0, satiety.value),
      attributePoints: Math.max(0, attributePoints.value),
      might: Math.max(0, Math.floor(might.value)),
      guard: Math.max(0, Math.floor(guard.value)),
      vigor: Math.max(0, Math.floor(vigor.value)),
      level: Math.max(1, Math.floor(level.value)),
      combatXp: Math.max(0, combatXp.value),
    },
    resources: rawState.resources as GameState['resources'],
    flags: rawState.flags as GameState['flags'],
    unlocked: rawState.unlocked as GameState['unlocked'],
    // Normalize each loaded entry's coalescing count to ≥1 so a later pushLog onto a
    // pre-v0.2 (count-less) entry bumps a real number, never NaN.
    log: {
      entries: log.entries.map((e) => {
        const entry = e as Record<string, unknown>;
        const c = entry.count;
        return {
          ...entry,
          count: typeof c === 'number' && Number.isFinite(c) ? Math.max(1, Math.floor(c)) : 1,
        };
      }),
      seq: log.seq,
    } as unknown as GameState['log'],
    skillXp: base.skillXp ?? {},
    rung: base.rung ?? 'R0',
    rungMeter: typeof base.rungMeter === 'number' ? base.rungMeter : 0,
    estateStage: typeof base.estateStage === 'number' ? base.estateStage : 0,
    autoActivity: base.autoActivity ?? null,
    equippedWeapon: base.equippedWeapon ?? 'carrying_pole',
    weaponDurability: typeof base.weaponDurability === 'number' ? base.weaponDurability : 40,
    autoCombat: base.autoCombat ?? null,
    stance: (base.stance as StanceId) ?? 'chudan',
    // Legacy DEMO saves stay on DEMO (reversible, no surprise re-tune); only NEW games
    // pick up the boot profile (main.ts).
    balanceProfile:
      base.balanceProfile === 'real' || base.balanceProfile === 'demo'
        ? base.balanceProfile
        : balance.DEFAULT_BALANCE_PROFILE,
  };

  return { ok: true, state, coerced };
}

export function envelopeIsOurs(raw: unknown): raw is SaveEnvelope {
  return isObject(raw) && raw.app === APP_ID;
}
