# Session 193 — CI answered, and nobody listened

**Date:** 2026-07-13
**Focus:** HD-45 — the e2e lane went red on `main` and nobody saw it.

## What the human asked

`HD-45 ask`. I put the fork to her and she signed **(b): read the
lane's CI result at session start.**

## The hole

The Playwright lane is CI-only by budget (ADR-072, refined by ADR-176):
a real browser suite is orders of magnitude past `verify`'s 5s soft / 8s
hard commit gate, so it cannot be a local gate. That leaves a structural
gap — a green `verify`, a green commit hook and a green push hook all
coexist with a **red e2e lane**.

It is not hypothetical. The lane went red at `a4863592` (ADR-184's
zone-reveal VNs correctly hid the shell; the R3 journey walked straight
into them), sat at 3 failed / 88 passed through **two unread CI runs**,
and was found in session-191 only because an *advisory* push-time
blast-radius warning happened to nag about `styles.css` and an agent
happened to read it. The bug was fixed in `8f746f54`. The hole was not.

## The ruling, and why it is the honest rung

Signed **(b)**. The rejected **(a)** — block the push when the blast
radius is hit — would run the lane (~60s) on any push touching
e2e-covered surface and refuse a red. Sound, but it buys ~an hour of
earlier notice at the price of a minute on **every** UI push, and CI
runs the suite 60s later anyway.

The reason (b) is right is that **the red never escaped — CI's answer
was simply never read.** The signal existed, twice, loudly. A gate that
re-detects what CI already knew is not the missing rung; a *reader* is.
The acknowledged cost of (b) is that it catches the red **after** it
lands — but within one turn of the next session, instead of never.

## What I built

`src/scripts/session-brief.sh` now probes **both** `verify.yml` and
`e2e.yml`. A `completed/failure` on the e2e lane prints as a 🚨 line in
the brief that says the quiet part out loud — *nothing local sees this*
— and names the reproduce command (`pnpm run test:e2e`).

- The two probes run **concurrently** (each time-boxed by perl's
  `alarm`+`exec`; macOS has no `timeout`), so the second lane costs no
  extra wall-clock: the brief still runs in **~1.7s**, inside its ≤5s
  budget.
- **Proven RED, not assumed** (PH3): a stubbed `gh` reporting
  `completed/failure` on `e2e.yml` makes the real script print the 🚨
  line; with `gh` absent entirely the brief degrades to *(status
  unavailable)* rather than dying.
- Fixed a pre-existing quirk in the same probe: a running lane read as a
  bare `in_progress/` because an in-flight run's `conclusion` is `""`,
  not `null`, so jq's `//` fallback never fired. It now reads
  `in_progress/—`.

## Canon

**ADR-189** (docs/living/decisions.md). Note the number: I first wrote
this as ADR-188 and a co-agent landed *their* ADR-188 (HD-42, reviewer
redlines) in the same file while I was writing — already referenced from
AGENTS.md, so mine renumbered to 189 and moved below theirs. HD-45 is
out of the live queue and archived with its resolution.

## Next intended steps

None owed by this thread; the ruling is fully built. If the
after-the-fact window ever proves too wide, (a) stays available as the
belt to (b)'s braces — ADR-189 records the option.
