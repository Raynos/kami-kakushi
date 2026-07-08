// estate-sheet/fixture.ts — the static estate-state fixture: the ONLY data
// source the E1 prototype draws from (prototype-first law — zero game
// imports). Three eras prove the H5 re-ink grammar: geometry never moves;
// only the INK answers state (gold = fresh work, shu = strikes/新 stamps,
// shutters = closed-but-kept, and the ruinRevealed label swap).

import type { RoomId } from './house';

export interface RoomInk {
  /** closed rooms wear shutter marks, drawn like an open room kept (H5) */
  readonly state: 'open' | 'closed';
  /** this era's fresh work — gold members + a 新 stamp */
  readonly fresh?: boolean;
  /** the reviser struck the old member when the fresh one replaced it */
  readonly struck?: boolean;
}

export interface EstateFixture {
  readonly id: 't0r1' | 't1r7' | 'reveal';
  /** era chip shown in the demo header */
  readonly label: string;
  readonly en: string;
  /** the T2 honesty seam: swaps 母屋→客殿 and names the ruin 本邸 (H1/H5) */
  readonly ruinRevealed: boolean;
  readonly rooms: Readonly<Record<RoomId, RoomInk>>;
}

/** T0 · R1 — the sheet as first taken out of the kura: the outer house open
 *  and worked, the inner wings closed; the first repair (the kitchen roof's
 *  re-boarding) already in fresh ink. */
const T0_R1: EstateFixture = {
  id: 't0r1',
  label: '寛政・改元',
  en: 'T0 · R1 — the repair sheet, first opened',
  ruinRevealed: false,
  rooms: {
    gate: { state: 'open' },
    mainBody: { state: 'open' },
    kitchen: { state: 'open', fresh: true },
    eastWing: { state: 'closed' },
    westWing: { state: 'closed' },
    tokuRoom: { state: 'closed' },
    shoin: { state: 'closed' },
    kura: { state: 'open' },
    woodshed: { state: 'open' },
    sickroom: { state: 'open' },
    stable: { state: 'open' },
  },
};

/** T1 · R7 — the re-survey: the east wing rebuilt whole (fresh roof, the old
 *  one struck), the shoin's last boards fresh, Toku's room opened plain; the
 *  west wing still closed-but-kept. The ruin shows NO new work — it waits. */
const T1_R7: EstateFixture = {
  id: 't1r7',
  label: '再検・朱',
  en: 'T1 · R7 — the re-survey, reviser’s red',
  ruinRevealed: false,
  rooms: {
    gate: { state: 'open' },
    mainBody: { state: 'open' },
    kitchen: { state: 'open' },
    eastWing: { state: 'open', fresh: true, struck: true },
    westWing: { state: 'closed' },
    tokuRoom: { state: 'open' },
    shoin: { state: 'open', fresh: true },
    kura: { state: 'open' },
    woodshed: { state: 'open' },
    sickroom: { state: 'open' },
    stable: { state: 'open' },
  },
};

/** The T2 reveal PREVIEW — the same T1 ink with the honesty seam flipped:
 *  nothing moves, two labels tell the truth (母屋→客殿; the backdrop gains
 *  its real name 本邸). Here only to prove the seam; the beat itself is
 *  T2's story. */
const REVEAL: EstateFixture = {
  ...T1_R7,
  id: 'reveal',
  label: '改・本邸',
  en: 'T2 seam preview — the labels turn honest',
  ruinRevealed: true,
};

export const ERAS: readonly EstateFixture[] = [T0_R1, T1_R7, REVEAL];
