// F6 scenario-save teeth (§2.5a) — the round-trip test. Cheap (parse + validateEnvelope + assert;
// NO simulation), so it lives IN the vitest gate. Two things it proves, each RED-able:
//   1. registry ↔ disk parity — an orphan save or a spec with no save goes RED.
//   2. every committed envelope loads through the REAL import → migrate → validate chain AND lands
//      on its spec's waypoint. `validate.ts` is deliberately additive-tolerant (absent fields
//      default silently), so "it validates" alone is a weak guard — the waypoint `expect` is the
//      teeth: it fails when a defaulted/migrated field lands the state OFF its waypoint. At a schema
//      bump the committed fixtures lag one version until regen, so this exercises the real migration
//      chain on real old envelopes at exactly the commit that bumps the schema.
import { describe, it, expect } from 'vitest';
import { validateEnvelope } from '../persistence/validate';
import { migrate } from '../persistence/migrate';
import { FIXTURE_SPECS, getSpec } from './specs';
import { getFixtures } from './index';

const saveFiles = import.meta.glob('./saves/*.json', { eager: true });

describe('F6 scenario fixtures', () => {
  it('registry ↔ disk parity (no orphan save, no spec without a save)', () => {
    const diskNames = Object.keys(saveFiles)
      .map((p) => p.replace('./saves/', '').replace('.json', ''))
      .sort();
    const specNames = FIXTURE_SPECS.map((s) => s.name).sort();
    expect(diskNames).toEqual(specNames);
  });

  for (const entry of getFixtures()) {
    it(`${entry.name} validates through the real chain and lands on its waypoint`, () => {
      const v = validateEnvelope(entry.env, { migrate });
      expect(v.ok, v.ok ? '' : `envelope rejected: ${v.reason}`).toBe(true);
      if (!v.ok) return;
      // the waypoint expect throws on a miss — the real teeth of this test.
      getSpec(entry.name)!.expect(v.state);
    });
  }
});
