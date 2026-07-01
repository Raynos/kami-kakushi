# Session 39 — 2026-07-01 — "play the game, stop the meta" steer + headless fix

**Summary:** A short, human-steered session. No game/build work — the human
(rightly) pushed back that R1 (the human playtest) has stayed open across
v0.2 / v0.3 / v0.3.1 while we kept marching toward v0.3.2, and asked how to make
*actually playing the game* the priority. I first answered with more
meta-programming (an ADR + a survey) — the exact anti-pattern — got called on it,
and course-corrected: started the dev server, and made two small durable changes.
No permanent docs (AGENTS.md / working-agreements.md) were touched — several
edits there were reverted at the human's direction.

## What changed

- `~/.claude.json` (NOT in repo) — this project's **Playwright MCP** was misconfigured
  as headed (`["@playwright/mcp@latest"]`) while chrome-devtools was already
  `--headless`; that's why a visible Chrome window popped. Added `--headless` to the
  Playwright args. **Needs a Claude Code restart to take effect.**
- `project/status/project-status.md` — added a temporary 🎮 **"PRIORITY: PLAY THE
  GAME — not build v0.3.2"** banner atop the "How to resume" block (the human chose
  this as the home — a near-term, self-deleting steer, NOT a permanent doc); fixed
  the stale `R1/R2 (human, non-blocking)` mislabel → **TOP PRIORITY**; condensed the
  resume steps to stay under the 120-line snapshot cap.
- `project/status/working-agreements.md` + `.claude/skills/prepare-to-exit/SKILL.md` —
  fixed a **checkpoint over-ask**: the D-089 reading-queue reconciliation used to
  blanket-`AskUserQuestion` about the *whole* remaining queue at exit (it asked about
  Plan A/B this session even though we never touched them). Now: reconcile **only docs
  engaged this session**; if none, make **zero** queue prompts and just report it.

## Reverted / not done (deliberately)

- A hookify rule blocking Playwright's `browser_navigate` was created, then **removed**
  once we fixed the root-cause config instead (headless Playwright exists — banning
  the tool was the blunt fix). No repo trace.
- Edits to `AGENTS.md` and `working-agreements.md` (a "playtest first" agreement) were
  **reverted** — the human wants this as a temporary steer, not permanent doctrine.
- A `.gitignore` entry for `.claude/*.local.md` was added then **reverted** — hookify
  rules ARE tracked in this repo (4 existing ones are committed).

## Next intended steps

1. **PLAY THE GAME.** Dev server: `npm run dev` → http://localhost:5173/. Pair
   screen-by-screen; fix the game directly from concrete human feedback. Do NOT
   spin up plans / workflows.
2. Heads-up: a fresh load may show a **stale mid-game autorun save** (Year 3, day 282,
   life 1/32, thousands of repeated "Work the home paddies" log lines) — start a new
   game to see the real opening.

## Landmines

- The Playwright `--headless` fix only applies **after a Claude Code restart**. Until
  then, this session's Playwright still pops a window — use the (already headless)
  chrome-devtools MCP, or have the human play in their own browser.
- Another agent was concurrently editing the 7 `docs/living/prd/*.md` files (Plan A
  build). Those are NOT this session's work — left untouched.
