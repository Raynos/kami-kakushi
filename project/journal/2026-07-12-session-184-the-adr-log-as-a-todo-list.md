# Session 184 — 2026-07-12 — the ADR log had become a TODO list, and a lying one

**Summary:** The human asked whether other agents had been using `docs/living/decisions.md`
as a TODO list / roadmap instead of writing real plans. Read all 3,709 lines (ADR-001 →
ADR-187), verified every candidate against `src/` with five parallel agents, and drained the
findings into a plan: [`docs/plans/opus-2026-07-12-adr-embedded-work.md`](../../docs/plans/opus-2026-07-12-adr-embedded-work.md).
The answer is yes — **and the log misleads in both directions**, which is the finding that
matters. No code was built (the human asked for the plan; several items are his call).

## What changed

- `docs/plans/opus-2026-07-12-adr-embedded-work.md` — **new.** The full sweep, triaged
  HIGH (7 · real work, no home) / MEDIUM (9 · T1-scoped or needs a human call) / LOW (the
  ADR is yapping — recorded so the next sweep doesn't re-derive them). Steps S1–S6.
- `project/todo-human.md` — the plan added to the reading queue.
- `docs/plans/README.md` — regenerated (`pnpm run checkpoint`).
- Commit `2b85b719`.

## The finding

This is the **undeclared twin** of the failure the new `deferred-work` gate
(`src/scripts/verify-deferred-work.ts`, landed by a co-agent this same day) exists for. That
gate catches the *shouted* case — a capitalised `NOT BUILT` in canon citing no home. Its own
header concedes the rest: *"The UNdeclared case … is not mechanically detectable."* Work was
parked in **Consequences bullets**, `BUILD TODO (v0.3.2)` lines, `Future work:`,
`Known limit.`, `Deferred:` and `Follow-up (not in scope)` — none of it in `docs/plans/`, so
none of it startable by the session brief.

**But the log is also an inaccurate queue, which is worse than an empty one.** Verified
against source:

- All **four** loud `BUILD TODO (v0.3.2)` markers (ADR-098/100/101/102) are **STALE** — the
  U1–U4 rename, the full 5-attr + accuracy/evasion model, the atk/taken stance axis, and the
  3rd T0 weapon all shipped. An agent reading the log for work would build what already exists.
- **Three ADRs marked ✅ describe mechanisms that do not exist in the code:**
  - **ADR-164** — the HP-mend lane (paid treatment + rest-at-sickroom, food satiety-only) was
    never built; `cook_meal` is still the only healer, exactly what the ADR retired. Three code
    comments *assert* the unbuilt model; `combat.ts:140` says the opposite.
  - **ADR-068** — the SFX engine is built and tested, then **globally muted** at
    `render.ts:520` on the human's 2026-07-07 "too comedic" call. An **un-ADR'd reversal of a
    signed ✅**, and HR-1 (the live taste call) would judge a silent game against canon
    demanding audio *before* it.
  - **ADR-184** — "cooking is SITED" is false; `cook_meal` never calls `canCookHere`. The build
    is *correctly* held (the sim priced the walk out of band → **HD-40**, open) — the record is
    what's wrong, in the ADR **and** in a stale `reveals.ts:50` comment.
- **ADR-163** ships two live contradictions of its own signed law: Yohei's purse clamps
  **per-transaction**, not per-visit (an unbounded coin faucet), and the rice `withdraw` verb is
  still wired — `render.ts:5410` even admits the rows are "vestigial … a later chunk" that never
  came.
- **ADR-186**'s positional `greeting.<i>` ids are a live **save-integrity bug** with a named fix
  and no home: re-ordering greeting lines in a narrative `.md` silently re-points an old save's
  log line to its neighbour, and the orphan sensor cannot see it.

## Next intended steps

1. **S1 (docs-only, agent-safe, start here)** — stop the log lying to the next reader: strike
   the four stale `BUILD TODO`s, mark ADR-094/ADR-099 superseded, flip **ADR-179 ▶️ → ✅** (it is
   fully built; only its S7 PRD ripple is owed), correct ADR-184's cooking claim, and record the
   **ADR-068 audio mute** as a real ADR.
2. **S2/S4** — the economy contradictions (Yohei's purse, the withdraw verb) and the greeting-id
   save fix. Both agent-safe; S2 rides the ADR-132 balance flow.
3. **S3** — the HP-mend lane. Mechanism is agent-safe; its prose is an ADR-139 3-take diverge
   (Fable).
4. **Human calls, filed by S5/S6:** the **audio** question (re-do the palette, or formally retire
   ADR-068 — but HR-1 must not be judged against silence by accident) and the **combat-timing
   review** ADR-148 deferred and nobody ever ran.

## Landmines

- **Doc hygiene found in passing:** **ADR-147 does not exist** (the log jumps 146 → 148);
  ADR-179 still reads ▶️ IN PROGRESS though the code is complete; ADRs 183/186/184/185/187 sit
  out of numeric order in the file.
- **S3 severs `cook_meal`'s HP restore** — that is the *only* current mend, so the free
  rest-at-sickroom trickle must ship **with** the paid action, never after it, or an unlucky
  broke player strands (the exact failure ADR-092's soft-fee was designed around). The sim's
  no-stranding detector is the guard.
- **S4 touches the save format.** Greeting ids re-key existing descriptors; old saves must still
  load (ADR-186: keyless legacy entries rehydrate verbatim). Likely needs a schema bump.
- The `LOW` tier is deliberately *recorded, not actioned* — it exists so the next agent to read
  `decisions.md` doesn't re-derive the same twenty dead ends.
