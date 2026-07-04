// Narrative emitter (F5) — AST → generated TypeScript registry source.
//
// Emits DATA ONLY: each module carries the compiled registry literal; every type,
// helper, and reducer stays hand-written in the module that re-exports this data.
// Speakers are emitted as REFERENCES (`NPC_NAME.kihei`, `NAMES.pedlar`), `{key}`
// interpolations as `${NAMES.key}` template parts, and `@file.key` reuse lines as
// the same single-source expressions the hand-written files used (`COLD_OPEN.wake`,
// `getDialogueLine(…)`) — so a rename stays single-source in names.ts.
//
// The emitted source is UNFORMATTED — the gen-narrative CLI pipes it through
// oxfmt (the repo formatter) so the on-disk bytes are stable and pass the
// `oxfmt --check` gate untouched. (The plan said "prettier API"; this repo
// formats with oxfmt — a documented liberty, same intent.)

import { NPC_NAME, NPC_VOICE, type NpcId } from '../../core/content/voices';
import { NAMES } from '../../core/content/names';
import {
  NarrativeError,
  type DialogueDefNode,
  type IntroSceneNode,
  type NarrativeDoc,
  type OptionNode,
  type ProseLine,
  type RungSceneNode,
  type SpeechLine,
  type WhenGate,
} from './parse';

/** display name → NpcId (the NPC_NAME reverse map). */
const NPC_BY_NAME = new Map<string, NpcId>(
  (Object.entries(NPC_NAME) as [NpcId, string][]).map(([id, name]) => [name, id]),
);
/** display name → NAMES key (for non-NPC ambient speakers like the pedlar). */
const NAMES_KEY_BY_NAME = new Map<string, string>(
  Object.entries(NAMES).map(([key, name]) => [name, key]),
);
const NAMES_KEYS = new Set(Object.keys(NAMES));

const str = (s: string): string => JSON.stringify(s);

/** Emit a prose text as a TS expression: `{key}` NAMES interpolations become a template
 *  literal with `${NAMES.key}` parts; plain text stays a JSON string. */
export function textExpr(text: string, loc: { file: string; line: number }): string {
  if (!/\{[a-zA-Z]+\}/.test(text)) return str(text);
  const parts = text.split(/\{([a-zA-Z]+)\}/);
  // odd indices are candidate keys; even are literal runs.
  const anyKey = parts.some((p, i) => i % 2 === 1 && NAMES_KEYS.has(p));
  if (!anyKey) return str(text);
  let out = '`';
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i]!;
    if (i % 2 === 1) {
      if (!NAMES_KEYS.has(p)) throw new NarrativeError(loc, `unknown NAMES interpolation "{${p}}"`);
      out += `\${NAMES.${p}}`;
    } else {
      out += p.replaceAll('\\', '\\\\').replaceAll('`', '\\`').replaceAll('${', '\\${');
    }
  }
  return out + '`';
}

/** A `@…` reuse reference → the single-source expression the hand-written file used. */
function refExpr(text: string, loc: { file: string; line: number }): string | undefined {
  const cold = /^@cold-open\.([a-zA-Z]+)$/.exec(text);
  if (cold) return `COLD_OPEN.${cold[1]}`;
  const dlg = /^@dialogue\.([a-z0-9-]+)\/([a-z0-9-]+)$/.exec(text);
  if (dlg) return `getDialogueLine(${str(dlg[1]!)}, ${str(dlg[2]!)}).text`;
  if (text.startsWith('@')) {
    throw new NarrativeError(
      loc,
      `unknown reuse reference "${text}" (@cold-open.<key> / @dialogue.<def>/<line>)`,
    );
  }
  return undefined;
}

interface ResolvedSpeaker {
  readonly npc?: NpcId;
  readonly voice: string;
  /** The TS expression for the nameplate, e.g. `NPC_NAME.kihei` / `NAMES.pedlar`. */
  readonly speakerExpr: string;
}

function resolveSpeaker(line: SpeechLine): ResolvedSpeaker {
  const npc = NPC_BY_NAME.get(line.speaker);
  if (npc) {
    return { npc, voice: line.voice ?? NPC_VOICE[npc], speakerExpr: `NPC_NAME.${npc}` };
  }
  const namesKey = NAMES_KEY_BY_NAME.get(line.speaker);
  if (namesKey) {
    if (!line.voice) {
      throw new NarrativeError(
        line.loc,
        `"${line.speaker}" is not an NPC — an ambient speaker needs an explicit (voice)`,
      );
    }
    return { voice: line.voice, speakerExpr: `NAMES.${namesKey}` };
  }
  throw new NarrativeError(
    line.loc,
    `unknown speaker "${line.speaker}" (known: ${[...NPC_BY_NAME.keys(), ...NAMES_KEY_BY_NAME.keys()].join(', ')})`,
  );
}

function emitProseLine(line: ProseLine): string {
  const expr = refExpr(line.text, line.loc) ?? textExpr(line.text, line.loc);
  if (line.kind === 'narr') return `{ voice: 'narrator', text: ${expr} },`;
  const r = resolveSpeaker(line);
  return `{ voice: '${r.voice}', speaker: ${r.speakerExpr}, text: ${expr} },`;
}

// ── rung beats ──────────────────────────────────────────────────────────────

function emitRungOption(opt: OptionNode, scene: RungSceneNode): string {
  const react = opt.react!; // parse guarantees presence
  if (react.kind !== 'speech') {
    throw new NarrativeError(react.loc, 'a rung-beat react must be a speech line');
  }
  const r = resolveSpeaker(react);
  if (!r.npc) {
    throw new NarrativeError(
      react.loc,
      `a react line's speaker must be an NPC, got "${react.speaker}"`,
    );
  }
  const sceneSpeaker = scene.meta.get('speaker')?.value;
  const L: string[] = ['{'];
  L.push(`id: ${str(opt.id)},`);
  L.push(`label: ${textExpr(opt.label, opt.loc)},`);
  L.push(`say: ${textExpr(opt.say ?? opt.label, opt.loc)},`);
  L.push(`react: ${textExpr(react.text, react.loc)},`);
  if (r.npc !== sceneSpeaker) L.push(`reactNpc: '${r.npc}',`);
  if (opt.memory) {
    const entries = opt.memory.map((m) => {
      const regard = m.regard !== undefined ? `, regard: ${str(m.regard)}` : '';
      return `{ npc: '${m.npc}', warmthDelta: ${m.warmthDelta}${regard} },`;
    });
    L.push(`memory: [${entries.join(' ')}],`);
  }
  if (opt.flags) L.push(`flags: [${opt.flags.map(str).join(', ')}],`);
  if (opt.bonus) {
    L.push(
      `statBonus: { attr: '${opt.bonus.attr}', amount: ${opt.bonus.amount}, note: ${textExpr(opt.bonus.note, opt.loc)} },`,
    );
  }
  if (opt.stance) L.push(`setStance: '${opt.stance}',`);
  L.push('},');
  return L.join('\n');
}

function emitTopics(scene: RungSceneNode | IntroSceneNode): string {
  if (scene.topics.length === 0) return 'topics: [],';
  const L: string[] = ['topics: ['];
  for (const t of scene.topics) {
    L.push('{');
    L.push(`id: ${str(t.id)},`);
    L.push(`label: ${textExpr(t.label, t.loc)},`);
    if (t.after) L.push(`gate: (asked) => asked.has(${str(t.after)}),`);
    L.push('answer: [');
    for (const line of t.answer) L.push(emitProseLine(line));
    L.push('],');
    L.push('},');
  }
  L.push('],');
  return L.join('\n');
}

function emitRungScene(scene: RungSceneNode): string {
  const meta = (key: string): string | undefined => scene.meta.get(key)?.value;
  const voice = meta('voice');
  if (!voice) throw new NarrativeError(scene.loc, `scene "${scene.id}" is missing "voice:" meta`);
  const speaker = meta('speaker');
  const motivatesRaw = meta('motivates');
  if (!motivatesRaw) {
    throw new NarrativeError(scene.loc, `scene "${scene.id}" is missing "motivates:" meta`);
  }
  const motivates = motivatesRaw.split(',').map((m) => m.trim());

  const L: string[] = [`${scene.rankKey}: {`];
  L.push(`id: ${str(scene.id)},`);
  L.push(`rank: '${scene.rankKey}',`);
  L.push(`voice: '${voice}',`);
  if (speaker) L.push(`speaker: '${speaker}',`);
  L.push(`motivates: [${motivates.map(str).join(', ')}],`);
  L.push('greeting: [');
  for (const line of scene.greeting) L.push(emitProseLine(line));
  L.push('],');
  L.push(emitTopics(scene));
  const d = scene.decision!; // parse guarantees presence
  L.push('decision: {');
  L.push(`prompt: ${textExpr(d.prompt, d.loc)},`);
  L.push('options: [');
  for (const o of d.options) L.push(emitRungOption(o, scene));
  L.push('],');
  L.push('},');
  L.push('},');
  return L.join('\n');
}

const GENERATED = (file: string, home: string): string =>
  [
    `// GENERATED by \`npm run gen:narrative\` from ${file} — DO NOT EDIT.`,
    '// Hand edits here are drift by definition: edit the markdown source and regenerate',
    '// (the gen-narrative verify gate rebuilds this file and byte-compares it).',
    `// Data only — the types + helpers stay hand-written in ${home}, which re-exports this.`,
  ].join('\n');

function withImports(header: string, body: string, imports: readonly string[]): string {
  const used = imports.filter((imp) => {
    const m = /import (?:type )?\{ ?(\w+)/.exec(imp);
    return m ? body.includes(m[1]!) : true;
  });
  return `${header}\n\n${used.join('\n')}\n\n${body}\n`;
}

/** Compile a rung-beats narrative doc into the `rungBeats.gen.ts` module source (unformatted). */
export function emitRungBeats(doc: NarrativeDoc): string {
  const scenes = doc.blocks.filter((b) => b.kind === 'rung');
  const body = `export const RUNG_BEATS: Partial<Record<RankId, RungScene>> = {\n${scenes
    .map(emitRungScene)
    .join('\n\n')}\n};`;
  return withImports(GENERATED(doc.file, 'rungBeats.ts'), body, [
    `import type { RankId } from './ranks';`,
    `import type { RungScene } from './rungBeats';`,
    `import { NAMES } from './names';`,
    `import { NPC_NAME } from './voices';`,
  ]);
}

// ── intro scenes ────────────────────────────────────────────────────────────

function emitIntroOption(opt: OptionNode, scene: IntroSceneNode): string {
  const react = opt.react!;
  if (react.kind === 'speech') {
    const r = resolveSpeaker(react);
    const sceneSpeaker = scene.meta.get('speaker')?.value;
    if (r.npc !== sceneSpeaker) {
      throw new NarrativeError(
        react.loc,
        `an intro react speaks in the scene speaker's voice — got "${react.speaker}"`,
      );
    }
  }
  if (!opt.stat) throw new NarrativeError(opt.loc, `intro option "${opt.id}" is missing "stat:"`);
  if (!opt.perk) throw new NarrativeError(opt.loc, `intro option "${opt.id}" is missing "perk:"`);
  const L: string[] = ['{'];
  L.push(`id: ${str(opt.id)},`);
  L.push(`label: ${textExpr(opt.label, opt.loc)},`);
  L.push(`say: ${textExpr(opt.say ?? opt.label, opt.loc)},`);
  L.push(`react: ${textExpr(react.text, react.loc)},`);
  L.push(`stat: { up: '${opt.stat.up}', down: '${opt.stat.down}' },`);
  L.push(
    `perk: { name: ${textExpr(opt.perk.name, opt.loc)}, desc: ${textExpr(opt.perk.desc, opt.loc)} },`,
  );
  if (opt.memory) {
    if (opt.memory.length !== 1 || opt.memory[0]!.regard === undefined) {
      throw new NarrativeError(
        opt.loc,
        'an intro option takes exactly one memory write, with a regard',
      );
    }
    const m = opt.memory[0]!;
    L.push(`memory: { npc: '${m.npc}', regard: ${str(m.regard!)}, warmth: ${m.warmthDelta} },`);
  }
  L.push('},');
  return L.join('\n');
}

function emitIntroScene(scene: IntroSceneNode): string {
  const voice = scene.meta.get('voice')?.value;
  if (!voice) throw new NarrativeError(scene.loc, `scene "${scene.id}" is missing "voice:" meta`);
  const speaker = scene.meta.get('speaker')?.value;
  const L: string[] = ['{'];
  L.push(`id: ${str(scene.id)},`);
  L.push(`voice: '${voice}',`);
  if (speaker) L.push(`speaker: '${speaker}',`);
  L.push('greeting: [');
  for (const line of scene.greeting) L.push(emitProseLine(line));
  L.push('],');
  L.push(emitTopics(scene));
  const d = scene.decision!;
  L.push('decision: {');
  L.push(`prompt: ${textExpr(d.prompt, d.loc)},`);
  L.push('options: [');
  for (const o of d.options) L.push(emitIntroOption(o, scene));
  L.push('],');
  L.push('},');
  L.push('},');
  return L.join('\n');
}

/** Compile the intro narrative doc into the `intro.gen.ts` module source (unformatted). */
export function emitIntro(doc: NarrativeDoc): string {
  const scenes = doc.blocks.filter((b) => b.kind === 'scene');
  const body = `export const DIALOGUE_SCENES: readonly DialogueScene[] = [\n${scenes
    .map(emitIntroScene)
    .join('\n\n')}\n];`;
  return withImports(GENERATED(doc.file, 'intro.ts'), body, [
    `import { COLD_OPEN } from './coldOpen';`,
    `import { getDialogueLine } from './dialogue';`,
    `import { NAMES } from './names';`,
    `import { NPC_NAME } from './voices';`,
    `import type { DialogueScene } from './intro';`,
  ]);
}

// ── dialogue defs ───────────────────────────────────────────────────────────

function whenExpr(when: WhenGate): string {
  if (when.type === 'flag') {
    const key = /^[a-zA-Z_$][\w$]*$/.test(when.flag) ? `.${when.flag}` : `[${str(when.flag)}]`;
    return `gate: (flags) => flags${key} === true,`;
  }
  const op = when.op === 'is' ? '===' : '!==';
  return `memGate: (m) => m.${when.npc}?.regard ${op} ${str(when.value)},`;
}

function emitDialogueDef(def: DialogueDefNode): string {
  if (!NAMES_KEYS.has(def.speakerKey)) {
    throw new NarrativeError(
      def.loc,
      `unknown dialogue speaker key "${def.speakerKey}" (a NAMES key)`,
    );
  }
  const speaker = `NAMES.${def.speakerKey}`;
  const L: string[] = ['{'];
  L.push(`id: ${str(def.id)},`);
  L.push(`speaker: ${speaker},`);
  L.push('lines: [');
  for (const l of def.lines) {
    L.push('{');
    L.push(`id: ${str(l.id)},`);
    L.push(`speaker: ${speaker},`);
    if (l.when) L.push(whenExpr(l.when));
    if (l.voice) L.push(`voice: '${l.voice}',`);
    L.push(`text: ${textExpr(l.text, l.loc)},`);
    L.push('},');
  }
  L.push('],');
  L.push('},');
  return L.join('\n');
}

/** Compile the dialogue narrative doc into the `dialogue.gen.ts` module source (unformatted). */
export function emitDialogue(doc: NarrativeDoc): string {
  const defs = doc.blocks.filter((b) => b.kind === 'dialogue');
  const body = `export const DIALOGUES: readonly DialogueDef[] = [\n${defs
    .map(emitDialogueDef)
    .join('\n\n')}\n];`;
  return withImports(GENERATED(doc.file, 'dialogue.ts'), body, [
    `import { NAMES } from './names';`,
    `import type { DialogueDef } from './dialogue';`,
  ]);
}

// ── keyed prose (the cold open) ─────────────────────────────────────────────

/** Compile the cold-open narrative doc into the `coldOpen.gen.ts` module source (unformatted). */
export function emitColdOpen(doc: NarrativeDoc): string {
  const block = doc.blocks.find((b) => b.kind === 'prose');
  if (!block) throw new NarrativeError({ file: doc.file, line: 1 }, 'no `## prose` block found');
  const entries = block.entries.map((e) => `${e.key}: ${textExpr(e.text, e.loc)},`).join('\n');
  const body = `export const COLD_OPEN = {\n${entries}\n} as const;`;
  return withImports(GENERATED(doc.file, 'coldOpen.ts'), body, [
    `import { NAMES } from './names';`,
  ]);
}
