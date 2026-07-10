<!-- Copy to journal/{YYYY-MM-DD}-session-{NN}[-{topic}].md. ONE file per session. -->

# Session 137 — 2026-07-10 — the telemetry folder garbage-collects itself

**Summary:** The human asked why `project/telemetry/` held 24 reports when they'd
barely played. Answer: a report is one *run*, not one playthrough, and nothing
ever swept them — 15 were time-tainted DEV driving, 8 were sub-2-minute page
pokes, 1 was a real session. The session brief counted all 24 every morning.
Added a retention policy at the write edge (`src/telemetry/retention.ts`), swept
the folder (24 → 3, then 4 as a live run dropped), and reworded the brief.
No ADR — this implements the FB-8 README contract's own admission test rather
than changing intent; the README's "no pruning in v1" clause is superseded
in place, with the reason recorded.

## The finding

- **24 files ≠ 24 playthroughs.** `startRun()` mints a fresh runId on every boot
  that can't resume for the seed, and on every save-import / fixture load
  (`src/telemetry/index.ts:209-250`). Total attended time across all 24 was
  **139 minutes** (Jul 6–10) — 8 of them under 2 minutes.
- **The corpus was nearly unusable.** 15 carried TIME taints (`speed>1`,
  `toRung`, `jumpToPhase2`) — excluded from vs-sim by the FB-8 honesty rule, so
  they can never inform balance. Only one run was both clean and long enough to
  characterise a rung (the 49.2-min save-imported one that produced the single
  distillation commit `3ab10c9`).
- **The brief's counter was structurally a wolf-crier.** It counted reports newer
  than the last commit whose subject starts with `balance(` — and there has been
  exactly **one such commit ever** (`32bba42`, 2026-07-05). So the count could
  only climb, forever, weighting a 20-second poke equal to a 49-minute session.
  Its own comment says "SILENT at zero — a gate that cries wolf teaches deafness."

## What changed

- `src/telemetry/retention.ts` — **new.** Pure `keepReport(text)`. Drops
  time-tainted runs (any length) and runs under `T0_PACING_BAND_MIN` attended
  minutes (read from the balance constants, never a copied literal — a run
  shorter than the fastest in-band rung cannot characterise one rung). Keeps
  ORIGIN marks (`save-import`: honest clock, unknown economy). **Fails open** —
  an unparseable header is kept, never deleted, because this module authorises
  `unlinkSync`.
- `src/telemetry/retention.test.ts` — **new.** Fixtures render *through*
  `formatRunReport`, so a format drift fails here rather than silently turning
  the GC into a no-op (or a delete-everything).
- `src/scripts/telemetry-drop.ts` — the handler now refuses an unusable report
  instead of writing it, `rmSync`s the runId's earlier file (a run can turn
  tainted mid-run — speed>1 at minute 20 — and its clean prefix must not
  survive), and sweeps the folder on every drop. New exported `sweepTelemetryDir`.
- `src/scripts/telemetry-drop.test.ts` — **new.** The tests that matter are the
  ones proving it does *not* delete: `README.md`, non-`.md` entries,
  subdirectories, unparseable text, clean runs. Plus the traversal jail.
- `vite.config.ts` — sweep at dev-server boot, **guarded by `!process.env.VITEST`**:
  vitest boots a vite server too, and the first test run swept the human's real
  sensor folder. Same class as `973b996 fix(e2e): stop the test lane polluting
  the telemetry sensor`.
- `src/telemetry/drop.ts` — the client logs `report not retained: <reason>` once
  per session (a tainted run closes a segment on every blur; once is enough).
- `src/scripts/session-brief.sh` — the line now reads "N **usable** report(s)
  (untainted, ≥1 in-band rung of attended time)". Deliberately still dumb: the
  policy has ONE home, in TS. The folder is usable-by-construction, so counting
  files *is* counting usable reports.
- `project/telemetry/README.md` — "a report is one RUN, not one playthrough" up
  top; contract item 4 ("no pruning in v1") superseded by the retention rule,
  with the 24-file story kept as the reason.

## Notes

- Threshold landed at `T0_PACING_BAND_MIN` (3 min), not the 5 min floated in
  chat: 3 is derivable from the source of truth, 5 was a guess. Consequence —
  the brief now says **4**, not the 0 predicted mid-conversation. The 3.1- and
  4.6-min clean runs clear the bar, and a live dev server dropped a fresh
  **17.2-min untainted** run during the session (`20260710-1783675960`, the
  first file to carry the real-date prefix from `caad385`).
- The localStorage ring is untouched — it still holds every run, refused or not.
  Refusing a file is refusing an *archive slot*, not losing data.

## Next intended steps

1. **The owed distillation (README diary rule), and what it must say.** The
   surviving corpus, read at exit — *nothing here is usable for the shipped
   balance*, and that conclusion is the note's whole point:

   | report | build | attended | rung-ups |
   |---|---|---|---|
   | `…1783339441` | v0.3.8 | 3.1 min | — |
   | `…1783340369` | v0.3.8 | 4.6 min | — |
   | `…1783420086` | v0.3.9 | 49.2 min | R0 in 6.2 (save-import origin) |
   | `…1783675960` | v0.4.0 | 18.6 min | none |

   Three of four predate the Phase-2 rewrite (v0.3.8/v0.3.9 vs today's v0.4.0);
   the only current-build run is the note-inflated one from Entry 2, with zero
   rung-ups. So **HD-34's re-baseline has no clean attended-vs-sim number to
   quote** — it must not be decided against the 18.6, which is mostly typing.
   Home + shape: `project/audit/reports/2026-07-07-telemetry-distill.md` (the
   only prior distillation, `3ab10c9`).
2. **Gap found, not fixed: retention filters on taint + length, never on BUILD.**
   A v0.3.8 report survives into a v0.4.0 balance conversation looking exactly as
   authoritative as a fresh one. Decide whether stale-build reports age out of
   the folder, or are merely labelled in the distillation. Deliberately left
   open — an auto-delete keyed on build is a data-loss call the human should make.
3. `/drain-inbox` — 24 bug captures from the same sitting are pending
   (cold-open ×14, r0 ×7, feedback-ui ×2, dev ×1). User-invoked skill.

---

## Entry 2 — capture mode stops the clock (human: "fix capture-mode taint")

The 18.6-min R0 run above had **zero rung-ups** — because the human spent most
of it writing the 23 captures. The FB-3 note box keeps the tab visible AND
focused, and every keystroke fires `input`, so the sessionizer credited feedback
writing as attended play. Left alone, the one clean telemetry channel would have
told HD-34's re-baseline that R0 takes 19 minutes.

**It is NOT a taint** — the design call that shaped the fix. A `capture` time
taint would have been backwards twice over: `retention.ts` (Entry 1, an hour
old) *deletes* time-tainted runs, so the sessions the human cared enough to
annotate would be the first thrown away. Instead the clock **stops**: capture
mode is a third away-axis beside hidden/blurred, the run stays untainted and in
the corpus, minus the minutes that weren't play.

### What changed

- `src/telemetry/sessionizer.ts` — new event `{kind:'capture', open}`, new state
  axis `capturing`, new `SegmentCloser` value `'capture'`. Opening the box closes
  the segment; `capturing` blocks re-open exactly as `visible`/`focused` do. The
  `note` re-engagement rule also gained a `!capturing` guard — without it, a
  note firing while the box is open lets the next keystroke back-date a segment
  across the capture span and re-credit precisely what was just excluded.
- `src/telemetry/signals.ts` — a `MutationObserver` on `document.body`'s **direct
  children** watching for `[data-kami-capture]` (the note box mounts there and is
  tagged at creation). Scoped without `subtree` on purpose: a subtree observer
  over a live idle game fires on every log line, and the shell must never affect
  the game it measures.
- `src/telemetry/signals.test.ts` — **new.** `signals.ts` had no test; the
  observer is the one piece of judgment the DOM shell owns, and one that would
  silently restore the bug if it stopped firing.
- `src/telemetry/sessionizer.test.ts` — four capture cases, incl. the note-
  re-engagement trap and the idempotent open-with-nothing-open.
- `src/telemetry/taints.ts`, `project/telemetry/README.md` — the taxonomy now
  says why capture is deliberately *not* a taint.

### Why capture.ts is untouched

A co-agent has 148 lines of uncommitted WIP in `src/ui/capture.ts` (an
inbox-unreachable dialog). Editing it would have swept their work into my
pathspec commit. The observer approach avoids the file entirely — and is the
better design regardless: `signals.ts` documents itself as "the ONLY telemetry
producer in the app", so the capture overlay stays ignorant of the instrument
measuring it.

### Verification

- Both reducer guards **red-proofed**: removing `!s.capturing` from the
  `input`/`intent` re-open and from the `note` rule fails one capture test each.
- The observer **red-proofed**: disabling `observe()` fails two signals tests.
- **Live, headless, in the real bundle** (`tmp/probe-capture-taint.mjs`): the
  `` ` `` hotkey opened the actual note box, and the run closed a segment with
  closer `capture` — `[telemetry] segment closed (capture)`. The probe's own
  0-minute run was refused a file by Entry 1's retention rule, which is the GC
  keeping QA exhaust out of the corpus, on its first day.
- Full suite 1018/1018, typecheck clean. `verify` is RED on `oxfmt` +
  `fixtures` from the balance agent's uncommitted `src/core/content/balance.ts`
  + `src/sim/*` — not this change; committed local, unpushed.
