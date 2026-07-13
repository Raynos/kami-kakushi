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
import {
  DIALOGUE_SCENES,
  introSceneOption,
  introPerkLine,
  type DialogueScene,
  type DialogueTopic,
  type IntroSetupLine,
} from './intro';
import { ACTIVITIES, activityLine, type LabourResource } from './activities';
import { rakeLine } from './coldOpen';
import { homeRestLine } from './home';
import { dialogueLineText } from './dialogue';
import { RUNG_REQUIREMENTS, requirementFlavor } from './requirements';
import { NIGHT_ROUNDS } from './nightRounds';
import { ESTATE_STAGES } from './estate';
import { RECIPES } from './crafting';
import { BELONGINGS } from './home';
import { judgeLine } from './flavor';
// TYPE-only (erased at runtime), so importing from the pillars reducer cannot create a cycle.
import type { Grade } from '../pillars';

/** A namespace resolver: given the key's tail (everything after the first dot) + params, render.
 *  Returns undefined when the id is unknown to the registry — a content id that src/ has since
 *  renamed. The caller then falls back to the entry's stored text (codec.ts), so an old save
 *  degrades to its frozen prose rather than losing the line. */
type Resolver = (id: string, params: LogParams) => string | undefined;

// ── the DEV story-take overlay (session-200 ruling: a DEV switch re-renders EVERYTHING) ─────
// dev.ts syncs the EFFECTIVE take defs here on every set/unit change, and the resolvers below
// read through them — so renderLogLine (the DEV log repaint AND a save load) voices the
// selected takes for scene-shaped units, the same way dialogue.ts's own overlay covers
// dialogue lines. Without this, a take flip only reached the VN render path (dev.subX) and
// every already-LOGGED intro/beat/scene/flavor line kept reading canon — the human's
// hd38-w4-intro bug report. null = all canon; prod never calls the setter (strip-checked
// via the DEV panel being the only caller).
interface LogTakeOverrides {
  readonly intro?: Readonly<Record<string, DialogueScene>>;
  readonly rung?: Readonly<Partial<Record<RankId, RungScene>>>;
  readonly scene?: Readonly<Record<string, RungScene>>;
  readonly flavor?: Readonly<Record<string, string>>;
}
let LOG_TAKES: LogTakeOverrides | null = null;

/** DEV-only (the story set-switcher): overlay the log's take-swappable registries. */
export function __setLogTakeOverrides(o: LogTakeOverrides | null): void {
  LOG_TAKES = o;
}

/** A flavor key's effective prose — the active take's if set, else canon FLAVOR. */
const effFlavor = (key: string): string | undefined =>
  LOG_TAKES?.flavor?.[key] ?? (FLAVOR as Readonly<Record<string, string>>)[key];

const surfaceRevealText = (id: string): string | undefined =>
  SURFACES.find((s) => s.id === id)?.revealLine?.text;

const discoveryText = (id: string): string | undefined => {
  const def = DISCOVERIES.find((d) => d.id === id);
  return def ? discoveryEmitLine(def) : undefined;
};

/** A works line's canon is its FLAVOR entry. Deliberately reads FLAVOR (a content leaf) rather
 *  than `works.ts`'s `worksLine()`: works.ts is a REDUCER that imports scenes.ts, and pulling a
 *  reducer in here would risk the very cycle this module exists to avoid. Reads through the
 *  session-200 take overlay (effFlavor), so a DEV flip reaches logged works lines too. */
const worksText = (key: string): string | undefined => effFlavor(key);

/** One authored prose line, BY NAME — the address a save's log actually stores.
 *
 *  `<id>` is the line's `<!--#slug-->` marker: it travels WITH the prose, so re-ordering a scene's
 *  lines in the narrative .md moves nothing, and a REWORD still reaches every existing save.
 *
 *  A PURELY NUMERIC id is the LEGACY form — the positional index this scheme replaced (ADR-186's
 *  known limit). A v11 save is migrated to ids on load (`migrate.ts`), so the only descriptors that
 *  reach this path are from a save older than the migration or written by a DEV take whose lines
 *  the canon registry does not carry. Resolving it positionally is the best available answer, and
 *  when it is out of range the caller falls back to the entry's stored prose. Ids are matched
 *  FIRST, so a line that ever authored a numeric-looking slug still wins. */
function lineText(lines: readonly IntroSetupLine[], id: string): string | undefined {
  const named = lines.find((l) => l.id === id);
  if (named) return named.text;
  return /^\d+$/.test(id) ? lines[Number(id)]?.text : undefined;
}

/** A hub topic's line: `topic.<topicId>.ask` (the MC's question) or `.answer.<id>` (the reply).
 *
 *  ONE reader for BOTH scene shapes — `RungScene` and `DialogueScene` carry the same
 *  `DialogueTopic[]`. It is shared on purpose: two hand-written copies is precisely how the beat
 *  side came to have NONE. Until 2026-07-13 `intents.ts` wrote `beat.<rank>.topic.<id>.ask` and
 *  `.answer.<i>` for every rung beat while `vnText` had no topic branch to read them back, so all
 *  16 rung-beat asks and their answers were unresolvable: they fell back to their stored prose,
 *  invisible to a re-voice and to the DEV take switcher, and no test could see it. */
function topicText(topics: readonly DialogueTopic[], part: string): string | undefined {
  const m = part.match(/^topic\.(.+?)\.(?:ask|answer\.(.+))$/);
  if (!m) return undefined;
  const t = topics.find((x) => x.id === m[1]);
  if (!t) return undefined;
  return m[2] === undefined ? t.label : lineText(t.answer, m[2]);
}

// ── the VN payload (scenes AND rung beats share `RungScene`, so one reader serves both) ──────
// A line inside a scene is addressed as `<part>` after the scene id:
//   greeting.<id>             a greeting line, BY ITS AUTHORED NAME (its `<!--#slug-->` marker)
//   topic.<topicId>.ask       the MC's question    · topic.<topicId>.answer.<id>  a reply line
//   opt.<optionId>.say        the MC's reply       · opt.<optionId>.react         the reaction
//   opt.<optionId>.bonus      the rare stat-nudge note
// Every address is now a NAME. It used to be that the two line-array addresses (greeting, answer)
// were positional INDEXES, so re-ordering a scene's lines re-pointed an old save's entry at its
// neighbour — silently, because the index still resolved (ADR-186's known limit). Ids travel with
// the prose, so a reorder is a no-op and a reword still reaches every save. `lineText` keeps the
// legacy numeric path for a descriptor written before the v12 migration.
function vnText(scene: RungScene, part: string): string | undefined {
  const greeting = part.match(/^greeting\.(.+)$/);
  if (greeting) return lineText(scene.greeting, greeting[1]!);

  const topic = topicText(scene.topics, part);
  if (topic !== undefined) return topic;

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
  const id = tail.slice(0, dot);
  const scene = LOG_TAKES?.scene?.[id] ?? sceneById(id)?.scene;
  return scene ? vnText(scene, tail.slice(dot + 1)) : undefined;
};

const beatText = (tail: string): string | undefined => {
  const dot = tail.indexOf('.');
  if (dot <= 0) return undefined;
  const rank = tail.slice(0, dot) as RankId;
  const beat = LOG_TAKES?.rung?.[rank] ?? RUNG_BEATS[rank];
  return beat ? vnText(beat, tail.slice(dot + 1)) : undefined;
};

// ── the intro (a DialogueScene: greeting lines · ask-hub topics · the terminal decision) ─────
//   intro.<sceneId>.greeting.<i>
//   intro.<sceneId>.topic.<topicId>.ask | .answer.<i>
//   intro.<sceneId>.opt.<optionId>.say | .react | .perk
const introScene = (id: string): DialogueScene | undefined =>
  LOG_TAKES?.intro?.[id] ?? DIALOGUE_SCENES.find((s) => s.id === id);

function introText(tail: string): string | undefined {
  const dot = tail.indexOf('.');
  if (dot <= 0) return undefined;
  const scene = introScene(tail.slice(0, dot));
  if (!scene) return undefined;
  const part = tail.slice(dot + 1);

  const greeting = part.match(/^greeting\.(.+)$/);
  if (greeting) return lineText(scene.greeting, greeting[1]!);

  const topic = topicText(scene.topics, part);
  if (topic !== undefined) return topic;

  const opt = part.match(/^opt\.(.+)\.(say|react|perk)$/);
  if (opt) {
    const o = introSceneOption(scene, opt[1]!);
    if (!o) return undefined;
    if (opt[2] === 'say') return o.say;
    if (opt[2] === 'react') return o.react;
    return introPerkLine(o); // the perk line is DERIVED from the option — never a stored copy
  }
  return undefined;
}

/** A labour line: the activity's own prose + the gains it actually paid out. The gains are the
 *  DYNAMIC part, so they ride in `params` (rice: 2, coin: 1) and the line rebuilds from the
 *  CURRENT activity def — rename the activity's prose and every old save's labour lines follow. */
function activityText(id: string, params: LogParams): string | undefined {
  const act = ACTIVITIES.find((a) => a.id === id);
  if (!act) return undefined;
  const gained: Partial<Record<LabourResource, number>> = {};
  for (const [k, v] of Object.entries(params)) {
    if (typeof v === 'number') gained[k as LabourResource] = v;
  }
  return activityLine(act, gained);
}

/** A dialogue-tree line: `dialogue.<dialogueId>.<lineId>`. Routes through the overlay-aware
 *  `dialogueLineText` (not `getDialogueLine()`, which THROWS) — an unknown id is the ordinary
 *  "src/ renamed this line" case, and the caller (codec) wants `undefined` so it can fall back
 *  to the entry's stored text; the overlay is how a DEV story-take flip reaches saved and
 *  logged dialogue lines (M7, 2026-07-13). */
function dialogueText(tail: string): string | undefined {
  const dot = tail.indexOf('.');
  if (dot <= 0) return undefined;
  return dialogueLineText(tail.slice(0, dot), tail.slice(dot + 1));
}

/** A rung requirement's completion line: `requirement.<reqId>`. */
function requirementText(id: string): string | undefined {
  for (const reqs of Object.values(RUNG_REQUIREMENTS)) {
    const req = reqs.find((r) => r.id === id);
    if (req) return requirementFlavor(req);
  }
  return undefined;
}

/** A night-round STAGE's authored narration: `nightRound.<roundId>.stage.<i>`. */
function nightRoundText(tail: string): string | undefined {
  const m = tail.match(/^(.+)\.stage\.(\d+)$/);
  if (!m) return undefined;
  return NIGHT_ROUNDS.find((r) => r.id === m[1])?.stages[Number(m[2])]?.narration;
}

/** A belonging's acquire line: `belonging.<id>.acquire` (the def owns the prose). */
function belongingText(tail: string): string | undefined {
  const m = tail.match(/^(.+)\.acquire$/);
  if (!m) return undefined;
  return BELONGINGS.find((b) => b.id === m[1])?.acquireLine;
}

/** An estate ladder stage's completion line: `estate.stage.<n>.done`.
 *  Reads the stage def's own `logLine` rather than works.ts's `stageLogLine()` — works.ts is a
 *  REDUCER (it imports scenes.ts), and the DEV take it layers on applies to future emissions only
 *  (ADR-143), so canon is the right answer on rehydrate. Same call as the `works` namespace. */
function estateStageText(tail: string): string | undefined {
  const m = tail.match(/^stage\.(\d+)\.done$/);
  if (!m) return undefined;
  return ESTATE_STAGES.find((st) => st.stage === Number(m[1]))?.logLine;
}

/** A craft recipe's completion blurb: `recipe.<id>.blurb`. */
function recipeText(tail: string): string | undefined {
  const m = tail.match(/^(.+)\.blurb$/);
  if (!m) return undefined;
  return RECIPES.find((r) => r.id === m[1])?.blurb;
}

/** namespace → resolver. Each namespace's prose stays in ITS registry — one home (TST1). */
const RESOLVERS: Readonly<Record<string, Resolver>> = {
  reveal: (id) => surfaceRevealText(id),
  discovery: (id) => discoveryText(id),
  works: (key) => worksText(key),
  flavor: (key) => effFlavor(key),
  scene: (tail) => sceneText(tail),
  beat: (tail) => beatText(tail),
  intro: (tail) => introText(tail),
  dialogue: (tail) => dialogueText(tail),
  requirement: (id) => requirementText(id),
  nightRound: (tail) => nightRoundText(tail),
  recipe: (tail) => recipeText(tail),
  estate: (tail) => estateStageText(tail),
  belonging: (tail) => belongingText(tail),
  // The day-book judge line. The GRADE is the FACT the save stores (plus the koku the engine
  // paid); the words come from FLAVOR via judgeLine, so a re-authored judge line — or the DEV
  // take switcher — reaches every existing save. Lives here, not in log-content: log-content is
  // a leaf and must not reach into the flavor registry.
  pillar: (part, params) =>
    part === 'judge' ? `${judgeLine(params.grade as Grade)} (+${params.bonus} koku)` : undefined,

  activity: (id, params) => activityText(id, params),
  // The cold-open rake: authored prose + the amount it credited (the amount is the only variable).
  coldOpen: (part, params) =>
    part === 'rake' ? rakeLine(typeof params.amount === 'number' ? params.amount : 0) : undefined,
  // The at-home rest line — which of the two it is depends on owning bedding, a FACT, so it rides
  // in params rather than being frozen as prose.
  home: (part, params) => (part === 'rest' ? homeRestLine(params.bedding === true) : undefined),
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
