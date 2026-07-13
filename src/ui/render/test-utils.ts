// Shared helpers for the split render test files (2026-07-13 render-split).
import { type AppHooks } from '../render';
import { createActionClock } from '../../app/action-clock';
import {
  createInitialState,
  DIALOGUE_SCENES,
  type GameState,
  type LogEntry,
  factsForSurfaces,
} from '../../core';
import { __setStoryOverlay } from '../../core/content/story-overlay';

export function entry(
  text: string,
  count: number,
  channel: LogEntry['channel'] = 'reward',
): LogEntry {
  return { key: 0, channel, text, tick: 0, count };
}

// HD-37 (the cold-open rearc): the intro is THREE acts again — dream (decide-only) →
// soan (the ask-hub sickroom) → genemon. The VN tests below anchor on the scene each
// exercises by ID (derived — never a copied index): the ask/decide machinery lives on
// soan; the shell-reveal test needs the LAST scene; the dream act covers the
// topic-less branch.
// HD-37 (the cold-open rearc): the intro is THREE acts again — dream (decide-only) →
// soan (the ask-hub sickroom) → genemon. The VN tests below anchor on the scene each
// exercises by ID (derived — never a copied index): the ask/decide machinery lives on
// soan; the shell-reveal test needs the LAST scene; the dream act covers the
// topic-less branch.
export const SOAN_IDX = DIALOGUE_SCENES.findIndex((s) => s.id === 'soan');
export const SOAN = DIALOGUE_SCENES[SOAN_IDX]!;
export const LAST_IDX = DIALOGUE_SCENES.length - 1;
export const LAST = DIALOGUE_SCENES[LAST_IDX]!;

// ── DOM harness ─────────────────────────────────────────────────────────────
export function noopHooks(): AppHooks {
  let muted = false;
  return {
    exportSave: () => 'SAVE-CODE',
    importSave: () => {},
    newGame: () => {},
    setReducedMotion: () => {},
    setTextScale: () => {},
    togglePause: () => false,
    isPaused: () => false,
    sfx: {
      hit: () => {},
      reward: () => {},
      rankUp: () => {},
      setMuted: (b: boolean) => {
        muted = b;
      },
      isMuted: () => muted,
    },
    clock: createActionClock(),
  };
}

export function awakeCombatState(): GameState {
  const base = createInitialState(1);
  return {
    ...base,
    // Step 5b / G4 cutover: foes are spatial — stand on the field margins (the first grindable
    // combat zone: tanuki + badger at the paddy's edge) so the combat pane's "watch" has foes.
    location: 'field-margins',
    // ADR-179 — visibility derives from FACTS: rank-r3 entitles tab-combat; readout-rice
    // derives from awake + intro-not-active (base introBeat is -1, pre-wake).
    flags: { ...base.flags, awake: true, ...factsForSurfaces('tab-combat') },
  };
}
