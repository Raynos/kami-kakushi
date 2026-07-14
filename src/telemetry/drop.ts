// The report drop (FB-8 Ph4, browser side) — POSTs the run's report markdown to the dev-server
// middleware, which writes it into the git-ignored `project/telemetry/` folder (the agent-
// facing delivery loop's FOLDER). Fire-and-forget + fail-soft: the localStorage ring is the
// buffer, the files are the archive — a failed drop (dev server absent, prod preview) is a
// console warn, never data loss, and the DEV panel button can re-drop any time.
//
// The endpoint const lives HERE (browser-safe) and the fs/http server module imports it —
// the capture-format precedent, so the client never pulls node built-ins into the bundle.

export const TELEMETRY_DROP_ENDPOINT = '/__telemetry-drop';

let warned = false;
let notedUnretained = false;

/** Drop the run's report. `keepalive` lets the hide/unload-edge drop outlive the page. */
export function postSessionReport(runId: string, report: string): void {
  try {
    void fetch(TELEMETRY_DROP_ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ runId, report }),
      keepalive: true,
    })
      .then(async (res) => {
        if (!res.ok && !warned) {
          warned = true; // once per session — a missing middleware isn't worth console spam
          console.warn(
            `[telemetry] report drop refused (${res.status}) — ring still has the run`,
          );
          return;
        }
        // The server GCs reports that can't inform balance (retention.ts). Say so ONCE — the
        // run is still whole in the ring, and a tainted run closes a segment on every blur.
        if (res.ok && !notedUnretained) {
          const body = (await res.json().catch(() => null)) as {
            kept?: boolean;
            reason?: string;
          } | null;
          if (body && body.kept === false) {
            notedUnretained = true;
            console.info(
              `[telemetry] report not retained: ${body.reason ?? 'unusable'} — ring still has the run`,
            );
          }
        }
      })
      .catch(() => {
        if (!warned) {
          warned = true;
          console.warn(
            '[telemetry] report drop failed (no dev server?) — ring still has the run',
          );
        }
      });
  } catch {
    /* fetch unavailable (very old env) — the ring is the fallback */
  }
}
