// @vitest-environment jsdom
//
// FB-7 balance cockpit (Ph1) — the override mechanism + the pure export-diff builder.
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
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createInitialState, balance, __resetBalanceLevers, BALANCE_CANON } from '../core';
import { makeEnvelope, encodeEnvelope } from '../persistence/codec';
import { resolveCapture, writeCapture } from '../scripts/playtest-inbox';
import {
  createBalanceCockpit,
  buildTuneArtifact,
  mountBalanceCockpit,
  type TuneMeta,
} from './dev-cockpit';

const META: TuneMeta = {
  build: 'v0.3.4 (abc1234, 2026-07-03)',
  seed: 20260626,
  clock: { day: 12, tick: 7 },
  capturedAt: '2026-07-03T18:42:07.000Z',
};

function cockpit() {
  return createBalanceCockpit({ meta: () => META });
}

// Derive lever canons from the source of truth (ADR-086 — never a copied magic number, so a tune to
// RICE_PER_RAKE / EAT_RICE_SATIETY doesn't break these tests).
const RAKE = BALANCE_CANON['RICE_PER_RAKE']!;

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
        '',
        '## Mirrors & re-verify',
        '- run: `npm run gen:docs && npm run verify` (pacing:check is in verify).',
        '- balance-sim gate: `npm run verify:balance && npm run balance:report` — this diff is',
        '  exactly the value change that stales its fingerprint; commit the regenerated report.',
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

  it('a structured map path emits a field-edit line (not `export let`)', () => {
    const md = buildTuneArtifact(
      [{ path: 'ESTATE_BANDS.excellent', canon: 480, current: 960 }],
      META,
    );
    expect(md).toContain('| ESTATE_BANDS.excellent | 480 | 960 | +100% |');
    expect(md).toContain('- `ESTATE_BANDS.excellent`: 480 → 960');
    expect(md).not.toContain('export let ESTATE_BANDS'); // structured ≠ a scalar binding
  });

  it('a rung-threshold tune adds the ranks.ts mirror bullet; a scalar does not', () => {
    const withRung = buildTuneArtifact(
      [{ path: 'RUNG_METER_THRESHOLDS.R7', canon: 3400, current: 4000 }],
      META,
    );
    expect(withRung).toContain('src/core/content/ranks.ts');
    const scalar = buildTuneArtifact([{ path: 'RICE_PER_RAKE', canon: 3, current: 4 }], META);
    expect(scalar).not.toContain('src/core/content/ranks.ts');
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
    expect(balance.RICE_PER_RAKE).toBe(RAKE);

    c.set('RICE_PER_RAKE', 10);
    expect(c.read('RICE_PER_RAKE')).toBe(10);
    expect(balance.RICE_PER_RAKE).toBe(10); // the module binding moved — importers see it
    expect(c.canon('RICE_PER_RAKE')).toBe(RAKE); // canon is preserved for the readout
    expect(c.touched()).toEqual([{ path: 'RICE_PER_RAKE', canon: RAKE, current: 10 }]);

    c.reset();
    expect(balance.RICE_PER_RAKE).toBe(RAKE);
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

  it('exportPayload shapes a colon-free session stamp + a machine-readable sidecar', () => {
    const c = cockpit();
    c.set('RICE_PER_RAKE', 5);
    const p = c.exportPayload('felt fast');
    expect(p.session).toBe('2026-07-03T18-42-07.000Z-balance-tune'); // colons stripped (SESSION_RE)
    expect(p.session).not.toContain(':');
    expect(p.metadataName).toBe('2026-07-03T18-42-07.000Z-balance-tune.json');
    expect(p.markdown).toContain(`| RICE_PER_RAKE | ${RAKE} | 5 |`);
    const meta = JSON.parse(p.metadata) as { kind: string; touched: { path: string }[] };
    expect(meta.kind).toBe('balance-tune');
    expect(meta.touched).toEqual([{ path: 'RICE_PER_RAKE', canon: RAKE, current: 5 }]);
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

describe('export transport — rides the F3 inbox endpoint verbatim (Ph3)', () => {
  it('the payload resolves + writes through the REAL F3 handler to a `<stamp>-balance-tune.md`', () => {
    const c = cockpit();
    c.set('RICE_PER_RAKE', 5);
    c.set('ESTATE_BANDS.excellent', 960);
    const p = c.exportPayload('felt off');
    // shape the exact FB-3 CaptureBody the mount POSTs, and run it through the real handler.
    const body = {
      session: p.session,
      header: p.markdown,
      entry: '',
      metadataName: p.metadataName,
      metadata: p.metadata,
    };
    const dir = mkdtempSync(join(tmpdir(), 'kami-tune-'));
    try {
      const resolved = resolveCapture(body, dir);
      expect(resolved.ok).toBe(true); // the colon-free stamp passes SESSION_RE (no handler change)
      if (!resolved.ok) return;
      writeCapture(resolved, dir);
      const md = readFileSync(join(dir, `${p.session}.md`), 'utf-8');
      expect(md).toContain('kind: balance-tune');
      expect(md).toContain(`| RICE_PER_RAKE | ${RAKE} | 5 |`);
      expect(md).toContain(
        `- \`export let RICE_PER_RAKE = ${RAKE};\` → \`export let RICE_PER_RAKE = 5;\``,
      );
      expect(md).toContain('- `ESTATE_BANDS.excellent`: 480 → 960');
      // the machine sidecar landed too
      const json = readFileSync(join(dir, p.session, p.metadataName), 'utf-8');
      expect(JSON.parse(json).kind).toBe('balance-tune');
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});

describe('export transport — mount POST + fallback (Ph3)', () => {
  it('POSTs the CaptureBody to the inbox endpoint when a lever is touched', async () => {
    document.body.innerHTML = '';
    const pane = document.createElement('div');
    document.body.append(pane);
    const c = cockpit();
    c.set('RICE_PER_RAKE', 9);
    let posted: { url: string; body: string } | null = null;
    mountBalanceCockpit(pane, c, {
      post: async (url, body) => {
        posted = { url, body };
        return true;
      },
    });
    const btn = [...pane.querySelectorAll('button')].find((b) =>
      /Export tune/.test(b.textContent ?? ''),
    )!;
    btn.click();
    await Promise.resolve();
    await Promise.resolve();
    expect(posted!.url).toBe('/__playtest-capture');
    const parsed = JSON.parse(posted!.body) as { session: string; header: string; entry: string };
    expect(parsed.session).toContain('-balance-tune');
    expect(parsed.entry).toBe('');
    expect(parsed.header).toContain(`| RICE_PER_RAKE | ${RAKE} | 9 |`);
  });

  it('falls back to a file download when the inbox POST fails', async () => {
    document.body.innerHTML = '';
    const pane = document.createElement('div');
    document.body.append(pane);
    const c = cockpit();
    c.set('RICE_PER_RAKE', 9);
    const downloads: string[] = [];
    const customDoc = {
      createElement: (tag: string) => {
        const node = document.createElement(tag);
        if (tag === 'a') node.click = () => downloads.push((node as HTMLAnchorElement).download);
        return node;
      },
      body: document.body,
    } as unknown as Document;
    const origCreate = URL.createObjectURL;
    const origRevoke = URL.revokeObjectURL;
    URL.createObjectURL = () => 'blob:test';
    URL.revokeObjectURL = () => {};
    try {
      mountBalanceCockpit(pane, c, { post: async () => false, doc: customDoc });
      const btn = [...pane.querySelectorAll('button')].find((b) =>
        /Export tune/.test(b.textContent ?? ''),
      )!;
      btn.click();
      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();
      expect(downloads.some((d) => d.endsWith('-balance-tune.md'))).toBe(true);
      // flush downloadFallback's deferred `setTimeout(revokeObjectURL, 0)` while the stub is still
      // installed, so it doesn't fire against a restored (jsdom-undefined) revokeObjectURL.
      await new Promise((r) => setTimeout(r, 5));
    } finally {
      URL.createObjectURL = origCreate;
      URL.revokeObjectURL = origRevoke;
    }
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
