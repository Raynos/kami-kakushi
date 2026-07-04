import { describe, it, expect } from 'vitest';
import {
  buildEntry,
  buildSessionHeader,
  mintSessionId,
  sessionFilename,
  slugOf,
  stampOf,
  type CaptureContext,
  type SessionMeta,
} from './capture-format';

// The server's allowlists (src/scripts/playtest-inbox.ts) ARE the contract these builders must
// satisfy — kept as literals here; the real cross-module round-trip is in playtest-inbox.test.ts.
const SERVER_SESSION_RE = /^[A-Za-z0-9T.-]+$/;
const SERVER_PNG_RE = /^[A-Za-z0-9T.-]+\.png$/;

function ctx(overrides: Partial<CaptureContext> = {}): CaptureContext {
  return {
    capturedAt: '2026-07-03T18:42:07+0200',
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

const META: SessionMeta = {
  sessionId: '2026-07-03T18-40-00-abc123',
  startedAt: '2026-07-03T18:40:00+0200',
  build: { version: 'v0.3.5', sha: 'abc1234', date: '2026-07-03' },
};

describe('ids', () => {
  it('mintSessionId is <stamp>-<token> and allowlist-safe', () => {
    const id = mintSessionId('2026-07-03T18:40:00+0200', 'A1B2C3D4');
    expect(id).toBe('2026-07-03T18-40-00-a1b2c3');
    expect(id).toMatch(SERVER_SESSION_RE);
  });
  it('sessionFilename appends .md', () => {
    expect(sessionFilename('2026-07-03T18-40-00-abc')).toBe('2026-07-03T18-40-00-abc.md');
  });
  it('stampOf converts colons to dashes; slugOf kebabs 4 words / falls back', () => {
    expect(stampOf('2026-07-03T18:42:07+0200')).toBe('2026-07-03T18-42-07');
    expect(slugOf('The open-eyes button is off centre')).toBe('the-open-eyes-button-is');
    expect(slugOf('日本語 ！！！')).toBe('note');
  });
});

describe('buildSessionHeader', () => {
  it('carries the session-level metadata and the screenshots folder', () => {
    const h = buildSessionHeader(META);
    expect(h).toContain('# Playtest session — 2026-07-03T18:40:00+0200');
    expect(h).toContain('build:** v0.3.5 (abc1234, 2026-07-03)');
    expect(h).toContain('session:** `2026-07-03T18-40-00-abc123`');
    expect(h).toContain('screenshots:** `./2026-07-03T18-40-00-abc123/`');
  });
});

describe('buildEntry', () => {
  it('produces an appendable ## block with the note + at-a-glance context', () => {
    const { entry } = buildEntry('open eyes button off centre', ctx(), META.sessionId);
    expect(entry).toContain('## 2026-07-03T18:42:07+0200 — open-eyes-button-off');
    expect(entry).toContain('open eyes button off centre');
    expect(entry).toContain('seed 20260626');
    expect(entry).toContain('day 12 tick 7');
    expect(entry).toContain('home-paddies');
    expect(entry).toContain('R3');
    expect(entry).toContain('tab work');
    expect(entry).toContain('variants {}');
    expect(entry).toContain('1728×1117@2x');
    expect(entry).toContain('url /?dev=no');
    // the save rides in each entry (self-contained repro)
    expect(entry).toContain('eyJhcHAiOiJrYW1pLWtha3VzaGkifQ==');
    // it ends with a divider so appended entries stay visually separated
    expect(entry.trimEnd().endsWith('---')).toBe(true);
  });

  it('references a same-stem screenshot in the session folder only when a shot exists', () => {
    expect(
      buildEntry('n', ctx({ hasScreenshot: false }), META.sessionId).screenshotName,
    ).toBeUndefined();
    const built = buildEntry('open eyes', ctx({ hasScreenshot: true }), META.sessionId);
    expect(built.screenshotName).toBe('2026-07-03T18-42-07.png');
    expect(built.screenshotName!).toMatch(SERVER_PNG_RE);
    expect(built.entry).toContain('`2026-07-03T18-40-00-abc123/2026-07-03T18-42-07.png`');
  });

  it('renders non-default variants and a log tail', () => {
    const { entry } = buildEntry(
      'n',
      ctx({
        variants: { market: 'market-c' },
        logTail: [{ channel: 'combat', text: 'You strike.', count: 3, speaker: 'You' }],
      }),
      META.sessionId,
    );
    expect(entry).toContain('variants { market: market-c }');
    expect(entry).toContain('- [combat] You: You strike. ×3');
  });
});
