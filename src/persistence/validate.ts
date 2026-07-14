// Load-validation at the persistence→core boundary (PRD §6.8 / D-Q9). Coerce-safe
// cosmetic out-of-range fields (clamp/default); route the structurally-broken to the
// recovery flow (never a dead wall, honours Q44). A foreign/wrong `app` id is
// rejected to recovery (Q46). Re-asserting up-only / trade-≤⅓ lands additively once
// pillars exist (M3+); the M0 shape is validated structurally here.

import type { GameState, StanceId, AttrId, Season, MerchantState } from '../core';
import type { RankId } from '../core';
import {
  APP_ID,
  SCHEMA_VERSION,
  APP_GENERATION,
  SEASONS,
  MAP_NODE_IDS,
  ATTR_IDS,
  ATTR_BASE,
  COLD_OPEN_HUNGER,
  HUNGER_MAX,
  INTRO_BEAT_COUNT,
  RANK_IDS,
  WEAPON_IDS,
  getWeapon,
  refillSitePools,
  toTierId,
  initialMerchants,
} from '../core';
import type { WeaponId } from '../core';
import type { SaveEnvelope } from './codec';
import { migrate, type MigrateFn } from './migrate';

export type ValidateResult =
  | { ok: true; state: GameState; coerced: boolean; migrated: boolean }
  /** `retired: true` marks a blob from a PRIOR app generation (ADR-161 clean break) — not a
   *  corruption; saveManager backs it up and boots fresh with a courteous notice, never a crash. */
  | { ok: false; reason: string; retired?: boolean };

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}

/** Hydrate the ADR-194 merchant map (v14, additive). Absent/malformed → the seeded roster;
 *  a present merchant keeps his saved purse + stock (each clamped to a non-negative integer),
 *  and any seeded merchant MISSING from the save is re-seeded (a merchant added in src/
 *  mid-generation is born whole, not a hole — the sitePools precedent). */
function validateMerchants(v: unknown): GameState['merchants'] {
  const seeded = initialMerchants();
  if (!isObject(v)) return seeded;
  const out: Record<string, MerchantState> = { ...seeded };
  for (const [id, raw] of Object.entries(v)) {
    if (!isObject(raw)) continue;
    const mon = Math.max(0, Math.floor(num(raw.mon, seeded[id]?.mon ?? 0).value));
    const stock: Record<string, number> = {};
    if (isObject(raw.stock)) {
      for (const [r, n] of Object.entries(raw.stock)) {
        if (typeof n === 'number' && Number.isFinite(n) && n > 0) stock[r] = Math.floor(n);
      }
    }
    out[id] = { mon, stock };
  }
  return out;
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
    // `frac`: the sub-koku deed accumulator (ADR-133), additive — absent on a pre-D-133 save = 0.
    // Clamp to [0, 1); a corrupt out-of-range frac is cosmetic (worth <1 koku), so coerce silently.
    const frac = Math.min(0.999999, Math.max(0, num(o.frac, 0).value));
    return { value, highWater, judged, frac };
  };
  const o = isObject(v) ? v : {};
  return { estate: pillar(o.estate) };
}

/** Hydrate the production pools PER KEY against the live site roster (save-format plan, step 3).
 *  A stored pool wins (a drawn-down site stays drawn; a 0 stays worked-out — depletion is a FACT);
 *  a site the save has never heard of is born FULL for the season, never dead-by-omission. A
 *  non-numeric stored value is junk, not a fact, and falls back to the fresh refill. */
function hydrateSitePools(stored: unknown, season: Season): GameState['sitePools'] {
  const pools: Record<string, number> = refillSitePools(season);
  if (isObject(stored)) {
    for (const [site, value] of Object.entries(stored)) {
      if (typeof value === 'number' && Number.isFinite(value)) pools[site] = Math.max(0, value);
    }
  }
  return pools as GameState['sitePools'];
}

/** Validate a candidate envelope; returns the (possibly coerced/migrated) GameState or a reject reason. */
export function validateEnvelope(raw: unknown, opts?: { migrate?: MigrateFn }): ValidateResult {
  if (!isObject(raw)) return { ok: false, reason: 'not-an-object' };
  if (raw.app !== APP_ID) return { ok: false, reason: 'foreign-or-missing-app-id' };
  // ── clean-break generation gate (ADR-161, storywave): a blob from a PRIOR generation — or one
  //    with NO `generation` field at all (every pre-storywave save) — RETIRES. It is not migrated
  //    and never crashes: the caller backs it up and boots fresh with a courteous notice (TST2). ──
  const generation = typeof raw.generation === 'number' ? raw.generation : 1;
  if (generation < APP_GENERATION)
    return { ok: false, reason: 'retired-generation', retired: true };
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
  // ADR-178 additive growth: the belly. ABSENT on a pre-split save = normal additive
  // hydration to the cold-open belly (numAdditive — never flags the mended-save notice).
  const hunger = numAdditive(character.hunger, COLD_OPEN_HUNGER);
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
    hunger: Math.min(HUNGER_MAX, Math.max(0, hunger.value)),
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
    validatedCharacter.hunger !== hunger.value ||
    validatedCharacter.attributePoints !== attributePoints.value ||
    validatedCharacter.level !== level.value ||
    validatedCharacter.combatXp !== combatXp.value;
  coerced =
    coerced ||
    hp.coerced ||
    satiety.coerced ||
    hunger.coerced ||
    attributePoints.coerced ||
    attrsCoerced ||
    level.coerced ||
    combatXp.coerced ||
    clampChanged;

  // --- collections (structural shape; default-safe) ---
  if (!isObject(rawState.resources)) return { ok: false, reason: 'resources-corrupt' };
  if (!isObject(rawState.flags)) return { ok: false, reason: 'flags-corrupt' };
  if (!Array.isArray(rawState.seenReveals)) return { ok: false, reason: 'seen-reveals-corrupt' };
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
    typeof base.location === 'string' && MAP_NODE_IDS.has(base.location)
      ? base.location
      : 'forecourt';
  if (base.location !== undefined && location !== base.location) coerced = true;

  // Compile-time ledger: every GameState key must be handled in the literal below.
  // Adding a new field to GameState without a validated default here is a tsc error.
  type _Handled =
    | 'schemaVersion'
    | 'rng'
    | 'clock'
    | 'season'
    | 'seasonsPassed'
    | 'character'
    | 'resources'
    | 'banked'
    | 'sitePools'
    | 'wageDaysAccrued'
    | 'rakesDone'
    | 'lastWageDay'
    | 'flags'
    | 'seenReveals'
    | 'log'
    | 'skillXp'
    | 'deliveredDialogue'
    | 'npcMemory'
    | 'introBeat'
    | 'rungBeat'
    | 'askedTopics'
    | 'quests'
    | 'marketBought'
    | 'merchants'
    | 'belongings'
    | 'location'
    | 'rung'
    | 'rungReqs'
    | 'estateStage'
    | 'discovered'
    | 'discoveryProgress'
    | 'autoActivity'
    | 'autoRake'
    | 'equippedWeapon'
    | 'weaponDurability'
    | 'autoCombat'
    | 'autoCombatRetreat'
    | 'stance'
    | 'tier'
    | 'influence'
    | 'sceneQueue'
    | 'activeScene'
    | 'scenesPlayed'
    | 'roundState'
    | 'soanLedger'
    | 'estateCommission'
    | 'estateWorkDone';
  type _AssertAllHandled = keyof GameState extends _Handled ? true : never;
  const _exhaustive: _AssertAllHandled = true;
  void _exhaustive;

  const resolvedSeason: Season =
    typeof base.season === 'string' && (SEASONS as readonly string[]).includes(base.season)
      ? (base.season as Season)
      : 'winter';

  // ── the equipped weapon + its wear (step 5 of the save-format plan) ────────────────────
  // `getWeapon` THROWS on an unknown id, so a weapon RENAMED or removed in src/ would ride
  // through a save and crash the UI at first render — the same class of bug the `location`
  // clamp above exists to prevent. Clamp to a real weapon (fallback: the starting pole).
  const resolvedWeapon: WeaponId =
    typeof base.equippedWeapon === 'string' && WEAPON_IDS.has(base.equippedWeapon)
      ? (base.equippedWeapon as WeaponId)
      : 'carrying_pole';
  if (base.equippedWeapon !== undefined && resolvedWeapon !== base.equippedWeapon) coerced = true;
  // Durability is bounded by the CURRENT def's durabilityMax, never a hardcoded 40: src/ is the
  // truth for how much wear a weapon can hold, so a rebalanced max re-clamps an old save's wear
  // on load. Absent → a full weapon (additive hydration, not a repair).
  const durabilityMax = getWeapon(resolvedWeapon).durabilityMax;
  const rawDurability = numAdditive(base.weaponDurability, durabilityMax);
  const resolvedDurability = Math.min(durabilityMax, Math.max(0, rawDurability.value));
  if (rawDurability.coerced || resolvedDurability !== rawDurability.value) coerced = true;

  // ── a WHITELIST rebuild, not a spread (save-format plan, step 2) ──────────────────────────
  // This literal is built from the explicitly-validated fields ONLY — there is deliberately no
  // `...base` spread. The `_Handled` ledger above makes that safe by construction: a new GameState
  // field without a validated default here is a tsc error, so the literal can never fall behind
  // the type. What the spread used to carry was therefore only ever JUNK — fields retired from
  // GameState (ADR-056's `balanceProfile`, and its successors) riding in saves forever. They now
  // age out on the first load. Note this is ONE-WAY per save: an unknown field is dropped, not
  // preserved. That is the point — the save holds the player's facts, and src/ decides what a fact
  // IS. A field we might want back needs a migration, not a spread.
  const state: GameState = {
    // Always current after migrate+validate (closes the inner/outer divergence, audit §3 #9).
    schemaVersion: SCHEMA_VERSION,
    rng: rng as unknown as GameState['rng'],
    clock: { tick: clock.tick, day: clock.day },
    // ── the six-season MANUAL calendar (v10, storywave G1). A clean-break v10 save always
    // carries them; still default safely (unknown season → the wheel's start; bad count → 0).
    season: resolvedSeason,
    seasonsPassed:
      typeof base.seasonsPassed === 'number' ? Math.max(0, Math.floor(base.seasonsPassed)) : 0,
    character: validatedCharacter,
    resources: rawState.resources as GameState['resources'],
    // additive (batch-2 call 7): the kura storehouse. Absent in any pre-bank save → empty (all
    // wealth carried), which is the correct fresh-bank default.
    banked: isObject(base.banked) ? (base.banked as GameState['banked']) : { rice: 0 },
    // ── the measured-kura production pools (v10, ADR-163 / G4.5) ──────────────────────────
    // Hydrated PER KEY, not all-or-nothing: readers do `sitePools[site] ?? 0`, so a key that is
    // merely MISSING reads as a worked-out site (yield 0). A site added or renamed in src/
    // mid-generation was therefore born DEAD until the next season refill — stale-by-omission,
    // the exact "the save out-votes src/" failure this plan exists to remove. A missing key now
    // hydrates from refillSitePools(season) — born full. A PRESENT key always wins, so a
    // drawn-down pool stays drawn and a 0 stays 0 (a depleted site is a fact, not a hole).
    sitePools: hydrateSitePools(base.sitePools, resolvedSeason),
    // MON lane wage accrual (v10, additive). Absent/malformed → not yet waged (0 / -1).
    wageDaysAccrued:
      typeof base.wageDaysAccrued === 'number' ? Math.max(0, Math.floor(base.wageDaysAccrued)) : 0,
    lastWageDay: typeof base.lastWageDay === 'number' ? Math.floor(base.lastWageDay) : -1,
    // FB-324 rake cap counter (v10, additive). Absent/malformed → 0.
    rakesDone: typeof base.rakesDone === 'number' ? Math.max(0, Math.floor(base.rakesDone)) : 0,
    flags: rawState.flags as GameState['flags'],
    seenReveals: rawState.seenReveals as GameState['seenReveals'],
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
    // The rung-beat cursor (v6, additive; ADR-110). A known rank id ⇒ resume the in-flight beat;
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
    // ── merchant permanent state (v14, additive; ADR-194). Absent (any pre-merchant save) →
    // the seeded roster (Yohei with his full seed purse — the correct fresh-counterparty
    // default, and idempotent: a present map is kept, so re-validating never re-grants).
    merchants: validateMerchants(base.merchants),
    // ── deep housing (v7, additive; ADR-111): the ids of BOUGHT comfort furniture. Absent (any
    // pre-housing save) → [] (owns no furniture — the correct fresh default); malformed → []. Matches
    // the v6→v7 migration. Granted keepsakes are derived, not stored, so they need no hydration.
    belongings: Array.isArray(base.belongings) ? (base.belongings as readonly string[]) : [],
    location,
    rung: base.rung ?? 'R0',
    // Per-requirement rung progress (v8, FB-121/ADR-137). Malformed -> {} (progress within
    // the current rung restarts -- the same deliberate default as the v7->v8 migration).
    rungReqs: isObject(base.rungReqs) ? (base.rungReqs as GameState['rungReqs']) : {},
    estateStage: typeof base.estateStage === 'number' ? base.estateStage : 0,
    // ADR-177 F3 — commission fields (older saves default to no work under way)
    estateCommission: typeof base.estateCommission === 'number' ? base.estateCommission : 0,
    estateWorkDone: typeof base.estateWorkDone === 'number' ? base.estateWorkDone : 0,
    // ── emergent node discovery (v9, additive; ADR-146): the write-once latch + attempt
    // counters. Absent (any pre-discovery save) → empty (found nothing yet — the correct fresh
    // default); malformed → empty. Matches the v8→v9 migration.
    discovered: Array.isArray(base.discovered) ? (base.discovered as readonly string[]) : [],
    discoveryProgress: isObject(base.discoveryProgress)
      ? (base.discoveryProgress as GameState['discoveryProgress'])
      : {},
    // ── in-flight automation is NOT restored on load (FB-32) ──────────────────────────────
    // A loaded save starts IDLE: the "currently auto-doing X" targets (auto-labour,
    // auto-rake, auto-fight) reset to their idle value regardless of what was persisted, so
    // a refresh never resumes auto-ing on its own — the player opts back in. We persist
    // PROGRESS, not in-flight automation. (autoCombatRetreat below is a persisted PREFERENCE,
    // not an active target — it only bites once autoCombat is re-armed — so it survives.)
    autoActivity: null,
    autoRake: false,
    equippedWeapon: resolvedWeapon,
    weaponDurability: resolvedDurability,
    autoCombat: null,
    autoCombatRetreat: base.autoCombatRetreat === true, // additive (call 6): default fight-to-death
    stance: (base.stance as StanceId) ?? 'chudan',
    // ── tier spine (v2, additive): default to a fresh T0 spine; migrate hydrates old saves ──
    tier: typeof base.tier === 'number' ? toTierId(base.tier) : 0,
    influence: validateInfluence(base.influence),
    // ── storywave G2 (v10, additive; DORMANT): the generalized-scene queue/cursor/latch +
    // the night-round cursor. Absent / malformed → the inert fresh defaults (nothing enqueued,
    // no scene or round live). Registries ship empty, so a clean-break v10 save carries none.
    sceneQueue: Array.isArray(base.sceneQueue) ? (base.sceneQueue as GameState['sceneQueue']) : [],
    activeScene: isObject(base.activeScene) ? (base.activeScene as GameState['activeScene']) : null,
    scenesPlayed: Array.isArray(base.scenesPlayed)
      ? (base.scenesPlayed as GameState['scenesPlayed'])
      : [],
    roundState: isObject(base.roundState) ? (base.roundState as GameState['roundState']) : null,
    // Sōan's defeat ledger (G3) — a non-negative counter; absent/malformed → 0 (fresh).
    soanLedger: typeof base.soanLedger === 'number' ? Math.max(0, Math.floor(base.soanLedger)) : 0,
  };

  return { ok: true, state, coerced, migrated: false };
}

export function envelopeIsOurs(raw: unknown): raw is SaveEnvelope {
  return isObject(raw) && raw.app === APP_ID;
}
