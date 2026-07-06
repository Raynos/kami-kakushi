# Session 95 — 2026-07-06 — story/narrative/world LLM-slop audit (Fable)

**Summary:** The human asked (in-session, matching the standing TODO "kick off
a fable audit of story & narrative") for a review of the story, narrative and
world as written in docs & src, worried it reads as LLM slop. Ran the audit
directly in this Fable session — read all four narrative sources, the full PRD
§5 T0→T5 arc, and every fiction-voiced string in the content registries — and
wrote the findings as a durable report:
`project/audit/reports/2026-07-06-story-narrative-slop-audit.md` (queued for
the human).

## What changed

- `project/audit/reports/2026-07-06-story-narrative-slop-audit.md` — NEW.
  Verdict: the world *architecture* (belief→cause discipline, the
  Otsuru/not-Tama twist, debt-as-antagonist, partial justice, the mediated
  ending) is emphatically not slop and should be protected; the line-level
  prose carries a real LLM accent (epigram saturation across all voices, the
  copy-pasted "…" react, nine one-template perks, near-verbatim
  self-duplication, mechanics ventriloquism in R6/R7); plus three canon
  breaks that outrank style: the wolf carcass-vs-bolted contradiction
  (rung-beats R3 vs log-content/enemies), Kihei's "soldier in you"
  innate-talent flattery violating the locked talent-foil rule (his creed is
  never stated on-screen), and the PRD's shame→begging arc inverted into a
  headhunt. Deepest structural finding: T0's social physics is a "fairness
  machine" (seven identical promotion scenes, moral-thermometer decide menus,
  Naoyuki never staged). §5 of the report is a prioritized brief that feeds
  the second TODO ("fable redesign of the story beats") via ADR-139
  narrative-diverge.
- `project/todo-human.md` — added the report to the reading queue (same
  commit, per the queue rule).

## Next intended steps

1. Human reads the report (reading queue) — it doubles as input to the open
   HR-8 review (rung-up cast + R0→R7 beats).
2. The queued "fable redesign of the story beats" should start from the
   report's §5 priority list (canon repairs first, then the unfairness beat,
   voice bible, perk rewrite) — narrative-diverge (ADR-139) is the vehicle;
   nothing was rewritten in this session on purpose (audit only, per the ask).

## Landmines

- The report's §2 canon breaks cite exact file:lines in `rung-beats.md`,
  `log-content.ts`, `enemies.ts` — line numbers will drift if those files are
  edited before the redesign picks this up; the quotes are verbatim, so grep
  recovers them.
- Do NOT mechanical-fix the fiction-voiced findings outside ADR-139: only
  pure continuity syncs are exempt from the 3-takes rule.

## Addendum — the reimagining detour + the locked decision pass

Same session, after the audit landed. The human asked for up to five
concept-scale reimaginings; five blind Fable authors were launched
(concept-level narrative-diverge) and then **killed on the human's order** —
the take briefs read as framing devices, not better story ("I just want the
actual story to be better"). The rejected brief file sits uncommitted at
`project/brainstorms/2026-07-06-concept-reimaginings/00-brief.md` (an rm was
permission-denied; delete freely).

Pivoted to a zoomed-out umbrella plan
(`docs/plans/fable-2026-07-06-story-quality-ladder.md`) framing everything
unapproved as a decision, then ran the human through all 19 via
AskUserQuestion. **All answered**; the plan's §1 carries the verbatim answer
sheet (notably REJECTED: cast-wants principle, rungs-as-access/contested
promotions, day-places + calendar arrivals; ADOPTED: suspicion beat, Naoyuki
ally-never-warm, tiers-as-circles, without-you lines, map-with-pressure,
story-bible at docs/living/story-bible.md, epigram license Shigemasa+Sōan,
co-write bible / diverge prose). **No ADR minted — the human's explicit
call:** the ADR is pulled from the plan's §1 only when the plan itself is
approved (an ADR-144 draft was briefly added to decisions.md and reverted
in the same session, uncommitted).

### Next intended steps (supersedes the list above)

1. Human reads/approves the umbrella plan (queued) → mint the ADR from its
   §1 → Phase 1 session one: co-write the story-bible **cast sheet** in-chat
   → lock → `docs/living/story-bible.md`.
2. Phase 2 prose wave per the plan's five bundles (ADR-139 diverge; R1–R3
   bundle carries the canon repairs + the suspicion beat).
3. Audit queue entry cleared (discussed at length = implicit sign-off,
   ADR-089); the plan is queued in its place. HR-8 deliberately kept open.
