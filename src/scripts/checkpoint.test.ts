import { describe, it, expect } from 'vitest';
import { resolve } from 'node:path';
import {
  parseStatusToken,
  CLOSED_TOKENS,
  rewriteQueuePath,
  relinkTarget,
  replaceLinkTarget,
  nextSessionNumber,
  newestJournalName,
  slugify,
  fillJournalSkeleton,
  extractPlanRefs,
  stalePlanRefs,
} from './checkpoint';

// Proves the plan-status-token parser (F1a Phase 1). The RED-able risk it guards:
// a naive substring match mis-reads a two-word "IN PROGRESS" as "IN", or tags a
// leading "✅ LOCKED" as archivable because of the glyph (the live session-brief
// mis-tag, §0.6). Every case below could go RED if the parser regressed to that.

const status = (line: string) => `# Plan\n\n${line}\n\n## Body\n`;

describe('parseStatusToken', () => {
  it('reads a canonical **Status:** glyph + token line', () => {
    expect(
      parseStatusToken(status('**Status:** 📋 PROPOSED — awaiting read')),
    ).toEqual({
      token: 'PROPOSED',
      archivable: false,
    });
  });

  it('reads the whole-line-bold **Status: … ** form too', () => {
    expect(
      parseStatusToken(status('**Status: 📋 PROPOSED — awaiting read.**')),
    ).toEqual({
      token: 'PROPOSED',
      archivable: false,
    });
  });

  it('joins a two-word "IN PROGRESS" into the IN-PROGRESS token (not just "IN")', () => {
    expect(
      parseStatusToken(
        status('**Status: 🔧 IN PROGRESS (the wave) — do not archive.**'),
      ),
    ).toEqual({ token: 'IN-PROGRESS', archivable: false });
  });

  it('keeps an already-hyphenated IN-PROGRESS token', () => {
    expect(
      parseStatusToken(status('**Status:** 🔨 IN-PROGRESS — building'))!.token,
    ).toBe('IN-PROGRESS');
  });

  it('classifies DONE as archivable', () => {
    expect(
      parseStatusToken(status('**Status:** ✅ DONE — shipped + verified')),
    ).toEqual({
      token: 'DONE',
      archivable: true,
    });
  });

  it('classifies SUPERSEDED as archivable', () => {
    expect(
      parseStatusToken(status('**Status:** ❌ SUPERSEDED by F2'))!.archivable,
    ).toBe(true);
  });

  it('does NOT tag a leading "✅ LOCKED" as archivable (the glyph is decoration)', () => {
    // The exact bug session-brief mis-fired on: ✅ glyph + a non-DONE token.
    expect(
      parseStatusToken(
        status('**Status:** ✅ LOCKED — scope approved, unbuilt'),
      ),
    ).toEqual({
      token: 'LOCKED',
      archivable: false,
    });
  });

  it('does NOT tag a mid-line "DONE" as archivable (token is the FIRST word only)', () => {
    expect(
      parseStatusToken(
        status('**Status: 🔨 IN-PROGRESS — DONE only when all ten land.**'),
      )!.archivable,
    ).toBe(false);
  });

  it('returns null when there is no **Status: line at all', () => {
    expect(parseStatusToken('# Plan\n\njust prose, no status\n')).toBeNull();
  });
});

describe('CLOSED_TOKENS', () => {
  it('is exactly the six-token closed vocabulary (§2.2)', () => {
    expect([...CLOSED_TOKENS]).toEqual([
      'PROPOSED',
      'LOCKED',
      'IN-PROGRESS',
      'DONE',
      'PARKED',
      'SUPERSEDED',
    ]);
  });
});

// Proves the auto-archive fix-ups (F1a Phase 2). RED-able: a queue rewrite that
// dropped the tag, double-tagged on re-run, or touched an unrelated path; a link
// rewrite that mis-resolved a relative path or lost an #anchor.

describe('rewriteQueuePath', () => {
  const old = 'docs/plans/x.md';
  const neu = 'project/archive/x.md';

  it('rewrites the backticked path and tags it (archived — done)', () => {
    const q = '- [ ] `docs/plans/x.md` — the X plan';
    expect(rewriteQueuePath(q, old, neu)).toBe(
      '- [ ] `project/archive/x.md` (archived — done) — the X plan',
    );
  });

  it('is idempotent — a second run does not double-tag or re-move', () => {
    const q = '- [ ] `docs/plans/x.md` — the X plan';
    const once = rewriteQueuePath(q, old, neu);
    const twice = rewriteQueuePath(once, old, neu);
    expect(twice).toBe(once);
  });

  it('leaves an unrelated backticked path untouched', () => {
    const q = '- [ ] `docs/plans/other.md` — a different plan';
    expect(rewriteQueuePath(q, old, neu)).toBe(q);
  });
});

describe('relinkTarget', () => {
  const root = '/repo';
  const fromAbs = resolve(root, 'project/todo-human.md');
  const oldAbs = resolve(root, 'docs/plans/x.md');
  const newAbs = resolve(root, 'project/archive/x.md');

  it('recomputes a relative link that pointed at the moved plan', () => {
    expect(relinkTarget(fromAbs, '../docs/plans/x.md', oldAbs, newAbs)).toBe(
      './archive/x.md',
    );
  });

  it('returns null for a link that did not point at the moved plan', () => {
    expect(
      relinkTarget(fromAbs, '../docs/plans/other.md', oldAbs, newAbs),
    ).toBeNull();
  });

  it('skips external / anchor-only links', () => {
    expect(
      relinkTarget(fromAbs, 'https://example.com', oldAbs, newAbs),
    ).toBeNull();
    expect(relinkTarget(fromAbs, '#section', oldAbs, newAbs)).toBeNull();
  });

  it('preserves an #anchor suffix on the rewritten link', () => {
    expect(
      relinkTarget(fromAbs, '../docs/plans/x.md#open', oldAbs, newAbs),
    ).toBe('./archive/x.md#open');
  });
});

describe('replaceLinkTarget', () => {
  it('rewrites the TARGET when the text is the same string (the [`path`](path) idiom)', () => {
    // RED against the old `whole.replace(tgt, next)`: the first occurrence of
    // the target string sits in the link TEXT, so the text got rewritten and
    // the target stayed a dead path (the master-plan archival regression).
    expect(replaceLinkTarget('[`x.md`](x.md)', 'x.md', './archive/x.md')).toBe(
      '[`x.md`](./archive/x.md)',
    );
  });

  it('leaves the link text untouched when it differs from the target', () => {
    expect(
      replaceLinkTarget('[the X plan](x.md)', 'x.md', './archive/x.md'),
    ).toBe('[the X plan](./archive/x.md)');
  });

  it('preserves a "title" suffix after the target', () => {
    expect(replaceLinkTarget('[t](x.md "T")', 'x.md', './archive/x.md')).toBe(
      '[t](./archive/x.md "T")',
    );
  });
});

// Proves the journal-scaffold helpers (F1a Phase 3). RED-able: an off-by-one NN,
// a slug that keeps punctuation, or a template fill that leaves the placeholders.

describe('nextSessionNumber', () => {
  it('is max existing NN + 1 (global monotonic)', () => {
    expect(
      nextSessionNumber([
        '2026-07-03-session-61-a.md',
        '2026-07-03-session-62-b.md',
        'README.md',
        '_TEMPLATE.md',
      ]),
    ).toBe(63);
  });

  it('starts at 1 when there are no numbered sessions', () => {
    expect(nextSessionNumber(['README.md', '_TEMPLATE.md'])).toBe(1);
  });
});

// Proves the resume-journal region picker (the "can't-rot pointer" fix). RED-able:
// a naive `.sort()[last]` mis-ranks unpadded "session-9" ABOVE "session-63" and
// would return the wrong (lexically-last) file; a bad filter would let README slip
// through. Both cases below go RED against those regressions.

describe('newestJournalName', () => {
  it('picks the GREATEST session number, not the lexical max', () => {
    // Lexical sort ranks "session-9" above "session-63" ('9' > '6'); the newest
    // session is 63. A `.sort()[last]` implementation returns session-9 → RED.
    expect(
      newestJournalName([
        '2026-07-04-session-9-a.md',
        '2026-07-04-session-63-b.md',
        'README.md',
        '_TEMPLATE.md',
      ]),
    ).toBe('2026-07-04-session-63-b.md');
  });

  it('returns null when the listing holds no session journals', () => {
    expect(newestJournalName(['README.md', '_TEMPLATE.md'])).toBeNull();
  });
});

describe('slugify', () => {
  it('lowercases, collapses non-alphanumerics to single dashes, trims', () => {
    expect(slugify('  The Mechanical Checkpoint! ')).toBe(
      'the-mechanical-checkpoint',
    );
    expect(slugify('A/B — test')).toBe('a-b-test');
  });
});

describe('fillJournalSkeleton', () => {
  const template = [
    '<!-- comment -->',
    '<!-- ============ SHAPE A — short ============ -->',
    '',
    '# Session NN — {YYYY-MM-DD} — {one-line tagline / goal}',
    '',
    '**Summary:** {…}.',
    '',
    '<!-- ============ SHAPE B — long ============ -->',
    '# Session NN — long shape',
  ].join('\n');

  it('fills NN / date / topic from the shape-A block only', () => {
    const out = fillJournalSkeleton(
      template,
      63,
      '2026-07-04',
      'a fresh topic',
    );
    expect(out).toContain('# Session 63 — 2026-07-04 — a fresh topic');
    expect(out).not.toContain('{YYYY-MM-DD}');
    expect(out).not.toContain('Session NN');
    expect(out).not.toContain('SHAPE B'); // shape B is excluded
    expect(out.endsWith('\n')).toBe(true);
  });
});

// Proves the stale-BACKLOG-plan-pointer guard (human, 2026-07-07). The RED-able
// risk: BACKLOG keeps a `docs/plans/…` pointer after its plan archives out of
// docs/plans/ (the T0 economy + rung-progression drift). Each case below goes RED
// if extraction misses a path form, or the filter stops honoring the exists() map.
describe('extractPlanRefs', () => {
  it('pulls every docs/plans/ path form (link, inline-code, bare), deduped', () => {
    const text = [
      'see [`cap`](docs/plans/t1/opus-2026-07-03-t1-capstone-branch.md) and',
      '`docs/plans/opus-2026-07-04-phase2-economy-redesign.md` plus a bare',
      'docs/plans/fable-2026-07-05-requirements-rung-progression.md — and again',
      '`docs/plans/t1/opus-2026-07-03-t1-capstone-branch.md` (dup, dropped).',
    ].join('\n');
    expect(extractPlanRefs(text)).toEqual([
      'docs/plans/t1/opus-2026-07-03-t1-capstone-branch.md',
      'docs/plans/opus-2026-07-04-phase2-economy-redesign.md',
      'docs/plans/fable-2026-07-05-requirements-rung-progression.md',
    ]);
  });

  it('returns nothing when no plan path is referenced', () => {
    expect(
      extractPlanRefs('a parked note about the T2 inn board, no plans.'),
    ).toEqual([]);
  });
});

describe('stalePlanRefs', () => {
  const backlog = [
    '`docs/plans/t1/opus-2026-07-07-emergent-node-extensions.md` (live cross-ref)',
    '`docs/plans/opus-2026-07-04-phase2-economy-redesign.md` (archived — stale)',
  ].join('\n');
  const exists = (rel: string) =>
    rel === 'docs/plans/t1/opus-2026-07-07-emergent-node-extensions.md'; // only the live one

  it('flags a ref whose target is gone, spares a live cross-ref', () => {
    expect(stalePlanRefs(backlog, exists)).toEqual([
      'docs/plans/opus-2026-07-04-phase2-economy-redesign.md',
    ]);
  });

  it('is clean when every referenced plan still exists', () => {
    expect(stalePlanRefs(backlog, () => true)).toEqual([]);
  });
});
