---
name: diverge
description: Generate 2–3 genuinely-distinct visual/design variants of a UI surface, screenshot each headlessly, self-review each against ui-design.md, present a contact sheet, self-pick a winner, and file it for human override — with a bounded feature-flag discipline so variants never rot the build. MANDATORY for any new or majorly-restyled UI surface (one-line tweaks exempt). Use when building or restyling a meaningful UI surface, or when the human says "show me variants / options".
---

# Diverge

No new or majorly-restyled UI surface ships from a single idea. `diverge` generates **2–3 distinct
approaches**, screenshots each, self-reviews them against the woodblock/ink bible
([`docs/living/ui-design.md`](../../../docs/living/ui-design.md)), and presents a contact sheet — then
**self-picks** a winner and files it as an R-item so the human can override later, **without ever blocking
forward progress** (CLAUDE.md autonomy + D-071).

## The core discipline — branch-preservation (why this can't rot the build)

The danger with mandatory variants is **feature-flag debt**: temporary `?variant=` flags piling up in `main`
until the build is unmaintainable. We avoid it entirely:

> **The winner collapses into `main` flag-free. The losing variants are preserved as (a) committed
> desktop+mobile screenshots and (b) a retained `diverge/<surface>` git branch that still carries the full
> `?variant=A|B|C` switch.**

Because the **pure core** makes every variant a *render-only diff*, that branch is a runnable, non-rotting,
zero-CI-cost snapshot — you only need a variant *runnable* (not *mergeable*) to A/B it live. So **`main`'s
resting flag-debt is zero**, GC is `git branch -D`, and `main` carries no smoke/DCE burden.

Durable `?variant=` flags **in `main`** are the **single exception** (`keep-flags`), for when the human wants
a *persistent* live test against evolving `main` — **hard-capped at 2 repo-wide**.

**One correspondence per surface:** `1 surface ⇒ 1 diverge/<surface> branch ⇒ 1 variants-log row ⇒ 1 R-item ⇒
1 committed contact sheet`.

## §0 · First-use setup (build JIT, the first time you diverge)

These small pieces are built on the **first** real diverge (you can't test variant tooling with no variants):

- `qa-shots.mjs` gains a `--variant` flag + `VITE_UI_VARIANT` env + a `__qa.setVariant('B')` hook — mirror the
  existing `?balance` triple-channel (`src/app/main.ts` `resolveBootProfile`, DEV-gated).
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

## §2 · The procedure (autonomous, never blocks)

0. **First-diverge setup (once ever).** If `src/ui/variants/` doesn't exist yet, build the §0 infra first (the
   `?variant=` channels + `__qa.setVariant`, `variant-gc.mjs`, the pre-commit isolation guard) — the rest of
   this procedure depends on it. Skip if already present.
1. **Sweep + budget check (§4).** Run the registry sweep; if open diverges ≥ cap, apply the §4 at-cap ladder
   (which may drop you into single-idea mode and end here).
2. **Branch:** `git checkout -b diverge/<surface>` from `main`.
3. **Generate 2–3 variants** — genuinely distinct *approaches* (layout / hierarchy / density / motion —
   **never** palette swaps), all **within the bible** (paper+ink+indigo; vermilion/seal rare; no
   drop-shadow/gradient-depth/glassmorphism/neon/default-component look; no new art language). Each is one
   isolated render module behind `?variant=A|B|C` (§3).
4. **Capture headlessly** via the `capture-game-states` skill / `qa-shots.mjs --variant` → one **desktop + one
   mobile** PNG per variant.
5. **Self-review** each screenshot against the bible with the §6 rubric (Intentionality gate + conservative
   tiebreak).
6. **Contact sheet** → working copy in `tmp/variants/<surface>/contact.md`, then **graduate the durable copy**
   to `project/audit/reports/<date>-variants-<surface>/contact.md` with PNGs under
   `project/audit/screens/<date>-variants-<surface>/`, and **commit to `main`** (evidence must outlive the
   branch).
7. **Self-pick** the winner (§6).
8. **Collapse onto `main` flag-free:** on `main`, author the winner as the unconditional plain render path (no
   resolver, no `?variant=`). The `diverge/<surface>` branch keeps the A/B/C switch as the live comparator.
9. **Record:** add the `variants-log.md` row; file the R-item (§6); bump journal + `project-status.md`.
10. **Commit** (small, green) and **move on** — never wait for the human.

## §3 · The variant flag model

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

## §6 · Autonomy — logging, the R-item, and expiry

**Three durable writes (the pick must survive compaction):** (1) the committed contact sheet + per-variant
scores + 1-line rationale under `project/audit/reports/<date>-variants-<surface>/`; (2) the `variants-log.md`
row; (3) a journal entry + bump `project/status/project-status.md` ("open variant diverges: K/3").

**R-item** — one per open diverge, in `project/human-in-the-loop/review.md`, in the `### Rn 🔲 —` shape the
session brief scrapes:

```md
### R7 🔲 — UI variant pick: combat-panel  (agent self-picked B — confirm or override)
- **Asking for:** a 30-second confirm/override of the live default. Forward progress is NOT blocked — B is already live on main.
- **How to look:** contact sheet → project/audit/reports/2026-06-29-variants-combat-panel/contact.md (desktop+mobile A/B/C).
  To PLAY live: `git checkout diverge/combat-panel && npm run dev`, flip `?variant=A|B|C`.
- **Auto-confirms:** 2026-07-13 (14d) — then B is promoted to canon, the branch is GC'd.
- **Verdict:** _(reply: pick X · blend X+Y · reject all · keep-flags X)_
```

Silence is a **safe** answer (the line states "already live" + an expiry). The cap (≤3) bounds this to ≤3 brief
lines — directly defusing "variants stack up aggressively." *(Fallback if the cap is ever raised: a single
standing R-item with an internal checklist — because the brief greps only `^### .*🔲` headings, that collapses
the whole queue to one brief line.)*

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
