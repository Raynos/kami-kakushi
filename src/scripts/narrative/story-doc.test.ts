// The reading-script spine test (the interleave plan, 2026-07-18).
//
// t0-story.md is the human's story-review surface: the W6 cold read found its
// rung ladder ran R1 → R3 → R4 → R6 → R7 because rung-triggered / rung-homed
// scene-defs (R2's silent rung, R5's accusation night) were filed under
// "Generalized scenes". This suite runs the emitter over the REAL authoring
// sources and asserts the spine is continuous — one heading per rung, in
// order, derived from RANKS (the rung source of truth, never a copied count)
// — and that no ladder-placed scene-def leaks back into the generalized
// section. RED-proven against the pre-interleave emitter (missing R2/R5).

import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { describe, it, expect } from 'vitest';
import { parseNarrative, parseSceneTrigger, type NarrativeDoc } from './parse';
import { emitStoryDoc } from './story-doc';
import { RANKS } from '../../core/content/ranks';

const NARRATIVE_DIR = fileURLToPath(
  new URL('../../core/content/narrative/', import.meta.url),
);

/** Parse every real authoring source (the same set gen-narrative compiles —
 *  every top-level .md except the README; takes/ bundles are DEV-only overlay
 *  content, not part of the reading script). */
function loadRealDocs(): NarrativeDoc[] {
  return readdirSync(NARRATIVE_DIR, { withFileTypes: true })
    .filter(
      (d) => d.isFile() && d.name.endsWith('.md') && d.name !== 'README.md',
    )
    .map((d) =>
      parseNarrative(
        readFileSync(join(NARRATIVE_DIR, d.name), 'utf-8'),
        d.name,
      ),
    );
}

/** The rung a scene-def is ladder-placed at, if any: its `reading:` meta, else
 *  a `rung <R#>` trigger. Mirrors the emitter's placement rule. */
function placedRung(meta: Map<string, { value: string }>): string | undefined {
  const reading = meta.get('reading')?.value;
  if (reading !== undefined) return reading.trim();
  const trigger = meta.get('trigger')?.value;
  if (trigger === undefined) return undefined;
  const parsed = parseSceneTrigger(trigger);
  return parsed.ok && parsed.trigger.kind === 'rung'
    ? parsed.trigger.rung
    : undefined;
}

describe('t0-story.md spine (reading-script interleave)', () => {
  const docs = loadRealDocs();
  const out = emitStoryDoc(docs);

  it('carries one rung heading per RANKS rung R1–R7, in ascending order', () => {
    // R0 takes no rung section — the intro IS the R0 beat (D-110).
    const ladder = RANKS.filter((r) => r.id !== 'R0');
    expect(ladder.length).toBeGreaterThan(0);
    let prev = -1;
    for (const r of ladder) {
      const heading = `\n## ${r.id} · ${r.title} ${r.kanji}\n`;
      const at = out.indexOf(heading);
      expect(at, `missing or misplaced heading for ${r.id}`).toBeGreaterThan(
        prev,
      );
      expect(
        out.indexOf(heading, at + 1),
        `duplicate heading for ${r.id}`,
      ).toBe(-1);
      prev = at;
    }
  });

  it('keeps no ladder-placed scene-def in the generalized section', () => {
    const placed = docs
      .flatMap((d) => d.blocks)
      .filter((b) => b.kind === 'scene-def')
      .filter((b) => placedRung(b.meta) !== undefined);
    // The invariant only bites if the sources still author placed defs at all.
    expect(placed.length).toBeGreaterThan(0);
    const genAt = out.indexOf('\n## Generalized scenes');
    const genEnd = genAt === -1 ? -1 : out.indexOf('\n## ', genAt + 1);
    const generalized =
      genAt === -1 ? '' : out.slice(genAt, genEnd === -1 ? undefined : genEnd);
    for (const def of placed) {
      expect(
        generalized,
        `ladder-placed scene-def "${def.id}" is filed under Generalized scenes`,
      ).not.toContain(`### ${def.id}\n`);
      expect(out, `scene-def "${def.id}" fell out of the doc`).toContain(
        `### ${def.id}\n`,
      );
    }
  });
});
