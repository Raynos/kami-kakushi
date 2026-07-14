import { describe, it, expect, afterEach } from 'vitest';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  adrAllocations,
  adrHighWater,
  createTreeClaim,
  isTreeClaimLive,
  readTreeClaims,
  reapDead,
  releaseTreeClaim,
  type TreeClaim,
} from './tree-claim';

const tmpDirs: string[] = [];
function freshClaims(): string {
  const dir = mkdtempSync(join(tmpdir(), 'kami-tree-claim-'));
  tmpDirs.push(dir);
  return dir;
}
afterEach(() => {
  for (const d of tmpDirs.splice(0))
    rmSync(d, { recursive: true, force: true });
});

function claim(lane: string, extra: Partial<TreeClaim> = {}): TreeClaim {
  return {
    lane,
    agent: 'test',
    pane: 'w9:p9',
    pid: process.pid,
    started: '2026-07-13T00:00:00.000Z',
    adrLo: 0,
    adrHi: 0,
    ...extra,
  };
}

describe('tree-claim mutex lanes', () => {
  it('claims a free lane and rejects a second claim (O_EXCL)', () => {
    const dir = freshClaims();
    createTreeClaim(dir, claim('push'));
    expect(() =>
      createTreeClaim(dir, claim('push', { pane: 'w2:p2' })),
    ).toThrow();
    expect(readTreeClaims(dir)).toHaveLength(1);
    expect(readTreeClaims(dir)[0]?.pane).toBe('w9:p9');
  });

  it('release frees the lane for the next claimant', () => {
    const dir = freshClaims();
    createTreeClaim(dir, claim('push'));
    releaseTreeClaim(dir, 'push');
    expect(readTreeClaims(dir)).toHaveLength(0);
    expect(() =>
      createTreeClaim(dir, claim('push', { pane: 'w2:p2' })),
    ).not.toThrow();
  });

  it('reapDead drops only claims whose owner is gone', () => {
    const dir = freshClaims();
    createTreeClaim(dir, claim('push', { pane: 'w1:p1' }));
    createTreeClaim(dir, claim('exit', { pane: 'w2:p2' }));
    const reaped = reapDead(dir, (c) => c.pane === 'w2:p2');
    expect(reaped).toEqual(['push']);
    expect(readTreeClaims(dir).map((c) => c.lane)).toEqual(['exit']);
  });

  it('liveness delegates to the pane roster (herdr probe injectable)', () => {
    const c = claim('push', { pane: 'w3:p3' });
    expect(isTreeClaimLive(c, { herdrPanes: () => ['w3:p3'] })).toBe(true);
    expect(isTreeClaimLive(c, { herdrPanes: () => ['w1:p1'] })).toBe(false);
    // herdr unavailable → pid fallback
    expect(
      isTreeClaimLive(c, { herdrPanes: () => null, pidAlive: () => false }),
    ).toBe(false);
  });
});

describe('ADR number reservation', () => {
  it('reads allocations from headings only, at any of the band depths', () => {
    const nums = adrAllocations([
      '### ADR-195 ✅ — something\nprose mentioning ADR-999 does not allocate',
      '## ADR-196 — band-file depth\n#### ADR-197 — deeper',
    ]);
    expect(nums).toEqual([195, 196, 197]);
  });

  it('high-water clears both committed headings and live reservations', () => {
    const headings = [195, 196];
    const live = [claim('adr-w1-p1', { adrLo: 197, adrHi: 199 })];
    expect(adrHighWater(headings, live)).toBe(199);
    expect(adrHighWater(headings, [])).toBe(196);
  });

  it('two sequential reservations never overlap', () => {
    const dir = freshClaims();
    const hw1 = adrHighWater([195], readTreeClaims(dir));
    createTreeClaim(dir, claim('adr-a', { adrLo: hw1 + 1, adrHi: hw1 + 2 }));
    const hw2 = adrHighWater([195], readTreeClaims(dir));
    expect(hw2 + 1).toBeGreaterThan(hw1 + 2);
  });
});
