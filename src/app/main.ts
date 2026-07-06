// Composition root (PRD §6.2): wires core ↔ ui ↔ persistence, runs the active-only
// tick loop, wraps tick/render in a crash boundary (D-044), and installs window.__qa
// in DEV. The renderer never mutates state; the core is the only place state changes.

import {
  createInitialState,
  reduce,
  tick as coreTick,
  autoModeIntent,
  nextHopToward,
  getMob,
  applyPromotion,
  nextRankId,
  revealPass,
  RANKS,
  balance,
  type GameState,
  type Intent,
  type ActivityId,
  type RankId,
  type MobId,
  type StanceId,
} from '../core';
import { createBrowserSaveManager, type SaveManager, toBase64 } from '../persistence';
import { getFixtures, getFixture } from '../fixtures';
import { mount } from '../ui';
import { createSfx } from '../ui/sfx';
import { createDevApi, mountDevPanel, createBalanceCockpit } from '../ui/dev';
import { mountCapture } from '../ui/capture';
import { snapshotDom } from '../ui/capture-screenshot';
import { createTelemetry } from '../telemetry';
import { resolveDevGating } from './dev-gating';

const DEFAULT_SEED = 20260626;
const AUTOSAVE_DEBOUNCE_MS = 800;
const AUTOSAVE_TICK_INTERVAL_MS = 15_000;
const { AUTO_REPEAT_MS } = balance; // the "leave it running" cadence (active-only), single-sourced

interface RevealMark {
  id: string;
  tick: number;
}

/** Compute the DEV rung-teleport target state, working in EITHER direction (F68). Pure: no side
 *  effects — returns the landed state plus whether a reset happened (so the caller clears its
 *  reveal/action counters). Climb UP from `current`; jump AT-OR-BELOW the current rung ⇒ a fresh
 *  `createInitialState` FIRST (so no stale higher-rung unlock/panel lingers) then re-climb — the
 *  human's "new game + RX back-to-back to go down a rung". O(rungs) `applyPromotion` calls, NO
 *  tick-resim (keeps the F24 no-CPU-spin fix). Exported so the descend-resets-then-climbs logic is
 *  unit-testable against the pure core.
 *
 *  D-110: the DEV seek BYPASSES the rung beats by design — it calls `applyPromotion` directly per
 *  rung (a dev jump, not the player path), so the DEV teleport still reaches any rung without
 *  driving a VN modal. The only story-half gates below R4 are granted so the raw apply is coherent. */
export function planRungJump(
  current: GameState,
  target: RankId,
): { reset: boolean; state: GameState } {
  const order = RANKS.map((r) => r.id);
  const targetIdx = order.indexOf(target);
  if (targetIdx < 0) return { reset: false, state: current }; // unknown rung → no-op
  // The only story-half gates below R4 (R1 `farmed`, R2 `first-fight-survived`, R3 `combat-blooded`);
  // granting all three is harmless (R0 + R4…R7 are always-ready) and keeps the flag record coherent.
  const storyFlags = { farmed: true, 'first-fight-survived': true, 'combat-blooded': true };
  // Descend or self-jump ⇒ reset: a fresh game clears EVERY higher-rung unlock, then we re-climb.
  const reset = targetIdx <= order.indexOf(current.rung);
  let s = reset ? createInitialState(DEFAULT_SEED) : current;
  let guard = 0;
  // Apply one promotion INTO the next rung until the target is reached (applyPromotion bumps exactly
  // one rung, fires its rewards + the terse marker, and zeroes the meter).
  while (order.indexOf(s.rung) < targetIdx && guard++ < order.length) {
    const nid = nextRankId(s.rung);
    if (!nid) break;
    s = applyPromotion({ ...s, flags: { ...s.flags, ...storyFlags } }, nid);
  }
  return { reset, state: s };
}

async function boot(): Promise<void> {
  const root = document.getElementById('app');
  if (!root) return;

  const save: SaveManager = createBrowserSaveManager();

  // D-138 — the two-axis DEV-tools gate, resolved ONCE at boot. `__DEV_TOOLS__` is
  // the build-time inclusion gate (tree-shaking); `gating.{qa,panel}` is the runtime
  // activation. In a dev serve both default on (`?dev=no` opts the panel out, __qa
  // stays for e2e). In a T0 prod bundle both default OFF, opt-in via `?dev=yes`.
  const gating = resolveDevGating(
    import.meta.env.DEV,
    __DEV_TOOLS__,
    typeof window !== 'undefined' ? window.location.search : '',
  );

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

  // F6 — `?fixture=<name>` DEV boot param: replace the loaded run with a named scenario save. Backs
  // up the real run to the F96 slot FIRST (so navigating here is never a silent loss), then routes
  // through the SAME import → migrate → validate path as a normal load (and adopts it, so a reload
  // keeps you in the scenario). Stripped from prod with the whole DEV branch.
  let bootedFromFixture = false;
  if (__DEV_TOOLS__ && gating.qa) {
    const fixtureName =
      typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search).get('fixture')
        : null;
    if (fixtureName) {
      const fixture = getFixture(fixtureName);
      if (fixture) {
        await save.backup(state);
        const res = await save.importState(toBase64(JSON.stringify(fixture.env)));
        if ('state' in res) {
          state = res.state;
          bootedFromFixture = true;
        } else note(root, `Fixture "${fixtureName}" failed to load: ${res.reason}`);
      } else {
        note(root, `Unknown fixture "${fixtureName}".`);
      }
    }
  }

  // Load-path reveal reconciliation (audit fix). The `unlocked` latch is write-once, but several
  // surfaces are STATE-PREDICATE reveals (readout-coin on coin>0, panel-estate/verb-eat-rice on a
  // latched ladder, …). A loaded/migrated save can ALREADY satisfy such a predicate while its
  // stored `unlocked` set predates it — so run ONE revealPass now (mirroring what a tick/reduce
  // does via finish()) to latch every already-earned surface BEFORE the first render. Without it a
  // back-revealable surface stays hidden until the player's first dispatched intent.
  state = revealPass(state);

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
          // reconcile the imported save's write-once latch against its state predicates (same
          // load-path back-reveal as boot) before the first render.
          state = revealPass(res.state);
          telemetry?.onRunStart('import', state); // F8: an imported save is a new (tainted) run
          safely(() => render(state, null));
        } else {
          // surface a FAILED restore — otherwise the modal just closes and a bad/truncated save
          // code looks like it loaded (this is the primary cross-device backup path).
          note(root, "That save code couldn't be read — check you copied the whole thing.");
        }
      })();
    },
    newGame: (): void => {
      prev = null;
      state = createInitialState(DEFAULT_SEED);
      reveals.length = 0;
      actionCount = 0;
      telemetry?.onRunStart('new-game', state); // F8: fresh run record (history kept, run-id tagged)
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

  // The D-075 variant harness — undefined when the panel isn't active (the ternary folds to
  // `undefined`, so ui/dev.ts tree-shakes when `__DEV_TOOLS__` is false). Threaded into the
  // renderer + the DEV panel below. `gating.panel` is off under `?dev=no` in a dev build (the
  // human previews the TRUE player-facing layout, playtest F2) and default-off in a T0 prod
  // bundle (opt-in `?dev=yes`) — see resolveDevGating (D-138).
  const dev = __DEV_TOOLS__ && gating.panel ? createDevApi() : undefined;

  // F8 — attended-time telemetry (DEV-only; the same ternary-fold idiom, so src/telemetry/
  // tree-shakes out of prod — verify-dev-strip.sh greps for its sentinel to PROVE it).
  // Deliberately OUTSIDE the `if (dev)` gate: `?dev=no` true-layout playtests are exactly the
  // sessions worth measuring, and telemetry has no visible surface to distort them.
  // `?telemetry=no` (also =0/=off) opts OUT so automated runs (the e2e lane) don't drop
  // machine-time reports into project/telemetry/ and pollute the human's attended-play sensor.
  const telemetryOff =
    typeof window !== 'undefined' &&
    /[?&]telemetry=(?:no|0|off|false)\b/i.test(window.location.search);
  const telemetry =
    import.meta.env.DEV && !telemetryOff
      ? createTelemetry({ build: { version: __VERSION__, sha: __BUILD_SHA__ } })
      : undefined;
  // 'resume' (boot with an existing save) CONTINUES the newest stored run for this seed —
  // the human F5s a lot; a reload must never fragment the run history (plan §3.1).
  telemetry?.onRunStart(bootedFromFixture ? 'fixture' : loaded ? 'resume' : 'boot', state);

  // The RENDERER'S dispatch copy only is wrapped — every intent through it is a PLAYER intent.
  // autoStep below keeps the raw dispatch (auto-mode intents are not the human acting).
  const render = mount(root, telemetry ? telemetry.wrapDispatch(dispatch) : dispatch, hooks, dev);

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
    // F8 — the milestone tap: rung-ups/ascensions/losses + auto/note transitions, observed as
    // a (prev, next) diff exactly like trackReveals. One DEV-guarded line; core untouched.
    if (import.meta.env.DEV) telemetry?.onCommit(state, next);
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
  // A caught render/tick error draws a FULL-SCREEN error modal (F61) that COVERS the
  // broken/half-drawn UI — an intentional error screen, not a banner over a blank page.
  // The save already happened (autosave/debounce), so "your progress is saved" holds.
  function safely(fn: () => void): void {
    try {
      fn();
    } catch (err) {
      crashed = true;
      void save.bumpCrashCount();
      showErrorModal(err);
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
    // The DECISION is the pure core's autoModeIntent (F4 Ph3 — the sim's idler persona consumes
    // the SAME function, so the shipped auto-loop and the sim can never desync); this loop keeps
    // only the app concerns: the DOM guards above and the dispatch below.
    const intent = autoModeIntent(state);
    if (intent) dispatch(intent);
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

  // ── DEV play API (PRD §6.10) — shipped when `__DEV_TOOLS__` (T0: into gh-pages too), but
  //    ACTIVE only when `gating.qa` (dev serve always; a T0 prod bundle only under `?dev=yes`).
  //    When `__DEV_TOOLS__` is statically false (post-T0) the whole block dead-code-eliminates. ──
  if (__DEV_TOOLS__ && gating.qa) {
    // walk the REVEALED map graph to a node via real move_to hops (Step 5b: activities + foes are
    // spatial, so every DEV drive-to must navigate — the shared BFS keeps it honest to the graph).
    const walkTo = (node: string): string => {
      let guard = 0;
      while (state.location !== node && guard++ < 64) {
        const hop = nextHopToward(state.location, node, new Set(state.unlocked));
        if (!hop) break;
        const from = state.location;
        dispatch({ type: 'move_to', to: hop });
        if (state.location === from) break; // hop refused (e.g. a danger-ring gate) — stop, don't spin
      }
      return state.location;
    };
    // F7 — the balance-tuning cockpit controller, shared by the DEV panel's Balance sub-tab and the
    // headless `__qa.balance` handle. onChange re-renders so a live override refreshes interpolated
    // tooltips; meta captures the export header (build stamp + seed + clock) from live state.
    const cockpit = createBalanceCockpit({
      onChange: () => safely(() => render(state, null)),
      meta: () => ({
        build: `${__VERSION__} (${__BUILD_SHA__}, ${__BUILD_DATE__})`,
        seed: state.rng.seed,
        clock: { day: state.clock.day, tick: state.clock.tick },
        capturedAt: new Date().toISOString(),
      }),
    });

    // F8 — the taint ledger (plan §3.1): any __qa drive/teleport/time-distortion labels the
    // run, so agent-driven or cheated sessions can never silently pollute the human pacing
    // data (they render labelled, excluded from the vs-sim comparison).
    const qaTaint = (name: string): void => telemetry?.taint(name);

    const qa = {
      state: () => state,
      dispatch: (intent: Intent) => {
        qaTaint('qa-drive');
        dispatch(intent);
      },
      // F7 — headless balance-cockpit handle: set(path,v) / read / touched / reset / exportMarkdown.
      balance: cockpit,
      activity: (id: ActivityId) => {
        qaTaint('qa-drive');
        dispatch({ type: 'do_activity', activityId: id });
      },
      auto: (id: ActivityId | null) => {
        qaTaint('qa-drive');
        dispatch({ type: 'set_auto', activityId: id });
      },
      /** Walk to a map node via real move_to hops over the revealed graph. */
      goto: (node: string) => {
        qaTaint('qa-drive');
        return walkTo(node);
      },
      // DEV teleport to ANY rung, in EITHER direction (F68). This USED to greedily re-simulate the
      // focused-optimal policy tick-by-tick (up to 50_000 steps, each a fresh map BFS) — a long
      // synchronous sim that spun the CPU and FROZE the page (F24); it also only ever climbed UP.
      // Now the pure `planRungJump` does the work: climbing up promotes from the current state as
      // before; a jump AT-OR-BELOW the current rung RESETS to a fresh game first (clearing every
      // stale higher-rung unlock/panel) then re-climbs — the human's "new game + RX back-to-back to
      // go down a rung". Still O(rungs) applyPromotion calls with NO tick-resim, so the F24 fix holds.
      toRung: (id: RankId) => {
        qaTaint('toRung');
        const plan = planRungJump(state, id);
        if (plan.state === state) return state.rung; // unknown target → no-op
        if (plan.reset) {
          // Mirror newGame: drop to the freshly-climbed target state with NO diff against the old
          // higher-rung state — so no phantom reveal-animation fires and no abandoned panel lingers.
          prev = null;
          reveals.length = 0;
          actionCount = 0;
          state = plan.state;
          safely(() => render(state, null));
          scheduleSave();
        } else {
          // Upward: a single commit of the fully-climbed state; trackReveals still records every
          // newly-unlocked id and the accumulated milestone log rides along.
          commit(plan.state);
        }
        return state.rung;
      },
      // spatial (Step 5b): walk to the foe's ground first, then face it — so a DEV drive fights the
      // real foe on its node rather than silently no-opping off it.
      faceWolf: () => {
        qaTaint('qa-drive');
        walkTo(getMob('wolf_scripted').area);
        dispatch({ type: 'face_wolf' });
      },
      fight: (mobId: MobId) => {
        qaTaint('qa-drive');
        walkTo(getMob(mobId).area);
        dispatch({ type: 'fight', mobId });
      },
      autoCombat: (mobId: MobId | null) => {
        qaTaint('qa-drive');
        dispatch({ type: 'set_auto_combat', mobId });
      },
      setStance: (stance: StanceId) => dispatch({ type: 'set_stance', stance }),
      // ── DEV playtest tools (DS#1/DS#16/D-067) — speed toggle + jump-to teleports ──
      /** 2×/4×/8× time multiplier: run N auto-steps per tick (1 = prod cadence). */
      speed: (mult: number) => {
        autoSpeed = Math.max(1, Math.floor(mult));
        if (autoSpeed > 1) qaTaint('speed>1'); // F8: distorted time — pacing data unusable
        return autoSpeed;
      },
      /** Jump to the R7 capstone (Phase 2 open) so the live macro spine is reachable at once. */
      jumpToPhase2: () => {
        qaTaint('jumpToPhase2');
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
        qaTaint('jumpToAscension');
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
      toTier: (t: number) => {
        qaTaint('toTier');
        commit({ ...state, tier: Math.max(0, Math.floor(t)) });
      },
      tick: (dt: number) => {
        qaTaint('qa.tick');
        commit(coreTick(state, dt));
      },
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
        // F96 — snapshot the CURRENT run to the backup slot BEFORE wiping it, so a New game is
        // never an irrecoverable loss. `backup(state)` encodes the old state synchronously (the
        // envelope is built before the first await), so reassigning `state` below is safe.
        void save.backup(state);
        prev = null;
        state = createInitialState(seed);
        reveals.length = 0;
        actionCount = 0;
        telemetry?.onRunStart('new-game', state); // F8
        safely(() => render(state, null));
      },
      // F96 — the save-backup safety net exposed for the DEV panel's "goto last backup" button.
      backupSave: () => save.backup(state),
      hasBackup: () => save.hasBackup(),
      restoreBackup: async () => {
        const res = await save.restoreBackup();
        if ('state' in res) {
          prev = null;
          state = res.state;
          reveals.length = 0;
          actionCount = 0;
          telemetry?.onRunStart('import', state); // F8
          safely(() => render(state, null));
          return true;
        }
        return false;
      },
      // (D-056: profile/setProfile retired with the DEMO/REAL fork — single profile now.
      //  The DEV speed toggle + teleports below STAY: they're the permanent review harness.)
      save: () => save.exportState(state),
      load: async (b64: string) => {
        const res = await save.importState(b64);
        if ('state' in res) {
          prev = null;
          // reconcile the imported save's write-once latch against its state predicates (same
          // load-path back-reveal as boot) before the first render.
          state = revealPass(res.state);
          telemetry?.onRunStart('import', state); // F8: tainted `save-import` run
          safely(() => render(state, null));
        }
        return res;
      },
      // F6 — load a NAMED scenario fixture (the generated envelope). Backs up the CURRENT run to the
      // F96 slot FIRST (same safety net as newGame), then runs the FULL import → migrate → validate
      // path via `load` (re-encoding the pretty-printed envelope to the base64 the codec expects), so
      // a playtest can never destroy the human's real save — "↩ last backup" is the way home.
      loadFixture: async (name: string) => {
        const fixture = getFixture(name);
        if (!fixture) return { ok: false as const, reason: `unknown-fixture:${name}` };
        await save.backup(state);
        return qa.load(toBase64(JSON.stringify(fixture.env)));
      },
      /** List the available scenarios ({ name, blurb }) — the DEV panel + headless drivers read it. */
      fixtures: () => getFixtures().map(({ name, blurb }) => ({ name, blurb })),
      forceState: (patch: Partial<GameState>) => {
        qaTaint('forceState');
        commit({ ...state, ...patch });
      },
      setSeed: (seed: number) => {
        prev = null;
        state = createInitialState(seed);
        telemetry?.onRunStart('new-game', state); // F8
        safely(() => render(state, null));
      },
      // F8 — the attended-time handle: summary / report / segments / runs / configure / clear.
      telemetry: telemetry?.qa,
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

    // F7 — apply any `?bal.<path>=<value>` overrides from the URL (F5-survival + shareable tune
    // links). OUTSIDE the `if (dev)` gate so a shared tune link still applies under `?dev=no` (the
    // true-layout playtest carries the override set, mirroring the capture overlay).
    cockpit.hydrate();

    // the in-UI DEV panel — the __qa tools as buttons + the live variant toggle (D-075). Hosts
    // on document.body (fixed-position) so it floats over the shell regardless of #app styling.
    if (dev) {
      mountDevPanel(document.body, {
        qa,
        dev,
        rerender: () => safely(() => render(state, null)),
        cockpit,
      });
    }
  }

  // ── F3 playtest capture overlay: `` ` `` → note box → POST to the dev-inbox → vanish.
  //    SERVER-COUPLED (POSTs to a dev-server endpoint absent on gh-pages), so it stays gated on
  //    `import.meta.env.DEV` alone — OUT of the T0 `__DEV_TOOLS__` ship set (D-138 scope). It runs
  //    on the dev server even under `?dev=no` (the human's true-layout preview keeps capture — F2)
  //    and is fully stripped from any prod bundle. Evidence (context + screenshot) is frozen at
  //    box-OPEN by mountCapture; buildContext reads the LIVE `state` each open.
  if (import.meta.env.DEV) {
    mountCapture({
      host: root,
      snapshot: snapshotDom,
      build: { version: __VERSION__, sha: __BUILD_SHA__, date: __BUILD_DATE__ },
      buildContext: () => ({
        seed: state.rng.seed,
        clock: { day: state.clock.day, tick: state.clock.tick },
        location: state.location,
        rung: state.rung,
        tier: state.tier,
        activeTab: root.dataset.activeTab ?? 'work',
        // non-default variant picks only ({} under `?dev=no`, where dev is undefined)
        variants: dev
          ? Object.fromEntries(
              dev.surfaces
                .filter((s) => dev.getVariant(s.id) !== s.variants[0]!.id)
                .map((s) => [s.id, dev.getVariant(s.id)]),
            )
          : {},
        viewport: { w: window.innerWidth, h: window.innerHeight, dpr: window.devicePixelRatio },
        url: window.location.pathname + window.location.search,
        saveBase64: save.exportState(state),
        logTail: state.log.entries.slice(-20).map((e) => ({
          channel: e.channel,
          text: e.text,
          count: e.count,
          ...(e.speaker !== undefined ? { speaker: e.speaker } : {}),
        })),
      }),
    });
  }
}

// Full-screen render/tick crash screen (F61). A caught error mounts ONE fixed,
// full-viewport overlay on <body> (high z-index) in the woodblock/ink palette — a dark
// ink ground under a washi card — so a crash reads as a clean, intentional error screen
// that COVERS the broken UI, never a banner over a blank/half-drawn page. Idempotent:
// reuses/replaces a single `#error-modal` node so repeated errors don't stack modals.
// Wrapped in its own try/catch so the crash screen can never itself throw.
function showErrorModal(err: unknown): void {
  try {
    const id = 'error-modal';
    const existing = document.getElementById(id);
    const modal = existing ?? document.createElement('div');
    modal.id = id;
    modal.setAttribute('role', 'alertdialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'error-modal-title');
    // solid, fixed, full-viewport ink ground (max z-index) that covers everything
    modal.style.cssText =
      'position:fixed;inset:0;z-index:2147483647;display:flex;align-items:center;' +
      'justify-content:center;box-sizing:border-box;padding:1.5rem;' +
      'background:radial-gradient(120% 90% at 50% 0%, #2e2a24, #1a1713);' +
      "font:16px/1.6 'Hiragino Mincho ProN','Yu Mincho',serif;";
    modal.replaceChildren(); // rebuild content so the LATEST error shows, never stacked

    const card = document.createElement('div');
    card.style.cssText =
      'width:100%;max-width:min(560px,92vw);box-sizing:border-box;background:#F3E9D2;' +
      'color:#26221E;border:1px solid #26221E;border-radius:2px;padding:2rem 2.25rem;' +
      'box-shadow:0 2px 0 #00000030, 0 18px 44px #00000066;text-align:center;';

    // a tasteful kanji nod — 隠 ("kakushi", hidden): the page has been spirited away
    const kanji = document.createElement('div');
    kanji.textContent = '隠';
    kanji.setAttribute('aria-hidden', 'true');
    kanji.style.cssText =
      'font-size:2.75rem;line-height:1;color:#D7402C;margin-bottom:.75rem;font-weight:400;';

    const heading = document.createElement('h1');
    heading.id = 'error-modal-title';
    heading.textContent = 'Something went wrong';
    heading.style.cssText =
      'margin:0 0 .5rem;font-size:1.5rem;font-weight:600;color:#26221E;letter-spacing:.01em;';

    const reassure = document.createElement('p');
    reassure.textContent = 'Your progress is saved.';
    reassure.style.cssText = 'margin:0 0 1.5rem;font-size:1rem;color:#4A3F33;';

    const reload = document.createElement('button');
    reload.type = 'button';
    reload.textContent = 'Reload';
    reload.style.cssText =
      'appearance:none;border:1px solid #A8301F;background:#D7402C;color:#F3E9D2;' +
      'font:inherit;font-size:1rem;font-weight:600;padding:.55rem 1.75rem;border-radius:2px;' +
      'cursor:pointer;box-shadow:0 2px 0 #00000030;';
    reload.addEventListener('click', () => location.reload());

    card.append(kanji, heading, reassure, reload);

    // DEV-only: the error message + stack in a monospace block for debugging (stripped from prod)
    if (import.meta.env.DEV) {
      const detail =
        err instanceof Error
          ? `${err.name}: ${err.message}\n\n${err.stack ?? '(no stack)'}`
          : String(err);
      const pre = document.createElement('pre');
      pre.textContent = detail;
      pre.style.cssText =
        'margin:1.5rem 0 0;padding:.75rem .9rem;text-align:left;white-space:pre-wrap;' +
        'word-break:break-word;max-height:40vh;overflow:auto;background:#E7D9BC;' +
        'border:1px solid #7A6C59;border-radius:2px;color:#26221E;' +
        'font:12px/1.5 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;';
      card.append(pre);
    }

    modal.append(card);
    if (!existing) document.body.appendChild(modal);
  } catch (e) {
    // the crash screen must never itself throw — fall back to the console only
    console.error('[kami-kakushi] failed to render error modal', e);
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
