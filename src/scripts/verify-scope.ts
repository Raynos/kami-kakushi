// verify-scope — pure lane-filtering semantics for the verify gate roster.
//
// Two commit-time convenience flags narrow `pnpm run verify` to the lane a
// commit actually touches (the pre-commit hook passes env straight through):
//   SKIP_CODE_VERIFY=1  -> skip 'code'-scoped gates  (a docs-only commit)
//   SKIP_DOCS_VERIFY=1  -> skip 'docs'-scoped gates  (a pure code commit)
// A 'both'-scoped gate guards a code<->docs invariant (e.g. gen-docs checks
// the src -> docs/content derivation), so it is skipped only when BOTH lanes
// are skipped. No flags -> the full roster, identical to before the flags
// existed. The pre-push hook deliberately IGNORES these flags: a push always
// runs the full roster (.githooks/pre-push), so a lane skipped at commit is
// still verified before it can leave the machine.

export type GateScope = 'code' | 'docs' | 'both';

export interface ScopeFlags {
  skipCode: boolean;
  skipDocs: boolean;
}

export function scopeFlagsFromEnv(
  env: Record<string, string | undefined>,
): ScopeFlags {
  return {
    skipCode: env['SKIP_CODE_VERIFY'] === '1',
    skipDocs: env['SKIP_DOCS_VERIFY'] === '1',
  };
}

export function gatesForFlags<T extends { scope: GateScope }>(
  gates: readonly T[],
  flags: ScopeFlags,
): { run: T[]; skipped: T[] } {
  const skippedScopes = new Set<GateScope>();
  if (flags.skipCode) skippedScopes.add('code');
  if (flags.skipDocs) skippedScopes.add('docs');
  if (flags.skipCode && flags.skipDocs) skippedScopes.add('both');
  const run: T[] = [];
  const skipped: T[] = [];
  for (const g of gates) (skippedScopes.has(g.scope) ? skipped : run).push(g);
  return { run, skipped };
}
