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


### H23 🔲 — R3 Battered blade with no visible mend path (s88 e2e finding)
- **Question / fork:** `verb-repair` reveals at R4 by design (`ranks.ts:150`),
  so an R3 player can hold a Battered blade — win-rate visibly sagging — with
  no mend CTA on any surface. Intended tension, or a stranding?
- **Options:** A) intended — the R4 unlock IS the payoff, leave it · B) reveal
  the repair verb earlier (R3) · C) keep the R4 gate but add a legible hint at
  R3 ("the smith at the woodlot could mend this — not yet yours to ask").
- **Recommendation:** C — keeps the D-110 unlock cadence, kills the "is this a
  bug?" read (T4: the player never guesses state).
- **Resolution:** _(open)_

### H24 🔲 — fresh-profile save import sits behind the whole intro (s88 e2e finding)
- **Question / fork:** Settings (→ Saves → Import) lives in the shell footer,
  which a brand-new device/profile only reaches AFTER playing the full intro
  VN — a returning player restoring a save must replay it first.
- **Options:** A) fine — importing on a new device is rare · B) a small
  "restore a save" affordance on the cold-open card · C) make the intro
  skippable once any save code is pasted (import-first flow).
- **Recommendation:** B — one quiet line under the wake verb; no new surface,
  honours T3 (the fiction still opens the game for genuinely-new players).
- **Resolution:** _(open)_
