// Speaker / voice model (interactive-intro plan §3.1, FB-23/FB-26). A leaf module (imports
// nothing from core) so both `state.ts` (npcMemory keys) and the log/dialogue/intro
// content can share the ids without a cycle. The RENDERER colours speech by `VoiceCategory`
// (a later phase); the pure core only CARRIES the tag. Pure data — no DOM, no Math/Date.

import type { GameState } from '../state';
import { NAMES } from './names';

/** A remembered non-player character. Grows per tier as new cast is routed. The storywave
 *  T0 rewrite (game plan G0) adds the bible §04-cast: the household (`ohisa`/`shinnosuke`/
 *  `toku`), the heir `naoyuki` (a beat-voice in the R5 Count), and the estate's edge
 *  (`yohei` the pedlar — now a first-class id, `oyae`/`matsuzo`/`iori`/`oume`). The G4
 *  cutover retired the smith `tozo` (Tōzō leaves T0) and renamed `shigemasa`→`munemasa`
 *  (the domain lord, re-homing the `lord` voice). */
export type NpcId =
  | 'soan'
  | 'genemon'
  | 'kihei'
  | 'rokusuke'
  | 'chiyo'
  | 'munemasa' // the domain lord — R7 capstone `lord` voice (renamed from shigemasa at G4)
  // ── storywave G0 add-only (bible §04-cast; dormant until G4 wires people.ts) ──
  | 'ohisa'
  | 'shinnosuke'
  | 'toku'
  | 'naoyuki'
  | 'yohei'
  | 'oyae'
  | 'matsuzo'
  | 'iori'
  | 'oume';

/** Who is speaking — drives the render-time colour class (plan §7). `narrator` is the
 *  muted default (ambient prose); `player` is the MC's own spoken lines. */
export type VoiceCategory =
  | 'narrator' // ambient prose — the muted default
  | 'player' // the MC's own spoken lines
  | 'physician' // Sōan (scholar / rational)
  | 'steward' // Genemon / Lady Chiyo / household
  | 'arms' // Kihei / the drill-yard
  | 'official' // castle/heir voices (the touring inspector, castle clerks; the heir Naoyuki)
  | 'villager' // common folk — hired hands, the day-girl, the weir-keeper, the pedlar, the paddy widow
  | 'monk' // the traveling monk Iori (storywave §04-cast) — a passing-through stranger-kindness voice
  | 'lord'; // the domain lord Munemasa's R7 capstone (ADR-110) — murasaki 紫, its own dignified voice

// ADR-110 'lord' voice — RESOLVED. Munemasa now speaks in the dedicated `'lord'` category (its
// murasaki colour + 殿 seal live in render.ts's VOICE_COLOR / VOICE_SEAL, which are exhaustive over
// this union — a missing key is a tsc error). `'official'` is now the magistrate/clerk voice only.

/** The MC's spoken-line nameplate (voice `player`) — the DEFAULT/fallback label ('You'), used by
 *  state-less previews (the DEV takes gallery) and as the base rung of the ladder below. */
export const PLAYER_SPEAKER = 'You';

/** G4.7 — the T0 speaker ladder: the MC's nameplate climbs You → Nameless → Gonbei as the
 *  name-story advances. `label-nameless` is set by the cold-open name beat (the `You:`→`Nameless:`
 *  flip, bible R0); `label-gonbei` at R7 when Genemon writes the hand-me-down house name
 *  (NAMES.useName = "Gonbei", bible R7). PURE over flags — no RNG, no Date. The label-* flags are
 *  wired by their story beats in a later chunk; until then this returns 'You' (dormant, safe). */
export function playerSpeaker(s: GameState): string {
  if (s.flags['label-gonbei']) return NAMES.useName;
  if (s.flags['label-nameless']) return 'Nameless';
  return PLAYER_SPEAKER;
}

/** The category a given NPC speaks in — one source of truth for both dialogue + intro tags.
 *  `chiyo` reuses the `steward` colour (the nameplate distinguishes her from Genemon; a distinct
 *  'inner' colour is an optional later UI refinement — plan §7.2). */
export const NPC_VOICE: Readonly<Record<NpcId, VoiceCategory>> = {
  soan: 'physician',
  genemon: 'steward',
  kihei: 'arms',
  rokusuke: 'villager',
  chiyo: 'steward',
  munemasa: 'lord', // the domain lord's own voice — murasaki 紫 (ADR-110 R7 capstone)
  // ── storywave G0 add-only (voice-colour bindings; refine at G4 when content wires them) ──
  ohisa: 'steward', // household — the kitchen; the "if" that protects a hope (bible §04-cast)
  shinnosuke: 'steward', // the heir's son, of the house — household register (a boy)
  toku: 'steward', // the dowager, household matriarch — the house's memory
  naoyuki: 'official', // the heir's voice (bible/plan G4.1: `Naoyuki (official)` in the Count)
  yohei: 'villager', // the pedlar — a tradesman's common register
  oyae: 'villager', // the scullery day-girl
  matsuzo: 'villager', // the old weir-keeper
  iori: 'monk', // the traveling monk — his own passing-through voice
  oume: 'villager', // the paddy-edge widow
};

/** The display name (nameplate) for a remembered NPC — reuses the canonical NAMES table. */
export const NPC_NAME: Readonly<Record<NpcId, string>> = {
  soan: NAMES.physician,
  genemon: NAMES.elder,
  kihei: NAMES.drillmaster,
  rokusuke: NAMES.rokusuke,
  chiyo: NAMES.steward,
  munemasa: NAMES.lord,
  // ── storywave G0 add-only (nameplates from the canonical NAMES table) ──
  ohisa: NAMES.ohisa,
  shinnosuke: NAMES.shinnosuke,
  toku: NAMES.toku,
  naoyuki: NAMES.heir, // Naoyuki is the `heir` name key
  yohei: NAMES.pedlar, // = 'Tokubei' until G4 renames pedlar → 'Yohei' (single-sourced)
  oyae: NAMES.oyae,
  matsuzo: NAMES.matsuzo,
  iori: NAMES.iori,
  oume: NAMES.oume,
};

/** Runtime roster of the `VoiceCategory` union (FB-5 Ph2 — the one hand-written enabling change,
 *  so the narrative compiler can validate authored voices). Derived from an exhaustive Record,
 *  so a union change without a roster change is a tsc error in BOTH directions — the same
 *  idiom as render.ts's VOICE_COLOR / VOICE_SEAL. */
const VOICE_CATEGORY_SET: Readonly<Record<VoiceCategory, true>> = {
  narrator: true,
  player: true,
  physician: true,
  steward: true,
  arms: true,
  official: true,
  villager: true,
  monk: true,
  lord: true,
};
export const VOICE_CATEGORIES: readonly VoiceCategory[] = Object.keys(
  VOICE_CATEGORY_SET,
) as VoiceCategory[];

export const NPC_IDS: readonly NpcId[] = [
  'soan',
  'genemon',
  'kihei',
  'rokusuke',
  'chiyo',
  'munemasa',
  'ohisa',
  'shinnosuke',
  'toku',
  'naoyuki',
  'yohei',
  'oyae',
  'matsuzo',
  'iori',
  'oume',
];
