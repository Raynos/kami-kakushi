# Decisions & questions (H-items)

**Open** design forks and questions only the human can close. IDs `H1…Hn`, never reused.
Status: 🔲 open · ⏳ waiting on Claude prep. (Closed items move to the archive — see below.)
`⛔ blocks <task>` marks a blocker.

## Lifecycle (where a resolved H-item goes)

1. The human answers (inline or in chat); mark it ✅ with the verdict.
2. **Graduate it:** a decision future-us needs the *rationale* for becomes an **ADR** in
   [`../../docs/living/decisions.md`](../../docs/living/decisions.md). A purely **mechanical / structural**
   item (e.g. a file split) skips the ADR — recording a no-op as an ADR only dilutes the log.
3. **Archive it:** add a one-line row to [`archive.md`](archive.md) (H# → ADR + date + intent link) and
   **remove it from this file** so this list stays open-items-only (it's what the session-brief hook scrapes).
4. Capture verbatim intent in [`../human-feedback/`](../human-feedback) and apply the decision to code/docs.

> Closed H-items: [`archive.md`](archive.md). The ADR log (the durable "why"):
> [`../../docs/living/decisions.md`](../../docs/living/decisions.md).

---

<!-- Format:
### H1 🔲 — {short title}
- **Question / fork:** {what needs deciding}
- **Options:** {A / B / C}
- **Recommendation:** {your best inference}
- **Resolution:** {filled in when the human answers — then graduate + archive per the lifecycle}
-->

### H13 🔲 — E-stage numbering collision (code E1–E4 vs design E0→E3 + parked E4–E5)
- **Question / fork:** v0.3.1 added a T0 **E4 "long-house"** koku sink (`estate.ts`,
  documented in §4.6.6d as the "E1–E4 ladder"). But the design-canon *condition*
  ladder (§1.5.1/§4.7.5/§7:86,118) is **E0 Foreclosure's Edge → E3 Prosperous**
  with **E4–E5 parked for T4+** — so a code-E4 now lives in T0 while §7 says E4
  is parked. Is the code's T0 E4 the same object as the design's parked E4, or a
  same-number-different-thing that needs disambiguating?
- **Options:** (A) they're distinct axes (purchase-step vs condition-stage) →
  rename one scheme to remove the clash; (B) fold the code E4 into the canon and
  un-park it, updating §7; (C) accept the overlap as harmless.
- **Recommendation:** **A** — the two schemes measure different things (a purchase
  ladder vs a narrative condition); a rename kills the ambiguity. Design-canon
  call, so left for you.
- **Resolution:** _(pending)_
