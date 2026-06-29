import { describe, it, expect } from 'vitest';
import {
  QUESTS,
  QUEST_IDS,
  getQuest,
  advanceQuest,
  isQuestComplete,
  type QuestDef,
} from './quests';

// The order-free advance-event-set contract (T0-M4-F1 / D-037). The progression is PURE:
// advanceQuest never mutates the `done` set, steps complete in ANY order, partial progress is
// never complete, and an unrelated event is a no-op. Exercised against the REAL QUESTS[0] (the
// "Drive off the crop-raiders" PEST quest) so the content and the engine stay in lockstep.

const QUEST: QuestDef = QUESTS[0]!;

/** Fold a sequence of events into a done-set, starting from empty. */
function play(quest: QuestDef, events: readonly string[]): ReadonlySet<string> {
  let done: ReadonlySet<string> = new Set();
  for (const e of events) done = advanceQuest(done, e, quest);
  return done;
}

describe('QUESTS content — the T0 PEST quest', () => {
  it('ships one grounded quest: PEST, 2-3 distinct steps, a modest koku + flag reward', () => {
    expect(QUEST.kind).toBe('PEST');
    expect(QUEST.title).toBe('Drive off the crop-raiders');
    expect(QUEST.steps.length).toBeGreaterThanOrEqual(2);
    expect(QUEST.steps.length).toBeLessThanOrEqual(3);

    // step ids AND event tokens are distinct — a real order-free set, not duplicate listeners
    const ids = new Set(QUEST.steps.map((s) => s.id));
    const events = new Set(QUEST.steps.map((s) => s.event));
    expect(ids.size).toBe(QUEST.steps.length);
    expect(events.size).toBe(QUEST.steps.length);
    for (const s of QUEST.steps) expect(s.event).toMatch(/^[a-z]+:[a-z_]+$/);

    // modest reward: some koku (below the first estate-stage cost) + a completion flag
    expect(QUEST.reward.resources?.koku).toBeGreaterThan(0);
    expect(QUEST.reward.resources?.koku).toBeLessThanOrEqual(100);
    expect(QUEST.reward.flags).toContain('quest_pest_crop_raiders_done');
    expect(QUEST.reward.log?.length).toBeGreaterThanOrEqual(1);
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
