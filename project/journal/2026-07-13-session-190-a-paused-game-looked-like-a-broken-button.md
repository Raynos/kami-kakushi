# Session 190 — a paused game looked like a broken button

**Date:** 2026-07-13 · **Branch:** main · **Model:** Claude Opus 4.8

## What the human reported

> "The auto button in R0 is broken." — pressing it toggled `▶ auto` → `■
> stop` → `▶ auto`, no raking, no progress bar moving. Then, minutes
> later: *"ok its working now… i refreshed and it worked lol."*

## What it actually was

The refresh is the whole diagnosis. A reload clears **shell state** —
the flags that live in JS memory and that no save carries — so the bug
was in one of the three gates on the auto loop (`autoStep`,
`src/app/main.ts`): `paused`, `crashed`, or a stranded shell **freeze**.

`crashed` draws a full-screen modal, so it was out. That leaves two, and
the human's symptom fingerprints **`paused`** almost exactly:

- pause stops the auto loop and **nothing else** — a manual rake still
  resolves, which is why the rest of the game felt fine;
- arming/disarming an auto is an *instant* intent, so the button toggled
  happily while the loop it names was switched off;
- nothing ever pressed the ActionClock, so **no bar animated** ("the
  rake spilled rice button is not moving or animating" — the human's
  words);
- and `paused` is invisible: it lives on a button inside the Settings
  modal and is announced **nowhere else in the UI**.

The root cause is **unproven** — the human couldn't recall pausing, and
the evidence died with the reload. So the fix targets the class, on both
latches a reload clears.

## What was built (`9c9a461c`, plus the `__qa` repaint)

1. **Pause is legible where it bites.** An armed auto under a paused
   game now reads `⏸ paused` (hover: *"The game is paused — resume it in
   Settings ⚙"*), wearing the same idle idiom an armed-but-illegal auto
   already wears (ADR-148) — labour rows, the R0 rake, both combat
   toggles. The Settings label is **derived** from the flag on every
   render, and every pause entry point (the button, `__qa.pause/resume`)
   repaints immediately — paused, no commit may ever come, so a
   paint-on-next-render would sit there lying.
2. **A stranded freeze can no longer be sat in.** The capture overlay
   (`` ` ``) freezes every shell timer from keypress to send; a throw
   between the freeze and the box opening left the world frozen with no
   overlay to explain it. `onPickDown` now thaws before reporting the
   failure, and **`src/app/freeze-watchdog.ts`** is the backstop: it
   asks the overlay whether it owns the freeze and takes the world back
   (loudly) if nobody does. It polls the **RAW** timers — the patched
   ones are precisely what a freeze banks, so a watchdog on those would
   freeze with the world it exists to rescue.

**Player-reach proof (PH6):** driven headlessly against the live game —
armed the R0 auto, paused: button reads `⏸ paused`, rice frozen at 10
for 8s; resumed: button reads `■ stop`, rice climbs to 12. Not just
green tests — the actual player path.

## Notes for whoever picks this up

- **If it recurs, the game now tells you which latch it was**: the
  button says `⏸ paused`, or the console shouts a stranded-freeze
  warning. It is self-diagnosing now; there is nothing to hunt blind.
- Shared-tree discipline: `render.ts` / `render.test.ts` / `dev.test.ts`
  held a co-agent's WIP alongside mine, so this commit staged **only my
  hunks** (HEAD + my hunks rebuilt into the index) and was proven green
  in an isolated checkout of the *committed* tree — a working-tree green
  would have hidden a red HEAD (their render hunks depend on core files
  they hadn't committed).

## Next intended steps

Nothing outstanding from this thread. The R0 auto grinds correctly; the
two silent latches now speak.
