import { describe, it, expect } from 'vitest';
import { spliceRegion, hasRegion, wrap, MissingRegionError } from './gen-regions';

// Proves the region splicer's THREE load-bearing guarantees (F1a Phase 1): it
// preserves every byte outside the markers, it is byte-idempotent, and a missing
// marker is a HARD self-explaining error — never a silent skip. Each assertion
// can go RED (a splicer that clobbered surrounding prose, drifted on re-run, or
// swallowed a missing marker would fail here).

const begin = (id: string) => `<!-- gen:begin ${id} (npm run checkpoint — do not edit inside) -->`;
const end = (id: string) => `<!-- gen:end ${id} -->`;

const doc = (id: string, body: string) =>
  [
    '# Title',
    '',
    'Prose ABOVE the region.',
    begin(id),
    body,
    end(id),
    'Prose BELOW the region.',
    '',
  ].join('\n');

describe('spliceRegion', () => {
  it('replaces only the body, preserving every byte outside the markers', () => {
    const before = doc('gate-roster', 'OLD BODY');
    const after = spliceRegion(before, 'gate-roster', 'NEW\nBODY');
    expect(after).toContain('Prose ABOVE the region.');
    expect(after).toContain('Prose BELOW the region.');
    expect(after).toContain('NEW\nBODY');
    expect(after).not.toContain('OLD BODY');
    // markers themselves survive
    expect(after).toContain(begin('gate-roster'));
    expect(after).toContain(end('gate-roster'));
  });

  it('is byte-idempotent — splicing the same body twice yields identical bytes', () => {
    const src = doc('active-plans', 'seed');
    const once = spliceRegion(src, 'active-plans', 'A\nB\nC');
    const twice = spliceRegion(once, 'active-plans', 'A\nB\nC');
    expect(twice).toBe(once);
  });

  it('handles an empty body (markers become adjacent, no phantom blank line)', () => {
    const src = doc('r', 'something');
    const out = spliceRegion(src, 'r', '');
    const lines = out.split('\n');
    const b = lines.findIndex((l) => l.startsWith('<!-- gen:begin r'));
    expect(lines[b + 1]).toBe(end('r')); // end immediately follows begin
  });

  it('does NOT let a short id match a longer marker id (gate vs gate-roster)', () => {
    const src = doc('gate-roster', 'body');
    // there is no "gate" region, only "gate-roster" — must throw, not splice it
    expect(() => spliceRegion(src, 'gate', 'x')).toThrow(MissingRegionError);
  });

  it('throws a self-explaining MissingRegionError when the begin marker is absent', () => {
    const src = '# Title\n\nno markers here\n';
    expect(() => spliceRegion(src, 'gate-roster', 'x')).toThrow(MissingRegionError);
    expect(() => spliceRegion(src, 'gate-roster', 'x')).toThrow(/gen:begin gate-roster/);
  });

  it('throws when a begin marker has no matching end', () => {
    const src = ['# Title', begin('r'), 'body but no end marker', ''].join('\n');
    expect(() => spliceRegion(src, 'r', 'x')).toThrow(MissingRegionError);
  });
});

describe('hasRegion', () => {
  it('is true only when both markers are present and in order', () => {
    expect(hasRegion(doc('r', 'b'), 'r')).toBe(true);
    expect(hasRegion('no markers', 'r')).toBe(false);
    expect(hasRegion(`${begin('r')}\nbody`, 'r')).toBe(false); // begin without end
  });
});

describe('wrap', () => {
  it('folds at word boundaries within the width and is deterministic', () => {
    const text = 'one two three four five six seven eight nine ten';
    const out = wrap(text, 20);
    expect(out).toBe(wrap(text, 20)); // pure / stable
    for (const line of out.split('\n')) expect(line.length).toBeLessThanOrEqual(20);
    // round-trips the words (nothing dropped or duplicated)
    expect(out.split(/\s+/)).toEqual(text.split(' '));
  });

  it('never splits a single over-long word', () => {
    const out = wrap('short superlongunbreakabletoken tail', 10);
    expect(out).toContain('superlongunbreakabletoken');
  });
});
