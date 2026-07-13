import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, it, expect } from 'vitest';
import { createInitialState, type GameState } from './index';
import { enqueueScene, triggerScenes, beginScene, applySceneOption } from './scenes';
import { WORKS_PROJECTS } from './works';
import { SCENES, type SceneDef } from './content/scenes';
import { QUESTS } from './content/quests';
import { RANKS } from './content/ranks';
import { SEASONS } from './constants';
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
      { id: 'lamp-gutters', voice: 'narrator', text: 'The lamp gutters in the side room.' },
      { id: 'you-came', voice: 'steward', text: 'You came when I called.', speaker: 'Genemon' },
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

describe('C4.1 — every authored scene is REACHABLE (no authored-but-dark content)', () => {
  // The class this catches: 4 of 5 authored side-beats shipped with NO path to the
  // player (scripted with no enqueuer; a flag trigger keyed to a flag nothing sets).
  // Everything derives from the code, never a hand list:
  //  - scripted ids must appear in a literal enqueueScene(…, '<id>') call site in core;
  //  - flag triggers must name a flag some SETTER produces (a quest reward, a scene
  //    option's flags, or an engine setFlag literal);
  //  - rung/season triggers must name a real rank / season.
  const coreDir = fileURLToPath(new URL('.', import.meta.url));
  const coreSrc = [
    'intents.ts',
    'night-rounds.ts',
    'scenes.ts',
    'step.ts',
    'nengu.ts',
    'works.ts',
    'reveals.ts', // ADR-184 — the zone-reveal VNs' enqueuer (the settle-pass glue)
  ]
    .map((f) => readFileSync(coreDir + f, 'utf8'))
    .join('\n');
  const enqueuedIds = new Set(
    [...coreSrc.matchAll(/enqueueScene\([^,]+,\s*'([\w-]+)'\)/g)].map((m) => m[1]!),
  );
  const setFlagIds = new Set(
    [...coreSrc.matchAll(/setFlag\([^,]+,\s*'([\w-]+)'\)/g)].map((m) => m[1]!),
  );
  const questFlagIds = new Set(QUESTS.flatMap((q) => q.reward.flags ?? []));
  const sceneOptionFlagIds = new Set(
    SCENES.flatMap((d) => d.scene.decision.options.flatMap((o) => o.flags ?? [])),
  );
  // ADR-177 — the works chain sets its flags data-driven (worksPass over
  // WORKS_PROJECTS), so the literal-setFlag scan can't see them; derive from the
  // source of truth instead (never a hand list).
  const worksFlagIds = new Set(
    WORKS_PROJECTS.flatMap((p) => [p.namedFlag, p.seenFlag, ...p.zones.map((z) => z.seenFlag)]),
  );
  const rankIds = new Set(RANKS.map((r) => r.id));

  it('scripted scenes have a known enqueuer; flag scenes a known setter; rung/season are real', () => {
    for (const def of SCENES) {
      const t = def.trigger;
      switch (t.kind) {
        case 'scripted':
          expect(enqueuedIds.has(def.id), `'${def.id}' is authored but nothing enqueues it`).toBe(
            true,
          );
          break;
        case 'flag':
          expect(
            setFlagIds.has(t.flag) ||
              questFlagIds.has(t.flag) ||
              sceneOptionFlagIds.has(t.flag) ||
              worksFlagIds.has(t.flag),
            `'${def.id}' waits on flag '${t.flag}' which nothing sets`,
          ).toBe(true);
          break;
        case 'rung':
          expect(rankIds.has(t.rung), `'${def.id}' fires on unknown rung '${t.rung}'`).toBe(true);
          break;
        case 'season-exit':
          expect(
            (SEASONS as readonly string[]).includes(t.season),
            `'${def.id}' fires on unknown season '${t.season}'`,
          ).toBe(true);
          break;
        case 'verb':
          break; // verb scenes are opened by explicit intents — C4.2's talk affordance owns them
      }
    }
  });
});
