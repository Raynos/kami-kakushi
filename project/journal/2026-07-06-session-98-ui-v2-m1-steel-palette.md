# 2026-07-06 · session 98 — UI-v2 M1: steel palette + Western fonts

## Context

The human gave the go on the UI-v2 Andon Steel migration plan
(`docs/plans/opus-2026-07-04-ui-v2-andon-steel-migration.md`) — status flipped
to LOCKED / IN PROGRESS. Routing call (human, 2026-07-06): built **in-session
on Fable 5** interactively (supersedes the plan's Sonnet-class proposal);
subagents inherit the same. Cadence: pause each milestone for a human
playtest; attr-colors: **both** treatments built behind a DEV toggle.

## What changed (M1 — ① THEME · LOW)

- `src/ui/styles.css` — the token layer re-pointed to Andon Steel per
  Appendix A: steel grounds (`--void/--steel-0..hi` added; washi names →
  steel values), ink → the cool-grey text ramp, indigo → silver, vermillion →
  the steel shu triplet (+ `--shu-hi`), 8→3 pigment collapse, semantic flips
  (`--line` → gold keyline, `--num-key`/`--delta-pos` → gold, `--link` →
  silver), pillar re-points, `--key/--key-dim/--silver-wire/--silver-faint`,
  `--ease` + `--dur-mid`. Fonts → Western system stacks (Palatino/Avenir
  class, Appendix C); both `@font-face` blocks deleted. `.emoji` filter
  retuned cool. Body ground → `--void`.
- **Kura-dark + inverted-chrome fixes** (rules built from dark `--ink` that
  inverted when the ramp flipped light): the cold-open + VN-overlay radial
  grounds → steel; cold-open title → gold-hi, lede/restore → ink ramp;
  titlebar/footer/settings-btn → steel-0 + silver; segmented log-filter
  active chip → raised steel; perk-box → steel plate + silver rim; modal
  scrim → void; nav active tab: vermillion underline → **gold post** +
  silver label (B.5 — vermillion stays reserved for commit/danger).
- `src/ui/fonts/` (2 woff2 + OFL.txt) + `src/scripts/subset-fonts.sh` —
  deleted (zero font pipeline).
- `src/ui/dev.ts` — DEV-panel Settings section "Attr palette": 3-metal
  (default) vs 5-voice ramp, swapped live via `data-attr-palette` on `<html>`
  (the `:root[data-attr-palette='voices']` override block in styles.css).
- `src/index.html` — color-scheme dark, favicon → steel shu, font comment.
- `docs/content/ui-tokens.md` + `docs/plans/README.md` — regenerated.

## Verification

- `pnpm run verify` green (17 gates); `pnpm run test:e2e` green (73 tests,
  both mobile profiles + desktop).
- Headless self-review (`tmp/m1-shots*.mjs` → `tmp/m1-shots/`): cold open
  (gold title on steel void), intro VN card, R3 shell, wealthy-idler R7
  shell, 5-voice ramp compare. Fixed the giant inverted vignette + unreadable
  title those shots caught before handing to the human.

## Next intended steps

- Human playtests R0/R1 (M1 gate) + picks an attr palette when ready.
- M2 — steel material recipes (Appendix B) after sign-off.

## Addendum — M1 live review begins (same session)

- Human steer 1: all UI-v2 temp toggles → one 'UI-v2 (temp toggles)' DEV
  section, pinned to the top of Settings.
- Human steer 2 (attr fork resolved in direction): 3-metal THEME wins; the
  five attrs get a distinct 5-metal accent set. Built two candidates behind
  `data-attr-palette` — 'temper' (steel temper-oxide colours) and 'noble'
  (noble metals) — plus the demo 5-voice ramp as reference; pick pending.
- Inbox drain (M1 feedback) in flight: 14 captures pending, first batch of 5
  reproduced; proposals presented to the human next.

## Addendum 2 — M1 inbox drain (FB-127…FB-143)

Drained all 17 captures from the human's M1 review sessions (three session
files; human approved the full batch + two live round-2 steers):

- FB-127 chat `— with <name> —` grouping kickers · FB-128/129/135 per-character
  `--v-*` voice ramp · FB-130 divider → gold hairline · **FB-131 attr palette →
  5-temper-oxides, human-LOCKED** (alternates + toggle stripped, ADR-075) ·
  FB-132 decision prompt → gold CTA · FB-133 `.verb.primary` vermillion → gold ·
  FB-134 bold speaker prefixes · FB-136 DEV chip/footer alignment · FB-137
  attr-tinted ±stat lines · FB-139/140 About-modal polish · FB-141 voice colour
  scoped to SPOKEN words only (`writeVnSlice` segmenter) · FB-142 ask buttons →
  player colour · FB-143 steward ochre vs gold-hi CTA separation.
- FB-138 (rake → Now) — could NOT reproduce: works live; the 15s fleeting TTL
  (FB-115) explains the empty-tab observation. No change.
- "Buttons broken" report — could not reproduce headlessly (fresh-load DEV
  New-game + cold-open CTA both work, zero console errors); stale HMR tab or
  armed pick-mode overlay suspected; human resumed playing after.
- All three sessions archived; F-log: `project/human-feedback/2026-07-06-playtest.md`.

## Addendum 3 — M2 · steel materials (Appendix B recipes)

All seven material recipes applied to `src/ui/styles.css` (CSS-only; engine +
composition untouched):

- B.1 `.paper` → clean steel depth-glow ground, feTurbulence grain DELETED.
- B.2 `.frame` → steel plate (gold keyline + silver top-rim + plate gradient);
  the woodblock triple-inset + `::after` inner rule died. `.verb` buttons get
  the B.2-lite plate; hover now RAISES (steel-hi) instead of the light fill.
- B.3 `.hanko-css` → gold-faced bimetal seal (dark kanji on brushed gold,
  silver wire rim); `mix-blend-mode: multiply` died. Vermillion ceremony
  flush deferred to M5 as planned.
- B.4 `.bar`/`.meter` → gold thread in a dark steel groove; life = silver
  (state), satiety = verdant, danger = shu; the width transition kept
  (reconcile.ts contract).
- B.5 `.nav` → horizontal steel strip (gold keyline base + silver top-rim);
  the vertical rail is M3.
- B.6 `.log` → plate + `.log-lines` recessed WELL (sunken gradient + deep
  inset shadows); flex/min-height/scroll mask hooks untouched; log h2 →
  uppercase tracked silver; milestone lines → gold-hi + gold post.
- B.7 `.vitals` → raised steel strip.
- Universal sweep CLEAN: 0 hits for feTurbulence / triple-frames /
  `#5c8b93|#fff8ea|#efe4c8|#c68a3e` bokashi / any blend-mode; intro hover
  washes → steel-hi raise.

verify green (17 gates) · mobile e2e lane green (73) · headless R0/R1 + R3/R7
captures reviewed. Human playtest = the M2 gate. Note: the ⚔ combat verb
currently reads gold like any primary — a dedicated `.danger` vermillion
treatment lands with the combat surfaces (M5/M6).

## Addendum 4 — M2 review drain (FB-144…FB-155)

Second interactive drain: 12 captures from the M2 review, swept in one
approved pass (human picked: 40ch button cap; all-12 scope):

- FB-144 unquoted NPC speech → whole-span voice colour · FB-145 verb 40ch cap ·
  **FB-146 manual acts DISARM all autos** (player-dispatch wrapper in main.ts) ·
  FB-147 rung-choice warmth accents (gold/silver/shu; statBonus wears its attr) ·
  FB-148 vitals num-pop retired · FB-149 DEV chip = Settings 28px ·
  FB-150 smooth whole-line log glide (unpin-guard keeps FB-77 fixed) ·
  FB-151 ask bullet died · FB-152 queued VN lines hidden till their turn ·
  **FB-153 rung-up ceremony IN the beat modal** (human spec: "Rung up" button →
  seal + promoted-to flavour + Continue; overlay suppressed; e2e walker + rung
  unit test updated in-commit).
- FB-154 hover — already fixed by M2 (711d0b1), re-check on refresh.
- FB-155 cursor flicker — could not reproduce (stable node, pointer computed);
  suspected HMR bursts; recapture if it persists.

verify green (17) + e2e green (73). Both sessions archived; inbox empty.

## Addendum 5 — two late captures (FB-156/FB-157)

The human filed two more captures into session 4ea4cf after the drain read it
(the archive commit carried their JSONs unread — caught on the staged-set
review): FB-156 eat/cook result lines → ephemeral (Now, not Work); FB-157
estate border-soup → nested cards de-framed today, full redesign routed to the
M6 diverge. verify green.

## Addendum 6 — round-3 drain (FB-158…FB-161) + the log-history lock

- FB-158 bare dialogue displays QUOTED (render-time wrap, VN + log).
- FB-159 the promotion ceremony overlays the whole card, seal + Continue
  centred.
- FB-160/FB-161 root-caused to the 300-entry log RING: ephemeral grind spam
  evicted perks + story. **Human lock: durable history is UNBOUNDED (never
  evict); only ephemeral lines cap (LOG_EPHEMERAL_MAX=100).** LOG_RING_MAX
  retired; renderer paints a newest-300 DOM window on full repaints
  (scroll-back backfill = sanctioned future polish); core log tests rewritten
  (durable-survival + unbounded assertions); fixtures regenerated.

## Addendum 7 — M3 · the Andon composition (② LAYOUT · MED–HIGH)

The screen becomes the Andon frame — Approach A (minimal DOM churn):

- `render.ts` — the log re-parented from the workspace to a SHELL sibling
  (2 lines); every reconciler/scroll hook survived (element-identity keyed).
- `.shell` → the B.8 grid: title / vitals / rail|desk|log-window / footer;
  the log window column `minmax(300px, 38%)`.
- `.nav` → the vertical LEFT RAIL (gold keyline right edge, active post LEFT).
- Byōbu neutralized: the workspace keeps its single work fold; the
  `.slice-log` fold rules went inert; the `data-layout` stamps stay (tests).
- **Phone recomposition (≤920px, the demo's breakpoint):** ONE fixed-frame
  column — header rows / desk (scrolls) / log BAND / bottom tab BAR (wraps) /
  footer; `--tap-min` rises to 44px. The old ≤720 "natural page flow"
  fallback DIED — it set `#app/.shell` height:auto and the grid exploded to
  17,000px+ with the unbounded log (caught by headless phone probe; the e2e
  lane didn't see vertical explosion — noted as a lane gap).
- e2e updated IN-COMMIT (the M3 card's requirement): both layout helpers
  rewritten to Andon geometry (`.shell > .log`, bottom-bar ordering, the 38%
  window cap), the mobile tap floor 24→44px; `.rung-head-trigger` gained the
  `--tap-min` floor; the log window clips (landscape short rows).

verify green (17) · e2e green (73, both phone profiles + desktop) · headless
desktop + Pixel-7 captures reviewed. Human playtest = the M3 gate (the
highest-risk card — the eye re-learns the screen).

## Addendum 8 — M3-review drain (FB-162…FB-166)

FB-162 DEV chip tracks the shell edge · FB-163 shell side keylines (vertical
frame) · FB-164 slim 6px steel scrollbars · FB-165 chat kicker map now PURE
(lookahead — the header leads the player's opening question; verified against
the original capture save) · FB-166 rice-counter value = 💬 design question
bounced to the human. verify green.

## Addendum 9 — M4 · GBA-typewriter cold-open (③ FLOW · MED)

The human was half-right that this already existed: the LEDE typed since
FB-14. M4's actual delta, per the card: the TITLE and ROMAN now type too
(staged: title → roman → lede, the title's kanji at 3× per-char so they land
with weight), the cadence is single-sourced from TYPE_MS_PER_CHAR (the local
per=32 literal died), and a GOLD BLOCK CARET (hard steps() blink — the retro
cadence) rides whichever element is typing. Reduced-motion/QA-instant keep
the everything-at-once path; the one-shot guard + cancel path keep working
(cancelled runs restore full text for replay). verify green; staged headless
captures reviewed.

## Addendum 10 — M5 · VN + ceremony re-skin (① THEME +③ motion · MED)

CSS-only, DOM contract untouched (ADR-104/ADR-110/ADR-062 kept):

- `.vn-seal` → a damascene nameplate seal: raised steel face, the speaker's
  voice colour as keyline + glyph (currentColor), silver top-rim.
- `.vn-story` divider → gold key-dim hairline.
- `.seal-inner` (rank-up overlay card) → a steel plate; the scrim → void.
- `.rankup-kicker` → the VERMILLION band (pale lettering on shu) — the lone
  hot accent, spent only at the ceremony.
- **The vermillion HEAT (B.3):** a radial shu flush blooms around the
  gold-faced seal as it presses — wired to BOTH the overlay's seal-press and
  the FB-153 in-modal rung ceremony; auto-neutralised under reduced motion.
- Ascension seal: the gold-on-gold border/colour overrides died (the bimetal
  face reads as-is); the ascension form only grows + glows.

verify green (17) · e2e green (73) · headless captures of the nameplate +
in-modal ceremony (heat visible) reviewed. M4+M5 = ONE human review batch
(the human's call).

## Addendum 11 — FB-167 log block-breaks + FB-168 mobile log band

- FB-167: speaker-block breathing room in the log (voice/speaker/channel
  change → `log-break` margin); with FB-158 quotes + prefixes the feed reads
  as distinct blocks.
- FB-168 (human steer, the demo's m-log-band): phone log = a one-line band →
  tap expands to a near-full-screen sheet → header '▾ fold' collapses;
  desktop untouched. verify + e2e green; Pixel-7 expand/fold verified.

## Addendum 12 — M6 · variant surfaces in steel + the estate diverge

- Audit: every diverged surface's renderers are TOKEN-built — the M1 flip
  re-skinned them in place (zero washi literals; the two meter fills + the
  one plaque chip verified token-coherent). A 14-shot headless sweep
  (estate/influence/home/craft/bestiary/quests/market/map variants) reviewed
  via contact sheet — all steel-native, nothing translated poorly, so no
  variant needed the "flag for the human" escape.
- **FB-157 estate diverge built (ADR-075 FULL):** A quiet-sections (prod
  default) · B ledger strip · C bimetal plaque — all three drive the real
  `improve_estate` + live stage/coin/rooms; registered in SURFACES + routed +
  RED-able routing tests (default renders rung-cards; B/C swap them out and
  dispatch improve_estate). New **HR-9** filed; HR-2/5/7 got the "pick in the
  new look" note.
- M6's completion (per the card) = the human's live picks + the strip; the
  BUILD side is done.

## Addendum 13 — M7 · doc ripple + woodblock lock retirement (ADR-144)

- `ui-design.md` REWRITTEN as the **Andon Steel bible** (373/400 lines): bimetal
  vision, steel palette roles (+ the locked temper attrs + voice ramp), Western
  system stacks (zero font pipeline), the Appendix-B material contracts, the
  Andon shell + phone band, every component section reconciled to what M1–M6
  actually built (log window/history/readability rules, in-modal ceremony,
  steel buttons + auto-disarm, rail nav, seal heat, cooled emoji, updated
  anti-slop table incl. "vermillion is SPENT, not worn" + "no texture/grain").
- PRD: the three identity claims re-pointed (01-vision register · 02-systems
  identity-hues · 07-roadmap R4 art/feel + fonts); the in-fiction woodblock
  BROADSHEET survives deliberately (period prop, not UI identity).
- `taste.md`: already identity-neutral — untouched.
- decisions.md: **ADR-144** (retire-by-supersession, executes ADR-127);
  ADR-018 bannered RETIRED (its CSS-only/no-pipeline constraint now total);
  ADR-045 bannered TRANSLATED (the rule survives on the new ramp); ADR-068
  re-anchored (the SFX palette is diegetic).
- `prd:drift` CLEAN · doc-budgets green · verify green (17).

**UI-v2 M1–M7: all built.** Remaining human gates: variant picks
(HR-2/5/6/7/9) + strip, final R0/R1 + mobile certification.

## Addendum 14 — the decision walkthrough (AskUserQuestion rounds)

- Certification: PENDING — the human plays the final R0/R1 + mobile pass next.
- FB-166 rice counter: **Inventory only** — implemented (vital removed from
  the header; the R0–R2 no-persistent-readout gap flagged in the F-log).
- ALL variant picks (HR-2/5/6/7/9): deferred to the human's live in-game pass.
- Queue steer: just the rice move; strip waits for the picks.

## Addendum 15 — HR-7 re-scoped: the REAL estate map (10 directions)

Human verdicts on the seven map takes: A disliked · **C/D/E/F rejected and
STRIPPED** (renderers + registry + helpers; dev.test ALTERNATES → [b, g]) ·
**B & G held** (the only real 2D what-is-where navigation). New direction: a
genuine ILLUSTRATED 2D estate map that grows per tier and changes with estate
improvements — 10 candidate directions written up in
`docs/plans/fable-2026-07-06-estate-real-map-options.md` (queued); the human
picks 3, each to be built by a Fable-5 xhigh subagent (ADR-075). The Map tab
also goes two-column (flavour card | map) as shared groundwork. verify green.

## Addendum 16 — real-map diverge: 5 picks, 5 subagents, seams scaffolded

The human picked FIVE directions (1 ezu · 4 model board · 6 cadastral ·
8 lantern · 9 kamon — "I know I said 3 but 5 is great") to be built by five
Fable-5 xhigh subagents. Scaffolding landed first so the agents never touch
the same file: one module per take under `src/ui/map-variants/` (imported
only by dev.ts → prod tree-shake), `shared.ts` with MapCtx + BFS/fog +
travel/gate wiring, registry entries map-h…map-l + router cases, stub
placeholders, verify green. Agents write ONLY their own module; no commits;
I verify + land the batch.
