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
import { isDiscovered } from '../discovery';
import { getRank, nextRankId } from './ranks';
import { DIALOGUES, nextDialogueLines } from './dialogue';
import { flavorLine } from './flavor';

// ── the D8 re-homing: every u9-* cast def answers through its person's ask ──
// The C4.2 press-A dispenser is retired; the SAME authored lines (dialogue.md,
// takes-overlay-aware via nextDialogueLines) now come back as one inline answer —
// every gate-satisfied line, no delivered-cursor. A `when:` gate opening a new
// line RESHAPES the answer, which re-lights the ask via the default text-digest
// freshness (D6): the drip becomes state-driven newness instead of button-mashing.
const NOTHING_DELIVERED: ReadonlySet<string> = new Set();
const u9Answers: Record<string, (s: GameState) => readonly AskAnswerLine[]> =
  Object.fromEntries(
    DIALOGUES.filter((d) => d.id.startsWith('u9-')).map((d) => [
      d.id,
      (s: GameState): readonly AskAnswerLine[] =>
        nextDialogueLines(d.id, NOTHING_DELIVERED, s.flags, s.npcMemory).map(
          (l) => ({
            text: l.text,
            // a narrator line renders unplated (the surface suppresses the
            // nameplate on voice 'narrator', matching deliverDialogue)
            ...(l.voice !== undefined ? { voice: l.voice } : {}),
            ...(l.voice !== 'narrator' ? { speaker: l.speaker } : {}),
          }),
        ),
    ]),
  );

export const NATIVE_ASK_ANSWERS: Readonly<
  Record<string, (s: GameState) => readonly AskAnswerLine[]>
> = {
  ...u9Answers,
  /** Genemon, "what does the house want of me" — the D2 house-wants read: your
   *  standing now and the line above yours, direction without reciting the hidden
   *  requirement list (FB-121 stays hidden; the fiction points, the book doesn't).
   *  Branch prose lives in flavor.md (askHouseWants*) — take-switchable; the
   *  «rank»/«next» tokens are substituted here, after the overlay lookup. */
  'house-wants': (s) => {
    const here = getRank(s.rung);
    const above = nextRankId(s.rung);
    if (above === null) {
      return [
        { text: flavorLine('askHouseWantsTop').replace('«rank»', here.title) },
      ];
    }
    return [
      {
        text: flavorLine('askHouseWantsLadder')
          .replace('«rank»', here.title.toLowerCase())
          .replace('«next»', getRank(above).title.toLowerCase()),
      },
    ];
  },

  /** Sōan, "how is my body" — the D2 body-&-mend read: a coarse exam verdict by
   *  health third (same banding as the `health` refresh key, so the answer and its
   *  newness move together). Branch prose in flavor.md (askMend*). */
  'body-mend': (s) => {
    const max = hpMax(s);
    const third = Math.ceil((3 * s.character.hp) / max);
    if (third >= 3) return [{ text: flavorLine('askMendSound') }];
    if (third === 2) return [{ text: flavorLine('askMendMarked') }];
    return [{ text: flavorLine('askMendDown') }];
  },

  // ── D2 discovery-hint asks (wave C, s218): each person points at what their
  // work has noticed — the branch follows the discovery latch, so the default
  // text-digest freshness re-lights the ask exactly when a find changes the
  // answer. Matsuzō walks his two water finds in order (reeds, then the old
  // sluice under the woodlot); the settled branch closes the thread.
  'waters-hint': (s) => {
    if (!isDiscovered(s, 'disc-weir-bundle'))
      return [{ text: flavorLine('askWatersReeds') }];
    if (!isDiscovered(s, 'disc-woodlot-sluice'))
      return [{ text: flavorLine('askWatersSluice') }];
    return [{ text: flavorLine('askWatersSettled') }];
  },
  'margins-hint': (s) => [
    {
      text: flavorLine(
        isDiscovered(s, 'disc-margins-sett')
          ? 'askMarginsSettled'
          : 'askMarginsSett',
      ),
    },
  ],
  'timber-hint': (s) => [
    {
      text: flavorLine(
        isDiscovered(s, 'disc-woodlot-lacquer')
          ? 'askTimberSettled'
          : 'askTimberLacquer',
      ),
    },
  ],
};

export const NATIVE_ASK_KINDS: ReadonlySet<string> = new Set(
  Object.keys(NATIVE_ASK_ANSWERS),
);
