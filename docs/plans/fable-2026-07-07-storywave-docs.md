# Storywave — Plan A: the DOCS ripple (PRD · roadmap · ADRs · living docs)

**Status: 📋 PROPOSED — awaiting the human's read; executes in parallel
with fable-2026-07-07-storywave-game.md per the §S seam.**

**Confidence: ( 85% Opus, 15% Fable )** — the work is transcription and
targeted surgery against a signed canon (Opus-shaped); the one
taste-adjacent step (the PRD §5 per-tier summaries) is defused by the
assembly rule in "Who builds this" below.

This plan is the DOCS half of the ADR-150 build wave (workstream B of
the now-superseded `docs/plans/fable-2026-07-07-story-bible-finish.md`
— its B1 + the doc side of B5, re-planned as two parallel plans). It
updates every doc in the repo to the blessed story-bible canon: mints
the engine-ADR docket, rewrites PRD §5 to pointer-and-summary, ripples
§1–§4/§6–§7, reshapes the roadmap to seven tiers, and sweeps the small
living-doc residue. The GAME half (engine + prose + content migration)
is `docs/plans/fable-2026-07-07-storywave-game.md` (Plan B) — do not
read it for direction; the §S seam below is the only shared contract.

This plan is SELF-CONTAINED: the scout inventory it was built from
lived in git-ignored `tmp/` and may be gone — every path, line ref and
quoted stale line the executor needs is baked in below. All line refs
were verified 2026-07-07; treat them as anchors, locate by the quoted
text if a file has drifted.

## Who builds this — Fable or Opus?

**Opus-class executor, whole plan** (human directive, 2026-07-07: both
storywave plans route to Opus). The one Fable-shaped step is A1's PRD
§5 per-tier summary prose — taste-sensitive in principle. It is defused
by rule: **the summaries are ASSEMBLED from the bible's own sentences**
(condense `docs/story-bible/03-tiers.md`'s tier blocks; lift each
tier's *Theme:* and *Want:* lines verbatim; invent nothing). Where a
connective sentence is unavoidable, prefer the flattest possible
phrasing — the prose law's "when in doubt, cut" governs. Ready-to-paste
drafts are provided in A1 so the executor never authors fiction-voiced
text from scratch. If a summary genuinely cannot be assembled without
invention, stop and file an HR-item rather than inventing.

## Context a fresh executor needs (read in this order)

1. **ADR-150** — the charter (tail of
   [`docs/living/decisions.md`](../living/decisions.md), ~L2298):
   the bible is canon; B1 = PRD §5 rewrite + drift + roadmap ripple;
   the shipped T0 keeps playing the OLD canon until Plan B lands.
2. **The bible** (read-only canon —
   [`docs/story-bible/README.md`](../story-bible/README.md)): README
   status ledger → `00-kernel.md` → `01-laws.md` (§0.5 prose law,
   §0.9 constraints) → `02-house.md` → `03-tiers.md` (the seven
   ladders — the single most-cited source below) → `04-cast.md` (the
   name docket + speaker-label ladder) → `05-world.md` (six-season
   calendar, estate anatomy, reveal staging) → `tiers/t0.md` (full
   detail) → skim `tiers/t1..t6.md`.
3. **ADR-117** (decisions.md ~L1278) — the PRD's job is the forward
   spec of the unbuilt; pointer-and-summary style; demoted text
   archives VERBATIM to `project/archive/` with a forward pointer;
   §4 balance magnitudes are ripple-frozen (structure is not).
4. **ADR-132** (decisions.md ~L1726) — the balance-sim flow; cited by
   the coin-lanes docket ADR (its open problems resolve at sim time).
5. **ADR-089** (decisions.md ~L804) — reading-queue hygiene (implicit
   sign-off; agent owns cleanup).
6. **The PRD as it stands**: `docs/living/prd.md` + each
   `docs/living/prd/0N-*.md` immediately before editing it (PH2 —
   verify the quoted stale lines against the file).
7. **Commit law**:
   [`.claude/rules/commit-message-style.md`](../../.claude/rules/commit-message-style.md)
   (50/72, Conventional Commits, `Assisted-by:` trailer, never
   `Co-Authored-By:`, no emoji banners).
8. **The gen machinery** (read, don't guess):
   `src/scripts/gen-prd-regions.ts` (four regions, `spliceRegion`,
   `--check` is a verify gate) and `src/scripts/prd-drift.ts`
   (presence check over `docs/living/prd/*.md`; RETIRED-terms list —
   note: prd-drift.ts itself is **Plan B's file**, A never edits it).

## Conventions (executor law for every commit in this plan)

- **Pathspec-only staging** — the tree is SHARED with Plan B's
  executor. `git add <explicit paths>` only; never `git add -A`/`-u`;
  run `git diff --cached --name-only` immediately before EVERY commit
  and unstage anything you don't own (another agent's staged files can
  sweep in).
- **Path ownership per §S** — this plan touches ONLY: `docs/living/`
  (prd.md, prd/**, roadmap.md, decisions.md, fun-factor.md),
  `docs/guides/**` (story-stale lines only, and only at A5), root
  `README.md` (one banner line), `src/scripts/gen-prd-regions.ts`
  (region rebinds only), `project/archive/` (archived demotions),
  `project/human-in-the-loop/decisions.md` (HD-items),
  `project/journal/` (own entries), `project/status/project-status.md`
  (own workstream lines only).
- **Never edit `docs/story-bible/**`** — blessed canon (ADR-150). A
  canon bug found while rippling = an HD-item in
  `project/human-in-the-loop/decisions.md`, never a direct fix.
- **Never edit `*.gen.ts` or gen-region bytes by hand** — run
  `pnpm run gen:prd-regions` after any edit near the four marker pairs
  and let the script own the bytes. The four marker pairs
  (`t0-rung-titles`, `t0-deed-sources` in 03-unlock-ladder.md;
  `t0-weapon-roster`, `t0-bestiary` in 02-systems.md) MUST survive
  every rewrite — deleting/renaming a marker turns commit-time verify
  RED.
- **Docs-only commits**: `SKIP_CODE_VERIFY=1 git commit ...` (docs
  gates still run, ~1s). A0's decisions.md work and all PRD/roadmap
  edits qualify. Never `SKIP_VERIFY=1`; a push always runs the FULL
  roster — before pushing, run `pnpm run verify` yourself.
- **Journal + snapshot**: every session stages a `project/journal/`
  entry (pre-commit enforced); `project/status/project-status.md`
  updates only THIS workstream's lines (§S sync point 4).
- **Checkpoint ritual** at every milestone boundary: commit (pathspec)
  → journal → snapshot current → `git push origin main` → confirm
  clean. Don't fight Plan B's red: if the tree is red with the other
  executor's failure, leave your commit local and surface it — never
  skip-flag a red tree onto main.
- **Commit messages**: Conventional-Commits subject ≤50 chars, body
  wrapped at 72 leading with why, and the trailer
  `Assisted-by: <agent>:<actual model id>` (never hardcoded, never
  `Co-Authored-By:`, no emoji banners).
- **Markdown prose wraps at ~80 chars** (tables/URLs/CJK exempt).
- **New ADRs are append-only** at the tail of
  `docs/living/decisions.md`; old ADRs (ADR-048…ADR-069 spine etc.)
  are HISTORY — never edited, superseded by forward pointers only.
- **Mid-plan decision forks** (§S sync point 3): never mint an ad-hoc
  ADR beyond the A0 docket. A fork = an HD-item with a recommended
  default; proceed on the default (PH4 — surface, don't block); the
  human rules; A transcribes.

## §S · The seam contract (shared by both plans)

Two executors run in parallel in ONE shared tree. The tree is split by
path ownership; neither agent ever stages the other's paths.

**Plan A (DOCS) owns:**
- `docs/living/prd.md` + `docs/living/prd/**` (the §5 rewrite + all
  section ripples + gen-region rebinding)
- `docs/living/roadmap.md`
- `docs/living/decisions.md` — ALL ADR writes, both plans' (see sync
  point 1)
- `docs/living/fun-factor.md`, `docs/guides/**`, root `README.md`
  (story-stale lines only)
- `src/scripts/gen-prd-regions.ts` (region rebinds ONLY — the one src/
  file A may touch)

**Plan B (GAME) owns:**
- `src/**` (everything except `src/scripts/gen-prd-regions.ts`)
- `e2e/**`, `src/fixtures/**`
- `docs/content/**` (generated by gen scripts it runs)
- `CHANGELOG.md` + `package.json` (only at ship, via /ship)

**Both, read-only:** `docs/story-bible/**` is blessed canon (ADR-150).
Neither plan edits it; a needed canon change is an HD-item for the
human.

**Sync points (the only cross-plan dependencies):**
1. **A0 mints the engine-ADR docket first** (one sitting, transcription
   from the bible's locked shapes). Plan B never blocks on it: B's text
   cites ADRs by docket name ("the calendar ADR, docket #2"), and B's
   own milestones embed the full spec. If B starts before A0 lands,
   nothing breaks.
2. **PRD §5 carries a status banner** ("forward canon; the shipped game
   trails until the build wave lands") from the moment A rewrites it
   until B ships. A owns adding it; A's final milestone (post-B-ship)
   removes it and runs the closing `prd:drift`.
3. **Mid-build decisions:** neither executor writes a new ADR ad hoc.
   A decision fork = an HD-item in `project/human-in-the-loop/`
   (surfaced, default picked, never blocking) — the human rules, A
   transcribes.
4. **Journals/snapshot:** each executor keeps its own journal file;
   `project/status/project-status.md` updates only its own workstream
   lines; commits are pathspec-only (shared-tree law).

## Milestones

Sequence: A0 → A1 → A2 → A3 → A4, each a checkpoint; A5 is GATED on
Plan B shipping and may land days later. A0 must land before A2's §1.6
and A3 can be committed coherently (they cite docket ADR numbers), and
per §S sync point 1 it lands first anyway. Within A2, sub-steps commit
per-file or in small groups — many small commits.

---

### A0 · Mint the engine-ADR docket + file the open-question HD-items

**Goal:** transcribe the bible's locked build-cutting shapes into ten
real ADRs at the tail of `docs/living/decisions.md`, so Plan B's
milestones and this plan's PRD edits can cite real ADR numbers instead
of "the ADR that will exist." This is TRANSCRIPTION of signed canon
(ADR-150 is the charter; the bible sections cited in each draft are the
spec) — not new design. One sitting, one or two commits.

**Numbering:** the drafts below are written as **ADR-152…ADR-161** —
the next free numbers as of this plan's authoring (the tail of
decisions.md is ADR-151). **Check the tail at execution time**: if
other ADRs landed meanwhile, renumber sequentially from the actual next
free number and keep the docket-# cross-references intact (Plan B cites
by docket #, which is renumber-safe). Set every `created_date` to the
actual execution date (the drafts assume 2026-07-07).

**File:** `docs/living/decisions.md` — append at the tail, after
ADR-151, under one new grouping heading:

```markdown
## The storywave docket — the ADR-150 build wave's engine ADRs (2026-07-07)

Ten ADRs minted in one sitting per the storywave docs plan
(`docs/plans/fable-2026-07-07-storywave-docs.md` A0; parallel game
plan: `fable-2026-07-07-storywave-game.md`). Each TRANSCRIBES a locked
shape from the blessed story bible (ADR-150 is the charter); magnitudes
stay sim-owned (ADR-132). Cross-plan citations use the docket numbers
(#1–#10), which are stable even if ADR numbers shift.
```

Then the ten ADRs, ready to paste:

```markdown
### ADR-152 ✅ — Docket #1: seven tiers — TierId widens to 0..6

- **created_date:** 2026-07-07
- **Context:** ADR-150 locks SEVEN tiers T0–T6; the bible flags the
  enum change as build/PRD-cutting (`docs/story-bible/03-tiers.md`
  "The structure": "tier enum 0..5 → 0..6"). The built enum is 0..5
  (the ADR-048 spine). The tier→map ladder (`05-world.md`): Estate
  (household) → Estate (land) → Valley → Region → Castle Town →
  Domain (han) → Edo.
- **Decision:** `TierId` widens to **0..6**. Display names per the
  bible: T0 Estate — the household · T1 Estate — the land · T2 the
  Valley · T3 the Region · T4 the Castle Town · T5 the Domain · T6
  Edo. Each tier carries its own R0–R7 rung ladder — ONE unbroken
  career, not a fresh ladder per tier (the old R8–R15/V/G/O numbering
  is dead); in T6 the ladder's subject flips to the HOUSE's Edo
  standing, **H0→H7** (state shape may land with docket #9).
  Time-skips at tier seams; the game spans ~13 years (1780 → 1793+).
  Saves: **NO migration** — clean break per docket #10 (ADR-161).
- **Consequences:** Plan B reworks `toTier()`/fixtures/harness docs;
  PRD §6's `tier: TierId // 0..5` line carries a forward-spec banner
  until the build lands; roadmap enum refs update at A3. 🔁 Executes
  ADR-150's charter line (its "+ save migration" phrase is refined by
  docket #10).

### ADR-153 ✅ — Docket #2: the six-season manual container calendar

- **created_date:** 2026-07-07
- **Context:** the bible locks the calendar as build-cutting
  (`docs/story-bible/05-world.md` "Global rules", first bullet;
  `tiers/t0.md` "The calendar bundle (locked)"). The built game runs a
  28-day derived 4-season clock (`season(day) = floor(day/28) mod 4`,
  derived-never-stored — PRD §6).
- **Decision:** the year is SIX rotating seasons — **Winter → New Year
  → Spring → Summer → Bon → Autumn** — each a CONTAINER filled at the
  player's pace. Game time displays only the DAY OF THE WEEK (the
  month/year counter is hidden). **Season change is a MANUAL action
  with a per-season VN overlay.** Season-exit events exist (the nengu
  is Autumn's exit gate — an authored scene at the board); **the
  seasonal judge rides every season exit**. Seasons UNLOCK at T0-R2
  (R0–R1 show the day of the week only — "a man counts days again when
  he has a future"). Nodes carry per-season flavor; season-specific
  actions, enemies, content and STALL STOCK exist (Yohei's stall
  restocks per season); unique characters can appear in a specific
  season (Iori lodges in New Year and Bon). Time-skips at tier seams
  ride the same wheel. Season becomes STORED, advanced state — no
  longer derived from the day counter.
- **Consequences:** pure-core calendar rework + the `seasonal` RNG
  stream re-anchored (Plan B); the sim/pacing bands re-derive under
  the ADR-132 flow; PRD §2.2 and §6's calendar lines become forward
  spec with banners until the build lands.

### ADR-154 ✅ — Docket #3: inside/outside rung alternation + the T2/T3 hard lock

- **created_date:** 2026-07-07
- **Context:** `docs/story-bible/03-tiers.md` "Rungs alternate"
  (flagged "Mechanics ADR at build time").
- **Decision:** every other rung the MC is INSIDE the estate, every
  other OUTSIDE. In **T2 and T3 the alternation is a HARD LOCK**: an
  inside rung locks the world out (the estate map only — forced estate
  actions, skills, levelling); an outside rung locks the estate closed
  until the objective is done. **T4 drops the gimmick** — free travel
  everywhere from then on. T2-R5 is the one authored crossing (the
  bandits hit the works — the outside forcing itself in IS the beat;
  `tiers/t2.md`). In T0/T1 the alternation is narrative rhythm, not a
  mechanical lock.
- **Consequences:** a map/travel gating engine lands with the T2
  build; no T0/T1 engine work. PRD §1.5.1/§3 re-anchor to it at A2.

### ADR-155 ✅ — Docket #4: two body economies + defeat-as-sickroom

- **created_date:** 2026-07-07
- **Context:** `docs/story-bible/tiers/t0.md` "Systems canon
  (game-wide; mechanics ADR at build)".
- **Decision:** **one body, two meters, coupled one way**: labour
  spends the WORK/body unit and NEVER costs HP; combat risks HP; being
  at low HP impairs work capacity. **Defeat is never game-over**: the
  MC is carried to Sōan's sickroom and loses days (wages, season
  time), and Sōan's closed ledger grows. Rider (folded in per the
  scout): recovery flavor differs by home — the woodshed vs the
  offered room (`tiers/t1.md` side-beat 5); the magnitude is sim-owned.
- **Consequences:** core stat-model change (Plan B); all magnitudes
  ride ADR-132 (sim verdict + committed before/after); PRD §2 gains a
  forward-spec subsection pointing here (A2).

### ADR-156 ✅ — Docket #5: the night-round mini-dungeon runner

- **created_date:** 2026-07-07
- **Context:** `docs/story-bible/tiers/t0.md` "The Night rounds" +
  "Combat structure & enemies"; ADR-150 charters it.
- **Decision:** no day/night map state — a **"begin the night round"
  action** (its post at the gate) puts the MC on rails through several
  zones in their night state; clear each of enemies to finish the
  round, or fall and wake in Sōan's sickroom (docket #4). The FIRST
  round is a quest; after that it is repeatable. Escalation across T0:
  rats in the store → a marten → the R3 WOLF as the arc's climax.
  Kihei designs the round; from R3 it is his and the MC's alone. The
  round GROWS with the estate in later tiers (`tiers/t1.md`).
- **Consequences:** a new repeatable activity runner in the pure core
  (Plan B); fixtures + DEV scenario coverage ride the build.

### ADR-157 ✅ — Docket #6: the speaker-label ladder + the map re-label reveal

- **created_date:** 2026-07-07
- **Context:** kernel #6 (UI surfaces as story state) made concrete:
  `docs/story-bible/04-cast.md` "The speaker-label ladder";
  `tiers/t2.md` "The reveal, staged"; `05-world.md` "The reveal
  staging". ADR-150 charters both surfaces.
- **Decision:** **(1) The speaker label is story state:** `You:` for
  the cold open's first lines → a small FORCED beat where he asks his
  own name and Sōan answers that he has none → the label flips to
  `Nameless:` on screen, witnessed → `Gonbei:` takes over at T0-R7 →
  he KNOWS his birth name (Tahei) at T3 → what the register finally
  says is his choice at the end (the ink thread). **(2) The map
  re-label is the T2 reveal's delivery:** at the third signal's scene
  end the map redraws its two labels — *Main house → Guest house; the
  ruin → the Main house* — one log line in the day-book's voice, no
  ceremony.
- **Consequences:** label state lives in the core and feeds log/VN
  rendering (Plan B, with the T0 rebuild); the map re-label mechanism
  lands with the T2 build but its data shape should land now so the
  sheet-map work (ADR-151) can carry it. TST2 governs both (never
  yank a watched surface).

### ADR-158 ✅ — Docket #7: the economy — two coin lanes, three ledgers, the debt staged

- **created_date:** 2026-07-07
- **Context:** `docs/story-bible/tiers/t0.md` "Economics
  (human-locked shape; all magnitudes sim-owned)". The human flagged
  two open problems in the coin-lane shape at the bible sitting.
- **Decision (the locked shape):** **(1) Three nested ledgers** — the
  MC's (meals → rice → a day-wage in mon → trusted with the house's
  purse), the household's day-book, and the DEBT (the standing
  antagonist; principal untouchable in T0). **(2) Filling the barn is
  the HOUSE's economy** — barn-filling actions raise house stores and
  flavor, never player loot. **(3) The KIND lane (unbounded):** labour
  pays in rice and goods; combat drops materials, never coin;
  consumables run on kind. **(4) The MON lane (bounded):** the
  day-wage is FIXED PER GAME-DAY worked, not per action; the only
  other mon source is selling on Yohei's market days (his coin finite
  per visit); durables and the stall's season-scarce stock run on mon;
  recurring sinks (dog rice, offerings, thread, sickroom bills).
  **(5) The debt's three-stage introduction:** R1 named sideways in
  Genemon's terms → felt in scenes all T0 (the lease day; the nengu),
  never numbered → T1's tally-keeper rung unlocks the debt panel and
  the number is finally seen, a story beat.
- **Decision (the two flagged open problems — resolved-at-sim-time,
  human-ruled 2026-07-07 at the storywave re-plan):** (a) kind-overflow
  sinks/caps and (b) the day-wage collection moment vs auto-actions
  are NOT blockers on this ADR — they resolve **at sim time under the
  ADR-132 flow** (Plan B's economy build runs the persona-sim, picks
  the mechanism the machine verdict supports, and commits the
  before/after pacing diff as the evidence). The lane SHAPE above is
  locked; the two mechanisms and all magnitudes are the sim's.
- **Consequences:** the T0 economy re-cores at Plan B's rebuild;
  `pnpm run verify:balance` + `balance:report` gate every magnitude
  change; PRD §4's spine moves only with this ADR's build (ADR-117
  interim-freeze holds meanwhile).

### ADR-159 ✅ — Docket #8: the standing/deeds tier-up engine

- **created_date:** 2026-07-07
- **Context:** `docs/story-bible/tiers/t0.md` "The tier-up (locked)".
  Collides with the PRD §1.6 four-pillar reveal ramp, whose fate
  ADR-150 did not rule (HD-25 carries the ruling; this ADR transcribes
  the bible engine either way).
- **Decision:** the house-standing grind opens at R7: the same verbs
  start banking **ESTATE-DEEDS into the house's standing** —
  reclamation bearing fruit, repairs holding, the granary past
  this-winter's need: surplus and order, written down. Standing is the
  house's own verdict on itself. **Graded at every season exit**, one
  plain line in the day-book's voice (docket #2's seasonal judge).
  **Top grade unlocks the manual, ceremonial ASCEND** (New-Year-themed
  if timed there). What T0→T1 buys: influence over its own land — the
  right to try again.
- **Consequences:** the ascension gate reworks at Plan B's rebuild;
  PRD §1.6 rewrites to this engine at A2 (default per HD-25: the
  four-pillar ramp is SUPERSEDED as tier-up mechanics; if the human
  overrides, pillars survive as thematic framing only and this ADR
  still governs the mechanics).

### ADR-160 ✅ — Docket #9: parallel reputation tracks (village · origin · the T6 flip)

- **created_date:** 2026-07-07
- **Context:** `docs/story-bible/03-tiers.md` "Parallel reputation
  tracks" + `05-world.md` "Global rules"; ADR-150 charters it.
- **Decision:** the VILLAGE (from T2) and the ORIGIN TOWN (T3) carry
  their own reputation tracks, **completely distinct from house rungs
  — never converting 1:1**. The village track opens at zero
  (stranger's surcharge, watched hands); on the origin track he is a
  missing man's rumor and house standing buys nothing — until he
  knocks. In **T6 the ladder's subject changes: the rungs become the
  HOUSE's Edo standing (H0→H7)**, not the man's — kernel #4 completed
  in mechanics.
- **Consequences:** rep-track state lands with the T2 build (the
  state SHAPE may land earlier with docket #1's enum work); PRD §2.15
  re-sources to the bible at A2.

### ADR-161 ✅ — Docket #10: clean-break saves — old saves retire with a courteous notice (🔁 refines ADR-150)

- **created_date:** 2026-07-07
- **Context:** ADR-150's structural-canon line reads "tier enum 0..5 →
  0..6 **+ save migration**", and §0.9 constraint 3 names the
  save-migration chain. The storywave re-plan surfaced the real cost:
  the reboot replaces the story, content registries, calendar, economy
  and tier skeleton at once — a migration would map old saves onto a
  world that no longer exists.
- **Options:** (a) full save migration (ADR-150's original line);
  (b) clean break — old saves retire with an in-game notice;
  (c) a frozen legacy mode for old saves.
- **Decision (human, 2026-07-07):** **(b)** — old-canon saves are NOT
  migrated. On loading a pre-reboot save, the game shows a **courteous
  in-game notice** (composed, TST2 — no crash, no silent wipe: the
  world was re-founded, a fresh start is offered) and retires the old
  save. No migration code is written for the reboot boundary. 🔁 This
  REFINES ADR-150 — its "+ save migration" phrase is superseded (the
  newest human steer is canon, ADR-022). The save-migration CHAIN
  itself survives going forward: post-reboot saves migrate normally;
  the break is one-time.
- **Consequences:** Plan B drops all reboot-boundary migration work
  and ships the notice UI instead; docket #1 inherits this; §0.9's
  "save-migration chain" constraint reads as post-reboot law.
```

**Also in A0 — file the open-question HD-items.** Append the five
items from "Open questions for the human" (bottom of this plan) to
`project/human-in-the-loop/decisions.md` in its `### HD-n 🔲` format
(next free id at authoring time: **HD-25** — verify against the file
and `archive.md`, ids are never reused; if the ids shift, sweep this
plan's HD-25…HD-29 references to match). Copy each question's
options + recommendation verbatim from this plan's bottom section.
Proceed on the recommended defaults immediately (PH4) — EXCEPT HD-28,
which by design waits for the human (it is the seam-exception ask);
the defaults are baked into A1–A4 below.

**DoD:**
- Ten ADRs at the decisions.md tail, sequentially numbered, each with
  created_date/Context/Decision/Consequences and bible file refs.
- The docket-# → ADR-number mapping is stated in the grouping header's
  intro (so Plan B's "docket #2" citations resolve).
- Five HD-items filed with recommended defaults.
- Journal entry; snapshot's workstream-A line updated.

**Verification:** docs-only commit (`SKIP_CODE_VERIFY=1`, pathspec:
`docs/living/decisions.md project/human-in-the-loop/decisions.md
project/journal/<entry> project/status/project-status.md`). The
docs-lane gates (links, snapshot line-cap, journal) prove it. Then the
checkpoint ritual: push `origin/main`, confirm clean. Substantively:
re-read each pasted ADR against its cited bible section (PH2) before
committing — the drafts above were derived from the bible on
2026-07-07; the bible wins if they disagree.

---

### A1 · PRD §5 → pointer-and-summary (the ADR-117-style rewrite)

**Goal:** `docs/living/prd/05-narrative.md` (1203 lines of old-canon
narrative) becomes a short pointer-and-summary section per ADR-150
("The PRD §5 becomes a pointer-and-summary at B1 (ADR-117 style)").
The bible is the canon home; §5 keeps only: the status banner, a
how-to-read note, the premise paragraph, per-tier summaries with
pointers, the ink-thread/reveal ladder, and the built-game
compatibility (rename) table that keeps `prd:drift` green until Plan
B's renames land.

**Steps, in order:**

1. **Archive the old §5 verbatim** (ADR-117 rule 3): copy
   `docs/living/prd/05-narrative.md` to
   `project/archive/2026-07-07-prd-05-narrative-old-canon.md`, then
   prepend (to the archive copy only) this header:

   ```markdown
   > **ARCHIVED 2026-07-07 (storywave B1, ADR-150/ADR-117).** This is
   > the OLD-canon PRD §5, demoted verbatim when the story bible
   > (`docs/story-bible/`) became the single home of story canon and
   > §5 became a pointer-and-summary. The live section:
   > `docs/living/prd/05-narrative.md`. Note: the BUILT game played
   > THIS canon until the storywave game plan's B3/B4 landed.

   ```

   Verify the copy is byte-identical below the header (text-mode diff
   vs `HEAD`, NUL-free — AC-15).

2. **Replace the live file's content** with the skeleton below. The
   per-tier paragraphs are assembled from `03-tiers.md` — check each
   against the bible before committing; the bible wins. Ready-to-paste
   draft (adjust the heading depth/`Part of` line to match the other
   `prd/0N-*.md` files' shared preamble style — read one first):

   ```markdown
   # §5 · Narrative & world — pointer-and-summary

   > Part of [the PRD](../prd.md). **The story bible
   > ([`docs/story-bible/`](../../story-bible/README.md)) is the
   > single home of story canon (ADR-150).** This section is a
   > pointer-and-summary (ADR-117 style); it summarizes, the bible
   > governs. The demoted V2 narrative text is archived verbatim at
   > [`project/archive/2026-07-07-prd-05-narrative-old-canon.md`](../../../project/archive/2026-07-07-prd-05-narrative-old-canon.md).

   > **STATUS — FORWARD CANON; THE SHIPPED GAME TRAILS.** This section
   > specs the story the game is being rebuilt toward. The BUILT game
   > still plays the OLD canon (the Shigemasa/Tokubei-era text and
   > content — see §5.6) until the storywave game plan's prose wave
   > and content migration land. This banner is removed at the docs
   > plan's closure milestone (A5), after the game ships.

   ## 5.1 · The premise

   1780, rural Japan. A man is pulled half-drowned from the estate's
   weir with no name he can give — the cold open's speaker label
   flips from `You:` to `Nameless:`, witnessed. He is fed once out of
   form and kept by arithmetic, and the declining Kurosawa house
   learns his hands before his face. The truth (the player's, long
   before his): he is **Tahei**, a kaidō porter a landslide took into
   the river — no flight, no guilt, no grave; his family, a region
   away, keeps his register entry open by refusal. The village below
   has its own vanished child — **Tama** — and at T2 a villager's
   misreading ignites that thread; it resolves on the T3 spine (Tama
   was a girl who ran — Otsuru, found grown). Full canon:
   [`00-kernel.md`](../../story-bible/00-kernel.md) ·
   [`02-house.md`](../../story-bible/02-house.md) ·
   [`04-cast.md`](../../story-bible/04-cast.md).

   ## 5.2 · The seven tiers

   One unbroken career across SEVEN tiers (T0–T6), R0–R7 per tier —
   *hand → named hand → registered man → officer → expeditionary →
   under-steward → steward → the house itself* — with inside/outside
   rung alternation (hard-locked in T2/T3, dropped at T4; docket #3),
   time-skips at tier seams (~13 years, 1780 → 1793+), and the
   guest-house/ruin reveal under all of it. Ladders + full detail:
   [`03-tiers.md`](../../story-bible/03-tiers.md) + the per-tier
   sheets in [`tiers/`](../../story-bible/tiers/).

   - **T0 · The Estate — the household (1780)** — a body at the gate
     to the house's named hand: Genemon writes the use-name GONBEI in
     the day-book at R7; the lord is never met. *Theme: from weather
     to tool — the house learns his hands, not his face.* *Want: to
     eat at the board, not the threshold.* Sheet:
     [`tiers/t0.md`](../../story-bible/tiers/t0.md) (full detail).
   - **T1 · The Estate — the land & "the main house" (1781–82)** —
     the access arc: terraces, the kura key, the wings opening one at
     a time; ends in the restored shoin — Munemasa's only scene, the
     register's last entry, the lord's death at the seam. *Theme:
     from tool to man of the house — literally.* *Want: a door of his
     own.* Sheet: [`tiers/t1.md`](../../story-bible/tiers/t1.md)
     (full detail).
   - **T2 · The Valley — lordless (1784)** — a regency's messenger to
     a watching village; THE REVEAL lands early (three signals; the
     map re-labels itself — docket #6) and the true restoration
     begins; the village reputation track opens at zero; the bandit
     camp is the valley's trouble; the first MAN he ever fights is a
     staged threshold beat. *Theme: carrying a diminished name in
     public while the house grows bones again.* *Want: to be greeted
     at the well by his own name.* Sheet:
     [`tiers/t2.md`](../../story-bible/tiers/t2.md) (half detail).
   - **T3 · The Region — the expeditionary & the origin (1786)** —
     road-guard to the house's reach made flesh; the ORIGIN mainline
     (Tahei; the Tama truth resolves — Otsuru found; the family
     reunion an OPTIONAL side-track at Sawatari-juku); the ruin's
     inner domain and the sealed storerooms (the buried truth) come
     within reach. *Theme: where nobody knows the house, he IS the
     house.* *Want: to stand at the holding's gate.* Sheet:
     [`tiers/t3.md`](../../story-bible/tiers/t3.md) (half detail).
   - **T4 · The Castle Town — the campaign (1788–89)** — the tier
     with a FACE for an enemy: the martial lord whose hands are in
     both old wounds; Katsuhide found and renouncing in writing;
     Shinnosuke named heir; the campaign ends with the house TAKING
     the castle town. The hard lock drops — free travel from here.
     Sheet: [`tiers/t4.md`](../../story-bible/tiers/t4.md) (quarter
     detail).
   - **T5 · The Domain — the inherited debt (1790–92)** — caretaker
     administration of a broken domain; THE RUNG-UP INVERTS: each
     rung an audience-day, the domain summoned to HIM; beneath it
     Genemon's failing, the handover, the chair. Ends at THE STEWARD.
     Sheet: [`tiers/t5.md`](../../story-bible/tiers/t5.md) (fifth
     detail).
   - **T6 · Edo — the house's ladder (1793+)** — personal rungs
     retire; the rungs are the HOUSE's Edo standing, **H0→H7**;
     Shinnosuke is lord; deliberately RESERVED (the
     game-within-a-game, the no-prestige pseudo-prestige act). Sheet:
     [`tiers/t6.md`](../../story-bible/tiers/t6.md) (reserved).

   ## 5.3 · The ink thread & the reveal ladder

   The spine in objects: the use-name Gonbei in the day-book (T0) →
   the house register, Munemasa's last entry (T1) → the birth name
   Tahei known, the origin register confirmed-not-struck (T3) → the
   renunciation witnessed (T4) → the stewardship + Genemon's book
   (T5) → what the KUROSAWA register finally says is his choice (T6).
   Two registers, one thread —
   [`03-tiers.md` "The ink thread"](../../story-bible/03-tiers.md).
   The world's own reveal (guest house → ruin → restoration) is the
   estate anatomy: [`05-world.md`](../../story-bible/05-world.md).

   ## 5.4 · The laws that bind written fiction

   The prose law and register rules (restraint; one voice, one shape;
   rewards are things; the dream cadence; vague-but-parseable; the
   log/VN split; a decide is never a morality dial) live in
   [`01-laws.md` §0.5](../../story-bible/01-laws.md) and bind every
   fiction-voiced line the game ships. Shipped fiction rides ADR-139
   three-take diverges + the FB-10 taste scorecard (§0.9).

   ## 5.5 · What §5 no longer does

   Beat-level scene specs, cast entries, zone rosters and dialogue
   direction live in the bible ONLY — do not re-spec them here. A
   story change is a bible change (human-gated; ADR-150), and this
   section follows.

   ## 5.6 · Built-game compatibility (the rename ledger)

   The BUILT game ships the old canon until the storywave game plan
   lands. This table documents each built label's bible successor —
   one line per label keeps the `prd:drift` presence check green and
   pre-writes the RETIRED-terms entries the game plan adds at its
   rename commits. (Rows are extended from the `pnpm run prd:drift`
   report — every built label the report flags as missing from the
   PRD gets a row here.)

   | Built label (shipping) | Bible successor | Changes at |
   |---|---|---|
   | Lord Shigemasa | Lord **Munemasa** (dies at the T1 seam) | game plan B4 |
   | Tokubei | **Yohei** (the pedlar) | game plan B4 |
   | Chiyo | recast per `04-cast.md` (T0 household) | game plan B3/B4 |
   | Rokusuke | kept (Rokusuke-class hands) | — |
   | Kanta | **Kenta** (origin friend) | game plan B4 |
   | Asagiri (the village) | the village is UNNAMED in the bible (HD-27) | game plan B4 |
   | Akagi | CUT — the T4 enemy is Lord Tomita | game plan B4 |
   ```

3. **Run the checks and reconcile:**
   - `pnpm run prd:drift` — the presence check reads all of
     `docs/living/prd/*.md`. Every built label it now flags (names,
     rank titles, quest titles, map nodes, skills, stances that only
     appeared in the old §5 prose) gets a row in the §5.6 table (or
     already appears in another section / a gen-region — the
     `t0-rung-titles` region keeps all rank titles present, for
     instance). Iterate until the report is clean or every remaining
     flag is explained in the commit body.
   - `pnpm run gen:prd-regions -- --check` (or the package.json
     equivalent — read the script) — §5 has no markers, so this
     proves you didn't disturb the four pairs elsewhere.
   - The repo link gate (part of docs-lane verify) — the new §5 is
     link-dense; fix any red.

4. **The bible README banner** (its L8–10: "Until the reboot's build
   wave lands, the BUILT game's story is described by the PRD §5 +
   the narrative sources; this doc-set is the forward canon") goes
   stale the moment §5 rewrites — but `docs/story-bible/**` is
   read-only under §S. **Do NOT edit it.** HD-28 (bottom of this
   plan) carries the one-sentence replacement for the human to bless;
   apply it only after the human rules (it is a two-minute follow-up,
   not a blocker).

**DoD:** old §5 archived verbatim + live §5 is the pointer-and-summary
above + `prd:drift` clean (or every flag explained) + links green +
the status banner present. Commit (docs-only, pathspec:
`docs/living/prd/05-narrative.md project/archive/2026-07-07-prd-05-narrative-old-canon.md`
+ journal/snapshot), checkpoint ritual.

---

### A2 · The targeted PRD ripples (§ index, §1, §2, §3, §4, §6, §7)

**Goal:** every other PRD section stops contradicting the bible.
Forward-spec sections get banners (the built game trails); the four
gen-region marker pairs survive byte-intact; `prd:drift` stays green
via §5.6. Commit per sub-step (or pairs of sub-steps) — each commit
runs `pnpm run gen:prd-regions -- --check` + the docs gates. All line
refs verified 2026-07-07 — locate by quoted text if drifted.

**Shared banner text** for forward-spec islands (use verbatim, filling
the docket ref):

```markdown
> **FORWARD SPEC (storywave).** This subsection specs the bible's
> design per docket #N (ADR-15x). The BUILT game still runs the old
> mechanics until that ADR's build lands (the storywave game plan).
> Banner removed at the docs plan's A5 closure.
```

**A2.1 · `docs/living/prd.md` (the index/preamble):**
- L3–11 status block ("PRD V2.3 — the 6-tier reshape"): append a V3
  status line — the 2026-07-07 story reboot; ADR-150; the bible is
  the story-canon home; §5 is pointer-and-summary; seven tiers.
- L44: "full **T0–T2**, no pre-planned descope" — reconcile with §7's
  T0–T3 per HD-26's default: v1 = **full T0–T3** (write T0–T3 here).
- L57: "forward spec of the UNBUILT (T1–T5, endgame)" → "(T1–T6,
  endgame)".
- L76 (ToC row for §5): retitle to "Narrative & world —
  pointer-and-summary (the bible is canon)".

**A2.2 · `docs/living/prd/01-vision.md` (1082 lines — the heavy one):**
- §1.2 (L54–56): "across **six influence tiers** (T0 estate-*tutorial*
  → T1 estate-*full* → T2 village → T3 region → T4 castle-town → T5
  Edo)" → "across **seven influence tiers** (T0 estate-household → T1
  estate-land → T2 valley → T3 region → T4 castle town → T5 domain →
  T6 Edo)".
- §1.3 premise (L128–133): the old framing ("The grieving village
  below is certain he is Tama, the child spirited away ten years ago"
  + half-drowned-nameless) rewrites to the bible premise — reuse
  §5.1's premise paragraph (A1) condensed to this section's length:
  Tahei · kaidō porter · landslide · family ALIVE, register kept open
  · Tama is the VILLAGE's thread, ignited at T2 by Sayo's misreading,
  resolved as Otsuru at T3. L144 ("a family a valley away who grieved
  the protagonist himself as dead") — keep the warmth, fix the fact:
  the family REFUSES the grief; the register entry is kept open.
- §1.4 (L151, protagonist contract): survives; sync name (birth name
  Tahei; use-name Gonbei at T0-R7) and drop any age detail that
  contradicts ~13 years 1780→1793+.
- §1.5.1 (L210): "a fresh rank ladder PER TIER" → one unbroken career
  (03-tiers.md "The structure"): R0–R7 per tier, the alternation +
  T2/T3 hard lock (docket #3), T6's H0–H7 flip (docket #9). Cite the
  docket ADRs by real number.
- §1.5.2 (L341): "VILLAGE of Asagiri" → the village is unnamed
  (HD-27 default): "the village" / "the valley's village" throughout
  this subsection. Keep one "Asagiri" mention ONLY in §5.6's rename
  ledger (A1 already placed it).
- §1.5.3 (L364, + L377, L780–790, L827): origin cast sync — mother
  Oyuki → **O-Nobu**, sister Okimi → **Suzu**, friend Kanta →
  **Kenta**, employer Denbei → toiya **Zenbei**, father **Jinpachi**
  kept; the sweetheart (Osen/Ohana) is NOT in the bible cast — cut
  her (the bible's family is father, mother, sibling; `04-cast.md`
  governs). "Opens at T3" survives.
- §1.6 (L459) + §1.6.3 (L550) — "the four pillars & the six tiers":
  rewrite the tier-up engine to the bible's standing/deeds model
  (docket #8 / ADR-159): estate-deeds bank into house standing, graded
  at season exits, top grade unlocks the ceremonial ascend. Per
  HD-25's default the pillar REVEAL RAMP is superseded as mechanics;
  if any pillar prose survives, it survives as thematic framing
  explicitly labeled as such. Add a one-line note: "(HD-25 default —
  pillars superseded as mechanics; awaiting the human's confirmation)"
  and remove the note when the HD closes.
- §1.7/§1.7.1 (L670/L699, world & areas): replace with the bible zone
  ladders — the tier→map ladder + estate anatomy (guest house layer,
  the ruin layer, the T2 reveal, the function migration) from
  `05-world.md`, and the per-tier zone lists from `03-tiers.md`
  (summarize; point at the tier sheets for node detail). L710
  porter-guild row: Kanta → Kenta.
- §1.8 (L731, the full cast table): rewrite to a SHORT table of
  pointers into `docs/story-bible/04-cast.md` (per-tier cast lives
  there). Known-stale rows being removed: L741 Lord Shigemasa, L760
  Tokubei (→Yohei), L764–790 village/origin casts (the bible's are
  Sayo/Mohei/Ekai etc.; Magobei/Yagōemon/Onatsu/Gonta/Obaa
  Kuni/Tokuemon/Sukezō are old-canon only), L792–804
  Tomita/Akagi/Yasubei/Hanzaki (the new enemy is Lord TOMITA, a
  martial castle-town lord; **Akagi does not exist in the bible**).
  Built-game labels among the removed rows must have §5.6 rows
  (check `prd:drift` after this sub-step).
- §1.9 (L805, dreams & the ink thread): the dream rule → bible law
  (`01-laws.md` §0.5 rule 4: every second sleep-ending promotion from
  T1 on; the first dream is T0-R7; escalates, never verbatim). The
  ink thread → the two-register version (03-tiers.md "The ink
  thread"). L862 per-tier side-quest list: re-derive from the tier
  sheets (Otsuru at T3 Yanagi-watari, the Sawatari-juku reunion
  side-track, the T0 locked side-beat roster) — the old G6/Jinpachi
  reunions/Hanzaki list is dead.
- §1.11 (L897, antagonists & endgame): the rival-house G5/G7 climax
  is old canon. New ladder: T0–T1 the DEBT is the standing antagonist
  → T4 the enemy lord (Tomita) and the campaign that takes the castle
  town → T5 the inherited domain-ruin as the debt at scale → T6 the
  house ladder. Kernel #5's ceiling survives (the daimyō/shogun are
  never scenes). L930/L949/L955 Shigemasa + T5-Edo-climax lines: fix
  with the rewrite.
- §1.12 (L964, reveal pacing): re-anchor six-tier refs to seven tiers
  + the T2 guest-house/ruin reveal as the structural mid-game reveal.

**A2.3 · `docs/living/prd/02-systems.md` (1576 lines):**
- §2.2 (L97–139, the calendar): rewrite from the 28-day derived
  4-season clock (`spring|summer|autumn|winter`) to the six-season
  manual container calendar per docket #2 (ADR-153) — transcribe the
  ADR's decision block; add the shared FORWARD SPEC banner ("the
  BUILT game still runs the 28-day clock").
- **Gen-regions:** `t0-bestiary` markers (L611/L628) and
  `t0-weapon-roster` markers (L704/L717) stay byte-intact. Do not
  restructure across them. (The bestiary region's prose note "road
  bandit canon-held for T2 (§5)" stays TRUE — first man fought = the
  T2-R5 bandit.)
- L993: origin cast names (Denbei/Kanta/Osen) → Zenbei/Kenta/(cut).
- L1159 + L1353: "T5 Edo" rows/climax → T6 Edo; insert the T5 Domain
  tier where the ladder is enumerated.
- L1491 (the real-name denylist line): "Munenori/Jūbei/Ranpo … →
  Shigemasa/Kihei/Sōan" → "… → Munemasa/Kihei/Sōan". (Safe now
  because §5.6 keeps a "Shigemasa" mention for the drift presence
  check; the `prd-drift.ts` successor-chain re-point is Plan B's, at
  its rename commits.)
- §2.15 (rep web): survives in spirit; re-source to docket #9
  (ADR-160) / 03-tiers.md "Parallel reputation tracks" (village T2 ·
  origin T3 · never 1:1 · the T6 H0–H7 flip).
- **New forward-spec subsections** (short — a paragraph + docket ADR
  pointer + the shared banner each; place them where §2's flow fits,
  e.g. after the combat/economy subsections): the two body economies
  + sickroom (docket #4/ADR-155) · the night-round runner (docket
  #5/ADR-156) · the speaker-label ladder + map re-label (docket
  #6/ADR-157) · the two coin lanes (docket #7/ADR-158). Do NOT
  re-spec — a paragraph naming the shape, the ADR carries it.
- After this sub-step: `pnpm run gen:prd-regions` (regen, in case
  whitespace shifted) + `-- --check`.

**A2.4 · `docs/living/prd/03-unlock-ladder.md` (989 lines):**
- **Gen-regions:** `t0-rung-titles` markers (L286/L306) and
  `t0-deed-sources` markers (L341/L357) stay byte-intact — they
  transclude the BUILT registries and must keep doing so until Plan
  B's renames regen them.
- §3.2 (L256, the T0 narrative ladder table): replace with the bible
  T0 ladder — ready to paste (from `tiers/t0.md`, condensed):

  ```markdown
  | Rung | Title | The beat |
  |---|---|---|
  | R0 | The man from the weir | Cold open; the speaker flip (`You:` → `Nameless:`), witnessed |
  | R1 | The day-hand | Kept by arithmetic; Genemon states terms at the board |
  | R2 | The yard-hand | The silent rung — a task simply not taken back; seasons unlock |
  | R3 | The grain-watch | The wolf — survived, not won; ribs cracked |
  | R4 | The pupil | He confesses, then BEGS Kihei for drills; the creed, once |
  | R5 | The accused | The Count night — the day-book clears him; no apology |
  | R6 | The trusted hand | The first coin errand, counted back to the mon |
  | R7 | The named hand | Genemon writes GONBEI; sleep; the first dream |
  ```

- L205 + §3.0.2 (L176): "The R7 Shigemasa beat (devoted/ambitious/
  humble)" — dead: the new T0-R7 is the use-name beat; the lord is
  never met in T0. Rewrite to the R7 beat above. The ADR-125
  capstone-branch PATTERN's fate is HD-29 (see the parked-plan open
  question, default: superseded for T0; the pattern itself is not
  revoked — a future tier may readopt it).
- L402: "the lord names the bailiff" R6→R7 row — dead; fix per the
  table above.
- §3.3.5 (L445): "T1 — R8 → R15 (a FRESH ladder)" → T1 is R0–R7
  (03-tiers.md T1): R0 field-hand · R1 terrace-hand · R2 woodcutter ·
  R3 kura-warden · R4 works-hand · R5 tally-keeper (the debt panel) ·
  R6 foreman · R7 the registered man (the shoin; Munemasa's last
  entry). Point at `tiers/t1.md`. **The R8–R15 numbering is dead
  everywhere.**
- §3.4 (L503) + §3.4.1 (L579, incl. the Shigemasa gate table
  L584–597): the T2 V0–V7 ladder → the bible T2 R0–R7 (messenger →
  works-hand of the outer court → dues-carrier → steward's shadow →
  market-man → works-master → the house's voice → yard-officer), with
  the ⌂/⛩ alternation markers and the hard lock noted (docket #3).
  Point at `tiers/t2.md`.
- §3.6 (L681) + §3.6.1 (L780–801) + §3.6.2 (L813): the T3 G-ladder +
  O0–O5 origin track (Kanta/Yasubei/Hanzaki/Gennai/Sōzaemon/Shigemasa
  throughout) → the bible T3 R0–R7 (road-guard · quartermaster ·
  caravan-master · keeper of the far-ledger · rumor-follower ·
  inner-wing warden · expedition-leader · the house's factor) + the
  OPTIONAL Sawatari-juku reunion side-track (not a parallel rung
  track — the origin is a reputation track, docket #9). Point at
  `tiers/t3.md`.
- §3.7 (L853) + L849 + §3.7.2 (L922): "T4 / T5 — the forward
  frontiers" → three stubs: T4 (R0–R7, the campaign — envoy →
  under-steward; hard lock drops) · **T5 the Domain (NEW: the
  audience-day inversion — surveyor → the steward)** · T6 Edo
  (H0→H7, reserved). The "T5 Edo conduit" note and the §3.7.2
  heading rename accordingly.
- §3.5 (nav-reveal track): mostly mechanical; add the map re-label
  reveal (docket #6) as the T2 entry.
- After this sub-step: `pnpm run gen:prd-regions` + `-- --check`,
  then `pnpm run prd:drift` (rank titles are region-transcluded so
  presence holds; verify).

**A2.5 · `docs/living/prd/04-combat-balance.md` (1709 lines — LIGHT):**
- §4.0a table (L99–106) + §4.0b table (L116–124): the tier rows end
  at "T5 Edo" — insert a **T5 Domain** row and shift Edo to **T6**.
  Magnitudes stay AS THEY ARE (provisional; the ADR-117 §4
  ripple-freeze covers numbers, not the tier skeleton — copying the
  old T5 numbers onto the new T5 row and leaving T6's cells marked
  provisional/`—` is correct; do not invent numbers).
- §4.8.2 (L1552) "The Village tier (T2)" / §4.8.3 (L1578) headers:
  rename to the bible tier names ("The Valley (T2)" etc.). Budget
  re-derivation itself WAITS for the sim (docket #7's build).
- Touch nothing else in §4.

**A2.6 · `docs/living/prd/06-tech-architecture.md` (905 lines):**
- L288: `tier: TierId // current macro tier T0..T5` → `T0..T6` +
  the shared FORWARD SPEC banner citing docket #1 (ADR-152) and
  docket #10 (ADR-161 — clean-break saves, no migration): the built
  enum is 0..5 until the game plan lands.
- L267 + L340–341: `season(day) = floor(day/28) mod 4` and the
  derived-never-stored 4-season notes → forward-spec to the
  six-season MANUAL container (season becomes stored, advanced
  state) + the banner citing docket #2 (ADR-153). Keep the built
  behavior described AS built behavior under the banner — don't
  erase what the running engine does (PH2).
- L287: the koku ladder "T4 = 10,000 daimyō → T5 100,000+" — shift
  tier labels to the seven-tier skeleton (T5 Domain, T6 Edo);
  magnitudes provisional as ever.
- L134 (`seasonal` RNG stream) + §6.7.1 (day-keyed notes): survive;
  re-anchor the wording to "season" as a stored container (banner
  covers the delta).

**A2.7 · `docs/living/prd/07-roadmap-scope.md` (318 lines):**
- §7.1.1 (L55–65): Otsuru/Tahei framing survives in spirit — sync to
  the relocked origin (family alive; reunion optional). "T4
  Castle-town ships as a STUB cliff-hanger … **T5 Edo is roadmap
  only**" → renumber to the 7-tier ladder: v1 ships full T0–T3
  (HD-26 default); T4 the near frontier; T5 Domain + T6 Edo roadmap
  only.
- The cut-set table (L67+): "T1 R8–R15 … 32 rungs total", the quest
  taxonomy and world node counts — rewrite against the bible: 8 rungs
  × 4 tiers = 32 rungs for v1 (T0–T3), zones per the tier sheets'
  zone lists, quests per the side-beat rosters (point at the sheets;
  don't inventory what the sheets own).
- Add one line under the v1 scope statement: "(v1 scope reconfirmed
  as full T0–T3 per HD-26's default — ADR-021's lock, same label,
  new content; awaiting the human's confirmation)". Remove when
  HD-26 closes.

**DoD (A2 whole):** every quoted stale line above is gone or
rewritten; the four marker pairs byte-identical (`gen:prd-regions
--check` green); `pnpm run prd:drift` clean or every flag has a §5.6
row; links green; forward-spec banners present in §2/§6 (+ §5 from
A1); no doc describes the BUILT engine as already changed (banners
carry the delta — PH2). Commits per sub-step (docs-only, pathspec),
then the checkpoint ritual.

---

### A3 · The roadmap reshape (7 tiers, the B-wave as the near term)

**Goal:** `docs/living/roadmap.md` (366 lines) stops planning dead
content. ADR-150 already charters this ("B1 … + roadmap ripple (7
tiers, new milestone shapes)") — no new ADR needed.

**Edits:**
- Header (L15–20, "the 2026-06-28 tier reshape (ADR-048…ADR-055, 6
  tiers)"): add the 2026-07-07 storywave line — ADR-150 + the docket
  (ADR-152…161); the bible is canon; seven tiers.
- The locked-spine block (L44–54): rewrite — **7 tiers (T0 Estate-
  household · T1 Estate-land · T2 Valley · T3 Region · T4 Castle Town
  · T5 Domain · T6 Edo); v1 = full T0–T3 (HD-26 default, ADR-021's
  lock); one unbroken R0–R7 career per tier (T6 = H0–H7); inside/
  outside alternation with the T2/T3 hard lock (ADR-154); time-skips
  at tier seams (~13 years); the six-season manual calendar
  (ADR-153); the guest-house/ruin reveal (ADR-157); NO-PRESTIGE stays
  hard; enum 0..6 per ADR-152 (clean-break saves per ADR-161)**.
  Replace the "one pillar per tier" line per HD-25's default (the
  standing/deeds engine, ADR-159) with the awaiting-confirmation
  note.
- Enum refs "0..5 per ADR-048" at L116/L186/L232 → "0..6 per ADR-152
  (ADR-048's spine superseded by the storywave docket)".
- **Keep every SHIPPED row untouched** (MS0–M2b + T0-M1…M4) —
  history, and the built T0 keeps shipping until Plan B replaces it
  (ADR-150 consequence).
- **Replace every UNBUILT section** (the old T1 4-MS block with
  R8–R15 + Kihei/Tanomo/Tōkichi/Gohei/Yatarō content; the T2 4-MS
  Asagiri/Sayo/Magobei block; the T3 coarse block) with 7-tier
  sections at the bible's staged depth: **T1 detailed** (milestones
  shaped from `tiers/t1.md` — the access arc, the kura key, the debt
  panel, the shoin/register capstone); **T2 and T3 at half depth**
  (the reveal + village track + first-man beat; the origin mainline +
  Otsuru spine + reunion side-track); **T4 a quarter** (the enemy
  lord, Katsuhide, the campaign); **T5 a fifth** (audience-days, the
  handover); **T6 reserved** (one line). Milestone DoDs stay
  SHAPE-level (each tier's build re-plans in detail when it opens —
  per ADR-088 every tier's first milestone must name its full-arc e2e
  + invariants test).
- **Insert the storywave wave itself as the near-term section** (the
  roadmap's next-to-build is no longer "T1-M1"): the two parallel
  plans — Plan A (this plan: A0 docket ✅ by then, A1–A2 PRD, A3
  roadmap, A4 sweeps, A5 closure gated on B) and Plan B (the game
  plan: engine ADR builds → T0 prose wave → content migration →
  ship), each row pointing at its plan file.
- Ship-section rows: re-point "ships v1 = T0→T3" language to the new
  tier names; keep the two ship milestones.

**DoD:** roadmap speaks 7 tiers + the docket ADRs; shipped rows
byte-untouched (verify with `git diff` — only unbuilt sections and
the spine/header changed); the near-term section names both storywave
plans. Docs-only commit + checkpoint ritual.

---

### A4 · The small living-doc sweeps

**Goal:** the residue the scout found outside the PRD/roadmap.

- **`docs/living/fun-factor.md`** — L15 + L408 cross-reference "§1.6
  (the four pillars / six tiers)": update the wording to match the
  rewritten §1.6 (the standing/deeds engine + seven tiers). No cast
  refs exist in the file; touch nothing else.
- **Root `README.md`** — the seed-prompt banner (L9–14) points at
  `docs/living/prd.md` §1 for the vision; add ONE line pointing at
  `docs/story-bible/` as the story-canon home. Do not otherwise touch
  the preserved seed prompt.
- **The parked T1 plans** — per HD-29's default (supersede):
  `git mv docs/plans/t1/opus-2026-07-03-t1-capstone-branch.md
  project/archive/` and add a forward-pointer line at the top of the
  archived copy ("superseded by the storywave reboot — the new T0-R7
  has no three-way lord beat; the capstone-branch PATTERN (ADR-125)
  remains available to future tiers; see
  `docs/plans/fable-2026-07-07-storywave-docs.md` HD-29"). Skim
  `docs/plans/t1/opus-2026-07-07-emergent-node-extensions.md` for
  old-ladder assumptions (R8–R15, Shigemasa): if it is
  old-canon-load-bearing, archive it the same way; if its mechanism
  is canon-neutral, add a banner line noting the ladder refs are
  stale pending the T1 re-plan. Do NOT archive
  `fable-2026-07-07-story-bible-finish.md` yet — it archives when
  BOTH storywave plans ship (its DoD's tail); add a line under its
  Status pointing at the two storywave plans as B1–B5's re-plan.
- **What A4 explicitly does NOT touch:** `docs/guides/qa-playtesting.md`
  (documents the BUILT harness — its `tier // 0..5`, `toTier(n)`,
  Tokubei fixture and "T0→T3 pacing budget" lines change WITH the
  code at A5/Plan B, not now — PH2: the guide describes the build);
  `docs/living/ui-design.md` (clean — only mechanical tier/rung
  usage); `docs/content/*` (generated — Plan B's gen scripts own
  them); `CHANGELOG.md` (Plan B's, at ship); old ADRs (history).

**DoD:** fun-factor + README touched as above; parked plan(s)
archived with pointers; finish-plan Status line re-pointed. Docs-only
commit(s) + checkpoint ritual. This closes Plan A's pre-ship work —
update the snapshot's workstream-A line to "A0–A4 ✅; A5 gated on the
game plan's ship."

---

### A5 · POST-GAME-SHIP closure — ⛔ GATED on Plan B shipping

**Do not start until the game plan's ship milestone is on `main`**
(the new T0 playing the bible canon in prod — verify by reading Plan
B's Status line and the CHANGELOG release section, not by assumption;
PH2). This may be days after A4. If picking this plan up cold: A5 is
the only remaining work.

- **Remove the status banners** this plan added: §5's "FORWARD CANON
  — THE SHIPPED GAME TRAILS" block (A1), every "FORWARD SPEC
  (storywave)" banner in §2/§6 (A2.3/A2.6), and the two
  awaiting-confirmation notes IF their HDs have closed (if an HD is
  still open, leave its note and say so in the commit body).
- **Closing `pnpm run prd:drift`:** Plan B's rename commits added the
  RETIRED-terms entries (shigemasa→munemasa, tokubei→yohei, etc.) and
  re-pointed the munenori/jūbei/ranpo successor chains in
  `prd-drift.ts`. Now shrink §5.6: rows whose built label no longer
  ships (the registries speak bible names) lose their presence
  purpose — cut the stale rows, keep the table as a one-screen
  historical rename ledger or fold it into a footnote pointing at
  `04-cast.md`'s name docket. Run `prd:drift` and iterate to a clean
  report WITHOUT compat rows doing load-bearing work.
- **Gen-region freshness + rebinds:** Plan B ran `pnpm run
  gen:prd-regions` in the same commits as its registry renames (the
  machine-written region bytes inside the PRD are the ONE place its
  commits touch A-owned files — a narrow, mechanical seam exception
  the `gen-prd-regions` gate itself forces; both plans acknowledge
  it). A5 verifies: run `pnpm run gen:prd-regions -- --check` and
  read the four regions. If a source registry was RESHAPED (e.g. the
  deed-source table docket #8 rebuilds) so a region's binding in
  `src/scripts/gen-prd-regions.ts` no longer points at the right
  export, rebind it there (the one src/ file A owns), regen, commit.
- **`docs/guides/qa-playtesting.md`** — now the build HAS changed,
  update the built-harness lines: L85 `tier // 0..5 (T0
  Estate-tutorial … T5 Edo)` → 0..6 + new names; L113 `toTier(n)`
  range; L175 the Tokubei fixture mention → its new name; L305–306
  "the full T0→T3 pacing budget" → re-anchor to the re-derived
  pacing (read the regenerated `docs/content/t0-pacing.md` first).
  Verify each line against the actual shipped code before writing it
  (PH2 — the build wins).
- **The bible README banner** (HD-28) — if the human ruled and it is
  not yet applied, apply the blessed one-liner now (with the human's
  ruling recorded, this is transcription, not a canon edit).
- **Plan hygiene:** set THIS plan's Status line to ✅ done and
  `git mv` it to `project/archive/`; do the same for
  `fable-2026-07-07-story-bible-finish.md` if Plan B has archived its
  own plan (both waves done = the finish plan's DoD met — check its
  Status first). Reconcile the reading queue (ADR-089): remove
  this plan's entry.

**DoD:** no storywave banner remains in the PRD; `prd:drift` clean
without load-bearing compat rows; gen-regions fresh + correctly
bound; the QA guide describes the shipped harness; plans archived;
queue reconciled. Final checkpoint ritual.

---

## Open questions for the human

Appended as HD-items at A0 (next free ids assumed **HD-25…HD-29** —
verify). The executor proceeds on each recommended default
immediately (PH4, except HD-28 as noted); an override is a targeted
follow-up edit, scoped below.

### HD-25 — the four-pillar model's fate

- **Question:** the PRD §1.6 tier-up engine is the four-pillar reveal
  ramp (one pillar per tier, 1→2→3→4→4); the bible's tier-up engine
  is house-standing/ESTATE-DEEDS graded at season exits
  (`tiers/t0.md` "The tier-up (locked)"). ADR-150 charters the
  mechanics ADRs but does not rule the pillar model's fate. Which
  governs §1.6, the roadmap spine, and the milestone DoDs?
- **Options:** (a) pillars SUPERSEDED entirely — standing/deeds is
  the engine, §1.6 rewrites to it; (b) pillars survive as THEMATIC
  framing only (a reading of what each tier reveals), standing/deeds
  is the mechanics; (c) keep pillars as mechanics (contradicts the
  bible — would need a canon HD).
- **Recommended default: (a)** — the bible is canon (ADR-150); the
  standing engine is human-locked in t0.md; the pillar ramp appears
  nowhere in the bible.
- **If overridden to (b):** §1.6 keeps a labeled thematic-pillars
  paragraph; ADR-159 and all mechanics text stand unchanged; A2.2 and
  A3 get a ~30-minute follow-up edit. (c) requires reopening canon —
  out of this plan's scope.

### HD-29 — the parked T1 capstone-branch plan (ADR-125 pattern)

- **Question:** `docs/plans/t1/opus-2026-07-03-t1-capstone-branch.md`
  specs the OLD T1 (R8–R15; the R7 Shigemasa devoted/ambitious/humble
  beat). The new T0-R7 has no three-way lord beat and the new T1 is a
  different ladder. Adopt-partial or supersede?
- **Options:** (a) supersede — archive with a forward pointer; the
  capstone-branch PATTERN (ADR-125) stays available to future tiers;
  (b) adopt-partial — keep the plan live and rework it against
  `tiers/t1.md`.
- **Recommended default: (a)** — the plan's content is old-canon
  load-bearing end to end; reworking it now duplicates the T1
  re-plan that happens when T1's build opens.
- **If overridden:** un-archive and add a "rework against tiers/t1.md"
  Status line; no other A-milestone changes.

### HD-26 — the v1-scope ruling

- **Question:** v1 = "full T0–T3" is LOCKED intent (ADR-021), but the
  tier ladder under the label changed (new content per tier, and the
  T5 Domain insertion renumbers what "T3" contains' neighbors —
  though T3 itself is still the Region). Is v1 still "through the
  region tier" (same label, new content)?
- **Options:** (a) yes — v1 = full T0–T3 (Estate-household →
  Estate-land → Valley → Region), unchanged label, new canon; (b) v1
  moves (e.g. T0–T2, or through T4).
- **Recommended default: (a)** — the T5 insertion happens ABOVE the
  v1 line (the old T4 castle-town/T5 Edo were already post-v1); the
  lock's intent ("through the region tier") is undisturbed.
- **If overridden:** `prd.md` L44, §7.1.1, the cut-set table, and the
  roadmap spine line get a renumbering pass (~1 hour); the plan's
  other milestones are unaffected.

### HD-27 — the village's name (Asagiri)

- **Question:** the old canon names the T2 village "Asagiri"; the
  bible never names it (zero hits in `docs/story-bible/`). Keep the
  name or leave the village unnamed?
- **Options:** (a) unnamed — "the village", per the bible's silence
  (naming it would be a canon addition, which is the human's);
  (b) keep "Asagiri" (would want a one-line bible addition — a canon
  edit, human-applied); (c) a new name (narrative-diverge material,
  ADR-139, at the T2 sitting).
- **Recommended default: (a)** — the docs ripple must not add canon;
  §5.6 keeps the "Asagiri → unnamed (HD-27)" ledger row and Plan B
  adds `asagiri` to RETIRED terms at its rename commit.
- **If overridden:** a find-replace scoped to A1/A2's rewritten text
  + the ledger row; trivial.

### HD-28 — the bible README banner flip (a §S read-only exception ask)

- **Question:** `docs/story-bible/README.md` L8–10 says "Until the
  reboot's build wave lands, the BUILT game's story is described by
  the PRD §5 + the narrative sources; this doc-set is the forward
  canon." The moment A1 rewrites §5, that sentence is stale (§5 no
  longer describes the built game — the narrative sources +
  `docs/content/t0-story.md` alone do). §S makes the bible read-only
  for both executors; a banner fix is not a canon change, but the
  letter of the seam holds. May the docs executor apply the one-line
  re-point below once you bless it?
- **Proposed replacement sentence:** "Until the reboot's build wave
  lands, the BUILT game's story is described by the narrative sources
  (`src/core/content/narrative/`) + the generated
  `docs/content/t0-story.md`; this doc-set is the forward canon, and
  the PRD §5 is its pointer-and-summary."
- **Options:** (a) yes — apply on this ruling (transcription of a
  blessed line); (b) the human applies it directly; (c) leave stale
  until A5.
- **Recommended default: (a)**, applied only AFTER the human's
  explicit go (this one does not proceed-on-default — it is the seam
  exception itself). Until then the banner stays stale; §5's own
  status banner carries the correct picture, so nothing misleads.
