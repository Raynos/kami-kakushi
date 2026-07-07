# The story-quality ladder — umbrella plan & answer sheet

**Status: 🗄️ SUPERSEDED (2026-07-07) → see
`fable-2026-07-07-story-reboot.md` (archived alongside, 2026-07-07 — the
frame + redline record; the live story plan is now
`docs/plans/fable-2026-07-07-story-bible-finish.md`) +
`fable-2026-07-07-story-salvage.md` (archived alongside 2026-07-07; the condensation of
the audit findings/fixes and this plan's §1 answers).** Walking this plan,
the human reopened the DESIGN layer (this plan was sized for a surface-only
rewrite): its process decisions carry into the reboot plan, its design
decisions — including the §1 rejections — revert to open candidates for the
reboot's pitch phase. The §1 answer sheet below remains the verbatim record
of the 2026-07-06 decision pass; no ADR was ever minted from it.

~~**Status: 📋 PROPOSED — all 19 decisions ANSWERED in-session (2026-07-06);
the assembled plan now awaits your approval as a whole.** Per your call, NO
ADR has been minted: on plan approval, the §1 answer sheet graduates to an
ADR pulled from this doc — not before.~~ **Confidence: ( 20% Opus, 80%
Fable )** — taste and dramatic judgment concentrate in every phase.

**Sources:** the slop audit
(`project/audit/reports/2026-07-06-story-narrative-slop-audit.md`) · the
in-session AskUserQuestion decision pass (2026-07-06) · PRD §5 · taste.md.

---

## Who builds this — Fable or Opus?

**Fable** for everything that decides what the story IS: the bible co-write,
prose rewrites, diverge briefs and picks. **Opus/Sonnet-class** for the
mechanical tail once the bible locks: FB-5 source migration, dedup sweeps,
gen-region ripple, fixture updates. The split falls at the Phase 2→3 seams.

---

## §1 · The answer sheet (your in-session answers, 2026-07-06)

**Adopted ✅**

- **D1 · Kernel confirmed** — the seven-point spirit distillation binds all
  story work (lie of the vanishing · nobody twice unnamed · worth written by
  work · house before the man · partial justice · form is the fiction ·
  woodblock restraint).
- **D2 · Canon repairs fold into the rewrite** — the wolf continuity break,
  Kihei's inverted creed, and the lost shame→begging arc are repaired inside
  Phase 2's R1–R3 bundle (scenes touched once, never patched twice).
- **Friction · One authored suspicion beat** — the mislaid-ledger inverse:
  something goes missing, the stranger is the obvious suspect, **Naoyuki
  leads the accusation**. One scene; no systemic change.
- **D4 · Naoyuki: ally, never warm** — on-screen from R1; the G5 rival→ally
  flip survives but the vouch stays grudging forever (brotherhood becomes
  respect-without-affection). PRD §5 [THREAD: Naoyuki] ripple in Phase 4.
- **D5 · The MC gets one small concrete want per tier** — shaped together in
  the bible pass (T0 candidates on the table there).
- **D9 · Tiers as circles of the world** — named by what the HOUSE is to
  each circle: debtor holding its yard → estate again → neighbor the village
  reckons with → the valley's anchor → reckoned with in the castle-town → a
  name that reaches Edo. Pure reframe: no mechanics/map re-scoping (satoyama
  stays T0); ascensions read as visible social lines crossed.
- **D11 · Without-you log lines** — 1–2 lines a season of things that
  happened off-screen. (The only world-breath system adopted.)
- **D12 · Map-with-pressure** — every node: who's-there-when + ONE visibly
  wrong thing that changes per act. Merges with the emergent-node-actions
  plan at build time so node-life is designed once.
- **D13 · Story bible at `docs/living/story-bible.md`** — new living doc,
  peer of ui-design.md.
- **D14 · Epigram license: Shigemasa + Sōan** — ≤1 maxim per scene; everyone
  else, including the MC, speaks plain.
- **D15 · Reward register applied as a bible NORM (no ADR)** — perks and
  rewards are concrete objects/habits from the scene; never mind/body
  chiasmus; NPCs never count coin aloud. The nine perks rewrite in Phase 2.
- **D16 · Method: co-write the bible, diverge the prose** — bible sections
  single-track with the human's live redline; player-facing prose bundles
  keep the ADR-139 3-take blind diverge (the HR-8/9 flow).
- **D17 · "Kurosawa" stays.**
- **D19 · Enforcement stays norm-level** — bible + FB-10 scorecard; no prose
  gate (AC-11).

**Rejected ✖ (recorded so they stay rejected)**

- **D3 · The cast-wants principle** ("everyone wants something that isn't
  you") as a binding rule — current cast framing stands.
- **D6 · Rungs-as-access-with-risk + contested promotions** — current rung
  meanings and promotion-scene structure stand; quality comes from the
  rewrite, the suspicion beat, and Naoyuki.
- **D11 (partial) · Day-places and calendar arrivals** — not adopted (for
  now); without-you lines only.
- **D18 · Closing HR-8** — stays OPEN: the human still wants to read the
  CURRENT rung beats before the rewrite.

**Dissolved by rejections (moot):** D7 (requirements-rung mesh — that LOCKED
plan proceeds untouched), D8 (rung titles — stay), D10 (T0 map re-scope —
none, per D9's no-mechanics answer).

---

## §2 · The phases (forward plan — starts on plan approval)

- **Phase 0 — the decision pass.** ✅ Answered 2026-07-06 (§1 above). The
  ADR is minted from §1 only when this plan is approved.
- **Phase 1 — the story bible co-write (in-chat, small pieces, no
  subagents).** Sections in order, each drafted single-track, redlined live,
  committed when locked:
  1. Cast sheet — per named character: role, voice sentence-SHAPE, epigram
     license flag, notes on what the rewrite keeps/sharpens. Naoyuki's
     ally-never-warm arc + his R1 on-screen presence designed here. The MC's
     T0 want chosen here (D5).
  2. Tier sheet — the six circles (D9): each tier's one-line identity, the
     social line its ascension crosses, ceremony copy implications.
  3. World-texture spec — without-you line cadence + example set (D11);
     map-with-pressure per-node state table (D12): the wrong-thing per act,
     who's-there-when.
  4. Register rules — the epigram license (D14), the reward register (D15),
     dedup/`@`-reuse policy, the banned-pattern list from audit §3.
- **Phase 2 — the T0 prose wave (ADR-139 diverge per bundle, D16).**
  Bundles, each: 3 blind takes → scorecard → self-pick → live in the DEV
  set-switcher (ADR-143) → one HR-item:
  1. Cold open + intro (Sōan/dream/Genemon scenes).
  2. R1–R3 beats — **includes the D2 canon repairs** (wolf survived-not-won,
     the shame→begging arc restored, Kihei's creed stated on-screen, the
     "soldier in you" flattery cut) **and the new suspicion beat + Naoyuki's
     R1 presence** (placement decided in the Phase-1 cast sheet).
  3. R4–R7 beats — de-ventriloquize the unlock narration (problems, not
     grant inventories).
  4. Dialogue + ambient (dialogue.md, greetings, tells).
  5. Perks + quests + log-lines (the D15 register; NPC coin-counting out;
     quest-reward lines rewritten).
- **Phase 3 — adopted world-systems as small build plans.** (a) without-you
  log lines (near-free: a seasonal line pool + emit hook); (b)
  map-with-pressure (stateful node blurbs — merge with emergent-node-actions
  at design time). Coordinate with UI-v2 Andon M4/M5 (cold-open/VN ceremony
  restyle) so prose and chrome don't churn the same surfaces twice.
- **Phase 4 — ripple & close.** Mint the ADR from §1; PRD §5 ripple for D4 +
  D9 (ADR-117 flow); bible norms folded into the narrative-diverge/
  taste-scorecard skill texts; HR-8 read happens whenever the human takes it
  (still open); CHANGELOG with the release that ships the new T0 prose.

## §3 · The horizon (out of scope until called — kept visible)

Quest fiction depth · the dream/Origin cadence escalation (PRD specifies it;
never authored) · festivals & rites as tier texture · the T2 village cast ·
NPC memory-state depth · the T1 ladder (R8–R15) story · the T4/T5 ending
throughline re-audit · the log's long-term literary register.

## §4 · On approval

Say the word and two things happen in order: (1) the ADR is pulled from §1
into `decisions.md`; (2) Phase 1 session one starts — the cast sheet, ~12
named characters, three lines each, drafted in-chat for your live redline,
locked into `docs/living/story-bible.md` §1 the same sitting.
