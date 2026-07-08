// @vitest-environment jsdom
// The golden-hash pin (Phase C, session 115 review T-4): the T0/T1 sheets are a
// HUMAN-PASSED rendering (HR-12) — this test pins the exact drawing so a refactor
// (geom extraction, node collapse, seed churn) can never silently reshuffle the
// look. It hashes every element's tag + draw-bearing attributes, in document
// order, for both tiers.
//
// RED means: the drawing changed. If the change is INTENTIONAL (a craft pass,
// approved geometry edits), regenerate the pin and commit it WITH the change:
//
//   UPDATE_MAP_GOLDEN=1 pnpm exec vitest run src/ui/map-sheets/golden.test.ts
//
// …then eyeball fresh captures (src/scripts/map-audit-shots.mjs) before pushing.

import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { T0_WINDOW, WORLD } from './layout';
import { paintT0Ground } from './t0-sheet';
import { paintT1Ground } from './t1-sheet';

const GOLDEN_PATH = join(__dirname, 'golden.hash.json');

/** fnv1a over a string — tiny, stable, dependency-free. */
function fnv1a(s: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, '0');
}

const DRAW_ATTRS = [
  'd',
  'x',
  'y',
  'x1',
  'y1',
  'x2',
  'y2',
  'cx',
  'cy',
  'r',
  'width',
  'height',
  'points',
  'transform',
  'fill',
  'stroke',
  'stroke-width',
  'stroke-dasharray',
  'opacity',
  'fill-opacity',
  'class',
  'style',
];

function renderTier(tier: 'T0' | 'T1'): { hash: string; nodes: number } {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  const art = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  svg.append(art);
  const frame = tier === 'T0' ? T0_WINDOW : { x: 0, y: 0, w: WORLD.w, h: WORLD.h };
  if (tier === 'T0') paintT0Ground(art, frame);
  else paintT1Ground(art, frame);
  const parts: string[] = [];
  for (const el of Array.from(art.querySelectorAll('*'))) {
    let line = el.tagName;
    for (const a of DRAW_ATTRS) {
      const v = el.getAttribute(a);
      if (v !== null) line += `|${a}=${v}`;
    }
    line += `|t=${el.childElementCount === 0 ? (el.textContent ?? '') : ''}`;
    parts.push(line);
  }
  return { hash: fnv1a(parts.join('\n')), nodes: parts.length };
}

interface Golden {
  readonly t0: { hash: string; nodes: number };
  readonly t1: { hash: string; nodes: number };
}

describe('map-sheets golden pin — the drawing is the HR-12-passed one', () => {
  const current: Golden = { t0: renderTier('T0'), t1: renderTier('T1') };

  if (process.env.UPDATE_MAP_GOLDEN) {
    it('regenerates the pin (UPDATE_MAP_GOLDEN set)', () => {
      writeFileSync(GOLDEN_PATH, JSON.stringify(current, null, 2) + '\n');
      expect(current.t0.nodes).toBeGreaterThan(1000);
      expect(current.t1.nodes).toBeGreaterThan(1000);
    });
    return;
  }

  const golden = JSON.parse(readFileSync(GOLDEN_PATH, 'utf8')) as Golden;

  it('T0 ground hash matches the pin', () => {
    expect(current.t0).toEqual(golden.t0);
  });
  it('T1 ground hash matches the pin', () => {
    expect(current.t1).toEqual(golden.t1);
  });
  it('node counts stay within the perf envelope (blowup guard)', () => {
    // ~17k measured at pin time; the Phase C node collapse will LOWER these —
    // regen the pin when it lands. A silent 2x growth is the failure this catches.
    expect(current.t0.nodes).toBeLessThan(25000);
    expect(current.t1.nodes).toBeLessThan(25000);
  });
});
