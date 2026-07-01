import { describe, it, expect } from 'vitest';
import { createInitialState, reduce, applyQuestEvent, getQuest, type GameState } from './index';

/** A state where combat (and therefore the Quests tab + the crop-raider quest) is live. */
function combatReady(): GameState {
  const s = createInitialState(1);
  return {
    ...s,
    rung: 'R3',
    flags: { ...s.flags, awake: true, 'rank-r3': true },
    unlocked: [...s.unlocked, 'tab-combat', 'verb-woodcut'],
  };
}

describe('quest engine (T0-M4-F1 / D-037) — order-free advance-event sets', () => {
  it('accept seeds progress; scrambled events complete it; the reward grants exactly once', () => {
    const quest = getQuest('pest_crop_raiders');
    let s = reduce(combatReady(), { type: 'accept_quest', questId: quest.id });
    expect(s.quests.accepted).toContain(quest.id);
    expect(s.quests.completed).not.toContain(quest.id);

    const koku0 = s.resources.koku ?? 0;
    // the three steps land in a DELIBERATELY scrambled order (order-free)
    s = applyQuestEvent(s, 'gather:wood'); // mend-fence
    s = applyQuestEvent(s, 'kill:boar'); // down-boar
    expect(s.quests.completed).not.toContain(quest.id); // monkey step still open
    s = applyQuestEvent(s, 'kill:monkey'); // rout-monkey → complete
    expect(s.quests.completed).toContain(quest.id);
    expect((s.resources.koku ?? 0) - koku0).toBe(30); // the reward (and only once)

    const after = applyQuestEvent(s, 'kill:monkey');
    expect(after.resources.koku).toBe(s.resources.koku); // never re-grants
  });

  it('an unaccepted quest never advances', () => {
    const s = applyQuestEvent(combatReady(), 'kill:monkey');
    expect(s.quests.completed).toHaveLength(0);
    expect(s.quests.progress['pest_crop_raiders']).toBeUndefined();
  });

  it('labour emits gather tokens through the real reducer (gather:wood)', () => {
    let s = reduce(combatReady(), { type: 'accept_quest', questId: 'pest_crop_raiders' });
    // v0.3.1 Step 5: activities are spatial — woodcut_edge lives at 'woodlot-edge', so
    // stand at its node or canDoActivity gates it out and the do_activity no-ops.
    s = reduce(
      { ...s, location: 'woodlot-edge' },
      { type: 'do_activity', activityId: 'woodcut_edge' },
    ); // yields wood → gather:wood
    expect(s.quests.progress['pest_crop_raiders']).toContain('mend-fence');
  });
});
