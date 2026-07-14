import { describe, it, expect } from 'vitest';
import {
  INTRO_BEATS,
  INTRO_BEAT_COUNT,
  introActive,
  introBeatAt,
  introOption,
  introStatLine,
  introStatDelta,
  introPerkLine,
} from './intro';
import { ATTR_IDS, ATTR_META } from './balance';
import { NPC_IDS } from './voices';

// INTRO_BEATS is the source of truth — every assertion derives from it (no copied magic numbers),
// so a content edit that breaks an invariant (a non-net-zero trade, a cross-fed memory write) goes
// RED here rather than shipping.
describe('INTRO_BEATS — the interactive-intro data (plan §3.4/§4)', () => {
  it('is exactly the HD-37 three-act arc: dream → soan → genemon (three picks per run)', () => {
    expect(INTRO_BEAT_COUNT).toBe(3);
    expect(INTRO_BEATS.map((b) => b.id)).toEqual(['dream', 'soan', 'genemon']);
    expect(INTRO_BEATS.find((b) => b.id === 'soan')!.speaker).toBe('soan');
    expect(INTRO_BEATS.find((b) => b.id === 'genemon')!.speaker).toBe(
      'genemon',
    );
    expect(INTRO_BEATS.find((b) => b.id === 'dream')!.speaker).toBeUndefined(); // narrator act
  });

  it('every beat has a prompt, 3 options, non-empty setup, say + react copy', () => {
    for (const beat of INTRO_BEATS) {
      expect(beat.prompt).toBeTruthy();
      expect(beat.setup.length).toBeGreaterThan(0);
      expect(beat.options).toBeDefined();
      expect(beat.options!.length).toBe(3);
      for (const opt of beat.options!) {
        expect(opt.label).toBeTruthy();
        expect(opt.say).toBeTruthy();
        expect(opt.react).toBeTruthy();
        // FB-56: every option grants a PERK — a short name + a STANDALONE one-line desc (flavor that
        // stands without the intro-conversation context). The ± mechanics are appended by
        // introPerkLine (single-source), NEVER baked into the perk's name or desc.
        expect(opt.perk.name).toBeTruthy();
        expect(opt.perk.desc).toBeTruthy();
        expect(opt.perk.name).not.toContain('(');
        expect(opt.perk.desc).not.toContain('(');
        expect(opt.perk.name).not.toMatch(/[+−]1/);
        expect(opt.perk.desc).not.toMatch(/[+−]1/);
      }
    }
  });

  it('every option is a BALANCED, net-zero +1/−1 trade with DISTINCT up/down attrs', () => {
    for (const beat of INTRO_BEATS) {
      for (const opt of beat.options!) {
        expect(ATTR_IDS).toContain(opt.stat.up);
        expect(ATTR_IDS).toContain(opt.stat.down);
        // distinct → a real trade (never a self-cancel that also isn't net-zero-by-accident)
        expect(opt.stat.up).not.toBe(opt.stat.down);
      }
    }
  });

  it('applying any single option keeps the MC total attribute count constant (net-zero)', () => {
    const baseTotal = ATTR_IDS.length * 5; // fresh MC: every attr at ATTR_BASE (5)
    for (const beat of INTRO_BEATS) {
      for (const opt of beat.options!) {
        // simulate the +1/−1 on a fresh block and re-sum
        const attrs: Record<string, number> = {};
        for (const id of ATTR_IDS) attrs[id] = 5;
        attrs[opt.stat.up] = (attrs[opt.stat.up] ?? 0) + 1;
        attrs[opt.stat.down] = (attrs[opt.stat.down] ?? 0) - 1;
        const total = ATTR_IDS.reduce((n, id) => n + (attrs[id] ?? 0), 0);
        expect(total).toBe(baseTotal);
      }
    }
  });

  it('memory writes are per-NPC and NEVER cross-fed: each beat writes its OWN speaker only', () => {
    for (const beat of INTRO_BEATS) {
      const memNpcs = new Set(
        beat.options!.map((o) => o.memory?.npc).filter((n) => n !== undefined),
      );
      // a beat may only write the NPC it speaks for; the speakerless dream act writes none.
      for (const npc of memNpcs) expect(npc).toBe(beat.speaker);
      if (beat.speaker === undefined) expect(memNpcs.size).toBe(0);
      // every memory NPC id is a real NpcId
      for (const opt of beat.options!) {
        if (opt.memory) expect(NPC_IDS).toContain(opt.memory.npc);
      }
    }
    // …and the write machinery is actually exercised: at least one beat carries memory.
    expect(INTRO_BEATS.some((b) => b.options!.some((o) => o.memory))).toBe(
      true,
    );
  });

  it('option ids are globally unique (the reducer looks options up by id)', () => {
    const ids = INTRO_BEATS.flatMap((b) => b.options!.map((o) => o.id));
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('intro selectors', () => {
  it('introActive is true only for a live beat index (0..N-1)', () => {
    expect(introActive(-1)).toBe(false); // pre-wake
    expect(introActive(0)).toBe(true);
    expect(introActive(INTRO_BEAT_COUNT - 1)).toBe(true);
    expect(introActive(INTRO_BEAT_COUNT)).toBe(false); // done
  });

  it('introBeatAt returns the beat live, null otherwise', () => {
    expect(introBeatAt(-1)).toBeNull();
    expect(introBeatAt(0)).toBe(INTRO_BEATS[0]);
    expect(introBeatAt(INTRO_BEAT_COUNT)).toBeNull();
  });

  it('introOption finds by id and is undefined for a foreign id', () => {
    const beat = INTRO_BEATS[0]!;
    expect(introOption(beat, beat.options![0]!.id)).toBe(beat.options![0]);
    expect(introOption(beat, 'genemon-earnest')).toBeUndefined(); // an option from ANOTHER beat
  });

  it('introStatLine names the exact ± using ATTR_META labels (single source, post-pick hint)', () => {
    const line = introStatLine({ up: 'int', down: 'str' });
    expect(line).toContain(`+1 ${ATTR_META.int.label}`);
    expect(line).toContain(`−1 ${ATTR_META.str.label}`);
  });

  it('introStatDelta is the single-source ± text, built from ATTR_META labels', () => {
    expect(introStatDelta({ up: 'int', down: 'str' })).toBe(
      `+1 ${ATTR_META.int.label} / −1 ${ATTR_META.str.label}`,
    );
  });

  it('introPerkLine (F56) carries the perk name + standalone desc + the exact ± — never a bare delta', () => {
    for (const beat of INTRO_BEATS) {
      for (const opt of beat.options!) {
        const line = introPerkLine(opt);
        // it CARRIES the granted perk (the design lever: a named unlock, not a stat dump)…
        expect(line).toContain(opt.perk.name);
        expect(line).toContain(opt.perk.desc);
        // …and appends the exact ± as context, matching the trade the reducer applies (net-zero).
        expect(line).toContain(introStatDelta(opt.stat));
        expect(line).toContain(`+1 ${ATTR_META[opt.stat.up].label}`);
        expect(line).toContain(`−1 ${ATTR_META[opt.stat.down].label}`);
        // …but never JUST the delta — the perk flavor is the point.
        expect(line).not.toBe(introStatDelta(opt.stat));
      }
    }
  });

  it('every perk name is distinct (the milestone line must read as a specific unlock)', () => {
    const names = INTRO_BEATS.flatMap((b) =>
      b.options!.map((o) => o.perk.name),
    );
    expect(names.length).toBeGreaterThan(0);
    expect(new Set(names).size).toBe(names.length);
  });
});
