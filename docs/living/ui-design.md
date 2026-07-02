# UI Design-Language Bible — *the Kurosawa house*

> **LIVING — the M1/M2 renderer (`src/ui`) is built to this bible.** One open item: font self-hosting (Q52).
> The LOCKED art direction (human-signed): a **strong CSS design-language**,
> **NO asset pipeline** — the whole game is **text + emoji + CSS** (+ inline SVG, which is markup, not a file).
> This document is the **anti-slop foundation**: the single visual vision every screen is built against
> *before* any UI code (per [`qa-playtesting.md`](qa-playtesting.md) §4 and PRD §6.9). It is the
> source of truth for tokens, type, components, and motion; the renderer (PRD §6.9, a thin DOM layer) consumes
> it. Numbers display as **K/M/B**; romanization uses **macrons**. Synthesized from three research briefs
> (ukiyo-e/palette · typography/CSS · incremental-UI/juice) — sources at the end.

---

## 1. Vision statement

The Kurosawa house looks like a **mid-Edo woodblock print left out on a worktable** — warm unbleached *washi*
paper, **warm sumi ink** doing all the line-work, one disciplined **indigo** as the "second ink," and a single
**vermilion seal** (*hanko*) that means *important* precisely because it is rare. It is **intentional,
restrained, and warm** — the visual register of *quiet ascent through a declining house*, never a flashy mobile
idler. The register is anchored to **1780** (*An'ei* 9) — the ukiyo-e high tide — so the "mid-Edo woodblock"
language is *validated*, not changed, by the setting-anchor (ADR D-105). The **event log is the heart of the
screen**: a tall paper scroll of diegetic narration that turns
every income tick and every unlock into a line of the house's story. The signature feeling is **"UI as
progression"** — the game opens as one calm column (a verb + the log) and *inks new panels, tabs, and whole
screens into existence* as the house rises, each reveal narrated as plot. Depth comes from **material and
contrast** (paper grain, ink weight, the seal's red) — **never** from uniform drop-shadows, gradients-for-depth,
glassmorphism, neon, or any default-component look. If a screen reads as *handmade and confident*, we are on
vision; if it reads as *generic web app or AI placeholder*, we have failed.

---

## 2. Palette — the disciplined eight roles + the four-pillar identities

Anchored to real woodblock pigments / the Japanese traditional-color (日本の伝統色) registry, tuned a notch
toward their printed-on-washi appearance for screen legibility. **The whole system is: paper + ink + indigo,
with one earth tone per context and the vermilion reserved for the seal/CTA.** That restraint *is* the
ukiyo-e look. Two reds, two blues, two earths, ink, paper — no rainbow.

```css
:root {
  /* ── PAPER (washi) — the dominant field; never pure #FFF ───────────────── */
  --washi:        #F3E9D2;  /* canvas / page base (生成り kinari, unbleached)   */
  --washi-shade:  #E7D9BC;  /* panels, cards, table rows, the log "scroll"     */
  --washi-deep:   #DDCFAE;  /* recessed wells, inactive tabs, meter tracks     */

  /* ── INK (sumi 墨) — ALL text, borders, rules; never #000 ──────────────── */
  --ink:          #26221E;  /* body text, outlines, frames — the load-bearing line */
  --ink-soft:     #4A3F33;  /* secondary text, routine-log lines               */
  --ink-faint:    #7A6C59;  /* DECORATIVE / disabled-only: locked & silhouette hints — never an active value */

  /* ── INDIGO (ai 藍, aizuri) — the "second ink": structure & key numbers ── */
  --ai:           #27496D;  /* headers, active tab, key totals, links, House id */
  --ai-soft:      #5C8B93;  /* bokashi fades, hover/secondary, muted fills, bars */

  /* ── VERMILION (shu 朱) — the SEAL & the single most important CTA ─────── */
  --shu:          #D7402C;  /* hanko stamp, primary confirm/sign, rank-up beat  */
  --shu-deep:     #A8301F;  /* pressed/active seal state                        */

  /* ── BENI (紅) — secondary red: negatives, warnings, crests ────────────── */
  --beni:         #A93B47;  /* negative deltas, dents/setbacks, decorative crest */

  /* ── EARTH secondaries — pick ONE per context, never all at once ───────── */
  --kihada:       #E0B23C;  /* yellow (黄蘗) — category tags, status pips        */
  --ochre:        #C68A3E;  /* ochre (黄土) — resource accents, warm fills       */
  --rokusho:      #3E6958;  /* verdigris (緑青) — moss/patina category, growth   */
  --gold:         #B08D4F;  /* sparing rank-up/prestige highlight only          */

  /* ── SEMANTIC aliases (use these in components, not raw hues) ──────────── */
  --bg:           var(--washi);
  --surface:      var(--washi-shade);
  --surface-deep: var(--washi-deep);
  --text:         var(--ink);
  --text-2:       var(--ink-soft);
  --text-mute:    var(--ink-faint);
  --line:         var(--ink);        /* the key-block outline                  */
  --link:         var(--ai);
  --num-key:      var(--ai);         /* key totals render in indigo            */
  --delta-pos:    var(--ai);         /* gains = indigo (NOT generic green)      */
  --delta-neg:    var(--beni);       /* losses = beni  (NOT generic red)        */
  --seal:         var(--shu);        /* the one accent that means "important"   */

  /* ── FOUR-PILLAR identities (distinct, scannable, still in-palette) ─────── */
  /* §2.16 — each pillar gets its OWN ink + emoji so the panel is peripherally scannable. */
  --pillar-arms:   var(--beni);      /* 武威 Arms          ⚔️  (force, blood)    */
  --pillar-estate: var(--ochre);     /* 家産 Estate&Wealth 🌾  (rice, earth)     */
  --pillar-office: var(--ai);        /* Standing & Office  📜  (the office ink)  */
  --pillar-name:   var(--rokusho);   /* 家格 Name&Honour   ⛩️  (a name's patina) */
  --pillar-kai:    var(--shu);       /* 家威 the umbrella roll-up = the SEAL     */
}
```

**Usage discipline (the rules that keep it ukiyo-e, not slop):**

- **Every screen reads as paper + ink + indigo.** `--ai` is the only structural accent; it carries headers,
  the active tab, links/affordances, and *key* numbers (totals).
- **The vermilion (`--shu`) is a stamp, not a coat of paint.** It appears on the House seal/crest, the single
  primary call-to-action of a region, and the rank-up beat. If two reds compete on one screen, the design is
  wrong — demote secondary reds to `--beni`.
- **Deltas use indigo/beni, never generic green/red.** Gains in `--ai`, losses in `--beni` — and the hue is an
  **accent on the ± number** (its sign + arrow glyph ▲/▼ and a label carry the meaning), so colour is **never the
  sole carrier of meaning** (PRD §6.9/§6.11).
- **Identity hues are FILLS / ACCENTS only; ink carries the meaning.** Every earth / accent / pillar hue lives
  in **chrome** — bar fills, pips, icons, borders, seal stamps — and is **never** the sole carrier of a value.
  **All meaning-bearing text renders in ink:** body in `--ink`, secondary / functional / hint text in
  `--ink-soft`, and headers / key totals in indigo `--ai` — the AA-passing "second ink", not an identity hue.
  So **there is no coloured WIN/LOSS word-as-text and no coloured label-text** — the outcome word
  and panel labels render in ink, with the identity hue carried only by an adjacent fill / pip / icon (§5.1, §5.3).
  **`--ink-faint` is decorative / disabled-state only** — it never carries an active value.
- **Per-token contrast guarantees — not a blanket "AA on every surface".** The real promise is per token, per
  surface: `--ink-soft` text clears **WCAG AA — ≈ 7.3:1 on `--surface`** (and on `--washi` / `--surface-deep`),
  and `--ink` is darker still (higher); `--ink-faint` is decorative / disabled-only (WCAG exempts disabled
  controls), so it makes no contrast promise and is never used for an active value. Meter / bar fills are
  **darkened** so any value drawn on the fill stays AA (§5.3).
- **One earth tone per context.** A category strip may use `--ochre` *or* `--kihada` *or* `--rokusho` — never
  all three. The four-pillar panel is the only place multiple earth/accent hues legitimately coexist, because
  there each is a *fixed identity*, not decoration.
- **Colourblind mode** (PRD §6.11) swaps the hue set for a safe ramp; because meaning is always carried by
  icon + text too, the swap is purely a comfort layer, not a correctness fix.

---

## 3. Typography

Type **is** the art here — there is no asset pipeline, so typography + layout + colour carry the whole
aesthetic. The plan: **two characterful, JP-capable families, served smart**, with the fixed UI kanji subset
to a few KB.

### 3.1 Font stack (adopted default; self-host pending Q52)

This stack is wired into [`src/ui/styles.css`](../../src/ui/styles.css); the families below load from system
fallbacks today and self-host once Q52 lands.

| Role | Family | Why |
|---|---|---|
| **Body / UI** | **Shippori Mincho** (400/500) | An old-style mincho built for long-form reading — excellent on-screen legibility, reads as printed Edo paper, ships full Latin + JP so it unifies the whole UI in one family. |
| **Headings / beats** | **Shippori Mincho B1 ExtraBold** (800) | Reads like a struck woodblock title and stays legible at game density. |
| **Hero calligraphy (rare)** | **Yuji Syuku** (楷書 brush) | Authentic brush face — reserved for the **rank-up title** and the **seasonal-result headline** *only*. Too thin for density; perfect for one held beat. |
| **Live numerals** | **Zen Kaku Gothic New** / **Noto Sans JP**, fallback `system-ui` | Only for ticking values in tight tables, where tabular nums must not jitter. Keep to numbers/micro-labels so the page stays "ink," not "web app." |

```css
:root {
  --font-display: "Yuji Syuku", "Shippori Mincho B1", serif;        /* rank-up + season headline only */
  --font-head:    "Shippori Mincho B1", "Shippori Mincho", serif;   /* h1–h3                          */
  --font-body:    "Shippori Mincho", "Hiragino Mincho ProN",
                  "Yu Mincho", "YuMincho", "MS Mincho", serif;       /* JP system fallbacks            */
  --font-num:     "Zen Kaku Gothic New", "Noto Sans JP", system-ui, sans-serif;
}
body     { font-family: var(--font-body); color: var(--text);
           font-feature-settings: "palt" 1;            /* tighter JP spacing — labels don't float */ }
h1,h2,h3 { font-family: var(--font-head); font-weight: 800; }
.numeric { font-family: var(--font-num); font-variant-numeric: tabular-nums; }
```

### 3.2 The kanji-subset trick (load-bearing — "no asset pipeline" purity)

The pillar labels **武威 / 官威 / 家産 / 家格 / 家威**, season tags **春 夏 秋 冬**, rank names, and a few
UI words are a **small, fixed glyph set (~40–80 kanji)** — do **not** ship a multi-MB JP font.

- **Option A (zero build step) — REJECTED (Q52/D-013):** Google's dynamic subsetting breaks offline / the
  itch relative-base; self-hosted Option B is the path.
- **Option B (best for fixed content, fully offline, ADOPTED):** self-host a hand-subset built once with
  `pyftsubset`/`glyphhanger` → a few KB `.woff2`. It is a **font, not an art asset** — consistent with the
  no-asset-pipeline rule.

```css
@font-face {
  font-family: "Shippori Mincho";
  src: url("/fonts/shippori-subset.woff2") format("woff2");
  font-weight: 400 800; font-display: swap;   /* kanji pillars are NEVER invisible while loading */
  unicode-range: U+3000-303F, U+3040-309F, U+30A0-30FF, U+4E00-9FFF, U+FF00-FFEF, U+0020-007E;
}
```

### 3.3 Type scale, weights & rules

A fixed modular scale (≈1.2 minor-third); a *real* scale read as intentional, ad-hoc sizes read as slop.

```css
:root {
  --fs-display: clamp(1.6rem, 4vw, 2.6rem); /* rank-up / season headline (Yuji Syuku)        */
  --fs-h1:      1.6rem;   --fs-h2: 1.33rem;  --fs-h3: 1.11rem;
  --fs-body:    1rem;     /* 16px base — kanji need ≥16px to stay legible                     */
  --fs-num-lg:  1.5rem;   /* the hero totals (koku / 家威 roll-up)                            */
  --fs-small:   0.875rem; /* captions, secondary log lines                                   */
  --fs-micro:   0.75rem;  /* pips, tags — never below this                                    */
  --lh-body:    1.6;      --lh-tight: 1.25;
  --tracking-head: 0.02em; /* a touch of letter-spacing on heads = deliberate, not default   */
}
```

**Rules.** (1) The **display face (Yuji Syuku) is allowed ONLY** on the rank-up title and the seasonal-result
headline — nowhere else, or it stops feeling special. (2) **Kanji labels ≥16px**; pillar headers larger.
(3) **Live counters use Arabic numerals in tabular-nums** — *never* kanji numerals (unreadable while ticking);
**kanji numerals only ever appear in static labels/titles**. (4) **Romanization uses macrons** (*goshi* →
*gōshi* where long, *shinden*, *jitō-dai*, *kogashira*) in all body copy and labels. (5) Body text stays
crisp — reserve ink-bleed/blur for display beats only (§6), never paragraphs.

---

## 4. Layout & surfaces

### 4.1 Spacing & grid

A single 4px-based spacing scale (consistent spacing reads as designed; mixed ad-hoc gaps read as slop).
Generous **negative space (*ma* 間)** — whitespace early is *confidence*, not emptiness.

```css
:root {
  --space-1:.25rem; --space-2:.5rem; --space-3:.75rem; --space-4:1rem;
  --space-6:1.5rem; --space-8:2rem;  --space-12:3rem;
  --radius:   3px;   /* square / lightly-cut corners — NEVER pill-rounded (that's web-app slop) */
  --radius-seal: 6px;
  --maxw-text: 68ch; /* the log column caps its measure for readability                          */
}
```

- **Desktop shell:** a CSS-grid app shell — a persistent **global header** (the vitals: key resources +
  next-gate, see §5.7), a **nav rail** (left sidebar, revealed entries only), and a **workspace**. The
  workspace splits into an **interactive work/actions column (LEFT) and the message/story log (RIGHT)** — the
  idle-RPG convention (§4.7, F8); the layout stays **deliberately asymmetric** (*ma*), never a symmetric
  four-card grid. The full app-shell contract — the centered paper column, the fixed header/footer, and the
  viewport sizing — is §4.7.
- **Reflow:** columns → stacked on narrow; nav rail → bottom tab-bar (§8). One panel visible at a time on
  mobile (tabs do this by definition); the log keeps the most vertical space.

### 4.2 Paper background & grain (inline SVG `feTurbulence` — no file)

The substrate must look fibrous, warm, handmade — never a flat dead fill. Encode noise as an inline `data:`
SVG (a few hundred bytes, retina-sharp) layered under warm gradients.

```css
.paper {
  background-color: var(--washi);
  background-image:
    radial-gradient(120% 80% at 50% 0%, #fff8ea55, transparent 60%),  /* faint warmth/vignette */
    linear-gradient(0deg, #00000010, transparent 30%),
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E");
  background-blend-mode: multiply;
}
```

Keep grain `opacity` 0.03–0.07 (paper *tooth*, not static). `fractalNoise` = soft cloudy grain; raise
`baseFrequency` for finer grain. Surfaces step **washi → washi-shade → washi-deep** so cards read as
*paper-on-paper* (depth from material, not shadow).

### 4.3 Woodblock frame / border language

The **key-block outline (主版)** is a first-class design element: strong, even sumi borders define every panel.

```css
.frame {
  position: relative; background: var(--surface);
  box-shadow:                              /* triple-rule woodblock border — no images */
    inset 0 0 0 2px var(--line),
    inset 0 0 0 4px var(--surface),
    inset 0 0 0 5px var(--line),
    0 2px 0 #00000018;                     /* a printed plate offset, NOT a soft drop-shadow */
  padding: var(--space-4) var(--space-6); border-radius: var(--radius);
}
.frame::after {                            /* inner keyline stopping short of corners = printed-plate feel */
  content:""; position:absolute; inset:9px; border:1px solid var(--ink-faint); pointer-events:none;
}
.frame.rough { filter: url(#roughEdges); } /* hand-printed wobble — STATIC decor only (filters cost paint) */
```

One hidden `<svg width="0" height="0" aria-hidden="true">` block at the top of `<body>` holds all reusable
filters (`#roughEdges`, `#inkBleed`, `#sealInk`) — inline markup, works offline, referenced via
`filter:url(#id)`. **Reserve displacement filters for static decorative elements** (frames, dividers, seals),
never per-frame-animated or large scroll regions.

### 4.4 Bokashi — the one sanctioned gradient

Hand-wiped tonal fades (Hokusai's skies) are the **only** place gradients belong. A single-hue,
**large, soft** `linear-gradient` wash on a banner/header edge or behind the log. Never gradients-for-depth,
never the purple/blue web gradient (that is a slop fingerprint).

```css
.bokashi-head { background: linear-gradient(180deg, var(--ai-soft) 0%, transparent 70%); }
.bokashi-log  { background: linear-gradient(180deg, transparent, #5c8b9322 90%); }
```

### 4.5 Ink-brush dividers (no images)

A tapered horizontal stroke = a masked gradient, brush-ragged via `#roughEdges`. Reads as a section break
under the log.

```css
.brush-rule {
  height:6px; border:0; margin:var(--space-6) 0;
  background: linear-gradient(90deg, var(--ink), var(--ink-soft));
  -webkit-mask: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
          mask: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
  filter: url(#roughEdges);
}
```

### 4.6 The seal / hanko (the brand mark & accent system)

A vermilion seal = authorship, achievement, the confirm/sign affordance. Inline SVG, vector-crisp, animatable;
`mix-blend-mode:multiply` lets the paper grain show *through* the red like real seal ink. It is the **House
crest/logo**, the **rank/achievement stamp**, and the **primary confirm** — and it appears rarely, so it always
means *important*.

```html
<svg class="hanko" viewBox="0 0 100 100" role="img" aria-label="House seal: 家">
  <g filter="url(#sealInk)" style="stroke: var(--shu);">
    <rect x="6" y="6" width="88" height="88" rx="6" stroke-width="6" fill="none"/>
    <text x="50" y="50" text-anchor="middle" dominant-baseline="central"
          style="font: 54px var(--font-display); fill: var(--shu);">家</text>
  </g>
  <!-- NOTE: var() resolves in inline SVG only via `style=` / CSS, NOT as a raw presentation attribute
       (font-family="var(--x)" silently fails) — always set themeable SVG props through style/CSS. -->
</svg>
```
```css
.hanko { width:84px; height:84px; opacity:.92; mix-blend-mode: multiply; }
```

Corner studs (kashira) can be pure-CSS `::before`/`::after` squares rotated 45° in `--shu` on hero frames.

### 4.7 The app shell — the idle-RPG frame (playtest 2026-07-02)

The player UI is a **centered paper column (~1200px) standing on the dark sumi-ink ground**, filling the
viewport — never a cramped narrow column, never raw-white margins. The margin *is* the ink ground (`body`
carries a dark `--ink` fill), so the whitespace left and right of the column reads as an **intentional
woodblock border**, not an unfinished page (F4). Following from that: **no raw white anywhere** — every
surface, down to DEV-only tooling and chrome, inherits the dark ground; a white block reads as unfinished
and breaks the woodblock immersion (F1, reinforces the §9 no-`#FFF` rule).

Inside the column the shell is the established idle-RPG frame — **fixed header / flexible content / fixed
footer** (F5): identity + vitals (the House id, the resource + next-gate readouts, the `body`/`life` bars,
§5.7) pin to the **header**; persistent controls (the version stamp, Settings, …) pin to the **footer**; the
content region fills the space between and scrolls internally. That content region carries the two workspace
columns — **work/actions LEFT, message/story log RIGHT** (F8). *(This supersedes the earlier v0.3.1
"story-log-as-left-hero" placement — live human taste is canon, D-022; the log stays a first-class, diegetic
surface (§5.1), now anchored right.)*

The shell is **sized to the viewport (100dvh) with NO page scrollbar** (F6) — the content panes (log, work
column) scroll *internally* within the available height, never the page. A minimum size is respected, and a
narrow-screen fallback (`≤720px`) relaxes to natural page flow so mobile still works.

**The workspace may span the FULL width as a multi-panel matrix** (F11, D-106). The two-column frame above is
the shipped **prod default** (the classic *work-left / log-right* pair); but the workspace is **not** bound to
the centered ~1200px paper column — an idle-RPG dashboard lays information across **multiple distinct panels**,
so the workspace may **span the full viewport width**, arranged as a **matrix of DEV variant axes**
(*arrangement × framing*) auditioning behind the variant toggle. This stays **reveal-gated and sparse** —
panels ink in only as their surface unlocks (§6.1), so the early game is deliberately a single calm column and
the dashboard density arrives with the house's rise, never a slam of empty panels. **D-106 supersedes the
§4.7 "centered ~1200px column" rule** (which itself refined the F4 centered-column intent); prod ships the
2-column default until the human locks a matrix variant (D-022 governs).

**DEV/tooling chrome never affects the player layout** (F2). The DEV panel is a **fixed floating overlay that
reserves ZERO layout space** and collapses to minimal — the game UI centers on the *full* viewport exactly as
if the panel did not exist, never shoved off-center by a reserved gutter. `?dev=no` never mounts the panel at
all and is the way to preview the true player-facing layout (a QA note also lives in
[`qa-playtesting.md`](qa-playtesting.md)). **DEV-panel ergonomics** (dev-only, not player taste): each variant
surface carries a stable **per-surface V-number** shown on its option buttons (F17/F36), a **fixed footer**
(New-game) pinned *outside* the scroll region (F37), and any **mutually-exclusive control set highlights its
active selection** so nothing reads as ambiguous (F49) — the last of these is a player-facing rule too (§5.5,
§5.6).

### 4.8 Density & compactness (playtest 2026-07-02)

**The game chrome is COMPACT and dense, like an established idle-RPG** — a tight type scale, small control
heights, and minimal chrome padding (F10). The chrome (header, footer, nav tabs, the resource/vitals row)
must stay minimal so the **content — the log and the actions — gets the space**; bigger is not better, and
the reference idlers fit far more on screen than a roomy web-app default would. Control target height runs
**~32px** (still above the WCAG 2.2 24px pointer minimum) — a deliberate desktop-first density trade against
the older 44px comfort target (mobile still keeps comfortable thumb targets, §8).

**The one exception — atmospheric/ceremonial surfaces keep GENEROUS breathing room** (F14). The
compact-density rule is for the *game chrome*, never for the cold-open, the seals, or similar ceremonial
cards: those stay roomy (the *ma* of §4.1), with the primary action given real padding off the frame — the
F10 compact pass must not tighten these. And the opening **reveals slowly with a delayed CTA**: the "Open your
eyes" button appears only after a beat, for the slow-waking feel, not all-at-once (§10 cold open).

---

## 5. Components — the reusable kit

Each component has a **design contract**. The renderer (PRD §6.9) builds these from `surfaces.ts` data; this
section defines how they *look and behave*. All are pure CSS + text + emoji + inline SVG.

### 5.1 Event-log line (THE HERO surface — invest most here)

The log is a tall paper **scroll** column on `--surface` with a faint bokashi wash behind it, given the most
space (asymmetry + *ma*). **Newest-on-top, capped ring buffer, auto-scroll, subtle entry animation** (a
motionless log kills momentum; a too-noisy one becomes wallpaper — tune to *meaningful* lines, not one per tick).
It is an **ARIA live region** (PRD §6.11) so reveals/important events are announced. **Following the newest
entry is a smooth scroll, never an instant jump** — the log eases to the latest line (honoring reduced-motion,
which snaps instantly) so the story is *seen* to arrive; a pop-in is a wasted beat (F7, playtest 2026-07-02).

**Tier the lines visually (information hierarchy inside a stream):**

| Channel | Treatment |
|---|---|
| `narration` | `--ink-soft`, regular weight — the ambient voice ("A rice-broker's letter arrives…"). |
| `reward` | `--ink`, with a small resource emoji bullet + the `+N` in `--ai`. |
| `combat` | `--ink`, a ⚔️ bullet; the **outcome word renders in `--ink-soft`** (ink, AA — never coloured), with the win/loss hue carried only by an **adjacent pip/icon**: a `--shu` seal pip (win) / a `--beni` mark (loss). |
| `system` | `--ink-soft`, smaller — restocks, saves. The quietest tier; its quiet comes from **size/weight, not faint ink** (the text still clears AA — `--ink-faint` is decorative-only and never used for a log value). |
| **milestone / reveal / rank-up** | **heavier weight, a `--shu` seal stamp** on the line + a held entry beat (§6). This is the highest-leverage juice surface. |

Diegetic voice carries the whole game's character — this is where the Edo flavour lives.

**Filterable channels — a bottom tab bar (F9, playtest 2026-07-02).** The log carries a **bottom
tab/toggle bar** so the player chooses which channel(s) to see, ordered **by importance**: **Story ·
Progress · Combat · Work · All · Now** (F52) — the notable channels lead, work-noise trails. **Story** is a
first-class, *returnable* view (the narrative is content worth revisiting, not ephemeral scrollback);
**Work** is the least-important permanent channel and carries **only notable events** — repetitive labour
spam does not belong here (it goes to **Now**, below). A **progression beat** (a stat lean, an unlock, a
rung) routes to **Progress** (the milestone channel), never to Work: a line the player *earns* is Progress,
not mundane upkeep (F41). Each tab surfaces an **unread indicator** (a badge/dot) when new content lands in a
channel you are *not* viewing; switching to it clears the mark — but unread fires **only for content that
arrives during the session**: on load, all existing (historical) entries count as already **seen**, so a
refresh never shows a spurious unread dot (F20/F59).

**The transient "Now" channel (F53/F58).** A **"Now"** tab (last, after *All*) collects **fleeting, trivial
flavor** — "you rested", the per-labour output line, the rake-rice spam — kept **OUT of the permanent
channels**. Each Now entry **fades/expires ~15s** after it appears; the expiry is a graceful **fade + the
remaining entries slide UP** (a height collapse, never a jump), consistent with the rest of the motion
language (§6). Repetitive labour flavor is **ephemeral (Now)**, never permanent-channel clutter.

**Land at the newest, always (F51).** A log/transcript view **always sits at the newest entry (bottom)**:
switching filter tabs lands at the bottom *instantly* after the repaint, never scrolls up from the top and
re-scrolls down. (This composes with the smooth *follow-the-newest* scroll for in-session arrivals above.)

**Voice, prefix, and the typewriter (F19/F26/F50/F54/F57).** Story/narration lines reveal with a **real
GBA character-by-character typewriter** — scoped to the **story channel only** (never combat/work spam),
**always LEFT-aligned** (a centred reveal re-centres on every character and jitters), reduced-motion →
instant full line. Each voiced line is **coloured by the speaker's character CATEGORY** (a small
voice-colour palette — narrator `--ink-soft`, player `--rokusho`, physician `--ai`, steward `--ochre`, arms
`--beni`, official/villager the muted earths — each verified AA on `--surface`) *and*
**prefixed with the speaker's name** (`Sōan: …`, `You: …`): colour is *reinforcement*, not the sole signal
of who is talking (colour-as-sole-signal is banned, §9). This retires the old render-time
quote-detection stopgap where all speech was one indigo. **ALL narration everywhere uses these same
voice/colour conventions** — rake/labour flavor is voice-tagged (`narrator`) and styled exactly like the
intro's narration, not left plain (F57).

**The live scene owns the reveal; the log is an instant historical transcript (F48).** When a live scene
(the VN intro, §5.13) is playing, *it* owns the animated typewriter reveal; the event log is painted
**instantly** behind the hidden shell, so the moment the shell reveals the transcript is **already there** —
the player never waits for the log to slowly catch up to choices they have *already* made. A live scene
animates; the log records.

**Separation under the sticky header (F28).** The log's own sticky header ("The house remembers") is set off
from the scrolling body by a **header border + a soft top fade** on the scroll area, so lines fade out as
they scroll under it rather than bleeding half-readable beneath a borderless edge.

### 5.1a Progression rewards render as PERK UNLOCKS (F56)

A progression reward (the intro's stat-lean outcomes, and rewards generally) reads as a **perk unlock**, in
an **old-school JRPG register** (the FF7–FF10 "learned" box) reconciled to the woodblock/ink palette
(D-018) — a bordered `.frame`-lite "learned" card on `--surface`, **never** a red-icon / red-tinted-bg
web-toast. Each perk carries three parts: a **named perk** (may reference the moment — *Sōan* / *Memory* /
*Genemon*), a **standalone description** whose flavor **stands on its own** (legible later without the
intro-conversation context that earned it), and the **mechanics** (the ±stats / effect). A choice's outcome
still reads **diegetically** — what you chose and what it costs, the mechanical ± woven in as context, never
a bare stat delta (F42).

### 5.2 Panel / card

A `.frame` paper card (§4.3) on `--surface`, nested surfaces stepping to `--surface-deep`. Square/lightly-cut
corners. A header in `--font-head` / `--ai`, optional kanji tag, body in `--font-body`. **One focal element per
region** — resist filling every pixel. First-time appearance uses the **reveal** animation (§6.1) and pushes a
log line; a panel never appears silently.

### 5.3 Meter / bar (and the four-pillar 家威 panel)

**Bar = shape, number = precision, colour = state — never a naked bar, never a naked number.** Track is
paper-grained `--surface-deep`; fill is an ink/indigo wash **darkened for contrast** (so any value drawn on the fill stays AA); threshold ticks are **registration marks** (small
sumi crop-marks). Fills **ease** toward new values (momentum), and the **number count-ups alongside** (§6.3).
Always **show the rate next to the total**: `家威 4.20K (+12/koku)`.

**Header vitals — the `body` and `life` bars.** Two slim meters sit in the global header (§4.1 / §5.7)
beside the resource readouts. **`body`** (satiety) reads how fed the player is; its bar flags `low` (a
`--beni` warning wash) as it drains toward hunger. **`life`** (HP) is the combat meter — it **inks into the
header the moment combat first matters** (the R2 wolf beat) and stays visible thereafter, pairing the bar
with an **exact `hp/max` numeral** because 1 HP versus a full bar is life-or-death: HP **accumulates**
between fights with **no auto-heal** (you mend only by eating), so the player must always be able to *see*
they are hurt. The bar flags `low` at ≤30%. The bar is the glance; the number is the truth.

**The four-pillar panel** (reveals **bar-by-bar** at T0-R7, §2.16 / §3.2): four horizontal bars, each with its
**own identity** — a kanji label **in ink (`--ink`/`--ink-soft`)** + emoji + its pillar hue **on the bar fill / a pip only** (the hue is a fill/accent, never the label-text) — so it is peripherally scannable, not four identical
bars (this is also the anti-"same-shadow flatness" fix):

| Pillar | Kanji | Colour token | Emoji |
|---|---|---|---|
| Arms | 武威 | `--pillar-arms` | ⚔️ |
| Estate & Wealth | 家産 | `--pillar-estate` | 🌾 |
| Standing & Office | 官威 *kan'i* | `--pillar-office` | 📜 |
| Name & Honour | 家格 | `--pillar-name` | ⛩️ |
| **House Influence (roll-up)** | **家威** | `--pillar-kai` (the **seal**) | 🔴 *(seal)* |

Each pillar's bar **inks in only when that pillar comes online** — at T0 the panel shows just the **Estate**
bar (the one revealed pillar), the **Arms** bar inking in at T1, the **Office** bar at T2 (V4) and the **Name**
bar at T3, so it grows bar-by-bar. Rather than rendering the not-yet-earned pillars as faint *named*
placeholders, the locked pillars sit as **unnamed silhouette teasers** (D-055) — muted `--ink-faint` ghost-bars
with **no kanji and no value** (three of them at T0), so the player *senses more standings await* without
learning their names or spoiling the reveal. The Estate bar shows its three capped sub-engines
(LAND / TREASURY / TRADE) as sub-segments, with the **trade ≤⅓** cap drawn as a hard registration mark at the
one-third line.

### 5.4 Rung-card / ladder

The per-tier rank ladder (R0→R7, V0→V7, G0→G7). **Don't show the whole ladder** — show unlocked rungs +
the *next one or two* (silhouetted with the unlock hint), hide the rest (preserves the open-ended discovery
the project wants). Current rung = full ink + a `--shu` seal marker; past rungs = `--ink-soft`; next =
`--ink-faint` silhouette with its requirement. Each rung shows its diegetic title + romanized rank
(*hiyatoi*, *genin*, *jitō-dai*).

### 5.5 Buttons (verbs)

Flat ink-outlined paper, **no glossy/3D/gradient buttons** (that's slop). A button is a small `.frame`-lite:
sumi border, `--surface` fill, `--ink` label, square corners. States: hover/focus → `--ai-soft` fill + `--ai`
border (focus shows a visible ring — keyboard operable). **Affordable/available = full ink ("lit");
unavailable = `--ink-faint` ("faded")** with the reason on tap/focus — so players scan "what can I do now"
at a glance. **Exactly one primary CTA per screen** wears the `--shu` seal treatment (the confirm/sign). **A lone primary
action inherits its card's center axis** — in a centered card/panel composition (the cold-open's "Open your
eyes", a modal's confirm) a single button is centered on the same axis as the title and prose, never
left-aligned by default (F3, playtest 2026-07-02).

**Auto-toggle (the autopilot switch).** A repeatable action — rake, a labour, a fight — pairs its verb with
a small **`▶ auto` / `■ stop`** toggle (the same ink-outlined paper button, `aria-pressed`, its "on" state
carrying an `--ai-soft` lit fill). It is how the calm grind runs itself without a click-storm. **Its risk
reads on the face of the button, never hover-only** (§8): the combat panel's fight-to-death toggle labels
itself `▶ auto · to the end` and warns *on its own face* that a loss costs koku (§10 Combat/Yard).

### 5.6 Nav (desktop rail + mobile bottom-bar/drawer)

The "UI as progression" chrome. Entries are **revealed in order** (§3.5 track): single column (none) →
Skills → Combat → Crafting → Quests → Map → House → Village → Region → Ties → Castle-town stub. **Desktop:** a left sidebar of
ink labels (kanji + emoji + romanized name); active = `--ai` text + a `--shu` seal pip + a `--surface`
highlight; inactive tabs sit on `--surface-deep`. **Each new entry slides in** (animated, narrated) — never
appears silently. **Mobile:** the same entries, same order, collapse to a **bottom tab-bar** (thumb reach) with
secondary/overflow in a **drawer/sheet**. Tabs swap the *workspace*; the global header vitals persist across
all screens.

### 5.7 Resource readouts (K/M/B)

The legibility spine. **Letter notation K/M/B the whole game** (never scientific `1e7`, never myriad
man/oku — PRD §6.9). **Fixed to 2 decimals max, fixed width** (`1.20K` not `1.2K`→`1.234K`),
`font-variant-numeric: tabular-nums`, **right-aligned** in columns so digits don't jitter as they tick.
**Always show the rate next to the value** (`+12/koku`). Key totals render in `--num-key` (indigo); the value
is **Arabic numerals**; the label may carry kanji. A single shared pure formatter in the renderer (fed by
selectors) owns the K/M/B scale.

### 5.8 The seal / stamp

See §4.6. Three jobs only: **House crest/logo** (header brand), **achievement/rank-up stamp** (the §6.2
press beat), **confirm/sign CTA**. Round variant = swap `<rect>` for `<circle>`. Never decorate with it.

### 5.9 Tooltips (NON-hover-dependent — mandatory)

**All information is reachable without hover** (PRD §6.9/§6.11). A base info layer is always reachable by
**tap/focus** (an `ℹ` affordance / expandable row), and "**Shift for more detail**" is an *enhancement* layer,
**never the only path** to a value. Tooltips are paper cards (`.frame`-lite) with sumi text; they appear on
focus and tap, dismiss on blur/tap-away, and are keyboard-reachable. Locked items get their unlock condition
here — **never a dead greyed box with no reason.**

### 5.10 Modals / dialogs

A paper card centered on a dimmed (sumi-tinted, low-opacity) scrim — *not* a black overlay. Used sparingly:
the rank-up beat, a save/load confirm, a quest-accept. Focus-trapped, Escape-closable, the primary action
wears the seal. Reveals via the §6.1 ink-in, not a generic scale-pop. **Modals keep GENEROUS internal
padding + section spacing** — the compact chrome-density rule (§4.8) is for the game HUD, not modals (F29).

**The settings modal → sub-tabs (F31/F33).** The settings modal is organised into **sub-tabs — Settings /
Saves / About** — not one long crammed column: **Settings** holds the comfort options (reduced-motion, sound,
text-scale, pause), **Saves** is a streamlined manage-saves surface (export / import / new-game), **About**
carries the description, build stamp, licence, and content notes. It **opens on the About tab** by default
(the calm, non-destructive landing — the player reaches for Saves/Settings deliberately).

**The full-screen error modal (F61).** A caught render/tick crash draws a **full-screen, intentional error
modal** — a solid, fixed, full-viewport overlay (high z-index) in the woodblock/ink palette (dark ink ground,
a washi card with a tasteful kanji nod) that **covers** the broken UI — **never** a small banner layered over
a blank or half-drawn page. It reassures "your progress is saved" (the save already happened), offers a
prominent Reload, and (DEV only) shows the error + stack. Mounted once and idempotent (a single reused node,
never stacked), all-inline-styled, and wrapped so the crash screen cannot itself throw.

### 5.11 The walkable map + the "Walk on 道" strip (T0+)

Space is **load-bearing**, not scenery (D-065/D-078/D-093). **Every labour and every foe is bound to a map
node, and there is no default "here"** — the player **walks** (a `move_to`) to a node to work it or fight
what stands there, and the map *earns its walk* by gating a richer yield. One hill past the near satoyama,
behind a **danger ring**, sits the **deep satoyama 奥山**: reachable only once conditioning clears the ring,
it gates the **richer forage** (more sansai + koku than the near woods) and **dens the boar** — so the
spatial spine ties straight into the koku economy and the cook-loop, not just flavour.

**The shared move-strip ("Walk on 道").** Movement is one reusable component: a row of **`→ node`** ink
buttons, each tagged beneath with *what waits there* — what you gather, whether *a foe stirs* (named only
once you have fought it — scout-by-fighting fog), the storehouse — and, for a node behind the danger ring, a
sumi **険** **ink-mark** (danger as ink, never a filter-skipping ⚠ emoji, §7) plus its conditioning-gate
reason shown **visibly on the disabled button** (§5.9), never a dead grey node with no reason. This same
strip renders **twice**: as the body of the Map tab **and** as a **"Walk on 道"** group at the foot of the
**Work tab**, so the player can move without a tab-switch — the spatial loop stays smooth.

**Presentation is a diverge (D-075) — three working framings, one shipped.** The default that ships (**A ·
paths list**) is a **you-are-here** `.frame` card — "You stand at the ⟨node⟩ ⟨kanji⟩" + the node's blurb +
a plain **"Paths lead to:"** move-strip — a diegetic, in-world framing that reads more handmade than a
sparse top-down grid at this content scale (A19). Two alternates live **DEV-only behind the variant toggle**
(stripped from prod): **B · 絵地図 estate schematic** (revealed nodes laid out by distance from the kura,
you-are-here lit, walkable ones live) and **C · 道中記 traveller's ledger** (each path a ledger row showing
the destination's blurb + what awaits — labour / foe / danger). All three are **pure-CSS schematics** — sumi
roads and **registration-mark nodes** on `--washi`, the current location on a `--shu` seal pip, reachable
nodes full ink ("lit") — **not** an illustrated/painted map. The map grows the way the nav does: it opens
tight around the estate and **extends into Asagiri (Village)** as a second node-cluster at **new-T2**, each
new region inked in and narrated (§6.1), never popped in silently.

### 5.12 Storehouse 蔵 (the kura bank)

A `.frame` paper panel — the **kura** — where the player **stows koku out of a fight's reach**. It reveals
with the estate economy and is **spatially gated to the kura node** (the storehouse *is* the kura, §5.11):
the running **balance shows everywhere** (your safe reserve is worth seeing on the road), but the **Deposit
all / Withdraw all** verbs appear **only while you stand at the kura** — off-node the panel drops to a plain
hint to *walk the 道 back to the 蔵*. Its header reads the two piles in ink, plainly —
`Carried N koku · stored N koku (safe)` — so the stake is legible at a glance, and a diegetic line spells
the rule the whole loss-loop turns on: **what you carry, a lost fight can take; what you store, you keep.**
The buttons are ordinary ink-outlined verbs (§5.5); Withdraw sits `--ink-faint` (faded / disabled) with a
"nothing stored" reason when the kura is empty (§5.9), never a dead grey box.

### 5.13 The full-screen dialogue (VN) scene (D-104)

The canonical frame for **first meeting a story-significant, INTERACTIVE NPC** — one who touches the story,
offers choices, or holds real discussion (minor/ambient NPCs stay inline in the log; D-104). The interactive
**intro is its first instance and is LOCKED to this presentation** — the earlier inline and bottom-dock
variants are scrapped (D-075 strip-on-approve), so prod ships only the VN scene (F43).

- **It hides the whole shell.** While the scene plays it **hides the entire game shell** (not a dim scrim,
  like the cold-open card) — the scene mounts on the document root and is all you see; the estate/tabs/panels
  **ink in AFTER** the scene (§6.1), making the intro the first beat of the game's incremental-reveal
  signature (F44).
- **A generous panel, typed left-to-right.** A **large** centred card (a generous share of the screen, F46)
  with a **kanji ink-seal nameplate** coloured per voice-category (pure CSS + type, no asset pipeline). Spoken
  lines reveal with the **GBA typewriter**, **LEFT-aligned** (a centred typewriter jitters, F54); prose
  left-aligns for natural word-wrap.
- **A divider before the choices.** The narration/spoken block is separated from the player's choice prompt
  ("What do you say to him?") + option buttons by a **divider** (an ink-brush rule, §4.5), so the spoken text
  and the decision read as distinct zones (F40).
- **Each beat fades in and re-types.** Advancing to the next beat **fades the new beat in and re-runs its
  typewriter** (never a jump), and when the scene ends the game UI **inks in gracefully** rather than snapping
  all-at-once (F55). Reduced-motion → instant, per §6.
- **The log is the instant transcript.** The scene owns the live reveal; the event log is populated
  **instantly** behind the hidden shell (§5.1, F48) — the transcript is already there when the shell reveals.

---

## 6. Motion language — tasteful "juice," not slot-machine

**Restraint is the aesthetic.** Our core is *quiet ascent*, so juice reads as **ink settling and seals
pressing** — **never** screen-shake, confetti, or per-tick particles. **Reserve big juice for milestones;**
routine ticks stay quiet (the slot-machine failure is rewarding *noise* — the craft is rewarding *meaning*).

**Performance + a11y rules (ship these):** animate only `transform` / `opacity` / registered custom props
(60fps); durations 140–620ms; ink easings; **all motion is opt-in behind `prefers-reduced-motion:
no-preference`**, with a hard guard backstop, and every animation uses `both` fill so reduced-motion users land
on the correct end state.

```css
:root {
  --ease-ink:   cubic-bezier(.2,.7,.2,1);     /* settles like a brush lift */
  --ease-press: cubic-bezier(.34,1.56,.64,1); /* overshoot for the seal    */
  --dur-fast:140ms; --dur:320ms; --dur-beat:620ms;
}
@media (prefers-reduced-motion: reduce) {       /* belt-and-suspenders backstop */
  *,*::before,*::after { animation-duration:.001ms !important; transition-duration:.001ms !important;
                         animation-iteration-count:1 !important; }
}
```

**JS tweens respect the setting too.** That CSS backstop only zeroes **CSS** animation/transition durations —
the **JS-driven rAF tweens** (the §6.3 pillar count-up, the number-jump, the floating "+N mote") must read
`prefers-reduced-motion` themselves and **snap straight to the final value** when it's set, since no CSS rule
reaches them.

| Beat | Where | Motion | Reduced-motion fallback |
|---|---|---|---|
| **6.1 Reveal / unlock** (the signature) | every new panel/tab/screen | fade + small rise + a **brush-wipe** `clip-path: inset(0 100% 0 0)→0` so it *inks in* L→R; children stagger; first-ever reveal carries `#roughEdges` for a hand-printed look | snaps to final state (still narrated in the log) |
| **6.2 Rank-up** (the seal press) | promotion / tier-up | a **hanko slams down**, overshoots, settles (`--ease-press`), a quick vermilion `seal-ring` flash + a 2–3px card settle; total < ~650ms | seal simply appears stamped |
| **6.3 Pillar number-jump** | 武威/官威/家産/家格 changes | **count-up** tween (ease-out) + a **pop** (scale 1.18, colour flash toward `--shu` on gain / `--ai` on loss), throttled/aggregated to a heartbeat | number snaps to final value, still informative |
| **6.4 Seasonal-result headline** | end-of-season judged result | a **brush-wipe** across the page in `--font-display`, `letter-spacing` relaxing + de-blur ("wet stroke drying crisp") | headline appears static |
| **6.5 Combat resolve** | a fight resolves | a quick **ink-strike**: a single shake + a diagonal slash sweep (`--shu` win / `--ai`-`--ink` loss), no gore | flash the result row once (or nothing); outcome is in the log regardless |
| **6.6 Allegiance swing** (Tama↔farmhand) | reputation web shifts | a meter's ink wash slides between poles with the `--ease-ink` settle; the favored side's label brightens | meter jumps to new position |
| **6.7 First-ascension ceremony** (once) | the first tier-up **T0→T1** | a held **title card** in `--font-display` (Yuji Syuku) brush-wipes in to name the new standing, the locked **pillar silhouettes stir** (§5.3) as the house rises, and the audio **swells** (a taiko roll + temple-bell 鈴, §6.8); longer and bigger than a routine rank-up, it **always lands BIG on first contact regardless of grade** (D-062), earned exactly once | card appears static, silhouettes settle to their resting state, the log + the granted boon carry the beat |
| **Floating "+N" mote** | income/reward | rises and fades in the resource's colour — **throttled/aggregated** to a heartbeat, never a strobe | suppressed; the log + total carry it |

Anticipation matters: as a gate-bar nears full, intensify subtly (brighter ink / a soft pulse); on cross,
release into the rank-up seal.

### 6.8 Audio cues — the traditional palette (cross-ref [`sfx-spec.md`](sfx-spec.md))

Audio follows the same **significance-gating** as motion — a cue on *milestones*, **nothing per-tick**, behind a
mute toggle. The voice is a **traditional Japanese palette** (the same anti-slop discipline as the visuals — no
generic UI blips). The **per-cue instrument mapping is owned by [`sfx-spec.md`](sfx-spec.md)** (the single
source — don't restate it here). **As built** ([`../../src/ui/sfx.ts`](../../src/ui/sfx.ts), the minimal pass):

- **Combat hit** → **taiko 太鼓** (a grounded thud; the combat resolve, §6.5).
- **Reward / koku** → **shamisen 三味線 / koto 箏** (a short pluck on a deed banking — aggregated, never per-tick).
- **Rank-up / ascension** → **temple-bell / suzu 鈴** (one clear struck bell; the seal press §6.2, the
  first-ascension swell §6.7).
- *(Ambient / **shakuhachi 尺八** narration & season-turn swells are the deferred **full bed** — sfx-spec §4.)*

Everything stays in **accent roles** — a held milestone cue, never a wall of sound; the event log still carries
the meaning if audio is muted.

---

## 7. Iconography — emoji as period motifs, not spam

Emoji are the only "color woodblock" spots — **restraint is everything**, or it reads as the AI-slop we
avoid. **Curate a tiny, consistent set with a coherent Edo register; pick ONE per concept and never deviate.**
Emoji are **decorative** (`aria-hidden="true"`); the kanji/word always carries the meaning.

**The locked set (extend only via this doc):**

| Concept | Emoji | | Concept | Emoji |
|---|---|---|---|---|
| Castle / house | 🏯 | | Spring 春 | 🌸 |
| Shrine / honour | ⛩️ | | Summer 夏 | 🎐 |
| Combat / Arms | ⚔️ (or 🗡️) | | Autumn 秋 | 🍁 |
| Coin / *mon* | 🪙 | | Winter 冬 | ❄️ |
| Rice / koku 石高 | 🌾 | | Edict / quest | 📜 |
| Sake / festival | 🍶 | | Lantern / inn | 🏮 |

Tame their saturation so they sit as ink-stained woodblock accents, not stickers:

```css
.emoji { font-size:1.1em; line-height:1; vertical-align:-.12em;
         filter: sepia(.25) saturate(.7) brightness(.95) contrast(1.05); }
.emoji--seal { filter: grayscale(1) sepia(1) saturate(4) hue-rotate(-10deg); } /* push toward vermilion */
```

Emoji stay in **accent roles** (season tag, log bullets, button affordances, pillar identity) — never the
primary visual. The kanji pillars and the event log do the heavy lifting.

---

## 8. Responsive — desktop ↔ mobile (never hover-dependent)

PRD §6.9 / canon §H: fluid layout (CSS grid/flex, container/media queries) reflowing columns → stacked.

- **Same reveal order, both layouts.** The reveal *data* is shared (§3.5); only the chrome differs. Desktop
  nav rail and mobile bottom-bar/drawer **grow the same number of entries in the same order**.
- **Mobile:** bottom tab-bar for the 3–5 primary areas (thumb reach); secondary/overflow in a drawer/sheet;
  **one panel visible at a time**; the **log keeps the most vertical space**. The global header vitals
  (resources + next-gate) persist.
- **Touch targets comfortably sized on mobile** (≥44px thumb reach); on desktop the compact density (§4.8)
  runs smaller control heights (~32px, above the WCAG 2.2 24px pointer minimum). **No hover-only controls** —
  every hover enhancement has a tap/focus equivalent (§5.9). "Shift for detail" is desktop polish, never the
  only path.
- **Number layouts must hold** at K/M/B growth (test 999B), long logs, many revealed tabs, and the smallest
  viewport (per the §4 / qa-playtesting "states that break layouts" checklist).
- **Text scale changes TEXT size only, not layout** (F30). The `textScale` setting multiplies the **type
  tokens** (`--fs-*`) — **never** the root `rem` unit — so text grows/shrinks while panels and spacing stay
  put; scaling the type must not reflow the whole UI (scaling the root font would drag every rem-based
  dimension). **Reduced motion** honours the setting + `prefers-reduced-motion`.

---

## 9. The anti-slop rules (the checklist this whole bible enforces)

What makes UI read as **generic / AI-slop**, and the rule that prevents it here:

| Slop pattern | The rule |
|---|---|
| Purple/blue web gradients, glassmorphism, glow accents, neon | **Banned.** Only **bokashi** (single-hue, large, soft) gradients exist (§4.4); no glass, no glow. |
| Generic rounded "card grid" / default shadcn / bootstrap look | **Banned.** `.frame` woodblock borders, square corners, asymmetric layout (§4). No pill radii. |
| Same shadow / same weight on everything (flat, nothing matters) | **Real hierarchy:** depth from *material + contrast* (paper steps, ink weight, the seal) — never uniform drop-shadows (§4.2, §5.1). |
| Pure #000 on pure #FFF (or any raw white surface) | **Banned.** Warm `--washi` paper + warm `--sumi` ink only (§2); **no raw white *anywhere*, down to DEV-only tooling/chrome** — every surface inherits the dark ink ground (§4.7, F1). |
| Lazy typography (ad-hoc sizes, one weight) | A **fixed type scale**, chosen display vs body faces, deliberate tracking (§3). Type *is* the art. |
| Static wall of numbers (no rate, no motion, no log life) | **Value + rate + eased count-up + a living log** (§5.1, §5.7, §6.3). |
| Number jitter / shifting layout as values change | **Tabular nums, fixed-width number columns, reserved space** (§5.7). |
| Dead greyed-out locked items with no reason | Locked = **hinted with its unlock condition** (tap/focus) or hidden — never a dead grey box (§5.4, §5.9). |
| Over-juice (per-tick particles/shake/sound) | **Significance-gated** feedback; routine ticks quiet, milestones get the seal (§6). |
| Emoji spam / inconsistent register | **One curated, desaturated set; one per concept** (§7). |
| Colour as the sole signal | Always backed by **icon + text + sign/arrow** (§2, §5.1). |
| Segmented / stepped "pip" meters where a continuous bar would do | **Prefer continuous ink (A19, a diverge winner):** a single filled brush-stroke bar reads more handmade than segmented pips at our content scale (§5.3). |
| A god's-eye grid / map at small content scale | **Prefer a focused, diegetic view (A19, a diverge winner):** at small content scale a focused, in-world framing beats a sparse top-down grid (§5.11). |

**The meta-rule:** strong, explicit, opinionated constraints (fixed palette, fixed scale, fixed spacing,
period motifs) read as *intentional*; defaults read as *generated*. When in doubt, commit harder to the
woodblock constraint — it is *protective* against slop precisely because it is opinionated.

---

## 10. Per-screen application notes

Each nav screen (revealed in the §3.5 order) and what makes its reveal a delight. The shared spine: the
event log narrates the reveal, a new nav entry slides in, the workspace gains exactly one new system — never
two at once.

- **Cold open (single column, no nav).** *kura* dark, one verb ("Open your eyes"), the persistent log, then
  the body/rest bar + rice counter. Maximum *ma* — the empty paper reads as confident, not unfinished. The
  whole screen is one `.paper` field, one `.frame` log, one seal-less verb button. First impression = a quiet
  woodblock page. **Delight:** the very first verb makes a log line *ink in* — the game proves it listens.
- **Work (R1+).** The labour loop: verb(s) + the koku/rate readout + the world-clock season tag (🌸 + 春).
  Still one calm column — but the verbs are now **the labour of the node you stand on** (space is
  load-bearing, §5.11), so once the map opens a **"Walk on 道"** move-strip sits at the foot of the tab, its
  `→ node` buttons hinting what waits down each road — you change what you can *do* by walking, no
  tab-switch. **Delight:** the season tag turning, the koku rate ticking with a count-up — "honest sweat"
  made legible.
- **Skills (R2 — first nav appears).** The *first navigation* — the screen splits Work / Skills; the nav rail
  is born with its first two entries. Skills surface **by doing** (fade in as XP first lands). **Delight:**
  the nav *itself* appearing is the signature beat — narrated: *"a way to track it appears."*
- **Combat / Yard (R3).** Reveals fractally (one post → rack → sparring slots). The panel opens with the
  **equipped weapon** + its durability band (repair / equip), then **the watch** — only the foes standing on
  your *current* node (spatial: no roster without walking to them), each a `.frame` row with its
  scout-by-fighting win-rate (an ink pip + word, hue on the pip only, §5.1). A fight resolves atomically to a
  log line with the **ink-strike** (§6.5); danger reads first in the **`life` HP meter** that inked into the
  header at the R2 wolf beat (§5.3). Each foe carries a **Fight** verb **plus two auto-modes** (§5.5):
  **`▶ auto · to the end`** (grind until you win or die — HP carries, and a **loss bites your carried koku**,
  so the toggle warns so on its face) and **`▶ auto · flee @20%`** (break off when HP drops below the
  threshold — though a burst foe can still land the killing blow first). The **stance** control
  (構え — the glass-cannon↔tank trade: aggressive = more damage dealt AND taken, defensive = less of both) arrives at **R5**, the **ability + item**
  slots at the **first weapon-L10 milestone** (never the all-slots-at-once dump). The first fight is
  **humbling**. **Delight:** danger enters the calm paper — the ⚔️ register and the slash motion contrast
  the farming quiet, and the storehouse 蔵 (§5.12) gives that danger a stake to bank against.
- **Crafting (R4).** *A page for making things appears.* A new **top-level tab** (not a nested panel — Q10):
  the simple loot→craft loop (Smith Gonta), with **graded weapon-durability bands** surfacing alongside it.
  **Delight:** the loop closes on itself — what you fought for becomes what you make.
- **Quests (R5).** *Jobs taken, jobs done.* A **top-level Quests tab** (not a nested panel — Q10):
  PEST-CONTROL / HUNT / CLEAR / DEFEND duties; the Combat panel's **stance** slot unlocks here too.
  **Delight:** the watch begins — a board of jobs to take and to finish, work gaining intent.
- **Map (R6).** The first distinct navigable *screen* (§5.11) — and the spine of a **load-bearing** space,
  not scenery: every labour and every foe lives on a node, and the walk out to the **deep satoyama 奥山**
  past the danger ring buys the richest forage and dens the boar, so the map is a *system*. The framing that
  ships (variant A) is the **you-are-here** card — "You stand at the ⟨node⟩" + its blurb + a **"Paths lead
  to:"** move-strip — with two DEV-only alternates (**B · 絵地図** schematic, **C · 道中記** ledger)
  auditioning behind the variant toggle (D-075). Pure-CSS schematic (ink lines on paper, registration-mark
  nodes), **not** an illustrated map; it **extends into Asagiri (Village)** as a second node-cluster at
  **new-T2**. **Delight:** "you can picture the land now" — the world gains spatial scale for the first time,
  and the first steps along that road feel like the house reaching past its own gate.
- **House / Influence (R7).** The capstone: the **家威 panel** reveals **bar-by-bar** (§5.3), each pillar in
  its own colour/kanji/emoji, opening at T0 with exactly its **one revealed bar — Estate** + the three locked
  pillars as **unnamed silhouette teasers** (D-055); the domain-ranking read shows "unranked." The other
  pillars ink in **later, each its own narrated reveal** — the **Arms** bar at **T1**, the **Office** bar at
  **V4** (T2), the **Name** bar at **T3** — teased here only as nameless silhouettes, never pre-spoiled as
  named placeholders. **Delight:** the payoff of "do deeds first, see the standing last" — the player finally
  *sees what the house has become*, the lone Estate standing rising past silhouettes of standings yet to come,
  crowned by the 家威 seal.
- **Village (T2 / V0).** Asagiri: a shop row, the reputation web, the inn 🏮 + rumours board. The first
  multi-actor social surface. **Delight:** the legend ignites — the village calls him "Tama"; the allegiance
  meter (§6.6) appears.
- **Region (T2→T3).** The map "grows a page wider": a cluster map, the post-town, roads, rival houses appear.
  **Delight:** scale jump — the schematic map gains a second tier of nodes; the personal-mystery payoff lands.
- **Ties / Origin (T3-G2, doubly-earned).** The Sawatari-juku contacts + the `O0→O5` Origin reputation ladder.
  A quieter, more intimate page (more *ma*, softer ink). **Delight:** *"a page you didn't know you'd been
  missing"* — the de-emphasised identity thread, handled with restraint.
- **Castle-town stub (T3→T4).** A first-contact stub: stone walls + a magistrate's **seal**, then the story
  pauses. **Delight:** a `--shu` seal on stone — the cliff-hanger; the seal motif at its most charged.

---

## 11. The visual-QA hook

**Every screen and every transition is screenshot-reviewed against THIS bible** — the agent drives the game
headlessly (`window.__qa` / the `capture-game-states` skill), screenshots desktop **and** the mobile
bottom-bar layout, and reviews each against §§1–10 with its own vision (woodblock/ink coherent? type/spacing/
colour-roles right? log reading as the heart? reveal/rank-up motion satisfying? any slop/overflow/contrast/
placeholder fail?) before surfacing self-vetted candidates to the human — per
[`qa-playtesting.md`](qa-playtesting.md) §4. *This bible is the rubric that loop scores against.*

---

## Summary & open choices for the human

**Summary.** This bible locks the Kurosawa house to a **mid-Edo woodblock** register — warm *washi* paper, warm
*sumi* ink, one disciplined indigo, and a rare vermilion seal — built entirely in **text + emoji + CSS + inline
SVG**, with **no asset pipeline**. It defines a tight eight-role palette (plus four distinct four-pillar
identities), a two-family typography plan (Shippori Mincho body/heads + Yuji Syuku for two hero beats) with a
KB-sized kanji subset, a woodblock layout/surface system (paper-grain, key-block frames, bokashi, the hanko
seal), a full reusable component kit centred on the **event log as the hero**, and a restrained
seal-and-ink motion language (significance-gated juice, reduced-motion-safe). It encodes the **anti-slop
checklist** as enforceable rules and maps the language onto every revealed screen, with the visual-QA loop
scoring against it. Numbers stay **K/M/B + tabular**, romanization keeps **macrons**, and nothing is
hover-dependent.

**Open choices flagged for the human:**

1. **Final font pick — ADOPTED.** M1/M2 shipped on the draft default = **Shippori Mincho** (body/heads) + **Yuji
   Syuku** (rank-up + season headline only), with a **system-mincho fallback**; this is the de-facto default.
   Alternatives once auditioned: **Zen Old Mincho** (more nostalgic/cultural), **Klee One** (textbook brush
   warmth), **Hina Mincho** (delicate hairline). Self-host still pending (Q52).
2. **Font delivery — RESOLVED (Q52/D-013):** self-hosted hand-subset `.woff2` (**Option B** — offline, purest
   for "no asset pipeline"); Google dynamic subsetting (Option A) rejected. Not yet implemented in the build —
   still on the system fallback until self-host lands.
3. **Palette fine-tune:** two source briefs gave near-identical but not identical hexes; this doc merged toward
   the registry-anchored ukiyo-e values (e.g. `--shu #D7402C`, `--ink #26221E`). The palette shipped as
   authored (tokens in [`src/ui/styles.css`](../../src/ui/styles.css) match), so the "eyeball on real screens"
   is now a done/actionable tune — trivially tunable since everything is a token.
4. **"Standing & Office" kanji = 官威 (*kan'i*, "authority of office")** — RESOLVED 2026-06-25 (the coined 政威
   was rejected; spoken homophone of 官位 court-rank, disambiguated by the kanji). Label 官威 + 📜 / `--ai` identity.
5. **Ambient canvas FX** (optional seasonal particles, PRD §6.9) are permitted but unspecified here — confirm
   whether to spend on them or keep the paper deliberately still.

---

### Sources (per the research briefs synthesized above)

- **Palette / ukiyo-e:** Kintoki — *Chemistry of Ukiyo-e Pigments*; jpwoodblocks — *Colors of Japanese Prints*;
  Wikipedia — *Aizuri-e*, *Traditional colors of Japan*, *Bokashi (printing)*, *Ukiyo-e*; Lospec — *Japanese
  Woodblock palette*; MutualArt — *Negative Space in Ukiyo-e*; House of Koyomi / Art of Zen — *the hanko seal*.
- **Typography / CSS:** Google Fonts — *Shippori Mincho*, *Shippori Mincho B1*, *Yuji Syuku*, *Noto Serif/Sans
  JP*; Google Fonts + 日本語 (dynamic subsetting); CSS-Tricks — *Grainy Gradients*, *Animating Number Counters*,
  *Multiple Borders*; Codrops — *feTurbulence / feDisplacementMap texture*; Andy Jakubowski — *ink-bleed SVG
  filters*; MDN — *box-shadow*, *CSS animations*, *prefers-reduced-motion*; Can I Use — *@property*; W3C WAI —
  *C39 reduced-motion*.
- **Incremental UI / readability / juice:** InnoGames / Game Developer — *huge numbers in idle games*; Fred Z. /
  FictionTalk — *the number goes up*; GameAnalytics / GameJuice — *juice it or lose it*; IxDF / UXPin /
  UI-Patterns — *progressive disclosure*; memalign — *Universal Paperclips*; Melvor Idle; Developers Digest /
  Managed Code — *spotting & avoiding AI design slop*.
