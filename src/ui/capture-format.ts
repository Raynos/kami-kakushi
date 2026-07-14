// Pure builders for the playtest-capture SESSION file (FB-3). A "game session" (one browser-tab
// play sitting — the id survives a reload via sessionStorage, a fresh tab starts a new one)
// gets ONE markdown file, `project/playtest-inbox/pending/<sessionId>.md`, with the session
// header written once and one `##` ENTRY appended per capture. Screenshots for the session live
// in a sibling folder `pending/<sessionId>/` (git-ignored), same base name as the file.
//
// Captures are keyed to ONE markdown file by a **file key**: when the human tags a capture with a
// BUCKET (e.g. "map feedback", "dev tooling") the key is that bucket's slug, so every capture in
// the bucket — across sessions and builds — appends to `pending/<bucketSlug>.md` and
// `/drain-inbox <bucket>` drains just it. UNGROUPED captures fall back to the game-session id (one
// browser-tab play sitting — survives a reload via sessionStorage), landing in one file per
// session. A capture also carries a KIND — `bug` (a defect to fix) or `question` (something the
// human is exploring) — shown in the entry heading so the drain can route it.
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

/** The UI element the capture is about (pick mode) — a semantic label, its text, a best-effort
 *  selector, and its on-screen rect (so the drain can re-find and re-highlight it). Absent ⇒ a
 *  general whole-page note. */
export interface ElementDescriptor {
  readonly label: string;
  readonly text: string;
  readonly selector: string;
  readonly rect: {
    readonly x: number;
    readonly y: number;
    readonly w: number;
    readonly h: number;
  };
}

/** What a capture is: a defect to fix, or a thing the human is exploring interactively. Surfaced
 *  in the entry heading so the drain routes it (a `question` is answered/discussed, not force-fixed). */
export type CaptureKind = 'bug' | 'question';

/** Human-readable heading label per kind. */
const KIND_LABEL: Readonly<Record<CaptureKind, string>> = {
  bug: 'Bug',
  question: 'Question',
};

/** Per-entry metadata beyond the game context — the kind, the (optional) bucket, and the source
 *  session/build provenance (a bucket file spans sessions + builds, so each entry records its own). */
export interface EntryMeta {
  readonly kind: CaptureKind;
  /** Raw human-typed bucket name; '' / absent ⇒ ungrouped (file keyed by session id). */
  readonly group?: string;
  /** Source session id — provenance (a bucket file spans sessions). */
  readonly session?: string;
  /** Build stamp — provenance (a bucket file spans builds). */
  readonly build?: CaptureBuild;
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
  /** The picked UI element (pick mode); absent ⇒ a general whole-page note. */
  readonly element?: ElementDescriptor;
}

export interface BuiltEntry {
  /** The LEAN markdown `##` block to APPEND to the session file — the human's note, the picked
   *  element, the screenshot link, and a link out to the metadata JSON. No inline base64. */
  readonly entry: string;
  /** `<stamp>.json` — the metadata sidecar basename (in the session folder). */
  readonly metadataName: string;
  /** The metadata JSON content to write to `<session>/<metadataName>` — the heavy machine record:
   *  the base64 save, the recent log lines, and the full at-a-glance context. */
  readonly metadata: string;
  /** `<stamp>.png` — the screenshot basename; present iff hasScreenshot. */
  readonly screenshotName?: string;
}

/** The session file's name from its id. */
export function sessionFilename(sessionId: string): string {
  return `${sessionId}.md`;
}

/** A bucket name → an allowlist-safe file-key slug (`Map feedback` → `map-feedback`, `R0 feedback`
 *  → `r0-feedback`). Returns '' for an empty / symbol-only name (⇒ treat the capture as ungrouped). */
export function slugGroup(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/** The file key a capture writes under: the bucket slug when grouped, else the session id. Both are
 *  allowlist-safe (SESSION_RE), so the server keys the filename + sidecar folder straight off it. */
export function captureFileKey(sessionId: string, group: string): string {
  return slugGroup(group) || sessionId;
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

/** The session file header — written ONCE, on the first capture of the session. */
export function buildSessionHeader(meta: SessionMeta): string {
  return (
    [
      `# Playtest session — ${meta.startedAt}`,
      '',
      `- **build:** ${meta.build.version} (${meta.build.sha}, ${meta.build.date})`,
      `- **session:** \`${meta.sessionId}\``,
      `- **details + screenshots:** \`./${meta.sessionId}/\` (\`<stamp>.json\` = save + logs +`,
      '  context, committed; `<stamp>.png` = screenshot, git-ignored)',
      '',
      'Each `##` block below is one in-game capture (`` ` `` → note → send) from',
      'this session, appended in order. The heavy machine data (save + logs) lives in',
      'the linked `<stamp>.json`; reproduce any one with `__qa.load(<its save>)`.',
      '',
    ].join('\n') + '\n'
  );
}

/** The BUCKET file header — written ONCE, on the first capture into a bucket (possibly a past
 *  session). A bucket accumulates captures across sessions/builds, so — unlike the session header —
 *  it carries no single build/session; each entry records its own provenance in its sidecar JSON. */
export function buildBucketHeader(name: string, slug: string): string {
  return (
    [
      `# Playtest bucket — ${name}`,
      '',
      `- **bucket:** \`${slug}\``,
      `- **details + screenshots:** \`./${slug}/\` (\`<stamp>.json\` = save + logs +`,
      '  context, committed; `<stamp>.png` = screenshot, git-ignored)',
      '',
      'Each `##` block below is one in-game capture in this bucket, appended in order —',
      'possibly across sessions and builds. Each entry names its kind and records its own',
      'save + context in the linked `<stamp>.json`; reproduce any one with `__qa.load(<its save>)`.',
      '',
    ].join('\n') + '\n'
  );
}

/** Build one capture ENTRY (the `##` block appended to the file). `fileKey` is the file/​folder base
 *  (bucket slug or session id) the sidecar links resolve against; `meta` carries kind + provenance. */
export function buildEntry(
  note: string,
  ctx: CaptureContext,
  fileKey: string,
  meta: EntryMeta = { kind: 'bug' },
): BuiltEntry {
  const stamp = stampOf(ctx.capturedAt);
  const slug = slugOf(note);
  const screenshotName = ctx.hasScreenshot ? `${stamp}.png` : undefined;
  const metadataName = `${stamp}.json`;

  // The heavy machine record — base64 save + recent logs + full context — lives in a JSON sidecar
  // the .md links to, so the session file stays lean + readable (no massive inline base64).
  const metadata = JSON.stringify(
    {
      capturedAt: ctx.capturedAt,
      kind: meta.kind,
      group: meta.group || null, // raw bucket name; null ⇒ ungrouped (keyed by session)
      session: meta.session ?? null, // source session (provenance — a bucket spans sessions)
      build: meta.build ?? null, // source build (provenance — a bucket spans builds)
      seed: ctx.seed,
      clock: ctx.clock,
      location: ctx.location,
      rung: ctx.rung,
      tier: ctx.tier,
      activeTab: ctx.activeTab,
      variants: ctx.variants,
      viewport: ctx.viewport,
      url: ctx.url,
      element: ctx.element ?? null,
      screenshot: screenshotName ?? null,
      logTail: ctx.logTail,
      save: ctx.saveBase64, // base64 — `__qa.load()` this to reproduce
    },
    null,
    2,
  );

  // The .md keeps ONLY what a human reads: the feedback text, the picked element, the screenshot,
  // and a link out to the metadata JSON.
  const lines: string[] = [
    '',
    `## ${KIND_LABEL[meta.kind]} · ${ctx.capturedAt} — ${slug}`,
    '',
    note.trim() || '_(empty note)_',
    '',
  ];
  if (ctx.element) {
    const el = ctx.element;
    const textPart = el.text ? ` — "${el.text}"` : '';
    lines.push(
      `**Element:** ${el.label}${textPart} · \`${el.selector}\` · ` +
        `@${el.rect.x},${el.rect.y} ${el.rect.w}×${el.rect.h}`,
    );
  }
  if (screenshotName)
    lines.push(`**Screenshot:** \`${fileKey}/${screenshotName}\``);
  lines.push(
    `**Details:** \`${fileKey}/${metadataName}\` — save + recent logs + full context`,
    '',
    '---',
  );

  const entry = `${lines.join('\n')}\n`;
  return screenshotName
    ? { entry, metadataName, metadata, screenshotName }
    : { entry, metadataName, metadata };
}
