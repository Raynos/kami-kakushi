// Story take-sets (ADR-139) — parse a bundle's meta + alternate-take docs and
// emit the DEV-only `src/ui/storyTakes.gen.ts` registry.
//
// A "bundle" is one open narrative diverge: a directory under
// `src/core/content/narrative/takes/<bundle-id>/` holding a `bundle.md` (meta:
// title, per-take label/brief/scorecard, pick rationale) plus one `.md` per
// ALTERNATE take in the standard FB-5 narrative grammar (parsed by
// `parseNarrative`, emitted by the same per-scene emitters as canon). The
// PICKED take is never here — it lives in canon; these are the not-picked
// takes the human compares in the DEV story surfaces until sign-off, then the
// directory is pruned (the review doc is the archive).
//
// Emits DATA ONLY, like emit.ts; the types + helpers live hand-written in
// `src/ui/storyTakes.ts`, which re-exports the generated registry.

import { NarrativeError, type Loc, type NarrativeDoc } from './parse';
import {
  emitDialogueDef,
  emitIntroScene,
  emitRungScene,
  GENERATED,
  textExpr,
  withImports,
} from './emit';

export interface TakeMeta {
  readonly id: string;
  readonly label: string;
  readonly brief: string;
  readonly scorecard?: string;
  /** The take's narrative file, relative to the bundle dir (e.g. `take-b.md`). */
  readonly file: string;
  readonly loc: Loc;
}

export interface BundleMeta {
  readonly id: string;
  readonly title: string;
  /** Repo-relative path of the bundle's review doc (the archive-of-record). */
  readonly review?: string;
  /** The agent's pick rationale (the picked take lives in canon). */
  readonly rationale?: string;
  readonly takes: readonly TakeMeta[];
}

export interface ParsedTakeBundle {
  readonly meta: BundleMeta;
  /** Parsed narrative docs, index-aligned with `meta.takes`. */
  readonly docs: readonly NarrativeDoc[];
}

const BUNDLE_H = /^# bundle ([a-z0-9-]+) · (.+)$/;
const TAKE_H = /^## take ([a-z0-9-]+) · (.+)$/;
const META_LINE = /^([a-z]+): (.*)$/;

/** Parse a `bundle.md` — the bundle heading, top meta, and `## take` sections. */
export function parseBundleMeta(source: string, file: string): BundleMeta {
  const lines = source.split('\n');
  let id: string | undefined;
  let title: string | undefined;
  const top = new Map<string, string>();
  const takes: TakeMeta[] = [];
  let cur: { id: string; label: string; meta: Map<string, string>; loc: Loc } | undefined;
  let lastMeta: { map: Map<string, string>; key: string } | undefined;

  const flush = (): void => {
    if (!cur) return;
    const brief = cur.meta.get('brief');
    const takeFile = cur.meta.get('file');
    if (!brief) throw new NarrativeError(cur.loc, `take "${cur.id}" is missing "brief:"`);
    if (!takeFile) throw new NarrativeError(cur.loc, `take "${cur.id}" is missing "file:"`);
    const scorecard = cur.meta.get('scorecard');
    takes.push({
      id: cur.id,
      label: cur.label,
      brief,
      ...(scorecard !== undefined ? { scorecard } : {}),
      file: takeFile,
      loc: cur.loc,
    });
    cur = undefined;
  };

  let inComment = false;
  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i]!;
    const loc: Loc = { file, line: i + 1 };
    const t = raw.trim();
    if (inComment) {
      if (t.endsWith('-->')) inComment = false;
      continue;
    }
    if (t.startsWith('<!--')) {
      if (!t.endsWith('-->')) inComment = true;
      lastMeta = undefined;
      continue;
    }
    if (t === '') {
      lastMeta = undefined;
      continue;
    }
    const bh = BUNDLE_H.exec(raw);
    if (bh) {
      if (id) throw new NarrativeError(loc, 'a bundle.md holds exactly one `# bundle` heading');
      [, id, title] = bh as unknown as [string, string, string];
      continue;
    }
    const th = TAKE_H.exec(raw);
    if (th) {
      flush();
      cur = { id: th[1]!, label: th[2]!, meta: new Map(), loc };
      lastMeta = undefined;
      continue;
    }
    if (/^ {2}\S/.test(raw) && lastMeta) {
      lastMeta.map.set(lastMeta.key, `${lastMeta.map.get(lastMeta.key)!} ${raw.trim()}`);
      continue;
    }
    const ml = META_LINE.exec(raw);
    if (ml) {
      const map = cur ? cur.meta : top;
      map.set(ml[1]!, ml[2]!);
      lastMeta = { map, key: ml[1]! };
      continue;
    }
    throw new NarrativeError(loc, `unrecognised bundle.md line: "${raw}"`);
  }
  flush();
  if (!id || !title) {
    throw new NarrativeError({ file, line: 1 }, 'missing `# bundle <id> · <title>` heading');
  }
  if (takes.length === 0) {
    throw new NarrativeError({ file, line: 1 }, `bundle "${id}" declares no \`## take\` sections`);
  }
  const review = top.get('review');
  const rationale = top.get('rationale');
  return {
    id,
    title,
    ...(review !== undefined ? { review } : {}),
    ...(rationale !== undefined ? { rationale } : {}),
    takes,
  };
}

const str = (s: string): string => JSON.stringify(s);

function emitTake(meta: TakeMeta, doc: NarrativeDoc): string {
  const L: string[] = ['{'];
  L.push(`id: ${str(meta.id)},`);
  L.push(`label: ${str(meta.label)},`);
  L.push(`brief: ${str(meta.brief)},`);
  if (meta.scorecard) L.push(`scorecard: ${str(meta.scorecard)},`);

  const rungs = doc.blocks.filter((b) => b.kind === 'rung');
  if (rungs.length) {
    L.push('rungBeats: {');
    for (const s of rungs) L.push(emitRungScene(s));
    L.push('},');
  }
  const scenes = doc.blocks.filter((b) => b.kind === 'scene');
  if (scenes.length) {
    L.push('introScenes: [');
    for (const s of scenes) L.push(emitIntroScene(s));
    L.push('],');
  }
  const dialogues = doc.blocks.filter((b) => b.kind === 'dialogue');
  if (dialogues.length) {
    L.push('dialogues: [');
    for (const d of dialogues) L.push(emitDialogueDef(d));
    L.push('],');
  }
  const prose = doc.blocks.find((b) => b.kind === 'prose');
  if (prose) {
    L.push('coldOpen: {');
    for (const e of prose.entries) L.push(`${e.key}: ${textExpr(e.text, e.loc)},`);
    L.push('},');
  }
  L.push('},');
  return L.join('\n');
}

/** Compile all open bundles into the `src/ui/storyTakes.gen.ts` module source
 *  (unformatted). Zero bundles emits a stable empty registry. */
export function emitStoryTakes(bundles: readonly ParsedTakeBundle[]): string {
  const entries = bundles.map((b) => {
    if (b.meta.takes.length !== b.docs.length) {
      throw new NarrativeError(
        { file: `narrative/takes/${b.meta.id}/bundle.md`, line: 1 },
        `bundle "${b.meta.id}": takes/docs mismatch (${b.meta.takes.length} vs ${b.docs.length})`,
      );
    }
    const L: string[] = ['{'];
    L.push(`id: ${str(b.meta.id)},`);
    L.push(`title: ${str(b.meta.title)},`);
    if (b.meta.review) L.push(`review: ${str(b.meta.review)},`);
    if (b.meta.rationale) L.push(`rationale: ${str(b.meta.rationale)},`);
    L.push('takes: [');
    b.meta.takes.forEach((t, i) => L.push(emitTake(t, b.docs[i]!)));
    L.push('],');
    L.push('},');
    return L.join('\n');
  });
  const body =
    `export const STORY_TAKE_BUNDLES: readonly StoryTakeBundle[] = [\n` +
    `${entries.join('\n\n')}\n];`;
  return withImports(GENERATED('src/core/content/narrative/takes/', 'storyTakes.ts'), body, [
    `import type { StoryTakeBundle } from './storyTakes';`,
    `import { COLD_OPEN } from '../core/content/coldOpen';`,
    `import { getDialogueLine } from '../core/content/dialogue';`,
    `import { NAMES } from '../core/content/names';`,
    `import { NPC_NAME } from '../core/content/voices';`,
  ]);
}
