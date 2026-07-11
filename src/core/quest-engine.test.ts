import {
  createInitialState,
  reduce,
  applyQuestEvent,
  factsForSurfaces,
  getQuest,
  hasFlag,
  type GameState,
} from './index';
import { describe, it, expect } from 'vitest';

// G4: the roster is the bible's estate-defence set on the KIND lane — quests pay a completion FLAG +
// a diegetic payoff line, NEVER coin. We drive the PEST "keep the leased screens whole" quest: its
// two steps are a kill (the weir river-rats) + a gather (green bamboo to mend the screens), so it
// exercises both token kinds. All fixtures derive from the registry (steps/tokens/reward), never a
// copied literal, so a content edit flows through and a mis-wired reducer goes RED.

const QUEST_ID = 'pest_weir_screens';

/** A state where combat (and therefore the Quests tab + labour) is live. */
function combatReady(): GameState {
  const s = createInitialState(1);
  return {
    ...s,
    rung: 'R3',
    // ADR-179 — tab-combat derives from rank-r3; verb-woodcut from its rung's flag (rank-r2).
    flags: { ...s.flags, awake: true, 'rank-r3': true, ...factsForSurfaces('verb-woodcut') },
  };
}

describe('quest engine (T0-M4-F1 / D-037) — order-free advance-event sets', () => {
  it('accept seeds progress; scrambled events complete it; the reward grants exactly once', () => {
    const quest = getQuest(QUEST_ID);
    const events = quest.steps.map((st) => st.event); // ['kill:river_rats', 'gather:wood']
    const doneFlag = `quest_${QUEST_ID}_done`;
    const rewardLogCount = (s: GameState): number =>
      s.log.entries.filter((e) => quest.reward.log?.some((l) => 'text' in l && l.text === e.text))
        .length;

    let s = reduce(combatReady(), { type: 'accept_quest', questId: quest.id });
    expect(s.quests.accepted).toContain(quest.id);
    expect(s.quests.completed).not.toContain(quest.id);

    // fire the steps in DELIBERATELY scrambled (reversed) order — order-free must still complete.
    const scrambled = [...events].reverse();
    for (let i = 0; i < scrambled.length; i++) {
      s = applyQuestEvent(s, scrambled[i]!);
      if (i < scrambled.length - 1) expect(s.quests.completed).not.toContain(quest.id); // partial
    }
    expect(s.quests.completed).toContain(quest.id);
    // KIND-lane reward: the completion FLAG is granted (no coin), and the payoff lines landed.
    expect(hasFlag(s, doneFlag)).toBe(true);
    const grantedLines = rewardLogCount(s);
    expect(grantedLines).toBeGreaterThan(0);

    // re-firing a step never re-grants: completed stays single, the reward lines don't duplicate.
    const after = applyQuestEvent(s, events[0]!);
    expect(after.quests.completed).toEqual(s.quests.completed);
    expect(rewardLogCount(after)).toBe(grantedLines);
  });

  it('an unaccepted quest never advances', () => {
    const killEvent = getQuest(QUEST_ID).steps.find((st) => st.event.startsWith('kill:'))!.event;
    const s = applyQuestEvent(combatReady(), killEvent);
    expect(s.quests.completed).toHaveLength(0);
    expect(s.quests.progress[QUEST_ID]).toBeUndefined();
  });

  it('labour emits gather tokens through the real reducer (gather:wood)', () => {
    const quest = getQuest(QUEST_ID);
    const gatherStep = quest.steps.find((st) => st.event === 'gather:wood')!;
    let s = reduce(combatReady(), { type: 'accept_quest', questId: QUEST_ID });
    // G4: activities are spatial — woodcut_edge lives at 'woodlot', so stand at its node or
    // canDoActivity gates it out and the do_activity no-ops.
    s = reduce({ ...s, location: 'woodlot' }, { type: 'do_activity', activityId: 'woodcut_edge' }); // yields wood → gather:wood
    expect(s.quests.progress[QUEST_ID]).toContain(gatherStep.id);
  });
});
