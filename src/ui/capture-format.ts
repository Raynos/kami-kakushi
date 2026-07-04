// Pure builders for the playtest-capture SESSION file (F3). A "game session" (one browser-tab
// play sitting — the id survives a reload via sessionStorage, a fresh tab starts a new one)
// gets ONE markdown file, `project/playtest-inbox/pending/<sessionId>.md`, with the session
// header written once and one `##` ENTRY appended per capture. Screenshots for the session live
// in a sibling folder `pending/<sessionId>/` (git-ignored), same base name as the file.
//
// PURE + node-testable: no DOM, no fs, and NO Date — callers pass ISO timestamps (snapshotted at
// box-OPEN, §2.1). Deterministic in / deterministic out.

/** The dev-server POST path the overlay targets. Lives HERE (a browser-safe, node-free module)
 *  so the client overlay and the node transport (which re-exports it) share one source. */
export const CAPTURE_ENDPOINT = '/__playtest-capture';

/** The build stamp (vite __VERSION__ / __BUILD_SHA__ / __BUILD_DATE__). Session-level (constant
 *  for the session), so it lives in the header, not each entry. `version` carries its leading `v`. */
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

/** One log line, reduced to the fields the tail renders. */
export interface CaptureLogLine {
  readonly channel: string;
  readonly text: string;
  readonly count: number;
  readonly speaker?: string;
}

/** Session-level metadata — written into the header once, on the first capture of the session. */
export interface SessionMeta {
  /** Filename base (no `.md`, no separators); also the screenshots folder name. */
  readonly sessionId: string;
  /** ISO-8601 (local offset) of when the session started. */
  readonly startedAt: string;
  readonly build: CaptureBuild;
}

/** Per-capture context — one appended entry. No build (that's session-level, in the header). */
export interface CaptureContext {
  /** ISO-8601 with offset, snapshotted at box-OPEN. */
  readonly capturedAt: string;
  readonly seed: number;
  readonly clock: { readonly day: number; readonly tick: number };
  readonly location: string;
  readonly rung: string;
  readonly tier: number;
  readonly activeTab: string;
  /** Non-default variant picks only ({} = all defaults). */
  readonly variants: Readonly<Record<string, string>>;
  readonly viewport: CaptureViewport;
  readonly url: string;
  /** The base64 save envelope — the deterministic repro source for THIS entry. */
  readonly saveBase64: string;
  /** Oldest→newest tail (already sliced by the caller). */
  readonly logTail: readonly CaptureLogLine[];
  /** True ⇒ a screenshot accompanies this entry (in the session folder). */
  readonly hasScreenshot: boolean;
}

export interface BuiltEntry {
  /** The markdown `##` block to APPEND to the session file. */
  readonly entry: string;
  /** `<stamp>.png` — the screenshot basename inside the session folder; present iff hasScreenshot. */
  readonly screenshotName?: string;
}

/** The session file's name from its id. */
export function sessionFilename(sessionId: string): string {
  return `${sessionId}.md`;
}

/** `2026-07-03T18:42:07+0200` → `2026-07-03T18-42-07` (colons are illegal in the allowlist). */
export function stampOf(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/.exec(iso);
  if (m) return `${m[1]}-${m[2]}-${m[3]}T${m[4]}-${m[5]}-${m[6]}`;
  const cleaned = iso
    .replace(/[^A-Za-z0-9T.-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return cleaned || 'capture';
}

/** A session id from its start time + a short uniquifier token — `<stamp>-<token>`, allowlist-safe. */
export function mintSessionId(startISO: string, token: string): string {
  const t =
    token
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '')
      .slice(0, 6) || 'x';
  return `${stampOf(startISO)}-${t}`;
}

/** First ~4 words of the note, kebab-cased; falls back to "note". Used in each entry's heading. */
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

function variantsInline(variants: Readonly<Record<string, string>>): string {
  const entries = Object.entries(variants);
  if (entries.length === 0) return '{}';
  return `{ ${entries.map(([k, v]) => `${k}: ${v}`).join(', ')} }`;
}

function logTailLines(tail: readonly CaptureLogLine[]): string[] {
  return tail.map((e) => {
    const who = e.speaker ? `${e.speaker}: ` : '';
    const tally = e.count > 1 ? ` ×${e.count}` : '';
    const text = e.text.replace(/\s*\n\s*/g, ' ');
    return `- [${e.channel}] ${who}${text}${tally}`;
  });
}

/** The session file header — written ONCE, on the first capture of the session. */
export function buildSessionHeader(meta: SessionMeta): string {
  return (
    [
      `# Playtest session — ${meta.startedAt}`,
      '',
      `- **build:** ${meta.build.version} (${meta.build.sha}, ${meta.build.date})`,
      `- **session:** \`${meta.sessionId}\``,
      `- **screenshots:** \`./${meta.sessionId}/\` (git-ignored)`,
      '',
      'Each `##` block below is one in-game capture (`` ` `` → note → send) from',
      'this session, appended in order. Reproduce any one from its own embedded save.',
      '',
    ].join('\n') + '\n'
  );
}

/** Build one capture ENTRY (the `##` block appended to the session file). */
export function buildEntry(note: string, ctx: CaptureContext, sessionId: string): BuiltEntry {
  const stamp = stampOf(ctx.capturedAt);
  const slug = slugOf(note);
  const screenshotName = ctx.hasScreenshot ? `${stamp}.png` : undefined;

  const where = [
    `seed ${ctx.seed}`,
    `day ${ctx.clock.day} tick ${ctx.clock.tick}`,
    ctx.location,
    ctx.rung,
    `tier ${ctx.tier}`,
    `tab ${ctx.activeTab}`,
    `variants ${variantsInline(ctx.variants)}`,
    `${ctx.viewport.w}×${ctx.viewport.h}@${ctx.viewport.dpr}x`,
    `url ${ctx.url}`,
  ].join(' · ');

  const lines: string[] = [
    '',
    `## ${ctx.capturedAt} — ${slug}`,
    '',
    '**Note:**',
    note.trim() || '_(empty note)_',
    '',
    `**Where:** ${where}`,
  ];
  if (screenshotName) lines.push(`**Screenshot:** \`${sessionId}/${screenshotName}\``);
  if (ctx.logTail.length > 0) lines.push('', '**Log tail:**', ...logTailLines(ctx.logTail));
  lines.push(
    '',
    '**Save (base64 — `__qa.load()` to reproduce):**',
    `\`${ctx.saveBase64}\``,
    '',
    '---',
  );

  const entry = `${lines.join('\n')}\n`;
  return screenshotName ? { entry, screenshotName } : { entry };
}
