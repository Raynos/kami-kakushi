# audit/

QA output — the **written findings** and the **captured visual states** of the game, produced by the
[`capture-game-states`](../../.claude/skills/capture-game-states/SKILL.md) skill and the headless
`src/scripts/qa-shots.mjs` harness.

Two concerns, two folders:

```
audit/
  reports/   ← the text deliverables: battery audits + changelogs
  screens/   ← captured frames (.png/.webm), one subfolder per pass
```

## reports/

The written, code-grounded reviews — read these for *what the audits concluded*:

- `state-of-the-game-<date>.md` — a full state-of-the-game **battery audit** (multi-lens, scored).
- `v0.2-changelog.md` (and future changelogs) — what a given build actually changed.

These are linked from `project/status/project-status.md`, `project/human-in-the-loop/`, and the ADR log,
so keep their filenames stable.

## screens/

Captured frames and recordings, **one subfolder per pass**:

- **`screens/latest/`** — the live gallery, **regenerated** by `src/scripts/qa-shots.mjs` (it writes
  `qa-*.png` here and overwrites each run). Undated on purpose: it always reflects the current build.
- **`screens/<date>-<slug>/`** — a **dated**, one-off capture pass kept as a historical snapshot
  (e.g. `2026-06-26-m1-build/`, `2026-06-27-log-cascade/`, `2026-06-27-settings/`). These are not
  regenerated.

A pass that carries its own written findings puts an **`AUDIT.md`** in its folder alongside the frames,
in the shape below.

### AUDIT.md shape

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
