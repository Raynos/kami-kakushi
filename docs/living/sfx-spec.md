# SFX Spec — the minimal traditional-palette audio pass

> **LIVING — this is the CONTRACT, not the code.** It specifies the **minimal SFX pass** that the
> Part-2 Web Audio module implements. The module itself (synthesis + scheduling) is **Part-2 build
> work**; nothing here ships sound on its own. Locked by **D-068** (palette + timing), sequenced
> within **D-041** (a small *synthesized* Web Audio set is in scope — no audio-file pipeline).
> Companion to the look: [`ui-design.md`](ui-design.md) (the woodblock/ink bible) and
> [`fun-factor.md`](fun-factor.md) (juice = the make-or-break priority).

---

## 1. Scope — the minimal pass (lands BEFORE the R1 taste call)

Three cues only, so the human's **R1 taste verdict** has real audio to judge without blocking on a
full bed. The **full synthesized bed is deferred** (post-R1).

| Cue | Fires on | Instrument (palette §2) | Feel |
|---|---|---|---|
| **Hit** | a landed combat blow | **taiko** | a single grounded thud; weightier on a crit |
| **Reward** | a deed banks / koku/upgrade lands | **shamisen / koto** | a short bright pluck |
| **Rank-up** | a rung/tier ascension | **temple bell / 鈴** | one clear struck bell; the ceremony beat |

Everything else (ambience, per-deed variety, UI ticks, the **shakuhachi** big-beat swell) is the
**full bed** — out of this pass.

## 2. The traditional-Japanese palette mapping (D-068)

The audio analogue of the woodblock visual discipline — the anti-slop defence in *sound*:

- **Taiko** (太鼓) → **combat** (hits, crits, the martial register).
- **Shamisen / koto** (三味線・箏) → **UI / deeds** (banking, upgrades, menu confirms).
- **Shakuhachi** (尺八) → **big beats** (tier swells, ceremony — *full bed*, deferred).
- **Temple bell / 鈴** (suzu) → **rank-ups** (the ascension chime).

Never generic UI blips; never an orchestral wash. Synthesized to match `ui-design.md`'s palette.

## 3. Technical contract for the Part-2 module

- **Synthesized Web Audio only** (D-041) — oscillator/noise + envelopes + filters; **no audio files**,
  no asset pipeline. Cues are generated, not sampled.
- **Mute-safe:** a single master gain with a persisted mute/volume toggle; **default-on is a Part-2 +
  human call**, never auto-loud. Honour an OS/`prefers-reduced-motion` signal as a sound-reducing hint
  alongside any in-game mute (consistent with the reduced-motion posture in `ui-design.md`).
- **Lazy AudioContext:** create/resume only on first user gesture (browser autoplay policy); fail
  silent if Web Audio is unavailable — audio is **never** load-bearing for gameplay.
- **Pure-core boundary:** the core emits semantic **events** (`hit`, `reward`, `rankUp`); the audio
  module is a renderer-side consumer that maps events → cues. No DOM/audio imports leak into the core.

## 4. Out of scope (full bed, deferred post-R1)

Ambient loops, per-deed/per-weapon cue variety, the shakuhachi tier-swell, music, and any second
synthesis pass. Revisit after the R1 taste call.
