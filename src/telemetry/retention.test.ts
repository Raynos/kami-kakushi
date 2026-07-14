import { describe, it, expect } from 'vitest';
import { balance } from '../core';
import { formatRunReport, type RunRecord } from './report';
import type { Segment } from './sessionizer';
import type { EconomySnapshot } from './milestones';
import { keepReport, MIN_ATTENDED_MIN } from './retention';

// Retention proofs. Fixtures are rendered THROUGH formatRunReport (the source of truth for the
// header + Σ line) so a format change fails HERE rather than silently turning the GC into a
// no-op — or, worse, into a delete-everything. The thresholds come from the balance constants;
// a hard-coded "3" would ratchet dead the day the band moves.

const MIN = 60_000;

const seg = (start: number, end: number): Segment => ({
  start,
  end,
  activeMs: end - start,
  idleMs: 0,
  autosArmedMs: 0,
  closer: 'flush',
});

const snap = (): EconomySnapshot => ({
  rung: 'R1',
  tier: 0,
  tGame: 38,
  coin: 12,
  coinBanked: 0,
  rice: 40,
  riceBanked: 5,
  standing: 2,
});

/** A run of `attendedMin` attended minutes, carrying `taints`. */
function report(attendedMin: number, taints: string[] = []): string {
  const run: RunRecord = {
    runId: '20260710-1783600000',
    seed: 20260626,
    buildVersion: '0.3.9',
    buildSha: 'abc1234',
    startedAtISO: '2026-07-10T08:00:00.000Z',
    taints,
    milestones: [
      {
        event: { kind: 'rung-up', from: 'R0', to: 'R1', snapshot: snap() },
        attendedMs: attendedMin * MIN,
        wallMs: attendedMin * MIN,
      },
    ],
    segments: [seg(0, attendedMin * MIN)],
  };
  return formatRunReport(run);
}

describe('keepReport', () => {
  it('drops a time-tainted run however long it is (the clock lied)', () => {
    const v = keepReport(report(45, ['speed>1']));
    expect(v.keep).toBe(false);
    expect(v.keep === false && v.reason).toContain('speed>1');
  });

  it('drops a run shorter than one in-band rung', () => {
    const v = keepReport(report(MIN_ATTENDED_MIN - 0.5));
    expect(v.keep).toBe(false);
    expect(v.keep === false && v.reason).toContain('band min');
  });

  it('keeps a clean run at or above the band minimum', () => {
    expect(keepReport(report(MIN_ATTENDED_MIN)).keep).toBe(true);
    expect(keepReport(report(MIN_ATTENDED_MIN + 40)).keep).toBe(true);
  });

  it('keeps a save-import run — an ORIGIN mark is not a taint (honest clock)', () => {
    const text = report(49.2, ['save-import']);
    expect(text).toContain('untainted · marked: save-import');
    expect(keepReport(text).keep).toBe(true);
  });

  it('still drops a save-imported run that ALSO carries a time taint', () => {
    expect(keepReport(report(49.2, ['save-import', 'speed>1'])).keep).toBe(
      false,
    );
  });

  it('fails OPEN: an unrecognised or truncated report is never deleted', () => {
    expect(keepReport('').keep).toBe(true);
    expect(keepReport('some other markdown file\n').keep).toBe(true);
    // Header parses, Σ line missing (a truncated write) → keep.
    expect(keepReport('run x (v0 abc) — untainted\n').keep).toBe(true);
  });

  it('the threshold IS the balance band minimum (no copied magic number)', () => {
    expect(MIN_ATTENDED_MIN).toBe(balance.T0_PACING_BAND_MIN);
  });
});
