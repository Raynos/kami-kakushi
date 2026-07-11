# project/prototypes — standalone interactive feel-tests (permanent)

Self-contained HTML prototypes built so the human can FEEL a proposed
mechanic or surface before its plan is judged — the interactive sibling of a
`docs/plans/` proposal. Born 2026-07-09 when the kikigaki feel-test needed a
home outside `ui-demos/` (the one-time UI-remaster staging ground, retired
and deleted that day; its 10 variants live in git history — ADR-127 note).

Unlike `ui-demos/`, this ground is **permanent**: a prototype stays as the
reviewable record of what a verdict was rendered against, even after its
plan lands or dies. **Prototypes are grouped one folder per OWNING PLAN**
(human, 2026-07-09), so a parked plan's whole feel-test record travels
together; inside, each prototype is one self-contained dir.

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
- **Status tags** (kept in this README, per prototype): ⭐ **POTENTIAL** —
  the human saw promise; the owning plan's design should build on it ·
  **REFERENCE** — failed its feel-test; kept as the record of a verdict
  (what any future attempt must beat).

## Plan folders

### [`map-token-presence/`](map-token-presence) — FB-340 / HR-26 follow-on (no plan yet)

Born 2026-07-11 from the human's direct ask: replace the flat shu marks (square /
circle / footsteps) with a **physical piece sitting on the survey sheet** — "a
chess piece, a monopoly character, a peon, a miniature" — travelling between
zones as a linear animation. Prototype precedes any plan; if the feel-test
lands, the owning plan supersedes this note.

- [`physical-token/`](map-token-presence/physical-token/index.html) — the REAL
  baked T0 sheet (harvested render + CSS + Andon Steel tokens, 2026-07-11 —
  `t0-sheet.svg` sits beside the HTML) with a token layer over it. Four
  switchable pieces (将棋 koma · 人形 wooden miniature · 碁 go stone with the
  house mon · 笠 top-down pilgrim hat), three movement idioms (walk with shu
  footprints · slide · lift & place with shadow separation), optional camera
  follow. Click any zone seal — or anywhere — to send the piece travelling
  (linear, constant speed).

### [`authored-depth-demo/`](authored-depth-demo) — Plan K (🧊 PARKED)

Owner: [`docs/plans/t1/fable-2026-07-09-authored-depth-demo.md`](../../docs/plans/t1/fable-2026-07-09-authored-depth-demo.md).
The 2026-07-09 depth-UI feel-test loop — **five feel-tests in four folders**
(feel-tests II and III share `the-asking/`: v1 was rewritten in place into
v2; v1 is recoverable at commit `f29e87c^`). Round-by-round verdicts:
[the discovery record](../brainstorms/2026-07-09-authored-depth-direction.md),
Rounds 2–9.

- ⭐ **POTENTIAL** — [`the-asking/`](authored-depth-demo/the-asking/index.html)
  (feel-tests II+III): free-text questioning, answers in voice from a
  ~40-intent lexicon miniature, hidden per-person openness, per-person
  territory hints in the input, and (v2) real answers distilling into
  clue-lines under named open questions. The human: "the asking having the
  most potential." Plan K's rewritten K4 builds on exactly this.
- **REFERENCE** — [`kikigaki-depth/`](authored-depth-demo/kikigaki-depth/index.html)
  (feel-test I): the enumerated-moves notebook (3 layout variants, priced
  moves, warmth gates). Verdict: checklist, too cheap — though the *book*
  layout and set-accumulation idiom survived into later tests.
- **REFERENCE** — [`the-album/`](authored-depth-demo/the-album/index.html)
  (feel-test IV): idle-earned attention spent on silhouette sticker sets +
  the Scholar automation + completion buffs. Verdict: "a gacha hint button —
  no world integration" — but set completion, the Scholar, and
  buffs-that-visibly-speed-the-idle-strip were individually liked.
- **REFERENCE** — [`the-noticing/`](authored-depth-demo/the-noticing/index.html)
  (feel-test V): caught-not-vended — anomaly lines hidden in the live estate
  log, 3 notes of ink per day. Verdict: "not fun" — mechanically sound, flat
  without real material/stakes (the Round-9 finding).
