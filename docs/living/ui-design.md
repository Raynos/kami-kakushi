# UI Design-Language Bible — *the Kurosawa house*

> **SNAPSHOT-CLASS — replace in place, never append (ADR-126). Hard cap: 400 lines.** The `src/ui` renderer is
> built to this bible (reconciled to the T0 rebuild, v0.3.x). Cross-cutting design JUDGMENT lives in
> [`taste.md`](taste.md) (the 4 values + 21 principles — read it first); THIS doc owns the visual language:
> palette roles, type, surfaces, components, motion, iconography. **Token VALUES are generated, not stated
> here** → [`docs/content/ui-tokens.md`](../content/ui-tokens.md) (derived from
> [`src/ui/styles.css`](../../src/ui/styles.css) by `gen:docs`). The LOCKED art direction (human-signed):
> a **strong CSS design-language, NO asset pipeline** — text + emoji + CSS + inline SVG only. Numbers display
> **K/M/B**; romanization uses **macrons**. History/full recipes: git (the pre-D-126 bible), styles.css.

## 1. Vision

> **PROVISIONAL — pending R9 (ADR-126).** The human rates the woodblock/ink direction *softer canon than this
> doc once claimed*; the UI-remaster review (R9) resettles the visual identity. Until then this register
> stands, but do not harden it further — treat it as the current default, not immutable canon.

The Kurosawa house looks like a **mid-Edo woodblock print left out on a worktable** — warm unbleached *washi*,
warm sumi ink doing the line-work, one disciplined **indigo** as the "second ink," and a single **vermilion
seal** that means *important* because it is rare. Intentional, restrained, warm — *quiet ascent through a
declining house*, never a flashy mobile idler (anchored to 1780, ADR-105). The **event log is the heart of the
screen**; the signature feeling is **"UI as progression"** — one calm column that *inks new panels, tabs, and
screens into existence* as the house rises, each reveal narrated as plot. Depth comes from **material and
contrast** (paper grain, ink weight, the seal's red), never drop-shadows/gradients/glass/neon. Handmade and
confident = on vision; generic web app or AI placeholder = failed.

## 2. Palette — eight disciplined roles (values: generated)

Paper + ink + indigo, one earth tone per context, vermilion reserved for the seal/CTA. Two reds, two blues,
two earths, ink, paper — no rainbow. Roles (hex values + semantic aliases live in
[`ui-tokens.md`](../content/ui-tokens.md)):

- **washi / washi-shade / washi-deep** — the paper field: canvas → cards → recessed wells. Never pure `#FFF`.
- **ink / ink-soft / ink-faint** — ALL text, borders, rules (never `#000`). `--ink-faint` is
  decorative/disabled-ONLY — it never carries an active value.
- **ai / ai-soft** — indigo, the only structural accent: headers, active tab, links, key totals, bokashi.
- **shu / shu-deep** — the vermilion seal: hanko, the ONE primary CTA per region, the rank-up beat. If two
  reds compete on a screen, demote one to `--beni`.
- **beni** — secondary red: negative deltas, warnings, crests.
- **kihada / ochre / rokusho / gold** — earth secondaries; pick ONE per context, never all at once.
- **pillar-*** — the four-pillar identities (Arms `--beni` ⚔️ · Estate `--ochre` 🌾 · Office `--ai` 📜 ·
  Name `--rokusho` ⛩️ · the 家威 roll-up = the seal).
- **attr-*** — the five-attribute pigments (FB-66): STR 弁柄 iron-red · AGI 若竹 green · INT 紫 murasaki ·
  SPD 浅葱 cyan · LUCK 金茶 gold. Keyed to the +1; worn as a legible accent, never a flood-fill.

**Usage discipline:** deltas use indigo (gain) / beni (loss), never generic green/red, and colour is never the
sole carrier (sign + arrow + label always ride along). Identity hues are FILLS/ACCENTS only — all
meaning-bearing text renders in ink (`--ink` body, `--ink-soft` secondary, `--ai` headers/key totals); no
coloured WIN/LOSS word-as-text. Per-token contrast: `--ink-soft` clears AA (≈7.3:1) on every washi surface;
meter fills are darkened so values drawn on them stay AA. Colourblind mode swaps hues as a comfort layer —
meaning already lives in icon + text.

## 3. Typography

Type IS the art (no asset pipeline). Two JP-capable families + a numerals face; sizes/faces are tokens
(`--font-*`, `--fs-*` → [`ui-tokens.md`](../content/ui-tokens.md)):

| Role | Family | Rule |
|---|---|---|
| Body / UI | **Shippori Mincho** (400/500) | Old-style mincho; reads as printed Edo paper. `palt` on. |
| Headings | **Shippori Mincho B1 ExtraBold** | Struck-woodblock titles, legible at density. |
| Hero calligraphy | **Yuji Syuku** (brush) | ONLY the rank-up title + seasonal headline — nowhere else. |
| Live numerals | **Zen Kaku Gothic New** / system | `tabular-nums`; ticking values only, so the page stays ink. |

**Rules.** Kanji labels ≥16px. Live counters use Arabic numerals in tabular-nums — kanji numerals only in
static labels. Romanization keeps macrons (*gōshi*, *jitō-dai*). Body stays crisp — ink-bleed/blur is for
display beats only (§6). The fixed UI kanji set ships as a **self-hosted hand-subset `.woff2`** (a few KB —
Q52/ADR-013: a font, not an art asset; Google dynamic subsetting rejected for offline purity).

## 4. Layout & surfaces

### 4.1 Spacing, grid, materials

A single 4px spacing scale (`--space-*`), square/lightly-cut corners (`--radius: 3px` — never pill-rounded),
generous *ma* (negative space early is confidence). The material recipes are implemented in
[`styles.css`](../../src/ui/styles.css) — one-line contracts:

- **Paper grain** (`.paper`): inline-SVG `feTurbulence` noise (opacity 0.03–0.07) under warm gradients;
  surfaces step washi → shade → deep so cards read paper-on-paper — depth from material, not shadow.
- **Woodblock frame** (`.frame`): the key-block outline — triple inset box-shadow rules + an inner keyline
  stopping short of corners; a printed-plate offset, never a soft drop-shadow. `#roughEdges` wobble on
  STATIC decor only (one hidden `<svg>` holds all filters; displacement never animates per-frame).
- **Bokashi** — the ONE sanctioned gradient: single-hue, large, soft washes on a header edge / behind the
  log. Never gradients-for-depth, never the purple/blue web gradient.
- **Brush-rule divider**: a masked, tapered gradient stroke through `#roughEdges`.
- **The hanko seal** (§5.8): inline SVG, `mix-blend-mode: multiply` so grain shows through the red. NB:
  `var()` resolves in inline SVG only via `style=`/CSS, never as a raw presentation attribute.

### 4.2 The app shell (FB-1–FB-8; taste.md 19–20)

A centered paper column (~1200px) on the dark sumi ground — the margin IS the ink ground, an intentional
woodblock border, and **no raw white anywhere, DEV tooling included**. Inside: the idle-RPG frame — fixed
header (identity + vitals §5.7 + the rung element top-right §5.4) / internally-scrolling content / fixed
footer (clickable version stamp bottom-left → About §5.10; DEV toggle LEFT of Settings bottom-right, own
hit-areas). **100dvh, no page scrollbar**; ≤720px relaxes to natural page flow.

**The multi-panel workspace (ADR-106, LOCKED by FB-69/FB-70): 屏風 folding columns + soft cards** (V6B×V7C). The
workspace may span the full width as 2–3 flexible columns — but always framed with left/right gutters, never
edge-to-edge. The **log is a first-class but CAPPED reading column: ⅓–~46% of the capped container** (never
raw `vw` — it balloons on wide screens, FB-117); the Work fold holds the majority and fills as panels unlock.
Panel text always reflows to its actual column width; the panel itself is the scroll container. Transitions
render **complete or not at all** (no ghost meters, no overlapping controls — taste.md 6); stacked cards size
to content and never clip (FB-94); padding is consistent across ALL tabs (FB-98). DEV chrome is a fixed overlay
reserving ZERO layout space; `?dev=no` previews the true layout (workshop bar:
[`qa-playtesting.md`](qa-playtesting.md) §9).

### 4.3 Density — two registers (taste.md 19)

Game chrome is **compact like the reference idlers** (proto23 register; ~32px control heights, tight type,
minimal chrome padding — content gets the space). Reading + ceremonial surfaces (log, story beats, intro,
modals, the cold-open with its delayed CTA) keep **generous breathing room**. Size each surface to its job;
never one global scale.

### 4.4 The seven-tab IA (ADR-112 → ADR-119)

**Work · Map · Estate · Inventory · Character · Combat · Quests**, revealed incrementally (Work R0 · Map +
Estate R1 · Character R2 · Combat + Inventory R3 · Quests R5); the nav bar itself appears once ≥2 tabs
qualify. Reveal is gated by real content (ADR-055), one-per-beat (the ADR-119 stagger). One capability, one tab
(taste.md 1):

| Tab | Kanji | Holds |
|---|---|---|
| Work | — | Labour actions ONLY — the node-labour verbs. |
| Map | 地図 | The current node: walk-to, who's here (talkable), the node description — navigation's single home. |
| Estate | 家 | House upgrades + the 家威 capstone panel (R3+). |
| Inventory | 蔵 | The storehouse/bank (§5.12) + personal belongings (ADR-111). |
| Character | 己 | Attributes, skills, bestiary (sections, not screens). |
| Combat | 武 | The fight loop + stance + the node watch (ADR-100). |
| Quests | 用 | Undertakings (glyph 用 provisional). |

The rung lives in the HEADER, not a tab (FB-106/FB-116; §5.4).

### 4.5 Append-only rendering (taste.md 4 — ROOT rule)

Build once, then reconcile: append/patch only changed nodes; never `innerHTML`/`textContent`-reset a
container. Zero idle churn (a no-op tick paints nothing). Track timers individually — never tear down the
DOM that owns them. Applies to every surface: the shell, the log, the VN scene.

## 5. Components — the kit (contracts; the build is the reference)

All pure CSS + text + emoji + inline SVG, built by the renderer from `surfaces.ts` data.

### 5.1 Event-log (THE HERO surface)

A tall paper scroll on `--surface` with a faint bokashi wash; ARIA live region; smooth follow-the-newest
scroll (reduced-motion snaps). Line tiers: `narration` `--ink-soft` · `reward` ink + emoji bullet, `+N` in
`--ai` · `combat` ⚔️ bullet, outcome WORD in ink with the win/loss hue on an adjacent pip only · `system`
smaller (quiet from size/weight, never faint ink) · **milestone/rank-up** heavier + a `--shu` seal stamp + a
held beat. Diegetic voice carries the Edo flavour — this is where it lives.

- **Channels** (bottom filter bar, importance-ordered): **Story · Progress · Chat · Combat · Work · All ·
  Now** — routing per taste.md 16 (Story = mandatory beats; Chat = optional Q&A, keeps its voice; Work =
  notable only; rung-up STORY prose → Story, the terse unlock notice → Progress; navigation flavour → the
  Map node description, never Story). **Now** = fleeting spam, ~15s wall-clock expiry (runs even hidden),
  fade + slide-up.
- **Behaviour**: stick-to-bottom + land-at-bottom on tab switch; unread dots on off-view channels (in-session
  arrivals only — loaded history is SEEN); full-width text, panel-edge scrollbar, header border + soft top
  fade (taste.md 17–18).
- **Voice**: every voiced line prefixed with the speaker's name and coloured by CATEGORY (narrator
  `--ink-soft` · player `--rokusho` · physician `--ai` · steward `--ochre` · arms `--beni` — each AA on
  `--surface`); set at emission in pure-core (taste.md 3). The GBA typewriter runs on the story channel only,
  left-aligned (taste.md 12).
- **The live scene owns the reveal; the log is the instant historical transcript** (FB-48) — painted behind
  the hidden shell, already there when the shell inks in.
- **A− / A+ font stepper** bottom-right, log-local, persisted to the save (taste.md 7).

### 5.2 Perk cards (FB-56; taste.md 13)

Rewards render as JRPG "learned" boxes in-palette (a bordered `.frame`-lite on `--surface`, never a red
web-toast): a NAMED perk (may reference Sōan/Memory/Genemon) + a STANDALONE description + the mechanics as
context. Choice buttons and their perk cards share the `--attr-*` pigment of the +1 they grant.

### 5.3 Meters & the four-pillar 家威 panel

**Bar = shape, number = precision, colour = state — never a naked bar or number.** Paper-grained track,
darkened ink/indigo fill (AA on-fill), registration-mark threshold ticks, eased fills + count-ups, always
the rate beside the total (`家威 4.20K koku (+12/season)`). Header vitals: **body** (satiety, `--beni` warn
when low) and **life** (HP — inks in at the R2 wolf beat, bar + exact `hp/max` numeral, no auto-heal, low at
≤30%). The four-pillar panel reveals **bar-by-bar** (Estate at T0; Arms T1, Office T2, Name T3); locked
pillars are **unnamed `--ink-faint` silhouette teasers** (ADR-055) — no kanji, no value. Estate shows its
LAND/TREASURY/TRADE sub-segments with the trade-⅓ cap as a hard registration mark.

### 5.4 The rung element (header, top-right — the sole home)

Compact rung name + progress bar; hover/focus card carries the detail (meter numbers, this rung's meaning,
the next). Ladder presentation: unlocked rungs + the next one-or-two silhouetted, rest hidden. **A rung-up
is a player-TRIGGERED story beat** (ADR-110): the header surfaces a "ready to advance" summons that holds and
can be ignored; triggering plays the full-screen VN beat (§5.13) motivating each unlock. Payloads are
relationship/flag-first — occasional small varied bonuses, NOT every rung a perk.

### 5.5 Buttons (verbs)

Flat ink-outlined paper (`.frame`-lite): sumi border, `--surface` fill, square corners; hover/focus →
`--ai-soft` fill + visible focus ring. Available = full ink ("lit"); unavailable = `--ink-faint` ("faded")
with the reason on tap/focus. **Exactly one `--shu` primary CTA per screen**; a lone primary action inherits
its card's center axis (FB-3). Repeatable actions pair a **`▶ auto` / `■ stop`** toggle (`aria-pressed`);
risk reads on the button's own face (`▶ auto · to the end` warns a loss costs coin), never hover-only.

### 5.6 Nav (the tab presentation)

Ink labels (English + kanji), active = `--ai` text + a `--shu` seal pip + `--surface` highlight; each new tab
slides in, narrated by its unlocking beat — never silently. Mobile: same tabs/order in a bottom bar + drawer
(§8). New Game returns to the zero state — Work tab, Story filter (FB-25).

### 5.7 Resource readouts

**K/M/B letter notation the whole game** (never `1e7`), 2 decimals max, fixed width, tabular-nums,
right-aligned, rate beside value; one shared pure formatter. The three economy nouns display DISTINCTLY
(ADR-107/108/109): **COIN** — one `mon` 文 value in fixed mixed denominations mon → monme 匁 → ryō 両,
higher units revealing as wealth grows (`formatCoin` owns the split) · **RICE** 🌾 — a plain count (eat /
store / sell) · **KOKU** 石高 — the House's seasonal STANDING score, never spent, never a multiplier, wears
石高/家 (never 🌾), immune to combat loss.

### 5.8 The seal / hanko

Three jobs only: House crest (header), achievement/rank-up stamp (§6), confirm/sign CTA. Never decoration.

### 5.9 Tooltips — never hover-dependent

All information reachable by tap/focus (`ℹ` / expandable row); "Shift for detail" is an enhancement, never
the only path. Locked items carry their unlock condition — never a dead grey box with no reason.

### 5.10 Modals

A paper card on a sumi-tinted scrim (not black); focus-trapped, Escape-closable; generous padding (density
is for chrome, not modals). **Settings modal = Settings / Saves / About sub-tabs**, opening on About; the
footer version (single-sourced from package.json, AC-21) opens it, and About deep-links the raw
`CHANGELOG.md` on GitHub. **A caught crash draws the full-screen in-palette error modal** — progress-saved
+ Reload, DEV-only stack, idempotent single node, inline-styled so it cannot itself throw (taste.md 8).

### 5.11 The Map tab — the walkable node

Space is load-bearing (ADR-065/ADR-078/ADR-093): every labour and foe binds to a node; you WALK (`move_to`) to
work or fight; the deep satoyama 奥山 behind the danger ring gates the richer forage + the boar. Navigation
lives ONLY here (FB-107); Map ≠ Estate (FB-112); every visited location stays reachable (FB-113); NPC placement
shifts by tier/rung. **The node = two sections (FB-102/ADR-116):** a bordered "where you are now" description
(immersive, carries the discovery hints, persists) + a terse navigation section hinting NOTHING about next
zones — click the card to travel, flavour updates on arrival (taste.md 15). Danger nodes wear a sumi 険
ink-mark (never ⚠) + the gate reason on the disabled affordance. **Who's here — vendors are PEOPLE**
(ADR-114): talk-to-reveal; the spectrum runs full-VN character → small person → tiny trader (straight to the
trade menu); vendors may be place-gated; every entity is discovered via a beat (FB-99). **Presentation is an
OPEN diverge (ADR-115)** — ~7 pure-CSS schematic variants (sumi roads, registration-mark nodes, `--shu`
you-are-here pip; never an illustrated map) await the human's live pick (R7).

### 5.12 Storehouse 蔵 (the kura bank — Inventory tab)

The bank: balance shows everywhere, but store/withdraw verbs work only standing AT the kura node (off-node,
a hint to walk the 道 back). Header reads carried vs stored plainly; the diegetic rule: **what you carry, a
lost fight can take; what you store, you keep** (a loss bleeds carried coin + rice + materials, ADR-113; koku
standing is never carried). Withdraw sits faded-with-reason when empty.

### 5.13 The full-screen dialogue (VN) scene (ADR-104/ADR-110)

The canonical frame for story-significant interactive NPCs AND every rung-up beat. The contract (details:
taste.md 9/11/12/14 + the build):

- Hides the WHOLE shell (mounts on root); the UI inks in after; the log fills instantly behind it.
- A large fixed-size card: **story column LEFT** (scrolls internally, sticks to bottom, speaker-name
  prefixes, the shared fresh-entries divider) · **interactive column RIGHT** (static, persistent, phase-swap
  in place: ASK topics + "Done questioning" gate → then the decision).
- Kanji ink-seal nameplate per voice-category; a brush-rule divider before the choices; asked topics render
  dimmed-not-disabled; small choice sets lay out 2×2 / 1×3; choices resolve in place → your line + the reply
  → one Continue; each beat fades in + re-types; decision buttons wear their `--attr-*` pigment.
- Append-only rendering, the one auto-advancing typewriter (a click completes the line, never pauses/skips).

## 6. Motion — ink settling and seals pressing

**Restraint is the aesthetic**: juice reads as ink and seals, never shake/confetti/per-tick particles; big
juice is reserved for milestones. Animate only `transform`/`opacity`/registered props; durations 140–620ms;
ink easings (`--ease-ink`, `--ease-press`); ALL motion behind `prefers-reduced-motion: no-preference` with a
hard CSS backstop — and JS rAF tweens must read the preference themselves and snap to final values.

| Beat | Motion (reduced-motion → static/snap) |
|---|---|
| 6.1 Reveal/unlock (the signature) | fade + small rise + a brush-wipe `clip-path` inks it in L→R; staggered children; first-ever reveal carries `#roughEdges`. |
| 6.2 Rank-up | the hanko slams, overshoots, settles + a vermilion seal-ring flash; < ~650ms. |
| 6.3 Number-jump | eased count-up + a pop (scale/colour flash), throttled to a heartbeat. |
| 6.4 Seasonal headline | a brush-wipe across the page in the display face — "wet stroke drying crisp". |
| 6.5 Combat resolve | one ink-strike: a single shake + diagonal slash sweep (`--shu` win / ink loss), no gore. |
| 6.6 Allegiance swing | the meter's ink wash slides between poles. |
| 6.7 First-ascension (once) | a held display-face title card + pillar silhouettes stirring + the audio swell; always lands BIG (ADR-062). |
| "+N" mote | rises/fades in the resource colour — aggregated, never a strobe. |

Anticipation: a gate-bar nearing full intensifies subtly, then releases into the seal. **Audio** follows the
same significance-gating (taiko hit · shamisen/koto reward · temple-bell rank-up), mapping owned by
[`sfx-spec.md`](sfx-spec.md); the log still carries the meaning muted.

## 7. Iconography — emoji as period motifs, not spam

One curated, desaturated set (`.emoji` sepia filter); **one emoji per concept, extend only via this doc**;
emoji are decorative (`aria-hidden`) — kanji/word carries the meaning:

| Concept | Mark | | Concept | Mark |
|---|---|---|---|---|
| Castle / house | 🏯 | | Spring 春 | 🌸 |
| Shrine / honour | ⛩️ | | Summer 夏 | 🎐 |
| Combat / Arms | ⚔️ | | Autumn 秋 | 🍁 |
| Coin (mon→monme→ryō) | 🪙 | | Winter 冬 | ❄️ |
| Rice 米 (resource) | 🌾 | | Edict / quest | 📜 |
| Koku 石高 (standing) | 家 seal — **never** 🌾 | | Lantern / inn | 🏮 |
| Sake / festival | 🍶 | | Danger node | 険 ink-mark (never ⚠) |

## 8. Responsive — desktop ↔ mobile, never hover-dependent

The same reveal order in both chromes; mobile = bottom tab-bar (thumb reach, ≥44px targets) + drawer, one
panel at a time, the log keeping the most vertical space; desktop runs the compact ~32px density (§4.3). No
hover-only controls — every hover has a tap/focus twin (§5.9). Layouts must hold at 999B numbers, long logs,
all tabs revealed, smallest viewport. Text-scale multiplies type tokens only, never the rem unit (taste.md 7).

## 9. The anti-slop rules (the enforceable checklist)

| Slop pattern | The rule |
|---|---|
| Purple/blue gradients, glass, glow, neon | Banned — only bokashi gradients exist (§4.1). |
| Generic rounded card-grid / default component look | Banned — `.frame` woodblock borders, square corners, asymmetric *ma*. |
| Same shadow/weight on everything | Hierarchy from material + contrast (paper steps, ink weight, the seal). |
| Pure #000/#FFF, raw white anywhere (DEV included) | Banned — warm washi + warm sumi only (FB-1). |
| Lazy typography (ad-hoc sizes, one weight) | The fixed scale + chosen faces; type IS the art (§3). |
| A static wall of numbers | Value + rate + eased count-up + a living log. |
| Number jitter | Tabular nums, fixed-width columns, reserved space. |
| Dead greyed locked items | Locked = hinted with its unlock condition, or hidden (§5.9). |
| Over-juice (per-tick particles/shake/sound) | Significance-gated; routine quiet, milestones get the seal (§6). |
| Emoji spam / inconsistent register | One curated desaturated set, one per concept (§7). |
| Colour as the sole signal | Always icon + text + sign/arrow too (§2). |
| Segmented pips where a bar would do | Prefer continuous ink (A19). |
| A god's-eye grid at small content scale | Prefer the focused, diegetic framing (A19). |

**The meta-rule:** strong, opinionated constraints read as intentional; defaults read as generated. When in
doubt, commit harder to the constraint — it is protective *because* it is opinionated.

## 10. Per-screen reveal beats (delight notes)

The spine: the log (and from R1 the VN beat) narrates each reveal; the workspace gains exactly ONE new
system per beat. Tab homes per §4.4. Cold open — maximum *ma*, one verb, the first log line proves the game
listens. Work — the node's labour + the season tag turning. Skills (R2) — the nav itself appearing IS the
beat. Combat (R3) — danger enters the calm paper: the watch (current-node foes only), the equipped weapon +
durability, two auto-modes with on-face risk, the humbling first fight, the header HP meter. Crafting (R4)
— the loot→craft loop closes on itself. Quests (R5) — the watch begins. Map (R6) — "you can picture the
land now." House 家威 (R7) — the lone Estate bar rising past unnamed silhouettes, crowned by the seal.
Village (T2) — the legend ignites; the allegiance meter appears. Region (T2→T3) — the map grows a page
wider. Ties/Origin (T3) — a quieter, more intimate page. Castle-town stub (T3→T4) — a `--shu` seal on
stone; the cliff-hanger.

## 11. The visual-QA hook + open items

Every screen and transition is screenshot-reviewed against THIS bible + [`taste.md`](taste.md) (the agent
drives `window.__qa` / `capture-game-states`, desktop + mobile, own-vision review) before candidates reach
the human — per [`qa-playtesting.md`](qa-playtesting.md) §4. Open items: **Q52 font self-host** (adopted,
not yet implemented — still on system fallback); **ambient canvas FX** (permitted, unspecified — spend or
keep the paper still?); **R9** resettles the vision (§1). Research provenance: the pre-D-126 bible in git
history (sources listed there).
