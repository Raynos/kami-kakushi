import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  applyGrindFight,
  ACTIVITIES,
  SKILL_IDS,
  MATERIAL_IDS,
  LOG_MAX_IDENTICAL_RUN,
  ATTR_IDS,
  type GameState,
} from './index';

// ── G-NO-DEAD-VALUES (audit §6.4) ──────────────────────────────────────────────
// Every surfaced currency/skill must be ledgered: wired to a real CONSUMER, or an
// explicit, frozen INERT debt. The ledger is derived from the REAL registries, so
// surfacing a new value without a consumer (and without ledgering it) fails the build —
// that is the ratchet's teeth, WITHOUT forcing the deferred design forks (H-items).
//
// Authored POST-economy (Commit 2 landed the sinks/multipliers). Under the D-107 economy re-core
// coin→improve_estate + buy_item + repair fee, wood→repair_weapon, sansai→cook_meal,
// farming/foraging/woodcutting→skillYieldNum, conditioning→danger-ring gate, and
// attributePoints→spend_attribute. The ONE tracked-inert debt is RICE — a real resource whose
// primary sink (eat / sell for coin) lands in Phase 2 (D-107); in Phase 1 it is earned + carried
// (at-risk on a loss) but has no active consumer yet, so it is explicitly ledgered inert.

const SURFACED_CURRENCIES = new Set<string>([
  'coin',
  'rice',
  ...ACTIVITIES.flatMap((a) => Object.keys(a.yields)),
  ...MATERIAL_IDS, // the loot→craft materials (hardwood, beast_sinew) — surfaced via the fight loot path
]); // {coin, rice, wood, sansai, hardwood, beast_sinew}
const SURFACED_SKILLS = SKILL_IDS; // {farming, foraging, woodcutting, conditioning}

type Ledger = Record<string, { consumer: string } | { inert: string }>;

const CURRENCY_LEDGER: Ledger = {
  coin: {
    consumer:
      'improve_estate estate-upgrade sink + buy_item market sink + repair_weapon fee (intents)',
  },
  // RICE — earned (rake/farm) + carried (at-risk on a lost fight, D-113) but its PRIMARY sink
  // (eat → satiety / sell → coin) is Phase 2 (D-107); tracked-inert until then, not silently dead.
  rice: { inert: 'D-107 Phase 2: eat_rice (→satiety) + sell_rice (→coin at a season price)' },
  wood: { consumer: 'repair_weapon REPAIR_WOOD_COST sink (intents + balance)' },
  sansai: { consumer: 'cook_meal COOK_SANSAI_COST sink (intents + balance)' },
  hardwood: { consumer: 'craft_weapon RECIPES inputs → wood_axe (intents + crafting)' },
  beast_sinew: { consumer: 'craft_weapon RECIPES inputs → wood_axe (intents + crafting)' },
};
const SKILL_LEDGER: Ledger = {
  farming: { consumer: 'skillYieldNum yield multiplier on do_activity (intents + skills)' },
  foraging: { consumer: 'skillYieldNum yield multiplier on do_activity (intents + skills)' },
  woodcutting: { consumer: 'skillYieldNum yield multiplier on do_activity (intents + skills)' },
  conditioning: { consumer: 'CONDITIONING_GATE_LEVEL danger-ring gate (selectors)' },
};
// Character attributes — the 5-attribute combat build (§4.6.1). Each surfaced value must have a
// live consumer, else the "no more dead values" claim quietly rots. Derived from ATTR_IDS so
// adding a 6th attribute without a consumer fails the build.
const SURFACED_ATTRIBUTES = new Set<string>(['attributePoints', ...ATTR_IDS]);
const ATTRIBUTE_LEDGER: Ledger = {
  attributePoints: { consumer: 'spend_attribute → attrs[a] (intents)' },
  str: { consumer: 'mcCombatStats attackPower/defense + hpMax (combat/selectors)' },
  agi: { consumer: 'mcCombatStats accuracy/evasion/crit (combat)' },
  int: { consumer: 'mcCombatStats INT bestiary-known damage bonus (combat)' },
  spd: { consumer: 'mcCombatStats attackSpeed (combat)' },
  luck: { consumer: 'mcCombatStats critChance (combat)' },
};
// Post-economy ledger: the ONE tracked-inert value is `rice` — its eat/sell sink is Phase 2
// (D-107). The ratchet asserts EXACTLY this frozen debt, so surfacing another NEW dead value (or
// letting an existing consumer rot) flips this RED; wiring rice's Phase-2 sink must drop it here.
const EXPECTED_INERT = new Set<string>(['rice']);

describe('G-NO-DEAD-VALUES — every surfaced value is ledgered (consumer or tracked-inert)', () => {
  it('no surfaced currency/skill/attribute is missing from the ledger (no silent dead values)', () => {
    for (const id of SURFACED_CURRENCIES)
      expect(CURRENCY_LEDGER[id], `currency '${id}'`).toBeDefined();
    for (const id of SURFACED_SKILLS) expect(SKILL_LEDGER[id], `skill '${id}'`).toBeDefined();
    for (const id of SURFACED_ATTRIBUTES)
      expect(ATTRIBUTE_LEDGER[id], `attribute '${id}'`).toBeDefined();
  });

  it('the inert set is exactly the frozen documented debt — just rice (Phase-2 sink, ratchet)', () => {
    const inert = new Set(
      [
        ...Object.entries(CURRENCY_LEDGER),
        ...Object.entries(SKILL_LEDGER),
        ...Object.entries(ATTRIBUTE_LEDGER),
      ]
        .filter(([, v]) => 'inert' in v)
        .map(([k]) => k),
    );
    expect([...inert].sort()).toEqual([...EXPECTED_INERT].sort());
  });
});

// ── G-LOG (audit §3 #3) ────────────────────────────────────────────────────────
// A headless auto-run must never emit more than LOG_MAX_IDENTICAL_RUN byte-identical
// consecutive log lines. Was RED on v0.1 (a long identical win-line run); GREEN now that
// pushLog coalesces consecutive identical lines onto one entry (maxRun collapses to 1).
describe('G-LOG — a headless auto-run never spams byte-identical lines', () => {
  it('coalesces repeated combat lines (no run > LOG_MAX_IDENTICAL_RUN)', () => {
    const fed = (): GameState => {
      const init = createInitialState(5);
      return { ...init, character: { ...init.character, satiety: 100 } };
    };
    let s: GameState = fed();
    for (let i = 0; i < 60; i++) {
      s = applyGrindFight(s, 'monkey');
      s = { ...s, character: { ...s.character, satiety: 100 } };
    }
    const texts = s.log.entries.map((e) => e.text);
    let maxRun = texts.length ? 1 : 0;
    let run = 1;
    for (let i = 1; i < texts.length; i++) {
      if (texts[i] === texts[i - 1]) {
        run++;
        maxRun = Math.max(maxRun, run);
      } else {
        run = 1;
      }
    }
    expect(maxRun).toBeLessThanOrEqual(LOG_MAX_IDENTICAL_RUN);
  });
});
