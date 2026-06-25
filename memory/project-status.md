---
name: project-status
description: Live one-screen snapshot — current state + how to resume
metadata:
  type: project
---

# Project status

> Keep this to one screen. Update it at the end of each session so a cold pickup is instant.

- **Game:** *Kamikakushi* — a grounded, story-driven **incremental RPG** in Edo-period rural Japan.
  Mediocre 17yo farmhand wakes amnesiac on a *goshi* estate; the village thinks the kami returned their
  lost child, but the truth is wholly human. Signature feature: **the UI itself unlocks incrementally**.
  No magic; growth only through perseverance. (See `docs/prd.md` + `brainstorms/`.)
- **Phase:** **Designing — PRD under section-by-section review.** §1 (vision/pillars/story) is **drafted
  and awaiting human review** (`docs/prd.md`); §§2–7 not yet drafted. **No game code or toolchain yet.**
- **Process (locked):** plan & review the *whole saga* PRD section-by-section, full-detail-upfront, before
  any building. Major design/story decisions are human-gated → ADRs.
- **Decisions locked:** ADRs **D-001…D-005** (grounded/no-magic; folk-mystery tone; mediocre-start;
  one grounded reset; title *Kamikakushi*) in `docs/history/decisions.md`.
- **Toolchain (proposed, not scaffolded):** Vite + TypeScript + Vitest; pure-core + thin DOM renderer;
  one seeded RNG; minimal-state versioned save; DEV play API. **Verify command:** {{not created yet}}.
- **How to resume:**
  1. Read the newest [`../journal/`](../journal/) entry (`2026-06-25-session-02.md`).
  2. Story canon = [`../brainstorms/2026-06-25-grounded-story-spine.md`](../brainstorms/2026-06-25-grounded-story-spine.md);
     mechanics = `…-mechanics-and-architecture-design.md`; research = `…-inspiration-and-genre-research.md`.
  3. Continue the **PRD §1 review** with the human, then draft §2→§7 in turn (lock ADRs per section).
- **Next decision needed from the human:** approve PRD **§1**; resolve open item **D-§1-e** (protagonist's
  true name — "Ren" flagged as faintly modern, e.g. *Tahei*; rename option; confirm male-fixed).
