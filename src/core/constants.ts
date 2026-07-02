// Structural engine constants (NOT game-balance numbers — those live in
// content/balance.ts so generate-don't-duplicate can own them). These pin the
// save identity, the clock granularity, and the log ring cap.

/** App-identity magic field (PRD §6.8 / Q46): a foreign/wrong blob is rejected to recovery. */
export const APP_ID = 'kami-kakushi' as const;

/** Bumped only on a breaking save-schema change; additive growth needs no bump (PRD §6.8.2).
 *  v2 = the 6-tier reshape (D-048): adds `tier` + `influence` (the macro spine).
 *  v3 = the interactive intro: adds `npcMemory` (per-NPC memory) + `introBeat` (the intro cursor).
 *  Pre-launch dev saves are wiped (D-067), but each forward step is a real, test-covered chain. */
export const SCHEMA_VERSION = 3 as const;

/** The event-log ring cap (PRD §6.4 / core/log): oldest entries evicted past this. */
export const LOG_RING_MAX = 300 as const;

/** Readability gate (audit §3 #3 / G-LOG): an auto-run must coalesce repeats — no more
 *  than this many byte-identical consecutive log lines. Provisional (v0.2) — tune by playtest. */
export const LOG_MAX_IDENTICAL_RUN = 3 as const;

// ── World clock (PRD §2.2 / §6.7.1) — only `tick` and `day` are stored; season,
// week and year are DERIVED on read (D-Q6), never persisted. ───────────────────
export const TICKS_PER_DAY = 24 as const;
export const DAYS_PER_WEEK = 7 as const;
export const DAYS_PER_SEASON = 28 as const;
export const SEASONS = ['spring', 'summer', 'autumn', 'winter'] as const;
export type Season = (typeof SEASONS)[number];

/** The Phase-2 RECKONING cadence (days) — how often the house is JUDGED (the seasonal-share bonus,
 *  §4.2 / D-049). **LIQUID (D-059).** Decoupled from the 28-day calendar `DAYS_PER_SEASON` on purpose:
 *  in the compressed T0 showcase a full season never turns inside the ~5-day Estate deed-grind, so a
 *  season-boundary judge fired **0×** before ascension (battery #8) — the house is reckoned on this
 *  SHORTER cadence so the mechanic is actually FELT in T0. Must stay **≤ the grind's day-span** so a
 *  judge is GUARANTEED before the EXCELLENT gate. (T1+, when Phase 2 is a long game, will scale this
 *  back toward the real 28-day season — a per-tier concern for when T1 is built.) */
export const PHASE2_JUDGE_INTERVAL_DAYS = 3 as const;

/** Real synodic month — the lunar phase is a continuous ephemeris, not a per-day roll (D-Q6). */
export const LUNAR_PERIOD_DAYS = 29.53 as const;
