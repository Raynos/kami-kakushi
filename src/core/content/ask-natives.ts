// FB-415 — NATIVE ask answers (the FB-5 escape hatch, applied to asks): an answer that
// needs real state logic beyond static prose lives HERE as a hand-written fn, and the
// authored `## ask` block declares `native: <key>`. Real logic never grows the markdown
// grammar; gen-narrative validates authored keys against this module at compile time.
//
// A line with no `speaker` is spoken by the asked person (the surface resolves the
// nameplate/voice from the person row) — these answers read as that person talking.
// Prose here is PLACEHOLDER-grade pending each ask's ADR-139 takes bundle.

import type { GameState } from '../state';
import type { AskAnswerLine } from '../asks';
import { hpMax } from '../selectors';
import { getRank, nextRankId } from './ranks';

export const NATIVE_ASK_ANSWERS: Readonly<
  Record<string, (s: GameState) => readonly AskAnswerLine[]>
> = {
  /** Genemon, "what does the house want of me" — the D2 house-wants read: your
   *  standing now and the line above yours, direction without reciting the hidden
   *  requirement list (FB-121 stays hidden; the fiction points, the book doesn't). */
  'house-wants': (s) => {
    const here = getRank(s.rung);
    const above = nextRankId(s.rung);
    if (above === null) {
      return [
        {
          text: `“${here.title} — the book has no line above yours to want you into. The house asks what it always asks: that the day's work be done.”`,
        },
      ];
    }
    return [
      {
        text: `“Today the book calls you ${here.title.toLowerCase()}. Above that line sits ${getRank(above).title.toLowerCase()} — do the work in front of you, and the house will notice when it notices.”`,
      },
    ];
  },

  /** Sōan, "how is my body" — the D2 body-&-mend read: a coarse exam verdict by
   *  health third (same banding as the `health` refresh key, so the answer and its
   *  newness move together). */
  'body-mend': (s) => {
    const max = hpMax(s);
    const third = Math.ceil((3 * s.character.hp) / max);
    if (third >= 3) {
      return [
        {
          text: '“Sound enough. Whatever you carry, it isn’t a wound — eat, sleep, and stay out of my sickroom.”',
        },
      ];
    }
    if (third === 2) {
      return [
        {
          text: '“You’re marked. Nothing that won’t close on its own — but it closes faster on a pallet than at a labour.”',
        },
      ];
    }
    return [
      {
        text: '“You should be lying down, not asking questions. The sickroom, now — paid or free, but now.”',
      },
    ];
  },
};

export const NATIVE_ASK_KINDS: ReadonlySet<string> = new Set(
  Object.keys(NATIVE_ASK_ANSWERS),
);
