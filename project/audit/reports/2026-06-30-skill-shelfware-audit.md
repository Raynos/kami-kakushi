# Skill shelf-ware audit — `.claude/skills/`

Date: 2026-06-30 · Author: audit agent (read-only; recommends, does not edit)

**Question:** Which adopted skills are never actually invoked (shelf-ware), and
which standing RULES are buried inside opt-in skills that should be lifted UP
into the always-loaded AGENTS.md Conventions?

**Method & honesty caveat (R2).** Skill *invocations* live in session
transcripts, **not** in the repo — so there is **no exact fire-count**. Every
verdict below is inferred from the **durable artifacts** each skill is supposed
to produce, plus `git log` and `project/journal/` mentions. **Adoption** (a
commit that adds/edits the skill) is distinguished from **use** (the skill
applied to do work). Where I infer rather than have hard evidence, it is
flagged.

## Headline finding (read this first)

**The audit's founding premise has already been largely actioned.** The cited
bug — "the `tdd` skill was adopted but its rules are buried where they never
fire" — was **real at adoption (session-05, 2026-06-29)** but has since been
**remediated**: the test-discipline standing rule now lives in **AGENTS.md
Conventions** as the **"Test discipline"** bullet (D-086…D-088,
`AGENTS.md:150-164`), always-loaded, with the skill demoted to *the procedure
the bullet points to*. The bullet even states the exact principle this audit
applies: *"a standing rule buried in a never-invoked skill doesn't fire."*
Likewise the `diverge` mandate is already an ambient Convention
(**"Design by divergence — D-075"**). So the two skills most likely to hide
ambient rules **already had those rules lifted**. The remaining
recommendations are small.

**Wiring is sound (the human's other worry).** All seven skills exist on disk
with valid frontmatter and are registered: the 5 agent skills appear in the
agent's available-skills list; `handoff`/`prepare-to-exit` are deliberately
**human-only** (`disable-model-invocation: true`) `/slash` commands, correctly
absent from the agent list. **No never-hooked-up skills; no AGENTS.md drift.**
See the Wiring dimension section below.

## Verdict table

`WIRED?` = is the skill actually registered/invokable (upstream of usage — a
skill that isn't registered can't fire regardless of intent). **agent-yes** =
appears in *this session's* agent available-skills list (model-invokable);
**human-only** = valid on disk but `disable-model-invocation: true`, so it is a
**human `/slash` command by design**, correctly absent from the agent list.

| Skill | WIRED? | Verdict | Evidence (artifact / commit / journal) | Recommendation |
|---|---|---|---|---|
| `battery` | **agent-yes** | **active** | 10 reports in `project/audit/reports/`; `experiment-registry.md` populated; raw snapshots in `brainstorms/raw/`; journals session-01-v0.2-battery, session-02-battery-skill, `2026-06-29-v03-fidelity-battery.md` | keep-as-is |
| `capture-game-states` | **agent-yes** | **active** | ~11 dated folders in `project/audit/screens/` (incl. `2026-06-29-v03-qa-sweep`, `v03-gallery`, `latest`); cited from `ui-design.md`, `qa-playtesting.md` | keep-as-is |
| `diverge` | **agent-yes** | **active** | `variants-log.md` Closed crosswalk (House-Influence R2, Estate-map R3); `screens/diverge-influence/` + `diverge-map/` with `DECISION.md`; R-items in `review.md`; commits `10bc048`/`bf55ef4` (DIVERGE), session-19 | keep-as-is; **rule already lifted (D-075)**. Skill body is internally **stale** (branch-based §§ vs D-075 in-codebase model) — flag for cleanup, not shelf-ware |
| `tdd` | **agent-yes** | **partial→active** | USE evidence: session-19 "TDD surfaced a real subtlety"; commit `14c0283` test(combat) invariants D-058/D-061; tests derive fixtures from source (`economy.test.ts` imports `balance`, `MAX_ESTATE_STAGE`, computes `farmYield` via `reduce`). 26 `*.test.ts` files. | keep-as-is; **rule already lifted (D-086…D-088)** |
| `grill-me` | **agent-yes** | **partial (dormant)** | USE evidence is **early only**: journal session-01 (2026-06-25), the large `2026-06-25-*` brainstorms, `PARKED-THREADS.md`. No invocation evidence after 2026-06-25. | keep-as-is; minor path staleness (see below) |
| `handoff` | **human-only (by design)** | **n/a — human skill** | On disk, valid frontmatter (`name`+`description`+`argument-hint`), `disable-model-invocation: true`. The human's `/handoff` command; output goes to git-ignored `tmp/`. Not an agent skill — out of the shelf-ware scope. | keep-as-is — wiring correct |
| `prepare-to-exit` | **human-only (by design)** | **active (new)** | On disk, valid frontmatter, `disable-model-invocation: true`. The human's `/prepare-to-exit` command. Created session-28; commits `3af676a`/`01e63e2`; journal `cac3217`. Pure delegation to `working-agreements.md`. | keep-as-is — the model pattern |

## Wiring dimension (are the skills even hooked up?)

The human raised the upstream worry: *"maybe we wrote the skills and never
registered them."* **Verified — and the worry does not hold.** All seven
`.claude/skills/<name>/SKILL.md` files exist with **valid frontmatter** (a
`name:` and `description:`, which is all the harness needs to surface them).
There is **no `.claude/commands/` dir** — that is expected; skills auto-register
as `/<name>` commands by their frontmatter `name`.

**Two audiences, both correctly wired:**
- **Agent-invokable (5):** `tdd`, `battery`, `diverge`, `grill-me`,
  `capture-game-states` — no disable flag, so the Skill tool lists them.
  Confirmed present in **this session's** agent available-skills list.
- **Human-only (2):** `handoff`, `prepare-to-exit` — both carry
  `disable-model-invocation: true`, which is **why they are absent from the
  agent's list and that is correct**: they are the human's own `/handoff` and
  `/prepare-to-exit` slash commands, surfaced to the human's command menu, not
  the agent's. Their frontmatter is valid, so the human's slash command
  resolves. **Not shelf-ware, not unwired** — out of the agent shelf-ware scope.

**No never-hooked-up skills.** Every skill on disk is registered and reachable
by its intended audience.

**AGENTS.md drift check:**
- **Claimed-but-missing:** none. AGENTS.md names all seven; all seven exist on
  disk with valid frontmatter.
- **Wired-but-unmentioned:** the agent's list also shows many *plugin* skills
  (`frontend-design`, `chrome-devtools-mcp:*`, `code-review`, `hookify:*`,
  `claude-md-management:*`, `deep-research`, etc.). These come from
  `enabledPlugins` in `.claude/settings.json`, **not** `.claude/skills/`, so
  AGENTS.md's repo-skills layout legitimately does not list them. **Not drift.**

The shelf-ware question therefore stays focused on the 5 agent-invoked skills
below; `handoff`/`prepare-to-exit` are noted only for wiring completeness.

## Per-skill detail

### battery — active · keep-as-is
Strongest usage evidence of any skill. 10 dated reports, a populated
`experiment-registry.md` (the skill's own registry artifact), raw verbatim
snapshots, and multiple journal sessions. The skill is the engine behind most of
`project/audit/`.

**Buried ambient rules?** No genuinely-ambient rule to lift. The
**"Self-resolution boundary (anti-drift)"** (what an agent may self-resolve vs
must stop-and-ask) is, by the skill's own words, *"CLAUDE.md's 'stop and ask'
made operational"* — i.e. it is a procedure-local specialisation of an ambient
rule that **already** lives in AGENTS.md, not a new rule hiding here. The
**"routing-lane rule"** (marketing/qualification vs engineering for a
"design-is-wrong" finding) is a situational design heuristic, not an
every-session rule. Leave both in the skill.

### capture-game-states — active · keep-as-is
~11 screenshot pass-folders prove repeated firing; it is also a dependency of
`diverge` (variant screenshots) and the QA sweeps. The "DEV-only play API on
`window`" prerequisite is already an ambient Convention ("Playtest via code, not
synthetic input"). The **"prefer headful — headless misses semi-transparent
overlays"** gotcha is a procedure detail that belongs in `qa-playtesting.md` /
the skill, **not** Conventions — do not lift it.

### diverge — active · keep-as-is, but flag staleness
Hard evidence of use (closed variant sets, committed DECISION.md contact sheets,
R-items, DIVERGE commits). Its standing rule is **already ambient** as the
"Design by divergence — D-075" Convention.

**Caveat (R2):** the SKILL.md body is **internally inconsistent** — the §§2-8
branch-based mechanics (`git checkout -b diverge/<surface>`, `git branch -D`,
committed screenshots) contradict the D-075 banner at the top (in-codebase
variants behind a DEV-panel toggle). The skill *self-flags* this ("being
re-worked alongside the v0.3.1 DEV-panel build"). This is **doc-staleness, not
shelf-ware** — worth a cleanup pass so the procedure matches the locked model,
but the skill is actively used.

### tdd — partial→active · keep-as-is (rule already lifted)
The audit charter named this the prime suspect. Re-checked against current
state:
- **The standing rule is no longer buried.** `AGENTS.md:150-164` "Test
  discipline" carries the ambient rule (can-this-go-RED / derive-fixtures-from-
  source-not-magic-numbers / assert-the-design-lever / per-tier e2e+invariants),
  with D-086…D-088 as the ADRs and the skill explicitly named as *the deep
  procedure the bullet points to.*
- **Use evidence exists.** Session-19 journal: "TDD surfaced a real subtlety";
  commit `14c0283` adds combat invariants test-first (D-058/D-061). Tests
  **derive fixtures from source** rather than hard-coding magic numbers
  (`economy.test.ts` imports `balance`/`MAX_ESTATE_STAGE` and computes expected
  yields through the real `reduce`) — i.e. the discipline is visibly applied.

So the original "shelf-ware shipping the failures it exists to prevent" was true
**at adoption**; it has since been corrected by lifting the rule up. Nothing
further to lift.

### grill-me — partial (dormant) · keep-as-is
Clear early use (the 2026-06-25 discovery brainstorms, `PARKED-THREADS.md`,
session-01) but **no invocation evidence after 2026-06-25** — the project moved
from discovery into build, where this skill simply isn't the active tool. Not
shelf-ware (it fired, and may fire again on the next design push); just dormant.

**Buried rules?** Two candidates, both weak:
- **"write-then-speak" (tool call first → confirm → then claim "logged").** This
  is a good general honesty rule — but it is a *specific instance of R3*
  ("done is earned, not declared"; never claim something you haven't verified),
  which is **already ambient**. Lifting it would duplicate R3. Leave it.
- **"checkpoint to disk after every answer."** Purely interview-procedure-local;
  not an every-session rule. Leave it.

**Minor staleness:** the Setup step writes to `brainstorms/{date}-{slug}.md`,
but the repo convention is `project/brainstorms/`. Worth a one-word path fix,
unrelated to shelf-ware.

### handoff — human-only skill (out of agent shelf-ware scope) · keep-as-is
Wired correctly: valid frontmatter, `disable-model-invocation: true` → it is the
**human's `/handoff`** command, not an agent skill, so the agent shelf-ware test
does not apply. It writes to git-ignored `tmp/` by design (no committed trace
expected). The one git reference (`563492d`) put handoff-style content into a
committed review doc. **Buried rules?** None to lift — its only norm ("don't
duplicate journal/status content; reference by path") is already the repo's
"Durable by default" + "Docs taxonomy" Conventions.

### prepare-to-exit — human-only skill, active (new) · keep-as-is (model pattern)
Wired correctly: valid frontmatter, `disable-model-invocation: true` → the
**human's `/prepare-to-exit`** command. Created 2026-06-30. Notable as the
**anti-shelf-ware design**: it deliberately holds **no copy** of the checkpoint
steps and **delegates** to the ambient `working-agreements.md` "Checkpoint"
section, so it can never drift and has **zero buried rules** — exactly the
relationship every procedure-skill should have with its ambient rule. No action.

## Consolidated: rules to lift into AGENTS.md Conventions

**The big ones are already lifted.** This audit was chartered on the assumption
that important ambient rules were still buried in opt-in skills; verification
(R2) shows the two highest-value ones have **already** been promoted:

1. **Test discipline** (can-go-RED / source-derived fixtures / assert-the-lever
   / per-tier e2e+invariants) — **already in AGENTS.md** (`:150-164`,
   D-086…D-088). No action.
2. **Diverge-on-new-UI mandate** — **already in AGENTS.md** ("Design by
   divergence — D-075"). No action.

**Remaining candidates — all judged NOT worth lifting** (each is either already
covered by an existing ambient philosophy/Convention, or is genuinely
procedure-local):

| Candidate rule | Home skill | Why NOT lift |
|---|---|---|
| "write-then-speak — tool call first, confirm, *then* claim logged" | grill-me | Already covered by **R3** (done is earned, not declared). Lifting duplicates it. |
| "battery self-resolution boundary (doc-hygiene/capture only; never change a locked decision)" | battery | Skill's own words: a specialisation of CLAUDE.md's already-ambient "stop and ask". |
| "prefer headful; headless misses overlays" | capture-game-states | Procedure gotcha → belongs in `qa-playtesting.md`, not Conventions. |
| "don't duplicate journal/status content; reference by path" | handoff | Already covered by "Durable by default" + "Docs taxonomy". |

**Net recommendation:** no AGENTS.md Conventions changes are required for buried
rules. The actionable cleanups are doc-hygiene, not lifts:
- **diverge SKILL.md** — reconcile the stale branch-based §§2-8 with the D-075
  in-codebase/DEV-panel model (the skill self-flags this as pending v0.3.1).
- **grill-me SKILL.md** — fix the capture path `brainstorms/` →
  `project/brainstorms/`.
- **handoff** — keep, but note it as the one low-confidence/consolidation
  candidate.
