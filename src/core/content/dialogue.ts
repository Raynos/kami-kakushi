// The dialogue registry (PRD §2 onboarding / §5 cast; ADR-039 data-not-scripting,
// ADR-063 diegetic mentor, ADR-015/ADR-064 non-hand-holdy; DoD T0-M1-F3). The LINES are
// authored in `narrative/dialogue.md` (FB-5 — the source of truth) and compiled to
// `dialogue.gen.ts`; this module keeps the types + the pure cursor/helpers and
// re-exports the generated registry. Mentors are DATA,
// not script: each speaker owns an ORDERED set of teach-by-reveal lines, gated on plain
// boolean flags, and a PURE cursor returns the not-yet-delivered, gate-satisfied lines in
// registry order (deterministic). The cast is domain-split (ADR-046): Genemon (estate/labour),
// Kihei (arms), Sōan (healing) — the arms/healing onboarding fills in at their tier, so here
// they exist as SHORT stubs. Teaching is in-world (no tooltip/hint phrasing) — onboarding by
// plot, not popup. Pure-core: no DOM, no Math.*, no Date; immutable-in/immutable-out.

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
  /** Optional speaker-category colour tag (FB-23/FB-26); absent ⇒ renderer infers from speaker. */
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

/** FB-224 — Genemon's raked-gated teach beats, one per rake (#1 → #3). While any is
 *  still undelivered, the shell extends the rake cooldown (timing.ts
 *  RAKE_TEACH_COOLDOWN_MS) so each line finishes typing before the next press —
 *  the cold-open pacing beat the human asked for. A dialogue.md rename REDs the
 *  ids-exist test, so this list can't silently drift from the registry. */
export const RAKE_TEACH_LINE_IDS: readonly string[] = ['gen-rake', 'gen-keep', 'gen-kept'];
export function rakeTeachPending(deliveredDialogue: readonly string[]): boolean {
  return RAKE_TEACH_LINE_IDS.some((id) => !deliveredDialogue.includes(id));
}

export { DIALOGUES } from './dialogue.gen';
import { DIALOGUES } from './dialogue.gen';

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
