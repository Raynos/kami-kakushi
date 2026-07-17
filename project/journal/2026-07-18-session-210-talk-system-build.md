# Session 210 — 2026-07-18 — build the FB-415 talk-system redesign

## ☀️ SUMMARY (read this first)

Building `docs/plans/fable-2026-07-17-talk-system-redesign.md`
(state-derived asks + authored beats, D1–D8). Pre-build Q&A with the
human locked four execution rulings (recorded in the plan's Status
block): all-Fable build, step 4 fires after the diverge SELF-PICK,
defaults accepted with a **full-T0 floor** (every person×rung with
talk today still talks after the port — nothing broken at any rung),
and variant (c) emerges during the diverge rather than pre-shaped.

This file is HISTORY, not live state — the live snapshot is
`project/status/project-status.md`.

---

## 1 · Pre-build rulings captured into the plan

Ran the plan's open questions past the human (AskUserQuestion):
routing, step-4 gate, the two non-blocking defaults, variant (c).
Amended the plan: Status → IN PROGRESS + a Rulings block; step 2
gains the full-T0 floor (re-homed lines and/or placeholder asks
cover later rungs — authored waves upgrade placeholders, never
create coverage); the Risks "ships with only the R0–R2 seed"
fallback is bounded by the no-broken-rung ruling.

## 2 · Step 1 — the core ask engine (TDD, red→green per slice)

Behaviors tested (the spec-of-record, per the tdd skill): rung-window
selection derives from RANKS order (no literals) · `ask` marks heard
+ leaves EVERY log channel untouched (D4) · presence/unknown-ask
no-ops · D6 freshness (heard dims; a state move un-hears — the key
handshake) · `unheardAskCount` newness · save round-trip + pre-v15
blob hydration (mutation-checked: broke hydration, saw RED,
restored — and re-applied my own wiped edits, see Landmines).

Built: `src/core/asks.ts` (AskDef · availableAsks · unheardAskCount
· askFreshnessKey — heard = stored freshness key still matches),
`src/core/content/asks.ts` (step-1 seed registry, placeholder voice
pending ADR-139 waves), `ask` intent (AC-6: reducer accepts only
what availableAsks offers), `asksHeard` in GameState,
SCHEMA_VERSION 14→15 (identity migration + validate hydration),
core/index exports, fixtures regenerated. `talk_to` untouched
(retires at step 4). Full vitest suite green (1413).

## 3 · Step 2 — the authoring pipeline (`## ask` grammar)

Extended the FB-5 compiler with the `## ask <id> · <npc>` block:
meta (`rungs:` window · required `label:` · optional `when:` /
`refresh:` / `native:`) + id-marked static answer prose. Closed
vocabularies live hand-written — `ask-refresh.ts` (D6 freshness
kinds: rung/season/works/health) and `ask-natives.ts` (real-logic
answers: house-wants, body-mend) — and emit validates authored keys
against them at compile time (file:line errors). `asks.gen.ts` is
the generated registry; `content/asks.ts` is now the gen→engine
mapping (overlay-aware via `ask.<id>.<lineId>` — takes bundles can
re-voice later without touching heard-state). Seeded the R0–R2
matrix: genemon ×2, soan, ohisa, oyae, shinnosuke (placeholder
voice, each pending its ADR-139 wave). The story doc gains an
"everyday asks" section. Registry-seam tests added (9 green).

Deferred, noted: takes.ts bundle units for asks land with the first
ask-answer wave (the overlay hook is live; only the bundle grammar
side is missing).

## 4 · Step 3 — the talk-surface diverge: taste Pass 1 (full walk)

Seam: herdr-checked `w8:p1` (skills-lib, `.claude/skills/` only — no
collision; corrected their stale "canon = v14" note to v15) and
`w7:p1` (QA/HR automation). I own `src/ui/render/map.ts`, new talk
variant code, `dev-surfaces.ts` (+1 row), talk styles.

Full 21-walk for the ask surface at the person row (✱ = applies):
P1✱ asks live ONLY here (stall keeps market talk; no log echo) ·
P2✱ reuse person-row/.verb/lock-hint/VOICE_* — no new primitives ·
P3✱ answer nameplate + voice from the def/person, set at source ·
P4✱ plates PATCH dim-state; answer content swaps inside a stable
container — never a row rebuild on tick · P5✱ expansion opens once,
re-asking replaces the answer in place, the list never jumps ·
P6✱ plates wrap clean at 390px · P7 n/a · P8 n/a · P9 n/a (asks are
everyday, not spawns — people already discovered) · P10 n/a ·
P11✱ Fallout idiom: ask-first, explicit close; a press never
auto-closes the surface · P12✱ typewriter is STORY-scope only → ask
answers render INSTANTLY (info, not story) · P13 n/a · P14 n/a ·
P15✱ labels/discovery hints point, never name the undiscovered ·
P16✱ D4: no channel write, no unread badge anywhere · P17✱ heard =
dimmed-NOT-disabled; the row wears the unheard-count mark; state
moves un-dim (D6) · P18 n/a · P19✱ plates = chrome register (tight);
answer text breathes · P20✱ expansion scrolls inside the zone pane ·
P21 n/a. Values: TST2 — dispatch re-render preserves open person +
open ask + visible answer.

## 5 · Step 3 — the diverge built: A/B/C live, A self-picked

Built the three-variant talk surface: **A · in-row ask plates**
(inline default in `render/map.ts` — incremental patch path, 新-count
chip, dim-heard plates, answer swaps in a stable container) ·
**B · VN-lite exchange** and **C · mini-transcript** (DEV-only in
`dev/variant-renderers.ts`, wholesale-rebuild per the market DEV
precedent, module-local open state). Registry row `talk` → HR-45;
`ask` reclassified NON_UI → PLAYER_INTENTS (sweep green, 23.9s).

Verified: full suite 1274 green · affordance sweep green · PH6 live
drive headless against a throwaway :5266 vite (the shared :5264 pane
was DEAD — nothing held the port; per the standing rule I did NOT
respawn it; flagged to the human) — 11 shots in
`project/audit/screens/2026-07-18-talk-diverge/` (A plates + both
answers + 新2→新1 drop, B exchange, C two-exchange transcript,
A at 390px) · strip-safety: `SHIP_DEV_TOOLS=0` build greps CLEAN for
all variant strings (the default T0 build ships DEV tools by
design). Pass-2 scorecards + the §5 pick rationale (A 21 · C 19 ·
B 18) live in the HR-45 item.

<!-- append further entries below, in order -->

---

## Next intended steps (current)

1. Step 1 — core ask engine (`src/core/asks.ts`, TDD): ask defs +
   `availableAsks` selector, `asksHeard` save-schema bump +
   migration test, `ask` intent (no log emission).
2. Step 2 — authoring pipeline: `## ask` grammar in
   `src/core/content/narrative/` + `gen:narrative` registry; R0–R2
   seed.
3. Herdr-check `w8:p1` (VN-modal co-agent) before step 3's diverge.

## Landmines (current)

- Shared tree: `w8:p1` is live on VN-adjacent UI — this plan must
  not edit VN scene modules; the VN-lite variant reuses their
  primitives.
- The full-T0 floor means step 4's re-homing is NOT optional
  stretch — the engine + port land as one shippable unit; don't
  retire `talk_to` until the port covers every rung.
