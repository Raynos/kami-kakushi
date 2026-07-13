// Shared keyed-reconcile DOM helpers — the intro's proven build-once / diff-and-append pattern
// (FB-81, src/ui/render.ts) generalised into reusable primitives so every workspace pane can go
// incremental. Pure DOM, no framework, NO game logic: a node is BUILT once on its first
// appearance (listeners bound there) and PATCHED in place after, so an idle re-render of
// unchanged state produces ZERO DOM churn — no node recreated, no attribute re-written, no
// `textContent=''` teardown. That zero-churn invariant is what restores meter transitions,
// keeps keyboard focus, and kills the ~2×/s idle-tick flash.
//
// Every mutating helper is IDEMPOTENT — it reads the current DOM and writes only on a real
// change — because the spec queues a MutationObserver record for *any* attribute set (even to
// an equal value), and an unguarded write would defeat the invariant a zero-churn test asserts.

// Per-container key→node bookkeeping. A WeakMap keyed by the container element tracks each
// container's rendered set without leaking once the container is garbage-collected.
const rendered = new WeakMap<HTMLElement, Map<string, HTMLElement>>();

export interface ReconcileOpts<T> {
  /** Stable identity for an item — the SAME item yields the SAME key across renders. */
  key: (item: T) => string;
  /** Build the node the FIRST time a key appears. Runs ONCE per key (bind listeners here). */
  build: (item: T) => HTMLElement;
  /** Patch an existing node in place every render (disabled / % / widths / toggles). */
  patch?: (el: HTMLElement, item: T) => void;
  /** Reorder existing nodes to match `items` order, moving ONLY out-of-place nodes. */
  order?: boolean;
}

/**
 * Keyed append / patch / remove (+ optional reorder) over a stable-keyed list. New keys are
 * built + appended; vanished keys are removed; surviving keys are patched in place. An
 * unchanged re-render appends nothing, recreates nothing (and, with `order`, moves nothing).
 * The container is assumed to hold ONLY nodes this call manages (no foreign siblings).
 */
export function reconcileList<T>(
  container: HTMLElement,
  items: readonly T[],
  opts: ReconcileOpts<T>,
): void {
  let map = rendered.get(container);
  if (!map) {
    map = new Map<string, HTMLElement>();
    rendered.set(container, map);
  }
  // 1. drop nodes whose key is no longer wanted (leaves a genuinely-empty container when the
  //    list empties — the FB-72 ghost-box contract: no orphan node keeps a slice revealed).
  const wanted = new Set<string>();
  for (const item of items) wanted.add(opts.key(item));
  for (const [k, node] of map) {
    if (!wanted.has(k)) {
      node.remove();
      map.delete(k);
    }
  }
  // 2. build new nodes (once), patch every node in place.
  for (const item of items) {
    const k = opts.key(item);
    let node = map.get(k);
    if (!node) {
      node = opts.build(item);
      map.set(k, node);
      container.append(node);
    }
    opts.patch?.(node, item);
  }
  // 3. optional reorder — walk desired order from the END, moving a node only when it isn't
  //    already in front of its successor (so a settled, correctly-ordered list moves nothing).
  if (opts.order) {
    let ref: ChildNode | null = null;
    for (let i = items.length - 1; i >= 0; i--) {
      const node = map.get(opts.key(items[i]!));
      if (!node) continue;
      if (node.nextSibling !== ref) container.insertBefore(node, ref);
      ref = node;
    }
  }
}

/**
 * Forget a container's key→node bookkeeping. Call this AFTER a caller force-clears the container's
 * DOM itself (`container.textContent = ''`) OUTSIDE `reconcileList` — otherwise the map holds keys
 * pointing at now-detached nodes, and the next `reconcileList` would patch (not re-append) them,
 * silently dropping content. Needed only for a container that a reconcile path SHARES with a
 * wholesale-clear path (e.g. the log lines, shared by the Now view and the filter-switch teardown).
 */
export function resetReconcile(container: HTMLElement): void {
  rendered.delete(container);
}

/** Set a node's text only if it changed — idempotent, no mutation when equal. */
export function setText(el: HTMLElement, text: string): void {
  if (el.textContent !== text) el.textContent = text;
}

/** Visibility gate that never rebuilds — mirrors the intro's `showPanel` `hidden` flip. */
export function toggle(el: HTMLElement, on: boolean): void {
  if (el.hidden === on) el.hidden = !on;
}

/** Add/remove a class only when it would actually change (no attribute re-write when equal). */
export function setClass(el: HTMLElement, name: string, on: boolean): void {
  if (el.classList.contains(name) !== on) el.classList.toggle(name, on);
}

/** Set a node's hover title only on a real change; `''` REMOVES it (an empty `title=""` still
 *  suppresses an inherited tooltip, so clearing must mean absent, not blank). */
export function setTitle(el: HTMLElement, title: string): void {
  if (title === '') {
    if (el.hasAttribute('title')) el.removeAttribute('title');
    return;
  }
  if (el.title !== title) el.title = title;
}

/** Set a form control's `disabled` only on a real change (guards the reflected attribute). */
export function setDisabled(el: HTMLButtonElement | HTMLInputElement, on: boolean): void {
  if (el.disabled !== on) el.disabled = on;
}

/** Set an inline style property only on a real change — keeps CSS transitions (e.g. meter
 *  `width`) alive by writing a fresh value ONLY when it moved, never re-stamping an equal one. */
export function setStyle(el: HTMLElement, prop: string, value: string): void {
  if (el.style.getPropertyValue(prop) !== value) el.style.setProperty(prop, value);
}
