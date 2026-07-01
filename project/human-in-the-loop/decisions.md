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

### H11 🔲 — Battery #15: the T0 material-surplus sink (a 2nd craft recipe?) — a taste call caught between two locks

- **Question / fork:** After the one-time axe craft (`craft_wood_axe` = 3 hardwood + 1 sinew), combat
  keeps dropping hardwood/sinew that pile up **dead** (battery #15). The plan deferred "a 2nd craft
  recipe / material surplus" to Step 7 — but every form of it grazes a **lock**, so this is a taste
  call, not a solo pick:
  - A **2nd craftable weapon** breaks **D-052** (T0 showcases exactly **one** craftable weapon).
  - A **materials→koku sale** or a **materials-based repair** (mend the axe with looted hardwood/sinew
    instead of wood+koku) **loosens D-092** (koku just tightened — a new koku source / a koku-free
    repair path both cut against "scarce koku").
  - A **repeatable consumable** (e.g. a sinew field-poultice that heals HP, aiding the D-076 deadly
    grind) is the cleanest ONGOING sink that touches **neither** weapon-count nor koku — but it adds a
    small **consumable-item** system (T0 has none yet), which is itself a scope/taste question.
- **Options:** **(A)** consumable sink — a crafted heal/upkeep item from surplus materials (my pick:
  it's the only ongoing sink that dodges both locks; adds a minimal consumable slot); **(B)**
  drop-gating — foes simply stop dropping materials you can't use once the axe is forged (an
  engineering non-fix: no sink, but no dead pile either — respects every lock, adds nothing); **(C)**
  accept the surplus as fine for a *tutorial* (T0 shows the loot→craft *taste*; the real material
  economy is a T1+ concern — close #15 as "working as intended for a miniature").
- **Recommendation:** **(C) for T0, revisit at T1.** T0 is the showcase-in-miniature (D-052) — one
  craftable is the *point*; a full material economy (multiple recipes, consumables) is exactly what T1
  "scales into depth." Forcing an ongoing sink into the tutorial risks over-building the miniature. If
  you'd rather it bite now, **(A)**. (Held here rather than built because A and B both change T0's
  content taste, which is yours to lock — D-052/D-092.)
- **Resolution:** _(awaiting the human)_
