# Append-only rendering engine — migrate off wholesale DOM rebuilds

**Status:** 🆕 proposal — awaiting human sign-off; **no code changed yet**.

The whole workspace UI — every pane except the vitals header and the story log —
is torn down (`container.textContent = ''`) and rebuilt from scratch on **every**
`render()` call, and `render()` fires **~2×/second**: it runs on every player
action *and* on every 480ms auto-tick (`AUTO_REPEAT_MS = 480`,
`src/core/content/balance.ts:74`; the interval at `src/app/main.ts:286-288`
routes each auto-step through `dispatch → commit → render`,
`src/app/main.ts:171-188`). So while any auto-labour / auto-combat / auto-rake is
running (the whole "leave it running" idle loop), the entire visible interactive
surface is destroyed and recreated twice a second. That is the repaint/flash the
human sees; it also **loses keyboard focus** on any button the player is using,
**kills the meter `width` transitions** (the fill spans are recreated so the
sweep never plays, `src/ui/styles.css:1529` / `:2178`), and strobes the live
combat forecasts. The top-of-file comment states the current intent plainly —
*"The rest of the UI is cheap enough to rebuild each render"*
(`src/ui/render.ts:1-5`) — cheap for the CPU, but not free for the eye.

---

## 1. Diagnosis

### The render loop + cadence

- **Entry:** `function render(state, prev)` — `src/ui/render.ts:2944`, returned
  from `mount()` (`src/ui/render.ts:477`, `:3032`). Closed over a shell that is
  built **once** in `mount()`.
- **Cadence:** every mutation funnels through `commit()`
  (`src/app/main.ts:171-178`) → `render(state, prev)`. Player actions
  (`dispatch`, `src/app/main.ts:180-188`) and the **480ms auto-tick**
  (`src/app/main.ts:286-288`) both hit it; DEV speed multiplies the rate
  (`autoSpeed`, `src/app/main.ts:224/287`).
- **No diffing today:** `render()` receives `prev` but threads it to **exactly
  one** sub-renderer — `renderVitals(state, prev)` (`src/ui/render.ts:2996`,
  consumed at `:2078-2090`) — plus the two ceremony one-shots
  (`prev.tier`/`prev.rung`, `src/ui/render.ts:3026-3027`). Every other
  sub-renderer ignores `prev` and rebuilds its container from scratch. **No
  keyed reconcile, no memo, no dirty-flag** outside the log and the intro.

### The ~11 wholesale-rebuild containers

Called in order from `render()` (`src/ui/render.ts:2996-3018`). Each clears with
`.textContent = ''` and recreates all children **every render** (≈ every 480ms
while idle-running):

| Container | Site | Rebuilds | Stateful loss |
|---|---|---|---|
| Nav tabs | `renderNav` `render.ts:820` | all tab buttons | focus |
| **Actions (Work hero)** | `renderActions` `render.ts:1589` | rake/rest, per-area labour groups, wolf CTA, cook, Walk-on strip | **focus**, hover — biggest subtree |
| Rung ladder | `renderLadder` `render.ts:830` | rung card + meter fill | meter `width` transition |
| Estate/economy | `renderEstate` `render.ts:879` | estate + house-rooms cards | focus |
| House Influence | `renderHouseInfluence` `render.ts:952` | panel, grade bar, silhouettes, Ascend CTA | `influence-fill` transition, focus |
| Skills | `renderSkills` `render.ts:1729` | one card/skill + meter fills | meter transitions |
| **Combat** | `renderCombat` `render.ts:1815` | XP card, Training rows, weapon/craft cards, stance row, Bestiary, foe watch | focus, live forecast pips |
| Storehouse | `renderStorehouse` `render.ts:2694` | kura card + store/withdraw | focus |
| Market/pedlar | `renderMarket` `render.ts:2744` | one row/item + buy btn | focus |
| Map | `renderMap` `render.ts:2801` | you-are-here card + move strip | focus |
| Quests | `renderQuests` `render.ts:2836` | one card/quest + step lists | focus |

Already-incremental and **not** to be regressed: **vitals** (reused nodes, text
patched in place, `render.ts:2085`) and the **log** (`render.ts:2541` —
key-diffed append, typewriter, sticky-bottom, tally coalesce; clears only on
reset/filter-switch/Now). One exception hiding in the log path: the **Now view**
(`renderNowView`, `render.ts:2466`) does a full `logLines.textContent=''` rebuild
on every state change even though it is a fade/append surface.

The **DEV variant subtrees** (`dev.renderVariant(...)`, e.g.
`render.ts:1018/1932/1988/2759/2809/2843` → `src/ui/dev.ts:261+`) are rendered
*into* the containers above, so they inherit the parent's per-tick teardown.

### Ranked flash offenders

1. **`renderActions` (`render.ts:1588`)** — biggest routinely-visible
   interactive subtree, on the default Work tab the entire early/mid game,
   rebuilt ~2×/s while auto-labour runs. Worst offender.
2. **`renderCombat` (`render.ts:1814`)** — huge composite (training, weapon,
   craft, stance, Bestiary, foe watch + live forecasts) rebuilt every tick during
   auto-combat.
3. **`renderMarket` / `renderQuests` / `renderSkills`** — medium card-lists.
4. **`renderLadder` / `renderEstate` / `renderHouseInfluence` /
   `renderStorehouse`** — small but always-visible; their **meter fill spans**
   are recreated, so smooth transitions never play.
5. **`renderNav`** — small; recreates tab buttons (focus loss).
6. **Now-view** — a self-inflicted full rebuild on an append/fade surface.

---

## 2. Target model — the proven append-only pattern

The interactive-intro VN scene (`src/ui/render.ts:488-1586`, D-104/F81) is
already the fully-built, **tested** append-only reference. It is the template to
generalize. Its five mechanics:

- **Build-once shell.** `buildIntroShell(scene)` (`render.ts:1501`) builds the
  card/columns/panels once per scene and caches refs
  (`introStoryLinesEl`/`introPanelEl`/…, `render.ts:503-527`).
- **Keyed diff-and-append.** `introTranscript()` emits entries with a **stable
  `key`** (`render.ts:1226-1285`); `reconcileIntro()`
  (`render.ts:1532`) computes `fresh = entries.filter(e =>
  !introRenderedKeys.has(e.key))` and **appends only the new ones**
  (`introAppendBlock`, `render.ts:1353`), recording each key in a
  `Set<string>` (`render.ts:509/1365`). No existing node is destroyed within a
  scene.
- **Patch text in place.** The typewriter mutates `span.textContent =
  slice(0,i)` on the mounted node (`render.ts:1320`), never recreating it.
- **Toggle, don't rebuild.** Sub-panels are all present; `showPanel(el, on)`
  flips `el.hidden` + a fade class (`render.ts:1387-1398`); `reconcileAskHub()`
  appends newly-gated buttons and adds an `.asked` class in place
  (`render.ts:1434-1454`).
- **Timers tracked without teardown.** `clearIntroTimers()` cancels pending
  timeouts *without* touching the DOM (`render.ts:1177-1185`); a full
  `teardownIntroScene()` fires **only** on a scene *change* or intro end
  (`render.ts:1204-1222`, gated in `syncIntroScene`, `render.ts:1577`).

### The invariant

> **An idle re-render of unchanged state must produce ZERO DOM churn** — no node
> recreated, no class re-applied, no listener re-bound, no `.textContent=''`.

This is the single testable line that separates "done" from "still flashes". It
holds today for vitals and the log; the goal is to make it hold for every
workspace pane.

---

## 3. Shared infrastructure — a small reconcile helper

The intro and the log each hand-roll the same three primitives. Factor them into
a new module — **`src/ui/reconcile.ts`** — with no DOM-framework dependency, so
every pane renderer can adopt it incrementally:

```ts
// Keyed append / patch / (optional) reorder over a stable-keyed list.
// Tracks rendered keys per container (WeakMap<HTMLElement, Map<key, node>>),
// so an unchanged re-render appends nothing, recreates nothing.
function reconcileList<T>(container: HTMLElement, items: readonly T[], opts: {
  key:    (item: T) => string;
  build:  (item: T) => HTMLElement;              // ONCE, on first appearance
  patch?: (el: HTMLElement, item: T) => void;    // in-place per-render update
  order?: boolean;                               // reorder to match items order
}): void;

// Set a node's text only if it changed (idempotent — no churn on equal text).
function setText(el: HTMLElement, text: string): void;

// Visibility gate that never rebuilds (mirrors the intro's showPanel).
function toggle(el: HTMLElement, on: boolean): void;
```

**How each renderer splits work:**

- **`build` (once):** the card frame, labels, static blurbs, the meter
  wrapper + its persistent fill span, the button element + its click listener.
- **`patch` (per-tick):** `disabled` state, the `%`/`n/n` numbers via `setText`,
  `fill.style.width`, the `.on`/`.active`/`.asked` toggle classes, `title`, and
  coalesced counts.

**Meter transitions come back for free:** once a fill span is built once and only
its `width` is patched, the CSS `transition: width` (`styles.css:1529`, `:2178`)
actually plays instead of snapping.

For the trivial **single static cards** (ladder, estate, storehouse, map-here)
`reconcileList` is overkill — they build one card once and `patch` its handful of
mutable fields directly. The helper is for the genuine lists.

---

## 4. Phased migration

Each phase is independently shippable and revertible (revert = restore that
pane's old `.textContent=''` body; the helper stays inert). Order follows
lowest-risk-validates-the-abstraction → highest-value.

### Phase 1 — build the helper + prove it on the easy surfaces

Validates `reconcile.ts` on the surfaces with fixed, stably-ordered content and
no structural surprises:

- **Keyed lists:** `renderMarket` (`MARKET_ITEMS`), `renderQuests` (`QUESTS`),
  `renderSkills` (`SKILLS`) — each is `map over a fixed array of stable-id
  records`; the cleanest possible `reconcileList` clients.
- **Trivial static cards:** `renderLadder`, `renderEstate`, `renderStorehouse`,
  `renderMap` (you-are-here) — build once, `patch` text/`disabled`/meter width.
  Restores the ladder/estate meter transitions immediately.

Ship Phase 1, confirm zero-churn on an idle tick, then proceed. Lowest risk.

### Phase 2 — the high-value hard ones (biggest flash win)

- **`renderActions` (`render.ts:1588`):** not a flat list — labour groups vary by
  `AREAS` membership and interleave one-off elements (wolf CTA, cook, Walk-on
  strip). Approach: **sectioned reconcile** — a persistent container per section
  (meta-verbs, per-area groups keyed by `area.id`+`activity.id`, extras), each
  reconciled independently; the one-off extras toggle via `hidden`.
- **`renderCombat` (`render.ts:1814`):** a composite of ~6 heterogeneous blocks
  in one `combatPane`. Approach: **first split `combatPane` into named
  sub-containers** (xp, training, weapon, craft, stance, bestiary, watch) built
  once, then make each a keyed sub-list / patched card. The foe watch and
  Bestiary become `reconcileList` clients keyed by `mob.id`; forecasts patch in
  place instead of re-mounting.

### Phase 3 — nav, Now-view, cleanup

- **`renderNav` (`render.ts:809`):** trivial keyed list over the Tab set;
  primarily a focus-preservation win.
- **Now-view (`renderNowView` `render.ts:2466`):** convert its per-state full
  rebuild to the same key-diffed append the main log already uses (keyed by entry
  key, which it already stamps as `data-nowKey`).
- **Sweep:** delete any dead `.textContent=''` paths, confirm the invariant test
  passes on every migrated surface.

### Explicitly LEFT as full rebuild (correct, not debt)

- **Error modal** (`src/app/main.ts:470`) and **`note()` banner**
  (`src/app/main.ts:545`) — rare, cheap, on-demand, off the hot path.
- **DEV-variant subtrees** (`dev.renderVariant`, `src/ui/dev.ts:261+`) —
  `import.meta.env.DEV`-guarded, **tree-shaken from prod**, so they never flash
  for a player. Migrating them is low value; keep clearing their container.

---

## 5. Test / invariant strategy

The existing **34 `it()` blocks** in `src/ui/render.test.ts` assert
**behaviour** (a button dispatches the right Intent, a foe's win-rate fogs then
reveals, HP-meter visibility, byōbu layout) — **not node stability** — and
`MODE=test` bypasses the typewriter/animation paths
(`render.ts:1170/2262`), so animation preservation is inherently untestable in
JSDOM. The **only** existing node-identity guard is the 6-test intro block
(`render.test.ts:484-637`), which asserts `toBe(sameNode)` / `isConnected`
across a re-render (`:544-570`). That block is the template.

- **Per surface, a NODE-IDENTITY test:** render, capture a specific child node,
  re-render with unchanged (and separately, changed) state, assert
  `expect(container.querySelector(sel)).toBe(capturedNode)` and
  `capturedNode.isConnected === true`. This is the proxy for "no flash" that
  `MODE=test` can actually see. **Each migrated surface names this test in its
  DoD.**
- **The F72 ghost-box hazard (must-fix, subtle):** reveal-gating collapses an
  empty slice via `hasVisibleChild(slice)` reading each pane's post-render child
  visibility (`render.ts:793-800/3023`). Today `.textContent=''` guarantees a
  pane that renders nothing leaves a genuinely empty container. An incremental
  pane **must leave zero orphan nodes** when it has nothing to show, or its slice
  wrongly stays revealed as an empty framed ghost card. Each migration adds a
  test: pane renders nothing → container has **no** element children → slice is
  `hidden`.
- **A shared "idle re-render = zero churn" assertion** built on the helper (e.g.
  a `reconcileList` unit test + a spy that fails on any `appendChild`/`remove`
  during an unchanged re-render) enforces the §2 invariant once, centrally.

---

## 6. Risks + open decisions

### Risks

- **Structural splits (Phase 2).** `renderActions` and `renderCombat` need new
  persistent sub-containers before they can be reconciled — the largest code
  change and the place a subtle regression (wrong section order, a stranded
  one-off element) is most likely. Mitigated by shipping Phase 1 first and by the
  node-identity + ghost-box tests.
- **DEV-variant coupling gotcha.** Panes that delegate to `dev.renderVariant`
  assume a fresh empty container each call. Keep clearing *only* the variant
  subtree (DEV-only, tree-shaken) while the surrounding pane goes incremental —
  don't accidentally make prod depend on the variant's clear-and-rebuild.
- **Big-bang helper vs incremental.** Building the full `reconcile.ts` up front
  risks over-designing before a real client exists; hand-rolling per surface
  risks drift. Recommendation below.
- **Effort estimate (rough):** Phase 1 ≈ helper + 7 simple surfaces (small,
  mechanical). Phase 2 ≈ the two structural splits (the bulk of the work). Phase
  3 ≈ small. Each phase is a self-contained set of small commits.

### Open questions for the human (answer before Phase 1)

1. **Scope:** migrate **all** workspace surfaces, or **only the flash offenders**
   (`renderActions` + `renderCombat` + the meter cards) and leave the rarely-seen
   panes as-is?
2. **Cadence:** ship **per-phase** (each phase reviewed + merged on its own,
   revertible), or hold everything for **one big review**?
3. **Abstraction:** invest in the **shared `reconcile.ts` helper** (my
   recommendation — the intro already proves the shape), or **hand-roll**
   append-only logic per surface to avoid a premature abstraction?
4. **Alternative:** is a full flash-elimination in scope at all, or would a
   **cheaper stopgap** (throttle/skip `render()` when nothing relevant changed on
   an auto-tick — a coarse `prev`-equality gate at the `commit()` seam) buy
   enough relief to defer the engine work?
5. **Invariant test as a gate:** should the "idle re-render = zero DOM churn"
   assertion become a **standing test** every migrated surface must pass (my
   recommendation), or a one-time manual check?

---

*Reading-queue note (do not edit here): this plan must be added to the human
reading queue in `project/todo-human.md` — the main session will wire it up on
commit (a new `docs/plans/*.md` hard-blocks the pre-commit queue gate otherwise).*
