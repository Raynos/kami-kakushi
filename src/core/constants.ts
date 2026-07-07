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
 *  Pre-launch dev saves are wiped (ADR-067), but each forward step is a real, test-covered chain. */
export const SCHEMA_VERSION = 9 as const;

/** FB-160/FB-161 (human, 2026-07-06): DURABLE log history (story/chat/progress) is
 *  UNBOUNDED — the whole point of the log is a memory that goes far, far back; a
 *  durable line is NEVER evicted. Only fleeting (ephemeral) lines are capped: they
 *  fade from the Now view in ~15s and need no deep history. */
export const LOG_EPHEMERAL_MAX = 100 as const;

/** Readability gate (audit §3 #3 / G-LOG): an auto-run must coalesce repeats — no more
 *  than this many byte-identical consecutive log lines. Provisional (v0.2) — tune by playtest. */
export const LOG_MAX_IDENTICAL_RUN = 3 as const;

// ── World clock (PRD §2.2 / §6.7.1) — only `tick` and `day` are stored; season,
// week and year are DERIVED on read (D-Q6), never persisted. ───────────────────
export const TICKS_PER_DAY = 24 as const;
export const DAYS_PER_WEEK = 7 as const;
/** FB-172 (human, 2026-07-06): the CALENDAR ran ~24× too fast — "I don't know how 4 years
 *  passed." Was 28; seasons/years now turn 24× slower (28×24=672 days/season) while the
 *  day/tick chain — and everything keyed on DAYS (the Phase-2 reckoning, day-keyed RNG) —
 *  is untouched, so the judged-economy cadence is byte-identical. CONSEQUENCE (flagged):
 *  season-driven events (kura spoilage, the autumn harvest boost) now fire ~24× more
 *  rarely — epoch events rather than session events; re-express them on a day cadence if
 *  the sink needs to stay felt (the human confirms after play). */
export const DAYS_PER_SEASON = 672 as const;
export const SEASONS = ['spring', 'summer', 'autumn', 'winter'] as const;
export type Season = (typeof SEASONS)[number];

/** The Phase-2 RECKONING cadence (days) — how often the house is JUDGED (the seasonal-share bonus,
 *  §4.2 / ADR-049). **LIQUID (ADR-059).** Decoupled from the 28-day calendar `DAYS_PER_SEASON` on purpose:
 *  in the compressed T0 showcase a full season never turns inside the ~5-day Estate deed-grind, so a
 *  season-boundary judge fired **0×** before ascension (battery #8) — the house is reckoned on this
 *  SHORTER cadence so the mechanic is actually FELT in T0. Must stay **≤ the grind's day-span** so a
 *  judge is GUARANTEED before the EXCELLENT gate. (T1+, when Phase 2 is a long game, will scale this
 *  back toward the real 28-day season — a per-tier concern for when T1 is built.) */
export const PHASE2_JUDGE_INTERVAL_DAYS = 3 as const;

/** Real synodic month — the lunar phase is a continuous ephemeris, not a per-day roll (D-Q6). */
export const LUNAR_PERIOD_DAYS = 29.53 as const;
