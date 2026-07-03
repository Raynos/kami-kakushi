import { describe, it, expect } from 'vitest';
import { resolve } from 'node:path';
import { parseStatusToken, CLOSED_TOKENS, rewriteQueuePath, relinkTarget } from './checkpoint';

// Proves the plan-status-token parser (F1a Phase 1). The RED-able risk it guards:
// a naive substring match mis-reads a two-word "IN PROGRESS" as "IN", or tags a
// leading "✅ LOCKED" as archivable because of the glyph (the live session-brief
// mis-tag, §0.6). Every case below could go RED if the parser regressed to that.

const status = (line: string) => `# Plan\n\n${line}\n\n## Body\n`;

describe('parseStatusToken', () => {
  it('reads a canonical **Status:** glyph + token line', () => {
    expect(parseStatusToken(status('**Status:** 📋 PROPOSED — awaiting read'))).toEqual({
      token: 'PROPOSED',
      archivable: false,
    });
  });

  it('reads the whole-line-bold **Status: … ** form too', () => {
    expect(parseStatusToken(status('**Status: 📋 PROPOSED — awaiting read.**'))).toEqual({
      token: 'PROPOSED',
      archivable: false,
    });
  });

  it('joins a two-word "IN PROGRESS" into the IN-PROGRESS token (not just "IN")', () => {
    expect(
      parseStatusToken(status('**Status: 🔧 IN PROGRESS (the wave) — do not archive.**')),
    ).toEqual({ token: 'IN-PROGRESS', archivable: false });
  });

  it('keeps an already-hyphenated IN-PROGRESS token', () => {
    expect(parseStatusToken(status('**Status:** 🔨 IN-PROGRESS — building'))!.token).toBe(
      'IN-PROGRESS',
    );
  });

  it('classifies DONE as archivable', () => {
    expect(parseStatusToken(status('**Status:** ✅ DONE — shipped + verified'))).toEqual({
      token: 'DONE',
      archivable: true,
    });
  });

  it('classifies SUPERSEDED as archivable', () => {
    expect(parseStatusToken(status('**Status:** ❌ SUPERSEDED by F2'))!.archivable).toBe(true);
  });

  it('does NOT tag a leading "✅ LOCKED" as archivable (the glyph is decoration)', () => {
    // The exact bug session-brief mis-fired on: ✅ glyph + a non-DONE token.
    expect(parseStatusToken(status('**Status:** ✅ LOCKED — scope approved, unbuilt'))).toEqual({
      token: 'LOCKED',
      archivable: false,
    });
  });

  it('does NOT tag a mid-line "DONE" as archivable (token is the FIRST word only)', () => {
    expect(
      parseStatusToken(status('**Status: 🔨 IN-PROGRESS — DONE only when all ten land.**'))!
        .archivable,
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
    expect(relinkTarget(fromAbs, '../docs/plans/x.md', oldAbs, newAbs)).toBe('./archive/x.md');
  });

  it('returns null for a link that did not point at the moved plan', () => {
    expect(relinkTarget(fromAbs, '../docs/plans/other.md', oldAbs, newAbs)).toBeNull();
  });

  it('skips external / anchor-only links', () => {
    expect(relinkTarget(fromAbs, 'https://example.com', oldAbs, newAbs)).toBeNull();
    expect(relinkTarget(fromAbs, '#section', oldAbs, newAbs)).toBeNull();
  });

  it('preserves an #anchor suffix on the rewritten link', () => {
    expect(relinkTarget(fromAbs, '../docs/plans/x.md#open', oldAbs, newAbs)).toBe(
      './archive/x.md#open',
    );
  });
});
