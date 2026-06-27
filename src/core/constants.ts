// Structural engine constants (NOT game-balance numbers — those live in
// content/balance.ts so generate-don't-duplicate can own them). These pin the
// save identity, the clock granularity, and the log ring cap.

/** App-identity magic field (PRD §6.8 / Q46): a foreign/wrong blob is rejected to recovery. */
export const APP_ID = 'kami-kakushi' as const;

/** Bumped only on a breaking save-schema change; additive growth needs no bump (PRD §6.8.2). */
export const SCHEMA_VERSION = 1 as const;

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

/** Real synodic month — the lunar phase is a continuous ephemeris, not a per-day roll (D-Q6). */
export const LUNAR_PERIOD_DAYS = 29.53 as const;
