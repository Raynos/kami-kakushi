import { describe, it, expect } from 'vitest';
import {
  QUESTS,
  QUEST_IDS,
  getQuest,
  advanceQuest,
  isQuestComplete,
  type QuestDef,
} from './quests';
import { MOBS } from './enemies';

// The order-free advance-event-set contract (T0-M4-F1 / ADR-037). The progression is PURE:
// advanceQuest never mutates the `done` set, steps complete in ANY order, partial progress is
// never complete, and an unrelated event is a no-op. Exercised against the REAL QUESTS[0] (the
// bible's "Walk the first night round" DEFEND quest) so the content and the engine stay in
// lockstep.
//
// G4 (the content cutover): the roster is the bible's T0 defence set — the first night round,
// the orchard-dog chain, the seasonal margin defences. Combat/defence runs on the KIND lane
// (bible economics): a quest banks its completion FLAG + a diegetic payoff line, NEVER coin.

const QUEST: QuestDef = QUESTS[0]!;

/** Fold a sequence of events into a done-set, starting from empty. */
function play(quest: QuestDef, events: readonly string[]): ReadonlySet<string> {
  let done: ReadonlySet<string> = new Set();
  for (const e of events) done = advanceQuest(done, e, quest);
  return done;
}

describe('QUESTS content — the T0 night-round DEFEND quest', () => {
  it('ships the first-night-round DEFEND quest: 2 distinct steps, a flag + payoff reward', () => {
    expect(QUEST.id).toBe('first_night_round');
    expect(QUEST.kind).toBe('DEFEND');
    expect(QUEST.title).toBe('Walk the first night round');
    expect(QUEST.steps.length).toBeGreaterThanOrEqual(2);
    expect(QUEST.steps.length).toBeLessThanOrEqual(3);

    // step ids AND event tokens are distinct — a real order-free set, not duplicate listeners
    const ids = new Set(QUEST.steps.map((s) => s.id));
    const events = new Set(QUEST.steps.map((s) => s.event));
    expect(ids.size).toBe(QUEST.steps.length);
    expect(events.size).toBe(QUEST.steps.length);
    for (const s of QUEST.steps) expect(s.event).toMatch(/^[a-z]+:[a-z_]+$/);

    // KIND-lane reward (bible economics): a completion flag + at least one payoff line, and
    // NEVER coin — combat/defence pays in recovered goods and standing, not mon.
    expect(QUEST.reward.flags).toContain('quest_first_night_round_done');
    expect(QUEST.reward.log?.length).toBeGreaterThanOrEqual(1);
    expect(QUEST.reward.resources?.coin).toBeUndefined();
  });

  it('QUEST_IDS indexes every quest; getQuest resolves and throws on unknown id', () => {
    for (const q of QUESTS) expect(QUEST_IDS.has(q.id)).toBe(true);
    expect(getQuest(QUEST.id)).toBe(QUEST);
    expect(() => getQuest('no_such_quest')).toThrow(/unknown quest/);
  });
});

describe('advanceQuest / isQuestComplete — order-free progression', () => {
  const [e0, e1, e2] = QUEST.steps.map((s) => s.event);

  it('marks the matching step and is not complete until the LAST step lands', () => {
    let done: ReadonlySet<string> = new Set();
    expect(isQuestComplete(done, QUEST)).toBe(false); // empty → not complete

    done = advanceQuest(done, e0!, QUEST);
    expect(done.has(QUEST.steps[0]!.id)).toBe(true);
    expect(isQuestComplete(done, QUEST)).toBe(false); // partial → not complete

    done = advanceQuest(done, e1!, QUEST);
    if (QUEST.steps.length > 2) {
      expect(isQuestComplete(done, QUEST)).toBe(false); // still partial
      done = advanceQuest(done, e2!, QUEST);
    }
    expect(isQuestComplete(done, QUEST)).toBe(true); // last step → complete
  });

  it('completes regardless of step order (forward, reversed, and a shuffle all finish)', () => {
    const evs = QUEST.steps.map((s) => s.event);
    const reversed = [...evs].reverse();
    const shuffled = evs.length === 3 ? [evs[1]!, evs[2]!, evs[0]!] : reversed;
    expect(isQuestComplete(play(QUEST, evs), QUEST)).toBe(true);
    expect(isQuestComplete(play(QUEST, reversed), QUEST)).toBe(true);
    expect(isQuestComplete(play(QUEST, shuffled), QUEST)).toBe(true);
  });

  it('an unrelated event is a no-op, and never mutates the input set', () => {
    const before = new Set([QUEST.steps[0]!.id]);
    const after = advanceQuest(before, 'kill:dragon', QUEST); // matches no step
    expect(after.size).toBe(1); // nothing added
    expect(after.has(QUEST.steps[0]!.id)).toBe(true);
    expect(isQuestComplete(after, QUEST)).toBe(false);
    expect(before.size).toBe(1); // input untouched
  });

  it('returns a NEW set when it marks progress, leaving the prior set unchanged', () => {
    const before: ReadonlySet<string> = new Set();
    const after = advanceQuest(before, e0!, QUEST);
    expect(after).not.toBe(before);
    expect(before.size).toBe(0); // prior set not mutated
    expect(after.has(QUEST.steps[0]!.id)).toBe(true);
  });

  it('re-firing an already-marked step is idempotent (no double-count)', () => {
    let done = advanceQuest(new Set<string>(), e0!, QUEST);
    const size = done.size;
    done = advanceQuest(done, e0!, QUEST);
    expect(done.size).toBe(size);
  });
});

describe('QUESTS content — the bible T0 defence set', () => {
  it('covers the T0 quest kinds the bible ships — PEST, CLEAR, DEFEND (no HUNT in T0)', () => {
    // The re-authored T0 roster is the estate defence set: pest control, the orchard clear, and
    // the night/margin defences. HUNT (a for-sport chase) is not a T0 kind — asserting the
    // shipped set stays RED-able (drop a quest of a kind → this goes red).
    const kinds = new Set(QUESTS.map((q) => q.kind));
    for (const k of ['PEST', 'CLEAR', 'DEFEND'] as const)
      expect(kinds.has(k)).toBe(true);
    expect(kinds.has('HUNT' as never)).toBe(false);
  });

  it('every quest is COMPLETABLE in T0 — steps use only fireable tokens (kill:<T0 foe> / gather:<res>)', () => {
    // A kill-step targeting a foe GATED out of T0 (minTier ≥ 2, e.g. the bandit) could never
    // complete → a dead quest. The valid subjects are every T0-reachable foe (minTier 0 — the
    // day grind AND the night-round-only foes the round emits), derived from the roster, never
    // a copied list.
    const t0Foes = new Set<string>(
      MOBS.filter((m) => (m.minTier ?? 0) === 0).map((m) => m.id),
    );
    for (const q of QUESTS) {
      for (const s of q.steps) {
        const [verb, subject] = s.event.split(':');
        expect(verb === 'kill' || verb === 'gather').toBe(true);
        if (verb === 'kill')
          expect(t0Foes.has(subject!), `${q.id} → ${s.event}`).toBe(true);
      }
      // distinct step ids + tokens (a real order-free set), and a KIND-lane reward: the completion
      // flag + a payoff line, no coin.
      expect(new Set(q.steps.map((s) => s.id)).size).toBe(q.steps.length);
      expect(new Set(q.steps.map((s) => s.event)).size).toBe(q.steps.length);
      expect(q.reward.flags).toContain(`quest_${q.id}_done`);
      expect(q.reward.log?.length).toBeGreaterThanOrEqual(1);
      expect(q.reward.resources?.coin).toBeUndefined();
    }
  });
});
