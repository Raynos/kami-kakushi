# Decisions & questions (HD-items)

**Open** design forks and questions only the human can close. IDs
`HD-1…Hn`, never reused. Status: 🔲 open · ⏳ waiting on Claude prep.
(Closed items move to the archive — see below.) `⛔ blocks <task>`
marks a blocker.

> **Rung-tagged (2026-07-09)** — like [`review.md`](review.md), an
> open HD-item carries a `[rung]` tag (or `[cross-cutting]`) for the
> rung it concerns, so decisions track a rung-by-rung pass.
> _(Currently no open decisions — see below.)_

## Lifecycle (where a resolved HD-item goes)

1. The human answers (inline or in chat); mark it ✅ with the verdict.
2. **Graduate it:** a decision future-us needs the *rationale* for
   becomes an **ADR** in
   [`../../docs/living/decisions.md`](../../docs/living/decisions.md).
   A purely **mechanical / structural** item (e.g. a file split) skips
   the ADR — recording a no-op as an ADR only dilutes the log.
3. **Archive it:** add a one-line row to [`archive.md`](archive.md)
   (H# → ADR + date + intent link) and **remove it from this file** so
   this list stays open-items-only (it's what the session-brief hook
   scrapes).
4. Capture verbatim intent in
   [`../feedback-human/`](../feedback-human) and apply the decision to
   code/docs.

> Closed HD-items: [`archive.md`](archive.md). The ADR log (the
> durable "why"):
> [`../../docs/living/decisions.md`](../../docs/living/decisions.md).

---

<!-- Format:
### HD-1 🔲 — {short title}
- **Question / fork:** {what needs deciding}
- **Options:** {A / B / C}
- **Recommendation:** {your best inference}
- **Resolution:** {filled in when the human answers — then graduate +
  archive per the lifecycle}
-->

### HD-40 🔲 [R3 · cooking] — the kitchen-only pot costs R3 nine minutes. Which lever moves?

- **Waiting on:** you — pick a lever, (a)–(d) below, in chat. No DEV
  toggle for this one: it is a signed-band call ((d) = ship what runs
  today).
- **Context.** You picked **"kitchen-only cook"** for ADR-184: the
  pot hangs at the kitchen board (or over your own hearth once
  bought), so a hurt fighter walks back from the reeds to mend. It is
  what gives the kitchen threshold a verb instead of three people and
  a promise (FB-407). **It is built** — `cookLoci` / `canCookHere`
  (selectors.ts), the auto-loop's walk, the sim's, and the reducer
  gate — and turning it on is **one line** in `intents.ts`
  (`if (!canCookHere(next)) return state;`).
- **Why it is held.** The sim priced it, and the price is real:

  | | R3 wall-min | band [3, 25] (ADR-056) |
  |---|---|---|
  | cooking anywhere (shipped) | **22.7** | in band |
  | kitchen-only pot | **31.6** | **OUT by 6.6** |

  The cost is **pure walking**, and it is structural: every T0 foe is
  3–4 hops from the only pot (the reeds and the margins hang off the
  paddies; the kitchen hangs off the forecourt), and a fighter must
  mend between fights — mending hurt loses. I tried the obvious
  player-model fixes and they made it **worse**, not better: batching
  the greens before the walk bought 1 min; mending to two-thirds
  instead of full made the bot fight hurt, lose more, and pay MORE
  trips. R3 was already 22.7 of a 25 ceiling, so *any* cost blows it.
- **The fork — four ways out, all yours to pick:**
  - **(a) Re-sign the band.** Raise `T0_PACING_BAND_MAX` (25 → ~35)
    or make R3's ceiling its own number. R3 is the biggest rung in
    the game (combat opens, five kills, the night round, the labour).
    Cheapest to do; it is your signature (ADR-056), not mine.
  - **(b) Buy the walk back with a balance lever.** Raise
    `COOK_HP_RESTORE` (35) so a trip mends more, or cut R3's
    requirement counts (`requirements.md` — provisional by design).
    Both are sliders in the DEV Balance cockpit; you tune, I
    transcribe (ADR-134).
  - **(c) A second pot near the fighting.** New content: a
    watch-brazier at the kura (the grain-watch's post, opens at R3 —
    period-true, and it is where a hurt watchman already stands).
    Costs a narrative diverge; buys the siting at full price
    elsewhere.
  - **(d) Leave it as shipped.** The kitchen still earns its keep:
    `verb-cook` now reveals *with* `room-kitchen`, so cooking exists
    at all **only because O-Hisa taught you the pot** (TST3 — the
    fiction causes the mechanic). You just don't have to stand there.
    This is what is on `main` today.
- **⚠ 2026-07-13 addendum (session 202 — the ground moved):** the
  sickroom mend lane landed (ADR-164/197): **cook no longer mends HP
  at all** (belly-only; wounds mend at the sickroom), so the 31.6-min
  price above — measured when every mend trip walked to the pot — is
  **stale**. A fighter never needs the kitchen now; siting the pot
  there taxes only the *belly* loop. Also `T0_PACING_BAND_MAX` is
  already re-signed 25 → 28 (ADR-197), and lever (b)'s
  `COOK_HP_RESTORE` no longer exists. **Ask for a re-sim before
  picking** — (d)'s cost may have dropped to ~nothing.
- **Recommendation: (a), then reconsider (c) at T1.** The measurement
  says R3's ceiling is the thing that is wrong, not the siting — a
  rung that opens combat, blooding, two hunting grounds and a night
  round is not the same size as "walk to the woodlot and cut twenty
  trees", and one band for all eight rungs was always going to bind
  first here. If you'd rather not touch a signed number tonight,
  **(d) is a coherent ship** — it is what is running.
- **Resolution:** _(awaiting the human)_
