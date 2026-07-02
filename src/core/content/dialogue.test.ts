import { describe, it, expect } from 'vitest';
import {
  DIALOGUES,
  DIALOGUE_IDS,
  COLD_OPEN_DIALOGUE_ID,
  getDialogue,
  nextDialogueLines,
} from './dialogue';
import { NAMES } from './names';

const NONE: ReadonlySet<string> = new Set();
const NO_FLAGS: Readonly<Record<string, boolean>> = {};

describe('dialogue registry shape', () => {
  it('every def has a non-empty, speaker-attributed, globally-uniquely-keyed line set', () => {
    expect(DIALOGUES.length).toBeGreaterThan(0);
    expect(DIALOGUE_IDS.size).toBe(DIALOGUES.length); // dialogue ids are unique
    const seenLineIds = new Set<string>();
    const seenDefIds = new Set<string>();
    for (const def of DIALOGUES) {
      expect(def.id).toBeTruthy();
      expect(def.speaker).toBeTruthy();
      expect(seenDefIds.has(def.id)).toBe(false);
      seenDefIds.add(def.id);
      expect(def.lines.length).toBeGreaterThan(0);
      for (const line of def.lines) {
        expect(line.id).toBeTruthy();
        expect(line.speaker).toBeTruthy();
        expect(line.text.length).toBeGreaterThan(0);
        expect(seenLineIds.has(line.id)).toBe(false); // line ids are globally unique
        seenLineIds.add(line.id);
      }
    }
  });

  it('covers the domain-split cast: Genemon (estate), Kihei (arms), Sōan (healing)', () => {
    const speakers = DIALOGUES.map((d) => d.speaker);
    expect(speakers).toContain(NAMES.elder);
    expect(speakers).toContain(NAMES.drillmaster);
    expect(speakers).toContain(NAMES.physician);
  });

  it('getDialogue returns the def by id and throws on an unknown id', () => {
    expect(getDialogue(COLD_OPEN_DIALOGUE_ID).speaker).toBe(NAMES.elder);
    expect(() => getDialogue('no-such-dialogue')).toThrow();
  });
});

describe('nextDialogueLines cursor', () => {
  it("returns Genemon's opener, in registry order, when nothing has been delivered", () => {
    const lines = nextDialogueLines(COLD_OPEN_DIALOGUE_ID, NONE, NO_FLAGS);
    expect(lines.length).toBeGreaterThan(0);
    expect(lines[0]!.speaker).toBe(NAMES.elder);
    // the opener is exactly the ungated lines (the flag-gated payoff is withheld), in order
    const def = getDialogue(COLD_OPEN_DIALOGUE_ID);
    const ungatedInOrder = def.lines.filter((l) => l.gate === undefined).map((l) => l.id);
    expect(lines.map((l) => l.id)).toEqual(ungatedInOrder);
  });

  it('returns [] once every line has been delivered', () => {
    const def = getDialogue(COLD_OPEN_DIALOGUE_ID);
    const allDelivered = new Set(def.lines.map((l) => l.id));
    expect(nextDialogueLines(COLD_OPEN_DIALOGUE_ID, allDelivered, { raked: true })).toEqual([]);
  });

  it('withholds a gated line while its flag is false, reveals it once satisfied', () => {
    const def = getDialogue(COLD_OPEN_DIALOGUE_ID);
    const gated = def.lines.find((l) => l.gate !== undefined);
    expect(gated).toBeDefined();
    // gate(flags) === false → the line is withheld
    const off = nextDialogueLines(COLD_OPEN_DIALOGUE_ID, NONE, { raked: false });
    expect(off.map((l) => l.id)).not.toContain(gated!.id);
    // an absent flag is also withheld (gate reads false)
    const absent = nextDialogueLines(COLD_OPEN_DIALOGUE_ID, NONE, NO_FLAGS);
    expect(absent.map((l) => l.id)).not.toContain(gated!.id);
    // gate(flags) === true → the line surfaces
    const on = nextDialogueLines(COLD_OPEN_DIALOGUE_ID, NONE, { raked: true });
    expect(on.map((l) => l.id)).toContain(gated!.id);
  });

  it('advances as lines are delivered — the cursor skips delivered ids, preserving order', () => {
    const def = getDialogue(COLD_OPEN_DIALOGUE_ID);
    const firstId = def.lines[0]!.id;
    const after = nextDialogueLines(COLD_OPEN_DIALOGUE_ID, new Set([firstId]), { raked: true });
    expect(after.map((l) => l.id)).not.toContain(firstId);
    expect(after.map((l) => l.id)).toEqual(def.lines.slice(1).map((l) => l.id));
  });

  it('is deterministic — identical inputs yield identical output, in stable registry order', () => {
    const a = nextDialogueLines(COLD_OPEN_DIALOGUE_ID, NONE, { raked: true });
    const b = nextDialogueLines(COLD_OPEN_DIALOGUE_ID, NONE, { raked: true });
    expect(a.map((l) => l.id)).toEqual(b.map((l) => l.id));
    // with every gate satisfied the result is exactly the full line set, unsorted/unshuffled
    const def = getDialogue(COLD_OPEN_DIALOGUE_ID);
    expect(a.map((l) => l.id)).toEqual(def.lines.map((l) => l.id));
  });
});

describe('labour narration voice (F57)', () => {
  it("the rake labour-narration line ('So you put your hands to it…') is voice 'narrator'", () => {
    const def = getDialogue(COLD_OPEN_DIALOGUE_ID);
    const rakeNarration = def.lines.find((l) => l.id === 'gen-rake');
    expect(rakeNarration).toBeDefined();
    // it renders in the consistent narrator colour/convention (like the intro's narration), not
    // as NPC speech — so it must carry the explicit 'narrator' voice tag.
    expect(rakeNarration!.voice).toBe('narrator');
  });
});

describe('teach-by-reveal voice (D-015 / D-064: non-hand-holdy, no popups)', () => {
  it('no line uses tooltip / hint phrasing', () => {
    const banned = [/\bclick\b/i, /tap here/i, /\btip:/i];
    for (const def of DIALOGUES) {
      for (const line of def.lines) {
        for (const re of banned) {
          expect(line.text).not.toMatch(re);
        }
      }
    }
  });
});
