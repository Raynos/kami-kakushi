// The player's HOME — the "dry corner and a bowl" the story promises (ADR-111, FB-89). Genemon's
// cold-open wage is literally "a dry corner and a bowl" (intro.ts:266/314, dialogue.ts:74) and
// "a place here is yours" (dialogue.ts:81); this module is the reachable entity that prose owes —
// the narrative mirror of R6 (a thing that lives only in prose is as unbuilt as one that lives only
// in TypeScript). It holds a HOME space (granted at R1, where `rest` is sited) and a BELONGINGS
// inventory — possessions you OWN and KEEP, a category DISTINCT from resources (coin/rice/materials)
// and equipment (weapons): a belonging is never consumed by a verb, never carried into a fight, and
// never bitten by the combat-loss penalty (ADR-113).
//
// The bonus register is Edo COMFORT, NOT RPG stat-gear (ADR-111, non-negotiable — prestige over
// power): a piece of furniture buys better rest or a warmer, drier body, never a combat stat. The
// `ComfortKind` set below is CLOSED and holds no combat channel on purpose (the prestige-not-power
// invariant test asserts every belonging's kind is one of these, so a future "+atk pillow" fails
// the build). All magnitudes are LIQUID (ADR-059) — provisional, tuned by playtest.
//
// ── T0 SCOPE + the two DEFERRED seams (ADR-111 §2.1 / §2.4) ────────────────────────────────────────
//  · T0 ships ONE home tier — "your corner" at R1 (HOME_TIERS[0]). The home GROWING with your rung
//    (Servant's room ~R5 → your own quarters ~R7 — the domestic mirror of the estate flywheel) is
//    DEFERRED to T1+: each upgrade rides its ADR-110 rung beat and holds a fuller set. It is a DATA
//    seam here (see HOME_TIERS' trailing comment), NOT built.
//  · The STATUS-MIRROR layer (surname name-plate → the two swords on the wall → gōshi dressing) is
//    DEFERRED — it renders the economy's status TOKENS (ADR-109), which do not exist yet (economy
//    Phase 5). Seam only; not built. Do NOT wire it until the status tokens land.

import type { RankId } from './ranks';

/** The surface id that IS the home — revealed with the Inventory tab (ADR-177; ADR-184 rides the
 *  woodshed ZONE to the same rung, so the corner and the space that holds it arrive together).
 *  `rest` re-sites here, the Inventory tab's belongings section gates on it, and a `granted`
 *  belonging is auto-owned once it latches. */
export const HOME_SURFACE = 'panel-home';

/** The map node your corner IS (the lean space between the woodpiles). ONE source (TST1): the sited
 *  rest bonus (FB-409), the home affordances, and the hearth's cook locus (ADR-184) all read it. */
export const HOME_NODE = 'woodshed';

/** The COMFORT channels a belonging can grant. A CLOSED, prestige-only set — NEVER a combat stat
 *  (the ADR-111 guard; the invariant test pins it). Each routes through an EXISTING pure-core system so
 *  the bonus is real and felt, not a dead number. ADR-120 widened it to include `storage` (the chest's
 *  belongings capacity) — NOT a morale register (that whole system was declined). */
export type ComfortKind =
  | 'rest' // adds to the satiety a `rest` restores (bedding) — you wake mended, not merely rested
  | 'body' // adds to satietyMax — a warm, dry corner keeps more of your reserve (no T0 piece uses it now)
  | 'storage'; // belongings CAPACITY (the chest, ADR-120) — a dry buffer for what's yours; never a stat

export interface ComfortBonus {
  readonly kind: ComfortKind;
  readonly amount: number;
}

/** The chest's belongings STORAGE capacity (ADR-120) — a modest, legible buffer for what's yours. In
 *  T0 it is a shown prestige capacity (a seam for a T1+ overflow model); LIQUID (ADR-059). */
export const CHEST_STORAGE_CAPACITY = 6;

export interface BelongingDef {
  readonly id: string;
  readonly label: string;
  readonly kanji: string;
  /** Inked home detail (woodblock/ink, ADR-018) — reads as a possession, not a bare menu row. */
  readonly blurb: string;
  /** `null` ⇒ a flavour KEEPSAKE (the mat, the bowl) OR a diegetic piece whose value isn't a stat
   *  (the hearth, whose worth is that you COOK at it — see `homesCook`). A `ComfortBonus` ⇒ comfort
   *  FURNITURE with a real bonus (bedding rest / chest storage). */
  readonly comfort: ComfortBonus | null;
  /** ADR-120 — the hearth HOMES the cook verb (you boil your meals here), so its worth is diegetic, not
   *  a satiety stat. The renderer surfaces a cook affordance in the home when a `homesCook` piece is
   *  owned; the reducer's core `cook_meal` stays reachable elsewhere too (see intents.ts). */
  readonly homesCook?: boolean;
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
    blurb:
      'Quilted bedding to lay over the straw. You wake mended, not merely rested.',
    comfort: { kind: 'rest', amount: 5 },
    source: { kind: 'buy', coinCost: 60 },
    acquireLine:
      'You lay a quilted futon over the straw in your corner. The nights come easier now.',
  },
  {
    // ADR-120 — the hearth HOMES the cook verb (you boil your meals here). Its worth is diegetic —
    // where cooking happens — NOT the old flat +12 satietyMax stat (comfort: null, homesCook: true).
    id: 'hearth',
    label: 'A sunken hearth',
    kanji: '囲炉裏',
    blurb:
      'A small irori cut into the floor — a place to hang a pot and boil the wild greens into a hot meal, warm against the damp of a cold spring.',
    comfort: null,
    homesCook: true,
    source: { kind: 'buy', coinCost: 120 },
    acquireLine:
      'You cut a small irori into the corner floor. Now you have a place to cook a proper meal.',
  },
  {
    // ADR-120 — the chest is REAL STORAGE (a modest belongings buffer), NOT the old +5 satiety stat.
    // `storage` capacity is a prestige register (a dry place for what's yours), never a combat/satiety
    // stat — and deliberately holds BELONGINGS, not rice/goods, so it stays clear of the kura economy.
    id: 'chest',
    label: 'A clothes chest',
    kanji: '長持',
    blurb:
      'A long nagamochi chest for a spare robe and what little else is yours — a dry, safe place to keep your belongings.',
    comfort: { kind: 'storage', amount: CHEST_STORAGE_CAPACITY },
    source: { kind: 'buy', coinCost: 90 },
    acquireLine:
      'You set a nagamochi chest against the wall. Your few belongings keep dry, safe, and to hand.',
  },
];

export const BELONGING_IDS: ReadonlySet<string> = new Set(
  BELONGINGS.map((b) => b.id),
);

export function getBelonging(id: string): BelongingDef {
  const b = BELONGINGS.find((x) => x.id === id);
  if (!b) throw new Error(`unknown belonging: ${id}`);
  return b;
}

// ── the "settled home" SET / synergy (ADR-111 §2.3) — the whole is worth more than the sum. Owning
//    all three comfort pieces grants an ADDITIONAL rest bonus above stacking them, so the SET is the
//    reward, not raw accumulation. Keep the synergy small (ADR-059 liquid). ──
export const SETTLED_HOME_SET: readonly string[] = [
  'bedding',
  'hearth',
  'chest',
];
export const SETTLED_HOME_REST_BONUS = 4;

/** Do you own the full comfort SET (bedding + hearth + chest)? */
export function homeSetComplete(owned: ReadonlySet<string>): boolean {
  return SETTLED_HOME_SET.every((id) => owned.has(id));
}

/**
 * Total COMFORT of a given kind from an owned-belonging set (+ the settled-home synergy for
 * `rest`). PURE over the id set, so the reducer (the real rest) and the UI (the SHOWN bonus) read
 * the SAME number through the SAME fn — no preview/reality drift (AC-6). Returns 0 for an empty set,
 * so it is inert until you own comfort furniture.
 */
export function comfortBonus(
  owned: ReadonlySet<string>,
  kind: ComfortKind,
): number {
  let total = 0;
  for (const def of BELONGINGS) {
    if (def.comfort && def.comfort.kind === kind && owned.has(def.id))
      total += def.comfort.amount;
  }
  if (kind === 'rest' && homeSetComplete(owned))
    total += SETTLED_HOME_REST_BONUS; // synergy > sum
  return total;
}

/** ADR-120 — do you own a piece that HOMES the cook verb (the hearth)? PURE over the id set, so the
 *  renderer's cook-at-the-hearth affordance and any future core gate read the SAME truth (AC-6). */
export function homeHasCookLocus(owned: ReadonlySet<string>): boolean {
  for (const def of BELONGINGS)
    if (def.homesCook && owned.has(def.id)) return true;
  return false;
}

export interface HomeTierDef {
  readonly tier: number;
  /** The rung this tier is granted through (its ADR-110 beat). */
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
      'A lean corner of the woodshed, kept back for you — a mat, a bowl, a nail for the coat, a place to lay your head. Small, but yours.',
  },
  // ── DEFERRED (T1+, ADR-111 §2.1) — the home GROWS with your rung, a domestic mirror of the estate
  //    flywheel: Servant's room (~R5, "onto the household staff proper", ranks.ts) → Your own
  //    quarters (~R7, "the inner rooms"). Each upgrade rides its ADR-110 rung beat (motivated, never a
  //    silent pop-in) and holds a fuller set. NOT BUILT here — the seam is this list + the reveal
  //    surface pattern (surfaces.ts `panel-home`), ready to extend to `panel-home-r5` / `-r7`.
  // ── DEFERRED (T1+, ADR-111 §2.4) — the STATUS-MIRROR: the home renders the economy's status TOKENS
  //    (surname name-plate → the two swords on the wall → gōshi dressing) as they're earned. It needs
  //    the ADR-109 status tokens (economy Phase 5), which don't exist yet — so it is a seam, not code.
];

/** The R1 home reveal line — cashes "a place here is yours" (dialogue.ts:81) into a real space.
 *  G4: re-sited from the grain-store to the WOODSHED (the bible's "his corner" — a lean space
 *  between the woodpiles; FLAVOR.nodeWoodshedBlurb). */
export const HOME_REVEAL_LINE =
  'A lean corner of the woodshed is kept back for you now — a straw mat, a bowl, a nail for your coat, a place to lay your head. "A place here is yours," the old man said. Small, but yours to keep.';

/** The `rest` result line, re-sited to your corner (T0-A). Varies on whether you sleep on the bare
 *  mat or a bought futon — the comfort you earned reads in the prose, not only the number. */
export function homeRestLine(hasBedding: boolean): string {
  return hasBedding
    ? 'You lie down on the futon in your corner. The ache dulls, and you wake the better for it.'
    : 'You lie down in your corner, on the thin straw mat. The ache dulls; the light through the slats shifts.';
}
