// The COMBAT surface (split out of render.ts, 2026-07-13 render-split): the fight tab —
// XP · weapon · craft · stance · the foe watch — plus the bestiary card builders it shares
// with the Character tab (ADR-112 split the SPENDING/reading surfaces out; the fight loop
// still earns the points). The pure card builders sit at module level; the view factory
// owns the incremental refs.
import {
  balance,
  durabilityBand,
  hasFlag,
  MATERIALS,
  STANCE_ORDER,
  WEAPONS,
  bestiaryEntries,
  canCraft,
  combatXpProgress,
  foesHere,
  formatCoin,
  getMaterial,
  getNode,
  getWeapon,
  isUnlocked,
  RECIPES,
  type GameState,
  type Intent,
  type MobId,
  type StanceId,
} from '../../core';
import {
  el,
  pct,
  stampAct,
  STANCE_UI,
  AUTO_PAUSED_LABEL,
  AUTO_PAUSED_REASON,
} from '../render';
import { FLAVOR } from '../../core/content/flavor';
import {
  reconcileList,
  setText,
  setClass,
  setDisabled,
  setStyle,
  setTitle,
  toggle,
} from '../reconcile';
import type { DevApi } from '../dev';

type Dispatch = (intent: Intent) => void;

// ── the Bestiary (A7) — default variant A: a woodblock FIELD-GUIDE card list. One card per
//    grindable foe; a faced foe (its `mob-<id>` flag) shows its kanji seal, tell, win-rate
//    forecast, and haunt; an un-faced foe stays a fogged silhouette (scout-by-fighting, mirrors
//    the combat-tab fog). Pure read of `bestiaryEntries` — B/C alternates live in ui/dev.ts. ──
export function renderBestiary(container: HTMLElement, state: GameState): void {
  const entries = bestiaryEntries(state);
  const known = entries.filter((e) => e.seen).length;
  container.append(el('h3', 'foes-head', 'Bestiary 図鑑'));
  container.append(
    el(
      'div',
      'skill-blurb',
      `${known} of ${entries.length} beasts recorded — face a foe to ink its entry.`,
    ),
  );
  for (const e of entries) {
    const card = el('div', 'foe-row frame bestiary-card');
    const head = el('div', 'skill-head');
    head.append(
      el(
        'span',
        'skill-name',
        e.seen ? `${e.mob.label} ${e.mob.kanji}` : 'Unknown foe',
      ),
    );
    const wr = el('span', 'win-rate');
    if (e.seen) {
      const tier =
        e.winRate >= 0.55 ? 'good' : e.winRate >= 0.28 ? 'fair' : 'risky';
      const word =
        tier === 'good' ? 'Steady' : tier === 'fair' ? 'Even' : 'Risky';
      const pip = el('span', `pip ${tier}`, '◆');
      pip.setAttribute('aria-hidden', 'true');
      wr.append(pip, document.createTextNode(` ${pct(e.winRate)} · ${word}`));
    } else {
      const pip = el('span', 'pip unknown', '◇');
      pip.setAttribute('aria-hidden', 'true');
      wr.append(pip, document.createTextNode(' Not yet faced'));
    }
    head.append(wr);
    card.append(head);
    if (e.seen) {
      card.append(el('div', 'skill-blurb', e.mob.blurb));
      const where = getNode(e.mob.area).label.replace(/^The /, '');
      const meta = el('div', 'bestiary-meta');
      meta.style.cssText =
        'display:flex;gap:.6rem;flex-wrap:wrap;font-size:var(--fs-micro);color:var(--ink-soft);';
      meta.append(el('span', undefined, `Tell — ${e.tell}`));
      meta.append(el('span', undefined, `Haunts — ${where}`));
      card.append(meta);
    } else {
      const fog = el(
        'div',
        'skill-blurb',
        'A beast you have not yet met. Face it to record it.',
      );
      fog.style.color = 'var(--ink-faint)';
      card.append(fog);
    }
    container.append(card);
  }
}

// ── shared win-rate pip (foe watch + Bestiary) — a persistent pip + text span the forecast
//    PATCHES in place (no strobe on the ~2×/s idle tick). setPipClass guards the className write. ──
export function setPipClass(pip: HTMLElement, tier: string): void {
  const cls = `pip ${tier}`;
  if (pip.className !== cls) pip.className = cls;
}
export function buildWinRate(): HTMLElement {
  const wr = el('span', 'win-rate');
  const pip = el('span', 'pip');
  pip.setAttribute('aria-hidden', 'true');
  wr.append(pip, el('span', 'wr-text'));
  return wr;
}
export function patchWinRate(
  wr: HTMLElement,
  seen: boolean,
  winRate: number,
  unknownText: string,
): void {
  const pip = wr.querySelector<HTMLElement>('.pip')!;
  const txt = wr.querySelector<HTMLElement>('.wr-text')!;
  if (seen) {
    const tier = winRate >= 0.55 ? 'good' : winRate >= 0.28 ? 'fair' : 'risky';
    const word =
      tier === 'good' ? 'Steady' : tier === 'fair' ? 'Even' : 'Risky';
    setPipClass(pip, tier);
    setText(pip, '◆');
    setText(txt, ` ${pct(winRate)} · ${word}`);
  } else {
    setPipClass(pip, 'unknown');
    setText(pip, '◇');
    setText(txt, unknownText);
  }
}

// one Bestiary field-guide card (FB-81) — built once per foe; the fog→inked flip patches in place.
export function buildBestiaryCard(): HTMLElement {
  const card = el('div', 'foe-row frame bestiary-card');
  const head = el('div', 'skill-head');
  head.append(el('span', 'skill-name'), buildWinRate());
  card.append(head);
  card.append(el('div', 'skill-blurb bestiary-blurb'));
  const meta = el('div', 'bestiary-meta');
  meta.style.cssText =
    'display:flex;gap:.6rem;flex-wrap:wrap;font-size:var(--fs-micro);color:var(--ink-soft);';
  meta.append(el('span'), el('span'));
  card.append(meta);
  const fog = el(
    'div',
    'skill-blurb bestiary-fog',
    'A beast you have not yet met. Face it to record it.',
  );
  fog.style.color = 'var(--ink-faint)';
  card.append(fog);
  return card;
}
export function patchBestiaryCard(
  card: HTMLElement,
  e: ReturnType<typeof bestiaryEntries>[number],
): void {
  const seen = e.seen;
  setText(
    card.querySelector('.skill-name')!,
    seen ? `${e.mob.label} ${e.mob.kanji}` : 'Unknown foe',
  );
  patchWinRate(
    card.querySelector('.win-rate')!,
    seen,
    e.winRate,
    ' Not yet faced',
  );
  const blurb = card.querySelector<HTMLElement>('.bestiary-blurb')!;
  const meta = card.querySelector<HTMLElement>('.bestiary-meta')!;
  const fog = card.querySelector<HTMLElement>('.bestiary-fog')!;
  toggle(blurb, seen);
  toggle(meta, seen);
  toggle(fog, !seen);
  if (seen) {
    setText(blurb, e.mob.blurb);
    const where = getNode(e.mob.area).label.replace(/^The /, '');
    setText(meta.children[0] as HTMLElement, `Tell — ${e.tell}`);
    setText(meta.children[1] as HTMLElement, `Haunts — ${where}`);
  }
}

export function createCombatView(ctx: {
  pane: HTMLElement;
  dispatch: Dispatch;
  dev: DevApi | undefined;
  activeTab(): string;
  /** The last-rendered state (owned by mount) — the auto-combat toggles read it live. */
  lastState(): GameState | null;
  /** The app hooks (pause state) — an armed auto-fight says WHY it isn't swinging. */
  isPaused(): boolean;
}): { renderCombat(state: GameState): void } {
  const { pane: combatPane, dispatch, dev } = ctx;

  function patchFoeRow(
    row: HTMLElement,
    fc: ReturnType<typeof foesHere>[number],
    state: GameState,
  ): void {
    const seen = hasFlag(state, `mob-${fc.mob.id}`);
    setText(
      row.querySelector('.skill-name')!,
      seen ? `${fc.mob.label} ${fc.mob.kanji}` : 'Unknown foe',
    );
    patchWinRate(row.querySelector('.win-rate')!, seen, fc.winRate, ' Unknown');
    const blurb = row.querySelector<HTMLElement>('.skill-blurb')!;
    toggle(blurb, seen);
    if (seen) setText(blurb, fc.mob.blurb);
    const autoOn = state.autoCombat === fc.mob.id;
    const deathOn = autoOn && !state.autoCombatRetreat;
    const retreatOn = autoOn && state.autoCombatRetreat;
    const toggles = row.querySelectorAll<HTMLButtonElement>('.auto-toggle');
    const paused = autoOn && ctx.isPaused(); // an armed auto-fight says WHY it isn't swinging
    setClass(toggles[0]!, 'on', deathOn);
    setClass(toggles[0]!, 'waiting', deathOn && paused);
    setText(
      toggles[0]!,
      deathOn ? (paused ? AUTO_PAUSED_LABEL : '■ stop') : '▶ auto · to the end',
    );
    setTitle(toggles[0]!, deathOn && paused ? AUTO_PAUSED_REASON : '');
    setClass(toggles[1]!, 'on', retreatOn);
    setClass(toggles[1]!, 'waiting', retreatOn && paused);
    setText(
      toggles[1]!,
      retreatOn
        ? paused
          ? AUTO_PAUSED_LABEL
          : '■ stop'
        : '▶ auto · flee @20%',
    );
    setTitle(toggles[1]!, retreatOn && paused ? AUTO_PAUSED_REASON : '');
  }

  // IA reorg (ADR-112) — the Combat tab keeps ONLY the fight surface: XP · weapon · craft · stance ·
  // watch. Training (attrs) + the bestiary SPLIT OUT to the Character tab (their refs live in the
  // character view); points are still EARNED from combat leveling (the coupling holds).
  let combatRefs: {
    xpNow: HTMLElement;
    xpFill: HTMLElement;
    xpHint: HTMLElement;
    wc: HTMLElement;
    wcName: HTMLElement;
    wcBand: HTMLElement;
    wcBlurb: HTMLElement;
    wcHint: HTMLElement;
    wctrl: HTMLElement;
    repairBtn: HTMLButtonElement;
    craftHost: HTMLElement;
    // lazily created on first reveal so a `.stance-row` never exists in the DOM before stance-control
    // unlocks (the A7 gate test asserts its absence at R3/R4).
    stanceHost: HTMLElement | null;
    watchHead: HTMLElement;
    watchEmpty: HTMLElement;
    watchList: HTMLElement;
  } | null = null;

  // one persistent foe-watch row (FB-81) — the Fight verb + two auto-mode toggles are built ONCE (their
  // listeners read live state), the name / forecast pip / blurb / toggle-state patch in place.
  function buildFoeRow(fc: ReturnType<typeof foesHere>[number]): HTMLElement {
    const mob = fc.mob.id as MobId;
    const row = el('div', 'foe-row frame');
    const head = el('div', 'skill-head');
    head.append(el('span', 'skill-name'), buildWinRate());
    row.append(head);
    row.append(el('div', 'skill-blurb'));
    const ctrl = el('div', 'labour-row');
    const fight = el('button', 'verb', 'Fight');
    fight.type = 'button';
    fight.addEventListener('click', () =>
      dispatch({ type: 'fight', mobId: mob }),
    );
    const atDeath = el('button', 'auto-toggle');
    atDeath.type = 'button';
    atDeath.title =
      'Auto-fight to the end — HP carries; you can be beaten, and a loss costs coin + rice.';
    atDeath.setAttribute(
      'aria-label',
      `Auto-fight the ${fc.mob.label} to the end — a loss costs coin + rice`,
    );
    atDeath.addEventListener('click', () => {
      const on =
        ctx.lastState()?.autoCombat === mob &&
        !ctx.lastState()!.autoCombatRetreat;
      dispatch({
        type: 'set_auto_combat',
        mobId: on ? null : mob,
        retreat: false,
      });
    });
    const atFlee = el('button', 'auto-toggle');
    atFlee.type = 'button';
    atFlee.title =
      'Auto-fight, but break off when HP falls below 20% (a fast foe can still kill you first).';
    atFlee.setAttribute(
      'aria-label',
      `Auto-fight the ${fc.mob.label}, fleeing below 20% HP`,
    );
    atFlee.addEventListener('click', () => {
      const on =
        ctx.lastState()?.autoCombat === mob &&
        ctx.lastState()!.autoCombatRetreat === true;
      dispatch({
        type: 'set_auto_combat',
        mobId: on ? null : mob,
        retreat: true,
      });
    });
    ctrl.append(fight, atDeath, atFlee);
    row.append(ctrl);
    return row;
  }
  // one stance button (FB-81) — the label + offense/defense trade are static per stance (mods are
  // constants), so they're built once; only the `.on`/aria-pressed selection patches per render.
  function buildStanceBtn(s: StanceId): HTMLElement {
    const ui = STANCE_UI[s];
    const mod = balance.STANCE_MODS[s];
    const atkPct = Math.round((mod.atkMult - 1) * 100);
    const takenPct = Math.round((mod.takenMult - 1) * 100);
    const sign = (n: number): string => (n > 0 ? `+${n}` : `${n}`);
    const trade = `atk ${sign(atkPct)}% · taken ${sign(takenPct)}%`;
    const btn = el('button', 'auto-toggle stance-btn');
    btn.type = 'button';
    btn.title = ui.hint;
    btn.setAttribute('aria-label', `${ui.gloss} stance — ${trade}. ${ui.hint}`);
    btn.append(el('span', 'stance-label', `${ui.kanji} ${ui.gloss}`));
    btn.append(el('span', 'stance-wear', trade));
    btn.addEventListener('click', () =>
      dispatch({ type: 'set_stance', stance: s }),
    );
    return btn;
  }

  // one loot→craft card (FB-81) — keyed by recipe.id so it's rebuilt only when the recipe ADVANCES
  // (axe → yari); the material tally + forge-button state patch in place while the recipe holds.
  function buildCraftCard(recipe: (typeof RECIPES)[number]): HTMLElement {
    const cc = el('div', 'weapon-card frame craft-card');
    cc.append(el('div', 'rung-now', recipe.label));
    cc.append(
      el(
        'div',
        'skill-blurb',
        'Strip what the carcasses give up, then forge a real edge at the woodlot smithy — found and made, not tossed off a rack.',
      ),
    );
    for (const mat of Object.keys(recipe.inputs)) {
      const m = getMaterial(mat);
      const row = el('div', 'craft-mat');
      row.append(el('span', 'craft-mat-name', `${m.label} ${m.kanji}`));
      row.append(el('span', 'craft-mat-count'));
      cc.append(row);
    }
    const craftBtn = el('button', 'verb', recipe.label);
    craftBtn.type = 'button';
    stampAct(craftBtn, 'craft_weapon', { recipeId: recipe.id });
    craftBtn.addEventListener('click', () =>
      dispatch({ type: 'craft_weapon', recipeId: recipe.id }),
    );
    cc.append(craftBtn);
    return cc;
  }
  function patchCraftCard(
    cc: HTMLElement,
    recipe: (typeof RECIPES)[number],
    state: GameState,
  ): void {
    const counts = cc.querySelectorAll<HTMLElement>('.craft-mat-count');
    Object.entries(recipe.inputs).forEach(([mat, need], i) => {
      const have = state.resources[mat] ?? 0;
      setText(counts[i]!, `${have}/${need}`);
      setClass(counts[i]!, 'ok', have >= need);
    });
    const btn = cc.querySelector<HTMLButtonElement>('.verb')!;
    const can = canCraft(state.resources, recipe);
    setDisabled(btn, !can);
    const title = can ? '' : 'Fell more foes for materials.';
    if (btn.title !== title) btn.title = title;
  }

  // the DEV-only wholesale combat rebuild — the original teardown-and-rebuild body, kept verbatim so
  // the craft/bestiary variant toggles (which need a fresh container each render) keep working. Prod
  // + tests (`dev` undefined) never reach this; they take the incremental path in renderCombat.
  function renderCombatWholesale(state: GameState): void {
    // combat rank + XP
    const cx = combatXpProgress(state.character.combatXp);
    const lvl = el('div', 'rung-card frame');
    lvl.append(el('div', 'rung-now', `Combat level ${cx.level} · 武`));
    const lm = el('div', 'meter');
    const lf = el('span');
    lf.style.width = pct(cx.into / cx.needed);
    lm.append(lf);
    lvl.append(lm);
    lvl.append(el('div', 'rung-hint', `Combat XP ${cx.into}/${cx.needed}`));
    combatPane.append(lvl);

    // (IA reorg ADR-112 — training attrs + the bestiary SPLIT OUT to the Character tab; they no longer
    // render on the Combat surface. See renderCharacterSheet's DEV wholesale path.)

    const weapon = getWeapon(state.equippedWeapon);
    const band = durabilityBand(state.weaponDurability, weapon.durabilityMax);
    const showDurability = isUnlocked(state, 'readout-durability');
    const showEquip = isUnlocked(state, 'panel-equipment');
    const wc = el('div', 'weapon-card frame');
    const wh = el('div', 'skill-head');
    wh.append(el('span', 'skill-name', `${weapon.label} ${weapon.kanji}`));
    if (showDurability) wh.append(el('span', 'skill-lvl', band.name));
    wc.append(wh);
    wc.append(
      el(
        'div',
        'skill-blurb',
        showDurability
          ? `${weapon.archetype} · durability ${state.weaponDurability}/${weapon.durabilityMax}`
          : weapon.archetype,
      ),
    );
    // HD-23 (option C) — see the incremental path: a diegetic lock-hint when the blade is worn but
    // repair (R4) isn't yet the player's. Mirrored here for DEV-wholesale parity.
    if (
      !isUnlocked(state, 'verb-repair') &&
      (band.name === 'Battered' || band.name === 'Broken')
    ) {
      wc.append(
        el(
          'div',
          'lock-hint',
          __DEV_TOOLS__ && dev
            ? dev.subFlavor('mendHint', FLAVOR.mendHint)
            : FLAVOR.mendHint,
        ),
      );
    }
    const wctrl = el('div', 'labour-row');
    if (showEquip && isUnlocked(state, 'verb-repair')) {
      const rep = el(
        'button',
        'auto-toggle',
        `Repair (${balance.REPAIR_WOOD_COST} wood, ${formatCoin(balance.REPAIR_COIN_COST)})`,
      );
      rep.type = 'button';
      rep.disabled = (state.resources.wood ?? 0) < balance.REPAIR_WOOD_COST;
      rep.title = `${balance.REPAIR_WOOD_COST} wood + up to ${formatCoin(balance.REPAIR_COIN_COST)} (waived if you're short)`;
      stampAct(rep, 'repair_weapon');
      rep.addEventListener('click', () => dispatch({ type: 'repair_weapon' }));
      wctrl.append(rep);
    }
    if (showEquip) {
      for (const w of WEAPONS) {
        const owned =
          w.id === 'carrying_pole' || hasFlag(state, `crafted-${w.id}`);
        if (!owned || w.id === state.equippedWeapon) continue;
        const eq = el(
          'button',
          'auto-toggle',
          `Take up · ${w.label} ${w.kanji}`,
        );
        eq.type = 'button';
        eq.addEventListener('click', () =>
          dispatch({ type: 'equip_weapon', weaponId: w.id }),
        );
        wctrl.append(eq);
      }
    }
    if (wctrl.childElementCount > 0) wc.append(wctrl);
    combatPane.append(wc);

    const recipe = RECIPES.find(
      (r) => !hasFlag(state, `crafted-${r.outputWeapon}`),
    );
    const hasMaterial = MATERIALS.some((m) => (state.resources[m.id] ?? 0) > 0);
    if (showEquip && recipe && hasMaterial) {
      const cc = el('div', 'weapon-card frame craft-card');
      cc.append(el('div', 'rung-now', recipe.label));
      cc.append(
        el(
          'div',
          'skill-blurb',
          'Strip what the carcasses give up, then forge a real edge at the woodlot smithy — found and made, not tossed off a rack.',
        ),
      );
      if (
        !(
          __DEV_TOOLS__ &&
          dev &&
          dev.renderVariant('craft', cc, state, dispatch)
        )
      ) {
        for (const [mat, need] of Object.entries(recipe.inputs)) {
          const have = state.resources[mat] ?? 0;
          const m = getMaterial(mat);
          const row = el('div', 'craft-mat');
          row.append(el('span', 'craft-mat-name', `${m.label} ${m.kanji}`));
          row.append(
            el(
              'span',
              `craft-mat-count${have >= need ? ' ok' : ''}`,
              `${have}/${need}`,
            ),
          );
          cc.append(row);
        }
      }
      const can = canCraft(state.resources, recipe);
      const craftBtn = el('button', 'verb', recipe.label);
      craftBtn.type = 'button';
      craftBtn.disabled = !can;
      if (!can) craftBtn.title = 'Fell more foes for materials.';
      stampAct(craftBtn, 'craft_weapon', { recipeId: recipe.id });
      craftBtn.addEventListener('click', () =>
        dispatch({ type: 'craft_weapon', recipeId: recipe.id }),
      );
      cc.append(craftBtn);
      combatPane.append(cc);
    }

    if (isUnlocked(state, 'stance-control')) {
      const stanceRow = el('div', 'stance-row');
      stanceRow.append(el('h3', undefined, 'Stance 構え'));
      for (const s of STANCE_ORDER)
        stanceRow.append(patchStanceReady(buildStanceBtn(s), s, state));
      combatPane.append(stanceRow);
    }

    // (IA reorg ADR-112 — the bestiary SPLIT OUT to the Character tab.)

    combatPane.append(el('h3', 'foes-head', 'The watch'));
    const present = foesHere(state);
    if (present.length === 0) {
      combatPane.append(
        el(
          'p',
          'area-blurb',
          'No foe holds this ground. Use the Map 地図 tab to reach the field-margins, the grove, or the orchard.',
        ),
      );
    }
    for (const fc of present) {
      const row = buildFoeRow(fc);
      patchFoeRow(row, fc, state);
      combatPane.append(row);
    }
  }

  // apply the current-render stance selection to a freshly-built stance button (shared by the
  // wholesale DEV path + the incremental patch).
  function patchStanceReady(
    btn: HTMLElement,
    s: StanceId,
    state: GameState,
  ): HTMLElement {
    const on = state.stance === s;
    setClass(btn, 'on', on);
    const pressed = String(on);
    if (btn.getAttribute('aria-pressed') !== pressed)
      btn.setAttribute('aria-pressed', pressed);
    return btn;
  }

  function renderCombat(state: GameState): void {
    const show =
      ctx.activeTab() === 'combat' && isUnlocked(state, 'tab-combat');
    toggle(combatPane, show);
    if (!show) return;
    // DEV variant sessions keep the wholesale rebuild (the craft/bestiary variant toggles need a
    // fresh container each render). Prod + tests (`dev` undefined) take the incremental path below.
    if (__DEV_TOOLS__ && dev) {
      combatRefs = null;
      combatPane.textContent = '';
      renderCombatWholesale(state);
      return;
    }
    // build the sub-container skeleton ONCE (FB-81), then patch/reconcile each block in place. Order
    // mirrors the wholesale build: XP · training · weapon · craft · stance · bestiary · watch.
    if (!combatRefs) {
      const xpCard = el('div', 'rung-card frame');
      const xpNow = el('div', 'rung-now');
      const xm = el('div', 'meter');
      const xpFill = el('span');
      xm.append(xpFill);
      const xpHint = el('div', 'rung-hint');
      xpCard.append(xpNow, xm, xpHint);

      // (IA reorg ADR-112 — training attrs + the bestiary moved to the Character tab; see
      //  renderCharacterSheet. The Combat tab keeps XP · weapon · craft · stance · watch only.)

      const wc = el('div', 'weapon-card frame');
      const wh = el('div', 'skill-head');
      const wcName = el('span', 'skill-name');
      const wcBand = el('span', 'skill-lvl');
      wh.append(wcName, wcBand);
      wc.append(wh);
      const wcBlurb = el('div', 'skill-blurb');
      wc.append(wcBlurb);
      // HD-23 (option C) — at R3 the blade can go Battered/Broken but `verb-repair` reveals at R4
      // (ranks.ts), so there's no mend CTA to reach for. A diegetic lock-hint keeps the ADR-110 unlock
      // cadence while killing the "is this a bug?" read: the mend PATH exists, just not yours yet (T4).
      const wcHint = el('div', 'lock-hint');
      wc.append(wcHint);
      const wctrl = el('div', 'labour-row');
      const repairBtn = el('button', 'auto-toggle');
      repairBtn.type = 'button';
      stampAct(repairBtn, 'repair_weapon');
      repairBtn.addEventListener('click', () =>
        dispatch({ type: 'repair_weapon' }),
      );
      wctrl.append(repairBtn);
      wc.append(wctrl);

      const craftHost = el('div', 'combat-group');

      const watchHead = el('h3', 'foes-head', 'The watch');
      const watchEmpty = el(
        'p',
        'area-blurb',
        'No foe holds this ground. Use the Map 地図 tab to reach the field-margins, the grove, or the orchard.',
      );
      const watchList = el('div', 'combat-group');

      combatPane.append(
        xpCard,
        wc,
        craftHost,
        watchHead,
        watchEmpty,
        watchList,
      );
      combatRefs = {
        xpNow,
        xpFill,
        xpHint,
        wc,
        wcName,
        wcBand,
        wcBlurb,
        wcHint,
        wctrl,
        repairBtn,
        craftHost,
        stanceHost: null,
        watchHead,
        watchEmpty,
        watchList,
      };
    }
    const r = combatRefs;

    // ── XP card ──
    const cx = combatXpProgress(state.character.combatXp);
    setText(r.xpNow, `Combat level ${cx.level} · 武`);
    setStyle(r.xpFill, 'width', pct(cx.into / cx.needed));
    setText(r.xpHint, `Combat XP ${cx.into}/${cx.needed}`);

    // ── equipped weapon + (R4) durability band + repair / equip switcher ──
    const weapon = getWeapon(state.equippedWeapon);
    const band = durabilityBand(state.weaponDurability, weapon.durabilityMax);
    const showDurability = isUnlocked(state, 'readout-durability');
    const showEquip = isUnlocked(state, 'panel-equipment');
    setText(r.wcName, `${weapon.label} ${weapon.kanji}`);
    toggle(r.wcBand, showDurability);
    if (showDurability) setText(r.wcBand, band.name);
    setText(
      r.wcBlurb,
      showDurability
        ? `${weapon.archetype} · durability ${state.weaponDurability}/${weapon.durabilityMax}`
        : weapon.archetype,
    );
    const showRepair = showEquip && isUnlocked(state, 'verb-repair');
    // HD-23 (option C) — R3 has no mend path (verb-repair reveals at R4). When the blade is worn AND
    // repair isn't yet the player's, a diegetic lock-hint says the mend exists but is earned, not asked.
    const wornNoMend =
      !isUnlocked(state, 'verb-repair') &&
      (band.name === 'Battered' || band.name === 'Broken');
    toggle(r.wcHint, wornNoMend);
    // The line is FB-5 canon (FLAVOR.mendHint); in DEV the story set-switcher can swap it live
    // for an HR-10 alternate (ADR-139) — the weapon-card patches each render, so no epoch key needed.
    if (wornNoMend)
      setText(
        r.wcHint,
        __DEV_TOOLS__ && dev
          ? dev.subFlavor('mendHint', FLAVOR.mendHint)
          : FLAVOR.mendHint,
      );
    toggle(r.repairBtn, showRepair);
    if (showRepair) {
      setText(
        r.repairBtn,
        `Repair (${balance.REPAIR_WOOD_COST} wood, ${formatCoin(balance.REPAIR_COIN_COST)})`,
      );
      setDisabled(
        r.repairBtn,
        (state.resources.wood ?? 0) < balance.REPAIR_WOOD_COST,
      );
      const title = `${balance.REPAIR_WOOD_COST} wood + up to ${formatCoin(balance.REPAIR_COIN_COST)} (waived if you're short)`;
      if (r.repairBtn.title !== title) r.repairBtn.title = title;
    }
    // the equip switcher — reconciled into wctrl AFTER the persistent repair button (a foreign
    // sibling the reconcile never removes). Roster order (pole · axe · yari), owned-but-not-equipped.
    const equippable = showEquip
      ? WEAPONS.filter(
          (w) =>
            (w.id === 'carrying_pole' || hasFlag(state, `crafted-${w.id}`)) &&
            w.id !== state.equippedWeapon,
        )
      : [];
    reconcileList(r.wctrl, equippable, {
      key: (w) => w.id,
      build: (w) => {
        const eq = el(
          'button',
          'auto-toggle',
          `Take up · ${w.label} ${w.kanji}`,
        );
        eq.type = 'button';
        eq.addEventListener('click', () =>
          dispatch({ type: 'equip_weapon', weaponId: w.id }),
        );
        return eq;
      },
      order: true,
    });
    toggle(r.wctrl, showRepair || equippable.length > 0);

    // ── loot→craft card (0-or-1, keyed by recipe.id so it rebuilds only when the recipe advances) ──
    const recipe = RECIPES.find(
      (rc) => !hasFlag(state, `crafted-${rc.outputWeapon}`),
    );
    const hasMaterial = MATERIALS.some((m) => (state.resources[m.id] ?? 0) > 0);
    const craftItems = showEquip && recipe && hasMaterial ? [recipe] : [];
    toggle(r.craftHost, craftItems.length > 0);
    reconcileList(r.craftHost, craftItems, {
      key: (rc) => rc.id,
      build: (rc) => buildCraftCard(rc),
      patch: (card, rc) => patchCraftCard(card, rc, state),
    });

    // ── stance control (R5) — lazily created so `.stance-row` is truly absent until it unlocks. It
    //    inserts before the watch head (the bestiary that used to sit there is now on Character). ──
    const showStance = isUnlocked(state, 'stance-control');
    if (showStance) {
      if (!r.stanceHost) {
        const sh = el('div', 'stance-row');
        sh.append(el('h3', undefined, 'Stance 構え'));
        combatPane.insertBefore(sh, r.watchHead);
        r.stanceHost = sh;
      }
      toggle(r.stanceHost, true);
      reconcileList(r.stanceHost, STANCE_ORDER, {
        key: (s) => s,
        build: (s) => buildStanceBtn(s),
        patch: (btn, s) => {
          patchStanceReady(btn, s, state);
        },
      });
    } else if (r.stanceHost) {
      toggle(r.stanceHost, false);
    }

    // (IA reorg ADR-112 — the Bestiary SPLIT OUT to the Character tab; see renderCharacterSheet.)

    // ── the watch (spatial) — the foes on THIS node; forecasts patch in place, no strobe ──
    const present = foesHere(state);
    toggle(r.watchEmpty, present.length === 0);
    toggle(r.watchList, present.length > 0);
    reconcileList(r.watchList, present, {
      key: (fc) => fc.mob.id,
      build: (fc) => buildFoeRow(fc),
      patch: (row, fc) => patchFoeRow(row, fc, state),
      order: true,
    });
  }

  return { renderCombat };
}
