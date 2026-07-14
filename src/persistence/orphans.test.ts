// The orphaned-id sensor. The point of these tests is that the sensor CAN SEE a rename — a
// sensor that always reports "all clear" is worse than no sensor, because it is trusted.

import { describe, it, expect } from 'vitest';
import { findOrphanedIds, formatOrphanReport } from './orphans';
import { createInitialState, QUESTS, SURFACES, DIALOGUES } from '../core';
import type { GameState } from '../core';

const base = (over: Partial<GameState> = {}): GameState => ({
  ...createInitialState(1),
  ...over,
});

describe('findOrphanedIds — the save-vs-src/ id diff (step 4)', () => {
  it('a fresh save is clean (the sensor does not cry wolf)', () => {
    const report = findOrphanedIds(base());
    expect(report.total).toBe(0);
    expect(formatOrphanReport(report)).toBe(
      'no orphaned ids — this save matches src/',
    );
  });

  it('sees a reveal id that src/ renamed away', () => {
    const report = findOrphanedIds(
      base({ seenReveals: ['room-kura-but-renamed'] }),
    );
    expect(report.total).toBe(1);
    expect(report.groups[0]!.kind).toBe('seenReveals');
    expect(report.groups[0]!.ids).toEqual(['room-kura-but-renamed']);
  });

  it('sees an orphaned QUEST STEP — the one that silently makes a quest uncloseable', () => {
    // The nastiest orphan: the quest still exists, so nothing looks wrong, but a step id that
    // src/ renamed can never be matched again and the quest can never complete.
    const quest = QUESTS[0]!;
    const report = findOrphanedIds(
      base({
        quests: {
          accepted: [quest.id],
          progress: { [quest.id]: ['a-step-we-renamed'] },
          completed: [],
        },
      }),
    );
    const group = report.groups.find((g) => g.kind === 'quests.progress');
    expect(group?.ids).toEqual(['a-step-we-renamed']);
    expect(group?.consequence).toContain('never close');
  });

  it('does NOT flag ids that src/ still defines', () => {
    // The guard against a sensor that flags everything: real, live ids must stay silent.
    const liveSurface = SURFACES[0]!.id;
    const quest = QUESTS[0]!;
    const report = findOrphanedIds(
      base({
        seenReveals: [liveSurface],
        quests: {
          accepted: [quest.id],
          progress: { [quest.id]: [quest.steps[0]!.id] },
          completed: [],
        },
      }),
    );
    expect(report.total).toBe(0);
  });

  it('a REAL delivered dialogue line is not an orphan (the cry-wolf RED)', () => {
    // deliveredDialogue stores LINE ids ('gen-rake'), not the dialogue's own id
    // ('genemon-open'). Diffing against DIALOGUE_IDS flagged EVERY delivered line as orphaned —
    // the live DEV panel reported "5 orphaned id(s)" on a clean fixture. The unit tests missed it
    // because they only ever used an EMPTY deliveredDialogue. This is that bug's RED.
    const line = DIALOGUES[0]!.lines[0]!;
    const report = findOrphanedIds(base({ deliveredDialogue: [line.id] }));
    expect(
      report.groups.find((g) => g.kind === 'deliveredDialogue'),
    ).toBeUndefined();
    expect(report.total).toBe(0);
  });

  it('but a dialogue line src/ HAS renamed is still caught', () => {
    const report = findOrphanedIds(
      base({ deliveredDialogue: ['a-line-we-renamed'] }),
    );
    expect(report.groups[0]!.kind).toBe('deliveredDialogue');
    expect(report.groups[0]!.ids).toEqual(['a-line-we-renamed']);
  });

  it('groups several orphans across kinds and totals them', () => {
    const report = findOrphanedIds(
      base({ seenReveals: ['gone-a', 'gone-b'], belongings: ['gone-c'] }),
    );
    expect(report.total).toBe(3);
    expect(report.groups.map((g) => g.kind).sort()).toEqual([
      'belongings',
      'seenReveals',
    ]);
    expect(formatOrphanReport(report)).toContain('gone-a, gone-b');
  });

  it('flags are NOT diffed (free-form facts have no roster to diff against)', () => {
    const report = findOrphanedIds(
      base({ flags: { 'a-flag-no-registry-knows': true } }),
    );
    expect(report.total).toBe(0);
  });
});
