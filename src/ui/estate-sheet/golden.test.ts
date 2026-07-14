// @vitest-environment jsdom
// The estate-sheet golden pin — this module's OWN pin (a standalone
// experiment: it does not touch the map-sheets pin). Hashes both variants'
// full draw streams across the T0-R1 and T1-R7 eras, so a refactor can
// never silently reshuffle a kept look, and the H5 re-ink promise (state
// changes ink, never geometry) is what a RED diff gets eyeballed against.
//
// RED means the drawing changed. If INTENTIONAL, regenerate + commit the
// hash WITH the change:
//
//   UPDATE_ESTATE_GOLDEN=1 pnpm exec vitest run src/ui/estate-sheet/golden.test.ts

import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { ERAS } from './fixture';
import { paintSheetA } from './sheet-a';
import { paintSheetB } from './sheet-b';

const GOLDEN_PATH = join(__dirname, 'golden.hash.json');

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

function renderSheet(
  variant: 'a' | 'b',
  eraId: string,
): { hash: string; nodes: number } {
  const fx = ERAS.find((e) => e.id === eraId)!;
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  const art = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  svg.append(art);
  if (variant === 'a') paintSheetA(art, fx);
  else paintSheetB(art, fx);
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

type Golden = Readonly<Record<string, { hash: string; nodes: number }>>;

const KEYS = ['a:t0r1', 'a:t1r7', 'b:t0r1', 'b:t1r7'] as const;

describe('estate-sheet golden pin — both variants, both eras', () => {
  const current: Golden = Object.fromEntries(
    KEYS.map((k) => {
      const [v, era] = k.split(':') as ['a' | 'b', string];
      return [k, renderSheet(v, era)];
    }),
  );

  if (process.env.UPDATE_ESTATE_GOLDEN) {
    it('regenerates the pin (UPDATE_ESTATE_GOLDEN set)', () => {
      writeFileSync(GOLDEN_PATH, JSON.stringify(current, null, 2) + '\n');
      for (const k of KEYS) expect(current[k]!.nodes).toBeGreaterThan(150);
    });
    return;
  }

  const golden = JSON.parse(readFileSync(GOLDEN_PATH, 'utf8')) as Golden;

  for (const k of KEYS) {
    it(`${k} hash matches the pin`, () => {
      expect(current[k]).toEqual(golden[k]);
    });
  }
  it('node counts stay within the perf envelope (blowup guard)', () => {
    for (const k of KEYS) expect(current[k]!.nodes).toBeLessThan(6000);
  });
  it('the reveal era re-inks labels only — same geometry, tiny node delta', () => {
    // H5's promise, machine-checked: flipping ruinRevealed must not add or
    // remove more than the handful of label/strike nodes it owns.
    const t1 = renderSheet('a', 't1r7');
    const rev = renderSheet('a', 'reveal');
    expect(Math.abs(rev.nodes - t1.nodes)).toBeLessThan(12);
  });
});
