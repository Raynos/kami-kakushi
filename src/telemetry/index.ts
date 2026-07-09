// createTelemetry() (FB-8) — the DEV-only wiring hub: owns the sessionizer state, the run
// record, the taint ledger and the storage ring; exposes the two taps main.ts needs
// (wrapDispatch + onCommit) and the `__qa.telemetry` handle. Zero core changes — everything
// it knows arrives via the commit diff (milestones.ts) and the DOM shell (signals.ts).
//
// Mounted from main.ts's DEV branch via the same ternary-folds-to-`undefined` idiom as the
// DEV panel, so this whole tree shakes out of prod — and the sentinel below gives the deploy
// gate a marker to PROVE it (R2: strip verified by grep, never assumed).

import type { GameState } from '../core';
import {
  advance,
  attendedMs,
  createSessionizer,
  finalize,
  type SessionizerState,
  type TelemetryConfig,
  type TelemetryEvent,
} from './sessionizer';
import { autosArmed, detectMilestones } from './milestones';
import { formatRunReport, type MilestoneEntry, type RunRecord, type SimRow } from './report';
import { attachSignals, INPUT_THROTTLE_MS } from './signals';
import { createTelemetryStore, TELEMETRY_STORE_KEY } from './store';
import { postSessionReport } from './drop';
import { isHarnessRun } from './taints';
import { walkPacing } from '../scripts/pacing-report';

/** A marker that exists ONLY in this DEV module — verify-dev-strip.sh greps the prod bundle
 *  for it and refuses to deploy a leak (the DEV_SENTINEL pattern). */
export const TELEMETRY_SENTINEL = '__KAMI_TELEMETRY__';

/** `resume` = boot WITH an existing save (plan §3.1: a NEW run starts only at
 *  boot-with-no-save / newGame / import) — the newest stored run for the same seed is
 *  CONTINUED, so an FB-5 mid-session doesn't shred the run history into per-boot fragments. */
export type RunStartReason = 'boot' | 'resume' | 'new-game' | 'import' | 'fixture';

export interface TelemetrySummary {
  readonly runId: string;
  readonly class: 'active' | 'idle' | 'away' | 'hidden';
  readonly attendedMin: number;
  readonly activeMin: number;
  readonly idleMin: number;
  readonly segments: number;
  readonly taints: readonly string[];
}

/** The `__qa.telemetry` handle + the DEV-panel section's data source (Ph3). */
export interface TelemetryQa {
  readonly sentinel: string;
  summary(): TelemetrySummary;
  report(): string;
  segments(): SessionizerState['segments'];
  runs(): readonly RunRecord[];
  configure(patch: Partial<TelemetryConfig & { inputThrottleMs: number }>): TelemetryConfig;
  /** Drop the current run's report into project/telemetry/ NOW (the panel button; session-end
   *  drops happen automatically on segment close). */
  drop(): void;
  clear(): void;
}

export interface Telemetry {
  wrapDispatch<T>(dispatch: (intent: T) => void): (intent: T) => void;
  onCommit(prev: GameState, next: GameState): void;
  onRunStart(reason: RunStartReason, state: GameState): void;
  taint(name: string): void;
  readonly qa: TelemetryQa;
}

export function createTelemetry(opts: {
  build: { version: string; sha: string };
  now?: () => number;
}): Telemetry {
  const now = opts.now ?? ((): number => Date.now());
  const store = createTelemetryStore();

  let ss = createSessionizer(now(), {}, initVisibility());
  let inputThrottleMs = INPUT_THROTTLE_MS;
  let milestones: MilestoneEntry[] = [];
  let taints = new Set<string>();
  let runId = 'pre-boot';
  let seed = 0;
  let runStartT = now();
  let startedAtISO = new Date(runStartT).toISOString();
  // Segments carried in from a RESUMED run (prior boots of the same save) — the sessionizer
  // itself restarts fresh each boot; the run record is the durable spine across reloads.
  let carriedSegments: RunRecord['segments'] = [];
  let carriedActiveMs = 0;
  let carriedIdleMs = 0;

  /** Monotonic run-scoped attended total: prior boots' segments + this boot's sessionizer. */
  function runAttendedMs(): number {
    return carriedActiveMs + carriedIdleMs + attendedMs(ss);
  }

  function currentRun(): RunRecord {
    return {
      runId,
      seed,
      buildVersion: opts.build.version,
      buildSha: opts.build.sha,
      startedAtISO,
      taints: [...taints],
      milestones,
      segments: [...carriedSegments, ...ss.segments],
    };
  }

  function persist(): void {
    store.saveRun(currentRun());
  }

  /** Every event flows through here; a segment CLOSING is the critical write moment (the
   *  hide/unload edge) — persist synchronously and drop the session-end console one-liner. */
  function emit(ev: TelemetryEvent): void {
    const before = ss.segments.length;
    ss = advance(ss, ev);
    if (ss.segments.length > before) {
      persist();
      const seg = ss.segments[ss.segments.length - 1];
      if (seg) {
        console.info(
          `[telemetry] segment closed (${seg.closer}): +${((seg.activeMs + seg.idleMs) / 60000).toFixed(1)} attended min · run total ${(attendedMs(ss) / 60000).toFixed(1)} min`,
        );
      }
      // Session-end auto-drop (human-locked): every close re-drops the run's report file into
      // project/telemetry/ — fire-and-forget; the ring is the buffer if the drop fails.
      // Harness runs (fixture / qa-drive / …) are QA exhaust: ring-only, no file (2026-07-07).
      if (!isHarnessRun(taints)) postSessionReport(runId, qa.report());
    }
  }

  attachSignals(emit, () => ({ inputThrottleMs, heartbeatMs: ss.config.heartbeatMs }), now);

  // Multi-tab beacon (plan §6.5): a second DEV tab writing the same ring is last-writer-wins
  // (accepted, one human) — but say so LOUDLY so the data isn't silently trusted.
  window.addEventListener('storage', (e) => {
    if (e.key === TELEMETRY_STORE_KEY) {
      console.warn(
        '[telemetry] another tab is writing the telemetry ring — attended totals may interleave',
      );
    }
  });

  // The vs-sim column reads the SAME walkPacing() the pacing gate runs (plan §3.2) — lazily
  // (the full R0→R3 reduce walk only runs when a report is rendered), cached, and guarded:
  // a dev-report nicety is never worth a crash.
  let cachedSim: SimRow[] | null = null;
  function simRows(): SimRow[] {
    if (!cachedSim) {
      try {
        cachedSim = walkPacing().map((r) => ({ rung: r.rung, wallMin: r.wallMin }));
      } catch {
        cachedSim = [];
      }
    }
    return cachedSim;
  }

  const qa: TelemetryQa = {
    sentinel: TELEMETRY_SENTINEL,
    summary(): TelemetrySummary {
      const t = now();
      const cls = !ss.visible
        ? 'hidden'
        : !ss.focused
          ? 'away'
          : ss.open === null
            ? 'away'
            : t - ss.lastInputT <= ss.config.inputRecencyMs
              ? 'active'
              : 'idle';
      const active = carriedActiveMs + ss.closedActiveMs + (ss.open?.activeMs ?? 0);
      const idle = carriedIdleMs + ss.closedIdleMs + (ss.open?.idleMs ?? 0);
      return {
        runId,
        class: cls,
        attendedMin: Math.round((runAttendedMs() / 60000) * 10) / 10,
        activeMin: Math.round((active / 60000) * 10) / 10,
        idleMin: Math.round((idle / 60000) * 10) / 10,
        segments: carriedSegments.length + ss.segments.length,
        taints: [...taints],
      };
    },
    report(): string {
      // Fold the OPEN segment in via a throwaway finalize so mid-session reads are current.
      const closed = finalize(ss, now());
      return formatRunReport(
        { ...currentRun(), segments: [...carriedSegments, ...closed.segments] },
        simRows(),
      );
    },
    segments: () => [...carriedSegments, ...ss.segments],
    runs: () => store.loadRuns(),
    configure(patch): TelemetryConfig {
      if (patch.inputThrottleMs !== undefined) inputThrottleMs = patch.inputThrottleMs;
      const { inputThrottleMs: _drop, ...cfg } = patch;
      ss = { ...ss, config: { ...ss.config, ...cfg } };
      return ss.config;
    },
    drop(): void {
      postSessionReport(runId, qa.report());
    },
    clear(): void {
      store.clear();
      startRun('boot');
    },
  };

  function startRun(reason: RunStartReason): void {
    // Close out + persist the outgoing run first (the record survives the transition).
    if (ss.segments.length > 0 || milestones.length > 0 || attendedMs(ss) > 0) {
      ss = finalize(ss, now());
      persist();
    }
    const t = now();
    // RESUME (FB-5 with an existing save): continue the newest stored run for this seed — same
    // runId, carried segments/milestones/taints — so reloads never fragment the history. Falls
    // through to a fresh run when the ring has nothing to continue (first boot, cleared ring).
    if (reason === 'resume') {
      const prior = store
        .loadRuns()
        .filter((r) => r.seed === seed)
        .at(-1);
      if (prior) {
        runId = prior.runId;
        startedAtISO = prior.startedAtISO;
        const parsed = Date.parse(prior.startedAtISO);
        runStartT = Number.isFinite(parsed) ? parsed : t;
        milestones = [...prior.milestones];
        taints = new Set(prior.taints);
        carriedSegments = prior.segments;
        carriedActiveMs = prior.segments.reduce((a, s) => a + s.activeMs, 0);
        carriedIdleMs = prior.segments.reduce((a, s) => a + s.idleMs, 0);
        ss = createSessionizer(t, ss.config, initVisibility());
        return;
      }
    }
    runStartT = t;
    startedAtISO = new Date(runStartT).toISOString();
    // Real-date prefix (2026-07-09) so reports sort/read by the day PLAYED — the old
    // `${seed}-…` prefix was the default seed 20260626, reading like a frozen June date.
    runId = `${startedAtISO.slice(0, 10).replace(/-/g, '')}-${Math.floor(runStartT / 1000)}`;
    milestones = [];
    taints = new Set(
      reason === 'import' ? ['save-import'] : reason === 'fixture' ? ['fixture'] : [],
    );
    carriedSegments = [];
    carriedActiveMs = 0;
    carriedIdleMs = 0;
    ss = createSessionizer(runStartT, ss.config, initVisibility());
  }

  return {
    qa,
    wrapDispatch<T>(dispatch: (intent: T) => void): (intent: T) => void {
      // The renderer's copy ONLY — autoStep keeps the raw dispatch, so auto-mode intents are
      // never mistaken for the human acting (the shared-dispatch trap, plan §1).
      return (intent: T): void => {
        emit({ t: now(), kind: 'intent' });
        dispatch(intent);
      };
    },
    onCommit(prev: GameState, next: GameState): void {
      const t = now();
      for (const ev of detectMilestones(prev, next)) {
        if (ev.kind === 'auto') emit({ t, kind: 'auto', armed: ev.armed });
        else if (ev.kind === 'note') emit({ t, kind: 'note' });
        else {
          milestones.push({ event: ev, attendedMs: runAttendedMs(), wallMs: t - runStartT });
          persist();
        }
      }
    },
    onRunStart(reason: RunStartReason, state: GameState): void {
      seed = state.rng.seed;
      startRun(reason);
      // Seed the armed state so the two-tier TTL starts on the right tier.
      if (autosArmed(state)) emit({ t: now(), kind: 'auto', armed: true });
    },
    taint(name: string): void {
      if (!taints.has(name)) {
        taints.add(name);
        persist();
      }
    },
  };
}

function initVisibility(): { visible: boolean; focused: boolean } {
  return { visible: !document.hidden, focused: document.hasFocus() };
}
