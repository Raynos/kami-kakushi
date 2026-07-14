// The orphaned-id sensor (save-format plan, step 4 — a SENSOR, never a gate).
//
// The save stores raw ids: quest steps, reveal/discovery/dialogue/scene latches, market
// purchases, rung requirements, site pools. A stale id is harmless — it ages out inert. A
// RENAMED id is not: the fact it recorded is silently orphaned, so a gate never reopens or a
// one-time beat replays, and NOTHING tells you. This diffs a loaded save's ids against the live
// registries so a content move that needs a migration becomes VISIBLE the first time anyone
// plays it, instead of misbehaving quietly three sessions later.
//
// Deliberately NOT a red test: a rename is a legitimate authoring act, so failing the build on
// one would cry wolf (and the fix — a migration — belongs to the author, not the gate). It is
// reported in the DEV panel + console, and it is free in prod (never called there).
//
// `flags` is EXCLUDED on purpose: flags are free-form facts, not registry references, so there
// is no roster to diff them against.

import type { GameState } from '../core';
import {
  QUESTS,
  SURFACE_IDS,
  DISCOVERIES,
  DIALOGUES,
  SCENES,
  MARKET_ITEM_IDS,
  BELONGING_IDS,
  LABOUR_SITES,
  RUNG_REQUIREMENTS,
  WEAPON_IDS,
  MAP_NODE_IDS,
} from '../core';

/** One class of orphan: the save's ids for `kind` that the live registries no longer know. */
export interface OrphanGroup {
  readonly kind: string;
  readonly ids: readonly string[];
  /** What silently breaks if this is left un-migrated — the reason a human should care. */
  readonly consequence: string;
}

export interface OrphanReport {
  readonly groups: readonly OrphanGroup[];
  readonly total: number;
}

function liveQuestStepIds(): ReadonlySet<string> {
  const ids = new Set<string>();
  for (const q of QUESTS) for (const step of q.steps) ids.add(step.id);
  return ids;
}

/** Every authored dialogue LINE id. `deliveredDialogue` stores LINE ids (`gen-rake`), NOT the
 *  dialogue's own id (`genemon-open`) — diffing it against DIALOGUE_IDS reported every delivered
 *  line as an orphan, i.e. the sensor cried wolf on a perfectly clean save. A sensor with false
 *  positives is worse than no sensor: it teaches everyone to ignore it. */
function liveDialogueLineIds(): ReadonlySet<string> {
  const ids = new Set<string>();
  for (const d of DIALOGUES) for (const line of d.lines) ids.add(line.id);
  return ids;
}

function liveRequirementIds(): ReadonlySet<string> {
  const ids = new Set<string>();
  for (const reqs of Object.values(RUNG_REQUIREMENTS))
    for (const r of reqs) ids.add(r.id);
  return ids;
}

/** The ids a save carries that `src/` no longer defines. Pure: no DOM, no console, no state. */
export function findOrphanedIds(state: GameState): OrphanReport {
  const groups: OrphanGroup[] = [];
  const add = (
    kind: string,
    stored: readonly string[],
    live: ReadonlySet<string>,
    consequence: string,
  ): void => {
    const ids = [...new Set(stored)].filter((id) => !live.has(id));
    if (ids.length > 0) groups.push({ kind, ids, consequence });
  };

  add(
    'seenReveals',
    state.seenReveals,
    SURFACE_IDS,
    'a reveal ceremony may re-announce, or never fire',
  );
  add(
    'discovered',
    state.discovered,
    new Set(DISCOVERIES.map((d) => d.id)),
    'a found secret reverts to un-found',
  );
  add(
    'deliveredDialogue',
    state.deliveredDialogue,
    liveDialogueLineIds(),
    'a delivered line may repeat',
  );
  add(
    'scenesPlayed',
    state.scenesPlayed,
    new Set(SCENES.map((s) => s.id)),
    'a played scene may replay',
  );
  add(
    'belongings',
    state.belongings,
    BELONGING_IDS,
    'a bought belonging vanishes from the home',
  );
  add(
    'marketBought',
    Object.keys(state.marketBought),
    MARKET_ITEM_IDS,
    'a one-time purchase can be bought again',
  );
  add(
    'sitePools',
    Object.keys(state.sitePools),
    new Set(LABOUR_SITES.map((s) => s.site)),
    'a dead pool key lingers (inert)',
  );
  add(
    'quests.accepted',
    state.quests.accepted,
    new Set(QUESTS.map((q) => q.id)),
    'an accepted quest cannot be completed',
  );
  add(
    'quests.completed',
    state.quests.completed,
    new Set(QUESTS.map((q) => q.id)),
    'a completed quest reads as never done',
  );
  add(
    'quests.progress',
    Object.values(state.quests.progress).flat(),
    liveQuestStepIds(),
    'a done quest step reads as undone — the quest can never close',
  );
  add(
    'rungReqs',
    Object.keys(state.rungReqs),
    liveRequirementIds(),
    'rung progress is lost — a requirement never completes',
  );
  add(
    'equippedWeapon',
    [state.equippedWeapon],
    WEAPON_IDS,
    'the equipped weapon falls back to the pole',
  );
  add(
    'location',
    [state.location],
    MAP_NODE_IDS,
    'the player is teleported to the forecourt',
  );

  return { groups, total: groups.reduce((n, g) => n + g.ids.length, 0) };
}

/** A compact one-line-per-kind rendering — shared by the console log and the DEV panel. */
export function formatOrphanReport(report: OrphanReport): string {
  if (report.total === 0) return 'no orphaned ids — this save matches src/';
  return report.groups
    .map((g) => `${g.kind}: ${g.ids.join(', ')} — ${g.consequence}`)
    .join('\n');
}
