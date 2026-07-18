// t0-story.md emitter (FB-5 Ph4) — the one-page compiled READING script.
//
// The authoring files are already readable; this renders them as ONE page in
// play order — cold open → the three intro scenes → the R1…R7 rung beats —
// with rank titles pulled from RANKS and every choice inline, its effect
// annotations as small print. Written by gen-narrative beside the *.gen.ts
// modules and drift-checked the same way. This is the R8 "how to look" pointer.

import { RANKS } from '../../core/content/ranks';
import { NAMES } from '../../core/content/names';
import { parseSceneTrigger } from './parse';
import type {
  IntroSceneNode,
  NarrativeDoc,
  OptionNode,
  ProseLine,
  RungSceneNode,
  SceneDefNode,
  TopicNode,
} from './parse';

const RANK_BY_ID = new Map<string, (typeof RANKS)[number]>(
  RANKS.map((r) => [r.id, r]),
);

/** Resolve `{key}` interpolations + `@…` reuse refs into plain reading text. */
function makeResolver(docs: readonly NarrativeDoc[]): (text: string) => string {
  const coldOpen = new Map<string, string>();
  const dialogue = new Map<string, string>();
  for (const doc of docs) {
    for (const b of doc.blocks) {
      if (b.kind === 'prose')
        for (const e of b.entries) coldOpen.set(e.key, e.text);
      if (b.kind === 'dialogue') {
        for (const l of b.lines) dialogue.set(`${b.id}/${l.id}`, l.text);
      }
    }
  }
  const interpolate = (text: string): string =>
    text.replaceAll(/\{([a-zA-Z]+)\}/g, (whole, key: string) =>
      key in NAMES ? NAMES[key as keyof typeof NAMES] : whole,
    );
  return (text: string): string => {
    const cold = /^@cold-open\.([a-zA-Z]+)$/.exec(text);
    if (cold) return interpolate(coldOpen.get(cold[1]!) ?? text);
    const dlg = /^@dialogue\.(.+)$/.exec(text);
    if (dlg) return interpolate(dialogue.get(dlg[1]!) ?? text);
    return interpolate(text);
  };
}

type Resolver = (text: string) => string;

function proseLines(lines: readonly ProseLine[], resolve: Resolver): string[] {
  const out: string[] = [];
  for (const line of lines) {
    if (line.kind === 'narr') out.push(`> ${resolve(line.text)}`, '');
    else out.push(`**${line.speaker}:** ${resolve(line.text)}`, '');
  }
  return out;
}

function topicLines(t: TopicNode, resolve: Resolver): string[] {
  const gate = t.after ? ` *(after ${t.after})*` : '';
  const out: string[] = [`**Ask** — ${resolve(t.label)}${gate}`, ''];
  out.push(...proseLines(t.answer, resolve));
  return out;
}

function effectNotes(o: OptionNode, resolve: Resolver): string {
  const bits: string[] = [];
  if (o.memory) {
    bits.push(
      ...o.memory.map((m) => {
        const sign = m.warmthDelta < 0 ? '' : '+';
        const regard = m.regard ? ` (${m.regard})` : '';
        return `memory ${m.npc} ${sign}${m.warmthDelta}${regard}`;
      }),
    );
  }
  if (o.stat) bits.push(`stat +${o.stat.up} −${o.stat.down}`);
  if (o.perk) bits.push(`perk “${resolve(o.perk.name)}”`);
  if (o.flags) bits.push(`flags ${o.flags.join(', ')}`);
  if (o.bonus) bits.push(`⭐ +${o.bonus.amount} ${o.bonus.attr}`);
  if (o.stance) bits.push(`stance ${o.stance}`);
  return bits.length ? ` <small>· ${bits.join(' · ')}</small>` : '';
}

function sceneLines(
  scene: RungSceneNode | IntroSceneNode,
  resolve: Resolver,
): string[] {
  const out: string[] = [];
  out.push(...proseLines(scene.greeting, resolve));
  for (const t of scene.topics) out.push(...topicLines(t, resolve));
  const d = scene.decision!;
  out.push(`**Decide** — ${resolve(d.prompt)}`, '');
  for (const o of d.options) {
    const react = o.react!;
    const reactText =
      react.kind === 'speech'
        ? `**${react.speaker}:** ${resolve(react.text)}`
        : `*${resolve(react.text)}*`;
    out.push(
      `- ${resolve(o.label)}${effectNotes(o, resolve)}`,
      `  ${reactText}`,
      '',
    );
  }
  return out;
}

/** The rung a scene-def is ladder-placed at in the READING script, if any: its
 *  `reading:` meta (doc placement only — zero runtime meaning), else a
 *  `rung <R#>` trigger. Everything else is genuinely ladder-external and stays
 *  in the generalized section. */
function placedRungOf(def: SceneDefNode): string | undefined {
  const reading = def.meta.get('reading')?.value;
  if (reading !== undefined) return reading.trim();
  const trigger = def.meta.get('trigger')?.value;
  if (trigger === undefined) return undefined;
  const parsed = parseSceneTrigger(trigger);
  return parsed.ok && parsed.trigger.kind === 'rung'
    ? parsed.trigger.rung
    : undefined;
}

/** Render a generalized `## scene-def` (storywave G3.5) — trigger tag + greeting + optional
 *  decision (a decision-less scene-def is a narration-only beat, so nothing to render past its
 *  greeting). */
function sceneDefLines(def: SceneDefNode, resolve: Resolver): string[] {
  const trigger = def.meta.get('trigger')?.value ?? '(no trigger)';
  const once = def.meta.get('once') !== undefined ? ', once' : '';
  const out: string[] = [`*(trigger: ${trigger}${once})*`, ''];
  out.push(...proseLines(def.greeting, resolve));
  for (const t of def.topics) out.push(...topicLines(t, resolve));
  if (def.decision) {
    out.push(`**Decide** — ${resolve(def.decision.prompt)}`, '');
    for (const o of def.decision.options) {
      const react = o.react!;
      const reactText =
        react.kind === 'speech'
          ? `**${react.speaker}:** ${resolve(react.text)}`
          : `*${resolve(react.text)}*`;
      out.push(
        `- ${resolve(o.label)}${effectNotes(o, resolve)}`,
        `  ${reactText}`,
        '',
      );
    }
  }
  return out;
}

/** Compile the whole narrative doc set into the t0-story.md reading page. */
export function emitStoryDoc(docs: readonly NarrativeDoc[]): string {
  const resolve = makeResolver(docs);
  const L: string[] = [
    '# T0 — the story (GENERATED)',
    '',
    '> GENERATED by `pnpm run gen:narrative` from the authoring sources in',
    '> [`src/core/content/narrative/`](../../src/core/content/narrative/) —',
    '> do not edit by hand; edit the narrative markdown and regenerate.',
    '> Play order: the cold open → the three intro scenes → the R1…R7 rung',
    '> beats. Choice effects render as small print; `⭐` marks the three rare',
    '> BQ2 bonuses.',
    '',
  ];

  // ── the cold open (keyed prose, in authored order) ──
  const prose = docs.flatMap((d) => d.blocks).find((b) => b.kind === 'prose');
  if (prose) {
    L.push('## The cold open', '');
    for (const e of prose.entries) {
      L.push(`> ${resolve(e.text)} <small>*(${e.key})*</small>`, '');
    }
  }

  // ── the intro scenes ──
  const intro = docs.flatMap((d) => d.blocks).filter((b) => b.kind === 'scene');
  for (let i = 0; i < intro.length; i++) {
    const scene = intro[i]!;
    // FB-362 — the heading reads the scene's authored `title:` (the 幕-head label the
    // game itself stamps), single-source; the id is the fallback for an untitled take.
    const title = scene.meta.get('title')?.value ?? scene.id;
    L.push(`## Intro ${i + 1} · ${resolve(title)}`, '');
    L.push(...sceneLines(scene, resolve));
  }

  // ── the rung ladder (interleave, 2026-07-18) — walk RANKS in order so the
  // spine reads R1→R7 continuous. A rung's section carries its `## rung` beat
  // (if authored) plus every scene-def placed there (`reading:` meta or a
  // `rung <R#>` trigger): R2's silent rung and R5's accusation night are
  // scene-defs, so before this the script skipped their rungs entirely. ──
  const rungScenes = new Map(
    docs
      .flatMap((d) => d.blocks)
      .filter((b) => b.kind === 'rung')
      .map((b) => [b.rankKey, b]),
  );
  const sceneDefs = docs
    .flatMap((d) => d.blocks)
    .filter((b) => b.kind === 'scene-def');
  for (const rank of RANKS) {
    // R0 takes no rung section — the intro IS the R0 beat (D-110).
    if (rank.id === 'R0') continue;
    const beat = rungScenes.get(rank.id);
    const placed = sceneDefs.filter((d) => placedRungOf(d) === rank.id);
    if (!beat && placed.length === 0) continue;
    L.push(`## ${rank.id} · ${rank.title} ${rank.kanji}`, '');
    if (beat) L.push(...sceneLines(beat, resolve));
    for (const def of placed) {
      L.push(`### ${def.id}`, '');
      L.push(...sceneDefLines(def, resolve));
    }
  }

  // ── the generalized scenes (storywave G3.5 — a STUB until G4.1 fills scenes.md) ──
  const generalDefs = sceneDefs.filter((d) => placedRungOf(d) === undefined);
  if (generalDefs.length > 0) {
    L.push('## Generalized scenes (G3.5 stub)', '');
    L.push(
      '> Season overlays, side-beats, and the nengu ceremony — triggered outside the',
      '> rung ladder. A STUB at G3.5 (grammar samples); the real content lands at G4.1.',
      '',
    );
    for (const def of generalDefs) {
      L.push(`### ${def.id}`, '');
      L.push(...sceneDefLines(def, resolve));
    }
  }

  // ── the everyday asks (FB-415) — grouped per person, window + label + answer;
  // a native answer names its hand-written fn (ask-natives.ts derives it live). ──
  const askDefs = docs.flatMap((d) => d.blocks).filter((b) => b.kind === 'ask');
  if (askDefs.length > 0) {
    L.push('## The everyday asks (FB-415)', '');
    L.push(
      '> State-derived talk: each ask is a rung-windowed question answered',
      '> inline in the talk surface (never the Story log — D4). A `native`',
      '> answer derives from live state in `ask-natives.ts`; prose here is the',
      '> static answer as authored.',
      '',
    );
    const people = [...new Set(askDefs.map((a) => a.person))];
    for (const person of people) {
      L.push(`### ${person}`, '');
      for (const a of askDefs.filter((x) => x.person === person)) {
        const window =
          a.rungMax === undefined
            ? `${a.rungMin}+`
            : a.rungMin === a.rungMax
              ? a.rungMin
              : `${a.rungMin}–${a.rungMax}`;
        L.push(
          `- ${resolve(a.label ?? '')} <small>*(${a.id} · ${window}${a.refresh ? ` · refresh: ${a.refresh}` : ''})*</small>`,
        );
        if (a.native !== undefined) {
          L.push(`  - <small>native: ${a.native}</small>`);
        } else {
          for (const line of a.lines) {
            const said =
              line.kind === 'speech'
                ? `${line.speaker}: ${line.text}`
                : line.text;
            L.push(`  - ${resolve(said)}`);
          }
        }
      }
      L.push('');
    }
  }

  // ── the hidden rung requirements (FB-121 / ADR-137) — the human's sign-off
  // artifact for the authored lists: flavor first (what the player feels), the
  // Progress-tab objective line under it (HD-41 — what the register records),
  // then the mechanical spec as small print (what the engine counts). ──
  const reqBlocks = docs
    .flatMap((d) => d.blocks)
    .filter((b) => b.kind === 'requirements');
  if (reqBlocks.length > 0) {
    L.push('## The hidden rung requirements', '');
    L.push(
      '> The player never sees this list — only the rounded % bar, each',
      "> completion's flavor line (Story) and its objective line (Progress —",
      '> HD-41: the register states the work that was finished). Counts are',
      '> provisional (the FB-4 sim tunes them; ADR-132).',
      '',
    );
    for (const b of reqBlocks) {
      const rank = RANK_BY_ID.get(b.rankKey);
      const title = rank ? `${rank.title} ${rank.kanji}` : b.rankKey;
      L.push(`### ${b.rankKey} · ${title}`, '');
      for (const r of b.reqs) {
        const s = r.spec;
        const mech =
          s.type === 'count'
            ? `${s.token} ×${s.target}`
            : s.type === 'flag'
              ? `flag ${s.flag}`
              : s.pred.kind === 'native'
                ? `native ${s.pred.key}`
                : s.pred.kind === 'belonging'
                  ? `own ${s.pred.id}`
                  : s.pred.kind === 'skill'
                    ? `skill ${s.pred.skill} ≥ ${s.pred.min}`
                    : `${s.pred.kind} ${s.pred.res} ≥ ${s.pred.min}`;
        L.push(
          `- ${resolve(r.flavor ?? '')} <small>*(${r.id} — ${mech})*</small>`,
        );
        L.push(`  - <small>Progress: ${resolve(r.objective ?? '')}</small>`);
      }
      L.push('');
    }
  }

  while (L[L.length - 1] === '') L.pop();
  return L.join('\n') + '\n';
}
