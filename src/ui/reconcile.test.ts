// @vitest-environment jsdom
//
// Unit tests for the shared keyed-reconcile DOM helpers (ui/reconcile.ts) — the generalization of
// the intro's build-once / diff-and-append pattern (FB-81). The invariant under test: a node is
// BUILT once per key and PATCHED in place after, so an unchanged re-render appends nothing,
// recreates nothing, and mutates nothing (zero DOM churn). These are the primitives every migrated
// pane leans on, so they carry the load-bearing assertions once, centrally.
import { describe, it, expect } from 'vitest';
import { reconcileList, setText, toggle, setClass, setDisabled, setStyle } from './reconcile';

interface Item {
  id: string;
  n: number;
}

describe('reconcileList — keyed append / patch / remove / reorder', () => {
  it('builds a node ONCE per key and reuses it across renders (node identity)', () => {
    const c = document.createElement('div');
    document.body.append(c); // in-document so isConnected is meaningful
    let builds = 0;
    const items: Item[] = [
      { id: 'a', n: 1 },
      { id: 'b', n: 2 },
    ];
    const render = (list: Item[]): void =>
      reconcileList(c, list, {
        key: (i) => i.id,
        build: (i) => {
          builds++;
          const el = document.createElement('span');
          el.dataset.id = i.id;
          return el;
        },
        patch: (el, i) => {
          el.textContent = String(i.n);
        },
      });
    render(items);
    expect(builds).toBe(2);
    const nodeA = c.querySelector('[data-id="a"]')!;
    // re-render with the SAME keys → no new builds, the same node object survives.
    render([
      { id: 'a', n: 9 },
      { id: 'b', n: 2 },
    ]);
    expect(builds).toBe(2); // build never re-ran for an existing key
    expect(c.querySelector('[data-id="a"]')).toBe(nodeA); // identity preserved
    expect(nodeA.textContent).toBe('9'); // patch applied in place
    expect(nodeA.isConnected).toBe(true);
  });

  it('appends a newly-appearing key without touching existing nodes', () => {
    const c = document.createElement('div');
    const build = (i: Item): HTMLElement => {
      const el = document.createElement('span');
      el.dataset.id = i.id;
      return el;
    };
    reconcileList(c, [{ id: 'a', n: 1 }], { key: (i) => i.id, build });
    const nodeA = c.querySelector('[data-id="a"]')!;
    reconcileList(
      c,
      [
        { id: 'a', n: 1 },
        { id: 'b', n: 2 },
      ],
      { key: (i) => i.id, build },
    );
    expect(c.querySelector('[data-id="a"]')).toBe(nodeA); // untouched
    expect(c.querySelector('[data-id="b"]')).not.toBeNull(); // appended
    expect(c.children.length).toBe(2);
  });

  it('removes a vanished key, leaving a genuinely empty container when the list empties (F72)', () => {
    const c = document.createElement('div');
    const build = (i: Item): HTMLElement => {
      const el = document.createElement('span');
      el.dataset.id = i.id;
      return el;
    };
    reconcileList(
      c,
      [
        { id: 'a', n: 1 },
        { id: 'b', n: 2 },
      ],
      { key: (i) => i.id, build },
    );
    reconcileList(c, [{ id: 'b', n: 2 }], { key: (i) => i.id, build }); // 'a' gone
    expect(c.querySelector('[data-id="a"]')).toBeNull();
    expect(c.children.length).toBe(1);
    reconcileList(c, [], { key: (i) => i.id, build }); // all gone
    expect(c.children.length).toBe(0); // NO orphan node — the ghost-box contract
  });

  it('reorders to match items order, moving ONLY out-of-place nodes (min churn)', () => {
    const c = document.createElement('div');
    const build = (i: Item): HTMLElement => {
      const el = document.createElement('span');
      el.dataset.id = i.id;
      el.textContent = i.id;
      return el;
    };
    const order = (): string =>
      [...c.children].map((el) => (el as HTMLElement).dataset.id).join('');
    reconcileList(
      c,
      [
        { id: 'a', n: 1 },
        { id: 'b', n: 2 },
        { id: 'c', n: 3 },
      ],
      { key: (i) => i.id, build, order: true },
    );
    const nodeA = c.querySelector('[data-id="a"]')!;
    expect(order()).toBe('abc');
    // reverse the order → the SAME nodes, re-sequenced (not rebuilt).
    reconcileList(
      c,
      [
        { id: 'c', n: 3 },
        { id: 'b', n: 2 },
        { id: 'a', n: 1 },
      ],
      { key: (i) => i.id, build, order: true },
    );
    expect(order()).toBe('cba');
    expect(c.querySelector('[data-id="a"]')).toBe(nodeA); // reused, not recreated
  });

  it('an unchanged re-render with order:true moves NOTHING (zero churn)', () => {
    const c = document.createElement('div');
    const list: Item[] = [
      { id: 'a', n: 1 },
      { id: 'b', n: 2 },
      { id: 'c', n: 3 },
    ];
    const opts = {
      key: (i: Item) => i.id,
      build: (i: Item): HTMLElement => {
        const el = document.createElement('span');
        el.dataset.id = i.id;
        return el;
      },
      order: true,
    };
    reconcileList(c, list, opts);
    const obs = new MutationObserver(() => {});
    obs.observe(c, { childList: true, subtree: true, attributes: true });
    reconcileList(c, list, opts); // identical re-render
    reconcileList(c, list, opts);
    const records = obs.takeRecords();
    obs.disconnect();
    expect(records).toEqual([]); // no append, no move, no attribute write
  });

  it('tracks rendered keys PER container (two containers do not cross-talk)', () => {
    const c1 = document.createElement('div');
    const c2 = document.createElement('div');
    const build = (i: Item): HTMLElement => {
      const el = document.createElement('span');
      el.dataset.id = i.id;
      return el;
    };
    reconcileList(c1, [{ id: 'a', n: 1 }], { key: (i) => i.id, build });
    reconcileList(c2, [{ id: 'a', n: 1 }], { key: (i) => i.id, build });
    // the same key in two containers → two distinct nodes, neither removed by the other's render.
    expect(c1.children.length).toBe(1);
    expect(c2.children.length).toBe(1);
    expect(c1.firstElementChild).not.toBe(c2.firstElementChild);
  });
});

describe('setText / toggle / setClass / setDisabled / setStyle — idempotent (no churn when equal)', () => {
  it('setText writes only on a real change', () => {
    const el = document.createElement('div');
    setText(el, 'hi');
    expect(el.textContent).toBe('hi');
    const obs = new MutationObserver(() => {});
    obs.observe(el, { childList: true, characterData: true, subtree: true });
    setText(el, 'hi'); // equal → no-op
    expect(obs.takeRecords()).toEqual([]);
    obs.disconnect();
    setText(el, 'bye');
    expect(el.textContent).toBe('bye');
  });

  it('toggle flips hidden idempotently', () => {
    const el = document.createElement('div');
    toggle(el, false);
    expect(el.hidden).toBe(true);
    toggle(el, true);
    expect(el.hidden).toBe(false);
    const obs = new MutationObserver(() => {});
    obs.observe(el, { attributes: true });
    toggle(el, true); // already shown → no attribute write
    expect(obs.takeRecords()).toEqual([]);
    obs.disconnect();
  });

  it('setClass / setDisabled / setStyle skip the write when already in the desired state', () => {
    const el = document.createElement('button');
    setClass(el, 'on', true);
    setDisabled(el, true);
    setStyle(el, 'width', '40%');
    expect(el.classList.contains('on')).toBe(true);
    expect(el.disabled).toBe(true);
    expect(el.style.getPropertyValue('width')).toBe('40%');
    const obs = new MutationObserver(() => {});
    obs.observe(el, { attributes: true });
    setClass(el, 'on', true); // equal
    setDisabled(el, true); // equal
    setStyle(el, 'width', '40%'); // equal
    expect(obs.takeRecords()).toEqual([]); // zero attribute mutations
    obs.disconnect();
    // and a real change DOES write:
    setStyle(el, 'width', '55%');
    expect(el.style.getPropertyValue('width')).toBe('55%');
  });
});
