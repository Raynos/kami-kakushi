# audit/

QA output — screenshots and recordings of the game's visual states, produced by the
[`capture-game-states`](../.claude/skills/capture-game-states/SKILL.md) skill, plus a written
findings doc per pass.

## Convention

- **One subfolder per audit pass**, dated/named for what it covers — e.g. `audit/baseline/`,
  `audit/2026-06-25-first-slice/`.
- Each pass folder holds its captured frames (`.jpg`/`.png`), any recordings (`.webm`), and an
  **`AUDIT.md`** with the findings.

## AUDIT.md shape

```
# {Pass name} — {date}{ · optional score}

Screenshot-grounded audit of the live build (driven headlessly via the play API).
Frames in this folder: {list / what each shows}.

## Per-state findings
### {state} — {what the pixels show + the one lever to improve it}

## Root-cause buckets
1. {recurring problem}

## Strategy
{the approach to address them, in priority order}
```
