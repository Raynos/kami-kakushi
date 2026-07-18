# Human rulings — 2026-07-18 — successor skill library (Phase 1 Q&A)

Source: the skill-library build session (w8:p1, session 213). The
human answered the Phase-1 discovery questions in chat; this file is
the durable committed record the `.claude/skills/kami-*` library
anchors on (several skills cite these rulings by date — this is
their home).

### R1 · The hardest problem is COHESION, not FB-415 or T1
**Verbatim:** _"FB-415 is just a plan we are building its straight
forward. Building the T1 version of the game is doubling the content
and doubling the engine, but its not 'the hard problem'."_ And, on
what is: _"the campaign is multi fold, 'Graphics' but also 'A
coherent UI & game design' and 'Truly enjoyable high fun factor
idle/incremental game', a lot of shallow features were built in a
'checklist style, feature sponge, slop cannon' kind of way, but not
enough thought was built around building a cohesive whole, where the
story, the narrative, all the UI surface, the gameplay loop, it all
fits cleanly together and compounds on each other, everything exists
for a game purpose and a story purpose and its intertwined, and
every element is built for fun and gameplay and narrative reason. No
random gameplay features shoe horned in that dont do much just to
hit the mega feature checklist"_
**Reading:** the campaign target is the cohesive whole — every
shipped element must earn its place on ALL THREE axes (game purpose,
story purpose, fun purpose); a single failed axis is a finding.
**Home:** `kami-cohesion-campaign` is the executable runbook.

### R2 · Audience: same setup, Opus-class solo
**Ruling:** the library's consumer is an Opus-class solo session in
the current environment (herdr panes, shared tree, `:5264` dev-server
pane, human reviewing async) — not a standalone fresh-machine
assumption.

### R3 · Costliest historical failure class: slop/taste
**Ruling:** of the archaeology's incident classes (index sweeps,
dev-server saga, lying-ADR audit, gate rot, story reboot), the
slop/taste class cost the most. The library weights prevention
toward it (`kami-failure-archaeology` leads with it).

### R4 · Frontier ambition: game first — and graphics loudly
**Verbatim:** _"Both, game first, but also GRAPHICS GRAPHICS
GRAPHICS, ART, DIRECTION, ETC. UI POLISH, HUD POLISH."_
**Reading:** `kami-research-frontier` points ambition at the game
(fun certification, graphics/art direction under CSS-only Andon
Steel, narrative depth) with the process inventions as secondary,
write-up-able assets.

### R5 · Process: what-and-why paragraphs before building
**Ruling (mid-turn):** each proposed skill got a what-and-why
paragraph for review before authoring; the human then approved the
full 14-skill roster ("Go — build all 14").

### R6 · Stale canon: fix the sources
**Ruling:** on being shown the nine stale doc facts, the human said
_"Should we fix that?"_ → go. Landed as commit `919c2c61` (doc-sync;
`playtest.mjs` retired).
