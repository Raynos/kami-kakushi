# Playtest feedback — 2026-07-10 (async inbox capture, `vn-overlay` lane)

Cross-bucket cluster lane (ADR-171 regroup): the cold-open capture sharing the
vn-overlay fix surface with two r0 captures, drained by the w6:p1 r0+dev pass.
Status legend: 🔲 open · 🔧 in progress · ✅ fixed · 🅿️ parked · 💬 needs-discussion.

### FB-360 · "i cant click continue lol" — ✅
**Verbatim:** _"i cant click continue lol"_
**Reading:** the third leg of the FB-358/FB-359 cascade: the Continue the human
clicked belonged to a STALE VN scene left mounted after the New game swap to a
pre-awake state (the capture's save is a fresh pre-awake run). Its dispatch
(`choose_intro`) is refused by the pre-awake reducer, so the button is dead by
construction — the bug is the overlay surviving, not the button.
**Fixed in:** this commit (with FB-359) — the pre-awake render branch now tears
the VN scene down, so no dead Continue can survive a New game.
