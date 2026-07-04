// Dev-server transport for the playtest capture overlay (F3 Ph1). A Vite dev-middleware
// endpoint (wired in vite.config.ts, `apply: 'serve'`) receives a POSTed capture from the
// DEV-only overlay and writes it into project/playtest-inbox/pending/. NEVER part of the
// prod build: vite.config code doesn't ship, and the gh-pages build is a static bundle
// with no server — so the endpoint is structurally absent from prod (§2.4).
//
// Split for testability: `resolveCapture` is the PURE validator (filename allowlist,
// path-traversal jail, size caps, screenshot decode) → returns the resolved paths+bytes
// or a typed error; `writeCapture` is the thin fs shell; `playtestInboxHandler` is the
// connect-middleware that reads the body and glues the two. Tests hit the pure parts.

import { mkdirSync, writeFileSync } from 'node:fs';
import { basename, resolve, sep } from 'node:path';
import type { IncomingMessage, ServerResponse } from 'node:http';

// The POST path is single-sourced in the browser-safe format module so the client overlay
// can share it WITHOUT importing this fs/http-laden server module. Re-exported here so
// vite.config.ts (and any server-side reader) keeps importing it from `./playtest-inbox`.
export { CAPTURE_ENDPOINT } from '../ui/capture-format';

/** The markdown payload (note + save envelope) is bounded — the save is tens of KB. */
export const MAX_MARKDOWN_BYTES = 256 * 1024;
/** The whole body may also carry a base64 PNG sidecar (§2.3), which dwarfs the markdown —
 *  so the overall body cap is generous while the markdown stays tightly bounded above. */
export const MAX_BODY_BYTES = 12 * 1024 * 1024;

const MD_FILENAME_RE = /^[A-Za-z0-9T.-]+\.md$/;
const PNG_DATA_URL_RE = /^data:image\/png;base64,([A-Za-z0-9+/=]+)$/;

export interface CaptureBody {
  readonly filename: string;
  readonly markdown: string;
  /** Optional data URL `data:image/png;base64,…` for the git-ignored sidecar. */
  readonly screenshot?: string;
}

export type ResolvedCapture =
  | {
      readonly ok: true;
      readonly mdPath: string;
      readonly markdown: string;
      readonly pngPath?: string;
      readonly pngBuffer?: Buffer;
    }
  | { readonly ok: false; readonly status: number; readonly error: string };

function fail(status: number, error: string): ResolvedCapture {
  return { ok: false, status, error };
}

/** Validate an untrusted capture body and resolve it to concrete pending/ paths. Re-sanitises
 *  server-side regardless of what the client sent (R2 — the endpoint trusts nothing). */
export function resolveCapture(body: unknown, pendingDir: string): ResolvedCapture {
  if (typeof body !== 'object' || body === null) return fail(400, 'body must be a JSON object');
  const { filename, markdown, screenshot } = body as Record<string, unknown>;

  if (typeof filename !== 'string' || typeof markdown !== 'string') {
    return fail(400, 'filename and markdown are required strings');
  }
  // Filename allowlist FIRST — this alone forbids `/`, `\`, and any traversal (no separators
  // are in the allowed set), so `../evil.md` is rejected here before any path work.
  if (!MD_FILENAME_RE.test(filename)) return fail(400, `illegal filename: ${filename}`);
  if (Buffer.byteLength(markdown, 'utf-8') > MAX_MARKDOWN_BYTES) {
    return fail(413, 'markdown exceeds the size cap');
  }

  // Dir-jail defence-in-depth: the resolved path must stay strictly inside pendingDir.
  const dir = resolve(pendingDir);
  const mdPath = resolve(dir, filename);
  if (mdPath !== `${dir}${sep}${filename}` || !mdPath.startsWith(`${dir}${sep}`)) {
    return fail(400, 'resolved path escapes the inbox');
  }

  if (screenshot === undefined) return { ok: true, mdPath, markdown };
  if (typeof screenshot !== 'string') return fail(400, 'screenshot must be a png data URL string');
  const m = PNG_DATA_URL_RE.exec(screenshot);
  if (!m) return fail(400, 'screenshot must be a base64 image/png data URL');
  const pngBuffer = Buffer.from(m[1]!, 'base64');
  const pngPath = resolve(dir, filename.replace(/\.md$/, '.png'));
  return { ok: true, mdPath, markdown, pngPath, pngBuffer };
}

/** Write a resolved capture to disk (creates pending/ if missing). The only impure step. */
export function writeCapture(
  resolved: Extract<ResolvedCapture, { ok: true }>,
  pendingDir: string,
): void {
  mkdirSync(resolve(pendingDir), { recursive: true });
  writeFileSync(resolved.mdPath, resolved.markdown, 'utf-8');
  if (resolved.pngPath && resolved.pngBuffer) writeFileSync(resolved.pngPath, resolved.pngBuffer);
}

function respond(res: ServerResponse, status: number, payload: unknown): void {
  res.statusCode = status;
  res.setHeader('content-type', 'application/json');
  res.end(JSON.stringify(payload));
}

/** Connect/Vite middleware: POST-only, streams the body under a hard cap, then resolves+writes.
 *  Mounted at CAPTURE_ENDPOINT, so req.url is already stripped to the sub-path — method is the gate. */
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
