import { describe, it, expect, afterEach } from 'vitest';
import {
  DIALOGUES,
  DIALOGUE_IDS,
  COLD_OPEN_DIALOGUE_ID,
  getDialogue,
  getDialogueLine,
  nextDialogueLines,
  dialogueLineText,
} from './dialogue';
import { __setStoryOverlay } from './story-overlay';
import { renderLogLine } from './log-render';
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
    const ungatedInOrder = def.lines
      .filter((l) => l.gate === undefined)
      .map((l) => l.id);
    expect(lines.map((l) => l.id)).toEqual(ungatedInOrder);
  });

  it('returns [] once every line has been delivered', () => {
    const def = getDialogue(COLD_OPEN_DIALOGUE_ID);
    const allDelivered = new Set(def.lines.map((l) => l.id));
    expect(
      nextDialogueLines(COLD_OPEN_DIALOGUE_ID, allDelivered, { raked: true }),
    ).toEqual([]);
  });

  it('withholds a gated line while its flag is false, reveals it once satisfied', () => {
    const def = getDialogue(COLD_OPEN_DIALOGUE_ID);
    const gated = def.lines.find((l) => l.gate !== undefined);
    expect(gated).toBeDefined();
    // gate(flags) === false → the line is withheld
    const off = nextDialogueLines(COLD_OPEN_DIALOGUE_ID, NONE, {
      raked: false,
    });
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
    const after = nextDialogueLines(COLD_OPEN_DIALOGUE_ID, new Set([firstId]), {
      raked: true,
    });
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

// ── M7 dialogue live-swap (ADR-139, 2026-07-13) — the DEV TEXT overlay. RED on main before
// this landed: no overlay existed, so every assert against 'TAKE voice' fails there. ──
describe('M7 dialogue live-swap — the DEV text overlay', () => {
  const def = getDialogue(COLD_OPEN_DIALOGUE_ID);
  const first = def.lines[0]!;
  const key = `dialogue.${COLD_OPEN_DIALOGUE_ID}.${first.id}`;

  afterEach(() => __setStoryOverlay(null));

  it('overlays TEXT ONLY by <dialogueId>.<lineId>; ids/gates/voice stay canon', () => {
    __setStoryOverlay({ [key]: 'TAKE voice' });
    const line = getDialogueLine(COLD_OPEN_DIALOGUE_ID, first.id);
    expect(line.text).toBe('TAKE voice');
    expect(line.id).toBe(first.id); // identity is canon — delivered-tracking never forks
    expect(line.gate).toBe(first.gate);
    expect(line.voice).toBe(first.voice);
    const fresh = nextDialogueLines(COLD_OPEN_DIALOGUE_ID, NONE, {
      raked: true,
    });
    expect(fresh.find((l) => l.id === first.id)?.text).toBe('TAKE voice');
  });

  it('clears back to canon (null), and an uncovered line is untouched', () => {
    const second = def.lines[1]!;
    __setStoryOverlay({ [key]: 'TAKE voice' });
    expect(getDialogueLine(COLD_OPEN_DIALOGUE_ID, second.id).text).toBe(
      second.text,
    );
    __setStoryOverlay(null);
    expect(getDialogueLine(COLD_OPEN_DIALOGUE_ID, first.id).text).toBe(
      first.text,
    );
  });

  it('reaches the log resolver — a saved/logged keyed line re-derives to the take', () => {
    expect(renderLogLine(key)).toBe(first.text); // canon first
    __setStoryOverlay({ [key]: 'TAKE voice' });
    expect(renderLogLine(key)).toBe('TAKE voice');
    expect(dialogueLineText('no-such-dialogue', 'nope')).toBeUndefined(); // codec fallback path
  });
});

describe('cold-open voice convention (F91/F93 — supersedes F57)', () => {
  // The human's FB-91/FB-93 steer: every cold-open line must be INTERNALLY CONSISTENT with the intro's
  // conventions. Genemon's SPEECH (first-person "we reckon…", "without my standing over you…")
  // carries his steward voice so it renders "Genemon: …"; third-person NARRATOR prose ("…Genemon
  // says…") carries the narrator voice with no nameplate. (This flips gen-rake from the old FB-57
  // 'narrator' tag — the human now reads it as Genemon speaking.)
  const voiceOf = (lineId: string) =>
    getDialogue(COLD_OPEN_DIALOGUE_ID).lines.find((l) => l.id === lineId)
      ?.voice;

  it("Genemon's own speech is voice 'steward' (renders 'Genemon: …')", () => {
    for (const id of ['gen-greet', 'gen-stores', 'gen-rake', 'gen-keep']) {
      expect(voiceOf(id)).toBe('steward');
    }
  });

  it("the third-person prose payoff (gen-kept, '…Genemon says…') is voice 'narrator'", () => {
    expect(voiceOf('gen-kept')).toBe('narrator');
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
