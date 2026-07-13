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
// The pick arms a one-shot capture-phase click swallow (eats the compatibility click that follows
// the pick pointerdown). Consume it before dispatching real button clicks in a test.
const clearSwallow = (): void =>
  void document.dispatchEvent(new MouseEvent('click', { bubbles: true }));
const boxEl = (): HTMLElement | null => document.querySelector('[data-kami-capture]');
const highlightEl = (): HTMLElement | null => document.querySelector('[data-kami-highlight]');
/** The "inbox unreachable" dialog, and a button inside it by label. */
const dialogEl = (): HTMLElement | null => document.querySelector('[data-kami-capture-error]');
const dlgBtn = (re: RegExp): HTMLButtonElement =>
  [...dialogEl()!.querySelectorAll('button')].find((b) => re.test(b.textContent ?? ''))!;

/** Run `body` with the anchor-download machinery stubbed; `onDownload` sees each `a.download`.
 *  jsdom has no URL.createObjectURL / anchor download, so both must be faked. */
async function withStubbedDownload(
  onDownload: (filename: string) => void,
  body: () => Promise<void>,
): Promise<void> {
  const origCreate = URL.createObjectURL;
  const origRevoke = URL.revokeObjectURL;
  const origClick = HTMLAnchorElement.prototype.click;
  URL.createObjectURL = (): string => 'blob:mock';
  URL.revokeObjectURL = (): void => {};
  HTMLAnchorElement.prototype.click = function (this: HTMLAnchorElement): void {
    onDownload(this.download);
  };
  try {
    await body();
  } finally {
    URL.createObjectURL = origCreate;
    URL.revokeObjectURL = origRevoke;
    HTMLAnchorElement.prototype.click = origClick;
  }
}
const hotkey = (target: EventTarget = document): void => {
  target.dispatchEvent(new KeyboardEvent('keydown', { code: 'Backquote', bubbles: true }));
};

/** Enter pick mode, then press — with elementFromPoint stubbed to `el` (null ⇒ a general note).
 *  Pick fires on pointerdown (mousedown is suppressed when an element preventDefaults pointerdown;
 *  a hover popover also eats the follow-up click), so drive pointerdown. */
function pick(el: Element | null): void {
  hotkey();
  document.elementFromPoint = (): Element | null => el;
  document.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true, clientX: 5, clientY: 5 }));
}
/** Name the bucket on the OPEN box. Mandatory since FB-217 — a capture with no bucket is refused. */
function setBucket(name: string): void {
  const g = boxEl()!.querySelector('[data-kami-group]') as HTMLInputElement;
  g.value = name;
  g.dispatchEvent(new Event('input', { bubbles: true }));
}
/** Send a note. `bucket: null` deliberately skips naming one — the FB-217 refusal path. */
async function typeAndSend(note: string, bucket: string | null = 'feedback ui'): Promise<void> {
  if (bucket !== null) setBucket(bucket);
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
/** The mounted overlay's liveness probe — the shell's freeze watchdog asks exactly this. */
let captureActive: () => boolean = () => false;
let host: HTMLElement;
let posts: Post[];

function mount(over: Partial<Parameters<typeof mountCapture>[0]> = {}): void {
  posts = [];
  const handle = mountCapture({
    host,
    build: { version: 'v0.3.5', sha: 'abc1234', date: '2026-07-03' },
    buildContext: baseCtx,
    now: () => new Date('2026-07-04T21:53:00Z'),
    sessionId: SESSION,
    // Submit waits for a real paint before rasterising (FB-218/FB-219). jsdom's rAF would push every
    // `await typeAndSend(...)` past its flush, so tests run the hook straight through; what the hook
    // is FOR — ordering the box's disappearance ahead of the ~600ms shot — is asserted below.
    afterPaint: (fn) => fn(),
    post: async (url, body) => {
      posts.push({ url, body: JSON.parse(body) });
      return true;
    },
    ...over,
  });
  unmount = handle.unmount;
  captureActive = handle.active;
}

/** A stand-in for the shell freeze — records the freeze/thaw calls in order. `raw` is the real
 *  timer (nothing is patched in a unit test), so the overlay's own chrome behaves normally. */
function fakeFreeze(): {
  calls: string[];
  control: NonNullable<Parameters<typeof mountCapture>[0]['freeze']>;
} {
  const calls: string[] = [];
  return {
    calls,
    control: {
      freeze: () => void calls.push('freeze'),
      thaw: () => void calls.push('thaw'),
      raw: {
        setTimeout: (fn, ms) => setTimeout(fn, ms) as unknown as number,
        clearTimeout: (id) => clearTimeout(id),
      },
    },
  };
}

// jsdom ships no canvas backend, so `HTMLCanvasElement.getContext` raises a jsdomError. openBox()
// creates the markup pen's canvas on every pick, so that fired on most tests — and vitest counts it
// as an UNHANDLED ERROR, failing the whole run (and the pre-push gate, for every lane) even though
// all 1088 tests pass. capture.ts already tolerates a null 2D context: the pen degrades to
// stroke-recording, which the compositor tests stub anyway. So hand it null explicitly.
const realGetContext = HTMLCanvasElement.prototype.getContext;

beforeEach(() => {
  HTMLCanvasElement.prototype.getContext = (() => null) as typeof realGetContext;
  document.body.innerHTML = '';
  document.elementFromPoint = (): Element | null => null; // jsdom default
  host = document.createElement('div');
  host.id = 'app';
  document.body.appendChild(host);
});
afterEach(() => {
  unmount();
  HTMLCanvasElement.prototype.getContext = realGetContext;
});

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
    expect(posts[0]!.body.session).toBe('feedback-ui'); // keyed by the bucket (FB-217)
    expect(posts[0]!.body.header).toContain('# Playtest bucket');
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
    expect(posts[0]!.body.entry).toContain('feedback-ui/'); // the bucket's sidecar folder
  });

  it('bakes drawn markup into the screenshot via the injected compositor', async () => {
    const base = 'data:image/png;base64,BASE==';
    const composited = 'data:image/png;base64,COMPOSITED==';
    let seen: { base: string; strokes: readonly { x: number; y: number }[][] } | null = null;
    mount({
      snapshot: async () => base,
      composite: async (b, strokes) => {
        seen = { base: b, strokes: strokes as { x: number; y: number }[][] };
        return composited;
      },
    });
    pick(null);
    clearSwallow();
    const canvas = document.querySelector<HTMLCanvasElement>('[data-kami-markup]')!;
    expect(canvas).not.toBeNull();
    canvas.getBoundingClientRect = () =>
      ({
        left: 0,
        top: 0,
        width: 100,
        height: 100,
        right: 100,
        bottom: 100,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      }) as DOMRect;
    // enter draw mode, then draw one stroke (down → move → up)
    const btn = (re: RegExp): HTMLButtonElement =>
      [...boxEl()!.querySelectorAll('button')].find((b) => re.test(b.textContent ?? ''))!;
    btn(/Draw/).dispatchEvent(new MouseEvent('click', { bubbles: true }));
    canvas.dispatchEvent(
      new MouseEvent('pointerdown', { bubbles: true, clientX: 10, clientY: 12 }),
    );
    document.dispatchEvent(
      new MouseEvent('pointermove', { bubbles: true, clientX: 40, clientY: 50 }),
    );
    document.dispatchEvent(new MouseEvent('pointerup', { bubbles: true }));
    await typeAndSend('the CSS stick is right here');
    expect(seen).not.toBeNull();
    expect(seen!.base).toBe(base);
    expect(seen!.strokes).toHaveLength(1);
    expect(seen!.strokes[0]).toEqual([
      { x: 10, y: 12 },
      { x: 40, y: 50 },
    ]);
    expect(posts[0]!.body.screenshot).toBe(composited); // the baked shot, not the bare base
  });

  it('skips compositing when nothing was drawn (base shot passes through)', async () => {
    const base = 'data:image/png;base64,BASE==';
    let called = false;
    mount({
      snapshot: async () => base,
      composite: async (b) => {
        called = true;
        return `${b}X`;
      },
    });
    pick(null);
    await typeAndSend('no drawing, just words');
    expect(called).toBe(false);
    expect(posts[0]!.body.screenshot).toBe(base);
  });

  it('Undo/Clear gate on whether anything is drawn', () => {
    mount({ snapshot: async () => 'data:image/png;base64,BASE==' });
    pick(null);
    clearSwallow();
    const canvas = document.querySelector<HTMLCanvasElement>('[data-kami-markup]')!;
    canvas.getBoundingClientRect = () =>
      ({
        left: 0,
        top: 0,
        width: 100,
        height: 100,
        right: 100,
        bottom: 100,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      }) as DOMRect;
    const btn = (re: RegExp): HTMLButtonElement =>
      [...boxEl()!.querySelectorAll('button')].find((b) => re.test(b.textContent ?? ''))!;
    // nothing drawn yet → Undo/Clear disabled
    expect(btn(/Undo/).disabled).toBe(true);
    expect(btn(/Clear/).disabled).toBe(true);
    btn(/Draw/).dispatchEvent(new MouseEvent('click', { bubbles: true }));
    const stroke = (): void => {
      canvas.dispatchEvent(
        new MouseEvent('pointerdown', { bubbles: true, clientX: 5, clientY: 5 }),
      );
      document.dispatchEvent(new MouseEvent('pointerup', { bubbles: true }));
    };
    stroke();
    stroke();
    expect(btn(/Undo/).disabled).toBe(false);
    btn(/Undo/).dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(btn(/Undo/).disabled).toBe(false); // one stroke still left
    btn(/Clear/).dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(btn(/Undo/).disabled).toBe(true); // wiped
    expect(btn(/Clear/).disabled).toBe(true);
  });

  // A failed POST means the dev server is down (it used to kill itself on a config-dep edit). The
  // overlay must SAY so — never silently download a .md, which lands in ~/Downloads reading as
  // "captured" while the inbox stays empty. RED-able: restore the auto-download and #1 flips.
  it('a failed POST opens the error dialog and downloads NOTHING', async () => {
    let downloads = 0;
    await withStubbedDownload(
      () => (downloads += 1),
      async () => {
        mount({ post: async () => false });
        pick(null);
        await typeAndSend('offline note');
        expect(dialogEl()).not.toBeNull();
        expect(downloads).toBe(0);
        expect(dialogEl()!.textContent).toContain('Capture not saved');
      },
    );
  });

  it('Retry re-posts the held entry and closes the dialog once the server is back', async () => {
    const sent: string[] = [];
    let up = false; // the dev server comes back between the two attempts
    mount({
      post: async (_url, body) => {
        sent.push(body);
        return up;
      },
    });
    pick(null);
    await typeAndSend('note that survives');
    expect(dialogEl()).not.toBeNull();
    expect(sent).toHaveLength(1);

    up = true;
    clearSwallow(); // the pick armed a one-shot capture-phase click swallow
    dlgBtn(/Retry/).dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await flush();

    expect(dialogEl()).toBeNull(); // dismissed on success
    expect(sent).toHaveLength(2);
    expect(sent[1]).toBe(sent[0]); // the SAME payload, note intact — not a re-captured empty one
    expect(JSON.parse(sent[1]!).entry).toContain('note that survives');
  });

  it('Retry that fails again keeps the dialog and the note', async () => {
    mount({ post: async () => false });
    pick(null);
    await typeAndSend('still offline');
    clearSwallow();
    dlgBtn(/Retry/).dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await flush();
    expect(dialogEl()).not.toBeNull();
    expect(dialogEl()!.textContent).toContain('Still unreachable');
    expect(dlgBtn(/Retry/).disabled).toBe(false); // re-armed, not stuck on "Retrying…"
  });

  // FB-258 — "Save .md" is gone (human call). It was the only path that could strand a note in
  // ~/Downloads, where it reads as "captured" while the inbox stays empty.
  it('offers no way to write the note anywhere but the inbox', async () => {
    let downloaded = '';
    await withStubbedDownload(
      (name) => (downloaded = name),
      async () => {
        mount({ post: async () => false });
        pick(null);
        await typeAndSend('offline note');
        expect(dialogEl()).not.toBeNull();

        const labels = [...dialogEl()!.querySelectorAll('button')].map((b) => b.textContent);
        expect(labels).toEqual(['Retry', 'Copy note', 'Discard']);
        expect(dialogEl()!.textContent).not.toContain('Save');

        // and nothing downloads on its own, either
        clearSwallow();
        dlgBtn(/Discard/).dispatchEvent(new MouseEvent('click', { bubbles: true }));
        await flush();
        expect(downloaded).toBe('');
      },
    );
  });

  it('Escape discards the error dialog', async () => {
    mount({ post: async () => false });
    pick(null);
    await typeAndSend('offline note');
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(dialogEl()).toBeNull();
  });
});

describe('mountCapture — kind + bucket', () => {
  const kindBtn = (kind: string): HTMLButtonElement =>
    boxEl()!.querySelector(`button[data-kind="${kind}"]`) as HTMLButtonElement;
  const groupField = (): HTMLInputElement =>
    boxEl()!.querySelector('[data-kami-group]') as HTMLInputElement;
  const setGroup = (name: string): void => {
    const g = groupField();
    g.value = name;
    g.dispatchEvent(new Event('input', { bubbles: true }));
  };

  it('defaults to Bug, and keys the file by the bucket slug', async () => {
    mount();
    pick(null);
    await typeAndSend('a plain note', 'feedback ui');
    expect(posts[0]!.body.session).toBe('feedback-ui');
    expect(posts[0]!.body.header).toContain('# Playtest bucket — feedback ui');
    expect(posts[0]!.body.entry).toContain('## Bug ·');
  });

  // FB-217 — a bucket is required: an unbucketed note lands in a per-session file that
  // `/drain-inbox <bucket>` can never scope to, so it just sits there.
  it('refuses to send without a bucket, and says so where the caret is', async () => {
    mount();
    pick(null);
    await typeAndSend('a homeless note', null);

    expect(posts).toHaveLength(0); // nothing left the browser
    expect(boxEl()).not.toBeNull(); // …and the note is still there to fix
    const box = boxEl()!;
    expect(box.textContent).toContain('Name a bucket before sending');
    expect(document.activeElement).toBe(box.querySelector('[data-kami-group]'));
  });

  it('a bucket whose name is only whitespace is still no bucket', async () => {
    mount();
    pick(null);
    await typeAndSend('spaces are not a name', '   ');
    expect(posts).toHaveLength(0);
    expect(boxEl()).not.toBeNull();
  });

  it('naming the bucket clears the nag and lets the note through', async () => {
    mount();
    pick(null);
    await typeAndSend('second time lucky', null);
    expect(posts).toHaveLength(0);

    setBucket('dev tooling');
    expect(boxEl()!.textContent).not.toContain('Name a bucket before sending');
    const ta = boxEl()!.querySelector('textarea')!;
    ta.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', ctrlKey: true, bubbles: true }));
    await flush();
    expect(posts[0]!.body.session).toBe('dev-tooling');
    expect(posts[0]!.body.entry).toContain('second time lucky');
  });

  it('a refused send keeps the world frozen — the human is still writing the capture', async () => {
    const f = fakeFreeze();
    mount({ freeze: f.control });
    pick(null);
    await typeAndSend('no bucket yet', null);
    expect(f.calls).toEqual(['freeze']); // NOT thawed: the box is still open
  });

  it('Question kind + a bucket re-key the file and its header', async () => {
    mount();
    pick(null);
    clearSwallow(); // consume the pick-follow click swallow before clicking a control
    kindBtn('question').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    setGroup('Map feedback');
    await typeAndSend('the weir seal is faint', null); // keep the bucket set above
    expect(posts[0]!.body.session).toBe('map-feedback'); // file keyed by the bucket slug
    expect(posts[0]!.body.header).toContain('# Playtest bucket — Map feedback');
    expect(posts[0]!.body.entry).toContain('## Question ·');
  });

  it('kind + bucket persist to the next capture in the mount', async () => {
    mount();
    pick(null);
    clearSwallow();
    kindBtn('question').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    setGroup('Dev tooling');
    await typeAndSend('first', null); // keep the bucket set above
    pick(null); // reopen — the toggle + bucket should be remembered (sticky within the mount)
    expect(groupField().value).toBe('Dev tooling');
    await typeAndSend('second', null);
    expect(posts[1]!.body.session).toBe('dev-tooling');
    expect(posts[1]!.body.entry).toContain('## Question ·');
  });
});

describe('FB-195/196 — the map sheet is capturable', () => {
  it('an SVG pick yields a descriptor (the old picker returned null for SVG)', async () => {
    mount();
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', 't0v2-node');
    (g as unknown as { dataset: DOMStringMap }).dataset.zone = 'weir';
    const kanji = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    kanji.textContent = '堰';
    g.appendChild(kanji);
    svg.appendChild(g);
    host.appendChild(svg);
    pick(kanji);
    await typeAndSend('the weir seal');
    const entry = posts[0]!.body.entry;
    expect(entry).toContain('map-sheet seal "weir"'); // semantic label, not null
    expect(entry).toContain('data-zone=weir'); // the selector anchors to the zone
  });

  it('the screenshot rasterises shotRoot when given (body ⇒ modals ride the shot)', async () => {
    const seen: Element[] = [];
    mount({
      shotRoot: document.body,
      snapshot: async (el) => {
        seen.push(el);
        return 'data:image/png;base64,x';
      },
    });
    pick(null);
    await typeAndSend('general note');
    expect(seen).toEqual([document.body]); // NOT the #app host
  });
});

// FB-215/FB-218/FB-219 — the shell freeze, and the rasteriser it lets us move to submit.
describe('mountCapture — the shell freeze', () => {
  it('freezes on the `` ` `` keypress, before the element is even picked', async () => {
    const f = fakeFreeze();
    mount({ freeze: f.control });
    hotkey();
    expect(f.calls).toEqual(['freeze']); // held still while the human hover-picks
    document.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }));
    expect(f.calls).toEqual(['freeze']); // still frozen with the box open
    await typeAndSend('a note');
    expect(f.calls).toEqual(['freeze', 'thaw']);
  });

  it('thaws when pick is abandoned with Esc — no box was ever opened', () => {
    const f = fakeFreeze();
    mount({ freeze: f.control });
    hotkey();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(f.calls).toEqual(['freeze', 'thaw']);
  });

  it('thaws when the box is cancelled with Esc', () => {
    const f = fakeFreeze();
    mount({ freeze: f.control });
    pick(document.createElement('button'));
    expect(boxEl()).not.toBeNull();
    // Esc is handled on the note field (where the caret is), not on `document`.
    const ta = boxEl()!.querySelector('textarea')!;
    ta.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(boxEl()).toBeNull();
    expect(f.calls).toEqual(['freeze', 'thaw']);
  });

  it('never strands the game frozen when the overlay unmounts mid-pick', () => {
    const f = fakeFreeze();
    mount({ freeze: f.control });
    hotkey();
    unmount();
    unmount = () => {};
    expect(f.calls).toEqual(['freeze', 'thaw']);
  });

  // `active()` is the liveness probe the shell's FREEZE WATCHDOG asks (src/app/freeze-watchdog.ts):
  // frozen + !active ⇒ the freeze is stranded and the watchdog takes the world back. So the probe
  // must be TRUE for exactly as long as the overlay legitimately holds the freeze — no wider (the
  // watchdog would never rescue anything) and no narrower (it would thaw the world under a human
  // mid-note). It is deliberately read from the live pick/box state, not tracked by events.
  it('reports the overlay as ACTIVE for exactly as long as it holds the freeze', async () => {
    mount();
    expect(captureActive()).toBe(false); // idle — a freeze now could only be a stranded one
    hotkey();
    expect(captureActive()).toBe(true); // picking: the human is choosing an element
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(captureActive()).toBe(false); // pick abandoned — the overlay let the freeze go
    pick(document.createElement('button'));
    expect(captureActive()).toBe(true); // note box open: the human is typing
    await typeAndSend('a note');
    expect(captureActive()).toBe(false); // sent — and the overlay thawed on the way out
  });

  it('thaws even when opening the note box THROWS — the world is never left frozen', () => {
    const f = fakeFreeze();
    const errs = vi.spyOn(console, 'error').mockImplementation(() => {});
    mount({
      freeze: f.control,
      // The class of bug the watchdog exists for, caught at its source: anything that throws
      // between the freeze and the box appearing (here, building the entry context) used to leave
      // the shell frozen with no overlay on screen — every auto and timed action silently dead
      // until an F5. The world must come back even when the DEV tool breaks.
      buildContext: () => {
        throw new Error('boom');
      },
    });
    pick(document.createElement('button'));
    expect(f.calls).toEqual(['freeze', 'thaw']); // the world is running again…
    expect(captureActive()).toBe(false); // …and nothing is left holding the freeze
    expect(boxEl()).toBeNull(); // the box genuinely failed to open (this could have gone RED)
    expect(errs).toHaveBeenCalled(); // …and the failure shouted rather than being swallowed
    errs.mockRestore();
  });

  it('opens the box WITHOUT rasterising — the ~600ms shot waits for submit', () => {
    // The whole point of FB-219: at pick we do zero raster work, so the box paints immediately.
    let shots = 0;
    mount({
      snapshot: async () => {
        shots++;
        return 'data:image/png;base64,x';
      },
    });
    pick(document.createElement('button'));
    expect(boxEl()).not.toBeNull();
    expect(shots).toBe(0);
  });

  it('shoots a still screen: box hidden, highlight lit, game not yet thawed', async () => {
    const f = fakeFreeze();
    const observed: { box: string | undefined; highlight: boolean; thawed: boolean }[] = [];
    mount({
      freeze: f.control,
      shotRoot: document.body,
      snapshot: async () => {
        observed.push({
          box: boxEl()?.style.display,
          highlight: highlightEl() !== null,
          thawed: f.calls.includes('thaw'),
        });
        return 'data:image/png;base64,x';
      },
    });
    pick(document.createElement('button'));
    await typeAndSend('what is this element');

    expect(observed).toHaveLength(1);
    expect(observed[0]!.box).toBe('none'); // the note box is out of the picture…
    expect(observed[0]!.highlight).toBe(true); // …but the picked element is still ringed
    expect(observed[0]!.thawed).toBe(false); // and nothing moved while we shot it
    expect(f.calls).toEqual(['freeze', 'thaw']); // thawed only after the shot
    expect(posts[0]!.body.screenshot).toBe('data:image/png;base64,x');
  });

  it('waits for a paint between hiding the box and rasterising', async () => {
    // Without this the ~600ms rasteriser steals the main thread before the browser can commit the
    // frame where the box vanished, and the box sits on screen for the whole shot.
    const order: string[] = [];
    mount({
      afterPaint: (fn) => {
        order.push('paint');
        fn();
      },
      snapshot: async () => {
        order.push('shot');
        return 'data:image/png;base64,x';
      },
    });
    pick(document.createElement('button'));
    await typeAndSend('note');
    expect(order).toEqual(['paint', 'shot']);
  });

  it('works with no freeze installed — the overlay never depends on one', async () => {
    mount({ snapshot: async () => 'data:image/png;base64,x' });
    pick(document.createElement('button'));
    await typeAndSend('no freeze here');
    expect(posts[0]!.body.entry).toContain('no freeze here');
  });
});

// FB-259 — the bucket suggestion list. The native `<datalist>` popup is an OS widget: a white slab
// in system font, unstyleable, dropped into an ink-dark overlay. Replaced with our own listbox.
describe('mountCapture — the bucket combobox', () => {
  const menuEl = (): HTMLElement | null => document.querySelector('[data-kami-capture-menu]');
  const options = (): HTMLElement[] => [
    ...(menuEl()?.querySelectorAll<HTMLElement>('[role="option"]') ?? []),
  ];
  const groupField = (): HTMLInputElement =>
    boxEl()!.querySelector('[data-kami-group]') as HTMLInputElement;
  const type = (v: string): void => {
    const g = groupField();
    g.value = v;
    g.dispatchEvent(new Event('input', { bubbles: true }));
  };
  const key = (k: string, init: KeyboardEventInit = {}): void =>
    void groupField().dispatchEvent(
      new KeyboardEvent('keydown', { key: k, bubbles: true, ...init }),
    );

  beforeEach(() =>
    localStorage.setItem('kami-capture-groups', JSON.stringify(['map feedback', 'dev tooling'])),
  );
  afterEach(() => localStorage.clear());

  it('uses no native datalist (that popup cannot be themed)', () => {
    mount();
    pick(null);
    expect(document.querySelector('datalist')).toBeNull();
    expect(groupField().hasAttribute('list')).toBe(false);
    expect(groupField().getAttribute('role')).toBe('combobox');
  });

  it('does not shadow the note box in a [data-kami-capture] lookup', () => {
    // The menu is body-mounted next to the box; sharing its marker made querySelector find the menu.
    mount();
    pick(null);
    groupField().dispatchEvent(new FocusEvent('focus'));
    expect(boxEl()!.querySelector('textarea')).not.toBeNull();
  });

  it('suggests the recents on focus, and filters them as you type', () => {
    mount();
    pick(null);
    groupField().dispatchEvent(new FocusEvent('focus'));
    expect(options().map((o) => o.textContent)).toEqual(['map feedback', 'dev tooling']);

    type('dev');
    const labels = options().map((o) => o.textContent);
    expect(labels).toContain('dev tooling');
    expect(labels).not.toContain('map feedback');
  });

  it('offers to mint a new bucket for an unknown name — the common case', () => {
    mount();
    pick(null);
    type('cold open');
    expect(options()[0]!.textContent).toContain('new bucket');
    expect(options()[0]!.textContent).toContain('cold open');
  });

  it('does not offer to mint one that already exists', () => {
    mount();
    pick(null);
    type('map feedback');
    expect(options().some((o) => o.textContent?.includes('new bucket'))).toBe(false);
  });

  it('picks a suggestion with the arrow keys and Enter (without sending)', () => {
    mount();
    pick(null);
    groupField().dispatchEvent(new FocusEvent('focus'));
    key('ArrowDown');
    key('Enter');
    expect(groupField().value).toBe('map feedback');
    expect(posts).toHaveLength(0); // Enter picked; only ⌘/Ctrl+Enter sends
    expect(menuEl()!.style.display).toBe('none');
  });

  it('pointerdown on a row selects it', () => {
    mount();
    pick(null);
    groupField().dispatchEvent(new FocusEvent('focus'));
    // jsdom has no PointerEvent constructor; listeners key off the event TYPE.
    options()[1]!.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }));
    expect(groupField().value).toBe('dev tooling');
  });

  it('Escape closes the MENU first, and only then the note box', () => {
    mount();
    pick(null);
    groupField().dispatchEvent(new FocusEvent('focus'));
    expect(menuEl()!.style.display).toBe('block');

    key('Escape');
    expect(menuEl()!.style.display).toBe('none');
    expect(boxEl()).not.toBeNull(); // the note survived

    key('Escape');
    expect(boxEl()).toBeNull(); // …now it closes
  });

  it('tears the body-mounted menu down with the box', () => {
    mount();
    pick(null);
    groupField().dispatchEvent(new FocusEvent('focus'));
    expect(menuEl()).not.toBeNull();
    boxEl()!
      .querySelector('textarea')!
      .dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(menuEl()).toBeNull(); // no orphan listbox on <body>
  });
});
