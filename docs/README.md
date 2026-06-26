# docs/

Design docs live here — **living documents**, each the *current* truth for its concern, edited **in
place** (no stale "v2" copies; the *why* of a change goes to a journal entry).

The single living PRD is **[`prd.md`](prd.md)** — one coherent document (top-matter + §§1–7, authored
section by section). It is the current truth for the game's design; edit it in place.

Likely future additions:

- `design/` — the living design surfaces (game design, architecture, progression, story).

**The docs-explosion is deferred.** That `design/` split — the "freeze `prd.md`, explode into living docs" plan ([history/decisions.md](history/decisions.md), D-020) — is **refined by D-021**: don't explode yet. Build M0+M1 against the *current* `prd.md` (the single source above), then reorganise **once**, later, on ground that has survived play. When the split happens (post-M0/M1 playtest) it freezes **only** the §1 vision + the locked human constraints + the human-signed acceptance targets, as a tagged snapshot; the §7 milestone roadmap becomes a **living** `roadmap.md` (banner: *"M0–M1 committed; M2–M7 provisional, re-planned after each playtest"*) and the §4 balance numbers become **generated** `content/` tables (re-tuned after each playtest). M2–M7 are **never** frozen as locked canon.

The **[history/](history/)** subfolder already exists: it holds the **ADR log**
([history/decisions.md](history/decisions.md)) — *why* decisions were made (not current state).

Keep it **Markdown only**; runnable tools and game code live under `src/` / `scripts/`.
