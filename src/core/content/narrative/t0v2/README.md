# t0v2 — the STAGED T0 prose wave (not compiled)

**Status: staged, NOT wired.** This directory holds the pre-authored
T0 prose for the story-bible build wave (ADR-150): per story unit,
three independent blind takes (ADR-139) plus a judge VERDICT; the
flavor layer as single law-compliant takes. `gen-narrative` does not
read this directory (its input list is explicit); no verify gate
touches it. The GAME plan (`docs/plans/fable-2026-07-07-storywave-game.md`)
migrates these into the live narrative sources + the DEV Story
switcher (grouped 1–3 buckets per rung); the human picks live in DEV
when the rewritten game ships.

Layout: `<unit>/take-{a,b,c}.md` + `<unit>/VERDICT.md` ·
`flavor/f{1,2}-*.md` + `flavor/VERDICT.md`. Units and the three
dramatic stances (the ledger / the held breath / the weather) are
defined in the plans' shared manifest.

Do not edit takes in place after the human review opens — a redline
becomes a new revision noted in the VERDICT.
