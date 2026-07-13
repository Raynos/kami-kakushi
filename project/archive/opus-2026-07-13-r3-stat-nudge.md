# The rare stat-nudge comes back — and the option it hangs on has to be chosen

**Status:** ▶️ IN-PROGRESS (2026-07-13, session-192) — HD-44 ruled
**restore** (human). The grammar already exists (HD-44's survey was
wrong); the loss was a CONTENT rewrite. What is left is one authored
line — new fiction, so ADR-139. **Confidence:** ( 70% Opus, 30% Fable )
— the restore is one data line plus one emitter key; the delight line is
fiction and goes through ADR-139. **Template:** build

## Who builds this — Fable or Opus?

**Split.** The grammar field, the emitter keying and the codec work are
**Opus** (mechanical, gated). The **delight line is new fiction** —
three blind takes, one agent per complete take, reviewed live in the DEV
Story switcher (ADR-139). Route the take-authoring to whichever model
the human is running for story; the picking and the wiring stay here.

## Why

**HD-44, ruled by the human 2026-07-13: restore.**
`RungOption.statBonus` is a designed lever — a one-time small attribute
nudge on a rung-beat pick, carrying a `note`: *the delight line*. It was
the **one asymmetric reward** in a choice system that is otherwise
strictly net-zero (+1/−1).

It is **gone from the game** — no option carries one.

## What exists today

**Survey date: 2026-07-13 (session-192), source-verified — and it
CORRECTS the survey in HD-44, which was wrong twice.**

- **The grammar is NOT missing.** `bonus: +1 agi — "…"` is a first-class
  option annotation: parsed (`parse.ts`, `parseBonus`), validated
  against the attr roster (`validate.ts` §3.6), emitted as `statBonus: {
  attr, amount, note }` (`emit.ts`), documented in the narrative README
  (its example *is* the lost line), and covered by a RED-able validation
  test. Nothing needs building here. *(HD-44 claimed the grammar had no
  `bonus:` field — that came from grepping the compiler for `statBonus`,
  which is what it EMITS, not what it reads.)*
- **It was not lost in the FB-5 migration either.** `git log -S` puts
  the loss at **`ea5710e3`** (the G4 narrative cutover), which **rewrote
  the R3 beat**: *"How do you take up the blade?"* (`r3-aggressive` /
  **`r3-disciplined`** / `r3-duty-not-glory`) became *"What do you do
  about the wolf?"* (`r3-track` / `r3-hold` / `r3-mend`). The option the
  bonus hung on ceased to exist, and the bonus did not come across.
- **What it was**, verbatim, on `r3-disciplined` ("Teach me to stand a
  watch"): `bonus: +1 agi — "Kihei drills you an extra dawn; your feet
  learn the watch. (+1 AGI)"`
- **The dead skeleton is real, though:** `vnText`'s `opt.<id>.bonus`
  branch and `scenes.ts`'s bonus-emit block never run, and
  **`intents.ts:610` logs a beat's bonus note UNKEYED** — so the moment
  the data returns, that line freezes in every save that logs it
  (exactly the bug class session-192 spent the day on).

## Steps

1. **Restore the data** — one `bonus:` line on the heir option. **The
   heir is `r3-hold`**: the beat's watch-standing choice (*"It knows
   this door now. So do I. I'll be at the sill."*), which Kihei answers
   with a discipline (*mend the bar before dark, take the long spear,
   eat first*). `r3-track` is the reckless read (Sōan slaps it down — a
   reward there fights the scene); `r3-mend` is the orderly one, but the
   lost line was about **standing the watch**, and so is `r3-hold`.
   **`+1 agi`**, per the original — the precedent is in git, not
   invented.
2. **The delight line is NEW fiction.** The old words name a dawn drill
   that no longer happens; the new beat is a night watch at the sill. So
   it goes through **ADR-139**: 3+ blind takes, live-swappable in the
   DEV Story switcher, agent self-picks canon, alternates stay DEV-only,
   HR item filed.
3. **Key the log line** — `beat.<rank>.opt.<id>.bonus` in `intents.ts`.
   The resolver already reads it; only the emitter is missing.
4. **ADR-190** records the restoration (and *why* it vanished — a
   content rewrite dropped a mechanic silently, which is the lesson
   worth keeping); HD-44 archives.

## Verification

- **RED-able grammar test:** a `bonus:` line compiles into `statBonus: {
  attr, amount, note }`; a bonus on a second option in the same tier is
  REJECTED with a `file:line`; an unknown attr is REJECTED (fixtures
  derived from the attr roster, never copied literals).
- **RED-able codec test:** a save holding `beat.R3.opt.<id>.bonus`
  re-renders from the registry — the test that fails on `main` today
  because nothing emits that key.
- The sweep in `log-render.test.ts` picks the bonus key up for free (it
  already builds `.bonus` keys from any option carrying `statBonus` — it
  is currently vacuous because none does; this makes it bite).
- **Player-reach proof (PH6):** take the R3 beat in the live build, pick
  the option, and read the delight line in the log with the attribute
  actually moved on the sheet.

## Sync ripple

- **PRD:** the choice system is described as net-zero — check §4/§7 for
  a sentence that now under-describes it, and annotate (a bonus is an
  exception to net-zero, not a contradiction of it).
- **Story-bible:** none — one line of new fiction, authored through the
  diverge; no canon moves.
- **Living docs / registries:** `gen:narrative` outputs regenerate;
  `narrative/README.md` documents the `bonus:` field;
  `docs/content/t0-story.md` gains the line.
- **CHANGELOG:** an `Added` line — a pick that pays.

## Human-in-the-loop

- **HD-44** — ruled (restore). Archives when this lands, with
  **ADR-190**.
- **The fork above** — which option / which attribute. Agent default
  stated; the human overrides.
- **HR-item** — the delight line's take (ADR-139), reviewed live in the
  DEV Story switcher.

## Non-goals

- **Not a second lever.** Exactly one bonus in T0; the grammar enforces
  it. If every pick pays, the choice system stops being net-zero and the
  moment stops being rare.
- **Not re-opening the R3 beat's prose** — the three options stay as
  written; only the picked one gains a note.

## Risks

- **Rarity is the whole design.** A grammar that permits many bonuses
  will grow many. Gate it at one per tier, loudly.
- **The unkeyed log line** (`intents.ts:610`) is the same class of bug
  session-192 just spent a day on. Key it in the SAME commit that
  restores the data, or it ships frozen prose into every save that logs
  it.
- **Shared tree:** touches the narrative grammar (parse/emit/validate) —
  the same files a re-voice wave edits. Land the grammar before any wave
  rebases on it.
