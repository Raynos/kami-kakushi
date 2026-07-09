import { describe, it, expect } from 'vitest';
import { createInitialState, type GameState } from './index';
import { enqueueScene, triggerScenes, beginScene, applySceneOption } from './scenes';
import { SCENES, type SceneDef } from './content/scenes';
import type { RungScene } from './content/rungBeats';

// storywave G2 — the generalized-scene ENGINE proof. The registry ships EMPTY at G2, so these
// drive a CONSTRUCTED SceneDef through the engine directly (re-derive from real registry entries
// at G4.6 once content lands). Every assertion derives from the constructed def — no magic numbers.
// NO promotion is exercised (scenes never advance a rank); that stays the rung-beat path.

const NPC = 'genemon' as const;
const STAT_ATTR = 'agi' as const;
const STAT_AMT = 1;
const WARMTH_DELTA = 2;

/** A test scene: 2 greeting lines + a decision whose one option carries memory + a flag +
 *  a statBonus + a stance default — the full effect surface `applySceneOption` applies. */
function makeScene(): RungScene {
  return {
    id: 'scene-test',
    rank: 'R1', // required by RungScene (rank-optional widening deferred to G4)
    voice: 'steward',
    speaker: NPC,
    greeting: [
      { voice: 'narrator', text: 'The lamp gutters in the side room.' },
      { voice: 'steward', text: 'You came when I called.', speaker: 'Genemon' },
    ],
    topics: [],
    decision: {
      prompt: 'What do you say?',
      options: [
        {
          id: 'opt-earnest',
          label: 'Answer plainly',
          say: 'I did, sir.',
          react: 'He inclines his head.',
          memory: [{ npc: NPC, warmthDelta: WARMTH_DELTA, regard: 'steady' }],
          flags: ['scene-test-answered'],
          statBonus: { attr: STAT_ATTR, amount: STAT_AMT, note: 'Something in you steadies.' },
          setStance: 'jodan',
        },
      ],
    },
    motivates: [],
  };
}

function makeDef(id = 'scene-test', once = true): SceneDef {
  return { id, scene: { ...makeScene(), id }, trigger: { kind: 'scripted' }, once };
}

describe('G2 scene engine — beginScene opens the VN + reveals the greeting', () => {
  it('sets activeScene at beat 0 and pushes every greeting line to the log', () => {
    const def = makeDef();
    const s0 = createInitialState(1);
    const s1 = beginScene(s0, def);
    expect(s1.activeScene).toEqual({ id: def.id, beat: 0 });
    const texts = new Set(s1.log.entries.map((e) => e.text));
    for (const line of def.scene.greeting) expect(texts.has(line.text)).toBe(true);
  });
});

describe('G2 scene engine — applySceneOption is the terminal node', () => {
  function play(): { before: GameState; after: GameState; def: SceneDef } {
    const def = makeDef();
    const before = beginScene(createInitialState(1), def);
    const after = applySceneOption(before, def, 'opt-earnest');
    return { before, after, def };
  }

  it('applies memory / flags / statBonus / stance, then latches played + clears the cursor', () => {
    const { before, after, def } = play();
    const opt = def.scene.decision.options[0]!;

    // memory DEEPENED by the option's warmthDelta + regard (derived from the def)
    expect(after.npcMemory[NPC]?.warmth).toBe(WARMTH_DELTA);
    expect(after.npcMemory[NPC]?.regard).toBe(opt.memory![0]!.regard);

    // the durable flag is set
    expect(after.flags[opt.flags![0]!]).toBe(true);

    // the stat bonus lands on the exact attr, by the exact amount (base derived from `before`)
    expect(after.character.attrs[STAT_ATTR]).toBe(before.character.attrs[STAT_ATTR] + STAT_AMT);

    // the stance default is set
    expect(after.stance).toBe(opt.setStance);

    // write-once played latch + cursor cleared
    expect(after.scenesPlayed).toContain(def.id);
    expect(after.activeScene).toBeNull();
  });

  it('does NOT promote — the rung/tier are untouched (scenes never advance a rank)', () => {
    const { before, after } = play();
    expect(after.rung).toBe(before.rung);
    expect(after.tier).toBe(before.tier);
  });
});

describe('G2 scene engine — queue discipline (once / order / no re-enqueue)', () => {
  it('a once scene, once played, does not re-enqueue (the scenesPlayed guard)', () => {
    const def = makeDef('scene-once', true);
    // play it (begin → decide) so the id latches into scenesPlayed
    const played = applySceneOption(beginScene(createInitialState(1), def), def, 'opt-earnest');
    expect(played.scenesPlayed).toContain(def.id);
    expect(played.sceneQueue).toEqual([]); // was never queued; play doesn't enqueue
    // the scenesPlayed guard blocks an explicit re-enqueue of the played id (RED if it stops guarding).
    expect(enqueueScene(played, def.id).sceneQueue).not.toContain(def.id);

    // …and a trigger SCAN over the REAL registry (G4: SCENES now ships content) respects the guard:
    // it enqueues an UNPLAYED once scene but NOT a played one (source-derived, no magic ids).
    // Filter to `once` defs — a REPEATABLE scripted scene (the annual nengu frame, ADR-166)
    // legitimately re-enqueues and is not this test's lever.
    const scripted = SCENES.filter((d) => d.trigger.kind === 'scripted' && d.once);
    expect(scripted.length).toBeGreaterThan(0);
    const target = scripted[0]!;
    const fresh = createInitialState(1);
    expect(triggerScenes(fresh, { kind: 'scripted' }).sceneQueue).toContain(target.id); // unplayed → queued
    const withPlayed: GameState = { ...fresh, scenesPlayed: [target.id] };
    expect(triggerScenes(withPlayed, { kind: 'scripted' }).sceneQueue).not.toContain(target.id); // played → skipped
  });

  it('the queue drains in enqueue order and never double-queues', () => {
    let s = createInitialState(1);
    s = enqueueScene(s, 'a');
    s = enqueueScene(s, 'b');
    s = enqueueScene(s, 'c');
    s = enqueueScene(s, 'a'); // duplicate — ignored
    expect(s.sceneQueue).toEqual(['a', 'b', 'c']);
  });
});
