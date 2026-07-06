# Story take-sets (ADR-139) — open narrative diverges

One directory per **open** narrative-diverge bundle. Canon (`../*.md`) carries
ONLY the picked take; this area holds the **not-picked alternates** the human
compares in-game (DEV panel → Story) until sign-off. On sign-off the bundle's
directory is **deleted** — the committed review doc is the archive.

## Layout

```
takes/<bundle-id>/
  bundle.md     # bundle meta: title, review-doc path, rationale, take list
  take-b.md     # one file per alternate take — standard FB-5 grammar
  take-c.md
```

### bundle.md

```markdown
# bundle <id> · <title>
review: <repo-relative path of the bundle's review doc>
rationale: <one line — why the canon take was picked>

## take b · <label>
brief: <the take's dramatic brief — what it commits to>
scorecard: <compressed Pass-2 verdict, e.g. 18✔ 2✘ 1—>
file: take-b.md
```

Take files use the exact grammar of the sibling canon files
([`../README.md`](../README.md)) and are parsed/emitted by the same compiler
(`pnpm run gen:narrative` → `src/ui/storyTakes.gen.ts`, byte-compared by the
`gen-narrative` gate). A take may vary any unit type the switcher can swap LIVE
(ADR-143): rung beats, intro scenes, and **UI flavor lines** (`## prose flavor`
→ `dev.subFlavor`, live on the weapon-card etc.). Dialogue + cold-open keyed
prose are still reader-only — diverging one means wiring its live-swap first.

## Rules

- **State-compatible, always.** A take substitutes what the player READS —
  never what the game DOES. Decision option `id`s, `flags:`, `memory:`,
  `bonus:`/`stance:` effects must be IDENTICAL to the canon scene's; only
  prose (greetings, reacts, labels, topics' answers) varies. Swapping takes
  in DEV must never fork state or the RNG stream.
- **The picked take is never duplicated here** — it lives in canon; the DEV
  surfaces render it from the live registries.
- **Prune on sign-off** — delete the bundle dir + regenerate; an empty
  `takes/` means nothing is awaiting story review.
