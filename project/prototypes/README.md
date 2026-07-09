# project/prototypes — standalone interactive feel-tests (permanent)

Self-contained HTML prototypes built so the human can FEEL a proposed
mechanic or surface before its plan is judged — the interactive sibling of a
`docs/plans/` proposal. Born 2026-07-09 when the kikigaki feel-test needed a
home outside `ui-demos/` (the one-time UI-remaster staging ground, retired
and deleted that day; its 10 variants live in git history — ADR-127 note).

Unlike `ui-demos/`, this ground is **permanent**: a prototype stays as the
reviewable record of what a verdict was rendered against, even after its
plan lands or dies. One directory per prototype, each linked from the plan
or HR-item that owns it.

## Rules of this ground

- **Nothing here ships.** No imports from `src/` and vice versa; prod wiring
  happens (if ever) as its own pass under the owning plan.
- **Self-contained**: one `index.html` per prototype (inline CSS/JS, system
  fonts, no build step) — open it in a browser, or serve the repo root.
- **Mock data only, clearly labeled** — never canon; fiction-voiced text in a
  prototype is illustrative and exempt from ADR-139 until it heads for canon.
- Excluded from oxlint/oxfmt (like `tmp/` and the old `ui-demos/`).
- Wear the real design tokens (copy from `src/ui/styles.css`, note the date)
  so the human judges the mechanic, not a foreign skin.

## Prototypes

- [`the-noticing/`](the-noticing/index.html) — depth-lane feel-test V
  (2026-07-09): acquisition through PLAY, no button — the estate's live log
  mixes ordinary life with occasional lines that quietly contradict the
  world's posted normals (prices, calendar, habits); you get 3 notes of ink
  a day; noting a truly-off line stamps the album, noting a normal one
  wastes ink. Sets complete → revelation → permanent idle buffs. Built
  after The Album's verdict ("a gacha hint button — no world integration").
- [`the-album/`](the-album/index.html) — depth-lane feel-test IV
  (2026-07-09): the genre-native synthesis the human's Round-6 verdicts
  picked — a live idle strip earns ATTENTION; spend it ("Listen") to fill
  silhouette ??? slots in named sticker SETS, or assign the SCHOLAR to a set
  to fill it while you idle (some slots are scholar-only); completed sets
  play a revelation and grant permanent idle buffs (bite-back); two sets
  start hidden behind others. Earn → spend → automate → complete → buff,
  end to end. Owner: same Plan K thread.
- [`the-asking/`](the-asking/index.html) — depth-lane feel-test II
  (2026-07-09): free-text questioning — type what you wonder, in your own
  words; four NPCs answer in voice via a hand-built miniature (~40 intents)
  of the compiled intent lexicon; hidden per-person openness (no meters, no
  move list), authored deflections that leak sideways, a buried
  date-discrepancy aha-chain. Built after the kikigaki mock's verdict
  ("checklist, too cheap"). Owner: same Plan K thread.
- [`kikigaki-depth/`](kikigaki-depth/index.html) — the Plan K §U feel-test
  (2026-07-09): the authored-depth investigation notebook — three layout
  variants (book / ledger / scroll), the notebook beat, tick/coin-priced
  moves, warmth gates, a resolution bite, an authored-ambiguity bottom.
  Owner: [`docs/plans/t0/fable-2026-07-09-authored-depth-demo.md`](../../docs/plans/t0/fable-2026-07-09-authored-depth-demo.md).
