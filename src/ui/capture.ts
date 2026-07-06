// DEV-only in-game playtest capture overlay (FB-3). Press `` ` `` to enter PICK mode — hover
// highlights the element under the cursor, click LOCKS it (or click empty / Esc for a general
// note), then a small ink-dark note box opens; ⌘/Ctrl+Enter APPENDS the capture to this game
// session's file and vanishes. The full-page screenshot is taken with the highlight still on, so
// the shot shows the whole page AND which element you meant. Evidence is frozen at PICK (§2.1).
// All captures from one session (browser tab; the id survives a reload) land in ONE file
// `pending/<session>.md`, screenshots in `pending/<session>/`.
//
// DEV-ONLY: mounted only from main.ts's `import.meta.env.DEV` branch and stamped with
// CAPTURE_SENTINEL, so verify-dev-strip.sh proves it — and its injected screenshot rasteriser —
// are stripped from prod.
//
// Dependency-free by design: the DOM→PNG snapshotter is INJECTED, so the overlay stays fully
// unit-testable in jsdom with a stubbed snapshotter + POST.

import {
  buildEntry,
  buildSessionHeader,
  mintSessionId,
  CAPTURE_ENDPOINT,
  type CaptureBuild,
  type CaptureContext,
  type ElementDescriptor,
} from './capture-format';

/** Bundle marker: stamped on our nodes so verify-dev-strip.sh can prove the overlay is absent
 *  from prod (it greps dist for this literal). */
export const CAPTURE_SENTINEL = '__KAMI_PLAYTEST_CAPTURE__';

/** The capture hotkey — Backquote (`` ` ``): free in-game, no browser default, one macOS keystroke.
 *  A single constant for a one-line human override. */
const HOTKEY = 'Backquote';
const TOAST_MS = 1600;
const SESSION_KEY = 'kami-capture-session';

/** DOM→PNG data URL, or null when no shot is available. Injected (the real impl lands at the mount). */
export type DomSnapshotter = (el: HTMLElement) => Promise<string | null>;

/** The per-capture context minus the fields the overlay fills itself (`capturedAt`, frozen at
 *  pick; `hasScreenshot`, known after the shot; `element`, from the pick). main.ts supplies this. */
export type CaptureEntryContext = Omit<CaptureContext, 'capturedAt' | 'hasScreenshot' | 'element'>;

export interface CaptureOptions {
  /** Where the toast/highlight mount, and the element rasterised for the screenshot (the #app root). */
  readonly host: HTMLElement;
  /** Session-level build stamp (constant for the session; goes in the file header). */
  readonly build: CaptureBuild;
  /** Freeze the per-capture game context at pick. Closes over live state (main.ts). */
  readonly buildContext: () => CaptureEntryContext;
  /** DOM→PNG snapshotter; omitted ⇒ no screenshot (the real impl is injected at the mount). */
  readonly snapshot?: DomSnapshotter;
  /** POST transport → did the write succeed? Injectable for tests; defaults to fetch. */
  readonly post?: (url: string, body: string) => Promise<boolean>;
  /** Clock, injectable for deterministic tests; defaults to `() => new Date()`. */
  readonly now?: () => Date;
  /** Document, injectable for tests; defaults to the global `document`. */
  readonly doc?: Document;
  /** Session id, injectable for tests; else minted (sessionStorage-backed). */
  readonly sessionId?: string;
  /** sessionStorage, injectable for tests; else the global `sessionStorage` (undefined if absent). */
  readonly storage?: Storage;
}

/** ISO-8601 with the LOCAL offset (e.g. 2026-07-04T21:53:00+0200) — the human's wall-clock moment. */
function localIso(d: Date): string {
  const pad = (n: number): string => String(n).padStart(2, '0');
  const offMin = -d.getTimezoneOffset();
  const sign = offMin >= 0 ? '+' : '-';
  const oh = pad(Math.floor(Math.abs(offMin) / 60));
  const om = pad(Math.abs(offMin) % 60);
  return (
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` +
    `T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}${sign}${oh}${om}`
  );
}

function randomToken(): string {
  try {
    const a = new Uint8Array(4);
    globalThis.crypto.getRandomValues(a);
    return Array.from(a, (b) => b.toString(16).padStart(2, '0')).join('');
  } catch {
    return 'x';
  }
}

function resolveSession(
  opts: CaptureOptions,
  now: () => Date,
  storage: Storage | undefined,
): { sessionId: string; startedAt: string } {
  if (opts.sessionId) return { sessionId: opts.sessionId, startedAt: localIso(now()) };
  try {
    const raw = storage?.getItem(SESSION_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as { id?: unknown; startedAt?: unknown };
      if (typeof parsed.id === 'string' && typeof parsed.startedAt === 'string') {
        return { sessionId: parsed.id, startedAt: parsed.startedAt };
      }
    }
  } catch {
    /* ignore corrupt storage — mint fresh below */
  }
  const startedAt = localIso(now());
  const sessionId = mintSessionId(startedAt, randomToken());
  try {
    storage?.setItem(SESSION_KEY, JSON.stringify({ id: sessionId, startedAt }));
  } catch {
    /* storage may be unavailable — the id still works for this mount */
  }
  return { sessionId, startedAt };
}

function isEditableTarget(t: EventTarget | null): boolean {
  if (!(t instanceof HTMLElement)) return false;
  const tag = t.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || t.isContentEditable;
}

/** A short best-effort CSS-ish path (stops at #app or a data-panel/data-node anchor). */
function cssPath(el: HTMLElement): string {
  const parts: string[] = [];
  let cur: HTMLElement | null = el;
  let depth = 0;
  while (cur && cur.id !== 'app' && depth < 4) {
    let part = cur.tagName.toLowerCase();
    if (cur.dataset.panel) {
      parts.unshift(`${part}[data-panel=${cur.dataset.panel}]`);
      break;
    }
    if (cur.dataset.node) {
      parts.unshift(`${part}[data-node=${cur.dataset.node}]`);
      break;
    }
    const parent: HTMLElement | null = cur.parentElement;
    if (parent) {
      const sibs = Array.from(parent.children).filter((c) => c.tagName === cur!.tagName);
      if (sibs.length > 1) part += `:nth-of-type(${sibs.indexOf(cur) + 1})`;
    }
    parts.unshift(part);
    cur = parent;
    depth++;
  }
  return parts.join(' > ') || el.tagName.toLowerCase();
}

/** Describe the picked element — prefer the game's own semantic hooks over a brittle path. */
function describeElement(el: HTMLElement): ElementDescriptor {
  const r = el.getBoundingClientRect();
  const rect = {
    x: Math.round(r.x),
    y: Math.round(r.y),
    w: Math.round(r.width),
    h: Math.round(r.height),
  };
  const text = (el.textContent ?? '').replace(/\s+/g, ' ').trim().slice(0, 60);

  const btn = el.closest('button, [role="button"]');
  const node = el.closest<HTMLElement>('[data-node]');
  const panel = el.closest<HTMLElement>('[data-panel]');
  const aria = el.getAttribute('aria-label');
  let label: string;
  if (btn) {
    label = `button "${(btn.textContent ?? '').replace(/\s+/g, ' ').trim().slice(0, 40)}"`;
  } else if (node) {
    label = `map node "${node.dataset.node}"`;
  } else if (panel) {
    label = `panel "${panel.dataset.panel}"`;
  } else if (aria) {
    label = `${el.tagName.toLowerCase()} "${aria}"`;
  } else {
    const cls = typeof el.className === 'string' ? el.className.split(/\s+/)[0] : '';
    label = el.tagName.toLowerCase() + (cls ? `.${cls}` : '');
  }
  return { label, text, selector: cssPath(el), rect };
}

/** Mount the capture overlay. Returns an unmount fn (removes listeners + any open box/highlight). */
export function mountCapture(opts: CaptureOptions): () => void {
  const doc = opts.doc ?? document;
  const now = opts.now ?? ((): Date => new Date());
  const storage =
    opts.storage ?? (typeof sessionStorage !== 'undefined' ? sessionStorage : undefined);
  const post =
    opts.post ??
    (async (url: string, body: string): Promise<boolean> => {
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body,
        });
        return res.ok;
      } catch {
        return false;
      }
    });

  const host = opts.host;
  const session = resolveSession(opts, now, storage);
  const header = buildSessionHeader({
    sessionId: session.sessionId,
    startedAt: session.startedAt,
    build: opts.build,
  });

  // The pick highlight — a child of `host` so it rides INTO the domToPng(host) screenshot
  // (vermilion box, pointer-events:none so it never intercepts elementFromPoint).
  const highlight = doc.createElement('div');
  highlight.dataset.kamiHighlight = '1';
  highlight.style.cssText =
    'position:fixed;z-index:2147483645;pointer-events:none;display:none;box-sizing:border-box;' +
    'border:2px solid #D7402C;background:#D7402C22;border-radius:2px;box-shadow:0 0 0 1px #26221E;';

  let hint: HTMLElement | null = null;
  let picking = false;

  interface OpenBox {
    readonly el: HTMLElement;
    readonly textarea: HTMLTextAreaElement;
    readonly capturedAt: string;
    readonly base: CaptureEntryContext;
    readonly shot: Promise<string | null>;
    readonly element: ElementDescriptor | null;
  }
  let box: OpenBox | null = null;
  // Remembered box position + size (the human can drag/resize the feedback window; the size
  // persists across captures in the session so a "lots of feedback" size sticks).
  let boxRect: { left: number; top: number; width: number; height: number } | null = null;

  function positionHighlight(el: HTMLElement): void {
    const r = el.getBoundingClientRect();
    highlight.style.left = `${r.x}px`;
    highlight.style.top = `${r.y}px`;
    highlight.style.width = `${r.width}px`;
    highlight.style.height = `${r.height}px`;
    highlight.style.display = 'block';
  }

  function elementUnder(e: MouseEvent): HTMLElement | null {
    const el = doc.elementFromPoint(e.clientX, e.clientY);
    return el instanceof HTMLElement ? el : null;
  }

  function showHint(): void {
    hint = doc.createElement('div');
    hint.textContent = 'click the element you mean · Esc / click empty for a general note';
    hint.style.cssText =
      'position:fixed;left:50%;top:1rem;transform:translateX(-50%);z-index:2147483646;' +
      'pointer-events:none;background:#26221E;color:#F3E9D2;border:1px solid #7A6C59;' +
      "border-radius:3px;padding:.4rem .9rem;font:0.8rem/1.4 'Hiragino Mincho ProN',serif;";
    doc.body.appendChild(hint);
  }
  function hideHint(): void {
    hint?.remove();
    hint = null;
  }

  function enterPick(): void {
    picking = true;
    host.appendChild(highlight);
    showHint();
    doc.addEventListener('mousemove', onPickMove, true);
    // Pick on POINTERDOWN, not click OR mousedown. `click` never fires when a hover popover /
    // per-tick re-render changes the target between press and release. And `mousedown` is
    // suppressed entirely when an element preventDefault()s its `pointerdown` (the browser then
    // cancels the compatibility mouse events) — which the rung meter does, so a mousedown listener
    // silently never fired on it. `pointerdown` fires on press for mouse/touch/pen and reaches
    // document regardless, so it's the robust choice.
    doc.addEventListener('pointerdown', onPickDown, true);
  }
  function exitPickListeners(): void {
    picking = false;
    doc.removeEventListener('mousemove', onPickMove, true);
    doc.removeEventListener('pointerdown', onPickDown, true);
    hideHint();
  }
  function cancelPick(): void {
    exitPickListeners();
    highlight.remove();
  }
  function onPickMove(e: MouseEvent): void {
    const el = elementUnder(e);
    if (el) positionHighlight(el);
  }
  // Swallow the click that follows our pick-pointerdown so the game never acts on it (e.g. a rung
  // meter doesn't open its beat). Belt-and-suspenders — preventDefault() on the pointerdown already
  // suppresses the compatibility click in most browsers. Self-removes on the first click or timeout.
  function swallowNextClick(e: MouseEvent): void {
    e.preventDefault();
    e.stopImmediatePropagation();
    doc.removeEventListener('click', swallowNextClick, true);
  }
  function onPickDown(e: MouseEvent): void {
    e.preventDefault();
    e.stopImmediatePropagation(); // do NOT let the game receive this press
    const el = elementUnder(e);
    exitPickListeners();
    doc.addEventListener('click', swallowNextClick, true);
    setTimeout(() => doc.removeEventListener('click', swallowNextClick, true), 400);
    if (el) {
      positionHighlight(el); // lock it — stays on (with any hover popover) for the screenshot
      openBox(describeElement(el));
    } else {
      highlight.remove();
      openBox(null); // pressed empty → a general whole-page note
    }
  }

  function closeBox(): void {
    if (box) {
      // Remember where/how big the human left the window, so the next capture reopens the same.
      const r = box.el.getBoundingClientRect();
      boxRect = { left: r.left, top: r.top, width: r.width, height: r.height };
      box.el.remove();
    }
    box = null;
    highlight.remove(); // clear the locked highlight
  }

  /** Drag the WHOLE feedback window (grab it anywhere) to move it and see what's underneath.
   *  Skips the textarea (so typing/selection still works) and the bottom-right resize grip.
   *  Pointer-based so it works with mouse/touch/pen. */
  function startDrag(e: PointerEvent): void {
    if (!box) return;
    if (e.target instanceof HTMLTextAreaElement) return; // let the text area type/select
    const r = box.el.getBoundingClientRect();
    if (e.clientX > r.right - 22 && e.clientY > r.bottom - 22) return; // leave the resize grip alone
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const onMove = (ev: PointerEvent): void => {
      if (!box) return;
      box.el.style.left = `${r.left + (ev.clientX - startX)}px`;
      box.el.style.top = `${r.top + (ev.clientY - startY)}px`;
    };
    const onUp = (): void => {
      doc.removeEventListener('pointermove', onMove, true);
      doc.removeEventListener('pointerup', onUp, true);
    };
    doc.addEventListener('pointermove', onMove, true);
    doc.addEventListener('pointerup', onUp, true);
  }

  function toast(text: string): void {
    const t = doc.createElement('div');
    t.setAttribute('role', 'status');
    t.textContent = text;
    t.style.cssText =
      'position:fixed;left:50%;bottom:1.25rem;transform:translateX(-50%);z-index:2147483646;' +
      'background:#26221E;color:#F3E9D2;border:1px solid #7A6C59;border-radius:3px;' +
      "padding:.5rem 1rem;font:0.85rem/1.4 'Hiragino Mincho ProN','Yu Mincho',serif;" +
      'box-shadow:0 2px 0 #00000030, 0 10px 26px #00000055;';
    host.appendChild(t);
    setTimeout(() => t.remove(), TOAST_MS);
  }

  function downloadFallback(filename: string, markdown: string): void {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = doc.createElement('a');
    a.href = url;
    a.download = filename;
    doc.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }

  async function submit(): Promise<void> {
    if (!box) return;
    const { capturedAt, base, textarea, element } = box;
    const note = textarea.value;
    const shot = await box.shot;
    closeBox();

    const ctx: CaptureContext = {
      ...base,
      capturedAt,
      hasScreenshot: shot !== null,
      ...(element ? { element } : {}),
    };
    const { entry, metadataName, metadata, screenshotName } = buildEntry(
      note,
      ctx,
      session.sessionId,
    );
    const payload: Record<string, unknown> = {
      session: session.sessionId,
      header,
      entry,
      metadataName,
      metadata,
    };
    if (shot && screenshotName) {
      payload.screenshotName = screenshotName;
      payload.screenshot = shot;
    }
    const ok = await post(CAPTURE_ENDPOINT, JSON.stringify(payload));
    if (ok) toast('captured → inbox');
    else {
      downloadFallback(`${session.sessionId}-entry.md`, entry);
      toast('inbox unreachable — saved the entry to a file');
    }
  }

  function openBox(element: ElementDescriptor | null): void {
    if (box) return; // one at a time
    // Freeze the evidence at PICK — the highlight is already locked (in the shot), so snapshot now.
    const capturedAt = localIso(now());
    const base = opts.buildContext();
    const shot: Promise<string | null> = opts.snapshot
      ? opts.snapshot(host).catch(() => null)
      : Promise.resolve(null);

    const el = doc.createElement('div');
    el.dataset.kamiCapture = CAPTURE_SENTINEL; // strip-gate marker
    // A DRAGGABLE + RESIZABLE window: positioned by left/top (so `resize:both` grows toward the
    // bottom-right), sized from the remembered rect so a bigger window sticks across captures —
    // for when the human is giving a lot of feedback and wants a bigger text area.
    const view = doc.defaultView ?? (typeof window !== 'undefined' ? window : undefined);
    const vh = view?.innerHeight ?? 800;
    const w = boxRect?.width ?? 360;
    const h = boxRect?.height ?? 200;
    // Default to bottom-LEFT (human call); a remembered rect from a drag/resize still wins.
    const left = boxRect?.left ?? 16;
    const top = boxRect?.top ?? Math.max(8, vh - h - 16);
    el.style.cssText =
      `position:fixed;left:${left}px;top:${top}px;width:${w}px;height:${h}px;` +
      'z-index:2147483646;box-sizing:border-box;background:#26221E;color:#F3E9D2;' +
      'border:1px solid #7A6C59;border-radius:4px;box-shadow:0 2px 0 #00000030, 0 14px 34px #00000066;' +
      "font:0.9rem/1.4 'Hiragino Mincho ProN','Yu Mincho',serif;display:flex;flex-direction:column;" +
      'resize:both;overflow:hidden;min-width:280px;min-height:150px;max-width:96vw;max-height:88vh;' +
      'cursor:move;'; // grab anywhere on the chrome to move it
    // Drag the WHOLE panel (grab it anywhere but the textarea / resize grip) — see §startDrag.
    el.addEventListener('pointerdown', startDrag);

    // header — shows the picked element, or a general-note hint
    const bar = doc.createElement('div');
    bar.textContent = element ? `▸ ${element.label}` : 'Feedback note';
    bar.title = 'drag anywhere to move · drag the ↘ corner to resize';
    bar.style.cssText =
      'flex:0 0 auto;user-select:none;padding:.5rem .6rem;font-size:0.8rem;' +
      'color:#E4B24A;background:#1F1C18;border-bottom:1px solid #3A342C;overflow:hidden;' +
      'text-overflow:ellipsis;white-space:nowrap;';

    const textarea = doc.createElement('textarea');
    textarea.placeholder = element ? `What about "${element.label}"?` : 'What did you notice?';
    textarea.style.cssText =
      'flex:1 1 auto;width:100%;box-sizing:border-box;resize:none;background:#1A1713;' +
      'color:#F3E9D2;border:none;padding:.6rem;font:inherit;outline:none;cursor:text;';

    const hintLine = doc.createElement('div');
    hintLine.textContent = '⌘/Ctrl+Enter send · Esc cancel · drag to move · ↘ resize';
    hintLine.style.cssText =
      'flex:0 0 auto;padding:.35rem 1rem .35rem .6rem;font-size:0.72rem;color:#B8A98C;text-align:right;';

    textarea.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        void submit();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        closeBox();
      }
    });

    el.append(bar, textarea, hintLine);
    doc.body.appendChild(el);
    textarea.focus();
    box = { el, textarea, capturedAt, base, shot, element };
  }

  function onKeyDown(e: KeyboardEvent): void {
    if (picking && e.key === 'Escape') {
      e.preventDefault();
      cancelPick();
      return;
    }
    if (e.code !== HOTKEY) return;
    if (isEditableTarget(e.target)) return; // typing in a field ⇒ the backtick is a character
    e.preventDefault();
    if (box) closeBox();
    else if (picking) cancelPick();
    else enterPick();
  }

  doc.addEventListener('keydown', onKeyDown);
  return (): void => {
    doc.removeEventListener('keydown', onKeyDown);
    exitPickListeners();
    closeBox();
  };
}
