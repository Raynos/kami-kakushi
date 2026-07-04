import { describe, it, expect } from 'vitest';
import { buildCapture, slugOf, stampOf, type CaptureContext } from './capture-format';

// The server's filename allowlist (src/scripts/playtest-inbox.ts MD_FILENAME_RE) IS the contract
// buildCapture must satisfy — a filename it emits that the endpoint would reject is the bug this
// asserts against. Kept as a literal here (the documented contract); the real cross-module
// round-trip (buildCapture → resolveCapture) is proven in playtest-inbox.test.ts.
const SERVER_FILENAME_RE = /^[A-Za-z0-9T.-]+\.md$/;

function ctx(overrides: Partial<CaptureContext> = {}): CaptureContext {
  return {
    capturedAt: '2026-07-03T18:42:07+0200',
    build: { version: 'v0.3.5', sha: 'abc1234', date: '2026-07-03' },
    seed: 20260626,
    clock: { day: 12, tick: 7 },
    location: 'home-paddies',
    rung: 'R3',
    tier: 0,
    activeTab: 'work',
    variants: {},
    viewport: { w: 1728, h: 1117, dpr: 2 },
    url: '/?dev=no',
    saveBase64: 'eyJhcHAiOiJrYW1pLWtha3VzaGkifQ==',
    logTail: [],
    hasScreenshot: false,
    ...overrides,
  };
}

describe('stampOf', () => {
  it('converts the ISO time to a filename-safe stamp (colons → dashes)', () => {
    expect(stampOf('2026-07-03T18:42:07+0200')).toBe('2026-07-03T18-42-07');
  });
  it('falls back to a sanitised, non-empty stamp for a malformed input', () => {
    const s = stampOf('not an iso!!');
    expect(s.length).toBeGreaterThan(0);
    expect(s).not.toMatch(/[^A-Za-z0-9T.-]/);
  });
});

describe('slugOf', () => {
  it('kebab-cases the first ~4 words', () => {
    expect(slugOf('The open-eyes button is off centre badly')).toBe('the-open-eyes-button-is');
  });
  it('falls back to "note" when nothing alphanumeric survives', () => {
    expect(slugOf('日本語 ！！！')).toBe('note');
    expect(slugOf('   ')).toBe('note');
  });
});

describe('buildCapture', () => {
  it('emits a filename the server allowlist accepts', () => {
    const { filename } = buildCapture('open eyes button off centre', ctx());
    expect(filename).toMatch(SERVER_FILENAME_RE);
    expect(filename).toBe('2026-07-03T18-42-07-open-eyes-button-off.md');
  });

  it('keeps the filename allowlist-safe even for a kanji/emoji note', () => {
    // A note that is ALL non-ASCII must still produce a legal filename (slug → "note").
    const { filename } = buildCapture('隠された村 🏯', ctx());
    expect(filename).toMatch(SERVER_FILENAME_RE);
    expect(filename).toBe('2026-07-03T18-42-07-note.md');
  });

  it('carries the at-a-glance context into the frontmatter', () => {
    const { markdown } = buildCapture('note', ctx());
    expect(markdown).toContain('seed: 20260626');
    expect(markdown).toContain('clock: { day: 12, tick: 7 }');
    expect(markdown).toContain('location: home-paddies');
    expect(markdown).toContain('rung: R3');
    expect(markdown).toContain('tier: 0');
    expect(markdown).toContain('active_tab: work');
    expect(markdown).toContain('build: v0.3.5 (abc1234, 2026-07-03)');
    expect(markdown).toContain('viewport: 1728x1117 @2x');
    expect(markdown).toContain('url: /?dev=no');
  });

  it('renders non-default variants, and {} when all are default', () => {
    expect(buildCapture('n', ctx()).markdown).toContain('variants: {}');
    expect(buildCapture('n', ctx({ variants: { market: 'market-c' } })).markdown).toContain(
      'variants: { market: market-c }',
    );
  });

  it('includes the screenshot line only when a shot exists (same stem)', () => {
    expect(buildCapture('open eyes', ctx({ hasScreenshot: false })).markdown).not.toContain(
      'screenshot:',
    );
    const withShot = buildCapture('open eyes', ctx({ hasScreenshot: true })).markdown;
    expect(withShot).toContain('screenshot: 2026-07-03T18-42-07-open-eyes.png');
  });

  it('formats the log tail with speaker + ×N, or a placeholder when empty', () => {
    expect(buildCapture('n', ctx()).markdown).toContain('_(no log lines)_');
    const md = buildCapture(
      'n',
      ctx({
        logTail: [
          { channel: 'narration', text: 'The paddies wake.', count: 1 },
          { channel: 'combat', text: 'You strike.', count: 3, speaker: 'You' },
        ],
      }),
    ).markdown;
    expect(md).toContain('- [narration] The paddies wake.');
    expect(md).toContain('- [combat] You: You strike. ×3');
  });

  it('ends with the base64 save envelope as the last content line', () => {
    const { markdown } = buildCapture('n', ctx({ saveBase64: 'SAVEDATA==' }));
    const lastLine = markdown
      .trim()
      .split('\n')
      .filter((l) => l.trim())
      .pop();
    expect(lastLine).toBe('SAVEDATA==');
  });
});
