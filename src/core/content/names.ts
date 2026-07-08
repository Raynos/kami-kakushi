// Canonical NPC / place display names — ONE source of truth so a rename touches a
// single file. Force-fictionalised (PRD §6.6 real-name denylist): no real Edo
// daimyō/figures. The T0 cast + names are the story bible's canon
// (docs/story-bible/04-cast.md — the 2026-07-07 name sweep); this table is being
// migrated to it by the storywave game plan (G0 adds the new cast add-only; G4 does
// the live-canon renames the shipped narrative still resolves through).

export const NAMES = {
  // ── Estate (Kurosawa house) — the story bible §04-cast (T0) ──
  house: 'Kurosawa',
  lord: 'Shigemasa', // DEFER→G4: renames to 'Munemasa' (live T0 canon still resolves through `lord`)
  heir: 'Naoyuki', // the second son, heir by subtraction — reads the MC true from the first
  elder: 'Genemon', // the steward; R1·R6·R7 granter — speaks in item, count, condition
  drillmaster: 'Kihei', // the drillmaster / watch-keeper; R4 granter — orders then verdicts
  steward: 'Chiyo', // Lady Chiyo — the board + the nengu reckoning (no granter beat in T0)
  physician: 'Sōan', // the physician — the weir examination + the name-question beat
  ohisa: 'O-Hisa', // Katsuhide's wife; the kitchen + the woodshed doorstep (she mends his things)
  shinnosuke: 'Shinnosuke', // the heir's son (~12); the player's MIRROR — board / drill-wall / grove
  toku: 'Toku', // the dowager; the house's memory — the shrine corridor + the new-moon walk

  // ── The estate's edge (story bible §04-cast) ──
  pedlar: 'Tokubei', // DEFER→G4: renames to 'Yohei' (live T0 canon still resolves through `pedlar`)
  oyae: 'O-Yae', // the scullery day-girl; crosses the estate/village line — the news service both ways
  matsuzo: 'Matsuzō', // the old weir-keeper the house leases the weir from — answers about the water
  iori: 'Iori', // the traveling monk, lodging at the gate at New Year + Bon — wants nothing, gives, leaves
  oume: 'O-Ume', // the widow at the paddy's edge; sets her drowned husband's place at Bon (the jizō offerings)

  // ── Estate hands + craftsmen ──
  rokusuke: 'Rokusuke', // the named face of the hired hands; his load-tally clears the MC at the Count
  smith: 'Tōzō', // DEFER→G4: retires from T0 (T1's smith is Tetsuji) — delete at the cutover

  // ── Village (T2+ — the headman + his daughter enter from T2) ──
  villageChief: 'Mohei', // the headman (bible: renamed off "Jinbei", yields to Jinpachi)
  villageGirl: 'Sayo', // the headman's daughter, THE NAMER — ignites the "Tama" thread (T2+)

  // ── Origin (the holding outside the post-town — all alive; the reunion waits at T3) ──
  father: 'Jinpachi',
  mother: 'O-Nobu',
  sister: 'Suzu', // his younger sister
  // (no sweetheart — the old "what he fled" origin is void; the landslide origin is relocked)

  // ── identity ──
  trueName: 'Tahei', // the MC's birth name (a kaidō porter; reclaimed at T3)
  useName: 'Gonbei', // the house's hand-me-down name, written at T0 R7 — Nanashi no Gonbei
  borrowedName: 'Tama', // the village's borrowed name for him (the T2 Tama thread)
  lostChild: 'Otsuru', // the real spirited-away child (alive, grown)
} as const;
