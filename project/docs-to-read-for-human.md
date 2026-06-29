# Docs to read — for human "read & reviewed" sign-off

> **Beyond** the pending *action items* in [`project/human-in-the-loop/`](human-in-the-loop) (the
> `H`-decisions and `R`-reviews queue), these are additional **brainstorms / audits / plans / etc.** that
> need active human **"read & reviewed"** sign-off.
>
> **Grouped by the dependency hierarchy** (not a flat priority list) — see the map below. Each entry:
> a checkbox + linked title + *type*, then **What:** / **Read for:** / optional **More:**. Tick the box when
> you've read & signed off; add new docs under the group they belong to.

---

## 🗺 The map — how these docs relate

```
①  path-to-v0.3 ───────────── THE CONDUCTOR: sequences the backlog into ADRs → ripple → build
    │                          (read this for the whole-picture; mostly agent execution + optional steer)
    │
    ├─ B → pending-prd-changes ............ ②a  the per-file edit CHECKLIST (the "what-edit-where")
    ├─ C → roadmap-reaxe-proposal ......... ②a  → becomes docs/living/roadmap.md
    └─ D → operating-model-v2-lite-reelback  ②b  ⭐ the H10 artifact (the blocking decision)
                └─ reels back: operating-model-v2-implementation  (✗ SUPERSEDED — don't read)

         ▲ everything above APPLIES ▼
③  the locked decisions (canon — context, NOT a sign-off item)
    intent → human-feedback/2026-06-28-tier-reshape · human-feedback/2026-06-29-decision-session
    ADRs   → decisions.md  D-048–D-055 (reshape)  +  D-056–D-069 (the session)
```

> **If you do one thing:** the **⭐ H10 review (②b)** — it's the one *blocking* decision.
> **For the full picture:** read the **conductor (①)** top-down. The **foundation (③)** is context, already canon.

---

## ① The conductor — the whole-backlog plan

- [ ] **[`docs/plans/2026-06-29-path-to-v0.3.md`](../docs/plans/2026-06-29-path-to-v0.3.md)** — *plan*
  - **What:** the **sequencing plan** (order-of-operations, *not* the edit detail) from the now-locked
    decisions to the next build (**v0.3**): ADRs → ripple → roadmap → op-model → build. It **orchestrates** the
    three docs in ②; the *what-edit-where* lives in the reshape tracker (②a), not here.
  - **Read for:** the big-picture map, the **3 sequencing options** (recommends Option 1 — layered &
    verify-green), and the **gates** (what's blocked on you). Mostly agent execution + optional steer;
    Workstream **A (write the ADRs) is already ✅ done**.

---

## ② The pieces it sequences — the proposals to review

> The inputs the conductor consumes (its Workstreams **B / C / D**). Grouped by what they govern.

### ②a · Game canon — the reshape ripple

- [ ] **[`project/status/pending-prd-changes.md`](status/pending-prd-changes.md)** — *tracker / checklist*
  - **What:** the **per-file edit CHECKLIST** (the *what-edit-where*) for applying **both** decision batches —
    the 2026-06-28 reshape (**D-048…D-055**) + the 2026-06-29 session (**D-056…D-069**) — into the PRD, living
    docs, and code. This is the conductor's **Workstream B**, and the *single source of truth* for the edits.
  - **Read for:** ⚠️ the **PRD body is STALE on the tier model** until this clears — read `prd.md` with this
    open. It's a tracker, not a decision doc; skim Tables A/B + the **→ ADR crosswalk** for the lay of the land.

- [ ] **[`docs/plans/2026-06-29-roadmap-reaxe-proposal.md`](../docs/plans/2026-06-29-roadmap-reaxe-proposal.md)** — *plan*
  - **What:** the **nested roadmap re-axe** — **Tier → Milestones → Fun-slices** (not a flat S0–S4). T0
    detailed (next-to-build), T1–T3 coarse; a "fun-slice" ships a *playable, fun* increment. The conductor's
    **Workstream C** → becomes `docs/living/roadmap.md`.
  - **Read for:** the proposed **v1 build cut** + the **spine-first within-T0 order**. (Its 6 original open
    questions are now **resolved** — the 2026-06-29 decisions are folded in.)

### ②b · Process change — ⭐ Operating Model (H10)

- [ ] **[`docs/plans/2026-06-29-operating-model-v2-lite-reelback.md`](../docs/plans/2026-06-29-operating-model-v2-lite-reelback.md)** — *plan*
  - **What:** the **drop / cut / keep** reel-back that trims Operating Model v2 (you judged it *"a draft and
    overengineered"*) to a lean **v2-lite** (~2–3 sessions vs ~1 week). **This is the H10 artifact** — the
    conductor's **Workstream D**.
  - **Read for:** the **⭐ H10** decision (your separate ~1 hr pass) — which process pieces to keep (the
    `diverge`-mandatory gate, the ship-gate/manifest, feedback-checks). Also tracked as ⭐ **H10** in
    [`project/human-in-the-loop/decisions.md`](human-in-the-loop/decisions.md); ⛔ it gates the next build phase.
  - **More — superseded source (don't read):**
    [`2026-06-28-operating-model-v2-implementation.md`](../docs/plans/2026-06-28-operating-model-v2-implementation.md) is the original
    v2 plan; the reel-back above is the analysis **of** it. Read the reel-back, not this.

---

## ③ The foundation — the locked decisions (context, already canon)

> **Not sign-off items** — listed so the hierarchy is complete. Everything in ① / ② *applies* these.

- The **human intent** (the *why*, verbatim):
  [`project/human-feedback/2026-06-28-tier-reshape.md`](human-feedback/2026-06-28-tier-reshape.md) (the two-tier-Estate
  reshape) · [`project/human-feedback/2026-06-29-decision-session.md`](human-feedback/2026-06-29-decision-session.md)
  (the 23-decision session).
- The **ADRs** (canon): [`docs/living/decisions.md`](../docs/living/decisions.md) — **D-048…D-055** (reshape) +
  **D-056…D-069** (the session). The `DS#N → D-0NN` crosswalk lives in the reshape tracker's Table B (②a).

---

*See also (live, but tracked elsewhere — not in this list):* the full **action** queue (`H`-decisions +
`R`-reviews) in [`project/human-in-the-loop/`](human-in-the-loop).
