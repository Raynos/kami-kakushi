---
name: taste
description: The distilled design taste from the 117-item playtest — read before building any UI/feature
metadata:
  type: reference
---

# Taste standard — the distilled bar for future features

This document is the **distilled taste** from a single 117-item human playtest of
the live build (F1–F117). It is not a bug list — the bugs are fixed. It is the
**standing taste** those 117 corrections point at, compressed so a future
feature-builder internalizes it once and never earns the same feedback twice.

**How to use it.** Read this **before** building or restyling any UI surface,
feature, or narrative beat. Then run the **Pre-ship checklist** at the bottom
against the finished work before you call it done. Each principle names its
**home doc** — go there for the concrete tokens/values. The principles are
ordered by leverage: the top ones were corrected the most times and cost the
most rework.

---

## The principles

### 1 · One capability, one home — and delete the old copy when it moves
Every control, action, or status display gets **exactly one thematic home**, and
the moment it moves homes you **delete the original** — a leftover is a
duplicate, not a "secondary cue."

- **Homes:** labour → Work · movement/people → Map · holdings/bank → Inventory ·
  house upgrades → Estate · core progression (rung) → header · persistent app
  controls (version/Settings/DEV) → footer.
- **Do:** name a control's one home before you add it; when a display relocates,
  remove the old render in the same change.
- **Don't:** let a capability be operable from two tabs (walking from Work *and*
  Map); keep an old panel as a "secondary cue" after its content moved; dump an
  NPC's whole shop menu inline in an unrelated tab.
- **F:** F38, F92, F100, F107, F108, F109, F110, F112, F116 · **Home:**
  [ui-design.md](ui-design.md) (§ IA/tabs).

### 2 · Render append-only — never wholesale-reset a container
Build the DOM once, then **diff and append/patch only the changed nodes**. A
`container.innerHTML = …` / `.textContent = …` rebuild on a state change is the
single most expensive defect this session — it flashes the whole page, wipes
in-progress typewriters, resets scroll/focus, and resizes cards (F81 is the named
root cause of a whole cluster).

- **Do:** patch nodes; track animation timers by handle and clear them
  explicitly; swap phase content *in place* within a persistent container.
- **Don't:** re-run a render fn that resets a container and rebuilds children;
  assume the HMR path can't serve a broken intermediate — guard for it.
- **F:** F55, F60, F78, F80, F81, F82, F83, F84 · **Home:** [ui-design.md](ui-design.md)
  (rendering-model rule).

### 3 · The one typewriter contract — honor all of it, everywhere
All narration/dialogue routes through **one shared typewriter primitive** so
every scene and channel inherits the same behavior: **char-by-char,
left-aligned, auto-advancing** on a ~2s timer; a **click completes the current
line then continues** (never skips the block, never hard-pauses); **every
fragment types on first appearance** — narrator, "You:", NPC answers, choice
outcomes alike; **reduced-motion → instant**. Scope it to story/narration only,
never combat/work spam.

- **Do:** funnel every spoken/narrated line through the one primitive.
- **Don't:** hand-render text in a new overlay/scene bypassing it; center
  typewritten text (it re-centers each keystroke and jitters); let a click
  fast-forward or pause; leave any fragment popping in un-typed.
- **F:** F12, F19, F39, F46, F54, F62, F78, F82, F83, F86 · **Home:**
  [ui-design.md](ui-design.md) (§5.13 VN + feel nod [fun-factor.md](fun-factor.md)).

### 4 · Tag voice at the source; the renderer only applies it
Every emitted line carries its **speaker + voice/category set in pure-core**. The
renderer then **prefixes the speaker name** ("Sōan:", "You:") and **colours by
character category** from a single-source palette — narration included,
everywhere, not just the intro. The **name is the primary who's-talking signal**;
colour only reinforces.

- **Do:** set speaker+voice at emission; give ALL narration the narrator voice so
  labour/reveal/system flavour matches the intro.
- **Don't:** emit lines with no voice fields; rely on colour alone; leave any
  channel's flavour (rake, reveal) rendering plain black beside voiced dialogue.
- **F:** F23, F26, F50, F57, F88, F91 · **Home:** [ui-design.md](ui-design.md) (§5.1).

### 5 · Route every line by its narrative weight — keep channels disciplined
Each log line goes to the **one channel that matches what it is**: **Story** =
mandatory beats only · **Chat** = optional Q&A the player chose to ask ·
**Progress** = earned progression (stat leans, unlocks, rungs) · **Work** =
notable labour · **Combat** = fights · **Now** = fleeting flavour that expires.
Order tabs by importance (Story · Progress · Chat · Combat · Work · All · Now).

- **Do:** send a rung/unlock to Progress, a scene beat to Story, navigation
  flavour to the Map node description, repetitive spam to Now.
- **Don't:** dump promotion prose in Combat, a stat-grant in Work, optional Q&A
  in Story, or navigation flavour in Story.
- **F:** F41, F52, F53, F103, F111, F114 · **Home:** [ui-design.md](ui-design.md) (§5.1
  channels).

### 6 · Every stateful control advertises its state
A control must show which of its states it's in — the player never guesses which
option is on, which is new, or which they've already tried.

- **Do:** highlight the active choice in a mutually-exclusive set; badge a
  channel/tab with an unread dot when new content lands in a view you're not on
  (cleared on visit); render an explored-but-repeatable option visibly dimmed;
  carry a stable reference number on each option where one gets cited.
- **Don't:** leave a set of exclusive controls with no active indicator; hold a
  stale unread badge after a visit; render an already-tried option identically to
  a fresh one; conflate dimmed (repeatable) with disabled.
- **F:** F17, F20, F49, F87 · **Home:** [ui-design.md](ui-design.md).

### 7 · Two density registers, never one global scale
Game **chrome is tight and information-dense** (HUD, resource rows, tabs, action
buttons, panel headers — like a reference idle-RPG). **Reading and ceremonial
surfaces are generous** (log, story beats, intro VN, modals, the cold-open,
About). Size each surface to its job from shared tokens.

- **Do:** keep distinct density tokens for chrome vs reading/ceremony.
- **Don't:** apply one root font-size or one spacing pass across the whole app; a
  global "compact it" must never starve the cold-open, a modal, or the log.
- **F:** F10, F14, F29, F73, F98 · **Home:** [ui-design.md](ui-design.md) (density section).

### 8 · Player reading-comfort scales TEXT only — and persists
A runtime reading-comfort control multiplies the **type tokens only** — never the
root rem unit — so scaling text never reflows layout, and the choice **persists to
the save**. This is orthogonal to the designer-set density registers (P7).

- **Do:** wire A-/A+ steppers to the type tokens; allow per-panel comfort (the log
  owns its own stepper); persist the setting across reloads.
- **Don't:** scale the rem unit (it reflows the whole UI); let the choice reset on
  reload; fold reading-comfort into the designer's density pass (that's P7).
- **F:** F30, F74 · **Home:** [ui-design.md](ui-design.md) (§8 a11y) + persistence.

### 9 · Every revealed surface renders complete or not at all
At any state/rung/tab transition or column width, a panel is **fully painted** —
no half-drawn panels, empty ghost/meter boxes, overlapping cards, or controls
floating over their own text.

- **Do:** keep every control in normal document flow (its own cell/row); let
  stacked cards size to content and flow; lay a small set of parallel choices as
  a side-by-side grid (2×2 / 1×3).
- **Don't:** absolutely-position action buttons over copy; give stacked panels
  fixed heights / negative margins that clip; render an empty meter box; expose a
  panel before it has real content.
- **F:** F63, F67, F72, F94, F98 · **Home:** [ui-design.md](ui-design.md) (§4.7 reveal/transition
  integrity).

### 10 · A fixed-shell, viewport-sized dashboard — no page scrollbar
One full-height flex column: **pinned header** (identity + vitals + the rung) /
**flex:1 min-height:0 content that scrolls internally** / **pinned footer**
(persistent controls). Sized to 100dvh with **no page scrollbar**. Core
progression (the rung) is a persistent header element with hover-for-detail. Any
sub-panel with a footer uses fixed-head / scroll-body / fixed-footer so the
footer never scrolls away.

- **Do:** put always-relevant state in the header, persistent chrome in the
  footer; fall back to natural page flow on narrow screens.
- **Don't:** let the whole page scroll because content exceeds the viewport;
  bury the rung in a scrolling column; append a panel's action footer inside its
  scroll body.
- **F:** F5, F6, F37, F104, F106, F116 · **Home:** [ui-design.md](ui-design.md) (app-shell).

### 11 · The reading/log column is first-class but proportionally bounded
The reading/log column is first-class yet **bounded** — sized against the *capped
container* (never raw `vw`), roughly **⅓ to ~46%** of the workspace, right-placed
and framed with L/R gutters; the work/action fold holds the majority and fills as
panels unlock.

- **Do:** hold the log to a ⅓ floor and a ~46% ceiling of the capped workspace;
  place it on the right with L/R gutters; let its text reflow to fill the real
  width; give the work fold the majority.
- **Don't:** size the log against raw `vw`; let it balloon past ~⅔ (the F117
  regression); full-bleed the multi-panel spread; starve the log below ⅓.
- **F:** F8, F69, F70, F117 · **Home:** [ui-design.md](ui-design.md) (§4.7).

### 12 · The transcript sticks to the bottom; scroll regions separate cleanly
A log/transcript view **auto-scrolls smoothly to the newest line and stays
pinned to the bottom** as content arrives; on any filter/tab switch it **lands at
the bottom instantly**. The **panel itself is the scroll container** (scrollbar
at its true right edge), with a header border + soft top fade so lines never
hard-cut under the header, and text **reflows to fill the real column width**.

- **Do:** stick-to-bottom on the main log AND the intro story column.
- **Don't:** reset scroll to top on re-render/tab-switch; hold a stale position
  while fresh lines pile off-screen; wrap text at a fixed narrow measure; put the
  scrollbar mid-panel.
- **F:** F7, F28, F51, F77, F84, F85 · **Home:** [ui-design.md](ui-design.md) (§5.1).

### 13 · One shared fresh-entries divider across every transcript
New content arriving in **any** transcript is marked by **one shared, fade-away
"fresh-entries" divider** — never a per-surface reinvention (the same
one-primitive discipline P3 applies to the typewriter).

- **Do:** reuse the main-log divider in the intro story column and every
  transcript; fade it after a beat; use the same idiom to separate narration from
  the choice prompt in a VN scene.
- **Don't:** invent a second divider for the intro column; leave freshly-arrived
  content unmarked; let the divider persist instead of fading.
- **F:** F27, F40, F76 · **Home:** [ui-design.md](ui-design.md) (§5.1).

### 14 · Nothing appears un-motivated — discover, don't spawn
A new entity (NPC, vendor, panel, capability) appears **because a beat introduces
it**. Story-significant **interactive** NPCs get a full-screen VN introduction
(D-104); ambient ones get at least a line; nothing silently pops in. **A rung
promotion is a player-initiated story beat** that narratively motivates each
unlock it grants — never a silent number-fill with a stray flavour line (the UI
reveal *follows* the story). **Vendors are people you talk to**, surfaced via
"who's here at this node" — not shop menus dumped inline.

- **Do:** model promotion as pending → player-triggered VN beat → apply + reveal;
  author prose explaining why the gate/paddies/repairs open.
- **Don't:** materialize an NPC/vendor/panel with no cause; auto-promote on
  meter-fill with an icon flip; inline a vendor's whole shop.
- **F:** F45, F97, F99, F103, F109, F110 · **Home:** [decisions.md](decisions.md) (D-104/D-110)
  + [ui-design.md](ui-design.md).

### 15 · Narrative-mechanical coherence — if the prose names it, it exists
Story promises are a **Chekhov's-gun checklist**. If the fiction names a concrete
thing — a home to rest in, a dry corner, a bowl, belongings, a location you
started in — it must exist as a **reachable game entity**. Characters the story
establishes stay **real and revisitable**.

- **Do:** audit named things against what's built; keep every visited location
  reachable; keep established NPCs (Sōan, Genemon) talkable at their nodes; let
  placement evolve by tier/rung.
- **Don't:** promise affordances the mechanics don't back; strand a
  previously-visited location; consume a story NPC into a one-shot intro.
- **F:** F89, F97, F99, F109, F110, F113 · **Home:** [fun-factor.md](fun-factor.md) + a design
  tenet.

### 16 · Dialogue is an interactive VN, not a wall or a script
Character dialogue is **incremental** (advance beat by beat), **ask-then-decide**
(explore question topics → an explicit "done questioning" gate → the
story-advancing decision), and **every choice resolves in place**: show the
player's line + the NPC's reply, then require an explicit **Continue** — never a
silent cut to the next scene. The interactive region is a **stable fixed-size
frame**: content swaps within it, the story column scrolls internally, the frame
never hides, resizes, or rebuilds under the player.

- **Do:** build meet → ask-topics hub (+ Done gate) → balanced decision → reply
  in place → single Continue; keep the committing control hidden until
  exploration closes.
- **Don't:** dump one-way narration the player can't answer; force a linear
  script; teleport to the next scene on a choice; grow the card with Q&A; hide or
  re-animate the interactive column between phases.
- **F:** F13, F42, F47, F62, F64, F65, F79, F80 · **Home:** [ui-design.md](ui-design.md)
  (§5.13) + D-104.

### 17 · Write reward/outcome prose diegetically and self-contained
An outcome says **what the player chose and what it costs in the fiction**; the
mechanical ± is context, never the whole line. Frame rewards as **named perks** —
a perk name + a **standalone** description that reads on its own later (it may
name Sōan/Memory/Genemon) + the mechanics — single-sourced so the flavour always
matches the applied trade. Render them as old-school JRPG "learned" boxes, **in
the woodblock/ink palette**.

- **Do:** give each choice a grounded in-period outcome sentence with the ±
  woven in as context.
- **Don't:** emit a bare stat delta; write outcome flavour so tied to the
  immediate scene it's meaningless when re-read in the log.
- **F:** F42, F56 · **Home:** [ui-design.md](ui-design.md) + [fun-factor.md](fun-factor.md).

### 18 · Incremental reveal is the signature — design the dense dashboard AND its unlock together
The destination is a 5–7-panel idle-RPG dashboard; the game **unlocks that UI
over time**. The two are designed together, not in tension. A **sparse early
screen is correct**, not a bug. A full-screen scene **hides the whole shell**,
then the UI **inks in** afterward (never a silent number-fill or an unexplained
pop-in). Reveals fire **while the player is watching**, once, after the gating
interaction; the **live scene owns the animation, the log is an instant
historical transcript**. Transient (Now) entries fade AND slide the rest up, on a
**wall-clock timer that runs even when the tab isn't open**.

- **Do:** gate each panel behind its unlock; ink the shell in after a full-screen
  scene; paint history instantly.
- **Don't:** cram every surface in from the start; pre-run an animation behind a
  curtain; make the player watch the log replay choices they already made; gate an
  expiry timer on the view being open.
- **F:** F11, F15, F44, F48, F55, F58, F76, F79, F80, F97, F115, F117 · **Home:**
  [ui-design.md](ui-design.md) + [fun-factor.md](fun-factor.md).

### 19 · Every surface is in-palette — no raw white, no browser defaults
Every surface inherits the game's dark ink ground via shared variables —
**including DEV tooling, modals, error states, and reward boxes**. A caught render
crash draws a **full-viewport intentional ink/washi error modal** (progress-saved
+ reload), never a banner over a broken page. Reconcile any new visual idiom
(JRPG boxes, attribute pigments) with the woodblock palette; each attribute owns
one signature pigment used as a legible accent, not a flood-fill. Text/reveal
prose is **always left-aligned**; a lone primary action inherits its card's
center axis.

- **Do:** single-source the palette + attribute tokens (`--attr-*`); wire the
  error modal on `<body>`, idempotent, styles inline so it can't itself throw.
- **Don't:** leave a raw-white/browser-default background anywhere; ship a small
  banner over a broken page; introduce a clashing out-of-palette accent (flat
  red).
- **F:** F1, F3, F54, F56, F61, F66 · **Home:** [ui-design.md](ui-design.md).

### 20 · App-info surfaces are organized and reachable
App-info is organized and reachable — settings split into **Settings / Saves /
About** sub-tabs (not one long column), save management is a streamlined surface,
and the **single-sourced** footer version is clickable to an About modal that
deep-links the CHANGELOG.

- **Do:** sub-tab the settings modal (Settings / Saves / About); streamline the
  manage-saves UI; single-source the footer version from `package.json` and make
  it open the About modal; deep-link `CHANGELOG.md` from About.
- **Don't:** stack settings in one long column; hand-type the version string;
  leave the footer version inert; hide the changelog.
- **F:** F31, F104, F105 · **Home:** [ui-design.md](ui-design.md) (§ chrome/About)
  + repo convention (`CHANGELOG.md`).

### 21 · DEV/tooling is a zero-footprint overlay held to the game's own standards
Dev chrome is a `position:fixed` overlay that **reserves zero player-layout
space** (the game centers on the full viewport as if it's absent), with a
`?dev=no` opt-out to preview the true layout. Hold the tooling to the game's IA:
organized sub-tabs, a truly fixed footer outside the scroll body, no duplicate
controls, clear per-control hit-areas. **Destructive actions (New Game) are BOTH
hard to mis-hit AND recoverable** — half-width/offset, plus an auto-backup +
one-click restore. DEV teleports/fast-forwards must be **cheap** — never a
synchronous main-thread sim loop that freezes the page. **A loaded save starts
idle** — persist progress, not in-flight automation; on New Game reset the
renderer's UI state (tab → Work, filter → Story) too, and treat loaded history as
already-seen.

- **Do:** offset destructive controls off the common click path; snapshot before
  a wipe; reset transient "currently auto-doing X" + seen-markers on load.
- **Don't:** let tooling occupy a layout column or reserve a gutter; put a
  run-wiping button full-width in a double-click path; restore in-flight
  automation on refresh; let loaded history read as unread.
- **F:** F2, F4, F16, F24, F25, F32, F38, F59, F92, F95, F96 · **Home:**
  [qa-playtesting.md](qa-playtesting.md) (DEV tooling) + [ui-design.md](ui-design.md).

### 22 · DEV/diverge tooling earns its own workflow ergonomics
Companion to P21: the DEV/diverge panel follows the game's IA at the *workflow*
level — variants split from settings and ordered by importance, per-surface
V-numbering, approve-strips-losers, URL round-trip, source-derived rosters, and
HMR off during hand playtests.

- **Do:** split Variants from Settings and order them by importance as collapsible
  per-surface summaries; number per surface (number = surface, letter = variant:
  V6A/B/C); on approve, promote the winner to prod default and strip the losers
  immediately (zero PROD flag-debt); round-trip variant selections through URL
  params; stack list rows (title over muted detail, no cram-wrap); derive controls
  from source (the DEV rung control exposes the FULL roster and descends =
  reset+promote); turn dev-server HMR off so the playtester owns refresh.
- **Don't:** flat-number variants across surfaces; leave losing variants as prod
  flag-debt after approval; lose selections that can't round-trip a URL; cram list
  rows; hand-list a partial rung roster; let HMR serve a broken intermediate
  mid-playtest.
- **F:** F16, F17, F18, F35, F36, F43, F68, F75, F101 · **Home:**
  [qa-playtesting.md](qa-playtesting.md) (DEV tooling) + the `diverge` skill.

---

## Scope — what this standard does not cover

This is a **UI / narrative / aesthetic** taste standard. **Game-systems taste** —
distinct resources with distinct recovery loops, balance, the shape of a mechanic
(e.g. **F22**: work-stamina and health are separate meters, each with its own
recovery action, never conflated) — lives in [prd.md](prd.md) + an ADR in
[decisions.md](decisions.md), **not here**. Respect coherent, per-concern systems
as their own taste; just don't look for them in this doc.

---

## Pre-build / pre-ship checklist

Run these yes/no questions against the finished feature. A **no** on a *do* or a
**yes** on a *don't* means it isn't done.

**Information architecture**
- [ ] Does every new control/status live in exactly ONE thematic tab/region — and
  did I delete the old copy where it moved from? (P1)
- [ ] Is anything operable from two tabs at once? (should be no) (P1)

**Rendering & motion**
- [ ] Does the UI ever flash on a state tick, or does it append/patch nodes only —
  no `innerHTML`/`textContent` container reset? (P2)
- [ ] Does every narrated/spoken fragment type in char-by-char, left-aligned,
  auto-advancing, click-to-speed-not-skip, reduced-motion→instant — through the
  ONE typewriter primitive? (P3)
- [ ] Does the transcript stick to the bottom (main log + intro column), land at
  bottom on tab switch, reflow to full width, and scroll inside the panel? (P12)
- [ ] Does every revealed panel render complete — no ghost boxes, no controls
  overlapping their own text at any width? (P9)
- [ ] Do reveals fire while the player is watching (after the gating interaction),
  once, with the live scene owning animation and the log instant? (P18)
- [ ] Do Now/ephemeral entries expire on a wall-clock timer even when their tab is
  closed? (P18)
- [ ] Does every stateful control show its state — active choice highlighted,
  unread badge on off-view channels (cleared on visit), explored options dimmed
  (dimmed != disabled)? (P6)
- [ ] Is new content in ANY transcript marked by the ONE shared fade-away
  fresh-entries divider — never a per-surface reinvention? (P13)

**Voice & narrative**
- [ ] Does every emitted line carry a speaker + voice set in pure-core, and does
  the renderer prefix the name + colour by category — narration included? (P4)
- [ ] Is each line on the channel that matches its weight (Story/Chat/Progress/
  Work/Combat/Now), with tabs ordered by importance? (P5)
- [ ] Does anything appear un-motivated — an NPC/vendor/panel/rung that pops in
  with no discovery beat? (should be no) (P14)
- [ ] Is every concrete thing the prose names actually reachable in-game, and do
  established NPCs stay talkable? (P15)
- [ ] Is a rung-up a player-initiated VN beat that motivates each unlock, not a
  silent number-fill? (P14)
- [ ] Is dialogue ask-then-decide, resolving in place with an explicit Continue,
  in a stable fixed-size frame? (P16)
- [ ] Does every reward read as a named, standalone perk with the ± as context —
  never a bare stat dump? (P17)

**Aesthetic**
- [ ] Are game chrome and reading/ceremony surfaces on TWO density registers, not
  one global scale? (P7)
- [ ] Is every surface (incl. DEV, modals, error states, reward boxes) in the
  woodblock/ink palette — no raw white, no browser defaults? (P19)
- [ ] Is a caught render crash a full-screen intentional error modal, not a banner
  over a broken page? (P19)
- [ ] Do player text-scale controls multiply the type tokens only (never the rem
  unit, so layout never reflows) and persist to the save? (P8)

**Shell & tooling**
- [ ] Is the app 100dvh with no page scrollbar, fixed header/footer, internally
  scrolling content, and the rung persistent in the header? (P10)
- [ ] Does DEV chrome reserve zero player-layout space (verify with `?dev=no`),
  with destructive actions hard-to-mishit AND recoverable, and cheap teleports? (P21)
- [ ] Does a New Game reset the UI state too, and does a loaded save start idle
  with history already-seen? (P21)
- [ ] Is the reading/log column proportionally bounded (≈⅓–46% of the capped
  workspace, not raw vw), right-placed with L/R gutters, the work fold holding the
  majority? (P11)
- [ ] Are app-info surfaces organized and reachable — Settings/Saves/About
  sub-tabs (not one column), streamlined saves, and a single-sourced clickable
  footer version opening an About modal that deep-links the CHANGELOG? (P20)
- [ ] Do DEV/diverge surfaces follow the ergonomics — variants split & importance-
  ordered, per-surface V-numbering, approve-strips-losers (zero PROD flag-debt),
  URL round-trip, source-derived rosters, HMR off in hand playtests? (P22)
