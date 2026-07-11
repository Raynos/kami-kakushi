# Session 180 — 2026-07-12 — a fixed sign-off banner for /prepare-to-exit

**Summary:** `/prepare-to-exit` now ends by printing one **byte-stable ASCII
banner**, so the human can scan a grid of idle herdr panes and tell at a glance
which sessions have already checkpointed — the silhouette is the signal, no
reading required. Tooling-only; no game code touched.

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

## Next intended steps

1. If the banner proves useful, promote the skill to a **global**
   `~/.claude/skills/prepare-to-exit/` so every project's sessions sign off the
   same way (today only this repo has the skill — verified: no global copy
   exists).

## Landmines

- **Alignment is load-bearing and easy to break.** The box interior is pure
  ASCII + box-drawing chars on purpose — **no emoji, no CJK**, both of which are
  double-width and would skew the right border. Verified mechanically (not by
  eye): all 8 lines render at exactly 67 display columns. If you ever edit the
  art, re-check widths with an east-asian-width count rather than trusting a
  character count.
- The skill is repo-local; a session in another project won't print it.
