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
