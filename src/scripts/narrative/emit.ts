// Narrative emitter (F5 Ph1) — AST → generated TypeScript registry source.
//
// Emits DATA ONLY: the module carries the compiled registry literal; every type,
// helper, and reducer stays hand-written in the module that re-exports this data.
// Speakers are emitted as REFERENCES (`NPC_NAME.kihei`, `NAMES.pedlar`) so a
// rename stays single-source in names.ts, exactly like the hand-written file.
//
// The emitted source is UNFORMATTED — the gen-narrative CLI pipes it through
// oxfmt (the repo formatter) so the on-disk bytes are stable and pass the
// `oxfmt --check` gate untouched. (The plan said "prettier API"; this repo
// formats with oxfmt — a documented liberty, same intent.)

import { NPC_NAME, NPC_VOICE, type NpcId } from '../../core/content/voices';
import { NAMES } from '../../core/content/names';
import {
  NarrativeError,
  type NarrativeDoc,
  type OptionNode,
  type ProseLine,
  type RungSceneNode,
  type SpeechLine,
} from './parse';

/** display name → NpcId (the NPC_NAME reverse map). */
const NPC_BY_NAME = new Map<string, NpcId>(
  (Object.entries(NPC_NAME) as [NpcId, string][]).map(([id, name]) => [name, id]),
);
/** display name → NAMES key (for non-NPC ambient speakers like the pedlar). */
const NAMES_KEY_BY_NAME = new Map<string, string>(
  Object.entries(NAMES).map(([key, name]) => [name, key]),
);

const str = (s: string): string => JSON.stringify(s);

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
  if (line.kind === 'narr') return `{ voice: 'narrator', text: ${str(line.text)} },`;
  const r = resolveSpeaker(line);
  return `{ voice: '${r.voice}', speaker: ${r.speakerExpr}, text: ${str(line.text)} },`;
}

function emitOption(opt: OptionNode, scene: RungSceneNode): string {
  const react = opt.react!; // parse guarantees presence
  const r = resolveSpeaker(react);
  if (!r.npc) {
    throw new NarrativeError(
      react.loc,
      `a react line's speaker must be an NPC, got "${react.speaker}"`,
    );
  }
  if (react.voice !== undefined) {
    throw new NarrativeError(
      react.loc,
      'a react line takes no (voice) override — its voice derives from the scene/reactNpc',
    );
  }
  const sceneSpeaker = scene.meta.get('speaker')?.value;
  const L: string[] = ['{'];
  L.push(`id: ${str(opt.id)},`);
  L.push(`label: ${str(opt.label)},`);
  L.push(`say: ${str(opt.say ?? opt.label)},`);
  L.push(`react: ${str(react.text)},`);
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
      `statBonus: { attr: '${opt.bonus.attr}', amount: ${opt.bonus.amount}, note: ${str(opt.bonus.note)} },`,
    );
  }
  if (opt.stance) L.push(`setStance: '${opt.stance}',`);
  L.push('},');
  return L.join('\n');
}

function emitScene(scene: RungSceneNode): string {
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
  if (scene.topics.length === 0) {
    L.push('topics: [],');
  } else {
    L.push('topics: [');
    for (const t of scene.topics) {
      L.push('{');
      L.push(`id: ${str(t.id)},`);
      L.push(`label: ${str(t.label)},`);
      if (t.after) L.push(`gate: (asked) => asked.has(${str(t.after)}),`);
      L.push('answer: [');
      for (const line of t.answer) L.push(emitProseLine(line));
      L.push('],');
      L.push('},');
    }
    L.push('],');
  }
  const d = scene.decision!; // parse guarantees presence
  L.push('decision: {');
  L.push(`prompt: ${str(d.prompt)},`);
  L.push('options: [');
  for (const o of d.options) L.push(emitOption(o, scene));
  L.push('],');
  L.push('},');
  L.push('},');
  return L.join('\n');
}

/** Compile a rung-beats narrative doc into the `rungBeats.gen.ts` module source (unformatted). */
export function emitRungBeats(doc: NarrativeDoc): string {
  const body = doc.scenes.map(emitScene).join('\n\n');
  const header = [
    `// GENERATED by \`npm run gen:narrative\` from ${doc.file} — DO NOT EDIT.`,
    '// Hand edits here are drift by definition: edit the markdown source and regenerate',
    '// (the gen-narrative verify gate rebuilds this file and byte-compares it).',
    '// Data only — the types + helpers stay hand-written in rungBeats.ts, which re-exports this.',
  ].join('\n');
  const imports = [
    `import type { RankId } from './ranks';`,
    `import type { RungScene } from './rungBeats';`,
    body.includes('NAMES.') ? `import { NAMES } from './names';` : '',
    body.includes('NPC_NAME.') ? `import { NPC_NAME } from './voices';` : '',
  ]
    .filter(Boolean)
    .join('\n');
  return `${header}\n\n${imports}\n\nexport const RUNG_BEATS: Partial<Record<RankId, RungScene>> = {\n${body}\n};\n`;
}
