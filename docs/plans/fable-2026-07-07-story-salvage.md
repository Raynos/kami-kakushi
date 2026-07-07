# Story salvage — the audit findings/fixes (+ the superseded 19 answers)

**Status: 📌 PARKED (reference/input, not build work) — kept live by the
human's call (2026-07-07):
the AUDIT is the substance that must not be lost; the 19 ladder answers are
mostly superseded and kept below only as the record of that pass.** This is
the small companion to `fable-2026-07-07-story-reboot.md` (the ONE live
story plan): everything here feeds the reboot (pillar candidates,
informed-pitch input, pitch judging), and the §1 fixes remain independently
actionable on the CURRENT game if we ever choose to patch it before the
reboot's build wave lands.
**Confidence: ( 30% Opus, 70% Fable )** — applying any fix is prose work
(ADR-139); holding the record is free.

**Full sources (unabridged):** the audit
`project/audit/reports/2026-07-06-story-narrative-slop-audit.md` · the
archived ladder plan
`project/archive/fable-2026-07-06-story-quality-ladder.md` (its §1 is the
verbatim answer sheet).

---

## §1 · The audit's findings & fixes (the anti-goal record — THE substance)

The audit's verdict: **architecture strong, surface machine-accented, three
canon breaks.** The reboot judges every pitch against this; any pre-reboot
patch of the current game starts here too.

**Canon breaks (audit §2 — highest severity):**

1. **The wolf is dead AND alive** — scripted fight: it escapes bleeding
   (`log-content.ts:69`); R3 beat: "stood over the carcass" / "put down"
   (`rung-beats.md:111–117`). Pick one (the PRD's survived-not-won is
   stronger).
2. **Kihei flatters innate talent against the locked thesis** — "There's a
   soldier in you" (`rung-beats.md:118–119`) vs the PRD's anchor creed
   "Talent is a story the lucky tell… So you will work" (§5:109–110),
   which appears NOWHERE in the built text; the finale pays off nothing.
3. **The shame arc inverted into a headhunt** — PRD T0.2: thrashed, ribs
   cracked, shame drives him to BEG for drills; built: Kihei recruits him
   with praise. T0 lost its only wound.

**The slop accent (audit §3):** epigram saturation (everyone lands on a
balanced maxim — diction differs, sentence SHAPE doesn't) · the "…" react
copy-pasted ~11× across decide scenes · nine perks = one mind/body chiasmus
template · near-verbatim self-duplication bypassing `@`-reuse · mechanics
ventriloquism in ceremonial beats (grant inventories, coin counted aloud) ·
dawn/first-light opening three consecutive beats.

**The deep tell (audit §4):** T0's social physics is a **fairness machine**
— every NPC assesses the MC accurately and rewards him proportionally;
distrust told, never dramatized; seven promotions = one performance-review
scene; decide menus = a moral thermometer the player cracks by R2. The one
counter-example that shows the fix: r4-generous (an orthogonal consequence
from an unexpected quarter).

**The fix list (audit §5, priority order):** repair canon first (small
diffs, big integrity) · stage ONE unfairness beat (the suspicion scene fixes
the fairness machine + missing Naoyuki + missing PRD beat together) · voice
bible keyed to sentence SHAPE + epigram budget · de-template the nine perks
(name the concrete object of the scene) · motivate unlocks from problems,
not inventories · dedup via `@`-reuse; vary the dawns.

**Protect-list (audit §1) — the eight ideas judged genuinely good:** the
title-is-a-lie premise (folklore as grief-work) · the MC is not Tama and
Tama may not forgive · compound interest as the T0/T1 antagonist · partial
justice honored to the end · load-bearing Edo texture (kyō-masu, sekisho,
rusui-yaku, banzuke geometry) · promises cashed (the straw mat & chipped
bowl) · real diction-level voice differentiation (Shigemasa's R7 self-doubt)
· tight functional prose. Under the reboot these are INPUT (they must
re-earn their place) — but they are the strongest input we have.

## §2 · The 19 ladder answers (2026-07-06 pass — MOSTLY SUPERSEDED)

Recorded verbatim in the archived ladder plan §1; condensed here. The
reboot superseded these as law — under kernel-only ground they are open
CANDIDATES at best. Kept because they are *human-answered* history: a pitch
or pillar that contradicts one should do so knowingly, not ignorantly.

**Adopted ✅**

- **D1** — the seven-point kernel binds all story work (now the reboot's
  ONLY fixed ground; full statements get written in the kernel redline).
- **D2** — canon repairs fold into the rewrite, scenes touched once (wolf
  continuity · Kihei's creed · the shame→begging arc).
- **Friction** — ONE authored suspicion beat: the mislaid-ledger inverse,
  Naoyuki leads the accusation; one scene, no systemic change.
- **D4** — Naoyuki: ally, never warm; on-screen from R1; grudging forever.
- **D5** — the MC gets one small concrete want per tier.
- **D9** — tiers as circles of the world, named by what the HOUSE is to
  each circle; pure reframe, no mechanics re-scope.
- **D11** — without-you log lines, 1–2 a season (the only world-breath
  system adopted).
- **D12** — map-with-pressure: per node, who's-there-when + ONE visibly
  wrong thing per act; merges with emergent-node-actions at build time.
- **D13** — story bible at `docs/living/story-bible.md`.
- **D14** — epigram license: Shigemasa + Sōan only, ≤1 maxim per scene.
- **D15** — reward register as bible norm: concrete objects/habits from
  the scene, never mind/body chiasmus, NPCs never count coin aloud.
- **D16** — method: co-write the bible, diverge the prose (ADR-139).
- **D17** — "Kurosawa" stays.
- **D19** — enforcement stays norm-level (bible + scorecard; no prose gate).

**Rejected ✖ (in the keep-the-architecture frame — the reboot reopens them
as pitch material, per its §2)**

- **D3** — the cast-wants principle ("everyone wants something that isn't
  you") as a binding rule.
- **D6** — rungs-as-access-with-risk + contested promotions.
- **D11 partial** — day-places and calendar arrivals.
- **D18** — closing HR-8 (stays OPEN: the human reads the CURRENT beats).

**Dissolved/moot:** D7 (requirements-rung mesh proceeds untouched — since
built, FB-121), D8 (rung titles stay), D10 (no T0 map re-scope).

## §3 · How this doc gets consumed

- **Reboot Phase 1:** §1's accent patterns + fairness machine → fiction
  pillars (anti-goals); D14/D15 → register-rule candidates.
- **Reboot Phase 2:** the 2 informed pitch agents receive this doc + the
  full audit; blind agents do NOT.
- **Pre-reboot patching (dormant):** if the human wants the current game
  improved before the reboot ships, §1's canon breaks + fix list are the
  plan — each fiction edit rides ADR-139.
- This doc archives when the reboot's build wave makes it moot.
