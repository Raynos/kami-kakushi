import { describe, it, expect, afterEach } from 'vitest';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  createClaim,
  deriveSurface,
  fbAllocations,
  fbHighWater,
  FB_BASELINE,
  findCollisions,
  isClaimLive,
  ledgerFindings,
  readClaims,
  readItems,
  releaseClaim,
  writeDrainFields,
  type Claim,
  type InboxItem,
} from './inbox-lanes';

const tmpDirs: string[] = [];
function freshPending(): string {
  const dir = mkdtempSync(join(tmpdir(), 'kami-lanes-'));
  tmpDirs.push(dir);
  return dir;
}
afterEach(() => {
  for (const d of tmpDirs.splice(0)) rmSync(d, { recursive: true, force: true });
});

/** A minimal sidecar as the middleware writes it — NO drain fields, so the
 *  defaults-by-absence path is what these fixtures exercise. */
function writeSidecar(
  pendingDir: string,
  bucket: string,
  stamp: string,
  extra: Record<string, unknown> = {},
): string {
  const dir = join(pendingDir, bucket);
  mkdirSync(dir, { recursive: true });
  const path = join(dir, `${stamp}.json`);
  writeFileSync(
    path,
    JSON.stringify({
      capturedAt: stamp,
      kind: 'bug',
      element: { label: 'span.vn-speech', selector: 'div > p > span' },
      save: 'eyJ=',
      ...extra,
    }),
    'utf-8',
  );
  return path;
}

function item(over: Partial<InboxItem>): InboxItem {
  return {
    stamp: 's1',
    bucket: 'b1',
    lane: 'b1',
    status: 'open',
    surface: [],
    fb: null,
    commit: null,
    elementLabel: '',
    elementSelector: '',
    sidecarPath: '/dev/null',
    ...over,
  };
}

const claim = (over: Partial<Claim>): Claim => ({
  lanes: ['b1'],
  agent: 'test',
  pane: 'w9:p9',
  pid: 1,
  started: '2026-07-10T12:00:00Z',
  fbLo: 300,
  fbHi: 304,
  ...over,
});

describe('readItems — defaults-by-absence', () => {
  it('resolves a bare middleware sidecar to open / lane=bucket / no surface', () => {
    const dir = freshPending();
    writeSidecar(dir, 'r0', '2026-07-10T11-46-15');
    const items = readItems(dir);
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({
      bucket: 'r0',
      lane: 'r0',
      status: 'open',
      surface: [],
      fb: null,
    });
  });

  it('honours explicit drain fields and skips the .claims dir', () => {
    const dir = freshPending();
    writeSidecar(dir, 'r0', 's1', {
      lane: 'speaker-style',
      status: 'done',
      fb: 230,
      commit: 'abc1234',
    });
    mkdirSync(join(dir, '.claims'), { recursive: true });
    writeFileSync(join(dir, '.claims', 'r0.json'), '{}', 'utf-8');
    const items = readItems(dir);
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({
      lane: 'speaker-style',
      status: 'done',
      fb: 230,
      commit: 'abc1234',
    });
  });
});

describe('writeDrainFields', () => {
  it('merges fields without dropping the capture payload', () => {
    const dir = freshPending();
    const path = writeSidecar(dir, 'r0', 's1');
    writeDrainFields(path, { lane: 'speaker-style', status: 'done', fb: 231, commit: 'beef123' });
    const raw = JSON.parse(readFileSync(path, 'utf-8')) as Record<string, unknown>;
    expect(raw.save).toBe('eyJ='); // the repro survives
    expect(raw.lane).toBe('speaker-style');
    expect(raw.fb).toBe(231);
  });
});

describe('deriveSurface + findCollisions', () => {
  it('maps VN selectors and the log panel to their tokens', () => {
    expect(deriveSurface('span.vn-speech', 'div > p > span')).toEqual(['vn-overlay']);
    expect(deriveSurface('panel "log"', 'section[data-panel=log] > div')).toEqual(['log-panel']);
    expect(deriveSurface('unknown thing', 'div.mystery')).toEqual([]);
  });

  it('reports only cross-lane open-vs-open token overlap', () => {
    const mine = item({ lane: 'r0', surface: ['vn-overlay'] });
    const sameLane = item({ lane: 'r0', surface: ['vn-overlay'], stamp: 's2' });
    const otherOpen = item({
      lane: 'cold-open',
      bucket: 'cold-open',
      surface: ['vn-overlay'],
      stamp: 's3',
    });
    const otherDone = item({
      lane: 'dev',
      bucket: 'dev',
      surface: ['vn-overlay'],
      status: 'done',
      stamp: 's4',
    });
    const hits = findCollisions([mine], [sameLane, otherOpen, otherDone]);
    expect(hits).toHaveLength(1);
    expect(hits[0]!.other.stamp).toBe('s3');
    expect(hits[0]!.tokens).toEqual(['vn-overlay']);
  });
});

describe('fbAllocations + fbHighWater', () => {
  it('reads both series, ignoring the template line and (resolved) follow-ups', () => {
    const nums = fbAllocations([
      '### F1 · <short title> — <status emoji>\n### F118 · real one — ✅\n',
      '### FB-197 · space advances — ✅\n### FB-166 (resolved) · rice counter — ✅\n',
    ]);
    expect(nums.sort((a, b) => a - b)).toEqual([118, 197]);
  });

  it('high-water is the max across headings, live claims, and stamped sidecars', () => {
    const hw = fbHighWater([197, 122], [claim({ fbHi: 214 })], [item({ fb: 230 })]);
    expect(hw).toBe(230);
    expect(fbHighWater([], [], [])).toBe(FB_BASELINE); // never below the baseline
  });
});

describe('claims — atomicity + liveness', () => {
  it('claim-twice fails (O_EXCL), release frees it', () => {
    const dir = freshPending();
    mkdirSync(join(dir, '.claims'), { recursive: true });
    createClaim(dir, 'r0', claim({}));
    expect(() => createClaim(dir, 'r0', claim({ pane: 'w2:p2' }))).toThrow();
    expect(readClaims(dir)).toHaveLength(1);
    releaseClaim(dir, 'r0');
    expect(readClaims(dir)).toHaveLength(0);
    expect(() => createClaim(dir, 'r0', claim({}))).not.toThrow();
  });

  it('liveness: herdr roster rules when available; pid probe is the fallback', () => {
    const c = claim({ pane: 'w6:p1', pid: 424242 });
    expect(isClaimLive(c, { herdrPanes: () => ['w6:p1', 'w3:p3'] })).toBe(true);
    expect(isClaimLive(c, { herdrPanes: () => ['w3:p3'] })).toBe(false); // provably stale
    expect(isClaimLive(c, { herdrPanes: () => null, pidAlive: () => true })).toBe(true);
    expect(isClaimLive(c, { herdrPanes: () => null, pidAlive: () => false })).toBe(false);
  });
});

describe('ledgerFindings — every check can go RED', () => {
  it('is green on a healthy corpus (defaults-by-absence + grandfathered history)', () => {
    const pending = [item({}), item({ stamp: 's2', status: 'done', fb: 230, commit: 'abc' })];
    // Historic duplicates AT/below the baseline are grandfathered:
    const headings = [1, 1, 122, 122, FB_BASELINE, 230];
    expect(ledgerFindings(pending, [], headings)).toEqual([]);
  });

  it('REDs a duplicate fb stamped on two captures', () => {
    const dup = [
      item({ fb: 230, status: 'done', commit: 'a' }),
      item({ stamp: 's2', bucket: 'dev', fb: 230, status: 'done', commit: 'b' }),
    ];
    const stamped = ledgerFindings(dup, [], []).filter((f) => f.includes('stamped on'));
    expect(stamped).toHaveLength(1);
    expect(stamped[0]).toContain('FB-230');
  });

  it('REDs a post-baseline duplicate heading allocation — the two-lane race', () => {
    const findings = ledgerFindings([], [], [199, 199]);
    expect(findings).toHaveLength(1);
    expect(findings[0]).toContain('FB-199');
  });

  it('REDs done-without-record and a fully-done bucket left in pending/', () => {
    const doneNoCommit = item({ status: 'done', fb: 231 });
    expect(ledgerFindings([doneNoCommit], [], [])[0]).toContain('missing commit');
    const allDone = [
      item({ status: 'done', fb: 232, commit: 'a' }),
      item({ stamp: 's2', status: 'done', fb: 233, commit: 'b' }),
    ];
    const findings = ledgerFindings(allDone, [], []);
    expect(findings.some((f) => f.includes('archive it'))).toBe(true);
    // ...but a parked item legitimately holds the bucket open:
    const withParked = [...allDone, item({ stamp: 's3', status: 'parked' })];
    expect(ledgerFindings(withParked, [], []).some((f) => f.includes('archive it'))).toBe(false);
  });
});
