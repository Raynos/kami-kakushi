// The log-content registry (shrink-save-file Stage C, 2026-07-05). Every diegetic log
// line's WORDS live here as one pure function of (contentKey, params) — the single
// source for a line's text (T1). Emit sites hand a `contentKey` + `params`; the rewards
// bus derives the text via `renderLogLine`. This lets the log persist as compact
// descriptors (contentKey + params) instead of prose, and lets a later reword update all
// history on next load ("re-derivation is fine", the human's 2026-07-05 call).
//
// A leaf module: imports nothing from core, so it never closes a dependency cycle.
// Populated incrementally as emit sites migrate (Stage C2…C8), grouped by source file.

import { NAMES } from './names';
import { formatCoin } from '../format';

export type LogParamValue = string | number | boolean;
export type LogParams = Readonly<Record<string, LogParamValue>>;

/** A line template: a pure function of its params → the diegetic text. */
export type LogTemplate = (p: LogParams) => string;

export const LOG_CONTENT: Record<string, LogTemplate> = {
  // ── step.ts — season boundaries ──────────────────────────────────────────────
  // SUPERSEDED at C5a (ADR-159): the live judge line is per-grade (flavor.ts judgeLine);
  // this template stays only so persisted pre-C5a log entries keep a renderer.
  'season.reckoned': (p) =>
    `The season's accounts are reckoned. The house is judged the better for your hand on it — its koku standing rises. (+${p.bonus} koku)`,
  'season.spoilage': (p) =>
    `The season turns, and some of your rice has spoiled in the store. (−${p.total} rice)`,

  // ── ranks.ts — promotions ────────────────────────────────────────────────────
  'rank.wallWeapon': (p) =>
    `You mount your ${p.weapon} on the wall of your corner — the weapon you carry, and proof of the road you have walked. A servant with a place, and a token of it on the wall.`,
  'rank.marker': (p) => `Rank ↑ — ${p.title} ${p.kanji}`,

  // ── ascension.ts — T0→T1 ─────────────────────────────────────────────────────
  // Global NAMES constants are baked in (not per-event params); re-derivation stays
  // consistent if a name is ever retconned. Only the event-dynamic `knot` is a param.
  'ascension.hall': () =>
    `The house gathers in the main hall. The lord ${NAMES.lord} names you a man of the ${NAMES.house} — no longer a servant earning his rice, but one entrusted with the house's own standing. You feel the weight of it settle, and something in you answer to it. (You ascend — the Estate rises.)`,
  'ascension.dream': (p) =>
    p.knot
      ? `That night the dream comes clearer than it ever has: hands that are yours and not yours, tying a porter's knot you never learned; a road in the dark; a name on the tip of your tongue. You wake reaching for it, and it is already gone.`
      : `That night a dream comes — a road in the dark, a name almost remembered — and is gone by the time you wake.`,

  // ── fight.ts — combat ────────────────────────────────────────────────────────
  // The win/loss/flee lines are the auto-grind's highest-frequency output. Their
  // composed sub-phrases (loot tally, rout-loss grammar) live HERE, not at the emit
  // site — the registry owns every word; the emit site passes only raw numbers/labels.
  'combat.levelUp': (p) => `Your body has hardened with the fighting. Combat level ${p.level}.`,
  'combat.tooHurt': () =>
    'You are too hurt to hold the line — eat and mend before you take the field.',
  'combat.win': (p) => {
    // Combat is MATERIALS-only (G4 — beasts carry no mon): the coin token renders only when a
    // coin reward actually exists, so the ordinary coinless win never shows a dead "+0" (C1.5).
    const extras = [
      Number(p.coin) > 0 ? `+${formatCoin(Number(p.coin))}` : '',
      Number(p.lootQty) > 0 ? `+${p.lootQty} ${p.lootLabel}` : '',
    ]
      .filter(Boolean)
      .join(', ');
    return `You bring down the ${p.mob}. ✓ (HP ${p.hpBefore}→${p.hpAfter}${extras ? ` · ${extras}` : ''})`;
  },
  'combat.flee': (p) =>
    `You break off the fight with the ${p.mob} and fall back — winded, blade up, but whole. (HP ${p.hpBefore}→${p.hpAfter})`,
  'combat.loss': (p) => {
    // Rice never appears here: it is kura-only (ADR-163) and cannot bleed by construction.
    const parts = [
      Number(p.lostCoin) > 0 ? formatCoin(Number(p.lostCoin)) : '',
      Number(p.lostMats) > 0 ? `${p.lostMats} of your spoils` : '',
    ].filter(Boolean);
    const phrase =
      parts.length <= 1
        ? parts.join('')
        : `${parts.slice(0, -1).join(', ')} and ${parts[parts.length - 1]}`;
    const drop = phrase ? ` You drop ${phrase} in the rout.` : '';
    return `The ${p.mob} overcomes you; you limp home badly used. (HP ${p.hpBefore}→${p.hpAfter})${drop} Eat and mend before you take the field again.`;
  },

  // ── intents.ts — player actions ──────────────────────────────────────────────
  // Only the INLINE-authored templates live here; lines pulled from content data
  // (topic/option/recipe/destination text) and single-source helpers (rakeLine,
  // activityLine, homeRestLine) stay in their content modules and persist as {text}.
  'combat.weaponBroken': (p) =>
    `Your ${p.weapon} is broken and there's no wood to mend it — the watch breaks off. Gather wood and repair before you fight on.`,
  'craft.repair': (p) =>
    `You repair the ${p.weapon}. (−${p.wood} wood${Number(p.coinFee) > 0 ? `, −${formatCoin(Number(p.coinFee))}` : ''})`,
  'craft.equip': (p) => `You take up the ${p.weapon}.`,
  'food.cook': (p) =>
    `You boil the wild greens into a hot meal and eat. The ache of your wounds eases. (−${p.sansai} sansai${Number(p.hpGain) > 0 ? `, +${p.hpGain} HP` : ''})`,
  'food.eatRice': (p) =>
    `You take a bowl of plain rice. (−${p.rice} rice${Number(p.bellyGain) > 0 ? `, +${p.bellyGain} belly` : ''})`,
  'market.sellRice': (p) =>
    `You sell ${p.rice} rice to the pedlar at ${formatCoin(Number(p.price))} the measure. (+${formatCoin(Number(p.coinGain))})`,
  'market.buyItem': (p) => `You barter ${formatCoin(Number(p.coin))} for a ${p.item}.`,
  // save-format plan, step 1 — lines whose prose used to sit inline in a reducer. They live here
  // now so the SAVE stores a key, not the words: reword one and every existing save follows.
  'nengu.reckoned': () =>
    'The nengu is reckoned: the year measured against the house, the shortfall named plainly and let stand. No one at the board says the figure twice.',
  'estate.workProgress': (p) => `The work goes forward — ${p.stage}, ${p.done} of ${p.total}.`,
  'wage.first': (p) =>
    `You are handed ${p.pay} mon at the board, counted once into your palm — the first the house has paid you in coin, and yours to keep.`,
  'estate.commissioned': (p) =>
    `Commissioned: ${p.stage} — timber and coin set aside; the work waits at the site.`,
  'belonging.acquire': (p) => `You bring a ${p.item} into your corner.`,
  'bank.deposit': (p) =>
    `You store ${p.resource === 'coin' ? formatCoin(Number(p.amount)) : `${p.amount} ${p.resource}`} safe in the kura storehouse.`,
  'bank.withdraw': (p) =>
    `You draw ${p.resource === 'coin' ? formatCoin(Number(p.amount)) : `${p.amount} ${p.resource}`} back out of the kura storehouse.`,
  // H3 (2026-07-13) — the retired rice-withdraw verb refuses loudly. No UI reaches this (the
  // "Withdraw all rice" row is gone); it exists so a stale save or QA script gets a visible line.
  'bank.withdrawRefusedRice': () =>
    'Rice stays in the kura — it is spent from the store, never carried back out.',
};

/** Render a line's text from its content-key + params. Throws on an unknown key —
 *  a migration/emit-site bug is better LOUD than a silently blank hero-surface line. */
export function renderLogLine(contentKey: string, params: LogParams = {}): string {
  const tmpl = LOG_CONTENT[contentKey];
  if (tmpl === undefined) {
    throw new Error(`log-content: unknown contentKey "${contentKey}"`);
  }
  return tmpl(params);
}
