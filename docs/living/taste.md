---
name: taste
description: The taste standard — 4 values, the touchstones, and the distilled principles from the first playtest (F1–F117). Read before building any surface.
metadata:
  type: reference
---

# The taste standard

> **SNAPSHOT-CLASS — replace in place, never append. Hard cap: 150
> lines.** To add a line, displace a weaker one. The lossless evidence is
> `project/human-feedback/2026-07-02-playtest.md` (F1–F117) — examples
> live there; judgment lives here. Locked with the human (D-126).

Read this **before** building or restyling any surface, feature, or
narrative beat; score finished work against it (the F10 scorecard flow).
When no principle covers, **reason from the four values**.

## The four values

- **V1 · One home for everything.** Every capability, control, status,
  primitive, and token has exactly one canonical home — one tab per
  action, one shared primitive per idiom, one source per value.
  Duplication is drift; when something moves, delete the old copy.
- **V2 · Never yank the ground from under the player.** The surface being
  watched never flashes, resets, resizes, or rebuilds; scroll, focus, and
  in-flight animation survive every tick; even a crash reads composed.
- **V3 · The fiction causes the mechanics.** Nothing appears without a
  story reason; everything the story names exists in the game. The world
  is discovered, not spawned; the UI reveal follows the story beat.
- **V4 · The player never guesses state.** Who is speaking, what just
  changed, what is new, what was already tried, how far along anything
  is — all readable at a glance.

## Touchstones & references

- **GBA-era typewriter** (old-school Pokémon): slow char-by-char story
  text — the pacing IS the atmosphere. (F12/F19)
- **Old-school JRPG "learned" boxes** (FF7–FF10 feel): rewards as named
  perk unlocks with standalone descriptions. (F56)
- **Fallout-style dialogue tree**: ask questions first; decide when done
  questioning. (F47)
- **proto23** (<https://23html.github.io/>) — take the **chrome density**:
  the boxed panel-dashboard register; framed, dense, tiny-type panels.
- **yet-another-idle-rpg** (<https://miktaew.github.io/yet-another-idle-rpg/>)
  — take **many small visible progressions**: per-skill bars (level/cap +
  %), activity cards stating rate + ETA in plain numbers.
- Annotated shots: [`raw/screenshots/`](../../raw/screenshots).
  *(Woodblock/ink is [ui-design.md](ui-design.md)'s vision — provisional
  pending R9, not restated here.)*

## Principles

### I · One home (V1)

1. **One capability, one home — delete the old copy when it moves.**
   Never operable from two tabs; never kept as a "secondary cue".
   (F38 F92 F100 F107 F108 F112 F116)
2. **One primitive per idiom.** The typewriter, the fresh-entries
   divider, the palette + `--attr-*` pigments, the version string —
   extend the shared one, never fork a local variant. (F27 F39 F40 F46
   F66 F76 F104)
3. **Voice is set at the source.** Speaker + category set in pure-core;
   the renderer prefixes the name and colours by category — narration
   included. The NAME is the primary signal. (F23 F26 F50 F57 F88 F91)

### II · Solid ground (V2)

4. **Render append-only.** Patch/append nodes; never wholesale-reset a
   container (`innerHTML`/`textContent`) on a state change — the root
   cause of the flash/wipe/resize defect cluster. (F55 F60 F78 F81–F84)
5. **Frames are stable.** Interactive cards are fixed-size (content
   scrolls inside), columns persist, phase swaps happen in place; a
   choice never hides or rebuilds its own surface. (F63 F79 F80 F84)
6. **Complete or absent.** A revealed panel is fully painted at every
   width — no ghost meter boxes, no controls overlapping their own text,
   no clipped stacks. (F63 F67 F72 F94 F98)
7. **Reading comfort scales text only, and persists.** A−/A+ multiplies
   the type tokens, never the rem unit; layout must not reflow under the
   reader. (F30 F74)
8. **A crash is a composed screen.** A caught render error shows a
   full-viewport, in-palette error modal (progress saved + reload) —
   never a banner over a broken page. (F60 F61)

### III · Story-first (V3)

9. **Discover, don't spawn.** NPCs, vendors, panels, rungs arrive via a
   beat; story-significant interactive NPCs get the full-screen VN intro
   (D-104); a rung-up is a PLAYER-INITIATED VN beat motivating each
   unlock — never a silent number-fill. (F45 F97 F99 F103)
10. **Story promises are contracts.** A named thing (a home, a bowl, the
    room you woke in) exists and stays reachable; established characters
    stay talkable, never consumed by their intro. (F89 F110 F113)
11. **Dialogue is an interactive VN.** Beat-by-beat; ask-topics → an
    explicit done-gate → the decision; every choice resolves in place —
    your line, the reply, one Continue. Never a wall, never a silent
    scene-cut. (F13 F47 F62 F64 F65)
12. **The one typewriter contract.** Char-by-char, left-aligned,
    auto-advancing (~2s); a click completes the line — never skips the
    block, never pauses; EVERY fragment types on first appearance; story
    scope only; reduced-motion → instant. (F12 F19 F54 F62 F82 F83 F86)
13. **Rewards are diegetic.** A named perk + a standalone description
    (readable later without the scene) + the mechanics as context — the
    JRPG learned-box, in-palette; never a bare ±stat dump. (F42 F56)
14. **The reveal is the signature.** A full-screen scene hides the whole
    shell; the UI inks in after, once, while the player watches; the live
    scene owns animation — the log paints history instantly; a sparse
    early screen is correct. (F11 F14 F15 F44 F48 F55)
15. **The map doesn't spoil.** A node = current-location flavour + terse
    navigation (no next-zone hints, no destination preview — click the
    card; arrival updates the flavour) + who's here to talk to. Vendors
    are people at nodes, not inline shop menus. (F102 F109 F110 F114)

### IV · Legible state (V4)

16. **Route by narrative weight.** Story = mandatory beats · Chat =
    optional Q&A · Progress = earned (a scene's stat-grant LINE is
    Progress; its prose is Story) · Combat · Work = notable · Now =
    fleeting (wall-clock expiry even unwatched; fade + slide up); tabs
    by importance. (F9 F41 F52 F53 F58 F103 F111 F114 F115)
17. **Controls advertise their state.** Active choice highlighted;
    explored options dimmed (≠ disabled); off-view channels badged unread,
    cleared on visit; loaded history is SEEN. (F20 F21 F49 F59 F87)
18. **Transcripts read effortlessly.** Stick to the bottom (land there
    on tab switch); text fills the real column width, scrollbar at the
    true edge; a clean fade under headers; the shared fresh-divider marks
    arrivals; smooth scroll. (F7 F27 F28 F51 F76 F77 F85)

### V · Form & density

19. **Two registers, never one scale.** Chrome is tight and
    information-dense (the proto23 register); reading and ceremony (log,
    story, intro, modals, cold-open) breathe. A global "compact it" pass
    is always wrong. (F10 F14 F29 F73 F98)
20. **A viewport-fixed dashboard, log bounded.** 100dvh, pinned header
    (vitals + the rung top-right, hover detail) + footer, no page
    scrollbar, panes scroll internally; destination 5–7 panels unlocked
    over time; the log right-placed at ⅓–~46% of the CAPPED container
    (never raw `vw`), framed with gutters — the work fold holds the
    majority. (F5 F6 F8 F37 F69 F70 F106 F116 F117)
21. **App-info is organized.** Settings / Saves / About sub-tabs; the
    single-sourced footer version is clickable → About → CHANGELOG.
    (F31 F104 F105)

## Scope

Game-systems taste (distinct resources, distinct recovery loops — F22;
balance; mechanic shapes) → [prd.md](prd.md) + ADRs. The **workshop bar**
(DEV-tooling ergonomics) → [qa-playtesting.md](qa-playtesting.md) §9. The
pre-ship checklist is the F10 scorecard flow — not a section here.
