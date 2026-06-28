# Reviews (R-items)

Things needing a human's judgment that an automated check can't make — playtest feel, look, tone,
pacing. IDs `R1…Rn`, never reused. Status: 🔲 open · ⏳ waiting on Claude prep · ✅ done.

---

<!-- Format:
### R1 🔲 — {what to review}
- **Asking for:** {the specific verdict needed}
- **How to look:** {dev URL / screenshot / steps to reproduce}
- **Verdict:** {filled in by the human}
-->

### R1 🔲 — the M0–M2 demo: fun, pacing & look (the first human play/taste call)

- **Asking for:** the higher-level **fun & visual-taste verdict** on the playable T0 slice — does the
  cold open hook? does the reveal cadence (UI inking in) feel good? is the labour→wolf→combat arc paced
  and fun? does it look like an intentional woodblock game (not AI-slop)? Anything that breaks the spell.
- **How to look:** `npm run dev` → open the local URL and play (cold open → rake → labour to the rungs →
  face the wolf → combat). Or skim the gallery in [`audit/screens/`](../audit/screens)
  (`latest/qa-01…10-*.png`, `2026-06-27-log-cascade/log-cascade-*.png`,
  `2026-06-27-settings/settings-*.png`). The agent has self-vetted it against `ui-design.md`; this is the
  taste call the proxies + the agent's own review inform but can't replace.
- **Verdict:** _(awaiting the human)_

