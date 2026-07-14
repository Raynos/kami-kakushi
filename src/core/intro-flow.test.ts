import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  reduce,
  availableActions,
  nextDialogueLines,
  INTRO_BEATS,
  INTRO_BEAT_COUNT,
  introActive,
  introPerkLine,
  introStatDelta,
  npcRegard,
  ATTR_IDS,
  type GameState,
} from './index';

const wake = (seed = 1): GameState =>
  reduce(createInitialState(seed), { type: 'open_eyes' });
// HD-37: three beats again — derive a beat by ID + a walker that parks the run on it.
const beatById = (id: string) => INTRO_BEATS.find((b) => b.id === id)!;
const atBeat = (id: string, seed = 1): GameState => {
  let s = wake(seed);
  while (introActive(s.introBeat) && INTRO_BEATS[s.introBeat]!.id !== id) {
    s = reduce(s, {
      type: 'choose_intro',
      optionId: INTRO_BEATS[s.introBeat]!.options![0]!.id,
    });
  }
  return s;
};

const attrTotal = (s: GameState): number =>
  ATTR_IDS.reduce((n, id) => n + (s.character.attrs[id] ?? 0), 0);

describe('interactive intro — reducer flow (plan §3.5)', () => {
  it('open_eyes starts the intro at Beat 0 (cursor −1 → 0), waking is legal only once', () => {
    const pre = createInitialState(1);
    expect(pre.introBeat).toBe(-1);
    expect(introActive(pre.introBeat)).toBe(false);
    const s = wake();
    expect(s.introBeat).toBe(0);
    expect(introActive(s.introBeat)).toBe(true);
    expect(reduce(s, { type: 'open_eyes' })).toBe(s); // already awake ⇒ no-op
  });

  it('choose_intro applies the option EXACT +1/−1 trade (net-zero) — derived from INTRO_BEATS', () => {
    const s = wake();
    const opt = INTRO_BEATS[0]!.options![0]!; // derived — beat 0's first option, whatever it trades
    const before = attrTotal(s);
    const after = reduce(s, { type: 'choose_intro', optionId: opt.id });
    // the DESIGN LEVER: the named up-attr rose by exactly 1, the down-attr fell by exactly 1
    expect(after.character.attrs[opt.stat.up]).toBe(
      (s.character.attrs[opt.stat.up] ?? 0) + 1,
    );
    expect(after.character.attrs[opt.stat.down]).toBe(
      (s.character.attrs[opt.stat.down] ?? 0) - 1,
    );
    // untouched attrs are unchanged
    for (const id of ATTR_IDS) {
      if (id !== opt.stat.up && id !== opt.stat.down) {
        expect(after.character.attrs[id]).toBe(s.character.attrs[id]);
      }
    }
    // net-zero: the total attribute count is invariant across the choice
    expect(attrTotal(after)).toBe(before);
    // no attributePoints were spent (the intro grants the lean directly)
    expect(after.character.attributePoints).toBe(s.character.attributePoints);
  });

  it('a choice emits the player say line, the NPC react line, and the perk-unlock line', () => {
    const s = wake();
    const opt = INTRO_BEATS[0]!.options![0]!;
    const after = reduce(s, { type: 'choose_intro', optionId: opt.id });
    const texts = after.log.entries.map((e) => e.text);
    expect(texts).toContain(opt.say);
    expect(texts).toContain(opt.react);
    // FB-41: the post-pick perk-unlock lands on the MILESTONE channel (Progress), NOT system (Work).
    const outcome = after.log.entries.find((e) => e.channel === 'milestone');
    expect(outcome?.text).toBe(introPerkLine(opt));
    // and it is NOT emitted on the system channel anymore (the FB-41 relocation)
    expect(
      after.log.entries.find((e) => e.channel === 'system'),
    ).toBeUndefined();
    // FB-56: that line carries the granted PERK — its name + standalone desc — plus the ±, not a bare delta.
    expect(outcome?.text).toContain(opt.perk.name);
    expect(outcome?.text).toContain(opt.perk.desc);
    expect(outcome?.text).toContain(introStatDelta(opt.stat)); // ± still present, single-source
    expect(outcome?.text).not.toBe(introStatDelta(opt.stat)); // …but never JUST the delta
    // the say line is voice-tagged 'player' with the 'You' nameplate
    const say = after.log.entries.find((e) => e.text === opt.say);
    expect(say?.voice).toBe('player');
    expect(say?.speaker).toBe('You');
  });

  it("the sickroom scene's say lines are post-flip: speaker reads Nameless, not You (FB-399)", () => {
    // intro.md's flip comment sits BEFORE the sickroom hub's asks/decide, so every
    // MC line the soan scene emits carries the ladder's first rung.
    const s = atBeat('soan');
    const opt = beatById('soan').options![0]!;
    const after = reduce(s, { type: 'choose_intro', optionId: opt.id });
    const say = after.log.entries.find((e) => e.text === opt.say);
    expect(say?.speaker).toBe('Nameless');
  });

  it('the memory write lands on the RIGHT NPC only — never cross-fed', () => {
    const s = atBeat('soan');
    // The sickroom beat answers Sōan (writes soan only); every other NPC stays unwritten.
    const soanOpt = beatById('soan').options!.find((o) => o.memory)!; // derived: the first Sōan option with a memory write
    expect(soanOpt.memory!.npc).toBe('soan');
    const afterSoan = reduce(s, { type: 'choose_intro', optionId: soanOpt.id });
    expect(npcRegard(afterSoan, 'soan')).toBe(soanOpt.memory!.regard);
    expect(afterSoan.npcMemory.soan?.warmth).toBe(soanOpt.memory!.warmth);
    expect(afterSoan.npcMemory.genemon).toBeUndefined(); // Sōan's answer never touches Genemon
  });

  it('the beat sequence advances 0→3 and COMPLETES, dropping into normal play with the rake verb', () => {
    let s = wake();
    // pick the first option at each of the 3 beats
    for (let i = 0; i < INTRO_BEAT_COUNT; i++) {
      expect(s.introBeat).toBe(i);
      s = reduce(s, {
        type: 'choose_intro',
        optionId: INTRO_BEATS[i]!.options![0]!.id,
      });
    }
    expect(s.introBeat).toBe(INTRO_BEAT_COUNT); // cursor at length ⇒ intro done
    expect(introActive(s.introBeat)).toBe(false);
    // the tail revealed the closing narration and handed off: the rake verb is available
    expect(availableActions(s)).toContain('rake_rice');
    // a further choice/advance is a no-op once the intro is over
    expect(reduce(s, { type: 'choose_intro', optionId: 'soan-grateful' })).toBe(
      s,
    );
    expect(reduce(s, { type: 'advance_intro' })).toBe(s);
  });

  it('choose_intro is a no-op for a foreign option id or when the intro is inactive', () => {
    const s = wake();
    expect(
      reduce(s, { type: 'choose_intro', optionId: 'genemon-earnest' }),
    ).toBe(s); // wrong beat
    expect(
      reduce(s, { type: 'choose_intro', optionId: 'no-such-option' }),
    ).toBe(s);
    const pre = createInitialState(1); // pre-wake ⇒ inactive
    expect(
      reduce(pre, { type: 'choose_intro', optionId: 'soan-grateful' }),
    ).toBe(pre);
  });
});

describe('per-NPC memory READ — a later Sōan line branches on regard (plan §4.5)', () => {
  const soanGreetIds = (s: GameState): string[] =>
    nextDialogueLines('soan-intro', new Set(), s.flags, s.npcMemory)
      .map((l) => l.id)
      .filter((id) => id.startsWith('soan-greet-'));

  it("a GRATEFUL regard surfaces Sōan's warm greeting, not the cool one", () => {
    // The dialogue greeting branches on regard === 'grateful' (warm) vs else (cool). The intro's
    // re-authored regards no longer include 'grateful', so the READ is exercised at its source: a
    // Sōan remembered as grateful surfaces the warm greeting (RED if the memGate branch breaks).
    const s: GameState = {
      ...wake(),
      npcMemory: { soan: { regard: 'grateful', warmth: 1 } },
    };
    expect(npcRegard(s, 'soan')).toBe('grateful');
    expect(soanGreetIds(s)).toEqual(['soan-greet-grateful']);
  });

  it('any OTHER regard surfaces the COOL greeting — the branches are mutually exclusive', () => {
    // a REAL intro answer (the first Sōan option) leaves a non-grateful regard → the cool greeting.
    const opt = beatById('soan').options!.find((o) => o.memory)!;
    const s = reduce(atBeat('soan'), {
      type: 'choose_intro',
      optionId: opt.id,
    });
    expect(npcRegard(s, 'soan')).toBe(opt.memory!.regard);
    expect(npcRegard(s, 'soan')).not.toBe('grateful');
    expect(soanGreetIds(s)).toEqual(['soan-greet-curt']);
  });

  it('an UNMET Sōan (no intro answer) still resolves to exactly one greeting (the cool default)', () => {
    const fresh = createInitialState(1);
    expect(npcRegard(fresh, 'soan')).toBe('');
    expect(soanGreetIds(fresh)).toEqual(['soan-greet-curt']);
  });

  it('the read is per-NPC: Genemon regard does NOT change which Sōan greeting shows', () => {
    // a real (non-grateful) Sōan answer → cool; an earnest Genemon (seeded directly, so the
    // assertion is independent of the genemon beat's own options) must not warm the Sōan greeting.
    const soanOpt = beatById('soan').options!.find((o) => o.memory)!;
    const s0 = reduce(atBeat('soan'), {
      type: 'choose_intro',
      optionId: soanOpt.id,
    });
    const s = {
      ...s0,
      npcMemory: { ...s0.npcMemory, genemon: { regard: 'earnest', warmth: 1 } },
    };
    expect(npcRegard(s, 'genemon')).toBe('earnest');
    expect(soanGreetIds(s)).toEqual(['soan-greet-curt']); // unaffected by Genemon
  });
});
