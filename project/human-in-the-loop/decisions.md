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
- **Recommendation: (a), then reconsider (c) at T1.** The measurement
  says R3's ceiling is the thing that is wrong, not the siting — a
  rung that opens combat, blooding, two hunting grounds and a night
  round is not the same size as "walk to the woodlot and cut twenty
  trees", and one band for all eight rungs was always going to bind
  first here. If you'd rather not touch a signed number tonight,
  **(d) is a coherent ship** — it is what is running.
- **Resolution:** _(awaiting the human)_



### HD-41 ⏳ [R0 · UI/TST4] — the rung-reward lines are invisible AS rewards. Which lever?

- **Status (2026-07-13, session 185): DIRECTION GIVEN, build-first —
  not yet locked.** The human's working direction is **(a) + (c), and
  "maybe a bit of (d)"** — the rung line as its own channel/class
  (*story that is also earned*), rendering in both Story and
  Progress, with the % bar's movement made visible where cheap. But
  the human explicitly held the lock: *"before we can make a real
  decision on HD-41 we should build out the doc/plan with a diverge
  and see it and play it and then lock it in as an ADR."* So: the
  plan
  [`docs/plans/opus-2026-07-12-rung-reward-legibility.md`](../../docs/plans/opus-2026-07-12-rung-reward-legibility.md)
  is **UNBLOCKED** to build the ADR-075 diverge under that direction;
  the ADR is written only **after** the human plays the variants and
  picks. (b) is dead.
- **The diagnosis (source-verified).** When a rung requirement
  completes, `progress-events.ts` emits its flavor line on the
  **`narration`** channel. Per `log-filter.ts` that routes it to the
  **Story** tab — mixed into every other line of ambient prose.
  Meanwhile the **Progress** tab shows only the **`milestone`**
  channel (rung-ups, unlocks, crafts), so an individual requirement
  completion **never appears there at all**. The prose's coldness is
  kernel #3 and stays (HD-38 / ADR-185) — the defect is TST4, not
  register.
- **The fork (for the record; (b) eliminated):**
  - **(a) Companion milestone line** — keep the prose in Story
    (taste 16) and ALSO register the step in Progress. Diegetic only —
    kernel #6 forbids "Requirement 1/3 complete".
  - ~~**(b) Re-channel to `reward`.**~~ Dead — `reward` routes to the
    Work tab's labour spam.
  - **(c) Its own channel + treatment** — *story that is also a
    reward*, distinct in-log treatment, showing in both Story and
    Progress.
  - **(d) The % bar visibly MOVES when the line lands** — fix the
    connection, not the text.
- **Resolution:** _(⏳ after the diverge is played — then the ADR +
  archive row)_

### HD-42 🔲 [process] — adopt "write the reviewer's redlines to disk" as a norm?

- **The failure it answers (this session, for real).** The W6 sweep
  returned **12 redlines**. I applied **10**, reported the wave
  complete, and `verify` was green the entire time the other two sat
  unfixed — plus two "borderline" flags I never returned to. The
  author is the **last** person who will notice, because he remembers
  *intending* to apply them. Only the human asking *"did you fix
  everything?"* caught it. A textbook **PH3 false green**.
- **Why no gate can hold this.** The list existed only in an agent's
  context. A lint cannot know what a blind reader asked for, so per
  the "push each rule to the highest rung that can **soundly** hold
  it" doctrine, a gate here would either be impossible or would cry
  wolf. The honest rung is a **norm** (or a step inside the reviewing
  skills).
- **The proposed norm:** *when a reviewer / blind reader hands back a
  redline or findings list, write it to disk as a checklist FIRST and
  tick items off as they land — never hold it in context.* One line
  in `AGENTS.md` under Conventions, or a step in the `diverge` /
  `narrative-diverge` / `battery` skills.
- **Why this is yours, not mine:** editing `AGENTS.md` is process
  canon. An agent proposing a rule that binds all future agents
  should not also adopt it.
- **Recommendation:** adopt, as a **skill step** rather than an
  AGENTS.md line — it fires exactly where the risk lives (the
  diverge/battery/sweep flows) and does not add a always-loaded line
  for a situation most sessions never hit.
- **Resolution:** _(open)_

### HD-44 🔲 [R3 · design] — the rare stat-nudge (BQ2) was lost in the FB-5 migration

- **Context.** `RungOption.statBonus` is a designed lever: a one-time
  small attribute nudge on a rung-beat pick, carrying a `note` — "the
  delight line". Its own type comment still reads *"Present on EXACTLY
  ONE option (R3 'disciplined'); everything else omits it."* It appears
  **nowhere** in the compiled registries or the narrative `.md`. The
  narrative grammar has **no `bonus:` field**, so when the rung beats
  moved to markdown (FB-5) the lever had no way to survive — and didn't.
  The type field, `vnText`'s `.bonus` branch and `scenes.ts`'s whole
  bonus-emit block are dead code. Found 2026-07-13 (session-192).
- **Question / fork:** restore it, or retire it?
- **Options:**
  - **(a) Restore.** Extend the narrative grammar with a `bonus:` field
    on a rung option, re-author the R3 'disciplined' delight line
    (fiction-voiced ⇒ ADR-139, 3+ takes), regenerate. Everything that
    receives it is still wired. Note `intents.ts:610` logs the beat's
    bonus line **unkeyed** — key it `beat.<rank>.opt.<id>.bonus` while
    restoring, or it freezes in old saves the way the topics did.
  - **(b) Retire.** Delete `statBonus`, the resolver branch and the emit
    block. The rung pick keeps its net-zero lean and its memory/flag
    writes; the rare-delight beat goes away.
- **Recommendation:** **(a)** — but it is a *design* call: this was the
  one asymmetric reward in an otherwise net-zero choice system, and only
  you can say whether T0 still wants it. If yes it needs a re-authored
  line (a story unit), so it is a small plan, not a fix.
- **Resolution:** _(open)_

### HD-45 🔲 [process] — the e2e lane went red on `main` and nobody saw it

- **Context.** The Playwright lane is CI-only by budget (D-072 — a real
  browser suite is orders of magnitude past `verify`'s 5s/8s gate). On
  2026-07-13 (session-191) I found it **3 failed / 88 passed** locally.
  It had been red since `a4863592` (ADR-184 — a zone opens only in a
  VN): the reveal VNs the feature *correctly* added hid the shell, and
  the R3 journey walked past them. Two CI `e2e.yml` runs had already
  failed, unread. I only looked because the **push-time blast-radius
  warning** (advisory) nagged me about `styles.css`. Fixed in
  `8f746f54` — but the *hole* is unfixed: a green `verify`, a green
  commit and a green push all coexist with a red e2e lane, and the only
  thing standing between that and a rotting suite is an agent choosing
  to read an advisory line.
- **Question / fork:** what rung does the e2e lane sit on? "Push each
  quality rule to the highest rung that can **soundly** hold it" — and
  an advisory warning is the lowest rung there is.
- **Options:**
  - **(a) Block the push when the blast radius is hit.** If a push
    touches e2e-covered surface, run the lane (~60s) and refuse a red.
    Sound (it can only fire on a real red), but it puts a minute on
    every UI push — and CI runs it anyway, 60s later.
  - **(b) Read the lane's CI result at session start.** The brief
    already prints `verify.yml`'s conclusion; print `e2e.yml`'s too, so
    a red is in front of the next agent within one turn instead of
    whenever someone happens to push CSS. Cheap, no push cost — but it
    catches the red *after* it lands, not before.
  - **(c) Leave it advisory.** It did work this time.
- **Recommendation:** **(b)**, and cheap enough to do alongside (a) if
  you want the belt as well as the braces. The failure here wasn't that
  the red escaped to CI — it's that CI's answer was **never read**. (b)
  fixes exactly that, for the price of one line in the session brief;
  (a) pays 60s on every UI push to buy ~an hour of earlier notice.
- **Resolution:** _(open)_
