# human-in-the-loop/

The **human's queue** — the inverse of the task list. The task list is what *you* (Claude) do; this
folder tracks what only a **human** can do: decide design forks, answer blocking questions, and judge
things automated checks can't ("is it fun?", taste, tone, look).

- **[decisions.md](decisions.md)** — **open** **decisions & questions** (design forks, tradeoffs, things
  you're blocked on). IDs `H1…Hn`. **Open items only** — this is what the session-brief hook scrapes.
- **[archive.md](archive.md)** — the **closed** H-item crosswalk (a lean one-line index: H# → ADR +
  date + intent link). Not the record — just the index.
- **[review.md](review.md)** — open **reviews** (playtest feel, look, tone — sanity-checks a test
  can't make). IDs `R1…Rn`.

## How to use

1. The human reads `decisions.md` / `review.md` for what's waiting on them.
2. They action an item by answering inline (or just saying so in chat).
3. Mark it `✅ DONE — <answer/verdict>`.
4. **Graduate + archive** a resolved *decision* (see lifecycle below); a resolved *review* drives the
   fix or unblocks the next step.

## Decision lifecycle — graduate, then archive

A resolved H-item has **distinct durable homes, no duplication** — keep each to its one role:

| Role | Home | What it holds |
|---|---|---|
| Live queue | `decisions.md` | **open** items only |
| Closed index | `archive.md` | one-line crosswalk per closed item |
| The canon "why" | [`../../docs/living/decisions.md`](../../docs/living/decisions.md) | the **ADR** it graduated to |
| Verbatim intent | [`../human-feedback/`](../human-feedback) | the human's exact words |

When an item closes:

1. **Graduate** it. A decision future-us needs the *rationale* for becomes an **ADR** (`D-0XX`). A purely
   **mechanical / structural** item (e.g. splitting a file) **skips the ADR** — an archive row is enough;
   ADR-ing a no-op only dilutes the log. (One ADR may close several related H-items — e.g. D-070 closed
   H7/H9/H10.)
2. **Archive** it. Add a row to `archive.md` (H# · title · one-line resolution · → ADR · date · intent
   link) and **remove the item from `decisions.md`** so the live queue stays open-only.
3. **Apply** the decision to code/docs (often a batched ripple — when several land at once, stage them in a
   transient `project/status/` checklist tracker, deleted once empty).

**Status:** 🔲 open · ⏳ waiting on Claude prep · ✅ done. IDs are never reused. Keep these current —
surface a new item the moment a fork or unverifiable result appears.
