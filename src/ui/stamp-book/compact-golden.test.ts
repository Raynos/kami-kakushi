// @vitest-environment jsdom
// The compact seal-strip golden pin (ADR-201, the plan's named check): each
// variant's drawing over a deterministic REAL-engine run is hashed and
// pinned, so a refactor (brush churn, seed drift, layout nudge) can never
// silently reshuffle a look the human reviews at HR-46. Mirrors the
// map-sheets pin (golden.test.ts).
//
// RED means: the drawing changed. If INTENTIONAL, regenerate + commit the
// pin WITH the change:
//
//   UPDATE_STAMP_GOLDEN=1 pnpm exec vitest run src/ui/stamp-book/compact-golden.test.ts

import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  advanceClock,
  applyGrindFight,
  applyPromotion,
  createInitialState,
  TICKS_PER_DAY,
  type GameState,
} from '../../core';
import { stripFromState } from './from-state';
import { paintConcertina } from './concertina';
import { paintRail } from './rail';
import { paintPages } from './pages';

const GOLDEN_PATH = join(__dirname, 'compact-golden.hash.json');

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
  'viewBox',
];

/** The pinned run — driven through the REAL engine, no field pokes: four
 *  presses at authored gaps (one lean stretch) and one dated fall. */
function pinnedState(): GameState {
  let s = createInitialState(7);
  const later = (st: GameState, d: number): GameState =>
    advanceClock(st, d * TICKS_PER_DAY);
  s = applyPromotion(later(s, 4), 'R1');
  s = applyPromotion(later(s, 5), 'R2');
  s = applyGrindFight(s, 'bandit'); // a real fall on the R2→R3 stretch
  s = applyPromotion(later(s, 14), 'R3'); // the lean stretch
  s = applyPromotion(later(s, 4), 'R4');
  return s;
}

function hashHost(host: HTMLElement): { hash: string; nodes: number } {
  const parts: string[] = [];
  for (const node of Array.from(host.querySelectorAll('*'))) {
    let line = node.tagName;
    for (const a of DRAW_ATTRS) {
      const v = node.getAttribute(a);
      if (v !== null) line += `|${a}=${v}`;
    }
    line += `|t=${node.childElementCount === 0 ? (node.textContent ?? '') : ''}`;
    parts.push(line);
  }
  return { hash: fnv1a(parts.join('\n')), nodes: parts.length };
}

function renderVariant(v: 'a' | 'b' | 'c'): { hash: string; nodes: number } {
  const data = stripFromState(pinnedState());
  const host = document.createElement('div');
  document.body.append(host);
  if (v === 'a') paintConcertina(host, data);
  else if (v === 'b') paintRail(host, data);
  else paintPages(host, data);
  const out = hashHost(host);
  host.remove();
  return out;
}

interface Golden {
  readonly a: { hash: string; nodes: number };
  readonly b: { hash: string; nodes: number };
  readonly c: { hash: string; nodes: number };
}

describe('compact seal-strip golden pin (ADR-201 / HR-46)', () => {
  const current: Golden = {
    a: renderVariant('a'),
    b: renderVariant('b'),
    c: renderVariant('c'),
  };

  if (process.env.UPDATE_STAMP_GOLDEN) {
    it('regenerates the pin (UPDATE_STAMP_GOLDEN set)', () => {
      writeFileSync(GOLDEN_PATH, JSON.stringify(current, null, 2) + '\n');
      expect(current.a.nodes).toBeGreaterThan(50);
      expect(current.b.nodes).toBeGreaterThan(30);
      expect(current.c.nodes).toBeGreaterThan(20);
    });
    return;
  }

  const golden = JSON.parse(readFileSync(GOLDEN_PATH, 'utf8')) as Golden;

  it('A · concertina matches the pin', () => {
    expect(current.a).toEqual(golden.a);
  });
  it('B · badge rail matches the pin', () => {
    expect(current.b).toEqual(golden.b);
  });
  it('C · open pages matches the pin', () => {
    expect(current.c).toEqual(golden.c);
  });
  it('node counts stay within the perf envelope (blowup guard)', () => {
    expect(current.a.nodes).toBeLessThan(2000);
    expect(current.b.nodes).toBeLessThan(1000);
    expect(current.c.nodes).toBeLessThan(1000);
  });
});
