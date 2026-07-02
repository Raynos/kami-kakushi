// Canonical NPC / place display names — ONE source of truth so a rename touches a
// single file. Force-fictionalised (PRD §6.6 real-name denylist): no real Edo
// daimyō/figures. Block N renamed the Yagyū-echo pair (Munenori/Jūbei) and the
// Edogawa-echo physician (Ranpo) per the Q39/D-Q-name-collision discipline.

export const NAMES = {
  // ── Estate (Kurosawa house) — names match docs/living/prd/01-vision.md §1.8 V2.2 ──
  house: 'Kurosawa',
  lord: 'Shigemasa', // the aging lord (renamed off the Yagyū "Munenori" echo — Q39/Block N)
  heir: 'Naoyuki', // his heir (kept)
  elder: 'Genemon', // chief steward / first granter (§3.2.1)
  drillmaster: 'Kihei', // master-at-arms (renamed off the Yagyū "Jūbei" echo — Q12/Q39)
  steward: 'Chiyo', // Lady Chiyo (kept)
  physician: 'Sōan', // the debunker-physician (renamed off the Edogawa "Ranpo" echo — Q39/Block N.1)

  // ── Travelling folk (vendors-as-people, D-114) ──
  pedlar: 'Tokubei', // the Ōmi pedlar who passes the gate-forecourt (F109 worked example)

  // ── Estate hands + craftsmen (rung-beat cast, D-110 / BQ1) ──
  rokusuke: 'Rokusuke', // a fellow kept-hand met at R2 — the early climb's peer + gossip-voice
  smith: 'Tōzō', // the woodlot-smithy craftsman met at R4 — teaches wear/repair (place-gated)

  // ── Village of Asagiri ──
  villageChief: 'Yagōemon',
  villageGirl: 'Sayo', // ignites the "Tama" legend at T1-V0

  // ── Origin (Sawatari-juku) ──
  father: 'Jinpachi',
  mother: 'Oyuki',
  sister: 'Okimi',
  sweetheart: 'Osen',

  // ── identity ──
  trueName: 'Tahei', // the MC's true name (reclaimed, missable, at O5)
  borrowedName: 'Tama', // the village's borrowed name for him
  lostChild: 'Otsuru', // the real spirited-away child (alive, grown)
} as const;
