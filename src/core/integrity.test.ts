import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  applyGrindFight,
  ACTIVITIES,
  SKILL_IDS,
  LOG_MAX_IDENTICAL_RUN,
  type GameState,
} from './index';

// ── G-NO-DEAD-VALUES (audit §6.4) ──────────────────────────────────────────────
// Every surfaced currency/skill must be ledgered: wired to a real CONSUMER, or an
// explicit, frozen INERT debt. The ledger is derived from the REAL registries, so
// surfacing a new value without a consumer (and without ledgering it) fails the build —
// that is the ratchet's teeth, WITHOUT forcing the deferred design forks (H-items).
//
// Authored POST-economy (Commit 2 landed the sinks/multipliers), so per conflict J the
// inert set is EMPTY: koku→improve_estate, wood→repair_weapon, sansai→cook_meal,
// farming/foraging/woodcutting→skillYieldNum, conditioning→danger-ring gate, and
// attributePoints→spend_attribute. Every surfaced value is consumed (the stronger form).

const SURFACED_CURRENCIES = new Set<string>([
  'koku',
  ...ACTIVITIES.flatMap((a) => Object.keys(a.yields)),
]); // {koku, wood, sansai}
const SURFACED_SKILLS = SKILL_IDS; // {farming, foraging, woodcutting, conditioning}

type Ledger = Record<string, { consumer: string } | { inert: string }>;

const CURRENCY_LEDGER: Ledger = {
  koku: { consumer: 'improve_estate estate-upgrade sink (intents + ESTATE_STAGES.costKoku)' },
  wood: { consumer: 'repair_weapon REPAIR_WOOD_COST sink (intents + balance)' },
  sansai: { consumer: 'cook_meal COOK_SANSAI_COST sink (intents + balance)' },
};
const SKILL_LEDGER: Ledger = {
  farming: { consumer: 'skillYieldNum yield multiplier on do_activity (intents + skills)' },
  foraging: { consumer: 'skillYieldNum yield multiplier on do_activity (intents + skills)' },
  woodcutting: { consumer: 'skillYieldNum yield multiplier on do_activity (intents + skills)' },
  conditioning: { consumer: 'CONDITIONING_GATE_LEVEL danger-ring gate (selectors)' },
};
// Post-economy ledger: no surfaced value is inert any more (conflict J). The ratchet now
// asserts the empty set — surfacing a NEW dead value (or letting an existing consumer rot)
// flips this RED.
const EXPECTED_INERT = new Set<string>([]);

describe('G-NO-DEAD-VALUES — every surfaced value is ledgered (consumer or tracked-inert)', () => {
  it('no surfaced currency/skill is missing from the ledger (no silent dead values)', () => {
    for (const id of SURFACED_CURRENCIES)
      expect(CURRENCY_LEDGER[id], `currency '${id}'`).toBeDefined();
    for (const id of SURFACED_SKILLS) expect(SKILL_LEDGER[id], `skill '${id}'`).toBeDefined();
  });

  it('the inert set is exactly the frozen documented debt — empty post-economy (ratchet)', () => {
    const inert = new Set(
      [...Object.entries(CURRENCY_LEDGER), ...Object.entries(SKILL_LEDGER)]
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
