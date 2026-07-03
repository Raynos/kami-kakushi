import { describe, it, expect } from 'vitest';
import { parseStatusToken, CLOSED_TOKENS } from './checkpoint';

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
