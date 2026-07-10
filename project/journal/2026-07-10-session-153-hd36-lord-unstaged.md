# Session 153 — 2026-07-10 — HD-36: the lord unstaged (R7 lines re-derived)

**Summary:** the human ruled HD-36 → **(a)**: canon holds, re-derive the two
R7 requirement flavor lines that staged {lord} Munemasa on-screen ("says from
the veranda") against the bible ("a voice through a wall, never met in T0").
Full ADR-139 diverge run: 3 blind takes → Pass-2 scorecards → self-pick
**Take B "the voice through the wall"** into canon → alternates DEV-only →
**HR-25** filed → HD-36 closed as **ADR-175**.

## The diverge

- **Pass-1 brief:** P3 speaker readable via {tokens} · P9 recognition follows
  the labor · P10 only established motifs · P13 diegetic completion lines ·
  V-canon (derived): Munemasa unstaged; felt-never-numbered; MC never
  named/quoted; epigram license Munemasa/Kihei only, his maxims fail upward.
- **Briefs (distinct dramatic choices):** A — the word comes down the wall
  (relayed via Genemon/Chiyo) · B — the voice through the wall (overheard,
  bodiless, unanswered) · C — the house answers for him (no lord at all;
  institutional testimony). Authored by 3 independent blind agents
  (session-model inherited).
- **Pass-2 full walks** (21 principles; applicable set P3/P9/P10/P13 + the
  two V-derived canon/legibility lines; P1–2, P4–8, P11–12, P14–21 n/a for a
  two-line req-flavor unit — no chrome, no layout, no routing change):
  - **A:** P3✔ P9✔ P10✔ P13✔ · V-canon ✔ borderline (the relayed maxim
    "fields have learned their own weather" nearly *lands*, where his maxims
    should fail; the day-book flattening partially absorbs it) · V-legible ✘
    [briefed] — the granary line ("no screen leaves the quiet rooms") is two
    inferences from the banked rice and centers Chiyo over the milestone. Not
    fixable without blunting the take's whole commit (transformed carriage) —
    ships as a named ✘ on the alternate. **5✔ · 1✘ · 15—**
  - **B:** P3✔ P9✔ P10✔ P13✔ · V-canon ✔ (heard-not-met is the bible's own
    image; the granary maxim fails ON-PAGE — "I had it once") · V-legible ✔
    ("the yard knows whose hours he means"). **6✔ · 0✘ · 15—**
  - **C:** P3✔ (speakerless narration has R4 precedent) P9✔ P10✔ P13✔ ·
    V-canon ✔ (absence absolute) · V-legible ✔ (plainest). **6✔ · 0✘ · 15—**
- **Pick:** B ties C; tie-break TST3 — R7's title ("Trusted of the house")
  needs the summit's notice, and B delivers it inside canon's device while
  pre-sounding the damaged voice T1's shoin capstone pays off. C withholds
  the lord entirely (deliberate, not a defect — a close second).

## What changed

- `src/core/content/narrative/requirements.md` — the two R7 `flavor:` lines
  → Take B; R7 comment carries HD-36 provenance; the stale G4.1 "(HD-30)"
  header flag repointed (HD-30 closed, verb-token pass still owed to
  G4.2/G4.3); the R3 fiction-gap pointer likewise unstale'd.
- `src/core/content/narrative/takes/hd36-lord-unstaged/` — NEW bundle:
  `bundle.md` + `take-a.md` (relayed) + `take-c.md` (lordless); canon is B.
- `src/core/content/requirements.gen.ts` · `src/ui/storyTakes.gen.ts` ·
  `docs/content/t0-story.md` — regenerated (`gen:narrative`, 13 open bundles).
- `project/human-in-the-loop/review.md` — **HR-25** filed (brief +
  per-take scorecards + live-review path).
- `project/human-in-the-loop/decisions.md` — HD-36 removed (open-only file).
- `project/human-in-the-loop/archive.md` — HD-36 row → ADR-175.
- `docs/living/decisions.md` — **ADR-175** (canon holds over shipped lines).
- `project/feedback-human/2026-07-10-hd36-decision.md` — verbatim intent.
- `project/status/project-status.md` — HD-36 mentions closed out.

## Next intended steps

1. HR-25 awaits the human's read (DEV → Story → hd36-lord-unstaged).
2. The G4.1 full verb-token re-derivation stays owed to the G4.2/G4.3
   registry chunk (tracked in `requirements.md`'s header note).

## Landmines

- The req-flavor DEV swap voices **future emissions only** — logged lines
  never rewrite (T2); reviewing HR-25 means playing a completion at R7, not
  scrolling history.
- `requirements.gen.ts` / `storyTakes.gen.ts` are generated — edit the `.md`
  sources, never the `.gen.ts` (the `gen-narrative` gate byte-compares).
