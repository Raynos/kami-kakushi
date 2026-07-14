// Report retention (FB-8) — PURE: which dropped report FILES earn a place on disk.
//
// A report is one RUN, not one playthrough: every boot that can't resume, every save-import,
// every fixture load forks a fresh runId. Left unswept the folder fills with 20-second pokes
// and speed>1 driving — 24 files reading as "24 playthroughs" when the corpus held ONE usable
// run (2026-07-10). The keep rule is the balance flow's own admission test, applied at the
// write edge instead of in an agent's head:
//
//   · TIME-TAINTED (speed>1, DEV jumps, instant-actions) → the clock lied; the report already
//     prints `tainted` in every vs-sim column. It can never inform pacing. Drop it.
//     (ORIGIN marks — save-import — are NOT taints: honest clock, unknown economy. Kept.)
//   · SHORTER THAN ONE IN-BAND RUNG (`T0_PACING_BAND_MIN`, the source of truth — never a
//     copied magic number) → too small to characterise even a single rung. Drop it.
//
// FAIL-OPEN BY CONSTRUCTION: an unrecognised header or an unparseable Σ line returns keep.
// This module authorises `unlinkSync` — a parse it can't read must never become a delete.

import { balance } from '../core';

/** A run shorter than the fastest IN-BAND rung can't characterise one rung. */
export const MIN_ATTENDED_MIN = balance.T0_PACING_BAND_MIN;

// Both anchored to formatRunReport's shape (report.ts) and pinned by retention.test.ts,
// which builds its fixtures THROUGH that formatter — the format can't drift past the policy.
const HEADER_RE = /^run \S+ \(.*\) — (.+)$/m;
const ATTENDED_RE = /^Σ attended ([\d.]+) min\b/m;

export type RetentionVerdict =
  | { readonly keep: true }
  | { readonly keep: false; readonly reason: string };

/** Does this rendered report earn a file? Unreadable input is always kept. */
export function keepReport(text: string): RetentionVerdict {
  const header = HEADER_RE.exec(text);
  if (!header?.[1]) return { keep: true };

  const label = header[1];
  if (label.startsWith('TAINTED:')) {
    const which =
      label.split(' · ')[0]?.slice('TAINTED:'.length).trim() ?? 'unknown';
    return { keep: false, reason: `time-tainted (${which})` };
  }

  const attended = ATTENDED_RE.exec(text);
  if (!attended?.[1]) return { keep: true };
  const min = Number(attended[1]);
  if (!Number.isFinite(min)) return { keep: true };
  if (min < MIN_ATTENDED_MIN) {
    return {
      keep: false,
      reason: `${min.toFixed(1)} attended min < ${MIN_ATTENDED_MIN} (band min)`,
    };
  }
  return { keep: true };
}
