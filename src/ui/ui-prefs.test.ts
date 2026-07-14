// @vitest-environment jsdom
//
// FB-74 persistence seam — the per-log font scale round-trips through localStorage and clamps to its
// bounds. Fixtures are derived from the module's own source-of-truth constants (never copied magic
// numbers), so a drift in the bounds updates the assertions with them. Each test can go RED: break
// the clamp and the bound tests fail; break the round-trip and the load/save tests fail.
import { describe, it, expect, beforeEach } from 'vitest';
import {
  LOG_SCALE_MIN,
  LOG_SCALE_MAX,
  LOG_SCALE_STEP,
  LOG_SCALE_DEFAULT,
  clampLogScale,
  loadLogScale,
  saveLogScale,
  loadActionHover,
  saveActionHover,
} from './ui-prefs';

describe('clampLogScale', () => {
  it('clamps below the floor up to LOG_SCALE_MIN', () => {
    expect(clampLogScale(LOG_SCALE_MIN - 1)).toBe(LOG_SCALE_MIN);
    expect(clampLogScale(0)).toBe(LOG_SCALE_MIN);
  });

  it('clamps above the ceiling down to LOG_SCALE_MAX', () => {
    expect(clampLogScale(LOG_SCALE_MAX + 1)).toBe(LOG_SCALE_MAX);
    expect(clampLogScale(99)).toBe(LOG_SCALE_MAX);
  });

  it('passes an in-bounds value through, rounded to 2dp (no float drift)', () => {
    // stepping DOWN from the default by STEP three times must not accumulate fp noise
    const stepped = clampLogScale(
      clampLogScale(
        clampLogScale(LOG_SCALE_DEFAULT - LOG_SCALE_STEP) - LOG_SCALE_STEP,
      ) - LOG_SCALE_STEP,
    );
    // 1.0 → 0.9 → 0.8 (→ clamped to the floor) — and exactly the floor, not 0.7999999
    expect(stepped).toBe(LOG_SCALE_MIN);
    expect(clampLogScale(1.1)).toBe(1.1);
  });

  it('falls back to the default for a non-finite input', () => {
    expect(clampLogScale(Number.NaN)).toBe(LOG_SCALE_DEFAULT);
    expect(clampLogScale(Number.POSITIVE_INFINITY)).toBe(LOG_SCALE_DEFAULT);
  });
});

describe('loadLogScale / saveLogScale round-trip', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('defaults when nothing is stored', () => {
    expect(loadLogScale()).toBe(LOG_SCALE_DEFAULT);
  });

  it('persists a value and reads it back', () => {
    const stored = saveLogScale(1.2);
    expect(stored).toBe(1.2);
    expect(loadLogScale()).toBe(1.2);
  });

  it('clamps out-of-bounds on the way in, so a later load returns the bound', () => {
    saveLogScale(LOG_SCALE_MAX + 5);
    expect(loadLogScale()).toBe(LOG_SCALE_MAX);
    saveLogScale(LOG_SCALE_MIN - 5);
    expect(loadLogScale()).toBe(LOG_SCALE_MIN);
  });

  it('falls back to the default for a corrupt stored value', () => {
    localStorage.setItem('kk.ui.logScale', 'not-a-number');
    expect(loadLogScale()).toBe(LOG_SCALE_DEFAULT);
  });
});

describe('action-hover pref (FB-264 — the DEV hover-detail toggle)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('defaults OFF when nothing is stored (a DEV overlay is opt-in)', () => {
    expect(loadActionHover()).toBe(false);
  });

  it('round-trips ON and OFF through localStorage', () => {
    saveActionHover(true);
    expect(loadActionHover()).toBe(true);
    saveActionHover(false);
    expect(loadActionHover()).toBe(false);
  });

  it('treats a corrupt stored value as OFF', () => {
    localStorage.setItem('kk.dev.actionHover', 'banana');
    expect(loadActionHover()).toBe(false);
  });
});
