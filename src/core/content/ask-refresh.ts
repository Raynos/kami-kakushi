// FB-415 — the CLOSED ask-refresh vocabulary (D6). An `## ask` block's `refresh:` key
// names one of these; the fn derives the answer's freshness key from live state, and
// `asksHeard` stores that key at hear time — the ask reads heard only while the key
// still matches, so a state move un-hears it. A closed map on purpose (the grammar
// never grows toward code, FB-5): a new refresh axis is a reviewed entry HERE, and
// gen-narrative validates authored keys against this module at compile time.

import type { GameState } from '../state';
import { hpMax } from '../selectors';

export const ASK_REFRESH: Readonly<Record<string, (s: GameState) => string>> = {
  /** Moves on every promotion — Genemon's book-of-the-house reads. */
  rung: (s) => s.rung,
  /** Moves with the wheel — kitchen/news/field reads. */
  season: (s) => s.season,
  /** Moves when the works ladder moves (stage bought or commissioned). */
  works: (s) => `${s.estateStage}/${s.estateCommission}`,
  /** Moves between coarse health bands (thirds of hpMax) — Sōan's exam reads.
   *  Bands, not raw hp, so a single scratch doesn't spam "new". */
  health: (s) => String(Math.ceil((3 * s.character.hp) / hpMax(s))),
};

export const ASK_REFRESH_KINDS: ReadonlySet<string> = new Set(
  Object.keys(ASK_REFRESH),
);
