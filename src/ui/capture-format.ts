// Pure builder for a playtest-capture inbox file (F3, D-… plan). The DEV-only capture
// overlay (src/ui/capture.ts, Ph2) closes over live game state and calls buildCapture()
// to turn a human note + a snapshot context into the {filename, markdown} the dev-server
// middleware (src/scripts/playtest-inbox.ts) writes into project/playtest-inbox/pending/.
//
// PURE + node-testable: no DOM, no fs, and NO Date — the caller passes `capturedAt`
// (snapshotted at box-OPEN, §2.1, so typing time never drifts the evidence). Everything
// here is a deterministic function of its inputs, so a fixed context reproduces a fixed
// file (the same determinism the save envelope itself carries).

/** The build stamp (from vite's __VERSION__ / __BUILD_SHA__ / __BUILD_DATE__ defines).
 *  `version` already carries its leading `v` (vite sets __VERSION__ = `v${pkg.version}`). */
export interface CaptureBuild {
  readonly version: string;
  readonly sha: string;
  readonly date: string;
}

export interface CaptureViewport {
  readonly w: number;
  readonly h: number;
  readonly dpr: number;
}

/** One log line, already reduced to the fields the tail renders (the overlay maps the
 *  core LogEntry down to this so capture-format stays free of a core import). */
export interface CaptureLogLine {
  readonly channel: string;
  readonly text: string;
  readonly count: number;
  readonly speaker?: string;
}

export interface CaptureContext {
  /** ISO-8601 with offset, snapshotted at box-OPEN (§2.1). Drives the frontmatter + the stamp. */
  readonly capturedAt: string;
  readonly build: CaptureBuild;
  readonly seed: number;
  readonly clock: { readonly day: number; readonly tick: number };
  readonly location: string;
  readonly rung: string;
  readonly tier: number;
  readonly activeTab: string;
  /** Non-default variant picks only (surface → variantId); {} = all defaults. */
  readonly variants: Readonly<Record<string, string>>;
  readonly viewport: CaptureViewport;
  readonly url: string;
  /** The base64 save envelope (save.exportState) — the deterministic repro source. */
  readonly saveBase64: string;
  /** Oldest→newest tail (already sliced to the last N by the caller). */
  readonly logTail: readonly CaptureLogLine[];
  /** True ⇒ a git-ignored `.png` sidecar (same stem) accompanies this `.md` (§2.3/§2.6). */
  readonly hasScreenshot: boolean;
}

export interface CaptureFile {
  /** `<stamp>-<slug>.md` — safe for the server filename allowlist /^[A-Za-z0-9T.-]+\.md$/. */
  readonly filename: string;
  readonly markdown: string;
}

/** `2026-07-03T18:42:07+0200` → `2026-07-03T18-42-07` (colons are illegal in the allowlist).
 *  Falls back to a sanitised whole-string if the ISO shape is unexpected (never throws). */
export function stampOf(capturedAt: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/.exec(capturedAt);
  if (m) return `${m[1]}-${m[2]}-${m[3]}T${m[4]}-${m[5]}-${m[6]}`;
  const cleaned = capturedAt
    .replace(/[^A-Za-z0-9T.-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return cleaned || 'capture';
}

/** First ~4 words of the note, kebab-cased and stripped to the filename allowlist.
 *  Empty/all-symbol notes fall back to `note` so the filename is always well-formed. */
export function slugOf(note: string): string {
  const slug = note
    .toLowerCase()
    .replace(/[^a-z0-9\s-]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 4)
    .join('-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return slug || 'note';
}

function variantsLine(variants: Readonly<Record<string, string>>): string {
  const entries = Object.entries(variants);
  if (entries.length === 0) return '{}';
  return `{ ${entries.map(([k, v]) => `${k}: ${v}`).join(', ')} }`;
}

function logTailLines(tail: readonly CaptureLogLine[]): string[] {
  if (tail.length === 0) return ['_(no log lines)_'];
  return tail.map((e) => {
    const who = e.speaker ? `${e.speaker}: ` : '';
    const tally = e.count > 1 ? ` ×${e.count}` : '';
    const text = e.text.replace(/\s*\n\s*/g, ' '); // keep one bullet per line
    return `- [${e.channel}] ${who}${text}${tally}`;
  });
}

/** Turn a human note + a snapshot context into the inbox file the middleware writes. */
export function buildCapture(note: string, ctx: CaptureContext): CaptureFile {
  const stamp = stampOf(ctx.capturedAt);
  const slug = slugOf(note);
  const filename = `${stamp}-${slug}.md`;

  const front: string[] = [
    '---',
    `captured_at: ${ctx.capturedAt}`,
    `build: ${ctx.build.version} (${ctx.build.sha}, ${ctx.build.date})`,
    `seed: ${ctx.seed}`,
    `clock: { day: ${ctx.clock.day}, tick: ${ctx.clock.tick} }`,
    `location: ${ctx.location}`,
    `rung: ${ctx.rung}`,
    `tier: ${ctx.tier}`,
    `active_tab: ${ctx.activeTab}`,
    `variants: ${variantsLine(ctx.variants)}`,
    `viewport: ${ctx.viewport.w}x${ctx.viewport.h} @${ctx.viewport.dpr}x`,
    `url: ${ctx.url}`,
  ];
  // The screenshot line names the git-ignored sidecar (same stem). Omitted when there's none.
  if (ctx.hasScreenshot) front.push(`screenshot: ${stamp}-${slug}.png`);
  front.push('---');

  const body: string[] = [
    '',
    '## Note',
    note.trim() || '_(empty note)_',
    '',
    '## Log tail (last 20)',
    ...logTailLines(ctx.logTail),
    '',
    '## Save (base64 envelope — `__qa.load()` this to reproduce)',
    ctx.saveBase64,
    '',
  ];

  return { filename, markdown: [...front, ...body].join('\n') };
}
