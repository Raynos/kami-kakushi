# Session 40 — 2026-07-01 — Plan B: build v0.3.2 (close the build-behind gap)

**Summary:** The human flipped the steer. Session-39 parked Plan B behind "play the
game first"; now the human is busy, can't playtest today, and greenlit the **v0.3.2
build in the background** ("let's do all of Plan B now… I'll play test tomorrow, at
least the game & PRD are going to be in sync"). Newest intent supersedes (D-022), so
Plan B is **GO**. This session is the autonomous build:
[`docs/plans/2026-07-01-v0.3.2-build-close-the-gap.md`](../../docs/plans/2026-07-01-v0.3.2-build-close-the-gap.md).

**Approach (why not a naive parallel workflow):** Plan B §A is a *coherent* build
where tasks share core files (`combat.ts`, `render.ts`, `content/*`, tests). Fanning
out parallel file-writers would conflict and produce incoherent code — violating R1
(correct > fast) and the shared-tree rule. So: build the core **sequentially** (pick
task → build → full `verify` → commit → journal → repeat, the canonical loop here),
using subagents only where they don't conflict (read-only orientation; the isolated
A5 design note + C gen-docs). Scope = §A (A1–A10) + §C. §B is forward-tier (T1+),
**not** v0.3.2.

## Plan of record (dependency order)

1. **A1** — 5-attr (STR/AGI/INT/SPD/LUCK) + accuracy/evasion combat + DAMAGE_FLOOR
   (D-100). FOUNDATION — A2/A3/A9 build on it. Invariants stay RED-able: first-fight
   20–35% band, graded curve, no dominated stance (D-011/D-016/D-050).
2. **A4** — E#→U# estate-ladder rename (D-098), mechanical, early.
3. **A2** stances glass-cannon↔tank (D-101) · **A3** 3rd T0 weapon (D-102) · **A9**
   richer mob roster — all after A1.
4. **A6** quest kinds HUNT/CLEAR/DEFEND (D-032) · **A7** staggered reveals + Bestiary
   (D-026) · **A8** interior-room reveals · **A10** gate the bandit out of T0 —
   independent.
5. **A5** finances design note (D-099) before any finance code; part may slip to T1.
6. **C** gen-docs tables (map/market/stances/recipe/bank) alongside.

Every task lands in the **live playable T0** (R6), ships RED-able source-derived
tests, and keeps `npm run verify` green.

## What changed

- `project/status/project-status.md` — replaced the "PLAY THE GAME — not build"
  banner with a "**NOW: build Plan B (v0.3.2)**" banner (the steer flip; R1 playtest
  deferred to tomorrow, not dropped).

## Next intended steps

1. Consume the 4 orientation agents (combat / content / UI / gen-docs+tests), then
   build **A1** first (biggest; everything downstream depends on its type shape).
2. Proceed down the dependency order above, committing + journaling per task.

## Landmines

- **Headless-only QA is hook-enforced** (`.claude/hooks/enforce-headless-qa.sh`) —
  drive the game via `window.__qa` / `node src/scripts/qa-shots.mjs`, never a headed
  browser.
- **A1 changes the combat model** — the pacing/curve/no-dominated-stance gates
  (`pacing:check`, `playcheck:check`, the combat tests) must still hold after it.
  Derive new test fixtures from the `balance` constants / `rungThreshold`, never
  copied magic numbers (D-086…D-088).
- Balance magnitudes stay **liquid** (D-059) — tuned by playtest, not frozen.

---

## Update — human decisions + terminal-kill recovery + re-launch

**Two forks resolved (human, 2026-07-01):**
1. **A3 · 3rd T0 weapon = a CRAFTED yari (spear).** Forge a yari as the 3rd
   weapon — brings the PRD's Line-1 **Spear** identity into T0 (pole + axe + yari),
   period-appropriate, sets up the T1 sword line, and satisfies
   earned-not-gifted / ≥1-craftable. Best-of-both.
2. **Scope tonight = DEPTH + PROCESS** (not breadth). Full **D-075 diverge** on the
   new/major UI surfaces (the 3→5-attr combat panel, the Bestiary A7, the
   interior-room reveals A8 where they're real surfaces) — 2–3 working variants
   behind the DEV toggle, each an R-item for live review. Quality/review-readiness
   over covering all 11 tasks. So A7/A8 are diverge-tasks, not single-default.

**Self-picked (reversible) calls surfaced to the human:** attribute income +1/2
levels (PRD); starting HP ~doubles (≈36→≈58, PRD `40+8·level+2·STR`) with the
**monkey recast as a fast/evasive first foe** to hold the 20–35% band; INT thin at
T0 (richer at T1); bandit **gated** out of T0 (kept in the curve, unreachable), not
deleted; A5 finances = no structural split in v0.3.2 (T2 feature) — labels + docs.

**Terminal-kill recovery:** the process exited mid-run and killed the delegated
A1+A2 agent; its in-process state is unrecoverable. **Nothing was lost from disk** —
the agent was killed while still reading/planning (0 source edits; tree clean but for
the 3 uncommitted docs). Re-launched the A1+A2 combat-rewrite agent fresh with the
identical complete spec. Lesson: an agent's file edits land on disk immediately, so a
kill loses only its in-flight step + its plan (the plan lives here in the journal +
the delegation spec, so it's reconstructable).

## Next intended steps (current)
1. Await the re-launched A1+A2 agent → verify its diff + win-rate table hard (R2/R3),
   run `npm run verify` myself, then commit A1+A2.
2. Then fan out the independent tasks (now safe, no shared-tree conflict): A4 (E→U),
   A3 (crafted yari), A9 (mobs), A6 (quests), A10 (bandit gate), C (gen-docs).
3. A7 (Bestiary) + A8 (rooms) as **diverge** tasks (D-075, per the depth+process
   steer) — 2–3 variants each behind the DEV toggle + R-items.

---

## Update — A1+A2 LANDED (5-attr + accuracy/evasion combat + glass-cannon/tank stances)

Delegated agent implemented the rewrite; **I verified it hard (R2/R3), did not trust
the green:** ran `npm run verify` myself (**11 gates, 291 tests, green**), confirmed
the first-fight band constants are **un-widened** (0.2/0.35, monkey@L1 = **0.29**),
read the combat core (`hitChance = acc/(acc+eva)` clamp [.15,.95], ±15% variance,
crit ×1.5, floor `max(1, 0.10·atk)` applied ONCE LAST — faithful to §4.6.1/3/4), and
confirmed the tests are **real, not neutered** (the `mc(level)` helper models a
realistic STR/AGI build while keeping monkey@L1 at BASE attrs; the no-dominated-stance
test is a genuine 2-lever Pareto check on the new atk/taken axis). Old saves load
safely (absent `attrs` → base 5, no crash).

**Model now matches the PRD:** 5 attrs STR/AGI/INT/SPD/LUCK (base 5, +1 pt/2 levels),
`attackPower = (weaponBase + 1.2·STR)·stance·satiety·durability`, accuracy/evasion hit,
`hpMax = 40+8·level+2·STR` (fresh MC ≈58 HP), crit from AGI/LUCK, INT = +0.5%·INT dmg
vs known foes, stances = glass-cannon↔tank (atk/taken only; **wear is now FLAT**, not a
stance axis). Weapon bases dropped to scale (pole 3, axe 5). Mob curve re-tuned +
per-mob archetypes (fast/evasive monkey, slow-heavy boar).

**⚠️ Feel-shift to watch at playtest:** with the MC's attackPower growing only
modestly over T0 (a few STR points + weapon upgrades), the agent flattened the mob
curve so **higher foes are beaten by HP-attrition (out-lasting), not out-bursting** —
faithful to the PRD's accumulating-HP/no-auto-heal design, but a real change from v0.3.1.
All magnitudes are liquid (D-059) — tune tomorrow.

Win-rate curve (seed-robust, pole/chudan, base@L1 → STR-build higher):
monkey 0.29/0.69/0.78/0.90/0.93 · wolf 0.03/0.35/0.51/0.70/0.80 · boar
0.07/0.45/0.62/0.79/0.88 · bandit …/0.02(L5)/0.90(L8).
