# Backlog — deferred SCOPE notes, parked by the human

> Work deliberately pulled OUT of the active surfaces: not in flight
> (that's `docs/plans/` + the live snapshot), not awaiting a read
> (that's [`todo-human.md`](todo-human.md)'s reading queue — the session
> brief nags that list, never this one). An item moves back out when the
> human pulls it forward.
>
> **This file holds parked *notes*, NOT pointers to plans (human,
> 2026-07-07).** A parked *plan* lives as a real doc in `docs/plans/` —
> a **deferred-tier** plan goes in the tier subfolder (`docs/plans/t1/`,
> `docs/plans/t2/`, …), which the "active plans" scanners skip so it
> isn't nagged as startable, with its `**Status:**` line marked
> `PARKED`. Putting a `docs/plans/…` pointer *here* instead just rots
> the moment that plan archives (it happened twice — the T0 economy +
> rung-progression pointers outlived their archived plans). The
> **`checkpoint` gate flags any `docs/plans/…` reference in this file
> whose target no longer exists** so a stale pointer can't survive a
> commit. Organized by the **tier the work lands in**.

## Process — parked by the human

- [ ] **The closed distill loop (ADR-135, shape B)** — logging
  human-vs-scorecard mismatches as F-items that feed `/distill-taste`,
  with the prediction test re-run as a regression harness.
  **Deliberately parked** by the human when ADR-135 landed:
  re-distilling `taste.md` stays **manual only** (the human invokes it),
  and blind-spot tags accumulate in HR-items/journals meanwhile, so the
  evidence is not lost. Pull it forward when the tags outgrow a manual
  read. *(Found homeless by the new `deferred-work` gate on its first
  run, 2026-07-12: the ADR said "is NOT built" and no queue anywhere
  carried it. This is the error mode the gate exists to catch — it had
  been sitting unowned since ADR-135.)*

- [ ] **Make the balance-freshness check BLOCK, not warn** — today the
  pre-commit balance gate only **warns** when a commit moves design
  inputs without regenerating `docs/content/t0-pacing.md`, and a warn is
  easy to walk past. It was: session 182's ADR-184 zone re-mapping
  shifted pacing across the whole ladder and the report went **a full
  session unreported** — session 183 found the drift only because a new
  constant forced a regen (see its journal). *Parked, not planned:*
  blocking may cry wolf on content changes that don't really move
  pacing, so the fix needs a cheap "did the numbers actually move?" test
  before it earns teeth (AGENTS.md: a gate must never cry wolf). Pull
  forward if the drift recurs.

- [ ] **Reflow the remaining CANON to 72 chars** — session 195 brought
  the whole human-read session queue to the norm (`review.md` ·
  `BACKLOG.md` · `archive.md` · a full rewrite of `project-status.md`;
  `decisions.md` was `c1ccf9b2`). **Not done:**
  `docs/living/decisions.md` (**1838** genuinely over-wide lines) and
  the PRD sections under `docs/living/prd/` (**~4300** between them);
  smaller: `fun-factor.md` 269 · `ui-design.md` 205 · `CHANGELOG.md`
  203 · `roadmap.md` 200 · `AGENTS.md` 343 · `repo-map.md` 122. The
  tool is committed — `python3 src/scripts/reflow-md.py <file.md>` —
  and it is content-preserving (verify per its header: token stream
  identical with `>` prefixes stripped, NUL-free, width in CHARACTERS
  not bytes). *Parked, not planned:* the human was asked and had not
  called it — it is a **large diff across canon** and wants a **quiet
  tree** (a mass rewrite over a co-agent's open files rewrites their
  work under them, exactly like the `printWidth` 100→80 flip already
  waiting in `todo-human.md`). Pull the two forward together.

## Engineering — parked (session 192, 2026-07-13)

Deliberately not built; each says why. Never nagged.

- [ ] **Audio returns with REAL samples, never synth (ADR-193,
  2026-07-13).** T0 ships silent by the human's own call (the synth
  cues read comedic; `sfx.ts` stays parked in-tree as the attempt
  record). When audio work resumes it is a NEW plan — a small curated
  original/CC0 sample set (ambient beds + UI/event cues, the ADR-068
  palette intent as its brief), human-gated on taste. Parked until the
  human wants sound.

- [ ] **The storehouse rice DEPOSIT row is still vestigial (H3 sweep,
  session 198).** ADR-163 made rice kura-only, so carried rice is
  always 0 and "Store all rice" renders permanently disabled; the
  session-198 H3 fix retired only the WITHDRAW row (the ruled scope).
  Retiring the deposit row (+ its `deposit` rice branch and the
  ADR-145 stores-deed hook audit) is a one-sitting render cleanup —
  parked because the disabled button is harmless and the barn-filling
  model may yet give it a real use.

- [ ] **No gate proves "an old save still opens."** Session 192 bumped
  the save schema (v11 → v12, log lines re-addressed by NAME) and the
  only proof a pre-bump save survives was a throwaway browser script:
  plant a real v11 blob in localStorage, boot, read the log. It passed
  (day 93, rank-r7, 261 lines migrated, none blank) — and then the
  script was deleted with the session. **Parked, not forgotten:** a
  permanent e2e would need a committed pre-migration save blob **per
  schema bump** (a real maintenance cost, and each one rots), and the
  unit lane already covers the migration itself. Reach for it the first
  time a schema bump breaks a save silently — that is the day it pays
  for itself. Recipe is in the session-192 journal.

- [x] ~~**A new story-takes bundle renumbers every SV tag after
  it.**~~ **DONE same day (ADR-192, session 196)** — it bit a second
  time within hours (the hd41 prune shifted three more tags, and the
  human went looking for "SV18" and concluded the bundle was gone), so
  the human ruled the whole positional scheme out. Tags are dead: the
  reference is the surface/bundle **id** (`market`, `sleep-announce`),
  which never renumbers; `review-link` now checks ids both ways
  (including citations of pruned ids).

- [ ] **The scene path's stat-bonus line still logs on `system`.**
  `scenes.ts` emits `scene.<id>.opt.<id>.bonus` on the **`system`**
  channel, which `log-filter` routes to the **Work** tab — the exact
  defect fixed for the rung beat in ADR-190 (the rarest reward painting
  itself where nobody is looking). It is **unreachable today**: no scene
  option carries a `bonus:`. Parked *because* it is dead code — changing
  a branch nothing can run buys an unverifiable claim. The moment a
  scene option gets a bonus, fix the channel with it (the ADR-190 test
  that counts bonuses is already watching).



## Graphics concepts — parked shelves live in their register

- [ ] **Parked graphics concepts** — the one home for the whole slate
  (shelves, verdicts, pull-forward triggers) is
  [`docs/living/graphics-concepts.md`](../docs/living/graphics-concepts.md)
  (human, 2026-07-08: concepts must not float in BACKLOG/brainstorms).
  This line exists only so the parked shelf is findable from here.
  - **The 3 explored R0–R1 demos** (plan ran to completion 2026-07-08,
    all built behind DEV → Story): **#5 estate cutaway** → *needs more
    work* · **#12 scene cards** → *park* · **#8+10 stamp book** → *yeah
    good, continue later*.
  - **Still on the shelves** — SOON: #4 bestiary plates · #6 family
    register · #15 pictogram A/B · WHILE: #2 kamon · #3 hanko · #7
    documents · #9 season wheel · #13 emaki.

## T2

- [ ] **Inn rumours board as a discovery-rumor source** — when the
  village inn + rumours board reveal (PRD §2.13, T2), the board becomes
  a natural SOURCE for the tag-routed discovery rumors (§2.13(f), and
  the Phase-2 extension in
  `docs/plans/t1/opus-2026-07-07-emergent-node-extensions.md`): a posted
  rumour can carry a discovery tag alongside its yokai one-shots.
  Depends on the T1 rumor engine landing first.

- [ ] **The generated reading script hides R2 and R5** (found by the W6
  full-tier cold read, 2026-07-12 — parked as minor).
  `docs/content/t0-story.md` runs **R1 → R3 → R4 → R6 → R7**: R2's beat
  (`r2-yard-hand`, the silent rung) and R5's (`count` / `count-resolve`,
  the accusation night) are scene-defs, so `gen-narrative` files them
  under "Generalized scenes" instead of in the rung ladder. A cold
  reader — *including the human reviewing story* — hits two holes in the
  spine and cannot tell the tier is continuous. Nothing is wrong with
  the GAME; it plays in the right order. It is the reading script, and
  therefore the review surface, that misleads. Fix = teach
  `gen-narrative` to interleave rung-triggered scene-defs into the
  ladder by rung. Parked because it is cosmetic to play and only bites
  at review time.

- **Graduate the ADR-196 hook proof matrices into durable tests**
  (parked at the locks landing, session-199 2026-07-13). The 27-case
  block/allow matrix for `guard-bash-safety.sh` and the 4-case
  escape/ledger matrix for `guard-git-add-all.sh` ran green at build
  time but live in git-ignored `tmp/` (`guard-proof.sh`,
  `escape-proof.py`); a regex edit to either hook currently has no
  regression net. Fix = port them to a vitest spec that shells the
  hooks with fixture stdin (fast, COMMIT lane). Parked because the
  hooks just shipped verified and change rarely.

- **index.lock retry wrapper** (ruled OUT of ADR-196 v1 — the locks
  plan's Non-goals, session-199). 133 transient index.lock mentions
  across 548 sessions; leave-local + the push mutex should shrink it.
  Revisit only if the ledger/journals show it still biting.

- **The repair bind's only exit is the free season verb (found
  session-200, e2e fallout).** Banked wood is deliberately
  unreachable (spend-from-store) while `repair` consumes CARRIED
  wood only — with a node's site pool drained, a Battered-blade
  player's sole recovery is `advance_season` (free today). Harmless
  while the season verb stays free; **re-open this if seasons ever
  gain a cost or a gate** (then: either repair spends banked wood,
  or a wood-withdraw row returns). Evidence: session-200 journal
  ("the sickroom land's e2e fallout").

- **Render-split heat re-check (session 203, 2026-07-13).** Around
  2026-07-18 re-run `tmp/hotfiles.py` (or recreate it from the
  contention-analysis brainstorm) to confirm the commit heat
  actually dispersed off the old god-files onto the
  `src/ui/render|dev/` modules — the split's whole point. While
  there: `render/variant-renderers.ts` sits at 1,199 lines (the
  wc-l cap); if a new ADR-075 diverge grows it, split it
  per-surface then.
