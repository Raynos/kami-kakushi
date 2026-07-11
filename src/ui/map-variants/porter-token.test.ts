// @vitest-environment jsdom
// porter-token.test.ts — the FB-340 v2 piece: sculpt structure + the resting
// mount contract (jsdom). The LOOK is verified live (headless captures — the
// sheet isn't golden-hashed here); these assert the invariants that must hold
// for the presence player to drive the piece.
import { describe, expect, it } from 'vitest';
import { buildPorter } from './porter-token';

describe('buildPorter', () => {
  it('is display-only: pointer-events none + aria-hidden (an indicator, never a control)', () => {
    const g = buildPorter('t');
    expect(g.getAttribute('pointer-events')).toBe('none');
    expect(g.getAttribute('aria-hidden')).toBe('true');
  });

  it('carries the presence class the travel player hides during transit', () => {
    expect(buildPorter('t').getAttribute('class')).toBe('sheetmap-porter');
  });

  it('namespaces its gradient per mount so resting + walking pieces never collide', () => {
    const rest = buildPorter('rest');
    const walk = buildPorter('walk');
    expect(rest.querySelector('linearGradient')?.id).toBe('porter-wood-rest');
    expect(walk.querySelector('linearGradient')?.id).toBe('porter-wood-walk');
    // and the sculpt actually consumes ITS gradient (not a hardcoded fill)
    expect(rest.innerHTML).toContain('url(#porter-wood-rest)');
  });

  it('draws every carved part from the shared --piece-* tokens, never a hex literal', () => {
    const html = buildPorter('t').innerHTML;
    expect(html).toContain('var(--piece-rope)');
    expect(html).toContain('var(--piece-carve)');
    expect(html).toContain('var(--piece-skin)');
    expect(html).toContain('var(--shu)'); // the "you" accent
    // the only literal is the contact shadow's black; no wood hexes leak past the tokens
    expect(html).not.toMatch(/#(?:a8875a|7d6440|c9a668|b99a68|5c4a2e|3a2d1a)/i);
  });
});
