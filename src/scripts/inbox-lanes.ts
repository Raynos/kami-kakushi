// inbox-lanes — the shared pure core of the parallel-drain protocol (ADR-171).
//
// Three thin CLIs consume this module: `inbox-claim.ts` (the ephemeral lane
// claim), `inbox-regroup.ts` (the durable fix-surface scan), and
// `inbox-ledger.ts` (the verify gate). Design constraints that shaped it:
//
// - DURABLE drain state (`lane` / `surface` / `status` / `fb` / `commit`)
//   lives as fields on each capture's own `<stamp>.json` sidecar — never in
//   the bucket `.md` (the capture middleware appends + auto-commits it, so an
//   in-place edit races a live capture) and never in a central ledger file
//   (N lanes marking items done would all edit one file, recreating the very
//   append race this design kills). The middleware writes a sidecar exactly
//   once and never returns to it, so these fields are contention-free.
// - DEFAULTS-BY-ABSENCE: a sidecar with no `status` field IS open; no `lane`
//   field means the lane is its bucket. The middleware is untouched and the
//   pre-existing sidecars need no migration.
// - EPHEMERAL claim state (who holds a lane right now) is a git-ignored
//   `.claims/<lane>.json`, atomically created (O_EXCL) and validated by owner
//   LIVENESS (herdr pane roster, pid fallback) — not by a guessed TTL.
// - A `surface` is a stable collision TOKEN (`vn-overlay`, `log-panel`), not
//   a file path — paths go stale when code moves; a token only has to answer
//   "would two lanes fixing these two items touch the same thing?".

import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';

/** Highest F/FB number allocated before this protocol existed (FB-198,
 *  2026-07-10). History is append-only and cannot be renumbered, and it holds
 *  three explainable collisions (a template `F1`, the cross-series
 *  `F122`/`FB-122`, the follow-up `FB-166 (resolved)`) — so uniqueness is
 *  enforced only ABOVE this baseline, across both series unified. */
export const FB_BASELINE = 198;

/** Sub-folder of pending/ holding the ephemeral claims — git-ignored. */
export const CLAIMS_DIR = '.claims';

export interface Claim {
  readonly lanes: readonly string[];
  readonly agent: string;
  readonly pane: string;
  readonly pid: number;
  readonly started: string;
  readonly fbLo: number;
  readonly fbHi: number;
}

export type ItemStatus = 'open' | 'done' | 'parked';

/** One capture, as the drain tooling sees it: the sidecar's own fields plus
 *  the resolved defaults-by-absence. */
export interface InboxItem {
  readonly stamp: string; // sidecar basename without .json
  readonly bucket: string; // the folder it sits in
  readonly lane: string; // sidecar.lane ?? bucket
  readonly status: ItemStatus; // sidecar.status ?? 'open'
  readonly surface: readonly string[]; // sidecar.surface ?? []
  readonly fb: number | null;
  readonly commit: string | null;
  readonly elementLabel: string;
  readonly elementSelector: string;
  readonly sidecarPath: string;
}

// ---------------------------------------------------------------------------
// Reading the inbox

function asRecord(v: unknown): Record<string, unknown> {
  return typeof v === 'object' && v !== null ? (v as Record<string, unknown>) : {};
}

/** Read every capture sidecar under pending/ (skipping `.claims/`) into the
 *  resolved item view. Tolerates unreadable/malformed sidecars by skipping
 *  them — the drain verifies against the running game anyway (PH2). */
export function readItems(pendingDir: string): InboxItem[] {
  const items: InboxItem[] = [];
  let buckets: string[];
  try {
    buckets = readdirSync(pendingDir).filter(
      (name) => name !== CLAIMS_DIR && statSync(join(pendingDir, name)).isDirectory(),
    );
  } catch {
    return items;
  }
  for (const bucket of buckets) {
    const dir = join(pendingDir, bucket);
    for (const file of readdirSync(dir).filter((f) => f.endsWith('.json'))) {
      let raw: Record<string, unknown>;
      try {
        raw = asRecord(JSON.parse(readFileSync(join(dir, file), 'utf-8')));
      } catch {
        continue;
      }
      const element = asRecord(raw.element);
      const status = raw.status === 'done' || raw.status === 'parked' ? raw.status : 'open';
      items.push({
        stamp: basename(file, '.json'),
        bucket,
        lane: typeof raw.lane === 'string' && raw.lane !== '' ? raw.lane : bucket,
        status,
        surface: Array.isArray(raw.surface) ? raw.surface.filter((s) => typeof s === 'string') : [],
        fb: typeof raw.fb === 'number' ? raw.fb : null,
        commit: typeof raw.commit === 'string' ? raw.commit : null,
        elementLabel: typeof element.label === 'string' ? element.label : '',
        elementSelector: typeof element.selector === 'string' ? element.selector : '',
        sidecarPath: join(dir, file),
      });
    }
  }
  return items;
}

/** Merge drain fields into a sidecar in place (read → spread → write). Safe
 *  because the middleware never rewrites a sidecar after creation. */
export function writeDrainFields(
  sidecarPath: string,
  fields: Partial<{
    lane: string;
    surface: readonly string[];
    status: ItemStatus;
    fb: number;
    commit: string;
  }>,
): void {
  const raw = asRecord(JSON.parse(readFileSync(sidecarPath, 'utf-8')));
  writeFileSync(sidecarPath, `${JSON.stringify({ ...raw, ...fields }, null, 1)}\n`, 'utf-8');
}

// ---------------------------------------------------------------------------
// Surfaces — the collision tokens

/** Heuristic selector/label → surface-token rules, most-specific first. The
 *  scan SEEDS these; an agent may overwrite a sidecar's `surface` by hand
 *  where the heuristic misreads — the field is the truth, the table is only
 *  the seeder. */
export const SURFACE_RULES: ReadonlyArray<{ readonly re: RegExp; readonly token: string }> = [
  { re: /vn-speech|vn-nameplate|vn-card|vn-rung-ceremony|vn-/, token: 'vn-overlay' },
  { re: /log-fresh-divider|data-panel=log|panel "log"/, token: 'log-panel' },
  { re: /section\.work|"What you can do|button "Rake|button "Rest/, token: 'work-actions' },
  { re: /header\.vitals|Answer the summons/, token: 'vitals-header' },
  { re: /nav\.nav|"WorkMap/, token: 'nav' },
  { re: /SettingsVariantsScenariosBalanceStory|dev-panel/, token: 'dev-panel' },
  { re: /button "Continue"/, token: 'vn-overlay' },
  { re: /button "Progress"/, token: 'log-panel' },
];

/** Derive surface tokens for one capture from its picked element. Empty when
 *  nothing matches — an unscanned/unknown surface never fabricates a token. */
export function deriveSurface(label: string, selector: string): string[] {
  const hay = `${label} · ${selector}`;
  const tokens = new Set<string>();
  for (const rule of SURFACE_RULES) if (rule.re.test(hay)) tokens.add(rule.token);
  return [...tokens];
}

export interface Collision {
  readonly mine: InboxItem;
  readonly other: InboxItem;
  readonly tokens: readonly string[];
}

/** Open items of MINE that share a surface token with an open item in a
 *  DIFFERENT lane — the "hey, we'd both touch this" report. */
export function findCollisions(
  mine: readonly InboxItem[],
  others: readonly InboxItem[],
): Collision[] {
  const collisions: Collision[] = [];
  for (const m of mine) {
    if (m.status !== 'open' || m.surface.length === 0) continue;
    for (const o of others) {
      if (o.status !== 'open' || o.lane === m.lane) continue;
      const tokens = m.surface.filter((t) => o.surface.includes(t));
      if (tokens.length > 0) collisions.push({ mine: m, other: o, tokens });
    }
  }
  return collisions;
}

// ---------------------------------------------------------------------------
// F-numbers

/** Template/placeholder headings never allocate (the F-log template line). */
const FB_HEADING_RE = /^### F(?:B-)?(\d+)(?:\b(?!\s*·\s*<).*)?$/;
const FB_RESOLVED_RE = /\(resolved\)/i;
const FB_TEMPLATE_RE = /<short title>/;

/** Every F/FB number ALLOCATED by headings in the given F-log texts — one
 *  unified number space (the skill's "F-numbering is global"), excluding
 *  template placeholders and `(resolved)` follow-up headings (a resolution
 *  re-uses its number on purpose). */
export function fbAllocations(mdTexts: readonly string[]): number[] {
  const nums: number[] = [];
  for (const text of mdTexts) {
    for (const line of text.split('\n')) {
      if (!line.startsWith('### F')) continue;
      if (FB_TEMPLATE_RE.test(line) || FB_RESOLVED_RE.test(line)) continue;
      const m = FB_HEADING_RE.exec(line.trim());
      if (m) nums.push(Number(m[1]));
    }
  }
  return nums;
}

/** The next lane's block starts above everything anyone has: committed
 *  headings, live claims' reservations, and fb fields already stamped on
 *  sidecars. */
export function fbHighWater(
  headings: readonly number[],
  claims: readonly Claim[],
  items: readonly InboxItem[],
): number {
  return Math.max(
    FB_BASELINE,
    ...headings,
    ...claims.map((c) => c.fbHi),
    ...items.map((i) => i.fb ?? 0),
  );
}

// ---------------------------------------------------------------------------
// Claims — ephemeral, liveness-checked

export function claimPath(pendingDir: string, lane: string): string {
  return join(pendingDir, CLAIMS_DIR, `${lane.replace(/[^A-Za-z0-9_-]/g, '-')}.json`);
}

/** Atomically create one lane's claim file (O_EXCL — the POSIX mutex). Throws
 *  with code EEXIST when the lane is already held. */
export function createClaim(pendingDir: string, lane: string, claim: Claim): void {
  writeFileSync(claimPath(pendingDir, lane), `${JSON.stringify(claim, null, 1)}\n`, {
    encoding: 'utf-8',
    flag: 'wx',
  });
}

export function readClaims(pendingDir: string): Array<{ lane: string; claim: Claim }> {
  const dir = join(pendingDir, CLAIMS_DIR);
  let files: string[];
  try {
    files = readdirSync(dir).filter((f) => f.endsWith('.json'));
  } catch {
    return [];
  }
  const out: Array<{ lane: string; claim: Claim }> = [];
  for (const f of files) {
    try {
      out.push({
        lane: basename(f, '.json'),
        claim: JSON.parse(readFileSync(join(dir, f), 'utf-8')) as Claim,
      });
    } catch {
      /* unreadable claim — reap will handle it */
    }
  }
  return out;
}

export function releaseClaim(pendingDir: string, lane: string): void {
  rmSync(claimPath(pendingDir, lane), { force: true });
}

/** Liveness oracle. Primary: the herdr pane roster (shared-tree agents are
 *  herdr panes; a claim whose pane is gone is PROVABLY stale). Fallback when
 *  herdr is unavailable: a same-host pid probe. Injectable for tests. */
export function isClaimLive(
  claim: Claim,
  probes: {
    herdrPanes?: () => string[] | null; // null = herdr unavailable
    pidAlive?: (pid: number) => boolean;
  } = {},
): boolean {
  const panes = (probes.herdrPanes ?? defaultHerdrPanes)();
  if (panes !== null) return panes.includes(claim.pane);
  const alive =
    probes.pidAlive ??
    ((pid: number): boolean => {
      try {
        process.kill(pid, 0);
        return true;
      } catch {
        return false;
      }
    });
  return alive(claim.pid);
}

function defaultHerdrPanes(): string[] | null {
  try {
    const raw = execFileSync('herdr', ['agent', 'list'], { encoding: 'utf-8', timeout: 5000 });
    const parsed = JSON.parse(raw) as {
      result?: { agents?: Array<{ pane_id?: string }> };
    };
    const agents = parsed.result?.agents;
    if (!Array.isArray(agents)) return null;
    return agents.map((a) => a.pane_id ?? '').filter((p) => p !== '');
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Ledger — the gate's pure checks

/** All invariant violations in the given corpus, as printable findings. Empty
 *  array = green. Kept pure so the gate CLI is a trivial shell and the tests
 *  can drive every RED path. */
export function ledgerFindings(
  pendingItems: readonly InboxItem[],
  archivedItems: readonly InboxItem[],
  headingAllocations: readonly number[],
): string[] {
  const findings: string[] = [];
  const all = [...pendingItems, ...archivedItems];

  // 1 · No F-number stamped on two different captures — ever.
  const byFb = new Map<number, InboxItem[]>();
  for (const i of all) if (i.fb !== null) byFb.set(i.fb, [...(byFb.get(i.fb) ?? []), i]);
  for (const [fb, dupes] of byFb) {
    if (dupes.length > 1) {
      findings.push(
        `FB-${fb} is stamped on ${dupes.length} captures: ${dupes.map((d) => `${d.bucket}/${d.stamp}`).join(', ')}`,
      );
    }
  }

  // 2 · Above the baseline, heading allocations are unique across the unified
  //     F/FB space — the F-number race caught mechanically.
  const seen = new Map<number, number>();
  for (const n of headingAllocations) seen.set(n, (seen.get(n) ?? 0) + 1);
  for (const [n, count] of seen) {
    if (n > FB_BASELINE && count > 1) {
      findings.push(
        `F-log allocates FB-${n} ${count} times (post-baseline numbers must be unique)`,
      );
    }
  }

  // 3 · A done capture must carry its record: the fb + the fixing commit.
  for (const i of all) {
    if (i.status === 'done' && (i.fb === null || i.commit === null)) {
      findings.push(
        `${i.bucket}/${i.stamp} is done but missing ${i.fb === null ? 'fb' : 'commit'}`,
      );
    }
  }

  // 4 · A bucket whose every capture is done has no business in pending/ —
  //     archive it (parked items legitimately hold a bucket open).
  const byBucket = new Map<string, InboxItem[]>();
  for (const i of pendingItems) byBucket.set(i.bucket, [...(byBucket.get(i.bucket) ?? []), i]);
  for (const [bucket, items] of byBucket) {
    if (items.length > 0 && items.every((i) => i.status === 'done')) {
      findings.push(
        `bucket "${bucket}" is fully drained (${items.length} done) but still in pending/ — archive it`,
      );
    }
  }

  return findings;
}
