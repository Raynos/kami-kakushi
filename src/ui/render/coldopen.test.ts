// @vitest-environment jsdom
// @slow — jsdom render suite (split out of render.test.ts, 2026-07-13 render-split);
// runs at push/CI, not the per-commit vitest lane (verify budget, ADR-072/ADR-176).
import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '../render';
import { createInitialState } from '../../core';
import { __setStoryOverlay } from '../../core/content/story-overlay';

import { noopHooks } from './test-utils';

// ── HD-24 — the cold-open "restore a save" affordance (import before replaying the intro) ──
describe('HD-24 (option B) — cold-open offers a quiet restore-a-save line', () => {
  let root: HTMLElement;
  beforeEach(() => {
    document.body.innerHTML = '';
    window.matchMedia = (q: string): MediaQueryList =>
      ({
        matches: false,
        media: q,
        onchange: null,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => false,
      }) as unknown as MediaQueryList;
    root = document.createElement('div');
    document.body.append(root);
  });

  it('the pre-awake card shows a Restore line that opens the Saves modal over the cold-open', () => {
    const render = mount(root, () => {}, noopHooks());
    render(createInitialState(1), null); // no `awake` flag → the cold-open card is shown
    const restore = root.querySelector<HTMLButtonElement>('.coldopen-restore');
    expect(restore).not.toBeNull();

    const scrim = root.querySelector<HTMLElement>('.modal-scrim');
    expect(scrim).not.toBeNull();
    // the modal is a ROOT-level sibling (not nested in the pre-awake-`hidden` shell), so it can
    // overlay the cold-open — the crux of HD-24.
    expect(scrim!.parentElement).toBe(root);
    expect(scrim!.hidden).toBe(true); // closed until asked

    restore!.click();
    expect(scrim!.hidden).toBe(false); // the restore line opens it…
    // …straight onto the Saves tab (the import textarea's section is the active one).
    const savesTab = [
      ...root.querySelectorAll<HTMLButtonElement>('.modal-tab'),
    ].find((b) => (b.textContent ?? '').includes('Saves'));
    expect(savesTab?.getAttribute('aria-selected')).toBe('true');
  });
});

// ── FB-62 — the two-column VN intro modal: ask → done → decide gating + choose → reply → Continue ──
// (MODE==='test' → the typewriter is instant, so the panel + transcript render synchronously.)
