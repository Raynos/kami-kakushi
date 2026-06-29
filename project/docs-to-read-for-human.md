# Docs to read — for human "read & reviewed" sign-off

> **Beyond** the pending *action items* in [`project/human-in-the-loop/`](human-in-the-loop) (the
> `H`-decisions and `R`-reviews queue), these are additional **brainstorms / audits / plans / etc.** that
> need active human **"read & reviewed"** sign-off.
>
> Tick the box when you've read it and signed off. Add new docs here as they're produced, in the same
> format: a checkbox + linked title + *type*, then **What:** / **Read for:** / optional **More:**.

---

## 🔴 Now — the pending tier reshape (locked, not yet in the PRD)

- [ ] **[`project/status/pending-prd-reshape.md`](status/pending-prd-reshape.md)** — *plan / checklist*
  - **What:** the **2026-06-28 two-tier-Estate reshape** — 8 locked decisions (**ADRs D-048…D-055**) that
    are **NOT yet applied to the PRD/docs/code**, plus the master checklist of everything that still has to
    change.
  - **Read for:** ⚠️ the PRD body is **stale on the tier model** until this is cleared — read `prd.md` with
    this open.
  - **More:** backing intent (your verbatim directive + every resolved fork) →
    [`project/feedback/2026-06-28-tier-reshape.md`](feedback/2026-06-28-tier-reshape.md); the ADRs themselves
    → [`docs/living/decisions.md` → D-048…D-055](../docs/living/decisions.md); what triggered it →
    [`project/audit/reports/state-of-the-game-2026-06-27.md`](audit/reports/state-of-the-game-2026-06-27.md)
    (the v0.1 battery audit), reconciled by the v0.2 re-audit below.

---

## 🔴 Now — 2026-06-29 decision-session plans (read & sign off)

> Produced by the 2026-06-29 decision session (source of truth:
> [`project/feedback/2026-06-29-decision-session.md`](feedback/2026-06-29-decision-session.md)).

- [ ] **[`docs/plans/2026-06-29-roadmap-reaxe-proposal.md`](../docs/plans/2026-06-29-roadmap-reaxe-proposal.md)** — *plan*
  - **What:** the **nested roadmap re-axe** — **Tier → Milestones → Fun-slices** (not a flat S0–S4). T0
    detailed (4 milestones), T1–T3 coarse; a "fun-slice" ships a *playable, fun* increment.
  - **Read for:** the proposed v1 build cut + the **6 open questions** — load-bearing = the within-T0 build
    order (proposal recommends **spine-first**); the rest (milestone count, fun-slice granularity, naming, T1
    rung count) are Claude's calls, surfaced for optional steer.

- [ ] **[`docs/plans/operating-model-v2-lite-reelback.md`](../docs/plans/operating-model-v2-lite-reelback.md)** — *plan*
  - **What:** the **drop / cut / keep** map that reels Operating Model v2 back to a lean **v2-lite** (v2 was
    judged an overengineered draft). **This replaces the original v2 implementation plan** as the H10 artifact.
  - **Read for:** the **⭐ H10** review (your separate ~1 hr pass) — which process pieces to keep (the
    `diverge`-mandatory gate, the ship-gate/manifest, feedback-checks). Inputs: the roadmap re-axe above.

- [ ] **[`docs/plans/2026-06-29-implementation-plan.md`](../docs/plans/2026-06-29-implementation-plan.md)** — *plan*
  - **What:** how the locked decisions become a build — **carry-forward + retune** the shipped T0 (keep
    M0–M2b), **spine-first**, mapped onto the roadmap re-axe.
  - **Read for:** the concrete post-ripple build sequence (optional steer; mostly agent execution).

---

## Then — read & sign off

- [ ] **[`docs/plans/operating-model-v2-implementation.md`](../docs/plans/operating-model-v2-implementation.md)** — *plan*
  - **What:** the *exactly-how* for **Operating Model v2** — the process change to make the build more
    autonomous, higher-quality, and self-correcting (less hand-holding). Real code sketches + proposed ADRs +
    exact CLAUDE.md edits, all embedded as **proposals — nothing applied**.
  - **Read for:** the **§0 forks (D-a…D-f)**, the **§8 checkbox checklist** (✅ build / ✂️ change / ❌ drop
    per line), and the **§7 ADRs (D-048…D-051) + CLAUDE.md edits**.
  - **More:** also tracked as ⭐ **H10** in
    [`project/human-in-the-loop/decisions.md`](human-in-the-loop/decisions.md) — it gates the next build phase.
  - **⚠️ SUPERSEDED 2026-06-29** — v2 was reeled back as an overengineered draft; **H10's review now targets
    the [v2-lite reel-back](../docs/plans/operating-model-v2-lite-reelback.md)** (in the "Now" section above).
    Read the reel-back, not this plan.

- [ ] **[`project/audit/reports/v0.2-changelog.md`](audit/reports/v0.2-changelog.md)** — *changelog*
  - **What:** what the **v0.2 build actually changed** — the audit-finding → fix mapping + the firsthand
    playtest verification of each.
  - **Read for:** confirming the v0.2 fixes genuinely match what the v0.1 audit asked for (the
    "claimed vs verified" trail).

---

*See also (live, but tracked elsewhere — not in this list):* the **tier-reshape** directive
([`project/feedback/2026-06-28-tier-reshape.md`](feedback/2026-06-28-tier-reshape.md)) — a locked-intent
change with open forks, in the feedback inbox; and the full **action** queue in
[`project/human-in-the-loop/`](human-in-the-loop).
