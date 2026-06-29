# Session 04 — 2026-06-29 — v0.2-audit decision pass + forward decisions (op-model reel-back, nested roadmap re-axe)

**Summary:** A human-driven decision session **closed the v0.2 state-of-the-game audit 100%** — **23
decisions across 7 question-batches** (this session + the earlier reshape D-048…D-055). The session also
**reeled Operating Model v2 back** to a lean "v2-lite", **re-axed the roadmap** into a nested
Tier→Milestones→Fun-slices structure, and locked a **durable-by-default** process norm. The decisions are
**LOCKED** but the ADRs (**D-056+**) and the PRD/doc/code application are **PENDING** — they ripple in **ONE
batch**, gated on the human's extra PRD feedback. This entry records the session + the closing repo-sync
housekeeping. **Detailed record (source of truth):**
[`../human-feedback/2026-06-29-decision-session.md`](../human-feedback/2026-06-29-decision-session.md).

This file is HISTORY, not live state — the live snapshot is
[`../status/project-status.md`](../status/project-status.md).

---

## 1 · The v0.2-audit decision pass (23 decisions, 7 batches)

A verification workflow had already confirmed the tier reshape (D-048…D-055) closed almost every v0.2-audit
item; this session resolved the genuine residuals + gathered forward direction. Highlights (full list +
rationale in the ledger):

- **Pacing (H1):** ship the **real D-049 pacing** as default (T0 ~10–15 min/rung, floor-exempt; T1 ≥30
  min/rung) + a **DEV-only 2×/4×/8× speed toggle** (a time multiplier, *not* a Demo/Real fork). Supersedes
  D-047's DEMO-default.
- **First fight (H2):** KEEP the signed **20–35% single-fight win-rate** band — HP-carry (D-050) affects the
  *grind*, not the discrete first-fight moment.
- **PRD split (H8):** split `prd.md` into per-section files (`prd/§1…§7.md`) + a completeness check, **as part
  of** the batched ripple (mechanical, zero content change).
- **Win-rate (amends signed D-043):** bless the **analytic-for-gate / sampled-for-display (n=400)** split;
  displayed == tested == same-for-every-player. To be recorded as an ADR explicitly amending the signed lock.
- **PRD freeze (refines D-020/D-021/D-046):** do **NOT** freeze §1 now — keep the PRD liquid through T0/T1/T2;
  likely **never freeze until v1 is fully built + play-tested**, then convert the whole PRD into living docs.
- **Taste/direction:** Japanese SFX palette (taiko/shamisen/koto/shakuhachi/temple-bell); **humbling
  throughout** (T0 quick but not easy); the **first T0→T1 ascension is a big ceremonial beat**.
- **Build/scope:** **spine-first** within T0 (close the four-pillar loop on thin content before showcase
  breadth); **carry-forward + retune** the shipped T0 (keep M0–M2b, layer the reshape on top — human reversed
  an initial "rebuild fresh"); **linear** koku flywheel now / **branch** at T1; **save-wipe** on the schema
  bump; speed-toggle + jump-to-rung/tier dev tools.
- **Onboarding (audit 5.5):** **diegetic mentor** (in-world character teaches each system via dialogue) +
  fixes within **non-hand-holding** (D-015 upheld); T0 areas = a **small walkable map** (D-012).

The audit report is banner-marked triaged; every human-facing fork is resolved (this session + D-048…D-055).
Remaining work is agent execution that flows into the roadmap re-axe.

## 2 · Operating Model v2 → v2-lite reel-back

H10's full Operating-Model-v2 plan was judged an **overengineered draft**. The session **reeled it back**: a
**drop / cut / keep** map ([`../../docs/plans/operating-model-v2-lite-reelback.md`](../../docs/plans/operating-model-v2-lite-reelback.md))
is now the artifact for H10's **separate ~1 hr human review** (replaces the original implementation plan). The
**`diverge` skill is a MANDATORY gate** (no new UI surface ships without a 2–3-variant contact sheet). H7 + H9
are **absorbed by H10** — decided there. Op-model artifacts (ADRs/CLAUDE.md/skills) stay **unbuilt until
signed off**. Cross-cutting tangle noted: the v2 plan's proposed D-048–D-051 numbering is stale (the reshape
consumed D-048–D-055; D-054 already shipped H10's H4 component).

## 3 · Nested roadmap re-axe

The roadmap is re-axed — **not** a flat S0–S4, but a **two-level, per-tier** structure: each v1 tier (T0/T1/
T2/T3) → **N milestones** → **N fun-slices** (Tier → Milestones → Fun-slices). A fun-slice ships a *playable,
fun* increment, not just a feature. Proposal: [`../../docs/plans/2026-06-29-roadmap-reaxe-proposal.md`](../../docs/plans/2026-06-29-roadmap-reaxe-proposal.md)
(T0 detailed = 4 milestones; T1–T3 coarse; 6 open questions, load-bearing = within-T0 build order →
recommends spine-first). Sequencing plan: [`../../docs/plans/2026-06-29-path-to-v0.3.md`](../../docs/plans/2026-06-29-path-to-v0.3.md) *(later renamed from `2026-06-29-implementation-plan.md`)*.

## 4 · Durable-by-default process norm

Locked: **a plan/brainstorm/analysis is a FILE before it's a deliverable** — never only in chat/ledger. Homes:
`project/brainstorms/` (discovery), `docs/plans/` (plans/reel-backs), `docs/` (settled). Driven by the
v2-lite-only-in-context miss. **Already applied to `CLAUDE.md` earlier this session** (the "Durable by default"
+ the `docs/plans/` layout bullets — it's live, not pending).

## 5 · Repo-sync housekeeping (this closing step)

Synced the live state to the decisions above (touch-only-four-files scope).

## What changed

- `project/human-in-the-loop/decisions.md` — marked **H1, H2, H3, H4, H5, H6, H8 ✅** with one-line
  Resolutions + pointers (H4→D-054, H5→D-052, H6→D-053; H1/H2/H3/H8 → this session + D-056+); **H7, H9** noted
  **absorbed by H10**; **H10 kept 🔲 OPEN** with a note repointing its review at the v2-lite reel-back.
- `project/status/project-status.md` — added the 2026-06-29 phase bullet (v0.2 audit 100% triaged, decisions
  LOCKED, ripple PENDING), revised the ⭐-TOP-PRIORITY bullet to the v2-lite reel-back, and rewrote the
  "how to resume" steps (next = op-model review → batched ripple gated on PRD feedback → spine-first
  carry-forward build).
- `project/docs-to-read-for-human.md` — ticked/closed the **v0.2 audit** (✅ triaged); added the **three new
  `docs/plans/` docs** (roadmap re-axe, v2-lite reel-back, implementation plan) for sign-off; flagged the
  original v2 implementation plan **⚠️ SUPERSEDED**.
- `project/journal/2026-06-29-session-04-decision-session.md` — this entry.

*(Session artifacts produced earlier in the session, outside this housekeeping pass:*
`project/human-feedback/2026-06-29-decision-session.md` *(the ledger),* `docs/plans/2026-06-29-roadmap-reaxe-proposal.md`*,*
`docs/plans/operating-model-v2-lite-reelback.md`*,* `docs/plans/2026-06-29-path-to-v0.3.md`*.)*

## Next intended steps

1. **Human:** the separate ~1 hr **op-model v2 review** over the v2-lite reel-back (⭐ H10) + provide the
   **extra PRD feedback** still in flight, and the **R1** quick play for direction signal.
2. **Then (one batch):** write ADRs **D-056+**, split `prd.md` into per-section files, apply the reshape
   (D-048…D-055) + this session's decisions to the PRD body, ripple docs + code (incl. the durable-by-default
   CLAUDE.md amendment + the milestone-integrity/working-agreements edits).
3. **Then the build:** carry-forward + retune the shipped T0, **spine-first**, per the roadmap re-axe +
   implementation plan.

## Landmines

- **The ADRs D-056+ do NOT exist yet.** `docs/living/decisions.md` still ends at **D-055**. Every "D-056+"
  pointer in `decisions.md` / `project-status.md` / this journal is **forward-looking** — the ADR bodies land
  in the batched ripple. The **decision-session ledger is the authoritative record** until then.
- **Nothing applied to the PRD/code yet.** The PRD body is still **stale on tiers** and on this session's
  decisions. Do the ripple as **ONE batch** (human steer), **gated on the human's extra PRD feedback** — not
  piecemeal.
- **CLAUDE.md not touched in *this* housekeeping pass** (four-file scope) — but note the **durable-by-default**
  norm (#21) was **already applied to CLAUDE.md earlier this session** and is live. Op-model artifacts
  (ADRs/skills + any *further* CLAUDE.md edits) remain gated on H10 (#11).
- **H7/H9 still surface via H10.** They're absorbed, not independently closed; H10 remains the open gate.
- **v2 numbering is stale.** The old v2 implementation plan proposes D-048–D-051, already consumed by the
  reshape — re-sync or drop when reeling it back.
