// @vitest-environment jsdom
// The bestiary-plates golden pin — this module's OWN pin (the estate-sheet
// pattern; it does not touch the map-sheets pin). Hashes every foe's plate
// in both states (faced + unfaced) plus the blind naming crop, so a
// refactor can never silently reshuffle a kept look. RED means the drawing
// changed — if INTENTIONAL, regenerate + commit the hash WITH the change:
//
//   UPDATE_BESTIARY_GOLDEN=1 pnpm exec vitest run src/ui/bestiary-plates/golden.test.ts

import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { MOBS } from '../../core';
import type { MobId } from '../../core';
import { drawPlate } from './plates';

const GOLDEN_PATH = join(__dirname, 'golden.hash.json');
const SEED = 'jufu-v1';

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

function renderPlate(
  id: MobId,
  state: 'faced' | 'unfaced' | 'blind',
): { hash: string; nodes: number } {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  drawPlate(svg, id, {
    seed: SEED,
    faced: state !== 'unfaced',
    blind: state === 'blind',
    ...(state === 'faced' ? { note: 'golden-note fixture line' } : {}),
  });
  const parts: string[] = [];
  for (const el of svg.querySelectorAll('*')) {
    const attrs = DRAW_ATTRS.map((a) => el.getAttribute(a) ?? '').join('|');
    parts.push(`${el.tagName}:${attrs}:${el.textContent ?? ''}`);
  }
  return { hash: fnv1a(parts.join('\n')), nodes: parts.length };
}

describe('bestiary-plates golden pin', () => {
  const states = ['faced', 'unfaced', 'blind'] as const;

  it('every plate matches its pinned draw-stream hash', () => {
    const current: Record<string, { hash: string; nodes: number }> = {};
    for (const mob of MOBS)
      for (const s of states)
        current[`${mob.id}.${s}`] = renderPlate(mob.id, s);

    if (process.env.UPDATE_BESTIARY_GOLDEN) {
      writeFileSync(GOLDEN_PATH, `${JSON.stringify(current, null, 2)}\n`);
      return;
    }
    const pinned = JSON.parse(readFileSync(GOLDEN_PATH, 'utf8')) as Record<
      string,
      { hash: string; nodes: number }
    >;
    expect(Object.keys(current).sort()).toEqual(Object.keys(pinned).sort());
    for (const [k, v] of Object.entries(current))
      expect(v, k).toEqual(pinned[k]);
  });

  it('plates are seed-deterministic (two draws, identical stream)', () => {
    const a = renderPlate('tanuki', 'faced');
    const b = renderPlate('tanuki', 'faced');
    expect(a).toEqual(b);
  });

  it('an unfaced plate leaks no silhouette (rubric B5) and blind hides the name', () => {
    const unfaced = renderPlate('wolf', 'unfaced');
    const faced = renderPlate('wolf', 'faced');
    expect(unfaced.hash).not.toBe(faced.hash);
    // the blind crop must not carry the kanji title or label text
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    drawPlate(svg, 'wolf', { seed: SEED, faced: true, blind: true });
    expect(svg.textContent).not.toContain('狼');
    expect(svg.textContent).not.toContain('Lean wolf');
    // and the RUINED plate leaks nothing either — hover title included
    const ruined = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'svg',
    );
    drawPlate(ruined, 'wolf', { seed: SEED, faced: false });
    expect(ruined.textContent).not.toContain('狼');
    expect(ruined.textContent).not.toContain('Lean wolf');
  });
});
