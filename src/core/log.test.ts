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

  it('305 distinct durable lines ALL survive (FB-160 — no durable cap) with strictly-monotone keys', () => {
    let log: LogState = emptyLog();
    for (let i = 0; i < 305; i++) log = pushLog(log, 'narration', `line ${i}`, i);
    expect(log.entries.length).toBe(305); // durable history is unbounded (human, 2026-07-06)
    expect(log.seq).toBe(305);
    const keys = log.entries.map((e) => e.key);
    for (let i = 1; i < keys.length; i++) expect(keys[i]).toBeGreaterThan(keys[i - 1]!);
    expect(keys[0]).toBe(0); // nothing evicted
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

// FB-160/FB-161 (human lock, 2026-07-06) — the log is the house's MEMORY: a durable
// story/chat/progress line is NEVER evicted (unbounded history; the renderer windows
// the DOM, core loses nothing). Only fleeting `ephemeral` lines cap, at
// LOG_EPHEMERAL_MAX — they fade from the Now view in ~15s and need no deep history.
// Fixtures derive from LOG_EPHEMERAL_MAX (the source of truth), never a copied number.
describe('pushLog — unbounded durable history, capped ephemeral', () => {
  it('an ephemeral flood evicts ONLY itself; every durable line survives', async () => {
    const { LOG_EPHEMERAL_MAX } = await import('./constants');
    let log = emptyLog();
    // 20 durable story lines, then alternate-text ephemeral spam far past the cap
    for (let i = 0; i < 20; i++) log = pushLog(log, 'narration', `story beat ${i}`, i);
    for (let i = 0; i < LOG_EPHEMERAL_MAX * 3; i++)
      log = pushLog(log, i % 2 === 0 ? 'reward' : 'system', `grind line ${i}`, 20 + i, {
        ephemeral: true,
      });
    // the fleeting lines ring at their cap; the durable story is untouched
    expect(log.entries.filter((e) => e.ephemeral === true).length).toBe(LOG_EPHEMERAL_MAX);
    const durable = log.entries.filter((e) => e.ephemeral !== true);
    expect(durable.map((e) => e.text)).toEqual(
      Array.from({ length: 20 }, (_, i) => `story beat ${i}`),
    );
    // …and the evictions came from the ephemeral run's head (oldest grind lines gone).
    expect(log.entries.some((e) => e.text === 'grind line 0')).toBe(false);
  });

  it('durable history is UNBOUNDED — a very long run never loses its first line', async () => {
    const { LOG_EPHEMERAL_MAX } = await import('./constants');
    const count = LOG_EPHEMERAL_MAX * 10; // far past any old ring size
    let log = emptyLog();
    for (let i = 0; i < count; i++) log = pushLog(log, 'narration', `line ${i}`, i);
    expect(log.entries.length).toBe(count);
    expect(log.entries[0]!.text).toBe('line 0');
    expect(log.entries[count - 1]!.text).toBe(`line ${count - 1}`);
  });
});
