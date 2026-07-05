---
name: diverge
description: Generate FULL 2–3 genuinely-distinct, WORKING visual/design variants of a UI surface, wire each into the live DEV-panel toggle, self-review each against ui-design.md, self-pick a prod default, and file EACH variant as its own line item in human-in-the-loop/review.md for the human to review live and override. D-075 (refines D-073) — variants live IN the codebase behind a DEV-only toggle (stripped from prod), NOT on branches / as screenshots; NO "diverge-LITE" single-idea shortcut and NO buggy variants. MANDATORY for any new or majorly-restyled UI surface (one-line tweaks exempt). Use when building or restyling a meaningful UI surface, or when the human says "show me variants / options".
---

# Diverge

> **THE MODEL — D-075 v2 (refines D-073). This header is authoritative; §2 is the built procedure.** Two rules:
> 1. **FULL 2–3 working variants, always.** No "diverge-LITE" single-idea shortcut; no shipping a buggy variant —
>    every variant must actually work so the human can compare them fairly.
> 2. **Variants live IN the codebase, switched live via the DEV panel** (DEV-only, `import.meta.env.DEV`, stripped
>    from prod by the `gh-pages.sh` grep guard) — **NOT** on a `diverge/<surface>` branch, **NOT** as headless
>    screenshots. The human reviews by **toggling each in the running UI**. **Each variant gets its own line item
>    in [`human-in-the-loop/review.md`](../../../project/human-in-the-loop/review.md).** The agent self-picks a
>    coherent **prod default** (the surface's inline render, which ships); the toggle keeps the alternates until
>    the human confirms → **zero PROD flag-debt**.
>
> **§1 (entry gate), §2 (procedure), §5 (self-pick rubric) and §6 (the R-item) are current.** §0/§3/§4/§7/§8
> below describe the RETIRED branch/`?variant=`/contact-sheet/GC infrastructure (never built — the DEV-panel model
> replaced it); they are kept only as the design *rationale* for the caps + the anti-slop discipline. Where they
> say "branch" / "`git branch -D`" / "committed screenshots" / "isolation guard", the built reality is: the
> variant lives in **`src/ui/dev.ts`** and is reviewed live in the DEV panel. **Do not follow their mechanics.**

No new or majorly-restyled UI surface ships from a single idea. `diverge` generates **FULL 2–3 distinct, working
approaches**, self-reviews them against the woodblock/ink bible
([`docs/living/ui-design.md`](../../../docs/living/ui-design.md)), wires each into the **live DEV-panel toggle** —
then **self-picks** a prod default and files **each variant** as a review.md line item so the human can review
them live and override, **without ever blocking forward progress** (CLAUDE.md autonomy + D-071).

## The core discipline — in-codebase variants, DEV-only (zero PROD flag-debt)

The danger with mandatory variants is **feature-flag debt**: variant switches piling up in the SHIPPED build.
We avoid it by keeping the switch **DEV-only**:

> **All variants live in the codebase behind a DEV-panel toggle (`import.meta.env.DEV`, dead-code-eliminated in
> prod). Prod ships only the self-picked default — so the shipped bundle carries ZERO variant flag-debt, while
> DEV gives the human live A/B/C by toggling in the running UI. Each variant = one `review.md` line item.**

Because the **pure core** makes every variant a *render-only diff*, the variants are cheap render-branches in the
UI layer only — `src/core/**` never branches on variant. The prod bundle is the default alone (verified the same
way the DEV `__qa` API is: a build-time `import.meta.env.DEV` gate + a deploy-time grep, per the `gh-pages.sh`
guard).

Durable `?variant=` flags **in `main`** are the **single exception** (`keep-flags`), for when the human wants
a *persistent* live test against evolving `main` — **hard-capped at 2 repo-wide**.

**Diverge integrity (A19) — keep the process honest:**
- **Implement the rule by INTENT when the mechanism is unsafe.** If a process step's *mechanism* is risky in
  this repo (e.g. branch/stash churn on a shared tree), satisfy the rule's *intent* by a safe means — never
  skip the rule because its canonical mechanism doesn't fit.
- **Wire the decision-log INTO the cleanup, or the audit trail rots.** When a variant is retired, record
  *why* in its DECISION sheet **as part of removing it** — not as a separate step that gets forgotten.
- **NAME a time-box corner-cut; never ship one quietly.** If real constraints force a reduced pass, label it
  explicitly (the way "diverge-LITE" was named before D-075 retired it) so it's a visible, revertable debt —
  a silent corner-cut reads as "done."

**One correspondence per surface:** `1 surface ⇒ 1 diverge/<surface> branch ⇒ 1 variants-log row ⇒ 1 R-item ⇒
1 committed contact sheet`.

## §0 · First-use setup (build JIT, the first time you diverge)

These small pieces are built on the **first** real diverge (you can't test variant tooling with no variants):

- `qa-shots.mjs` gains a `--variant` flag + `VITE_UI_VARIANT` env + a `__qa.setVariant('B')` hook — gate it
  on `import.meta.env.DEV` and expose it via the existing `window.__qa` install in `src/app/main.ts`.
  *(The old `?balance` / `resolveBootProfile` boot-channel this once mirrored was **retired by D-056** — don't
  reuse it. The §3 references to it below are stale and flagged for the §§2-8 v0.3.1 DEV-panel rework.)*
- `src/scripts/variant-gc.mjs` — the deterministic GC (the rote half of §4).
- A **content-aware isolation guard** appended to `.githooks/pre-commit` — runs only when `src/ui/variants/**`
  or the resolver is staged; fails the commit if a `?variant=` literal or a `from '…/variants/'` import appears
  outside `src/ui/variants/` + the single resolver, or if `src/core/**` references `variants/`.
- A one-line note in `project/human-in-the-loop/README.md` documenting the standing-R-item fallback (below).

The registry [`project/audit/variants-log.md`](../../../project/audit/variants-log.md) already exists (stub).

## §1 · Entry gate — mandatory vs exempt

**Fires for:** any **new UI surface** or **major restyle** (a layout / hierarchy / density / motion change).
**Exempt:** one-line tweaks, copy edits, token-value nudges, bug fixes. **If unsure → exempt** (diverge is for
*approaches*, not polish).

**Precondition:** the change must be expressible **render-only against existing pure-core props**. If a
candidate approach needs a core / state / RNG change, it is **not a variant** — route it through normal
planning.

## §2 · The procedure (autonomous, never blocks) — the built DEV-panel reality

The infra is **already built** (v0.3.1 Step 1): the `SURFACES` registry + `renderVariant` in
[`src/ui/dev.ts`](../../../src/ui/dev.ts), the fixed DEV panel with a live per-surface toggle, and the
`gh-pages.sh` strip-guard that greps the prod bundle for `DEV_SENTINEL`. To diverge a surface:

1. **Gate (§1).** Confirm the surface is new / a major restyle and the change is render-only against existing
   pure-core props. One-liners are exempt.
2. **Taste constraint brief — Pass 1 of the [`taste-scorecard`](../taste-scorecard/SKILL.md) skill (F10, D-135).**
   BEFORE authoring any variant: walk taste.md's 21 principles, write one concrete line per applicable principle
   (what THIS surface must do to honor it). The brief constrains ALL variants — they diverge in approach, not in
   whether they meet the bar. Full walk → journal; the compressed brief is carried into the R-item at step 10.
3. **Author the default (A) INLINE in the surface's renderer** (`src/ui/render.ts`) as the normal render path —
   this is what SHIPS. It needs no variant machinery.
4. **Add a `SURFACES` entry** in `src/ui/dev.ts`: `{ id: '<surface>', label, variants: [A, B, C] }` — each
   variant `{ id, label, blurb }`, `variants[0]` = the self-picked prod default (its `blurb` says "shipped
   default").
5. **Author the alternates (B / C) in `src/ui/dev.ts`** (a `render<Surface>Variant(variantId, container, state,
   dispatch)` fn returning `true` when it rendered, `false` to fall through to the default). Wire it into
   `renderSurfaceVariant`. Genuinely distinct *approaches* (layout / hierarchy / density / motion — **never**
   palette swaps), all **within the bible** (paper+ink+indigo; vermilion/seal rare; no
   drop-shadow/gradient/glassmorphism/neon/default-component look). Every variant must actually WORK.
6. **Add the fall-through in the surface's renderer:**
   `if (import.meta.env.DEV && dev && dev.renderVariant('<surface>', pane, state, dispatch)) return;` **before**
   the default render — so DEV routes to the selected variant and prod (where `dev` is undefined) always draws A.
7. **Self-review each** live in the DEV panel against the §5 rubric (the Intentionality gate + the conservative
   tiebreak) — self-pick the prod default (A).
8. **Taste scorecard — Pass 2 (F10, D-135):** score **EVERY variant** against ALL 21 taste.md principles via the
   [`taste-scorecard`](../taste-scorecard/SKILL.md) skill (a variant the human might pick must not hide a
   violation) — fix what you can first, compress each verdict, tag each ✘ **[briefed]** (it was in the step-2
   brief — knew-and-missed) or **[blind spot]** (taste.md's text failed to fire). The brief + per-variant
   scorecard blocks are **mandatory sections of the R-item** (§6).
9. **Prove strip-safety:** `npm run build` then grep `dist/` for `DEV_SENTINEL` + the variant strings → **0 hits**
   (the alternates tree-shake out of prod; zero flag-debt).
10. **File the R-items:** add **one `review.md` line item per variant** (§6 shape, minus the branch/screenshot
    specifics — "review LIVE in the DEV panel"), **plus the taste brief (step 2) + per-variant `Scorecard:`
    blocks (step 8)**. Bump the journal + `project-status.md`.
11. **Commit** (small, green) and **move on** — never wait for the human. The alternates stay DEV-only until the
    human confirms/overrides via the toggle.

## §3 · [SUPERSEDED] The old `?variant=` flag model

**Retired by D-075 v2 (never built).** The variant system is the `SURFACES` registry + `renderVariant` in
`src/ui/dev.ts` (see §2), NOT `src/ui/variants/<surface>/{A,B,C}.ts` + a `resolveVariant` URL channel. The
isolation principle still holds in spirit — **`src/core/**` never branches on variant; alternates are
render-only, DEV-only, and tree-shaken from prod** — but it's enforced by the `import.meta.env.DEV` guard + the
`gh-pages.sh` `DEV_SENTINEL` grep, not by a pre-commit isolation guard over a `variants/` dir. The rest of this
section is kept only as the original design rationale.

<details><summary>original branch/channel mechanics (do not follow)</summary>

**Mechanism — mirror the existing `?balance` triple-channel 1:1**, all `import.meta.env.DEV`-gated and
dead-code-eliminated from the itch build:

| Channel | Use | Form |
|---|---|---|
| **URL param** (primary human flip) | live in-browser compare | `?variant=B` → reload |
| **`__qa.setVariant('B')`** | headless screenshotting | drives `qa-shots.mjs` |
| **`VITE_UI_VARIANT` env** | reproducible CI/screenshot runs | mirrors `VITE_BALANCE_PROFILE` |

Persist the URL value to a DEV-only `localStorage` key (`kk.uiVariant`) so it survives reloads during a compare
session. An optional DEV-only corner toggle (three ink pills `A · B · C`) is sugar, not required.

**Isolation rules — non-negotiable (this is what keeps variants render-only & cheap to delete):**
- **One dir per surface:** `src/ui/variants/<surface>/{A,B,C}.ts` + `index.ts` (the only public face: id→fn,
  exports the self-pick as default). Nothing imports `A/B/C` directly — only via `index.ts`.
- **One resolution point:** `resolveVariant(surface)` (beside `resolveBootProfile` in `src/app/main.ts`).
  **Never** sprinkle `if (variant === 'B')` through shared code — *banned; the isolation guard fails the commit.*
- **Identical contract:** every variant has the same signature and consumes the **same plain-data props** the
  plain renderer passes. No bespoke state, intents, math, or RNG.
- **Pure core stays single, always:** `src/core/**` never branches on variant and never imports `variants/`. If
  a variant "needs" a core change, make that change **once**, variant-agnostically, for all paths.
- **`variants/` is a sink, never a source:** shared shell/log/buttons live outside `variants/` and are imported
  *by* variants, never the reverse.

</details>

## §4 · Flag lifecycle, GC & debt discipline

```
create ──► live ──────────────► resolve ─────► GC'd
build 2–3   winner = plain        human verdict   main = one plain render path;
on branch,  path on main;         OR expiry/      branch deleted; losers live only
self-pick,  losers only on        cap-evict       in committed screenshots + git
collapse    diverge/<surface>;    (→ self-pick    history (30-day "restorable" window)
winner,     R-item ticking        wins)
file R-item
```

**Caps (knobs at the top of the registry):** **open diverges = 3** (bound = the human's review bandwidth, since
`main` debt is ~0) · **durable kept-flags = 2 repo-wide** (real `main` debt; hard) · **max variants/set = 3**.

**Registry — [`project/audit/variants-log.md`](../../../project/audit/variants-log.md)** (single source of
truth; prevents orphaned branches; drives the sweep). Open-diverges table + durable kept-flags table + a Closed
crosswalk at the bottom (`surface · R# · winner · who/when · branch-was`).

**Verdict → exact agent action:**

| Human says | Agent does |
|---|---|
| **(silence past TTL)** | Promote self-pick to canon; archive R-item "auto-confirmed"; `git branch -D`; close the row. |
| **`pick A`** (confirm) | Same, immediately (A already live — no code change). |
| **`pick B`** (override) | Cherry-pick B's render diff onto `main` as the new default; re-shoot; commit; close + GC. |
| **`blend A+C`** | **Bounded** mini-diverge: author the single blend as *one new* variant on the branch, screenshot, append to the same contact sheet. **Promote the blend onto `main` as the new live default, set it as the R-item's self-pick, and reset the TTL** — so later silence auto-confirms the *blend*, not the superseded original pick. (One new variant — not a fresh 3-way.) |
| **`reject all`** | Revert to baseline; open a *fresh* diverge carrying the human's reason as a new constraint; GC the branch. |
| **`keep-flags B`** | The **only** path to a durable `main` flag: promote the *named* variants to a permanent `?variant=` flag in `main` (owner + expiry), counted against the **cap of 2**. **If the kept-flags table is already at 2,** the agent does **not** silently exceed the hard cap — it reports "kept-flags at cap 2" and asks the human to resolve or `📌`-unpin an existing kept-flag first. |

**GC** (`variant-gc.mjs <surface> <winner>` does the rote parts): winner on `main` → `git branch -D
diverge/<surface>` + delete refs → move the registry row to Closed → mark the R-item `✅` → **graduate if
durable** (a reusable pattern → ADR in `decisions.md` + update `ui-design.md`; a one-off taste pick is
archive-row-only).

**At the cap (open = 3), NEVER stall — apply in order:**
1. **Sweep first** — any set past `expires` → auto-resolve now (GC to self-pick) → slot freed → diverge normally.
2. **Fast-forward the oldest stale** — none expired but the oldest is past the **7-day half-life** with **no
   human verdict yet** (the automated half-life rewording in §6 does *not* count as a "touch") → auto-resolve it
   early → slot freed.
3. **Single-idea mode (documented exception)** — all 3 are fresh → **do not** open a 4th. Self-pick the single
   best approach with the §6 rubric, ship it **straight to `main` flag-free** (zero debt, no branch, no R-item),
   **and add a `deferred-single-idea` row to the registry's Open table** (the surface + which R-item blocked it)
   so the sweep re-offers a real diverge the moment a slot frees — the "diverge later" promise is *tracked*, not
   verbal. Log `single-idea — at cap (blocked by R<n>): shipped flag-free; deferred-diverge tracked`.

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

## §6 · Autonomy — logging + the R-item (the DEV-panel reality)

**Durable writes (the pick must survive compaction):** (1) **one `review.md` line item per variant** (the human
reviews each LIVE in the DEV panel — not a screenshot); (2) a journal entry + bump `project/status/project-status.md`.
There is no contact sheet and no `variants-log.md`/branch registry in the DEV-panel model — the `SURFACES`
registry in `src/ui/dev.ts` IS the live source of what variants exist.

**R-items** — one per variant, grouped under the surface's block in `project/human-in-the-loop/review.md`
(the DEV-panel R2 block already groups them by surface). The default (A) is marked *self-picked prod default*; the
alternates are *built; DEV-only*. Reviewed by toggling each in the running DEV panel:

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
to review:** `npm run dev` → the DEV panel (top-right) → toggle each surface's variant, the surface updates
instantly. If the human picks B/C, promote it to the inline default in `render.ts` (and demote A into `dev.ts`),
re-check a11y on the new default, then the alternates can be retired.

**Stale-R-item expiry (lazy — no daemon — checked at every session start and every diverge):**
- **TTL = 14 days** from `opened`, **OR immediately when the surface's render-props contract changes** (a frozen
  render-only branch can't be trusted past that). Whichever first.
- **7-day half-life:** escalate only — reword the R-item/brief to `⏳ nearing auto-confirm`.
- **At TTL:** **auto-confirm the self-pick**, GC the branch, downgrade the R-item to a soft note; the committed
  screenshots remain the recoverable record (a dropped variant is re-implementable from its screenshot + scored
  rationale on request — **no data loss**).
- **Human-only `📌 pin`** exempts a kept-flag from expiry (never autonomous); a pin still counts against the 2.

## §7 · Checklists

**Per-diverge:** gate passed & render-only ✓ · sweep ran, open ≤ 3 (else single-idea) ✓ · 2–3 distinct
approaches within the bible ✓ · each an isolated module behind the single `resolveVariant`, no `if(variant===…)`
in shared code, `src/core/**` untouched ✓ · desktop+mobile shot, self-scored with the Intentionality gate ✓ ·
contact sheet **graduated to `project/audit/reports/…` and committed** ✓ · winner collapsed onto `main`
**flag-free** ✓ · registry row + R-item filed with expiry + journal/status bumped ✓ · commit green ✓.

**Periodic debt sweep (session start + at cap):** read the registry; auto-resolve expired / render-contract-
changed rows; mark half-life+untouched as stale; **orphan check** (every `diverge/*` branch ⇔ exactly one open
row); kept-flags ≤ 2 each with owner + unexpired date; the isolation guard stays green.

## §8 · Risks & anti-patterns (all designed-out above)

- **`if (variant === 'B')` smeared through shared code** — *banned; isolation guard fails the commit.*
- **Variants touching the pure core** — destroys determinism, un-deletable diffs — *hard stop.*
- **Durable `main` flags as the default** — unbounded `O(surfaces×variants)` debt — *rejected; branch-
  preservation keeps resting debt at 0; durable flags only via capped `keep-flags`.*
- **Contact sheet left in `tmp/`** (git-ignored) — *always graduate the committed copy.*
- **Blocking on the human** — *self-pick + ship; the R-item is a later override, never a gate.*
- **Unbounded queue / "resolve later"** — *cap (3) + TTL (14d auto-confirm) make silence safe & lossless.*
- **Orphaned `diverge/*` branches** — *the sweep's orphan check + GC-on-resolve prevent drift.*
- **Palette-swap "variants"** — *not distinct approaches; reject.*
