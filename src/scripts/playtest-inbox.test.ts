import { describe, it, expect, afterEach } from 'vitest';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, dirname, join } from 'node:path';
import {
  resolveCapture,
  writeCapture,
  MAX_MARKDOWN_BYTES,
  type ResolvedCapture,
} from './playtest-inbox';
import { buildCapture, type CaptureContext } from '../ui/capture-format';
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

const PNG_1PX =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

describe('resolveCapture — validation', () => {
  const dir = '/tmp/does-not-matter';

  it('accepts a well-formed body and jails the path inside pending/', () => {
    const r = ok(
      resolveCapture({ filename: '2026-07-03T18-42-07-note.md', markdown: '# hi' }, dir),
    );
    expect(dirname(r.mdPath)).toBe(dir);
    expect(basename(r.mdPath)).toBe('2026-07-03T18-42-07-note.md');
    expect(r.markdown).toBe('# hi');
    expect(r.pngPath).toBeUndefined();
  });

  it('rejects a path-traversal filename', () => {
    const r = resolveCapture({ filename: '../evil.md', markdown: 'x' }, dir);
    expect(r).toMatchObject({ ok: false, status: 400 });
  });

  it('rejects a filename with a path separator', () => {
    expect(resolveCapture({ filename: 'sub/dir.md', markdown: 'x' }, dir).ok).toBe(false);
  });

  it('rejects a non-.md extension', () => {
    expect(resolveCapture({ filename: 'note.txt', markdown: 'x' }, dir).ok).toBe(false);
    expect(resolveCapture({ filename: 'note.png', markdown: 'x' }, dir).ok).toBe(false);
  });

  it('rejects a non-object / missing fields', () => {
    expect(resolveCapture(null, dir).ok).toBe(false);
    expect(resolveCapture({ filename: 'a.md' }, dir).ok).toBe(false);
    expect(resolveCapture({ filename: 42, markdown: 'x' }, dir).ok).toBe(false);
  });

  it('rejects an oversized markdown body (413)', () => {
    const big = 'a'.repeat(MAX_MARKDOWN_BYTES + 1);
    const r = resolveCapture({ filename: 'a.md', markdown: big }, dir);
    expect(r).toMatchObject({ ok: false, status: 413 });
  });
});

describe('resolveCapture — screenshot sidecar', () => {
  const dir = '/tmp/does-not-matter';

  it('decodes a png data URL to a same-stem .png sidecar', () => {
    const r = ok(resolveCapture({ filename: 'shot.md', markdown: 'x', screenshot: PNG_1PX }, dir));
    expect(r.pngPath).toBe(join(dir, 'shot.png'));
    expect(r.pngBuffer).toBeInstanceOf(Buffer);
    // a real PNG starts with the 8-byte signature
    expect(r.pngBuffer!.subarray(0, 4).toString('hex')).toBe('89504e47');
  });

  it('rejects a non-png / malformed data URL', () => {
    expect(
      resolveCapture({ filename: 'a.md', markdown: 'x', screenshot: 'not-a-url' }, dir).ok,
    ).toBe(false);
    expect(
      resolveCapture(
        { filename: 'a.md', markdown: 'x', screenshot: 'data:image/gif;base64,AAAA' },
        dir,
      ).ok,
    ).toBe(false);
  });
});

describe('writeCapture — end to end with a real save', () => {
  function realCtx(saveBase64: string): CaptureContext {
    return {
      capturedAt: '2026-07-03T18:42:07+0200',
      build: { version: 'v0.3.5', sha: 'abc1234', date: '2026-07-03' },
      seed: 20260626,
      clock: { day: 0, tick: 0 },
      location: 'home-paddies',
      rung: 'R0',
      tier: 0,
      activeTab: 'work',
      variants: {},
      viewport: { w: 1728, h: 1117, dpr: 2 },
      url: '/',
      saveBase64,
      logTail: [],
      hasScreenshot: true,
    };
  }

  it('writes the .md + .png, and the embedded save round-trips through the codec', () => {
    const pending = freshPending();
    // a REAL exported save envelope — the deterministic repro source the drain loads.
    const save = exportBase64(makeEnvelope(createInitialState(20260626), 1, 0));
    const file = buildCapture('open eyes button off centre', realCtx(save));

    // buildCapture's filename must survive the server validator (the real cross-module contract).
    const resolved = ok(resolveCapture({ ...file, screenshot: PNG_1PX }, pending));
    writeCapture(resolved, pending);

    const written = readFileSync(resolved.mdPath, 'utf-8');
    expect(written).toBe(file.markdown);

    // extract the base64 (the last content line) and prove it decodes back to a valid envelope.
    const embedded = written
      .trim()
      .split('\n')
      .filter((l) => l.trim())
      .pop()!;
    const env = importBase64(embedded) as SaveEnvelope;
    expect(env.app).toBe(APP_ID);
    expect(env.state).toBeDefined();
    expect(env.state.rng.seed).toBe(20260626);

    // the git-ignored png sidecar landed beside it.
    const png = readFileSync(resolved.pngPath!);
    expect(png.subarray(0, 4).toString('hex')).toBe('89504e47');
  });
});
