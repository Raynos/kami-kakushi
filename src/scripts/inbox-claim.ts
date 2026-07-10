// inbox-claim — claim/list/release/reap drain lanes (ADR-171).
//
// The ephemeral half of the parallel-drain protocol: an agent claims 1..N
// lanes BEFORE draining, gets a reserved F-number block, and gets the
// announce report (live lanes + predicted fix-surface collisions) that the
// drain-inbox skill relays to the human. Claims are git-ignored files under
// pending/.claims/ — no commit, no verify run, no index contention — and are
// validated by owner liveness, so a dead lane's claim is reapable, never a
// deadlock.
//
//   tsx src/scripts/inbox-claim.ts claim <lane...> --pane <w:p> [--agent <label>]
//   tsx src/scripts/inbox-claim.ts list
//   tsx src/scripts/inbox-claim.ts release <lane...>
//   tsx src/scripts/inbox-claim.ts reap
export {};

import { mkdirSync, readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import {
  CLAIMS_DIR,
  createClaim,
  fbAllocations,
  fbHighWater,
  findCollisions,
  isClaimLive,
  readClaims,
  readItems,
  releaseClaim,
  type Claim,
} from './inbox-lanes';

const PENDING = resolve(new URL('../../project/playtest-inbox/pending', import.meta.url).pathname);
const FLOG_DIR = resolve(new URL('../../project/feedback-human', import.meta.url).pathname);

function readFlogTexts(): string[] {
  try {
    return readdirSync(FLOG_DIR)
      .filter((f) => f.endsWith('.md'))
      .map((f) => readFileSync(join(FLOG_DIR, f), 'utf-8'));
  } catch {
    return [];
  }
}

const [cmd = 'list', ...rest] = process.argv.slice(2);
const flags = new Map<string, string>();
const lanes: string[] = [];
for (let i = 0; i < rest.length; i++) {
  const a = rest[i]!;
  if (a.startsWith('--')) flags.set(a.slice(2), rest[++i] ?? '');
  else lanes.push(a);
}

const items = readItems(PENDING);
const claims = readClaims(PENDING);

function liveness(): Map<string, boolean> {
  return new Map(claims.map(({ lane, claim }) => [lane, isClaimLive(claim)]));
}

function printLive(exceptLanes: readonly string[] = []): void {
  const alive = liveness();
  for (const { lane, claim } of claims) {
    if (exceptLanes.includes(lane)) continue;
    const remaining = items.filter((i) => i.lane === lane && i.status === 'open').length;
    console.log(
      `LIVE     ${lane.padEnd(14)} ${claim.pane.padEnd(7)} ${claim.agent.padEnd(10)} ` +
        `${alive.get(lane) ? 'alive' : 'DEAD (reapable)'}   ${remaining} open   FB-${claim.fbLo}..${claim.fbHi}`,
    );
  }
}

if (cmd === 'list') {
  if (claims.length === 0) console.log('no live claims');
  else printLive();
  const hw = fbHighWater(
    fbAllocations(readFlogTexts()),
    claims.map((c) => c.claim),
    items,
  );
  console.log(`F-number high-water mark: FB-${hw} (next block starts at FB-${hw + 1})`);
  process.exit(0);
}

if (cmd === 'release') {
  if (lanes.length === 0) {
    console.error('release: name the lane(s) to release');
    process.exit(1);
  }
  for (const lane of lanes) releaseClaim(PENDING, lane);
  console.log(`released: ${lanes.join(', ')}`);
  process.exit(0);
}

if (cmd === 'reap') {
  const alive = liveness();
  const reaped = claims.filter(({ lane }) => !alive.get(lane));
  for (const { lane } of reaped) releaseClaim(PENDING, lane);
  console.log(
    reaped.length === 0 ? 'nothing to reap' : `reaped: ${reaped.map((r) => r.lane).join(', ')}`,
  );
  process.exit(0);
}

if (cmd === 'claim') {
  if (lanes.length === 0) {
    console.error('claim: name the lane(s) to claim');
    process.exit(1);
  }
  const pane = flags.get('pane') ?? 'unknown';
  const agent = flags.get('agent') ?? 'claude';

  const mine = items.filter((i) => lanes.includes(i.lane));
  const open = mine.filter((i) => i.status === 'open');
  if (open.length === 0) {
    console.error(`claim: no open items in lane(s) ${lanes.join(', ')} — nothing to drain`);
    process.exit(1);
  }

  // Captures are FB-stamped at capture time (ADR-171) — the block only covers
  // legacy UNSTAMPED items; a fully-stamped lane reserves nothing.
  const unstamped = open.filter((i) => i.fb === null);
  const hw = fbHighWater(
    fbAllocations(readFlogTexts()),
    claims.map((c) => c.claim),
    items,
  );
  const claim: Claim = {
    lanes,
    agent,
    pane,
    pid: process.pid,
    started: new Date().toISOString(),
    fbLo: unstamped.length > 0 ? hw + 1 : hw,
    fbHi: hw + unstamped.length,
  };

  mkdirSync(join(PENDING, CLAIMS_DIR), { recursive: true });
  const created: string[] = [];
  const alive = liveness();
  for (const lane of lanes) {
    try {
      createClaim(PENDING, lane, claim);
      created.push(lane);
    } catch {
      const holder = claims.find((c) => c.lane === lane);
      console.error(
        holder
          ? `COLLISION: lane "${lane}" is held by ${holder.claim.agent}@${holder.claim.pane} since ${holder.claim.started}` +
              ` (${alive.get(lane) ? 'alive — coordinate or pick another lane' : 'DEAD — run reap, then retry'})`
          : `COLLISION: lane "${lane}" claim exists but is unreadable — run reap`,
      );
      for (const l of created) releaseClaim(PENDING, l); // all-or-nothing
      process.exit(1);
    }
  }

  console.log(
    `CLAIMED  ${lanes.join(' + ')}  (${open.length} open)  ` +
      (unstamped.length > 0
        ? `FB-${claim.fbLo}..${claim.fbHi} reserved for ${unstamped.length} unstamped legacy item(s); the rest carry their capture-time FB`
        : 'all captures FB-stamped at capture time — no block reserved'),
  );
  printLive(lanes);
  const others = items.filter((i) => !lanes.includes(i.lane));
  const collisions = findCollisions(open, others);
  if (items.every((i) => i.surface.length === 0)) {
    console.log(
      'NOTE     surfaces unscanned — run `tsx src/scripts/inbox-regroup.ts scan` for collision detection',
    );
  } else if (collisions.length > 0) {
    console.log(
      `COLLISION  ${collisions.length} open item(s) share a fix surface with another lane:`,
    );
    for (const c of collisions) {
      console.log(
        `  ${c.mine.bucket}/${c.mine.stamp}  [${c.tokens.join(', ')}]  <-> ${c.other.lane}: ${c.other.bucket}/${c.other.stamp}`,
      );
    }
    console.log(
      'ACTION   relay this to the human BEFORE draining; coordinate, re-lane, or defer these.',
    );
  }
  process.exit(0);
}

console.error(`unknown command: ${cmd} (use claim | list | release | reap)`);
process.exit(1);
