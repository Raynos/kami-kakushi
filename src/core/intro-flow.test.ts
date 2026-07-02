import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  reduce,
  availableActions,
  nextDialogueLines,
  INTRO_BEATS,
  INTRO_BEAT_COUNT,
  introActive,
  introStatLine,
  npcRegard,
  ATTR_IDS,
  type GameState,
} from './index';

const wake = (seed = 1): GameState => reduce(createInitialState(seed), { type: 'open_eyes' });

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
    const opt = INTRO_BEATS[0]!.options![0]!; // soan-grateful (+INT/−STR)
    const before = attrTotal(s);
    const after = reduce(s, { type: 'choose_intro', optionId: opt.id });
    // the DESIGN LEVER: the named up-attr rose by exactly 1, the down-attr fell by exactly 1
    expect(after.character.attrs[opt.stat.up]).toBe((s.character.attrs[opt.stat.up] ?? 0) + 1);
    expect(after.character.attrs[opt.stat.down]).toBe((s.character.attrs[opt.stat.down] ?? 0) - 1);
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

  it('a choice emits the player say line, the NPC react line, and the post-pick ± system line', () => {
    const s = wake();
    const opt = INTRO_BEATS[0]!.options![0]!;
    const after = reduce(s, { type: 'choose_intro', optionId: opt.id });
    const texts = after.log.entries.map((e) => e.text);
    expect(texts).toContain(opt.say);
    expect(texts).toContain(opt.react);
    // the diegetic-hint-only ± lands AFTER the pick, on the SYSTEM channel (not on the button)
    const sys = after.log.entries.find((e) => e.channel === 'system');
    expect(sys?.text).toBe(introStatLine(opt.stat));
    // the say line is voice-tagged 'player' with the 'You' nameplate
    const say = after.log.entries.find((e) => e.text === opt.say);
    expect(say?.voice).toBe('player');
    expect(say?.speaker).toBe('You');
  });

  it('the memory write lands on the RIGHT NPC only — never cross-fed', () => {
    const s = wake();
    // Beat 1 → answer Sōan curtly (writes soan only); genemon must stay unwritten.
    const curt = INTRO_BEATS[0]!.options!.find((o) => o.memory?.regard === 'curt')!;
    const afterSoan = reduce(s, { type: 'choose_intro', optionId: curt.id });
    expect(npcRegard(afterSoan, 'soan')).toBe('curt');
    expect(afterSoan.npcMemory.soan?.warmth).toBe(curt.memory!.warmth);
    expect(afterSoan.npcMemory.genemon).toBeUndefined(); // Sōan's answer never touches Genemon

    // …advance through the dream (Beat 2, no memory) then answer Genemon earnestly (writes genemon).
    const afterDream = reduce(afterSoan, {
      type: 'choose_intro',
      optionId: INTRO_BEATS[1]!.options![0]!.id,
    });
    expect(afterDream.npcMemory.genemon).toBeUndefined(); // the dream writes NOTHING
    const earnest = INTRO_BEATS[2]!.options!.find((o) => o.memory?.regard === 'earnest')!;
    const afterGen = reduce(afterDream, { type: 'choose_intro', optionId: earnest.id });
    // both memories now coexist, independently: cool Sōan + warm Genemon
    expect(npcRegard(afterGen, 'soan')).toBe('curt');
    expect(npcRegard(afterGen, 'genemon')).toBe('earnest');
  });

  it('the beat sequence advances 0→3 and COMPLETES, dropping into normal play with the rake verb', () => {
    let s = wake();
    // pick the first option at each of the 3 beats
    for (let i = 0; i < INTRO_BEAT_COUNT; i++) {
      expect(s.introBeat).toBe(i);
      s = reduce(s, { type: 'choose_intro', optionId: INTRO_BEATS[i]!.options![0]!.id });
    }
    expect(s.introBeat).toBe(INTRO_BEAT_COUNT); // cursor at length ⇒ intro done
    expect(introActive(s.introBeat)).toBe(false);
    // the tail revealed the closing narration and handed off: the rake verb is available
    expect(availableActions(s)).toContain('rake_rice');
    // a further choice/advance is a no-op once the intro is over
    expect(reduce(s, { type: 'choose_intro', optionId: 'soan-grateful' })).toBe(s);
    expect(reduce(s, { type: 'advance_intro' })).toBe(s);
  });

  it('choose_intro is a no-op for a foreign option id or when the intro is inactive', () => {
    const s = wake();
    expect(reduce(s, { type: 'choose_intro', optionId: 'genemon-earnest' })).toBe(s); // wrong beat
    expect(reduce(s, { type: 'choose_intro', optionId: 'no-such-option' })).toBe(s);
    const pre = createInitialState(1); // pre-wake ⇒ inactive
    expect(reduce(pre, { type: 'choose_intro', optionId: 'soan-grateful' })).toBe(pre);
  });
});

describe('per-NPC memory READ — a later Sōan line branches on regard (plan §4.5)', () => {
  const soanGreetIds = (s: GameState): string[] =>
    nextDialogueLines('soan-intro', new Set(), s.flags, s.npcMemory)
      .map((l) => l.id)
      .filter((id) => id.startsWith('soan-greet-'));

  it("a GRATEFUL answer surfaces Sōan's warm greeting, not the cool one", () => {
    const s = reduce(wake(), { type: 'choose_intro', optionId: 'soan-grateful' });
    expect(npcRegard(s, 'soan')).toBe('grateful');
    expect(soanGreetIds(s)).toEqual(['soan-greet-grateful']);
  });

  it('a CURT answer surfaces the COOL greeting instead — the branches are mutually exclusive', () => {
    const s = reduce(wake(), { type: 'choose_intro', optionId: 'soan-curt' });
    expect(npcRegard(s, 'soan')).toBe('curt');
    expect(soanGreetIds(s)).toEqual(['soan-greet-curt']);
  });

  it('an UNMET Sōan (no intro answer) still resolves to exactly one greeting (the cool default)', () => {
    const fresh = createInitialState(1);
    expect(npcRegard(fresh, 'soan')).toBe('');
    expect(soanGreetIds(fresh)).toEqual(['soan-greet-curt']);
  });

  it('the read is per-NPC: Genemon regard does NOT change which Sōan greeting shows', () => {
    // curt to Sōan but earnest to Genemon → Sōan still cool (reads soan key only)
    let s = reduce(wake(), { type: 'choose_intro', optionId: 'soan-curt' });
    s = reduce(s, { type: 'choose_intro', optionId: INTRO_BEATS[1]!.options![0]!.id }); // dream
    s = reduce(s, { type: 'choose_intro', optionId: 'genemon-earnest' });
    expect(npcRegard(s, 'genemon')).toBe('earnest');
    expect(soanGreetIds(s)).toEqual(['soan-greet-curt']); // unaffected by Genemon
  });
});
