// The data-driven surface registry (PRD §6.5 / §6.9). Each panel/screen/tab/row/
// readout/verb is data with an unlock predicate; reduce/tick latch newly-earned
// surfaces into the write-once `unlocked` set. Most M1 surfaces are revealed
// EXPLICITLY by a rung's RewardBundle (predicate `() => false`) — the reveal reads
// as plot; skill rows surface BY-DOING (predicate over skill visibility). Reveal
// staggering is a DESIGN property of this authored schedule (FU4).

import type { GameState, SurfaceId } from '../state';
import type { LogChannel } from '../log';
import { COLD_OPEN } from './coldOpen';
import { skillVisible } from '../skills';

export type SurfaceKind = 'screen' | 'panel' | 'tab' | 'readout' | 'verb' | 'row';

export interface Surface {
  readonly id: SurfaceId;
  readonly kind: SurfaceKind;
  readonly unlock: (s: GameState) => boolean;
  readonly revealLine?: { readonly channel: LogChannel; readonly text: string };
}

const narrate = (text: string): { channel: LogChannel; text: string } => ({
  channel: 'narration',
  text,
});

export const SURFACES: readonly Surface[] = [
  // ── cold open ──
  { id: 'screen-cold-open', kind: 'screen', unlock: () => true },
  { id: 'verb-open-eyes', kind: 'verb', unlock: () => true },
  {
    id: 'readout-body',
    kind: 'readout',
    unlock: (s) => s.flags.awake === true,
    revealLine: narrate(COLD_OPEN.bodyReveal),
  },
  {
    id: 'readout-rice',
    kind: 'readout',
    unlock: (s) => s.flags.awake === true,
    revealLine: narrate(COLD_OPEN.riceReveal),
  },
  { id: 'verb-rake', kind: 'verb', unlock: (s) => s.flags.awake === true },
  {
    id: 'verb-rest',
    kind: 'verb',
    unlock: (s) => s.flags.raked === true,
    revealLine: narrate(COLD_OPEN.restReveal),
  },

  // ── R1 — the estate opens (revealed by the rank reward) ──
  { id: 'panel-rung-ladder', kind: 'panel', unlock: () => false },
  {
    id: 'readout-clock',
    kind: 'readout',
    unlock: () => false,
    revealLine: narrate(
      'You begin to mark the turning of the days, and the four seasons with them.',
    ),
  },
  { id: 'readout-stamina', kind: 'readout', unlock: () => false },
  {
    id: 'room-gate-forecourt',
    kind: 'panel',
    unlock: () => false,
    revealLine: narrate(
      'The gate and the swept forecourt are yours to work now — stores come and go here.',
    ),
  },
  {
    id: 'room-home-paddies',
    kind: 'panel',
    unlock: () => false,
    revealLine: narrate('The terraced home paddies open to you — the rice that feeds the house.'),
  },
  { id: 'verb-farm', kind: 'verb', unlock: () => false },
  { id: 'verb-haul', kind: 'verb', unlock: () => false },

  // ── R2 — the first nav, the wider estate, the skills you can name ──
  {
    id: 'tab-skills',
    kind: 'tab',
    unlock: () => false,
    revealLine: narrate('A way to track what your hands are learning takes shape — your Skills.'),
  },
  {
    id: 'room-woodlot-edge',
    kind: 'panel',
    unlock: () => false,
    revealLine: narrate(
      'The stable yard and woodlot edge — fuel, timber, and the first sight of the road out.',
    ),
  },
  {
    id: 'room-near-satoyama',
    kind: 'panel',
    unlock: () => false,
    revealLine: narrate(
      'Above the estate lies the near satoyama — sansai to gather, and the first edge of danger.',
    ),
  },
  { id: 'verb-woodcut', kind: 'verb', unlock: () => false },
  { id: 'verb-forage', kind: 'verb', unlock: () => false },
  { id: 'row-wood', kind: 'row', unlock: () => false },
  { id: 'row-sansai', kind: 'row', unlock: () => false },
  { id: 'skill-conditioning', kind: 'row', unlock: () => false },

  // ── skills surface BY-DOING (discover-by-doing) ──
  { id: 'skill-farming', kind: 'row', unlock: (s) => skillVisible(s, 'farming') },
  { id: 'skill-foraging', kind: 'row', unlock: (s) => skillVisible(s, 'foraging') },
  { id: 'skill-woodcutting', kind: 'row', unlock: (s) => skillVisible(s, 'woodcutting') },
];

export const SURFACE_IDS: ReadonlySet<SurfaceId> = new Set(SURFACES.map((x) => x.id));
