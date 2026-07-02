# Multi-panel layout — filling the screen inside the tabbed shell

**Status:** 📝 proposal — awaiting human sign-off + a D-075 diverge build.
**Date:** 2026-07-02 · **Author:** Claude Code (Opus 4.8 1M).
**Feeds:** playtest F11 (multi-panel, 5–7 panels felt like only 2). **Overlaps:**
F9 (log filter bar — untouched, the log stays one slice), F20 (unread badges —
untouched). **Home doc on lock:** `docs/living/ui-design.md` §4.7/§4.8 layout
section.

---

## Human decisions (2026-07-02)

The human resolved the §7 open questions this way:

- **Shell width / §4.7:** the human does **NOT** want the centered ~1200px paper
  column — **explore broadly.** "Now's the time to try options." The §4.7
  centered-column rule is being **SUPERSEDED** for the multi-panel layout (D-022;
  an ADR to follow). [answers the §7·2 shell-width open question]
- **Number of variants:** the human explicitly OK'd going **beyond 2–3** — up to
  **5–7 variants, or a MATRIX like 3×3×3 = 9+ combos.** Build direction:
  implement as **INDEPENDENT VARIANT AXES** (e.g. arrangement × framing ×
  log-placement), each a small DEV variant surface, so ~9 implementations yield
  many live combos rather than dozens of bespoke layouts. §4's "3 variants"
  framing is updated to this matrix-of-axes approach; the three named takes (A
  屏風 / B 番付 / C 巻物) survive as **reference points / axis anchors**.
- **Non-Work tab layout (§7·1)** and **variant-C log-rail height (§7·4):** **agent
  self-picks, human reviews live.**

---

## 1. Context

The v0.3.2 shell (playtest 2026-07-02, `render.ts` + `styles.css`) is a
fixed-header / flexible-content / fixed-footer app shell (§4.7), capped at a
**centered ~1200px paper column** on the ink ground. The workspace is a
**2-column grid** — `grid-template-columns: minmax(220px,1fr) minmax(0,1.5fr)`:
interactive **work/actions LEFT**, **story-log RIGHT** (F8). Top **tabs**
(Work · Estate 地図 · Skills 技 · Combat 武 · Quests 用) switch which content the
LEFT column shows; the log persists on the right.

Two problems the human flagged in F11:

1. **Wasted screen.** The 1200px cap leaves wide empty ink margins L and R on a
   normal monitor. The game feels like "only two panels" with "all the
   information slammed in" to the left column.
2. **Density mismatch.** Reference idle-RPGs spread information across many
   distinct panels; ours crams a tall scroll of stacked cards into one narrow
   column (actions, ladder, estate, market, storehouse, influence all stack
   vertically in `.work`, forcing internal scroll).

The tension F11 itself names: our signature is **"the UI unlocks itself"**
(README line 14 — "the first minutes… show a limited set of the UI… you unlock
more of the UI"). A dense 5–7-box dashboard of empty/locked panels would **kill**
that. So the human locked a narrower, reveal-gated take (below). This is a
structural restructure of the workspace region → it needs a plan + a **D-075
diverge** (3 working variants behind the DEV-panel toggle), not an inline slam.

### What renders where today (the raw material)

The `work` `<section>` holds ten panes appended in FEEL order (render.ts
~L477–489), each self-gating by an `isUnlocked` surface and by `activeTab`:

| Pane (class)        | Shows when                              | Rung-ish |
| ------------------- | --------------------------------------- | -------- |
| `actions`           | `activeTab==='work'` (always on Work)   | R0 awake |
| `ladder`            | Work + (`panel-rung-ladder` \| `raked`) | R0→R1    |
| `estate-pane`       | Work + `panel-estate`                   | ~R2      |
| `market-pane`       | Work + `panel-estate`                   | ~R2      |
| `storehouse-pane`   | Work + `panel-estate`                   | ~R2      |
| `influence`         | Work + `panel-house-influence`          | R7 cap   |
| `skills-pane`       | `activeTab==='skills'` + `tab-skills`   | R2/R3    |
| `combat-pane`       | `activeTab==='combat'` + `tab-combat`   | R3       |
| `quests-pane`       | `activeTab==='quests'` + `tab-combat`   | R3       |
| `map-pane`          | `activeTab==='map'` + gate-forecourt    | R1       |

Key observation: **the tab already segments** skills/combat/quests/map (they
hide unless their tab is active). The genuinely-multi-pane tab is **Work**, whose
six work-tab panes stack in one column. So "multi-panel" mostly means: **split
the Work tab's content into a few full-width slices, keep the log as its own
persistent slice, and let each tab's content flow into that same slice grid.**

The DEV variant machinery (dev.ts) already supports live A/B/C toggles per
"surface": `SURFACES` registry → `getVariant`/`setVariant` → the panel calls
`setVariant` + `rerender()`. We reuse it for a new **`layout`** surface.

---

## 2. Locked decisions (human, 2026-07-02)

1. **KEEP the top tabs.** The tabbed nav (Work · Estate 地図 · Skills · Combat ·
   Quests) stays. Multi-panel is about laying out **content within/around** the
   tabbed shell, not replacing tabs.
2. **Use the WHOLE screen.** Span the full viewport width; split the main game UI
   into **2 / 3 / 4 vertical slices**. The **story-log is just ONE slice** — it
   can move, resize, and use a different font. Fill the wasted L/R margin.
3. **3–5 panels, NOT 7.** A moderate split. 7 was too busy.
4. **Reveal-gated & SPARSE (max incremental).** Panels **appear as their surface
   unlocks**; early game stays sparse. **No dense dashboard of empty/locked
   boxes.** The "UI unlocks itself" signature is preserved.
5. **Presentation = D-075 diverge → 3 WORKING variants**, differing on BOTH
   **arrangement** AND **framing** (incl. a per-panel font choice for the log),
   self-picked prod default, the other two DEV-only behind a `layout` toggle.
6. **App-shell contract holds (§4.7):** 100dvh, fixed header/footer, no page
   scroll, panes scroll internally; reduced-motion honored; `≤720px` mobile
   fallback to stacked single-column page flow.

---

## 3. Panel breakdown — the concrete slices

The workspace becomes a **full-width, reveal-gated slice grid**. Instead of two
columns, name **five logical panels**; a slice is present only once at least one
surface inside it has unlocked, so the screen fills in over rungs. On the Work
tab the first three panels carry the work-tab panes; the tab-specific panels
(Skills/Combat/Quests/Map) reuse the **Do** slice's real estate when their tab is
active. The **Log** and **Vitals** panels persist across tabs.

### P1 · Do (the hero) — always present (R0)

- **Holds:** the `actions` pane — node meta-verbs (rake/rest), the wolf beat,
  room-grouped labour + auto-toggles, Cook, and the **Walk on 道** strip. On
  non-Work tabs, this same slice hosts the active tab's primary content
  (skills list / combat cards / quest cards / map).
- **Gate:** unlocked from `awake` (R0). This is the one panel that is **never**
  empty, so the layout is never a blank screen.

### P2 · Path & Progress — appears at first rake (R0→R1)

- **Holds:** the **rung `ladder`** card (current rank, meter, next rung) and — as
  they unlock — a compact **skills-progress** summary (top skill levels) and the
  **combat-level** meter. A "who am I / how close to the next rung" column.
- **Gate:** `panel-rung-ladder` OR the `raked` flag (matches today's ladder
  gate). Skills/combat summaries fold in under `tab-skills` / `tab-combat`.

### P3 · Estate & Economy — appears at the koku sinks (~R2)

- **Holds:** `estate-pane` (improve-estate flywheel + the reopened-rooms list),
  `market-pane` (the pedlar), `storehouse-pane` (kura balance / deposit-withdraw),
  and later the `influence` House-Influence panel (R7).
- **Gate:** `panel-estate` (all three economy panes already share this surface);
  `panel-house-influence` folds the influence card in at the capstone.

### P4 · The house remembers (story-log) — always present (R0)

- **Holds:** the `.log` section — heading, `log-lines` (scrolling narration), and
  the **F9 segmented filter bar** (Story / Work / Combat / Progress …) with F20
  unread badges. **This is the "one slice" the human called out** — its position,
  width, and font differ per variant (§4). It is a **global** panel (persists on
  every tab), the diegetic hero surface (ui-design §5.1).
- **Gate:** always (from the cold-open "The house remembers" line).

### P5 · Vitals / Hero — thin, folds up into the header early

- **Holds:** the survival read — `body`/`life` bars, koku/wood/sansai, the
  season clock — plus, once combat opens, the **equipped weapon + durability**
  and a compact **attribute** read (mirrors the combat-tab training card).
- **Gate:** the resource/body vitals already live in the **fixed header** (§5.7)
  and stay there in the sparse early game (no separate slice). P5 only
  **promotes to its own slice** once `tab-combat` unlocks (weapon/attrs give it
  enough to hold a column). Before R3 there is **no P5 slice** — this is a
  deliberate sparsity lever, not a gap.

### Reveal cadence (how the screen fills)

| Stage        | Visible slices                          | Column count |
| ------------ | --------------------------------------- | ------------ |
| R0 cold-open | **Do + Log**                            | 2 (sparse)   |
| R0→R1 raked  | Do + **Progress** + Log                 | 3            |
| ~R2 estate   | Do + Progress + **Estate/Econ** + Log   | 3–4          |
| R3 combat    | + **Vitals/Hero** slice                 | 4–5          |
| R7 capstone  | Estate/Econ gains the Influence card    | 4–5          |

Early game is **two slices on a wide screen** — intentionally sparse, *ma* not
emptiness. The multi-panel density is an **end-state**, revealed, never the R0
first impression. This is the crux of reconciling F11 with the signature.

---

## 4. The variants — INDEPENDENT AXES, not 3 bespoke layouts (D-075)

> **Reframed per the human's 2026-07-02 steer (see "Human decisions" above).**
> The human OK'd going **well beyond 3** — up to **5–7 variants or a 3×3×3 = 9+
> matrix**. Rather than hand-build a dozen bespoke layouts, implement the layout
> as **independent variant axes**, each a small DEV variant surface, so a handful
> of implementations combine into many live combinations:
>
> - **Arrangement axis** — how the slices are placed (columns / dashboard grid /
>   workbench-over-rail / …).
> - **Framing axis** — the boxing treatment (hairline dividers / full woodblock
>   `.frame` key-blocks / mixed).
> - **Log-placement axis** — where and how big the log slice sits, and its font
>   (right-wide reading face / peer card / full-width bottom rail / …).
>
> Each axis is toggled independently in the DEV panel; the renderer stamps the
> chosen values as data-attributes and CSS composes them. ~9 axis
> implementations then yield many live combos to review, instead of 3 fixed
> takes.
>
> The three originally-named takes below (A 屏風 / B 番付 / C 巻物) are **retained as
> reference points / axis anchors** — each is a coherent *preset* across the
> three axes (a good default combination), and a useful description of what each
> axis's ends look like. Read them as "here's one strong point in the matrix,"
> not "here are the only three options."

All variants: full-viewport width (the ~1200px cap is lifted for the workspace
region — see §5; and per the human steer the §4.7 centered column is being
superseded, so explore width broadly), reveal-gated slices (§3),
app-shell-compatible (§2.6). Each axis-combo is a real working `layout-*`
data-attribute set behind the DEV `layout` toggle.

### Variant A — 屏風 folding-screen columns (proposed prod default)

- **Arrangement:** **3 full-width vertical slices.** LEFT = **Do** (widest,
  `1.2fr`). CENTER = **Progress** stacked over **Estate/Econ** (`1fr`). RIGHT =
  **Log** (`1.3fr`, the widest reading column). When P5 Vitals promotes (R3), it
  becomes a **thin 4th slice** on the far left (`0.7fr`, the "hero rail"), pushing
  Do to center-left. Slices auto-collapse when their panel is hidden (2 slices
  early → up to 4 late).
- **Framing:** **hairline dividers**, minimal boxing — each slice is a paper
  column separated by a 1px `--ink-faint` vertical rule (the folds of a byōbu
  screen). Cards inside keep their existing `.frame` key-blocks, but the slices
  themselves are frameless, so the screen reads as one continuous paper field,
  not a grid of boxes. Header treatment: a small kanji slice-label at each
  column top (仕事 / 道 / 家 / 記).
- **Log:** RIGHT, **wide** (`1.3fr`), a **distinct reading face** —
  `--font-log: var(--font-body)` (Shippori Mincho body) at a **looser
  line-height (1.8)** and `--maxw-text` measure, vs the chrome's heading face.
  Reads like a page of a book beside the workbench. (No new asset — reuses a
  vendored/system face.)
- **Why default:** most faithful to §4.1 "deliberately asymmetric (*ma*), never a
  symmetric four-card grid," fills the width, and keeps the log the calm hero.

### Variant B — 番付 woodblock dashboard grid

- **Arrangement:** a **full-width auto-flow grid** where **each concern is its own
  bordered card** in a 3–4 column masonry (Actions card · Ladder card · Estate
  card · Market card · Storehouse card · Vitals card), and the **Log is a tall
  card spanning 2 grid rows** on the right. `grid-template-columns:
  repeat(auto-fill, minmax(min(100%, 20rem), 1fr))`; hidden cards drop out so the
  grid reflows (2 cards early → 6+ late). This is the "idle-RPG dashboard" take —
  the most literal reading of F11's "5–7 panels."
- **Framing:** **full woodblock `.frame` key-blocks on every panel** (the triple
  sumi rule + inner keyline), denser padding (§4.8 compact). Each card gets a
  heading bar. The busiest, most "many-panels" look — reveal-gating is what keeps
  it from being an empty-box wall early.
- **Log:** RIGHT, **medium** (`grid-column` spanning 1, `grid-row` spanning 2), a
  **framed card** matching the others; font stays the chrome body face (the log
  is a peer card here, not a special reading column) — the deliberate contrast
  with A/C.
- **Trade:** most information-dense; risk of reading busy even when gated. Kept as
  the "if the human wants the full dashboard" option.

### Variant C — 巻物 workbench + bottom message rail

- **Arrangement:** the **work content in 2 vertical slices across the top**
  (Do LEFT `1.4fr`, Progress+Estate/Econ+Vitals RIGHT `1fr`) and the **Log as a
  full-width bottom rail** — a GBA/JRPG message-box docked to the bottom of the
  content region (above the fixed footer), ~26–34% of the content height,
  internal-scroll. This directly exercises the human's "the log can be **moved**
  and **resized**" note — the log leaves the right column entirely.
- **Framing:** **hairline dividers between the two top slices + a single heavy
  brush-rule** separating the workbench from the log rail below (the seam of a
  handscroll). The log rail gets a subtly distinct **parchment** treatment (a
  faint bokashi wash, §4.4) so it reads as the "scroll" you unroll.
- **Log:** BOTTOM, **wide but short** (full width, capped height), a **different
  font** — the same `--font-log` reading face as A but sized up a touch
  (`--fs-body`+) for the GBA "text box" feel, tying into the F12/F19 typewriter
  cluster. The bottom rail keeps the filter bar pinned to its own foot.
- **Trade:** best for the story-forward feel (log is a wide stage); costs the log
  its tall vertical scroll. Strong alternate if the human wants story centered.

**Self-pick:** **Variant A** ships as the prod default (`layout-a` = `variants[0]`
in the registry). B and C are DEV-only, stripped from prod, each filed as its own
R-item in `project/human-in-the-loop/review.md`.

---

## 5. Build approach

### 5.1 A `layout` DEV variant surface

Add to `SURFACES` in `src/ui/dev.ts` (newest → front-loaded per F16):

```ts
{
  id: 'layout',
  label: 'Workspace layout',
  variants: [
    { id: 'layout-a', label: 'A · 屏風 folding columns',
      blurb: '3 full-width slices, hairline dividers, wide reading-face log right (default).' },
    { id: 'layout-b', label: 'B · 番付 dashboard grid',
      blurb: 'Auto-flow woodblock cards; log a tall framed card, 2 rows right.' },
    { id: 'layout-c', label: 'C · 巻物 workbench + bottom rail',
      blurb: 'Two work slices up top; log a full-width GBA message rail at the bottom.' },
  ],
}
```

**Unlike the other surfaces, `layout` is structural, not a `renderVariant`-into-a-
container surface.** It does **not** need a branch in `renderSurfaceVariant`.
Instead the renderer reads the chosen id once per render and stamps it on the
workspace as a data-attribute; **CSS does all the arranging.** The existing DEV
panel toggle already calls `setVariant('layout', id)` + `rerender()`, so the
switch is live with zero extra panel code.

### 5.2 Renderer changes (`src/ui/render.ts`)

- In `mount()`, after building `workspace`, wrap the current children into named
  **slice containers** rather than appending `work` + `logSection` directly:
  - `sliceDo` (holds `actions`, and — via tab-switch — the skills/combat/quests/
    map panes; these already hide by `activeTab`).
  - `sliceProgress` (holds `ladder` + a future skills/combat summary).
  - `sliceEstate` (holds `estatePane`, `marketPane`, `storehousePane`,
    `influence`).
  - `sliceLog` (holds `logSection`).
  - `sliceVitals` (holds a promoted weapon/attr read; empty/hidden pre-R3).
  Each slice is a `<section class="slice slice-do" …>`; the panes keep their
  current classes and self-gating untouched (minimal churn).
- Each render, set `workspace.dataset.layout` = the chosen variant:
  ```ts
  const layout = import.meta.env.DEV && dev ? dev.getVariant('layout') : 'layout-a';
  workspace.dataset.layout = layout;
  ```
  Prod always folds to `'layout-a'` (the `import.meta.env.DEV` guard tree-shakes
  the dev read out — same pattern as the influence/market variant guards).
- **Slice visibility = reveal gating.** A slice is `hidden` when **all** its
  panes are hidden. Simplest robust approach: after the per-pane render calls,
  set `slice.hidden = slice.querySelector(':scope > :not([hidden])') === null`
  (or track a small count). Hidden slices drop out of the grid so tracks
  collapse — this is what makes early game 2 slices and late game 4–5, with **no
  empty boxes** (locked decision #4).
- No changes to `src/core` — layout is pure presentation (D-075: nothing in core
  branches on a variant).

### 5.3 CSS changes (`src/ui/styles.css`)

- **Lift the width cap for the workspace region.** Today `.shell` is
  `max-width:1200px`. To "use the whole screen" (decision #2), let the
  **workspace** span wider than the header/footer column — either raise the shell
  cap (e.g. to `min(1600px, 96vw)`) or let `.workspace` break out to full width
  while header/footer stay centered. Proposed: raise `.shell` max-width and let
  the slice grid consume it; keep generous ink-ground margin only past a max
  (so it never spans a full ultrawide edge-to-edge).
- Drive arrangement entirely from `.workspace[data-layout="…"]`:
  - `layout-a`: `display:grid; grid-auto-flow:column; grid-auto-columns` per
    slice `fr`; hairline `border-left` dividers on inner slices.
  - `layout-b`: `display:grid; grid-template-columns:repeat(auto-fill,minmax(min(100%,20rem),1fr)); grid-auto-flow:dense;`
    log card `grid-row:span 2`.
  - `layout-c`: `display:grid; grid-template-rows: minmax(0,1fr) auto;` a top
    row of 2 work slices + a bottom full-width `sliceLog` rail (capped height,
    `overflow` internal).
- **Hidden-slice collapse:** rely on `[hidden]{display:none}` (already global) —
  a display:none grid child leaves no track in `grid-auto-flow`/`auto-fill`, so
  the grid self-compacts. For `layout-a`'s explicit `fr` tracks, use
  `grid-auto-columns` + `grid-auto-flow:column` (auto tracks) rather than a fixed
  `grid-template-columns`, so a hidden slice simply isn't placed.
- `--font-log`: add a var defaulting to the body reading face; A/C set a looser
  `line-height`/measure on `.slice-log .log-lines`; B leaves it at chrome body.
- **App-shell contract (decision #6):** every slice is `min-height:0;
  overflow-y:auto` so panes scroll **internally**; the workspace stays the single
  `flex:1 1 auto; min-height:0` middle region — no page scroll. The `layout-c`
  bottom log rail is a capped-height internal-scroll region, not page flow.
- **Mobile (`≤720px`):** the existing fallback already stacks to one column +
  natural page flow; extend it to force **all** `data-layout` values to a single
  stacked column (`grid-template-columns:1fr; grid-auto-flow:row`) so the three
  variants converge on mobile.

### 5.4 Reduced-motion & a11y

- No new animation is required for the arrangement itself (it's static grid). Any
  slice reveal reuses the existing `.reveal`/`ink-in` (already RM-neutralised).
- Each slice `<section>` keeps/gets an `aria-label` (e.g. "Work", "Progress",
  "Estate & economy", "Story log", "Vitals"); the log keeps its `aria-live`.
- Tab-order follows DOM order (Do → Progress → Estate → Vitals → Log); confirm it
  reads sensibly in each variant (C's bottom log reads last, which is fine).

---

## 6. Reconciliation with reveal-based progression

This is the load-bearing constraint (README line 14; §4.7 reveal note). The plan
keeps it intact three ways:

1. **Slices are gated by the SAME surfaces already in use** (`panel-rung-ladder`,
   `panel-estate`, `tab-combat`, `panel-house-influence`), so multi-panel adds
   **no new content**, only **rearranges** what unlocking already reveals. A
   panel cannot appear before its content does.
2. **Empty slices are removed, not shown locked.** Decision #4's "no dense
   dashboard of empty boxes" is enforced by §5.2's hidden-when-all-panes-hidden
   rule — early game is literally 2 slices wide, and each new slice **inks in**
   as its first surface unlocks, so the *widening of the screen itself* becomes a
   progression beat (the UI-as-progression signature, now spatial).
3. **The tab model is untouched.** Skills/Combat/Quests/Map still gate the nav
   tabs and their panes; the multi-panel grid only changes how the **already-
   revealed** panes are arranged, never what's reachable.

Net: the first 5 minutes still show a near-empty wide paper field with a Do panel
and a Log — sparser than any reference idler — and the dashboard density is an
**earned end-state**. F11's ask is satisfied without betraying the signature.

---

## 7. Risks & open questions

1. **Non-Work tabs in a multi-slice grid.** Today skills/combat/quests/map render
   into `work` and hide on other tabs. In A/B, when you switch to Combat, does
   the Combat content fill the **Do** slice (Progress/Estate/Log persist), or
   does the whole grid re-lay-out for that tab? **Proposed:** Do slice hosts the
   active tab's content; Progress/Estate collapse on non-Work tabs (their gates
   already return `activeTab==='work'`), so Combat shows **Do(combat) + Log**
   (+ Vitals). Confirm that feels right vs. a per-tab bespoke grid. **Needs a
   human/playtest call.** **[2026-07-02: agent self-picks, human reviews live.]**
2. **Lifting the width cap** (§5.3) touches the §4.7 "centered ~1200px paper
   column" contract — arguably a *change to what the game is* visually. Options:
   (a) widen the whole shell; (b) keep header/footer centered but let the
   workspace break out wider. **Open:** which, and what max width before the ink
   margin returns (ultrawide guard)? Likely an ADR / ui-design §4.7 amendment.
   **[ANSWERED 2026-07-02: the human does NOT want the centered ~1200px column —
   explore width broadly; §4.7 is being SUPERSEDED for the multi-panel (D-022,
   ADR to follow).]**
3. **`grid-auto-flow` track collapse** with explicit `fr` weights in A: auto
   tracks lose per-slice `fr` control. May need a JS-set class encoding the live
   slice count (`data-slices="2|3|4"`) to pick a matching `grid-template-columns`
   — a small, deterministic fallback if `:has()`/auto-flow proves fiddly.
4. **Log-as-bottom-rail (C) height.** A short rail may hide too much narration on
   a laptop; needs a min-height + playtest. Interacts with the F12/F19 slow
   typewriter (a short rail scrolls more). **[2026-07-02: agent self-picks, human
   reviews live.]**
5. **"Different font for the log"** must reuse an existing vendored/system face
   (no new asset pipeline, §4 anti-slop). `--font-log` = the Shippori body face
   at a looser leading is the safe read; confirm it's visually distinct enough
   from the chrome to satisfy the human's "even use a different font."
6. **DEV `layout` surface is structural**, not a `renderVariant` surface — verify
   the panel toggle + `rerender()` path drives a data-attribute swap cleanly, and
   that the prod strip-guard still proves it's stripped (it should: it's read via
   the same `import.meta.env.DEV && dev` guard).
7. **Interaction with F9 filter + F20 unread badges** — the log stays one slice,
   so these are unaffected; just verify the filter bar pins correctly in the
   bottom-rail (C) placement.

---

## 8. Definition of done

- `layout` surface in `SURFACES` with `layout-a|b|c`; prod ships only `layout-a`
  (strip-guard green).
- Workspace refactored into named slice `<section>`s; slices reveal-gate by their
  panes' existing `isUnlocked` surfaces; empty slices collapse (no empty boxes).
- All three variants render, live-switchable via the DEV panel, each app-shell-
  compatible (100dvh, no page scroll, internal pane scroll) and reduced-motion-
  clean; `≤720px` collapses all three to the stacked single column.
- Early game (R0) shows exactly **Do + Log**; the screen demonstrably fills as
  surfaces unlock (verified against a rung walk-through).
- Three R-items filed in `project/human-in-the-loop/review.md` (one per variant);
  ui-design.md §4.7/§4.8 updated on lock; this plan graduates to
  `project/archive/` when built.
