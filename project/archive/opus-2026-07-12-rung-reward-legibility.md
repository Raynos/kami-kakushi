# Make a rung reward *read* as a reward (HD-41)

**Status:** ✅ DONE (2026-07-13, session-196) — **locked as ADR-191.**
The human picked variant B (the ruled entry) for the treatment, and
take B ("the world, changed") for the voice of the 31 Progress
objective lines — overriding the self-picked A. Canon carries take B;
the `hd41-progress-objective` bundle is pruned; HD-41 + HR-41 are
archived. The diverge history below is the record of how it got here.

The human played the diverge and chose **variant B, the ruled entry**
(2026-07-13), with two rulings attached that reshaped the rest of the
build:

1. **The pulse was firing on the wrong event.** It flashed whenever the
   rounded percent *grew* — which is nearly every act. A flash must mean
   *you finished something*, so it now rides the count of **completed
   requirements** (`rungProgress().done`): R0 has three, so R0 flashes
   three times.
2. **Progress must not speak story.** The Story tab keeps the overheard
   flavor line; the **Progress** tab now states **the work that was
   finished** — a new `objective:` line authored per requirement (31 of
   them, R0–R7), never a repeated formula. The retired `earnedEntry`
   docket (one line stamped on every completion) is gone.

What remains: the human picks among the three **objective-line takes**
(`hd41-progress-objective`, DEV → Story), and **that verdict writes the
HD-41 ADR**. **Confidence:** ( 70% Opus, 30% Fable ) — the
channel/render work is mechanical and Opus-shaped; the **diegetic
wording** is fiction under kernel #6 and wants Fable if it is available.
**Template:** build

## Who builds this — Fable or Opus?

- **Step 1 (the diverge, ADR-075):** the variants are a **UI
  treatment**, so the taste risk is real but bounded — the DEV toggle
  carries it and the human picks live. **Opus** builds all three; a
  Fable session is preferred for the final pick if one is free, Opus
  acceptable with the scorecard as the guardrail.
- **Step 2 (the diegetic line, if option (a) or (c) wins):** any *new
  player-read text* is fiction under **kernel #6** (no abstract
  game-words ever reach the player) and rides **ADR-139** — 3 blind
  takes. Judgment concentrates here; **Fable preferred**, Opus
  acceptable with a blind-reader pass.
- **Steps 3–4 (wiring, verification):** mechanical. **Opus.**

## Why

**This is the unfixed half of the human's original complaint** — and it
is the half everybody, including a full register audit, misdiagnosed.

The human flagged (2026-07-11) that the R0 experience felt wrong. The
2026-07-11 register audit read that as a **prose** problem and proposed
rewriting the three R0 reward lines into second person. **HD-38 rejected
that** (2026-07-12): every rung reward line R0→R7 is third-person
*overheard* speech, and that is the device the R7 naming pays off. The
human then ruled the remaining unease is **TST4 — "the player never
guesses state"** — likely **UI, not prose**, and explicitly **not to be
smuggled into a re-voice wave**. Filed as **HD-41**
(`project/human-in-the-loop/decisions.md`).

The coldness is **kernel #3** (*praise is scarce and earned*) and
**stays**. What fails is that the player cannot tell the line **is** a
reward, or that anything advanced.

**Record:** HD-38 (ruled 2026-07-12 → **ADR-185**) · **HD-41** (open,
the fork this plan builds) · taste **TST4** + principle **16** (route by
narrative weight; *Progress = earned*) · kernel **#6** (form is the
fiction) · kernel **#3** (praise is scarce).

## What exists today

**Source-verified 2026-07-12, this session, at `5520b536`:**

- **`src/core/progress-events.ts`** (`voiceFlavor`, ~L32–46) — when a
  rung requirement completes, it emits **one** log entry: `channel:
  'narration'`, `voice: 'narrator'`, `contentKey:
  \`requirement.${req.id}\``. That is the whole surfacing. Nothing else
  fires.
- **`src/core/log.ts` L12** — `LogChannel = 'narration' | 'reward' |
  'combat' | 'system' | 'milestone'`. A `reward` channel **already
  exists** and is not used for this.
- **`src/ui/log-filter.ts`** (`FILTER_CHANNELS`) — the routing, and the
  defect:
  - `story` ← `narration` ⟵ **the rung reward line lands here**, among
    all ambient prose.
  - `progression` ("**Progress**" tab) ← `milestone` **only** (rung-ups,
    unlocks, crafts). **An individual requirement completion never
    appears in Progress at all.**
  - `work` ← `reward`, `system` (labour spam).
- **`src/core/content/narrative/requirements.md`** — the flavor lines
  themselves (FB-5 authoring source; `requirementFlavor()` reads the
  registry, and the save stores the requirement **id**, re-rendering
  words from `src/` — ADR-186).
- **The hidden-rung design is deliberate:** the player never sees the
  requirement list — only a rounded % bar and each completion's line
  (`docs/content/t0-story.md`, "The hidden rung requirements"). So the
  fix may **not** be "show the checklist".

**The net effect:** the player's first three progress rewards land in
the story stream, visually identical to ambient narration, while the one
tab whose whole job is *what have I achieved* stays silent. TST4, at the
exact moment the game is teaching its core loop.

## Steps

**Ordering rationale:** the fork (HD-41) picks the *mechanism*; only
then is there anything to write or wire. Step 0 is a hard gate — do not
guess it.

0. ~~**⛔ BLOCKED — the HD-41 ruling.**~~ **CLEARED as a direction
   (2026-07-13, s185):** **(a) + (c), "maybe a bit of (d)"**; (b) dead.
   The mechanism to build: the rung line as **its own channel + distinct
   in-log treatment** (*story that is also earned*), showing in **both**
   Story and Progress, with the % bar's movement made visible where
   cheap. **The final lock is deferred**: the human plays the diverge
   variants live, picks, and only then is the ADR written (HD-41 sits ⏳
   until then).

   **The four build-shape calls (human, 2026-07-13, AskUserQuestion):**
   - **Progress-tab text: SPAN BOTH in the diverge.** ≥1 variant shows
     the SAME flavor line in both tabs (zero new fiction); ≥1 variant
     tries a distinct terser Progress-side line — that variant carries
     the ADR-139 3 blind takes. The play verdict decides.
   - **Scope: ALL rungs R0–R7** (the plan's default confirmed).
   - **(d) ships UNCONDITIONALLY** — the % bar's visible movement at the
     moment the line lands is a cheap orthogonal companion, landing
     whichever log treatment wins (not merely a variant ingredient).
   - **Routing: built THIS session (Fable)** — supersedes the "Opus
     builds" note above, which was written when a Fable session was
     scarce.
1. **The diverge (ADR-075) — 2–3 working variants behind the DEV
   toggle.** New/major UI treatment ⇒ no single-idea shortcut. Each
   variant is a real, working treatment of "this log line is *story that
   is also earned*", live in the DEV panel, each its own line item in
   `review.md`. Taste-scorecard **Pass 1 brief BEFORE building**.
2. **The diegetic line (only if (a)/(c) wins) — ADR-139, 3 blind
   takes.** If the mechanism adds any **new player-read text**, kernel
   #6 binds: no "Requirement 1 of 3", ever. The genuinely hard design
   question, and the reason this is not a one-liner: **what does a
   period-true progress line SAY when the requirement list is hidden
   from the player?** Author blind, paraphrase-test, pick, DEV switcher,
   HR item.
3. **Wire it.** `progress-events.ts` emits on the chosen channel (and/or
   a companion `milestone` entry); `log-filter.ts` routes it; the
   renderer gives it its treatment. Keep the `contentKey`
   (`requirement.<id>`) — ADR-186's descriptor-not-prose invariant must
   survive, or every existing save fossilises the old words.
4. **Close out.** Live drive R0 (below) → the human **plays** the
   variants and picks → **write the HD-41 ADR** (the ruling is only now
   real — human, 2026-07-13) + archive the HD-item → `/prd-ripple` +
   `pnpm run prd:drift` → HR verdict → Status ✅ → archive.
5. **✅ The pick, and what it changed (2026-07-13, session-190).** The
   human played the three treatments and chose **B, the ruled entry** —
   and rejected two things the build had gotten wrong:
   - **The pulse.** It rode `percent` growth, so it flashed on nearly
     every rake. It now rides `rungProgress().done` — the count of
     FINISHED requirements — so a flash means *you completed an
     objective*, three times in R0. (`ranks.ts` grew the `done` read;
     `render.ts` pulses on its growth.)
   - **The Progress-tab text.** *"In Progress we don't want story text,
     we want some kind of 'Objective complete' message"* — so the
     `earnedEntry` docket **formula** (one line stamped on every
     completion) is retired, and every requirement now authors its own
     **`objective:`** line: the terse statement of the work it finished.
     Story keeps the flavor prose; Progress states the labour. The
     compiler requires the field (`no objective line` is a build error),
     `story-doc` prints both readings, and the words ride the SAME
     registry entry as the flavor — no save stores them (ADR-186 holds).
6. **The remaining pick — the objective line's voice (ADR-139).** Three
   blind takes, authored per requirement across all 31: **canon = A ·
   "the house's book"** (the day-book register — the only one of the
   three that reads as a *record* rather than more story prose);
   alternates **B · "the world, changed"** and **C · "the hands keep the
   account"** live in `takes/hd41-progress-objective/`, swappable live
   in **DEV → Story** (the whole visible register re-reads on a flip —
   no replay needed). The human's verdict on this bundle **writes the
   HD-41 ADR**.

## Verification

Done is earned (PH3) — each check RED-able:

- **The player-reach proof (PH6), and the acceptance test:** drive a
  **fresh game headlessly to the first R0 rake-completion**
  (`src/scripts/qa-shots.mjs` / the `__qa` API — the harness used all
  session) and assert the completion is **visibly distinguishable** from
  an ambient narration line, **and** that the Progress tab is no longer
  empty of it. Both assertions can fail today — that is the point.
- **The unit gate:** `src/ui/log-filter.test.ts` already tests the
  channel→category mapping directly (it is pure). Add the new routing
  case there; it goes RED against the current mapping.
- **The save invariant (ADR-186):** a save written before this change
  must still re-render its requirement lines from `src/`. `pnpm run
  fixtures:check` + the orphaned-id sensor cover it.
- **The human's eye:** the acceptance test is a live R0 play — does the
  first rake completion now *land* as an achievement without the fiction
  going warm?

## Sync ripple

- **PRD:** likely **none** — this is a surfacing change, not a system or
  content change; `prd:drift` was CLEAN at `80389d75` and no registry
  fact moves. Run `pnpm run prd:drift` at close-out to confirm rather
  than assume.
- **Story-bible:** **none** — the reward lines' *register* is settled
  (ADR-185; third-person overheard stays). If step 2 adds new
  player-read text, that text is fiction and rides ADR-139, but it
  changes no canon.
- **Living docs / registries:** `ui-design.md` gains the new log
  treatment if one ships (it is the visual-language home);
  `docs/living/taste.md` **only** if the human decides principle 16's
  routing needs amending — that is snapshot-class and human-locked, so
  propose, never self-serve. `gen:narrative` re-runs if step 2 adds
  text.
- **CHANGELOG:** none — no version bump ships this.

## Human-in-the-loop

- **⛔ Blocking, by design:** the **HD-41** ruling gates everything. Four
  options
  + a recommendation are already filed; nothing starts until one is
    picked.
- **Files:** one HR-item per variant (ADR-075) for the diverge; one HR
  bundle for the diegetic line (ADR-139) if step 2 runs.
- **Taste:** scorecard **Pass 1 before** building, **Pass 2 per
  variant** after.
- **Open question, with a default:** should this apply to **all** rung
  requirements, or only the **early** ones (R0–R1) where the loop is
  still being taught? **Default: all** — the defect is structural, not
  R0-specific; R0 is merely where it was noticed. Cheap to scope down if
  the human disagrees.

## Non-goals

- **Not re-voicing the reward lines.** Their coldness is kernel #3 and
  is the R7 naming's payoff. HD-38 already ruled this; the audit's "flip
  R0 to second person" proposal is dead and stays dead.
- **Not showing the requirement checklist.** The hidden-rung design is
  deliberate (only the % bar and the completion line are player-facing).
  Any fix that reveals the list is out of scope.
- **Not touching the % bar's maths** — only, possibly, whether its
  movement is *visible* at the moment a line lands (option (d)).
- **Not the HR-34…HR-38 drain.** Those are the human's reads on the
  shipped re-voice; they need no plan.

## Risks

- **The seam (shared tree — check before starting).** This plan owns
  `src/core/progress-events.ts`, `src/ui/log-filter.ts`, the log
  renderer in `src/ui/render.ts`, and (if step 2 runs)
  `src/core/content/narrative/requirements.md`. At authoring time a
  co-agent had an **untracked `src/scripts/verify-deferred-work.ts`**
  and a staged `docs/plans/opus-2026-07-12-sleep-announce-beat.md`; the
  **sleep-announce** plan also touches log emission — **check
  `docs/plans/` and the herdr peers list before touching
  `progress-events.ts`.**
- **Kernel #6 is the real hazard.** The lazy fix ("Progress: 1/3") is
  forbidden and would be a genuine regression — the game has never let
  an abstract game-word reach the player. If no diegetic line can be
  found that works, **option (d) (make the bar's movement visible) is
  the honest fallback**, and shipping *that* alone is a coherent
  outcome.
- **Over-rewarding.** Kernel #3 says praise is scarce and earned. A
  treatment that makes every requirement completion feel like a
  *fanfare* breaks the tier's tone as badly as the current invisibility
  breaks its legibility. The variants must span **quiet → loud** so the
  human can see the range and pick the floor.
- **Rollback:** the channel/routing change is one line each in two pure
  modules, both unit-tested; the DEV variants strip from prod. Reverting
  is a revert.

---

## Leftovers from the T0 re-voice — queued here so they do not vanish

The re-voice (HD-38 / ADR-185) is DONE and archived. These are the only
loose ends it left, written down because *"if it isn't in the queue, it
doesn't exist"* (human, 2026-07-12) — a chat message is not a queue.

1. **`gen-stores` / `gen-greet` are unreachable text (content-debt, not
   a bug).** `src/core/intents.ts:362-368` deliberately marks both
   **delivered** on `open_eyes` so the intro beat does not double-greet
   — the comment says so. The consequence: two authored lines in
   `src/core/content/narrative/dialogue.md` (incl. `gen-stores`, which
   carries a `kura` mention) **can never reach a player**, and a future
   author could edit them believing they ship. *Not urgent, and NOT a
   simple delete:* the ids are pushed into `deliveredDialogue`, so
   removing the lines would likely trip the **orphaned-id sensor**
   (`cf9f8e03`). Correct fix is probably to delete the lines *and* stop
   seeding the ids — one small, careful commit. **Agent-pickable.**
2. **`flavor.md`'s *"dry as a frost report"* — deliberately NOT
   changed.** The W3 audit listed it among surviving works metaphors. It
   is a simile in **narration**, not in Genemon's mouth, and the
   metaphor ban binds **him**, not the narrator. Recorded so a future
   sweep does not "fix" it and flatten a good line. **No action.**
3. **The Count's price, the "your name" sweep, and Intro 2's unpriced
   question** were all filed as findings and then **fixed** on the
   human's ruling (`4586ec7b`). Nothing outstanding — noted only so the
   HR-37 findings list is not mistaken for open work.

## A process finding this plan does NOT fix (surfaced for the human)

Worth recording where someone will see it, because it bit this session:

**A redline list applied by hand, in a batch, with no gate behind it,
silently loses items — and the author is the last person who will
notice**, because he remembers *intending* to apply them. The W6 sweep
produced **12 redlines**; I applied **10** and reported the wave
complete. `verify` was green the entire time, because **no gate can
check a list that lives only in an agent's context**. Only the human
asking *"did you fix everything?"* caught it.

That is a textbook **PH3 false green**. It is **not** obviously gateable
(a lint cannot know what a blind reader asked for), so per the "push
each rule to the highest rung that can *soundly* hold it" doctrine, the
honest rung is a **norm or a skill step**, not a gate: *when a reviewer
returns a redline list, write it to disk as a checklist and tick items
off as they land — never hold it in context.* Proposing it here rather
than unilaterally editing `AGENTS.md`.
