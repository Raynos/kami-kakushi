import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  reduce,
  DIALOGUE_SCENES,
  INTRO_SCENE_COUNT,
  introActive,
  availableTopics,
  introTopic,
  introSceneAt,
  markTopicAsked,
  npcRegard,
  ATTR_IDS,
  PLAYER_SPEAKER,
  type GameState,
  type DialogueScene,
} from './index';

// Fixtures derive from DIALOGUE_SCENES (the source of truth) — a content edit that breaks an
// invariant (a topic with no answer, a stat lean leaking into ask_topic, a broken gate) goes RED
// here rather than shipping. No copied magic numbers.
// HD-37 (the cold-open rearc, re-opens C4.9): the intro is the THREE-act arc again —
// dream (decide-only) → soan (the ask-hub sickroom) → genemon. Ask-machinery fixtures
// anchor on soan via atScene() (derived — a reorder flows through); the GATE machinery is
// exercised both on the constructed scene below and by genemon's real `after:`-gated topic.
const wake = (seed = 1): GameState => reduce(createInitialState(seed), { type: 'open_eyes' });
// walk the intro forward (first option each pick) until the named scene is live.
const atScene = (id: string, seed = 1): GameState => {
  let s = wake(seed);
  while (introActive(s.introBeat) && introSceneAt(s.introBeat)!.id !== id) {
    s = reduce(s, {
      type: 'choose_intro',
      optionId: introSceneAt(s.introBeat)!.decision.options[0]!.id,
    });
  }
  return s;
};
const attrTotal = (s: GameState): number =>
  ATTR_IDS.reduce((n, id) => n + (s.character.attrs[id] ?? 0), 0);
const sceneById = (id: string): DialogueScene => DIALOGUE_SCENES.find((s) => s.id === id)!;

describe('DIALOGUE_SCENES — the dialogue-tree data (npc-dialogue-tree plan §3.4/§4)', () => {
  it('is exactly the HD-37 three-act arc: dream → soan → genemon, in that order', () => {
    expect(INTRO_SCENE_COUNT).toBe(3);
    expect(DIALOGUE_SCENES.map((s) => s.id)).toEqual(['dream', 'soan', 'genemon']);
    expect(sceneById('soan').speaker).toBe('soan');
    expect(sceneById('genemon').speaker).toBe('genemon');
  });

  it('every scene has a greeting + a decision (prompt + 3 balanced options)', () => {
    for (const scene of DIALOGUE_SCENES) {
      expect(scene.greeting.length).toBeGreaterThan(0);
      expect(scene.decision.prompt).toBeTruthy();
      expect(scene.decision.options.length).toBe(3);
    }
  });

  it('the sickroom scene carries an ask hub (exploration before the identity fork)', () => {
    expect(sceneById('soan').topics.length).toBeGreaterThan(0);
  });

  it('every topic has an id, a spoken label, and non-empty answer line(s)', () => {
    for (const scene of DIALOGUE_SCENES) {
      for (const t of scene.topics) {
        expect(t.id).toBeTruthy();
        expect(t.label).toBeTruthy();
        expect(t.answer.length).toBeGreaterThan(0);
        for (const line of t.answer) expect(line.text).toBeTruthy();
      }
    }
  });

  it('topic ids are globally unique (askedTopics is a flat set)', () => {
    const ids = DIALOGUE_SCENES.flatMap((s) => s.topics.map((t) => t.id));
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('availableTopics — the gate over the asked-set', () => {
  // The gate MACHINERY is exercised on a constructed scene (the pure function is the lever);
  // genemon's real `after:`-gated topic is asserted alongside (back with the HD-37 rearc).
  const base = sceneById('soan');
  const gatedScene: DialogueScene = {
    ...base,
    topics: [
      { ...base.topics[0]!, id: 'g-open' },
      { ...base.topics[1]!, id: 'g-gated', gate: (asked) => asked.has('g-open') },
    ],
  };
  it('an ungated topic is always available; a gated one is hidden until its prerequisite is asked', () => {
    const emptyIds = availableTopics(gatedScene, new Set()).map((t) => t.id);
    expect(emptyIds).toEqual(['g-open']);
    const afterIds = availableTopics(gatedScene, new Set(['g-open'])).map((t) => t.id);
    expect(afterIds).toContain('g-gated');
  });
  it("genemon's real gated topic hides until its prerequisite is asked (derived from the scene)", () => {
    const gen = sceneById('genemon');
    const gated = gen.topics.find((t) => t.gate)!;
    expect(gated).toBeTruthy();
    const fresh = availableTopics(gen, new Set()).map((t) => t.id);
    expect(fresh).not.toContain(gated.id);
    const ungatedIds = gen.topics.filter((t) => !t.gate).map((t) => t.id);
    const opened = availableTopics(gen, new Set(ungatedIds)).map((t) => t.id);
    expect(opened).toContain(gated.id);
  });
});

describe('ask_topic — reveal the answer, mark asked, touch nothing else (plan §3.3)', () => {
  it('voices the MC question (player) THEN the NPC answer line(s) (NPC voice), and marks asked', () => {
    const s = atScene('soan');
    const scene = introSceneAt(s.introBeat)!; // soan
    const topic = scene.topics[0]!;
    const after = reduce(s, { type: 'ask_topic', topicId: topic.id });

    const texts = after.log.entries.map((e) => e.text);
    expect(texts).toContain(topic.label); // the question was voiced
    for (const line of topic.answer) expect(texts).toContain(line.text); // + the answer

    // the question is a `player` line with the 'You' nameplate, ordered BEFORE the answer
    const q = after.log.entries.find((e) => e.text === topic.label)!;
    expect(q.voice).toBe('player');
    expect(q.speaker).toBe(PLAYER_SPEAKER);
    const a = after.log.entries.find((e) => e.text === topic.answer[0]!.text)!;
    expect(a.voice).toBe(topic.answer[0]!.voice); // NPC voice, carried from the authored line
    expect(a.speaker).toBe(topic.answer[0]!.speaker);
    expect(after.log.entries.indexOf(q)).toBeLessThan(after.log.entries.indexOf(a));

    // marked asked (drives the dim state)
    expect(after.askedTopics).toContain(topic.id);
  });

  it('changes NO attribute, writes NO memory, and does NOT advance the scene', () => {
    const s = atScene('soan');
    const scene = introSceneAt(s.introBeat)!;
    const topic = scene.topics[0]!;
    const totalBefore = attrTotal(s);
    const after = reduce(s, { type: 'ask_topic', topicId: topic.id });

    expect(attrTotal(after)).toBe(totalBefore); // no stat lean at all
    for (const id of ATTR_IDS) expect(after.character.attrs[id]).toBe(s.character.attrs[id]);
    expect(after.character.attributePoints).toBe(s.character.attributePoints);
    expect(after.npcMemory).toEqual(s.npcMemory); // asking never touches regard/warmth
    expect(after.introBeat).toBe(s.introBeat); // still in the hub — no advance
  });

  it('a SECOND ask is a full no-op — no duplicate Q+A in the permanent log (FB-269)', () => {
    // FB-269 reverses the old re-emit: refresh-replays and double-clicks were stacking
    // duplicate exchanges in Chat; the transcript already shows the asked Q+A permanently.
    const s = atScene('soan');
    const topic = introSceneAt(s.introBeat)!.topics[0]!;
    const once = reduce(s, { type: 'ask_topic', topicId: topic.id });
    const twice = reduce(once, { type: 'ask_topic', topicId: topic.id });
    expect(twice).toBe(once); // identity — the reducer refuses outright
    expect(twice.askedTopics.filter((id) => id === topic.id).length).toBe(1);
  });

  it('is a no-op for a foreign id, and when the intro is inactive', () => {
    const s = atScene('soan');
    expect(reduce(s, { type: 'ask_topic', topicId: 'no-such-topic' })).toBe(s); // foreign id
    const pre = createInitialState(1); // pre-wake ⇒ inactive
    expect(reduce(pre, { type: 'ask_topic', topicId: sceneById('soan').topics[0]!.id })).toBe(pre);
  });
});

describe('the DECISION still resolves after any asking — the net-zero invariant holds', () => {
  it('asking every topic then deciding keeps the total attribute count constant + advances + writes memory', () => {
    let s = atScene('soan');
    const totalBefore = attrTotal(s);
    // grill Sōan with every currently-available topic (exploration is free)
    for (const t of availableTopics(introSceneAt(s.introBeat)!, new Set(s.askedTopics))) {
      s = reduce(s, { type: 'ask_topic', topicId: t.id });
    }
    expect(attrTotal(s)).toBe(totalBefore); // asking changed nothing
    // now DECIDE — the balanced closer applies its +1/−1 + writes soan, and advances the scene.
    // Pick a real Sōan option that carries a memory write (derived, not a copied regard literal).
    const opt = sceneById('soan').decision.options.find((o) => o.memory)!;
    const after = reduce(s, { type: 'choose_intro', optionId: opt.id });
    expect(attrTotal(after)).toBe(totalBefore); // still net-zero — the decision is a TRADE
    expect(after.character.attrs[opt.stat.up]).toBe((s.character.attrs[opt.stat.up] ?? 0) + 1);
    expect(after.character.attrs[opt.stat.down]).toBe((s.character.attrs[opt.stat.down] ?? 0) - 1);
    expect(npcRegard(after, 'soan')).toBe(opt.memory!.regard); // memory written by the decision, not the asks
    expect(after.introBeat).toBe(s.introBeat + 1); // advanced past the scene
  });

  it('the full ask→decide e2e lands the intro complete, whatever the asking pattern', () => {
    // topic ids derived from the scenes (source of truth) — a content re-author flows through.
    let s = reduce(atScene('soan'), {
      type: 'ask_topic',
      topicId: sceneById('soan').topics[0]!.id,
    });
    s = reduce(s, { type: 'ask_topic', topicId: sceneById('soan').topics[1]!.id });
    s = reduce(s, { type: 'choose_intro', optionId: sceneById('soan').decision.options[1]!.id });
    // now at genemon: ask one, then decide — the LAST scene done ⇒ intro done.
    s = reduce(s, { type: 'ask_topic', topicId: sceneById('genemon').topics[0]!.id });
    s = reduce(s, { type: 'choose_intro', optionId: sceneById('genemon').decision.options[0]!.id });
    expect(s.introBeat).toBe(INTRO_SCENE_COUNT);
    // the whole run's asked history survives (never cleared)
    expect(s.askedTopics).toEqual([
      sceneById('soan').topics[0]!.id,
      sceneById('soan').topics[1]!.id,
      sceneById('genemon').topics[0]!.id,
    ]);
  });
});

describe("FB-316 — every intro-emitted line carries the scene context ('the cold open')", () => {
  it('greeting, ask Q+A, and decision say+react all group into ONE 幕 card (no context gaps)', () => {
    // A context-less line inside the run fractures the Story log's scene card (the
    // FB-316 "black space" fragmentation) — so the invariant is TOTAL coverage: every
    // line the intro writes to the log carries the scene context. Derived from the
    // real reducer path, not copied fixtures.
    let s = atScene('soan');
    const preIntro = s.log.entries.length; // pre-scene lines (open_eyes ran in atScene)
    s = reduce(s, { type: 'ask_topic', topicId: sceneById('soan').topics[0]!.id });
    s = reduce(s, { type: 'choose_intro', optionId: sceneById('soan').decision.options[0]!.id });
    const introLines = s.log.entries.slice(preIntro).filter((e) => e.channel === 'narration'); // milestone perk box stays outside the card
    expect(introLines.length).toBeGreaterThan(2); // Q + A + say + react at minimum
    for (const e of introLines) expect(e.context).toBe('the cold open');
  });
});

describe('markTopicAsked + createInitialState — the ask-hub state (plan §3.2)', () => {
  it('a fresh state seeds askedTopics: []', () => {
    expect(createInitialState(1).askedTopics).toEqual([]);
  });
  it('markTopicAsked appends once and is idempotent (no dup on re-ask)', () => {
    const s0 = createInitialState(1);
    const s1 = markTopicAsked(s0, 'soan-kami');
    expect(s1.askedTopics).toEqual(['soan-kami']);
    const s2 = markTopicAsked(s1, 'soan-kami');
    expect(s2).toBe(s1); // idempotent — same reference, no growth
    const s3 = markTopicAsked(s2, 'soan-where');
    expect(s3.askedTopics).toEqual(['soan-kami', 'soan-where']);
  });
  it('introTopic finds a topic on its scene and is undefined for a foreign id', () => {
    const soan = sceneById('soan');
    expect(introTopic(soan, soan.topics[0]!.id)).toBe(soan.topics[0]);
    expect(introTopic(soan, 'no-such-topic')).toBeUndefined();
  });
});
