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

---

## Addendum — independent re-pass delta (2026-06-30)

_Everything above is my own end-of-session synthesis. Per this doc's **own
thesis** ("the builder is blind to their own gaps; the leverage is independent
checks"), an independent pass over the full **83 MB session JSONL** (6 miner
agents → a convergence critic, read-only) found **23 transferable learnings this
doc missed**. The critic's verdict: "**faithful but narrow — it captures maybe
half the cycle's signal**," with four whole-category blind spots. Folded in here
so the doc is complete (raw verdicts:
`raw/2026-06-30-v03-session-learnings-delta.json`, local-only)._

### Blind spot 1 — the session was MULTI-AGENT, and the doc never says so

**A1 · Commit by EXPLICIT PATH every time + commit-on-green** — not just "avoid
`-a`/`-A`": even a careful *bare* `git commit` swept in a co-agent's staged
deletion, and a concurrent `git stash` nearly ate uncommitted work. Commit
immediately on green, never at milestone. (→ candidate pre-commit warn: flag
staged paths you didn't author.)

**A2 · Scatter-gather parallelism; a running read-only audit is a tree
write-lock** — parallelize only **disjoint NEW leaf modules** (each independently
green, wired one at a time), keep the coupled core spine single-threaded, and
don't edit source while an audit scans the tree. (→ a "multi-agent coordination"
section in working-agreements.)

### Blind spot 2 — fun is more than onboarding / payoff / contrast

**A3 · The agent's default game-feel bias is GENEROSITY** — left to defaults it
built auto-heal + autopilot + a loose economy; the human had to push for
no-auto-heal / fight-to-death / loss-stops-autopilot / tighter koku. Treat
difficulty + economy generosity as a decision to **confirm, never a safe
default** (→ fun-factor line + a battery "tension/scarcity" lens).

**A4 · Economic invariants that decide fun: buffer ≠ flywheel, high-water marks
self-inflate, breadth ≠ depth** — estate upgrades grant a satiety *buffer* not
yield (the koku flywheel isn't actually built); the seasonal judge re-judged its
own payout (self-inflation bug); map/quest/market are reveal-only chrome. (→
standing **economy-arithmetic** lens + "does each upgrade close a
work→output→more-output loop?")

**A5 · Audio/game-feel is the highest-ROI cheap fun lever for a silent build** —
and must degrade silently under headless QA or it pollutes the harness.

**A6 · Route derived feedback through the SAME pure-core fn the action uses** —
`mcCombatStats` feeds both the real fight and the forecast, so HP-carry made the
shown win-rate drop when hurt: emergent UI legibility, zero extra UI work.

### Blind spot 3 — "use independent checks" with no method, and the harness itself lies

**A7 · Retrospectives MUST read the JSONL, not the compacted window** — this
doc's first retro (from context) found "one gap"; the 83 MB transcript revealed a
recurring pattern the window hid. Unattended runs leave no frustration signal →
mine structured behaviour data (every cmd / file / error).

**A8 · Verify a visual oddity, don't dismiss it as a "harness artifact"** — the
seal "doubled text" was rationalized away repeatedly; it was a real missing-scrim
bug on the most climactic screen. (→ a forceState that SUPPRESSES one-shot events
so artifacts vs bugs are distinguishable.)

**A9 · The capture/QA harness silently lies — harden it** — guessed waits catch
mid-animation frames (derive from cadence constants); sweeps stall on content
gates + un-reset renderer state; Lighthouse on the fresh shell never checks the
breadth panels (audit DRIVEN deep state). A check that captures the wrong frame
is a lying check — it undercuts the doc's own thesis.

**A10 · Code-level a11y review and Lighthouse catch DISJOINT classes — run both**
— the eye is blind to contrast ratios; the tool is blind to whether an accessible
name is semantically right (a buy button named just "10 koku").

### Blind spot 4 — gate/ADR process beyond "push to a gate"

**A11 · "Highest rung that SOUNDLY holds it" — base-rate calibration + restraint**
— hard-block only where near-universal, loud-warn where mixed; **restraint is a
feature** (decline redundant lower-rung guards); tight exemptions (two-sided
bands); **test the false-positive PASS path**, not just the block. (The richer
form of E4.)

**A12 · The ADR log is authoritative — reconcile it against the build** — search
the ADR log before deferring a call to the human (a lock may already exist —
nearly burned a round-trip on D-056); task/milestone labels drift (a stale
"retire DEV tools" label would have deleted the playtest harness); a signed ADR
is a **claim to verify**, not proof (D-053 "does the opposite" in code). (→ a
"canon-vs-build reconciliation" lens.)

**A13 · "Most important" ≠ "safe to do alone"** — park a refactor whose OUTPUT is
numbers the human must sign off (unless a signed ADR already locked them);
autonomy bias pushes hardest toward the item that actually needs a human.

### Misc — engineering & tooling hygiene (medium / low)

- **A14 · What PROPERTY to assert (extends E1):** assert the **design levers**
  (atk/taken/wear mult), not a collapsed metric (win-rate conflates them); the
  **monotonic mechanism**, not a rounded output (15% vs 35% both round to 5).
- **A15 · Verify content-preserving transforms** with a TEXT-mode word-diff vs
  HEAD **and** assert NUL-free (a binary output gave a false-clean diff); count
  prose width by **characters**, not bytes.
- **A16 · Test hygiene:** populate serialization round-trips (they pass vacuously
  on default fixtures); re-blessing a golden baseline — partition gated vs display
  fields, confirm no gated field moved.
- **A17 · Full-arc/property tests SPEND gate-time** (an O(n²) invariant: 1 s →
  169 ms) — ration + optimize them (a counterweight to E2).
- **A18 · Calibrate the sim as an instrument + back-solve** (two measured points →
  the inverse transfer fn → hit the target in one shot, not guess-and-iterate).
- **A19 · Diverge integrity:** implement process rules by **intent** when the
  mechanism is unsafe; wire the decision-log INTO the cleanup or the audit trail
  rots; **name** a time-box corner-cut (diverge-LITE), don't ship it quietly;
  record taste heuristics in ui-design.md (continuous ink > segmented meters;
  focused diegetic view > god's-eye grid at small content scale).
- **A20 · A cross-cutting emitter** (quests/achievements) goes in a shared glue
  module both reducers import, to keep the core graph acyclic.
- **A21 · A version label is a global invariant with no feedback loop** (the
  v0.4.1→v0.3.1 catch) — derive it from one source, don't hand-type across docs.
- **A22 · Audit a forward-moving spec** with a regression/mutation-target split
  (don't flag planned-future milestones as gaps) + adversarial refutation of the
  GREEN claims too.
- **A23 · After any fix, reconcile downstream hand-off artifacts** (stale
  screenshots, review items, playbook commands) — F2's after-state idea applied
  to the hand-off, or the curated review misinforms the human.
