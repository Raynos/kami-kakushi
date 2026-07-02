# Plan — Anchor the setting to the year 1780 (ADR D-105)

> **Status:** 🆕 proposed — awaiting human read (reading queue). Ripple for
> **[D-105](../living/decisions.md)**. **Source:** human steer, 2026-07-02
> ("anchor the game as being set in 1780; record it and plan the impact").

## 1. The decision in one line

The game is **set in 1780** (Japanese *An'ei* 9, 安永9年 — the last full year
before the *Tenmei* era began in 1781). We anchor **TIME only**: the split is
**real YEAR, fictional GEOGRAPHY & POLITICS.** Every place and house stays
invented; the real-name denylist (D-018 / §6.6) is unchanged.

## 2. Why 1780 is low-risk (it validates, it doesn't retcon)

The anchor was chosen to *confirm* the world already written, not disturb it. All
of the following are already in the PRD and are **fully consistent with 1780**:

- **The economy** — *koku*/rice base + *mon* coin, the *fudasashi* brokers and the
  Dōjima rice market (T4/T5), and the "stable and commercial" texture (§1.3) all
  match the real commercial character of the era.
- **Movement & politics** — *sankin-kōtai* (biennial attendance, §5 T5),
  *sekisho* checkpoints gating free travel (§1.5.3), the *rusui-yaku* Edo
  establishment (§5 T4/T5) — all period-correct for 1780.
- **The signature *meibutsu*** — silk / sericulture (§1.6.1) — a real 18th-c.
  rural cash crop.
- **The art register** — "mid-Edo woodblock" (`ui-design.md`) — 1780 is the
  ukiyo-e high tide, so the anchor *confirms* the visual bible.
- **The internal timeline math holds** — Tama spirited away "ten years ago"
  (§1.4) ≈ **1770**; grandfather **Sadamune's** failed flood venture "three
  generations ago" (§1.5.1 / §5) ≈ **early–mid 1700s**, i.e. the debt is decades
  of compound interest by 1780. MC is ~18–20, born ~1760.

**Net:** no mechanic, balance number, or piece of content has to change to *fit*
1780. This is a grounding + texture pass, not a rework.

## 3. The fiction rule — reconciled, not broken

The standing rule (D-018, §6.6 real-name denylist) is **"no real place / daimyō
names."** Anchoring a *year* does not touch it — this is the ordinary
historical-fiction split:

| Anchored to reality | Stays invented |
|---|---|
| The **calendar year** (1780 / An'ei 9) | All **place names** (Asagiri, Sawatari-juku, Yanagi-watari, Kuzuhara) |
| The **era's texture** (commercial, stable, ukiyo-e) | All **houses & daimyō** (Kurosawa, Tomita, Akagi…) |
| Real **institutions as unnamed offices** (sankin-kōtai, sekisho, "the shōgun") | Any **named** real official or political event |

**Guardrail:** "the shōgun" is only ever an **unnamed office** — never named as
the historical Tokugawa Ieharu; the real Tanuma-administration commercial flavour
is *ambient texture*, never named politics. *Nihonbashi* stays the lone
allow-listed real place (T5), exactly as today.

## 4. Two forks for the human (agent has picked a default; override async)

### Fork A — the Tenmei famine (1782–88)

1780 sits ~2 years before one of the Edo period's great famines. The game's tone
is deliberately cozy/warm restoration fantasy over "stable and commercial."

- **A1 (DEFAULT — picked): INSULATE.** The fictional valley is not a famine
  chronicle; the anchor gives era-feel without dramatizing the famine. At most a
  faint, optional, off-screen line (a lean year down the road, grain prices
  twitching) — never a plot. *Rationale: protects the cozy tone + the apolitical
  fiction; the famine as spectacle would fight the whole premise.*
- **A2: LIGHT TEXTURE.** One or two optional rumour-board tidbits gesture at hard
  times elsewhere, purely as flavour, still no mechanics.
- **A3: DRAMATIZE.** Make the coming hardship a story force. *Not recommended —
  clashes with D-084 (cozy fun) and the apolitical-fiction stance.*

### Fork B — how the in-game calendar relates to 1780

The engine derives an in-game year counter: `year(day) = 1 + floor(day / 112)`
(§6.7.1) — a **relative** "Year 1, 2, 3…" of the MC's service, with season =
`floor(day/28) mod 4`.

- **B1 (DEFAULT — picked): RELATIVE counter, 1780 as opening flavour.** The
  intro/canon states the game opens in 1780; the on-screen calendar stays the
  relative Year-N + season it already is. **Zero code/balance change.**
- **B2: SURFACE THE NENGŌ.** Compute and display the real era-year (An'ei 9 →
  Tenmei 1 at the first New Year, etc.) as a calendar readout. *Deferred — nice
  polish, but it drags the famine-era nengō (Tenmei) onto the screen and needs a
  day→nengō mapping; revisit post-v1 if wanted.*

> If the human prefers B2 or A2/A3, the steps in §5 change accordingly; §5 as
> written implements the **defaults (A1 + B1)**.

## 5. The ripple — concrete doc edits (defaults A1 + B1)

Ordered, small, reviewable. **No code changes under the defaults.**

1. **`docs/living/prd/01-vision.md` §1.3** — change
   "*mid-Edo, stable and commercial, ~18th century, kept fictional*" →
   "*set in **1780** (An'ei 9), mid-Edo, stable and commercial, kept fictional*"
   and add one sentence: the anchor is **real year, fictional geography &
   politics** (places/houses invented; the shōgun an unnamed office). *(Touches
   locked §1 intent — this is the human-steered refinement D-105 authorizes; the
   fiction rule is preserved, not loosened.)*
2. **`docs/living/prd/05-narrative.md`** — the T0 opening may state the year
   ("*spring, 1780*") as grounding flavour; verify the "ten years ago" /
   "three generations" lines read consistently against a 1780 present (they do —
   §2). No structural change.
3. **`README.md`** — line 20 "*based on EDO era japan*" → "*based on Edo-era
   Japan, set in 1780 (An'ei 9)*".
4. **`docs/living/ui-design.md`** — one line noting the "mid-Edo woodblock"
   register is anchored to 1780 (validates, doesn't change, the visual bible).
5. **No change** to §6 (calendar model), §4 (balance), the real-name denylist, or
   any core code — all consistent as-is under B1.
6. **Optional (defer):** a single canon note in §5 / world lore that the wider
   realm is entering hard years (Fork A1's faint off-screen texture), only if the
   human wants even that much.

## 6. Definition of done

- [ ] Human has read this plan + the A/B fork defaults (or overridden them).
- [ ] §1.3 states 1780 + the real-year/fictional-place split.
- [ ] README + ui-design note the anchor.
- [ ] §5 opening/timeline verified consistent (no retcon needed).
- [ ] The real-name denylist + calendar model confirmed **unchanged**.
- [ ] `npm run verify` green; plan graduates to `project/archive/`.

## 7. Out of scope

- Surfacing the live *nengō* era-year (Fork B2) — deferred.
- Any famine storyline (Fork A3) — declined by default.
- Any change to place/house names or the fiction denylist — explicitly preserved.
