// Canonical NPC / place display names — ONE source of truth so a rename touches a
// single file. Force-fictionalised (PRD §6.6 real-name denylist): no real Edo
// daimyō/figures. Block N renamed the Yagyū-echo pair (Munenori/Jūbei) and the
// Edogawa-echo physician (Ranpo) per the Q39/D-Q-name-collision discipline.

export const NAMES = {
  // ── Estate (Kurosawa house) ──
  house: 'Kurosawa',
  lord: 'Sadayori', // the aging lord (was "Munenori" — Yagyū echo, renamed)
  heir: 'Naoyuki', // his heir (kept)
  elder: 'Genemon', // the estate elder / first granter (§3.2.1)
  drillmaster: 'Tsuneoka', // the combat drillmaster (was "Jūbei" — Yagyū echo, renamed)
  steward: 'Chiyo', // the house steward (kept)
  physician: 'Ryōan', // the debunker-physician (was "Ranpo" — Edogawa echo, renamed)

  // ── Village of Asagiri ──
  villageChief: 'Yagoemon',
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
