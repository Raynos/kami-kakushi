---
name: prd-compress
description: Run the once-per-tier PRD compression sweep (Flow 2) — draft a tier's fat prose down to intent + acceptance criteria + pointers, archive the demoted text verbatim, file a reel-back plan + HR-item, and land only on human approval. DORMANT until that tier's taste review (HR-item) closes. Fable-routed judgment work. User-invoked only.
argument-hint: "Which tier to compress (e.g. T0) — only after its taste HR-item has closed"
disable-model-invocation: true
---

# PRD compress (Flow 2 — the once-per-tier compression event)

> Encodes **Flow 2** of the ADR-117 "PRD on a diet" decision
> ([`project/brainstorms/2026-07-03-prd-on-a-diet.md`](../../../project/brainstorms/2026-07-03-prd-on-a-diet.md),
> Flow 2, human-locked). This is the **big, judgment-dense** editorial move —
> compressing signed canon down to intent while preserving meaning. It exists so
> the procedure is **one invocation away** the day a tier's review closes,
> regardless of which session is live.

## ⚠️ Two guards before you start

1. **Gated on the tier's taste review closing.** The trigger is the tier's
   **human taste review (HR-item) closing** (Q3) — *not* code-ship. If the tier's
   HR-item in
   [`review.md`](../../../project/human-in-the-loop/review.md) is still open
   (e.g. **HR-1** for the T0 MS0–MS4 demo), **stop** — the tier isn't ready to
   compress. This skill is dormant until then.
2. **Routing: this is FABLE work.** Compressing signed canon is judgment-dense
   editorial work — deciding intent vs detail, drafting acceptance criteria,
   preserving meaning while deleting most of the words. Errors are subtle
   (silent meaning-loss) and **no gate catches them** (PH2/Flow 4). An Opus
   session should route the sweep itself to **Fable** unless the human steers
   otherwise (ADR-124). *Authoring* this skill was transcription; *running* it is
   the sweep.

## The sweep (Flow 2, verbatim)

1. **Trigger confirmed** — the tier's taste review (HR-item) has closed (guard 1).
2. **Draft the tier sweep** (Q6 granularity — surgical **subsection** edits, not
   whole-section rewrites) across §2–§6. Each compressed slice becomes:
   - an **intent summary** (what the system is *for*),
   - **acceptance criteria** (how you'd know it's right), and
   - **pointers** — to the code, the generated
     [`docs/content/`](../../../docs/content) tables, and the ADRs that carry the
     detail.

   The build is now the truth of detail (PH2); the PRD stops re-stating it.
3. **Archive the demoted text VERBATIM** to
   `project/archive/<date>-prd-t<N>-precompression.md` with a forward pointer
   (Q4) — the *why* always survives; nothing is lost, only moved.
4. **Insert gen-regions** where **build == end-state intent** (Q2's C half),
   reusing the shared splicer
   ([`gen-regions.ts`](../../../src/scripts/gen-regions.ts) +
   [`gen-prd-regions.ts`](../../../src/scripts/gen-prd-regions.ts), F1b Ph2's
   pattern — markers + `--check`). Numbers stay OUT (§4 ripple-frozen, ADR-021).
5. **File for review** — the sweep is a
   [`docs/plans/`](../../../docs/plans) **reel-back plan + an HR-item** in
   [`review.md`](../../../project/human-in-the-loop/review.md), and the plan
   joins the reading queue in [`todo-human.md`](../../../project/todo-human.md)
   (same commit — the pre-commit queue gate). **The human approves the diff
   before it lands** (Q3).
6. **Land as ONE commit.** The tier's §4 banner slice is superseded by pointers;
   from then on, **per-change ripple is retired** for the compressed slices
   (they're now build-truth + acceptance criteria, not hand-maintained prose).

## Content-preserving-transform discipline (AC-15)

A compression sweep is a large content transform — verify it the repo's way:
diff in **TEXT mode** (word-diff vs `HEAD`) so a binary output can't give a
false-clean diff, and assert the archived verbatim file is **NUL-free**. Count
prose width by **characters**, not bytes (CJK inflates a byte count).

## Rehearsal (dry-run, nothing lands)

To rehearse the mechanics without touching canon: copy **one** §-subsection to
`tmp/`, produce its compressed draft (intent + acceptance criteria + pointers)
and its verbatim archive file **in `tmp/` only**, and diff. This proves the
shape end-to-end while `tmp/` stays git-ignored — nothing in canon moves until a
real, HR-item-gated, human-approved sweep.

---

**Just made a single design change, not compressing a whole tier?** That's
**Flow 1** — use [`/prd-ripple`](../prd-ripple/SKILL.md).
