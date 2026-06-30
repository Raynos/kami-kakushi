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
  getWeapon,
  durabilityBand,
  satietyMax,
  hpMax,
  isUnlocked,
  balance,
  type GameState,
  type Intent,
  type ActivityId,
  type RankId,
  type MobId,
  type StanceId,
} from '../core';
import { createBrowserSaveManager, type SaveManager } from '../persistence';
import { mount } from '../ui';
import { createSfx } from '../ui/sfx';
import { createDevApi, mountDevPanel } from '../ui/dev';

const DEFAULT_SEED = 20260626;
const AUTOSAVE_DEBOUNCE_MS = 800;
const AUTOSAVE_TICK_INTERVAL_MS = 15_000;
const { AUTO_REPEAT_MS } = balance; // the "leave it running" cadence (active-only), single-sourced

interface RevealMark {
  id: string;
  tick: number;
}

async function boot(): Promise<void> {
  const root = document.getElementById('app');
  if (!root) return;

  const save: SaveManager = createBrowserSaveManager();

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
    if (loaded.migrated) {
      note(root, 'We updated your saved game to the latest version of Kamikakushi.');
    } else if (loaded.coerced) {
      note(root, 'We mended a small problem in your saved game and carried on — nothing was lost.');
    }
  } else {
    state = createInitialState(DEFAULT_SEED);
  }

  let prev: GameState | null = null;

  // reveal tracking (for the __qa reveal-cadence proxy)
  const reveals: RevealMark[] = state.unlocked.map((id) => ({ id, tick: state.clock.tick }));
  let actionCount = 0;
  let paused = false;
  let crashed = false;

  // the synth SFX engine (T0-M1-F4 juice) — the app owns the ONE instance + threads it to
  // the renderer via hooks. honorReducedMotion consults the OS prefers-reduced-motion signal.
  const sfx = createSfx({ honorReducedMotion: true });

  // app hooks for the Settings/About surface (export/import save, a11y, pause, sound)
  const hooks = {
    sfx,
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
      state = createInitialState(DEFAULT_SEED);
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

  // DEV-only variant harness (D-075) — undefined in prod (the ternary folds to `undefined`, so
  // ui/dev.ts tree-shakes out of the bundle). Threaded into the renderer + the DEV panel below.
  const dev = import.meta.env.DEV ? createDevApi() : undefined;

  const render = mount(root, dispatch, hooks, dev);

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
    // one taiko hit per player-driven deed/fight (the T0-M1-F4 hit cue; per-strike combat
    // SFX is out of this minimal pass). Lazy AudioContext respects the user-gesture rule.
    if (intent.type === 'do_activity' || intent.type === 'fight' || intent.type === 'face_wolf') {
      sfx.hit();
    }
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
  // "leave it running" feel — strictly active-only (no offline catch-up). One autoStep per
  // AUTO_REPEAT_MS; the DEV speed toggle runs N steps per tick (autoSpeed = 1 in prod). ──
  let autoSpeed = 1; // DEV-only 2×/4×/8× time multiplier (prod stays 1; set via __qa.speed)
  function autoStep(): void {
    if (paused || document.hidden || crashed) return;
    // auto-fight takes priority over auto-labour
    if (state.autoCombat) {
      if (
        state.character.satiety < satietyMax(state) * 0.25 &&
        availableActions(state).includes('rest')
      ) {
        dispatch({ type: 'rest' });
        return;
      }
      // auto-manage HP (D-050: HP carries + heals ONLY by eating). A hurt fighter's win-rate
      // craters, so mend before fighting: cook if greens are on hand, else forage for them; if
      // you can do neither, STOP rather than feed a losing grind at low HP.
      if (state.character.hp < hpMax(state) * balance.COMBAT_HEAL_FRAC) {
        if (
          isUnlocked(state, 'verb-cook') &&
          (state.resources.sansai ?? 0) >= balance.COOK_SANSAI_COST
        ) {
          dispatch({ type: 'cook_meal' });
          return;
        }
        const forage = availableLabours(state).find(
          (l) => l.available && l.activity.id === 'forage_satoyama',
        );
        if (forage) {
          dispatch({ type: 'do_activity', activityId: 'forage_satoyama' });
          return;
        }
        dispatch({ type: 'set_auto_combat', mobId: null });
        return;
      }
      // auto-manage durability: a worn weapon's win-rate craters (Broken = ~0%), so an
      // unattended grind must not silently fight a broken blade forever. Repair when wood
      // allows; if Broken with no wood, STOP auto-combat rather than grind at ~0%.
      const weapon = getWeapon(state.equippedWeapon);
      const band = durabilityBand(state.weaponDurability, weapon.durabilityMax);
      const worn = band.name === 'Battered' || band.name === 'Broken';
      if (worn && (state.resources.wood ?? 0) >= balance.REPAIR_WOOD_COST) {
        dispatch({ type: 'repair_weapon' });
        return;
      }
      if (band.name === 'Broken') {
        dispatch({ type: 'set_auto_combat', mobId: null });
        return;
      }
      dispatch({ type: 'fight', mobId: state.autoCombat });
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
  }
  window.setInterval(() => {
    for (let i = 0; i < autoSpeed; i++) autoStep();
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
      setStance: (stance: StanceId) => dispatch({ type: 'set_stance', stance }),
      // ── DEV playtest tools (DS#1/DS#16/D-067) — speed toggle + jump-to teleports ──
      /** 2×/4×/8× time multiplier: run N auto-steps per tick (1 = prod cadence). */
      speed: (mult: number) => {
        autoSpeed = Math.max(1, Math.floor(mult));
        return autoSpeed;
      },
      /** Jump to the R7 capstone (Phase 2 open) so the live macro spine is reachable at once. */
      jumpToPhase2: () => {
        commit({
          ...state,
          rung: 'R7',
          flags: { ...state.flags, awake: true, 'rank-r7': true, 't0-capstone': true },
          unlocked: [...new Set([...state.unlocked, 'panel-house-influence'])],
        });
        return state.rung;
      },
      /** Jump to an ascension-ready state (Estate EXCELLENT) so the T0→T1 ceremony is one click away. */
      jumpToAscension: () => {
        const exc = balance.ESTATE_BANDS.excellent;
        commit({
          ...state,
          rung: 'R7',
          tier: 0,
          flags: {
            ...state.flags,
            awake: true,
            'rank-r7': true,
            't0-capstone': true,
            'porters-knot': true,
          },
          unlocked: [...new Set([...state.unlocked, 'panel-house-influence'])],
          influence: { estate: { value: exc, highWater: exc, judged: 0 } },
        });
      },
      /** Teleport the stored tier (the jump-to-tier teleport; pairs with toRung). */
      toTier: (t: number) => commit({ ...state, tier: Math.max(0, Math.floor(t)) }),
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
      newGame: (seed = DEFAULT_SEED) => {
        prev = null;
        state = createInitialState(seed);
        reveals.length = 0;
        actionCount = 0;
        safely(() => render(state, null));
      },
      // (D-056: profile/setProfile retired with the DEMO/REAL fork — single profile now.
      //  The DEV speed toggle + teleports below STAY: they're the permanent review harness.)
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
        tier: () => state.tier,
        rung: () => state.rung,
        combatLevel: () => state.character.level,
      },
    };
    (window as unknown as { __qa?: typeof qa }).__qa = qa;

    // the in-UI DEV panel — the __qa tools as buttons + the live variant toggle (D-075). Hosts
    // on document.body (fixed-position) so it floats over the shell regardless of #app styling.
    if (dev) {
      mountDevPanel(document.body, {
        qa,
        dev,
        rerender: () => safely(() => render(state, null)),
      });
    }
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
