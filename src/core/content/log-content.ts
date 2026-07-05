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
    const loot = Number(p.lootQty) > 0 ? `, +${p.lootQty} ${p.lootLabel}` : '';
    return `You bring down the ${p.mob}. ✓ (HP ${p.hpBefore}→${p.hpAfter} · +${formatCoin(Number(p.coin))}${loot})`;
  },
  'combat.flee': (p) =>
    `You break off the fight with the ${p.mob} and fall back — winded, blade up, but whole. (HP ${p.hpBefore}→${p.hpAfter})`,
  'combat.loss': (p) => {
    const parts = [
      Number(p.lostCoin) > 0 ? formatCoin(Number(p.lostCoin)) : '',
      Number(p.lostRice) > 0 ? `${p.lostRice} rice` : '',
      Number(p.lostMats) > 0 ? `${p.lostMats} of your spoils` : '',
    ].filter(Boolean);
    const phrase =
      parts.length <= 1
        ? parts.join('')
        : `${parts.slice(0, -1).join(', ')} and ${parts[parts.length - 1]}`;
    const drop = phrase ? ` You drop ${phrase} in the rout.` : '';
    return `The ${p.mob} overcomes you; you limp home badly used. (HP ${p.hpBefore}→${p.hpAfter})${drop} Eat and mend before you take the field again.`;
  },
  'combat.wolfScripted': () =>
    `The wolf comes out of the dark among the rice-sacks. You swing the pole, miss, swing again — and somehow, more luck than skill, it bolts bleeding into the night. You are alive. You should not be.`,
  'combat.drillmaster': () =>
    `${NAMES.drillmaster} the drillmaster finds you shaking by the stores. He says nothing for a long moment. Then: "You lived. That's the only talent that matters in the end. Come to the yard at dawn — I'll teach you the rest."`,

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
    `You take a bowl of plain rice. (−${p.rice} rice${Number(p.satGain) > 0 ? `, +${p.satGain} body` : ''})`,
  'market.sellRice': (p) =>
    `You sell ${p.rice} rice to the pedlar at ${formatCoin(Number(p.price))} the measure. (+${formatCoin(Number(p.coinGain))})`,
  'market.buyItem': (p) => `You barter ${formatCoin(Number(p.coin))} for a ${p.item}.`,
  'belonging.acquire': (p) => `You bring a ${p.item} into your corner.`,
  'bank.deposit': (p) =>
    `You store ${p.resource === 'coin' ? formatCoin(Number(p.amount)) : `${p.amount} ${p.resource}`} safe in the kura storehouse.`,
  'bank.withdraw': (p) =>
    `You draw ${p.resource === 'coin' ? formatCoin(Number(p.amount)) : `${p.amount} ${p.resource}`} back out of the kura storehouse.`,
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
