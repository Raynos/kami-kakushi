// The run report formatter (F8) — PURE: RunRecord in, markdown-ish text out. The per-rung
// table deliberately rhymes with pacing-report.ts / the sim's t0-pacing.md (rung · minutes ·
// band) so human-vs-bot-vs-intent is one eyeball pass — the third leg of the pacing triangle.
//
// BOTH attended(min) and ticks print per rung: ticks climbing while attended stalls =
// background-window play (blur keeps the loop ticking, D-079) — a visible finding, never a
// silent lie (plan §3.2).

import { balance } from '../core';
import type { Segment, SegmentCloser } from './sessionizer';
import type { MilestoneEvent } from './milestones';

/** A milestone entry as stored on the run record: the pure detector event stamped with the
 *  sessionizer's clocks at commit time (Ph2's wiring does the stamping). */
export interface MilestoneEntry {
  readonly event: MilestoneEvent;
  readonly attendedMs: number;
  readonly wallMs: number;
}

/** One game run's telemetry (plan §3.1). Assembled by the Ph2 wiring; stored in the ring. */
export interface RunRecord {
  readonly runId: string;
  readonly seed: number;
  readonly buildVersion: string;
  readonly buildSha: string;
  readonly startedAtISO: string;
  /** The honesty ledger — DEV distortions (speed>1, teleports, forceState, tick, import).
   *  A tainted run renders labelled and is EXCLUDED from the vs-sim comparison by default. */
  readonly taints: readonly string[];
  readonly milestones: readonly MilestoneEntry[];
  readonly segments: readonly Segment[];
}

/** Optional sim comparison rows — walkPacing() today, the sim medians when that plan lands.
 *  Passed in by the caller: the formatter stays pure and script-free. */
export interface SimRow {
  readonly rung: string;
  readonly wallMin: number;
}

const min = (ms: number): string => (ms / 60000).toFixed(1);

function closerCounts(segments: readonly Segment[]): string {
  const counts = new Map<SegmentCloser, number>();
  for (const s of segments) counts.set(s.closer, (counts.get(s.closer) ?? 0) + 1);
  return [...counts.entries()].map(([closer, n]) => `${closer}×${n}`).join(' · ') || 'none';
}

/** Render one run. Table columns line up with pacing-report.ts's per-rung framing. */
export function formatRunReport(run: RunRecord, simRows: readonly SimRow[] = []): string {
  const tainted = run.taints.length > 0;
  const label = tainted ? `TAINTED: ${run.taints.join(', ')}` : 'untainted';
  const lines: string[] = [];
  lines.push(`run ${run.runId} (v${run.buildVersion} ${run.buildSha}) — ${label}`);
  lines.push(`started ${run.startedAtISO} · seed ${run.seed}`);
  lines.push('');

  const rungUps = run.milestones.filter((m) => m.event.kind === 'rung-up');
  const band = `[${balance.T0_PACING_BAND_MIN},${balance.T0_PACING_BAND_MAX}]`;
  lines.push(
    `rung  attended(min)  sim-greedy(min)  band${band}  ticks  coin(+kura)  rice(+kura)  standing`,
  );
  let prevAttended = 0;
  let prevTicks = 0;
  for (const m of rungUps) {
    if (m.event.kind !== 'rung-up') continue; // narrow for TS
    const snap = m.event.snapshot;
    const attMin = (m.attendedMs - prevAttended) / 60000;
    const ticks = snap.tGame - prevTicks;
    // The rung CLEARED is the one you were on (from), matching pacing-report's per-rung rows.
    const rung = m.event.from;
    const sim = simRows.find((r) => r.rung === rung);
    // Tainted runs keep their own numbers but drop the vs-sim columns (the honesty rule).
    const simCol = tainted ? 'tainted' : sim ? sim.wallMin.toFixed(1) : '-';
    const inBand =
      attMin >= balance.T0_PACING_BAND_MIN && attMin <= balance.T0_PACING_BAND_MAX ? 'ok' : 'OUT';
    const bandCol = tainted ? '-' : inBand;
    lines.push(
      `${rung.padEnd(5)} ${attMin.toFixed(1).padStart(13)} ${simCol.padStart(16)} ${bandCol.padStart(10)} ${String(ticks).padStart(6)} ${`${snap.coin}(+${snap.coinBanked})`.padStart(12)} ${`${snap.rice}(+${snap.riceBanked})`.padStart(12)} ${String(snap.standing).padStart(9)}`,
    );
    prevAttended = m.attendedMs;
    prevTicks = snap.tGame;
  }
  if (rungUps.length === 0) lines.push('(no rung-ups this run)');

  const losses = run.milestones.filter((m) => m.event.kind === 'loss').length;
  const ascensions = run.milestones.filter((m) => m.event.kind === 'ascension').length;
  const active = run.segments.reduce((a, s) => a + s.activeMs, 0);
  const idle = run.segments.reduce((a, s) => a + s.idleMs, 0);
  const span =
    run.segments.length > 0
      ? (run.segments[run.segments.length - 1]?.end ?? 0) - (run.segments[0]?.start ?? 0)
      : 0;
  const excluded = span - active - idle;
  lines.push('');
  lines.push(
    `Σ attended ${min(active + idle)} min · active ${min(active)} / idle ${min(idle)} · hidden/away excluded ${min(Math.max(0, excluded))}`,
  );
  lines.push(`segments: ${run.segments.length}  (closers: ${closerCounts(run.segments)})`);
  if (losses || ascensions) lines.push(`losses: ${losses} · ascensions: ${ascensions}`);
  lines.push('');
  lines.push('segment log:');
  for (const s of run.segments) {
    lines.push(
      `  ${new Date(s.start).toISOString()} → +${min(s.end - s.start)}min  active ${min(s.activeMs)} / idle ${min(s.idleMs)} / autos ${min(s.autosArmedMs)}  → ${s.closer}`,
    );
  }
  return lines.join('\n');
}
