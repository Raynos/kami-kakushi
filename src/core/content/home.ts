// The player's HOME — the "dry corner and a bowl" the story promises (D-111, F89). Genemon's
// cold-open wage is literally "a dry corner and a bowl" (intro.ts:266/314, dialogue.ts:74) and
// "a place here is yours" (dialogue.ts:81); this module is the reachable entity that prose owes —
// the narrative mirror of R6 (a thing that lives only in prose is as unbuilt as one that lives only
// in TypeScript). It holds a HOME space (granted at R1, where `rest` is sited) and a BELONGINGS
// inventory — possessions you OWN and KEEP, a category DISTINCT from resources (coin/rice/materials)
// and equipment (weapons): a belonging is never consumed by a verb, never carried into a fight, and
// never bitten by the combat-loss penalty (D-113).
//
// The bonus register is Edo COMFORT, NOT RPG stat-gear (D-111, non-negotiable — prestige over
// power): a piece of furniture buys better rest or a warmer, drier body, never a combat stat. The
// `ComfortKind` set below is CLOSED and holds no combat channel on purpose (the prestige-not-power
// invariant test asserts every belonging's kind is one of these, so a future "+atk pillow" fails
// the build). All magnitudes are LIQUID (D-059) — provisional, tuned by playtest.
//
// ── T0 SCOPE + the two DEFERRED seams (D-111 §2.1 / §2.4) ────────────────────────────────────────
//  · T0 ships ONE home tier — "your corner" at R1 (HOME_TIERS[0]). The home GROWING with your rung
//    (Servant's room ~R5 → your own quarters ~R7 — the domestic mirror of the estate flywheel) is
//    DEFERRED to T1+: each upgrade rides its D-110 rung beat and holds a fuller set. It is a DATA
//    seam here (see HOME_TIERS' trailing comment), NOT built.
//  · The STATUS-MIRROR layer (surname name-plate → the two swords on the wall → gōshi dressing) is
//    DEFERRED — it renders the economy's status TOKENS (D-109), which do not exist yet (economy
//    Phase 5). Seam only; not built. Do NOT wire it until the status tokens land.

import type { RankId } from './ranks';

/** The surface id that IS the home — revealed at R1 (surfaces.ts). `rest` re-sites here, the
 *  Inventory tab's belongings section gates on it, and a `granted` belonging is auto-owned once it
 *  latches. */
export const HOME_SURFACE = 'panel-home';

/** The COMFORT channels a belonging can grant. A CLOSED, prestige-only set — NEVER a combat stat
 *  (the D-111 guard; the invariant test pins it). Both route through an EXISTING pure-core system so
 *  the bonus is real and felt, not a dead number. */
export type ComfortKind =
  | 'rest' // adds to the satiety a `rest` restores (bedding) — you wake mended, not merely rested
  | 'body'; // adds to satietyMax (hearth/chest) — a warm, dry corner keeps more of your reserve

export interface ComfortBonus {
  readonly kind: ComfortKind;
  readonly amount: number;
}

export interface BelongingDef {
  readonly id: string;
  readonly label: string;
  readonly kanji: string;
  /** Inked home detail (woodblock/ink, D-018) — reads as a possession, not a bare menu row. */
  readonly blurb: string;
  /** `null` ⇒ a flavour KEEPSAKE (the mat, the bowl) — the emotional anchor, no mechanic. A
   *  `ComfortBonus` ⇒ comfort FURNITURE (bedding / hearth / chest). */
  readonly comfort: ComfortBonus | null;
  /** How you come to own it. `granted` arrives WITH the home (auto-owned once the corner exists —
   *  the promised mat + bowl); `buy` is a personal-COIN purchase, owned once (you have it or you
   *  don't — no stacking). */
  readonly source:
    | { readonly kind: 'granted' }
    | { readonly kind: 'buy'; readonly coinCost: number };
  /** The one-time acquire line (Progress channel) when you buy the piece. `granted` items reveal
   *  through the home surface, so they carry none. */
  readonly acquireLine?: string;
}

// The T0 belongings roster: two GRANTED keepsakes (the promised mat + bowl — flavour, the story's
// emotional anchor) and three BUY comfort pieces (the small "settle your corner" loop). Ids are
// disjoint from every resource key (coin/rice/wood/sansai) so belongings read as their own category.
export const BELONGINGS: readonly BelongingDef[] = [
  {
    id: 'straw_mat',
    label: 'A straw sleeping-mat',
    kanji: '筵',
    blurb:
      'A thin, worn mat of woven straw laid in the corner — the dry place Genemon promised, and yours to keep.',
    comfort: null,
    source: { kind: 'granted' },
  },
  {
    id: 'bowl',
    label: 'A rice bowl',
    kanji: '椀',
    blurb:
      'A chipped lacquer bowl, plain and yours — the whole of a promised wage, made real in your hands.',
    comfort: null,
    source: { kind: 'granted' },
  },
  {
    id: 'bedding',
    label: 'A futon',
    kanji: '布団',
    blurb: 'Quilted bedding to lay over the straw. You wake mended, not merely rested.',
    comfort: { kind: 'rest', amount: 5 },
    source: { kind: 'buy', coinCost: 60 },
    acquireLine:
      'You lay a quilted futon over the straw in your corner. The nights come easier now.',
  },
  {
    id: 'hearth',
    label: 'A sunken hearth',
    kanji: '囲炉裏',
    blurb:
      'A small irori cut into the floor — warmth against the damp of a cold spring, and a place to boil water.',
    comfort: { kind: 'body', amount: 12 },
    source: { kind: 'buy', coinCost: 120 },
    acquireLine:
      'You cut a small irori into the corner floor. Its warmth keeps the cold out of your bones.',
  },
  {
    id: 'chest',
    label: 'A clothes chest',
    kanji: '長持',
    blurb:
      'A long nagamochi chest for a spare robe and what little else is yours — a dry place for your things.',
    comfort: { kind: 'body', amount: 5 },
    source: { kind: 'buy', coinCost: 90 },
    acquireLine:
      'You set a nagamochi chest against the wall. Your few belongings keep dry and to hand.',
  },
];

export const BELONGING_IDS: ReadonlySet<string> = new Set(BELONGINGS.map((b) => b.id));

export function getBelonging(id: string): BelongingDef {
  const b = BELONGINGS.find((x) => x.id === id);
  if (!b) throw new Error(`unknown belonging: ${id}`);
  return b;
}

// ── the "settled home" SET / synergy (D-111 §2.3) — the whole is worth more than the sum. Owning
//    all three comfort pieces grants an ADDITIONAL rest bonus above stacking them, so the SET is the
//    reward, not raw accumulation. Keep the synergy small (D-059 liquid). ──
export const SETTLED_HOME_SET: readonly string[] = ['bedding', 'hearth', 'chest'];
export const SETTLED_HOME_REST_BONUS = 4;

/** Do you own the full comfort SET (bedding + hearth + chest)? */
export function homeSetComplete(owned: ReadonlySet<string>): boolean {
  return SETTLED_HOME_SET.every((id) => owned.has(id));
}

/**
 * Total COMFORT of a given kind from an owned-belonging set (+ the settled-home synergy for
 * `rest`). PURE over the id set, so the reducer (the real rest) and the UI (the SHOWN bonus) read
 * the SAME number through the SAME fn — no preview/reality drift (A6). Returns 0 for an empty set,
 * so it is inert until you own comfort furniture.
 */
export function comfortBonus(owned: ReadonlySet<string>, kind: ComfortKind): number {
  let total = 0;
  for (const def of BELONGINGS) {
    if (def.comfort && def.comfort.kind === kind && owned.has(def.id)) total += def.comfort.amount;
  }
  if (kind === 'rest' && homeSetComplete(owned)) total += SETTLED_HOME_REST_BONUS; // synergy > sum
  return total;
}

export interface HomeTierDef {
  readonly tier: number;
  /** The rung this tier is granted through (its D-110 beat). */
  readonly rung: RankId;
  readonly label: string;
  readonly kanji: string;
  readonly blurb: string;
}

export const HOME_TIERS: readonly HomeTierDef[] = [
  {
    tier: 0,
    rung: 'R1',
    label: 'Your corner',
    kanji: '寝床',
    blurb:
      'A dry corner of the grain-store, kept back for you — a mat, a bowl, a place to lay your head. Small, but yours.',
  },
  // ── DEFERRED (T1+, D-111 §2.1) — the home GROWS with your rung, a domestic mirror of the estate
  //    flywheel: Servant's room (~R5, "onto the household staff proper", ranks.ts) → Your own
  //    quarters (~R7, "the inner rooms"). Each upgrade rides its D-110 rung beat (motivated, never a
  //    silent pop-in) and holds a fuller set. NOT BUILT here — the seam is this list + the reveal
  //    surface pattern (surfaces.ts `panel-home`), ready to extend to `panel-home-r5` / `-r7`.
  // ── DEFERRED (T1+, D-111 §2.4) — the STATUS-MIRROR: the home renders the economy's status TOKENS
  //    (surname name-plate → the two swords on the wall → gōshi dressing) as they're earned. It needs
  //    the D-109 status tokens (economy Phase 5), which don't exist yet — so it is a seam, not code.
];

/** The R1 home reveal line — cashes "a place here is yours" (dialogue.ts:81) into a real space. */
export const HOME_REVEAL_LINE =
  'A dry corner of the grain-store is kept back for you now — a straw mat, a bowl, a place to lay your head. "A place here is yours," the old man said. Small, but yours to keep.';

/** The `rest` result line, re-sited to your corner (T0-A). Varies on whether you sleep on the bare
 *  mat or a bought futon — the comfort you earned reads in the prose, not only the number. */
export function homeRestLine(hasBedding: boolean): string {
  return hasBedding
    ? 'You lie down on the futon in your corner. The ache dulls, and you wake the better for it.'
    : 'You lie down in your corner, on the thin straw mat. The ache dulls; the light through the slats shifts.';
}
