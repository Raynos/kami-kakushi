# Playtest feedback — 2026-07-10 (async inbox capture, `work-actions` lane)

Cross-bucket cluster lane (ADR-171 regroup): one r0 + one r1 capture sharing
the work-actions fix surface, drained by the w6:p1 r0+dev pass.
Status legend: 🔲 open · 🔧 in progress · ✅ fixed · 🅿️ parked · 💬 needs-discussion.

### FB-334 · "+18 satiety" is not a player word — ✅
**Verbatim:** _"What the hell does it mean for rest to increase +18 satiety ? /
It should increase +18 stamina or whatever the unit of body is for doing
actions."_
**Reading:** the DEV action-detail hover card (FB-264/FB-299) leaked the
internal field name "satiety" in four lines (labour, rake, rest, eat-rice);
the visible meter is named **body**.
**Distilled rule:** UI copy names the unit by its on-screen meter name, never
the state field (TST4 — the player never guesses state).
**Fixed in:** this commit — all four card lines read "body"; the dev-cockpit
Balance lever labels keep the constant names (dev-facing, deliberately).
