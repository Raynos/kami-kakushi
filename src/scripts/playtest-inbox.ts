// Dev-server transport for the playtest capture overlay (F3). A Vite dev-middleware endpoint
// (wired in vite.config.ts, `apply: 'serve'`) receives a POSTed capture from the DEV-only overlay
// and APPENDS it to that game session's file: `project/playtest-inbox/pending/<session>.md` (header
// written once, one `##` entry per capture), with the entry's screenshot written into the sibling
// folder `pending/<session>/`. NEVER part of the prod build (config code never ships; the gh-pages
// build is a static bundle with no server) — so the endpoint is structurally absent from prod.
//
// Split for testability: `resolveCapture` is the PURE validator (session/screenshot-name allowlists,
// path-traversal jail, size caps, screenshot decode) → resolved paths + bytes or a typed error;
// `writeCapture` is the thin fs shell (create-with-header or append); `playtestInboxHandler` is the
// connect-middleware glue. Tests hit the pure parts.

import { execFileSync } from 'node:child_process';
import { appendFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { basename, resolve, sep } from 'node:path';
import type { IncomingMessage, ServerResponse } from 'node:http';

// The POST path is single-sourced in the browser-safe format module so the client shares it
// WITHOUT importing this fs/http-laden server module. Re-exported so vite.config.ts keeps
// importing it from `./playtest-inbox`.
export { CAPTURE_ENDPOINT } from '../ui/capture-format';

/** The appended markdown per capture (header + LEAN entry) is small — the save is no longer inline. */
export const MAX_MARKDOWN_BYTES = 512 * 1024;
/** The metadata JSON carries the base64 save (tens of KB) + recent logs — bounded, but bigger. */
export const MAX_METADATA_BYTES = 4 * 1024 * 1024;
/** The body may also carry a base64 PNG, which dwarfs both — so the overall body cap is generous. */
export const MAX_BODY_BYTES = 12 * 1024 * 1024;

// Session id: allowlist-safe, no separators, no dots-only traversal. Sidecar basenames: <name>.png / .json.
// The first two are exported: capture-format.test.ts asserts the client builders satisfy
// THESE regexes (one source — a copied literal there stayed green if the server drifted).
export const SESSION_RE = /^[A-Za-z0-9T.-]+$/;
export const PNG_NAME_RE = /^[A-Za-z0-9T.-]+\.png$/;
const JSON_NAME_RE = /^[A-Za-z0-9T.-]+\.json$/;
const PNG_DATA_URL_RE = /^data:image\/png;base64,([A-Za-z0-9+/=]+)$/;

export interface CaptureBody {
  /** The session id — filename base (no `.md`) and the sidecar folder name. */
  readonly session: string;
  /** The session header — written ONLY when the session file is first created. */
  readonly header: string;
  /** The lean `##` entry markdown — appended to the session file. */
  readonly entry: string;
  /** Metadata sidecar basename (`<stamp>.json`) inside the session folder. */
  readonly metadataName: string;
  /** The metadata JSON content (save + recent logs + full context) — written to the sidecar. */
  readonly metadata: string;
  /** Screenshot basename (`<stamp>.png`) inside the session folder; required iff `screenshot` set. */
  readonly screenshotName?: string;
  /** Optional data URL `data:image/png;base64,…`. */
  readonly screenshot?: string;
}

export type ResolvedCapture =
  | {
      readonly ok: true;
      readonly mdPath: string;
      readonly header: string;
      readonly entry: string;
      readonly sessionDir: string;
      readonly metadataPath: string;
      readonly metadata: string;
      readonly shotPath?: string;
      readonly pngBuffer?: Buffer;
    }
  | { readonly ok: false; readonly status: number; readonly error: string };

function fail(status: number, error: string): ResolvedCapture {
  return { ok: false, status, error };
}

/** Validate an untrusted capture body and resolve it to concrete session paths. Re-sanitises
 *  server-side regardless of what the client sent (R2 — the endpoint trusts nothing). */
export function resolveCapture(body: unknown, pendingDir: string): ResolvedCapture {
  if (typeof body !== 'object' || body === null) return fail(400, 'body must be a JSON object');
  const { session, header, entry, metadataName, metadata, screenshotName, screenshot } =
    body as Record<string, unknown>;

  if (typeof session !== 'string' || typeof header !== 'string' || typeof entry !== 'string') {
    return fail(400, 'session, header and entry are required strings');
  }
  if (!SESSION_RE.test(session)) return fail(400, `illegal session id: ${session}`);
  if (Buffer.byteLength(header, 'utf-8') + Buffer.byteLength(entry, 'utf-8') > MAX_MARKDOWN_BYTES) {
    return fail(413, 'markdown exceeds the size cap');
  }
  if (typeof metadataName !== 'string' || typeof metadata !== 'string') {
    return fail(400, 'metadataName and metadata are required strings');
  }
  if (!JSON_NAME_RE.test(metadataName)) return fail(400, `illegal metadata name: ${metadataName}`);
  if (Buffer.byteLength(metadata, 'utf-8') > MAX_METADATA_BYTES) {
    return fail(413, 'metadata exceeds the size cap');
  }

  const dir = resolve(pendingDir);
  const mdPath = resolve(dir, `${session}.md`);
  const sessionDir = resolve(dir, session);
  // Dir-jail: the .md and the session folder must stay strictly inside pending/.
  if (mdPath !== `${dir}${sep}${session}.md` || !mdPath.startsWith(`${dir}${sep}`)) {
    return fail(400, 'resolved path escapes the inbox');
  }
  if (sessionDir !== `${dir}${sep}${session}` || !sessionDir.startsWith(`${dir}${sep}`)) {
    return fail(400, 'resolved session folder escapes the inbox');
  }
  const metadataPath = resolve(sessionDir, metadataName);
  if (!metadataPath.startsWith(`${sessionDir}${sep}`)) {
    return fail(400, 'metadata path escapes the folder');
  }

  const base = { ok: true, mdPath, header, entry, sessionDir, metadataPath, metadata } as const;
  if (screenshot === undefined) return base;
  if (typeof screenshot !== 'string' || typeof screenshotName !== 'string') {
    return fail(400, 'screenshot requires a data URL string + a screenshotName');
  }
  if (!PNG_NAME_RE.test(screenshotName))
    return fail(400, `illegal screenshot name: ${screenshotName}`);
  const m = PNG_DATA_URL_RE.exec(screenshot);
  if (!m) return fail(400, 'screenshot must be a base64 image/png data URL');
  const pngBuffer = Buffer.from(m[1]!, 'base64');
  const shotPath = resolve(sessionDir, screenshotName);
  if (!shotPath.startsWith(`${sessionDir}${sep}`))
    return fail(400, 'screenshot path escapes the folder');
  return { ...base, shotPath, pngBuffer };
}

/** Write a resolved capture: create the session file with its header (first capture) or append the
 *  entry, then write the screenshot into the session folder. The only impure step. */
export function writeCapture(
  resolved: Extract<ResolvedCapture, { ok: true }>,
  pendingDir: string,
): void {
  mkdirSync(resolve(pendingDir), { recursive: true });
  if (existsSync(resolved.mdPath)) appendFileSync(resolved.mdPath, resolved.entry);
  else writeFileSync(resolved.mdPath, resolved.header + resolved.entry, 'utf-8');
  // Sidecars in the session folder: the metadata JSON (committed — save + logs + context) and the
  // optional screenshot (git-ignored).
  mkdirSync(resolved.sessionDir, { recursive: true });
  writeFileSync(resolved.metadataPath, resolved.metadata, 'utf-8');
  if (resolved.shotPath && resolved.pngBuffer) writeFileSync(resolved.shotPath, resolved.pngBuffer);
}

/** Auto-commit the capture `.md` so a capture is durable in git the moment it's made (no capture
 *  sits uncommitted). FAIL-SOFT: the file is already on disk, so a failed commit (index lock,
 *  co-agent race, not-a-repo in tests) is never a lost capture — we just skip it. Isolated by
 *  design: `git commit --only -- <the .md>` commits ONLY that one path (the `.png` is git-ignored),
 *  leaving any co-agent's staged work untouched; `--no-verify` skips the code gates (a data write,
 *  not a code change). Opt out with `KAMI_INBOX_NO_COMMIT=1`. */
export function commitCapture(
  paths: readonly string[], // the .md + the metadata .json (the .png stays git-ignored)
  pendingDir: string,
  run?: (args: string[]) => void, // injectable git-runner (tests); defaults to real `git`
): void {
  if (process.env.KAMI_INBOX_NO_COMMIT === '1') return;
  if (paths.length === 0) return;
  // pending/ → playtest-inbox/ → project/ → <repo root>
  const repoRoot = resolve(pendingDir, '..', '..', '..');
  const git =
    run ??
    ((args: string[]): void => void execFileSync('git', args, { cwd: repoRoot, stdio: 'ignore' }));
  try {
    git(['add', '--', ...paths]); // stage them (new or appended)
    git([
      'commit',
      '--no-verify',
      '-m',
      `chore(inbox): playtest capture ${basename(paths[0]!)}`,
      '--',
      ...paths,
    ]);
  } catch {
    /* fail-soft — the capture is on disk; leaving it uncommitted is never a lost capture */
  }
}

function respond(res: ServerResponse, status: number, payload: unknown): void {
  res.statusCode = status;
  res.setHeader('content-type', 'application/json');
  res.end(JSON.stringify(payload));
}

/** Connect/Vite middleware: POST-only, streams the body under a hard cap, then resolves + writes. */
export function playtestInboxHandler(
  pendingDir: string,
): (req: IncomingMessage, res: ServerResponse, next: () => void) => void {
  return (req, res, next) => {
    if (req.method !== 'POST') {
      next();
      return;
    }
    const chunks: Buffer[] = [];
    let size = 0;
    let aborted = false;
    req.on('data', (chunk: Buffer) => {
      if (aborted) return;
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        aborted = true;
        respond(res, 413, { error: 'body exceeds the size cap' });
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => {
      if (aborted) return;
      let body: unknown;
      try {
        body = JSON.parse(Buffer.concat(chunks).toString('utf-8'));
      } catch {
        respond(res, 400, { error: 'invalid JSON body' });
        return;
      }
      const resolved = resolveCapture(body, pendingDir);
      if (!resolved.ok) {
        respond(res, resolved.status, { error: resolved.error });
        return;
      }
      try {
        writeCapture(resolved, pendingDir);
      } catch (e) {
        respond(res, 500, { error: `write failed: ${String(e)}` });
        return;
      }
      commitCapture([resolved.mdPath, resolved.metadataPath], pendingDir); // durable-in-git, fail-soft
      respond(res, 200, { ok: true, file: basename(resolved.mdPath) });
    });
  };
}
