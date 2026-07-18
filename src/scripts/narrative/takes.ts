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

import {
  NarrativeError,
  type Loc,
  type NarrativeDoc,
  type RungSceneNode,
  type IntroSceneNode,
  type SceneDefNode,
  type DialogueDefNode,
  type AskDefNode,
  type DecisionNode,
  type ProseLine,
  type TopicNode,
} from './parse';
import { emitProseLine, GENERATED, textExpr, withImports } from './emit';

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
  /** The HR-item this bundle awaits ("HR-33"), or "none · <why>" when it awaits nobody. */
  readonly hr: string;
  /** Repo-relative path of the bundle's review doc (the archive-of-record). */
  readonly review?: string;
  /** The agent's pick rationale (the picked take lives in canon). */
  readonly rationale?: string;
  /** Short textual label for the CANON pill (human, 2026-07-07 — the switcher
   *  labels every option, canon included: "Canon — <label>"). */
  readonly canonLabel?: string;
  /** The rung a player FIRST MEETS this diverge's content (FB-307 — the Story
   *  pane groups bundles under `— rung RX —` headers exactly like Variants).
   *  Authored as `rung: R2` in bundle.md; parsed to the bare number. REQUIRED
   *  (FB-312 — the catch-all "other" group is banned): a bundle no rung fits
   *  declares `rung: other · <reason>` instead, and each reason is its own
   *  header. Exactly one of `rung`/`rungReason` is set. */
  readonly rung?: number;
  readonly rungReason?: string;
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
  let cur:
    | { id: string; label: string; meta: Map<string, string>; loc: Loc }
    | undefined;
  let lastMeta: { map: Map<string, string>; key: string } | undefined;

  const flush = (): void => {
    if (!cur) return;
    const brief = cur.meta.get('brief');
    const takeFile = cur.meta.get('file');
    if (!brief)
      throw new NarrativeError(cur.loc, `take "${cur.id}" is missing "brief:"`);
    if (!takeFile)
      throw new NarrativeError(cur.loc, `take "${cur.id}" is missing "file:"`);
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
      if (id)
        throw new NarrativeError(
          loc,
          'a bundle.md holds exactly one `# bundle` heading',
        );
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
      lastMeta.map.set(
        lastMeta.key,
        `${lastMeta.map.get(lastMeta.key)!} ${raw.trim()}`,
      );
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
    throw new NarrativeError(
      { file, line: 1 },
      'missing `# bundle <id> · <title>` heading',
    );
  }
  if (takes.length === 0) {
    throw new NarrativeError(
      { file, line: 1 },
      `bundle "${id}" declares no \`## take\` sections`,
    );
  }
  const review = top.get('review');
  const rationale = top.get('rationale');
  const canonLabel = top.get('canon');
  // 2026-07-13 — every bundle declares the HR-item it waits on ("hr: HR-33"), or says in so
  // many words that it waits on nobody ("hr: none · <why it is kept>"). A DEV toggle the human
  // is meant to judge, with no line in the queue she reads, does not exist as far as she is
  // concerned; and a bundle kept as a REFERENCE after sign-off (hd30-nengu, fb324-rake-cap —
  // both by her own steer) must say so, or it reads as a forgotten one. The `review-link` gate
  // checks the HR- form against review.md; this only enforces that the claim is MADE.
  const hr = top.get('hr');
  if (hr === undefined) {
    throw new NarrativeError(
      { file, line: 1 },
      `bundle "${id}": missing "hr:" — name the review item it awaits ("HR-33"), or "none · <why this bundle is kept>" if it awaits nothing`,
    );
  }
  if (!/^HR-\S+$/.test(hr) && !/^none · .+$/.test(hr)) {
    throw new NarrativeError(
      { file, line: 1 },
      `bundle "${id}": hr must be "HR-<n>" or "none · <reason>" (got "${hr}")`,
    );
  }
  const rungRaw = top.get('rung');
  let rung: number | undefined;
  let rungReason: string | undefined;
  if (rungRaw === undefined) {
    throw new NarrativeError(
      { file, line: 1 },
      `bundle "${id}": missing "rung:" — declare "R<n>", or "other · <reason>" when no rung fits (FB-312: the catch-all group is banned)`,
    );
  }
  const rm = /^R(\d+)$/.exec(rungRaw);
  const om = /^other · (.+)$/.exec(rungRaw);
  if (rm) rung = Number(rm[1]);
  else if (om) rungReason = om[1];
  else {
    throw new NarrativeError(
      { file, line: 1 },
      `bundle "${id}": rung must be "R<n>" or "other · <reason>" (got "${rungRaw}")`,
    );
  }
  return {
    id,
    title,
    hr,
    ...(review !== undefined ? { review } : {}),
    ...(rationale !== undefined ? { rationale } : {}),
    ...(canonLabel !== undefined ? { canonLabel } : {}),
    ...(rung !== undefined ? { rung } : {}),
    ...(rungReason !== undefined ? { rungReason } : {}),
    takes,
  };
}

const str = (s: string): string => JSON.stringify(s);

// ── Step A of the take-system simplification (session-200 brainstorm, human-locked) ─────────
// Every take ALSO compiles to a FLAT contentKey → text map, canonicalized against CANON at
// gen time. The map's keys are the SAME addresses the log persists (`beat.R3.greeting.<id>`,
// `intro.dream.opt.<id>.say`, `dialogue.<def>.<line>`, `flavor.<k>`, …) plus the render-read
// classes (`.label`, `.prompt`, `req-objective.<k>`, `cold-open.<k>`, `intro-title.<sid>`).
// Takes are authored BLIND with their own <!--#slug--> markers, so scene-shaped units map
// POSITIONALLY onto the canon def — here, once, where a mismatch can fail LOUD — and the keys
// carry CANON ids. The prose-only law (a take varies words, never structure) is the HARD GATE:
// a count/shape mismatch REDs the gen with the unit and orphan named. Step B migrates the
// consumers onto this map; the def-shaped fields below then retire.

/** The canon registries a take canonicalizes against, built from the parsed canon docs. */
export interface CanonIndex {
  readonly rung: ReadonlyMap<string, RungSceneNode>;
  readonly intro: ReadonlyMap<string, IntroSceneNode>;
  readonly sceneDef: ReadonlyMap<string, SceneDefNode>;
  readonly dialogue: ReadonlyMap<string, DialogueDefNode>;
  /** everyday asks (FB-415) — label + static answer lines re-voice like dialogue. */
  readonly ask: ReadonlyMap<string, AskDefNode>;
  /** prose block id (`flavor` / `cold-open`) → its canon key set. */
  readonly prose: ReadonlyMap<string, ReadonlySet<string>>;
  /** requirement ids (`### req <id>`) — the req-flavor / req-objective key space. */
  readonly reqIds: ReadonlySet<string>;
}

export function buildCanonIndex(docs: readonly NarrativeDoc[]): CanonIndex {
  const rung = new Map<string, RungSceneNode>();
  const intro = new Map<string, IntroSceneNode>();
  const sceneDef = new Map<string, SceneDefNode>();
  const dialogue = new Map<string, DialogueDefNode>();
  const ask = new Map<string, AskDefNode>();
  const prose = new Map<string, Set<string>>();
  const reqIds = new Set<string>();
  for (const doc of docs) {
    for (const b of doc.blocks) {
      if (b.kind === 'rung') rung.set(b.rankKey, b);
      else if (b.kind === 'scene') intro.set(b.id, b);
      else if (b.kind === 'scene-def') sceneDef.set(b.id, b);
      else if (b.kind === 'dialogue') dialogue.set(b.id, b);
      else if (b.kind === 'ask') ask.set(b.id, b);
      else if (b.kind === 'prose') {
        const set = prose.get(b.id) ?? new Set<string>();
        for (const e of b.entries) set.add(e.key);
        prose.set(b.id, set);
      } else if (b.kind === 'requirements') {
        for (const r of b.reqs) reqIds.add(r.id);
      }
    }
  }
  return { rung, intro, sceneDef, dialogue, ask, prose, reqIds };
}

/** The gate's voice: every refusal names the bundle · take · unit and what mismatched. */
function gateError(loc: Loc, unit: string, msg: string): NarrativeError {
  return new NarrativeError(loc, `prose-only gate — ${unit}: ${msg}`);
}

/** One scene-shaped unit → flat pairs (interactive skeleton, id-stable) + the greeting
 *  SEQUENCE (free length — a narration run's line count is PACING, part of the take's
 *  authored voice; the 2026-07-13 audit found every open bundle varies ONLY here). */
function sceneTextPairs(
  ns: string,
  canon: {
    readonly greeting: readonly ProseLine[];
    readonly topics: readonly TopicNode[];
    readonly decision?: DecisionNode | undefined;
  },
  take: {
    readonly greeting: readonly ProseLine[];
    readonly topics: readonly TopicNode[];
    readonly decision?: DecisionNode | undefined;
  },
  unit: string,
  loc: Loc,
): { pairs: string[]; seq: string[] } {
  const out: string[] = [];
  const pair = (key: string, expr: string): void => {
    out.push(`${str(key)}: ${expr},`);
  };
  // the greeting run — the take's OWN sequence (voice/speaker per line, take length).
  // The log re-voices positionally up to min(canon, take) length; a fresh VN run plays
  // the take's full sequence. Take lines keep their own slugs (blind authorship).
  const seq = [
    `${str(`${ns}.greeting`)}: [`,
    ...take.greeting.map((l) => emitProseLine(l)),
    '],',
  ];
  if (take.topics.length !== canon.topics.length) {
    throw gateError(
      loc,
      unit,
      `canon has ${canon.topics.length} topic(s), the take has ${take.topics.length}`,
    );
  }
  take.topics.forEach((t, i) => {
    const ct = canon.topics[i]!;
    pair(`${ns}.topic.${ct.id}.ask`, textExpr(t.label, t.loc));
    // an answer is a narration RUN like the greeting — free length, take's own voice.
    seq.push(
      `${str(`${ns}.topic.${ct.id}.answer`)}: [`,
      ...t.answer.map(emitProseLine),
      '],',
    );
  });
  const cOpts = canon.decision?.options ?? [];
  const tOpts = take.decision?.options ?? [];
  if (tOpts.length !== cOpts.length) {
    throw gateError(
      loc,
      unit,
      `canon has ${cOpts.length} decision option(s), the take has ${tOpts.length}`,
    );
  }
  if (take.decision && canon.decision) {
    pair(`${ns}.prompt`, textExpr(take.decision.prompt, take.decision.loc));
  }
  tOpts.forEach((o, i) => {
    const co = cOpts[i]!;
    pair(`${ns}.opt.${co.id}.label`, textExpr(o.label, o.loc));
    pair(`${ns}.opt.${co.id}.say`, textExpr(o.say ?? o.label, o.loc));
    if (o.react)
      pair(`${ns}.opt.${co.id}.react`, textExpr(o.react.text, o.react.loc));
    const takeHasBonus = o.bonus !== undefined;
    const canonHasBonus = co.bonus !== undefined;
    if (takeHasBonus !== canonHasBonus) {
      throw gateError(
        loc,
        unit,
        `option "${co.id}": the stat-nudge note exists on ${canonHasBonus ? 'canon' : 'the take'} only — presence must match`,
      );
    }
    if (o.bonus)
      pair(`${ns}.opt.${co.id}.bonus`, textExpr(o.bonus.note, o.loc));
  });
  return { pairs: out, seq };
}

/** The take's flat map + greeting sequences — `text: {…}` / `seq: {…}` source lines. */
function emitTakeText(
  doc: NarrativeDoc,
  canon: CanonIndex,
): { text: string[]; seq: string[] } {
  const out: string[] = [];
  const seqOut: string[] = [];
  const scene = (
    ns: string,
    c: Parameters<typeof sceneTextPairs>[1],
    b: Parameters<typeof sceneTextPairs>[2],
    unit: string,
    loc: Loc,
  ): void => {
    const r = sceneTextPairs(ns, c, b, unit, loc);
    out.push(...r.pairs);
    seqOut.push(...r.seq);
  };
  for (const b of doc.blocks) {
    if (b.kind === 'rung') {
      const c = canon.rung.get(b.rankKey);
      if (!c)
        throw gateError(
          b.loc,
          `rung:${b.rankKey}`,
          'no canon rung beat with this rank',
        );
      scene(`beat.${b.rankKey}`, c, b, `rung:${b.rankKey}`, b.loc);
    } else if (b.kind === 'scene') {
      const c = canon.intro.get(b.id);
      if (!c)
        throw gateError(
          b.loc,
          `intro:${b.id}`,
          'no canon intro scene with this id',
        );
      scene(`intro.${b.id}`, c, b, `intro:${b.id}`, b.loc);
    } else if (b.kind === 'scene-def') {
      const c = canon.sceneDef.get(b.id);
      if (!c)
        throw gateError(
          b.loc,
          `scene:${b.id}`,
          'no canon scene-def with this id',
        );
      scene(`scene.${b.id}`, c, b, `scene:${b.id}`, b.loc);
    } else if (b.kind === 'dialogue') {
      const c = canon.dialogue.get(b.id);
      if (!c)
        throw gateError(
          b.loc,
          `dialogue:${b.id}`,
          'no canon dialogue def with this id',
        );
      // dialogue lines have STABLE canon ids (teach lines); a take re-voices a SUBSET by
      // naming them — an id canon lacks is a typo, not a new line (prose-only).
      for (const l of b.lines) {
        if (!c.lines.some((cl) => cl.id === l.id)) {
          throw gateError(
            b.loc,
            `dialogue:${b.id}`,
            `line "${l.id}" does not exist in canon (canon ids: ${c.lines.map((x) => x.id).join(', ')})`,
          );
        }
        out.push(
          `${str(`dialogue.${b.id}.${l.id}`)}: ${textExpr(l.text, l.loc)},`,
        );
      }
    } else if (b.kind === 'ask') {
      const c = canon.ask.get(b.id);
      if (!c)
        throw gateError(b.loc, `ask:${b.id}`, 'no canon ask with this id');
      // the label is the MC's spoken question — required by the parser on every
      // `## ask`, so a take always re-voices it (`ask.<id>.label`).
      out.push(`${str(`ask.${b.id}.label`)}: ${textExpr(b.label!, b.loc)},`);
      if (c.native !== undefined) {
        // a native-answered canon ask carries no prose — its branch text lives
        // in flavor keys (re-voiced as flavor units); prose here would fork
        // what the game derives (prose-only). The take declares the SAME
        // native key (the parser demands one of native/prose).
        if (b.lines.length > 0) {
          throw gateError(
            b.loc,
            `ask:${b.id}`,
            `canon ask is native ("${c.native}") — answer prose lives in flavor keys, not the ask unit`,
          );
        }
        if (b.native !== c.native) {
          throw gateError(
            b.loc,
            `ask:${b.id}`,
            `native must match canon ("${c.native}", got "${b.native ?? ''}")`,
          );
        }
      } else {
        // static answer lines have STABLE canon ids (the overlay addresses) —
        // a take re-voices a SUBSET by naming them, exactly like dialogue.
        for (const l of b.lines) {
          if (l.id === undefined) {
            throw gateError(
              l.loc,
              `ask:${b.id}`,
              "a take answer line needs the canon line's <!--#slug--> id",
            );
          }
          if (!c.lines.some((cl) => cl.id === l.id)) {
            throw gateError(
              l.loc,
              `ask:${b.id}`,
              `line "${l.id}" does not exist in canon (canon ids: ${c.lines.map((x) => x.id).join(', ')})`,
            );
          }
          out.push(
            `${str(`ask.${b.id}.${l.id}`)}: ${textExpr(l.text, l.loc)},`,
          );
        }
      }
    } else if (b.kind === 'prose') {
      const ns =
        b.id === 'flavor'
          ? 'flavor'
          : b.id === 'req-flavor'
            ? 'requirement'
            : b.id === 'req-objective'
              ? 'req-objective'
              : b.id === 'intro-title'
                ? 'intro-title'
                : 'cold-open';
      for (const e of b.entries) {
        const known =
          b.id === 'req-flavor' || b.id === 'req-objective'
            ? canon.reqIds.has(e.key)
            : b.id === 'intro-title'
              ? canon.intro.has(e.key)
              : (canon.prose.get(b.id)?.has(e.key) ?? false);
        if (!known) {
          throw gateError(
            e.loc,
            `${b.id}:${e.key}`,
            `key "${e.key}" does not exist in canon ${b.id === 'intro-title' ? 'intro scenes' : b.id === 'req-flavor' || b.id === 'req-objective' ? 'requirements' : b.id}`,
          );
        }
        out.push(`${str(`${ns}.${e.key}`)}: ${textExpr(e.text, e.loc)},`);
      }
    }
  }
  return { text: out, seq: seqOut };
}

function emitTake(
  meta: TakeMeta,
  doc: NarrativeDoc,
  canon: CanonIndex,
): string {
  const L: string[] = ['{'];
  L.push(`id: ${str(meta.id)},`);
  L.push(`label: ${str(meta.label)},`);
  L.push(`brief: ${str(meta.brief)},`);
  if (meta.scorecard) L.push(`scorecard: ${str(meta.scorecard)},`);

  // The take's whole runtime shape (steps A+B, session-200): the flat canonicalized map +
  // the narration-run sequences. The hard prose-only gate lives in emitTakeText
  // (interactive skeleton id-stable; narration runs free-length pacing).
  const tt = emitTakeText(doc, canon);
  L.push('text: {');
  L.push(...tt.text);
  L.push('},');
  L.push('seq: {');
  L.push(...tt.seq);
  L.push('},');
  L.push('},');
  return L.join('\n');
}

/** Compile all open bundles into the `src/ui/storyTakes.gen.ts` module source
 *  (unformatted). Zero bundles emits a stable empty registry. */
export function emitStoryTakes(
  bundles: readonly ParsedTakeBundle[],
  canon: CanonIndex,
): string {
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
    L.push(`hr: ${str(b.meta.hr)},`);
    if (b.meta.review) L.push(`review: ${str(b.meta.review)},`);
    if (b.meta.rationale) L.push(`rationale: ${str(b.meta.rationale)},`);
    if (b.meta.canonLabel) L.push(`canonLabel: ${str(b.meta.canonLabel)},`);
    if (b.meta.rung !== undefined) L.push(`rung: ${b.meta.rung},`);
    if (b.meta.rungReason !== undefined)
      L.push(`rungReason: ${str(b.meta.rungReason)},`);
    L.push('takes: [');
    b.meta.takes.forEach((t, i) => L.push(emitTake(t, b.docs[i]!, canon)));
    L.push('],');
    L.push('},');
    return L.join('\n');
  });
  const body =
    `export const STORY_TAKE_BUNDLES: readonly StoryTakeBundle[] = [\n` +
    `${entries.join('\n\n')}\n];`;
  return withImports(
    GENERATED('src/core/content/narrative/takes/', 'storyTakes.ts'),
    body,
    [
      `import type { StoryTakeBundle } from './storyTakes';`,
      `import { COLD_OPEN } from '../core/content/coldOpen';`,
      `import { getDialogueLine } from '../core/content/dialogue';`,
      `import { NAMES } from '../core/content/names';`,
      `import { NPC_NAME } from '../core/content/voices';`,
    ],
  );
}
