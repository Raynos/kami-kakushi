// The FB-415 ask registry — WHO can be asked WHAT, WHEN, and how each answer derives
// from live state (engine + types in ../asks.ts). STEP-1 ENGINE SEED: these few
// hand-written defs prove the engine end-to-end; the authored matrix (R0–R2 seed →
// per-person ADR-139 waves) lands with the narrative-pipeline step, which re-homes
// this registry into `narrative/` sources + a generated `asks.gen.ts` the same way
// dialogue.md → dialogue.gen.ts works. Answer prose here is PLACEHOLDER pending its
// ADR-139 takes bundle — plain, serviceable, never shipped as the final voice.

import type { AskDef } from '../asks';
import { getRank } from './ranks';

export const ASKS: readonly AskDef[] = [
  {
    // Genemon — the steward answers for the HOUSE (D2: house wants). The answer names
    // the standing the book records NOW; his answer moves when the rung does, so the
    // freshness key is the rung itself (D6 state-driven refresh).
    id: 'genemon-house-standing',
    person: 'genemon',
    rungMin: 'R0',
    label: '“How do I stand with the house?”',
    answer: (s) => [
      {
        text: `“The book says what it says. ${getRank(s.rung).title} — that is what you are to this house today.”`,
      },
    ],
    freshness: (s) => s.rung,
  },
];

export const ASK_IDS: ReadonlySet<string> = new Set(ASKS.map((a) => a.id));

export function askById(id: string): AskDef | undefined {
  return ASKS.find((a) => a.id === id);
}
