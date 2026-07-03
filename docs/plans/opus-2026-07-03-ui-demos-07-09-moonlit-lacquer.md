# Plan — UI demos 07–09: the Moonlit × Lacquer fusion trio

**Status: ▶️ BUILDING (session 2026-07-03).** Concepts locked (7-way fan-out →
spanning trio); building 07 Andon, 08 Night Seal, 09 Damascene Duet as full
working `ui-demos/` variants, then QA + gallery wiring + R9 review items.

Human ask (2026-07-03): torn between **01 Moonlit** and **04 Lacquer**, wants **3
fusion variants** built as demos **07–09** to feel which one pulls. Idea fan-out +
ranking: [`project/brainstorms/2026-07-03-moonlit-lacquer-fusion.md`](../../project/brainstorms/2026-07-03-moonlit-lacquer-fusion.md).
Contract every variant obeys: [`ui-demos/shared/VARIANT-SPEC.md`](../../ui-demos/shared/VARIANT-SPEC.md).

## Who builds this — Fable or Opus?

**Verdict: Opus for all four phases (3 builds + QA).** This is taste-critical
creative UI work — the whole deliverable is *does it read handmade and pull the
eye*, exactly the judgment D-124 keeps on the parent model. No lateral or
down-tier switch: subagents inherit Opus. The one sanctioned Fable use — trivial
mechanical / exploration — doesn't apply; every line here is a design call.
(Fable could *later* help with mechanical mobile-trap sweeps once a variant's
look is locked, but not the initial build.)

## The build strategy — fork, don't greenfield

Each variant is a full remaster (index.html + style.css + main.js, ~800–2400
lines) implementing the **entire** R0–R3 UI + mobile. Building three from scratch
is neither necessary nor safe. Instead **each variant forks the three files of its
named parent** and keeps the parent's hard, correctness-critical machinery intact:

- the `eng.subscribe` → HTML-string render + `data-act` event delegation,
- the reconcile helpers (meter rAF-animation, number-pop, `htmlCache`/view-sig
  gating so watched surfaces never flash — **T2**),
- log scroll-preservation + append-only feed,
- the whole mobile recomposition **and every iOS trap already solved** in the
  parent (click-synthesis, flex min-content, `clip-path` hit-testing, `100dvh`,
  safe-area, per-element overflow asserts).

The build transforms only the **design language + composition**: tokens, class
names, HTML scaffolding, and the CSS. This turns each build into a *reskin +
recompose + verify* on a proven spine, not a rebuild of the VN state machine.

**Base assignments** (from the ranking, by which parent's composition the concept
inherits): **07 Andon → 04-lacquer**, **08 Night Seal → 01-moonlit**,
**09 Damascene Duet → 04-lacquer**.

Hard rules for every build (VARIANT-SPEC §0): **same game** (2-sec resemblance at
R0→R3), **English only** (zero kanji/kana, romanized canon OK), **no placeholder
art** (finish from CSS only), desktop-first + the full §4 mobile contract, zero
console errors, every clickable does its thing or is visibly disabled with a
reason.

## 07 · Andon — warmth is a PLACE  *(fork 04-lacquer)*

**DNA:** two-light dusk. One narrative hour — moonrise at a writing-desk —
rendered as a single surface lit by two real sources: a **warm oil lamp** pooling
over a lacquer action-desk (left + center), **cold moonlight** through a
shōji-latticed paper **window that is the event log** (right).

- **Emergent (the reason it earns its place):** *temperature-as-mode.* Warm =
  "you act", cool = "the world remembers" — read your mode from the light before
  any label. Type becomes an information channel: **serif = lamp/story, sans =
  moon/system.**
- **Composition:** header vitals across the top; warm lacquer **left rail** (tabs
  as lamplit document-boxes) | warm center trays/paper-wells/seals | **cool
  moonlit log window pinned right.** Body = a fixed dual-radial: warm lamp-glow
  top-left, cool moon-glow top-right, graded warm→cool L→R with a **narrow
  dusk-plum terminator seam** as the window's mullion post. R0 = a near-bare desk,
  one verb-tray in a tight lamp-pool, the cool window already glowing. R3 = the
  lamp-pool widened over six lit rail tabs; the terminator is the screen's spine.
- **Palette:** cool pool `#06070d`/`#141830` + moon-silver `#cdd6ee`; dusk seam
  `#1a1424`; warm pool `#231a15` lacquer + `#c8a15b` gold + `#bf3b25` vermillion +
  `#ece0c4` paper (ink `#2b2318`); bridge = pale-gold `#e6cf8a` running unbroken
  through both, warm near the lamp, pale near the moon.
- **Signature:** the **crest-to-seal cursor** — at rest a cool silver-gold 45°
  diamond crest marks selection; on commit it stamps down and blooms a warm
  vermillion wax-seal ring (~140ms). Moonlit's diamond and lacquer's seal revealed
  as the same mark under two lights.
- **Motion:** warm side keeps lacquer's slow inky reveals; cool side keeps
  moonlit's crisp fade-in + crest snap; a subliminal ~1% lamp-flicker breathes the
  warm glow (~6s) while the moon-glow holds dead still. Reduced-motion collapses
  all of it.
- **Watch the risks:** the dual-radial behind three scroll columns must not band,
  and the dusk terminator must not go muddy grey-brown (keep the mid-zone narrow;
  let the gold thread carry cross-seam continuity). Discipline: temperature is
  *strictly* mode; the shōji lattice stays a whisper; serif/sans map hard to
  lamp/moon or it reads theme-park.

## 08 · Night Seal — warmth is YOU  *(fork 01-moonlit)*

**DNA:** a cold indigo-**lacquer** estate through which travels one warm object.

- **Emergent:** *the player is the only warm thing in a cold house.* Vermillion
  exists **nowhere** in the chrome — it lives solely on the seal, so warmth
  physically travels with your attention and blooms where you commit, while the
  estate stays asleep in cold indigo-lacquer until you act. Continuity payoff:
  the same seal-cursor that glided beside your rows all game **grows into the
  monumental rank-up stamp** — the promotion is your cursor made huge.
- **Composition:** left **seal-rail** (01's spine) of lacquer mini-tray tabs, the
  seal gliding vertically beside the active one | center lacquer-tray stack |
  right **moonlit-paper log well** (04's paper-well component in cool bone-white,
  full height). Marries 01's left-rail nav with 04's paper log — a third layout.
  R0 = one centered lacquer tray, the lone seal idling beside the primary verb, a
  single warm point in a dark empty room. R3 = the 6-tab seal-rail + the paper log
  bracket the center stack.
- **Palette:** cool lacquer ground, one warm carrier. `#06070d` void ·
  `#0b0e1a`→`#1a2140` indigo lacquer tray · `#b9a86a` cool-gold keyline ·
  `#e6cf8a` moonlit-gold + `#cdd6ee` silver chrome text · `#dfe4f0` cool
  bone-white paper well (ink `#1c2236`) · `#bf3b25` vermillion **only on the
  seal.**
- **Signature:** the **gold-rimmed vermillion seal-cursor** — a diamond
  silhouette (crest shape) in seal material that glides beside every row, then
  stamps down and blooms a fading vermillion ink-impression onto whatever you
  sealed. 2-sec read: cool room, one red seal, and it stamps.
- **Motion:** *crisp hand, slow ink.* Pointer snappy (~120ms glide + idle bob);
  consequences inky/slow (stamp bloom, paper ink-in, meter fills ~480–560ms).
  Reduced-motion → instant static tint / opacity swaps.
- **Watch the risks:** if the indigo lacquer reads as merely "dark blue" it
  collapses into "01 with a red cursor" — the keyline, inset catchlight, and
  paper-well grain must be unmistakably lacquer *material*. The ink-bloom needs a
  transient per-target element and must fire **only on discrete player commits**
  (rake/buy/improve/fight/advance), never on auto-repeats or passive ticks.

## 09 · Damascene Duet — warmth transcended into a THIRD ground  *(fork 04-lacquer)*

**DNA:** nunome-zogan damascene — silver **and** gold hammered as co-equal inlay
into one blackened-steel jewel-box. Neither night-box nor urushi-and-paper.

- **Emergent:** *bimetal semantic legibility (T4).* Silver = "how I am"
  (state/chrome), gold = "what I've earned / where I'm going" (value/progress),
  vermillion = "I'm committing / in danger". A glance decodes the screen. Plus one
  **strike-lozenge** primitive doing both parents' signature jobs — nav cursor
  **and** CTA seal.
- **Composition:** interleaved, never zoned. Header carries silver vitals-bars +
  gold resource-pills side by side; a **silver-wire top tab strip** (04's DOM)
  with a crest-cursor at each tab's leading edge; content-left column of damascene
  plates; the **log a recessed steel well** inlaid into the case (inset shadow so
  it reads sunk into metal), append-only + alive. R0 = a lone Work plate + its
  inlaid log well, one small token on a dark steel field. R3 = the full case, lit
  crest cursors across the strip, gold-meter trays, the rung meter top-right.
- **Palette:** blackened-steel ground with a hair of indigo to bridge both voids
  (warm-neutral, **not** blue-tech): `#070810` void · `#0e1016` well/recess ·
  `#161922` plate · `#20242f` raised/hover. Co-equal metals: silver `#cdd6ee`
  (+ wire `rgba(205,214,238,.55)`) for state; gold `#d8b978`/`#f2dca0` (weighted
  true-gold, midway between the two parents) for value. Hot accent vermillion
  `#bf3b25`/`#de5a3a`. **No cream paper** — dense text on brushed `#20242f` with a
  fine cross-hatched "nunome" cloth SVG texture.
- **Signature:** **the strike.** Every commit is a bimetal lozenge (silver-wire
  rim, gold-inlay face); press it and it **seats** (translateY) while vermillion
  floods up through the gold inlay lines from center, then bleeds slowly back.
  Rung-up = a giant lozenge strikes dead-center and floods the field vermillion.
  2-sec read: a silver-and-gold diamond that flushes red the instant you commit.
- **Motion:** dual register — chrome crisp/fast (~120–150ms, metal is hard),
  structural reveals slow/inky (~240–320ms ink-in + silver rule-sweep). The strike
  splits: fast 120ms seat, slow 280ms vermillion bleed-back. Reduced-motion
  collapses flushes/reveals to plain state changes; gold fills stay cheap
  transforms.
- **Watch the risks:** two metals on cool-neutral steel can slide into cold
  gunmetal "tech" or read cheap/trophy when silver + gold fight over one element.
  **Hold the semantic split absolutely** — silver = top-edge rim/labels/shimmer,
  gold = keyline/numerals/face; they never share a pixel. Keep large fields quiet
  so both metals read as *sparse inlay*; let vermillion carry all the heat
  lacquer's warmth used to.

## Sequencing & mechanics

1. **Build (parallel, one resumable Opus agent per variant).** Each owns **only**
   its new `ui-demos/0N-<name>/` directory (disjoint paths → parallel-safe on the
   shared tree). Each: fork the named parent's three files → transform to the
   concept → self-verify per VARIANT-SPEC §4.3 (serve the dir, drive cold-open →
   R3 + a VN + mobile in Playwright, screenshot, review own shots, iterate to the
   taste bar) → return a report + shot paths. Agents do **not** touch
   `ui-demos/index.html`, `shared/`, or each other's dirs.
2. **QA (me — R2, verify don't trust).** Independently drive each variant, capture
   R0–R3 + cold-open + a VN + ceremony + mobile with my own eyes
   (`capture-game-states`), score against VARIANT-SPEC §3 + taste.md's four values,
   and fix/iterate anything off. Zero console errors; per-element overflow clean.
3. **Wire the gallery (me — single writer).** Add three `<li>` rows to
   `ui-demos/index.html` (07/08/09 with DNA taglines) so they're reachable
   (R6/R6-style — *if a player can't reach it, it doesn't exist*).
4. **Surface for the human.** Extend **R9** in `human-in-the-loop/review.md` with
   07/08/09 (one line each — the fusion axis) + this plan into the reading queue.
   Commit as we go; final checkpoint pushes so the Vercel demo updates.

## Definition of done

- [ ] 07 Andon, 08 Night Seal, 09 Damascene Duet each a **full working** variant
      (every stage R0–R3, every tab, every moment, mobile) — VARIANT-SPEC §0–§4.
- [ ] Each passes a Playwright arc sweep (zero console errors) + a screenshot
      review by me against §3 and the four taste values (T1–T4).
- [ ] The 2-second resemblance test holds at R0→R3 for each; each is distinct from
      **both** parents and from the other two.
- [ ] Wired into `ui-demos/index.html`; R9 extended; this plan queued; pushed so
      the live gallery carries them.
- [ ] Plan archived to `project/archive/` once the human's R9 pick round closes.
