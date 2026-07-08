# The T0 map opens rung by rung — the reveal ladder (illustrated)

**Status:** ILLUSTRATIVE — a visual proposal, not locked design. Asked for by
the human 2026-07-07 ("show me the T0R1 / T0R3 / T0R5 / T0R7 maps — how the
map opens up and grows; fog of war? hints for the next rung?"). Node→rung
assignments are a GUESS to make the illustration concrete; the real ladder
locks with the T0 build plan. Renders (local, git-ignored):
`project/audit/screens/2026-07-07-t0-rung-reveal/` — t0-r1 · t0-r3 · t0-r5 ·
t0-r7. Rebuild any time: `node tmp/rung-reveal.mjs` (overlay-injected on the
REAL sheet — zero game-code changes were needed to mock this).

## The fiction that makes fog work

The sheet the player owns is the family's OWN survey (黒沢家領内絵図・改).
So fog of war is not smoke — it is **unsurveyed paper**: where the family
has not walked since the fall, the drawing simply stops. The sheet's
furniture (cartouche, 凡例 legend, scale bar, north arrow) exists from R1 —
you inherit a REAL document; the LAND is what's unfinished. The reveal is
then diegetic: rungs = the household re-walking its own ground, and the map
literally gets drawn back in as you climb. (Alt reading, same visuals: it's
the grandfather's old sheet and reveal = re-verifying it. Either way the
mechanics cause no UI invention — TST3.)

Grammar, all on existing sheet idioms:

- **The survey edge** — a scrawled dashed frontier line where drawing stops;
  beyond it, plate-tone paper with sparse setting-out pegs (faint crosses).
- **Ghost chips 未** ("not yet") — dashed empty seals at the frontier: the
  next rung's ground, teased but unnamed. No kanji spoiler, just 未.
- **Rumor notes** — tiny vertical period notes where a known thing runs into
  fog: the channel exits west with 堰ヨリ水来ル ("the water comes from a
  weir") before the weir exists; the south road carries 此ノ先未詳; at R5 the
  fogged precinct is annotated 古キ構ヘ有リト云フ ("an old compound is said
  to stand"). Hints live in the fiction's own voice.

## The four states (illustrative ladder)

- **T0R1 — the home ground.** Two chips: 門 gate + 庭 forecourt. The
  compound is drawn (it's home — you see your own house) but only those two
  are active ground. Everything past the wall is paper. One 未 ghost at the
  paddies' edge; the south road runs into 此ノ先未詳.
- **T0R3 — the bread.** + 薪 woodshed · 竈 kitchen · 薬 sickroom · 田 home
  paddy · 畦 field margins. The survey now covers the compound + the SW
  field skirt. Ghosts: the weir (west, with the water-rumor note riding the
  drawn channel into fog) and the woodlot edge (east).
- **T0R5 — the working estate; something looms.** + 蔵 kura · 稽 drill-yard
  · 堰 weir · 葦 reeds · 林 woodlot · 祠 shrine corridor · 夜 night rounds ·
  園 orchard. The window is almost all drawn — EXCEPT two fog masses: the
  precinct (huge, centre-north, 未) and the bamboo grove behind it. The
  monkeys' raid corridor pours out of ground you cannot see yet; the rumor
  note names an "old compound." The twist is being LOADED, not shown.
- **T0R7 / Phase 2 — the truth of its size.** Fog gone: the ruin, the grove,
  and — the payoff — the ghost bunds + boundary stones now read as one
  statement: the worked land is a fraction of what the sheet always implied.
  R5→R7 is where the G5 corner-of-the-precinct realization lands, exactly
  when Phase 2 (deeds/influence — the estate as an IDEA) opens.

## Design calls this illustration takes (for the human to keep or override)

1. **Fog yes — but as unfinished drawing, never dark smoke.** The night
   sheet is already dark; fog must read as PAPER (plate tone + pegs), or the
   two darks mush.
2. **Hints yes — 未 ghosts + rumor notes, sparingly** (1–2 per state). They
   answer "where does the game go next" inside the fiction, and they make
   each reveal a promise kept rather than a surprise dump.
3. **Ground reveals in REGIONS, chips within known ground unlock
   separately.** At R1 you see your whole compound (drawn) but only two
   active chips — "I can see my house; I haven't taken up its work yet."
   Region reveal = the map grows; chip unlock = the game grows. Two dials.
4. **The ruin is the LAST reveal** (with the grove), held until the R7/
   Phase-2 beat — the map itself performs the story's withholding.

## STATUS: the mechanism is BUILT (2026-07-08, ADR-151)

`src/ui/map-sheets/reveal.ts` (the fog/ghost/note painter — all data-driven)
+ `RUNG_LADDER` in nodes.ts (the PLACEHOLDER zone ladder) + a DEV previewer
pill on the T0 sheet (段 全→R1→R3→R5→R7). Rumor notes render in ENGLISH
(the FB-181/183 strip policy — no unexplained kanji on a player-bound
sheet). The T0 build plan locks the real ladder by editing the data tables;
the game's rung will drive the same painter when the sheet becomes the map.

## If/when this goes real (the cheap path — original notes)

The overlay proved the sheet needs no redraw: implementation is (a) a
`rung?: number` (or tier-phase key) on the zone roster, (b) a reveal mask in
the sheet painter — the SAME evenodd fog path drawn from a `revealedPolys`
table in layout.ts, (c) ghost-chip + rumor-note tables per rung. All data,
no new drawing code. Gating which REGION polys map to which rung is the only
real design work — it should ride the T0 build plan's node-unlock table
(ADR-149 folds the sheets into the real game; the walkable Estate 地図 node
graph and this sheet must then share one unlock source of truth).

Open question for the build plan: does the sheet REPLACE the Estate 地図 tab
(the sheet becomes the walkable map) or SIT BESIDE it (地図 = travel tool,
sheet = the estate document)? ADR-149 says the sheets swap into the game;
the unlock-source-of-truth question is the first thing that fork decides.
