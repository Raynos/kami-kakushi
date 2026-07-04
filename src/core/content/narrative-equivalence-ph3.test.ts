// TEMPORARY (F5 Ph3) — the migration equivalence proofs for intro / dialogue /
// cold-open: each generated registry is behavior-identical to its hand-written
// original. RETIRES AT THE FLIPS (each module then re-exports the generated
// data and this would compare a re-export to itself); the standing seals are
// the untouched intro.test.ts / dialogue.test.ts / coldOpen.test.ts suites.
//
// Gate closures are compared BEHAVIORALLY over their complete domains:
// - intro topic gates: `asked.has(<id>)` — ∅ + every singleton + foreign + a pair
// - dialogue flag gates: the named flag true/false/absent
// - dialogue memGates: every regard value named in any condition + foreign + absent

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { COLD_OPEN } from './coldOpen';
import { COLD_OPEN as COLD_OPEN_GEN } from './coldOpen.gen';
import { DIALOGUES, type NpcMemoryMap } from './dialogue';
import { DIALOGUES as DIALOGUES_GEN } from './dialogue.gen';
import { DIALOGUE_SCENES } from './intro';
import { DIALOGUE_SCENES as DIALOGUE_SCENES_GEN } from './intro.gen';
import { parseNarrative } from '../../scripts/narrative/parse';
import type { NpcId } from './voices';

const serializable = (v: unknown): unknown => JSON.parse(JSON.stringify(v));

describe('narrative equivalence Ph3 — generated ≡ hand-written', () => {
  it('COLD_OPEN deep-equals (all keys, byte-for-byte prose)', () => {
    expect(serializable(COLD_OPEN_GEN)).toEqual(serializable(COLD_OPEN));
  });

  it('DIALOGUES deep-equals over serializable fields', () => {
    expect(serializable(DIALOGUES_GEN)).toEqual(serializable(DIALOGUES));
  });

  it('DIALOGUE gate/memGate presence matches and behavior agrees over the full domain', () => {
    // The domain derives from the AUTHORING file (the source of truth for what
    // the gates can name): every flag and regard value in any when: condition.
    const md = parseNarrative(
      readFileSync(fileURLToPath(new URL('./narrative/dialogue.md', import.meta.url)), 'utf-8'),
      'dialogue.md',
    );
    const flags = new Set<string>();
    const regards = new Set<string>();
    for (const b of md.blocks) {
      if (b.kind !== 'dialogue') continue;
      for (const l of b.lines) {
        if (l.when?.type === 'flag') flags.add(l.when.flag);
        if (l.when?.type === 'regard') regards.add(l.when.value);
      }
    }
    expect(flags.size).toBeGreaterThan(0); // the domain itself could go RED
    expect(regards.size).toBeGreaterThan(0);

    const flagDomains: Readonly<Record<string, boolean>>[] = [{}];
    for (const f of flags) flagDomains.push({ [f]: true }, { [f]: false });
    const memDomains: NpcMemoryMap[] = [{}];
    for (const r of [...regards, 'a-foreign-regard']) {
      for (const npc of ['soan', 'genemon'] as NpcId[]) {
        memDomains.push({ [npc]: { regard: r, warmth: 0 } });
      }
    }

    expect(DIALOGUES_GEN.length).toBe(DIALOGUES.length);
    for (let d = 0; d < DIALOGUES.length; d++) {
      const hand = DIALOGUES[d]!;
      const gen = DIALOGUES_GEN[d]!;
      expect(gen.lines.length).toBe(hand.lines.length);
      for (let i = 0; i < hand.lines.length; i++) {
        const hl = hand.lines[i]!;
        const gl = gen.lines[i]!;
        expect(gl.gate === undefined, `${hand.id}/${hl.id} gate presence`).toBe(
          hl.gate === undefined,
        );
        expect(gl.memGate === undefined, `${hand.id}/${hl.id} memGate presence`).toBe(
          hl.memGate === undefined,
        );
        if (hl.gate) {
          for (const f of flagDomains) {
            expect(gl.gate!(f), `${hand.id}/${hl.id} over ${JSON.stringify(f)}`).toBe(hl.gate(f));
          }
        }
        if (hl.memGate) {
          for (const m of memDomains) {
            expect(gl.memGate!(m), `${hand.id}/${hl.id} over ${JSON.stringify(m)}`).toBe(
              hl.memGate(m),
            );
          }
        }
      }
    }
  });

  it('DIALOGUE_SCENES deep-equals over serializable fields', () => {
    expect(serializable(DIALOGUE_SCENES_GEN)).toEqual(serializable(DIALOGUE_SCENES));
  });

  it('intro topic gates agree over the complete asked.has domain', () => {
    expect(DIALOGUE_SCENES_GEN.length).toBe(DIALOGUE_SCENES.length);
    for (let s = 0; s < DIALOGUE_SCENES.length; s++) {
      const hand = DIALOGUE_SCENES[s]!;
      const gen = DIALOGUE_SCENES_GEN[s]!;
      expect(gen.topics.length).toBe(hand.topics.length);
      const allIds = hand.topics.map((t) => t.id);
      const domain: ReadonlySet<string>[] = [
        new Set<string>(),
        ...allIds.map((id) => new Set([id])),
        new Set(['not-a-real-topic']),
        new Set(allIds.slice(0, 2)),
      ];
      for (let i = 0; i < hand.topics.length; i++) {
        const ht = hand.topics[i]!;
        const gt = gen.topics[i]!;
        expect(gt.gate === undefined, `${hand.id}/${ht.id} gate presence`).toBe(
          ht.gate === undefined,
        );
        if (!ht.gate) continue;
        for (const asked of domain) {
          expect(gt.gate!(asked), `${hand.id}/${ht.id} over {${[...asked].join(',')}}`).toBe(
            ht.gate(asked),
          );
        }
      }
    }
  });

  it('the cross-file reuse stays single-source (generated intro references, not copies)', () => {
    // The generated module must IMPORT the shared text, not bake in a copy —
    // proven at the source level: the emitted file carries the reuse expressions.
    const gen = readFileSync(fileURLToPath(new URL('./intro.gen.ts', import.meta.url)), 'utf-8');
    expect(gen).toContain('COLD_OPEN.wake');
    expect(gen).toContain("getDialogueLine('genemon-open', 'gen-greet').text");
  });
});
