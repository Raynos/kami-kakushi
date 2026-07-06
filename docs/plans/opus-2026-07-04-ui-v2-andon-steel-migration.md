# Plan — UI-v2: the Andon Steel migration (v0.3.6)

**Status: 🖊️ PROPOSED — build-ready. Co-authored with the human (session 63,
2026-07-04); every design call is locked (see "Decisions"), and each milestone is
written as a concrete build card a Sonnet-class model can execute without taste
calls.** Awaiting the human's go to LOCK + start M1. Grounded in four analyses this
session (Andon Steel catalog · current-UI/locks delta · exact token-map + material
recipes · exact `render.ts` seams + variant wiring). Reference build:
`ui-demos/10-andon-steel/`.

## Premise (locked)

- **ADR-127:** Andon Steel is UI-v2's direction — a **FULL REPLACEMENT** of the
  washi/woodblock identity (no coexistence edition). The old identity retires.
- **`ui-demos/10-andon-steel/` is a VISUAL target only.** We port its *design
  language* (tokens, bimetal semantics, composition, animation *looks*). We do
  **NOT** port its code and we **copy zero bugs** (see Do-NOT-copy).
- **Keep our engine.** `src/ui/reconcile.ts` + `src/ui/render.ts`
  (build-once/patch, `reconcileList`, view-gating, number-pop, log
  scroll-preservation, the existing typewriter/stagger) + the **7-tab IA** are
  **style-agnostic — untouched**. UI-v2 changes *what classes/tokens/SVG the engine
  emits*, never how it emits. **Load-bearing fact:** the reconcilers key on element
  *identity* (a `WeakMap` on the container node, `reconcile.ts:15`), so a container
  can be **re-parented anywhere** and every `reconcileList` keeps working, as long
  as the same element object is passed and it holds only reconcile-owned children.
- **Pure core untouched** — no rule, number, or loop changes. Presentation only.

### Decisions locked with the human (2026-07-04)
- **Full replacement** of the washi identity.
- **Adopt the Andon composition** — header (top) · left-rail tabs · center desk ·
  right-hand log "window" (steel well). Layout moves, not just paint.
- **Commit-seal cursor CUT** — no red-flash-on-click; vermillion stays reserved for
  rank-up / ascension beats (M5), never per-click.
- **Re-theme ALL open variant surfaces to steel, then choose** (HR-2/HR-5/HR-6/HR-7) — each
  variant rebuilt in steel behind the DEV toggle; the human picks in the new look
  (ADR-075); strip to the pick. Absorbed as M6.
- **Fonts: WESTERN** — a Palatino-class serif + an Avenir-class sans (the demo's
  system stack). The self-hosted Japanese brush fonts retire.
- **Build STRAIGHT ON MAIN** — no `?ui=v2` flag, no branch. Every milestone lands
  `verify`-green + playable; the look shifts but never breaks.
- **Version:** v0.3.6.

### Do-NOT-copy (the demo's throwaway mock)
The demo ignores the engine's `events[]` and re-renders every surface ~2×/sec by
string-diffing innerHTML; hand-rolls a fragile log reconcile; pokes the DOM for
meters/pops; chains cold-open timers with a double-fire safety net; mutates
`eng.state` directly in one "documented hack"; uses `onclick=""` iOS hacks and
non-null-safe reads. **None of this crosses into `src/`.** We rebuild every
behaviour on our real reconcile engine. (When in doubt, read the demo's CSS, not
its JS — the CSS is the spec, the JS is the anti-spec.)

## Who builds this

**Written to be built by a SMALL model (Sonnet-class) — the human explicitly
authorized that (2026-07-04).** The judgment lives in the *spec*: this Opus session
front-loads every design call into the build cards + reference tables below, so the
builder executes concrete, anchored steps rather than making taste calls. What a
small model can't self-certify stays a gate: each milestone ends with a screenshot
review **and the human playtests R0/R1** before the next begins (ADR-084 / PH5 — only
a human certifies fun & taste). If a card proves ambiguous mid-build, the builder
**stops and surfaces**, never guesses.

## The two axes

- **Change-type:** ① THEME (colour/type/texture) · ② LAYOUT (composition) · ③ FLOW
  (interaction/cadence). **Risk:** LOW (token/CSS, engine untouched) · MED (material
  restyle / cold-open) · HIGH (composition / interaction model).
- **Flow-vs-theme line (the human's framing):** M1 + M2 + M5-materials + M6-reskin
  are **pure theme** — the game plays byte-identically. M3 (where things sit) and
  M4 (cold-open cadence) are the only **feel** changes; scrutinize those. Rules /
  numbers / loop never move.

---

# Build cards

Each card: **Goal · Files · Steps (anchored) · Keep intact · Accept (incl. a11y +
tests) · Mobile.** Reference tables (token map, material recipes, fonts, variant
recipe) are the appendices; cards point to them.

**Every card's "Mobile" accept is now MACHINE-CHECKED (added 2026-07-05):** the
mobile e2e lane (`npm run test:e2e` — `e2e/mobile-layout.spec.ts` +
`e2e/mobile-journey.spec.ts`, real Android-Chrome + iOS-WebKit profiles; CI
workflow `e2e.yml` on every push) asserts no-horizontal-scroll, single-column
stacking, tap-target reach/coverage, and the tap journeys, per fixture. A
milestone's "verify at 375px" line means: the lane is GREEN on the milestone's
result (plus the card's own eyes-on spot-check). M3's phone recomposition must
UPDATE the lane's stacking assertions in the same commit that moves the layout
(byōbu single-column → bottom-tab-bar composition), and the 44px tap floor the
Andon language targets should then replace the lane's interim 24px WCAG floor
(`e2e/helpers.ts` — one constant).

## M1 · Steel palette + Western fonts  ① THEME · LOW

**Goal:** recolour the entire game to the steel bimetal and swap to Western type —
token layer only, zero component/engine edits. The current layout picks up steel
colours for free.

**Files:** `src/ui/styles.css` (`:26-128` token block · `:11-24` @font-face ·
`:89-95` font vars · `:189-191` `.emoji` filter). Font assets under `src/ui/fonts/`
+ `src/scripts/subset-fonts.sh`.

**Steps:**
1. Re-point every **raw pigment** and **semantic alias** per **Appendix A**. Keep
   the token *names*; change only their *values* — this re-skins the ~2000
   downstream rules in place. Critical role flips: `--line` → gold keyline (borders
   are keylines now), `--num-key`/`--delta-pos` → gold (numerals are value),
   `--link`/`--ai` → silver (chrome/structure).
2. Add the four new tokens `--key`, `--key-dim`, `--silver-wire`, `--silver-faint`
   (Appendix A) — the material recipes in M2 reference them.
3. Collapse the dead 8-role pigments (`--rokusho/kihada/murasaki/beni/attr-*`, the
   indigo second-ink) per the Appendix A collapse table (default: 3-metal;
   fallback per-attribute voice ramp only if T4 legibility needs it).
4. **Fonts (Appendix C):** replace the four `--font-*` vars with the Western system
   stacks; **delete** the two `@font-face` blocks (`:11-24`) and the two `.woff2`
   files + their references in `subset-fonts.sh`; keep `OFL.txt` only if an OFL face
   remains. (Zen Kaku was never self-hosted — nothing to remove.)
5. `.emoji` (`:189-191`): retune the sepia/multiply filter toward cool steel
   (`grayscale(.7) brightness(.9)`) or drop it.

**Keep intact:** no `.frame`/`.paper`/`.log` *construction* changes yet (that's M2)
— only their token values shift. Reconcile/render untouched.

**Accept:** R0/R1 render steel and **play identically**; `grep -nE
'#f3e9d2|#e7d9bc|#27496d|feTurbulence' src/ui/styles.css` shows no stray *washi*
token values left in the `:root` (material rules still reference them until M2 —
that's expected); **a11y:** confirm the text ramp on steel meets WCAG AA — `--ink`
`#c2c8d8` and `--ink-2` `#8a90a4` on `#161922` pass for body; `--ink-3` `#5c6274`
is **decorative only** (≈3:1 — never load-bearing text); gold `#d8b978` and silver
`#cdd6ee` on steel pass. `npm run verify` green; headless R0/R1 capture; **human
playtests.**

**Mobile:** none (token-only; the responsive rules inherit the new values).

## M2 · Steel materials  ① THEME · MED

**Goal:** replace the woodblock *construction* (paper-grain, key-block frames,
bokashi, ink-multiply) with steel materials — still on today's composition, so this
is a pure CSS-recipe swap you can playtest before the layout moves.

**Files:** `src/ui/styles.css` only. Rewrite the seven recipes in **Appendix B**:
`.paper` (`:162`), `.frame` (`:194`), `.hanko-css` (`:2134`), `.bar`/`.meter`
(`:333`), `.nav` (`:1507`, horizontal-steel for now — the vertical rail is M3),
`.log` (`:512`), `.vitals` (`:300`), and the general bokashi sweep.

**Steps:**
1. Apply each Appendix B recipe (concrete CSS given). Per recipe: **delete** the
   woodblock construction (`feTurbulence` grain, `inset 0 0 0 2px/4px/5px var(--line)`
   triple-frames, `#5c8b93`/`#fff8ea`/`#efe4c8`/`#c68a3e` bokashi washes,
   `mix-blend-mode:multiply`), **add** the steel primitives (1px gold keyline +
   silver top-rim + steel-plate gradient; recessed well for the log).
2. Global sweeps: `grep -nE 'inset 0 0 0 2px var\(--line\)|feTurbulence|multiply|#5c8b93|#fff8ea' src/ui/styles.css`
   → every hit is a woodblock artifact to convert to a keyline/steel-grade.

**Keep intact:** `.log { display:flex; flex-direction:column; min-height:0 }`
(`:522`) and `.log-lines` overflow + the top-fade mask (`:540`) — the scroll hooks
depend on them. `.bar > span { transition: width … }` (the CSS-transition meter
animation `reconcile.ts` relies on) — keep the transition, change only fill/track.

**Accept:** R0/R1 read as **clean blackened steel** (no grain, no woodblock frame,
no cream) on the current composition; log is a recessed steel well; meters are gold
thread in a steel groove; **a11y** re-checked on the new plate backgrounds (the
gold `--num-key` on steel-2, the silver labels); `npm run verify` green; headless
capture; **human playtests.**

**Mobile:** the recipes are token/shadow swaps — responsive breakpoints inherit;
spot-check the phone log-well + plate shadows aren't muddy at small sizes.

## M3 · Andon composition (rail + center + log-window)  ② LAYOUT · MED–HIGH

**Goal:** restructure the shell from the vertical stack / byōbu two-column into the
Andon frame — header (top, full-width) · left-rail nav · center desk · right log
window. **Approach A (minimal DOM churn)** — re-parent two nodes, put a grid on the
shell.

**Files:** `src/ui/render.ts` (`mount()` `:553`; appends `:985`, `:1001`),
`src/ui/styles.css` (`.shell` `:232`; byōbu block `:445-510`; `.nav` `:1507`;
`.log` `:512`), `src/ui/render.test.ts` (layout-attr assertions).

**Steps:**
1. **`render.ts:985`** — change `workspace.append(work, logSection);` →
   `workspace.append(work);` (pull the log out of the workspace).
2. **`render.ts:1001`** — append `logSection` as a direct shell child so it becomes
   a grid sibling: `shell.append(header, nav, workspace, logSection, footer,
   settings.modal);` (titlebar already appended at `:623`).
3. **`.shell` (`styles.css:232`)** — replace the flex column with the Andon grid
   (**Appendix B.8**): `grid-template-columns: auto 1fr auto` (rail | desk | window),
   `grid-template-rows: auto auto 1fr auto`, and the `grid-template-areas`
   assigning `title/vitals/nav/work/log/footer`.
4. **Neutralize byōbu** (`styles.css:445-510`): with the log no longer inside
   `.workspace`, the `.slice-log` fold rules go inert — leave the
   `data-layout='layout-byobu'` stamps (`render.ts:4757-4758`) in place (a test
   asserts them; keep or update per step 7) and let the new shell grid own the outer
   frame while byōbu governs only `.work` internal stacking.
5. **Nav → vertical rail** (`styles.css:1507` `.nav`, `:1516` `.nav-tab`): per
   Appendix B.5-rail — `flex-direction:column`, `border-right` instead of
   `border-bottom`, and move the active indicator from `border-bottom:3px` to a
   **left** gold post. **No JS change** — the `reconcileList(nav,…)` at `:1190` and
   all reveal logic (`tabHasContent` `:1146`, `toggle(nav, tabs.length>=2)` `:1183`)
   are position-agnostic.
6. **Log → right window** — no further JS (step 1-2 did the move). Confirm the
   scroll hooks survive: `LOG_STICK_THRESHOLD_PX` (`:705`), `logPinnedToBottom`
   (`:706`), the scroll listener on `logLines` (`:716`), `scrollLogToNewest`
   (`:3441`) are all bound to the `logLines` element object — unaffected by
   re-parenting. Keep `.slice-log` + `data-panel='log'` classes on the node
   (`render.ts:976-977`) — a test reads `--log-scale` off `.slice-log`.
7. **Tests** (`render.test.ts`): update `:1206-1213` (asserts `.workspace`/`.shell`
   `data-layout`/`data-framing`) to match whatever you keep from step 4; the
   sticky-log tests `:1215-1239` are your **regression proof** the log move
   preserved scroll behaviour — they must still pass unchanged.

**Keep intact:** every `reconcileList` container object identity; the log scroll
hooks; the single-owner contract (each reconciled container holds only its
reconcile-owned children).

**Accept:** the Andon frame renders at R1+ (rail left, desk center, log window
right); R0 (pre-nav, <2 tabs) still composes sanely; scroll-to-bottom + sticky-log
still work (the `:1215-1239` tests pass); `npm run verify` green; headless capture
of R0→R3; **human playtests** (this is the highest-risk card — the eye re-learns
the screen).

**Mobile:** the Andon grid needs a phone recomposition (single column: header /
content / bottom tab-bar, log as a collapsible band). Mirror the demo's mobile
block (`ui-demos/10-andon-steel/style.css:1033-1220`) — bottom tab bar, `--m-log-band`,
safe-area insets, 44px tap floors. Verify no horizontal scroll at 375px.

## M4 · GBA-typewriter cold-open  ③ FLOW · MED

**Goal:** turn the static cold-open title card into a char-by-char typewriter reveal
(the "GBA scroll"). The typewriter machinery **already exists**.

**Files:** `src/ui/render.ts` (`applyColdOpenReveal()` `:4668`; structure
`:1004-1017`; `TYPE_MS_PER_CHAR` `:1071`), `src/ui/styles.css` (`.coldopen*`
`:1393-1446`).

**Steps:**
1. In `applyColdOpenReveal()` (`:4668`), the lede already types char-by-char
   (`coLede.textContent = full.slice(0, i+1)`, `:4695-4702`). Extend the same
   slice-loop to **type `coTitle` then `coRoman`** (they currently only fade via the
   `.in` class), staged before the lede, with a blinking caret between stages.
2. Replace the local `per = 32` / `start` literals (`:4693-4694`) with the shared
   `TYPE_MS_PER_CHAR` (`:1071`) so cadence is single-sourced.
3. Keep the reduced-motion fast path (`coldOpenReduced()` `:4659`, `:4677-4681`) —
   RM reveals everything at once, no typing. Keep the one-shot guard
   (`coldOpenRevealStarted` `:1020`, `cancelColdOpenReveal` `:1021`).
4. Restyle `.coldopen`/`.frame` to steel (Appendix B) + a gold block caret.

**Keep intact:** the `firstRender` gate + the pre-awake/leave branches
(`render.ts:4708-4724`); the one-shot guard (must not restart on the 480ms tick or
a re-render).

**Accept:** cold-open types title → roman → lede char-by-char then reveals the CTA;
fires **once**; RM shows all instantly; steel-styled; `npm run verify` green;
headless capture of the cold-open sequence; **human playtests** the cadence.

**Mobile:** verify the typewriter + caret at 375px; type size floors.

## M5 · VN + ceremony re-skin  ① THEME (+③ motion) · MED

**Goal:** re-skin the VN nameplate/scroll and the rank-up + ascension seals to the
steel/vermillion motif — **CSS only, DOM contract unchanged** (ADR-104/ADR-110/ADR-062
structure kept).

**Files:** `src/ui/styles.css` (the `.vn-*`, `.rankup-seal`, `.hanko-css`,
`.seal-inner` rules). No `render.ts` JS change for a pure re-skin.

**Steps:**
1. Restyle `.vn-seal` / `.vn-nameplate` / `.vn-card` (built by `introNameplate()`
   `render.ts:192`, `buildIntroShell()` `:2226`) to a steel nameplate + damascene
   seal (Appendix B.3 hanko recipe as the seal base).
2. Restyle `.rankup-seal` / `.seal-inner` / `.hanko-css` (`showRankUp()` `:3916`,
   `showAscension()` `:3937`) to the gold-faced bimetal seal; **this is where
   vermillion lives** — the commit/ceremony flush (Appendix B.3 `::after` radial).
   Keep the `shell.append(overlay)` + timed `remove()` lifecycle (1900ms rankup /
   3200ms ascension) and the temple-bell SFX hook.
3. Keep the per-voice colour maps (`VOICE_COLOR` `:157`, `VOICE_SEAL` `:179`) —
   re-point their values to the steel voice ramp (Appendix A voices) if any read
   poorly on steel.

**Keep intact:** all `.vn-*` class names + child order; the `introNameplate`
`{voice, speaker?}` shape; the overlay lifecycle. No JS.

**Accept:** VN scenes + a rung beat + the T0→T1 ascension render in steel with the
vermillion seal-press landing BIG on ascension; contract tests (`render.test.ts`
`:1006-1058` shell-hide / VN) still pass; `npm run verify` green; headless capture
of a VN beat + the ceremony; **human playtests** a rung-up + ascension.

**Mobile:** verify the VN full-screen surface + seal scale at 375px.

## M6 · Variant surfaces, rebuilt + re-chosen in steel  ①/② · MED

**Goal:** absorb **HR-2/HR-5/HR-6/HR-7** — re-implement each open diverged surface in the
Andon Steel language, all variants live behind the DEV toggle so the human **picks
in the new look** (ADR-075), then strip to the pick (zero flag-debt). One sub-step per
surface.

**Surfaces (each its A/B/C, estate-map its V5A–G):** House-Influence · Craft ·
Travelling-market · Quests · Log-filter (HR-2) · Bestiary (HR-5) · Home/Inventory (HR-6)
· Estate-map (HR-7, subsumes HR-2's older walkable-map).

**Files:** `src/ui/dev.ts` (the `SURFACES` registry `:70`, `renderSurfaceVariant()`
`:335`, per-surface renderers) + the caller seams in `src/ui/render.ts` (influence
`:1466`, craft `:2939`, bestiary `:3234`, home `:4113`, market `:4377`, map `:4514`,
quests `:4633`) + `src/ui/dev.test.ts`.

**Per-surface recipe (Appendix D — copy-paste, 5 steps):** register the surface in
`SURFACES` (variant[0] = prod default) → route it in `renderSurfaceVariant()` →
write `renderXVariant(...)` (return `false` for the default id, build B/C, return
`true`) → add/confirm the caller seam in `render.ts` → prod ships only variant[0],
B/C tree-shake out; `?X=X-b` toggles. Add a routing test in `dev.test.ts`.

**Strategy (resolved #5):** carry every existing variant forward, re-themed to
steel; where a washi-specific idea can't translate to steel (e.g. a
paper-grain-dependent treatment), adapt to the nearest steel-native form and **flag
that surface** for the human — never silently drop a variant.

**Keep intact:** the `import.meta.env.DEV` gate (prod ships only defaults, zero
flag-debt); the `dev.ts` leak-guard sentinel.

**Accept:** every surface's variants toggle live in the DEV panel in steel; each
surface's `variant[0]` is a coherent self-picked steel default; `?dev=no` shows the
true player layout; `npm run verify` green (incl. new `dev.test.ts` routing);
headless capture per surface; **the human picks each live**, then a follow-up strips
the unpicked variants (ADR-075) and closes HR-2/HR-5/HR-6/HR-7.

**Mobile:** each surface's variants verified at 375px.

## M7 · Doc ripple + lock retirement  — · LOW (Fable-eligible)

**Goal:** retire the woodblock canon now that UI-v2 ships. Runs `/prd-ripple`.

**Steps:** rewrite the visual-identity sections of `ui-design.md`
(§1/§2/§3/§4.1/§6/§7/§9) to steel; update the one woodblock pointer line in
`taste.md`; replace the woodblock phrases in the four PRD files (`01-vision`,
`02-systems`, `06-tech-architecture`, `07-roadmap-scope`); new ADR **retiring
ADR-018** (keep its "CSS-only, no asset pipeline" constraint, replace the aesthetic);
mark ADR-045's ink-contrast rule superseded by the steel a11y targets; re-caption
ADR-068's woodblock justification. `npm run prd:drift` clean.

**Accept:** `verify` green (incl. `doc-budgets` — ui-design.md ≤400, taste.md ≤150);
`prd:drift` clean; the ADR lands; no stale "washi/woodblock" identity claim remains
in living docs (IA + render-contract + the 4 taste values survive untouched).

---

# Appendix A · Token map (M1)

Keep every token **name**; re-point its **value**. (CUR = current `styles.css`; all
steel values from `ui-demos/10-andon-steel/style.css:19-129`.)

**Grounds:** `--washi #f3e9d2 → #161922` · `--washi-shade #e7d9bc → #1b1f29` ·
`--washi-deep #ddcfae → #0e1016`.
**Ink ramp:** `--ink #26221e → #c2c8d8` · `--ink-soft #4a3f33 → #8a90a4` ·
`--ink-faint #7a6c59 → #5c6274`.
**Indigo → silver:** `--ai #27496d → #cdd6ee` · `--ai-soft #5c8b93 → #99a2bf`.
**Vermillion:** `--shu #d7402c → #bf3b25` · `--shu-deep #a8301f → #7e2414` ·
*(add)* `--shu-hi: #de5a3a`.
**Secondary red:** `--beni #a93b47 → #bf3b25`.

**8→3 collapse (dead pigments):** `--kihada → #d8b978` (gold) · `--ochre → #93794a`
· `--gold #b08d4f → #d8b978` · `--rokusho → #99a2bf` (steel-grey) · `--murasaki →
#e7ecff` (dignified silver-hi) · `--attr-str → #bf3b25` · `--attr-agi → #99a2bf` ·
`--attr-int → #cdd6ee` · `--attr-spd → #99a2bf` · `--attr-luck → #d8b978`.
*Fallback if the 5 attrs must stay distinct (T4):* use the demo voice ramp —
str→`#cf9a86` agi→`#a9c391` int→`#b79ad0` spd→`#8fbfc4` luck→`#d3b681`.

**Semantic aliases (role beats hue — re-point these definitions):**
`--bg → var(--washi)` (steel-1) or `#070810` for the outer ground · `--surface →
var(--washi-shade)` · `--surface-deep → var(--washi-deep)` · `--text → var(--ink)` ·
`--text-2 → #8a90a4` · `--text-mute → #5c6274` · **`--line → rgba(216,185,120,.42)`**
(gold keyline, NOT ink) · **`--link → #cdd6ee`** (silver) · **`--num-key → #d8b978`**
(gold) · **`--delta-pos → #d8b978`** (gold) · `--delta-neg → #de5a3a` · `--seal →
#bf3b25`. Pillars: `--pillar-arms → #bf3b25` · `--pillar-estate → #d8b978` ·
`--pillar-office → #cdd6ee` · `--pillar-name → #99a2bf` · `--pillar-kai → #f2dca0`.

**Add four tokens:** `--key: rgba(216,185,120,.42)` · `--key-dim:
rgba(216,185,120,.15)` · `--silver-wire: rgba(205,214,238,.55)` · `--silver-faint:
rgba(205,214,238,.14)`.

**Motion:** keep names; add `--ease: cubic-bezier(.32,.08,.24,1)` and a `--dur-mid:
240ms` (`--dur-fast`=140/`--dur`=320 already match steel). `--radius 3px` unchanged;
`--radius-seal 6px` → keep (or 3px for sharper lozenge).

# Appendix B · Material recipes (M2/M3) — concrete CSS

**B.1 `.paper`** (del grain/highlight/multiply):
```css
.paper{background-color:var(--void);
  background-image:radial-gradient(1500px 950px at 50% -14%,#141726 0%,transparent 60%),
    linear-gradient(180deg,#0b0d15,var(--void) 44%);
  background-attachment:fixed;}
```
**B.2 `.frame`** (del triple woodblock inset + `::after`):
```css
.frame{position:relative;
  background:linear-gradient(180deg,var(--steel-2),var(--steel-1) 52%,var(--steel-0));
  border:1px solid var(--key);border-radius:3px;
  box-shadow:inset 0 1px 0 var(--silver-wire),0 3px 14px rgba(0,0,0,.5);}
/* delete .frame::after */
```
**B.3 `.hanko-css`** (del vermillion-border/washi-fill/multiply; add commit flush):
```css
.hanko-css{width:116px;height:116px;display:grid;place-items:center;border-radius:6px;
  color:#14110b;font-family:var(--font-display);font-size:3.2rem;
  background:linear-gradient(135deg,var(--gold-hi),var(--gold-dim));
  border:1px solid var(--silver-wire);
  box-shadow:inset 0 0 0 1px var(--silver-wire),inset 0 0 0 3px rgba(14,16,22,.5),
    0 0 8px rgba(216,185,120,.3);}
/* commit/ceremony heat: ::after radial-gradient(circle,var(--shu-hi),var(--shu) 50%,transparent 72%) animated in */
```
**B.4 `.bar`/`.meter`** (del flat washi track/indigo fill; keep the width transition):
```css
.bar{position:relative;height:6px;border-radius:3px;overflow:hidden;background:var(--steel-0);
  border:1px solid rgba(0,0,0,.7);box-shadow:inset 0 1px 3px rgba(0,0,0,.85),0 0 0 1px var(--silver-faint);}
.bar>span{height:100%;background:linear-gradient(90deg,var(--gold-dim),var(--gold) 55%,var(--gold-hi));
  box-shadow:0 0 6px rgba(216,185,120,.4);transition:width var(--dur) var(--ease-ink);}
.bar.state>span{background:linear-gradient(90deg,#6f7896,var(--silver) 58%,var(--silver-hi));} /* life = silver */
.bar.body>span{background:linear-gradient(90deg,#5f8a6d,#9fc79a 60%,#c3e6bd);}                 /* satiety */
.bar.low>span{background:linear-gradient(90deg,var(--shu-deep),var(--shu-hi));}                /* danger */
```
**B.5 `.nav` (M2 horizontal steel; M3 → vertical rail):** steel strip = `background:
linear-gradient(180deg,var(--steel-1),var(--steel-0) 70%); border-bottom:1px solid
var(--key); box-shadow:inset 0 1px 0 var(--silver-faint)`. `.nav-tab` = sans
uppercase `.14em` `color:var(--silver-dim)`; `.active` = gold keyline border + silver
top-rim + `color:var(--silver-hi)` + a gold post. **M3 rail:** `.nav{flex-direction:
column;border-right:1px solid var(--key);border-bottom:0}`; move the active post from
`border-bottom` to a **left** gold edge.
**B.6 `.log` steel well** (del bokashi + book-frame; keep flex + `.log-lines` mask):
```css
.log{display:flex;flex-direction:column;min-height:0;
  background:linear-gradient(180deg,var(--steel-1),var(--steel-0));
  border:1px solid var(--key);border-radius:3px;
  box-shadow:inset 0 1px 0 var(--silver-wire),0 3px 18px rgba(0,0,0,.5);padding:0;}
.log>h2{font-family:var(--font-num);letter-spacing:.2em;text-transform:uppercase;
  color:var(--silver);padding:13px 16px 10px;border-bottom:1px solid var(--key-dim);}
.log-lines{flex:1 1 auto;min-height:0;overflow-y:auto;margin:0 10px 10px;border-radius:3px;
  background:linear-gradient(180deg,var(--steel-0),#0a0c12);
  box-shadow:inset 0 2px 12px rgba(0,0,0,.75),inset 0 0 0 1px var(--silver-faint),inset 0 -2px 8px rgba(0,0,0,.5);
  -webkit-mask:linear-gradient(to bottom,transparent 0,#000 .9em);mask:linear-gradient(to bottom,transparent 0,#000 .9em);}
```
Log prose = serif `var(--ink)`; reward lines gold; milestone lines = gold-hi + a
`--key` hairline rule top/bottom.
**B.7 `.vitals`** (del `#5c8b93` bokashi): `background:linear-gradient(180deg,#1d212c,
#12141c 78%,var(--steel-0)); border-bottom:1px solid var(--key); box-shadow:0 1px 0
rgba(0,0,0,.7),inset 0 1px 0 var(--silver-wire)`.
**B.8 `.shell` Andon grid (M3):**
```css
.shell{display:grid;height:100%;
  grid-template-columns:auto 1fr auto;grid-template-rows:auto auto 1fr auto;
  grid-template-areas:"title title title" "vitals vitals vitals" "nav work log" "footer footer footer";}
.titlebar{grid-area:title}.vitals{grid-area:vitals}.nav{grid-area:nav}
.workspace{grid-area:work}.log{grid-area:log}.appbar-footer{grid-area:footer}
```
**Universal DELETE across the sheet** (grep them): `feTurbulence` data-URI grain;
every `inset 0 0 0 2px var(--line)` triple-frame; every `#5c8b93`/`#fff8ea`/`#efe4c8`/
`#c68a3e` bokashi wash; every `mix-blend-mode`/`background-blend-mode:multiply`.

# Appendix C · Fonts (M1)

Adopt the demo's **system stacks** (zero pipeline, cross-platform graceful — macOS/iOS
render true Palatino/Avenir, elsewhere fall back to Georgia + system-sans):
```css
--font-head:   "Iowan Old Style","Palatino Linotype",Palatino,Georgia,serif;
--font-body:   "Iowan Old Style","Palatino Linotype",Palatino,Georgia,serif;
--font-display:"Iowan Old Style","Palatino Linotype",Palatino,Georgia,serif;
--font-num:    "Avenir Next",Avenir,"Helvetica Neue",ui-sans-serif,system-ui,sans-serif;
```
Map: serif = prose/numerals/VN/titles; sans (`--font-num`) = uppercase chrome
labels. Follow the demo — **numerals in serif with `tabular-nums`**, sans for labels
(the demo sets `.pill b`/`.vbar .bv` to `600 15px var(--serif)` +
`font-variant-numeric:tabular-nums`). **Delete** the two `@font-face` blocks
(`styles.css:11-24`) + `shippori-mincho-b1-800-subset.woff2` +
`yuji-syuku-400-subset.woff2` + their `subset-fonts.sh` references. *(Optional future
polish for cross-platform consistency: self-host a libre Palatino-alike — Gelasio /
Domine — + Avenir-alike — Nunito Sans / Metropolis; not required for v0.3.6.)*

# Appendix D · Add a steel variant to a surface (M6)

Per surface X (model on `renderHomeVariant` `dev.ts:486`):
1. **Register** in `SURFACES` (`dev.ts:70`): `{id:'X',label:'…',variants:[{id:'X-a',
   label:'A · …'},{id:'X-b',…},{id:'X-c',…}]}` — `variants[0]` ships to prod.
2. **Route** in `renderSurfaceVariant()` (`dev.ts:335`): `if(surface==='X') return
   renderXVariant(variantId,container,state,dispatch);`.
3. **Write** `renderXVariant(variantId,container,state,dispatch):boolean` — return
   `false` for the default id (caller renders the shipped default), build B/C into
   `container`, return `true`.
4. **Caller seam** in `render.ts` (pattern at `:4113-4120`): wrap the default in
   `if(import.meta.env.DEV && dev){…fresh container…; if(!dev.renderVariant('X',
   container,state,dispatch)){/*default*/}} else {/*default*/}`.
5. Prod ships only `X-a` (B/C tree-shake); `?X=X-b` toggles via `dev.ts:297-303`. Add
   a routing test in `dev.test.ts`.

---

## Definition of done (whole migration)

- M1–M7 each: `verify` green · **the mobile e2e lane green** (`npm run test:e2e`;
  M3 updates its stacking assertions + raises the tap floor to 44px in-commit) ·
  headless R0/R1 (+ the milestone's surface) capture ·
  **human playtests R0/R1 and signs off** before the next · engine contract intact ·
  zero copied demo bugs · RM + touch verified for M3/M4.
- M6 closes HR-2/HR-5/HR-6/HR-7 (picks made, unpicked variants stripped — zero flag-debt).
- M7: woodblock locks retired by ADR; `prd:drift` clean; `doc-budgets` green.
- Final: the shipped game *is* Andon Steel end-to-end, on our own engine, and a
  human has certified R0/R1 fun & taste (PH5/ADR-084).
