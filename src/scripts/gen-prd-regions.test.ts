import { describe, it, expect } from 'vitest';
import {
  genT0RungTitles,
  genT0WeaponRoster,
  genT0Bestiary,
  genT0DeedSources,
} from './gen-prd-regions';
import { spliceRegion } from './gen-regions';
import { RANKS, WEAPONS, MOBS, getMob, balance } from '../core';

// Proves the F1b Phase 2 PRD-region generator is DERIVED from RANKS (not
// hand-copied) and splices cleanly. Each assertion can go RED: a generator that
// dropped a rung, hard-coded a stale title, or drifted on a second run fails
// here — the same could-go-RED discipline the --check gate enforces on the PRD.

describe('genT0RungTitles', () => {
  it('names every RANKS rung id, title, and kanji — derived from the registry', () => {
    const body = genT0RungTitles();
    for (const r of RANKS) {
      // fixtures come from the source of truth (RANKS), never a copied literal —
      // rename a rung in ranks.ts and this fails until the generator is re-run.
      expect(body).toContain(
        `| ${r.id} | ${r.title} | ${r.kanji} |`.replace(/^/, '> '),
      );
    }
  });

  it('emits exactly one table row per rung (no rungs dropped or duplicated)', () => {
    const rows = genT0RungTitles()
      .split('\n')
      .filter((l) => /^> \| R\d/.test(l));
    expect(rows).toHaveLength(RANKS.length);
  });

  it('frames the block honestly — build-derived, sweep-deferred (not a reconciliation)', () => {
    const body = genT0RungTitles();
    expect(body).toContain('GENERATED from `RANKS`');
    expect(body).toContain('/prd-compress'); // the narrative-title reconciliation is R1-gated, not here
  });

  it('splices byte-idempotently into a doc carrying the marker pair', () => {
    const begin =
      '<!-- gen:begin t0-rung-titles (pnpm run gen:prd-regions — do not edit inside) -->';
    const end = '<!-- gen:end t0-rung-titles -->';
    const doc = [
      '# §3',
      '',
      'Prose above.',
      begin,
      'seed',
      end,
      'Prose below.',
      '',
    ].join('\n');
    const once = spliceRegion(doc, 't0-rung-titles', genT0RungTitles());
    const twice = spliceRegion(once, 't0-rung-titles', genT0RungTitles());
    expect(twice).toBe(once); // stable
    expect(once).toContain('Prose above.');
    expect(once).toContain('Prose below.');
    expect(once).not.toContain('seed');
  });
});

describe('genT0WeaponRoster', () => {
  it('names every WEAPON label, kanji, and archetype — derived from the registry', () => {
    const body = genT0WeaponRoster();
    for (const w of WEAPONS) {
      // fixtures from the source of truth (WEAPONS): rename a weapon in weapons.ts
      // and this fails until the region is regenerated (the mismatch that shipped
      // kama-yari in §4 while the build had the woodlot axe, ADR-128).
      expect(body).toContain(
        `> | ${w.label} | ${w.kanji} | ${w.archetype} | ${w.blurb} |`,
      );
    }
  });

  it('emits exactly one row per weapon (none dropped or duplicated)', () => {
    const rows = genT0WeaponRoster()
      .split('\n')
      .filter((l) => WEAPONS.some((w) => l.startsWith(`> | ${w.label} |`)));
    expect(rows).toHaveLength(WEAPONS.length);
  });

  it('is IDENTITY only — the provisional §4 tuning numbers stay OUT (D-021)', () => {
    const body = genT0WeaponRoster();
    // the durabilityMax values are §4-domain tuning; a generator that leaked them
    // would fail here (and would re-drift every time a number is tuned).
    for (const w of WEAPONS)
      expect(body).not.toContain(String(w.durabilityMax));
  });
});

describe('genT0Bestiary', () => {
  it('names every T0-reachable mob — derived from MOBS', () => {
    const body = genT0Bestiary();
    for (const m of MOBS.filter((x) => (x.minTier ?? 0) < 2)) {
      expect(body).toContain(`> | ${m.label} | ${m.kanji} |`);
    }
  });

  it('EXCLUDES the road bandit — the T2-gated foe belongs in §5, not the T0 bestiary', () => {
    const bandit = getMob('bandit');
    expect(bandit.minTier).toBe(2); // guards the fixture: the filter's whole reason
    // the sharpest RED-able line: drop the minTier filter and the bandit leaks in.
    expect(genT0Bestiary()).not.toContain(bandit.label);
  });

  it('emits one row per T0 foe (bandit excluded) — count matches the filter', () => {
    const t0 = MOBS.filter((m) => (m.minTier ?? 0) < 2);
    const rows = genT0Bestiary()
      .split('\n')
      .filter((l) => t0.some((m) => l.startsWith(`> | ${m.label} |`)));
    expect(rows).toHaveLength(t0.length);
    expect(t0.length).toBe(MOBS.length - 1); // exactly the bandit is held back
  });
});

describe('genT0DeedSources (ADR-145)', () => {
  it('carries every deed source in the mult table, each with a real description', () => {
    const body = genT0DeedSources();
    for (const src of Object.keys(balance.ESTATE_DEED_SOURCE_MULT)) {
      expect(body).toContain(`| ${src} |`);
    }
    // RED if a NEW source lands without a feeder description (the placeholder leaks)
    expect(body).not.toContain('(unmapped');
    // multipliers are §4 tuning — never transcluded
    for (const v of Object.values(balance.ESTATE_DEED_SOURCE_MULT)) {
      expect(body).not.toContain(` ${v} `);
    }
  });

  it('activity-fed sources name their activities from the registry', () => {
    const body = genT0DeedSources();
    expect(body).toContain('`farm_paddy`');
    expect(body).toContain('`haul_stores`');
  });
});

// --- the ADR-168 G1–G8 regions (s136 PRD truth-sync) ---------------------------

import {
  genT0Discoveries,
  genT0ZoneReveals,
  genT0RungReveals,
  genT0QuestRoster,
  genT0Activities,
  genT0MarketStock,
  genT0EstateWorks,
  genVerifyGates,
} from './gen-prd-regions';
import {
  DISCOVERIES,
  AREAS,
  ACTIVITIES,
  QUESTS,
  MARKET_ITEMS,
  ESTATE_STAGES,
} from '../core';
import { GATES } from './gates';

describe('genT0Discoveries (G1)', () => {
  it('names every discovery id and node — derived from DISCOVERIES', () => {
    const body = genT0Discoveries();
    for (const d of DISCOVERIES) {
      expect(body).toContain(`| \`${d.id}\` | ${d.node} |`);
    }
  });

  it('keeps tuning OUT — no attempt floors or roll chances leak', () => {
    const body = genT0Discoveries();
    for (const d of DISCOVERIES) {
      if (d.trigger.chance)
        expect(body).not.toContain(String(d.trigger.chance));
      if (d.minAttempts) expect(body).not.toContain(`| ${d.minAttempts} |`);
    }
  });

  it('marks a seed-only find (no reveals target) distinctly', () => {
    const seedOnly = DISCOVERIES.filter((d) => !d.reveals);
    const rows = genT0Discoveries()
      .split('\n')
      .filter((l) => l.includes('*(seed-only find)*'));
    expect(rows).toHaveLength(seedOnly.length);
  });
});

describe('genT0ZoneReveals (G2)', () => {
  it('emits one row per AREAS zone (16 today; none dropped)', () => {
    const rows = genT0ZoneReveals()
      .split('\n')
      .filter((l) => AREAS.some((a) => l.startsWith(`> | \`${a.id}\` |`)));
    expect(rows).toHaveLength(AREAS.length);
  });

  it('binds reveals from RANKS room-* unlocks (kura at R3, drill-yard node at R4)', () => {
    // fixtures from the source of truth: these two are exactly the rows the audit
    // caught the hand table getting wrong — move them in ranks.ts and this re-derives.
    const body = genT0ZoneReveals();
    const rungOf = (zone: string): string | undefined =>
      RANKS.find((r) => r.rewardOnReach?.unlock?.includes(`room-${zone}`))?.id;
    const kura = AREAS.find((a) => a.id === 'kura');
    expect(body).toContain(
      `| \`kura\` | ${kura?.label} | inks in at **${rungOf('kura')}** |`,
    );
    expect(rungOf('kura')).toBe('R3');
    expect(rungOf('drill-yard')).toBe('R4');
  });

  it('marks locked scenery (ruined) as never-walkable, not rung-revealed', () => {
    const body = genT0ZoneReveals();
    expect(body).toContain('| `ruined` |');
    const ruinedRow = body.split('\n').find((l) => l.includes('| `ruined` |'));
    expect(ruinedRow).toContain('locked scenery');
  });
});

describe('genT0RungReveals (G3)', () => {
  it('carries every rung and every unlock id verbatim — derived from RANKS', () => {
    const body = genT0RungReveals();
    for (const r of RANKS) {
      expect(body).toContain(`| ${r.id} — ${r.title} |`);
      for (const u of r.rewardOnReach?.unlock ?? [])
        expect(body).toContain(`\`${u}\``);
    }
  });

  it('emits one row per rung', () => {
    const rows = genT0RungReveals()
      .split('\n')
      .filter((l) => /^> \| R\d/.test(l));
    expect(rows).toHaveLength(RANKS.length);
  });
});

describe('genT0QuestRoster (G4)', () => {
  it('names every quest id, kind and title — derived from QUESTS', () => {
    const body = genT0QuestRoster();
    for (const q of QUESTS)
      expect(body).toContain(`| \`${q.id}\` | ${q.kind} | ${q.title} |`);
  });
});

describe('genT0Activities (G5)', () => {
  it('carries every activity with its node/skill/deed bindings', () => {
    const body = genT0Activities();
    for (const a of ACTIVITIES) {
      expect(body).toContain(
        `| \`${a.id}\` | ${a.label} | ${a.area} | ${a.skill} |`,
      );
    }
  });

  it('keeps §4 tuning OUT — no yields or satiety costs leak', () => {
    const body = genT0Activities();
    for (const a of ACTIVITIES)
      expect(body).not.toContain(`| ${a.satietyCost} |`);
  });
});

describe('genT0MarketStock (G6)', () => {
  it('names every item and its season window — derived from MARKET_ITEMS', () => {
    const body = genT0MarketStock();
    for (const m of MARKET_ITEMS) {
      expect(body).toContain(`| ${m.label} |`);
      if (m.seasons) expect(body).toContain(m.seasons.join(' · '));
    }
    // a seasonless staple reads "every season" — RED if the fallback is dropped
    if (MARKET_ITEMS.some((m) => !m.seasons))
      expect(body).toContain('every season');
  });

  it('keeps prices and stock caps OUT (§4 tuning)', () => {
    const body = genT0MarketStock();
    for (const m of MARKET_ITEMS) {
      expect(body).not.toContain(`| ${m.coinCost} |`);
      expect(body).not.toContain(`| ${m.stockCap} |`);
    }
  });
});

describe('genT0EstateWorks (G7)', () => {
  it('emits one row per stage with label + blurb, costs kept out', () => {
    const body = genT0EstateWorks();
    for (const s of ESTATE_STAGES) {
      expect(body).toContain(`| U${s.stage} | ${s.label} | ${s.blurb} |`);
      expect(body).not.toContain(String(s.coinCost));
    }
  });
});

describe('genVerifyGates (G8)', () => {
  it('carries every gate name, command and lane — derived from GATES', () => {
    const body = genVerifyGates();
    for (const g of GATES)
      expect(body).toContain(`| ${g.name} | \`${g.cmd}\` | ${g.scope} |`);
  });

  it('emits exactly one row per gate (17 today)', () => {
    const rows = genVerifyGates()
      .split('\n')
      .filter((l) => GATES.some((g) => l.startsWith(`> | ${g.name} |`)));
    expect(rows).toHaveLength(GATES.length);
  });
});
