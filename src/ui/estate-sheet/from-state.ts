// estate-sheet/from-state.ts — the E1 okoshi-ezu FOLD-IN (ADR-177 F5 / HR-16):
// derive the sheet's ink from live GameState, ending the prototype's fixture-only
// law for the SHIPPED Estate 家 tab (demo.ts + fixture.ts stay as the DEV feel-test).
// Pure derivation: geometry never moves; only the ink answers state (H5) —
// the reopening rooms follow the HOUSE_ROOMS surface reveals, and the freshest
// commissioned work wears the gold 新 stamp.

import type { GameState } from '../../core';
import { isUnlocked } from '../../core';
import type { EstateFixture, RoomInk } from './fixture';
import type { RoomId } from './house';

/** A stable signature of everything the sheet's ink reads — repaint only when it moves. */
export function estateSheetSignature(state: GameState): string {
  const rooms = ['house-omoya', 'house-workshops', 'house-granary', 'house-study']
    .map((id) => (isUnlocked(state, id) ? '1' : '0'))
    .join('');
  return `${rooms}·U${state.estateStage}`;
}

/** GameState → the sheet's per-room ink. The working outer court is always open
 *  (the T0 fixture's baseline); the inner house follows its reveal schedule
 *  (omoya R4 → workshops/granary R6 → study R7); the HIGHEST built stage's rooms
 *  read as this era's fresh work (gold + 新). */
export function estateFixtureFromState(state: GameState): EstateFixture {
  const open = (id: string): boolean => isUnlocked(state, id);
  const stage = state.estateStage;
  const ink = (isOpen: boolean, fresh: boolean): RoomInk =>
    fresh
      ? { state: isOpen ? 'open' : 'closed', fresh: true }
      : { state: isOpen ? 'open' : 'closed' };
  const rooms: Record<RoomId, RoomInk> = {
    // the working outer court — open from the tab's first day
    gate: ink(true, stage === 1), // U1's first repairs touched the gate
    kitchen: ink(true, false),
    kura: ink(true, stage === 3), // U3 — the second granary raised at the kura
    woodshed: ink(true, stage === 1),
    sickroom: ink(true, false),
    stable: ink(true, false),
    // the inner house — reopens on its reveal schedule
    mainBody: ink(open('house-omoya'), stage === 4),
    eastWing: ink(open('house-workshops'), false),
    westWing: ink(open('house-granary'), false),
    shoin: ink(open('house-study'), stage === 4),
    tokuRoom: ink(open('house-study'), false),
  };
  return {
    id: 't0r1', // the T0 era sheet; the T2 honesty seam stays a story beat
    label: '当代',
    en: 'the house as it stands',
    ruinRevealed: false,
    rooms,
  };
}
