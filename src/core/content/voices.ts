// Speaker / voice model (interactive-intro plan §3.1, F23/F26). A leaf module (imports
// nothing from core) so both `state.ts` (npcMemory keys) and the log/dialogue/intro
// content can share the ids without a cycle. The RENDERER colours speech by `VoiceCategory`
// (a later phase); the pure core only CARRIES the tag. Pure data — no DOM, no Math/Date.

import { NAMES } from './names';

/** A remembered non-player character. Grows per tier as new cast is routed. */
export type NpcId = 'soan' | 'genemon' | 'kihei';

/** Who is speaking — drives the render-time colour class (plan §7). `narrator` is the
 *  muted default (ambient prose); `player` is the MC's own spoken lines. */
export type VoiceCategory =
  | 'narrator' // ambient prose — the muted default
  | 'player' // the MC's own spoken lines
  | 'physician' // Sōan (scholar / rational)
  | 'steward' // Genemon / household
  | 'arms' // Kihei / drill-yard
  | 'official' // magistrate / castle voices (future)
  | 'villager'; // Asagiri folk (future)

/** The MC's spoken-line nameplate (voice `player`). */
export const PLAYER_SPEAKER = 'You';

/** The category a given NPC speaks in — one source of truth for both dialogue + intro tags. */
export const NPC_VOICE: Readonly<Record<NpcId, VoiceCategory>> = {
  soan: 'physician',
  genemon: 'steward',
  kihei: 'arms',
};

/** The display name (nameplate) for a remembered NPC — reuses the canonical NAMES table. */
export const NPC_NAME: Readonly<Record<NpcId, string>> = {
  soan: NAMES.physician,
  genemon: NAMES.elder,
  kihei: NAMES.drillmaster,
};

export const NPC_IDS: readonly NpcId[] = ['soan', 'genemon', 'kihei'];
