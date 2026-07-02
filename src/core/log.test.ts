import { describe, it, expect } from 'vitest';
import { emptyLog, pushLog, type LogState } from './log';

// pushLog coalesces a run of consecutive byte-identical (same channel+text) lines onto
// the last entry (count++, no new key, seq NOT consumed) — the pure-core half of the
// G-LOG readability gate (audit §3 #3). The renderer paints the "×N" tally (Commit 8).
describe('pushLog — consecutive-identical coalescing', () => {
  it('collapses 12 identical lines into one entry: length 1, count 12, key 0, seq 1', () => {
    let log: LogState = emptyLog();
    for (let i = 0; i < 12; i++) log = pushLog(log, 'combat', 'You fell the monkey. (+3 coin)', i);
    expect(log.entries.length).toBe(1);
    const only = log.entries[0]!;
    expect(only.count).toBe(12);
    expect(only.key).toBe(0);
    expect(only.text).toBe('You fell the monkey. (+3 coin)');
    expect(log.seq).toBe(1);
  });

  it('a distinct line re-opens a run (same text, non-consecutive, gets a fresh entry)', () => {
    let log: LogState = emptyLog();
    log = pushLog(log, 'combat', 'A', 0);
    log = pushLog(log, 'combat', 'A', 1);
    log = pushLog(log, 'combat', 'B', 2); // distinct text closes the A run
    log = pushLog(log, 'combat', 'A', 3); // same text, NOT consecutive → new entry
    expect(log.entries.map((e) => e.text)).toEqual(['A', 'B', 'A']);
    expect(log.entries.map((e) => e.count)).toEqual([2, 1, 1]);
    expect(log.entries.map((e) => e.key)).toEqual([0, 1, 2]);
    expect(log.seq).toBe(3);
  });

  it('same text on a DIFFERENT channel does not coalesce (channel is part of identity)', () => {
    let log: LogState = emptyLog();
    log = pushLog(log, 'combat', 'X', 0);
    log = pushLog(log, 'system', 'X', 1);
    expect(log.entries.length).toBe(2);
    expect(log.entries.every((e) => e.count === 1)).toBe(true);
    expect(log.seq).toBe(2);
  });

  it('a coalesced run keeps its original key and updates tick to the latest occurrence', () => {
    let log: LogState = emptyLog();
    log = pushLog(log, 'reward', 'rake', 7);
    log = pushLog(log, 'reward', 'rake', 9);
    const e = log.entries[0]!;
    expect(e.key).toBe(0);
    expect(e.tick).toBe(9);
    expect(e.count).toBe(2);
  });

  it('305 distinct lines stay capped at the ring max (300) with strictly-monotone keys', () => {
    let log: LogState = emptyLog();
    for (let i = 0; i < 305; i++) log = pushLog(log, 'narration', `line ${i}`, i);
    expect(log.entries.length).toBe(300);
    expect(log.seq).toBe(305);
    const keys = log.entries.map((e) => e.key);
    for (let i = 1; i < keys.length; i++) expect(keys[i]).toBeGreaterThan(keys[i - 1]!);
    expect(keys[0]).toBe(5); // first 5 evicted by the ring
    expect(keys[keys.length - 1]!).toBe(304);
    expect(log.entries.every((e) => e.count === 1)).toBe(true);
  });

  it('is deterministic — the same push sequence yields an equal log', () => {
    const build = (): LogState => {
      let log: LogState = emptyLog();
      const seq: [Parameters<typeof pushLog>[1], string][] = [
        ['combat', 'win'],
        ['combat', 'win'],
        ['combat', 'win'],
        ['combat', 'loss'],
        ['milestone', 'level up'],
        ['combat', 'win'],
      ];
      seq.forEach(([ch, text], i) => {
        log = pushLog(log, ch, text, i);
      });
      return log;
    };
    expect(build()).toEqual(build());
  });
});
