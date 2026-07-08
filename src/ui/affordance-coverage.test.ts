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
  'choose_intro',
  'begin_rung_beat',
  'ask_rung_topic',
  'choose_rung_option',
  'rake_rice',
  'rest',
  'do_activity',
  'set_auto',
  'set_auto_rake',
  'face_wolf',
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
] as const satisfies readonly IntentType[];

/** Intents with NO clickable control, on purpose — each entry carries its why.
 *  Moving an intent here is a CONSCIOUS act; the inverse check below flips RED the
 *  moment an allowlisted intent gains a control (then it belongs above). */
const NON_UI_INTENTS = [
  // the typewriter/auto-advance beats — driven by the render loop's timers and
  // transcript clicks routed through UI-local state, never a dedicated button
  'advance_intro',
  'advance_rung_beat',
  // storywave INTERIM (G1): `advance_season` is autoplay/DEV-driven for now. G4.9 wires the
  // R2-gated "end the season" affordance (the season wheel) and moves this to PLAYER_INTENTS.
  'advance_season',
  // storywave INTERIM (G2): the generalized-scene VN intents + the night-round runner ship
  // DORMANT (empty registries, no reachable UI). G4 wires the gate surface + quest + the VN
  // modal integration (G4.9) and moves the player-facing ones to PLAYER_INTENTS.
  'begin_scene',
  'advance_scene_beat',
  'choose_scene_option',
  'begin_night_round',
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
    // craft_weapon: standing at the smithy with the recipe's inputs on hand
    sweep(
      {
        ...worn,
        location: 'woodlot-edge',
        resources: { ...worn.resources, hardwood: 3, beast_sinew: 1 },
      },
      seen,
    );
    // buy_item: at the gate with coin in the sleeve (rice-at-gate carries none)
    const gate = fixtureState('rice-at-gate');
    sweep({ ...gate, resources: { ...gate.resources, coin: 500 } }, seen);
    // ask_rung_topic: the R1/R2 beats are decide-only — R3's beat carries topics
    sweep({ ...inBeat, rungBeat: 'R3' }, seen);

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
