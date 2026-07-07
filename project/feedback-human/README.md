# feedback-human/

The human's **direct feedback** to the agent — captured as it's given so nothing is lost. This is the live
inbox; the agent triages each item → fixes it (logging the commit) or routes a design decision to an ADR.

- **Live feedback** — one file per session, dated, e.g.
  [`2026-06-27-playtest.md`](2026-06-27-playtest.md) (the first manual playthrough). Each item gets an ID +
  a status (🔲 open · 🔧 in progress · ✅ fixed · 🅿️ parked · 💬 needs-discussion) + the fix commit.
- **Closed records** — completed feedback stays alongside the live files, kept for the trail. E.g.
  [`2026-06-26-prd-human-feedback.md`](2026-06-26-prd-human-feedback.md) — the full PRD-building feedback log
  (Blocks A–N), now applied to the PRD (V2.2) and closed.

**Routing.** Bugs / UX / feel / visual / polish → logged here & fixed. Anything that changes *what the game
is* (a design decision) → ALSO recorded as an ADR
([`../docs/living/decisions.md`](../../docs/living/decisions.md)) and confirmed with the human before it's
treated as canon; distilled design steering may graduate into the living design docs
([`../docs/living/`](../../docs/living)).

Related queue: [`../human-in-the-loop/`](../human-in-the-loop) (decisions `H`-items + review `R`-items the
human must action).
