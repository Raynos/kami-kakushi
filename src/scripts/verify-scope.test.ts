// The scope filter guards against a FALSE GREEN: a bug that silently drops
// gates would make `npm run verify` pass instantly forever (R3). Semantics
// are asserted on a synthetic roster (asserting the real roster's scope
// labels would be a copied-magic-value change-detector, not a test).
import { describe, expect, it } from 'vitest';
import { gatesForFlags, scopeFlagsFromEnv } from './verify-scope';

const roster = [
  { name: 'c1', scope: 'code' },
  { name: 'c2', scope: 'code' },
  { name: 'd1', scope: 'docs' },
  { name: 'b1', scope: 'both' },
] as const;

const names = (gates: readonly { name: string }[]): string[] => gates.map((g) => g.name);

describe('gatesForFlags', () => {
  it('no flags -> the FULL roster runs, nothing skipped', () => {
    const { run, skipped } = gatesForFlags(roster, { skipCode: false, skipDocs: false });
    expect(names(run)).toEqual(['c1', 'c2', 'd1', 'b1']);
    expect(skipped).toEqual([]);
  });

  it('SKIP_CODE_VERIFY -> code gates skipped; docs AND both still run', () => {
    const { run, skipped } = gatesForFlags(roster, { skipCode: true, skipDocs: false });
    expect(names(run)).toEqual(['d1', 'b1']);
    expect(names(skipped)).toEqual(['c1', 'c2']);
  });

  it('SKIP_DOCS_VERIFY -> docs gates skipped; code AND both still run', () => {
    const { run, skipped } = gatesForFlags(roster, { skipCode: false, skipDocs: true });
    expect(names(run)).toEqual(['c1', 'c2', 'b1']);
    expect(names(skipped)).toEqual(['d1']);
  });

  it("both flags -> everything skipped, 'both' included (a full skip)", () => {
    const { run, skipped } = gatesForFlags(roster, { skipCode: true, skipDocs: true });
    expect(run).toEqual([]);
    expect(names(skipped)).toEqual(['c1', 'c2', 'd1', 'b1']);
  });
});

describe('scopeFlagsFromEnv', () => {
  it("only the literal '1' engages a flag", () => {
    expect(scopeFlagsFromEnv({})).toEqual({ skipCode: false, skipDocs: false });
    expect(scopeFlagsFromEnv({ SKIP_CODE_VERIFY: '1' })).toEqual({
      skipCode: true,
      skipDocs: false,
    });
    expect(scopeFlagsFromEnv({ SKIP_DOCS_VERIFY: '1' })).toEqual({
      skipCode: false,
      skipDocs: true,
    });
    expect(scopeFlagsFromEnv({ SKIP_CODE_VERIFY: 'true', SKIP_DOCS_VERIFY: '0' })).toEqual({
      skipCode: false,
      skipDocs: false,
    });
  });
});
