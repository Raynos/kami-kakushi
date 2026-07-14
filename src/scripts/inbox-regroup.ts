// inbox-regroup — the durable fix-surface scan (ADR-171).
//
// `scan` seeds each pending capture's `surface` tokens (from its picked
// element, via the SURFACE_RULES heuristic) and reports cross-bucket clusters
// — items in DIFFERENT buckets that would touch the SAME surface, i.e. the
// collisions a per-bucket drain can't see. `assign` re-lanes named captures
// into a cluster lane. Both write into the capture's own <stamp>.json, so the
// result is DURABLE and visible to every other lane: an item moved from
// bucket X to lane Y can't be drained twice.
//
// The scan is IDEMPOTENT: it never touches a done/parked capture, never
// overwrites an existing `surface`, and `assign` refuses to move a capture
// that already has a different lane (or is done/parked) without --force.
//
//   tsx src/scripts/inbox-regroup.ts scan
//   tsx src/scripts/inbox-regroup.ts assign <lane> <stamp...> [--force]
export {};

import { resolve } from 'node:path';
import { deriveSurface, readItems, writeDrainFields } from './inbox-lanes';

const PENDING = resolve(
  new URL('../../project/playtest-inbox/pending', import.meta.url).pathname,
);

const args = process.argv.slice(2);
const force = args.includes('--force');
const positional = args.filter((a) => a !== '--force');
const [cmd = 'scan', ...rest] = positional;

const items = readItems(PENDING);

if (cmd === 'scan') {
  let seeded = 0;
  for (const item of items) {
    if (item.status !== 'open' || item.surface.length > 0) continue;
    const surface = deriveSurface(item.elementLabel, item.elementSelector);
    if (surface.length === 0) continue;
    writeDrainFields(item.sidecarPath, { surface });
    seeded++;
  }

  // Re-read so the report reflects what's on disk, then cluster open items by
  // token and surface the cross-bucket ones — the lock-proof collisions.
  const fresh = readItems(PENDING).filter((i) => i.status === 'open');
  const byToken = new Map<string, typeof fresh>();
  for (const i of fresh)
    for (const t of i.surface) byToken.set(t, [...(byToken.get(t) ?? []), i]);

  console.log(
    `scan: seeded surface on ${seeded} capture(s); ${fresh.length} open in pending/`,
  );
  let clusters = 0;
  for (const [token, members] of byToken) {
    const buckets = new Set(members.map((m) => m.bucket));
    const lanesSet = new Set(members.map((m) => m.lane));
    if (buckets.size < 2 || lanesSet.size < 2) continue; // already one lane's job
    clusters++;
    console.log(
      `CLUSTER  [${token}] spans ${buckets.size} buckets (${[...buckets].join(', ')}):`,
    );
    for (const m of members)
      console.log(`  ${m.bucket}/${m.stamp}  (lane: ${m.lane})`);
    console.log(
      `  -> to fix as one unit: tsx src/scripts/inbox-regroup.ts assign ${token} ${members.map((m) => m.stamp).join(' ')}`,
    );
  }
  if (clusters === 0)
    console.log(
      'no cross-bucket clusters — buckets are collision-free as lanes',
    );
  process.exit(0);
}

if (cmd === 'assign') {
  const [lane, ...stamps] = rest;
  if (!lane || stamps.length === 0) {
    console.error('assign: usage — assign <lane> <stamp...> [--force]');
    process.exit(1);
  }
  let moved = 0;
  for (const stamp of stamps) {
    const item = items.find((i) => i.stamp === stamp);
    if (!item) {
      console.error(`  X ${stamp}: no such capture in pending/`);
      process.exitCode = 1;
      continue;
    }
    if (item.status !== 'open' && !force) {
      console.error(
        `  X ${stamp}: status is "${item.status}" — refusing to re-lane without --force`,
      );
      process.exitCode = 1;
      continue;
    }
    if (item.lane !== item.bucket && item.lane !== lane && !force) {
      console.error(
        `  X ${stamp}: already re-laned to "${item.lane}" — refusing to move without --force`,
      );
      process.exitCode = 1;
      continue;
    }
    writeDrainFields(item.sidecarPath, { lane });
    console.log(`  ✓ ${item.bucket}/${stamp} -> lane "${lane}"`);
    moved++;
  }
  console.log(
    `assign: ${moved}/${stamps.length} capture(s) re-laned to "${lane}"`,
  );
  process.exit(process.exitCode ?? 0);
}

console.error(`unknown command: ${cmd} (use scan | assign)`);
process.exit(1);
