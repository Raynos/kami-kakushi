// Ordered forward migrations (PRD §6.8.2). Additive optional-fields-with-defaults is
// the PRIMARY schema-growth mechanism, so MOST growth needs NO migration; this chain
// (run from the saved version up to SCHEMA_VERSION) + a raw pre-migration backup is
// the rare safety net. Wired into the load path via validateEnvelope (runs BEFORE
// validateState); a raw pre-migration backup is kept by SaveManager.
//
// STORYWAVE CLEAN BREAK (ADR-161): the old v1→v9 chain is DELETED — git history is its
// archive. A pre-storywave blob is a PRIOR app generation (see APP_GENERATION), so it is
// caught by validateEnvelope's generation gate and RETIRED (backed up + fresh boot),
// never migrated. The chain therefore restarts EMPTY at v10; the first v10→v11 step
// (additive growth WITHIN this generation) will re-populate it.

import { SCHEMA_VERSION } from '../core';
import { RUNG_BEATS, type RungScene } from '../core/content/rungBeats';
import { SCENES } from '../core/content/scenes';
import { DIALOGUE_SCENES, type DialogueScene } from '../core/content/intro';
import type { RankId } from '../core/content/ranks';

export type Migration = (state: unknown) => unknown;
/** The signature the load path injects (validateEnvelope / SaveManager). */
export type MigrateFn = (state: unknown, fromVersion: number) => unknown;

const MIGRATIONS: Readonly<Record<number, Migration>> = {
  // v10 → v11 (ADR-179 derived reveal): the stored `unlocked` visibility latch is DELETED —
  // visibility now DERIVES from progression facts (core/unlock visibleSet) — and the new
  // `seenReveals` announce-once ceremony latch is seeded from it (the old latch is precisely
  // "what has been announced", so the seed is lossless: no reveal line ever re-plays).
  // One fact the old latch is the only record of: a first coin earned then spent back to 0 —
  // synthesize the `coin-earned` flag from the latched readout so the readout can't vanish.
  10: (state) => {
    const s = state as {
      unlocked?: readonly string[];
      flags?: Readonly<Record<string, boolean>>;
    };
    const unlocked = Array.isArray(s.unlocked) ? s.unlocked : [];
    const { unlocked: _dropped, ...rest } = s;
    return {
      ...rest,
      seenReveals: unlocked,
      flags: {
        ...s.flags,
        ...(unlocked.includes('readout-coin') ? { 'coin-earned': true } : {}),
      },
    };
  },

  // v11 → v12 (line ids): a log entry used to address a scene's greeting / topic-answer line by
  // its INDEX (`beat.R3.greeting.2`). An index does not survive an edit to the .md — re-order or
  // delete a line and the old entry silently re-points at its NEIGHBOUR — so the lines now carry
  // authored ids and the descriptor names one (`beat.R3.greeting.the-wolf-again`).
  //
  // Rewriting the OLD descriptors is sound precisely here and nowhere later: this release adds ids
  // and re-orders NOTHING, so index 2 still names the line it named when the save was written.
  // Deferring the rewrite would mean carrying saves that stay vulnerable to the first re-voice
  // wave — which is the whole thing this exists to prevent (the human's call, 2026-07-13).
  //
  // An index the registry no longer has (a line deleted before this migration ran) resolves to
  // nothing and is LEFT AS IT IS: `renderLogLine` then fails to resolve it and the codec keeps the
  // entry's stored prose. One line degrades to the words the player actually read; nothing is lost.
  11: (state) => {
    const s = state as { log?: { entries?: readonly Record<string, unknown>[] } };
    const entries = s.log?.entries;
    if (!Array.isArray(entries)) return state;
    return {
      ...s,
      log: {
        ...s.log,
        entries: entries.map((e) => {
          const key = typeof e.contentKey === 'string' ? e.contentKey : undefined;
          if (key === undefined) return e; // an unkeyed legacy line keeps its prose verbatim
          const named = nameVnIndexes(key);
          return named === key ? e : { ...e, contentKey: named };
        }),
      },
    };
  },

  // v12 → v13 (step D, session-200): log entries GAIN an optional `contextKey`
  // (`intro-title.<sceneId>`) so a 幕-head re-derives from the registry on load. Purely
  // additive — a pre-v13 entry has none and keeps its baked head verbatim (TST2), so the
  // migration is the identity; the bump records the format change.
  12: (state) => state,

  // v13 → v14 (ADR-194 merchant state): purely additive — the new `merchants` map hydrates to
  // the seeded roster in validateState when absent (idempotent: a present map is kept as-is,
  // so re-running can never double-grant). Identity here; the bump records the format change.
  13: (state) => state,
};

/** `<ns>.<scene>.…greeting.<i>` / `…answer.<i>` → the same address with the line's authored id.
 *  Returns the key unchanged when it is not a VN line address, or when the index no longer
 *  resolves (see the v11 → v12 note). */
function nameVnIndexes(key: string): string {
  const m = /^(beat|scene|intro)\.([^.]+)\.(.*)$/.exec(key);
  if (!m) return key;
  const [, ns, sceneId, part] = m as unknown as [string, VnNamespace, string, string];
  const scene = vnScene(ns, sceneId);
  if (!scene) return key;

  const greeting = /^greeting\.(\d+)$/.exec(part);
  if (greeting) {
    const id = scene.greeting[Number(greeting[1])]?.id;
    return id ? `${ns}.${sceneId}.greeting.${id}` : key;
  }

  const answer = /^topic\.(.+)\.answer\.(\d+)$/.exec(part);
  if (answer) {
    const id = scene.topics.find((t) => t.id === answer[1])?.answer[Number(answer[2])]?.id;
    return id ? `${ns}.${sceneId}.topic.${answer[1]}.answer.${id}` : key;
  }
  return key;
}

type VnNamespace = 'beat' | 'scene' | 'intro';

/** The scene a VN descriptor names — the same three registries `log-render` dispatches over. */
function vnScene(ns: VnNamespace, id: string): RungScene | DialogueScene | undefined {
  if (ns === 'beat') return RUNG_BEATS[id as RankId];
  if (ns === 'scene') return SCENES.find((s) => s.id === id)?.scene;
  return DIALOGUE_SCENES.find((s) => s.id === id);
}

export function migrate(
  state: unknown,
  fromVersion: number,
  toVersion: number = SCHEMA_VERSION,
  migrations: Readonly<Record<number, Migration>> = MIGRATIONS,
): unknown {
  let v = fromVersion;
  let s = state;
  while (v < toVersion) {
    const m = migrations[v];
    if (!m) break; // a gap stops the chain (handled by the future-version guard upstream)
    s = m(s);
    v += 1;
  }
  return s;
}
