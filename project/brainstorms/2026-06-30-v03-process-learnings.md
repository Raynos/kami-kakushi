# v0.3 process learnings — what to change to build a better game

_Written 2026-06-30 after the v0.3 overnight build + battery + audits + a11y pass._
_A **proposal** — the human picks which to adopt (some become ADRs / battery
lenses / conventions). Grounded in what actually happened this cycle, not generic
advice._

## The one-line takeaway

The **builder is blind to their own gaps** — every real defect this cycle (the
over-teaching cold-open, the missing seal scrim, two false-green tests, three
WCAG-contrast failures) was found by an **independent pass** (the battery, the
adversarial re-audit, Lighthouse), not by me while building. So the leverage is
in **cheap, repeatable, independent checks** — and in catching the *taste / fun*
misses, which are the ones that don't show up as a red test.

---

## Fun & taste

**F1 · Onboarding is reveal-as-plot — teach each thing at the moment of need,
never in an upfront dump.** The clearest fun miss this cycle: the cold-open fired
5 of Genemon's lines on the first click (battery `fun` MAJOR). The fix gated the
koku-teaching to land *as the first +koku appears*. Generalise: every mechanic
should be taught at its first use, in-world, as a beat — not front-loaded.
→ _Proposal:_ add an **`onboarding` lens** to the battery (first-session
legibility: is each teach gated to its moment? any monologue dumps?) and a line
in `fun-factor.md`.

**F2 · Design the AFTER of a payoff, not just the payoff.** The BIG T0→T1
ascension *lands* — but the panel right after still says "Reach Excellent to
ascend (480/480)" (stale; R4#5). A climactic beat needs a satisfying next-state:
what do I see and do in the ten seconds after the bell? → _Proposal:_ an "…and
then what?" check on every milestone/ceremony beat — the after-state is part of
the beat.

**F3 · Aesthetic vs accessibility is a real tension — resolve it deliberately,
with tooling as the arbiter.** The woodblock vermilion/gold *failed* WCAG
contrast (Lighthouse a11y 95) and eyeballing missed it entirely. The fix wasn't
"abandon the palette" — it was deeper in-palette tones (cinnabar/bronze) that hit
AA while staying woodblock. → _Proposal:_ run a **Lighthouse a11y pass on any new
UI surface** (soft check, not a gate); treat "on-palette AND ≥4.5:1" as the design
constraint; reaffirm D-045 (a11y-ink).

---

## Engineering

**E1 · A test that can't go RED is worse than no test — and fixtures should derive
from the canonical source, not magic numbers.** Two classes of pain this cycle:
(a) false-greens the battery caught (a tautological no-stranding assertion; a
dead-value ratchet blind to the new loot currencies); (b) ~6 unit tests broke at
M2·8 because they hard-coded DEMO act-counts ("7 rakes = R1"). → _Proposal:_ a
standing **"can this go RED?"** review question on every new test, and derive
fixtures from the source of truth (`rungThreshold`, balance constants), never
from copied literals.

**E2 · An end-to-end "the whole game plays through" test + structural invariants
are the strongest playtestability guarantees — and they're cheap.** `t0-arc.test`
(real-intent cold-open → ascension), `breadth-arc.test`, and `invariants.test`
(no NaN / write-once latch / monotonic clock over the whole arc) gave more
confidence than any amount of fragment tests, run in ~30 ms, and are RED-able.
The e2e arc specifically proves the **seams between fragment tests** hold (real
combat sets the flags the ladder gates on; real labour banks deeds). → _Proposal:_
a full-arc e2e + an invariants-over-a-real-playthrough test **per tier**, from the
first milestone — not bolted on at the end.

**E3 · Never let a review-velocity shortcut become the shipped default.** The
DEMO/REAL fork shipped DEMO (seconds-fast) as the default for a long time; the
real intended pace only shipped at M2·8. A "fast" balance profile risks leaking
to players and doubles the tuning surface. The right shape (now D-056): ship the
real numbers + a **DEV-only accelerator** (the speed toggle / teleports) for
review. → Generalise the principle beyond pacing: shortcuts live behind the
DEV/`import.meta.env.DEV` boundary, never in the shipped default.

**E4 · Push ship-properties up to a gate at the moment they matter.** The DEV
cheat-API being stripped from prod was a *norm*; a one-line grep in the deploy
script (`gh-pages.sh`) made it a **gate** that can't be forgotten. Cheap, and it
can't silently rot. → Already done; the pattern (norm → hook → gate at the
boundary where it matters) is the general move (it's already CLAUDE.md canon —
this cycle was a good instance).

---

## Process & cadence

**P1 · Re-audit after a big change, on the CURRENT build — not just at
milestones.** The fidelity battery ran *before* M2·8; the build the human will
actually play changed substantially afterward, so I ran a focused 3-lens
adversarial re-audit of the diff (it came back clean — but that *confidence* is
the point). → _Proposal:_ a lightweight **"re-audit the diff"** after any
locked-ADR execution or large refactor, before calling it done.

**P2 · Be proactive flagging taste-adjacent changes for the human — never
silently change an approved aesthetic.** The a11y darkening touched the exact
vermilion/gold the human approved in the R2 diverge; I flagged it in R1 + offered
to revert. That's the right reflex. → Generalise: any change that touches an
approved design/diverge pick gets a flag + an offer to revert, even when it's
"obviously correct" (a11y).

**P3 · An autonomous loop needs a definition-of-done + an explicit
optional-backlog, or it drifts toward gold-plating.** The overnight loop produced
a great deal of real value (build → battery → M2·8 → e2e → a11y), but each tick I
had to re-derive "is there still genuinely-valuable work, or am I polishing?".
Most ticks found real value; the honest ones near the end were marginal. →
_Proposal:_ for a long autonomous run, keep a short **ranked backlog of
valuable-but-optional work** and a clear **"done = X"** line, so the loop spends
on the backlog and stops (or asks) when it's dry, rather than inventing busy-work.

**P4 · The liquid-by-default discipline (D-059) worked — keep it.** Shipping every
balance number tagged "liquid, tune by playtest" + a DEV speed toggle let the
build proceed end-to-end without prematurely locking feel. The human tunes from a
*working, playable* artifact instead of a spec argument. Keep this as the default
for anything taste-dependent.

---

## What I'd actually do next cycle (the short list)

1. **Battery gains an `onboarding` lens** (F1) and runs a **Lighthouse a11y pass**
   on new UI surfaces (F3).
2. **Every tier ships with a full-arc e2e test + an invariants test** from its
   first milestone (E2), and **fixtures derive from the source** (E1).
3. **A focused re-audit of the diff** is part of "done" for any big refactor (P1).
4. **Milestone/ceremony beats get an "after-state" check** (F2).
5. Process additions land as **ADRs / battery-registry lenses / fun-factor lines**
   so they're durable, not just this doc.
