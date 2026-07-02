# UI-v2 prototypes — seven framings for what the screen IS

Standalone, mock-data UI direction probes for kami-kakushi's UI rethink
(2026-07-02, Fable session). **No game logic; nothing imports the core;
`src/` untouched.** Each file is fully self-contained (no network) — open it
straight from disk, or open [`index.html`](index.html) for the gallery.

The diagnosis these answer: the current UI is a *document about the world*
(header + tabs + log column + buttons — the shape every AI text-RPG one-shot
produces). Each prototype instead commits to an ontology — a thing the
screen IS — and executes it with the game's real copy and numbers.

| # | File | The screen is… | Signature move |
|---|------|----------------|----------------|
| 01 | `01-sugoroku.html` | a *shusse sugoroku* promotion board (real Edo print genre) | the koma hop; the board spirals **outward** — no goal square, the world widens |
| 02 | `02-printshop.html` | a nishiki-e print still being printed | unlocks arrive as **colour plates** (baren stroke); locked UI = inkless blind-emboss |
| 03 | `03-cutaway.html` | a carpenter's cross-section of the living house | **rooms are the menus**; repairs are visible carpentry; the house is the progress bar |
| 04 | `04-daifukucho.html` | the steward's desk seen from above | stamp → receipt slip → soroban beads → ink; the seasonal **audit** |
| 05 | `05-stage.html` | a staged sumi-e theatre with the cast on stage | **Entrance & Address** — the granter walks into frame; ceremony text hangs vertical in the sky |
| 06 | `06-kura.html` | the storehouse your wealth physically fills | the **Hundred-Mon Knot** — coins string, swing, knot at 100, hang on pegs |
| 07 | `07-kagee.html` | the guard-post shoji wall — the world only as **shadows** | fight the silhouette, then own its shape: the bestiary as a sharpening shadow-album |

Every prototype loads into the same **hour-three** state, alive and ticking,
and answers the same demo beats via a uniform dev strip (bottom-right):
tick · fight · rung · judge · reveal · season · auto · reset · stage jumps
(minute-one / hour-three / hour-ten). The **minute-one** stage shows each
frame's cold open — one verb against the dark — and how the UI inks itself
into existence (the game's UI-as-progression signature).

Design docs: [`briefs/`](briefs/) holds each concept's full brief, the shared
[`DATA.md`](briefs/DATA.md) mock-data pack (real rungs, enemies, ceremony
copy) and [`SPEC.md`](briefs/SPEC.md) build contract.
`briefs/99-wildcard-emaki-not-built.md` is the eighth concept (the
handscroll) — independently re-derived by an unseeded wildcard agent but not
built, since an earlier (discarded) exploration also proposed it; kept for
the record and easy to build if wanted.

Provenance: concepts were derived independently in this session (an earlier
Opus exploration brief was deleted as tainted; nothing here descends from
it). Working log: `project/brainstorms/2026-07-02-ui-v2-fable-session.md`.
