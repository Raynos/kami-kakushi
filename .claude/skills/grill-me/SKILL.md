---
name: grill-me
description: Interview the user relentlessly about a plan, design, or topic, checkpointing every answer to a brainstorm file so nothing is lost. Use when the user wants to stress-test a plan, get grilled on a design, run a brainstorm or discovery session, extract what's in their head into a doc, or says "grill me".
---

# Grill Me

Relentlessly interview the user about every aspect of the topic until you reach shared
understanding. Walk down each branch of the decision tree, resolving dependencies one by one. The
real goal is to **extract what's in their head into a durable, organized markdown file** so nothing
is lost as context fills up.

## The capture file is the whole point

Long interviews fill up context. If you hold answers only in your head, you will eventually
misremember, conflate, or drop something. So you **checkpoint to disk after every single answer**.
The file, not your context, is the source of truth. Never make the user ask you to save progress.

## Setup (BEFORE the first question)

1. Create the capture file at `brainstorms/{YYYY-MM-DD}-{topic-slug}.md` (create `brainstorms/` if
   missing). Get today's date with `date +%F` if you don't know it.
2. Seed it with a header: title, date, the goal of the session, and an empty "Open flags" section.
3. Tell the user where you're saving, in one line. Then ask Q1.

## The checkpoint rule (non-negotiable)

After EVERY user answer, BEFORE you ask the next question:
- Append a structured entry: the question topic, the key facts/decisions from their answer (in their
  words where wording matters), and any flags (things they couldn't answer + who should).
- Update earlier entries if a later answer changes them.
- Only then ask the next question. Never batch multiple answers into one write.

**Write-then-speak:** the write that checkpoints an answer must be issued and confirmed BEFORE any
prose says "logged/captured." Tool call first → confirm → then claim.

## Interview method

- Ask **one question at a time**. For each, offer your **recommended answer** (best inference from
  context) so the user can confirm, correct, or redirect.
- Resolve dependencies in order: settle the upstream decision before its dependents.
- If a question can be answered by reading a file or the codebase, do that instead of asking.
- When the user **can't answer**, capture it as a flag with the right owner and move on. Don't stall.
- The moment the user floats a **new idea** (not an answer), fire 2–3 quick questions before
  developing it: *How would this work in the current design? What could it conflict with? What might
  they not be seeing?* Surface to the user only when it genuinely needs their input.
- Capture **tangents** under a `## Parking lot` section so they're not lost and don't derail the
  active thread — and **link it both ways**: add a bullet to `brainstorms/PARKED-THREADS.md` pointing
  back to this capture file + section, so divergent threads are recallable across sessions. Keep going
  until the user says you're done, or every branch is covered — then offer a completeness backstop
  ("anything we haven't touched?").

## Capture file structure

```
# {Topic}: Brainstorm / Discovery Notes
Date: {date} · Goal: {one line}

## Summary / key decisions      (running synthesis, updated as you go)

## Q&A log
### Q1 — {topic}
- Asked: {question}
- Captured: {facts, decisions, in their words where it matters}
- Flags: {open item -> owner}

## Parking lot (tangents / parallel threads)

## Open flags (pending input)
```

## At the end ("we're done" / "wrap it up")

1. Final read of the capture file for contradictions/gaps; reconcile them.
2. Promote settled decisions to their home — a `docs/` doc, and an ADR in
   `docs/living/decisions.md` for locked design calls — or leave them explicitly PENDING in the
   recap. Pending items are debt; never let them be silent.
3. If the session surfaced a rule that should shape every future session, propose a 1–2 line
   addition to `CLAUDE.md`.
4. Commit one snapshot for the session (capture file + any promoted edits + a journal touch).
5. Recap: what's captured, what got promoted, what's still PENDING, and the suggested next step.
