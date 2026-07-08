// stamp-book/fixture.ts — a STATIC, plausible T0 run history feeding the E3
// prototype. Rung names + crises are the story bible's (03-tiers → T0 rungs);
// dates ride the six-season calendar (05-world: Winter → New Year → Spring →
// Summer → Bon → Autumn). Nothing here reads game state — the prototype-first
// law (docs/plans/fable-2026-07-08-graphics-explorations.md): graphics only,
// integration is a later, separately-gated step.

/** One pressed stamp — a rung-up ceremony the book remembers. */
export interface StampEvent {
  readonly id: string;
  readonly rung: number;
  /** the seal's carved center glyph */
  readonly kanji: string;
  readonly name: string;
  /** six-season calendar block, EN + glyph */
  readonly season: string;
  readonly seasonKanji: string;
  /** day-of-run the stamp was pressed */
  readonly day: number;
  /** what the book remembers about this rung (hover title) */
  readonly note: string;
}

/** A mark the ink thread carries BETWEEN stamps — a knot at a crisis, a thin
 *  dry passage through a lean stretch. `beforeRung` is the stamp it precedes. */
export interface ThreadMark {
  readonly kind: 'knot' | 'lean';
  readonly beforeRung: number;
  readonly label: string;
}

/** The book's owner — the use-name, as the day-book writes it. */
export const OWNER = { kanji: '権兵衛', roman: 'Gonbei' } as const;

export const STAMPS: readonly StampEvent[] = [
  {
    id: 'r0',
    rung: 0,
    kanji: '堰',
    name: 'The man from the weir',
    season: 'Winter',
    seasonKanji: '冬',
    day: 1,
    note: 'Pulled out; raking; the speaker flip.',
  },
  {
    id: 'r1',
    rung: 1,
    kanji: '日',
    name: 'The day-hand',
    season: 'Winter',
    seasonKanji: '冬',
    day: 6,
    note: 'Kept by arithmetic — two hands quit that week.',
  },
  {
    id: 'r2',
    rung: 2,
    kanji: '庭',
    name: 'The yard-hand',
    season: 'New Year',
    seasonKanji: '正月',
    day: 14,
    note: 'The silent rung — a task simply not taken back.',
  },
  {
    id: 'r3',
    rung: 3,
    kanji: '蔵',
    name: 'The grain-watch',
    season: 'Spring',
    seasonKanji: '春',
    day: 27,
    note: 'The wolf — survived, not won; ribs cracked.',
  },
  {
    id: 'r4',
    rung: 4,
    kanji: '弟',
    name: 'The pupil',
    season: 'Summer',
    seasonKanji: '夏',
    day: 40,
    note: 'He begs for drills; the creed, once; the drill yard opens.',
  },
  {
    id: 'r5',
    rung: 5,
    kanji: '疑',
    name: 'The accused',
    season: 'Bon',
    seasonKanji: '盆',
    day: 52,
    note: 'The Count night — the day-book clears him; no apology.',
  },
  {
    id: 'r6',
    rung: 6,
    kanji: '信',
    name: 'The trusted hand',
    season: 'Autumn',
    seasonKanji: '秋',
    day: 65,
    note: 'The first coin errand, counted back to the mon.',
  },
  {
    id: 'r7',
    rung: 7,
    kanji: '名',
    name: 'The named hand',
    season: 'Autumn',
    seasonKanji: '秋',
    day: 78,
    note: 'Genemon writes the hand-me-down name. Sleep; the first dream.',
  },
];

export const THREAD_MARKS: readonly ThreadMark[] = [
  { kind: 'lean', beforeRung: 2, label: 'The short-handed weeks — thin ink' },
  { kind: 'knot', beforeRung: 3, label: 'The wolf' },
  { kind: 'knot', beforeRung: 5, label: 'The accusation night' },
];
