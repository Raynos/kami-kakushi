# Shared-tree git — committing safely with N agents in one checkout

How to commit when several agents share **one clone, one index, one
working tree**. This is the operational half of **ADR-196**'s hybrid
ruling (shared tree by default; heavy jobs opt into a worktree) and
**ADR-199** (which rules hunk-level staging OUT as a protocol and
fixes the opt-in criteria).

Read this if you are about to commit next to a live co-agent, or you
are sizing a job and wondering whether it belongs in a worktree.

## 1. The model, in one breath

A git checkout has three things, and **all three are shared** between
concurrent agents in this repo:

| | shared? | what protects you |
|---|---|---|
| **HEAD / history** | yes | the push mutex (ADR-196) |
| **the index** (`.git/index`) | yes | the pathspec-commit rule (§2) |
| **the working tree** (the files) | yes | **nothing** — see §4 |

Almost every shared-tree accident traces back to forgetting that the
middle row is shared. The last row is the one still genuinely open.

## 2. Commit by pathspec — and why it is safe

```bash
git add path/to/new-file.ts          # NEW files only
git commit -m "..." -- path/a path/b # edits need no staging at all
```

The `--` form is not a formality. It triggers git's **`--only`**
semantics: git builds a **temporary index from HEAD plus the named
paths' working-tree content**, commits that, and never consults the
shared index. So whatever a co-agent has staged is untouched — it is
not in your tree, and it is still staged when you are done.

A **bare** `git commit` (or `git add -A/-a/-u`, or `git add` of a
tracked file) snapshots the **shared** index instead, sweeping a
co-agent's staged work into your commit. This has happened for real
twice (`f84aff9`; `0e10d96`, which swept 6 files).
`guard-git-add-all.sh` blocks all of those shapes;
`SKIP_SWEEPGUARD=1` escapes it and every use is appended to the
committed [`sweepguard-ledger.md`][ledger].

[ledger]: ../../project/status/sweepguard-ledger.md

**Pathspec commits are file-level.** That is the whole contract, and
§4 is what it does not cover.

## 3. `git commit --patch` is a trap — do not reach for it

It looks like the obvious way to commit only your own hunks. It is
not safe here. Git seeds its temporary index **from the current
shared index**, so `git commit -p` commits the co-agent's staged
files alongside your selected hunk. Verified: it committed a
co-agent's staged file verbatim.

The sweep-guard blocks this form. That block is correct — do not
escape it.

## 4. The residual hazard: the shared working tree

The pathspec rule closes the index. It does **not** close these two,
and no staging trick can:

**(a) Same-file concurrent edits.** `git commit -- src/foo.ts`
commits the **whole working-tree copy** of `foo.ts`. If a co-agent
has uncommitted edits in that same file, they ride along in your
commit — possibly half-finished.

**(b) You verify a tree you do not commit.** `pnpm run verify` runs
against the **working tree** — HEAD plus your edits plus every
co-agent's in-flight edits. Your pathspec commit is HEAD plus *your*
paths. Those are different trees. A green gate proves the *working*
tree is green; it does not prove the *committed* tree is. This is the
mechanical root of the cede/fold norm ("any WIP reds all commits")
and of "don't fight someone else's red".

Both are working-tree problems. Both are what §6 (worktrees) exists
for. Neither is fixed by staging more precisely — see §5.

## 5. Private indexes (`GIT_INDEX_FILE`) — a RESCUE TOOL, not a protocol

Git's index is just a file; `GIT_INDEX_FILE` points git at a
different one, giving you a fully private staging area in the same
checkout, same branch, no worktree. `git add -p` respects it. This is
the only way to commit **hunk-level** in a shared tree.

**ADR-199 rules this OUT as a routine protocol** — it buys granularity
inside a file two agents are editing, but the tree it commits (HEAD +
your hunks) is one no gate ever ran against (§4b), so it trades a
file-level false green for a finer-grained one. Use it to **rescue** a
tangle, not to work in.

When you do need it:

```bash
export GIT_INDEX_FILE="$(git rev-parse --git-dir)/index-$AGENT"
git read-tree HEAD                     # seed from HEAD — a fresh index is EMPTY
git add -p src/foo.ts                  # hunk-select into YOUR index only
SKIP_SWEEPGUARD=1 git commit -m "..."  # NO pathspec (see trap 2)
unset GIT_INDEX_FILE
git reset -q -- src/foo.ts             # resync the shared index (see trap 3)
```

Three traps, all silent, all verified:

1. **Seed from HEAD, never from the shared index.** A fresh
   `GIT_INDEX_FILE` starts **empty**, and committing an empty index
   deletes the repo. Seeding from the shared index instead re-creates
   the `git commit -p` sweep (§3).
2. **No pathspec on the commit.** Adding `-- src/foo.ts` re-triggers
   `--only`, which rebuilds a temp index from HEAD + the *entire*
   working-tree file — **discarding your hunk selection**. So the
   commit must be textually bare, which means `SKIP_SWEEPGUARD=1` (safe
   here precisely because the index is private — the guard's premise,
   one shared index, is false in this mode). Ledger it.
3. **Resync the shared index afterwards.** `.git/index` still holds
   the *pre-commit* blob for the file you committed, so a co-agent's
   `git status` shows it as staged — and the staged diff is literally
   **a revert of your hunk**. `git reset -q -- <paths you committed>`
   fixes it and leaves other agents' staged entries alone.

## 6. Worktrees — opt-in, and who opts in

ADR-196: the shared tree is the **default**; heavy jobs run isolated.
A worktree is a second checkout of the same repo on its own branch —
its own working tree and its own index, so §4 simply does not apply.
You verify exactly what you commit.

**Opt in when any of these is true:**

- the job is a **multi-file sweep or refactor** (the render-split
  class), or touches a known **hot file**;
- it will hold the tree **red for a long window** (a co-agent cannot
  push through your red — that is the cede/fold cost);
- it is **long-running** (hours / overnight);
- it **regenerates broadly** (fixtures, gen registries) and would
  churn files co-agents are reading.

**Stay on `main` when** the work is a single surface, a handful of
files, and you can be green again in minutes. That is most work, and
it is the point of the hybrid — small agents go fast on `main`.

### Where they go

Git does not choose the location — **you do** (`git worktree add
<path> <branch>`). Only the bookkeeping is fixed: `.git/worktrees/<name>/`.
Three conventions are live in this repo:

| path | branch | who |
|---|---|---|
| `.claude/worktrees/agent-<hash>` | `worktree-agent-<hash>` | Claude Code's `isolation: "worktree"` |
| `tmp/ship/wt` | detached | `/ship` (`src/scripts/ship.sh`) |
| `../gh-pages-kami-kakushi` | `gh-pages` | the deploy checkout (`gh-pages.sh`) |

`.claude/worktrees/` is excluded via `.git/info/exclude` (local, not
the committed `.gitignore`).

### The two costs — know them before you opt in

1. **Its own `node_modules`.** A worktree is a separate checkout;
   dependencies are not shared. Budget a `pnpm install`.
2. **It is NOT what `:5264` serves.** The shared dev server runs from
   the **main tree root** — so your worktree's changes are *not*
   reachable in the shared playtest, and by PH6 ("if a player can't
   reach it, it doesn't exist") un-playtested work is not done. Either
   playtest **after** landing on `main`, or run your own vite on
   another port with the documented escape
   (`KAMI_ALLOW_MULTI_DEV=1` / `SKIP_DEVGUARD=1`) — **never** kill or
   respawn the shared `:5264` server.

### Landing it

Per ADR-196: land **atomically, in a declared quiet window**. Announce
it to live agents (`herdr agent list` → `herdr agent send`), merge to
`main`, verify green there, `pnpm run push`. The whole point of the
isolation is that the merge is the only moment you contend with anyone.
