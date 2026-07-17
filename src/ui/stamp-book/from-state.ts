// stamp-book/from-state.ts — the LIVE derivation (ADR-201): GameState → the
// compact seal-strip's data. ONE derivation feeds every ADR-075 variant
// (AC-6-shaped: the variants differ only in rendering, never in what they
// claim), and the shape itself enforces the rulings:
//   - a 'future' slot carries NO identity (no kanji, no title) — ruling 5's
//     "next named, rest mystery" can't be leaked by a variant, because the
//     data a variant receives simply doesn't contain it;
//   - a pre-v16 save's pressed seals carry no day/season (the record hydrates
//     empty; the pressed SET derives from ladder position) — they render
//     undated, never missing and never fabricated.
// Thread marks (knots at dated defeats, thin ink through lean stretches) are
// derived per-stretch; an undated old-save stretch degrades to an unmarked
// plain stroke.

import type { GameState, RankId, Season } from '../../core';
import { RANKS, remainingRequirements, rungRequirements } from '../../core';

export type SealState = 'pressed' | 'next' | 'future';

/** One slot of the strip, R0 → R7 in ladder order. Identity fields exist only
 *  where the ruling allows them (pressed + next). */
export interface SealSlot {
  readonly rung: RankId;
  readonly state: SealState;
  /** pressed/next only — the seal's carved glyph + the rank's title (registry-sourced). */
  readonly kanji?: string;
  readonly title?: string;
  /** pressed only — the hand that pressed it (RankDef.granter). Absent on the
   *  granter-less rungs (R0 cold open, R2 the silent rung) — the popover shows
   *  no hand row rather than inventing one. */
  readonly granter?: string;
  /** pressed only, dated presses only (v16+ record). */
  readonly day?: number;
  readonly season?: Season;
  /** next only — requirement progress toward the press (TST4: what it will take). */
  readonly reqsDone?: number;
  readonly reqsTotal?: number;
}

/** One inter-seal stretch of the thread: stretch `i` runs from slot `i` to
 *  slot `i+1`. Knots = dated defeats that fell inside the stretch; `lean` =
 *  a dated stretch that ran long (the thin dry ink). */
export interface ThreadStretch {
  readonly knots: number;
  readonly lean: boolean;
}

export interface StripData {
  /** Every T0 rung, ladder order (RANKS order — R0 first). */
  readonly slots: readonly SealSlot[];
  /** stretches[i] joins slots[i] → slots[i+1] (length = slots.length - 1). */
  readonly stretches: readonly ThreadStretch[];
}

/** A stretch is LEAN when it ran at least LEAN_MIN_DAYS and at least
 *  LEAN_FACTOR × the run's median dated gap — "the short-handed weeks" read
 *  from the record, not authored. Presentation heuristic (UI-side on
 *  purpose); both ends must be dated or the stretch is never lean. */
const LEAN_MIN_DAYS = 10;
const LEAN_FACTOR = 1.6;

export function stripFromState(state: GameState): StripData {
  const currentIdx = RANKS.findIndex((r) => r.id === state.rung);
  const pressDay = new Map<RankId, { day: number; season: Season }>();
  for (const p of state.rungRecord)
    pressDay.set(p.rung, { day: p.day, season: p.season });

  const slots: SealSlot[] = RANKS.map((rank, i) => {
    if (i <= currentIdx) {
      const dated = pressDay.get(rank.id);
      return {
        rung: rank.id,
        state: 'pressed' as const,
        kanji: rank.kanji,
        title: rank.title,
        ...(rank.granter !== undefined ? { granter: rank.granter } : {}),
        ...(dated !== undefined
          ? { day: dated.day, season: dated.season }
          : {}),
      };
    }
    if (i === currentIdx + 1) {
      const total = rungRequirements(state.rung).length;
      const remaining = remainingRequirements(state).length;
      return {
        rung: rank.id,
        state: 'next' as const,
        kanji: rank.kanji,
        title: rank.title,
        reqsDone: total - remaining,
        reqsTotal: total,
      };
    }
    return { rung: rank.id, state: 'future' as const };
  });

  // dated gaps between consecutive pressed seals → the lean threshold
  const gaps: number[] = [];
  for (let i = 0; i < currentIdx; i++) {
    const a = pressDay.get(RANKS[i]!.id);
    const b = pressDay.get(RANKS[i + 1]!.id);
    if (a !== undefined && b !== undefined) gaps.push(b.day - a.day);
  }
  const sorted = [...gaps].sort((x, y) => x - y);
  const median = sorted.length > 0 ? sorted[Math.floor(sorted.length / 2)]! : 0;

  const stretches: ThreadStretch[] = [];
  for (let i = 0; i < slots.length - 1; i++) {
    const a = pressDay.get(RANKS[i]!.id);
    const b = pressDay.get(RANKS[i + 1]!.id);
    // knots: dated defeats inside (a.day, b.day]; the open stretch past the
    // last press (b undated/unpressed) collects every defeat after a.day.
    let knots = 0;
    if (a !== undefined && i <= currentIdx) {
      const hi = b !== undefined && i + 1 <= currentIdx ? b.day : Infinity;
      knots = state.defeatDays.filter((d) => d > a.day && d <= hi).length;
    }
    const lean =
      a !== undefined &&
      b !== undefined &&
      i + 1 <= currentIdx &&
      median > 0 &&
      b.day - a.day >= LEAN_MIN_DAYS &&
      b.day - a.day >= median * LEAN_FACTOR;
    stretches.push({ knots, lean });
  }

  return { slots, stretches };
}
