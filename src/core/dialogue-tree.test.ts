import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  reduce,
  DIALOGUE_SCENES,
  INTRO_SCENE_COUNT,
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
const wake = (seed = 1): GameState => reduce(createInitialState(seed), { type: 'open_eyes' });
const attrTotal = (s: GameState): number =>
  ATTR_IDS.reduce((n, id) => n + (s.character.attrs[id] ?? 0), 0);
const sceneById = (id: string): DialogueScene => DIALOGUE_SCENES.find((s) => s.id === id)!;

/** Drive the intro to the genemon scene (index 2) by taking each scene's first decision option. */
const atGenemon = (): GameState => {
  let s = wake();
  s = reduce(s, { type: 'choose_intro', optionId: sceneById('soan').decision.options[0]!.id });
  s = reduce(s, { type: 'choose_intro', optionId: sceneById('dream').decision.options[0]!.id });
  return s; // introBeat === 2, the genemon scene
};

describe('DIALOGUE_SCENES — the dialogue-tree data (npc-dialogue-tree plan §3.4/§4)', () => {
  it('is exactly the 3 ordered scenes: Sōan, the self-dream, Genemon', () => {
    expect(INTRO_SCENE_COUNT).toBe(3);
    expect(DIALOGUE_SCENES.map((s) => s.id)).toEqual(['soan', 'dream', 'genemon']);
    expect(sceneById('soan').speaker).toBe('soan');
    expect(sceneById('dream').speaker).toBeUndefined(); // self scene — narrator, no NPC
    expect(sceneById('genemon').speaker).toBe('genemon');
  });

  it('every scene has a greeting + a decision (prompt + 3 balanced options)', () => {
    for (const scene of DIALOGUE_SCENES) {
      expect(scene.greeting.length).toBeGreaterThan(0);
      expect(scene.decision.prompt).toBeTruthy();
      expect(scene.decision.options.length).toBe(3);
    }
  });

  it('the NPC scenes carry an ask hub; the dream is topic-less (decision-only)', () => {
    expect(sceneById('soan').topics.length).toBeGreaterThan(0);
    expect(sceneById('genemon').topics.length).toBeGreaterThan(0);
    expect(sceneById('dream').topics).toEqual([]); // no hub — degenerates to today's inner beat
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
  it('an ungated topic is always available; a gated one is hidden until its prerequisite is asked', () => {
    const gen = sceneById('genemon');
    const gated = gen.topics.find((t) => t.gate !== undefined)!;
    // gen-danger is gated on gen-work — so with nothing asked it is NOT yet in the hub…
    const emptyIds = availableTopics(gen, new Set()).map((t) => t.id);
    expect(emptyIds).not.toContain(gated.id);
    expect(emptyIds.length).toBe(gen.topics.length - 1); // every OTHER topic is available
    // …and once its prerequisite is asked, it surfaces.
    const prereq = gen.topics.find((t) => t.id === 'gen-work')!;
    const afterIds = availableTopics(gen, new Set([prereq.id])).map((t) => t.id);
    expect(afterIds).toContain(gated.id);
  });
});

describe('ask_topic — reveal the answer, mark asked, touch nothing else (plan §3.3)', () => {
  it('voices the MC question (player) THEN the NPC answer line(s) (NPC voice), and marks asked', () => {
    const s = wake();
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
    const s = wake();
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

  it('is RE-ASKABLE: a second ask re-emits the answer but the asked-set stays (idempotent)', () => {
    const s = wake();
    const topic = introSceneAt(s.introBeat)!.topics[0]!;
    const once = reduce(s, { type: 'ask_topic', topicId: topic.id });
    const twice = reduce(once, { type: 'ask_topic', topicId: topic.id });
    // the answer is re-emitted (the exchange grows)…
    expect(twice.log.entries.length).toBeGreaterThan(once.log.entries.length);
    // …but the id is recorded ONCE (idempotent — the dim set doesn't grow).
    expect(twice.askedTopics.filter((id) => id === topic.id).length).toBe(1);
  });

  it('rejects a gated topic before its prerequisite, then accepts it after (no-op discipline)', () => {
    const gen = sceneById('genemon');
    const gated = gen.topics.find((t) => t.gate !== undefined)!;
    const s = atGenemon();
    // before gen-work: the gate fails ⇒ pure no-op (same state reference)
    expect(reduce(s, { type: 'ask_topic', topicId: gated.id })).toBe(s);
    // ask the prerequisite, then the gated topic is accepted
    const afterPrereq = reduce(s, { type: 'ask_topic', topicId: 'gen-work' });
    const afterGated = reduce(afterPrereq, { type: 'ask_topic', topicId: gated.id });
    expect(afterGated.askedTopics).toContain(gated.id);
  });

  it('is a no-op for a topic from ANOTHER scene, a foreign id, or when the intro is inactive', () => {
    const s = wake(); // at the soan scene
    const genTopic = sceneById('genemon').topics[0]!;
    expect(reduce(s, { type: 'ask_topic', topicId: genTopic.id })).toBe(s); // wrong scene
    expect(reduce(s, { type: 'ask_topic', topicId: 'no-such-topic' })).toBe(s); // foreign id
    const pre = createInitialState(1); // pre-wake ⇒ inactive
    expect(reduce(pre, { type: 'ask_topic', topicId: sceneById('soan').topics[0]!.id })).toBe(pre);
  });
});

describe('the DECISION still resolves after any asking — the net-zero invariant holds', () => {
  it('asking every topic then deciding keeps the total attribute count constant + advances + writes memory', () => {
    let s = wake();
    const totalBefore = attrTotal(s);
    // grill Sōan with every currently-available topic (exploration is free)
    for (const t of availableTopics(introSceneAt(s.introBeat)!, new Set(s.askedTopics))) {
      s = reduce(s, { type: 'ask_topic', topicId: t.id });
    }
    expect(attrTotal(s)).toBe(totalBefore); // asking changed nothing
    // now DECIDE — the balanced closer applies its +1/−1 + writes soan, and advances the scene
    const curt = sceneById('soan').decision.options.find((o) => o.memory?.regard === 'curt')!;
    const after = reduce(s, { type: 'choose_intro', optionId: curt.id });
    expect(attrTotal(after)).toBe(totalBefore); // still net-zero — the decision is a TRADE
    expect(after.character.attrs[curt.stat.up]).toBe((s.character.attrs[curt.stat.up] ?? 0) + 1);
    expect(after.character.attrs[curt.stat.down]).toBe(
      (s.character.attrs[curt.stat.down] ?? 0) - 1,
    );
    expect(npcRegard(after, 'soan')).toBe('curt'); // memory written by the decision, not the asks
    expect(after.introBeat).toBe(s.introBeat + 1); // advanced to the next scene
  });

  it('the full ask→decide e2e lands the intro complete, whatever the asking pattern', () => {
    let s = wake();
    // ask a couple at Sōan, decide; skip the dream hub (none); ask + decide at Genemon
    s = reduce(s, { type: 'ask_topic', topicId: 'soan-kami' });
    s = reduce(s, { type: 'ask_topic', topicId: 'soan-mend' });
    s = reduce(s, { type: 'choose_intro', optionId: sceneById('soan').decision.options[1]!.id });
    s = reduce(s, { type: 'choose_intro', optionId: sceneById('dream').decision.options[2]!.id });
    s = reduce(s, { type: 'ask_topic', topicId: 'gen-house' });
    s = reduce(s, { type: 'choose_intro', optionId: sceneById('genemon').decision.options[0]!.id });
    expect(s.introBeat).toBe(INTRO_SCENE_COUNT); // intro done
    // the whole run's asked history survives (never cleared)
    expect(s.askedTopics).toEqual(['soan-kami', 'soan-mend', 'gen-house']);
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
    const s3 = markTopicAsked(s2, 'gen-house');
    expect(s3.askedTopics).toEqual(['soan-kami', 'gen-house']);
  });
  it('introTopic finds a topic on its scene and is undefined for a foreign id', () => {
    const soan = sceneById('soan');
    expect(introTopic(soan, soan.topics[0]!.id)).toBe(soan.topics[0]);
    expect(introTopic(soan, 'gen-house')).toBeUndefined(); // a topic from another scene
  });
});
