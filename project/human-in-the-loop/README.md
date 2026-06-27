# human-in-the-loop/

The **human's queue** — the inverse of the task list. The task list is what *you* (Claude) do; this
folder tracks what only a **human** can do: decide design forks, answer blocking questions, and judge
things automated checks can't ("is it fun?", taste, tone, look).

- **[decisions.md](decisions.md)** — open **decisions & questions** (design forks, tradeoffs, things
  you're blocked on). IDs `H1…Hn`.
- **[review.md](review.md)** — open **reviews** (playtest feel, look, tone — sanity-checks a test
  can't make). IDs `R1…Rn`.

## How to use

1. The human reads these for what's waiting on them.
2. They action an item by answering inline (or just saying so in chat).
3. Mark it `✅ DONE — <answer/verdict>`.
4. You then fold a resolved *decision* into its home doc (and apply it to code/docs); a resolved
   *review* drives the fix or unblocks the next step.

**Status:** 🔲 open · ⏳ waiting on Claude prep · ✅ done. IDs are never reused. Keep these current —
surface a new item the moment a fork or unverifiable result appears.
