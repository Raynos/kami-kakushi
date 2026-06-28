# Decisions & questions (H-items)

Open design forks and questions only the human can close. IDs `H1…Hn`, never reused.
Status: 🔲 open · ⏳ waiting on Claude prep · ✅ done. `⛔ blocks <task>` marks a blocker.

Resolved decisions graduate into the ADR log: [`../docs/living/decisions.md`](../../docs/living/decisions.md).

---

<!-- Format:
### H1 🔲 — {short title}
- **Question / fork:** {what needs deciding}
- **Options:** {A / B / C}
- **Recommendation:** {your best inference}
- **Resolution:** {filled in when the human answers}
-->

> Seeded 2026-06-27 from the state-of-the-game battery audit
> ([`../audit/reports/state-of-the-game-2026-06-27.md`](../audit/reports/state-of-the-game-2026-06-27.md) §5).

### H1 🔲 — Make the signed ≥30-min/rung pacing floor visible before M6
- **Question / fork:** The signed ≥30-min-per-rung floor is both demo-tuned-away (rungs clear in 7/15/24/40 acts = minutes) AND uninstrumented (no pacing tool exists). Re-tune ≥1 rung to the real floor + back-fill a time-per-rung report now, or leave the central fun bet unmeasurable until M6?
- **Options:** A: ship a flag-gated REAL-balance profile for ≥1 rung + a cheap headless time-per-rung report now / B: defer all pacing to M6 as currently planned.
- **Recommendation:** A — keep the fast DEMO profile for review velocity, but don't let M6 be the first time pacing is ever measured.
- **Resolution:** _open_

### H2 🔲 — Which encounter carries the "humbling but winnable" (20–35%) first fight
- **Question / fork:** No *played* encounter delivers the signed 20–35% feel (scripted wolf = 100% survival, monkey ≈ 98%, grindable wolf ≈ 2%); the criterion is satisfied only by an analytic number that maps to no winnable fight and is asserted by no test.
- **Options:** A: keep the scripted wolf as narrative + make the first OPTIONAL grindable foe a real ~30–40% sampled fight + add a test / B: redefine the criterion.
- **Recommendation:** A — and fix the `balance.ts` / `combat.ts` comments that overclaim compliance.
- **Resolution:** _open_

### H3 🔲 — Tease the macro layer + signpost the demo end now, or wait for M3b
- **Question / fork:** Expose a locked/greyed four-pillar House Influence teaser (+ a "demo ends here" beat at terminal R3) now, or stay a pure T0 slice with no visible horizon until M3b?
- **Options:** A: add the locked teaser + terminal beat now (cheap) / B: wait for real M3b content.
- **Recommendation:** A — it fixes the biggest perceived-depth gap and the worst-cadence gap (the player currently hits an unmarked wall where the freshest system unlocks) without building M3b.
- **Resolution:** _open_

### H4 🔲 — Milestone-integrity rule (ban "SHIPPED (slice)")
- **Question / fork:** Accept "SHIPPED (slice)" as a milestone status, or require 100%-of-DoD-or-ADR-amended-first — given M1 shipped with its claimed pacing/fun instrumentation absent and M2b folded its loot→craft loop into a grant?
- **Options:** A: all-or-amended + a CI manifest check that DoD-named instruments actually exist / B: keep partial-DoD shipping with footnotes.
- **Recommendation:** A — the engineering gates are already strict; extend the same rigor to feature-completeness claims so the ledger stays trustworthy into T1/T2.
- **Resolution:** _open_

### H5 🔲 — Seed-breadth scope: NPC dialogue, walkable areas, gifted-vs-found weapons
- **Question / fork:** Are "speak to the members of the estate" (interactive NPC dialogue) and walkable "areas to explore" in v1 scope or deliberately collapsed? And is the 2nd weapon a story GIFT (current) or found/crafted (per `weapons.ts` "never gifted as power")?
- **Options:** A: add a minimal lore-talk verb + group activities by room now; treat the axe-gift as a temporary M2b stand-in → found/crafted at M3/M5 / B: formally collapse the seed promises via ADR.
- **Recommendation:** A — small effort, honors the seed, and record each as an ADR so they are choices not silent omissions.
- **Resolution:** _open_

### H6 🔲 — Active-only vs the genre's "leave it running overnight" bar
- **Question / fork:** Active-only / no-offline is locked (FU23) and honored, but caps the idle fantasy the cited inspirations lean on. Keep it, or add a lightweight capped on-return catch-up?
- **Options:** A: keep active-only as canon / B: add a small capped while-away tick so returning feels rewarding without true offline simulation.
- **Recommendation:** B-lite — keep active-only canon but consider a capped on-return catch-up; revisit after the reinvestment loop + macro layer land (they matter more first).
- **Resolution:** _open_

> Seeded 2026-06-28 from the 3-day process retro (journals + commits + feedback). These are **process**
> improvements (like H4), parked for the human to greenlight before I build them.

### H7 🔲 — `ship-gate` skill + DoD manifest (the build-side of H4)
- **Question / fork:** Build a pre-ship gate — a CI-checkable manifest where a milestone can't be marked SHIPPED unless its DoD-named tests/instruments provably exist? Evidence: M1 shipped with its claimed pacing/fun instrumentation absent, M2b folded loot→craft into a grant, the audit found a false-green test suite (Laziness scored 4/10 entirely on this). This is the build-side companion to **H4** (the *policy*).
- **Options:** A: build the skill + manifest now / B: keep H4 as policy-only, gate manually.
- **Recommendation:** A — smallest, highest-confidence of the three; stops a trust-eroding recurrence you already flagged.
- **Resolution:** _open_

### H8 🔲 — Split the 7k-line PRD into per-section files
- **Question / fork:** Break `docs/living/prd.md` into `docs/living/prd/§1…§7.md` + a tiny completeness check? Evidence: the V2 rewrite truncated **three times in one day** (`6332c1c` failed → `0c042fd` NOT-READY → `0e94881` restore-truncated §4.7-§4.9), and the overnight build had to hand-serialize §-scoped edits to dodge the single-file size. Removes the whole truncation failure class + unblocks parallel doc edits.
- **Options:** A: split now / B: keep monolithic, keep serializing edits around it.
- **Recommendation:** A — but it touches a frozen-intent doc, so it's your call (mechanical split, no content change).
- **Resolution:** _open_

### H9 🔲 — `resolve-queue` skill (battery → resolve → ship spine)
- **Question / fork:** Build a skill that drives a decision backlog (battery Q-items / these H-items) through `AskUserQuestion` in priority order, then auto-applies + writes the ADR? Evidence: the PRD V2 decision loop was ~15 manual commits (Q1–Q56 → P0/P1/P2 batches → Block L/M/N); every battery now *generates* such a queue by design, so this stage recurs each cycle.
- **Options:** A: build it (completes the battery→resolve→ship-gate spine) / B: keep resolving queues by hand.
- **Recommendation:** A, but after H7 — it's the natural downstream companion to the battery skill.
- **Resolution:** _open_

---

### ⭐ H10 🔲 — **REVIEW + DECIDE: Operating Model v2** (⛔ blocks the v2 adoption + the next build phase) — IMPORTANT
- **Question / fork:** Review the full implementation plan and decide whether (and how) to adopt **Operating Model v2** — the high-level process change to make game-building **autonomous, higher-quality, and self-correcting** (less babysitting). This **supersedes/absorbs H4 (ban SHIPPED-slice) + H7–H9** and re-axes the roadmap (M3–M7 → fun-slices S0–S4), so it gates the next build phase (S2 = the macro engine).
- **The artifact to review:** [`docs/plans/operating-model-v2-implementation.md`](../../docs/plans/operating-model-v2-implementation.md) — the *exactly-how* (real code/text/ADRs embedded as proposals, nothing applied). The *why* is [`project/brainstorms/2026-06-28-operating-model-v2.md`](../brainstorms/2026-06-28-operating-model-v2.md).
- **What's needed from you:** (1) the **§0 forks D-a…D-f** (pre-commit cost, roadmap re-axe, ban-SHIPPED-slice, playcheck-in-verify, divergence scope, slice boundaries); (2) mark up the **§8 review checklist** (✅ build / ✂️ change / ❌ drop per line); (3) sign off the **§7 ADRs (D-048…D-051) + CLAUDE.md edits**.
- **Constraint (human-set):** do **NOT** build/commit ADRs, CLAUDE.md, or new skills until this is signed off. The plan is review-only.
- **Recommendation:** adopt — keystone first (#0 hook → #1 `playcheck`). It directly answers the "amount of hand-holding is huge" problem; the harness cost (~1 wk) is what the babysitting has been costing.
- **Resolution:** _open_
