// Speaker / voice model (interactive-intro plan §3.1, F23/F26). A leaf module (imports
// nothing from core) so both `state.ts` (npcMemory keys) and the log/dialogue/intro
// content can share the ids without a cycle. The RENDERER colours speech by `VoiceCategory`
// (a later phase); the pure core only CARRIES the tag. Pure data — no DOM, no Math/Date.

import { NAMES } from './names';

/** A remembered non-player character. Grows per tier as new cast is routed. D-110 adds the
 *  rung-beat granters/peers: `rokusuke` (R2 peer), `tozo` (R4 smith), `chiyo` (R6), `shigemasa`
 *  (R7). NOTE: the pedlar (Tokubei) is deliberately NOT an NpcId — he is an ambient trader whose
 *  one lever is the `pedlar-favour` flag (BQ6), so he takes no `npcMemory` slot. */
export type NpcId = 'soan' | 'genemon' | 'kihei' | 'rokusuke' | 'tozo' | 'chiyo' | 'shigemasa';

/** Who is speaking — drives the render-time colour class (plan §7). `narrator` is the
 *  muted default (ambient prose); `player` is the MC's own spoken lines. */
export type VoiceCategory =
  | 'narrator' // ambient prose — the muted default
  | 'player' // the MC's own spoken lines
  | 'physician' // Sōan (scholar / rational)
  | 'steward' // Genemon / Lady Chiyo / household
  | 'arms' // Kihei / the smith Tōzō / drill-yard
  | 'official' // magistrate / castle voices — incl. the lord Shigemasa (D-110 R7, see note)
  | 'villager'; // Asagiri folk / Rokusuke the kept-hand (D-110 R2)

// NOTE (D-110 / UI pass): the plan §7.2 calls for a DEDICATED `'lord'` VoiceCategory for Shigemasa's
// capstone colour. Adding a new category requires extending render.ts's exhaustive
// `Record<VoiceCategory, …>` VOICE_COLOR / VOICE_SEAL maps — a UI-pass edit (render.ts is off-limits
// this pass). Until then Shigemasa borrows the `'official'` castle/authority colour (distinct from
// Chiyo's `'steward'`). The UI pass should add `'lord'` + its colour/seal and repoint `shigemasa`.

/** The MC's spoken-line nameplate (voice `player`). */
export const PLAYER_SPEAKER = 'You';

/** The category a given NPC speaks in — one source of truth for both dialogue + intro tags.
 *  `chiyo` reuses the `steward` colour (the nameplate distinguishes her from Genemon; a distinct
 *  'inner' colour is an optional later UI refinement — plan §7.2). */
export const NPC_VOICE: Readonly<Record<NpcId, VoiceCategory>> = {
  soan: 'physician',
  genemon: 'steward',
  kihei: 'arms',
  rokusuke: 'villager',
  tozo: 'arms',
  chiyo: 'steward',
  shigemasa: 'official', // borrows the castle/authority colour until a dedicated 'lord' voice lands (UI pass)
};

/** The display name (nameplate) for a remembered NPC — reuses the canonical NAMES table. */
export const NPC_NAME: Readonly<Record<NpcId, string>> = {
  soan: NAMES.physician,
  genemon: NAMES.elder,
  kihei: NAMES.drillmaster,
  rokusuke: NAMES.rokusuke,
  tozo: NAMES.smith,
  chiyo: NAMES.steward,
  shigemasa: NAMES.lord,
};

export const NPC_IDS: readonly NpcId[] = [
  'soan',
  'genemon',
  'kihei',
  'rokusuke',
  'tozo',
  'chiyo',
  'shigemasa',
];
