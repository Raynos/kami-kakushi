// @vitest-environment jsdom
//
// Drives the capture overlay through the REAL DOM flow — a genuine Backquote (→ PICK mode), a
// pick-click, typing, a ⌘/Ctrl+Enter submit — with an injected POST + snapshotter + session id.
// jsdom's elementFromPoint returns null, so we stub it to choose the picked element.
// RED-able: if pick mode stopped opening on `, the element stopped flowing into the entry, the
// note stopped reaching the POST, or captures stopped sharing one session file, an assert flips red.
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mountCapture, CAPTURE_SENTINEL, type CaptureEntryContext } from './capture';

const SESSION = '2026-07-04T21-53-00-testid';

function baseCtx(): CaptureEntryContext {
  return {
    seed: 20260626,
    clock: { day: 1, tick: 2 },
    location: 'home-paddies',
    rung: 'R1',
    tier: 0,
    activeTab: 'work',
    variants: {},
    viewport: { w: 1728, h: 1117, dpr: 2 },
    url: '/',
    saveBase64: 'SAVE==',
    logTail: [],
  };
}

const flush = (): Promise<void> => new Promise((r) => setTimeout(r, 0));
const boxEl = (): HTMLElement | null => document.querySelector('[data-kami-capture]');
const highlightEl = (): HTMLElement | null => document.querySelector('[data-kami-highlight]');
const hotkey = (target: EventTarget = document): void => {
  target.dispatchEvent(new KeyboardEvent('keydown', { code: 'Backquote', bubbles: true }));
};

/** Enter pick mode, then press — with elementFromPoint stubbed to `el` (null ⇒ a general note).
 *  Pick fires on pointerdown (mousedown is suppressed when an element preventDefaults pointerdown;
 *  a hover popover also eats the follow-up click), so drive pointerdown. */
function pick(el: HTMLElement | null): void {
  hotkey();
  document.elementFromPoint = (): Element | null => el;
  document.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true, clientX: 5, clientY: 5 }));
}
async function typeAndSend(note: string): Promise<void> {
  const ta = boxEl()!.querySelector('textarea')!;
  ta.value = note;
  ta.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', ctrlKey: true, bubbles: true }));
  await flush();
}

interface Post {
  url: string;
  body: {
    session: string;
    header: string;
    entry: string;
    screenshot?: string;
    screenshotName?: string;
  };
}
let unmount: () => void = () => {};
let host: HTMLElement;
let posts: Post[];

function mount(over: Partial<Parameters<typeof mountCapture>[0]> = {}): void {
  posts = [];
  unmount = mountCapture({
    host,
    build: { version: 'v0.3.5', sha: 'abc1234', date: '2026-07-03' },
    buildContext: baseCtx,
    now: () => new Date('2026-07-04T21:53:00Z'),
    sessionId: SESSION,
    post: async (url, body) => {
      posts.push({ url, body: JSON.parse(body) });
      return true;
    },
    ...over,
  });
}

beforeEach(() => {
  document.body.innerHTML = '';
  document.elementFromPoint = (): Element | null => null; // jsdom default
  host = document.createElement('div');
  host.id = 'app';
  document.body.appendChild(host);
});
afterEach(() => unmount());

describe('mountCapture — pick mode', () => {
  it('Backquote enters pick (highlight, no box yet); a pick-click opens the box', () => {
    mount();
    expect(highlightEl()).toBeNull();
    expect(boxEl()).toBeNull();
    hotkey();
    expect(highlightEl()).not.toBeNull(); // pick highlight mounted
    expect(boxEl()).toBeNull(); // box only after a press
    document.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }));
    expect(boxEl()!.dataset.kamiCapture).toBe(CAPTURE_SENTINEL);
  });

  it('is inert while focused in an input (no pick mode)', () => {
    mount();
    const input = document.createElement('input');
    document.body.appendChild(input);
    hotkey(input);
    expect(highlightEl()).toBeNull();
  });

  it('Escape during pick cancels (no highlight, no box)', () => {
    mount();
    hotkey();
    expect(highlightEl()).not.toBeNull();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(highlightEl()).toBeNull();
    expect(boxEl()).toBeNull();
  });

  it('picking an element tags the box and flows the descriptor into the entry', async () => {
    mount();
    const btn = document.createElement('button');
    btn.textContent = 'Rake rice';
    host.appendChild(btn);
    pick(btn);
    expect(boxEl()!.textContent).toContain('button "Rake rice"');
    await typeAndSend('this button is off-centre');
    expect(posts[0]!.body.entry).toContain('**Element:** button "Rake rice"');
    expect(posts[0]!.body.entry).toContain('this button is off-centre');
  });

  it('clicking empty makes a general note (no Element line)', async () => {
    mount();
    pick(null); // elementFromPoint → null
    expect(boxEl()!.textContent).not.toContain('▸');
    await typeAndSend('general pacing note');
    expect(posts[0]!.body.entry).not.toContain('**Element:**');
    expect(posts[0]!.body.entry).toContain('general pacing note');
  });
});

describe('mountCapture — drag/resize window', () => {
  const RECT = {
    left: 900,
    top: 600,
    right: 1260,
    bottom: 800,
    width: 360,
    height: 200,
    x: 900,
    y: 600,
    toJSON: () => ({}),
  } as DOMRect;

  it('the box is resizable and drags to move (grab anywhere but the textarea)', () => {
    mount();
    pick(null);
    const el = boxEl()!;
    expect(el.style.resize).toBe('both'); // resizable window
    el.getBoundingClientRect = () => RECT; // jsdom has no layout — stub the rect
    el.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true, clientX: 950, clientY: 620 }));
    document.dispatchEvent(
      new MouseEvent('pointermove', { bubbles: true, clientX: 850, clientY: 700 }),
    );
    expect(el.style.left).toBe('800px'); // 900 + (850 - 950)
    expect(el.style.top).toBe('680px'); // 600 + (700 - 620)
    document.dispatchEvent(new MouseEvent('pointerup', { bubbles: true }));
  });

  it('does not drag when the grab starts on the textarea (typing/selection preserved)', () => {
    mount();
    pick(null);
    const el = boxEl()!;
    el.getBoundingClientRect = () => RECT;
    const before = el.style.left;
    el.querySelector('textarea')!.dispatchEvent(
      new MouseEvent('pointerdown', { bubbles: true, clientX: 950, clientY: 700 }),
    );
    document.dispatchEvent(
      new MouseEvent('pointermove', { bubbles: true, clientX: 850, clientY: 700 }),
    );
    expect(el.style.left).toBe(before); // unchanged
  });

  it('remembers the size/position for the next capture in the session', () => {
    mount();
    pick(null);
    const el1 = boxEl()!;
    el1.getBoundingClientRect = () =>
      ({ ...RECT, left: 400, top: 300, width: 500, height: 340 }) as DOMRect;
    // close (Escape) — closeBox reads the rect and stores it
    el1
      .querySelector('textarea')!
      .dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    // reopen — should restore the remembered left/top/size
    pick(null);
    const el2 = boxEl()!;
    expect(el2.style.left).toBe('400px');
    expect(el2.style.width).toBe('500px');
  });
});

describe('mountCapture — submit', () => {
  it('posts session + header + entry, and closes the box', async () => {
    mount();
    pick(null);
    await typeAndSend('the open-eyes button sits off centre');
    expect(posts).toHaveLength(1);
    expect(posts[0]!.url).toBe('/__playtest-capture');
    expect(posts[0]!.body.session).toBe(SESSION);
    expect(posts[0]!.body.header).toContain('# Playtest session');
    expect(posts[0]!.body.entry).toContain('the open-eyes button sits off centre');
    expect(boxEl()).toBeNull();
  });

  it('all captures in one mount share the SAME session id (→ one file)', async () => {
    mount();
    pick(null);
    await typeAndSend('first');
    pick(null);
    await typeAndSend('second');
    expect(posts).toHaveLength(2);
    expect(posts[0]!.body.session).toBe(posts[1]!.body.session);
  });

  it('flows an injected screenshot into the POST + references it in the entry', async () => {
    const png =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    mount({ snapshot: async () => png });
    pick(null);
    await typeAndSend('glitch');
    expect(posts[0]!.body.screenshot).toBe(png);
    expect(posts[0]!.body.entry).toContain(`${SESSION}/`);
  });

  it('a failed POST falls back to a file download (no throw)', async () => {
    const origCreate = URL.createObjectURL;
    const origRevoke = URL.revokeObjectURL;
    URL.createObjectURL = () => 'blob:mock';
    URL.revokeObjectURL = () => {};
    try {
      let downloaded = '';
      mount({ post: async () => false });
      const origClick = HTMLAnchorElement.prototype.click;
      HTMLAnchorElement.prototype.click = function (this: HTMLAnchorElement) {
        downloaded = this.download;
      };
      try {
        pick(null);
        await typeAndSend('offline note');
        expect(downloaded).toContain(SESSION);
        await flush();
      } finally {
        HTMLAnchorElement.prototype.click = origClick;
      }
    } finally {
      URL.createObjectURL = origCreate;
      URL.revokeObjectURL = origRevoke;
    }
  });
});
