// @vitest-environment jsdom
//
// F7 balance cockpit (Ph1) — the override mechanism + the pure export-diff builder.
//
// RED-able by construction:
//  · the artifact BYTES test pins the exact `old → new` apply line + table row — a builder that
//    dropped a field, mis-rounded Δ%, or reordered the frontmatter flips red.
//  · the LIVE-BINDING test proves an override propagates to a named importer (the whole point of the
//    `const`→`let` conversion) — if `set` failed to reassign the module binding, `balance.X` stays
//    canon and the assert flips red.
//  · the SAVE-NON-LEAK test proves overrides live in module bindings, never the save envelope — if a
//    future refactor stashed overrides in GameState, the re-encoded envelope would differ and flip red.
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialState, balance, __resetBalanceLevers, BALANCE_CANON } from '../core';
import { makeEnvelope, encodeEnvelope } from '../persistence/codec';
import { createBalanceCockpit, buildTuneArtifact, type TuneMeta } from './dev-cockpit';

const META: TuneMeta = {
  build: 'v0.3.4 (abc1234, 2026-07-03)',
  seed: 20260626,
  clock: { day: 12, tick: 7 },
  capturedAt: '2026-07-03T18:42:07.000Z',
};

function cockpit() {
  return createBalanceCockpit({ meta: () => META });
}

// The setter mutates MODULE-GLOBAL bindings — reset to canon after every case so no test leaks an
// override into the next (the cockpit's own afterEach discipline, §8 determinism note).
afterEach(() => __resetBalanceLevers());

describe('buildTuneArtifact — the pure export-diff builder', () => {
  it('emits the exact frontmatter + touched table + old→new apply lines (bytes)', () => {
    const md = buildTuneArtifact([{ path: 'EAT_RICE_SATIETY', canon: 30, current: 36 }], META);
    const expected =
      [
        '---',
        'kind: balance-tune',
        'captured_at: 2026-07-03T18:42:07.000Z',
        'build: v0.3.4 (abc1234, 2026-07-03)',
        'seed: 20260626',
        'clock: { day: 12, tick: 7 }',
        'session_url: /?bal.EAT_RICE_SATIETY=36',
        '---',
        '## Touched levers',
        '| path | canon | tuned | Δ |',
        '|---|---|---|---|',
        '| EAT_RICE_SATIETY | 30 | 36 | +20% |',
        '',
        '## Apply — src/core/content/balance.ts (old → new, exact)',
        '- `export let EAT_RICE_SATIETY = 30;` → `export let EAT_RICE_SATIETY = 36;`',
      ].join('\n') + '\n';
    expect(md).toBe(expected);
  });

  it('rounds Δ% signed, and multi-lever rows carry each exact apply line', () => {
    const md = buildTuneArtifact(
      [
        { path: 'RICE_PER_RAKE', canon: 3, current: 2 }, // −33%
        { path: 'EAT_RICE_SATIETY', canon: 30, current: 45 }, // +50%
      ],
      META,
    );
    expect(md).toContain('| RICE_PER_RAKE | 3 | 2 | −33% |');
    expect(md).toContain('| EAT_RICE_SATIETY | 30 | 45 | +50% |');
    expect(md).toContain('- `export let RICE_PER_RAKE = 3;` → `export let RICE_PER_RAKE = 2;`');
    expect(md).toContain('session_url: /?bal.RICE_PER_RAKE=2&bal.EAT_RICE_SATIETY=45');
  });

  it('appends an optional note section only when non-empty', () => {
    const bare = buildTuneArtifact([{ path: 'RICE_PER_RAKE', canon: 3, current: 4 }], META, '   ');
    expect(bare).not.toContain('## Note');
    const noted = buildTuneArtifact(
      [{ path: 'RICE_PER_RAKE', canon: 3, current: 4 }],
      META,
      'rice felt too fast',
    );
    expect(noted).toContain('## Note\nrice felt too fast\n');
  });
});

describe('cockpit controller — set / read / canon / touched / reset', () => {
  it('an override propagates to a named importer (live binding), touched() lists it', () => {
    const c = cockpit();
    expect(c.touched()).toEqual([]); // clean at canon
    expect(balance.RICE_PER_RAKE).toBe(3);

    c.set('RICE_PER_RAKE', 10);
    expect(c.read('RICE_PER_RAKE')).toBe(10);
    expect(balance.RICE_PER_RAKE).toBe(10); // the module binding moved — importers see it
    expect(c.canon('RICE_PER_RAKE')).toBe(3); // canon is preserved for the readout
    expect(c.touched()).toEqual([{ path: 'RICE_PER_RAKE', canon: 3, current: 10 }]);

    c.reset();
    expect(balance.RICE_PER_RAKE).toBe(3);
    expect(c.touched()).toEqual([]);
  });

  it('notifies subscribers on every set and reset (the panel stays truthful)', () => {
    const c = cockpit();
    let n = 0;
    c.subscribe(() => n++);
    c.set('RICE_PER_RAKE', 7);
    c.set('EAT_RICE_SATIETY', 40);
    c.reset();
    expect(n).toBe(3);
  });

  it('exportMarkdown renders only the touched levers', () => {
    const c = cockpit();
    c.set('EAT_RICE_SATIETY', 36);
    const md = c.exportMarkdown();
    expect(md).toContain('| EAT_RICE_SATIETY | 30 | 36 | +20% |');
    expect(md).not.toContain('RICE_PER_RAKE'); // untouched → absent
  });
});

describe('the full §2 lever set — registry / CANON / switches in lockstep', () => {
  it('the registry paths and BALANCE_CANON keys are identical sets', () => {
    const c = cockpit();
    const registry = c.levers.map((l) => l.path).sort();
    const canon = Object.keys(BALANCE_CANON).sort();
    expect(registry).toEqual(canon); // a path in one but not the other → red
  });

  it('every registered lever round-trips set→read→reset (both switches wired; not frozen)', () => {
    const c = cockpit();
    // set every lever to a distinct non-canon probe; read must reflect it (proves set+read wired,
    // and that a structured map is not Object.frozen — a frozen map would no-op the set).
    for (const lever of c.levers) {
      const probe = c.canon(lever.path) + 1;
      c.set(lever.path, probe);
      expect(c.read(lever.path)).toBe(probe);
    }
    expect(c.touched().length).toBe(c.levers.length); // all dirty now
    c.reset();
    for (const lever of c.levers) {
      expect(c.read(lever.path)).toBe(BALANCE_CANON[lever.path]); // reset restored canon from CANON
    }
    expect(c.touched()).toEqual([]);
  });

  it('a structured map path overrides the live namespace value (in-place mutation)', () => {
    const c = cockpit();
    expect(balance.ESTATE_BANDS.excellent).toBe(BALANCE_CANON['ESTATE_BANDS.excellent']);
    c.set('ESTATE_BANDS.excellent', 960);
    expect(balance.ESTATE_BANDS.excellent).toBe(960); // importers reading the property see it live
    c.set('RICE_SELL_PRICE_BY_SEASON.spring', 9);
    expect(balance.riceSellPrice('spring')).toBe(9); // the helper reads the mutated table
    c.set('STANCE_MODS.jodan.atkMult', 2);
    expect(balance.STANCE_MODS.jodan.atkMult).toBe(2);
    c.reset();
    expect(balance.ESTATE_BANDS.excellent).toBe(BALANCE_CANON['ESTATE_BANDS.excellent']);
    expect(balance.STANCE_MODS.jodan.atkMult).toBe(BALANCE_CANON['STANCE_MODS.jodan.atkMult']);
  });
});

describe('overrides never leak into the save envelope', () => {
  it('encoding is byte-identical with an override applied — the envelope has nowhere for balance', () => {
    const c = cockpit();
    const state = createInitialState(1);
    const before = encodeEnvelope(makeEnvelope(state, 1, 0));

    c.set('EAT_RICE_SATIETY', 99);
    const after = encodeEnvelope(makeEnvelope(state, 1, 0));

    expect(after).toBe(before); // the override touched no GameState field
    const parsed = JSON.parse(after) as { state: Record<string, unknown> };
    expect('balance' in parsed.state).toBe(false); // the schema simply has no balance slot
  });
});
