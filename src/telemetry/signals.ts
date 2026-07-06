// The DOM shell (FB-8) — the ONLY telemetry producer in the app. Deliberately a SHELL: every
// handler is one line (read the clock, emit one event); all judgment lives in the pure
// sessionizer, which is where the tests are (plan §4). Passive listeners throughout — the
// shell must never affect the game it measures.

import type { TelemetryEvent } from './sessionizer';

/** Raw DOM input coalescing: one `input` event per window at most (plan §2.4). Lives here,
 *  not in the sessionizer config — it shapes the event STREAM, not its interpretation. */
export const INPUT_THROTTLE_MS = 5_000;

export interface SignalConfig {
  readonly inputThrottleMs: number;
  readonly heartbeatMs: number;
}

/** Attach the listeners; returns a detach fn (tests / hot teardown). `cfg` is read LIVE on
 *  every use so `__qa.telemetry.configure` can shrink cadences without re-attaching. */
export function attachSignals(
  emit: (ev: TelemetryEvent) => void,
  cfg: () => SignalConfig,
  now: () => number = () => Date.now(),
): () => void {
  let lastInputEmit = Number.NEGATIVE_INFINITY;
  const input = (): void => {
    const t = now();
    if (t - lastInputEmit < cfg().inputThrottleMs) return;
    lastInputEmit = t;
    emit({ t, kind: 'input' });
  };

  const onVisibility = (): void => emit({ t: now(), kind: document.hidden ? 'hidden' : 'visible' });
  const onFocus = (): void => emit({ t: now(), kind: 'focus' });
  const onBlur = (): void => emit({ t: now(), kind: 'blur' });
  const onUnload = (): void => emit({ t: now(), kind: 'flush' });

  document.addEventListener('visibilitychange', onVisibility);
  window.addEventListener('focus', onFocus);
  window.addEventListener('blur', onBlur);
  window.addEventListener('pointerdown', input, { passive: true });
  window.addEventListener('pointermove', input, { passive: true });
  window.addEventListener('keydown', input, { passive: true });
  window.addEventListener('wheel', input, { passive: true });
  window.addEventListener('beforeunload', onUnload);

  // Self-rescheduling heartbeat (not setInterval) so a configure() cadence change takes
  // effect on the next beat. A missed beat IS the signal — the sessionizer's watchdog reads
  // the gap, so the shell just has to keep breathing while the page is alive.
  let hbTimer: number | undefined;
  const beat = (): void => {
    emit({ t: now(), kind: 'heartbeat' });
    hbTimer = window.setTimeout(beat, cfg().heartbeatMs);
  };
  hbTimer = window.setTimeout(beat, cfg().heartbeatMs);

  return () => {
    document.removeEventListener('visibilitychange', onVisibility);
    window.removeEventListener('focus', onFocus);
    window.removeEventListener('blur', onBlur);
    window.removeEventListener('pointerdown', input);
    window.removeEventListener('pointermove', input);
    window.removeEventListener('keydown', input);
    window.removeEventListener('wheel', input);
    window.removeEventListener('beforeunload', onUnload);
    if (hbTimer !== undefined) window.clearTimeout(hbTimer);
  };
}
