import { describe, it, expect } from 'vitest';
import { resolveDevGating } from './dev-gating';

// The ADR-138 gate is the seam between "code shipped" and "code active". These assert
// the full truth table — most importantly the PROD-with-tools rows, the ones the
// dev-server e2e lane can't reach (it always boots with DEV=true).
describe('resolveDevGating (D-138)', () => {
  describe('no tools in bundle (post-T0 hard strip) → always inert', () => {
    for (const search of ['', '?dev=yes', '?dev=no', '?dev=1']) {
      it(`hasTools=false, search="${search}" → both false`, () => {
        expect(resolveDevGating(true, false, search)).toEqual({
          qa: false,
          panel: false,
        });
        expect(resolveDevGating(false, false, search)).toEqual({
          qa: false,
          panel: false,
        });
      });
    }
  });

  describe('dev serve (isDev=true, hasTools=true) — current behaviour preserved', () => {
    it('default → both on', () => {
      expect(resolveDevGating(true, true, '')).toEqual({
        qa: true,
        panel: true,
      });
    });
    it('?dev=no → __qa STAYS on (e2e/agents drive it), panel off', () => {
      expect(resolveDevGating(true, true, '?dev=no')).toEqual({
        qa: true,
        panel: false,
      });
    });
    for (const alias of ['no', '0', 'false', 'off']) {
      it(`?dev=${alias} opts the panel out`, () => {
        expect(resolveDevGating(true, true, `?dev=${alias}`).panel).toBe(false);
      });
    }
  });

  describe('T0 prod bundle (isDev=false, hasTools=true) — default-off, opt-in', () => {
    it('no param → both false (a plain gh-pages visitor gets NO cheats/panel)', () => {
      expect(resolveDevGating(false, true, '')).toEqual({
        qa: false,
        panel: false,
      });
    });
    it('?dev=yes → both true', () => {
      expect(resolveDevGating(false, true, '?dev=yes')).toEqual({
        qa: true,
        panel: true,
      });
    });
    for (const alias of ['yes', '1', 'true', 'on']) {
      it(`?dev=${alias} turns tools on`, () => {
        expect(resolveDevGating(false, true, `?dev=${alias}`)).toEqual({
          qa: true,
          panel: true,
        });
      });
    }
    it('?dev=no → stays off (the off-alias is a no-op in default-off prod)', () => {
      expect(resolveDevGating(false, true, '?dev=no')).toEqual({
        qa: false,
        panel: false,
      });
    });
    it('param embedded among others is still matched', () => {
      expect(resolveDevGating(false, true, '?fixture=x&dev=yes&foo=1').qa).toBe(
        true,
      );
    });
  });
});
