# SFX Spec — the minimal traditional-palette audio pass

> **LIVING — the minimal 3-cue pass is BUILT & WIRED** in [`../../src/ui/sfx.ts`](../../src/ui/sfx.ts)
> (synthesized Web Audio, behind the **Sound on/off** toggle): `hit` (taiko) on **every player-driven
> deed/fight** (`do_activity`/`fight`/`face_wolf` — the per-action thud), `reward` (shamisen/koto) on a
> koku tally, `rankUp` (suzu temple-bell) on a rank-up/ascension. This
> doc is the **contract** it implements; the genuinely-deferred part is **§4 (the full bed)**. Locked
> by **ADR-068** (palette + timing), sequenced within **ADR-041** (a small *synthesized* Web Audio set —
> no audio-file pipeline).
> Companion to the look: [`ui-design.md`](ui-design.md) (the woodblock/ink bible) and
> [`fun-factor.md`](fun-factor.md) (juice = the make-or-break priority).

---

## 1. Scope — the minimal pass (BUILT — `src/ui/sfx.ts`)

Three cues only — **built & wired** so the human's **R1 taste verdict** has real audio to judge. The
**full synthesized bed is deferred** (§4).

| Cue | Fires on | Instrument (palette §2) | Feel |
|---|---|---|---|
| **Hit** | **every player-driven deed/fight** (labour or combat — `do_activity`/`fight`/`face_wolf`) | **taiko** | a single grounded thud (one fixed voice — per-strike/crit variety is the deferred full bed) |
| **Reward** | a koku tally banks | **shamisen / koto** | a short bright pluck |
| **Rank-up** | a rung/tier ascension | **temple bell / 鈴** | one clear struck bell; the ceremony beat |

Everything else (ambience, per-deed variety, UI ticks, the **shakuhachi** big-beat swell) is the
**full bed** — out of this pass.

## 2. The traditional-Japanese palette mapping (ADR-068)

The audio analogue of the woodblock visual discipline — the anti-slop defence in *sound*:

- **Taiko** (太鼓) → **every player-driven deed/fight** (the per-action thud; *built* as one fixed voice —
  per-strike/crit variety is the deferred full bed).
- **Shamisen / koto** (三味線・箏) → **the koku tally / reward** (a banked payoff).
- **Shakuhachi** (尺八) → **big beats** (tier swells, ceremony — *full bed*, deferred).
- **Temple bell / 鈴** (suzu) → **rank-ups** (the ascension chime).

Never generic UI blips; never an orchestral wash. Synthesized to match `ui-design.md`'s palette.

## 3. Technical contract (as built)

- **Synthesized Web Audio only** (ADR-041) — oscillator/noise + envelopes + filters; **no audio files**,
  no asset pipeline. Cues are generated, not sampled.
- **Mute-safe:** a single master gain with a persisted mute/volume toggle (the **Sound on/off** button);
  **default loudness is a human call**, never auto-loud. Honour an OS/`prefers-reduced-motion` signal as a sound-reducing hint
  alongside any in-game mute (consistent with the reduced-motion posture in `ui-design.md`).
- **Lazy AudioContext:** create/resume only on first user gesture (browser autoplay policy); fail
  silent if Web Audio is unavailable — audio is **never** load-bearing for gameplay.
- **Pure-core boundary:** the core emits semantic **events** (`hit`, `reward`, `rankUp`); the audio
  module is a renderer-side consumer that maps events → cues. No DOM/audio imports leak into the core.

## 4. Out of scope (full bed, deferred post-R1)

Ambient loops, per-deed/per-weapon cue variety, the shakuhachi tier-swell, music, and any second
synthesis pass. Revisit after the R1 taste call.
