# Session 207b — 2026-07-14 — skills brevity + correctness pass

**Summary:** follow-up to the session-207 skills audit: the human asked
for every skill optimized for brevity and correctness without behavior
change, reviewed one-by-one (diff → AskUserQuestion → apply). All 10
proposed diffs approved and applied; 6 skills judged already-minimal
and left untouched (distill-taste, map-sheets, prd-ripple, ship,
taste-scorecard, write-plan). Net −50 lines / −267+217 across 10
files. Frontmatter descriptions untouched everywhere (trigger
surface); ~100-char wrap kept (human's call — don't mass-retrofit).

## What changed

- `.claude/skills/battery/SKILL.md` — history/wave-tags cut; fixes:
  "Two→Three modes", "five→six artifacts", "H/HR→HD/HR-item".
- `.claude/skills/diverge/SKILL.md` — the big one. Stale-path fixes
  verified against the tree: `SURFACES` → `src/ui/dev-surfaces.ts`,
  alternates → `src/ui/dev/variant-renderers.ts`, defaults →
  `src/ui/render/<surface>.ts`; branch-model leftovers in the expiry
  section ("GC the branch"/screenshots) rewritten to DEV-panel
  reality. Then a human-prompted follow-up: the registry example now
  carries the REQUIRED `hr` + `rung` fields, HR-items cite stable ids
  (`Review → Variants → <id>`, ADR-192), and the review path goes
  through the Review tab (Variants half). Triple-stated flag-debt
  rule collapsed to once.
- `.claude/skills/narrative-diverge/SKILL.md` — step-7 history cut;
  human-prompted correction: review routes through the DEV panel's
  Review tab → Story half; bundles declare `hr:`+`rung:` in
  `bundle.md`; HR-items cite the bundle id (ADR-192).
- `.claude/skills/drain-inbox/SKILL.md` — lane rule deduped (was
  stated 3×), retired/historical notes cut, triage block folded under
  the Bug bullet; all protocol/commands/templates verbatim.
- `.claude/skills/prepare-to-exit/SKILL.md` — prose tightened;
  "Either→Any of these" fix (3 OOPS cases); banners byte-identical.
- `.claude/skills/grill-me/SKILL.md` — intro merge only.
- `.claude/skills/capture-game-states/SKILL.md` — three small dedups.
- `.claude/skills/prd-compress/SKILL.md` — three framing cuts.
- `.claude/skills/handoff/SKILL.md` — adaptation header compressed;
  upstream body untouched. (The audit's retire-handoff ask stays
  open — this doesn't preempt it.)
- `.claude/skills/tdd/SKILL.md` — adaptation header only; upstream
  body untouched (~1:1 provenance preserved).
- `project/audit/reports/2026-07-14-skills-audit.md` — postscript
  noting the pass landed (line counts in the report are pre-pass).

## Next intended steps

1. Human rules on the audit's 3 open asks (retire `handoff`? ·
   `battery` recommit-or-park? · `tdd` keep-or-fold) — from the
   reading-queue report.

## Landmines

- Skill frontmatter `description:` fields were deliberately NOT
  touched — they're the model-invocation trigger surface; rewording
  them changes when skills fire.
- The user's Claude Code UI drops a message that shares a turn with
  an AskUserQuestion box — the two-turn "show diff → user replies
  'ask' → box" flow is the workaround (memory updated).
- `prepare-to-exit`'s BYE/OOPS banners must stay byte-stable; the
  pass verified the diff contains no banner lines.
