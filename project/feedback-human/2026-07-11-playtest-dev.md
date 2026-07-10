# Playtest feedback — 2026-07-11 (async inbox capture, `dev` lane)

Source: the in-game capture inbox (`project/playtest-inbox/`), the **dev**
bucket lane (1 open item). FB-stamped at capture time; no reserved block drawn.
Drained in the 2026-07-10→11 all-lanes parallel pass (ADR-171).
Status legend: 🔲 open · 🔧 in progress · ✅ fixed · 🅿️ parked · 💬 needs-discussion.

## The DEV Prototypes pane

### FB-364 · remove the T0 v2 map prototype now the T0 map is live — ✅
**Verbatim:** _"Now that the T0 map is wired into the game, can we remove the
T0 v2 map prototype ? ( We can leave the T1 / T2 map prototypes here )"_
**Reading:** a Question capture; triage found the button is a 3-line wrapper
around the same generic tier viewer T1/T2 use, and the blind-pass capture
script + map-authoring flow still ride that viewer — so "delete the prototype"
couldn't remove real code weight. Human ruling went further than the proposed
relabel: _"Remove the button, remove the ?t0-map-demo, remove the whole map
demo modal … we don't need the duplicate code."_
**Fixed in:** `fe944372` — the Prototypes-pane T0 button, the `?t0-map-demo`
boot param, and the `openT0V2Map` wrapper are gone; T1/T2 buttons + boot params
stay until their tiers ship. The QA capture path survives: `openTierMap` is
exported and `map-audit-shots.mjs` opens every tier through it, so the T0
blind-pass keeps working. Pointers updated (map-sheets SKILL.md, the module
README). Verified headless: boot param inert, T0 button gone, T1/T2 intact,
`openTierMap('T0')` still opens the viewer.
**Distilled rule:** when a DEV surface's job ships in the real game, retire the
DEV *entry points* but keep the shared engine QA rides on — remove doors, not
load-bearing walls (TST1).
