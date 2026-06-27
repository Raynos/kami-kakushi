// Composition root (PRD §6.2): wires core ↔ ui ↔ persistence, runs the active-only
// tick loop, wraps tick/render in a crash boundary (D-044), and installs window.__qa
// in DEV. The renderer never mutates state; the core is the only place state changes.

import {
  createInitialState,
  reduce,
  tick as coreTick,
  availableActions,
  availableLabours,
  canDoActivity,
  getActivity,
  satietyMax,
  balance,
  type GameState,
  type Intent,
  type ActivityId,
  type RankId,
  type MobId,
  type BalanceProfile,
} from '../core';
import { createBrowserSaveManager, type SaveManager } from '../persistence';
import { mount } from '../ui';

const DEFAULT_SEED = 20260626;
const AUTOSAVE_DEBOUNCE_MS = 800;
const AUTOSAVE_TICK_INTERVAL_MS = 15_000;
const { AUTO_REPEAT_MS } = balance; // the "leave it running" cadence (active-only), single-sourced

/** Resolve the balance profile for NEW games (app layer — URL/env/localStorage allowed
 *  here, never in core). DEMO is the shipped default — this only makes REAL reachable, it
 *  does NOT make the H1 DEMO-vs-REAL policy call. */
function resolveBootProfile(): BalanceProfile {
  const url = new URLSearchParams(location.search).get('balance');
  if (url === 'real' || url === 'demo') {
    try {
      localStorage.setItem('kk.balanceProfile', url);
    } catch {
      /* private mode / disabled storage — ignore */
    }
    return url;
  }
  const env = import.meta.env.VITE_BALANCE_PROFILE;
  if (env === 'real' || env === 'demo') return env;
  try {
    const ls = localStorage.getItem('kk.balanceProfile');
    if (ls === 'real' || ls === 'demo') return ls;
  } catch {
    /* ignore */
  }
  return 'demo'; // shipped default — NOT the H1 call
}

interface RevealMark {
  id: string;
  tick: number;
}

async function boot(): Promise<void> {
  const root = document.getElementById('app');
  if (!root) return;

  const save: SaveManager = createBrowserSaveManager();
  const bootProfile = resolveBootProfile(); // applies to NEW games only; loads keep their profile

  // ── load newest, with crash-recovery safe-mode rollback (D-044) ──
  let state: GameState;
  const loaded = await save.load();
  if (loaded && loaded.safeMode) {
    const rb = await save.loadRollback();
    state = rb ? rb.state : loaded.state;
    await save.clearCrashCount();
    note(root, 'Recovered from an earlier rough exit — rolled back to a stable point.');
  } else if (loaded) {
    state = loaded.state;
  } else {
    state = createInitialState(DEFAULT_SEED, bootProfile);
  }

  let prev: GameState | null = null;

  // reveal tracking (for the __qa reveal-cadence proxy)
  const reveals: RevealMark[] = state.unlocked.map((id) => ({ id, tick: state.clock.tick }));
  let actionCount = 0;
  let paused = false;
  let crashed = false;

  // app hooks for the Settings/About surface (export/import save, a11y, pause)
  const hooks = {
    exportSave: (): string => save.exportState(state),
    importSave: (b64: string): void => {
      void (async () => {
        const res = await save.importState(b64);
        if ('state' in res) {
          prev = null;
          state = res.state;
          safely(() => render(state, null));
        }
      })();
    },
    newGame: (): void => {
      prev = null;
      state = createInitialState(DEFAULT_SEED, bootProfile);
      reveals.length = 0;
      actionCount = 0;
      safely(() => render(state, null));
      void flushSave();
    },
    setReducedMotion: (on: boolean): void => {
      document.documentElement.classList.toggle('reduced-motion', on);
    },
    setTextScale: (s: number): void => {
      document.documentElement.style.setProperty('--text-scale', String(s));
    },
    togglePause: (): boolean => {
      paused = !paused;
      return paused;
    },
  };

  const render = mount(root, dispatch, hooks);

  // reveal-on-load: render existing log statically (no re-spam)
  safely(() => render(state, null));
  await save.clearCrashCount(); // booted cleanly

  function trackReveals(before: GameState, after: GameState): void {
    if (after.unlocked.length === before.unlocked.length) return;
    for (const id of after.unlocked) {
      if (!before.unlocked.includes(id)) reveals.push({ id, tick: after.clock.tick });
    }
  }

  function commit(next: GameState): void {
    if (next === state) return;
    trackReveals(state, next);
    prev = state;
    state = next;
    safely(() => render(state, prev));
    scheduleSave();
  }

  function dispatch(intent: Intent): void {
    actionCount += 1;
    commit(reduce(state, intent));
  }

  // ── crash boundary ──
  function safely(fn: () => void): void {
    try {
      fn();
    } catch (err) {
      crashed = true;
      void save.bumpCrashCount();
      note(
        root!,
        'Something went wrong drawing the page. Your progress is saved; reload to continue.',
      );
      console.error('[kami-kakushi] render/tick error', err);
    }
  }

  // ── debounced autosave (+ a calm couldn't-save notice on rejection, Q44) ──
  let saveTimer: number | undefined;
  function scheduleSave(): void {
    if (saveTimer !== undefined) return;
    saveTimer = window.setTimeout(() => {
      saveTimer = undefined;
      void flushSave();
    }, AUTOSAVE_DEBOUNCE_MS);
  }
  async function flushSave(): Promise<void> {
    const res = await save.save(state);
    if (!res.ok && res.reason === 'all-backends-failed') {
      note(root!, "Couldn't save — export a backup from the menu to be safe.");
    }
  }

  // ── active-only tick loop (PRD §6.9 / FU23): tab-open auto-repeat labour gives the
  // "leave it running" feel — strictly active-only (no offline catch-up). ──
  window.setInterval(() => {
    if (paused || document.hidden || crashed) return;
    // auto-fight takes priority over auto-labour
    if (state.autoCombat) {
      if (
        state.character.satiety < satietyMax(state) * 0.25 &&
        availableActions(state).includes('rest')
      ) {
        dispatch({ type: 'rest' });
      } else {
        dispatch({ type: 'fight', mobId: state.autoCombat });
      }
      return;
    }
    const auto = state.autoActivity;
    if (!auto) return;
    const act = getActivity(auto);
    // auto-manage stamina so an unattended grind doesn't crawl at the floor
    if (
      state.character.satiety < satietyMax(state) * 0.25 &&
      availableActions(state).includes('rest')
    ) {
      dispatch({ type: 'rest' });
      return;
    }
    if (canDoActivity(state, act)) dispatch({ type: 'do_activity', activityId: auto });
    else dispatch({ type: 'set_auto', activityId: null });
  }, AUTO_REPEAT_MS);

  // ── tick-interval autosave (Block N M0 DoD) ──
  window.setInterval(() => {
    if (crashed) return;
    void flushSave();
  }, AUTOSAVE_TICK_INTERVAL_MS);

  // save on hide / unload (best-effort)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) void flushSave();
  });
  window.addEventListener('beforeunload', () => {
    void flushSave();
  });

  // ── DEV play API (PRD §6.10) — DEV-only, dead-code-eliminated in production ──
  if (import.meta.env.DEV) {
    const qa = {
      state: () => state,
      dispatch: (intent: Intent) => dispatch(intent),
      activity: (id: ActivityId) => dispatch({ type: 'do_activity', activityId: id }),
      auto: (id: ActivityId | null) => dispatch({ type: 'set_auto', activityId: id }),
      // greedy time-compression to a target rung — drives the REAL intents (no fabricated state)
      toRung: (id: RankId) => {
        let guard = 0;
        while (state.rung !== id && guard++ < 8000) {
          if (availableActions(state).includes('open_eyes')) {
            dispatch({ type: 'open_eyes' });
            continue;
          }
          if (
            state.character.satiety < satietyMax(state) * 0.2 &&
            availableActions(state).includes('rest')
          ) {
            dispatch({ type: 'rest' });
            continue;
          }
          const labours = availableLabours(state).filter((l) => l.available);
          if (labours.length > 0) {
            dispatch({ type: 'do_activity', activityId: labours[0]!.activity.id });
            continue;
          }
          if (availableActions(state).includes('rake_rice')) {
            dispatch({ type: 'rake_rice' });
            continue;
          }
          break;
        }
        return state.rung;
      },
      faceWolf: () => dispatch({ type: 'face_wolf' }),
      fight: (mobId: MobId) => dispatch({ type: 'fight', mobId }),
      autoCombat: (mobId: MobId | null) => dispatch({ type: 'set_auto_combat', mobId }),
      tick: (dt: number) => commit(coreTick(state, dt)),
      frames: (n: number) => {
        for (let i = 0; i < n; i++) safely(() => render(state, prev));
      },
      pause: () => {
        paused = true;
      },
      resume: () => {
        paused = false;
      },
      newGame: (seed = DEFAULT_SEED, p: BalanceProfile = bootProfile) => {
        prev = null;
        state = createInitialState(seed, p);
        reveals.length = 0;
        actionCount = 0;
        safely(() => render(state, null));
      },
      profile: () => state.balanceProfile,
      setProfile: (p: BalanceProfile) => {
        try {
          localStorage.setItem('kk.balanceProfile', p);
        } catch {
          /* ignore */
        }
        prev = null;
        state = createInitialState(DEFAULT_SEED, p);
        reveals.length = 0;
        actionCount = 0;
        safely(() => render(state, null));
      },
      save: () => save.exportState(state),
      load: async (b64: string) => {
        const res = await save.importState(b64);
        if ('state' in res) {
          prev = null;
          state = res.state;
          safely(() => render(state, null));
        }
        return res;
      },
      forceState: (patch: Partial<GameState>) => {
        commit({ ...state, ...patch });
      },
      setSeed: (seed: number) => {
        prev = null;
        state = createInitialState(seed);
        safely(() => render(state, null));
      },
      pacing: () => ({
        actionCount,
        ticks: state.clock.day * 24 + state.clock.tick,
        reveals: reveals.length,
      }),
      reveals: () => reveals.slice(),
      selectors: {
        unlocked: () => state.unlocked.slice(),
        tier: () => 0,
        rung: () => state.rung,
        combatLevel: () => state.character.level,
      },
    };
    (window as unknown as { __qa?: typeof qa }).__qa = qa;
  }
}

function note(root: HTMLElement, text: string): void {
  const banner = document.createElement('div');
  banner.setAttribute('role', 'status');
  banner.style.cssText =
    'padding:.5rem 1rem;background:#ddcfae;color:#26221e;border-bottom:1px solid #7a6c59;font:0.9rem/1.4 serif;';
  banner.textContent = text;
  root.prepend(banner);
  window.setTimeout(() => banner.remove(), 6000);
}

void boot();
