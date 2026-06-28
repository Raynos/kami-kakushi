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

## Then — read & sign off

- [ ] **[`docs/plans/operating-model-v2-implementation.md`](../docs/plans/operating-model-v2-implementation.md)** — *plan*
  - **What:** the *exactly-how* for **Operating Model v2** — the process change to make the build more
    autonomous, higher-quality, and self-correcting (less hand-holding). Real code sketches + proposed ADRs +
    exact CLAUDE.md edits, all embedded as **proposals — nothing applied**.
  - **Read for:** the **§0 forks (D-a…D-f)**, the **§8 checkbox checklist** (✅ build / ✂️ change / ❌ drop
    per line), and the **§7 ADRs (D-048…D-051) + CLAUDE.md edits**.
  - **More:** also tracked as ⭐ **H10** in
    [`project/human-in-the-loop/decisions.md`](human-in-the-loop/decisions.md) — it gates the next build phase.

- [ ] **[`project/audit/reports/state-of-the-game-v0.2-2026-06-28.md`](audit/reports/state-of-the-game-v0.2-2026-06-28.md)** — *audit*
  - **What:** the standalone **v0.2 battery audit** — 12 lenses + a convergence critic, firsthand-grounded,
    de-duplicated against the v0.1 report (so it reads short; §3 is a carryover index back to v0.1).
  - **Read for:** where the game **actually stands** (the battery-reconciled scorecard), and the verdict that
    the **next milestone is the macro engine** — including the de-risking spike shape in **§7**.

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
