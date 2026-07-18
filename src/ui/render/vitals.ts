// The header VITALS strip (split out of render.ts, 2026-07-13 render-split): the
// coin/wood/sansai readouts, the season clock + End-the-season wheel, and the
// body/belly/HP bars. Pure patch of the shell's header elements each render.
import {
  dayOfWeek,
  formatCoin,
  formatKMB,
  hpMax,
  hungerMax,
  isUnlocked,
  restQuality,
  satietyMax,
  season,
  staminaRate,
  DAY_OF_WEEK_NAMES,
  type GameState,
} from '../../core';
import { el, SEASON_TAG, RESOURCE_LABEL } from '../render';
import { setText } from '../reconcile';

interface VitalPair {
  wrap: HTMLElement;
  value: HTMLElement;
}

/** The smallest fill a meter may paint while still holding a NON-ZERO value, in % of
 *  the track. At 1/100 the honest 1% is 1.1px inside a 110px groove — invisible, so
 *  the bar read FULL (the silver ring around the track is the only thing the eye
 *  caught) while its numeral said 1/100. That is a TST4 miss: the player guessed
 *  state, and life-or-death is exactly where they must not (ADR-076). The floor is
 *  presentation only — the exact number beside the bar stays the precise value, and
 *  a true ZERO still paints nothing, so "empty" and "nearly empty" stay distinct. */
const MIN_VISIBLE_FILL_PCT = 3;

/** Width for a meter fill: 0 stays 0, anything above it clears the visibility floor. */
function fillWidth(frac: number): string {
  const pct = Math.max(0, Math.min(1, frac)) * 100;
  return `${pct <= 0 ? 0 : Math.max(MIN_VISIBLE_FILL_PCT, Math.round(pct))}%`;
}

export function createVitalsView(ctx: {
  els: {
    coin: VitalPair;
    clock: HTMLElement;
    clockTag: HTMLElement;
    clockDay: HTMLElement;
    seasonEndBtn: HTMLButtonElement;
    stamina: HTMLElement;
    staminaBar: HTMLElement;
    staminaFill: HTMLElement;
    staminaNum: HTMLElement;
    belly: HTMLElement;
    bellyBar: HTMLElement;
    bellyFill: HTMLElement;
    bellyNum: HTMLElement;
    health: HTMLElement;
    healthBar: HTMLElement;
    healthFill: HTMLElement;
    healthNum: HTMLElement;
    wood: VitalPair;
    sansai: VitalPair;
  };
}): { renderVitals(state: GameState, prev: GameState | null): void } {
  const {
    coin,
    clock,
    clockTag,
    clockDay,
    seasonEndBtn,
    stamina,
    staminaBar,
    staminaFill,
    staminaNum,
    belly,
    bellyBar,
    bellyFill,
    bellyNum,
    health,
    healthBar,
    healthFill,
    healthNum,
    wood,
    sansai,
  } = ctx.els;

  // increases-only number-pop (juice). prev===undefined (load / import / new game) never
  // pops — popValue's guard avoids a false flash on the first paint of a loaded save.
  function popValue(
    node: HTMLElement,
    cur: number,
    before: number | undefined,
  ): void {
    if (before === undefined || cur <= before) return;
    node.classList.remove('pop');
    void node.offsetWidth; // reflow so the animation restarts on a fresh increment
    node.classList.add('pop');
  }

  function renderVitals(state: GameState, prev: GameState | null): void {
    // (FB-166/FB-171 — rice AND coin left the vitals strip; their readouts live on
    // the Inventory 蔵 tab's kura carried/stored rows. The coin element stays built
    // and updated for element-contract stability but never mounts.)
    coin.wrap.hidden = !isUnlocked(state, 'readout-coin');
    if (!coin.wrap.hidden) {
      const v = state.resources.coin ?? 0;
      coin.value.textContent = formatCoin(v);
      popValue(coin.value, v, prev?.resources.coin);
    }

    clock.hidden = !isUnlocked(state, 'readout-clock');
    if (!clock.hidden) {
      const s = SEASON_TAG[season(state)];
      clockTag.lang = 'ja';
      clockTag.textContent = '';
      clockTag.append(
        el('span', 'emoji', s.emoji),
        document.createTextNode(` ${s.kanji} ${s.name}`),
      );
      // FB-333 — the clock is season + weekday ONLY (no year, no day counter): the player
      // lives by the week (market days pull the wheel), not by an absolute count.
      const dw = DAY_OF_WEEK_NAMES[dayOfWeek(state.clock.day)]!;
      clockDay.lang = 'ja';
      setText(clockDay, `${dw.kanji} ${dw.name}`);
      // storywave G1/G4.9 — the manual season wheel is the player's from R2 on (before R2 the
      // season is day-of-week only). Once shown, ending the season is always available (instant —
      // the seasonal judge + spoilage + pool refill run on the turn, ADR-153).
      const rungN = Number.parseInt(state.rung.replace(/^R/, ''), 10);
      const canTurnSeason = Number.isFinite(rungN) && rungN >= 2;
      seasonEndBtn.hidden = !canTurnSeason;
      if (canTurnSeason)
        setText(seasonEndBtn, `End the ${SEASON_TAG[season(state)].name} 季`);
    } else {
      seasonEndBtn.hidden = true;
    }

    stamina.hidden = !isUnlocked(state, 'readout-stamina');
    if (!stamina.hidden) {
      const max = satietyMax(state);
      const frac = state.character.satiety / max;
      staminaFill.style.width = fillWidth(frac);
      staminaBar.classList.toggle('low', staminaRate(state) < 0.99);
      // FB-387 (revising FB-335) — bars only in the header; the exact number lives on
      // the hover title. The unit reads "body" everywhere (FB-334), never "satiety".
      setText(
        staminaNum,
        `${Math.round(state.character.satiety)}/${Math.round(max)}`,
      );
      stamina.title = `Body 体 ${Math.round(state.character.satiety)}/${Math.round(max)} — work draws it down; a rest refills it. Rest better on a full belly.`;
    }

    // The belly (ADR-178) — reveals WITH body (the two-bar group FB-345 asked for). The low flag
    // fires exactly when its teeth bite (restQuality < 1 — AC-6: the same selector the rest
    // reducer spends), so an amber-flagged belly always MEANS "your rests are degraded".
    belly.hidden = !isUnlocked(state, 'readout-stamina');
    if (!belly.hidden) {
      const max = hungerMax(state);
      const frac = max > 0 ? state.character.hunger / max : 0;
      bellyFill.style.width = fillWidth(frac);
      bellyBar.classList.toggle('low', restQuality(state) < 0.99);
      // FB-387 — bars only (the FB-335 numeral moved to the hover title); the unit reads
      // "belly" everywhere (FB-334's law), never the internal field name.
      setText(
        bellyNum,
        `${Math.round(state.character.hunger)}/${Math.round(max)}`,
      );
      belly.title = `Belly 腹 ${Math.round(state.character.hunger)}/${Math.round(max)} — the day draws it down; the house eats from the kura, a meal fills it. A hungry rest restores less.`;
    }

    // HP — revealed the moment combat first matters (the R2 wolf beat), then always visible. Shows an
    // exact number (1 HP vs a full bar is life-or-death, ADR-076) + a bar that flags `low` when ≤ 30%.
    // storywave G4.3 — `verb-face-wolf` is deleted; HP reveals with combat (tab-combat).
    health.hidden = !isUnlocked(state, 'tab-combat');
    if (!health.hidden) {
      const max = hpMax(state);
      const hp = state.character.hp;
      const frac = max > 0 ? hp / max : 0;
      healthFill.style.width = fillWidth(frac);
      healthBar.classList.toggle('low', frac <= 0.3);
      healthNum.textContent = `${hp}/${max}`;
    }

    wood.wrap.hidden = !isUnlocked(state, 'row-wood');
    if (!wood.wrap.hidden) {
      const v = state.resources.wood ?? 0;
      wood.value.textContent = formatKMB(v);
      popValue(wood.value, v, prev?.resources.wood);
    }
    sansai.wrap.hidden = !isUnlocked(state, 'row-sansai');
    if (!sansai.wrap.hidden) {
      const v = state.resources.sansai ?? 0;
      sansai.value.textContent = formatKMB(v);
      popValue(sansai.value, v, prev?.resources.sansai);
    }
    void RESOURCE_LABEL;
  }

  return { renderVitals };
}
