---
name: taste-scorecard
description: The two-pass taste flow (F10, D-135) — Pass 1 BEFORE building (walk taste.md's 21 principles into a constraint brief that shapes the work), Pass 2 AFTER (score what was built, per variant, against that brief). Fires on every new/restyled surface, feature, or narrative beat — from the diverge skill (§2) or standalone. Use when starting player-visible work, when filing its R-item, or when the human asks "score this against taste".
---

# Taste two-pass — brief, then scorecard

The operational form of [`docs/living/taste.md`](../../../docs/living/taste.md)
(F10, D-135; two-pass shape locked with the human 2026-07-05). taste.md is the
standard; this is how it fires — **twice** per piece of work:

- **Pass 1 · the constraint brief** (before building): the standard as a
  *design input* — what must THIS work do to honor the principles that apply?
- **Pass 2 · the scorecard** (after building): the standard as a *check* —
  did it? Scored per variant, attached to the R-item beside the brief, so the
  human reads stated intent and scored result side by side.

The **diff between the passes is the calibration signal**: a ✘ on a principle
the brief NAMED is *knew-and-missed* (execution slip — fix it); a ✘ the brief
never named is a *blind spot* (taste.md's text failed to fire — that principle
is the one to sharpen, via the D-126 human-locked amendment path).

## When it fires

- **Every diverge** — Pass 1 at §2 step 2 (before authoring ANY variant, so
  the brief constrains all of them); Pass 2 on **every variant** before the
  R-items are filed.
- **Every non-diverge feature or narrative beat** that ships player-visible
  (coverage is everything, human call 2026-07-05 — §III/IV of the standard
  are mostly story and state, not chrome).
- **Exempt:** the diverge §1 set — one-line tweaks, copy edits, token
  nudges, bug fixes.

## Pass 1 — the constraint brief (before building)

1. Walk ALL 21 principles + the 4 values. For each that **applies**, write
   ONE line: what this work must do to honor it, concretely
   (“P15: node card = flavour + who's-here; no destination preview”).
   Skip the n/a ones silently. When no principle covers a felt requirement,
   derive one from the values and mark it `V<n>`.
2. The brief **shapes the work**: in a diverge, variants differ in
   *approach* while all satisfying the brief; in a feature/beat, it's the
   taste half of the acceptance criteria.
3. **Homes:** the full walk + notes → the session **journal**; the
   compressed brief (the applicable-principle lines) → carried forward into
   the **R-item** at filing time (beside the Pass-2 scorecards).

## Pass 2 — the scorecard (after building)

1. Re-walk ALL 21 (`✔` pass / `✘` fail / `—` n/a) — the full re-walk, not
   just the briefed set, or blind spots stay blind. In a diverge, **EVERY
   variant gets its own full walk** (a variant the human might pick must not
   hide a violation).
2. **Fix before scoring.** A fixable ✘ is a fix, not a scorecard line. A ✘
   that ships anyway is a NAMED corner-cut (A19), never silent.
3. **Compress:** header `N✔ · N✘ · N—` per variant + one line per ✘ (and
   borderline ✔ worth flagging), each ✘ tagged **[briefed]** or
   **[blind spot]**.
4. **Attach to the R-item** with the Pass-1 brief above the scorecards.
   Full walks stay in the journal.

## The R-item format

```md
- **Taste brief (pass 1):** P4 append-only log · P15 no-spoil node card ·
  P17 explored-dimmed · P20 capped log width
- **Scorecard (A):** 17✔ · 1✘ · 3—
  - ✘ P17 [briefed] — explored options not dimmed; ships: needs the shared
    explored-state primitive first (tracked <where>).
- **Scorecard (B):** 16✔ · 2✘ · 3—
  - ✘ P17 [briefed] — same as A.
  - ✘ P6 [blind spot] — 390px price column overlaps the haggle button.
```

## Rung + the deferred loop (named, not silent)

- **Rung (A11):** a skill-step + mandatory R-item sections — NOT a verify
  gate (taste is judgment; a lint would cry wolf). The teeth are
  artifact-shaped: an R-item missing its brief/scorecard blocks is visibly
  incomplete. Greppable principles (P4 resets, P20 raw `vw`) graduate to a
  real gate only on a RECURRING violation.
- **Deferred — the distill pipe:** logging human-vs-scorecard mismatches as
  F-items feeding `/distill-taste`, with the prediction test re-run as a
  regression harness, is deliberately NOT built (human call 2026-07-05:
  shape B). Re-distill of taste.md is **manual only** — the human invokes
  `/distill-taste` when a corpus warrants it. Blind-spot tags accumulate in
  R-items/journals meanwhile, so the evidence is there when it fires.
