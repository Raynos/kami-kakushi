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
- **Phase:** **VISION-LOCKED — build M0+M1 against the current `docs/prd.md`, playtest, THEN explode.**
  §1–§7 authored, reviewed section-by-section, and passed a holistic consistency sweep; **no game code or
  toolchain yet** (building M0+M1 is the next phase). *Refines the prior framing — "PRD COMPLETE &
  internally verified — effectively FROZEN (pending the human's final word)": per **D-021** + the battery
  review (§P · PD-1, `brainstorms/2026-06-26-prd-battery-review.md`), "freeze" is scoped to **locked
  intent** (§1 vision + the hard human constraints + the signed acceptance targets — which showed zero
  intent-drift across the adversarial audit), NOT the whole PRD; the §4 balance numbers and §7 M2–M7
  milestone detail stay **provisional** and re-plan after each playtest. Sign-off legitimately comes AFTER
  the first build-and-play cycle, so the docs do NOT explode yet.*
- **Battery review (2026-06-26): COMPLETE — 4 rounds, SATURATED.** ~52 multi-agent lenses · 162 confirmed
  findings · **42 fixes applied directly** (clerical + the impossible-gate & double-gated-climax defects;
  re-verified in round 4, 1 self-regression caught & fixed) · **56 decisions queued + PD-1 (approved →
  ADR D-021)**. The doc-level audit has saturated; remaining signal is **build-gated** (perf, real balance,
  itch storage survival) → only resolved by building. **Start here:** the consolidated, prioritized
  **[MASTER decision sheet](../brainstorms/2026-06-26-prd-decisions-master.md)** — its §1 lists the small
  *build-gating* subset (M0 save-spine Q44-46/43; M1 satietyMax Q47; foundational level/rung/stamina/economy
  Q1/Q30/Q31/Q7/Q29) you answer to begin; the rest ride the build per D-021.
- **Key docs:** `docs/prd.md` (the ~4820-line vision spec) · `docs/prd_human_feedback.md` (all human
  steering + QA answers, the audit lens) · `docs/fun-factor.md` (the what/why of fun) · `docs/ui-design.md`
  (the woodblock/ink UI design-language bible) · `docs/plans/qa-playtesting.md` (the QA/playtest harness +
  loops) · `brainstorms/2026-06-25-locked-decisions.md` (the canon).
- **Decisions locked:** ADRs **D-001…D-021** in `docs/history/decisions.md` (grounded/no-magic; estate-rise
  spine + tiers; 3-reputation model [estate 5-tier spine gates tiers; village & origin = one-tier optional
  side-tracks]; 4-pillar Influence; combat-earns-Arms; tech [Vite+TS+Vitest, pure-core, IndexedDB,
  splitmix64, active-only]; per-tier antagonists; no management sim; balance locks [v1≈28.5h, ≥30-min/rung,
  70/30 accrual, no respec]; §7 execution plan M0–M7; **D-018** UI design language [woodblock/ink, strong CSS,
  no asset pipeline]; **D-019** fun-as-priority + the QA/playtest discipline; **D-020** post-freeze
  docs-explosion; **D-021** refines D-020 [scope "freeze" to vision-only & don't explode until AFTER the
  M0/M1 playtest — §7 roadmap → living `docs/roadmap.md`, §4 balance → generated `docs/content/`; never
  freeze M2–M7 as locked canon]). All recorded.
- **How to resume:**
  1. Read the newest [`../journal/`](../journal/) entry (`2026-06-25-session-02.md`) — RESUME-HERE at top.
  2. The PRD (`../docs/prd.md`) is the spec; `../docs/prd_human_feedback.md` §A–K is the human-intent lens.
  3. Next phase: **scaffold the toolchain & build M0+M1 against the current `prd.md`** (per §7.2 / D-017) —
     do NOT explode the docs yet. **THEN, after the first M0/M1 build-and-play cycle:** explode `prd.md`
     per **D-021** — freeze ONLY §1 + the locked constraints as a tagged vision snapshot, move the §7
     roadmap to a living `docs/roadmap.md` ("M0–M1 committed; M2–M7 provisional, re-planned after each
     playtest"), and generate the §4 balance numbers into `docs/content/` tables (generate-don't-duplicate).
     (Supersedes D-020's "explode before building" sequencing — sign-off comes after play, not before.)
- **Next decision from the human:** none blocking — vision is locked, so **build M0+M1** (toolchain + cold
  open + save spine) against the current `prd.md` starts now. (Supersedes the prior expectation — "the
  final 'PRD is frozen, start building' go-ahead → then M0": per **D-021** the whole-PRD freeze + explode do
  NOT precede the build; the full sign-off and the docs-explosion it gates come AFTER the first M0/M1
  build-and-play cycle.) `npm run verify` command: {{not created yet — lands in M0}}.
