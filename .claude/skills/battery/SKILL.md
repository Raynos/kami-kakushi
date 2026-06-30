---
name: battery
description: Run a multi-lens stress-test battery on the game's spec/design/build — independent fresh-eyes agents attack it through different evaluative lenses via a Workflow, findings are adversarially grounded and de-duplicated by a convergence critic, raw verdicts are snapshotted verbatim, a scored report lands in project/audit/reports/, and an experiment registry tracks which lenses have run so each battery brings a fresh angle. Use when the human says "run a battery", "stress-test the spec/design/build", "mini battery", "audit it with agents", or at a milestone / pre-build / pre-ship gate.
---

# Battery

A **battery** is a multi-agent stress-test: independent reviewers each read the subject *cold* through a
different **lens**, return structured findings, and a convergence critic de-duplicates and scores them.
We have run this ~four times ad-hoc (PRD V2, state-of-the-game v0.1, v0.2). This skill makes it **one
repeatable operation** with a registry so we stop re-auditing unchanged areas and always bring a fresh angle.

It is **a sharp tool, not a self-improving machine.** Agents cannot reliably grade their own output —
optimization drifts toward defensible-but-trivial findings. Truth comes from **(a) the human's lived
knowledge of the game** and **(b) reality at the build/playtest gate.** So there is no self-grading loop here.

## Two modes

- **Full battery** (milestone / pre-build / pre-ship gate): 6–13 lenses + a convergence critic. Diverse
  coverage, scored, registry-tracked.
- **Mini battery** (validate one fix / one scenario): ~3 lenses from different angles (does-it-work /
  failure-modes / player-experience). Same archiving, lighter synthesis, **no** new registry lenses.
  Skip the battery entirely for **taste/judgment calls** — those need conversation, not agents.
- **Diff re-audit** (P1 — after a locked-ADR execution / large refactor, *before* calling it done): a
  focused independent re-pass over **just the diff** on the *current* build (not the whole subject) — ~3
  lenses: *does-the-change-do-what-the-ADR-says* / *new-failure-modes-introduced* / *did-it-touch-an-
  approved-design-or-balance-pick* (if so, **flag it + offer to revert** per P2 — never silently change an
  approved aesthetic). Same archiving, **no** new registry lenses. This is the cheap confidence pass v0.3
  ran post-M2·8 (it came back clean — that *confidence* is the point). The build the human will actually
  play often changed substantially after the last full battery, so re-audit the **delta**, not the
  milestone.

## The four steps

### 1 · Consult the registry (and bring a fresh lens)

Open `project/audit/experiment-registry.md` (table: *lens · scope · last run · report*). **Novelty rule:**
every **full** battery must include **≥1 lens not yet run on this subject**. Use the menu below as a
selection palette; don't re-run unchanged areas — re-run proven winners only at a pre-ship polish gate.

#### Lens menu

**Game-quality lenses — the 7 signed scores (a full build battery runs all 7):**
| Lens | What it attacks |
|---|---|
| `fun` | Moment-to-moment engagement — is it *paced and fun*? Ground in the fun-proxy + firsthand play (`docs/living/fun-factor.md`). |
| `ui-polish` | Woodblock/ink intentionality vs AI-slop. **Screenshot-grounded** via `capture-game-states`. |
| `prd-faithful` | Build vs the **locked** acceptance criteria (no-magic / mediocre-start / trade ≤⅓ / active-only / the targets). |
| `readme-spirit` | Vision fidelity — the incremental-UI thesis, the four pillars + estate spine, breadth. |
| `human-feedback` | Are the human's **signed** locks *verified-real in code + tests* (not merely claimed)? |
| `incremental` | The reinvestment loop, the sinks, the no-dead-value ratchet — does value compound? |
| `laziness` *(↑=lazier)* | Masked corner-cuts: dead code, type-blinding casts, false-green tests, unacted flags. |

**Supporting game lenses (inform findings; situational):**
| Lens | What it attacks |
|---|---|
| `roadmap` | Are the experience gates real **RED-able** tests in `verify` today, or a wish-list? |
| `rough-edges` | New tuning/friction the latest build introduced (e.g. a retune that broke a default). |
| `macro-gap` | The unbuilt engine / vision-spine gap — is the gap **honest** and are the stakes named? |
| `test-integrity` | False-green tests, coverage holes, assertions that can't go RED. |
| `onboarding` | The teaching pattern (reveal-as-plot), discoverability, first-session legibility — each teach gated to its **moment of need**, no upfront monologue dump (F1); **and** the **"…and then what?"** after-state of every milestone/ceremony beat (F2). |
| `tension/scarcity` | **Generosity-creep (D-086):** auto-heal, autopilot, a loose economy, softened fail-states — where has comfort leaked in and drained the stakes? Tension is the default; flag generosity that isn't justified. |

**General spec/design lenses (kept from the source skill, re-skinned for the game):**
| Lens | What it attacks |
|---|---|
| `doc-consistency` | Stale text, broken cross-refs, **generated-vs-source drift** (`docs/content/` vs `gen-docs.ts`). |
| `persona-simulation` | Walk the spec/build as a concrete **player persona**; where does their path break? |
| `economy-arithmetic` | Balance math: koku sinks, yield multipliers, time-to-rank / 70-30 / ~28.5h targets, ratios — **and the invariants that secretly decide fun (A4):** does each upgrade close a **work→output→more-output loop**, or merely grant a *buffer*? do high-water marks **self-inflate** (re-judge their own payout)? is it **breadth without depth**? |
| `instruction-coherence` | Internal coherence of PRD / CLAUDE.md / ADRs — contradictions, undefined defaults. |
| `failure-state-walking` | Soft-stuck, durability dead-ends, legacy/edge states — walk every way to get stuck. |
| `ui-state-correctness` | Every UI state renders right: loading / empty / error / boundary / overflow. |
| `save-integrity` | Corrupt / legacy / tampered `localStorage` saves + `migrate()`. *(The useful kernel of "adversarial security" — the only real attack surface in a single-player offline browser game.)* |

> **Culled as unrelated** to a single-player offline HTML5 game: *business-ops* (no billing/SLA/customers).
> *Adversarial-security* is not run as such — its only relevant kernel is `save-integrity` above.

**Convergence critic** (not a lens — the synthesis agent): de-duplicates across all lenses, tags each
finding **new vs carryover**, reconciles disagreements, and assembles the scorecard.

### 2 · Run the lenses (a Workflow)

Drive it with **`Workflow`**, not a loose pile of `Agent` calls:

- **Pipeline** the lenses → then a convergence-critic stage. Each lens agent reads the subject **cold**
  (no prior conclusions handed in) and returns **structured** findings: `severity · evidence cite ·
  proposed fix · new-vs-carryover`. Use a JSON schema so the shape is enforced.
- For **large or surprising** claims, add an **adversarial refutation** check (a second agent prompted to
  *refute* the finding; default to refuted if uncertain) before it reaches the scorecard.
- **Routing-lane rule:** for any "the design is wrong" finding, ask whether **marketing/qualification**
  (telling the right player what this is) is cheaper than **engineering** a product change. Note the lane.
- **De-duplicate against prior reports:** carryover findings are *referenced, not restated*, so a repeat
  battery reads short (see the v0.2 report's §3 carryover index for the pattern).

### 3 · Archive everything (five artifacts)

1. **Raw verdicts** → snapshot the Workflow `.output` **verbatim** into `project/brainstorms/raw/` via
   `src/scripts/snapshot-research.sh <output-file> <slug>` (per CLAUDE.md — cheap lossless insurance).
2. **Synthesis report** → `project/audit/reports/<date>-<battery-name>.md` (or `state-of-the-game-<ver>.md`
   for a full build battery): scorecard at the top, converged findings, a **judgment queue** for the human.
3. **Bidirectional links:** the report cites the raw snapshot + any screenshot pass; the journal entry
   cites the report.
4. **Update the registry:** add/append each lens with its run date + report file.
5. **Route findings to the ledger:** every actionable finding becomes a row the human can action —
   an **ADR** in `docs/living/decisions.md` (for locked-design calls) and/or an **H/R-item** in
   `project/human-in-the-loop/`. *A finding with no ledger row gets forgotten.*

### 4 · Report to the human

Lead with the **verdict scorecard**, highlight **cross-lens agreement** (the same problem found by
multiple independent lenses is the strongest signal), then the **judgment queue** in plain language:
*problem · proposed solution · cost of inaction.* Keep it skimmable.

## Self-resolution boundary (anti-drift)

Battery agents (and you, applying their output) may **self-resolve only**:
- **(a) Doc hygiene** — fix stale text, add cross-refs, fill a missing *default* that's clearly implied.
- **(b) Capture** — log a new finding as an open ledger row.

**Never without the human** (this is CLAUDE.md's "stop and ask" made operational): change a **locked**
decision, promote an item into the spec/PRD, or resolve a **design/strategy** question. End every applied
batch with a plain-language summary of what changed and how to revert.

## Lessons log (separate from batteries)

When real use (a build/playtest gate, the human) reveals the battery **missed** something, log it in
`project/audit/battery-lessons.md` (*what missed · context · the fix*). On confirmation, patch **this skill**
— and prefer abstracting a principle that prevents a whole **family** of misses over patching the instance.
