import { describe, it, expect } from 'vitest';
import {
  createSessionizer,
  advance,
  finalize,
  attendedMs,
  DEFAULT_TELEMETRY_CONFIG,
  type SessionizerState,
  type TelemetryEvent,
} from './sessionizer';

// The FB-8 correctness proof (plan §4) — every case here is arithmetic the model MUST hit
// exactly, derived from the plan's worked examples (§2.5), not from running the code first.
// The headline: the human's own 5/20/5 requirement ⇒ exactly 600 000 attended ms.

const MIN = 60_000;

/** Fold a synthetic timeline through the reducer — the same advance() the live shell calls. */
function fold(events: TelemetryEvent[], state: SessionizerState): SessionizerState {
  return events.reduce((s, ev) => advance(s, ev), state);
}

/** Inputs every `stepMs` over [from, to] inclusive of `from`, exclusive of `to`. */
function inputs(from: number, to: number, stepMs = MIN): TelemetryEvent[] {
  const out: TelemetryEvent[] = [];
  for (let t = from; t < to; t += stepMs) out.push({ t, kind: 'input' });
  return out;
}

/** Heartbeats every 30s over (from, to] — the live page's watchdog cadence. */
function heartbeats(from: number, to: number): TelemetryEvent[] {
  const out: TelemetryEvent[] = [];
  for (let t = from + 30_000; t <= to; t += 30_000) out.push({ t, kind: 'heartbeat' });
  return out;
}

describe('sessionizer — the 5/20/5 headline (plan §2.5)', () => {
  it('5 min play, 20 min hidden, 5 min play = EXACTLY 10 minutes, two segments', () => {
    let s = createSessionizer(0);
    s = fold(
      [
        ...inputs(0, 5 * MIN), // t=0..4:00, one per minute — all attended-active
        { t: 5 * MIN, kind: 'input' }, // the 5:00 boundary input
        { t: 5 * MIN, kind: 'hidden' }, // tab hidden → S1 closes at 5:00
        { t: 25 * MIN, kind: 'visible' }, // back after 20 min
        ...inputs(25 * MIN, 30 * MIN),
      ],
      s,
    );
    s = finalize(s, 30 * MIN);

    expect(attendedMs(s)).toBe(600_000); // 10 min of gameplay, not 30
    expect(s.segments).toHaveLength(2);
    expect(s.segments.map((seg) => seg.closer)).toEqual(['hidden', 'flush']);
    expect(s.segments[0]).toMatchObject({ start: 0, end: 5 * MIN });
    expect(s.segments[1]).toMatchObject({ start: 25 * MIN, end: 30 * MIN });
  });

  it('total event silence: the sleep watchdog wins over idle-ttl (close back-dated to last life)', () => {
    // No heartbeats at all (a frozen tab fires nothing): a 5-min silent gap on an open
    // segment cannot be distinguished from sleep, so the conservative sleep-gap close at the
    // LAST event seen wins over the idle-ttl split — nothing unverifiable is credited.
    let s = createSessionizer(0);
    s = fold(
      [
        { t: 0, kind: 'input' },
        { t: 5 * MIN, kind: 'hidden' }, // first event after 5 silent minutes
        { t: 25 * MIN, kind: 'visible' },
        { t: 25 * MIN, kind: 'input' },
      ],
      s,
    );
    s = finalize(s, 26 * MIN);
    expect(s.segments[0]).toMatchObject({ closer: 'sleep-gap', end: 0 });
    expect(attendedMs(s)).toBe(MIN); // only S2 [25:00, 26:00] counted
  });
});

describe('sessionizer — walked away with the tab visible (class d, retro-split)', () => {
  it('autos armed: TTL 5 min — 5 play + 20 gap + 5 play = 15 min attended', () => {
    let s = createSessionizer(0);
    s = fold(
      [
        { t: 0, kind: 'auto', armed: true },
        ...inputs(0, 5 * MIN),
        { t: 5 * MIN, kind: 'input' }, // last touch at 5:00
        ...heartbeats(5 * MIN, 25 * MIN), // page alive the whole time
        { t: 25 * MIN, kind: 'input' }, // back at 25:00
        ...inputs(26 * MIN, 30 * MIN),
      ],
      s,
    );
    s = finalize(s, 30 * MIN);

    // S1 splits retroactively: [0,6:00] active (60s recency past the last input),
    // [6:00,10:00] idle (5-min autos TTL), closed back-dated to 10:00.
    expect(s.segments[0]).toMatchObject({
      closer: 'idle-ttl',
      end: 10 * MIN,
      activeMs: 6 * MIN,
      idleMs: 4 * MIN,
    });
    expect(attendedMs(s)).toBe(15 * MIN); // 10 + 5, the plan's §2.5 hard variant
  });

  it('autos NOT armed: static TTL 2 min — the same timeline yields 12 min (two-tier, human-locked)', () => {
    let s = createSessionizer(0);
    s = fold(
      [
        ...inputs(0, 5 * MIN),
        { t: 5 * MIN, kind: 'input' },
        ...heartbeats(5 * MIN, 25 * MIN),
        { t: 25 * MIN, kind: 'input' },
        ...inputs(26 * MIN, 30 * MIN),
      ],
      s,
    );
    s = finalize(s, 30 * MIN);

    // Retro-split at 5:00 + 2 min static TTL = 7:00 (active to 6:00, idle 6:00→7:00).
    expect(s.segments[0]).toMatchObject({
      closer: 'idle-ttl',
      end: 7 * MIN,
      activeMs: 6 * MIN,
      idleMs: 1 * MIN,
    });
    expect(attendedMs(s)).toBe(12 * MIN);
  });

  it('an auto-disarm mid-gap drops the span to the static TTL (never claws back credit)', () => {
    let s = createSessionizer(0);
    s = fold(
      [
        { t: 0, kind: 'auto', armed: true },
        { t: 0, kind: 'input' }, // last input at 0, autos armed → deadline 5:00
        { t: 30_000, kind: 'auto', armed: false }, // grind stops at 0:30 → static TTL, deadline 2:00
        ...heartbeats(30_000, 6 * MIN),
      ],
      s,
    );
    s = finalize(s, 6 * MIN);
    // Close lands at the static deadline (2:00), not the armed one (5:00).
    expect(s.segments[0]).toMatchObject({ closer: 'idle-ttl', end: 2 * MIN });
    expect(attendedMs(s)).toBe(2 * MIN);
  });
});

describe('sessionizer — blur (excluded ALWAYS, the human rule)', () => {
  it('a visible-but-blurred span contributes zero; input while blurred opens nothing', () => {
    let s = createSessionizer(0);
    s = fold(
      [
        { t: 0, kind: 'input' },
        { t: MIN, kind: 'blur' }, // S1 closes at 1:00
        { t: 2 * MIN, kind: 'input' }, // blurred: must NOT open a segment
        { t: 3 * MIN, kind: 'focus' },
        { t: 200_000, kind: 'input' }, // focused again → S2 opens here (3:20)
      ],
      s,
    );
    s = finalize(s, 260_000);

    expect(s.segments.map((seg) => seg.closer)).toEqual(['blur', 'flush']);
    expect(s.segments[0]).toMatchObject({ start: 0, end: MIN, activeMs: MIN });
    expect(s.segments[1]).toMatchObject({ start: 200_000, end: 260_000 });
    expect(attendedMs(s)).toBe(2 * MIN); // 60s + 60s; the blurred stretch counted nothing
  });
});

describe('sessionizer — attended-idle counts (watching the grind IS play)', () => {
  it('visible, autos armed, no input, under TTL: idle accrues and autosArmedMs tracks it', () => {
    let s = createSessionizer(0);
    s = fold(
      [{ t: 0, kind: 'auto', armed: true }, { t: 0, kind: 'input' }, ...heartbeats(0, 4 * MIN)],
      s,
    );
    s = finalize(s, 4 * MIN);

    expect(s.segments).toHaveLength(1);
    expect(s.segments[0]).toMatchObject({
      closer: 'flush',
      activeMs: MIN, // 60s input recency
      idleMs: 3 * MIN, // the watched grind, under the 5-min autos TTL
      autosArmedMs: 4 * MIN,
    });
    expect(attendedMs(s)).toBe(4 * MIN);
  });
});

describe('sessionizer — sleep watchdog (plan §2.3)', () => {
  it('heartbeat silence > 90s closes back-dated to the last event seen', () => {
    let s = createSessionizer(0);
    s = fold(
      [
        { t: 0, kind: 'auto', armed: true },
        { t: 0, kind: 'input' },
        { t: 30_000, kind: 'heartbeat' },
        { t: 60_000, kind: 'heartbeat' }, // last sign of life at 1:00
        { t: 5 * MIN, kind: 'input' }, // lid reopens at 5:00 (gap 240s > 90s)
      ],
      s,
    );
    s = finalize(s, 5 * MIN + 30_000);

    expect(s.segments[0]).toMatchObject({ closer: 'sleep-gap', end: 60_000 });
    expect(attendedMs(s)).toBe(60_000 + 30_000); // S1 [0,1:00] + S2 [5:00,5:30]
  });
});

describe('sessionizer — note re-engagement (the flagged weakest rule)', () => {
  /** Walk into class (d): input at 0 (autos armed), then heartbeats only through 6:00 —
   *  idle-ttl closes back-dated to 5:00; the page stays alive for the 400s note. */
  function walkedAway(): SessionizerState {
    const s = createSessionizer(0);
    return fold(
      [{ t: 0, kind: 'auto', armed: true }, { t: 0, kind: 'input' }, ...heartbeats(0, 6 * MIN)],
      s,
    );
  }

  it('note + input inside the window: segment reopens back-dated to note.t; the gap before stays excluded', () => {
    let s = walkedAway();
    s = fold(
      [
        { t: 400_000, kind: 'note' }, // auto-combat stopped at 6:40, unattended-visible
        { t: 420_000, kind: 'input' }, // reacted 20s later — inside the 30s window
      ],
      s,
    );
    s = finalize(s, 500_000);

    expect(s.segments[0]).toMatchObject({ closer: 'idle-ttl', end: 5 * MIN });
    expect(s.segments[1]).toMatchObject({ start: 400_000, end: 500_000 });
    // [400,420]s idle (watched, didn't act) + [420,480] active + [480,500] idle.
    expect(s.segments[1]?.activeMs).toBe(60_000);
    expect(s.segments[1]?.idleMs).toBe(40_000);
  });

  it('input OUTSIDE the window: no retro-credit, segment opens at the input', () => {
    let s = walkedAway();
    s = fold(
      [
        { t: 400_000, kind: 'note' },
        { t: 440_000, kind: 'input' }, // 40s later — outside the 30s window
      ],
      s,
    );
    s = finalize(s, 500_000);
    expect(s.segments[1]).toMatchObject({ start: 440_000 });
  });

  it('NOTE_REENGAGE_WINDOW_MS = 0 disables the rule entirely (the promised kill switch)', () => {
    let s = createSessionizer(0, { noteReengageWindowMs: 0 });
    s = fold(
      [
        { t: 0, kind: 'auto', armed: true },
        { t: 0, kind: 'input' },
        ...heartbeats(0, 6 * MIN),
        { t: 400_000, kind: 'note' },
        { t: 400_001, kind: 'input' }, // 1ms later — would re-engage under any window > 0
      ],
      s,
    );
    expect(s.open?.start).toBe(400_001); // opened at the input, no back-date
  });
});

describe('sessionizer — per-rung attribution across segments (§2.3)', () => {
  it('a monotonic attendedMs read mid-segment equals closed totals + open accrual', () => {
    let s = createSessionizer(0);
    // S1: 2 min active, closed by hidden.
    s = fold(
      [
        { t: 0, kind: 'input' },
        { t: MIN, kind: 'input' },
        { t: 2 * MIN, kind: 'hidden' },
        { t: 10 * MIN, kind: 'visible' },
        // S2 opens at 10:00; a rung-up lands mid-segment at 10:30.
        { t: 10 * MIN, kind: 'input' },
        { t: 10 * MIN + 30_000, kind: 'intent' }, // the promotion click itself
      ],
      s,
    );
    // The snapshot the milestone would take: S1 (120s) + partial S2 (30s).
    expect(attendedMs(s)).toBe(2 * MIN + 30_000);

    // Per-rung attribution = difference of two snapshots, across the hidden gap.
    const atRungUp = attendedMs(s);
    s = fold([{ t: 11 * MIN, kind: 'input' }], s);
    s = finalize(s, 12 * MIN);
    expect(attendedMs(s) - atRungUp).toBe(90_000); // 10:30→12:00 attended
  });
});

describe('sessionizer — determinism & config', () => {
  it('the same timeline folded twice produces identical states', () => {
    const timeline: TelemetryEvent[] = [
      { t: 0, kind: 'auto', armed: true },
      ...inputs(0, 3 * MIN, 45_000),
      { t: 3 * MIN, kind: 'blur' },
      { t: 4 * MIN, kind: 'focus' },
      { t: 5 * MIN, kind: 'input' },
      ...heartbeats(5 * MIN, 12 * MIN),
      { t: 12 * MIN, kind: 'flush' },
    ];
    const a = fold(timeline, createSessionizer(0));
    const b = fold(timeline, createSessionizer(0));
    expect(a).toEqual(b);
  });

  it('every §2.4 constant exists, is defaulted, and is injectable', () => {
    expect(DEFAULT_TELEMETRY_CONFIG).toMatchObject({
      inputRecencyMs: 60_000,
      idleTtlAutosMs: 300_000,
      idleTtlStaticMs: 120_000, // the human-locked two-tier deviation
      noteReengageWindowMs: 30_000,
      heartbeatMs: 30_000,
      heartbeatGapFactor: 3,
    });
    const s = createSessionizer(0, { idleTtlStaticMs: 1 });
    expect(s.config.idleTtlStaticMs).toBe(1);
    expect(s.config.inputRecencyMs).toBe(60_000); // partial override keeps the rest
  });

  it('finalize is idempotent when nothing is open', () => {
    let s = createSessionizer(0);
    s = finalize(s, MIN);
    const segCount = s.segments.length;
    s = finalize(s, 2 * MIN);
    expect(s.segments.length).toBe(segCount); // no phantom segments
    expect(attendedMs(s)).toBe(0);
  });
});
