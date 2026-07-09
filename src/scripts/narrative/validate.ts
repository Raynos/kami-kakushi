// Narrative validation roster (FB-5 Ph2+Ph3) — the gate's teeth.
//
// Runs over the parsed ASTs BEFORE emit; every finding cites the AUTHORING
// file:line. Fixtures for the unit tests derive from the source-of-truth
// registries (NPC_IDS, ATTR_IDS, STANCE_ORDER, SURFACE_IDS, RANKS), never
// copied magic values. Errors fail the build; warnings print but pass —
// with a human-signed allowlist for rulings like Munemasa's R7 register.
//
// Cross-file checks (reuse references, dialogue routing) see ALL parsed docs
// at once — the CLI parses every narrative file, then validates the set.
// The compiler imports only the hand-written LEAF registries (voices, names,
// balance, surfaces, ranks) — no chicken-and-egg with the generated modules.

import {
  NPC_IDS,
  NPC_NAME,
  NPC_VOICE,
  VOICE_CATEGORIES,
  type NpcId,
} from '../../core/content/voices';
import { NAMES } from '../../core/content/names';
import { ATTR_IDS, STANCE_ORDER } from '../../core/content/balance';
import { SURFACE_IDS } from '../../core/content/surfaces';
import { RANKS } from '../../core/content/ranks';
import { SEASONS } from '../../core/constants';
import {
  parseSceneTrigger,
  type DialogueDefNode,
  type IntroSceneNode,
  type Loc,
  type NarrativeDoc,
  type ProseLine,
  type RungSceneNode,
  type SceneDefNode,
} from './parse';

/** Every rung's requirement-list floor (human, 2026-07-07) — see the check below. */
export const MIN_REQS_PER_RUNG = 3;

export interface Verdict {
  readonly errors: string[];
  readonly warnings: string[];
}

/** Speech-voice overrides the human has ruled INTENTIONAL (`npc:voice`). The WARN
 *  stays quiet on these. Munemasa keeps the formal 'official' register at R7 while his
 *  registered voice is 'lord' — human call, 2026-07-05 (FB-5 plan Risks #3). */
const VOICE_OVERRIDE_ALLOWED: ReadonlySet<string> = new Set(['munemasa:official']);

/** The fixed intro scene order — the engine's `introBeat` cursor assumes it. C4.9 (the
 *  G4.1 reshape, finished): the intro is the ONE fused take-a sickroom scene; the legacy
 *  pre-reboot dream/genemon filler is deleted (git history keeps it). */
const INTRO_SCENE_ORDER = ['soan'] as const;

const NPC_BY_NAME = new Map<string, NpcId>(
  (Object.entries(NPC_NAME) as [NpcId, string][]).map(([id, name]) => [name, id]),
);
const AMBIENT_NAMES = new Set<string>(Object.values(NAMES));
const NAMES_KEYS = new Set(Object.keys(NAMES));
const NPC_ID_SET = new Set<string>(NPC_IDS);
const RANK_UNLOCKS = new Map<string, readonly string[]>(
  RANKS.map((r) => [r.id, r.rewardOnReach?.unlock ?? []]),
);
const VOICE_SET = new Set<string>(VOICE_CATEGORIES);
const STANCE_SET = new Set<string>(STANCE_ORDER);
const ATTR_SET = new Set<string>(ATTR_IDS);
const SEASON_SET = new Set<string>(SEASONS);

const at = (loc: Loc): string => `${loc.file}:${loc.line}`;

/** What the doc set defines, for cross-file reference resolution. */
interface RefContext {
  readonly coldOpenKeys: ReadonlySet<string>;
  /** dialogue def id → its line ids. */
  readonly dialogueLines: ReadonlyMap<string, ReadonlySet<string>>;
  /** dialogue def ids referenced by at least one `@dialogue.` reuse. */
  readonly routedDefs: ReadonlySet<string>;
}

function buildRefContext(docs: readonly NarrativeDoc[]): RefContext {
  const coldOpenKeys = new Set<string>();
  const dialogueLines = new Map<string, ReadonlySet<string>>();
  const routedDefs = new Set<string>();
  const noteRef = (text: string): void => {
    const m = /^@dialogue\.([a-z0-9-]+)\//.exec(text);
    if (m) routedDefs.add(m[1]!);
  };
  for (const doc of docs) {
    for (const b of doc.blocks) {
      if (b.kind === 'prose') for (const e of b.entries) coldOpenKeys.add(e.key);
      if (b.kind === 'dialogue') dialogueLines.set(b.id, new Set(b.lines.map((l) => l.id)));
      if (b.kind === 'rung' || b.kind === 'scene') {
        for (const line of b.greeting) noteRef(line.text);
        for (const t of b.topics) for (const line of t.answer) noteRef(line.text);
      }
    }
  }
  return { coldOpenKeys, dialogueLines, routedDefs };
}

export function validateNarrative(docs: readonly NarrativeDoc[]): Verdict {
  const errors: string[] = [];
  const warnings: string[] = [];
  const err = (loc: Loc, msg: string): void => {
    errors.push(`${at(loc)} — ${msg}`);
  };
  const refs = buildRefContext(docs);

  // §3.11 a reuse reference / {name} interpolation must resolve.
  const checkText = (text: string, loc: Loc): void => {
    const cold = /^@cold-open\.([a-zA-Z]+)$/.exec(text);
    const dlg = /^@dialogue\.([a-z0-9-]+)\/([a-z0-9-]+)$/.exec(text);
    if (cold) {
      if (!refs.coldOpenKeys.has(cold[1]!)) err(loc, `@cold-open.${cold[1]} does not resolve`);
      return;
    }
    if (dlg) {
      if (!refs.dialogueLines.get(dlg[1]!)?.has(dlg[2]!)) {
        err(loc, `@dialogue.${dlg[1]}/${dlg[2]} does not resolve`);
      }
      return;
    }
    if (text.startsWith('@')) {
      err(loc, `unknown reuse reference "${text}" (@cold-open.<key> / @dialogue.<def>/<line>)`);
      return;
    }
    for (const m of text.matchAll(/\{([a-zA-Z]+)\}/g)) {
      if (!NAMES_KEYS.has(m[1]!)) err(loc, `unknown NAMES interpolation "{${m[1]}}"`);
    }
  };

  // §3.1 speaker resolves + §3.2 voice is real + §3.12 WARN on off-register voice.
  const checkProse = (line: ProseLine, isReact: boolean): void => {
    checkText(line.text, line.loc);
    if (line.kind === 'narr') return;
    const npc = NPC_BY_NAME.get(line.speaker);
    if (npc === undefined && !AMBIENT_NAMES.has(line.speaker)) {
      err(
        line.loc,
        `unknown speaker "${line.speaker}" (known: ${[...NPC_BY_NAME.keys()].join(', ')}, ` +
          `or an ambient NAMES entry with an explicit (voice))`,
      );
      return;
    }
    if (npc === undefined && line.voice === undefined && !isReact) {
      err(
        line.loc,
        `"${line.speaker}" is not an NPC — an ambient speaker needs an explicit (voice)`,
      );
    }
    if (isReact) {
      if (line.voice !== undefined) {
        err(line.loc, 'a react line takes no (voice) override — its voice derives from the scene');
      }
      return;
    }
    if (line.voice !== undefined) {
      if (!VOICE_SET.has(line.voice)) {
        err(line.loc, `unknown voice "${line.voice}" (known: ${VOICE_CATEGORIES.join(', ')})`);
      } else if (npc !== undefined && line.voice !== NPC_VOICE[npc]) {
        if (!VOICE_OVERRIDE_ALLOWED.has(`${npc}:${line.voice}`)) {
          warnings.push(
            `${at(line.loc)} — ${line.speaker} speaks in '${line.voice}' but is registered ` +
              `'${NPC_VOICE[npc]}' — intentional? (allowlist it in validate.ts if so)`,
          );
        }
      }
    }
  };

  // §3.3 topic + option ids globally unique (each namespace flat across the doc set).
  const topicIds = new Map<string, Loc>();
  const optionIds = new Map<string, Loc>();
  const rankKeys = new Map<string, Loc>();
  const reqRungs = new Map<string, Loc>();
  const introScenes: IntroSceneNode[] = [];

  for (const doc of docs) {
    for (const block of doc.blocks) {
      if (block.kind === 'dialogue') {
        validateDialogueDef(block, refs, err, checkText);
        continue;
      }
      if (block.kind === 'prose') {
        const seen = new Set<string>();
        for (const e of block.entries) {
          if (seen.has(e.key)) err(e.loc, `duplicate prose key "${e.key}"`);
          seen.add(e.key);
          checkText(e.text, e.loc);
        }
        continue;
      }
      if (block.kind === 'requirements') {
        // FB-121 / ADR-137: one list per rung, unique req ids within it, resolvable
        // flavor text. Rung-set completeness (all 8, no dup) is checked below.
        if (reqRungs.has(block.rankKey)) {
          err(block.loc, `duplicate requirements list for ${block.rankKey}`);
        }
        reqRungs.set(block.rankKey, block.loc);
        // HARD MINIMUM (human, 2026-07-07): every rung carries ≥3 requirements — a
        // thinner list starves the climb of felt completion beats (the R0 lesson:
        // one requirement = one flavor line across the whole cold open).
        if (block.reqs.length < MIN_REQS_PER_RUNG) {
          err(
            block.loc,
            `${block.rankKey} lists ${block.reqs.length} requirement(s) — the hard minimum is ${MIN_REQS_PER_RUNG} (human, 2026-07-07)`,
          );
        }
        const seen = new Set<string>();
        for (const r of block.reqs) {
          if (seen.has(r.id)) err(r.loc, `duplicate req id "${r.id}" in ${block.rankKey}`);
          seen.add(r.id);
          if (r.flavor) checkText(r.flavor, r.loc);
        }
        continue;
      }
      if (block.kind === 'scene-def') {
        validateSceneCommon(block, err, checkProse, topicIds, optionIds);
        validateSceneDef(block, err);
        continue;
      }
      const scene = block;
      if (scene.kind === 'scene') introScenes.push(scene);
      validateSceneCommon(scene, err, checkProse, topicIds, optionIds);
      if (scene.kind === 'rung') validateRungExtras(scene, rankKeys, err);
      else validateIntroExtras(scene, err);
    }
  }

  // FB-121: a requirements doc must cover EXACTLY the eight rungs (no half-migrated ladder).
  if (reqRungs.size > 0) {
    for (const rank of RANKS) {
      if (!reqRungs.has(rank.id)) {
        err([...reqRungs.values()][0]!, `requirements list missing for ${rank.id} (all 8 rungs)`);
      }
    }
  }

  // §3.8b intro scene order is fixed (the engine's cursor + migration assume it).
  if (introScenes.length > 0) {
    const order = introScenes.map((s) => s.id);
    if (JSON.stringify(order) !== JSON.stringify(INTRO_SCENE_ORDER)) {
      err(
        introScenes[0]!.loc,
        `intro scenes must be exactly [${INTRO_SCENE_ORDER.join(', ')}] in order, got [${order.join(', ')}]`,
      );
    }
  }

  return { errors, warnings };
}

function validateSceneCommon(
  scene: RungSceneNode | IntroSceneNode | SceneDefNode,
  err: (loc: Loc, msg: string) => void,
  checkProse: (line: ProseLine, isReact: boolean) => void,
  topicIds: Map<string, Loc>,
  optionIds: Map<string, Loc>,
): void {
  // scene meta: voice real, speaker a real NPC id.
  const voice = scene.meta.get('voice');
  if (voice && !VOICE_SET.has(voice.value)) {
    err(voice.loc, `unknown scene voice "${voice.value}" (known: ${VOICE_CATEGORIES.join(', ')})`);
  }
  const speaker = scene.meta.get('speaker');
  if (speaker && !NPC_ID_SET.has(speaker.value)) {
    err(
      speaker.loc,
      `unknown scene speaker "${speaker.value}" (known NPC ids: ${NPC_IDS.join(', ')})`,
    );
  }

  for (const line of scene.greeting) checkProse(line, false);
  for (const t of scene.topics) for (const line of t.answer) checkProse(line, false);

  for (const t of scene.topics) {
    const dup = topicIds.get(t.id);
    if (dup) err(t.loc, `duplicate topic id "${t.id}" (first at ${at(dup)})`);
    else topicIds.set(t.id, t.loc);
  }

  // §3.4 after: resolves in-scene, non-self, non-cyclic.
  const inScene = new Map(scene.topics.map((t) => [t.id, t]));
  for (const t of scene.topics) {
    if (t.after === undefined) continue;
    if (t.after === t.id) {
      err(t.loc, `topic "${t.id}" gates on itself`);
      continue;
    }
    if (!inScene.has(t.after)) {
      err(t.loc, `after: "${t.after}" is not a topic in scene "${scene.id}"`);
      continue;
    }
    const seen = new Set<string>([t.id]);
    let cur: string | undefined = t.after;
    while (cur !== undefined) {
      if (seen.has(cur)) {
        err(t.loc, `topic "${t.id}" has a cyclic after: chain`);
        break;
      }
      seen.add(cur);
      cur = inScene.get(cur)?.after;
    }
  }

  for (const o of scene.decision?.options ?? []) {
    const dup = optionIds.get(o.id);
    if (dup) err(o.loc, `duplicate option id "${o.id}" (first at ${at(dup)})`);
    else optionIds.set(o.id, o.loc);

    if (o.react) checkProse(o.react, true);
    if ((scene.kind === 'rung' || scene.kind === 'scene-def') && o.react) {
      if (o.react.kind !== 'speech' || !NPC_BY_NAME.has(o.react.speaker)) {
        err(o.react.loc, `a ${scene.kind} react must be a speech line spoken by an NPC`);
      }
    }
    // §3.5 memory NPCs real, |warmth Δ| ≤ 3.
    for (const m of o.memory ?? []) {
      if (!NPC_ID_SET.has(m.npc)) {
        err(o.loc, `memory npc "${m.npc}" is not a known NPC id (${NPC_IDS.join(', ')})`);
      }
      if (Math.abs(m.warmthDelta) > 3) {
        err(o.loc, `memory warmth delta ${m.warmthDelta} exceeds the ±3 clamp`);
      }
    }
    // §3.6 bonus attr + stance from the source-of-truth rosters.
    if (o.bonus && !ATTR_SET.has(o.bonus.attr)) {
      err(o.loc, `bonus attr "${o.bonus.attr}" is not a known attribute (${ATTR_IDS.join(', ')})`);
    }
    if (o.stance && !STANCE_SET.has(o.stance)) {
      err(o.loc, `stance "${o.stance}" is not a known stance (${STANCE_ORDER.join(', ')})`);
    }
  }
}

function validateRungExtras(
  scene: RungSceneNode,
  rankKeys: Map<string, Loc>,
  err: (loc: Loc, msg: string) => void,
): void {
  // §3.8 rung keys are real ranks, no R0 beat, no duplicates.
  if (!RANK_UNLOCKS.has(scene.rankKey)) {
    err(
      scene.loc,
      `unknown rank "${scene.rankKey}" (known: ${[...RANK_UNLOCKS.keys()].join(', ')})`,
    );
  } else if (scene.rankKey === 'R0') {
    err(scene.loc, 'R0 takes no rung beat — the intro IS the R0 beat (D-110)');
  } else {
    // §3.7 motivates ⊆ SURFACE_IDS and verbatim-equal to the rank's rewardOnReach.unlock.
    const motivates = scene.meta.get('motivates');
    if (motivates) {
      const ids = motivates.value.split(',').map((m) => m.trim());
      for (const id of ids) {
        if (!SURFACE_IDS.has(id as never)) {
          err(motivates.loc, `motivates id "${id}" is not a known surface`);
        }
      }
      const unlock = RANK_UNLOCKS.get(scene.rankKey)!;
      if (JSON.stringify(ids) !== JSON.stringify(unlock)) {
        err(
          motivates.loc,
          `motivates must be verbatim-equal to RANKS.${scene.rankKey}.rewardOnReach.unlock ` +
            `(expected: ${unlock.join(', ') || '(none)'})`,
        );
      }
    }
  }
  const dupRank = rankKeys.get(scene.rankKey);
  if (dupRank) err(scene.loc, `duplicate rung "${scene.rankKey}" (first at ${at(dupRank)})`);
  else rankKeys.set(scene.rankKey, scene.loc);
}

function validateIntroExtras(scene: IntroSceneNode, err: (loc: Loc, msg: string) => void): void {
  for (const o of scene.decision?.options ?? []) {
    // §3.6b the net-zero invariant: stat up/down real and DISTINCT.
    if (o.stat) {
      for (const side of [o.stat.up, o.stat.down]) {
        if (!ATTR_SET.has(side)) {
          err(o.loc, `stat attr "${side}" is not a known attribute (${ATTR_IDS.join(', ')})`);
        }
      }
      if (o.stat.up === o.stat.down) {
        err(
          o.loc,
          `stat up/down must be distinct (the net-zero invariant), got "${o.stat.up}" twice`,
        );
      }
    } else {
      err(o.loc, `intro option "${o.id}" is missing "stat:" (the net-zero lean)`);
    }
    // §3.9 perk shape: name/desc non-empty, no '(', no ±1 (lifted from intro.test.ts —
    // mechanics are appended by introPerkLine, never baked into the perk).
    if (o.perk) {
      if (!o.perk.name || !o.perk.desc) err(o.loc, 'perk name and desc must be non-empty');
      if (o.perk.name.includes('(') || o.perk.desc.includes('(')) {
        err(o.loc, "a perk never carries '(' — mechanics are appended by introPerkLine");
      }
      if (/[+−]1/.test(o.perk.name) || /[+−]1/.test(o.perk.desc)) {
        err(o.loc, 'a perk never bakes in the ±1 — introPerkLine appends the exact trade');
      }
    } else {
      err(o.loc, `intro option "${o.id}" is missing "perk:"`);
    }
    if (o.memory && (o.memory.length !== 1 || o.memory[0]!.regard === undefined)) {
      err(o.loc, 'an intro option takes exactly one memory write, with a regard');
    }
  }
}

/** Scene-def specifics (storywave G3.5 / FB-5): a resolvable `trigger:` and a real `voice:`.
 *  A malformed trigger (unknown kind, `season-exit` without a season, an unknown season) REDs —
 *  the generalized-scene registry must never carry a trigger the engine can't match. */
function validateSceneDef(def: SceneDefNode, err: (loc: Loc, msg: string) => void): void {
  const trigger = def.meta.get('trigger');
  if (!trigger) {
    err(def.loc, `scene-def "${def.id}" is missing "trigger:" meta`);
  } else {
    const parsed = parseSceneTrigger(trigger.value);
    if (!parsed.ok) {
      err(trigger.loc, `scene-def "${def.id}": ${parsed.reason}`);
    } else if (parsed.trigger.kind === 'season-exit' && !SEASON_SET.has(parsed.trigger.season)) {
      err(trigger.loc, `unknown season "${parsed.trigger.season}" (known: ${SEASONS.join(', ')})`);
    }
  }
  if (!def.meta.get('voice')) {
    err(def.loc, `scene-def "${def.id}" is missing "voice:" meta`);
  }
}

function validateDialogueDef(
  def: DialogueDefNode,
  refs: { readonly routedDefs: ReadonlySet<string> },
  err: (loc: Loc, msg: string) => void,
  checkText: (text: string, loc: Loc) => void,
): void {
  if (!NAMES_KEYS.has(def.speakerKey)) {
    err(def.loc, `unknown dialogue speaker key "${def.speakerKey}" (a NAMES key)`);
  }
  // §3.10 no orphan defs: a def is REACHED (referenced by a reuse) or explicitly
  // marked `unrouted: <reason>` — the kihei-intro/soan-intro kept-on-purpose stubs.
  if (!refs.routedDefs.has(def.id) && def.unrouted === undefined) {
    err(
      def.loc,
      `dialogue "${def.id}" is neither referenced by any @dialogue reuse nor marked ` +
        `"unrouted: <reason>" — dead content must be kept on purpose or deleted`,
    );
  }
  const seen = new Set<string>();
  for (const l of def.lines) {
    if (seen.has(l.id)) err(l.loc, `duplicate line id "${l.id}" in dialogue "${def.id}"`);
    seen.add(l.id);
    if (l.voice !== undefined && !VOICE_SET.has(l.voice)) {
      err(l.loc, `unknown voice "${l.voice}" (known: ${VOICE_CATEGORIES.join(', ')})`);
    }
    if (l.when?.type === 'regard' && !NPC_ID_SET.has(l.when.npc)) {
      err(l.loc, `when: npc "${l.when.npc}" is not a known NPC id (${NPC_IDS.join(', ')})`);
    }
    checkText(l.text, l.loc);
  }
}
