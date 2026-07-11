# The Estate section + upgrades redesign — feedback → plan

**Status:** LOCKED — direction signed; **Phase 0 CLOSED 2026-07-10, ADR-177**
(all forks ruled in-session; see **Direction** below +
`project/feedback-human/2026-07-10-estate-phase0-rulings.md` for verbatims).
**✅ ALL BUILD PHASES DONE 2026-07-11 (session 168):** Phase 1 (the works-cause
diverge + discovery chain; HR-27) · Phase 2 (Schedule A one-tab-per-rung +
the Works 普請/Estate 家 diverges with the E1 fold-in; HR-29/HR-30) · Phase 3
(commission + sited work_project economy; sim in band, ADR-172 stands).
Open sign-offs live in HR-27/29/30; interim variants retire on those.
**Confidence:** ( 35% Opus, 65% Fable ) — the load-bearing work is fiction +
taste judgment (Phases 1–2); the mechanical tail (Step 0, Phase 3 transcription)
is Opus-safe.
**Sources:** `project/brainstorms/2026-07-10-estate-upgrades-redesign.md` (the
parked direction note this plan supersedes) + the estate-related playtest-inbox
feedback gathered below.

## Direction — the signed Phase-0 rulings (2026-07-10)

- **F1 → cause-gated, NOT R1; the one-tab-per-rung law adopted.** The tab
  audit ran; the human signed **Schedule A** ("fine to put Character & works
  on the same"):

  | Rung | Tab | Note |
  |------|-----|------|
  | R0 | Work | cold open |
  | R1 | Map 地図 | ALONE — Estate leaves R1 |
  | R2 | Character + **Works 普請** | the one accepted double; both cause-gated |
  | R3 | Combat | alone (Inventory leaves) |
  | R4 | Inventory | `panel-home` re-keys off `tab-combat` |
  | R5 | Quests 用 | as-is |
  | R6 | Estate 家 | pillars + influence + the E1 cutaway fold-in |
  | R7 | — | Phase 2 fills Works (deed climb) |

- **F2 → ledger names → you walk, PLUS an NPC beat per project** ("1 & 4").
  The day-book/lease names the concern; visiting the zone and seeing the
  damage unlocks the work; each of the four projects also gets its own
  dialogue beat.
- **F3 → repair verbs + inputs.** Projects become WORK — per-project zone/act
  requirements + material inputs (wood); coin demoted from sole gate.
- **F4 → the upgrades LEAVE "Estate".** New tab **Works 普請** (picked from a
  10-name field) owns the projects; Estate 家 keeps the pillars/influence and
  gains the E1 cutaway as its anchor; market/storehouse split out (re-homes
  are a Phase-2 detail). The influence teaser's pre-R6 home is a Phase-2 call
  (it shows R3 today).
- **F5 → the E1 cutaway folds into Estate 家** (the R6 macro house-view);
  HR-16's look-iteration happens as part of the fold-in.
- **Weir / FB-342 → locked until named**, and the first Works projects live
  in the **three R1 zones** (gate · paddies · woodshed) so early repairs
  happen where you already walk; the weir zone unlocks when the day-book
  names it.
- **Project-per-zone pacing** (the dossier insight A builds on): later
  projects land as their fiction-zones open — orchard ~R5 (U2) · granary ~R6
  (U3) · study ~R7 (U4).

## Who builds this — Fable or Opus?

- **Phase 0 (direction lock)** — the *human* decides; either model can run the
  sitting. Judgment concentrates in framing the forks well, not in code.
- **Phase 1 (fiction repair)** — **Fable-leaning.** A narrative-diverge whose
  whole value is dramatic-register judgment (ADR-139 blind takes help, but the
  brief-writing + self-pick carry taste risk).
- **Phase 2 (surface redesign)** — **Fable-leaning.** A full ADR-075 diverge of
  a surface the human has now bounced twice (FB-157, this steer); the taste bar
  is the risk, not the wiring.
- **Step 0 + Phase 3** — **Opus-safe.** A lock-schedule triage and an ADR-132
  transcription/balance pass are mechanical.

Per D-124 this section *proposes* routing for the human to approve; the
building session inherits its own model unless the human routes otherwise.
**APPROVED as proposed (human, 2026-07-10)** — Fable builds Phases 1–2;
Step 0 / Phase 3 may run on Opus sessions. In the same sitting the human
confirmed the two deferred detail calls (economy-pane re-homes, the influence
teaser's pre-R6 home) stay **Phase-2 decisions**, as written.

## The feedback corpus (what the players' record actually says)

Pending inbox (r1 bucket — NOT drained by this plan; the r1 drain lane still
owes their sidecar stamps):

- **FB-338** (Question, 18:38) — _"I honestly don't know what to do with this
  estate section, there's not enough story context for why it's here in R1.
  Why are you mending the weir screens, who told you about the weirs, why did
  you notice they are broken, its just not mentioned, its random."_
- **FB-342** (Bug, 18:46) — _"Why can you move to the weir in R1? I thought
  that was still locked."_

Drained today (context, already actioned in their lanes):

- **FB-274** (log-panel lane) — the `panel-estate` reveal line ("The estate's
  own state of repair is yours to tend now…") was STRUCK on the human's order:
  _"it's obvious by the time you get to the Estate section and I need to think
  harder about the Estate section TBH."_ The one line that tried to give the
  section a cause was judged unearned — the cause has to be real, not a log
  sentence.
- **Session-156 steer** — V0A (estate-a) + V1A (tracker-a) locked _"for now"_;
  _"Honestly the whole estate section and upgrades needs a lot of love and
  thought."_ (HR-9/HR-11 archived as INTERIM; DEV alternates kept.)

Standing record folded in:

- **FB-157** — "border soup": the quick-fix that produced estate-a re-skinned
  the card, not the shape.
- **HR-16** (archive) — the E1 okoshi-ezu cutaway: two blind-pass-green
  variants judged _"needs more work"_; parked, still in `src/ui/estate-sheet/`
  behind DEV.
- **HD-34 / ADR-172** — the Phase-2 deed economy re-tuned
  (`ESTATE_DEED_PER_ACT` 0.22→0.6, ratio back in [0.8, 1.2]); ascension is
  attention-priced. These numbers STAND unless Phase 0 reopens them.

## What the build is today (source-verified 2026-07-10)

- **The ladder** (`src/core/content/estate.ts`): four repair/reclamation
  projects, U1→U4 — *Mend the weir screens* (100 coin) → *Reclaim the orchard*
  (300) → *Raise the granary* (700) → *Set the house in order* (1400) — each
  granting +satietyMax and a cumulative labour-yield bonus (the ADR-051
  flywheel, +15/35/65/95%). Deed gates `[0, 90, 220, 380]` mean U2+ are
  effectively Phase 2; **U1 is affordable and un-deed-gated in R1**.
- **The section** (Estate 家 tab, `panel-estate` unlocks ~R1): the improve card
  (estate-a) + tracker-a + the HOUSE_ROOMS flavour rows (R4/R6/R7 reveals),
  sharing the tab with market, storehouse, belongings, and (R3+) the
  House-Influence pane — six panes stapled into one tab.
- **The weir exists twice**: as U1's fiction (the screens) and as a map node
  (堰) — FB-342 says the node is walkable in R1 when the human expected it
  locked, and FB-338 says the project names it with zero story introduction.

## Diagnosis — three braided problems

1. **Fiction (TST3 — the fiction must cause the mechanics).** The projects are
   *spawned, not discovered*: "Mend the weir screens" appears as a buyable in
   R1 with no one having told you the screens exist, are leased, or are
   broken. FB-274 proved a log line can't paper over this — the cause was
   struck as unearned. This is FB-338 verbatim.
2. **Anatomy (TST1 — one home for everything).** The Estate tab is a staple of
   six panes, not a designed home. HR-9's diverge re-presented the improve
   card; the human's "border soup" complaint was about the *shape*, and the
   shape never changed. The natural anchor for a reclamation fiction — the
   estate itself, seen (HR-16's cutaway) — is parked.
3. **Upgrades (PH5 — if it isn't fun, it isn't finished).** Advancing reads as
   buying stat lines: coin → "+20 satiety max" (a stat the human separately
   flagged as conflated with stamina — FB-334/FB-345, adjacent not owned
   here). The flywheel (+yield%) is the actual fun engine and it's the least
   legible part of the card. Dual coin+deed gates are invisible until they
   block you.

## The plan

### Step 0 · FB-342 — RESOLVED BY RULING (build work moves to Phase 1)

~~Triage~~ The human ruled: the weir node is **locked until the day-book names
it** — Step 0 is no longer a triage but a wiring task inside Phase 1's cause
chain. **Owner note:** FB-338/FB-342's r1-lane sidecars still owe their drain
stamps — whoever drains claims the lane (ADR-171); this plan does not stamp
them.

### Phase 0 · Direction lock — ✅ CLOSED 2026-07-10 (see Direction above)

~~A grill-me / AskUserQuestion sitting over five forks.~~ Ran in-session,
three AskUserQuestion rounds + the rung dossier; every fork ruled. Verbatims:
`project/feedback-human/2026-07-10-estate-phase0-rulings.md`. ADR-177 owed.
The fork list below stays as the record of what was asked.

- **F1 · When does the section earn its reveal?** R1 as now but with a real
  cause · deferred to the rung where its fiction can fire · R1 as a
  teaser-silhouette that fills later.
- **F2 · What causes each project?** The lease/day-book assigns it (Genemon or
  the ledger names the broken screens) · an NPC beat per project · **discovered
  by walking** — you visit the weir node and *see* the gnawed screens, and only
  then does the project exist (ties F2 to FB-342's node question).
- **F3 · Are upgrades more than coin→stage?** Keep coin+deed as-is, fix only
  legibility · add material inputs (wood is already in the economy) · give each
  project real requirements tied to zones/acts (repair verbs, not purchases).
- **F4 · What is the Estate tab's one home?** Keep the pane-stack but design it
  as one surface · make the estate *itself* the home (the E1 sheet/cutaway as
  anchor, projects read off the drawing) · split economy panes (market/
  storehouse) out to end the staple.
- **F5 · HR-16's cutaway disposition.** Anchor of the redesign (pull forward) ·
  its own later track · stays parked.

### Phase 1 · Fiction repair (ADR-139) — the cause chain — ✅ BUILT (s168, HR-27)

Per F2 (ledger→walk + NPC beats): a narrative-diverge (3+ blind takes per
unit) for (a) the day-book/ledger lines that name each concern, (b) the four
per-project dialogue beats, (c) the works-intro beat at R2. Wired
discovered-not-spawned (TST3): the ledger line reveals the zone concern → the
zone visit reveals the project → the weir node unlocks when named (FB-342's
fix lives here). First projects sited in the three R1 zones per the ruling.
Reviews LIVE in the DEV Story switcher; HR-item with taste scorecards.

### Phase 2 · The IA reshuffle + the two surfaces (ADR-075)

Two halves, sequenced:

1. **Schedule A lands** — the tab moves (Estate R1→R6, Inventory R3→R4 with
   the `panel-home` re-key, Works 普請 added at R2 cause-gated), the economy
   panes split out of the staple (re-homes decided here), and the influence
   teaser's pre-R6 home is picked. Mechanical but pacing-sensitive; e2e +
   affordance tests will need the new schedule.
2. **The two surfaces diverge** — a FULL ADR-075 diverge (2–3 working takes
   each, not card re-skins): **Works 普請** (the projects home, F3's
   requirements read) and **Estate 家** (pillars + influence + the E1 cutaway
   fold-in per F5 — HR-16's iteration happens here). Taste two-pass per
   variant; each variant its own HR-item; self-picked prod defaults. **This
   supersedes the interim V0A/V1A pick and retires estate-a/b/c +
   tracker-a/b/c** (strip on sign-off, zero flag-debt — they were kept
   precisely to die here).

### Phase 3 · Upgrade-economy build (F3 ruled: repair verbs + inputs)

Projects become work: per-project zone/act requirements + material inputs
(wood), coin demoted from sole gate; project-per-zone pacing (orchard ~R5 ·
granary ~R6 · study ~R7) folded into the requirement design. Core work under
the ADR-132 flow — telemetry step 0, `verify:balance` → `balance:report`,
regenerated `t0-pacing.md` in the same commit, sim summary in the body.
ADR-172 magnitudes stand unless the sim says the new inputs moved them.

## DoD

- Step 0: FB-342 reproduced + resolved (fix landed or filed with a verdict).
- Phase 0: ADR logged; Direction section signed here.
- Phase 1: cause beats in canon via ADR-139; no project appears before its
  fiction fires; FB-338's question answerable in-game.
- Phase 2: diverge shipped behind DEV, HR-items filed, prod default picked;
  interim variants retired on sign-off.
- Phase 3: sim verdict in-band; balance report committed with the change.

## Non-goals

- The estate **map** (絵図 survey sheet) — resolved (HR-7), untouched here.
- The satiety/stamina split (FB-334/FB-345) — real, adjacent, owned by its own
  drain thread; this plan only avoids making it worse.
- The ADR-172 pacing re-tune — stands; not relitigated outside F3's scope.
