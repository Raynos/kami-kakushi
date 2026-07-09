# Session 130 — 2026-07-09 — feedback capture: Bug/Question kind + bucket grouping

**Summary:** Added two capabilities to the DEV playtest-capture overlay (FB-3): a
**Bug/Question kind** toggle (default Bug) and a **bucket** field that groups
captures on disk by bucket slug instead of session id. `/drain-inbox` now scopes a
pass to ONE bucket (asks via AskUserQuestion when several exist) and routes a
Question to an answer/discussion rather than a reflexive fix. Verify green (17
gates); confirmed the note box + new controls render in the woodblock palette via
a headless shot.

## Why
Human ask: (1) tell the drain reader whether a capture is a bug to fix or a
question they're exploring; (2) group feedback so a drain can target one bucket
(`/drain-inbox map-feedback`) instead of sweeping everything. The human wanted the
on-disk file/folder keyed by **bucket name, not session id**, with ungrouped
captures falling back to the per-session file.

## Design
- The dev-server middleware already keys the filename + sidecar folder purely off
  the POST `session` field. So the client now sends a **file key** =
  `slugGroup(bucket) || sessionId` in that field — bucket slugs are allowlist-safe
  (SESSION_RE), so **zero server path changes** were needed. `map feedback` →
  `pending/map-feedback.md` + `pending/map-feedback/`; ungrouped → the old
  `pending/<sessionId>.md`.
- Kind lives in the entry heading (`## Bug ·` / `## Question ·`) and the sidecar
  JSON. A bucket file spans sessions/builds, so each entry's JSON now also records
  `group` / `session` / `build` provenance, and grouped files get a **bucket
  header** (`# Playtest bucket — <name>`) instead of the session header.
- Kind toggle (vermilion Bug / gold Question) + bucket input (datalist of recent
  buckets from localStorage) sit in a meta row under the box header; both sticky
  across captures within the mount.
- Claude Code has **no dynamic input-box autocomplete** for slash args (confirmed
  via docs) — `argument-hint` is a static string; AskUserQuestion is the way to
  offer a computed pick-list, which is exactly how the skill surfaces the buckets.

## What changed
- `src/ui/capture-format.ts` — `CaptureKind`, `EntryMeta`, `slugGroup`,
  `captureFileKey`, `buildBucketHeader`; `buildEntry` takes a file key + meta
  (kind in heading, provenance in JSON, sidecar links keyed off the file key).
- `src/ui/capture.ts` — sticky kind/group state; meta row (kind toggle + bucket
  input + recent-buckets datalist); header/file-key computed per-capture at submit;
  `rememberGroup` localStorage recents; shared Esc/⌘Enter handler on the bucket
  field too.
- `src/scripts/playtest-inbox.ts` — doc comment: `session` is a file key (bucket
  slug or session id). No logic change.
- `.claude/skills/drain-inbox/SKILL.md` — ONE bucket per pass (arg or
  AskUserQuestion pick-list); kind-aware triage (Question → answer/discuss);
  `<key>` (bucket-or-session) archive; `argument-hint: [bucket]`.
- `project/playtest-inbox/README.md` — buckets + kind documented.
- `src/ui/capture-format.test.ts`, `src/ui/capture.test.ts` — kind + bucket
  coverage (heading, file-key re-key, bucket header, provenance, stickiness).

## Next intended steps
1. First real bucketed drain will exercise the new `/drain-inbox <bucket>` flow.

## Landmines
- The `session` POST field is now overloaded as a **file key** — documented in
  both `capture-format.ts` and `playtest-inbox.ts`. Server treats it as an opaque
  allowlist-checked path base; a bucket slug must stay SESSION_RE-safe (`slugGroup`
  guarantees kebab).
- Sidecar names are still `<stamp>.json` (timestamp to the second); two captures
  in the same bucket at the exact same second would collide the sidecar (rare;
  pre-existing within-session behavior — the `.md` still appends both entries).
- The concurrent co-agent's `e2e/*.spec.ts` edits were left untouched (shared-tree
  safety) — this commit is by explicit pathspec only.
