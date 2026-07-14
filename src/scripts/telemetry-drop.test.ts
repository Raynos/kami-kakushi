import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  mkdtempSync,
  mkdirSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { resolveDrop, sweepTelemetryDir } from './telemetry-drop';

// Sweep proofs. This module deletes files, so the tests that matter are the ones that prove it
// does NOT: README.md, non-.md entries, unparseable text, and clean runs all survive.

const clean = (min: number) =>
  `run 20260710-1 (v0.3.9 abc) — untainted\nstarted x · seed 1\n\nΣ attended ${min.toFixed(1)} min · active ${min.toFixed(1)} / idle 0.0\n`;
const tainted = `run 20260710-2 (v0.3.9 abc) — TAINTED: speed>1\nstarted x · seed 1\n\nΣ attended 45.0 min · active 45.0 / idle 0.0\n`;

let dir: string;

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), 'kami-telemetry-'));
});
afterEach(() => {
  rmSync(dir, { recursive: true, force: true });
});

const names = () => readdirSync(dir).sort();

describe('sweepTelemetryDir', () => {
  it('drops tainted and too-short reports, keeps the usable one', () => {
    writeFileSync(join(dir, 'keep.md'), clean(49.2));
    writeFileSync(join(dir, 'short.md'), clean(0.3));
    writeFileSync(join(dir, 'tainted.md'), tainted);

    expect([...sweepTelemetryDir(dir)].sort()).toEqual([
      'short.md',
      'tainted.md',
    ]);
    expect(names()).toEqual(['keep.md']);
  });

  it('never touches README.md, non-markdown files, or subdirectories', () => {
    writeFileSync(
      join(dir, 'README.md'),
      'the committed contract, not a report\n',
    );
    writeFileSync(join(dir, '.gitignore'), '*.md\n');
    mkdirSync(join(dir, 'nested'));

    expect(sweepTelemetryDir(dir)).toEqual([]);
    expect(names()).toEqual(['.gitignore', 'README.md', 'nested']);
  });

  it('fails open: an unreadable-format report is kept, not deleted', () => {
    writeFileSync(join(dir, 'weird.md'), 'not a report at all\n');
    expect(sweepTelemetryDir(dir)).toEqual([]);
    expect(names()).toEqual(['weird.md']);
  });

  it('returns empty for a missing directory rather than throwing', () => {
    expect(sweepTelemetryDir(join(dir, 'absent'))).toEqual([]);
  });
});

describe('resolveDrop', () => {
  it('still jails traversal in the runId', () => {
    expect(resolveDrop({ runId: '../escape', report: 'x' }, dir)).toMatchObject(
      { ok: false },
    );
  });
});
