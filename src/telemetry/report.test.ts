import { describe, it, expect } from 'vitest';
import { balance } from '../core';
import { formatRunReport, type RunRecord } from './report';
import type { Segment } from './sessionizer';
import type { EconomySnapshot } from './milestones';

// Report proofs: per-rung attribution is a DIFFERENCE of attendedMs snapshots, the band flag
// derives from the balance constants (source of truth), and a tainted run is labelled +
// excluded from the vs-sim columns (the honesty ledger, plan §3.1/§3.2).

const MIN = 60_000;

const seg = (start: number, end: number, closer: Segment['closer']): Segment => ({
  start,
  end,
  activeMs: end - start,
  idleMs: 0,
  autosArmedMs: 0,
  closer,
});

const snap = (rung: EconomySnapshot['rung'], tGame: number): EconomySnapshot => ({
  rung,
  tier: 0,
  tGame,
  coin: 12,
  coinBanked: 0,
  rice: 40,
  riceBanked: 5,
  standing: 2,
});

function record(taints: string[] = []): RunRecord {
  return {
    runId: '20260705-1751558527',
    seed: 20260705,
    buildVersion: '0.3.6',
    buildSha: 'abc1234',
    startedAtISO: '2026-07-05T10:00:00.000Z',
    taints,
    milestones: [
      // R0 cleared after 4.2 attended minutes, R1 after 10.2 (Δ = 6.0).
      {
        event: { kind: 'rung-up', from: 'R0', to: 'R1', snapshot: snap('R1', 38) },
        attendedMs: 4.2 * MIN,
        wallMs: 5 * MIN,
      },
      {
        event: { kind: 'rung-up', from: 'R1', to: 'R2', snapshot: snap('R2', 98) },
        attendedMs: 10.2 * MIN,
        wallMs: 12 * MIN,
      },
    ],
    segments: [seg(0, 5 * MIN, 'hidden'), seg(25 * MIN, 30 * MIN, 'flush')],
  };
}

describe('formatRunReport', () => {
  it('per-rung rows are DIFFERENCES of attended/tick snapshots, flagged against the band', () => {
    const out = formatRunReport(record(), [
      { rung: 'R0', wallMin: 3.1 },
      { rung: 'R1', wallMin: 4.0 },
    ]);
    // R0 row: 4.2 attended min vs sim 3.1, in the [3,22] band, 38 ticks.
    expect(out).toContain('untainted');
    const r0 = out.split('\n').find((l) => l.startsWith('R0'));
    expect(r0).toContain('4.2');
    expect(r0).toContain('3.1');
    expect(r0).toContain('ok');
    expect(r0).toContain('38');
    // R1 row: Δ attended = 6.0 min, Δ ticks = 60.
    const r1 = out.split('\n').find((l) => l.startsWith('R1'));
    expect(r1).toContain('6.0');
    expect(r1).toContain('60');
  });

  it('a below-band rung flags OUT (the koku-capstone failure mode made visible)', () => {
    const fast: RunRecord = {
      ...record(),
      milestones: [
        {
          event: { kind: 'rung-up', from: 'R0', to: 'R1', snapshot: snap('R1', 4) },
          // Sanity: derived from the band floor, not a magic number — half the minimum.
          attendedMs: (balance.T0_PACING_BAND_MIN / 2) * MIN,
          wallMs: MIN,
        },
      ],
    };
    const r0 = formatRunReport(fast)
      .split('\n')
      .find((l) => l.startsWith('R0'));
    expect(r0).toContain('OUT');
  });

  it('a tainted run is labelled and drops the vs-sim/band columns', () => {
    const out = formatRunReport(record(['speed>1', 'toRung']), [{ rung: 'R0', wallMin: 3.1 }]);
    expect(out).toContain('TAINTED: speed>1, toRung');
    const r0 = out.split('\n').find((l) => l.startsWith('R0'));
    expect(r0).toContain('tainted'); // the sim column refuses the comparison
    expect(r0).not.toContain('3.1');
  });

  it('totals + closer histogram line up with the segments', () => {
    const out = formatRunReport(record());
    expect(out).toContain('Σ attended 10.0 min');
    expect(out).toContain('active 10.0');
    expect(out).toContain('hidden/away excluded 20.0'); // the 5/20/5 span
    expect(out).toContain('segments: 2');
    expect(out).toContain('hidden×1');
    expect(out).toContain('flush×1');
  });

  it('an empty run still renders (no crash on zero rung-ups)', () => {
    const out = formatRunReport({ ...record(), milestones: [], segments: [] });
    expect(out).toContain('(no rung-ups this run)');
    expect(out).toContain('segments: 0');
  });
});
