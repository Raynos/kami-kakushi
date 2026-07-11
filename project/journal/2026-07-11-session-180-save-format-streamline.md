# Session 180 — 2026-07-11 — build the save-format streamline plan

**Summary:** The human ruled all eight open questions on
`docs/plans/fable-2026-07-11-save-format-streamline.md` (recorded in the plan as
"Locked decisions"), then went AFK with a "build the whole thing" go-ahead. The
plan is being built in the ruled order **5 → 3 → 2 → 4 → 1** — small correctness
sweeps first, the orphan sensor armed before the big log-descriptor migration
lands.

The load-bearing ruling: **the log is a derived VIEW, not a transcript.** Every
log line persists `contentKey` + `params` and re-renders from the *current* `src/`
registries on load, so a reworded beat rewrites what an existing save's scrollback
shows. That is intended, and it ships as an ADR with step 1.

## Entries

### 1 · Locked the eight open questions (pre-build)

Put every open call on the plan to the human before writing a line of code, rather
than self-picking the reversible ones (this is a doctrine change to the save
format, so the blast radius is every existing save):

1. Log = derived view; full re-render of all prose, narrative included. → ADR.
2. The keyless-entry ban is **gated** (a test that can go RED), not a norm.
3. `validateState` drops the `...base` spread; no schema bump. One-way per save.
4. Cycle fix: a new `log-render.ts` composition module, **not** the plan's
   register-a-resolver-at-module-init scheme — module-init registration makes
   rehydration order-dependent, and a content module not yet imported when
   `codec.ts` rehydrates falls back *silently* to the stale stored text. That is
   the exact bug the plan exists to kill, made invisible.
5. Orphaned-id detector = a DEV-panel sensor + `console.info`, not a red test.
6. `sitePools`: a missing key hydrates as freshly refilled.
7. Build order 5 → 3 → 2 → 4 → 1.
8. Fixture regeneration happens once, at the end of step 1, coordinated with the
   co-agents live in this shared tree.

Also re-grounded the plan against HEAD (PH2 — the plan carried a stale-survey
warning): findings 2, 4 and 5 all still hold, `log-content.ts` is still a true
leaf (imports only `./names` + `../format`), and **step 5's "ship the persistence
README" was stale** — that README already exists at 118 lines, so step 5 became an
*amendment*.

- `docs/plans/fable-2026-07-11-save-format-streamline.md` — status LOCKED, the
  eight rulings, the re-grounding, the corrected build order + sync ripple.

### 2 · Step 5 — weapon wear derives from the weapon def

`weaponDurability`'s load fallback was a hardcoded `40` (the *carrying pole's*
max), so a save carrying a yari hydrated to the wrong weapon's durability, and a
rebalanced max in `src/` never reached an existing save. Now derived from
`getWeapon(equipped).durabilityMax`, and a stored wear *above* the current max
re-clamps down on load.

**Found while building:** `getWeapon()` THROWS on an unknown id, so a weapon
renamed or removed in `src/` rode through the save and crashed the UI at first
render rather than degrading — the same class of bug the `location` clamp already
guards against. Clamped `equippedWeapon` to a live weapon id too.

There was **no direct test of `validateState`** at all, so this adds
`src/persistence/validate.test.ts`, with every fixture derived from the live
registry rather than a copied number — a test that hard-coded `40` could not have
caught the bug it was guarding (the ADR-086 rule, applied to itself).

- `src/persistence/validate.ts` — weapon-id clamp + def-derived durability bound.
- `src/persistence/validate.test.ts` — NEW.
- `src/persistence/README.md` — a "clamp it to the registry on load" rule: a
  stored id is only as good as the registry it points at.

### 3 · Step 3 — a missing sitePool is a FRESH site, not a depleted one

Readers do `state.sitePools[site] ?? 0`, so a key that was merely *missing* read as
a worked-out site (yield 0). A site added or renamed in `src/` mid-generation was
therefore born **dead** until the next season refill — stale-by-omission, exactly
the "the save out-votes `src/`" failure this plan exists to remove.

`sitePools` now hydrates **per key** against the live roster: a stored pool always
wins (drawn stays drawn; a `0` stays worked-out — depletion is a *fact*, not a
hole), and a site the save has never heard of is born full for the season. Both
failing cases were written and watched go RED before the fix.

Known, accepted quirk (ruled): a site the player had depleted and that is then
*renamed* in `src/` is reborn full under its new key.

- `src/persistence/validate.ts` — `hydrateSitePools()`.
- `src/persistence/validate.test.ts` — 4 cases incl. the two that went RED.

### 4 · Step 2 — `validateState` is a whitelist rebuild

Dropped the `...base` spread. The state is now built from the explicitly-validated
fields only, so a field retired from `GameState` (ADR-056's `balanceProfile`, and
its successors) ages out on the next load instead of riding in every save forever.
Safe by construction: the `_Handled` ledger makes a new `GameState` field without a
validated default a **tsc error**, so the literal can't fall behind the type.

**Seven pre-existing tests went red, and the reason mattered.** They asserted
`JSON.stringify(loaded) === JSON.stringify(original)` — "byte-identical" — which
also pins **key order**, and the whitelist rebuild emits the literal's key order
rather than the stored blob's. Before touching them I probed the actual difference:
**identical key sets, identical values, order-only diff** — nothing was being
dropped. Converted those assertions to `toEqual`.

That is a *strengthening*, not a loosening. Their stated purpose (see the comment
in `save.test.ts`) is to catch a non-JSON-safe field — a `Set`/`Map` — sneaking into
`GameState`. Such a field stringifies to `"{}"` on **both** sides of the old
assertion and passes; it fails deep equality.

- `src/persistence/validate.ts` — the spread is gone; the rationale is in-file.
- `src/persistence/validate.test.ts` — 4 cases: junk dropped, junk-drop is NOT
  reported as a repair (a scary "we mended your save" notice for a non-event), every
  live field still survives, a real player fact preserved verbatim.
- `src/persistence/save.test.ts`, `save-e2e.test.ts` — value-identity, not
  byte-identity, with the why recorded in-file. (`codec.test.ts`'s byte-identity
  assertions are untouched and still pass: they round-trip envelopes without a
  rebuild, so their key order IS stable.)

### 5 · Step 4 — the orphaned-id sensor

`findOrphanedIds(state)` (pure, in `src/persistence/orphans.ts`) diffs a loaded
save's stored ids against the live registries — reveals, discoveries, dialogue,
scenes, belongings, market purchases, site pools, quest ids AND quest STEP ids,
rung requirements, the equipped weapon, the location. Each group carries the
*consequence* of leaving it un-migrated, because "orphan: 3" tells a human nothing;
"a done quest step reads as undone — the quest can never close" tells them why they
care.

Surfaced two ways: `console.info` on load in DEV (`main.ts`), and a **Save health**
block in the DEV panel's Settings pane that badges the tab (`Settings (2⚠)`) only
when something is actually orphaned — the Balance-tab precedent. Normally empty, so
it earns no tab of its own and no permanent real estate.

`flags` is excluded on purpose: free-form facts have no roster to diff against.

Not a gate, per the ruling: a rename is a legitimate authoring act, so a red build
would cry wolf, and the fix (a migration) belongs to the author.

- `src/persistence/orphans.ts` + `orphans.test.ts` — NEW. 6 cases, incl. the nastiest
  orphan (a renamed quest STEP: the quest still exists so nothing *looks* wrong, but
  it can never complete) and the anti-cry-wolf case (live ids stay silent). A sensor
  that always reports "all clear" is worse than no sensor, because it gets trusted.

**Shared-tree note:** the `doc-budgets` gate went red mid-step on a co-agent's
uncommitted `project-status.md`. Left it alone (don't fight someone else's red); they
committed and it cleared on its own. All 18 gates green at commit.

### 6 · Step 1a — `log-render.ts`, and the reveal emitter keyed

The load-bearing change. `src/core/content/log-render.ts` is the namespace dispatch
and the ONE place a stored descriptor becomes prose: it imports `log-content` AND the
content registries, so `log-content.ts` stays a leaf and each registry keeps its own
text (a reveal line belongs to its SURFACE — no second home, no drift). `codec.ts` and
`rewards.ts` now call `renderLogLine` from there.

Resolution order is **static-registry-first, then namespace dispatch** — the
hand-written keys already contain dots (`combat.win`, `season.reckoned`), so
dispatching on the dot first would hijack them. That ordering has its own test.

First emitter keyed: reveal lines (`unlock.ts`) as `reveal.<surfaceId>`.

The marquee test is falsifiable and passes: a save carrying **stale prose** under a
live key loads showing `src/`'s CURRENT words, and the store blob never carried the
prose at all. An unkeyed legacy line still keeps its text verbatim.

**Shared-tree hazard, caught before it landed:** `fixtures:regen` drives the REAL
engine, so it bakes whatever is in the working tree into the generated saves — and a
co-agent had uncommitted `intents.ts` / `activities.ts` edits at the moment I ran it.
Those fixtures would have silently encoded another agent's WIP. Waited for their
commit, re-regenerated against a clean tree, re-verified. **Rule for the next agent:
never regen fixtures while someone else's core edits are uncommitted.**

### 7 · Step 1b — the discovery + works emitters keyed

`discovery.<id>` resolves through the discovery def (`discoveryEmitLine`), `works.<flavorKey>`
through `FLAVOR`.

The works resolver deliberately reads `FLAVOR` (a content leaf) rather than calling
`works.ts`'s `worksLine()`: **works.ts is a REDUCER that imports scenes.ts**, and pulling a
reducer into `log-render` would risk the very cycle this module exists to avoid. The DEV
story-take override that `worksLine()` layers on applies to FUTURE emissions only (ADR-143 —
the same semantics `discoveryEmitLine` already documents), so canon is the correct answer when
rehydrating a save.

**Shared-tree:** the `checkpoint` gate went red mid-step on a co-agent's staged plan deletion +
stale plans index. Did NOT regenerate their file to force my commit through (that would have
clobbered their working copy) — waited; they landed it and verify went green on its own.

- `src/core/content/log-render.ts` — the `works` namespace.
- `src/core/discovery.ts`, `src/core/works.ts` — emitters keyed.

### 8 · Step 1c — scene/VN lines keyed, and a real bug the keying exposed

Keyed the VN payload (shared by SCENES and RUNG_BEATS): `scene.<id>.greeting.<i>`,
`scene.<id>.opt.<optionId>.say|react|bonus`, plus a `flavor.<key>` namespace (the rest line and
friends live in FLAVOR) and a `beat.<rank>.…` namespace for rung beats.

**The rewards bus conflated two channels, and keying exposed it.** `applyRewards` rendered a
line from its `contentKey` *in preference to* the `text` the caller passed. That is right for
the Stage-C mechanical lines (they pass a key and no text) but WRONG the moment a narrative line
carries both: it silently discarded the **DEV story-take override** (ADR-143 — takes overlay
future emissions) on every keyed narrative line, and it threw outright on any scene outside the
shipped registry (which is why 4 scene tests went red — they use synthetic scene defs).

The two channels are now separated, which is the actual doctrine:
- **emit time** — the caller's words are authoritative (they may carry a DEV take, or be a test).
- **persist time** — the KEY is what the save stores; on load `codec` re-renders from the
  registry. That is where "src/ is the truth" bites, and it is the only place it should.

**A co-agent (w1:p3) caught my commit `05573a1d` reddening the `@slow` lane** — `save-e2e`'s
"rebuilds every keyed entry text from the registry on load", which is *precisely* this plan's
step-1 done-when proof. Cause: that test imported `renderLogLine` from `log-content` (the leaf),
which cannot see the namespace dispatch, so a namespaced key threw. Repointed it at `log-render`
— the module that IS the renderer and what `codec.ts` calls. The assertion is unchanged and can
still go RED. **Lesson: the COMMIT lane doesn't run `@slow`, so a green commit can still red the
push.** Run `VERIFY_FULL=1 pnpm run verify` when touching the persistence/render seam.

Full lane now green: **1258 tests, 95 files, `@slow` included.**

- `src/core/scenes.ts` — greeting/say/react/bonus keyed.
- `src/core/content/log-render.ts` — `scene`, `beat`, `flavor` namespaces.
- `src/core/rewards.ts` — emit-text wins over the key; the key is for the SAVE.
- `src/persistence/save-e2e.test.ts` — repointed at the real renderer.

### 9 · Step 1d — ZERO keyless: every emitter keyed, gated by a test that can go RED

Wrote the **keyless gate FIRST** (locked decision 2) and let it enumerate the work rather than
guessing: it drives every FIXTURE SPEC through the REAL engine (cold open → R7 → pre-ascension)
and fails with a ranked list of the prose still reaching the save. That took it from **302
distinct keyless lines → 0**, one emitter at a time.

Keyed, with each line's prose staying in the registry that already owns it (TST1 — no second
home, no drift): reveal · discovery · works · scene VN (greeting/say/react/bonus) · rung-beat VN
(greeting/topics/decision) · intro (greeting/ask-hub/decision/**perk**) · dialogue tree ·
requirement flavor · activity labour lines · rake · rest · texture/ambient · night-round stages ·
deed-source reveals · estate stage-done + commission + work-progress · first wage · nengu ·
day-book judge · belongings · craft recipes.

Two design notes worth keeping:
- **`texture.ts` threw the FLAVOR key away** and kept only the rolled string, so ambient lines had
  no stable id. Now it carries `[key, text]` through — still **sorted by TEXT**, so the seeded
  pick for a given RNG draw is byte-for-byte the line it always was. The refactor must not move
  the world, and it doesn't.
- Prose that genuinely lived **inline in a reducer** (the nengu reckoning, the commission line,
  the first wage) moved into `LOG_CONTENT` — a hand-written registry is exactly its job. Prose
  owned by a content registry keys to THAT registry instead (`log-render.ts`).

The gate has a second half that matters as much: **every key a full arc emits must RESOLVE.** A
keyed entry whose key doesn't resolve is *worse* than a keyless one — codec falls back to the
stored text, so it looks fine today and silently stops tracking `src/` forever. It caught 3 such
keys (I keyed the dialogue emitter before writing its resolver).

**Two tests asserted things the plan makes false, and both were fixed honestly, not silenced:**
- `save-e2e` asserted a full arc emits BOTH keyed and keyless lines. True during the Stage-C
  migration; now false BY DESIGN. Re-pointed at the new invariant (descriptors only) + a NEW
  explicit test that a LEGACY keyless entry still rehydrates, so old saves keep loading.
- `log-content.test` requires a SAMPLE for every registry key — added for the four new ones.

Full lane: **1261 tests green, `@slow` included; all 18 gates.**

**Known limit (goes in the ADR):** `greeting.<i>` and `stage.<i>` are POSITIONAL, not id-keyed —
re-ordering a scene's greeting lines in the narrative `.md` re-points an old save's line to its
neighbour. The narrative grammar gives greeting lines no ids today. The orphan sensor cannot see
this (the index still resolves), so it is a content RESTRUCTURE that needs a migration.

### 10 · Step 1e — the FIXTURES strip too (the plan's promised shrink, finally real)

The plan predicted step 1 would "SHRINK the fixtures ~5× and stop reword-churn". Keying alone did
**not** deliver that, and the fixtures actually GREW (1560 → 1812 KB): `gen-fixtures.ts` wrote a
plain `makeEnvelope` JSON and `fixtures/index.ts` consumed `mod.default` directly, so neither
crossed `encodeStore`/`decodeStore` — where the strip/rehydrate lives. Keyed fixture entries kept
their `text` AND gained a `contentKey`.

Closed it: `codec.ts` now exposes the strip/rehydrate as gzip-free envelope transforms
(`stripEnvelopeLog` / `rehydrateEnvelopeLog`), `gen-fixtures` writes STRIPPED saves, and
`fixtures/index` rehydrates through the same codec path a real load uses — so a fixture can never
show stale text, and it exercises rehydration instead of bypassing it.

**1812 → 1264 KB, and 459 994 characters of prose on disk → 0.** A reword no longer churns 18
fixture files.

`codec.test.ts`'s `fixtureState()` helper read the fixture JSON straight off disk and treated it
as a live GameState. With stripped saves that is no longer true — the raw JSON has no `text` on a
keyed entry — so it now rehydrates like everything else. (It also imported `renderLogLine` from
the LEAF, same latent trap that reddened `@slow` earlier; repointed.)

- `src/persistence/codec.ts` — `stripEnvelopeLog` / `rehydrateEnvelopeLog`.
- `src/scripts/gen-fixtures.ts`, `src/fixtures/index.ts`, `src/persistence/codec.test.ts`.

### 11 · Step 1f — ADR-186 + the README, and the plan closes

`ADR-186` records the doctrine so a future agent doesn't re-litigate it: why the renderer is a
static composition module (a module-init resolver registry would make a stale-text fallback
**silent**), why emit-time text and persist-time keys are different channels, why the keyless ban
is a **gate** and not a norm, and the known positional-`greeting.<i>` limit.

`src/persistence/README.md`'s log section is rewritten as settled doctrine — including the trap
that has now bitten three test files: **import `renderLogLine` from `log-render`, never from the
`log-content` leaf.**

The plan is marked DONE with an **addendum** naming what it did NOT close, so nothing is lost:
the reveal-ceremony re-arm, the two `SPECIAL_FACTS` surfaces that bypass the rung schedule, and
the save-migration POLICY question the human routed here from the zone-rung session (the
machinery — `migrate.ts` + the ADR-161 courteous-restart path — already exists; what's missing is
the rule for when a content move bumps the generation vs. ships a migration step).

## Next intended steps

**The plan is DONE — all five steps built, green, pushed.** What remains is the
ADDENDUM (recorded in the plan, not started): the reveal-ceremony re-arm · the two
`SPECIAL_FACTS` surfaces that bypass the rung schedule · the save-migration policy
question. The re-arm overlaps the zone-rung-rebalance plan's Stage 1 — coordinate
with that agent (w3:p3) rather than both building it.

Then the **addendum work the human handed over mid-session** — the zone-derivation
finding + the save-migration subsystem routed here from the zone-rung-rebalance
session.

## Landmines

- **Three co-agents are live on this tree.** Commit by explicit file pathspec only.
- **`fixtures:regen` bakes the working tree into generated saves** — never run it while
  a co-agent has uncommitted core edits (nearly shipped exactly that; see step 1a).
- ~~Fixtures do NOT strip their log prose.~~ **FIXED (step 1e)** — fixtures are stripped
  descriptors now (1264 KB, zero prose chars). A fixture save on disk is NOT a loadable
  state: rehydrate it (`rehydrateEnvelopeLog`) before treating it as one.
- **Import `renderLogLine` from `log-render`, never from `log-content`.** The leaf only
  knows the hand-written templates, so a namespaced key throws. This trap has now bitten
  three separate test files.
- Step 1 makes old saves' narrative prose re-render from current `src/`. That is the
  intended, human-ruled behaviour — not a regression to "fix" on sight.
