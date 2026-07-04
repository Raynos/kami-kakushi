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

import { appendFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { basename, resolve, sep } from 'node:path';
import type { IncomingMessage, ServerResponse } from 'node:http';

// The POST path is single-sourced in the browser-safe format module so the client shares it
// WITHOUT importing this fs/http-laden server module. Re-exported so vite.config.ts keeps
// importing it from `./playtest-inbox`.
export { CAPTURE_ENDPOINT } from '../ui/capture-format';

/** The appended markdown per capture (header + entry) is bounded; the save is tens of KB. */
export const MAX_MARKDOWN_BYTES = 512 * 1024;
/** The body may also carry a base64 PNG, which dwarfs the markdown — so the overall body cap is
 *  generous while the markdown stays tightly bounded above. */
export const MAX_BODY_BYTES = 12 * 1024 * 1024;

// Session id: allowlist-safe, no separators, no dots-only traversal. Screenshot basename: <name>.png.
const SESSION_RE = /^[A-Za-z0-9T.-]+$/;
const PNG_NAME_RE = /^[A-Za-z0-9T.-]+\.png$/;
const PNG_DATA_URL_RE = /^data:image\/png;base64,([A-Za-z0-9+/=]+)$/;

export interface CaptureBody {
  /** The session id — filename base (no `.md`) and the screenshots folder name. */
  readonly session: string;
  /** The session header — written ONLY when the session file is first created. */
  readonly header: string;
  /** The `##` entry markdown — appended to the session file. */
  readonly entry: string;
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
      readonly shotDir?: string;
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
  const { session, header, entry, screenshotName, screenshot } = body as Record<string, unknown>;

  if (typeof session !== 'string' || typeof header !== 'string' || typeof entry !== 'string') {
    return fail(400, 'session, header and entry are required strings');
  }
  if (!SESSION_RE.test(session)) return fail(400, `illegal session id: ${session}`);
  if (Buffer.byteLength(header, 'utf-8') + Buffer.byteLength(entry, 'utf-8') > MAX_MARKDOWN_BYTES) {
    return fail(413, 'markdown exceeds the size cap');
  }

  const dir = resolve(pendingDir);
  const mdPath = resolve(dir, `${session}.md`);
  const shotDir = resolve(dir, session);
  // Dir-jail: both the .md and the session folder must stay strictly inside pending/.
  if (mdPath !== `${dir}${sep}${session}.md` || !mdPath.startsWith(`${dir}${sep}`)) {
    return fail(400, 'resolved path escapes the inbox');
  }
  if (shotDir !== `${dir}${sep}${session}` || !shotDir.startsWith(`${dir}${sep}`)) {
    return fail(400, 'resolved screenshot folder escapes the inbox');
  }

  if (screenshot === undefined) return { ok: true, mdPath, header, entry };
  if (typeof screenshot !== 'string' || typeof screenshotName !== 'string') {
    return fail(400, 'screenshot requires a data URL string + a screenshotName');
  }
  if (!PNG_NAME_RE.test(screenshotName))
    return fail(400, `illegal screenshot name: ${screenshotName}`);
  const m = PNG_DATA_URL_RE.exec(screenshot);
  if (!m) return fail(400, 'screenshot must be a base64 image/png data URL');
  const pngBuffer = Buffer.from(m[1]!, 'base64');
  const shotPath = resolve(shotDir, screenshotName);
  if (!shotPath.startsWith(`${shotDir}${sep}`))
    return fail(400, 'screenshot path escapes the folder');
  return { ok: true, mdPath, header, entry, shotDir, shotPath, pngBuffer };
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
  if (resolved.shotDir && resolved.shotPath && resolved.pngBuffer) {
    mkdirSync(resolved.shotDir, { recursive: true });
    writeFileSync(resolved.shotPath, resolved.pngBuffer);
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
      respond(res, 200, { ok: true, file: basename(resolved.mdPath) });
    });
  };
}
