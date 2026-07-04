// Narrative authoring-format parser (F5 Ph1) — structured markdown → AST.
//
// The story is authored as prose-first markdown in `src/core/content/narrative/`
// (the source of truth); this parser turns one file into an AST that `emit.ts`
// compiles to a generated `.ts` registry. The grammar is documented in
// `src/core/content/narrative/README.md` — keep the two in sync.
//
// Every node carries its authoring file:line so validation errors point at the
// `.md` the author should edit, never at generated output.

export interface Loc {
  readonly file: string;
  readonly line: number;
}

/** A parse/validate error pinned to the AUTHORING file:line. */
export class NarrativeError extends Error {
  constructor(loc: Loc, message: string) {
    super(`${loc.file}:${loc.line} — ${message}`);
    this.name = 'NarrativeError';
  }
}

export interface SpeechLine {
  readonly kind: 'speech';
  /** The display-name token as written (e.g. 'Kihei', 'Tokubei') — resolved by emit. */
  readonly speaker: string;
  /** Explicit `(voice)` override; absent ⇒ the speaker's registered NPC voice. */
  readonly voice?: string;
  /** The line verbatim, hard-wraps rejoined with single spaces (quotes included). */
  readonly text: string;
  readonly loc: Loc;
}

export interface NarrLine {
  readonly kind: 'narr';
  readonly text: string;
  readonly loc: Loc;
}

export type ProseLine = SpeechLine | NarrLine;

export interface MemoryEffect {
  readonly npc: string;
  readonly warmthDelta: number;
  readonly regard?: string;
}

export interface TopicNode {
  readonly id: string;
  readonly label: string;
  /** `after: <topic-id>` — compiles to the `asked.has(<id>)` gate. */
  after?: string;
  readonly answer: ProseLine[];
  readonly loc: Loc;
}

export interface OptionNode {
  readonly id: string;
  readonly label: string;
  /** Explicit `say:` override (the intro); absent ⇒ the label doubles as `say`. */
  say?: string;
  /** The option's single speech paragraph — the `react` (its speaker picks `reactNpc`). */
  react?: SpeechLine;
  memory?: MemoryEffect[];
  flags?: string[];
  bonus?: { readonly amount: number; readonly attr: string; readonly note: string };
  stance?: string;
  readonly loc: Loc;
}

export interface DecisionNode {
  readonly prompt: string;
  readonly options: OptionNode[];
  readonly loc: Loc;
}

export interface RungSceneNode {
  readonly kind: 'rung';
  /** The registry key, e.g. 'R3'. */
  readonly rankKey: string;
  /** The scene id, e.g. 'rung-r3'. */
  readonly id: string;
  /** Raw `key: value` meta-block entries (speaker / voice / motivates). */
  readonly meta: Map<string, { value: string; loc: Loc }>;
  readonly greeting: ProseLine[];
  readonly topics: TopicNode[];
  decision?: DecisionNode;
  readonly loc: Loc;
}

export interface NarrativeDoc {
  readonly file: string;
  readonly scenes: RungSceneNode[];
}

/** Reserved annotation keys — a `key: value` line whose key is here is NEVER a speech line. */
const RESERVED = new Set([
  'speaker',
  'voice',
  'motivates',
  'after',
  'when',
  'say',
  'memory',
  'flags',
  'bonus',
  'stance',
  'stat',
  'perk',
  'unrouted',
]);

const RE_SCENE = /^## rung (\S+) · (\S+)\s*$/;
const RE_TOPIC = /^### ask ([a-z0-9-]+) · (.+)$/;
const RE_DECIDE = /^### decide · (.+)$/;
const RE_OPTION = /^#### ([a-z0-9-]+) · (.+)$/;
const RE_ANNOTATION = /^([a-z-]+): (.*)$/;
// A speech line: a display-name token (starts uppercase, may carry ' (voice)'), colon, text.
const RE_SPEECH = /^(\p{Lu}[^:()]*?)(?: \(([a-z-]+)\))?: (.*)$/u;

/** Parse `memory: kihei +1 (disciplined)` / `genemon +0, tozo +1 (friend)`. */
function parseMemory(raw: string, loc: Loc): MemoryEffect[] {
  return raw.split(',').map((part) => {
    const m = /^([a-z-]+) ([+\-−])(\d+)(?: \(([^()]+)\))?$/.exec(part.trim());
    if (!m) {
      throw new NarrativeError(
        loc,
        `bad memory entry "${part.trim()}" — expected "<npc> +N (regard)" or "<npc> -N"`,
      );
    }
    const sign = m[2] === '+' ? 1 : -1;
    const entry: { npc: string; warmthDelta: number; regard?: string } = {
      npc: m[1]!,
      warmthDelta: sign * Number(m[3]),
    };
    if (m[4] !== undefined) entry.regard = m[4];
    return entry;
  });
}

/** Parse `bonus: +1 agi — "…delight line…"`. */
function parseBonus(raw: string, loc: Loc): { amount: number; attr: string; note: string } {
  const m = /^\+(\d+) ([a-z]+) — "(.+)"$/.exec(raw);
  if (!m) {
    throw new NarrativeError(loc, `bad bonus "${raw}" — expected '+N <attr> — "<note>"'`);
  }
  return { amount: Number(m[1]), attr: m[2]!, note: m[3]! };
}

/** True when `text`, placed at column 0, would be re-classified as a structural marker —
 *  used by writers/wrappers to avoid a hard-wrap landing on an ambiguous continuation line. */
export function looksLikeMarker(text: string): boolean {
  if (text.startsWith('>') || text.startsWith('#') || text.startsWith('<!--')) return true;
  const ann = RE_ANNOTATION.exec(text);
  if (ann && RESERVED.has(ann[1]!)) return true;
  return RE_SPEECH.test(text);
}

type OpenPara =
  | { type: 'prose'; node: { kind: 'narr' | 'speech'; text: string } & Record<string, unknown> }
  | { type: 'annotation'; key: string; value: string; loc: Loc };

export function parseNarrative(source: string, file: string): NarrativeDoc {
  const lines = source.split('\n');
  const scenes: RungSceneNode[] = [];

  let scene: RungSceneNode | undefined;
  /** Where prose/annotations currently land. */
  let section: 'meta' | 'greeting' | 'topic' | 'decision' = 'meta';
  let topic: TopicNode | undefined;
  let option: OptionNode | undefined;
  let open: OpenPara | undefined;
  let inComment = false;

  const fail = (line: number, msg: string): never => {
    throw new NarrativeError({ file, line }, msg);
  };

  /** Close the open paragraph/annotation, committing it to its context. */
  const close = (): void => {
    if (!open) return;
    const o = open;
    open = undefined;
    if (o.type === 'annotation') {
      const { key, value, loc } = o;
      if (section === 'meta') {
        if (!scene) return fail(loc.line, 'meta annotation outside a scene');
        if (!['speaker', 'voice', 'motivates'].includes(key)) {
          return fail(loc.line, `unknown scene meta key "${key}" (speaker/voice/motivates)`);
        }
        if (scene.meta.has(key)) return fail(loc.line, `duplicate scene meta "${key}"`);
        scene.meta.set(key, { value, loc });
      } else if (option) {
        switch (key) {
          case 'say':
            option.say = value;
            break;
          case 'memory':
            option.memory = parseMemory(value, loc);
            break;
          case 'flags':
            option.flags = value.split(',').map((f) => f.trim());
            break;
          case 'bonus':
            option.bonus = parseBonus(value, loc);
            break;
          case 'stance':
            option.stance = value.trim();
            break;
          default:
            return fail(loc.line, `unknown option annotation "${key}"`);
        }
      } else if (topic && section === 'topic') {
        if (key !== 'after') return fail(loc.line, `unknown topic annotation "${key}"`);
        topic.after = value.trim();
      } else {
        return fail(loc.line, `annotation "${key}" in an unexpected position`);
      }
      return;
    }
    // prose paragraph
    const node = o.node as unknown as ProseLine;
    if (option) {
      if (node.kind !== 'speech') {
        return fail(node.loc.line, 'an option body takes exactly one speech line (the react)');
      }
      if (option.react) {
        return fail(node.loc.line, `option "${option.id}" already has a react line`);
      }
      option.react = node;
    } else if (topic && section === 'topic') {
      topic.answer.push(node);
    } else if (scene && section === 'greeting') {
      scene.greeting.push(node);
    } else {
      return fail(node.loc.line, 'prose in an unexpected position (before any scene?)');
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i]!;
    const n = i + 1;

    // HTML comments are authorial notes — skipped entirely (may span lines).
    if (inComment) {
      if (raw.includes('-->')) inComment = false;
      continue;
    }
    if (raw.trimStart().startsWith('<!--')) {
      close();
      if (!raw.includes('-->')) inComment = true;
      continue;
    }

    if (raw.trim() === '') {
      close();
      if (section === 'meta' && scene) section = 'greeting';
      continue;
    }

    // Indented line → continuation of whatever is open.
    if (/^\s/.test(raw)) {
      if (!open) return fail(n, 'indented continuation with nothing open above it') as never;
      if (open.type === 'annotation') open.value += ' ' + raw.trim();
      else open.node.text += ' ' + raw.trim();
      continue;
    }

    const sceneM = RE_SCENE.exec(raw);
    if (sceneM) {
      close();
      scene = {
        kind: 'rung',
        rankKey: sceneM[1]!,
        id: sceneM[2]!,
        meta: new Map(),
        greeting: [],
        topics: [],
        loc: { file, line: n },
      };
      scenes.push(scene);
      section = 'meta';
      topic = undefined;
      option = undefined;
      continue;
    }
    if (raw.startsWith('## ')) return fail(n, `unrecognized scene heading "${raw}"`) as never;

    const topicM = RE_TOPIC.exec(raw);
    if (topicM) {
      close();
      if (!scene) return fail(n, 'topic outside a scene') as never;
      if (section === 'decision') return fail(n, 'ask-topic after the decide block') as never;
      topic = { id: topicM[1]!, label: topicM[2]!, answer: [], loc: { file, line: n } };
      scene.topics.push(topic);
      section = 'topic';
      continue;
    }

    const decideM = RE_DECIDE.exec(raw);
    if (decideM) {
      close();
      if (!scene) return fail(n, 'decide outside a scene') as never;
      if (scene.decision) return fail(n, 'a scene takes exactly one decide block') as never;
      scene.decision = { prompt: decideM[1]!, options: [], loc: { file, line: n } };
      section = 'decision';
      topic = undefined;
      option = undefined;
      continue;
    }

    const optionM = RE_OPTION.exec(raw);
    if (optionM) {
      close();
      if (!scene?.decision) return fail(n, 'option outside a decide block') as never;
      option = { id: optionM[1]!, label: optionM[2]!, loc: { file, line: n } };
      scene.decision.options.push(option);
      continue;
    }
    if (raw.startsWith('#')) return fail(n, `unrecognized heading "${raw}"`) as never;

    const narrM = /^> ?(.*)$/.exec(raw);
    if (narrM) {
      if (open?.type === 'prose' && open.node.kind === 'narr') {
        open.node.text += ' ' + narrM[1]!;
      } else {
        close();
        open = { type: 'prose', node: { kind: 'narr', text: narrM[1]!, loc: { file, line: n } } };
      }
      continue;
    }

    const annM = RE_ANNOTATION.exec(raw);
    if (annM && RESERVED.has(annM[1]!)) {
      close();
      open = { type: 'annotation', key: annM[1]!, value: annM[2]!, loc: { file, line: n } };
      continue;
    }

    const speechM = RE_SPEECH.exec(raw);
    if (speechM) {
      close();
      const node: { kind: 'speech'; speaker: string; voice?: string; text: string; loc: Loc } = {
        kind: 'speech',
        speaker: speechM[1]!,
        text: speechM[3]!,
        loc: { file, line: n },
      };
      if (speechM[2] !== undefined) node.voice = speechM[2];
      open = { type: 'prose', node };
      continue;
    }

    // Flush-left plain text → continuation of the open paragraph (a hard-wrapped prose line).
    if (open) {
      if (open.type === 'annotation') open.value += ' ' + raw.trim();
      else open.node.text += ' ' + raw.trim();
      continue;
    }
    return fail(n, `cannot classify line: "${raw}"`) as never;
  }
  close();

  // Structural floor (the deeper roster is Ph2's validate.ts): every scene decides.
  for (const s of scenes) {
    if (!s.decision) throw new NarrativeError(s.loc, `scene "${s.id}" has no decide block`);
    if (s.decision.options.length === 0) {
      throw new NarrativeError(s.decision.loc, `scene "${s.id}" decide block has no options`);
    }
    for (const o of s.decision.options) {
      if (!o.react) throw new NarrativeError(o.loc, `option "${o.id}" has no react line`);
    }
  }

  return { file, scenes };
}
