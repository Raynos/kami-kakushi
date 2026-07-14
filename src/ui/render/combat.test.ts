// @vitest-environment jsdom
// @slow — jsdom render suite (split out of render.test.ts, 2026-07-13 render-split);
// runs at push/CI, not the per-commit vitest lane (verify budget, ADR-072/ADR-176).
import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '../render';
import {
  createInitialState,
  setFlag,
  getWeapon,
  durabilityBand,
  FLAVOR,
  type GameState,
  factsForSurfaces,
} from '../../core';
import { __setStoryOverlay } from '../../core/content/story-overlay';

import { noopHooks } from './test-utils';

// ── A7 — the staggered combat reveal + the Bestiary panel (default variant A) ────────────────
describe('A7 — combat tab reveals one beat per rung + the Bestiary fogs unfaced foes', () => {
  let root: HTMLElement;
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
    root = document.createElement('div');
    document.body.append(root);
  });

  function combatState(extra: string[]): GameState {
    const base = createInitialState(1);
    return {
      ...base,
      location: 'field-margins', // G4: the first grindable combat zone (tanuki/badger)
      // the full R3 combat surface set: the Combat tab + its floor, plus the Character-tab surfaces
      // (tab-skills R2, readout-combat-level + panel-bestiary R3) that light the split-out sheet.
      // ADR-179 — the set derives from the rank-r2 + rank-r3 facts; readout-rice derives
      // from awake (the base introBeat is -1, pre-wake ⇒ intro not active).
      flags: {
        ...base.flags,
        awake: true,
        ...factsForSurfaces(
          'tab-skills',
          'readout-combat-level',
          'tab-combat',
          'panel-bestiary',
          ...extra,
        ),
      },
    };
  }
  function openCombat(): void {
    [...root.querySelectorAll<HTMLButtonElement>('.nav-tab')]
      .find((b) => (b.textContent ?? '').includes('Combat'))!
      .click();
  }
  function openCharacter(): void {
    [...root.querySelectorAll<HTMLButtonElement>('.nav-tab')]
      .find((b) => (b.textContent ?? '').includes('己'))!
      .click();
  }

  it('R3 floor: weapon + fight show on Combat; the Bestiary SPLITS OUT to Character (D-112)', () => {
    const render = mount(root, () => {}, noopHooks());
    render(combatState([]), null); // R3-only surfaces
    openCombat();
    const pane =
      root.querySelector<HTMLElement>('#pane-combat, .combat-pane') ?? root;
    // the fight floor is present on Combat
    expect(root.querySelector('.weapon-card')).not.toBeNull();
    expect(root.querySelector('.foe-row')).not.toBeNull();
    // IA reorg (ADR-112) — the Bestiary is NOT on the Combat tab anymore; it lives on Character.
    expect(root.textContent).not.toContain('Bestiary 図鑑');
    expect(root.querySelector('.character-bestiary .bestiary')).toBeNull(); // hidden while on Combat
    openCharacter();
    expect(root.textContent).toContain('Bestiary 図鑑');
    expect(root.querySelector('.character-bestiary .bestiary')).not.toBeNull();
    openCombat();
    // the R4/R5 beats are held back
    expect(pane.querySelector('.stance-row')).toBeNull();
    const blurbHasDurability = [
      ...root.querySelectorAll('.weapon-card .skill-blurb'),
    ].some((b) => (b.textContent ?? '').includes('durability'));
    expect(blurbHasDurability).toBe(false);
    const repairBtn = [
      ...root.querySelectorAll<HTMLButtonElement>('button'),
    ].find((b) => (b.textContent ?? '').includes('Repair'));
    expect(repairBtn).toBeUndefined();
  });

  it('R4 adds the durability read + repair (equip loop); R5 adds the stance row', () => {
    const render = mount(root, () => {}, noopHooks());
    // R4: durability + equipment + repair unlocked
    render(
      combatState(['readout-durability', 'panel-equipment', 'verb-repair']),
      null,
    );
    openCombat();
    const durBlurb = [
      ...root.querySelectorAll('.weapon-card .skill-blurb'),
    ].some((b) => (b.textContent ?? '').includes('durability'));
    expect(durBlurb).toBe(true);
    expect(root.querySelector('.stance-row')).toBeNull(); // stance still held for R5

    // R5: stance control now live
    render(
      combatState([
        'readout-durability',
        'panel-equipment',
        'verb-repair',
        'stance-control',
      ]),
      null,
    );
    expect(root.querySelector('.stance-row')).not.toBeNull();
  });

  it('HD-23 (option C) — an R3 Battered blade shows the mend lock-hint; R4 swaps it for the repair CTA', () => {
    const render = mount(root, () => {}, noopHooks());
    // an R3 blade worn to Battered — `verb-repair` reveals at R4, so no mend CTA is reachable yet.
    const r3 = combatState([]);
    const weapon = getWeapon(r3.equippedWeapon);
    // derive a Battered durability from the balance source (never a copied magic number), and assert
    // the fixture really lands in the Battered band — so a bands re-tune can't silently no-op this test.
    const battered: GameState = {
      ...r3,
      weaponDurability: Math.max(1, Math.round(weapon.durabilityMax * 0.1)),
    };
    expect(
      durabilityBand(battered.weaponDurability, weapon.durabilityMax).name,
    ).toBe('Battered');

    render(battered, null);
    openCombat();
    const hint = root.querySelector<HTMLElement>('.weapon-card .lock-hint');
    expect(hint).not.toBeNull();
    expect(hint!.hidden).toBe(false);
    // the line is single-sourced from the FB-5 flavor registry (canon = take B), not a literal.
    expect(hint!.textContent).toBe(FLAVOR.mendHint);
    // …and no Repair button is reachable at R3.
    const repairAtR3 = [
      ...root.querySelectorAll<HTMLButtonElement>('button'),
    ].some((b) => (b.textContent ?? '').includes('Repair') && !b.hidden);
    expect(repairAtR3).toBe(false);

    // R4: `verb-repair` unlocks — the SAME worn blade now offers the real mend CTA and the hint retires.
    const r4: GameState = {
      ...battered,
      // ADR-179 — all three are R4-scheduled; the rank-r4 fact entitles them.
      flags: {
        ...battered.flags,
        ...factsForSurfaces(
          'readout-durability',
          'panel-equipment',
          'verb-repair',
        ),
      },
    };
    render(r4, battered);
    const hintR4 = root.querySelector<HTMLElement>('.weapon-card .lock-hint');
    expect(hintR4 === null || hintR4.hidden).toBe(true);
    const repairAtR4 = [
      ...root.querySelectorAll<HTMLButtonElement>('button'),
    ].some((b) => (b.textContent ?? '').includes('Repair') && !b.hidden);
    expect(repairAtR4).toBe(true);
  });

  it('the Bestiary (on Character) fogs an unfaced foe, then inks its entry once its mob-<id> is set', () => {
    const render = mount(root, () => {}, noopHooks());
    const state = combatState([]);
    render(state, null);
    openCharacter(); // the bestiary lives on the Character 己 tab (IA reorg ADR-112)
    // no foe faced → the bestiary cards read as fogged silhouettes
    const cards = [...root.querySelectorAll<HTMLElement>('.bestiary-card')];
    expect(cards.length).toBeGreaterThan(0);
    expect(
      cards.every((c) => (c.textContent ?? '').includes('Unknown foe')),
    ).toBe(true);
    expect(root.textContent).toContain('Not yet faced');

    // face the monkey → its card inks in with a real win-% and its kanji, others stay fogged.
    const seen = setFlag(state, 'mob-monkey');
    render(seen, state);
    const inked = [
      ...root.querySelectorAll<HTMLElement>('.bestiary-card'),
    ].find((c) => (c.textContent ?? '').includes('Crop-raiding monkey'));
    expect(inked).toBeTruthy();
    expect(inked!.textContent).toContain('%');
    expect(inked!.textContent).toContain('Tell —');
  });
});

// ── HD-24 — the cold-open "restore a save" affordance (import before replaying the intro) ──
