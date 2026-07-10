// Dev-server transport for the FB-8 telemetry report drop. A Vite dev-middleware endpoint
// (wired in vite.config.ts, `apply: 'serve'` — structurally absent from any build) receives a
// POSTed run report and writes it to `project/telemetry/<runId>.md`, OVERWRITING per run: one
// file per game run, always the current report (session-ends re-drop the grown report).
//
// UNLIKE the FB-3 inbox, nothing here touches git: `project/telemetry/` is git-ignored BY
// CONTRACT (see its README) — local sensor data agents read when talking pacing, never repo
// history. Split for testability: `resolveDrop` is the pure validator (runId allowlist,
// traversal jail, size cap); the handler is thin connect glue.
//
// The write edge also GARBAGE-COLLECTS (2026-07-10): a report that can never inform balance
// (time-tainted, or shorter than one in-band rung) is refused, and the folder is swept on every
// drop + at dev-server boot. Policy lives in `../telemetry/retention` and fails OPEN — deletion
// only ever follows a header this repo demonstrably wrote.

import { mkdirSync, readFileSync, readdirSync, rmSync, unlinkSync, writeFileSync } from 'node:fs';
import { resolve, sep } from 'node:path';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { keepReport } from '../telemetry/retention';

// Single-sourced endpoint (browser-safe module) — the client POSTs to the same path.
export { TELEMETRY_DROP_ENDPOINT } from '../telemetry/drop';

/** A report is a few KB of table + segment log; 256 KB is generous headroom. */
export const MAX_REPORT_BYTES = 256 * 1024;

// runId = `<seed>-<epoch-seconds>` (plus test ids) — no separators that could traverse.
const RUN_ID_RE = /^[A-Za-z0-9-]{1,64}$/;

export type ResolvedDrop =
  | { readonly ok: true; readonly path: string; readonly report: string }
  | { readonly ok: false; readonly status: number; readonly error: string };

export function resolveDrop(body: unknown, dir: string): ResolvedDrop {
  if (typeof body !== 'object' || body === null) {
    return { ok: false, status: 400, error: 'body must be a JSON object' };
  }
  const { runId, report } = body as { runId?: unknown; report?: unknown };
  if (typeof runId !== 'string' || !RUN_ID_RE.test(runId)) {
    return { ok: false, status: 400, error: 'invalid runId' };
  }
  if (typeof report !== 'string' || report.length === 0) {
    return { ok: false, status: 400, error: 'missing report' };
  }
  if (report.length > MAX_REPORT_BYTES) {
    return { ok: false, status: 413, error: 'report exceeds the size cap' };
  }
  const root = resolve(dir);
  const path = resolve(root, `${runId}.md`);
  if (!path.startsWith(root + sep)) {
    return { ok: false, status: 400, error: 'path escapes the telemetry dir' };
  }
  return { ok: true, path, report };
}

/** Delete every report in `dir` that can't inform balance. Best-effort: an unreadable file is
 *  left alone, and `README.md` / non-`.md` entries (the `.gitignore`) are never candidates.
 *  Returns the names dropped, so the caller can say what it swept. */
export function sweepTelemetryDir(dir: string): readonly string[] {
  const root = resolve(dir);
  let names: readonly string[];
  try {
    names = readdirSync(root);
  } catch {
    return []; // no folder yet — nothing to sweep
  }
  const dropped: string[] = [];
  for (const name of names) {
    if (!name.endsWith('.md') || name === 'README.md') continue;
    const path = resolve(root, name);
    if (!path.startsWith(root + sep)) continue; // traversal jail, same as resolveDrop
    try {
      if (keepReport(readFileSync(path, 'utf-8')).keep) continue;
      unlinkSync(path);
      dropped.push(name);
    } catch {
      /* unreadable / vanished mid-sweep — leave it; a GC never fights the filesystem */
    }
  }
  return dropped;
}

function respond(res: ServerResponse, status: number, payload: unknown): void {
  res.statusCode = status;
  res.setHeader('content-type', 'application/json');
  res.end(JSON.stringify(payload));
}

/** Connect/Vite middleware: POST-only; parse → validate → overwrite `<runId>.md`. */
export function telemetryDropHandler(
  dir: string,
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
      if (size > MAX_REPORT_BYTES * 2) {
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
      const resolved = resolveDrop(body, dir);
      if (!resolved.ok) {
        respond(res, resolved.status, { error: resolved.error });
        return;
      }
      const verdict = keepReport(resolved.report);
      try {
        mkdirSync(resolve(dir), { recursive: true });
        if (verdict.keep) {
          writeFileSync(resolved.path, resolved.report, 'utf-8');
        } else {
          // A run can turn unusable MID-RUN (you hit speed>1 at minute 20) — so refusing the
          // write isn't enough: the clean file this run dropped earlier has to go too.
          rmSync(resolved.path, { force: true });
        }
        const swept = sweepTelemetryDir(dir);
        respond(res, 200, {
          ok: true,
          kept: verdict.keep,
          swept: swept.length,
          ...(verdict.keep ? {} : { reason: verdict.reason }),
        });
      } catch (e) {
        respond(res, 500, { error: String(e) });
      }
    });
  };
}
