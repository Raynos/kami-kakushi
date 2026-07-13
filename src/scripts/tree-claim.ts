// tree-claim — shared-tree lane claims: push, exit, and ADR numbers (ADR-196).
//
// Generalizes the ADR-171 inbox-claim pattern to the tree-wide contention
// lanes the 2026-07-13 analysis measured (218 push rejects, parallel
// /prepare-to-exit thrash, ADR-number races). Same design laws as
// `inbox-lanes.ts`:
//
// - EPHEMERAL claim state is a git-ignored `project/.claims/<lane>.json`,
//   atomically created (O_EXCL) — no commit, no verify run, no index
//   contention.
// - Validity is owner LIVENESS (herdr pane roster, pid fallback via
//   `isClaimLive`), never a guessed TTL. A dead owner's claim is reaped, not
//   waited out.
// - Held-lane behavior is the ADR-196 human ruling: `push` → the caller
//   leaves commits local and moves on ("another push will happen
//   eventually"); `exit` → bounded wait, and a timeout surfaces through
//   /prepare-to-exit's OOPS output.
//
//   tsx src/scripts/tree-claim.ts claim <push|exit> [--wait <sec>]
//   tsx src/scripts/tree-claim.ts release <push|exit>
//   tsx src/scripts/tree-claim.ts adr [n]        # reserve next n (default 1) ADR numbers
//   tsx src/scripts/tree-claim.ts list
//   tsx src/scripts/tree-claim.ts reap
//
// Exit codes: 0 ok · 3 lane held by a LIVE owner (claim/wait timeout).
export {};

import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';
import { type Claim, isClaimLive } from './inbox-lanes';

const CLAIMS = resolve(new URL('../../project/.claims', import.meta.url).pathname);
const DECISIONS_FILE = resolve(new URL('../../docs/living/decisions.md', import.meta.url).pathname);
const DECISIONS_DIR = resolve(new URL('../../docs/living/decisions', import.meta.url).pathname);

/** A tree lane claim. `adrLo`/`adrHi` carry an ADR-number reservation and are
 *  0 for the mutex lanes (push/exit) — mirroring inbox-claim's fb block. */
export interface TreeClaim {
  readonly lane: string;
  readonly agent: string;
  readonly pane: string;
  readonly pid: number;
  readonly started: string;
  readonly adrLo: number;
  readonly adrHi: number;
}

export function lanePath(claimsDir: string, lane: string): string {
  return join(claimsDir, `${lane.replace(/[^A-Za-z0-9_-]/g, '-')}.json`);
}

/** Atomic O_EXCL create — the POSIX mutex. Throws EEXIST when held. */
export function createTreeClaim(claimsDir: string, claim: TreeClaim): void {
  mkdirSync(claimsDir, { recursive: true });
  writeFileSync(lanePath(claimsDir, claim.lane), `${JSON.stringify(claim, null, 1)}\n`, {
    encoding: 'utf-8',
    flag: 'wx',
  });
}

export function readTreeClaims(claimsDir: string): TreeClaim[] {
  let files: string[];
  try {
    files = readdirSync(claimsDir).filter((f) => f.endsWith('.json'));
  } catch {
    return [];
  }
  const out: TreeClaim[] = [];
  for (const f of files) {
    try {
      const raw = JSON.parse(readFileSync(join(claimsDir, f), 'utf-8')) as TreeClaim;
      out.push({ ...raw, lane: raw.lane ?? basename(f, '.json') });
    } catch {
      /* unreadable → reap handles it */
    }
  }
  return out;
}

export function releaseTreeClaim(claimsDir: string, lane: string): void {
  rmSync(lanePath(claimsDir, lane), { force: true });
}

/** Adapt a TreeClaim to the inbox-lanes liveness oracle (it reads pane/pid). */
function asLivenessClaim(c: TreeClaim): Claim {
  return {
    lanes: [c.lane],
    agent: c.agent,
    pane: c.pane,
    pid: c.pid,
    started: c.started,
    fbLo: 0,
    fbHi: 0,
  };
}

export function isTreeClaimLive(
  claim: TreeClaim,
  probes?: Parameters<typeof isClaimLive>[1],
): boolean {
  return isClaimLive(asLivenessClaim(claim), probes);
}

/** Drop every claim whose owner is provably gone. Returns reaped lanes. */
export function reapDead(
  claimsDir: string,
  live: (c: TreeClaim) => boolean = isTreeClaimLive,
): string[] {
  const reaped: string[] = [];
  for (const c of readTreeClaims(claimsDir)) {
    if (!live(c)) {
      releaseTreeClaim(claimsDir, c.lane);
      reaped.push(c.lane);
    }
  }
  return reaped;
}

// ---------------------------------------------------------------------------
// ADR numbers — allocator, not mutex: many agents may hold reservations.

/** Every ADR number allocated by a `### ADR-nnn` heading in the given texts. */
export function adrAllocations(mdTexts: readonly string[]): number[] {
  const nums: number[] = [];
  for (const text of mdTexts) {
    for (const line of text.split('\n')) {
      const m = /^#{2,4} ADR-(\d+)\b/.exec(line.trim());
      if (m) nums.push(Number(m[1]));
    }
  }
  return nums;
}

/** Next free ADR number sits above every heading AND every live reservation. */
export function adrHighWater(headings: readonly number[], claims: readonly TreeClaim[]): number {
  return Math.max(0, ...headings, ...claims.map((c) => c.adrHi));
}

function readDecisionTexts(): string[] {
  const texts: string[] = [];
  try {
    texts.push(readFileSync(DECISIONS_FILE, 'utf-8'));
  } catch {
    /* index may not exist in a bare checkout */
  }
  try {
    for (const f of readdirSync(DECISIONS_DIR).filter((f) => f.endsWith('.md'))) {
      texts.push(readFileSync(join(DECISIONS_DIR, f), 'utf-8'));
    }
  } catch {
    /* band dir lands with the shard plan; absent until then */
  }
  return texts;
}

// ---------------------------------------------------------------------------
// CLI

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

async function main(): Promise<void> {
  const [cmd = 'list', ...rest] = process.argv.slice(2);
  const flags = new Map<string, string>();
  const args: string[] = [];
  for (let i = 0; i < rest.length; i++) {
    const a = rest[i]!;
    if (a.startsWith('--')) flags.set(a.slice(2), rest[++i] ?? '');
    else args.push(a);
  }
  const pane = flags.get('pane') ?? process.env.HERDR_PANE_ID ?? 'unknown';
  const agent = flags.get('agent') ?? 'unnamed';
  const mine = (lane: string): TreeClaim => ({
    lane,
    agent,
    pane,
    pid: process.pid,
    started: new Date().toISOString(),
    adrLo: 0,
    adrHi: 0,
  });

  if (cmd === 'claim') {
    const lane = args[0];
    if (lane !== 'push' && lane !== 'exit') {
      console.error(`tree-claim: unknown lane "${lane ?? ''}" (push|exit)`);
      process.exit(1);
    }
    const waitSec = Number(flags.get('wait') ?? 0);
    const deadline = Date.now() + waitSec * 1000;
    for (;;) {
      reapDead(CLAIMS);
      try {
        createTreeClaim(CLAIMS, mine(lane));
        console.log(`claimed ${lane} (${pane})`);
        return;
      } catch {
        const holder = readTreeClaims(CLAIMS).find((c) => c.lane === lane);
        if (Date.now() >= deadline) {
          console.error(
            `tree-claim: ${lane} is HELD by ${holder?.pane ?? '?'} (${holder?.agent ?? '?'}) since ${holder?.started ?? '?'}`,
          );
          process.exit(3);
        }
        await sleep(5000);
      }
    }
  }

  if (cmd === 'release') {
    const lane = args[0] ?? '';
    releaseTreeClaim(CLAIMS, lane);
    console.log(`released ${lane}`);
    return;
  }

  if (cmd === 'adr') {
    const n = Math.max(1, Number(args[0] ?? 1));
    reapDead(CLAIMS);
    const hw = adrHighWater(adrAllocations(readDecisionTexts()), readTreeClaims(CLAIMS));
    const lo = hw + 1;
    const hi = hw + n;
    createTreeClaim(CLAIMS, {
      ...mine(`adr-${pane.replace(/[^A-Za-z0-9_-]/g, '-')}`),
      adrLo: lo,
      adrHi: hi,
    });
    console.log(n === 1 ? `reserved ADR-${lo}` : `reserved ADR-${lo}..ADR-${hi}`);
    return;
  }

  if (cmd === 'reap') {
    const reaped = reapDead(CLAIMS);
    console.log(reaped.length > 0 ? `reaped: ${reaped.join(', ')}` : 'nothing to reap');
    return;
  }

  // list
  const claims = readTreeClaims(CLAIMS);
  if (claims.length === 0) {
    console.log('no live tree claims');
    return;
  }
  for (const c of claims) {
    const live = isTreeClaimLive(c) ? 'live' : 'DEAD';
    const adr = c.adrHi > 0 ? ` ADR-${c.adrLo}..${c.adrHi}` : '';
    console.log(`${c.lane}  ${c.pane} (${c.agent}) ${live} since ${c.started}${adr}`);
  }
}

const isCli = process.argv[1]?.endsWith('tree-claim.ts') ?? false;
if (isCli) await main();
