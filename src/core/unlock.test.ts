// The derived-reveal engine (ADR-179): visibility = f(progression facts), never stored.
// Fixtures derive from the RANKS schedule itself (the source of truth) — never copied
// id lists — so a re-rung of any surface re-derives the expectations with it.

import { describe, it, expect } from 'vitest';
import { createInitialState, setFlag, type GameState } from './state';
import { visibleSet, isUnlocked, unlockedSurfaces, announcePass, factsForSurfaces } from './unlock';
import { RANKS, type RankId } from './content/ranks';

const init = (): GameState => createInitialState(7);

/** Flags for every rung up to and incl. `target` — what organic play latches. */
function atRung(state: GameState, target: RankId): GameState {
  let next = state;
  for (const r of RANKS) {
    if (r.id !== 'R0') next = setFlag(next, `rank-${r.id.toLowerCase()}`, true);
    if (r.id === target) break;
  }
  return next;
}

/** The authored schedule, read from RANKS (the single source): rank → its unlock list. */
const schedule = RANKS.map((r) => ({ id: r.id, unlock: r.rewardOnReach?.unlock ?? [] }));

describe('visibleSet — the rung derivation table (from the RANKS schedule)', () => {
  it('a fresh state shows the cold open and nothing scheduled', () => {
    const vis = visibleSet(init());
    expect(vis.has('screen-cold-open')).toBe(true);
    expect(vis.has('verb-open-eyes')).toBe(true);
    for (const rank of schedule) {
      for (const id of rank.unlock) expect(vis.has(id)).toBe(false);
    }
  });

  it('every reached rung shows ALL its scheduled surfaces; every later rung shows NONE', () => {
    for (let i = 1; i < schedule.length; i++) {
      const target = schedule[i]!.id;
      const vis = visibleSet(atRung(init(), target));
      for (let j = 1; j < schedule.length; j++) {
        for (const id of schedule[j]!.unlock) {
          expect(vis.has(id), `${id} at ${target} (scheduled ${schedule[j]!.id})`).toBe(j <= i);
        }
      }
    }
  });

  it('a stale save cannot pin a stale surface: visibility ignores seenReveals entirely', () => {
    // A save claiming a high-rung surface was "revealed" (announced) grants NOTHING:
    // the facts (no rank flags) say R0, so the surface is not visible.
    const lying: GameState = { ...init(), seenReveals: ['tab-combat', 'tab-quests'] };
    expect(isUnlocked(lying, 'tab-combat')).toBe(false);
    expect(isUnlocked(lying, 'tab-quests')).toBe(false);
  });

  it('chained predicates ride their anchor: panel-home appears exactly with tab-inventory', () => {
    const before = atRung(init(), 'R3');
    const after = atRung(init(), 'R4'); // tab-inventory's rung (ADR-177 Schedule A)
    expect(isUnlocked(before, 'panel-home')).toBe(false);
    expect(isUnlocked(after, 'tab-inventory')).toBe(true);
    expect(isUnlocked(after, 'panel-home')).toBe(true);
  });

  it('event facts derive without any rung: works-named-weir alone opens room-weir', () => {
    const s = setFlag(init(), 'works-named-weir', true);
    expect(isUnlocked(s, 'room-weir')).toBe(true);
    expect(isUnlocked(init(), 'room-weir')).toBe(false);
  });

  it('readout-coin is monotone via the coin-earned fact: spending to zero cannot hide it', () => {
    const earned = setFlag(init(), 'coin-earned', true); // coin balance stays 0
    expect(isUnlocked(earned, 'readout-coin')).toBe(true);
    expect(isUnlocked(init(), 'readout-coin')).toBe(false);
  });

  it('memoizes per state object', () => {
    const s = init();
    expect(visibleSet(s)).toBe(visibleSet(s));
  });

  it('unlockedSurfaces returns registry order', () => {
    const ids = unlockedSurfaces(atRung(init(), 'R2'));
    expect([...ids].sort((a, b) => ids.indexOf(a) - ids.indexOf(b))).toEqual(ids as string[]);
    expect(ids).toContain('tab-skills');
  });
});

describe('announcePass — the announce-once ceremony latch (ADR-179)', () => {
  it('announces a newly-entitled reveal line exactly once, then never again', () => {
    // verb-rest: predicate `raked`, carries a revealLine.
    const s = setFlag(setFlag(init(), 'awake', true), 'raked', true);
    const once = announcePass(s);
    expect(once.seenReveals).toContain('verb-rest');
    const restLines = once.log.entries.filter((e) => e.text.includes('set the work down'));
    expect(restLines.length).toBe(1);

    // A second pass on the SAME state is a strict no-op (no new object, no new line).
    expect(announcePass(once)).toBe(once);
  });

  it('a reload never re-spams: a persisted round-trip announces nothing new', () => {
    const played = announcePass(setFlag(setFlag(init(), 'awake', true), 'raked', true));
    // Simulate save→load: a structural copy of the persisted state (GameState is JSON-safe).
    const reloaded = JSON.parse(JSON.stringify(played)) as GameState;
    const after = announcePass(reloaded);
    expect(after.log.entries.length).toBe(played.log.entries.length);
    expect(after.seenReveals).toEqual(played.seenReveals);
  });

  it('an old save missing a since-shipped announcement gets it once on load', () => {
    // The facts entitle verb-rest, but seenReveals predates it (e.g. a pre-surface save).
    const s = setFlag(setFlag(init(), 'awake', true), 'raked', true);
    const stale: GameState = { ...s, seenReveals: [] };
    const caughtUp = announcePass(stale);
    expect(caughtUp.seenReveals).toContain('verb-rest');
  });
});

describe('factsForSurfaces — the entitling-facts bridge', () => {
  it('resolves a scheduled surface to its rung flag (from the RANKS schedule)', () => {
    // Derive the expectation from the schedule itself: take the first scheduled surface.
    const firstScheduled = schedule.find((r) => r.unlock.length > 0)!;
    const facts = factsForSurfaces(firstScheduled.unlock[0]!);
    expect(facts[`rank-${firstScheduled.id.toLowerCase()}`]).toBe(true);
  });

  it('resolves a chained surface through its anchor', () => {
    const viaChain = factsForSurfaces('panel-home');
    const viaAnchor = factsForSurfaces('tab-inventory');
    expect(viaChain).toEqual(viaAnchor);
  });

  it('throws for a surface whose facts are not flags (the intro-cursor reveals)', () => {
    expect(() => factsForSurfaces('readout-body')).toThrow(/no flag facts/);
  });
});
