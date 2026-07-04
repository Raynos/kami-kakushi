import { describe, it, expect, afterEach } from 'vitest';
import { mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, dirname, join } from 'node:path';
import {
  commitCapture,
  resolveCapture,
  writeCapture,
  MAX_MARKDOWN_BYTES,
  type ResolvedCapture,
} from './playtest-inbox';
import { buildEntry, buildSessionHeader, type CaptureContext } from '../ui/capture-format';
import { createInitialState, APP_ID } from '../core';
import { exportBase64, importBase64, makeEnvelope, type SaveEnvelope } from '../persistence/codec';

const tmpDirs: string[] = [];
function freshPending(): string {
  const dir = mkdtempSync(join(tmpdir(), 'kami-inbox-'));
  tmpDirs.push(dir);
  return dir;
}
afterEach(() => {
  for (const d of tmpDirs.splice(0)) rmSync(d, { recursive: true, force: true });
});

function ok(r: ResolvedCapture): Extract<ResolvedCapture, { ok: true }> {
  if (!r.ok) throw new Error(`expected ok, got ${r.status}: ${r.error}`);
  return r;
}

const SESSION = '2026-07-04T22-00-00-abc123';
const PNG_1PX =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

describe('resolveCapture — validation', () => {
  const dir = '/tmp/does-not-matter';
  const good = { session: SESSION, header: '# h\n', entry: '\n## x\n' };

  it('accepts a well-formed body and jails the paths inside pending/', () => {
    const r = ok(resolveCapture(good, dir));
    expect(dirname(r.mdPath)).toBe(dir);
    expect(basename(r.mdPath)).toBe(`${SESSION}.md`);
  });

  it('rejects a path-traversal / separator session id', () => {
    expect(resolveCapture({ ...good, session: '../evil' }, dir).ok).toBe(false);
    expect(resolveCapture({ ...good, session: 'sub/dir' }, dir).ok).toBe(false);
  });

  it('rejects missing fields', () => {
    expect(resolveCapture(null, dir).ok).toBe(false);
    expect(resolveCapture({ session: SESSION, entry: 'x' }, dir).ok).toBe(false); // no header
  });

  it('rejects oversized markdown (413)', () => {
    const big = 'a'.repeat(MAX_MARKDOWN_BYTES + 1);
    expect(resolveCapture({ ...good, entry: big }, dir)).toMatchObject({ ok: false, status: 413 });
  });

  it('screenshot: decodes a png to <session>/<name>.png inside the folder', () => {
    const r = ok(
      resolveCapture(
        { ...good, screenshot: PNG_1PX, screenshotName: '2026-07-04T22-01-00.png' },
        dir,
      ),
    );
    expect(r.shotPath).toBe(join(dir, SESSION, '2026-07-04T22-01-00.png'));
    expect(r.pngBuffer!.subarray(0, 4).toString('hex')).toBe('89504e47');
  });

  it('screenshot: rejects a png without a name, a bad name, or a non-png url', () => {
    expect(resolveCapture({ ...good, screenshot: PNG_1PX }, dir).ok).toBe(false); // no name
    expect(
      resolveCapture({ ...good, screenshot: PNG_1PX, screenshotName: 'a/b.png' }, dir).ok,
    ).toBe(false);
    expect(
      resolveCapture(
        { ...good, screenshot: 'data:image/gif;base64,AA', screenshotName: 'a.png' },
        dir,
      ).ok,
    ).toBe(false);
  });
});

describe('writeCapture — one file per session, header once, entries appended', () => {
  function realCtx(saveBase64: string, capturedAt: string, shot: boolean): CaptureContext {
    return {
      capturedAt,
      seed: 20260626,
      clock: { day: 0, tick: 0 },
      location: 'kura',
      rung: 'R0',
      tier: 0,
      activeTab: 'work',
      variants: {},
      viewport: { w: 1280, h: 800, dpr: 1 },
      url: '/',
      saveBase64,
      logTail: [],
      hasScreenshot: shot,
    };
  }

  it('creates with header on the first capture, appends on the next (one file, header once)', () => {
    const pending = freshPending();
    const header = buildSessionHeader({
      sessionId: SESSION,
      startedAt: '2026-07-04T22:00:00+0200',
      build: { version: 'v0.3.5', sha: 'abc1234', date: '2026-07-04' },
    });
    const save = exportBase64(makeEnvelope(createInitialState(20260626), 1, 0));

    const e1 = buildEntry('first note', realCtx(save, '2026-07-04T22:00:05+0200', true), SESSION);
    const w1 = ok(
      resolveCapture(
        {
          session: SESSION,
          header,
          entry: e1.entry,
          screenshot: PNG_1PX,
          screenshotName: e1.screenshotName,
        },
        pending,
      ),
    );
    writeCapture(w1, pending);

    const e2 = buildEntry('second note', realCtx(save, '2026-07-04T22:01:12+0200', false), SESSION);
    const w2 = ok(resolveCapture({ session: SESSION, header, entry: e2.entry }, pending));
    writeCapture(w2, pending);

    const md = readFileSync(join(pending, `${SESSION}.md`), 'utf-8');
    // header written EXACTLY once, both entries present in order
    expect(md.match(/# Playtest session/g)).toHaveLength(1);
    expect(md).toContain('first note');
    expect(md).toContain('second note');
    expect(md.indexOf('first note')).toBeLessThan(md.indexOf('second note'));

    // the screenshot from the first capture landed in the session folder
    const shots = readdirSync(join(pending, SESSION));
    expect(shots).toEqual(['2026-07-04T22-00-05.png']);

    // the save embedded in the first entry round-trips through the codec
    const line = md.split('\n').find((l) => l.startsWith('`eyJ'))!;
    const env = importBase64(line.replaceAll('`', '').trim()) as SaveEnvelope;
    expect(env.app).toBe(APP_ID);
    expect(env.state.rng.seed).toBe(20260626);
  });
});

describe('commitCapture — auto-commit the .md (fail-soft, opt-outable)', () => {
  const MD = '/repo/project/playtest-inbox/pending/s.md';
  const PENDING = '/repo/project/playtest-inbox/pending';

  it('git-adds then commits ONLY the .md by explicit path (--no-verify)', () => {
    const calls: string[][] = [];
    commitCapture(MD, PENDING, (args) => calls.push(args));
    expect(calls[0]).toEqual(['add', '--', MD]);
    expect(calls[1]![0]).toBe('commit');
    expect(calls[1]).toContain('--no-verify');
    expect(calls[1]!.slice(-2)).toEqual(['--', MD]); // pathspec = only this file
  });

  it('is fail-soft — a throwing git never breaks the capture', () => {
    expect(() =>
      commitCapture(MD, PENDING, () => {
        throw new Error('index.lock');
      }),
    ).not.toThrow();
  });

  it('skips entirely under KAMI_INBOX_NO_COMMIT=1', () => {
    const prev = process.env.KAMI_INBOX_NO_COMMIT;
    process.env.KAMI_INBOX_NO_COMMIT = '1';
    try {
      const calls: string[][] = [];
      commitCapture(MD, PENDING, (args) => calls.push(args));
      expect(calls).toHaveLength(0);
    } finally {
      if (prev === undefined) delete process.env.KAMI_INBOX_NO_COMMIT;
      else process.env.KAMI_INBOX_NO_COMMIT = prev;
    }
  });
});
