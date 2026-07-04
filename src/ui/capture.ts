// DEV-only in-game playtest capture overlay (F3 Ph2). A `` ` `` hotkey pops a small ink-dark
// note box; ⌘/Ctrl+Enter POSTs a self-contained capture to the dev-server inbox endpoint
// (src/scripts/playtest-inbox.ts) and vanishes; Escape cancels. Target flow: hotkey → type →
// send, < 5 s, the game never pauses. The evidence (game context + optional screenshot) is
// frozen at box-OPEN (§2.1), so typing time never drifts it.
//
// DEV-ONLY: mounted only from main.ts's `import.meta.env.DEV` branch and stamped with
// CAPTURE_SENTINEL, so the ship-hygiene gate (verify-dev-strip.sh) proves it — and its
// injected screenshot rasteriser — are stripped from the prod bundle.
//
// This module is dependency-free by design: the DOM→PNG snapshotter is INJECTED (the real
// modern-screenshot impl is wired in at the main.ts mount), so the overlay stays fully
// unit-testable in jsdom with a stubbed snapshotter + POST.

import { buildCapture, CAPTURE_ENDPOINT, type CaptureContext } from './capture-format';

/** Bundle marker: stamped on the box node so verify-dev-strip.sh can prove the overlay is
 *  absent from prod (it greps dist for this literal). */
export const CAPTURE_SENTINEL = '__KAMI_PLAYTEST_CAPTURE__';

/** The capture hotkey — Backquote (`` ` ``): free in-game (only Esc/Tab are bound), no browser
 *  default, one keystroke on macOS. A single constant for a one-line human override. */
const HOTKEY = 'Backquote';

const TOAST_MS = 1600;

/** DOM→PNG data URL, or null when no shot is available. Injected so this module carries no
 *  rasteriser dependency (the real one lands with the main.ts mount, §2.3). */
export type DomSnapshotter = (el: HTMLElement) => Promise<string | null>;

/** The at-OPEN context minus the two fields the overlay fills itself (`capturedAt`, frozen at
 *  open here; `hasScreenshot`, known only after the shot resolves). main.ts supplies this,
 *  closing over live state / save / dev. */
export type CaptureBaseContext = Omit<CaptureContext, 'capturedAt' | 'hasScreenshot'>;

export interface CaptureOptions {
  /** Where the toast mounts, and the element rasterised for the screenshot (the #app root). */
  readonly host: HTMLElement;
  /** Freeze the game context at box-OPEN. Closes over live state (main.ts). */
  readonly buildContext: () => CaptureBaseContext;
  /** DOM→PNG snapshotter; omitted ⇒ no screenshot (the real impl is injected at the mount). */
  readonly snapshot?: DomSnapshotter;
  /** POST transport → did the write succeed? Injectable for tests; defaults to fetch. */
  readonly post?: (url: string, body: string) => Promise<boolean>;
  /** Clock, injectable for deterministic tests; defaults to `() => new Date()`. */
  readonly now?: () => Date;
  /** Document, injectable for tests; defaults to the global `document`. */
  readonly doc?: Document;
}

/** ISO-8601 with the LOCAL offset (e.g. 2026-07-04T21:53:00+0200) — the human's wall-clock
 *  moment, and a shape stampOf() turns into a filename-safe stamp. */
function localIso(d: Date): string {
  const pad = (n: number): string => String(n).padStart(2, '0');
  const offMin = -d.getTimezoneOffset(); // minutes east of UTC
  const sign = offMin >= 0 ? '+' : '-';
  const oh = pad(Math.floor(Math.abs(offMin) / 60));
  const om = pad(Math.abs(offMin) % 60);
  return (
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` +
    `T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}${sign}${oh}${om}`
  );
}

function isEditableTarget(t: EventTarget | null): boolean {
  if (!(t instanceof HTMLElement)) return false;
  const tag = t.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || t.isContentEditable;
}

/** Mount the capture overlay. Returns an unmount fn (removes the listener + any open box). */
export function mountCapture(opts: CaptureOptions): () => void {
  const doc = opts.doc ?? document;
  const now = opts.now ?? ((): Date => new Date());
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

  interface OpenBox {
    readonly el: HTMLElement;
    readonly textarea: HTMLTextAreaElement;
    readonly capturedAt: string;
    readonly base: CaptureBaseContext;
    readonly shot: Promise<string | null>;
  }
  let box: OpenBox | null = null;

  function closeBox(): void {
    box?.el.remove();
    box = null;
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
    opts.host.appendChild(t);
    setTimeout(() => t.remove(), TOAST_MS);
  }

  function downloadFallback(filename: string, markdown: string): void {
    // POST failed (server hiccup) — offer the same markdown as a file the human drops into
    // pending/ later. Zero dependencies; the screenshot is git-ignored anyway, so .md only.
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
    const { capturedAt, base, textarea } = box;
    const note = textarea.value;
    const shot = await box.shot;
    closeBox();

    const ctx: CaptureContext = { ...base, capturedAt, hasScreenshot: shot !== null };
    const { filename, markdown } = buildCapture(note, ctx);
    const payload = shot ? { filename, markdown, screenshot: shot } : { filename, markdown };
    const ok = await post(CAPTURE_ENDPOINT, JSON.stringify(payload));
    if (ok) toast('captured → inbox');
    else {
      downloadFallback(filename, markdown);
      toast('inbox unreachable — saved to a file, drop it in pending/');
    }
  }

  function openBox(): void {
    if (box) return; // one at a time
    // Freeze the evidence AT OPEN — the hotkey marks the moment you saw it.
    const capturedAt = localIso(now());
    const base = opts.buildContext();
    const shot: Promise<string | null> = opts.snapshot
      ? opts.snapshot(opts.host).catch(() => null)
      : Promise.resolve(null);

    const el = doc.createElement('div');
    el.dataset.kamiCapture = CAPTURE_SENTINEL; // strip-gate marker
    el.style.cssText =
      'position:fixed;right:1rem;bottom:1rem;z-index:2147483646;width:min(360px,90vw);' +
      'box-sizing:border-box;background:#26221E;color:#F3E9D2;border:1px solid #7A6C59;' +
      'border-radius:4px;padding:.75rem;box-shadow:0 2px 0 #00000030, 0 14px 34px #00000066;' +
      "font:0.9rem/1.4 'Hiragino Mincho ProN','Yu Mincho',serif;";

    const textarea = doc.createElement('textarea');
    textarea.rows = 3;
    textarea.placeholder = 'What did you notice?';
    textarea.style.cssText =
      'width:100%;box-sizing:border-box;resize:vertical;background:#1A1713;color:#F3E9D2;' +
      'border:1px solid #7A6C59;border-radius:3px;padding:.5rem;font:inherit;outline:none;';

    const hint = doc.createElement('div');
    hint.textContent = '⌘/Ctrl+Enter send · Esc cancel';
    hint.style.cssText = 'margin-top:.4rem;font-size:0.72rem;color:#B8A98C;text-align:right;';

    textarea.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        void submit();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        closeBox();
      }
    });

    el.append(textarea, hint);
    doc.body.appendChild(el);
    textarea.focus();
    box = { el, textarea, capturedAt, base, shot };
  }

  function onKeyDown(e: KeyboardEvent): void {
    if (e.code !== HOTKEY) return;
    // Ignore while typing in a field (the save-import textarea, the note box itself) — there
    // the backtick is a character, not a toggle.
    if (isEditableTarget(e.target)) return;
    e.preventDefault();
    if (box) closeBox();
    else openBox();
  }

  doc.addEventListener('keydown', onKeyDown);
  return (): void => {
    doc.removeEventListener('keydown', onKeyDown);
    closeBox();
  };
}
