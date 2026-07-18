// @vitest-environment jsdom
// The pictogram golden pin + the stroke-grammar laws (this dir's README).
// Standalone experiment pin (estate-sheet pattern) — it does not touch the
// map-sheets pin. RED means the drawing changed; if INTENTIONAL:
//
//   UPDATE_PICTO_GOLDEN=1 pnpm exec vitest run src/ui/pictograms/glyphs.golden.test.ts

import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { PICTOGRAM_IDS, drawPictogram } from './glyphs';
import type { PictogramId } from './glyphs';

const GOLDEN_PATH = join(__dirname, 'golden.hash.json');
const SEED = 'ab-2026-07-18';

function fnv1a(s: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, '0');
}

function renderGlyph(id: PictogramId, seed = SEED): SVGGElement {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  return drawPictogram(svg, id, { seed });
}

function drawStream(g: SVGGElement): string {
  const parts: string[] = [];
  for (const el of Array.from(g.querySelectorAll('*'))) {
    let line = el.tagName;
    for (const a of ['d', 'fill', 'stroke', 'stroke-width', 'class']) {
      const v = el.getAttribute(a);
      if (v !== null) line += `|${a}=${v}`;
    }
    parts.push(line);
  }
  return parts.join('\n');
}

type Golden = Readonly<Record<string, { hash: string; paths: number }>>;

const current: Golden = Object.fromEntries(
  PICTOGRAM_IDS.map((id) => {
    const g = renderGlyph(id);
    return [
      id,
      { hash: fnv1a(drawStream(g)), paths: g.querySelectorAll('path').length },
    ];
  }),
);

describe('pictogram stroke grammar (README laws)', () => {
  for (const id of PICTOGRAM_IDS) {
    it(`${id}: ≤5 paths, one weight, one colour`, () => {
      const g = renderGlyph(id);
      const paths = Array.from(g.querySelectorAll('path'));
      expect(paths.length).toBeGreaterThan(0);
      expect(paths.length).toBeLessThanOrEqual(5);
      let filled = 0;
      for (const p of paths) {
        const stroke = p.getAttribute('stroke');
        const fill = p.getAttribute('fill');
        if (stroke === 'none') {
          // a filled path — the one-per-glyph solid accent
          expect(fill).toBe('var(--ink)');
          filled++;
        } else {
          expect(stroke).toBe('var(--ink)');
          expect(fill).toBe('none');
          expect(p.getAttribute('stroke-width')).toBe('2');
        }
      }
      expect(filled).toBeLessThanOrEqual(1);
    });
  }

  it('is seed-deterministic, and the seed actually reaches the ink', () => {
    for (const id of PICTOGRAM_IDS) {
      const a = drawStream(renderGlyph(id));
      expect(drawStream(renderGlyph(id))).toBe(a);
      expect(drawStream(renderGlyph(id, 'other-seed'))).not.toBe(a);
    }
  });
});

describe('pictogram golden pin', () => {
  if (process.env.UPDATE_PICTO_GOLDEN) {
    it('regenerates the pin (UPDATE_PICTO_GOLDEN set)', () => {
      writeFileSync(GOLDEN_PATH, JSON.stringify(current, null, 2) + '\n');
      expect(Object.keys(current)).toHaveLength(PICTOGRAM_IDS.length);
    });
    return;
  }

  const golden = JSON.parse(readFileSync(GOLDEN_PATH, 'utf8')) as Golden;

  it('covers exactly the roster', () => {
    expect(Object.keys(golden).sort()).toEqual([...PICTOGRAM_IDS].sort());
  });
  for (const id of PICTOGRAM_IDS) {
    it(`${id} hash matches the pin`, () => {
      expect(current[id]).toEqual(golden[id]);
    });
  }
});
