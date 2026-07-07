---
name: taste
description: The taste standard — 4 values, the touchstones, and the distilled principles from the first playtest (FB-1–FB-117). Read before building any surface.
metadata:
  type: reference
---

# The taste standard

> **SNAPSHOT-CLASS — replace in place, never append. Hard cap: 150
> lines.** To add a line, displace a weaker one. The lossless evidence is
> `project/feedback-human/2026-07-02-playtest.md` (FB-1–FB-117) — examples
> live there; judgment lives here. Locked with the human (ADR-126).

Read this **before** building or restyling any surface, feature, or
narrative beat; score finished work against it (the FB-10 scorecard flow).
When no principle covers, **reason from the four values**.

## The four values

- **TST1 · One home for everything.** Every capability, control, status,
  primitive, and token has exactly one canonical home — one tab per
  action, one shared primitive per idiom, one source per value.
  Duplication is drift; when something moves, delete the old copy.
- **TST2 · Never yank the ground from under the player.** The surface being
  watched never flashes, resets, resizes, or rebuilds; scroll, focus, and
  in-flight animation survive every tick; even a crash reads composed.
- **TST3 · The fiction causes the mechanics.** Nothing appears without a
  story reason; everything the story names exists in the game. The world
  is discovered, not spawned; the UI reveal follows the story beat.
- **TST4 · The player never guesses state.** Who is speaking, what just
  changed, what is new, what was already tried, how far along anything
  is — all readable at a glance.

## Touchstones & references

- **GBA-era typewriter** (old-school Pokémon): slow char-by-char story
  text — the pacing IS the atmosphere. (FB-12/FB-19)
- **Old-school JRPG "learned" boxes** (FF7–FF10 feel): rewards as named
  perk unlocks with standalone descriptions. (FB-56)
- **Fallout-style dialogue tree**: ask questions first; decide when done
  questioning. (FB-47)
- **proto23** (<https://23html.github.io/>) — take the **chrome density**:
  the boxed panel-dashboard register; framed, dense, tiny-type panels.
- **yet-another-idle-rpg** (<https://miktaew.github.io/yet-another-idle-rpg/>)
  — take **many small visible progressions**: per-skill bars (level/cap +
  %), activity cards stating rate + ETA in plain numbers.
- Annotated shots: [`raw/screenshots/`](../../raw/screenshots).
  *(Woodblock/ink is [ui-design.md](ui-design.md)'s vision — provisional
  pending R9, not restated here.)*

## Principles

### I · One home (TST1)

1. **One capability, one home — delete the old copy when it moves.**
   Never operable from two tabs; never kept as a "secondary cue".
   (FB-38 FB-92 FB-100 FB-107 FB-108 FB-112 FB-116)
2. **One primitive per idiom.** The typewriter, the fresh-entries
   divider, the palette + `--attr-*` pigments, the version string —
   extend the shared one, never fork a local variant. (FB-27 FB-39 FB-40 FB-46
   FB-66 FB-76 FB-104)
3. **Voice is set at the source.** Speaker + category set in pure-core;
   the renderer prefixes the name and colours by category — narration
   included. The NAME is the primary signal. (FB-23 FB-26 FB-50 FB-57 FB-88 FB-91)

### II · Solid ground (TST2)

4. **Render append-only.** Patch/append nodes; never wholesale-reset a
   container (`innerHTML`/`textContent`) on a state change — the root
   cause of the flash/wipe/resize defect cluster. (FB-55 FB-60 FB-78 FB-81–FB-84)
5. **Frames are stable.** Interactive cards are fixed-size (content
   scrolls inside), columns persist, phase swaps happen in place; a
   choice never hides or rebuilds its own surface. (FB-63 FB-79 FB-80 FB-84)
6. **Complete or absent.** A revealed panel is fully painted at every
   width — no ghost meter boxes, no controls overlapping their own text,
   no clipped stacks. (FB-63 FB-67 FB-72 FB-94 FB-98)
7. **Reading comfort scales text only, and persists.** A−/A+ multiplies
   the type tokens, never the rem unit; layout must not reflow under the
   reader. (FB-30 FB-74)
8. **A crash is a composed screen.** A caught render error shows a
   full-viewport, in-palette error modal (progress saved + reload) —
   never a banner over a broken page. (FB-60 FB-61)

### III · Story-first (TST3)

9. **Discover, don't spawn.** NPCs, vendors, panels, rungs arrive via a
   beat; story-significant interactive NPCs get the full-screen VN intro
   (ADR-104); a rung-up is a PLAYER-INITIATED VN beat motivating each
   unlock — never a silent number-fill. (FB-45 FB-97 FB-99 FB-103)
10. **Story promises are contracts.** A named thing (a home, a bowl, the
    room you woke in) exists and stays reachable; established characters
    stay talkable, never consumed by their intro. (FB-89 FB-110 FB-113)
11. **Dialogue is an interactive VN.** Beat-by-beat; ask-topics → an
    explicit done-gate → the decision; every choice resolves in place —
    your line, the reply, one Continue. Never a wall, never a silent
    scene-cut. (FB-13 FB-47 FB-62 FB-64 FB-65)
12. **The one typewriter contract.** Char-by-char, left-aligned,
    auto-advancing (~2s); a click completes the line — never skips the
    block, never pauses; EVERY fragment types on first appearance; story
    scope only; reduced-motion → instant. (FB-12 FB-19 FB-54 FB-62 FB-82 FB-83 FB-86)
13. **Rewards are diegetic.** A named perk + a standalone description
    (readable later without the scene) + the mechanics as context — the
    JRPG learned-box, in-palette; never a bare ±stat dump. (FB-42 FB-56)
14. **The reveal is the signature.** A full-screen scene hides the whole
    shell; the UI inks in after, once, while the player watches; the live
    scene owns animation — the log paints history instantly; a sparse
    early screen is correct. (FB-11 FB-14 FB-15 FB-44 FB-48 FB-55)
15. **The map doesn't spoil.** A node = current-location flavour + terse
    navigation (no next-zone hints, no destination preview — click the
    card; arrival updates the flavour) + who's here to talk to. Vendors
    are people at nodes, not inline shop menus. (FB-102 FB-109 FB-110 FB-114)

### IV · Legible state (TST4)

16. **Route by narrative weight.** Story = mandatory beats · Chat =
    optional Q&A · Progress = earned (a scene's stat-grant LINE is
    Progress; its prose is Story) · Combat · Work = notable · Now =
    fleeting (wall-clock expiry even unwatched; fade + slide up); tabs
    by importance. (FB-9 FB-41 FB-52 FB-53 FB-58 FB-103 FB-111 FB-114 FB-115)
17. **Controls advertise their state.** Active choice highlighted;
    explored options dimmed (≠ disabled); off-view channels badged unread,
    cleared on visit; loaded history is SEEN. (FB-20 FB-21 FB-49 FB-59 FB-87)
18. **Transcripts read effortlessly.** Stick to the bottom (land there
    on tab switch); text fills the real column width, scrollbar at the
    true edge; a clean fade under headers; the shared fresh-divider marks
    arrivals; smooth scroll. (FB-7 FB-27 FB-28 FB-51 FB-76 FB-77 FB-85)

### V · Form & density

19. **Two registers, never one scale.** Chrome is tight and
    information-dense (the proto23 register); reading and ceremony (log,
    story, intro, modals, cold-open) breathe. A global "compact it" pass
    is always wrong. (FB-10 FB-14 FB-29 FB-73 FB-98)
20. **A viewport-fixed dashboard, log bounded.** 100dvh, pinned header
    (vitals + the rung top-right, hover detail) + footer, no page
    scrollbar, panes scroll internally; destination 5–7 panels unlocked
    over time; the log right-placed at ⅓–~46% of the CAPPED container
    (never raw `vw`), framed with gutters — the work fold holds the
    majority. (FB-5 FB-6 FB-8 FB-37 FB-69 FB-70 FB-106 FB-116 FB-117)
21. **App-info is organized.** Settings / Saves / About sub-tabs; the
    single-sourced footer version is clickable → About → CHANGELOG.
    (FB-31 FB-104 FB-105)

## Scope

Game-systems taste (distinct resources, distinct recovery loops — FB-22;
balance; mechanic shapes) → [prd.md](prd.md) + ADRs. The **workshop bar**
(DEV-tooling ergonomics) → [qa-playtesting.md](../guides/qa-playtesting.md) §9. The
pre-ship checklist is the FB-10 scorecard flow — not a section here.
