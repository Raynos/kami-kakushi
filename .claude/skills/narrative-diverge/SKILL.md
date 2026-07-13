---
name: narrative-diverge
description: Generate 3+ genuinely-distinct TAKES for any fiction-voiced text the player reads (beats, dialogue, cold open, flavor lines, names, descriptions) — each take authored by an independent blind agent under a distinct dramatic brief, scored per-option with the taste scorecard, self-picked into canon, and surfaced to the human as a coherent review bundle with the alternates kept DEV-only until sign-off. ADR-139 (the story sibling of ADR-075). MANDATORY for all new story elements and all feedback-driven story improvements; only mechanical edits (typo, name sync) are exempt. Use when authoring or revising any narrative content, or when the human says "diverge the story / show me story options".
---

# Narrative diverge (ADR-139)

> **THE RULE:** no fiction-voiced text ships from a single take. Every new
> story element and every feedback-driven story improvement comes with **3+
> options**, each a **distinct dramatic choice** — the anti-slop discipline
> ADR-075 applies to UI, applied to story. Sibling skill:
> [`diverge`](../diverge/SKILL.md) (UI surfaces; shares the philosophy, not
> the procedure).

## §1 · Entry gate — mandatory vs exempt

**Fires for:** any authored **fiction-voiced text** the player reads — rung
beats, intro scenes, dialogue, the cold open, flavor/requirement lines,
item/creature/location **names and descriptions** — whether NEW or a
**feedback-driven improvement** to an existing unit. The rule bites at the
unit's own size: 3 alternative lines for a line, 3 alternative scenes for a
scene.

**Exempt:** mechanical edits only — typo fixes, name syncs, formatting,
compiler-driven restructures that don't change what the player reads.
Mechanical **UI copy** (buttons, errors, settings) is ui-design.md territory,
not story.

**Out of scope for this skill:** the human's queued fable audit/redesign
TODOs are fresh-context work the human kicks off — never pre-wire them.

## §2 · The procedure

1. **Bundle.** Group the units being authored/revised into a **coherent
   bundle** (a beat + its dialogue; a feedback batch touching one scene).
   Judgment call — bundles the human can review in one sitting, never 25+
   atomized picks, never everything forced into one mega-doc.
2. **Taste Pass 1 (FB-10, ADR-135).** Walk `docs/living/taste.md` into a
   constraint brief for the bundle — it binds ALL takes (they diverge in
   dramatic approach, not in whether they meet the bar).
3. **Write the dramatic briefs.** One per take, 3+ total, each committing to
   a **different story decision**: emotional register, information
   revealed/withheld, character stance. The test: a reader can say what each
   take commits the story to that the others don't. Paraphrase sets are
   rejected before authoring starts.
4. **Author blind, one agent per TAKE.** Independent agents (session-model
   routing, ADR-124), each authoring the COMPLETE bundle under its brief in FB-5
   narrative markdown, blind to the other takes — sets stay internally
   coherent. Workflow-friendly fan-out.
5. **Taste Pass 2 per take.** Score EVERY take with the
   [`taste-scorecard`](../taste-scorecard/SKILL.md); fix what you can; tag
   each ✘ [briefed] / [blind spot].
6. **Self-pick.** Best Pass-2 verdict, tie-broken by coherence with existing
   canon (T3 — the fiction causes the mechanics) and the four taste values.
   Write the pick **rationale** into the bundle review doc. Never block on
   the human.
7. **Land the pick in canon; keep alternates DEV-only.** The picked take goes
   into the FB-5 source (`src/core/content/narrative/` → `gen:narrative`).
   Alternates live in the DEV-only narrative-variants area (compiled,
   strip-gated from prod — zero prod flag-debt), switchable via the DEV
   **story-variant set-switcher** and readable in the **script-reader modal**
   (both LIVE since session 92 — DEV panel → **Story** tab: the set-switcher
   + the "⤢ Explore story" full-page reader; the reader-variant pick is
   HR-9. Source-area spec: `src/core/content/narrative/takes/README.md`).
   **The alternates MUST switch LIVE in the running game (ADR-143), not
   reader-only** (re-affirmed by the human 2026-07-07: ALL narrative diverges
   review the same way, in the DEV menu). The set-switcher's live override
   covers rung beats, intro scenes, **UI flavor lines** (`## prose flavor` →
   `dev.subFlavor`), and **requirement-completion lines** (`## prose
   req-flavor` → the CORE overlay `__setRequirementFlavorOverride` — future
   emissions swap; logged history stays, T2). If the unit you diverged is a
   type the engine can't yet swap live (dialogue, cold-open keyed prose
   today), **wiring that live-swap is part of the diverge** — render-read
   text extends the `dev.ts subFlavor` pattern, core-emitted text the
   req-flavor declaring-module-setter pattern; add the prefix to `LIVE_UNITS`
   so the human reviews it by *playing to the surface and toggling the take*,
   never by reading a doc or the reader-only modal.
8. **File ONE HR-item per bundle** in `project/human-in-the-loop/review.md`:
   the picked script as a continuous read, alternates under each unit, Pass-1
   brief + per-take scorecard blocks, pick rationale, and **exactly how to
   review it LIVE** — which DEV set-switcher entry, and the in-game surface +
   state to reach so the swap is visible (ADR-143: never "read the alternates
   below" as the review path). Journal + status bump, commit, move on.
9. **Sign-off is conversational.** The human reads in-game (set-switcher +
   script-reader modal) and tells the agent the verdict; no export controls,
   no in-modal canon writes. On sign-off: prune the losing takes from the
   DEV area — **the committed review doc is the archive** (canon carries only
   the pick). On override: swap the picked unit(s) in the FB-5 source,
   regenerate, then prune.

## §3 · Anti-patterns

- **Paraphrase divergence** — 3 rewordings of one idea is slop ×3; reject at
  step 3, before authoring.
- **Peeking takes** — an author agent shown a sibling take converges;
  authoring is blind, always.
- **Atomized review** — filing one HR-item (or one question) per line; the
  human reviews bundles.
- **Alternates in canon** — the FB-5 source never grows an alternates syntax;
  losers live in the review doc + DEV area only, and leave the tree at
  sign-off.
- **Pre-wiring the human's audit/redesign TODOs** — those get fresh,
  unpoisoned contexts.
- **Redlines held in context (ADR-188)** — a reviewer / blind reader's
  findings list is written to disk as a checklist BEFORE any fix lands
  and ticked as each does; applying "most of it" from memory is the W6
  false green (10 of 12 applied, reported complete).
