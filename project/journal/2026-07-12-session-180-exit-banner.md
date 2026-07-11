# Session 180 — 2026-07-12 — a fixed sign-off banner for /prepare-to-exit

**Summary:** `/prepare-to-exit` now ends by **always** printing one of two
byte-stable ASCII banners — **BYE** (clean) or **OOPS** (didn't finish clean) —
so the human can scan a grid of idle herdr panes and tell at a glance which
sessions have checkpointed, and how it went. The push became **best effort** in
the same pass. Tooling-only; no game code touched.

## What changed

- `.claude/skills/prepare-to-exit/SKILL.md` — new mandatory final step, "the
  sign-off banner". Three properties make it work as a *signal* rather than
  decoration, and all three are written into the skill as rules:
  - **Byte-stable.** Reproduce it character-for-character — no retyping from
    memory, no restyling, no personalising, no stuffing the run summary inside
    the box. A banner that differs per session can't be recognised at a glance.
    (This is why the art lives in the skill file at all: the skill otherwise
    deliberately holds *no* copy of the ritual, deferring to
    `working-agreements.md`.)
  - **Last thing emitted** — fenced block, nothing after it (no trailing prose,
    no further tool calls) — so it sits at the bottom of the idle pane.
  - **Gated on a genuinely green checkpoint.** Anything left local, a red gate,
    or a refused push ⇒ **no banner**, just the outstanding list. A banner over
    a half-finished checkpoint would be a false green (PH3).
- `project/journal/2026-07-12-session-180-exit-banner.md` — this entry.

The human chose the design from three candidates (sleeping fox · block wordmark
· torii gate); the block wordmark won on the one axis that matters here —
legibility when the pane is squished, where the softer art blurs into ordinary
log output.

## Appended — the first run of the skill exposed two design holes

Ran `/prepare-to-exit` for real; the co-agent WIP in the tree blocked the push,
so under the v1 rule the skill printed **no banner at all** — and the human
(rightly, loudly) objected. Two fixes, commit `7b3bb27d`:

1. **A banner ALWAYS prints — a failure switches it, it doesn't suppress it.**
   The v1 rule ("push refused ⇒ no banner") was self-defeating: *a silent
   failure looks exactly like a session that never ran the skill*, and you
   cannot read "did this checkpoint?" off an empty pane. So there is now a
   second banner — **OOPS** (heavy double border, squarer silhouette, so it's
   still distinguishable from BYE when the pane is squished/blurred). PH3 is
   still honoured: a BYE never flies over a half-done checkpoint. The *detail*
   lives in the report; the *banner* only answers "did it run, and did it land".
2. **The push is BEST EFFORT** (human steer). A push blocked by a **co-agent's**
   red is the shared tree working as designed, **not** a failed checkpoint —
   leave the commit local and shrug; the next agent to go green carries it out.
   It only *matters* when nobody is left to carry it, so the rule keys on
   `herdr agent list`: **others live → BYE**; **you are the only/last agent →
   the commit is STRANDED → OOPS**. Encoded in the ritual itself
   (`working-agreements.md` step 4), since the skill deliberately holds no copy
   of the steps.

## Appended — what the banner actually ASKS (the final semantics)

The human then sharpened what OOPS *means*, commit `17d8732b`. The two banners
answer exactly one question, and it is **not** "did the git commands succeed":

> **Is it safe to KILL this pane right now?**

- **BYE** — safe to close: checkpoint done, nothing left in the session, green,
  at a coherent stopping point.
- **OOPS** — do NOT close. **Two** cases, weighted the same:
  1. **Something is wrong** — red, broken, a stranded push … *or you don't
     know*. Uncertainty is an OOPS on purpose: a safety signal fails **loud**,
     not optimistic.
  2. **The session is half-built** — `/prepare-to-exit` was run **too early**;
     the work is mid-implementation and killing the pane leaves it half
     implemented. **A clean `git status` does NOT mean done**, and committing
     half-finished work does not launder it into a BYE. The skill forces the
     question outright: *if this pane were killed right now, would anything be
     left half-implemented?*

## Next intended steps

1. If the banner proves useful, promote the skill to a **global**
   `~/.claude/skills/prepare-to-exit/` so every project's sessions sign off the
   same way (today only this repo has the skill — verified: no global copy
   exists). **This is the one gap against the human's stated goal** ("I enter a
   *random* Claude Code tab and see the banner") — today that only holds for
   panes sitting in *this* repo.

## Landmines

- **Alignment is load-bearing and easy to break.** The box interiors are pure
  ASCII + box-drawing chars on purpose — **no emoji, no CJK**, both of which are
  double-width and would skew the right border. Verified mechanically (not by
  eye): BYE renders at 67 display columns on all 8 lines, OOPS at 74. If you
  ever edit the art, re-check with an **east-asian-width** count — a plain
  character count will lie to you.
- The skill is repo-local; a session in another project won't print it.
- **The OOPS banner has never actually fired in a live run** — its criteria are
  written but unexercised. First agent to hit a genuinely half-built exit is the
  one who proves it.
