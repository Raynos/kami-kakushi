// Narrative authoring-format parser (FB-5) — structured markdown → AST.
//
// The story is authored as prose-first markdown in `src/core/content/narrative/`
// (the source of truth); this parser turns one file into an AST that `emit.ts`
// compiles to a generated `.ts` registry. The grammar is documented in
// `src/core/content/narrative/README.md` — keep the two in sync.
//
// Four block kinds (Ph1 + Ph3): `## rung` (rung beats), `## scene` (intro
// dialogue scenes), `## dialogue` (teach-by-reveal line registries), and
// `## prose` (keyed prose constants — the cold open). Every node carries its
// authoring file:line so validation errors point at the `.md` the author
// should edit, never at generated output.

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
  /** The line verbatim, hard-wraps rejoined with single spaces (quotes included).
   *  A text of the form `@file.key` / `@dialogue.<def>/<line>` is a REUSE reference. */
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
  /** The option's single prose paragraph — the `react` (a speech line's speaker picks
   *  `reactNpc` in rung scenes; intro reacts may be narrator prose — the dream). */
  react?: ProseLine;
  memory?: MemoryEffect[];
  flags?: string[];
  bonus?: { readonly amount: number; readonly attr: string; readonly note: string };
  stance?: string;
  /** Intro-only: `stat: +int -str` (the net-zero lean). */
  stat?: { readonly up: string; readonly down: string };
  /** Intro-only: `perk: <Name> — <desc>`. */
  perk?: { readonly name: string; readonly desc: string };
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
  readonly id: string;
  /** Raw `key: value` meta-block entries (speaker / voice / motivates). */
  readonly meta: Map<string, { value: string; loc: Loc }>;
  readonly greeting: ProseLine[];
  readonly topics: TopicNode[];
  decision?: DecisionNode;
  readonly loc: Loc;
}

/** An intro dialogue scene (`## scene soan`) — same shape minus rank/motivates. */
export interface IntroSceneNode {
  readonly kind: 'scene';
  readonly id: string;
  readonly meta: Map<string, { value: string; loc: Loc }>;
  readonly greeting: ProseLine[];
  readonly topics: TopicNode[];
  decision?: DecisionNode;
  readonly loc: Loc;
}

/** A `when:` reveal gate on a dialogue line. */
export type WhenGate =
  | { readonly type: 'flag'; readonly flag: string }
  | {
      readonly type: 'regard';
      readonly npc: string;
      readonly op: 'is' | 'not';
      readonly value: string;
    };

export interface DialogueLineNode {
  readonly id: string;
  voice?: string;
  when?: WhenGate;
  text: string;
  readonly loc: Loc;
}

/** A dialogue def (`## dialogue genemon-open · elder`) — speaker is a NAMES key. */
export interface DialogueDefNode {
  readonly kind: 'dialogue';
  readonly id: string;
  readonly speakerKey: string;
  /** `unrouted: <reason>` — authored-but-not-yet-routed forward content, kept on purpose. */
  unrouted?: string;
  readonly lines: DialogueLineNode[];
  readonly loc: Loc;
}

/** A keyed-prose block (`## prose cold-open` → `### wake` …). */
export interface ProseDocNode {
  readonly kind: 'prose';
  readonly id: string;
  readonly entries: { readonly key: string; text: string; readonly loc: Loc }[];
  readonly loc: Loc;
}

export type BlockNode = RungSceneNode | IntroSceneNode | DialogueDefNode | ProseDocNode;

export interface NarrativeDoc {
  readonly file: string;
  readonly blocks: BlockNode[];
}

/** The rung/intro scenes of a doc (the common scene shape). */
export function scenesOf(doc: NarrativeDoc): (RungSceneNode | IntroSceneNode)[] {
  return doc.blocks.filter((b) => b.kind === 'rung' || b.kind === 'scene');
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

const RE_RUNG = /^## rung (\S+) · (\S+)\s*$/;
const RE_SCENE = /^## scene (\S+)\s*$/;
const RE_DIALOGUE = /^## dialogue (\S+) · (\S+)\s*$/;
const RE_PROSE = /^## prose (\S+)\s*$/;
const RE_TOPIC = /^### ask ([a-z0-9-]+) · (.+)$/;
const RE_DECIDE = /^### decide · (.+)$/;
const RE_LINE = /^### line ([a-z0-9-]+)\s*$/;
const RE_KEY = /^### (\S+)\s*$/;
const RE_OPTION = /^#### ([a-z0-9-]+) · (.+)$/;
const RE_ANNOTATION = /^([a-z-]+): (.*)$/;
// A speech line: a display-name token (starts uppercase, may carry ' (voice)'), colon, text.
const RE_SPEECH = /^(\p{Lu}[^:()]*?)(?: \(([a-z-]+)\))?: (.*)$/u;
// A bare reuse-reference line (narrator voice), e.g. `@cold-open.wake`.
const RE_REF = /^@[a-z-]+\.\S+$/;

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

/** Parse `stat: +int -str` (accepts ASCII '-' and U+2212 '−'). */
function parseStat(raw: string, loc: Loc): { up: string; down: string } {
  const m = /^\+([a-z]+) [-−]([a-z]+)$/.exec(raw.trim());
  if (!m) throw new NarrativeError(loc, `bad stat "${raw}" — expected "+<attr> -<attr>"`);
  return { up: m[1]!, down: m[2]! };
}

/** Parse `perk: <Name> — <desc>`. */
function parsePerk(raw: string, loc: Loc): { name: string; desc: string } {
  const m = /^(.+?) — (.+)$/.exec(raw);
  if (!m) throw new NarrativeError(loc, `bad perk "${raw}" — expected "<Name> — <desc>"`);
  return { name: m[1]!, desc: m[2]! };
}

/** Parse `when: raked` | `when: soan.regard is grateful` | `when: soan.regard not grateful`. */
function parseWhen(raw: string, loc: Loc): WhenGate {
  const mem = /^([a-z-]+)\.regard (is|not) (\S+)$/.exec(raw.trim());
  if (mem) return { type: 'regard', npc: mem[1]!, op: mem[2] as 'is' | 'not', value: mem[3]! };
  const flag = /^([a-z][a-z0-9-]*)$/.exec(raw.trim());
  if (flag) return { type: 'flag', flag: flag[1]! };
  throw new NarrativeError(
    loc,
    `bad when "${raw}" — expected "<flag>" or "<npc>.regard is|not <value>"`,
  );
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
  | { type: 'plain'; text: string; loc: Loc } // dialogue-line / prose-entry body text
  | { type: 'annotation'; key: string; value: string; loc: Loc };

type Section =
  | 'meta'
  | 'greeting'
  | 'topic'
  | 'decision'
  | 'dialogue' // between `## dialogue` and its first `### line`
  | 'dialogue-line'
  | 'prose' // between `## prose` and its first `### <key>`
  | 'prose-entry';

export function parseNarrative(source: string, file: string): NarrativeDoc {
  const lines = source.split('\n');
  const blocks: BlockNode[] = [];

  let scene: RungSceneNode | IntroSceneNode | undefined;
  let dialogue: DialogueDefNode | undefined;
  let prose: ProseDocNode | undefined;
  let section: Section = 'meta';
  let topic: TopicNode | undefined;
  let option: OptionNode | undefined;
  let dline: DialogueLineNode | undefined;
  let pentry: { key: string; text: string; loc: Loc } | undefined;
  let open: OpenPara | undefined;
  let inComment = false;

  const fail = (line: number, msg: string): never => {
    throw new NarrativeError({ file, line }, msg);
  };

  const resetBlock = (): void => {
    scene = undefined;
    dialogue = undefined;
    prose = undefined;
    topic = undefined;
    option = undefined;
    dline = undefined;
    pentry = undefined;
  };

  /** Close the open paragraph/annotation, committing it to its context. */
  const close = (): void => {
    if (!open) return;
    const o = open;
    open = undefined;
    if (o.type === 'plain') {
      if (dline) {
        dline.text = dline.text === '' ? o.text : `${dline.text}\n${o.text}`;
        if (dline.text.includes('\n')) {
          return fail(o.loc.line, 'a dialogue line takes exactly one paragraph');
        }
      } else if (pentry) {
        if (pentry.text !== '')
          return fail(o.loc.line, 'a prose entry takes exactly one paragraph');
        pentry.text = o.text;
      } else {
        return fail(o.loc.line, 'plain prose outside a dialogue line / prose entry');
      }
      return;
    }
    if (o.type === 'annotation') {
      const { key, value, loc } = o;
      if (section === 'meta') {
        if (!scene) return fail(loc.line, 'meta annotation outside a scene');
        const known =
          scene.kind === 'rung' ? ['speaker', 'voice', 'motivates'] : ['speaker', 'voice'];
        if (!known.includes(key)) {
          return fail(loc.line, `unknown scene meta key "${key}" (${known.join('/')})`);
        }
        if (scene.meta.has(key)) return fail(loc.line, `duplicate scene meta "${key}"`);
        scene.meta.set(key, { value, loc });
      } else if (section === 'dialogue' && dialogue) {
        if (key !== 'unrouted') return fail(loc.line, `unknown dialogue meta key "${key}"`);
        dialogue.unrouted = value.trim();
      } else if (section === 'dialogue-line' && dline) {
        if (key === 'voice') dline.voice = value.trim();
        else if (key === 'when') dline.when = parseWhen(value, loc);
        else return fail(loc.line, `unknown dialogue-line key "${key}" (voice/when)`);
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
          case 'stat':
            option.stat = parseStat(value, loc);
            break;
          case 'perk':
            option.perk = parsePerk(value, loc);
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
    // prose paragraph (speech / narrator / reference)
    const node = o.node as unknown as ProseLine;
    if (option) {
      if (option.react)
        return fail(node.loc.line, `option "${option.id}" already has a react line`);
      option.react = node;
    } else if (topic && section === 'topic') {
      topic.answer.push(node);
    } else if (scene && (section === 'greeting' || section === 'meta')) {
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
      else if (open.type === 'plain') open.text += ' ' + raw.trim();
      else open.node.text += ' ' + raw.trim();
      continue;
    }

    // ── block headings ──
    const rungM = RE_RUNG.exec(raw);
    const sceneM = RE_SCENE.exec(raw);
    const dialogueM = RE_DIALOGUE.exec(raw);
    const proseM = RE_PROSE.exec(raw);
    if (rungM || sceneM) {
      close();
      resetBlock();
      scene = rungM
        ? {
            kind: 'rung',
            rankKey: rungM[1]!,
            id: rungM[2]!,
            meta: new Map(),
            greeting: [],
            topics: [],
            loc: { file, line: n },
          }
        : {
            kind: 'scene',
            id: sceneM![1]!,
            meta: new Map(),
            greeting: [],
            topics: [],
            loc: { file, line: n },
          };
      blocks.push(scene);
      section = 'meta';
      continue;
    }
    if (dialogueM) {
      close();
      resetBlock();
      dialogue = {
        kind: 'dialogue',
        id: dialogueM[1]!,
        speakerKey: dialogueM[2]!,
        lines: [],
        loc: { file, line: n },
      };
      blocks.push(dialogue);
      section = 'dialogue';
      continue;
    }
    if (proseM) {
      close();
      resetBlock();
      prose = { kind: 'prose', id: proseM[1]!, entries: [], loc: { file, line: n } };
      blocks.push(prose);
      section = 'prose';
      continue;
    }
    if (raw.startsWith('## ')) return fail(n, `unrecognized block heading "${raw}"`) as never;

    // ── sub-headings ──
    if (dialogue) {
      const lineM = RE_LINE.exec(raw);
      if (lineM) {
        close();
        dline = { id: lineM[1]!, text: '', loc: { file, line: n } };
        dialogue.lines.push(dline);
        section = 'dialogue-line';
        continue;
      }
      if (raw.startsWith('#'))
        return fail(n, `unrecognized heading in a dialogue def: "${raw}"`) as never;
    }
    if (prose) {
      const keyM = RE_KEY.exec(raw);
      if (keyM) {
        close();
        pentry = { key: keyM[1]!, text: '', loc: { file, line: n } };
        prose.entries.push(pentry);
        section = 'prose-entry';
        continue;
      }
      if (raw.startsWith('#'))
        return fail(n, `unrecognized heading in a prose block: "${raw}"`) as never;
    }

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

    // ── body text ──
    // Dialogue-line / prose-entry bodies are PLAIN prose: no speech classification
    // (their text may legitimately contain "Name: …" shapes mid-sentence).
    if (section === 'dialogue-line' || section === 'prose-entry') {
      const annM = RE_ANNOTATION.exec(raw);
      if (annM && RESERVED.has(annM[1]!) && open?.type !== 'plain') {
        close();
        open = { type: 'annotation', key: annM[1]!, value: annM[2]!, loc: { file, line: n } };
        continue;
      }
      if (open?.type === 'plain') open.text += ' ' + raw.trim();
      else {
        close();
        open = { type: 'plain', text: raw, loc: { file, line: n } };
      }
      continue;
    }

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

    // A bare reuse reference (`@cold-open.wake`) — a narrator-voiced reused line.
    if (RE_REF.test(raw)) {
      close();
      open = { type: 'prose', node: { kind: 'narr', text: raw.trim(), loc: { file, line: n } } };
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
      else if (open.type === 'plain') open.text += ' ' + raw.trim();
      else open.node.text += ' ' + raw.trim();
      continue;
    }
    return fail(n, `cannot classify line: "${raw}"`) as never;
  }
  close();

  // Structural floor (the deeper roster is validate.ts): every scene decides; every
  // option reacts; dialogue lines and prose entries carry text.
  for (const b of blocks) {
    if (b.kind === 'rung' || b.kind === 'scene') {
      if (!b.decision) throw new NarrativeError(b.loc, `scene "${b.id}" has no decide block`);
      if (b.decision.options.length === 0) {
        throw new NarrativeError(b.decision.loc, `scene "${b.id}" decide block has no options`);
      }
      for (const o of b.decision.options) {
        if (!o.react) throw new NarrativeError(o.loc, `option "${o.id}" has no react line`);
      }
    } else if (b.kind === 'dialogue') {
      for (const l of b.lines) {
        if (l.text === '') throw new NarrativeError(l.loc, `dialogue line "${l.id}" has no text`);
      }
    } else {
      for (const e of b.entries) {
        if (e.text === '') throw new NarrativeError(e.loc, `prose entry "${e.key}" has no text`);
      }
    }
  }

  return { file, blocks };
}
