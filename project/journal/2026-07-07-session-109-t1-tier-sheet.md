# Session 109 · 2026-07-07 — the T1 tier-sheet sitting (A1)

**Plan:** [`docs/plans/fable-2026-07-07-story-bible-finish.md`](../../docs/plans/fable-2026-07-07-story-bible-finish.md)
— workstream A, step A1: the T1 tier sheet, full detail, co-written
with the human one piece per exchange.

## Done

- **Fixed `session-brief.sh` silent death** — `grep -c .` exits 1 on a
  zero peer-count, and under `set -euo pipefail` that aborted the whole
  brief with no output whenever the session was alone on the tree (the
  common solo case). `|| true` appended; brief prints again.
- **A1 piece 1 — the T1 ladder, LOCKED** (AskUserQuestion, three
  forks):
  - **Rung-title merge:** R4 **works-hand** · R6 **foreman** (the seed's
    titles win over the overview's wing-hand/wing-warden); the
    wings-access arc folds INTO them — the wings open to him tool-first
    at R4, the east wing passes under his charge at R6. `03-tiers.md`
    rung line synced to match.
  - **Cast in the wings:** Toku → R3 (the kura alcove), O-Sato → R4
    (airing a room that was hers), Naoyuki → R6 (his brother's stored
    things). **Human redline riding the lock:** each meeting must make
    diegetic sense (why is this person THERE), and T1 must GROW the
    cast — three named carryovers is not a tier's roster. Piece 2 =
    cast at nodes incl. new T1 faces.
  - **The wolf's return:** R6, boundary-stone fields, resolved as a
    player **DECIDE — won or spared** (mirrors T0's dog beat).

- **A1 piece 2 — the T1 cast, LOCKED** (AskUserQuestion, three forks):
  - **Wings-meeting diegetic law written:** Toku's alcove habit is
    what the key reveals (she has her own) · O-Sato airs rooms AHEAD
    of the works schedule · Naoyuki carries Katsuhide's crates to the
    west wing himself, refusing help (the west wing stays closed —
    the things cross, the MC never enters).
  - **Four new faces locked:** Denshichi (crew boss) · Heikichi
    (master joiner) · Ribei (creditor's clerk) · Tetsuji (smith).
  - **Heikichi's compound past PAYS** (human picked "keep and use
    it"): at the shoin restoration he reads the salvage marks — the
    shoin's bones came from the compound — as craft, not revelation; a
    seed that turns legible at T2's reveal, NOT a fourth signal.
  - **Hire = forge locked:** R6's first hiring is Tetsuji, and the
    choice lights the cold forge.
  - Entries added to `04-cast.md` (new "works & crews" section);
    `t1.md` carries the node placements.

- **A1 piece 3 — the T1 land zones, LOCKED** (redline round on combat
  density, then AskUserQuestion):
  - The 7 drafted land zones locked as written (paddies · woodlot +
    clamp · weir & flood-works · kura interior · workshops · boundary
    stones · family plot), each with its wrong thing.
  - **Human steer:** T1's new ground had only ONE combat zone vs T0's
    five — asked for edge-of-estate combat flavor. Added and locked
    ALL THREE proposals: **Upstream pools** (grindable; the R4 breach
    repair retires it), **Let-go terraces** (authored chain — combat →
    reclamation, the orchard escalated), **Downstream shallows**
    (kawauso raid Matsuzō's fish weirs — kernel #1's next folk animal).
    T1 new ground now has 4 combat zones + night-rounds escalation.
  - **Mystery debt locked at ONE answer:** firebreak + taken breach
    stones + the otters' dressed-stone den all pay from a single
    authored story at the fall's design (T2/T3).

- **A1 piece 4 — the wings zones + the estate-build spine, LOCKED**
  (AskUserQuestion, three forks — all recommended options taken):
  - Four wings zones locked: East wing (mismatched fittings — the
    house ate itself), West wing (closed all tier; the swept corridor
    stays PLAIN TEXTURE — O-Sato's ordinary duty, no mystery debt),
    Inner garden (recovery node; the stone path's gate opens on the
    ruin — existing debt only), the Shoin (salvage marks; the scene).
  - The R1–R7 estate-build spine locked as a table — including NEW
    canon: **the R5 steward's room** (Genemon's papers leave the
    kitchen; T0's compression wrong-thing repaired on screen; the
    debt panel unlocks IN the room — room and number arrive together).

- **A1 piece 5 — the side-beats roster, LOCKED** (AskUserQuestion):
  all six beats (Bon #2 lantern-carried · interest day ×2, nengu-shape
  reuse KEPT deliberately · the night-round ask, the mirror's T1
  DECIDE · Heikichi's lantern walk · the room offered · the rumor
  current). The room offer gets **light stakes** (human's pick over
  the pure-portrait recommendation): recovery flavor differs by home,
  magnitude sim-owned at the B2 mechanics ADR.

- **A1 piece 6 — combat structure & enemies, LOCKED**
  (AskUserQuestion): the shapes roster (grinds · chains · set-piece ·
  night rounds that GROW with the estate; boar-sow night apex kept
  smaller than the wolf) · **the wolf staged in DAYLIGHT, open
  fields** (the T0 inversion) · **the east-wing quiet stretch CUT**
  (human's call over the recommendation — the night round stays
  all-combat end to end) · forge equipment lane · seasons · carried
  systems canon.

- **A1 piece 7 — economics + mystery seeding, LOCKED**
  (AskUserQuestion): three-ledger T1 state · **the renegotiation scene
  as the economic capstone, WITH one line for the MC** (human's pick
  over the silent version — Genemon defers a single point to the man
  who keeps the tallies) · **"the number MOVES"** as T1's debt victory
  (first principal dent, magnitude sim-owned) · net-worth flavor
  target ("a man's poverty, not a stray's") · tier-up deed classes ·
  the seeding table with the one-answer rule.
- **A1 COMPLETE.** t1.md rewritten whole to t0.md's section order
  (seed scaffolding stripped, header now "walked and confirmed whole");
  README status ledger updated (T0+T1 complete, T2–T6 seeded); the
  finish plan's A1 step marked ✅.

- **Shared-tree near-miss (logged for honesty):** the A1-complete
  commit initially swept in ANOTHER AGENT'S staged deletions
  (`src/ui/map-variants/*.ts`, agent w1:p3) — I printed the staged-set
  check but chained the commit without reading it. Fixed by soft-reset
  + pathspec re-commit; their staged state restored untouched. The
  push stays local while their WIP keeps the tree red (their red, not
  ours to fight).
- **A2 opened — piece 1 LOCKED** (AskUserQuestion): **the epigram
  license = Shigemasa + Kihei**, cap spent (Shigemasa's maxims fail
  upward; Kihei's creed is the charter) · **the misreading prism is a
  GUIDELINE, not law** — human redline: misreadings are an EARLY-GAME
  phenomenon (a stranger with no reputation); they dissolve tier by
  tier as standing replaces silence as the thing people read ·
  **Genemon + Kihei voice entries LOCKED** (wants, misreadings,
  shapes, nodes — Kihei's want: one student who outlives him).

- **A2 PARKED after piece 1 (human steer):** piece 2's four drafted
  entries (Sōan · O-Sato · Toku · Chiyo — wants, misreadings, shapes)
  were preserved in `04-cast.md` explicitly marked DRAFTED/NOT-locked
  so the pivot loses nothing. Still owed when A2 resumes: those four
  locks, the family voices, the edge cast, the T1 four, the MC's
  use-name, the name-norm sweep.

- **A4 · T2 piece 1 LOCKED** (AskUserQuestion, all three recommended):
  the eight-rung ladder with the ⌂/⛩ alternation marked · **R5's one
  authored alternation crossing** (the bandits bring the valley INTO
  the works — the first human fight as threshold beat) · **the
  dues-carrier discovery** (T1's tally skill notices Genemon's silver
  line — the skill the house gave him finds its secret) · the reveal
  staged (three signals, Toku's mouth closes it, the silent map
  re-label at her scene's end).

- **A4 · T2 piece 2 LOCKED — the T2 sheet is DONE at half detail**
  (redline + AskUserQuestion): village cast (five roles: Jinbei ·
  Ekai · Kyūbei · Funakichi · Seiroku/"mountain dogs") + **the human's
  redline: an ordinary-villager pool with no plot roles** (Gonsuke ·
  O-Haru · Tazō · O-Mitsu · Bunta) · the five-stage village track
  (can FALL) · both arenas' quest threads · **the register of the
  vanished holds Katsuhide's official taking-entry** (the lie's public
  copy) · **the first man DIES** (human's pick over taken-alive) —
  under Sōan's hands in the room where the MC was saved; Bon #3 =
  the lantern he chooses to light · economics + seeding.

- **THE ORIGIN RELOCKED — a major human steer (ADR-022: newest intent
  wins).** I presented three flight-and-guilt origin options per the
  reboot kernel's "what he fled"; the human asked what the ORIGINAL
  PRD story was, and on hearing it, restored it whole: *"the reboot
  kernel is too harsh and brutal. I want accident with a warm reunion
  waiting."* Locked:
  - **The MC is TAHEI** (working canon), a kaidō porter a LANDSLIDE
    took into the river — no flight, no guilt, **no grave**; his
    family (father Jinpachi, mother, sibling — the latter two named at
    the sweep) is ALIVE and assumed him missing; his register entry
    was KEPT OPEN (the second unstruck line — he has stood on both
    sides of the same refusal).
  - **The TAMA thread returns whole to T2** ("the whole damn point of
    the name of the game"): Sayo names him at R0; Tama-vs-farmhand is
    REAL authored DECIDEs (naming · Bon rites · the well), moving both
    tracks and changing which scenes exist; Ekai's register now holds
    TWO false takings (Katsuhide's + Tama's).
  - **The T3 rails restore the PRD shape:** the Otsuru truth on the
    SPINE guaranteed (Tama was a girl who ran, found grown at
    Yanagi-watari); the Tahei reunion OPTIONAL and missable at
    Sawatari-juku (the O-ladder; Kanta its first face; the
    name-reclaim at its end). Matsuzō's quiet river and Sōan's ledger
    both pay warm.
  - **Kernel #1 softened one line** (human steer, noted in-place):
    "human cause" → "mundane, worldly cause… or a plain accident";
    truth "is not required to wound."
  - **Renames at the restoration:** headman Jinbei→**Mohei** (yields
    to Jinpachi), villager Tazō→**Ganzō** (yields to Tama/Tahei).
    Sweep docket: Sayo/O-Sato (Sa-), Kanta/Katsuhide (Ka-).
  - Rippled: 00-kernel · 02-house (birth-name cell closed) · 03-tiers
    (T3 overview + zones) · 04-cast (MC origin + tier seeds) · t2.md
    (Tama thread section) · t3.md (rewritten whole).

- **T3 DONE at half detail** (two AskUserQuestion rounds): the two box
  locks (sibling = **younger sister**; Tama DECIDEs bite as
  scenes-differ-**arenas-stay-open**), then the closing piece — reunion
  staging (basket → Kanta tells the missing years → threshold, the
  sister doesn't know him, Jinpachi does → the kept **carrying-pole**,
  twelve years oiled → **O5 register entry CONFIRMED, not struck**) ·
  the Otsuru spine scenes (Ekai amends the false taking on screen;
  **why she ran = open cell, kernel-bound**) · the buried-truth ledger
  (Kuzuhara account **names the office that took the flood-works cut** —
  T4's first paper shadow; Genemon's silver = the unpaid lines) ·
  region cast · expeditions (winter closes the passes) · economics
  (**the debt RETIRES as antagonist at T3's end** — clean baton-pass to
  T4's enemy). README ledger + T3 header updated.

- **T4 DONE at quarter detail** (two AskUserQuestion rounds — the
  human overrode my drafts twice, productively): the enemy is **a
  martial castle-town lord**, NOT the administrator I proposed, with a
  **personal stake** I then had to author: **scavenger in the old
  chair** — his house took the Kurosawa's precedence as they fell, and
  helped the fall (sharpened the famine arrears, took the flood-works
  cut). **The house's OWN Kuzuhara guilt survives** (the grandfather
  built fatal works; the enemy only profited — full truth cuts both
  ways). Kernel #5 intact (he keeps his head; the daimyō never a
  scene). **Katsuhide = temple registrar**, authored renunciation
  (strikes his own line, does not return) — the ink thread tripled
  (Shigemasa won't strike · Katsuhide strikes himself · Tahei's family
  refused to strike him). README ledger updated (T4 quarter).

- **T5 DONE at fifth detail + T6 CHECK-PASSED** (the human: "T6 do
  both in one go, I'll review both" — I locked T5 at its recommended
  shape and did T6 as the reserved-tier check, no per-fork box):
  - **T5:** the audience-day system = **T0 run backwards** (he's
    summoned-to-judge instead of summoned-to-be-judged; petition-as-
    content; the R2 first-petitioner is a former equal). The handover:
    **Genemon confesses the whole Kuzuhara truth and dies at R7**, the
    MC inheriting the DUTY to keep paying the unpaid lines; the
    **Kuzuhara↔domain-silted-works rhyme is the tier's spine** (heal
    at domain scale what drowned a hamlet at estate scale); the creed
    passes **Kihei→MC→Shinnosuke**.
  - **T6:** verified reserved — nothing crept in. Only reconciliation:
    the ink thread (in `03-tiers.md`, NOT t6.md — I misattributed it
    first) updated so the T3 node is the **Tahei reclaim** and the
    thread now runs across TWO registers (origin confirmed-alive +
    Kurosawa still open to his choosing).
  - **ALL SEVEN tier sheets are now walked to their staged depth.**
    Plan A1/A4/A5/A6/A7 marked ✅; README ledger updated.
  - **Human REVIEWED + confirmed T5 & T6** (post-commit summary box, 4
    questions): all four kept as locked — the audience-day inversion +
    R2 former-equal beat · Genemon's confession-death-and-inherited-
    paying-duty · the Kuzuhara↔works rhyme + the Kihei→MC→Shinnosuke
    creed · T6 stays reserved (two-register ink thread). No redlines;
    the tier spine is human-blessed.

- **A2 · FULL T0–T5 CAST AUTHORED** (human: "build the full T0 to T5
  cast, all of them, then I'll review 4 at a time after complete"). I
  built a **shape registry first** to satisfy prose-law-#2 (no two
  characters share a sentence shape) and authored all ~24 entries
  myself (no fan-out — blind agents would collide on shapes). Locked:
  - **Household (8):** Sōan · Chiyo · Toku · O-Sato (the Chiyo/O-Sato
    conditional near-collision split: ledger-price vs protective-hope)
    · Shinnosuke · Naoyuki (reads TRUE — the prism exception) ·
    Shigemasa (epigram, fails upward) · Katsuhide (temple registrar,
    closed/completed tense).
  - **Edge (6):** Yohei (patter) · O-Yae (reported speech) · Matsuzō
    (water-talk) · Iori (valedictory, no maxims) · O-Ume (addresses
    the dead) · Rokusuke (agrees mid-sentence).
  - **T1 four:** Denshichi (orders-as-facts) · Heikichi (talks to the
    wood) · Ribei (relentless courtesy) · Tetsuji (short/hot/final).
  - **T2 village (6 + pool):** Mohei (both-sides-lands-quiet) · Sayo
    (declares/dares — the Tama misread engine) · Ekai (indexes the
    missing by when they went) · Kyūbei (grumbles) · Funakichi
    (first-hand traffic) · Seiroku (hunger-as-fact). The ordinary pool
    gets NO shapes (a shape is a promise to touch them again).
  - **T3 region (6):** Jinpachi (deflects to chores) · the mother
    (present-tense of a boy who never left) · the sister (guarded,
    "brother" like a foreign word) · Kanta (old-friend shorthand) ·
    Otsuru (answers only what's asked) · the toiya master (ranks
    everything).
  - **T4/T5 (2):** the enemy lord (inheritance/precedence — the
    anti-kernel-#3 voice) · the bakufu inspector (regulation/code).
  - **Shape-collision watch** added to the sheet (Chiyo/O-Sato;
    plain-cluster MC/Tetsuji/Jinpachi; record-cluster Genemon/
    Katsuhide/Ekai/inspector) — flagged for the human's ear.

- **Cast review, batches 1–2 KEPT; batch 3 stopped on a structural
  redline.** The household 8 (Sōan/Chiyo/Toku/O-Sato, then
  Shinnosuke/Naoyuki/Shigemasa/Katsuhide) were all kept as locked. At
  batch 3 (the edge) the human called the PATTERN broken: *"they are
  all forced to have specific wants and then specific misreads and
  then specific speaking things — a rule that's way too tight."*
  Direction locked via a follow-up box + prose: the field template is
  a **guideline/palette, not a form**; characters must be interesting
  in their own right; **some** sharp shapes are fine but not a cast of
  eccentrics — each character needs its own BEHAVIOR that fits the
  bigger story.
- **THE CLEAN PASS (this entry):** `04-cast.md` rewritten whole as
  **portraits, not stat-blocks** — natural prose per character; the
  approved household substance preserved but re-rendered; the
  edge/T1/T2/T3/T4/T5 entries re-authored (forced wants dropped,
  universal "misreading of the MC" dropped). New ground rules replace
  the shape-collision machinery: **misreads are engines, not a
  template** (only Genemon · Kihei · Chiyo · Toku · Sayo · the enemy
  lord carry one; Naoyuki reads true) and **sharp shapes are
  rationed** (Genemon · Kihei · Toku · Katsuhide · Sayo · the mother ·
  Shigemasa; everyone else gets a register, not a tic). The ordinary
  pool stays voiceless by design.

- **THE NAME-NORM SWEEP — RULED** (two AskUserQuestion rounds, all
  recommendations taken): Shigemasa→**Munemasa** · O-Sato→**O-Hisa** ·
  Kanta→**Kenta** · the bundle **O-Nobu / Suzu / Zenbei / TOMITA
  (house; PRD revival; lord's personal name defers to T4) / Hori** ·
  the use-name = **GONBEI** (Nanashi-no-Gonbei — the folk idiom for
  the nameless as the house's hand-me-down name; Gonsuke→**Kumazō**
  freed the syllable). Applied mechanically across the whole bible
  (zero stale names on grep); Tomita/Toku To- recorded as a
  house-vs-given-name class exception in the 02-house norm.
- **A3 REGISTER RULES — LOCKED** into `01-laws.md` as §0.5 rules 4–6:
  the dream cadence (every SECOND sleep-ending promotion from T1;
  first dream T0-R7) · vague-but-parseable (as written) · the log/VN
  split in the human's own form ("mixture as needed: flavor in the
  log, story and side quests in the VN UI").
- **A-FINAL COHERENCE PASS — RUN:** end-to-end read; 05-world verified
  (first full read — clean against reveal/anatomy canon); 02-house
  open cells reconciled (Katsuhide's exile identity → resolved-struck;
  enemy office → Lord Tomita; why-Tama-ran added as the open cell);
  the enemy paragraph names Tomita + the scavenger stake; t0-R7 +
  ink-thread now carry Gonbei; README status ledger rewritten.
  **Workstream A is COMPLETE — the bible awaits the human's
  whole-read blessing → BIBLE DONE.**

- **THE BIBLE-REVIEW Q&A — seven open questions walked** (the human
  asked for highlights + open decisions; two AskUserQuestion rounds):
  - **Naoyuki DECLINES the cleared chair** (his one proud scene; regent
    till Shinnosuke is ready — "never lord" becomes his choice).
  - **The MC tells Shinnosuke the truth about his father** (T5, the
    mirror's payoff — the hardest kindness in the game).
  - **The fall's buried story: author NOW in one sitting** (drafted
    next — the one big unwritten load-bearing piece).
  - **The jizō resolves T3 and it is O-UME** (a decade of grief for
    her drowned husband; the oldest mystery closes warm).
  - **The ambiguity budget is RESERVED for the T6 ending** (policy —
    unspent by choice now, not drift).
  - **Toku LIVES to see Katsuhide found** (the packet's decade
    answered to her face; may die at the seam, at peace). O-Hisa's
    ending noted at T4 too.
  - **The T2 collision beat AUTHORED** (the killed man's burial at
    Ekai's temple — a true entry in the book of false takings; the
    village's two stories about the MC meet aloud; Sayo's certainty
    deepens rather than breaks).
  All transcribed into 02-house · 03-tiers · 04-cast · t0 · t2 · t3 ·
  t4 · t5 · t6.

- **THE FALL — AUTHORED and LOCKED** (drafted in chat, all four forks
  taken as recommended): the great flood-works forced cheap by
  Tomita's predecessors' cut, signed past the warnings by the
  grandfather (both sins true at once) → Kuzuhara drowned → **the
  retribution fire** absorbed in silence (the firebreak; the arsonists
  never named) → **the blood-price quarrying** permitted wordlessly
  for decades (the breach, the pools, the otter den — and the
  compound's quarried walls retro-explained) → **Genemon's silver =
  secret compensation to the survivors** (Toku's packet and the silver
  now mirror exactly: the house pays anonymously for its living and
  its dead) → **Munemasa the witness-heir** (his failing maxims have
  their wound) → the famine-arrears kill (~1770) completes the fall.
  Written whole into `02-house.md` §The fall; pointers from t1
  (three-signs note → authored), t3 (buried-truth quest), 04-cast
  (Genemon + Munemasa portraits); README ledger updated.

## Next intended steps

- **The human reads the bible whole and blesses it → BIBLE DONE**
  (the remaining cast-portrait review rides that read; redlines
  welcome any time).
- At BIBLE DONE, workstream B opens: B0 frame ADR · B1 PRD §5
  rewrite + roadmap ripple · B2 engine ADRs (⬩Opus) · B3 T0 prose
  wave · B4 content migration (⬩Opus) · B5 salvage & closure.
