# diverge v1 — the retired branch/`?variant=`/contact-sheet/GC model (archived)

> **Archived 2026-07-06 (context-hardening P4c2, ADR-140-era).** These are the
> diverge skill's §0/§3/§4/§7/§8 (+ the one-correspondence line), graduated
> here VERBATIM from `.claude/skills/diverge/SKILL.md`. They describe the
> RETIRED branch/`?variant=`/contact-sheet/GC infrastructure — never built;
> the DEV-panel model (ADR-075 v2) replaced it. Kept as the design *rationale*
> for the caps + the anti-slop discipline. **Do not follow their mechanics** —
> the live procedure is the skill's §1/§2/§5/§6.

**One correspondence per surface:** `1 surface ⇒ 1 diverge/<surface> branch ⇒ 1 variants-log row ⇒ 1 HR-item ⇒
1 committed contact sheet`.

## §0 · First-use setup (build JIT, the first time you diverge)

These small pieces are built on the **first** real diverge (you can't test variant tooling with no variants):

- `qa-shots.mjs` gains a `--variant` flag + `VITE_UI_VARIANT` env + a `__qa.setVariant('B')` hook — gate it
  on `import.meta.env.DEV` and expose it via the existing `window.__qa` install in `src/app/main.ts`.
  *(The old `?balance` / `resolveBootProfile` boot-channel this once mirrored was **retired by ADR-056** — don't
  reuse it. The §3 references to it below are stale and flagged for the §§2-8 v0.3.1 DEV-panel rework.)*
- `src/scripts/variant-gc.mjs` — the deterministic GC (the rote half of §4).
- A **content-aware isolation guard** appended to `.githooks/pre-commit` — runs only when `src/ui/variants/**`
  or the resolver is staged; fails the commit if a `?variant=` literal or a `from '…/variants/'` import appears
  outside `src/ui/variants/` + the single resolver, or if `src/core/**` references `variants/`.
- A one-line note in `project/human-in-the-loop/README.md` documenting the standing-HR-item fallback (below).

The registry [`project/audit/variants-log.md`](../../../project/audit/variants-log.md) already exists (stub).

## §3 · [SUPERSEDED] The old `?variant=` flag model

**Retired by ADR-075 v2 (never built).** The variant system is the `SURFACES` registry + `renderVariant` in
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
winner,     HR-item ticking        wins)
file HR-item
```

**Caps (knobs at the top of the registry):** **open diverges = 3** (bound = the human's review bandwidth, since
`main` debt is ~0) · **durable kept-flags = 2 repo-wide** (real `main` debt; hard) · **max variants/set = 3**.

**Registry — [`project/audit/variants-log.md`](../../../project/audit/variants-log.md)** (single source of
truth; prevents orphaned branches; drives the sweep). Open-diverges table + durable kept-flags table + a Closed
crosswalk at the bottom (`surface · R# · winner · who/when · branch-was`).

**Verdict → exact agent action:**

| Human says | Agent does |
|---|---|
| **(silence past TTL)** | Promote self-pick to canon; archive HR-item "auto-confirmed"; `git branch -D`; close the row. |
| **`pick A`** (confirm) | Same, immediately (A already live — no code change). |
| **`pick B`** (override) | Cherry-pick B's render diff onto `main` as the new default; re-shoot; commit; close + GC. |
| **`blend A+C`** | **Bounded** mini-diverge: author the single blend as *one new* variant on the branch, screenshot, append to the same contact sheet. **Promote the blend onto `main` as the new live default, set it as the HR-item's self-pick, and reset the TTL** — so later silence auto-confirms the *blend*, not the superseded original pick. (One new variant — not a fresh 3-way.) |
| **`reject all`** | Revert to baseline; open a *fresh* diverge carrying the human's reason as a new constraint; GC the branch. |
| **`keep-flags B`** | The **only** path to a durable `main` flag: promote the *named* variants to a permanent `?variant=` flag in `main` (owner + expiry), counted against the **cap of 2**. **If the kept-flags table is already at 2,** the agent does **not** silently exceed the hard cap — it reports "kept-flags at cap 2" and asks the human to resolve or `📌`-unpin an existing kept-flag first. |

**GC** (`variant-gc.mjs <surface> <winner>` does the rote parts): winner on `main` → `git branch -D
diverge/<surface>` + delete refs → move the registry row to Closed → mark the HR-item `✅` → **graduate if
durable** (a reusable pattern → ADR in `decisions.md` + update `ui-design.md`; a one-off taste pick is
archive-row-only).

**At the cap (open = 3), NEVER stall — apply in order:**
1. **Sweep first** — any set past `expires` → auto-resolve now (GC to self-pick) → slot freed → diverge normally.
2. **Fast-forward the oldest stale** — none expired but the oldest is past the **7-day half-life** with **no
   human verdict yet** (the automated half-life rewording in §6 does *not* count as a "touch") → auto-resolve it
   early → slot freed.
3. **Single-idea mode (documented exception)** — all 3 are fresh → **do not** open a 4th. Self-pick the single
   best approach with the §6 rubric, ship it **straight to `main` flag-free** (zero debt, no branch, no HR-item),
   **and add a `deferred-single-idea` row to the registry's Open table** (the surface + which HR-item blocked it)
   so the sweep re-offers a real diverge the moment a slot frees — the "diverge later" promise is *tracked*, not
   verbal. Log `single-idea — at cap (blocked by R<n>): shipped flag-free; deferred-diverge tracked`.

## §7 · Checklists

**Per-diverge:** gate passed & render-only ✓ · sweep ran, open ≤ 3 (else single-idea) ✓ · 2–3 distinct
approaches within the bible ✓ · each an isolated module behind the single `resolveVariant`, no `if(variant===…)`
in shared code, `src/core/**` untouched ✓ · desktop+mobile shot, self-scored with the Intentionality gate ✓ ·
contact sheet **graduated to `project/audit/reports/…` and committed** ✓ · winner collapsed onto `main`
**flag-free** ✓ · registry row + HR-item filed with expiry + journal/status bumped ✓ · commit green ✓.

**Periodic debt sweep (session start + at cap):** read the registry; auto-resolve expired / render-contract-
changed rows; mark half-life+untouched as stale; **orphan check** (every `diverge/*` branch ⇔ exactly one open
row); kept-flags ≤ 2 each with owner + unexpired date; the isolation guard stays green.

## §8 · Risks & anti-patterns (all designed-out above)

- **`if (variant === 'B')` smeared through shared code** — *banned; isolation guard fails the commit.*
- **Variants touching the pure core** — destroys determinism, un-deletable diffs — *hard stop.*
- **Durable `main` flags as the default** — unbounded `O(surfaces×variants)` debt — *rejected; branch-
  preservation keeps resting debt at 0; durable flags only via capped `keep-flags`.*
- **Contact sheet left in `tmp/`** (git-ignored) — *always graduate the committed copy.*
- **Blocking on the human** — *self-pick + ship; the HR-item is a later override, never a gate.*
- **Unbounded queue / "resolve later"** — *cap (3) + TTL (14d auto-confirm) make silence safe & lossless.*
- **Orphaned `diverge/*` branches** — *the sweep's orphan check + GC-on-resolve prevent drift.*
- **Palette-swap "variants"** — *not distinct approaches; reject.*
