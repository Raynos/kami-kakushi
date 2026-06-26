<!-- Copy to journal/{YYYY-MM-DD}-session-{NN}[-{topic}].md. ONE file per session. -->
<!--
  THE JOURNAL IS A CHRONOLOGICAL LOG (history: "how it got here"), NOT a live snapshot.
  The live "current state / how to resume" lives in memory/project-status.md — keep THAT current, not this.
  RULES:
    • Summary at the TOP (the "read this first" entry point) — the one part you keep current.
    • Everything else is APPENDED at the BOTTOM in chronological order (oldest→newest). NEVER prepend.
    • No stale "current state" block — forward-looking notes live in the LATEST entry + project-status.md.
    • Short session → use shape A (one coherent entry). Long /loop session → use shape B (summary + entries).
    • Split a long or multi-topic session into multiple files (…-session-NN-{topic}.md) rather than one giant file.
-->

<!-- ============ SHAPE A — short / single-purpose session ============ -->

# Session NN — {YYYY-MM-DD} — {one-line tagline / goal}

**Summary:** {1–2 sentences: what happened + any ADR/doc updates}.

## What changed
List every file touched (docs too, not just code):
- `{path}` — {what & why}

## Next intended steps
1. {step}

## Landmines
- {gotchas, side effects, anything that could trip up a cold resume}


<!-- ============ SHAPE B — long /loop or multi-iteration session ============ -->

# Session NN — {YYYY-MM-DD} — {tagline}

## ☀️ SUMMARY (read this first)
{A current, coherent overview of the whole session arc — keep this current as the session grows. Point to the
live snapshot (memory/project-status.md) and any key output docs. Note: "this file is HISTORY, not live state."}

---

## 1 · {first thing done}
{self-contained: what was done + verified + the commit/result}

## 2 · {next thing done}
{…appended below #1, in order…}

<!-- …keep appending numbered/dated entries at the BOTTOM as the session progresses… -->

---

## Next intended steps (current)
1. {step}

## Landmines (current)
- {gotchas}
