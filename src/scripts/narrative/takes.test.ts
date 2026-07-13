// ADR-139 take-set compiler — RED proofs for the bundle.md parser and the
// storyTakes emitter. Fixtures derive from source-of-truth registries (real
// rank unlocks, real NPC display names) so a registry change moves them too
// (test discipline, ADR-086…ADR-088).

import { describe, it, expect } from 'vitest';
import { parseNarrative, NarrativeError } from './parse';
import { emitStoryTakes, parseBundleMeta, buildCanonIndex, type CanonIndex } from './takes';
import { RANKS } from '../../core/content/ranks';
import { NPC_NAME } from '../../core/content/voices';

const R1_UNLOCK = RANKS.find((r) => r.id === 'R1')!.rewardOnReach!.unlock!;
const GENEMON = NPC_NAME.genemon;

const BUNDLE = `<!-- a comment
  spanning lines -->

# bundle demo · A demo bundle
hr: HR-99
rung: R1
review: project/some/review.md
rationale: canon keeps the pick because
  it reads truest.

## take b · Colder
brief: withholds warmth
scorecard: 1✔
file: take-b.md
`;

const TAKE = `## rung R1 · rung-r1
speaker: genemon
voice: steward
motivates: ${R1_UNLOCK.join(', ')}

<!--#narr-->
> A narrator line.

<!--#greet-->
${GENEMON}: "A greeting line."

### decide · A prompt?

#### opt-a · "A label."

${GENEMON}: "A react line."

flags: opt-a
`;

// Step A (session-200) — the take canonicalizes against CANON at gen time, so the tests
// build a canon whose R1 beat mirrors TAKE's interactive skeleton (1 option; greetings are
// free-length sequences) but carries DIFFERENT ids: the emitted keys must be CANON's.
const CANON_MD = `## rung R1 · rung-r1
speaker: genemon
voice: steward
motivates: ${R1_UNLOCK.join(', ')}

<!--#canon-narr-->
> The canon narrator line.

### decide · The canon prompt?

#### canon-opt · "The canon label."

${GENEMON}: "The canon react."

flags: opt-a
`;
const CANON: CanonIndex = buildCanonIndex([parseNarrative(CANON_MD, 'rung-beats.md')]);

describe('parseBundleMeta', () => {
  it('parses heading, top meta (with continuation), and take sections', () => {
    const b = parseBundleMeta(BUNDLE, 'bundle.md');
    expect(b.id).toBe('demo');
    expect(b.title).toBe('A demo bundle');
    expect(b.hr).toBe('HR-99');
    expect(b.review).toBe('project/some/review.md');
    expect(b.rationale).toBe('canon keeps the pick because it reads truest.');
    expect(b.takes).toEqual([
      {
        id: 'b',
        label: 'Colder',
        brief: 'withholds warmth',
        scorecard: '1✔',
        file: 'take-b.md',
        loc: { file: 'bundle.md', line: 11 },
      },
    ]);
  });

  it('goes RED on a take missing brief:, citing the authoring line', () => {
    const bad = BUNDLE.replace('brief: withholds warmth\n', '');
    expect(() => parseBundleMeta(bad, 'bundle.md')).toThrowError(NarrativeError);
    expect(() => parseBundleMeta(bad, 'bundle.md')).toThrowError(
      /bundle\.md:11 .* missing "brief:"/,
    );
  });

  it('goes RED on a bundle with no takes', () => {
    const bad = BUNDLE.slice(0, BUNDLE.indexOf('## take'));
    expect(() => parseBundleMeta(bad, 'bundle.md')).toThrowError(/declares no/);
  });

  it('goes RED on an unrecognised line', () => {
    expect(() => parseBundleMeta(`${BUNDLE}stray prose\n`, 'bundle.md')).toThrowError(
      /unrecognised bundle\.md line/,
    );
  });
});

describe('bundle rung (FB-307/FB-312)', () => {
  it('parses `rung: R<n>` to the bare number and emits it into the registry entry', () => {
    const meta = parseBundleMeta(BUNDLE.replace('rung: R1', 'rung: R2'), 'bundle.md');
    expect(meta.rung).toBe(2);
    expect(meta.rungReason).toBeUndefined();
    const doc = parseNarrative(TAKE, 'take-b.md');
    expect(emitStoryTakes([{ meta, docs: [doc] }], CANON)).toContain('rung: 2,');
  });

  it('parses `rung: other · <reason>` into rungReason and emits it', () => {
    const meta = parseBundleMeta(
      BUNDLE.replace('rung: R1', 'rung: other · the cold open — before R0'),
      'bundle.md',
    );
    expect(meta.rung).toBeUndefined();
    expect(meta.rungReason).toBe('the cold open — before R0');
    const doc = parseNarrative(TAKE, 'take-b.md');
    expect(emitStoryTakes([{ meta, docs: [doc] }], CANON)).toContain(
      'rungReason: "the cold open — before R0",',
    );
  });

  it('REQUIRES the field (FB-312: no catch-all) and rejects a malformed value', () => {
    expect(() => parseBundleMeta(BUNDLE.replace('rung: R1\n', ''), 'bundle.md')).toThrowError(
      /missing "rung:"/,
    );
    expect(() => parseBundleMeta(BUNDLE.replace('rung: R1', 'rung: 2'), 'bundle.md')).toThrowError(
      /rung must be "R<n>" or "other · <reason>"/,
    );
  });
});

// 2026-07-13 — a bundle must say WHO it is waiting on: an HR-item, or nobody-and-why. An open
// diverge with no line in the queue the human reads is a diverge she never sees; a settled one
// kept for comparison (hd30-nengu) must say so, or it reads as forgotten. The `review-link` gate
// checks the HR- form against review.md; this is the authoring-time half.
describe('bundle hr (the review link)', () => {
  it('REQUIRES the field, and rejects a value that is neither an HR-item nor a reasoned none', () => {
    expect(() => parseBundleMeta(BUNDLE.replace('hr: HR-99\n', ''), 'bundle.md')).toThrowError(
      /missing "hr:"/,
    );
    expect(() =>
      parseBundleMeta(BUNDLE.replace('hr: HR-99', 'hr: none'), 'bundle.md'),
    ).toThrowError(/hr must be "HR-<n>" or "none · <reason>"/);
  });

  it('accepts a settled bundle kept as reference (`none · why`)', () => {
    const b = parseBundleMeta(BUNDLE.replace('hr: HR-99', 'hr: none · signed off, kept'), 'x.md');
    expect(b.hr).toBe('none · signed off, kept');
  });
});

describe('emitStoryTakes', () => {
  it('emits a registry entry whose take carries the compiled rung scene', () => {
    const meta = parseBundleMeta(BUNDLE, 'bundle.md');
    const doc = parseNarrative(TAKE, 'take-b.md');
    const src = emitStoryTakes([{ meta, docs: [doc] }], CANON);
    expect(src).toContain(`export const STORY_TAKE_BUNDLES: readonly StoryTakeBundle[]`);
    expect(src).toContain(`id: "demo",`);
    expect(src).toContain(`brief: "withholds warmth",`);
    // Steps A+B — the take compiles to the flat map + narration-run sequences ONLY;
    // the seq lines ride the SAME emitter as canon (speaker resolved to NPC_NAME).
    expect(src).not.toContain('rungBeats: {');
    expect(src).toContain('"beat.R1.greeting": [');
    expect(src).toContain('speaker: NPC_NAME.genemon,');
    expect(src).toContain('"beat.R1.opt.canon-opt.say"');
  });

  it('emits a stable empty registry for zero bundles', () => {
    expect(emitStoryTakes([], CANON)).toContain(
      'STORY_TAKE_BUNDLES: readonly StoryTakeBundle[] = [\n\n];',
    );
  });

  it('goes RED on a takes/docs length mismatch', () => {
    const meta = parseBundleMeta(BUNDLE, 'bundle.md');
    expect(() => emitStoryTakes([{ meta, docs: [] }], CANON)).toThrowError(/takes\/docs mismatch/);
  });
});

// ── Step A (session-200, human-locked) — gen-time canonicalization + the prose-only gate.
// RED on main before this landed: no `text:`/`seq:` emission existed, and a structurally
// divergent take compiled silently (the runtime then half-swapped it). ──
describe('the flat text map — keys carry CANON ids, blind slugs notwithstanding', () => {
  const compile = (): string => {
    const meta = parseBundleMeta(BUNDLE, 'bundle.md');
    return emitStoryTakes([{ meta, docs: [parseNarrative(TAKE, 'take-b.md')] }], CANON);
  };

  it('option keys use the canon option id, not the take slug', () => {
    const src = compile();
    expect(src).toContain('"beat.R1.opt.canon-opt.say"'); // canon id — the log's address
    expect(src).toContain('"beat.R1.opt.canon-opt.label"');
    expect(src).toContain('"beat.R1.opt.canon-opt.react"');
    expect(src).toContain('"beat.R1.prompt"');
    expect(src).not.toContain('"beat.R1.opt.opt-a.say"'); // the take slug never leaks
  });

  it("the greeting run emits as a SEQUENCE (free length — pacing is the take's voice)", () => {
    const src = compile();
    expect(src).toContain('"beat.R1.greeting": [');
    expect(src).toContain('id: "narr"'); // the take keeps its own line slugs in the seq
  });
});

describe('the prose-only HARD gate', () => {
  const compileTake = (takeMd: string): void => {
    const meta = parseBundleMeta(BUNDLE, 'bundle.md');
    emitStoryTakes([{ meta, docs: [parseNarrative(takeMd, 'take-b.md')] }], CANON);
  };

  it('REDs a take whose unit does not exist in canon, naming it', () => {
    expect(() => compileTake(TAKE.replace('## rung R1', '## rung R5'))).toThrowError(
      /prose-only gate — rung:R5: no canon rung beat/,
    );
  });

  it("REDs an option-count mismatch (structure is canon's, words are the take's)", () => {
    const extra = `${TAKE}
#### opt-b · "A second label."

${GENEMON}: "Another react."
`;
    expect(() => compileTake(extra)).toThrowError(
      /prose-only gate — rung:R1: canon has 1 decision option\(s\), the take has 2/,
    );
  });
});
