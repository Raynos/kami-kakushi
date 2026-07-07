import { describe, it, expect } from 'vitest';
import { parseNarrative, type RequirementsNode } from './parse';
import { validateNarrative } from './validate';
import { emitRequirements } from './emit';
import { RANKS } from '../../core/content/ranks';

// Fixtures build the md TEXT here, but every EXPECTED value derives from what the
// text says (or from RANKS, the rung source of truth) — no frozen registry copies.

/** One rung block. `ids` controls how many reqs it authors (default 1 — used by the
 *  hard-minimum RED test; pass 3 for a valid list). */
const goodBlock = (rank: string, id = 'do-a-thing', ids: string[] = [id]): string =>
  [
    `## requirements ${rank}`,
    '',
    ...ids.flatMap((rid, i) => [
      `### req ${rid} · count act:farm_paddy ${25 + i}`,
      '',
      'flavor: The rows stand straighter.',
      'drive: farm_paddy',
      '',
    ]),
  ].join('\n');

const allEight = (): string =>
  RANKS.map((r) => {
    const base = `req-${r.id.toLowerCase()}`;
    return goodBlock(r.id, base, [base, `${base}-b`, `${base}-c`]);
  }).join('\n');

describe('requirements grammar (FB-121 / ADR-137) — parse + validate + emit', () => {
  it('parses every spec form of the closed grammar', () => {
    const md = [
      '## requirements R0',
      '',
      '### req a · count kill:boar 2',
      'flavor: f',
      'drive: fight boar',
      '### req b · flag first-fight-survived',
      'flavor: f',
      'drive: face_wolf',
      '### req c · state resource coin >= 100',
      'flavor: f',
      'drive: sell rice',
      '### req d · state banked rice >= 200',
      'flavor: f',
      'drive: deposit rice',
      '### req e · state belonging bedding',
      'flavor: f',
      'drive: buy bedding',
      '### req f · state skill conditioning >= 3',
      'flavor: f',
      'drive: haul_stores',
      '### req g · native estate-u1',
      'flavor: f',
      'drive: buy estate_upgrade',
    ].join('\n');
    const doc = parseNarrative(md, 'x.md');
    const block = doc.blocks[0] as RequirementsNode;
    expect(block.kind).toBe('requirements');
    expect(block.reqs.map((r) => r.spec.type)).toEqual([
      'count',
      'flag',
      'state',
      'state',
      'state',
      'state',
      'state',
    ]);
    expect(block.reqs[0]!.spec).toMatchObject({ token: 'kill:boar', target: 2 });
    expect(block.reqs[6]!.spec).toMatchObject({ pred: { kind: 'native', key: 'estate-u1' } });
  });

  it('rejects a malformed spec, a zero count, and a missing flavor/drive — at the md line', () => {
    expect(() =>
      parseNarrative('## requirements R0\n### req x · count boar 2\nflavor: f\ndrive: d', 'x.md'),
    ).toThrow(/bad req spec/);
    expect(() =>
      parseNarrative(
        '## requirements R0\n### req x · count kill:boar 0\nflavor: f\ndrive: d',
        'x.md',
      ),
    ).toThrow(/count target/);
    expect(() =>
      parseNarrative('## requirements R0\n### req x · flag some-flag\ndrive: d', 'x.md'),
    ).toThrow(/no flavor line/);
    expect(() =>
      parseNarrative('## requirements R0\n### req x · flag some-flag\nflavor: f', 'x.md'),
    ).toThrow(/no drive hint/);
  });

  it('a rung with fewer than 3 requirements is an authoring ERROR (the hard minimum)', () => {
    // human, 2026-07-07: every rung ≥3 requirements — one req = one flavor beat across
    // a whole climb (the R0 lesson). goodBlock authors exactly one ⇒ must go RED.
    const thin = validateNarrative([parseNarrative(goodBlock('R0'), 'x.md')]);
    expect(thin.errors.some((e) => e.includes('hard minimum is 3'))).toBe(true);
    // allEight() authors 3 per rung ⇒ no minimum errors
    const ok = validateNarrative([parseNarrative(allEight(), 'x.md')]);
    expect(ok.errors.filter((e) => e.includes('hard minimum'))).toEqual([]);
  });

  it('validate holds the registry to EXACTLY all eight rungs, no dup lists/ids', () => {
    const complete = validateNarrative([parseNarrative(allEight(), 'x.md')]);
    expect(complete.errors).toEqual([]);
    // one rung missing → one error per absent rung
    const seven = RANKS.slice(0, -1)
      .map((r) => goodBlock(r.id, `req-${r.id.toLowerCase()}`))
      .join('\n');
    const missing = validateNarrative([parseNarrative(seven, 'x.md')]);
    expect(missing.errors.some((e) => e.includes(`missing for ${RANKS.at(-1)!.id}`))).toBe(true);
    // duplicate list + duplicate req id
    const dupList = validateNarrative([
      parseNarrative(allEight() + '\n' + goodBlock('R0', 'other'), 'x.md'),
    ]);
    expect(dupList.errors.some((e) => e.includes('duplicate requirements list'))).toBe(true);
    const dupId = validateNarrative([
      parseNarrative(
        [
          '## requirements R0',
          '### req same · flag a-flag',
          'flavor: f',
          'drive: d',
          '### req same · flag b-flag',
          'flavor: f',
          'drive: d',
        ].join('\n'),
        'x.md',
      ),
    ]);
    expect(dupId.errors.some((e) => e.includes('duplicate req id "same"'))).toBe(true);
  });

  it('emit produces the registry literal with NAMES interpolation resolved', () => {
    const md = [
      '## requirements R0',
      '### req a · flag some-flag',
      'flavor: {elder} counts the rows.',
      'drive: rake_rice',
    ].join('\n');
    const src = emitRequirements(parseNarrative(md, 'x.md'));
    expect(src).toContain('RUNG_REQUIREMENTS');
    expect(src).toContain('${NAMES.elder} counts the rows.');
    expect(src).toContain(`type: 'flag'`);
  });
});
