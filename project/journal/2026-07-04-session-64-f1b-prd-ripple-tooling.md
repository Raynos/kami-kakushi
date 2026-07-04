# Session 64 — 2026-07-04 — F1b Ph2–Ph4: PRD ripple tooling (pilot region + 2 skills)

**Summary:** On the human's "Ph2 + Ph3/Ph4 skills" steer, built out F1b's
remainder (Ph1 `prd:drift` was already done 2026-07-03). Ph2: a `gen-prd-regions`
generator + gate that transcludes the §3 T0 rung titles from `RANKS` into the PRD
(RANKS drift 6/8 → 8/8, drift-proof by construction). Ph3: the `/prd-ripple` skill
(Flow 1) + an AGENTS.md pointer. Ph4: the `/prd-compress` skill (Flow 2, Fable-
routed, dormant) + a `tmp/` dry-run rehearsal. No new ADR (execution under D-117).

## What changed

**Ph2 — the pilot gen-region (the canon-touching one):**
- `src/scripts/gen-prd-regions.ts` (new) — consumes F1a's shared splicer
  (`gen-regions.ts`); generates a §3 region from `RANKS` (id · title · kanji),
  `--check` mode mirrors `gen-docs`/`checkpoint`. CLI guarded so the test can
  import the pure generator.
- `src/scripts/gen-prd-regions.test.ts` (new) — RED-able: fixtures derived from
  `RANKS` (not copied literals), one-row-per-rung, honest-framing, idempotence.
- `docs/living/prd/03-unlock-ladder.md` — inserted the `t0-rung-titles` marker
  pair in §3.2 (above the ladder table); filled it with the build's R0→R7 titles.
  **Framed honestly:** these are the *mechanical* titles; the §3.2 *narrative*
  titles (Stray / Bonded hand / …) reconcile to them via the R1-gated sweep.
- `src/scripts/gates.ts` — added the `gen-prd-regions` gate (now **15 gates**).
- `package.json` — `gen:prd-regions` + `:check` scripts.
- `project/status/working-agreements.md` — gate-roster region regenerated (14→15).

**Ph3 — `/prd-ripple` (Flow 1):**
- `.claude/skills/prd-ripple/SKILL.md` (new) — the four-way classify (balance /
  system-narrative / intent / frontier) + run `prd:drift` + clear the punch-list.
- `AGENTS.md` — a conventions pointer to the ripple/compress flows (under
  "Single source of truth").

**Ph4 — `/prd-compress` (Flow 2):**
- `.claude/skills/prd-compress/SKILL.md` (new) — the once-per-tier sweep,
  `disable-model-invocation`, Fable routing, the R1-closes guard, A15 discipline.
- `tmp/prd-compress-rehearsal/` (git-ignored) — the dry-run: §3.3 extracted
  verbatim (archive) + a compressed draft (588→298 words). Rehearsal only.

**Tracking:**
- `docs/plans/fable-process-F1b-prd-ripple-tooling.md` — Status → 🔧 IN-PROGRESS
  with Ph2–Ph4 build notes; Ph3 real-invocation DoD flagged open.
- `project/todo-human.md` — reading-queue F1b line updated to flag the canon diff.

## Verification
- `npm run verify` — green, **15 gates** in 4.69s (slowest: vitest).
- `npm run verify:budget` — median **4.47s**, 0.53s headroom under 5s.
- DoD RED-proof: a temp `RANKS` title edit turned `gen-prd-regions --check` RED;
  regen fixed it. `prd:drift` RANKS presence now **8/8**.

## Next intended steps
1. **Human:** read the §3.2 canon pilot diff (reading queue) + the two new skills.
2. Ph3's open DoD: fire a *real* `/prd-ripple` on the next built-system change.
3. When R1 (T0 taste review) closes → the real Flow-2 compression sweep (Fable).

## Landmines
- **Shared tree, session-63 active (R9 / Andon Steel).** I staged ONLY my own
  files by path. `project/status/project-status.md`, `docs/plans/README.md`,
  `decisions.md`, `review.md`, `archive.md`, `ui-demos/index.html` were left
  UNSTAGED — they carry session-63's WIP. My `npm run checkpoint` run regenerated
  the gate-roster into project-status.md too (14→15) but that file is entangled
  with their prose, so I left it for their commit; its gate-roster is fresh **on
  disk** (verify green), just not in my commit. **project-status.md still needs an
  F1b snapshot line** once the tree settles.
- The narrative-vs-mechanical rung-title divergence in §3 is REAL and expected —
  the pilot region does **not** reconcile it; that's the R1-gated sweep's job.
