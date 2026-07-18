# Session 213 — 2026-07-18 — successor skill library + stale-canon doc-sync

**Summary:** Built the 14-skill successor library under
`.claude/skills/kami-*` (discovery → parallel authoring → 3-reviewer +
fixer pass, ~2M-token workflow; library commit follows once the review
pass settles). The discovery's contradiction sweep proved nine repo
docs stale against the build; this commit lands the doc-sync (PH2: the
build wins), incl. retiring the twice-rotted `playtest.mjs`.

## What changed
- `AGENTS.md` — PH5 + QA bullets: woodblock/ink → Andon Steel
  (ADR-127); test-discipline bullet: `rungThreshold` (retired, FB-121)
  → the authored requirement lists in `narrative/requirements.md`.
- `docs/README.md`, `docs/repo-map.md` — ui-design.md relabeled the
  Andon Steel bible (repo-map is @-included into AGENTS.md, so this
  was always-loaded stale context).
- `docs/philosophy/if-it-isnt-fun-it-isnt-finished.md` — same
  relabel; audio parenthetical now cites ADR-193 (real samples,
  deferred).
- `docs/guides/sfx-spec.md` — added the missing ADR-193 supersede
  banner (T0 ships SILENT; the doc claimed its cues were live) +
  bible relabel.
- `docs/guides/qa-playtesting.md` — dropped the phantom `faceWolf()`
  from the `__qa` table (real wrapper: `fight(mobId)`,
  `src/app/main.ts`); three woodblock mood refs → Andon Steel;
  removed `playtest.mjs` as a recommended driver.
- `src/scripts/playtest.mjs` — RETIRED (deleted). Broken twice over:
  stale port 5174, calls the removed `qa.faceWolf()`, and its grind
  loop assumes cook-mends-HP (severed by ADR-164/197) so the MC can
  never heal. Long-grind smoke is owned by the balance sim + the
  `@slow` arc tests. Lives in git history if ever wanted.
- `.github/workflows/verify.yml` — header comment no longer
  hand-counts gates ("15" was stale; roster is `gates.ts`, currently
  21).
- `vite.config.ts` — comment: e2e lane is :5265 (was "stays on
  5199").
- `.githooks/pre-push` — e2e advisory now says ~50s (was ~12s).
- `docs/living/decisions.md` — index note: the ADR numbering gap is
  ADR-147 (the old wording garbled it as "ADR-146/ADR-148").

## Next intended steps
1. Land the `.claude/skills/kami-*` library commit after the
   review/fixer workflow completes + spot-checks (this session).
2. The library's provenance sections cite repo state at authoring —
   SCHEMA_VERSION moved 14→15 mid-authoring (talk step 1); spot-check
   those references before committing.

## Landmines
- Left alone on purpose: woodblock mentions in decisions bands /
  ui-design history notes (append-only record), roadmap T0-M1 DoD row
  (historical), and PRD `02-systems.md:1612` (in-fiction broadsheet
  genre, not a UI-bible claim).
- The 72-wrap hook flags cascade: splitting a long line pushes
  overflow into the merged next line — reflow the whole sentence
  block, not one line at a time.

---

# Entry 2 — the library lands (same session, resumed)

**Summary:** The 14-skill successor library is authored, reviewed
(3 lenses: factual / doctrine / usability — 35 findings, 2 BLOCKING),
fixed, spot-checked, and committed under `.claude/skills/kami-*`.
The human's Phase-1 rulings got their durable record.

## What changed
- `.claude/skills/kami-*/SKILL.md` (14 new skills, ~4,700 lines):
  change-control · debugging-playbook · failure-archaeology ·
  architecture-contract · domain-reference · config-and-flags ·
  build-and-env · verify-gates · extension-recipes · save-and-schema
  · narrative-grammar · balance-analysis-toolkit · research-frontier
  · cohesion-campaign. Audience: zero-context Opus-solo sessions
  (human ruling R2). Authored by a 14-agent workflow grounded in a
  15-agent discovery sweep; every fact re-verified in-repo (PH2).
- `project/feedback-human/2026-07-18-skill-library-rulings.md` — the
  durable record of the Phase-1 Q&A rulings (R1 cohesion steer
  verbatim, R2 audience, R3 slop-costliest, R4 graphics frontier)
  that four skills anchor on. The doctrine reviewer caught that
  these lived only in chat.

## Next intended steps
1. The cohesion campaign's first session locks the R1 steer as an
   ADR (noted in `kami-cohesion-campaign` provenance).
2. Residual uncertainty (labeled in-skill): bisect-in-worktree
   etiquette is derived, not mandated; e2e ~50s is doc-sourced, not
   re-measured; the narrative `## ask` grammar section notes the
   FB-415 work was landing mid-authoring — re-verify on first use.

## Landmines
- The review-link gate REDed tree-wide mid-landing on w7:p1's
  uncommitted `stamp-book` surface naming an unfiled HR-46 — NOT
  this session's red; pinged w7:p1 and waited rather than skipping
  (don't fight someone else's red).
- AGENTS.md sits at exactly its 500-line cap — any future edit there
  must displace, not add (bit this session; culled 4 lines).
