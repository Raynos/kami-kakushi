---
name: diverge
description: Generate FULL 2–3 genuinely-distinct, WORKING visual/design variants of a UI surface, wire each into the live DEV-panel toggle, self-review each against ui-design.md, self-pick a prod default, and file EACH variant as its own line item in human-in-the-loop/review.md for the human to review live and override. ADR-075 (refines ADR-073) — variants live IN the codebase behind a DEV-only toggle (stripped from prod), NOT on branches / as screenshots; NO "diverge-LITE" single-idea shortcut and NO buggy variants. MANDATORY for any new or majorly-restyled UI surface (one-line tweaks exempt). Use when building or restyling a meaningful UI surface, or when the human says "show me variants / options".
---

# Diverge

> **THE MODEL — ADR-075 v2 (refines ADR-073).** Two rules:
> 1. **FULL 2–3 working variants, always.** No "diverge-LITE" single-idea shortcut; no shipping a buggy variant —
>    every variant must actually work so the human can compare them fairly.
> 2. **Variants live IN the codebase, switched live via the DEV panel** (DEV-only, `import.meta.env.DEV`, stripped
>    from prod by the `gh-pages.sh` grep guard) — **NOT** on a `diverge/<surface>` branch, **NOT** as headless
>    screenshots. The human reviews by **toggling each in the running UI**. **Each variant gets its own line item
>    in [`human-in-the-loop/review.md`](../../../project/human-in-the-loop/review.md).** The agent self-picks a
>    coherent **prod default** (the surface's inline render, which ships); the toggle keeps the alternates until
>    the human confirms → **zero PROD flag-debt**.
>
> The retired branch/`?variant=`/contact-sheet/GC model (never built; the DEV-panel model replaced it) is
> archived VERBATIM at
> [`project/archive/2026-07-05-diverge-v1-branch-model.md`](../../../project/archive/2026-07-05-diverge-v1-branch-model.md)
> — read it only for the design *rationale* behind the caps + the anti-slop discipline, never for mechanics.

Because the **pure core** makes every variant a *render-only diff*, variants are cheap render-branches in the
UI layer only — `src/core/**` never branches on variant. Prod ships only the self-picked default, verified the
same way the DEV `__qa` API is (the `import.meta.env.DEV` gate + the `gh-pages.sh` deploy-time grep) — so the
shipped bundle carries ZERO variant flag-debt, while DEV gives the human live A/B/C in the running UI.

Durable `?variant=` flags **in `main`** are the **single exception** (`keep-flags`), for when the human wants
a *persistent* live test against evolving `main` — **hard-capped at 2 repo-wide**.

**Diverge integrity (AC-19) — keep the process honest:**
- **Implement the rule by INTENT when the mechanism is unsafe.** If a process step's *mechanism* is risky in
  this repo (e.g. branch/stash churn on a shared tree), satisfy the rule's *intent* by a safe means — never
  skip the rule because its canonical mechanism doesn't fit.
- **Wire the decision-log INTO the cleanup, or the audit trail rots.** When a variant is retired, record
  *why* in its DECISION sheet **as part of removing it** — not as a separate step that gets forgotten.
- **NAME a time-box corner-cut; never ship one quietly.** If real constraints force a reduced pass, label it
  explicitly so it's a visible, revertable debt — a silent corner-cut reads as "done."
- **Redlines land on DISK first (ADR-188).** When a reviewer / blind reader hands back a findings list, write
  it to a checklist file (`tmp/` or the bundle dir) BEFORE applying any fix, and tick each as it lands — a
  list held only in context is how 2 of 12 fixes silently vanish behind a green verify (PH3).

## §1 · Entry gate — mandatory vs exempt

**Fires for:** any **new UI surface** or **major restyle** (a layout / hierarchy / density / motion change).
**Exempt:** one-line tweaks, copy edits, token-value nudges, bug fixes. **If unsure → exempt** (diverge is for
*approaches*, not polish).

**Precondition:** the change must be expressible **render-only against existing pure-core props**. If a
candidate approach needs a core / state / RNG change, it is **not a variant** — route it through normal
planning.

## §2 · The procedure (autonomous, never blocks — CLAUDE.md autonomy + ADR-071)

The infra is **already built**: the `SURFACES` registry in
[`src/ui/dev-surfaces.ts`](../../../src/ui/dev-surfaces.ts), `renderVariant` in
[`src/ui/dev.ts`](../../../src/ui/dev.ts) (delegating to `renderSurfaceVariant` in
`src/ui/dev/variant-renderers.ts`), the fixed DEV panel with a live per-surface toggle, and the
`gh-pages.sh` strip-guard that greps the prod bundle for `DEV_SENTINEL`. To diverge a surface:

1. **Gate (§1).** Confirm the surface is new / a major restyle and the change is render-only against existing
   pure-core props. One-liners are exempt.
2. **Taste constraint brief — Pass 1 of the [`taste-scorecard`](../taste-scorecard/SKILL.md) skill (FB-10, ADR-135).**
   BEFORE authoring any variant: walk taste.md's 21 principles, write one concrete line per applicable principle
   (what THIS surface must do to honor it). The brief constrains ALL variants — they diverge in approach, not in
   whether they meet the bar. Full walk → journal; the compressed brief is carried into the HR-item at step 10.
3. **Author the default (A) INLINE in the surface's renderer** (its `src/ui/render/<surface>.ts` module) as the
   normal render path — this is what SHIPS. It needs no variant machinery.
4. **Add a `SURFACES` entry** in `src/ui/dev-surfaces.ts`: `{ id: '<surface>', label, rung, hr: 'HR-<n>',
   variants: [A, B, C] }` — each variant `{ id, label, blurb }`, `variants[0]` = the self-picked prod default
   (its `blurb` says "shipped default"). `hr` is REQUIRED — the `review-link` gate REDs an entry whose HR-item
   isn't open in review.md citing this id; `rung` groups the Review tab's rung-by-rung QA. References are
   stable **ids** (`market`, `market-b`) — never positional tags (ADR-192).
5. **Author the alternates (B / C) in `src/ui/dev/variant-renderers.ts`** (a `render<Surface>Variant(variantId,
   container, state, dispatch)` fn returning `true` when it rendered, `false` to fall through to the default).
   Wire it into `renderSurfaceVariant`. Genuinely distinct *approaches* (layout / hierarchy / density / motion —
   **never** palette swaps), all **within the bible** ([`docs/living/ui-design.md`](../../../docs/living/ui-design.md):
   paper+ink+indigo; vermilion/seal rare; no drop-shadow/gradient/glassmorphism/neon/default-component
   look). Every variant must actually WORK.
6. **Add the fall-through in the surface's renderer:**
   `if (import.meta.env.DEV && dev && dev.renderVariant('<surface>', pane, state, dispatch)) return;` **before**
   the default render — so DEV routes to the selected variant and prod (where `dev` is undefined) always draws A.
7. **Self-review each** live in the DEV panel against the §5 rubric (the Intentionality gate + the conservative
   tiebreak) — self-pick the prod default (A).
8. **Taste scorecard — Pass 2 (FB-10, ADR-135):** score **EVERY variant** against ALL 21 taste.md principles via the
   [`taste-scorecard`](../taste-scorecard/SKILL.md) skill (a variant the human might pick must not hide a
   violation) — fix what you can first, compress each verdict, tag each ✘ **[briefed]** (it was in the step-2
   brief — knew-and-missed) or **[blind spot]** (taste.md's text failed to fire). The brief + per-variant
   scorecard blocks are **mandatory sections of the HR-item** (§6).
9. **Prove strip-safety:** `pnpm run build` then grep `dist/` for `DEV_SENTINEL` + the variant strings → **0 hits**
   (the alternates tree-shake out of prod; zero flag-debt).
10. **File the HR-items:** add **one `review.md` line item per variant** (§6 shape — "review LIVE in the DEV
    panel"), **plus the taste brief (step 2) + per-variant `Scorecard:` blocks (step 8)**. Bump the journal +
    `project-status.md`.
11. **Commit** (small, green) and **move on** — never wait for the human. The alternates stay DEV-only until the
    human confirms/overrides via the toggle.


## §5 · Self-pick rubric (the agent's own vision vs the bible; each axis 0–3)

| Axis (weight) | 0 = | 3 = |
|---|---|---|
| **Intentionality / anti-slop** (×3) **— GATE** | reads as a generic web app | woodblock left on a worktable |
| **Hierarchy** (×2) | no eye path; competing CTAs | one calm scan path; log is the heart |
| **Legibility / mobile** (×2) | breaks/illegible on a phone | clean at 390px; kanji ≥16px, tabular-nums |
| **Fit-to-frame & reveal** (×1) | bespoke off-system primitives | dissolves into the system; honors reveal-as-plot |

- **Intentionality is a hard gate:** any variant scoring **0** there is disqualified regardless of total (a slop
  variant never auto-wins).
- Otherwise pick the **highest weighted total** (max 24).
- **Tiebreak (within 1 pt), biased conservative** — an unreviewed default should be the one you're content to
  live with, not the boldest gamble: (1) higher Intentionality → (2) higher Legibility/mobile → (3) smaller diff
  → (4) most conventional within the bible → (5) lowest letter. *The bold option only "wins for real" if a human
  affirmatively picks it.*

## §6 · Autonomy — logging + the HR-item

**Durable writes (the pick must survive compaction):** (1) **one `review.md` line item per variant** (the human
reviews each LIVE in the DEV panel — not a screenshot); (2) a journal entry + bump `project/status/project-status.md`.
There is no contact sheet and no `variants-log.md`/branch registry — the `SURFACES` registry in
`src/ui/dev-surfaces.ts` IS the live source of what variants exist.

**HR-items** — one per variant, grouped under the surface's block in `project/human-in-the-loop/review.md`.
The item cites the surface's **id** (`Review → Variants → <id>`, ADR-192 — never a positional tag); the
`review-link` gate binds registry ↔ queue both ways, so a pruned or re-homed toggle goes RED instead of
sending the human to a missing row. The default (A) is marked *self-picked prod default*; the alternates are
*built; DEV-only*:

```md
- **<surface>** (what it is) — ✅ **all three LIVE in the DEV panel** ("VARIANT · <label>"):
  - **Taste brief (pass 1):** P<n> <one-line constraint> · P<n> … _(mandatory — authored BEFORE the variants)_
  - [ ] **A — <name>** _(self-picked prod default; ships)_ — <one-line what it is>.
    - **Scorecard (A):** N✔ · N✘ · N— _(mandatory — full 21-walk per variant; ✘ lines below, each tagged
      [briefed] or [blind spot])_
  - [ ] **B — <name>** _(built; DEV-only)_ — <one-line distinct approach>.
    - **Scorecard (B):** N✔ · N✘ · N—
  - [ ] **C — <name>** _(built; DEV-only)_ — <one-line distinct approach>.
    - **Scorecard (C):** N✔ · N✘ · N—
```

Silence is a **safe** answer (A already ships; the alternates are DEV-only and cost nothing until picked). **How
to review:** `pnpm run dev` → the DEV panel (top-right) → **Review** tab (Variants half, rung-grouped, each row
carrying its HR-chip) → toggle each surface's variant, the surface updates
instantly. If the human picks B/C, promote it to the inline default in the surface's `src/ui/render/` module
(and demote A into `src/ui/dev/variant-renderers.ts`), re-check a11y on the new default, then the alternates can
be retired.

**Stale-HR-item expiry (lazy — no daemon — checked at every session start and every diverge):**
- **TTL = 14 days** from `opened`, **OR immediately when the surface's render-props contract changes** (a frozen
  render-only variant can't be trusted past that). Whichever first.
- **7-day half-life:** escalate only — reword the HR-item/brief to `⏳ nearing auto-confirm`.
- **At TTL:** **auto-confirm the self-pick**, prune the alternates, downgrade the HR-item to a soft note — a
  dropped variant is re-implementable from git history + its scored rationale on request, **no data loss**.
- **Human-only `📌 pin`** exempts a kept-flag from expiry (never autonomous); a pin still counts against the 2.
