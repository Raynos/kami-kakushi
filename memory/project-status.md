---
name: project-status
description: Live one-screen snapshot — current state + how to resume
metadata:
  type: project
---

# Project status

> Keep this to one screen. Update it at the end of each session so a cold pickup is instant.

- **Game:** a grounded, story-driven **incremental RPG** in mid-Edo (~18th c., fictional) rural Japan.
  A mediocre ~18yo (true name **Tahei**) wakes amnesiac on a declining lower-samurai (*goshi*) estate;
  the village believes he's their spirited-away child "**Tama**" returned, the truth is wholly human. You
  rise through the **Kurosawa** house's ranks across **5 tiers** (Estate→Village→Region→Castle-town→Edo),
  growing **House Influence** (4 pillars: 武威 Arms / 官威 Standing & Office / 家産 Estate & Wealth / 家格
  Name & Honour → 家威). Signature: **the UI itself unlocks incrementally**. No magic; growth only through
  perseverance; no reset. (Spec: `docs/prd.md`.)
- **Phase:** **PRD COMPLETE & internally verified — effectively FROZEN** (pending the human's final word).
  §1–§7 authored, reviewed section-by-section, and passed a holistic consistency sweep. **No game code or
  toolchain yet** (building is the next phase).
- **Key docs:** `docs/prd.md` (the ~4820-line vision spec) · `docs/prd_human_feedback.md` (all human
  steering + QA answers, the audit lens) · `docs/fun-factor.md` (the what/why of fun) · `docs/ui-design.md`
  (the woodblock/ink UI design-language bible) · `docs/plans/qa-playtesting.md` (the QA/playtest harness +
  loops) · `brainstorms/2026-06-25-locked-decisions.md` (the canon).
- **Decisions locked:** ADRs **D-001…D-017** in `docs/history/decisions.md` (grounded/no-magic; estate-rise
  spine + tiers; 3-reputation model [estate 5-tier spine gates tiers; village & origin = one-tier optional
  side-tracks]; 4-pillar Influence; combat-earns-Arms; tech [Vite+TS+Vitest, pure-core, IndexedDB,
  splitmix64, active-only]; per-tier antagonists; no management sim; balance locks [v1≈28.5h, ≥30-min/rung,
  70/30 accrual, no respec]; §7 execution plan M0–M7). **Pending ADRs:** D-018 (UI design language),
  D-019 (fun-factor process), D-020 (docs-explosion).
- **How to resume:**
  1. Read the newest [`../journal/`](../journal/) entry (`2026-06-25-session-02.md`) — RESUME-HERE at top.
  2. The PRD (`../docs/prd.md`) is the spec; `../docs/prd_human_feedback.md` §A–K is the human-intent lens.
  3. Next phase (post-freeze): **explode `prd.md` into per-concern living docs + generate-don't-duplicate**;
     record ADRs **D-018/D-019/D-020**; then **scaffold the toolchain & build M0** (per §7.2 / D-017).
- **Next decision from the human:** the final "PRD is frozen, start building" go-ahead → then M0 (toolchain
  + cold open + save spine) begins. `npm run verify` command: {{not created yet — lands in M0}}.
