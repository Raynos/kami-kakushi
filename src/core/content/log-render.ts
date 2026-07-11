// The log's namespace dispatch — the ONE place a stored log descriptor becomes prose.
//
// WHY THIS MODULE EXISTS (save-format plan, step 1; the human's cycle ruling):
// `log-content.ts` holds hand-written templates and is deliberately a LEAF (it imports only
// `names` + `format`). But most of the log's prose does not live there — it lives in the content
// registries that already own it: a reveal line belongs to its SURFACE, a beat to its SCENE, a
// discovery line to its DISCOVERY. Duplicating that text into `log-content` would be a second
// home for it (TST1) and would drift.
//
// So the dispatch lives HERE, one level up: this module imports `log-content` AND the registries,
// and `codec.ts` / `rewards.ts` call `renderLogLine` from here. `log-content.ts` stays a leaf and
// imports nothing back — no cycle.
//
// The REJECTED alternative was a resolver registry (each content module registering itself into
// `log-content` at module init). It needs no new module, but it makes rehydration ORDER-DEPENDENT:
// if a content module has not been imported at the moment `codec.ts` rehydrates a save, its
// namespace resolves to nothing and the entry falls back SILENTLY to the stale stored text — the
// exact bug this plan exists to kill, made invisible. A static import graph cannot do that.

import { LOG_CONTENT, type LogParams } from './log-content';
import { SURFACES } from './surfaces';
import { DISCOVERIES, discoveryEmitLine } from './discoveries';
import { FLAVOR } from './flavor';

/** A namespace resolver: given the key's tail (everything after the first dot) + params, render.
 *  Returns undefined when the id is unknown to the registry — a content id that src/ has since
 *  renamed. The caller then falls back to the entry's stored text (codec.ts), so an old save
 *  degrades to its frozen prose rather than losing the line. */
type Resolver = (id: string, params: LogParams) => string | undefined;

const surfaceRevealText = (id: string): string | undefined =>
  SURFACES.find((s) => s.id === id)?.revealLine?.text;

const discoveryText = (id: string): string | undefined => {
  const def = DISCOVERIES.find((d) => d.id === id);
  return def ? discoveryEmitLine(def) : undefined;
};

/** A works line's canon is its FLAVOR entry. Deliberately reads FLAVOR (a content leaf) rather
 *  than `works.ts`'s `worksLine()`: works.ts is a REDUCER that imports scenes.ts, and pulling a
 *  reducer in here would risk the very cycle this module exists to avoid. The DEV story-take
 *  override that `worksLine()` layers on applies to FUTURE emissions only (ADR-143 — same
 *  semantics as `discoveryEmitLine`), so canon is the right answer on rehydrate. */
const worksText = (key: string): string | undefined =>
  (FLAVOR as Readonly<Record<string, string>>)[key];

/** namespace → resolver. Each namespace's prose stays in ITS registry — one home (TST1). */
const RESOLVERS: Readonly<Record<string, Resolver>> = {
  reveal: (id) => surfaceRevealText(id),
  discovery: (id) => discoveryText(id),
  works: (key) => worksText(key),
};

/** The namespaces this module can resolve — exported so a test can prove every emitted key
 *  resolves, rather than trusting that it does. */
export const LOG_NAMESPACES: readonly string[] = Object.keys(RESOLVERS);

/**
 * Render a stored log descriptor to prose against the CURRENT src/ content.
 *
 * Resolution order — static registry FIRST, then namespace dispatch. That order matters: the
 * hand-written keys ALREADY contain dots (`combat.win`, `season.reckoned`), so dispatching on the
 * dot first would hijack them. An exact hit in LOG_CONTENT always wins.
 *
 * Throws on a key nothing can resolve. `codec.ts` catches that and keeps the entry's stored text,
 * so a removed contentKey degrades one line instead of nuking a save.
 */
export function renderLogLine(contentKey: string, params: LogParams = {}): string {
  const tmpl = LOG_CONTENT[contentKey];
  if (tmpl !== undefined) return tmpl(params);

  const dot = contentKey.indexOf('.');
  if (dot > 0) {
    const resolve = RESOLVERS[contentKey.slice(0, dot)];
    const text = resolve?.(contentKey.slice(dot + 1), params);
    if (text !== undefined) return text;
  }
  throw new Error(`log-render: unknown contentKey "${contentKey}"`);
}

export type { LogParams };
