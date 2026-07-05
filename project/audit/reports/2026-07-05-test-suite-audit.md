# Test-suite audit — is this a real regression net? (2026-07-05)

**Asked by the human** (todo item, 2026-07-05): review the test suite — the
worry is that the integration/e2e tests are "basically unit tests", don't
exercise the UI as a human would, and would not catch a real regression.

**Verdict up front: the worry is half right, and it's the *other* half than
feared.** The tests that exist are unusually well written — the core is covered
by genuine full-arc integration tests driven through the real reducer, the UI
tests mount the real renderer and assert click→intent wiring in both
directions, and the new mobile e2e lane drives real browsers with real taps.
Almost nothing is a tautology or a false green. **The real gap is coverage
geometry, not test quality: desktop has ZERO real-browser coverage, and no
browser test drives the story-critical player journeys** (intro VN, market,
crafting, quests, ascension, save/reload). A desktop CSS regression that paints
a panel over the work verbs — the exact bug class the mobile lane caught on its
first run — would ship green today.

Companion fix plan: `docs/plans/fable-2026-07-05-desktop-journey-e2e.md`.

## 1 · Method

Read in full: both `e2e/` Playwright specs + helpers + `playwright.config.ts`,
`t0-arc`, `invariants`, `save-e2e`, `playcheck`, `main`, `render` (partial —
2.3k lines), `reconcile` tests, the gate roster (`gates.ts`), the e2e CI
workflow, and qa-playtesting.md §1. A survey agent read the remaining ~55
vitest files and reported per-file style/assertion quality; its findings are
folded in below (spot-checked, not blindly trusted — the weak spots it named
were verified against the files).

Suite shape: **797 vitest tests across 62 files (~4s, node env by default,
jsdom opt-in per file)** + **2 Playwright specs (mobile-only, ~10 tests × 2
device profiles)**.

## 2 · What the suite actually is — a layer map

| Layer | What exists | Quality |
|---|---|---|
| Pure/unit (core math, content registries) | ~40 files | Strong — fixtures derived from source-of-truth constants (`balance.*`, `RANKS`, registries), levers asserted, not collapsed metrics |
| Reducer integration (real `reduce`, no forced flags) | `t0-arc`, `invariants`, `save-e2e`, `ascension`, `m1`/`m2`, `rung-beats`, `sim`, `pacing-envelope` | Strong — the whole T0 arc is driven cold-open→ascension by a real auto-pilot; invariants asserted at every one of ~2000+ steps |
| DOM wiring (jsdom, real `mount()` from render.ts) | `render`, `dev`, `dev-cockpit`, `capture`, `reconcile` | Strong *for what jsdom can see* — buttons dispatch the right intents, state renders the right nodes, reveal cadence gates, focus trap, append-only VN diff |
| Real browser (Playwright) | `e2e/mobile-layout` + `e2e/mobile-journey` — **mobile profiles only** (Pixel 7 + iPhone SE) | Excellent per-test (real taps, `elementFromPoint` hit-testing, WCAG tap floor, error tracking, fixture-coverage drift guard) — but a thin slice |
| Visual regression | none (deliberate: `qa-shots.mjs` gallery + agent vision + human taste arbiter) | by design, see §5 |

Two tests worth calling out as *models* of the house style:

- `src/core/t0-arc.test.ts` — drives the entire T0 arc through the real
  reducer with no forced flags, proving the seams (combat sets the flags the
  ladder gates on; labour banks the deeds the ascension needs). This is a real
  integration test by any definition.
- `e2e/mobile-layout.spec.ts:33` — the fixture-registry drift test: a new F6
  fixture that doesn't get mobile coverage goes RED. Coverage that ratchets
  itself is exactly the right mechanism.

## 3 · The gaps, ranked

### G1 · Desktop: zero real-browser coverage (the big one)

`playwright.config.ts` declares two projects, both mobile. The desktop layout —
the two-column byōbu spread, hover cards, the seven-tab strip at full width —
is tested **only in jsdom**, which has no CSS, no layout, no paint, no
hit-testing. jsdom's `.click()` happily clicks an element that is `display:
none`, zero-height, or painted under another panel. So the entire bug class
the mobile lane was created to catch (its first run found `.work` at height 0
with the log painted over the verbs) **has no net on desktop**. The UI-v2
Andon Steel migration (7 build cards, restyling every surface) is about to
land on exactly this uncovered surface.

### G2 · No browser journey through the story-critical flows

`mobile-journey.spec.ts` covers: wake tap, tab switching, one rest action, the
wolf fight, opening the rung-beat VN, settings open/close. Good — but that's
where it ends. Never driven by real clicks in any browser:

- the **intro VN** (ask → decide → continue, multi-scene) — the cold-open test
  taps "Open your eyes" and stops; every fixture boots *past* the intro
- a **rung-beat VN completed** (topic asked → option chosen → Continue →
  promotion actually applied) — only the *opening* is e2e-tested
- **market** (talk to Tokubei → sell/buy), **crafting/repair**, **quests**
  (accept → complete), **estate improve**, **eat/cook**
- the **ascension ceremony** — the arc's payoff; `pre-ascension` fixture
  exists but no browser test clicks through it
- R4–R7 content generally (fixtures cover R3-ish and endgame states)

The reducer-level arc test proves the *rules* connect. It cannot prove a
player can *reach* them — that the button is visible, clickable, and wired at
each beat (R6: if a player can't reach it, it doesn't exist). The jsdom
render tests prove per-button wiring for many of these, but only fragment by
fragment, with hand-assembled states, no CSS, and no seams between screens.

### G3 · Persistence never tested in a real browser

`save-e2e.test.ts` is honest about what it is (full-arc state round-tripped
through the real SaveManager) — but it runs against `MemoryBackend`. Nothing
anywhere reloads a real page and asserts the run resumes from localStorage;
nothing drives export→import through the actual settings textareas. A broken
autosave-on-tick or a localStorage quota/serialization regression ships green.

### G4 · The e2e lane's own soft spots

- `helpers.ts:41` — `boot()` ends in a fixed `waitForTimeout(400)` settle; a
  slow CI box can under-wait (flake) and a fast one over-waits. A condition
  wait (fonts loaded / first paint flag / `__qa` settle counter) is sturdier.
- The lane gates in CI only (correct per the 5s verify budget, D-072) — but
  that means a red e2e is discovered *after* push. Acceptable rung; worth
  keeping deliberate.

### G5 · Minor vitest findings (survey, verified)

1. `src/ui/sfx.test.ts:159` — titled "keeps every voice short (<400ms)" but
   asserts only no-throw; can never go red on a duration regression. The one
   real false-green found in 797 tests.
2. `src/ui/capture-format.test.ts:15` — server allowlist regexes are copied,
   not imported; drift stays green here (covered indirectly by
   `playtest-inbox.test.ts`).
3. `src/core/pacing.test.ts:40` — thresholds pinned as copied literals
   (intentional drift-guard, but the suite's one magic-number mirror).
4. `src/core/content/market.test.ts:92` + `voices.test.ts:19` — near
   existence-only checks (shallow, not wrong).
5. `src/core/integrity.test.ts:36` — ledger `consumer` prose is asserted
   nowhere; only the key set ratchets.

No tautologies, no snapshot dumps, no `toBeDefined()`-only tests found.

## 4 · The regression-net answer, concretely

"If X regresses tomorrow, does anything go red?"

| Regression | Net? |
|---|---|
| Core rule/balance/economy bug | ✅ many layers (unit + arc + invariants + sim + playcheck) |
| A button stops dispatching its intent | ✅ jsdom render tests |
| Mobile layout breaks (overflow, tap-target, stacking) | ✅ e2e lane in CI |
| **Desktop layout breaks (overlap, hidden verb, dead column)** | ❌ nothing |
| **A story beat becomes unreachable by clicking (intro, market, ascension)** | ❌ nothing (reducer arc stays green) |
| **Autosave/reload breaks in the real browser** | ❌ nothing |
| Save format/migration breaks | ✅ codec/migrate/save + fixtures |
| Visual look degrades (palette, ink, spacing) | ❌ by design — agent-vision gallery + human taste (see §5) |

## 5 · A deliberate non-goal, kept deliberate

Pixel-diff visual regression was considered and is **recommended against** for
now: the woodblock/ink aesthetic with typewriter animation and seeded-but-
timed reveals makes pixel diffs flake-prone, and the taste bar is explicitly a
human/agent-vision judgment (R5, D-126). The plan keeps look-regression where
it lives today (`qa-shots.mjs` gallery + review cadence) and instead hardens
the *structural* visual invariants (overlap, visibility, stacking, reach) that
a machine can hold soundly. Revisit only if a cheap, stable subset emerges
(e.g. masked reduced-motion shots of 2–3 static screens).

## 6 · Recommendation

Adopt the companion plan (`docs/plans/fable-2026-07-05-desktop-journey-e2e.md`):
a desktop e2e lane reusing the proven mobile invariants, browser journeys for
each story-critical flow (fixture-checkpointed so no grind), real-browser
persistence tests, an intent→affordance coverage ratchet, and the §3 G4/G5
hygiene fixes. Sequenced so the desktop lane lands **before** the UI-v2 Andon
Steel migration starts restyling every desktop surface without a net.
