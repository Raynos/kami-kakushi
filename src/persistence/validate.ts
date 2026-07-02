// Load-validation at the persistence→core boundary (PRD §6.8 / D-Q9). Coerce-safe
// cosmetic out-of-range fields (clamp/default); route the structurally-broken to the
// recovery flow (never a dead wall, honours Q44). A foreign/wrong `app` id is
// rejected to recovery (Q46). Re-asserting up-only / trade-≤⅓ lands additively once
// pillars exist (M3+); the M0 shape is validated structurally here.

import type { GameState, StanceId, AttrId } from '../core';
import type { RankId } from '../core';
import {
  APP_ID,
  SCHEMA_VERSION,
  MAP_NODE_IDS,
  ATTR_IDS,
  ATTR_BASE,
  INTRO_BEAT_COUNT,
  RANK_IDS,
} from '../core';
import type { SaveEnvelope } from './codec';
import { migrate, type MigrateFn } from './migrate';

export type ValidateResult =
  | { ok: true; state: GameState; coerced: boolean; migrated: boolean }
  | { ok: false; reason: string };

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}

function num(v: unknown, fallback: number): { value: number; coerced: boolean } {
  if (typeof v === 'number' && Number.isFinite(v)) return { value: v, coerced: false };
  return { value: fallback, coerced: true };
}

// For ADDITIVE (later-milestone) numeric fields: an ABSENT field is normal additive
// hydration of an older save, NOT a repair — so it must not trip the "we mended a small
// problem" load notice. Only a PRESENT-but-invalid value counts as a coercion.
function numAdditive(v: unknown, fallback: number): { value: number; coerced: boolean } {
  if (v === undefined) return { value: fallback, coerced: false };
  return num(v, fallback);
}

/** Coerce the additive `influence` macro field to a valid shape (default all-zero). Each
 *  pillar's high-water is held ≥ its value (it is a high-WATER mark). Absent = fresh spine. */
function validateInfluence(v: unknown): GameState['influence'] {
  const pillar = (p: unknown): GameState['influence']['estate'] => {
    const o = isObject(p) ? p : {};
    const value = Math.max(0, num(o.value, 0).value);
    const highWater = Math.max(value, num(o.highWater, 0).value);
    const judged = Math.min(highWater, Math.max(0, num(o.judged, 0).value));
    return { value, highWater, judged };
  };
  const o = isObject(v) ? v : {};
  return { estate: pillar(o.estate) };
}

/** Validate a candidate envelope; returns the (possibly coerced/migrated) GameState or a reject reason. */
export function validateEnvelope(raw: unknown, opts?: { migrate?: MigrateFn }): ValidateResult {
  if (!isObject(raw)) return { ok: false, reason: 'not-an-object' };
  if (raw.app !== APP_ID) return { ok: false, reason: 'foreign-or-missing-app-id' };
  if (typeof raw.schemaVersion !== 'number') return { ok: false, reason: 'missing-schema-version' };
  if (raw.schemaVersion > SCHEMA_VERSION) return { ok: false, reason: 'from-a-newer-version' };
  // ── migration safety net (PRD §6.8.2): bring an OLD save's state to current schema
  //    BEFORE structural validation. Additive growth needs none; this runs only when a
  //    stored schemaVersion < SCHEMA_VERSION has a registered step. ──
  const run = opts?.migrate ?? migrate;
  const migratedState =
    raw.schemaVersion < SCHEMA_VERSION ? run(raw.state, raw.schemaVersion) : raw.state;
  const didMigrate = raw.schemaVersion < SCHEMA_VERSION && migratedState !== raw.state;
  const res = validateState(migratedState);
  if (!res.ok) return res;
  return { ...res, migrated: didMigrate, coerced: res.coerced || didMigrate };
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
  const level = num(character.level, 1);
  const combatXp = num(character.combatXp, 0);
  // The 5-attribute build (§4.6.1). An ABSENT `attrs` (an old 3-attr/might-guard-vigor save, or a
  // fresh pre-combat one) hydrates to ATTR_BASE additively — NOT a repair; a PRESENT-but-invalid
  // attr value IS a coercion. Stale might/guard/vigor fields are simply ignored (they age out).
  const rawAttrs = isObject(character.attrs) ? character.attrs : undefined;
  const attrs = {} as Record<AttrId, number>;
  let attrsCoerced = false;
  for (const id of ATTR_IDS) {
    const a = numAdditive(rawAttrs?.[id], ATTR_BASE);
    const v = Math.max(0, Math.floor(a.value));
    attrs[id] = v;
    if (a.coerced || v !== a.value) attrsCoerced = true;
  }
  const validatedCharacter: GameState['character'] = {
    hp: Math.max(0, hp.value),
    satiety: Math.max(0, satiety.value),
    attributePoints: Math.max(0, attributePoints.value),
    attrs,
    level: Math.max(1, Math.floor(level.value)),
    combatXp: Math.max(0, combatXp.value),
  };
  // An out-of-range vital we had to clamp IS a coercion (e.g. a negative hp → 0): flag it
  // alongside the wrong-type coercions so the "we mended a small problem" load notice
  // (main.ts) actually fires for the most common repair, not just non-numeric corruption.
  const clampChanged =
    validatedCharacter.hp !== hp.value ||
    validatedCharacter.satiety !== satiety.value ||
    validatedCharacter.attributePoints !== attributePoints.value ||
    validatedCharacter.level !== level.value ||
    validatedCharacter.combatXp !== combatXp.value;
  coerced =
    coerced ||
    hp.coerced ||
    satiety.coerced ||
    attributePoints.coerced ||
    attrsCoerced ||
    level.coerced ||
    combatXp.coerced ||
    clampChanged;

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
  const base = rawState as unknown as Partial<GameState>; // honest: fields may be absent/defaulted below

  // A corrupt `location` must NOT reach the renderer: getNode() throws on an unknown node id and
  // crashes the whole UI on load. Clamp to a real map node (fallback the always-open kura); only a
  // PRESENT-but-invalid value counts as a coercion (a missing one is a fresh/old-save default).
  const location: GameState['location'] =
    typeof base.location === 'string' && MAP_NODE_IDS.has(base.location) ? base.location : 'kura';
  if (base.location !== undefined && location !== base.location) coerced = true;

  // Compile-time ledger: every GameState key must be handled in the literal below.
  // Adding a new field to GameState without a validated default here is a tsc error.
  type _Handled =
    | 'schemaVersion'
    | 'rng'
    | 'clock'
    | 'character'
    | 'resources'
    | 'banked'
    | 'flags'
    | 'unlocked'
    | 'log'
    | 'skillXp'
    | 'deliveredDialogue'
    | 'npcMemory'
    | 'introBeat'
    | 'rungBeat'
    | 'askedTopics'
    | 'quests'
    | 'marketBought'
    | 'belongings'
    | 'location'
    | 'rung'
    | 'rungMeter'
    | 'estateStage'
    | 'autoActivity'
    | 'autoRake'
    | 'equippedWeapon'
    | 'weaponDurability'
    | 'autoCombat'
    | 'autoCombatRetreat'
    | 'stance'
    | 'tier'
    | 'influence';
  type _AssertAllHandled = keyof GameState extends _Handled ? true : never;
  const _exhaustive: _AssertAllHandled = true;
  void _exhaustive;

  const state: GameState = {
    ...base,
    // Always current after migrate+validate (closes the inner/outer divergence, audit §3 #9).
    schemaVersion: SCHEMA_VERSION,
    rng: rng as unknown as GameState['rng'],
    clock: { tick: clock.tick, day: clock.day },
    character: validatedCharacter,
    resources: rawState.resources as GameState['resources'],
    // additive (batch-2 call 7): the kura storehouse. Absent in any pre-bank save → empty (all
    // wealth carried), which is the correct fresh-bank default.
    banked: isObject(base.banked) ? (base.banked as GameState['banked']) : {},
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
    deliveredDialogue: Array.isArray(base.deliveredDialogue) ? base.deliveredDialogue : [],
    // ── interactive intro (v3, additive) ──
    // Per-NPC memory: an object (default {}); persists across ascension. A malformed value → {}.
    npcMemory: isObject(base.npcMemory) ? (base.npcMemory as GameState['npcMemory']) : {},
    // The intro cursor. Absent (a pre-intro save) → intro-DONE if already awake, else pre-wake (-1),
    // matching the v2→v3 migration so a partially-hydrated blob still lands coherently.
    introBeat:
      typeof base.introBeat === 'number'
        ? base.introBeat
        : (rawState.flags as Record<string, unknown>).awake === true
          ? INTRO_BEAT_COUNT
          : -1,
    // The rung-beat cursor (v6, additive; D-110). A known rank id ⇒ resume the in-flight beat;
    // absent / malformed / unknown ⇒ null (no beat live — the correct inert default). Matches the
    // v5→v6 migration.
    rungBeat:
      typeof base.rungBeat === 'string' && RANK_IDS.has(base.rungBeat)
        ? (base.rungBeat as RankId)
        : null,
    // The dialogue-tree ask-hub set (v4, additive). Absent (any pre-tree save) → [] (nothing asked
    // yet, the correct fresh default); a malformed value → []. Matches the v3→v4 migration.
    askedTopics: Array.isArray(base.askedTopics) ? (base.askedTopics as readonly string[]) : [],
    quests: isObject(base.quests)
      ? (base.quests as GameState['quests'])
      : { accepted: [], progress: {}, completed: [] },
    marketBought: isObject(base.marketBought)
      ? (base.marketBought as GameState['marketBought'])
      : {},
    // ── deep housing (v7, additive; D-111): the ids of BOUGHT comfort furniture. Absent (any
    // pre-housing save) → [] (owns no furniture — the correct fresh default); malformed → []. Matches
    // the v6→v7 migration. Granted keepsakes are derived, not stored, so they need no hydration.
    belongings: Array.isArray(base.belongings) ? (base.belongings as readonly string[]) : [],
    location,
    rung: base.rung ?? 'R0',
    rungMeter: typeof base.rungMeter === 'number' ? base.rungMeter : 0,
    estateStage: typeof base.estateStage === 'number' ? base.estateStage : 0,
    // ── in-flight automation is NOT restored on load (F32) ──────────────────────────────
    // A loaded save starts IDLE: the "currently auto-doing X" targets (auto-labour,
    // auto-rake, auto-fight) reset to their idle value regardless of what was persisted, so
    // a refresh never resumes auto-ing on its own — the player opts back in. We persist
    // PROGRESS, not in-flight automation. (autoCombatRetreat below is a persisted PREFERENCE,
    // not an active target — it only bites once autoCombat is re-armed — so it survives.)
    autoActivity: null,
    autoRake: false,
    equippedWeapon: base.equippedWeapon ?? 'carrying_pole',
    weaponDurability: typeof base.weaponDurability === 'number' ? base.weaponDurability : 40,
    autoCombat: null,
    autoCombatRetreat: base.autoCombatRetreat === true, // additive (call 6): default fight-to-death
    stance: (base.stance as StanceId) ?? 'chudan',
    // ── tier spine (v2, additive): default to a fresh T0 spine; migrate hydrates old saves ──
    tier: typeof base.tier === 'number' ? Math.max(0, Math.floor(base.tier)) : 0,
    influence: validateInfluence(base.influence),
    // (D-056: the balanceProfile field is RETIRED from GameState — nothing reads it any more.
    // A legacy save's stray `balanceProfile` rides through inertly via the `...base` spread above
    // [harmless dead data; this builder is additive-tolerant by design, NOT a whitelist rebuild];
    // new games never write it, so it simply ages out.)
  };

  return { ok: true, state, coerced, migrated: false };
}

export function envelopeIsOurs(raw: unknown): raw is SaveEnvelope {
  return isObject(raw) && raw.app === APP_ID;
}
