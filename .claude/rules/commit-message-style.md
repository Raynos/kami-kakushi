---
description: Commit-message style — Conventional-Commits subject, 50/72 body, required AI Assisted-by trailer.
---

# Commit-message style

Loaded every session (no `paths:` — applies to all commits). Ported from depscan's
`commit-message-style.mdc`, adapted to this repo: we keep **Conventional-Commits prefixes** (the repo
already uses them and they're machine-readable) and **allow implementation specifics in the body**
(this is a dev repo, not a product changelog) — but the body still **leads with intent, not a file
list**.

## Shape — the 50/72 rule

- **Subject line ≤ 50 chars:** `type(scope): summary` — imperative mood, no trailing period.
  - `type` ∈ `feat fix docs chore refactor test perf build`.
  - `scope` = the area touched (`hook`, `convention`, `core`, `ui`, `repo`, …); omit if broad.
- **Blank line**, then the **body wrapped at 72 chars**.
- Lead the body with **why / impact** in simple, active voice. **Break multiple changes into
  separate bullet points.** Implementation specifics (file/function/package names) are welcome in
  the body — but the opening line should read as the *reason for the change*, not an inventory.

## Required — AI attribution trailer

Every AI-generated commit **ends with**, after a blank line:

```
Assisted-by: AGENT_NAME:MODEL_VERSION
```

- `AGENT_NAME` = the tool (no colon — first colon is the delimiter), e.g. `Claude Code`.
- `MODEL_VERSION` = the **actual** model you're running, never hardcoded; `unknown` if unavailable.
- Example: `Assisted-by: Claude Code:claude-opus-4-8[1m]`
- **Never** use `Co-Authored-By:` for AI agents (GitHub renders it as a co-author/committer), and
  **never** add emoji banners (e.g. `🤖 Generated with [Claude Code]`).

Canonical spec: AGENTS.md "AI Commit Attribution (Required)". **Enforced** by `.githooks/commit-msg`
(a commit without a well-formed trailer is blocked; bypass a genuinely human commit with
`SKIP_ATTRIB=1`).

## Examples

✅ Good
```
fix(core): accept plus-sign aliases in email validation

The validator treated `+` in the local part as illegal, bouncing valid
Gmail aliases at sign-up. Relax the regex to the full RFC local-part set.

Assisted-by: Claude Code:claude-opus-4-8[1m]
```

❌ Avoid
- Subject over 50 chars, or a vague `update stuff` / `fixes`.
- A body that's only a list of filenames with no "why".
- `Co-Authored-By:` or emoji banners for AI-generated commits.
