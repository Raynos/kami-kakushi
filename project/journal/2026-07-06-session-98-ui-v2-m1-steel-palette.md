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
