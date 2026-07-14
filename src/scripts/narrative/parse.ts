// Narrative authoring-format parser (FB-5) — structured markdown → AST.
//
// The story is authored as prose-first markdown in `src/core/content/narrative/`
// (the source of truth); this parser turns one file into an AST that `emit.ts`
// compiles to a generated `.ts` registry. The grammar is documented in
// `src/core/content/narrative/README.md` — keep the two in sync.
//
// Block kinds: `## rung` (rung beats), `## scene` (intro dialogue scenes),
// `## scene-def` (generalized VN scenes — storywave G3.5), `## dialogue`
// (teach-by-reveal line registries), `## prose` (keyed prose constants — the
// cold open / flavor), and `## requirements` (the hidden rung lists). Every node
// carries its authoring file:line so validation errors point at the `.md` the
// author should edit, never at generated output.

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

/** The AUTHORED id of a prose line — its `<!--#slug-->` marker (ADR-186's "known limit", closed).
 *
 *  A greeting line and a topic answer are addressed in the save's log as `greeting.<id>` /
 *  `topic.<t>.answer.<id>`. Before ids they were addressed by INDEX, so re-ordering or deleting a
 *  line in the .md silently re-pointed an old save's log entry at its NEIGHBOUR — and the orphan
 *  sensor could not see it, because the index still resolved. The id travels WITH the line, so a
 *  reorder is now a no-op and a REWORD still reaches every existing save (which a text-derived id
 *  could not do — it would orphan on the very edit the re-voice waves exist to make).
 *
 *  The marker is an HTML comment ON PURPOSE (human, 2026-07-13): these files are authored to READ
 *  as a script in any markdown preview, and a comment renders as nothing. */
export type LineId = string;

export interface SpeechLine {
  readonly kind: 'speech';
  /** The display-name token as written (e.g. 'Kihei', 'Yohei') — resolved by emit. */
  readonly speaker: string;
  /** Explicit `(voice)` override; absent ⇒ the speaker's registered NPC voice. */
  readonly voice?: string;
  /** The line verbatim, hard-wraps rejoined with single spaces (quotes included).
   *  A text of the form `@file.key` / `@dialogue.<def>/<line>` is a REUSE reference. */
  readonly text: string;
  /** The `<!--#slug-->` marker above the line. Required on greeting + answer lines (validate). */
  readonly id?: LineId;
  readonly loc: Loc;
}

export interface NarrLine {
  readonly kind: 'narr';
  readonly text: string;
  /** The `<!--#slug-->` marker above the line. Required on greeting + answer lines (validate). */
  readonly id?: LineId;
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
  bonus?: {
    readonly amount: number;
    readonly attr: string;
    readonly note: string;
  };
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

/** How a `## scene-def` enters the queue (mirrors `content/scenes.ts`'s `SceneTrigger`).
 *  Parsed leniently: the trigger STRING is validated in validate.ts so a malformed trigger
 *  is a VALIDATION error (cites the .md file:line), never a hard parse throw. */
export type SceneTriggerAst =
  | { readonly kind: 'rung'; readonly rung: string }
  | { readonly kind: 'season-exit'; readonly season: string }
  | { readonly kind: 'flag'; readonly flag: string }
  | { readonly kind: 'verb' }
  | { readonly kind: 'scripted' };

/** Parse a `trigger:` spec into a `SceneTriggerAst`, or a reason it is malformed. Shared by
 *  emit + validate so the two never disagree (validate REDs the reason; emit throws defensively
 *  — validate runs first, so a compiled build never reaches the throw). */
export function parseSceneTrigger(
  raw: string,
):
  | { readonly ok: true; readonly trigger: SceneTriggerAst }
  | { readonly ok: false; readonly reason: string } {
  const s = raw.trim();
  if (s === 'verb') return { ok: true, trigger: { kind: 'verb' } };
  if (s === 'scripted') return { ok: true, trigger: { kind: 'scripted' } };
  if (s === 'rung' || s.startsWith('rung ')) {
    const rung = s.slice('rung'.length).trim();
    if (!/^R[0-7]$/.test(rung)) {
      return {
        ok: false,
        reason: `rung trigger needs a rank R0–R7 (rung <R#>), got "${rung || '(none)'}"`,
      };
    }
    return { ok: true, trigger: { kind: 'rung', rung } };
  }
  if (s === 'season-exit' || s.startsWith('season-exit ')) {
    const season = s.slice('season-exit'.length).trim();
    if (!season)
      return {
        ok: false,
        reason: 'season-exit trigger needs a season (season-exit <season>)',
      };
    return { ok: true, trigger: { kind: 'season-exit', season } };
  }
  if (s === 'flag' || s.startsWith('flag ')) {
    const flag = s.slice('flag'.length).trim();
    // Underscores allowed (C4.1): the QUEST engine's completion flags are snake_case
    // (`quest_orchard_chain_done`) and a flag trigger must be able to name a REAL flag.
    if (!/^[a-z][a-z0-9_-]*$/.test(flag)) {
      return {
        ok: false,
        reason: `flag trigger needs a flag id (flag <id>), got "${flag || '(none)'}"`,
      };
    }
    return { ok: true, trigger: { kind: 'flag', flag } };
  }
  return {
    ok: false,
    reason: `unknown trigger "${s}" (rung <R#> / season-exit <season> / flag <id> / verb / scripted)`,
  };
}

/** A generalized scene (`## scene-def <id>`) — storywave G3.5 / FB-5. Reuses the rung-scene
 *  body grammar (greeting + optional topics + OPTIONAL decision), plus a `trigger:` and an
 *  optional `once:`; compiles to a `SceneDef` (`content/scenes.ts`) with the shared `RungScene`
 *  payload. A decision-LESS scene-def is the speakerless narration-only beat (R2's silent rung,
 *  ADR-165): the emitter synthesizes an empty decision so the engine's narration-only path
 *  (`decision.options.length === 0`) drives it. */
export interface SceneDefNode {
  readonly kind: 'scene-def';
  readonly id: string;
  /** Raw `key: value` meta (trigger / once / voice / speaker / motivates). */
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

/** A parsed `### req <id> · <spec>` requirement spec (FB-121 / ADR-137). The declared
 *  grammar stays THIS small — anything it can't say is `native <key>` (FB-5), never a
 *  grammar extension. Mirrors core/requirements-engine's RequirementDef shapes. */
export type ReqSpec =
  | { readonly type: 'count'; readonly token: string; readonly target: number }
  | { readonly type: 'flag'; readonly flag: string }
  | {
      readonly type: 'state';
      readonly pred:
        | {
            readonly kind: 'resource';
            readonly res: string;
            readonly min: number;
          }
        | {
            readonly kind: 'banked';
            readonly res: string;
            readonly min: number;
          }
        | { readonly kind: 'belonging'; readonly id: string }
        | {
            readonly kind: 'skill';
            readonly skill: string;
            readonly min: number;
          }
        | { readonly kind: 'native'; readonly key: string };
    };

export interface ReqEntryNode {
  readonly id: string;
  readonly spec: ReqSpec;
  /** The authored diegetic completion line (story voice) — required. */
  flavor?: string;
  /** The Progress-tab statement of the finished work (HD-41) — required. */
  objective?: string;
  /** The sim-bot satisfaction hint (Phase 5) — required from day one. */
  drive?: string;
  readonly loc: Loc;
}

/** A `## requirements R0` block (requirements.md) — one rung's hidden list. */
export interface RequirementsNode {
  readonly kind: 'requirements';
  readonly rankKey: string;
  readonly reqs: ReqEntryNode[];
  readonly loc: Loc;
}

export type BlockNode =
  | RungSceneNode
  | IntroSceneNode
  | SceneDefNode
  | DialogueDefNode
  | ProseDocNode
  | RequirementsNode;

export interface NarrativeDoc {
  readonly file: string;
  readonly blocks: BlockNode[];
}

/** The rung/intro scenes of a doc (the common scene shape). */
export function scenesOf(
  doc: NarrativeDoc,
): (RungSceneNode | IntroSceneNode)[] {
  return doc.blocks.filter((b) => b.kind === 'rung' || b.kind === 'scene');
}

/** Reserved annotation keys — a `key: value` line whose key is here is NEVER a speech line. */
const RESERVED = new Set([
  'speaker',
  'voice',
  'title',
  'motivates',
  'trigger',
  'once',
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
  'flavor',
  'objective',
  'drive',
]);

const RE_RUNG = /^## rung (\S+) · (\S+)\s*$/;
const RE_REQS = /^## requirements (R[0-7])\s*$/;
const RE_REQ = /^### req ([a-z0-9-]+) · (.+)$/;
const RE_SCENE = /^## scene (\S+)\s*$/;
const RE_SCENEDEF = /^## scene-def (\S+)\s*$/;
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
/** `<!--#the-slug-->` — the authored id of the prose line beneath it (see `LineId`). */
const RE_LINE_ID = /^<!--#([a-z0-9][a-z0-9-]*)-->$/;

/** Parse `memory: kihei +1 (disciplined)` / `genemon +0, kihei +1 (friend)`. */
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
function parseBonus(
  raw: string,
  loc: Loc,
): { amount: number; attr: string; note: string } {
  const m = /^\+(\d+) ([a-z]+) — "(.+)"$/.exec(raw);
  if (!m) {
    throw new NarrativeError(
      loc,
      `bad bonus "${raw}" — expected '+N <attr> — "<note>"'`,
    );
  }
  return { amount: Number(m[1]), attr: m[2]!, note: m[3]! };
}

/** Parse `stat: +int -str` (accepts ASCII '-' and U+2212 '−'). */
function parseStat(raw: string, loc: Loc): { up: string; down: string } {
  const m = /^\+([a-z]+) [-−]([a-z]+)$/.exec(raw.trim());
  if (!m)
    throw new NarrativeError(
      loc,
      `bad stat "${raw}" — expected "+<attr> -<attr>"`,
    );
  return { up: m[1]!, down: m[2]! };
}

/** Parse `perk: <Name> — <desc>`. */
function parsePerk(raw: string, loc: Loc): { name: string; desc: string } {
  const m = /^(.+?) — (.+)$/.exec(raw);
  if (!m)
    throw new NarrativeError(
      loc,
      `bad perk "${raw}" — expected "<Name> — <desc>"`,
    );
  return { name: m[1]!, desc: m[2]! };
}

/** Parse `when: raked` | `when: soan.regard is grateful` | `when: soan.regard not grateful`. */
function parseWhen(raw: string, loc: Loc): WhenGate {
  const mem = /^([a-z-]+)\.regard (is|not) (\S+)$/.exec(raw.trim());
  if (mem)
    return {
      type: 'regard',
      npc: mem[1]!,
      op: mem[2] as 'is' | 'not',
      value: mem[3]!,
    };
  const flag = /^([a-z][a-z0-9-]*)$/.exec(raw.trim());
  if (flag) return { type: 'flag', flag: flag[1]! };
  throw new NarrativeError(
    loc,
    `bad when "${raw}" — expected "<flag>" or "<npc>.regard is|not <value>"`,
  );
}

/** Parse a `### req` spec (FB-121). Forms — the WHOLE declared grammar:
 *    count <verb:subject> <N> · flag <flag-id> · native <key>
 *    state resource|banked <res> >= <N> · state belonging <id> · state skill <id> >= <N> */
function parseReqSpec(raw: string, loc: Loc): ReqSpec {
  const spec = raw.trim();
  let m = /^count ([a-z_]+:[a-z0-9_-]+) (\d+)$/.exec(spec);
  if (m) {
    const target = Number(m[2]);
    if (target < 1)
      throw new NarrativeError(loc, `count target must be ≥ 1 (got ${target})`);
    return { type: 'count', token: m[1]!, target };
  }
  m = /^flag ([a-z][a-z0-9-]*)$/.exec(spec);
  if (m) return { type: 'flag', flag: m[1]! };
  m = /^state (resource|banked) ([a-z_]+) >= (\d+)$/.exec(spec);
  if (m) {
    const kind = m[1] as 'resource' | 'banked';
    return { type: 'state', pred: { kind, res: m[2]!, min: Number(m[3]) } };
  }
  m = /^state belonging ([a-z0-9_-]+)$/.exec(spec);
  if (m) return { type: 'state', pred: { kind: 'belonging', id: m[1]! } };
  m = /^state skill ([a-z_]+) >= (\d+)$/.exec(spec);
  if (m)
    return {
      type: 'state',
      pred: { kind: 'skill', skill: m[1]!, min: Number(m[2]) },
    };
  m = /^native ([a-z0-9-]+)$/.exec(spec);
  if (m) return { type: 'state', pred: { kind: 'native', key: m[1]! } };
  throw new NarrativeError(
    loc,
    `bad req spec "${spec}" — expected "count <verb:subject> <N>", "flag <id>", ` +
      `"state resource|banked <res> >= <N>", "state belonging <id>", ` +
      `"state skill <id> >= <N>", or "native <key>"`,
  );
}

/** True when `text`, placed at column 0, would be re-classified as a structural marker —
 *  used by writers/wrappers to avoid a hard-wrap landing on an ambiguous continuation line. */
export function looksLikeMarker(text: string): boolean {
  if (text.startsWith('>') || text.startsWith('#') || text.startsWith('<!--'))
    return true;
  const ann = RE_ANNOTATION.exec(text);
  if (ann && RESERVED.has(ann[1]!)) return true;
  return RE_SPEECH.test(text);
}

type OpenPara =
  | {
      type: 'prose';
      node: { kind: 'narr' | 'speech'; text: string } & Record<string, unknown>;
    }
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
  | 'prose-entry'
  | 'requirements' // between `## requirements` and its first `### req`
  | 'req-entry';

export function parseNarrative(source: string, file: string): NarrativeDoc {
  const lines = source.split('\n');
  const blocks: BlockNode[] = [];

  let scene: RungSceneNode | IntroSceneNode | SceneDefNode | undefined;
  let dialogue: DialogueDefNode | undefined;
  let prose: ProseDocNode | undefined;
  let reqs: RequirementsNode | undefined;
  let rentry: ReqEntryNode | undefined;
  let section: Section = 'meta';
  let topic: TopicNode | undefined;
  let option: OptionNode | undefined;
  let dline: DialogueLineNode | undefined;
  let pentry: { key: string; text: string; loc: Loc } | undefined;
  let open: OpenPara | undefined;
  let inComment = false;
  /** The `<!--#slug-->` seen above the next prose block, consumed when that block opens. */
  let pendingId: LineId | undefined;

  const fail = (line: number, msg: string): never => {
    throw new NarrativeError({ file, line }, msg);
  };

  const resetBlock = (): void => {
    scene = undefined;
    dialogue = undefined;
    prose = undefined;
    reqs = undefined;
    rentry = undefined;
    topic = undefined;
    option = undefined;
    dline = undefined;
    pentry = undefined;
  };

  /** Consume the `<!--#slug-->` seen above this block, if any — a marker binds to exactly ONE
   *  prose line, so it is cleared as it is taken. Spread into the node so an id-less line (an
   *  option's say/react, a dialogue line — already addressed by their own ids) carries no field. */
  const takeId = (): { id?: LineId } => {
    if (pendingId === undefined) return {};
    const id = pendingId;
    pendingId = undefined;
    return { id };
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
          return fail(
            o.loc.line,
            'a dialogue line takes exactly one paragraph',
          );
        }
      } else if (pentry) {
        if (pentry.text !== '')
          return fail(o.loc.line, 'a prose entry takes exactly one paragraph');
        pentry.text = o.text;
      } else {
        return fail(
          o.loc.line,
          'plain prose outside a dialogue line / prose entry',
        );
      }
      return;
    }
    if (o.type === 'annotation') {
      const { key, value, loc } = o;
      if (section === 'meta') {
        if (!scene) return fail(loc.line, 'meta annotation outside a scene');
        const known =
          scene.kind === 'rung'
            ? ['speaker', 'voice', 'motivates']
            : scene.kind === 'scene-def'
              ? ['trigger', 'once', 'voice', 'speaker', 'motivates']
              : // FB-362 — `title:` is the intro scene's per-scene 幕-head display label
                // (stamped as the log `context`, splitting the cold open into act cards).
                ['speaker', 'voice', 'title'];
        if (!known.includes(key)) {
          return fail(
            loc.line,
            `unknown scene meta key "${key}" (${known.join('/')})`,
          );
        }
        if (scene.meta.has(key))
          return fail(loc.line, `duplicate scene meta "${key}"`);
        scene.meta.set(key, { value, loc });
      } else if (section === 'dialogue' && dialogue) {
        if (key !== 'unrouted')
          return fail(loc.line, `unknown dialogue meta key "${key}"`);
        dialogue.unrouted = value.trim();
      } else if (section === 'dialogue-line' && dline) {
        if (key === 'voice') dline.voice = value.trim();
        else if (key === 'when') dline.when = parseWhen(value, loc);
        else
          return fail(
            loc.line,
            `unknown dialogue-line key "${key}" (voice/when)`,
          );
      } else if (section === 'req-entry' && rentry) {
        if (key === 'flavor') {
          if (rentry.flavor !== undefined)
            return fail(loc.line, 'duplicate req flavor');
          rentry.flavor = value.trim();
        } else if (key === 'objective') {
          if (rentry.objective !== undefined)
            return fail(loc.line, 'duplicate req objective');
          rentry.objective = value.trim();
        } else if (key === 'drive') {
          if (rentry.drive !== undefined)
            return fail(loc.line, 'duplicate req drive');
          rentry.drive = value.trim();
        } else {
          return fail(
            loc.line,
            `unknown req annotation "${key}" (flavor/objective/drive)`,
          );
        }
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
        if (key !== 'after')
          return fail(loc.line, `unknown topic annotation "${key}"`);
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
        return fail(
          node.loc.line,
          `option "${option.id}" already has a react line`,
        );
      option.react = node;
    } else if (topic && section === 'topic') {
      topic.answer.push(node);
    } else if (scene && (section === 'greeting' || section === 'meta')) {
      scene.greeting.push(node);
    } else {
      return fail(
        node.loc.line,
        'prose in an unexpected position (before any scene?)',
      );
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i]!;
    const n = i + 1;

    // HTML comments are authorial notes — skipped entirely (may span lines). The ONE exception is
    // the `<!--#slug-->` line-id marker, which binds to the prose block directly beneath it.
    if (inComment) {
      if (raw.includes('-->')) inComment = false;
      continue;
    }
    if (raw.trimStart().startsWith('<!--')) {
      close();
      const idM = RE_LINE_ID.exec(raw.trim());
      if (idM) {
        if (pendingId !== undefined) {
          return fail(
            n,
            `line-id "#${pendingId}" has no prose line under it`,
          ) as never;
        }
        pendingId = idM[1]!;
        continue;
      }
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
      if (!open)
        return fail(
          n,
          'indented continuation with nothing open above it',
        ) as never;
      if (open.type === 'annotation') open.value += ' ' + raw.trim();
      else if (open.type === 'plain') open.text += ' ' + raw.trim();
      else open.node.text += ' ' + raw.trim();
      continue;
    }

    // ── block headings ──
    // A line-id marker binds DOWNWARD to a prose line; a heading beneath one means the author
    // labelled nothing (a rename that outran its line, a deleted block). Loud, never silent — a
    // dropped id is a log entry that will orphan on the next load.
    if (pendingId !== undefined && raw.startsWith('#')) {
      return fail(
        n,
        `line-id "#${pendingId}" has no prose line under it`,
      ) as never;
    }
    const rungM = RE_RUNG.exec(raw);
    const sceneDefM = RE_SCENEDEF.exec(raw);
    const sceneM = sceneDefM ? null : RE_SCENE.exec(raw);
    const dialogueM = RE_DIALOGUE.exec(raw);
    const proseM = RE_PROSE.exec(raw);
    if (sceneDefM) {
      close();
      resetBlock();
      scene = {
        kind: 'scene-def',
        id: sceneDefM[1]!,
        meta: new Map(),
        greeting: [],
        topics: [],
        loc: { file, line: n },
      };
      blocks.push(scene);
      section = 'meta';
      continue;
    }
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
      prose = {
        kind: 'prose',
        id: proseM[1]!,
        entries: [],
        loc: { file, line: n },
      };
      blocks.push(prose);
      section = 'prose';
      continue;
    }
    const reqsM = RE_REQS.exec(raw);
    if (reqsM) {
      close();
      resetBlock();
      reqs = {
        kind: 'requirements',
        rankKey: reqsM[1]!,
        reqs: [],
        loc: { file, line: n },
      };
      blocks.push(reqs);
      section = 'requirements';
      continue;
    }
    if (raw.startsWith('## '))
      return fail(n, `unrecognized block heading "${raw}"`) as never;

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
        return fail(
          n,
          `unrecognized heading in a dialogue def: "${raw}"`,
        ) as never;
    }
    if (reqs) {
      const reqM = RE_REQ.exec(raw);
      if (reqM) {
        close();
        const loc = { file, line: n };
        rentry = { id: reqM[1]!, spec: parseReqSpec(reqM[2]!, loc), loc };
        reqs.reqs.push(rentry);
        section = 'req-entry';
        continue;
      }
      if (raw.startsWith('#'))
        return fail(
          n,
          `unrecognized heading in a requirements block: "${raw}"`,
        ) as never;
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
        return fail(
          n,
          `unrecognized heading in a prose block: "${raw}"`,
        ) as never;
    }

    const topicM = RE_TOPIC.exec(raw);
    if (topicM) {
      close();
      if (!scene) return fail(n, 'topic outside a scene') as never;
      if (section === 'decision')
        return fail(n, 'ask-topic after the decide block') as never;
      topic = {
        id: topicM[1]!,
        label: topicM[2]!,
        answer: [],
        loc: { file, line: n },
      };
      scene.topics.push(topic);
      section = 'topic';
      continue;
    }

    const decideM = RE_DECIDE.exec(raw);
    if (decideM) {
      close();
      if (!scene) return fail(n, 'decide outside a scene') as never;
      if (scene.decision)
        return fail(n, 'a scene takes exactly one decide block') as never;
      scene.decision = {
        prompt: decideM[1]!,
        options: [],
        loc: { file, line: n },
      };
      section = 'decision';
      topic = undefined;
      option = undefined;
      continue;
    }

    const optionM = RE_OPTION.exec(raw);
    if (optionM) {
      close();
      if (!scene?.decision)
        return fail(n, 'option outside a decide block') as never;
      option = { id: optionM[1]!, label: optionM[2]!, loc: { file, line: n } };
      scene.decision.options.push(option);
      continue;
    }
    if (raw.startsWith('#'))
      return fail(n, `unrecognized heading "${raw}"`) as never;

    // ── body text ──
    // Dialogue-line / prose-entry bodies are PLAIN prose: no speech classification
    // (their text may legitimately contain "Name: …" shapes mid-sentence).
    if (section === 'dialogue-line' || section === 'prose-entry') {
      const annM = RE_ANNOTATION.exec(raw);
      if (annM && RESERVED.has(annM[1]!) && open?.type !== 'plain') {
        close();
        open = {
          type: 'annotation',
          key: annM[1]!,
          value: annM[2]!,
          loc: { file, line: n },
        };
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
        open = {
          type: 'prose',
          node: {
            kind: 'narr',
            text: narrM[1]!,
            ...takeId(),
            loc: { file, line: n },
          },
        };
      }
      continue;
    }

    // A bare reuse reference (`@cold-open.wake`) — a narrator-voiced reused line.
    if (RE_REF.test(raw)) {
      close();
      open = {
        type: 'prose',
        node: {
          kind: 'narr',
          text: raw.trim(),
          ...takeId(),
          loc: { file, line: n },
        },
      };
      continue;
    }

    const annM = RE_ANNOTATION.exec(raw);
    if (annM && RESERVED.has(annM[1]!)) {
      close();
      open = {
        type: 'annotation',
        key: annM[1]!,
        value: annM[2]!,
        loc: { file, line: n },
      };
      continue;
    }

    const speechM = RE_SPEECH.exec(raw);
    if (speechM) {
      close();
      const node: {
        kind: 'speech';
        speaker: string;
        voice?: string;
        text: string;
        id?: LineId;
        loc: Loc;
      } = {
        kind: 'speech',
        speaker: speechM[1]!,
        text: speechM[3]!,
        ...takeId(),
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
      if (!b.decision)
        throw new NarrativeError(b.loc, `scene "${b.id}" has no decide block`);
      if (b.decision.options.length === 0) {
        throw new NarrativeError(
          b.decision.loc,
          `scene "${b.id}" decide block has no options`,
        );
      }
      for (const o of b.decision.options) {
        if (!o.react)
          throw new NarrativeError(o.loc, `option "${o.id}" has no react line`);
      }
    } else if (b.kind === 'scene-def') {
      // A scene-def's decision is OPTIONAL (a decision-less scene-def is the narration-only
      // beat — the engine drives it via the empty-options path). When present, it must have
      // options and every option must react (same floor as a rung/intro scene).
      if (b.decision) {
        if (b.decision.options.length === 0) {
          throw new NarrativeError(
            b.decision.loc,
            `scene-def "${b.id}" decide block has no options`,
          );
        }
        for (const o of b.decision.options) {
          if (!o.react)
            throw new NarrativeError(
              o.loc,
              `option "${o.id}" has no react line`,
            );
        }
      }
    } else if (b.kind === 'dialogue') {
      for (const l of b.lines) {
        if (l.text === '')
          throw new NarrativeError(
            l.loc,
            `dialogue line "${l.id}" has no text`,
          );
      }
    } else if (b.kind === 'requirements') {
      if (b.reqs.length === 0) {
        throw new NarrativeError(
          b.loc,
          `requirements ${b.rankKey} lists no requirements`,
        );
      }
      for (const r of b.reqs) {
        if (!r.flavor)
          throw new NarrativeError(r.loc, `req "${r.id}" has no flavor line`);
        // HD-41 — the Progress tab shows the work, not the story prose: every requirement
        // states the labour it just finished (the Story keeps the overheard flavor line).
        if (!r.objective)
          throw new NarrativeError(
            r.loc,
            `req "${r.id}" has no objective line`,
          );
        if (!r.drive)
          throw new NarrativeError(r.loc, `req "${r.id}" has no drive hint`);
      }
    } else {
      for (const e of b.entries) {
        if (e.text === '')
          throw new NarrativeError(e.loc, `prose entry "${e.key}" has no text`);
      }
    }
  }

  return { file, blocks };
}
