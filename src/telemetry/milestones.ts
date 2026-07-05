// Milestone detectors (F8) — PURE (prev, next) GameState diffs, the same observation trick
// trackReveals already uses in main.ts: everything telemetry needs is visible on the public
// state, so src/core stays untouched. Fed from the commit tap (Ph2); unit-proven here.

import type { GameState, RankId } from '../core';
import { balance } from '../core';

/** The economy read at a milestone moment — the report's per-rung columns (plan §3.1). */
export interface EconomySnapshot {
  readonly rung: RankId;
  readonly tier: number;
  /** Game-time in ticks: day*24+tick (the __qa.pacing() convention). Printed NEXT TO attended
   *  minutes so blur-time divergence is a visible finding (ticks climb while attended stalls =
   *  background-window play — plan §2.2c/§6.4). */
  readonly tGame: number;
  readonly coin: number;
  readonly coinBanked: number;
  readonly rice: number;
  readonly riceBanked: number;
  /** House standing (koku) — influence.estate.value. */
  readonly standing: number;
}

export type MilestoneEvent =
  | { kind: 'rung-up'; from: RankId; to: RankId; snapshot: EconomySnapshot }
  | { kind: 'ascension'; fromTier: number; toTier: number; snapshot: EconomySnapshot }
  | { kind: 'loss'; snapshot: EconomySnapshot }
  /** Any auto (labour/rake/combat) armed-state flip — feeds the sessionizer's `auto` events
   *  (the two-tier idle TTL) and the segment's autosArmedMs. */
  | { kind: 'auto'; armed: boolean }
  /** An attention-worthy notification the re-engagement heuristic can rescue (§2.2): an
   *  auto-target stopping, or the rung meter crossing its promotion threshold. */
  | { kind: 'note' };

/** True when any leave-it-running mode is armed (labour, rake, or combat). */
export function autosArmed(s: GameState): boolean {
  return s.autoActivity !== null || s.autoRake || s.autoCombat !== null;
}

export function snapshot(s: GameState): EconomySnapshot {
  return {
    rung: s.rung,
    tier: s.tier,
    tGame: s.clock.day * 24 + s.clock.tick,
    coin: s.resources.coin ?? 0,
    coinBanked: s.banked.coin ?? 0,
    rice: s.resources.rice ?? 0,
    riceBanked: s.banked.rice ?? 0,
    standing: s.influence.estate.value,
  };
}

/** Diff one commit. Order: state milestones first (they snapshot `next`), then the
 *  sessionizer-feeding transitions (auto/note). */
export function detectMilestones(prev: GameState, next: GameState): MilestoneEvent[] {
  const events: MilestoneEvent[] = [];

  if (next.rung !== prev.rung) {
    events.push({ kind: 'rung-up', from: prev.rung, to: next.rung, snapshot: snapshot(next) });
  }
  if (next.tier !== prev.tier) {
    events.push({
      kind: 'ascension',
      fromTier: prev.tier,
      toTier: next.tier,
      snapshot: snapshot(next),
    });
  }
  // Best-effort loss detector (stated in the plan §3.1): a lost fight SETS hp to SETBACK_HP
  // (fight.ts rout signature). A legitimate drop TO exactly SETBACK_HP by attrition would
  // false-positive; acceptable for an n=1 DEV report, and the report labels it "losses", not
  // a gate input.
  if (next.character.hp === balance.SETBACK_HP && prev.character.hp > balance.SETBACK_HP) {
    events.push({ kind: 'loss', snapshot: snapshot(next) });
  }

  const armedPrev = autosArmed(prev);
  const armedNext = autosArmed(next);
  if (armedNext !== armedPrev) {
    events.push({ kind: 'auto', armed: armedNext });
    // An auto DISARM is a notification moment (auto-combat stopped itself / weapon broke /
    // target exhausted) — the thing a watching human reacts to. A player-driven disarm also
    // lands here, harmlessly: notes only matter while unattended, and a player disarm implies
    // input, which reopens the segment anyway.
    if (!armedNext) events.push({ kind: 'note' });
  }

  // Promotion-ready: the rung meter crossing its threshold mid-grind is the other "come look"
  // moment. Threshold derived from the source of truth (rungThreshold), never a copied number.
  const threshold = balance.rungThreshold(prev.rung);
  if (next.rung === prev.rung && prev.rungMeter < threshold && next.rungMeter >= threshold) {
    events.push({ kind: 'note' });
  }

  return events;
}
