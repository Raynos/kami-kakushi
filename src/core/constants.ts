// Structural engine constants (NOT game-balance numbers — those live in
// content/balance.ts so generate-don't-duplicate can own them). These pin the
// save identity, the clock granularity, and the log ring cap.

/** App-identity magic field (PRD §6.8 / Q46): a foreign/wrong blob is rejected to recovery. */
export const APP_ID = 'kami-kakushi' as const;

/** Bumped only on a breaking save-schema change; additive growth needs no bump (PRD §6.8.2).
 *  v2 = the 6-tier reshape (ADR-048): adds `tier` + `influence` (the macro spine).
 *  v3 = the interactive intro: adds `npcMemory` (per-NPC memory) + `introBeat` (the intro cursor).
 *  v4 = the NPC dialogue TREE: adds `askedTopics` (the ask-hub dim/gate set); `introBeat` carries
 *  over unchanged (scene order == old beat order).
 *  v5 = the RICE/COIN/KOKU economy re-core (ADR-107): renames the carried+banked `koku` resource key
 *  to `coin` (the spendable currency) and adds `rice` (a real resource); koku leaves `resources`
 *  entirely (it is now House STANDING, in `influence`).
 *  v6 = the rung-up STORY BEAT (ADR-110): adds `rungBeat` (the active rung beat's target rank, or
 *  null). Additive — an in-flight save defaults it inert (a ready promotion just shows the header
 *  affordance on load; an already-promoted save is unaffected).
 *  v7 = DEEP HOUSING (ADR-111 / FB-89): adds `belongings` (the ids of BOUGHT comfort furniture for the
 *  home). Additive — an old save defaults it `[]` (owns no furniture; the granted mat + bowl are
 *  derived from the home surface, not stored, so they back-reveal for any R1+ save).
 *  v9 = EMERGENT NODE DISCOVERY (ADR-146): adds the `discovered` write-once latch +
 *  `discoveryProgress` attempt counters, and the `discovery` RNG stream cursor. Additive — an old
 *  save has found nothing yet (both default empty; the cursor hydrates 0).
 *  v10 = THE STORYWAVE T0 REWRITE (ADR-150 wave, game plan G1): the six-season MANUAL
 *  calendar (stored `season`/`seasonsPassed`), rice as measured kura-units + per-site
 *  production pools, and the CLEAN BREAK — this is a new APP_GENERATION, so a
 *  pre-generation blob RETIRES (courteous notice + backup) rather than migrating
 *  (ADR-161). MIGRATIONS 1–9 are deleted; the chain restarts empty at v10.
 *  Pre-launch dev saves are wiped (ADR-067), but each forward step is a real, test-covered chain.
 *  v11 = DERIVED REVEAL (ADR-179): the stored `unlocked` visibility latch is DELETED — visibility
 *  derives from progression facts (core/unlock visibleSet); the new `seenReveals` announce-once
 *  ceremony latch is seeded from the old field (plus a `coin-earned` fact-flag where the old
 *  latch is the only record of a first wage).
 *  v14 = MERCHANT STATE (ADR-194): additive `merchants` map (purse + stock per merchant) —
 *  an absent field hydrates to the seeded roster on load (validate), so the migration is
 *  the identity; the bump records the format change.
 *  v15 = ASK HEARD-STATE (FB-415): additive `asksHeard` map (askId → freshness key) —
 *  an absent field hydrates to `{}` on load (validate — no ask heard yet, the correct
 *  fresh default), so the migration is the identity; the bump records the format change. */
export const SCHEMA_VERSION = 15 as const;

/** App GENERATION (ADR-161, storywave clean break): bumped when the state model breaks so
 *  hard that migration is not worth carrying. A saved blob with a generation below this
 *  RETIRES — the save is backed up untouched and the game boots fresh with a courteous
 *  in-fiction notice — never a crash, never a silent wipe. Distinct from SCHEMA_VERSION,
 *  which still governs additive within-generation growth. */
export const APP_GENERATION = 2 as const;

/** FB-160/FB-161 (human, 2026-07-06): DURABLE log history (story/chat/progress) is
 *  UNBOUNDED — the whole point of the log is a memory that goes far, far back; a
 *  durable line is NEVER evicted. Only fleeting (ephemeral) lines are capped: they
 *  fade from the Now view in ~15s and need no deep history. */
export const LOG_EPHEMERAL_MAX = 100 as const;

/** Readability gate (audit §3 #3 / G-LOG): an auto-run must coalesce repeats — no more
 *  than this many byte-identical consecutive log lines. Provisional (v0.2) — tune by playtest. */
export const LOG_MAX_IDENTICAL_RUN = 3 as const;

// ── World clock (PRD §2.2 / §6.7.1) — only `tick`, `day` and now `season` are stored;
// week and year are DERIVED on read (D-Q6). ────────────────────────────────────
export const TICKS_PER_DAY = 24 as const;
export const DAYS_PER_WEEK = 7 as const;

/** Day of the week, 0..6 — derived from the absolute `day` (day % DAYS_PER_WEEK). Yohei's stall
 *  (content/market.ts) is open only on named `DayOfWeek`s — the market-day scarcity that pulls the
 *  wheel (ADR-163 / G4.5). */
export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export function dayOfWeek(day: number): DayOfWeek {
  return (((day % DAYS_PER_WEEK) + DAYS_PER_WEEK) % DAYS_PER_WEEK) as DayOfWeek;
}

/** Day-name canon (FB-333, human 2026-07-10): **day 0 = Monday 月** — the day the river
 *  gives him up. The clock reads season + weekday only (no year, no day counter); Yohei's
 *  market days (weekdays 2 & 5) land on Wednesday 水 and Saturday 土. Kanji first, the
 *  woodblock English+kanji pairing. */
export const DAY_OF_WEEK_NAMES: readonly {
  readonly kanji: string;
  readonly name: string;
}[] = [
  { kanji: '月', name: 'Monday' },
  { kanji: '火', name: 'Tuesday' },
  { kanji: '水', name: 'Wednesday' },
  { kanji: '木', name: 'Thursday' },
  { kanji: '金', name: 'Friday' },
  { kanji: '土', name: 'Saturday' },
  { kanji: '日', name: 'Sunday' },
] as const;

/** The six-season wheel (story bible `05-world.md`, storywave G1 — ADR-150/ADR-153). The
 *  season is now STORED, MANUAL state (`state.season`), NOT derived from the day: a season is
 *  a CONTAINER the player fills at their own pace and ends with the `advance_season` intent.
 *  The fixed per-season day-count is gone — the day/tick chain still advances (the day-of-week
 *  clock reads from `day`), but the season only turns by intent. Order is the wheel's, rotating
 *  cleanly: Winter → New Year → Spring → Summer → Bon → Autumn. */
export const SEASONS = [
  'winter',
  'new-year',
  'spring',
  'summer',
  'bon',
  'autumn',
] as const;
export type Season = (typeof SEASONS)[number];

/** Real synodic month — the lunar phase is a continuous ephemeris, not a per-day roll (D-Q6).
 *  The new-moon mysteries (the hooded lantern crossing, G2) key off `lunarPhase()`; there is
 *  only ONE moon — do not build a second. */
export const LUNAR_PERIOD_DAYS = 29.53 as const;

// ── Rice unit ladder (measured kura-units, ADR-163 / G4.5) ──────────────────────
// Rice is stored canonically in shō (升) as ONE integer, held ONLY in the kura
// (`banked.rice`). Bales (俵) and koku (石) are DISPLAY conversions (÷ these
// constants), NEVER separately stored — one source of truth, no float drift. The
// kura reads in bales; wages/meals read in shō; the nengu is stated in koku. The
// player never sees a raw "N rice" integer (TST4).
//
// SIM-OWNED SEED (ADR-132): the rough period ladder is ~100 shō = 1 koku, 1 bale ≈
// 0.4 koku (= 40 shō). Exact ratios are the sim's to verdict — do NOT hand-tune.
export const SHO_PER_KOKU = 100 as const; // SIM-OWNED SEED (ADR-132)
export const SHO_PER_BALE = 40 as const; // 1 bale ≈ 0.4 koku — SIM-OWNED SEED (ADR-132)
