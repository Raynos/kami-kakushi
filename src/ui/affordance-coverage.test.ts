// @vitest-environment jsdom
//
// Intent → affordance coverage ratchet (fable-2026-07-05-desktop-journey-e2e P4):
// every PLAYER-FACING intent must be dispatched by at least one clickable control
// across a small set of representative render states — the R6 net at the wiring
// layer. Two RED paths, by design:
//   1. a NEW intent added to the core union → the exhaustiveness trip below fails
//      the typecheck gate until the intent is classified here (wired or CONSCIOUSLY
//      allowlisted);
//   2. a removed/renamed control that orphans a wired intent → the runtime sweep
//      fails (the intent is no longer reachable from any mounted state).
// States come from the FB-6 fixture envelopes (cheap: parse + validate, NO simulation)
// plus a few one-intent reductions — rationing the vitest gate's time (AC-17).
import { describe, it, expect, beforeEach } from 'vitest';
import { mount, type AppHooks } from './render';
import { createActionClock } from '../app/action-clock';
import { validateEnvelope } from '../persistence/validate';
import { migrate } from '../persistence/migrate';
import { getFixtures } from '../fixtures';
import { createInitialState, reduce, type GameState, type Intent } from '../core';

type IntentType = Intent['type'];

/** Every intent a PLAYER reaches through a control. The sweep must see each one. */
const PLAYER_INTENTS = [
  'open_eyes',
  'ask_topic',
  'talk_to', // C4.2 — the who's-here Speak button (a vn person's next authored line)
  'choose_intro',
  'begin_rung_beat',
  'ask_rung_topic',
  'choose_rung_option',
  'rake_rice',
  'rest',
  'do_activity',
  'set_auto',
  'set_auto_rake',
  'fight',
  'set_auto_combat',
  'repair_weapon',
  'equip_weapon',
  'set_stance',
  'cook_meal',
  'eat_rice',
  'sell_rice',
  'improve_estate',
  'spend_attribute',
  'craft_weapon',
  'accept_quest',
  'buy_item',
  'buy_belonging',
  'deposit',
  'withdraw',
  'move_to',
  'ascend',
  // storywave G4.9 — the new-arc verbs, each now wired to a real dispatching control:
  'advance_season', // the season wheel's "End the season" button (clock-dock, R2+)
  'collect_wage', // the day-wage board (Work tab place strip, R5+)
  'begin_night_round', // the grain-watch post at the gate (Work tab place strip, R3)
  'advance_scene_beat', // a narration-only scene's Continue (the one VN modal)
  'choose_scene_option', // a decision scene's pick + Continue (the one VN modal)
] as const satisfies readonly IntentType[];

/** Intents with NO clickable control, on purpose — each entry carries its why.
 *  Moving an intent here is a CONSCIOUS act; the inverse check below flips RED the
 *  moment an allowlisted intent gains a control (then it belongs above). */
const NON_UI_INTENTS = [
  // the typewriter/auto-advance beats — driven by the render loop's timers and
  // transcript clicks routed through UI-local state, never a dedicated button
  'advance_intro',
  'advance_rung_beat',
  // storywave G4.9 — begin_scene is ENGINE-DRIVEN (auto-drained): the render loop opens a queued
  // scene the moment the queue holds one and no VN is live (the Count wakes you, a season overlay,
  // a discovered side-beat). Like advance_intro/advance_rung_beat, the player has NO control that
  // opens a scene — the player-facing scene controls are its Continue / pick (advance_scene_beat /
  // choose_scene_option, both in PLAYER_INTENTS). So it stays NON_UI by design.
  'begin_scene',
] as const satisfies readonly IntentType[];

// ── the exhaustiveness trip (compile-time, enforced by the typecheck gate) ──────
type Classified = (typeof PLAYER_INTENTS)[number] | (typeof NON_UI_INTENTS)[number];
type Unclassified = Exclude<IntentType, Classified>; // a new intent lands here
type Stale = Exclude<Classified, IntentType>; // a renamed/removed intent lands here
const _everyIntentClassified: Unclassified extends never ? true : Unclassified = true;
const _noStaleEntries: Stale extends never ? true : Stale = true;
void _everyIntentClassified;
void _noStaleEntries;

// ── DOM harness (render.test.ts's spy-mount, unchanged pattern) ─────────────────
function noopHooks(): AppHooks {
  let muted = false;
  return {
    exportSave: () => 'SAVE-CODE',
    importSave: () => {},
    newGame: () => {},
    setReducedMotion: () => {},
    setTextScale: () => {},
    togglePause: () => false,
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

/** Load a fixture envelope through the REAL import chain (parse + migrate +
 *  validate — no simulation; the same loader `__qa.loadFixture` uses). */
function fixtureState(name: string): GameState {
  const entry = getFixtures().find((f) => f.name === name);
  if (!entry) throw new Error(`unknown fixture ${name} — run fixtures:regen`);
  const v = validateEnvelope(entry.env, { migrate });
  if (!v.ok) throw new Error(`fixture ${name} rejected: ${v.reason}`);
  return v.state;
}

/** Mount `state`, then click every enabled control — TAB BY TAB (the panels are
 *  exclusive: sweeping tabs inside one flat pass leaves only the LAST tab's panel
 *  mounted), re-querying between passes so controls that appear from a UI-local
 *  click (a latched VN choice reveals Continue; a person-talk opens the market)
 *  get their turn too. Records every dispatched intent type into `seen`. */
function sweep(state: GameState, seen: Set<IntentType>): void {
  document.body.innerHTML = '';
  const root = document.createElement('div');
  document.body.append(root);
  const render = mount(root, (i: Intent) => void seen.add(i.type), noopHooks());
  render(state, null);

  const clicked = new Set<Element>();
  const clickPass = (): void => {
    for (let pass = 0; pass < 4; pass++) {
      // controls are <button>s PLUS role=button travel seals (the HR-7 survey-plan map wires
      // its SVG nodes as buttons — wireTravel — so the sweep must reach them too).
      const buttons = [...document.querySelectorAll<HTMLElement>('button, [role="button"]')].filter(
        (b) =>
          !(b instanceof HTMLButtonElement && b.disabled) &&
          b.getAttribute('aria-disabled') !== 'true' &&
          b.isConnected &&
          !clicked.has(b) &&
          !b.classList.contains('nav-tab') &&
          // never close a talked-open shop mid-sweep (person-talk toggles to "Leave …")
          !(b.textContent ?? '').startsWith('Leave '),
      );
      if (buttons.length === 0) break;
      for (const b of buttons) {
        if (!b.isConnected || (b instanceof HTMLButtonElement && b.disabled)) continue;
        clicked.add(b);
        b.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      }
      // let the patch path fold in anything a click revealed through UI-local state
      render(state, state);
    }
  };

  clickPass(); // the pre-tab surfaces: cold open, a VN scene, the header trigger
  const tabCount = document.querySelectorAll('.nav-tab').length;
  for (let ti = 0; ti < tabCount; ti++) {
    const tab = document.querySelectorAll<HTMLButtonElement>('.nav-tab')[ti];
    if (!tab) continue;
    tab.click();
    render(state, state);
    clickPass();
  }
}

describe('intent → affordance coverage (the wiring-layer ratchet)', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    window.matchMedia = (q: string): MediaQueryList =>
      ({
        matches: false,
        media: q,
        onchange: null,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => false,
      }) as unknown as MediaQueryList;
    window.confirm = () => false; // never let a sweep trigger New Game
    Element.prototype.scrollIntoView ??= () => {};
  });

  it('every player-facing intent is dispatched by some control, somewhere', () => {
    const seen = new Set<IntentType>();

    // cold open — the wake card
    sweep(createInitialState(1), seen);
    // the intro VN (ask → choose → continue), entered by the real intent
    sweep(reduce(createInitialState(1), { type: 'open_eyes' }), seen);

    // the fixture waypoints — every registered scenario gets a sweep, so a new
    // fixture automatically widens this net too
    for (const f of getFixtures()) sweep(fixtureState(f.name), seen);

    // two one-intent extensions past the registered waypoints:
    // inside the rung-beat VN (choose_rung_option lives there)
    const inBeat = reduce(fixtureState('rung-beat-ready'), { type: 'begin_rung_beat' });
    sweep(inBeat, seen);
    // just past the ceremony (spend_attribute needs boon points to spend)
    sweep(reduce(fixtureState('pre-ascension'), { type: 'ascend' }), seen);

    // synthetic RENDER states (the render.test pattern — a spread that flips one
    // field is honest at the wiring layer; FB-6's no-poke purity is the e2e lane's
    // contract, not this one's). Each exists to ENABLE one tail affordance:
    const worn = fixtureState('worn-weapon-no-wood');
    // equip_weapon: a forged axe waiting in the rack beside the equipped pole
    sweep({ ...worn, flags: { ...worn.flags, 'crafted-wood_axe': true } }, seen);
    // craft_weapon: standing at the smithy (the woodlot) with the recipe's inputs on hand
    sweep(
      {
        ...worn,
        location: 'woodlot',
        resources: { ...worn.resources, hardwood: 3, beast_sinew: 1 },
      },
      seen,
    );
    // buy_item + sell_rice: at the gate on a MARKET DAY (dayOfWeek 2 — Yohei stands his stall),
    // coin in the sleeve + kura rice to sell. The sweep talks to Yohei (opens his wares), then the
    // buy rows + the sell-rice faucet are live. (rice-at-gate carries no coin; force a market day so
    // Yohei is present — his presence gates the whole market pane.)
    const gate = fixtureState('rice-at-gate');
    sweep(
      { ...gate, clock: { ...gate.clock, day: 2 }, resources: { ...gate.resources, coin: 500 } },
      seen,
    );
    // ask_rung_topic: the R1/R2 beats are decide-only — R3's beat carries topics
    sweep({ ...inBeat, rungBeat: 'R3' }, seen);
    const r3 = fixtureState('fresh-R3-pre-wolf');
    // fight + set_auto_combat: standing on a combat zone (the field margins — tanuki/badger) with
    // combat live, so the watch lists a foe with its Fight button + auto-toggle.
    sweep({ ...r3, location: 'field-margins' }, seen);

    // ── storywave G4.9 — the new-arc verbs, each ENABLED by one synthetic render state ──
    const r5 = fixtureState('rung-R5');
    // advance_season: the season wheel's "End the season" button (clock-dock, shown R2+).
    sweep(r5, seen);
    // collect_wage: the day-wage board, with a day's wage standing unclaimed (R5+).
    sweep({ ...r5, wageDaysAccrued: 1 }, seen);
    // begin_night_round: the grain-watch post at the gate — R3-reached (`rank-r3`), not yet
    // survived, no round live, standing AT the gate.
    sweep(
      {
        ...r3,
        location: 'gate',
        roundState: null,
        flags: { ...r3.flags, 'rank-r3': true, 'wolf-survived-not-won': false },
      },
      seen,
    );
    // advance_scene_beat: a NARRATION-only scene live (the Autumn nengu frame) — its Continue.
    sweep({ ...r5, sceneQueue: [], activeScene: { id: 'nengu-autumn-frame', beat: 0 } }, seen);
    // choose_scene_option: a DECISION scene live (the Count) — pick an option, then Continue.
    sweep({ ...r5, sceneQueue: [], activeScene: { id: 'count', beat: 0 } }, seen);

    const missing = PLAYER_INTENTS.filter((t) => !seen.has(t));
    expect(
      missing,
      `player-facing intent(s) with NO reachable control in any representative state — ` +
        `build the surface or move them to NON_UI_INTENTS consciously: ${missing.join(', ')}`,
    ).toEqual([]);

    // the inverse ratchet: an allowlisted intent that GAINED a control belongs in
    // PLAYER_INTENTS — keep the classification honest in both directions
    const wronglyAllowlisted = NON_UI_INTENTS.filter((t) => seen.has(t));
    expect(
      wronglyAllowlisted,
      `allowlisted intent(s) now dispatched by a control — move to PLAYER_INTENTS: ` +
        wronglyAllowlisted.join(', '),
    ).toEqual([]);
  });
});
