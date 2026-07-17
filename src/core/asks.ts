// FB-415 — the state-derived ask engine (talk-system redesign, D1–D8). Everyday talk is
// an ASK: a small, rung-windowed question whose answer derives from LIVE GameState
// (house wants · body & mend · discovery hints — D2), rendered INLINE in the talk
// surface and never written to any log channel (D4 — authored story beats alone write
// to Story). Pure core: no DOM, no RNG, no Date; the same selector feeds the surface
// and the reducer (AC-6), so what the row shows and what `ask` accepts can never drift.
//
// Heard-state (D6) is a freshness handshake, not a boolean: `asksHeard` stores the
// answer's freshness KEY at hear time, and an ask reads heard only while that stored
// key still matches the current state's key. State moving the answer (rung, works,
// health, season) changes the key, so the ask turns fresh again — refresh is purely
// state-driven, no timers, and exhausted (heard-and-unchanged) asks merely dim.

import type { GameState } from './state';
import type { RankId } from './content/ranks';
import { RANKS } from './content/ranks';
import type { VoiceCategory } from './content/voices';

/** One line of an ask's answer — plain data the surface renders inline (D4). */
export interface AskAnswerLine {
  /** Display nameplate; absent = the asked person answers (surface resolves). */
  readonly speaker?: string;
  readonly voice?: VoiceCategory;
  readonly text: string;
}

/** An everyday ask: WHO can be asked WHAT, WHEN, and how the answer derives. */
export interface AskDef {
  /** Stable id — also the `asksHeard` key; never renumbered. */
  readonly id: string;
  /** The NpcId this ask belongs to (people.ts). */
  readonly person: string;
  /** Rung window, inclusive — the D5 sparse person×rung matrix. Order derives
   *  from the RANKS registry, never a copied ladder. */
  readonly rungMin: RankId;
  readonly rungMax?: RankId;
  /** Availability beyond the window (a works stage, a flag); absent = window only. */
  readonly when?: (s: GameState) => boolean;
  /** The MC's spoken question (fiction-voiced, quotes included — the plate label). */
  readonly label: string;
  /** The answer, derived from live state — data in, data out, NO log write. */
  readonly answer: (s: GameState) => readonly AskAnswerLine[];
  /** Freshness key (D6): while the stored hear-key matches this, the ask is
   *  exhausted (dim). Absent = constant key (heard once, dim forever). */
  readonly freshness?: (s: GameState) => string;
}

/** An ask the selector offers right now, with its heard/dim status. */
export interface AvailableAsk {
  readonly def: AskDef;
  /** True while heard AND the answer's freshness key hasn't moved since (D6). */
  readonly heard: boolean;
}

const RANK_INDEX: Readonly<Record<RankId, number>> = Object.fromEntries(
  RANKS.map((r, i) => [r.id, i]),
) as Record<RankId, number>;

function inRungWindow(rung: RankId, def: AskDef): boolean {
  const i = RANK_INDEX[rung];
  if (i < RANK_INDEX[def.rungMin]) return false;
  return def.rungMax === undefined ? true : i <= RANK_INDEX[def.rungMax];
}

/** The answer's freshness key NOW — the value `asksHeard` stores at hear time and the
 *  heard test compares against (D6). A def with no `freshness` keys constantly. */
export function askFreshnessKey(s: GameState, def: AskDef): string {
  return def.freshness === undefined ? '' : def.freshness(s);
}

/** An ask counts heard only while the key stored at hear time still matches the
 *  current state's key — state moving the answer un-hears it (D6). */
function isHeard(s: GameState, def: AskDef): boolean {
  return s.asksHeard[def.id] === askFreshnessKey(s, def);
}

/** The asks this person can be asked NOW — rung-windowed + when-gated, each tagged
 *  heard/fresh (a heard ask stays offered — exhausted asks dim but stay pressable,
 *  D6). Feeds BOTH the talk surface and the `ask` reducer (AC-6). Presence is NOT
 *  checked here — the surface lists only `peopleHere` rows and the intent
 *  engine-checks presence, exactly as `talk_to` does. */
export function availableAsks(
  s: GameState,
  personId: string,
  defs: readonly AskDef[],
): readonly AvailableAsk[] {
  return defs
    .filter(
      (d) =>
        d.person === personId &&
        inRungWindow(s.rung, d) &&
        (d.when === undefined || d.when(s)),
    )
    .map((def) => ({ def, heard: isHeard(s, def) }));
}

/** How many of this person's offered asks are UNHEARD — the person row's newness
 *  mark derives from this (D6); it drops as asks are heard and rises when state
 *  moves an answer or a rung window opens. Derived from `availableAsks` (AC-6). */
export function unheardAskCount(
  s: GameState,
  personId: string,
  defs: readonly AskDef[],
): number {
  return availableAsks(s, personId, defs).filter((a) => !a.heard).length;
}
