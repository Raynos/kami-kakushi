# UI Design-Language Bible — *the Kurosawa house*

> **SNAPSHOT-CLASS — replace in place, never append (ADR-126). Hard cap: 400 lines.** The `src/ui` renderer is
> built to this bible (reconciled to UI-v2 Andon Steel, v0.3.x — ADR-127). Cross-cutting design JUDGMENT lives
> in [`taste.md`](taste.md) (the 4 values + 21 principles — read it first); THIS doc owns the visual language:
> palette roles, type, surfaces, components, motion, iconography. **Token VALUES are generated, not stated
> here** → [`docs/content/ui-tokens.md`](../content/ui-tokens.md) (derived from
> [`src/ui/styles.css`](../../src/ui/styles.css) by `gen:docs`). The LOCKED art direction (human-signed):
> a **strong CSS design-language, NO asset pipeline** — text + emoji + CSS + inline SVG only. Numbers display
> **K/M/B**; romanization uses **macrons**. History: the pre-ADR-127 woodblock/washi bible lives in git.

## 1. Vision — Andon Steel (ADR-127, human-locked 2026-07-04)

The Kurosawa house looks like **blackened steel under lantern light** — dark plate surfaces on a deeper void,
kept alive by keylines and catchlights, never by texture. The identity is the **BIMETAL semantic**:

- **SILVER** = state / chrome / labels / the top-edge rim.
- **GOLD** = value / numerals / progress / the keyline / the plate face.
- **VERMILLION** = commit / danger — the LONE hot accent, spent only where it means something
  (the ceremony, a genuine hazard). The two metals never share a pixel.

Intentional, restrained, composed — *quiet ascent through a declining house*, never a flashy mobile idler
(anchored to 1780, ADR-105). The **event log is the heart of the screen**; the signature feeling is **"UI as
progression"** — one calm frame that *reveals new panels, tabs, and screens* as the house rises, each reveal
narrated as plot. Depth comes from **keylines, rims and plate gradients** (a 1px gold keyline, a silver
catchlight, a vertical steel grade) — never grain, drop-shadow-as-decoration, glass, or neon. Clean and
deliberate = on vision; generic web app or AI placeholder = failed.

## 2. Palette — the bimetal roles (values: generated)

Steel grounds + a quiet ink ramp + the two metals + one hot accent. Roles (hex values + semantic aliases live
in [`ui-tokens.md`](../content/ui-tokens.md)):

- **void / steel-0 / steel-1 / steel-2 / steel-hi** — the grounds: page depth → recessed well → plate base →
  plate top → raised/hover catchlight. Never pure `#000`. (The legacy `--washi*` names alias into these so
  old rules re-skin in place.)
- **ink / ink-soft / ink-faint** — the cool-grey TEXT ramp on steel (prose stays quiet, never silver);
  `--ink-faint` is decorative/disabled-ONLY (≈3:1 — it never carries an active value).
- **silver / silver-hi / silver-dim / silver-wire / silver-faint** — state & chrome: labels, the log header,
  links, the top-edge rim, structural hairlines.
- **gold / gold-hi / gold-dim / key / key-dim** — value & progress: numerals, deltas, meter fills, the 1px
  keyline every plate wears, milestone lines, the active-tab post.
- **shu / shu-hi / shu-deep** — vermillion: the ceremony's kicker band + seal heat, genuine danger. Exactly
  one hot accent per screen, and only where commit/danger is real.
- **pillar-\*** — the four-pillar identities (Arms `--shu` ⚔️ · Estate `--gold` 🌾 · Office `--silver` 📜 ·
  Name `--silver-dim` ⛩️ · the 家威 roll-up = gold-hi).
- **attr-\*** — the five-attribute **temper-oxide set** (F131, human-locked): STR bronze · AGI pale-quench ·
  INT temper-purple · SPD temper-blue · LUCK straw-gold — what tempered steel actually turns. Keyed to the
  +1; worn as a legible accent, never a flood-fill.
- **v-\*** — the per-speaker VOICE ramp (F128): narrator bright near-white (FB-263 — neutral ground the chromatic voices stand off) · player asagi sky-blue (FB-234) · Sōan teal ·
  Chiyo dry ochre · arms rust · official violet · villager sage · the lord wisteria. Voice colour marks
  *utterance*, not the line (FB-141): only quoted speech + the name prefix wear it. **FB-228 laws:** a
  voice is ONE token on every surface (VN, log, chat — never a per-surface variant; the MC once spoke in
  three colours); narration is the *ground* (`--v-narrator` everywhere), speech is *figure* (voice colour
  + the `.spoken` step-in from the narration margin); a quote embedded in narrator prose IS the character
  speaking — tint it by conservative inference (exactly one NPC named in the line; ambiguous stays
  neutral — a wrong tint is worse than none).

**Usage discipline:** deltas use gold (gain) / shu-hi (loss), never generic green/red, and colour is never the
sole carrier (sign + arrow + label always ride along). Role beats hue — but *distinguishability beats
collapse* (F131): a semantic set of N same-family colours must survive side-by-side reading. Meaning-bearing
text renders in the ink ramp; identity hues are accents. Contrast: `--ink`/`--ink-2` clear AA on every steel
plate; gold and silver clear AA on steel; `--ink-faint` is never load-bearing.

**Separate such a set by CHROMA, not lightness — trusting neither HSL saturation nor ΔE** (FB-216/FB-234). The
old `--v-player` `#e3ecff` read *100% saturated* yet carried CIELAB C\* **10.2**, *below* the narrator's 17.9,
beating it on lightness alone (ΔL\* +25.7) — hence "the narrator, but whiter". `#8ec9ff` lifts C\* to **32.8**
for +11.3 L\*, and its ΔE₇₆ is the *smaller* of the two (20.5 vs 26.9): the **axis** of separation is what the
eye reads, not the distance. Saturation lies near white; brightening a voice can *lower* its chroma.

## 3. Typography — Western stacks, zero font pipeline

Type IS the art (no asset pipeline — the self-hosted brush faces retired with ADR-127; **no webfonts at
all**). Faces are system stacks (`--font-*` → [`ui-tokens.md`](../content/ui-tokens.md)):

| Role | Family | Rule |
|---|---|---|
| Body / headings / display | **Iowan Old Style / Palatino** class serif (Georgia fallback) | Prose, titles, numerals — the reading voice. |
| Chrome labels | **Avenir Next** class sans (system-ui fallback) | UPPERCASE tracked labels (log header, kickers, tab chrome). |

**Rules.** Numerals render in the serif with `tabular-nums` (the demo idiom); sans is for uppercase chrome
labels only. Kanji render through the system's JP fallback at ≥16px. Romanization keeps macrons (*gōshi*,
*jitō-dai*). Live counters use Arabic numerals — kanji numerals only in static labels.

## 4. Layout & surfaces

### 4.1 Spacing, grid, materials (the Appendix-B recipes)

A single 4px spacing scale (`--space-*`), square corners (`--radius: 3px` — never pill-rounded), generous
*ma*. The material recipes are implemented in [`styles.css`](../../src/ui/styles.css) — one-line contracts:

- **The ground** (`.paper`): a still, cool overhead glow dimming into the void; `background-attachment:
  fixed` so panes scroll over it. NO grain, NO texture.
- **The plate** (`.frame`): 1px gold keyline + a silver top-rim catchlight over a vertical steel-plate
  gradient + one soft drop. Buttons are plates-in-miniature; hover RAISES (steel-hi + brighter rim), never a
  light fill.
- **The well** (`.log-lines` and kin): a sunken darker-than-plate gradient + deep inset shadows + a faint
  silver hairline — reading panes are recessed.
- **Meters** (`.bar`/`.meter`): a gold thread in a dark steel groove; life = SILVER (state), satiety a quiet
  verdant, danger shu. The width transition is CSS-owned (the reconcile contract).
- **The seal** (`.hanko-css`): a gold-faced bimetal plate — dark kanji on brushed gold, silver wire rim,
  inner steel relief; the ceremony's **vermillion heat** blooms behind it as it presses (§6.2).
- **Vertical frame**: the shell wears side keylines (`--key-dim`) so horizontal rules terminate into a frame
  (FB-163); slim 6px steel scrollbars everywhere a pane scrolls (FB-164).

### 4.2 The app shell — the ANDON frame (M3; taste.md 19–20)

A centered steel column (~1200px; 1440 in the byōbu stamp) on the void, side-keylined. The grid: **title /
vitals / RAIL | DESK | LOG-WINDOW / footer** — the left rail is the tab nav (vertical steel strip, gold
keyline edge), the center desk is the work column, the right **log window** is a first-class pane capped at
**minmax(300px, 38%)**. **100dvh, no page scrollbar; panes scroll internally** — at EVERY width (the old
narrow "natural page flow" fallback is dead; an unbounded log must never size the page). Transitions render
**complete or not at all**; stacked cards size to content and never clip (FB-94); padding is consistent
across ALL tabs (FB-98). DEV chrome is a fixed overlay tracking the shell's edge (FB-162), reserving ZERO
layout space; `?dev=no` previews the true layout.

**Phone (≤920px, the demo's breakpoint):** ONE fixed-frame column — header rows / desk (internal scroll) /
**the log BAND** / bottom tab bar (wraps) / footer. The log band is the demo's `m-log-band` (FB-168): a
single-line strip pinned to the newest line; tapping expands it to a near-full-screen sheet; its header's
fold affordance collapses it. `--tap-min` rises to **44px** (the mobile e2e lane holds the floor).

### 4.3 Density — two registers (taste.md 19)

Game chrome is **compact like the reference idlers** (~28px control heights on desktop, tight type — content
gets the space). Reading + ceremonial surfaces (log, story beats, intro, modals, the cold open) keep
**generous breathing room**. Size each surface to its job; never one global scale.

### 4.4 The seven-tab IA (ADR-112 → ADR-119)

**Work · Map · Estate · Inventory · Character · Combat · Quests**, revealed incrementally (Work R0 · Map +
Estate R1 · Character R2 · Combat + Inventory R3 · Quests R5); the rail itself appears once ≥2 tabs qualify.
Reveal is gated by real content (ADR-055), one-per-beat (the ADR-119 stagger). One capability, one tab
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
DOM that owns them. The reconcilers key on element IDENTITY, so a container can be re-parented (the M3 log
move) without breaking. Applies to every surface: the shell, the log, the VN scene.

## 5. Components — the kit (contracts; the build is the reference)

All pure CSS + text + emoji + inline SVG, built by the renderer from `surfaces.ts` data.

### 5.1 Event-log (THE HERO surface)

The right log WINDOW: a steel plate holding a recessed reading well; ARIA live region; follow-the-newest
scroll (whole-line appends GLIDE, FB-150; typewriter chars + floods jump; reduced-motion always jumps). The
header is uppercase tracked silver. Line tiers: `narration` ink · `reward` ink + emoji bullet, `+N` in gold ·
`combat` ⚔️ bullet, outcome WORD in ink with the win/loss hue on an adjacent pip only · `system` smaller
(quiet from size/weight, never faint ink) · **milestone** gold-hi + a gold left post. Diegetic voice carries
the Edo flavour — this is where it lives.

- **Channels** (bottom filter bar, importance-ordered): **Story · Progress · Chat · Combat · Work · All ·
  Now** — routing per taste.md 16 (Story = mandatory beats; Chat = optional Q&A; Work = notable only;
  rung-up STORY prose → Story, the terse unlock notice → Progress; navigation flavour → the Map node
  description). **Now** = fleeting spam, ~15s wall-clock expiry (runs even hidden), fade + slide-up.
  Repetitive consumption/labour output lines are `ephemeral` → Now only (FB-156).
- **History is UNBOUNDED** (FB-160/FB-161, human-locked): a durable story/chat/progress line is NEVER
  evicted; only ephemeral lines ring-cap. The renderer paints a newest-300 DOM window (scroll-back lazy
  backfill = sanctioned future polish); core loses nothing.
- **Readability**: every voiced line carries its speaker-name prefix (bold) and displays QUOTED (FB-158 —
  bare authored dialogue is wrapped at render); voice colour scopes to the SPOKEN words (FB-141); a
  speaker-block change opens with breathing room (FB-167); a conversation opens with a `— with <name> —`
  kicker derived with lookahead so it sits above the player's opening question (F127/FB-165).
- **Behaviour**: stick-to-bottom + land-at-bottom on tab switch; unread dots on off-view channels
  (in-session arrivals only); full-width text, panel-edge slim scrollbar, soft top fade (taste.md 17–18).
- **A− / A+ font stepper** bottom-right, log-local, persisted to the save (taste.md 7).

### 5.2 Perk cards (FB-56; taste.md 13)

Rewards render as JRPG "learned" boxes in-palette (a steel plate with silver rim, never a red web-toast): a
NAMED perk + a STANDALONE description + the mechanics as context, each `±N ATTR` token tinted with its
temper pigment (F137). Choice buttons and their perk cards share the `--attr-*` pigment of the +1 they grant.

### 5.3 Meters & the four-pillar 家威 panel

**Bar = shape, number = precision, colour = state — never a naked bar or number.** Steel groove, gold-thread
fill (life = silver, satiety verdant, danger shu), threshold ticks, eased fills + count-ups, always the rate
beside the total (`家威 4.20K koku (+12/season)`). **No per-tick number flash** (F148 — steady numerals; the
meters carry the motion). Header vitals: **body** (satiety, shu warn when low) and **life** (HP — inks in at
the R2 wolf beat, bar + exact `hp/max`, no auto-heal, low at ≤30%). The four-pillar panel reveals
**bar-by-bar**; locked pillars are **unnamed `--ink-faint` silhouette teasers** (ADR-055). Estate shows its
LAND/TREASURY/TRADE sub-segments with the trade-⅓ cap as a hard registration mark.

### 5.4 The rung element (header, top-right — the sole home)

Compact rung name + progress bar; hover/focus card carries the detail. **The bar reads the ADR-137
requirement percent** (FB-121): a rounded INTEGER 0–100 from the rung's hidden requirement list — the
same pure-core read the gate uses (AC-6), so **100% ⟺ ready** and the old "meter full but story-gated"
cue state is gone. Counted requirements move it in ≤10 quantized chunks; an atomic completion lands its
whole weight as one jump, and **every jump has a visible cause**: the completion's diegetic flavor line
in the log (never a checklist, never a raw `476/1100` readout — the % is the single number). **A rung-up is a player-TRIGGERED
story beat** (ADR-110): the header surfaces a "ready to advance" summons that holds and can be ignored;
triggering plays the full-screen VN beat (§5.13). **The promotion ceremony lives IN the beat modal**
(FB-153/FB-159): the outcome control reads "Rung up"; pressing it overlays the whole card with the gold seal
+ "You've been promoted to {rank}." + Continue, the bell rings there, and the vermillion heat blooms (§6.2).
Payloads are relationship/flag-first — occasional small varied bonuses, NOT every rung a perk.

### 5.5 Buttons (verbs)

Small steel plates (§4.1): gold keyline, silver top-rim, vertical grade; hover/focus RAISES (steel-hi +
silver-wire + brighter label) with a visible focus ring. Available = full ink ("lit"); unavailable =
`--ink-faint` ("faded") with the reason on tap/focus. **The suggested action wears a GOLD keyline + inset
ring** (F133); vermillion is reserved for genuine commit/danger. Verbs never span the whole column — one
shared ~40ch cap (F145). Repeatable actions pair a **`▶ auto` / `■ stop`** toggle (`aria-pressed`); risk
reads on the button's own face; **a manual act DISARMS every armed auto** (F146 — clicking takes over,
never races). Rung-beat choices carry honest colour hints: statBonus wears its attr pigment; others read
warmth gold / even silver / cost shu (F147).

### 5.6 Nav (the rail)

Desktop: the LEFT RAIL — a vertical steel strip, gold keyline on its right edge; tabs stack (English +
kanji), active = silver-hi label + a **gold post on the tab's LEFT**; each new tab slides in, narrated by
its unlocking beat — never silently. Phone: the bottom tab BAR (wraps; every tab reachable), active post on
TOP. New Game returns to the zero state — Work tab, Story filter (FB-25).

### 5.7 Resource readouts

**K/M/B letter notation the whole game** (never `1e7`), 2 decimals max, fixed width, tabular-nums,
right-aligned, rate beside value; one shared pure formatter. The three economy nouns display DISTINCTLY
(ADR-107/108/109): **COIN** — one `mon` 文 value in fixed mixed denominations mon → monme 匁 → ryō 両
(`formatCoin` owns the split) · **RICE** 🌾 — a plain count (eat / store / sell) · **KOKU** 石高 — the
House's seasonal STANDING score, never spent, never a multiplier, wears 石高/家 (never 🌾), immune to
combat loss.

### 5.8 The seal / hanko

Three jobs only: House crest (header), the promotion/achievement seal (§5.4/§6), confirm/sign CTA. Never
decoration. Always the gold-faced bimetal form.

### 5.9 Tooltips — never hover-dependent

All information reachable by tap/focus (`ℹ` / expandable row); "Shift for detail" is an enhancement, never
the only path. Locked items carry their unlock condition — never a dead grey box with no reason.

### 5.10 Modals

A steel plate on a void-tinted scrim (not black); focus-trapped, Escape-closable; generous padding (density
is for chrome, not modals; the × keeps clear inset — F139). **Settings modal = Settings / Saves / About
sub-tabs**, opening on About; the footer version (single-sourced from package.json, AC-21) opens it, and
About deep-links the raw `CHANGELOG.md` on GitHub; the colophon is compact micro-type on one measure that
never wraps the build line (F140). **A caught crash draws the full-screen in-palette error modal** —
progress-saved + Reload, DEV-only stack, idempotent single node, inline-styled so it cannot itself throw
(taste.md 8).

### 5.11 The Map tab — the walkable node

Space is load-bearing (ADR-065/ADR-078/ADR-093): every labour and foe binds to a node; you WALK (`move_to`)
to work or fight; the woodlot's deeper woods 奥山 behind the danger ring gate the richer forage.
Navigation lives ONLY here (FB-107); Map ≠ Estate (FB-112); every visited location stays reachable (FB-113);
NPC placement shifts by tier/rung. **The node = two sections (FB-102/ADR-116):** a bordered "where you are
now" description (immersive, carries the discovery hints, persists) + a terse navigation section hinting
NOTHING about next zones — click the card to travel, flavour updates on arrival (taste.md 15). Danger nodes
wear a 険 ink-mark (never ⚠) + the gate reason on the disabled affordance. **Who's here — vendors are
PEOPLE** (ADR-114): talk-to-reveal; the spectrum runs full-VN character → small person → tiny trader;
vendors may be place-gated; every entity is discovered via a beat (FB-99). **Presentation is an OPEN diverge
(ADR-115)** — ~7 pure-CSS schematic variants (steel roads, keyline nodes, a `--shu` you-are-here pip; never
an illustrated map) await the human's live pick (HR-7).

### 5.12 Storehouse 蔵 (the kura bank — Inventory tab)

The bank: balance shows everywhere, but store/withdraw verbs work only standing AT the kura node (off-node,
a hint to walk the 道 back). Header reads carried vs stored plainly; the diegetic rule: **what you carry, a
lost fight can take; what you store, you keep** (ADR-113; koku standing is never carried). Withdraw sits
faded-with-reason when empty.

### 5.13 The full-screen dialogue (VN) scene (ADR-104/ADR-110)

The canonical frame for story-significant interactive NPCs AND every rung-up beat. The contract (details:
taste.md 9/11/12/14 + the build):

- Hides the WHOLE shell (mounts on root); the UI reveals after; the log fills instantly behind it.
- A large fixed-size steel card: **story column LEFT** (scrolls internally, sticks to bottom, bold
  speaker-name prefixes, the shared fresh-entries divider, a gold hairline divider) · **interactive column
  RIGHT** (static, persistent, phase-swap in place: ASK topics + "heard enough" gate → then the decision).
- A damascene nameplate seal per voice-category (steel face, the voice colour as keyline + glyph); ask
  buttons wear the player's voice colour (F142 — they ARE your words-to-be); the decision prompt reads
  bright gold (F132 — the call to action, clear of every voice); queued lines stay hidden until their
  typewriter turn (F152); a voiced line without authored quotes displays quoted (FB-158).
- Choices resolve in place → your line + the reply → the outcome panel; a rung beat's outcome control is
  the in-modal ceremony (§5.4). Append-only rendering, the one auto-advancing typewriter (a click completes
  the line, never pauses/skips).

## 6. Motion — steel settling and seals pressing

**Restraint is the aesthetic**: juice reads as keylines catching light and seals pressing, never
shake/confetti/per-tick particles; big juice is reserved for milestones. Animate only `transform`/`opacity`/
registered props; durations 140–620ms (`--dur-*`); the ink + steel easings (`--ease-ink`, `--ease`,
`--ease-press`); ALL motion behind `prefers-reduced-motion: no-preference` with a hard CSS backstop — and JS
rAF tweens must read the preference themselves and snap to final values.

| Beat | Motion (reduced-motion → static/snap) |
|---|---|
| 6.1 Reveal/unlock (the signature) | fade + small rise; staggered children. |
| 6.2 Rank-up ceremony | the gold seal presses (overshoot, settle) + the **vermillion HEAT** blooms radially behind it and dies — in the beat modal (FB-153) and the ascension overlay. |
| 6.3 Number-jump | eased count-up only — **no scale/colour flash** (F148). |
| 6.4 Seasonal headline | a quiet wipe in the display face. |
| 6.5 Combat resolve | one strike: a single shake + diagonal slash sweep (`--shu` win / ink loss), no gore. |
| 6.6 Allegiance swing | the meter's fill slides between poles. |
| 6.7 First-ascension (once) | a held display-face title card + pillar silhouettes stirring + the audio swell; always lands BIG (ADR-062). |
| The GBA cold open (M4) | title → roman → lede each TYPE char-by-char (title kanji at 3× per-char), a gold block caret (hard steps() blink) riding the typing element; cadence single-sourced (`TYPE_MS_PER_CHAR`). |

Anticipation: a gate-bar nearing full intensifies subtly, then releases into the seal. **Audio** follows the
same significance-gating (taiko hit · shamisen/koto reward · temple-bell at the in-modal ceremony), mapping
owned by [`sfx-spec.md`](../guides/sfx-spec.md); the log still carries the meaning muted.

## 7. Iconography — emoji as period motifs, not spam

One curated, cooled set (`.emoji` grayscale/dim filter — muted metal accents on dark steel, not stickers);
**one emoji per concept, extend only via this doc**; emoji are decorative (`aria-hidden`) — kanji/word
carries the meaning:

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

The same reveal order in both chromes; mobile (≤920px) = the fixed-frame single column with the bottom tab
bar (thumb reach, **≥44px targets** — the e2e floor) + the collapsible log band (§4.2), one panel at a time;
desktop runs the compact ~28px density (§4.3). No hover-only controls — every hover has a tap/focus twin
(§5.9). Layouts must hold at 999B numbers, unbounded logs, all tabs revealed, smallest viewport. Text-scale
multiplies type tokens only, never the rem unit (taste.md 7).

## 9. The anti-slop rules (the enforceable checklist)

| Slop pattern | The rule |
|---|---|
| Purple/blue gradients, glass, glow, neon | Banned — only the plate/well gradients and the sanctioned metal glows exist (§4.1). |
| Generic rounded card-grid / default component look | Banned — keyline plates, square corners, asymmetric *ma*. |
| Same shadow/weight on everything | Hierarchy from material + contrast (plate steps, rim light, the gold thread). |
| Pure #000/#FFF anywhere (DEV included) | Banned — the void/steel grounds + the cool ink ramp only. |
| Texture/grain for depth | Banned (the woodblock grain died with ADR-127) — depth is keyline + rim + grade. |
| Lazy typography (ad-hoc sizes, one weight) | The fixed scale + the two stacks; type IS the art (§3). |
| A static wall of numbers | Value + rate + eased count-up + a living log. |
| Number jitter / per-tick flash | Tabular nums, fixed-width columns, reserved space; no increment strobe (F148). |
| Dead greyed locked items | Locked = hinted with its unlock condition, or hidden (§5.9). |
| Over-juice (per-tick particles/shake/sound) | Significance-gated; routine quiet, milestones get the seal (§6). |
| Emoji spam / inconsistent register | One curated cooled set, one per concept (§7). |
| Colour as the sole signal | Always icon + text + sign/arrow too (§2). |
| Vermillion as decoration | The hot accent is SPENT, not worn — ceremony + danger only (§1). |
| Segmented pips where a bar would do | Prefer the continuous thread (A19). |
| A god's-eye grid at small content scale | Prefer the focused, diegetic framing (A19). |

**The meta-rule:** strong, opinionated constraints read as intentional; defaults read as generated. When in
doubt, commit harder to the constraint — it is protective *because* it is opinionated.

## 10. Per-screen reveal beats (delight notes)

The spine: the log (and from R1 the VN beat) narrates each reveal; the workspace gains exactly ONE new
system per beat. Tab homes per §4.4. Cold open — maximum *ma*, the typed title, one verb, the first log line
proves the game listens. Work — the node's labour + the season tag turning. Skills (R2) — the rail itself
appearing IS the beat. Combat (R3) — danger enters the calm steel: the watch (current-node foes only), the
equipped weapon + durability, two auto-modes with on-face risk, the humbling first fight, the header HP
meter. Crafting (R4) — the loot→craft loop closes on itself. Quests (R5) — the watch begins. Map (R6) —
"you can picture the land now." House 家威 (R7) — the lone Estate bar rising past unnamed silhouettes,
crowned by the seal. Village (T2) — the legend ignites; the allegiance meter appears. Region (T2→T3) — the
map grows a page wider. Ties/Origin (T3) — a quieter, more intimate page. Castle-town stub (T3→T4) — a
`--shu` seal on stone; the cliff-hanger.

## 11. The visual-QA hook + open items

Every screen and transition is screenshot-reviewed against THIS bible + [`taste.md`](taste.md) (the agent
drives `window.__qa` / `capture-game-states`, desktop + mobile, own-vision review) before candidates reach
the human — per [`qa-playtesting.md`](../guides/qa-playtesting.md) §4. Open items: **cross-platform font consistency**
(optional future polish — self-host a libre Palatino-alike/Avenir-alike; not required for v0.3.x);
**ambient canvas FX** (permitted, unspecified — spend or keep the steel still?); the open **variant picks**
(HR-2/5/6/7/9) close M6. Research provenance: the pre-ADR-127 woodblock bible + `ui-demos/10-andon-steel/`
in git history.
