# Playtest feedback — 2026-07-11 (async inbox capture, `diverge` lane)

Source: the in-game capture inbox (`project/playtest-inbox/`), the **diverge**
bucket lane (1 open item). FB-stamped at capture time; no reserved block drawn.
Drained in the 2026-07-10→11 all-lanes parallel pass (ADR-171); human approved
the fix wholesale ("land all").
Status legend: 🔲 open · 🔧 in progress · ✅ fixed · 🅿️ parked · 💬 needs-discussion.

## The story reader (DEV → Story → Explore)

### FB-361 · SV9 canon column unreadable in the story reader — ✅
**Verbatim:** _"This diverge UI seems broken, for canon A I can't read the text
for the narrative."_
**Reading:** the Explore reader's Canon·A cell for the SV9 rake-cap bundle
showed the "— no take for this unit (canon plays) —" placeholder instead of the
canon line — the canon text was unreadable anywhere in the reader.
**Root cause:** the reader resolves a `flavor:` unit's canon only via the
generated `FLAVOR` registry, but this bundle's canon was the hand-written const
`RAKE_CAP_LINE` in `coldOpen.ts` — `rakeCapLine` was the one core-emitted
flavor unit absent from the registry.
**Fixed in:** `d6b75df1` — the canon string moved (byte-identical) into
`src/core/content/narrative/flavor.md` as `rakeCapLine`; `coldOpen.ts` now
defines `RAKE_CAP_LINE` from `FLAVOR.rakeCapLine`. The reader resolves canon
generically; no dev.ts change; the live-swap override path untouched.
**Distilled rule:** TST1 — a core-emitted fiction line has ONE home, the
narrative source registry; a hand-written const beside the registry is where
readers/tooling go blind.
