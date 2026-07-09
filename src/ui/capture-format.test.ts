import { describe, it, expect } from 'vitest';
import {
  buildEntry,
  buildBucketHeader,
  buildSessionHeader,
  captureFileKey,
  mintSessionId,
  sessionFilename,
  slugGroup,
  slugOf,
  stampOf,
  type CaptureContext,
  type SessionMeta,
} from './capture-format';

// The server's allowlists (src/scripts/playtest-inbox.ts) ARE the contract these builders must
// satisfy — imported from the server module (one source; a copied literal here stayed green
// when the server drifted). The full round-trip lives in playtest-inbox.test.ts.
import {
  PNG_NAME_RE as SERVER_PNG_RE,
  SESSION_RE as SERVER_SESSION_RE,
} from '../scripts/playtest-inbox';

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

describe('buckets — file key + slug', () => {
  it('slugGroup kebabs a bucket name and is allowlist-safe, or blank for empty/symbols', () => {
    expect(slugGroup('Map feedback')).toBe('map-feedback');
    expect(slugGroup('R0 feedback')).toBe('r0-feedback');
    expect(slugGroup('dev tooling')).toBe('dev-tooling');
    expect(slugGroup('map-feedback')).toMatch(SERVER_SESSION_RE);
    expect(slugGroup('   ')).toBe('');
    expect(slugGroup('！！！')).toBe('');
  });
  it('captureFileKey is the bucket slug when grouped, else the session id', () => {
    expect(captureFileKey('2026-07-03T18-40-00-abc', 'Map feedback')).toBe('map-feedback');
    expect(captureFileKey('2026-07-03T18-40-00-abc', '')).toBe('2026-07-03T18-40-00-abc');
    expect(captureFileKey('2026-07-03T18-40-00-abc', '！！！')).toBe('2026-07-03T18-40-00-abc');
  });
  it('buildBucketHeader names the bucket + its slug folder', () => {
    const h = buildBucketHeader('Map feedback', 'map-feedback');
    expect(h).toContain('# Playtest bucket — Map feedback');
    expect(h).toContain('bucket:** `map-feedback`');
    expect(h).toContain('screenshots:** `./map-feedback/`');
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
  it('keeps the .md LEAN — note + details link, NO inline base64', () => {
    const { entry, metadataName } = buildEntry(
      'open eyes button off centre',
      ctx(),
      META.sessionId,
    );
    // heading carries the kind (default Bug) so a drain scans bug-vs-question at a glance
    expect(entry).toContain('## Bug · 2026-07-03T18:42:07+0200 — open-eyes-button-off');
    expect(entry).toContain('open eyes button off centre'); // the human's note
    expect(metadataName).toBe('2026-07-03T18-42-07.json');
    expect(entry).toContain(`**Details:** \`${META.sessionId}/${metadataName}\``); // link out
    // the heavy stuff is NOT inline in the .md
    expect(entry).not.toContain('eyJhcHAiOiJrYW1pLWtha3VzaGkifQ=='); // no base64 save
    expect(entry).not.toContain('seed 20260626'); // no context dump
    expect(entry.trimEnd().endsWith('---')).toBe(true);
  });

  it('carries kind (heading + JSON) and defaults to bug', () => {
    const bug = buildEntry('n', ctx(), META.sessionId); // no meta ⇒ default bug
    expect(bug.entry).toContain('## Bug ·');
    expect(JSON.parse(bug.metadata).kind).toBe('bug');
    const q = buildEntry('n', ctx(), META.sessionId, { kind: 'question' });
    expect(q.entry).toContain('## Question ·');
    expect(JSON.parse(q.metadata).kind).toBe('question');
  });

  it('a bucketed entry keys sidecar links off the bucket slug + records provenance', () => {
    const { entry, metadata } = buildEntry('the weir seal is faint', ctx(), 'map-feedback', {
      kind: 'question',
      group: 'Map feedback',
      session: META.sessionId,
      build: META.build,
    });
    // links resolve against the bucket folder, NOT the session id
    expect(entry).toContain('**Details:** `map-feedback/2026-07-03T18-42-07.json`');
    const m = JSON.parse(metadata);
    expect(m.group).toBe('Map feedback');
    expect(m.session).toBe(META.sessionId); // provenance survives cross-session bucketing
    expect(m.build).toEqual(META.build);
    // ungrouped ⇒ group is null
    expect(JSON.parse(buildEntry('n', ctx(), META.sessionId).metadata).group).toBeNull();
  });

  it('puts the save + logs + full context in the metadata JSON', () => {
    const { metadata } = buildEntry(
      'n',
      ctx({
        variants: { market: 'market-c' },
        logTail: [{ channel: 'combat', text: 'You strike.', count: 3, speaker: 'You' }],
      }),
      META.sessionId,
    );
    const m = JSON.parse(metadata);
    expect(m.save).toBe('eyJhcHAiOiJrYW1pLWtha3VzaGkifQ==');
    expect(m.seed).toBe(20260626);
    expect(m.clock).toEqual({ day: 12, tick: 7 });
    expect(m.location).toBe('home-paddies');
    expect(m.variants).toEqual({ market: 'market-c' });
    expect(m.logTail).toEqual([
      { channel: 'combat', text: 'You strike.', count: 3, speaker: 'You' },
    ]);
  });

  it('references a same-stem screenshot in the session folder only when a shot exists', () => {
    expect(
      buildEntry('n', ctx({ hasScreenshot: false }), META.sessionId).screenshotName,
    ).toBeUndefined();
    const built = buildEntry('open eyes', ctx({ hasScreenshot: true }), META.sessionId);
    expect(built.screenshotName).toBe('2026-07-03T18-42-07.png');
    expect(built.screenshotName!).toMatch(SERVER_PNG_RE);
    expect(built.entry).toContain('`2026-07-03T18-40-00-abc123/2026-07-03T18-42-07.png`');
    // the metadata records the screenshot name too
    expect(JSON.parse(built.metadata).screenshot).toBe('2026-07-03T18-42-07.png');
  });

  it('renders the picked element descriptor when present, and omits it otherwise', () => {
    expect(buildEntry('n', ctx(), META.sessionId).entry).not.toContain('**Element:**');
    const { entry } = buildEntry(
      'n',
      ctx({
        element: {
          label: 'button "Rake rice"',
          text: 'Rake rice',
          selector: 'div[data-panel=do] > button:nth-of-type(2)',
          rect: { x: 40, y: 120, w: 96, h: 32 },
        },
      }),
      META.sessionId,
    );
    expect(entry).toContain(
      '**Element:** button "Rake rice" — "Rake rice" · `div[data-panel=do] > button:nth-of-type(2)` · @40,120 96×32',
    );
  });
});
