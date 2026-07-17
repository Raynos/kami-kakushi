// The FB-415 ask registry — WHO can be asked WHAT, WHEN, and how each answer derives
// (engine + types in ../asks.ts). The asks are AUTHORED in `narrative/asks.md` (FB-5 —
// the source of truth) and compiled to `asks.gen.ts`; this module keeps the generated
// shape → engine-def mapping and re-exports the live registry. Real logic never rides
// the grammar: a state-derived answer names a NATIVE_ASK_ANSWERS key (ask-natives.ts),
// freshness names a CLOSED ASK_REFRESH key (ask-refresh.ts — D6). Static answer lines
// consult the ADR-139 story overlay (`ask.<askId>.<lineId>`), so a future takes bundle
// can re-voice an answer without touching heard-state.

import type { AskAnswerLine, AskDef } from '../asks';
import type { RankId } from './ranks';
import type { VoiceCategory } from './voices';
import type { NpcMemoryMap } from './dialogue';
import { storyText } from './story-overlay';
import { ASK_REFRESH } from './ask-refresh';
import { NATIVE_ASK_ANSWERS } from './ask-natives';
import { ASK_DEFS } from './asks.gen';

/** One authored static answer line, as emitted (emit.ts emitProseLine shape). */
export interface GenAskLine {
  readonly id: string;
  readonly voice: VoiceCategory | 'player' | 'narrator';
  readonly speaker?: string;
  readonly text: string;
}

/** The generated shape `asks.gen.ts` carries — mapped to the engine AskDef below. */
export interface GenAskDef {
  readonly id: string;
  readonly person: string;
  readonly rungMin: RankId;
  readonly rungMax?: RankId;
  readonly label: string;
  /** `when: <flag>` gate, over flags (the dialogue WhenGate's flag form). */
  readonly gate?: (flags: Readonly<Record<string, boolean>>) => boolean;
  /** `when: <npc>.regard is|not <v>` gate, over npc memory. */
  readonly memGate?: (m: NpcMemoryMap) => boolean;
  readonly refresh?: string;
  readonly native?: string;
  readonly lines?: readonly GenAskLine[];
}

/** The overlay-aware text of a static answer line (ADR-139 — same pattern as
 *  dialogue.ts effectiveLine; the address is `ask.<askId>.<lineId>`). */
function lineText(askId: string, line: GenAskLine): string {
  return storyText(`ask.${askId}.${line.id}`) ?? line.text;
}

function toAskDef(g: GenAskDef): AskDef {
  const answer =
    g.native !== undefined
      ? NATIVE_ASK_ANSWERS[g.native]!
      : (): readonly AskAnswerLine[] =>
          (g.lines ?? []).map((l) => ({
            text: lineText(g.id, l),
            ...(l.speaker !== undefined ? { speaker: l.speaker } : {}),
            ...(l.voice !== 'narrator' && l.voice !== 'player'
              ? { voice: l.voice }
              : {}),
          }));
  return {
    id: g.id,
    person: g.person,
    rungMin: g.rungMin,
    ...(g.rungMax !== undefined ? { rungMax: g.rungMax } : {}),
    label: g.label,
    ...(g.gate !== undefined || g.memGate !== undefined
      ? {
          when: (s: Parameters<NonNullable<AskDef['when']>>[0]): boolean =>
            (g.gate === undefined || g.gate(s.flags)) &&
            (g.memGate === undefined || g.memGate(s.npcMemory)),
        }
      : {}),
    ...(g.refresh !== undefined ? { freshness: ASK_REFRESH[g.refresh]! } : {}),
    answer,
  };
}

export const ASKS: readonly AskDef[] = ASK_DEFS.map(toAskDef);

export const ASK_IDS: ReadonlySet<string> = new Set(ASKS.map((a) => a.id));

export function askById(id: string): AskDef | undefined {
  return ASKS.find((a) => a.id === id);
}
