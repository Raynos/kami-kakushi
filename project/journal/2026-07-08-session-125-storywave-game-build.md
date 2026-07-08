# Session 125 — 2026-07-08 — Storywave GAME build (Plan B, G0→G7)

## ☀️ SUMMARY (read this first)

Executing `docs/plans/fable-2026-07-07-storywave-game.md` (Plan B — the T0
engine rewrite to the story bible) after the human's explicit go-build. One
Opus session driving G0→G7 in order; each milestone is its own green,
pathspec commit (G4 will use the isolated-worktree protocol). G7 (ship) stays
human-gated. This file is HISTORY, not live state — the live snapshot is
`project/status/project-status.md`.

**Seam note:** Plan A (docs) is A0–A4 landed, A5 gated on this ship (I
corrected its stale "PROPOSED" header this session — commit `d3e40ea`). The
engine ADRs Plan B cites (161 clean-break, 163 economy, 164 body, 165 rung-up
VN) already exist. B owns `src/**`; a co-agent (`w2:p5`) wound down the
graphics-explore slate in parallel — see the shared-index landmine below.

---

## 1 · Reconcile Plan A confusion + fix its stale header

The human thought Plan A (docs) was done; the plan header said "PROPOSED".
Reconciled against git: A0–A3 fully landed (ADR docket `f4b2016`, PRD §5
rewrite `13c4458` + §1–§7 ripple, roadmap reshape `f12fc28`), A4 largely
landed, A5 deliberately gated on B's ship. The header was just never flipped.
Corrected it to `IN-PROGRESS` with commit anchors (`d3e40ea`).

**Shared-index LANDMINE (recovered):** a first attempt at the header commit
swept in the co-agent's 6 staged files under my message (`git diff --cached`
showed their files, not mine — I'd `git add`ed then not re-checked right
before commit). Recovered with `git reset --soft HEAD~1` (restored their
staged set intact), then re-committed with the **pathspec form**
`git commit <paths> …` which commits only the named paths regardless of the
shared index. **Lesson: on this shared tree, always `git commit <pathspec>`,
never `git add` + bare `git commit`.**

## 2 · G0 — cast registry (add-only) + fiction-gap inventory ✅

Every new bible §04-cast name/voice now exists in the registries before any
prose compiles against them; the fiction gaps are surfaced as HD-30.

### What changed
- `src/core/content/names.ts` — ADD (bible §04-cast): `ohisa` O-Hisa,
  `shinnosuke`, `toku`, `oyae` O-Yae, `matsuzo` Matsuzō, `iori`, `oume` O-Ume,
  `useName` Gonbei. Forward-corrected (zero live usages, verified by grep):
  `villageChief`→Mohei, `mother`→O-Nobu, `sister`→Suzu; deleted `sweetheart`
  (Osen void). DEFERRED to G4 with comments (live canon still resolves):
  `lord` (→Munemasa), `pedlar` (→Yohei), `smith` Tōzō (retires).
- `src/core/content/voices.ts` — grew `NpcId` +9 (ohisa/shinnosuke/toku/
  naoyuki/yohei/oyae/matsuzo/iori/oume; kept tozo/shigemasa until G4); added a
  `monk` VoiceCategory (Iori); NPC_VOICE/NPC_NAME/NPC_IDS/VOICE_CATEGORY_SET
  rows. Voice-colour bindings are executor calls (steward for the household,
  official for Naoyuki, villager for the edge folk, monk for Iori) — refine at
  G4 when content wires them.
- `src/ui/render.ts` — `monk` rows in VOICE_COLOR/VOICE_SEAL (`僧`, exhaustive
  over the union — a missing key is a tsc error).
- `src/ui/styles.css` — `--v-monk` token (#b3ab9e) + `.log-line.voice-monk`.
- `src/core/content/voices.test.ts` — new registry-integrity block (NPC_IDS ==
  the Record keys, no dup ids, unique nameplates via reverse-map, every voice
  a real category — all RED-able, derived from the registry).
- `src/scripts/narrative/validate.test.ts` — the "ambient speaker needs a
  voice" fixture used `Tokubei`, which is now the NpcId `yohei` and resolves a
  voice; swapped to `Sayo` (a NAMES entry that stays non-NpcId in T0).
- `project/brainstorms/2026-07-08-storywave-g0-fiction-gap-inventory.md` — the
  verified gap inventory (7 gap classes + the G3.5 grammar-demand list).
- `project/human-in-the-loop/decisions.md` — **HD-30** filed (⛔ blocks G7):
  authorize the supplemental prose mini-wave for the gaps.
- `project/todo-human.md` — reading-queue entry for the inventory.

### Verify
Typecheck clean; full vitest 921 passed / 2 skipped. Registries additive — no
live behavior change (the only test premise that shifted, Tokubei→ambient, is
a direct consequence of the intended `yohei` id and was re-anchored).

## Next intended steps
1. **G1** — the six-season manual calendar (`SEASONS` 6-wheel, stored/manual)
   + the season-exit pipeline + rice-as-kura-units (shō/bale/koku) + per-site
   season pool + consumption + spoilage + clean-break persistence. Full verify
   + `verify:balance` + `balance:report`.
2. Then G2 (scenes + night rounds, dormant), G3 (body economies), G3.5
   (compiler), G4 (worktree cutover), G5–G7.

## Landmines
- **Shared tree + live co-agents:** always `git commit <pathspec>`; re-check
  `git diff --cached --name-only` is not enough on its own (the index races).
- **G0 voice-colour picks are provisional** — Naoyuki=official, household=
  steward, edge=villager, Iori=monk; revisit at G4 if content wants finer.
- **HD-30 gates G7** — no `[dev]` placeholder prose can ship. G1's retirement
  notice ships a bracketed placeholder until the supplemental wave lands.
