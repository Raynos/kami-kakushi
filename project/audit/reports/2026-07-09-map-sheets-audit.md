# Map-sheets audit — canon sync + blind pass + the loop's own noise

**Date:** 2026-07-09 (session 133) · **Requested by:** the human ("map
sheets audit", picked as the next review after the storywave post-ship
review). **Scope:** the third reboot-era workstream —
`src/ui/map-sheets/` (T0 · T1 · T2 sheets + painters + pin + tests) —
which both storywave plans' seams excluded and no prior audit covered.

**Method:** two lanes. (1) An Opus canon-sync agent: vocabulary vs the
core 16-zone roster, content strings vs the 04-cast name docket,
reveal/rung tables vs `ranks.ts`, pin + integrity-test machinery, and a
line-by-line check of the T2 rungs+fog plan's stated assumptions.
(2) The committed `map-blind-pass` workflow on all three sheets
(scored report:
[`2026-07-09-t0t1t2-map-blind-pass.md`](2026-07-09-t0t1t2-map-blind-pass.md);
shots: `project/audit/screens/2026-07-09-map-blind-pass/`). Raw
workflow output snapshotted to `project/brainstorms/raw/` per the
capture rule. Plus orchestrator forensics on the blind-pass result
(below) — the single most consequential finding.

## Verdict

**The map-sheets layer is structurally sound and canon-faithful** — the
zone vocabularies match core and the bible exactly on all three tiers,
placements are right, the live map reads real core reveal state, and
every golden-pin regen in history was deliberate. The content defects
are small (one archetype name, macrons, stale comments, a DEV-only
placeholder table). **The big finding is about the verification loop,
not the sheets: the blind pass is NOISY, and today's FAIL cannot be
read at face value — nor could yesterday's PASS.**

## Finding 0 (MAJOR, process) — the blind-pass loop is not reproducible

Today's run: T0 **3/7** must-lines, T1 **4/11**, T2 **4/6** → FAIL.
But pass-3 (2026-07-08, `2026-07-08-t0t1-map-blind-pass-3.md`) scored
the SAME T0/T1 drawings **all-M-lines-green**, with its readers
recovering in their own words exactly the lines today's readers missed
(R4's weir→paddies channel; R5/R6's "household visibly retreated into
one corner of its former grounds"). Verified: the T0/T1 drawings are
unchanged since pass-3 (only name strings touched the directory; no
pin regen), the rubric §5 lines are unchanged (the 07-08 spec commits
only ADDED the T2 §6), and the capture recipe is identical (same 7
shots/sheet, near-identical bytes on the shared shots).

**Conclusion: one fresh reader per sheet is a single sample of a noisy
measurement.** Reader/judge variance alone flips M-lines. Consequences:

- Yesterday's "all M-lines green" and today's "3/7" are BOTH
  unreliable single samples — a false-green/false-red generator (PH3).
- **No redraw work should be prescribed from today's misses** until
  the measurement is ensemble-based (N readers per sheet, per-line
  majority) and the robust-fail set is known.
- **T2 is the real suspect:** its 07-08 blind pass FAILED, the V3/V6
  fixes (`86f6778`, `b48eb32`) were deliberately never re-scored, and
  today's single sample says V3 (the ruin twist) + V6 (the road
  network) STILL fail. Two same-direction samples ≠ proof, but T2's
  must-lines are the ones most likely to be genuinely failing.

## Canon-sync findings (the sheets themselves)

| # | Sev | Finding |
|---|-----|---------|
| S0 | (known) | O-Sato ×4 in `nodes.ts` `who:` arrays — already filed as the storywave-closure plan's C1.1; corroborated against `t1.md:18` (O-Hisa). Not re-counted. |
| S1 | MINOR | `RUNG_LADDER` (`nodes.ts:26-44`) diverges from the real `ranks.ts` unlock schedule on ~10/17 zones (sharpest: `weir=5` — the R0 arrival zone). DEV-preview-only — the live map (`map-variants/sheet-map.ts:23-27`) derives from core `revealed` and never reads it — but it misleads any reviewer eyeballing the DEV rung pill. Reconcile the numbers or re-comment as "illustrative, NOT the reveal schedule". |
| S2 | MINOR | Non-canonical archetype name "Otoku" (`nodes.ts:203`, T0 paddies `who`) — no Otoku in 04-cast (harvest women are unnamed ambient) and it near-collides with **Toku** the dowager. Pre-storywave residue. |
| S3 | MINOR | Macron drops in provisional T2 prose: "Kyubei" (`nodes.ts:620,652,654`) vs canon **Kyūbei**; "Ganzo" (`:609`) vs **Ganzō** — the same file keeps macrons elsewhere (Sōan, Matsuzō ×10). |
| S4 | MINOR | `sheet.ts` contradicts itself: `:610` "player-bound now — ADR-151" vs `:273` modal aside "Review artifact — NOT wired to the game". Reality: `sheet.ts` is DEV-only; its geometry is reused by the live `sheet-map.ts`. Pick one story. |
| S5 | NOTE | **Neither guard covers the O-Sato class.** `integrity.test.ts` reads only ids/anchors/rungs (sound + RED-able); the golden pin hashes ground GEOMETRY only. Content strings (`who`/`blurb`/`wrong`) are unguarded. Fix: a retired-name denylist test over all `nodes.ts` strings, derived from the 04-cast name-sweep docket — finite, canon-derived, always RED-able (it is RED against today's tree via O-Sato, which proves it). |

## The T2 rungs+fog plan's assumptions — HOLD

Every structural claim in `docs/plans/t2/opus-2026-07-09-t2-rungs-fog.md`
was verified TRUE against the tree (`zonesAtRung` shape, `paintReveal`
hardcoded to `T0_WINDOW`, the `tier==='T0'` shell gate, pin hashes
ground-only so a mechanics change keeps it green, T1 has neither ladder
nor fog, the `VALLEY` frame constants). That plan may proceed. One
caveat to carry into it: `T2_RUNG_LADDER` will be DEV-preview-only, as
T0's is (S1) — a future live T2 map must read core `ctx.revealed`,
never the ladder table; the seeded numbers are not a canon schedule.

## Verified sound

- **Vocabulary (TST1):** core `areas.ts` 16 AreaIds == `T0_NODES` minus
  the `night-rounds` activity chip; no orphans either way. T1 roster
  (14) == `t1.md` zone headers exactly; T2 roster (17) == `t2.md` §Zones
  incl. post-reveal naming per spec §6.2.
- **Placements:** ~19 spot-checks (T0 + T2 casts) against
  `people.ts`/04-cast — no wrong-placements.
- **Retired names:** zero hits beyond the known O-Sato.
- **Render seam:** the live map consumes the REAL core revealed set;
  seals dispatch real `move_to`; fog frontier derives from `revealed`.
- **Pin discipline:** all 5 `golden.hash.json` regens in history are
  deliberate map-intent commits; none bundled into unrelated work.
- `integrity.test.ts` derives from live data and is RED-able.

## Recommended next actions

Sequenced in the companion plan
(`docs/plans/fable-2026-07-09-map-sheets-fixes.md`): fix the
measurement first (ensemble blind pass) → re-measure → redraw only the
robust-fail set (T2 V3/V6 the likely candidates); mechanical canon
fixes + the denylist guard land immediately, independent of the loop
work.
