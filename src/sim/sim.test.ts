// FB-4 Ph3 in-gate tests — rationed (AC-17): the full 3×5 gating matrix lives in `verify:balance`
// (on-demand); these keep only what must be always-on and RED-able: (1) each persona reproduces
// byte-identically (the determinism contract the whole harness stands on), (2) the soft-lock
// detector actually FIRES on a manufactured stall (a detector that can't go RED is not a check),
// and (3) autoModeIntent preserves the shipped autoStep decision order (the extraction proof —
// each branch pinned, so a drift in the auto-loop's priorities goes RED here, not in the field).

import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  autoModeIntent,
  balance,
  satietyMax,
  getWeapon,
  factsForSurfaces,
} from '../core';
import type { GameState } from '../core';
import { idler, explorer, type Persona } from './personas';
import { runPersona, SIM_SOFTLOCK_INTENTS } from './run';
import { CANONICAL_SEED } from './seeds';
import { structuralVerdict } from './envelopes';

describe('persona determinism (the reproducibility contract)', () => {
  for (const persona of [explorer]) {
    it(`${persona.id}: same seed ⇒ byte-identical RunMetrics`, () => {
      const a = runPersona(persona, CANONICAL_SEED).metrics;
      const b = runPersona(persona, CANONICAL_SEED).metrics;
      expect(a.ascended, `${persona.id} must close the arc`).toBe(true);
      expect(JSON.stringify(a)).toBe(JSON.stringify(b));
    });
  }
  // ADR-170 (HD-34, human 2026-07-10): the idler's promise is the LADDER, not ascension —
  // Phase 2 is attention-priced by design, so its run ends cleanly at the top rung
  // (re-enabled from the ADR-148 interim skip; cheap now that it doesn't burn to the guard).
  it('idler: same seed ⇒ byte-identical RunMetrics, ladder promise closes', () => {
    const a = runPersona(idler, CANONICAL_SEED).metrics;
    const b = runPersona(idler, CANONICAL_SEED).metrics;
    expect(a.softLock, 'idler must not soft-lock').toBeNull();
    expect(structuralVerdict(a, idler.promise).ok, 'idler must climb the full ladder').toBe(true);
    expect(a.ascended, 'ascension is deliberately NOT the idler promise').toBe(false);
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });
});

describe('soft-lock detector (must be able to go RED)', () => {
  it('fires on a manufactured stall, naming the intent index and rung', () => {
    // A spinner that only ever re-asserts the default stance pre-unlock: the intent is refused
    // (mode-guard no-op), no progress signal can ever land, and the detector must trip at
    // exactly SIM_SOFTLOCK_INTENTS — the manufactured "needed verb gated away" dead-end.
    const spinner: Persona = {
      id: 'greedy', // id irrelevant to the detector; reuse a valid literal
      knows: ['set_stance'],
      decide: () => ({ type: 'set_stance', stance: 'chudan' }),
    };
    const { metrics } = runPersona(spinner, CANONICAL_SEED);
    expect(metrics.softLock).not.toBeNull();
    expect(metrics.softLock!.reason).toBe('no-progress');
    expect(metrics.softLock!.atIntent).toBe(SIM_SOFTLOCK_INTENTS - 1);
    expect(metrics.softLock!.rung).toBe('R0');
    expect(metrics.ascended).toBe(false);
  });
});

describe('autoModeIntent — the extracted autoStep decision order (the app loop consumes it)', () => {
  /** A post-combat-unlock state armed for auto-combat, with the knobs the branches read. */
  function armed(patch: Partial<GameState> = {}, character: Partial<GameState['character']> = {}) {
    const s = createInitialState(1);
    const base: GameState = {
      ...s,
      // ADR-179 — tab-combat derives from its rung's latched fact-flag, never a stored latch.
      flags: { ...s.flags, awake: true, raked: true, ...factsForSurfaces('tab-combat') },
      autoCombat: 'monkey',
      resources: { ...s.resources, wood: 0 },
      ...patch,
    };
    return { ...base, character: { ...base.character, satiety: 100, ...character } };
  }

  it('no auto mode armed ⇒ null (the loop idles)', () => {
    const s = { ...armed(), autoCombat: null };
    expect(autoModeIntent(s)).toBeNull();
  });

  it('auto-combat: rests below the stamina knee before fighting', () => {
    const s = armed();
    const starving = {
      ...s,
      character: {
        ...s.character,
        satiety: Math.floor(satietyMax(s) * balance.STAMINA_FLAT_ABOVE) - 1,
      },
    };
    expect(autoModeIntent(starving)).toEqual({ type: 'rest' });
  });

  it('auto-combat: repairs a Battered blade when wood allows, fights otherwise', () => {
    const max = getWeapon('carrying_pole').durabilityMax;
    const battered = Math.ceil(max * 0.25); // inside the Battered band (<50%, ≥1)
    const withWood = armed({
      weaponDurability: battered,
      resources: { coin: 0, rice: 0, wood: balance.REPAIR_WOOD_COST },
    });
    expect(autoModeIntent(withWood)).toEqual({ type: 'repair_weapon' });
    const noWood = armed({ weaponDurability: battered });
    expect(autoModeIntent(noWood)).toEqual({ type: 'fight', mobId: 'monkey', retreat: false });
  });

  it('auto-combat: STOPS (weapon-broken) on a Broken blade with no wood', () => {
    const s = armed({ weaponDurability: 0 });
    expect(autoModeIntent(s)).toEqual({
      type: 'set_auto_combat',
      mobId: null,
      reason: 'weapon-broken',
    });
  });

  it('pauses (null) under any VN surface — rung beat, scene, intro (FB-266)', () => {
    // armed() would fight; a live VN surface must silence it without disarming.
    expect(autoModeIntent(armed({ rungBeat: 'R1' }))).toBeNull();
    expect(
      autoModeIntent(
        armed({ activeScene: { id: 'the-count', beat: 0 } as GameState['activeScene'] }),
      ),
    ).toBeNull();
    expect(autoModeIntent(armed({ introBeat: 0 }))).toBeNull();
  });

  it('auto-rake: rakes while legal, disarms itself once raking is gone (R1)', () => {
    const s = armed({ autoCombat: null, autoRake: true });
    expect(autoModeIntent(s)).toEqual({ type: 'rake_rice' });
    const kept = { ...s, flags: { ...s.flags, 'rank-r1': true } }; // rake no longer legal
    expect(autoModeIntent(kept)).toEqual({ type: 'set_auto_rake', on: false });
  });

  it('auto-labour: works the armed activity, clears it when it becomes undoable', () => {
    const s0 = armed({ autoCombat: null, autoActivity: 'farm_paddy' });
    const there: GameState = {
      ...s0,
      // ADR-179 — verb-farm + room-paddies derive from their rung's fact-flag (rank-r1).
      flags: { ...s0.flags, ...factsForSurfaces('verb-farm', 'room-paddies') },
      location: 'paddies',
    };
    expect(autoModeIntent(there)).toEqual({ type: 'do_activity', activityId: 'farm_paddy' });
    const elsewhere = { ...there, location: 'kura' };
    expect(autoModeIntent(elsewhere)).toEqual({ type: 'set_auto', activityId: null });
  });
});
