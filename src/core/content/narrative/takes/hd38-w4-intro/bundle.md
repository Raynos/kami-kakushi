<!-- HD-38 / ADR-185 · W4 of the T0 re-voice — Intro 1, the `dream` act (ADR-139 diverge).
  The audit called this a prose problem. It is not: it is a STRUCTURAL bug, and that is
  why re-voicing alone could never have fixed it.

  The dream names THREE things — one knot, one road, one load. The menu then offered
  "Hold the knot / Strike the list / Take up the load": the ROAD had no option, and
  "Strike the list" was a meta-move against the list rather than one of the things in
  it. Meanwhile the perk that option grants is "The Clear Room — senses sharpened to
  THE WAY OUT" — which describes the road exactly. The game's first choice, which hands
  out a permanent stat and a permanent perk, has been one word away from coherent.

  The human licensed the reframe (2026-07-12): the choice may change, the MECHANICS may
  not. All three option ids, both stat deltas each, and all three perk lines (name AND
  description) are byte-identical to canon. Zero engine change, zero balance change.

  Canon = take C + redlines. The blind fresh-reader pass killed take B (best prose in
  the set — and it fails the WHAT-test 3 times out of 3) and caught a continuity break
  in take A. The redlines graft take B's one superior idea: body-verb labels, so the
  player can see the thinker / the runner / the ox BEFORE clicking.

  Also fixed here: the shared `@cold-open.dream` line was a garden-path — "What surfaces
  is counted" reads "surfaces" as a NOUN on first pass. Now "Whatever surfaces is
  counted" (cold-open.md; single-sourced, so both the cold-open card and this act get it). -->

# bundle hd38-w4-intro · Intro 1 — the dream, and the game's first choice
hr: HR-35
rung: R0
review: project/human-in-the-loop/review.md
rationale: Canon is take C plus three redlines. (1) The three options now map one-to-one
  onto the three things the dream actually names — knot, road, load — so the menu and the
  list finally agree, and "The Clear Room" is at last granted by the ROAD it describes.
  (2) The labels became body verbs — Hold / Kick / Shoulder — grafted from take B, the one
  thing B's menu did better than anyone: a 14-year-old reads them and instantly knows they
  are choosing between the thinker, the runner and the ox. (3) The LOAD option finally gets
  its plain "from now on…" habit sentence — it failed the what-test in ALL THREE takes,
  which means it was a hole in the original design, not a versioning problem. Its siblings
  both told you what you had permanently become; it handed you a strap and a step and let
  you guess.
canon: C+ · three things, three verbs, one hand (minimum change, redlined)

## take a · three things, one hand
brief: The straight structural fix — three things surface, the water takes all of them,
  you have one hand and time for one. Whichever you hold becomes the habit you carry for
  life, because the head kept nothing.
scorecard: 17✔ 3✘ — ✘ CONTINUITY BREAK: "You come out coughing, alive" resolves the
  rescue three scenes early, and in only ONE of the three options — so the same menu
  forks the plot, and a replaying player learns one choice also survives the water;
  ✘ turns a surfacing MEMORY into a physical swimming direction (take C keeps the logic
  airtight: the items go under, THEN the water clears to a direction); ✘ the load option
  still fails the what-test.
file: take-a.md

## take b · the body chooses first
brief: He does not decide — his body decides, and he learns what he is by watching what
  it did. Agency is retroactive: the first act of self-knowledge is an act of OBSERVATION,
  and this is a man who will spend the whole game learning who he was from evidence
  rather than memory.
scorecard: 15✔ 5✘ — the best PROSE in the set and it still loses, which is the finding.
  ✘✘✘ WHAT-TEST FAILURE 3/3: every option resolves into an abstract noun — "the asking /
  the aim / the carrying" — so a player finishes all three paragraphs and still cannot say
  what their permanent perk DOES. On the first screen, that quietly teaches them the
  game's choices are vibes. ✘ the labels are declarative sentences ("Your fingers close on
  the knot") — narration, not buttons: strange to CLICK. ✘ "It finds you carrying nothing,
  correctly" — a genuinely great line, and a wall for the target reader.
  KEPT ANYWAY, because its label idea is grafted into canon and because "The head arrives
  late, the way it always will" is the best line any of these agents wrote. Human: if you
  want that line in canon, say so and I will find it a home.
file: take-b.md
