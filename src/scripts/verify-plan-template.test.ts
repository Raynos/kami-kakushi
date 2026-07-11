// verify-plan-template tests — every case here can go RED: each asserts that a
// specific mutilation of a valid plan flips the verdict (or that the escape
// hatches hold). Fixtures are built from a minimal in-test valid plan, not
// copied from the corpus, so corpus edits never stale them.
import { readFileSync } from 'node:fs';
import { describe, it, expect } from 'vitest';
import {
  validatePlan,
  splitSections,
  scaffoldTemplate,
  templateFileContent,
} from './verify-plan-template';

const HEADER = `# A porter on the sheet

**Status:** 📋 PROPOSED (2026-07-11, w2:p5)
**Confidence:** ( 60% Opus, 40% Fable ) — look-bearing steps need taste
**Template:** build
`;

const SECTIONS = `
## Why

FB-340 v2: the here-ring reads as UI chrome, not a piece on the survey
sheet; the human picked the porter sculpt from eleven prototype takes.

## Who builds this — Fable or Opus?

Steps 1–4 are mechanical ports from the committed prototype — Opus-safe.
Steps 5–6 are look-bearing judgment on the player-facing map — Fable.

## What exists today

src/ui/map-variants/sheet-map.ts carries the v1 ring + footprints driver;
the sculpt is proven in project/prototypes/map-token-presence (6921aac1).

## Steps

1. Port the palette tokens into styles.css.
2. Build porter-token.ts with a pure walk-math helper.
3. Wire resting + travel states into the presence player.

## Verification

Unit the pure walk-math (fraction→position, cadence monotonicity); headless
captures of resting / mid-walk / arrival; pnpm run verify green.

## Sync ripple

- **PRD:** Map-tab travel-feedback paragraph via /prd-ripple.
- **Story-bible:** none — the porter is the reader's marker, not fiction.
- **Living docs:** none — no balance or roster change.

## Human-in-the-loop

New HR-item: porter presence live — confirm v1 deletion. Open question:
follow-cam damping (default: keep v1 behavior; override async).

## Non-goals

No click-to-travel on the porter piece, no drag interactions, and no T1+
sheet coverage this pass — each waits for its own tier plan.

## Risks

sheet-map.ts is mid-extraction by the one-engine plan; landing this before
that extraction settles would collide in the same file, so sequence after.
`;

const VALID = HEADER + SECTIONS;

describe('validatePlan', () => {
  it('passes a fully-formed build plan', () => {
    const v = validatePlan(VALID, 'docs/plans/fable-2026-07-11-porter.md');
    expect(v.failures).toEqual([]);
    expect(v.cls).toBe('build');
  });

  it('fails on a missing Template line', () => {
    const v = validatePlan(VALID.replace(/^\*\*Template:.*$/m, ''), 'docs/plans/fable-x.md');
    expect(v.failures.some((f) => f.includes('Template'))).toBe(true);
  });

  it('fails on an unknown Template class', () => {
    const v = validatePlan(VALID.replace('**Template:** build', '**Template:** vibes'), 'p.md');
    expect(v.failures.some((f) => f.includes('vibes'))).toBe(true);
  });

  it('fails on a missing Status line and a missing Confidence line', () => {
    const v = validatePlan(
      VALID.replace(/^\*\*Status:.*$/m, '').replace(/^\*\*Confidence:.*$/m, ''),
      'p.md',
    );
    expect(v.failures.some((f) => f.includes('Status'))).toBe(true);
    expect(v.failures.some((f) => f.includes('Confidence'))).toBe(true);
  });

  it('fails when a mandatory section is absent (risks)', () => {
    const v = validatePlan(VALID.replace(/## Risks[\s\S]*$/, ''), 'p.md');
    expect(v.failures.some((f) => f.includes('Risks'))).toBe(true);
  });

  it('fails when a mandatory section is a bare heading (grounding)', () => {
    const gutted = VALID.replace(
      /## What exists today[\s\S]*?(?=## Steps)/,
      '## What exists today\n\n',
    );
    const v = validatePlan(gutted, 'p.md');
    expect(v.failures.some((f) => f.toLowerCase().includes('what exists'))).toBe(true);
  });

  it('accepts the explicit "none — <reason>" escape in a section body', () => {
    const noneScope = VALID.replace(
      /## Non-goals\n\n.*$/m,
      '## Non-goals\n\nnone — this plan is the whole surface, nothing parked.',
    );
    expect(validatePlan(noneScope, 'p.md').failures).toEqual([]);
  });

  it('requires PRD + story-bible coverage inside a single Sync section (build)', () => {
    const noBible = VALID.replace(
      /- \*\*Story-bible:\*\*.*$/m,
      '- **Fixtures:** regenerate after the state change.',
    );
    const v = validatePlan(noBible, 'p.md');
    expect(v.failures.some((f) => f.includes('story-bible'))).toBe(true);
  });

  it('accepts the split sync shape (separate PRD + story-bible headings)', () => {
    const split = VALID.replace(
      /## Sync ripple[\s\S]*?(?=## Human-in-the-loop)/,
      '## PRD update\n\nTargeted ripple of the Map-tab travel-feedback paragraph via /prd-ripple\n' +
        '(system/UI change, one paragraph), then run pnpm run prd:drift to confirm.\n\n' +
        '## Story-bible update\n\nnone — the porter is a piece on the map artifact.\n\n',
    );
    expect(validatePlan(split, 'p.md').failures).toEqual([]);
  });

  it('fails a steps section with fewer than 3 steps and thin prose', () => {
    const thin = VALID.replace(/## Steps[\s\S]*?(?=## Verification)/, '## Steps\n\n1. Do it.\n\n');
    const v = validatePlan(thin, 'p.md');
    expect(v.failures.some((f) => f.startsWith('steps:'))).toBe(true);
  });

  it('process class demands Teeth; ops class demands Go conditions + Aftermath', () => {
    const proc = validatePlan(
      VALID.replace('**Template:** build', '**Template:** process'),
      'p.md',
    );
    expect(proc.failures.some((f) => f.includes('Teeth'))).toBe(true);
    const ops = validatePlan(VALID.replace('**Template:** build', '**Template:** ops'), 'p.md');
    expect(ops.failures.some((f) => f.includes('Go conditions'))).toBe(true);
    expect(ops.failures.some((f) => f.includes('Aftermath'))).toBe(true);
  });

  it('HTML comments and fenced code cannot satisfy a section (anti-skeleton)', () => {
    const skeleton = VALID.replace(
      /## Risks\n\n[\s\S]*$/,
      '## Risks\n\n<!-- fill me: landmines, sequencing conflicts, rollback -->\n',
    );
    const v = validatePlan(skeleton, 'p.md');
    expect(v.failures.some((f) => f.includes('Risks') || f.includes('empty'))).toBe(true);
  });

  it('warns (never blocks) on a missing model-prefix filename', () => {
    const v = validatePlan(VALID, 'docs/plans/2026-07-11-porter.md');
    expect(v.failures).toEqual([]);
    expect(v.warns.some((w) => w.includes('model prefix'))).toBe(true);
  });

  it('assumeClass lets classless corpus plans validate (backtest mode)', () => {
    const noTemplate = VALID.replace(/^\*\*Template:.*$/m, '');
    const v = validatePlan(noTemplate, 'project/archive/old.md', 'build');
    expect(v.failures.filter((f) => f.includes('Template'))).toEqual([]);
  });
});

describe('first-principles warns (2026-07-11 fresh pass)', () => {
  it('warns when grounding cites a path that does not exist (anti-hallucination)', () => {
    const bogus = VALID.replace('src/ui/map-variants/sheet-map.ts', 'src/ui/never/exists-nope.ts');
    const v = validatePlan(bogus, 'p.md');
    expect(v.failures).toEqual([]);
    expect(v.warns.some((w) => w.includes('do not exist'))).toBe(true);
  });

  it('warns when grounding carries no survey date (grounding rots)', () => {
    const v = validatePlan(VALID, 'p.md'); // fixture grounding has no date
    expect(v.warns.some((w) => w.includes('survey date'))).toBe(true);
    const dated = VALID.replace('carries the v1 ring', 'carries the v1 ring (surveyed 2026-07-11)');
    expect(validatePlan(dated, 'p.md').warns.some((w) => w.includes('survey date'))).toBe(false);
  });

  it('warns when Status is LOCKED but no human is named', () => {
    const locked = VALID.replace('📋 PROPOSED', '✅ LOCKED').replace(
      'the human picked',
      'we picked',
    );
    const v = validatePlan(locked, 'p.md');
    expect(v.warns.some((w) => w.includes('LOCKED but no human'))).toBe(true);
  });

  it('warns when a build plan verifies by unit checks only (no player-reach, PH6)', () => {
    const unitOnly = VALID.replace(
      /## Verification[\s\S]*?(?=## Sync ripple)/,
      '## Verification\n\nUnit the pure walk-math thoroughly: fraction to position, cadence\nmonotonicity, and the reduced-motion branch; pnpm run verify green.\n\n',
    );
    const v = validatePlan(unitOnly, 'p.md');
    expect(v.warns.some((w) => w.includes('player-reach'))).toBe(true);
  });
});

describe('scaffold (docs/plans/templates/ single-source)', () => {
  const CLASSES = ['build', 'process', 'ops'] as const;
  const FILLER =
    '1. PRD line checked with story-bible coverage noted for the sweep.\n' +
    '2. Second concrete step lands its own commit cleanly in src/scripts.\n' +
    '3. Third verifies with a live capture and an e2e fixture, surveyed 2026-07-11.';

  it.each(CLASSES)('committed templates/%s.md matches the generator (no drift)', (cls) => {
    expect(readFileSync(`docs/plans/templates/${cls}.md`, 'utf-8')).toBe(templateFileContent(cls));
  });

  it.each(CLASSES)('a filled %s scaffold passes the gate', (cls) => {
    const filledPlan = scaffoldTemplate(cls)
      .replace(/<!--[\s\S]*?-->/g, FILLER)
      .replace('(<YYYY-MM-DD>, <session>)', '(2026-07-11, test)');
    const v = validatePlan(filledPlan, `docs/plans/fable-2026-07-11-${cls}-fixture.md`);
    expect(v.failures).toEqual([]);
  });

  it('an UNFILLED scaffold fails the gate (guidance comments are not content)', () => {
    const v = validatePlan(scaffoldTemplate('build'), 'docs/plans/fable-x.md');
    expect(v.failures.length).toBeGreaterThan(0);
  });
});

describe('splitSections', () => {
  it('keeps ### subsections inside their ## parent body', () => {
    const md = '## Steps\n\nintro\n\n### Phase 1\n\n- a\n- b\n- c\n\n## Risks\n\nnone — safe.';
    const secs = splitSections(md);
    const steps = secs.find((s) => s.ids.includes('steps'));
    expect(steps?.body).toContain('Phase 1');
    expect(steps?.body).not.toContain('none — safe');
  });
});
