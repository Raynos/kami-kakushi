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

/** Drop the run's report. `keepalive` lets the hide/unload-edge drop outlive the page. */
export function postSessionReport(runId: string, report: string): void {
  try {
    void fetch(TELEMETRY_DROP_ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ runId, report }),
      keepalive: true,
    })
      .then((res) => {
        if (!res.ok && !warned) {
          warned = true; // once per session — a missing middleware isn't worth console spam
          console.warn(`[telemetry] report drop refused (${res.status}) — ring still has the run`);
        }
      })
      .catch(() => {
        if (!warned) {
          warned = true;
          console.warn('[telemetry] report drop failed (no dev server?) — ring still has the run');
        }
      });
  } catch {
    /* fetch unavailable (very old env) — the ring is the fallback */
  }
}
