# Decisions & questions (HD-items)

**Open** design forks and questions only the human can close. IDs `HD-1…Hn`, never reused.
Status: 🔲 open · ⏳ waiting on Claude prep. (Closed items move to the archive — see below.)
`⛔ blocks <task>` marks a blocker.

> **Rung-tagged (2026-07-09)** — like [`review.md`](review.md), an open HD-item carries a
> `[rung]` tag (or `[cross-cutting]`) for the rung it concerns, so decisions track a
> rung-by-rung pass. _(Currently no open decisions — see below.)_

## Lifecycle (where a resolved HD-item goes)

1. The human answers (inline or in chat); mark it ✅ with the verdict.
2. **Graduate it:** a decision future-us needs the *rationale* for becomes an **ADR** in
   [`../../docs/living/decisions.md`](../../docs/living/decisions.md). A purely **mechanical / structural**
   item (e.g. a file split) skips the ADR — recording a no-op as an ADR only dilutes the log.
3. **Archive it:** add a one-line row to [`archive.md`](archive.md) (H# → ADR + date + intent link) and
   **remove it from this file** so this list stays open-items-only (it's what the session-brief hook scrapes).
4. Capture verbatim intent in [`../feedback-human/`](../feedback-human) and apply the decision to code/docs.

> Closed HD-items: [`archive.md`](archive.md). The ADR log (the durable "why"):
> [`../../docs/living/decisions.md`](../../docs/living/decisions.md).

---

<!-- Format:
### HD-1 🔲 — {short title}
- **Question / fork:** {what needs deciding}
- **Options:** {A / B / C}
- **Recommendation:** {your best inference}
- **Resolution:** {filled in when the human answers — then graduate + archive per the lifecycle}
-->

### HD-40 🔲 [R3 · cooking] — the kitchen-only pot costs R3 nine minutes. Which lever moves?

- **Context.** You picked **"kitchen-only cook"** for ADR-184: the pot hangs at the
  kitchen board (or over your own hearth once bought), so a hurt fighter walks back
  from the reeds to mend. It is what gives the kitchen threshold a verb instead of
  three people and a promise (FB-407). **It is built** — `cookLoci` / `canCookHere`
  (selectors.ts), the auto-loop's walk, the sim's, and the reducer gate — and turning
  it on is **one line** in `intents.ts` (`if (!canCookHere(next)) return state;`).
- **Why it is held.** The sim priced it, and the price is real:

  | | R3 wall-min | band [3, 25] (ADR-056) |
  |---|---|---|
  | cooking anywhere (shipped) | **22.7** | in band |
  | kitchen-only pot | **31.6** | **OUT by 6.6** |

  The cost is **pure walking**, and it is structural: every T0 foe is 3–4 hops from
  the only pot (the reeds and the margins hang off the paddies; the kitchen hangs off
  the forecourt), and a fighter must mend between fights — mending hurt loses. I tried
  the obvious player-model fixes and they made it **worse**, not better: batching the
  greens before the walk bought 1 min; mending to two-thirds instead of full made the
  bot fight hurt, lose more, and pay MORE trips. R3 was already 22.7 of a 25 ceiling,
  so *any* cost blows it.
- **The fork — four ways out, all yours to pick:**
  - **(a) Re-sign the band.** Raise `T0_PACING_BAND_MAX` (25 → ~35) or make R3's ceiling
    its own number. R3 is the biggest rung in the game (combat opens, five kills, the
    night round, the labour). Cheapest to do; it is your signature (ADR-056), not mine.
  - **(b) Buy the walk back with a balance lever.** Raise `COOK_HP_RESTORE` (35) so a
    trip mends more, or cut R3's requirement counts (`requirements.md` — provisional by
    design). Both are sliders in the DEV Balance cockpit; you tune, I transcribe (ADR-134).
  - **(c) A second pot near the fighting.** New content: a watch-brazier at the kura
    (the grain-watch's post, opens at R3 — period-true, and it is where a hurt watchman
    already stands). Costs a narrative diverge; buys the siting at full price elsewhere.
  - **(d) Leave it as shipped.** The kitchen still earns its keep: `verb-cook` now
    reveals *with* `room-kitchen`, so cooking exists at all **only because O-Hisa taught
    you the pot** (TST3 — the fiction causes the mechanic). You just don't have to stand
    there. This is what is on `main` today.
- **Recommendation: (a), then reconsider (c) at T1.** The measurement says R3's ceiling
  is the thing that is wrong, not the siting — a rung that opens combat, blooding, two
  hunting grounds and a night round is not the same size as "walk to the woodlot and
  cut twenty trees", and one band for all eight rungs was always going to bind first
  here. If you'd rather not touch a signed number tonight, **(d) is a coherent ship** —
  it is what is running.
- **Resolution:** _(awaiting the human)_



### HD-41 🔲 [R0 · UI/TST4] — the rung-reward lines are invisible AS rewards. Which lever?

- **Where this came from.** The other half of your original HD-38 complaint. We correctly ruled
  the R0 lines' *coldness* is kernel #3 and stays (it is what the R7 naming pays off) — but you
  were still right that something was wrong, and it is **not the prose**. It is TST4: *the player
  never guesses state.*
- **The diagnosis (source-verified).** When a rung requirement completes, `progress-events.ts`
  emits its flavor line on the **`narration`** channel. Per `log-filter.ts` that routes it to the
  **Story** tab — mixed into every other line of ambient prose. Meanwhile the **Progress** tab shows
  only the **`milestone`** channel (rung-ups, unlocks, crafts), so an individual requirement
  completion **never appears there at all**.
- **So:** the player's first three progress rewards ("So he can work," etc.) land in a stream of
  story text with **nothing marking them as earned**, and the one tab whose whole job is *what have
  I achieved* never mentions them. The hidden-rung design is deliberate (the player sees only the %
  bar and each completion's line) — but the line and the bar are never visibly connected.
- **The fork:**
  - **(a) Companion milestone line.** Keep the prose in Story (taste 16: *"a scene's stat-grant LINE
    is Progress; its prose is Story"*) and ALSO emit a **`milestone`** entry so Progress registers
    the step. Must be diegetic — kernel #6 forbids "Requirement 1/3 complete". Open question: what
    does a period-true progress line even *say* when the requirement list is hidden from the player?
  - **(b) Re-channel to `reward`.** A one-line change; the line renders as earned. But `reward`
    routes to the **Work** tab, which is labour spam — arguably a worse home than Story, and it
    pulls the fiction out of the story stream.
  - **(c) Its own channel + treatment.** The rung line is genuinely its own class — *story that is
    also a reward*. Give it a channel and a distinct in-log treatment (the fresh-entries divider is
    the precedent), showing in **both** Story and Progress.
  - **(d) It's the % bar, not the log.** The line is fine; what's missing is that the bar visibly
    MOVES when it lands. Fix the connection, not the text.
- **Recommendation: (c), with (d) as a cheap companion.** The line really is both things at once, and
  forcing it into an existing channel is what created the defect. But that is a **new UI treatment**,
  so under ADR-075 it wants a diverge — which is why I stopped at the diagnosis rather than
  self-serving it.
- **Resolution:** _(open)_
