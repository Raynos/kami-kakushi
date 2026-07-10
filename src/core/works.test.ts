// ADR-177 — the works DISCOVERY chain (estate plan Phase 1): the day-book names →
// the walk sees → the beat prices → the ladder opens. Each case can go RED: drop the
// weir gate and the FB-342 regression fails; drop the ladder-order guard and the
// naming test fails; emit sighting lines unconditionally and the once-guard fails.
// Fixtures derive from WORKS_PROJECTS + ESTATE_STAGES (the sources of truth).

import { describe, it, expect } from 'vitest';
import { createInitialState, hasFlag, type GameState } from './state';
import { reduce } from './intents';
import { canMove } from './content/map';
import { ESTATE_STAGES } from './content/estate';
import { estateBuild } from './selectors';
import { WORKS_PROJECTS, worksPass, stageOpen, stageDiscovery } from './works';
import { triggerFlagScenes } from './scenes';

const U1 = WORKS_PROJECTS[0]!;

/** An R2 hand at the board: the works-intro's firing position. */
function atBoardR2(): GameState {
  const s = createInitialState(1);
  return {
    ...s,
    rung: 'R2',
    location: 'forecourt',
    unlocked: [
      ...s.unlocked,
      'panel-rung-ladder',
      'panel-estate',
      'room-gate',
      'room-paddies',
      'room-woodshed',
    ],
  };
}

/** Drive the queued scene to completion through the REAL reducer (begin → option 0). */
function playScene(s: GameState, id: string, optionId: string): GameState {
  let next = reduce(s, { type: 'begin_scene', sceneId: id });
  expect(next.activeScene?.id).toBe(id);
  next = reduce(next, { type: 'choose_scene_option', optionId });
  expect(next.activeScene).toBeNull();
  return next;
}

describe('ADR-177 — the works discovery chain', () => {
  it('FB-342 regression — the weir path reads locked until the day-book names the lease', () => {
    const s = atBoardR2();
    const revealed = new Set(s.unlocked);
    expect(canMove('paddies', 'weir', revealed)).toBe(false); // locked at R1/R2 pre-naming
    const named = worksPass({ ...s, flags: { ...s.flags, 'works-named-weir': true } });
    expect(canMove('paddies', 'weir', new Set(named.unlocked))).toBe(true); // named → open
  });

  it('the works-intro enqueues at the board at R2+ — and not before R2', () => {
    const early = worksPass({ ...atBoardR2(), rung: 'R1' });
    expect(early.sceneQueue).not.toContain('works-intro');
    const due = worksPass(atBoardR2());
    expect(due.sceneQueue).toContain('works-intro');
  });

  it('walks the whole U1 chain: intro names → three sightings → beat prices → the buy lands', () => {
    let s = worksPass(atBoardR2());
    s = playScene(s, 'works-intro', 'works-intro-go');
    expect(hasFlag(s, U1.namedFlag)).toBe(true);
    expect(hasFlag(s, 'works-named-weir')).toBe(true);
    // the stage is named but NOT priced: the reducer refuses the coin (TST3).
    s = { ...s, resources: { ...s.resources, coin: 10_000 } };
    expect(reduce(s, { type: 'improve_estate' })).toBe(s);
    expect(stageDiscovery(s, 1)).toBe('named');
    // walk the three named zones — each sighting logs ONE line + latches its flag.
    for (const z of U1.zones) {
      const before = s.log.entries.length;
      s = worksPass({ ...s, location: z.node });
      expect(hasFlag(s, z.seenFlag)).toBe(true);
      expect(s.log.entries.length).toBe(before + 1);
      const again = worksPass(s);
      expect(again.log.entries.length).toBe(s.log.entries.length); // once, ever
      s = again;
    }
    expect(hasFlag(s, U1.seenFlag)).toBe(true);
    // finish() composes worksPass BEFORE triggerFlagScenes — same-tick enqueue.
    s = triggerFlagScenes(s);
    expect(s.sceneQueue).toContain('works-u1'); // the pricing beat queued the same pass
    s = playScene(s, 'works-u1', 'works-u1-begin');
    expect(stageOpen(s, 1)).toBe(true);
    const bought = reduce(s, { type: 'improve_estate' });
    expect(bought.estateStage).toBe(1); // the chain is the ONLY thing that was in the way
  });

  it('names in ladder order — U2 waits for U1 to be BUILT, even past its rung', () => {
    const base: GameState = { ...atBoardR2(), rung: 'R5', location: 'kitchen' };
    const u2 = WORKS_PROJECTS[1]!;
    const skipped = worksPass(base);
    expect(hasFlag(skipped, u2.namedFlag)).toBe(false); // U1 unbuilt — the book names one thing at a time
    const inOrder = worksPass({ ...base, estateStage: 1 });
    expect(hasFlag(inOrder, u2.namedFlag)).toBe(true);
    // the day-book naming line lands exactly once (its own emit latch).
    expect(inOrder.log.entries.length).toBe(base.log.entries.length + 1);
    expect(worksPass(inOrder).log.entries.length).toBe(inOrder.log.entries.length);
  });

  it('estateBuild surfaces the discovery read (TST4 — the card never guesses)', () => {
    const s = atBoardR2();
    expect(estateBuild(s).next?.discovery).toBe('unnamed');
    expect(estateBuild(s).next?.open).toBe(false);
    const open: GameState = { ...s, flags: { ...s.flags, [U1.openFlag]: true } };
    expect(estateBuild(open).next?.discovery).toBe('open');
    expect(estateBuild(open).next?.open).toBe(true);
  });

  it('every ladder stage has a discovery chain, keyed 1:1 to ESTATE_STAGES', () => {
    expect(WORKS_PROJECTS.map((p) => p.stage)).toEqual(ESTATE_STAGES.map((d) => d.stage));
  });
});
