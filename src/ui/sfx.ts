// A lazy, synth-only Web-Audio SFX engine in the woodblock-Edo palette — the build's
// FIRST sound (T0-M1-F4 juice pass / DS#2: lands before the R1 taste call). Three cues
// only — a TAIKO 太鼓 hit-thud, a SHAMISEN/KOTO 三味線・箏 reward-pluck, and a struck
// SUZU 鈴 temple-bell rank-up — each synthesised from OscillatorNode + GainNode ADSR
// envelopes, NO audio assets (palette = ADR-068; synth-only = ADR-041; contract =
// docs/living/sfx-spec.md; mapping = ui-design.md §6.8). This is the ONE UI module
// permitted Web Audio; the pure core stays silent & deterministic and only emits the
// semantic events (hit / reward / rankUp) this consumer maps to cues.
//
// Mute-safe + reduced-motion-aware: every method is a NO-OP that NEVER throws when
// muted, when Web Audio is unavailable (SSR / node / jsdom), or when a
// `prefers-reduced-motion: reduce` signal is honored. The AudioContext is created
// LAZILY on the first audible cue (so it respects the browser autoplay-gesture rule)
// and reused; nothing is a module-level singleton, so two games never share a context.

export interface Sfx {
  /** Per-deed / combat-hit cue — a short taiko thud (low sine + fast decay). */
  hit(): void;
  /** Coin/rice tally cue — a bright shamisen/koto pluck (plucked-string envelope). */
  reward(): void;
  /** Rank-up flourish — a struck temple-bell 鈴 (inharmonic suzu partials + long decay). */
  rankUp(): void;
  setMuted(b: boolean): void;
  isMuted(): boolean;
}

export interface SfxOptions {
  /** Start muted. Default false (the default-on-vs-muted ship call is a human/R1 call,
   *  sfx-spec §3 — the app persists the toggle and may override). */
  readonly muted?: boolean;
  /** When true, an OS `prefers-reduced-motion: reduce` signal silences all cues — audio
   *  is motion, so honor the hint (sfx-spec §3 / ui-design reduced-motion posture). The
   *  app OPTS IN; default false so the module never reaches for matchMedia uninvited. */
  readonly honorReducedMotion?: boolean;
}

// ── Mix + envelope constants (kept quiet & short per the spec: master ~0.15, <400ms) ──
const MASTER_GAIN = 0.15; // never auto-loud (sfx-spec §3)
const ENV_FLOOR = 0.0001; // exponential ramps can't touch 0 — ramp to this near-silence
/** Anti-click tail past the envelope's end before the oscillator stops. Exported so the
 *  <400ms-voice contract test can assert envelope length from the scheduled stop time. */
export const STOP_TAIL_S = 0.02;

type AudioCtor = new () => AudioContext;

/** Resolve the AudioContext constructor off the global, webkit-prefixed fallback included.
 *  Returns undefined when Web Audio is absent (SSR / node / jsdom) → callers no-op. */
function audioContextCtor(): AudioCtor | undefined {
  const g = globalThis as unknown as {
    AudioContext?: AudioCtor;
    webkitAudioContext?: AudioCtor;
  };
  return g.AudioContext ?? g.webkitAudioContext;
}

/** True only when an OS reduced-motion preference is set AND matchMedia exists. Guarded so
 *  a missing matchMedia (jsdom / node) is simply "no preference", never a throw. */
function prefersReducedMotion(): boolean {
  try {
    const mm = (globalThis as { matchMedia?: (q: string) => { matches: boolean } }).matchMedia;
    return typeof mm === 'function' && mm('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
}

/** One synth voice: an oscillator through its own gain ADSR into the shared master bus. */
interface VoiceSpec {
  readonly type: OscillatorType;
  readonly freq: number;
  /** Optional pitch-glide target reached by the end of the voice (the taiko drop). */
  readonly freqEnd?: number;
  /** Envelope peak (pre-master); voices stack under MASTER_GAIN so peaks near 1 are safe. */
  readonly peak: number;
  readonly attack: number; // seconds to peak
  readonly decay: number; // seconds peak → near-silence
}

function playVoice(ctx: AudioContext, master: GainNode, spec: VoiceSpec): void {
  const t0 = ctx.currentTime;
  const end = t0 + spec.attack + spec.decay;
  const osc = ctx.createOscillator();
  const env = ctx.createGain();
  osc.type = spec.type;
  osc.frequency.setValueAtTime(spec.freq, t0);
  if (spec.freqEnd !== undefined) {
    osc.frequency.exponentialRampToValueAtTime(Math.max(1, spec.freqEnd), end);
  }
  const peak = Math.max(ENV_FLOOR, spec.peak);
  env.gain.setValueAtTime(ENV_FLOOR, t0);
  env.gain.exponentialRampToValueAtTime(peak, t0 + spec.attack);
  env.gain.exponentialRampToValueAtTime(ENV_FLOOR, end);
  osc.connect(env);
  env.connect(master);
  osc.start(t0);
  osc.stop(end + STOP_TAIL_S);
}

// ── The three voices (woodblock-Edo palette; pentatonic 陽 brightness, all <400ms) ──

/** Taiko 太鼓 — a grounded body sine that drops in pitch under a short skin-attack. */
function playTaiko(ctx: AudioContext, master: GainNode): void {
  playVoice(ctx, master, {
    type: 'sine',
    freq: 150,
    freqEnd: 55,
    peak: 0.95,
    attack: 0.004,
    decay: 0.18,
  });
  playVoice(ctx, master, {
    type: 'triangle',
    freq: 320,
    freqEnd: 120,
    peak: 0.35,
    attack: 0.003,
    decay: 0.06,
  });
}

/** Shamisen/koto 三味線・箏 — a bright plucked note + an octave overtone, fast-decaying. */
function playPluck(ctx: AudioContext, master: GainNode): void {
  playVoice(ctx, master, { type: 'triangle', freq: 587, peak: 0.5, attack: 0.002, decay: 0.28 }); // ~D5
  playVoice(ctx, master, { type: 'sawtooth', freq: 1174, peak: 0.16, attack: 0.002, decay: 0.16 });
}

/** Suzu 鈴 — a struck temple-bell: inharmonic sine partials over a long-ish ring (<400ms). */
const SUZU_FUNDAMENTAL = 660;
const SUZU_PARTIALS: readonly {
  readonly ratio: number;
  readonly peak: number;
  readonly decay: number;
}[] = [
  { ratio: 1.0, peak: 0.5, decay: 0.38 },
  { ratio: 2.0, peak: 0.3, decay: 0.3 },
  { ratio: 2.76, peak: 0.2, decay: 0.26 },
  { ratio: 5.4, peak: 0.1, decay: 0.2 },
];
function playSuzu(ctx: AudioContext, master: GainNode): void {
  for (const p of SUZU_PARTIALS) {
    playVoice(ctx, master, {
      type: 'sine',
      freq: SUZU_FUNDAMENTAL * p.ratio,
      peak: p.peak,
      attack: 0.003,
      decay: p.decay,
    });
  }
}

/**
 * Build a fresh SFX engine. Pure of any module-level state — each call owns its own lazily
 * created, reused AudioContext, so games never leak sound between each other.
 */
export function createSfx(opts: SfxOptions = {}): Sfx {
  let muted = opts.muted ?? false;
  const honorReducedMotion = opts.honorReducedMotion ?? false;
  let ctx: AudioContext | null = null;
  let master: GainNode | null = null;

  /** Lazily create (or reuse) the context + master bus; null when Web Audio is unavailable. */
  function engine(): { ctx: AudioContext; master: GainNode } | null {
    if (!ctx || !master) {
      const Ctor = audioContextCtor();
      if (!Ctor) return null;
      try {
        const c = new Ctor();
        const m = c.createGain();
        m.gain.value = MASTER_GAIN;
        m.connect(c.destination);
        ctx = c;
        master = m;
      } catch {
        ctx = null;
        master = null;
        return null;
      }
    }
    // A later user gesture can lift the autoplay suspension (best-effort, fire-and-forget).
    try {
      if (ctx.state === 'suspended' && typeof ctx.resume === 'function') void ctx.resume();
    } catch {
      /* ignore — audio is never load-bearing */
    }
    return { ctx, master };
  }

  function audible(): boolean {
    if (muted) return false;
    if (honorReducedMotion && prefersReducedMotion()) return false;
    return true;
  }

  /** Gate → lazily build the engine → run the voice; swallow any audio error. */
  function cue(play: (ctx: AudioContext, master: GainNode) => void): void {
    if (!audible()) return;
    const eng = engine();
    if (!eng) return;
    try {
      play(eng.ctx, eng.master);
    } catch {
      /* fail silent — sound never blocks gameplay (sfx-spec §3) */
    }
  }

  return {
    hit: () => cue(playTaiko),
    reward: () => cue(playPluck),
    rankUp: () => cue(playSuzu),
    setMuted: (b: boolean) => {
      muted = b;
    },
    isMuted: () => muted,
  };
}
