# Plan — v0.3.2 playtest polish + intro/layout builds (autonomous)

**Status:** ✅ SUPERSEDED / DONE (2026-07-02) — archived. The live playtest blew
past this early F1–F16 outline; work proceeded **inline** off the human's rapid
feedback. The authoritative live record is the feedback doc
(`project/human-feedback/2026-07-02-playtest.md`, F1–F85+); this plan is kept for
history only, not as a live tracker.
**Source of truth for the feedback:**
[`project/human-feedback/2026-07-02-playtest.md`](../../project/human-feedback/2026-07-02-playtest.md)
(items F1–F16). **Distilled taste rules** in that doc's "§ Taste distillation"
graduate to [`ui-design.md`](../living/ui-design.md) at checkpoint.

## Context

A live playtest where the human gave rapid taste direction. **F1–F10 shipped
inline** (app-shell, white-fix, wider UI, log-to-right, smooth scroll, compact
pass). The human then said: _"keep building… with variants… I'll approve one
later and you can remove the dead code."_ So the rest are **features built as
D-075 variants** behind the DEV-panel toggle — self-pick a prod default, file an
R-item per variant, zero prod flag-debt, human locks one in later.

**Autonomy rules for this run:** self-pick defaults (never block), everything
reversible, commit each slice, keep the human-feedback statuses + `review.md`
R-items current, **headless-only (never open a browser)**. Partial-and-excellent
beats complete-and-compromised (R1).

## Build order (top-down; do each excellently, commit each)

Progress (2026-07-02, session-41): items 1, 2, 4 shipped; 3 folded; 5–7 (F12
typewriter, F13 interactive intro, F11 multi-panel) remain — F13 wants human
input on tone/branches.

1. **[✅ DONE — fac9f7f]** **DEV panel restructure (F16)** — a sub-header of two sections **Settings** ·
   **Variants**; the Variants list is a **collapsed per-surface summary**, click
   a surface to expand its 3 options; **most-recently-added surfaces front-loaded
   (top), older ones sink to the bottom.** DEV-only tooling → **no diverge**.
   _Do first — it makes the growing variant list reviewable when the human is
   back._
2. **[✅ DONE — c1b6d82]** **Cold-open slow reveal + padding (F14)** — the frame gets roomier padding
   (undo the F10 compact tightness on THIS atmospheric card; the button must not
   touch the border). **DIVERGE the reveal style:** A staged fade-cascade
   (default) · B GBA-style typewriter · C line-by-line _ma_. The **"Open your
   eyes" button appears only after a slow beat (~4.5s)** for the waking feel;
   reduced-motion → everything immediate.
3. **[↪ folded into the intro cluster — F12/F13]** **Story cascade AFTER open-eyes (F15)** — the post-awake narration currently
   pre-populates behind the cold-open card, so the cascade/scroll happens unseen
   ("the text already scrolled before I pressed the button"). Make the waking
   narration cascade **after** `open_eyes`, while the player is watching.
4. **[✅ DONE — e7f8cb5]** **Filterable log (F9)** — **DIVERGE:** A bottom tabs (default) · B toggle
   chips · C segmented control. Channels: **Story / Work / Combat / Progression /
   All.** Default view = **Story + a live "All" you switch to.** Story is a
   first-class, returnable tab.
5. **Story typewriter (F12)** — GBA char-by-char reveal for the **Story/narration
   channel only** (never combat spam — a blanket slowdown would drag combat).
   **DIVERGE** speed/style; reduced-motion → instant.
6. **Interactive incremental intro (F13)** — the physician (Sōan) is a character;
   let the player **respond / talk back**, revealed incrementally. Biggest —
   needs a small dialogue mechanism + content, and likely an **ADR** (the intro
   becomes interactive). **DIVERGE** the presentation. May pause here for human
   input on tone/branches.
7. **Multi-panel layout (F11)** — the reference idle-RPGs spread info across 5–7
   panels; we cram into two. **DIVERGE**; **reconcile with reveal-based
   progression** (panels appear as their surface unlocks, so early game stays
   sparse). Biggest layout change — likely its own plan/ADR.

Items 6–7 are design-heavy; if the human's still away I scope them (plan/ADR +
variants) but may leave the final call for their return rather than lock a
direction that changes what the game _is_.

## Per-slice checklist

- Build behind the DEV variant toggle where it's a player surface (D-075).
- Self-pick a coherent prod default; **prod ships only the default** (flag-debt = 0).
- Add **one R-item per variant** to
  [`review.md`](../../project/human-in-the-loop/review.md).
- Commit the slice (`SKIP_JOURNAL=1` during the rapid run; one session journal at
  checkpoint); stamp the matching F-item in the feedback doc.
- Never open a browser; verify headless via `npm run verify`.

## Resume pointer

On pickup: read the feedback doc's status column (✅ vs 🔧 vs 💬) + this order.
The last committed slice + `git log` says where we are. Live snapshot:
[`project-status.md`](../../project/status/project-status.md).
