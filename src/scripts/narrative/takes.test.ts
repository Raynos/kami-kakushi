// ADR-139 take-set compiler — RED proofs for the bundle.md parser and the
// storyTakes emitter. Fixtures derive from source-of-truth registries (real
// rank unlocks, real NPC display names) so a registry change moves them too
// (test discipline, ADR-086…ADR-088).

import { describe, it, expect } from 'vitest';
import { parseNarrative, NarrativeError } from './parse';
import { emitStoryTakes, parseBundleMeta } from './takes';
import { RANKS } from '../../core/content/ranks';
import { NPC_NAME } from '../../core/content/voices';

const R1_UNLOCK = RANKS.find((r) => r.id === 'R1')!.rewardOnReach!.unlock!;
const GENEMON = NPC_NAME.genemon;

const BUNDLE = `<!-- a comment
  spanning lines -->

# bundle demo · A demo bundle
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

> A narrator line.

${GENEMON}: "A greeting line."

### decide · A prompt?

#### opt-a · "A label."

${GENEMON}: "A react line."

flags: opt-a
`;

describe('parseBundleMeta', () => {
  it('parses heading, top meta (with continuation), and take sections', () => {
    const b = parseBundleMeta(BUNDLE, 'bundle.md');
    expect(b.id).toBe('demo');
    expect(b.title).toBe('A demo bundle');
    expect(b.review).toBe('project/some/review.md');
    expect(b.rationale).toBe('canon keeps the pick because it reads truest.');
    expect(b.takes).toEqual([
      {
        id: 'b',
        label: 'Colder',
        brief: 'withholds warmth',
        scorecard: '1✔',
        file: 'take-b.md',
        loc: { file: 'bundle.md', line: 9 },
      },
    ]);
  });

  it('goes RED on a take missing brief:, citing the authoring line', () => {
    const bad = BUNDLE.replace('brief: withholds warmth\n', '');
    expect(() => parseBundleMeta(bad, 'bundle.md')).toThrowError(NarrativeError);
    expect(() => parseBundleMeta(bad, 'bundle.md')).toThrowError(
      /bundle\.md:9 .* missing "brief:"/,
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

describe('bundle rung (FB-307)', () => {
  const withRung = BUNDLE.replace(
    'review: project/some/review.md',
    'review: project/some/review.md\nrung: R2',
  );

  it('parses `rung: R2` to the bare number and emits it into the registry entry', () => {
    const meta = parseBundleMeta(withRung, 'bundle.md');
    expect(meta.rung).toBe(2);
    const doc = parseNarrative(TAKE, 'take-b.md');
    expect(emitStoryTakes([{ meta, docs: [doc] }])).toContain('rung: 2,');
  });

  it('stays absent when unauthored and rejects a malformed rung', () => {
    expect(parseBundleMeta(BUNDLE, 'bundle.md').rung).toBeUndefined();
    const bad = BUNDLE.replace('review: project/some/review.md', 'rung: 2');
    expect(() => parseBundleMeta(bad, 'bundle.md')).toThrowError(/rung must be "R<n>"/);
  });
});

describe('emitStoryTakes', () => {
  it('emits a registry entry whose take carries the compiled rung scene', () => {
    const meta = parseBundleMeta(BUNDLE, 'bundle.md');
    const doc = parseNarrative(TAKE, 'take-b.md');
    const src = emitStoryTakes([{ meta, docs: [doc] }]);
    expect(src).toContain(`export const STORY_TAKE_BUNDLES: readonly StoryTakeBundle[]`);
    expect(src).toContain(`id: "demo",`);
    expect(src).toContain(`brief: "withholds warmth",`);
    // The rung scene compiles through the SAME emitter as canon: keyed by rank,
    // speaker resolved to the NPC_NAME reference, flags carried verbatim.
    expect(src).toContain('rungBeats: {');
    expect(src).toContain('R1: {');
    expect(src).toContain('speaker: NPC_NAME.genemon,');
    expect(src).toContain(`flags: ["opt-a"],`);
  });

  it('emits a stable empty registry for zero bundles', () => {
    expect(emitStoryTakes([])).toContain(
      'STORY_TAKE_BUNDLES: readonly StoryTakeBundle[] = [\n\n];',
    );
  });

  it('goes RED on a takes/docs length mismatch', () => {
    const meta = parseBundleMeta(BUNDLE, 'bundle.md');
    expect(() => emitStoryTakes([{ meta, docs: [] }])).toThrowError(/takes\/docs mismatch/);
  });
});
