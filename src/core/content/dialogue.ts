// The dialogue registry (PRD §2 onboarding / §5 cast; D-039 data-not-scripting,
// D-063 diegetic mentor, D-015/D-064 non-hand-holdy; DoD T0-M1-F3). Mentors are DATA,
// not script: each speaker owns an ORDERED set of teach-by-reveal lines, gated on plain
// boolean flags, and a PURE cursor returns the not-yet-delivered, gate-satisfied lines in
// registry order (deterministic). The cast is domain-split (D-046): Genemon (estate/labour),
// Kihei (arms), Sōan (healing) — the arms/healing onboarding fills in at their tier, so here
// they exist as SHORT stubs. Teaching is in-world (no tooltip/hint phrasing) — onboarding by
// plot, not popup. Pure-core: no DOM, no Math.*, no Date; immutable-in/immutable-out.

import { NAMES } from './names';
import type { NpcId, VoiceCategory } from './voices';
import type { NpcMemory } from '../state';

/** The per-NPC memory shape a `memGate` reads (plan §3.6). Aliased here so a line can gate on
 *  what an NPC remembers of the intro without dialogue.ts reaching into state internals. */
export type NpcMemoryMap = Readonly<Partial<Record<NpcId, NpcMemory>>>;

export interface DialogueLine {
  readonly id: string;
  readonly speaker: string;
  readonly text: string;
  /** Reveal-as-plot gate over plain GameState flags; absent = always shown. */
  readonly gate?: (flags: Readonly<Record<string, boolean>>) => boolean;
  /** Optional speaker-category colour tag (F23/F26); absent ⇒ renderer infers from speaker. */
  readonly voice?: VoiceCategory;
  /** Optional per-NPC MEMORY gate (plan §3.6): ANDed with `gate`. A later line branches on what
   *  an NPC remembers of the intro — e.g. two mutually-exclusive greetings, one per regard. */
  readonly memGate?: (mem: NpcMemoryMap) => boolean;
}

export interface DialogueDef {
  readonly id: string;
  readonly speaker: string;
  readonly lines: readonly DialogueLine[];
}

/** The id routed on the cold-open / R0 labour beat (no magic string at the call site). */
export const COLD_OPEN_DIALOGUE_ID = 'genemon-open';

export const DIALOGUES: readonly DialogueDef[] = [
  // ── Genemon (NAMES.elder) — the estate/labour onboarding: greet the amnesiac and teach
  // raking the spilled stores → rice, as STORY, in a weary lower-samurai-estate voice. The
  // first four lines are the cold-open greet; the fifth is a gated acknowledgment that fires
  // only once the player has actually raked (flag `raked`, already set by the rake intent). ──
  {
    id: COLD_OPEN_DIALOGUE_ID,
    speaker: NAMES.elder,
    lines: [
      {
        id: 'gen-greet',
        speaker: NAMES.elder,
        // F91/F93 — Genemon's own speech, so it renders "Genemon: …" in the steward voice,
        // consistent with his voiced lines in the intro (marked delivered on wake, so never
        // emitted via this path today, but tagged so the def is internally consistent).
        voice: 'steward',
        text: `On your feet, then. I am ${NAMES.elder}, steward of this house, and I keep the little it has left to keep. You'll not remember any of it, so hear it plain: the ${NAMES.house} are samurai still — on the lord's rolls, if nowhere in the granary.`,
      },
      {
        id: 'gen-stores',
        speaker: NAMES.elder,
        // F91/F93 — Genemon speaking (marked delivered on wake; tagged for def consistency).
        voice: 'steward',
        text: 'Mind the floor before you mind your head. Half a season’s stores lie spilled and trodden where the kura door gave way in the rains. Rice on the boards is rice the house has lost — and this house has done losing enough for three lifetimes.',
      },
      {
        id: 'gen-rake',
        speaker: NAMES.elder,
        // reveal-as-plot (battery fix): the rice-teaching lands as the player rakes (when the
        // first +rice shows), not piled onto the opening click. wake stays greet + the stakes.
        gate: (flags) => flags.raked === true,
        // F91/F93 — Genemon's own instruction ("Rake what grain is still whole…", "We reckon a
        // samurai house's worth in koku…"): first-person steward SPEECH, so it renders "Genemon: …"
        // in his voice like the rest of his lines — NOT plain narrator prose (the old miscue).
        voice: 'steward',
        text: 'So you put your hands to it. Rake what grain is still whole back toward the basket, a fistful at a time. We reckon a samurai house’s worth in koku — a year’s eating for one man — and every basket you save us is a measure we need not go begging to the lord to make good.',
      },
      {
        id: 'gen-keep',
        speaker: NAMES.elder,
        gate: (flags) => flags.raked === true,
        // F91/F93 — first-person Genemon speech ("without my standing over you…"): steward voice.
        voice: 'steward',
        text: "Clear it without my standing over you, and you'll have earned your rice and a dry corner to sleep in. I'll make you no grander promise than that. In this house, none of us holds one.",
      },
      {
        id: 'gen-kept',
        speaker: NAMES.elder,
        // Reveal-as-plot: only after the player has raked (the diegetic onboarding payoff).
        gate: (flags) => flags.raked === true,
        // F91/F93 — third-person NARRATOR prose ("…Genemon says, eyeing the cleared boards…"), NOT
        // his direct speech, so it stays narrator-voiced with no nameplate (the emitter suppresses
        // the speaker for a narrator line — see intents.ts deliverDialogue).
        voice: 'narrator',
        text: `"...You don't shirk the work," ${NAMES.elder} says, eyeing the cleared boards and the filling basket. "The house has had its fill of hands that do. Earn your keep, and a place here is yours."`,
      },
    ],
  },

  // ── Kihei (NAMES.drillmaster) — arms stub; full drill-yard onboarding lands at the combat
  // unlock (M2a / R3). Two lines so the domain-split cast shape exists. NOTE (battery #19 audit):
  // this + `soan-intro` below are AUTHORED-but-not-yet-ROUTED forward content (only the cold-open
  // `genemon-open` is delivered today) — kept on purpose, wired when their onboarding beat lands. ──
  {
    id: 'kihei-intro',
    speaker: NAMES.drillmaster,
    lines: [
      {
        id: 'kihei-1',
        speaker: NAMES.drillmaster,
        text: `${NAMES.drillmaster}, master-at-arms — what's left of the office. I keep a drill yard of warped poles and grey-haired men, and I wait on someone with the spine to swing them.`,
      },
      {
        id: 'kihei-2',
        speaker: NAMES.drillmaster,
        text: "When your legs will hold you and your head has stopped ringing, come and find me there. A house at the frayed edge of the lord's favour needs more than farmhands — and I would see what the flood left in your arms.",
      },
    ],
  },

  // ── Sōan (NAMES.physician) — healing stub; the debunker-physician who grounded the
  // cold-open folklore. Full healing onboarding lands later. ──
  {
    id: 'soan-intro',
    speaker: NAMES.physician,
    lines: [
      // ── The worked per-NPC memory READ (plan §3.6/§4.5): two mutually-exclusive greetings, one
      // per `npcMemory.soan.regard` branch (only one passes its memGate). Proves the memory is
      // per-NPC + durable — these read `soan` ONLY, never `genemon`, so a curt-to-Sōan /
      // earnest-to-Genemon player gets Sōan's cool greeting AND Genemon's warm one independently. ──
      {
        id: 'soan-greet-grateful',
        speaker: NAMES.physician,
        voice: 'physician',
        memGate: (m) => m.soan?.regard === 'grateful',
        text: `${NAMES.physician} looks up. "You came back on your own feet — I told you the wits mend last. Sit. Let's see what's still bitter to steep."`,
      },
      {
        id: 'soan-greet-curt',
        speaker: NAMES.physician,
        voice: 'physician',
        // the cool branch: everything that isn't the grateful path (curt, worried, or unmet).
        memGate: (m) => m.soan?.regard !== 'grateful',
        text: `${NAMES.physician} does not look up. "Still no patience for a physician, I see. Sit anyway. This will sting, and you'll thank me later — or you won't."`,
      },
      {
        id: 'soan-1',
        speaker: NAMES.physician,
        voice: 'physician',
        text: `${NAMES.physician}. I set what's broken and steep what's bitter, and I tell Asagiri there are no kami abroad in the reeds, however much the village would prefer there were.`,
      },
      {
        id: 'soan-2',
        speaker: NAMES.physician,
        voice: 'physician',
        text: 'Your wits will settle as the swelling does — eat when there is rice, rest when there is none, and don’t let the old women talk a fever into a haunting. That is the whole of my craft, and the better part of my counsel.',
      },
    ],
  },
];

export const DIALOGUE_IDS: ReadonlySet<string> = new Set(DIALOGUES.map((d) => d.id));

export function getDialogue(id: string): DialogueDef {
  const d = DIALOGUES.find((x) => x.id === id);
  if (!d) throw new Error(`unknown dialogue: ${id}`);
  return d;
}

/** Look up one authored line by (dialogue, line) id — single source for content that REUSES a
 *  registry line's text (e.g. the intro's Genemon-greet setup). Throws on an unknown id. */
export function getDialogueLine(dialogueId: string, lineId: string): DialogueLine {
  const line = getDialogue(dialogueId).lines.find((l) => l.id === lineId);
  if (!line) throw new Error(`unknown dialogue line: ${dialogueId}/${lineId}`);
  return line;
}

/**
 * PURE cursor: the not-yet-delivered, gate-satisfied lines of a dialogue, in registry
 * order. A line is yielded when its id is NOT in `deliveredIds` AND (no `gate` or it's
 * satisfied by `flags`) AND (no `memGate` or it's satisfied by `npcMemory`). Withheld lines
 * are skipped, not stopped-at, so later satisfied lines still surface. Deterministic.
 */
export function nextDialogueLines(
  dialogueId: string,
  deliveredIds: ReadonlySet<string>,
  flags: Readonly<Record<string, boolean>>,
  npcMemory: NpcMemoryMap = {},
): readonly DialogueLine[] {
  const def = getDialogue(dialogueId);
  return def.lines.filter(
    (line) =>
      !deliveredIds.has(line.id) &&
      (line.gate === undefined || line.gate(flags)) &&
      (line.memGate === undefined || line.memGate(npcMemory)),
  );
}
