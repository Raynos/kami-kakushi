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
import { sceneById } from './scenes';
import { RUNG_BEATS, rungOption, type RungScene } from './rungBeats';
import type { RankId } from './ranks';

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

// ── the VN payload (scenes AND rung beats share `RungScene`, so one reader serves both) ──────
// A line inside a scene is addressed as `<part>` after the scene id:
//   greeting.<i>          the i-th greeting line
//   opt.<optionId>.say    the MC's reply        · opt.<optionId>.react  the speaker's reaction
//   opt.<optionId>.bonus  the rare stat-nudge note
// The INDEX in `greeting.<i>` is the one address that is positional rather than id-keyed —
// re-ordering a scene's greeting lines in the narrative .md therefore re-points an old save's
// line. That is a content RESTRUCTURE (README: "Schema growth, rung 2"), and the orphan sensor
// cannot see it because the index still resolves. Named ids would be immune; the narrative
// grammar does not give greeting lines ids today, so this is a KNOWN limit, recorded in the ADR.
function vnText(scene: RungScene, part: string): string | undefined {
  const greeting = part.match(/^greeting\.(\d+)$/);
  if (greeting) return scene.greeting[Number(greeting[1])]?.text;

  const opt = part.match(/^opt\.(.+)\.(say|react|bonus)$/);
  if (opt) {
    const o = rungOption(scene, opt[1]!);
    if (!o) return undefined;
    if (opt[2] === 'say') return o.say;
    if (opt[2] === 'react') return o.react;
    return o.statBonus?.note;
  }
  return undefined;
}

const sceneText = (tail: string): string | undefined => {
  const dot = tail.indexOf('.');
  if (dot <= 0) return undefined;
  const def = sceneById(tail.slice(0, dot));
  return def ? vnText(def.scene, tail.slice(dot + 1)) : undefined;
};

const beatText = (tail: string): string | undefined => {
  const dot = tail.indexOf('.');
  if (dot <= 0) return undefined;
  const beat = RUNG_BEATS[tail.slice(0, dot) as RankId];
  return beat ? vnText(beat, tail.slice(dot + 1)) : undefined;
};

/** namespace → resolver. Each namespace's prose stays in ITS registry — one home (TST1). */
const RESOLVERS: Readonly<Record<string, Resolver>> = {
  reveal: (id) => surfaceRevealText(id),
  discovery: (id) => discoveryText(id),
  works: (key) => worksText(key),
  flavor: (key) => (FLAVOR as Readonly<Record<string, string>>)[key],
  scene: (tail) => sceneText(tail),
  beat: (tail) => beatText(tail),
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
