# Session 57 — 2026-07-03 — taste-transfer architecture (the ⭐ redo, strategy pass)

**Summary:** Opened the ⭐ "redo taste-distillation + ui-design WITH Fable"
TODO. The human's opening ask was the zoom-out — *what's the best way to
distill my feedback so future agents build the game as if I wrote it, in
gameplay, UI and fun?* — so before touching `taste.md`, this session verified
the first cut and wrote the strategy as a durable brainstorm.

## What changed

- `project/brainstorms/2026-07-03-taste-transfer-architecture.md` — NEW: the
  strategy. Pipeline framing (capture → distill → deliver → measure);
  pyramid model (verdicts → principles → values + touchstones); delivery
  rungs (AGENTS.md taste register / read-at-build / N7 scorecards /
  mechanical-gate subset); measurement (prediction test + repeat-feedback
  rate); failure modes; a 4-step redo process; open forks with defaults.
- `project/todo-human.md` — queued the brainstorm (being discussed live;
  clear once talked through).

## Verifications run (R2, receipts)

- F-coverage set-diff between `2026-07-02-playtest.md` headings and
  `taste.md` citations: only **F9, F21, F102** uncited; **F72** cited but
  matches no corpus heading. First cut's gap is architectural, not coverage.
- The wider feedback corpus (~1,400 lines across the other dated docs, incl.
  the 629-line PRD feedback) is NOT distilled into taste.md — that's where
  the gameplay/fun taste lives.
- N7 (taste-bar enforcement) confirmed parked with its re-plan trigger =
  this TODO closing.

## Human steers received (turn 2) — recorded in the brainstorm §2/§8/§9

- **Corpus = `2026-07-02-playtest.md` ONLY** (the first and only playtest);
  the wider-docs sweep is struck.
- **Lock the top layer** — approved. AGENTS.md taste register — approved.
- **Rewrite must be lightweight/culled**: high-level taste hints, never
  100s of lines; the corpus holds the examples. New brainstorm **§9**:
  snapshot-class declaration, displacement editing, budgets
  (taste.md ≤150 / ui-design.md ≤400, targets ~110/~300 on the snapshot
  gate's 1.33× headroom ratio), and the hard lock — one
  `verify-doc-budgets.ts` as BOTH a 13th verify gate and a standalone
  pre-commit call outside `SKIP_VERIFY` (docs-only commits are exactly
  when SKIP_VERIFY is used, so the standalone rung closes that loophole);
  checks the index blob; `SKIP_DOCBUDGET=1` = human-blessed cap raise only.
- Checklist **leaves taste.md** → becomes N7's generated per-surface
  scorecard.

## Next intended steps

1. Human answers the remaining lock inputs: values in their words,
   touchstones confirmed/extended, THE reference idle-RPG named.
2. Step 1 of the redo: playtest-only re-derivation + substance diff vs the
   current taste.md, pre-culled to the §9 budgets.
3. Steps 2–4: lock → pyramid rewrite + ui-design cull (+ generated
   ui-tokens doc) + AGENTS.md register + `verify-doc-budgets` gate + N7
   full rewrite → prediction test.

## Landmines

- Do NOT edit `taste.md` in place before the re-derivation diff exists —
  verify-don't-trust applies to the first cut.
- N7 (now F10 after the co-agent's S/N→F rename) explicitly forbids wiring
  scorecards against the *draft* taste.md.
- Journal numbering: two session-55 files exist for 2026-07-03; this file
  takes 57 (56 = ui-demos-mobile).

## Side quest (human ask) — code/docs lane flags for verify

Audited the pre-commit/verify flow by what each gate READS and split it
into lanes; the audit lives as scope labels + comments on the roster in
`verify-run.ts` (its single source of truth):

- **code** (7): tsc, eslint, prettier (md is `.prettierignore`d), vitest,
  verify-content (imports registries), pacing (imports `../core`), playcheck.
- **docs** (1): verify-prd (reads `docs/living/prd/*` only).
- **both** — code↔docs invariants, skipped only when BOTH lanes skip (4):
  gen-docs (src→`docs/content`), md-links (src renames break doc links),
  milestone-integrity (roadmap DoD→real tests), verify-changelog
  (package.json→CHANGELOG).

New flags, semantics in the new pure `src/scripts/verify-scope.ts`
(+ 5 unit tests on synthetic gates — a filter bug would be a silent false
green, R3): `SKIP_CODE_VERIFY=1` (docs-only commits: docs lane still runs,
measured 0.22s vs 4.35s full) · `SKIP_DOCS_VERIFY=1` (mirror; drops only
verify-prd today — thin lane, noted honestly). `--budget` ignores the
flags; `.githooks/pre-push` now `env -u`'s them so a push ALWAYS runs the
full roster. Guidance updated: pre-commit hints + AGENTS.md commit bullet
now steer docs-only commits to `SKIP_CODE_VERIFY=1` instead of the
skip-everything `SKIP_VERIFY=1` — which also mostly supersedes §9d's
"standalone pre-commit call" for the future doc-budgets gate (brainstorm
updated with strikethrough).

Verified: all four flag combos + budget-with-flags run live; new tests
pass; full verify green.

## The lock begins (grill) + the little plan

Round-1 AskUserQuestion answers checkpointed to brainstorm §10: V1/V2/V3/V5
locked, V4 unsure, V6 demoted; touchstones GBA/JRPG-boxes/Fallout locked,
Kurosawa unpicked (probe why); density refs = proto23 +
yet-another-idle-rpg (README L13; locations unknown — flagged); P21/P22 →
qa-playtesting.md. Per the human's ask, the build order now lives as a
little plan: `docs/plans/fable-2026-07-03-taste-redo.md` (P0 lock → P1
taste.md ≤150 → P2 ui-design ≤400 → P3 register + budgets gate → P4
prediction test; strictly serial). Grill continues with the §10 open flags.

## P0 CLOSED — the top layer is locked → ADR D-126

Grill rounds 2–4 (all checkpointed in brainstorm §10): V4 density demoted
to principle → **four values**; Kurosawa = "weaker than the docs claim" →
provisional pending R9 (the P2 cull must NOT harden it); inspiration refs
found in README L26–30 (proto23 = 23html.github.io, yet-another-idle-rpg =
miktaew) — agent screenshots them in P1 prep and proposes what-to-take;
budgets **150/400 confirmed**; backstop: "that's complete." Promoted to
**D-126** in decisions.md; plan Status → P0 ✅. Next: P1 re-derivation.

## Reference screenshots landed (human-captured, agent-organized)

The human captured 6 shots of the two inspiration games themselves
(explicit steer: copy, don't re-capture) → committed under
`raw/screenshots/{proto23,yet-another-idle-rpg}/` with descriptive names +
an annotated README; `raw/` added to repo-map (distinct from the
git-ignored `project/brainstorms/raw/`). Agent viewed all six and proposed
the two what-to-take one-liners in brainstorm §10 (Q10) — the last P0
residual, pending human confirm. Notables seen: proto23's LOCKED-slots-
visible + colour-coded log + discoverable node actions; YAIR's per-skill
bars + rate/ETA-legible activity cards.

## P1 SHIPPED — taste.md rewritten as the D-126 pyramid

Full fresh corpus read (all 2,314 lines); re-derivation verified the 22
principles evidence-sound, found ONE real gap (F102 "the map doesn't
spoil" — now principle 15). New taste.md: 4 values → touchstones +
confirmed reference take-lines → **21 principles** in 5 value-groups →
scope. **149 lines** (cap 150); checklist removed (→ F10 scorecards);
Do/Don't casebooks culled (corpus holds examples). Workshop bar (old
P21/P22 + DEV F-items) relocated to `qa-playtesting.md` **§9** in the
same commit. Coverage receipt: corpus ∖ (taste ∪ qa§9) = ∅; F72 resolved
(embedded in F67's body). Substance diff: brainstorm §11. Queued for the
human's lock read.

## P2 SHIPPED — ui-design.md culled 1,159 → 351 lines (cap 400)

The bible is now snapshot-class: judgment points at taste.md, token
VALUES point at a new **generated** `docs/content/ui-tokens.md`
(`gen-docs.ts` emits the `:root` block of styles.css verbatim — rides the
existing gen-docs gate, so a token edit without regen goes RED), CSS
recipes point at styles.css. §1 vision carries the **provisional-pending-
R9 marker** (D-126: "softer canon than the docs claim" — do not harden).
Kept whole: palette roles + discipline, type rules, app-shell/multi-panel
contract, 7-tab IA table, component contracts (log/perks/meters/rung/VN
scene…), motion table, the locked emoji set, the anti-slop checklist.
Culled: the ~90 lines of CSS code blocks, per-screen prose (→ terse
beats), the summary + sources (git history holds provenance). Full verify
green (one transient eslint ENOENT on a vite `config.timestamp-*.mjs`
temp file from the running dev server — re-ran clean; a lint-ignore for
that pattern would kill the race for good).

## P3 SHIPPED — the taste register + the doc-budgets gate

`verify-doc-budgets.ts` is the **13th verify gate** (docs-lane): hard
caps in ONE table — taste.md 150 · ui-design.md 400 · project-status.md
120 (absorbing the pre-commit snapshot gate's count check; that hook
section now just re-invokes the script under a full `SKIP_VERIFY=1`,
bypass `SKIP_DOCBUDGET=1` = human-blessed raise only) + warn-only genre
tripwires (`(session-NN)` in the design docs, "Phase update" bullets in
the snapshot). **RED-proven live**: padded taste.md to 151 → gate blocked
with the cull-don't-bypass message; restored → green; docs lane now runs
6/13 gates in ~0.3s. AGENTS.md's stale build-to-taste bullet (it cited
the removed checklist) replaced by the **taste register** — T1–T4 value
one-liners mirroring the philosophy R1–R6 pattern, pointing at taste.md.
Full 13-gate verify green.

## P4 SHIPPED — the prediction test: the transfer WORKS. Plan DONE.

Two blind judges (fresh agents, zero inherited context, reading ONLY
taste.md + qa§9) scored 12 disguised cases (10 real pre-fix F-states + 2
compliant decoys): **verdicts 24/24, zero false positives; principle
attribution 11/12 each — and the single miss was IDENTICAL across both**
(case 7/F41: intro-choice stat line → they said Story, the human said
Progress). A convergent miss = a real wording ambiguity → principle 16
sharpened in place ("a scene's stat-grant LINE is Progress; its prose is
Story"); taste.md now sits at exactly 150/150. Results: brainstorm §12.
Closed out: the ⭐ TODO closed in todo-human (docs stay queued for the
lock read); the taste-redo plan flipped ✅ and **archived** (links in the
brainstorm + D-126 repointed); F10's placeholder marked RE-PLAN TRIGGER
FIRED with the no-more-checklist note.

## Next intended steps (current)

1. Human: lock reads of taste.md + ui-design.md (queued) + the brainstorm.
2. F10 full re-plan (scorecards vs the 21 numbered principles) — next
   session.
3. Repeat-rate tagging rides the F3 capture-inbox format when built.

## Landmines (current)

- taste.md is at exactly 150/150 — the next edit MUST displace a line
  (the doc-budgets gate blocks >150).
- The `(session-NN)` genre tripwire warns (never blocks) if a session ref
  sneaks into taste/ui-design.
- eslint can transiently fail on a vanished `vite.config.ts.timestamp-*`
  temp file while the dev server runs — re-run; an ignore pattern would
  kill the race.

## Checkpoint (session close)

Snapshot brought current (the new doc-budgets gate caught it at 127/120
mid-edit — displaced to 120 exactly; the mechanism works on its author).
Queue reconciled with the human (AskUserQuestion): taste.md, ui-design.md
and the taste-transfer brainstorm all cleared — signed off. Pushed main.

## Post-checkpoint: the /distill-taste skill (human ask)

The future distillation process codified as a **user-invoked-only skill**
(`disable-model-invocation: true`): `.claude/skills/distill-taste/` —
the five-move triage (repeat→strengthen-the-RUNG · evidence→cite ·
new-taste→displace-under-a-value · wrong-home→relocate · one-off→corpus
only), snapshot-genre editing rules, human-locked top layer, and the DoD
(budgets · coverage set-diff · the 2-blind-judge prediction test ·
repeat-rate tagging). Roster line added to repo-map. This is the s57
procedure made repeatable — feedback never GROWS taste.md, it triages.
