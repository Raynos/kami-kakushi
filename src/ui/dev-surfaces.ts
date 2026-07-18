// The DIVERGED-SURFACE REGISTRY (ADR-075) — the single source the DEV panel's Review tab, the
// renderer's variant routing, and the `review-link` gate all read.
//
// It lives APART from dev.ts on purpose: dev.ts pulls in the whole panel (and, through the
// fixtures pane, `import.meta.glob`), so a plain node/tsx gate script cannot import it. The
// registry is DATA — data a gate must be able to read — so it gets its own module. dev.ts
// re-exports it, and the DEV-only fold still tree-shakes the whole thing out of prod.
//
// Every entry declares the HR-item it is waiting on (`hr`). That is not bookkeeping: a toggle
// the human is meant to judge, with no line in the queue she reads, is a toggle that does not
// exist (the "if it isn't in the queue, it doesn't exist" law). The `review-link` gate binds
// the two directions — the registry names its HR-item, and review.md names the V-tag to click.

import { __setZoneRevealMode } from '../core';

export interface VariantDef {
  id: string;
  label: string;
  /** A one-line gloss shown under the toggle so the human knows what they are picking. */
  blurb: string;
}
export interface SurfaceDef {
  id: string;
  label: string;
  /** The rung a player first meets this surface — the Review tab groups by it so the panel
   *  tracks a rung-by-rung QA (2026-07-09; matches review.md's rung grouping). Display-only;
   *  V-tags stay registry-ordered. Omit ⇒ sorts last ("other"). */
  rung?: number;
  /** A MODE surface flips a declaring-module DEV setter instead of rendering an alternate
   *  pane (the core reads the mode at play time — `renderSurfaceVariant` has no arm for it).
   *  Called on every pick AND once at hydration, so a `?<id>=<variant>` URL restores the mode
   *  on reload exactly as a click sets it. Inert in prod: the whole fold is stripped. */
  apply?: (variantId: string) => void;
  /** The HR-item this surface is waiting on (`HR-2C`) — REQUIRED, and checked by the
   *  `review-link` gate: the id must resolve to an OPEN item in review.md, and that item must
   *  name this surface's V-tag. A diverge with no queue line is a diverge the human never sees.
   *  A surface she has SETTLED keeps no toggle at all (ADR-075 zero flag-debt), so there is no
   *  "reference" escape here — unlike a story bundle, which she can keep for comparison. */
  hr: string;
  /** variants[0] is the prod DEFAULT (self-picked); the rest are DEV-only alternates. */
  variants: VariantDef[];
}

// A surface's reference — in the DEV panel, in review.md, in chat — is its `id` (`market`,
// `bestiary`). There is NO positional tag (2026-07-13, ADR-192): the old `V<n>`/`SV<n>` scheme
// numbered registry POSITIONS, so adding or pruning one entry renumbered every tag after it and
// two agents in one day sent the human to the wrong row. An id never renumbers. A variant's
// reference is likewise its own id (`market-b`).

// HD-41 (closed → ADR-191) — the `earned-line` surface (A ledger dot · B ruled entry · C
// docket) is GONE: the human played it and picked B (2026-07-13), so the ruled entry is the
// unconditional treatment and ADR-075's zero-flag-debt rule says a settled surface keeps no
// toggle. The WORDS locked the same day too (HR-41 → take B "the world, changed"), so the
// hd41-progress-objective story bundle is pruned as well — the objective lines ship in canon.
export const SURFACES: SurfaceDef[] = [
  {
    // FB-415 (talk-system redesign, plan step 3) — HOW asking works at the person row.
    // A (in-row plates) ships inline in render/map.ts; B/C live in variant-renderers,
    // DEV-only. All three read the same availableAsks/unheardAskCount selectors and
    // dispatch the real `ask` intent; answers render inline only (D4 — never a log).
    id: 'talk',
    hr: 'HR-45',
    rung: 0,
    label: 'Talk — everyday asks',
    variants: [
      {
        id: 'talk-a',
        label: 'A · in-row ask plates',
        blurb:
          'shipped default — the person row expands into small ask plates; the answer opens beneath, one at a time; heard plates dim',
      },
      {
        id: 'talk-b',
        label: 'B · VN-lite exchange',
        blurb:
          'one framed speech surface at the head of the pane — the answer as ceremony, asks as a vertical choice list, an explicit "Take your leave"',
      },
      {
        id: 'talk-c',
        label: 'C · mini-transcript',
        blurb:
          'the open row carries a short running exchange (your question, their answer, the last few kept) — conversation as conversation',
      },
    ],
  },
  {
    // ADR-201 (E3 compact) — the seal-book record strip on the Character tab.
    // A (concertina) ships inline in render/character.ts; B/C live in
    // variant-renderers, DEV-only. All three render the same stripFromState
    // derivation; the per-seal inspect popover is a shared primitive.
    id: 'stamp-book',
    hr: 'HR-46',
    rung: 2,
    label: 'Seal-book 朱印帳 (record strip)',
    variants: [
      {
        id: 'stamp-book-a',
        label: 'A · concertina strip',
        blurb:
          'shipped default — the folded book as a right→left panorama: pressed seals on the thread, the next slot named, the rest mystery; scrolls to the frontier',
      },
      {
        id: 'stamp-book-b',
        label: 'B · badge rail',
        blurb:
          'the pure collection register — eight seals as a dense grid, no thread, no book fiction; dates in tiny type (gym badges at their most literal)',
      },
      {
        id: 'stamp-book-c',
        label: 'C · open pages',
        blurb:
          'the book as an object — a small open spread (older press right, frontier left), page-edge stacks, ‹ › leafing; depth by leafing instead of panorama',
      },
    ],
  },
  {
    id: 'influence',
    hr: 'HR-2B',
    rung: 3,
    label: 'House-Influence grade',
    variants: [
      {
        id: 'influence-a',
        label: 'A · continuous bar',
        blurb:
          'Indigo→gold ink bar, ticks at Good/Great/Excellent (the shipped default).',
      },
      {
        id: 'influence-b',
        label: 'B · segmented bands',
        blurb:
          'Three lacquer band-boxes (Good/Great/Excellent); the current band fills.',
      },
      {
        id: 'influence-c',
        label: 'C · standing marks',
        blurb:
          'A row of ink marks ◆◇ filling toward Excellent — a diegetic tally.',
      },
    ],
  },
  {
    id: 'craft',
    hr: 'HR-2C',
    rung: 4,
    label: 'Crafting',
    variants: [
      {
        id: 'craft-a',
        label: 'A · work-order checklist',
        blurb:
          'Name…have/need rows, green once met, one Forge button (the shipped default).',
      },
      {
        id: 'craft-b',
        label: "B · smith's measures",
        blurb:
          'Each material a continuous ink fill-gauge toward the needed amount.',
      },
      {
        id: 'craft-c',
        label: 'C · diegetic assembly',
        blurb:
          'Each material shown as the part it becomes; a 整/未 verdict at the foot.',
      },
    ],
  },
  {
    // ADR-177 Phase 2 (ADR-075) — the Works 普請 projects home. A (the day-book page)
    // ships inline in render.ts; B/C live here, DEV-only.
    id: 'works',
    hr: 'HR-29',
    rung: 2,
    label: 'Works 普請 (projects home)',
    variants: [
      {
        id: 'works-a',
        label: 'A · the day-book page',
        blurb:
          'shipped default — projects as ledger lines: closed entries ruled through, the open entry priced, the future unruled',
      },
      {
        id: 'works-b',
        label: 'B · the work-site board',
        blurb:
          'one site card per project — the zones you walk, each carrying its concern state and the commissioning',
      },
      {
        id: 'works-c',
        label: 'C · the build ladder (interim)',
        blurb:
          'the pre-ADR-177 tracker shape — ladder rows + improve card, kept for comparison',
      },
    ],
  },
  {
    // ADR-177 Phase 2 (ADR-075, F5) — Estate 家: the house itself. A (the drawn sheet,
    // the E1 fold-in) ships inline; B/C live here, DEV-only.
    id: 'estate-house',
    hr: 'HR-30',
    rung: 6,
    label: 'Estate 家 (the house)',
    variants: [
      {
        id: 'estate-house-a',
        label: 'A · the house, drawn',
        blurb:
          'shipped default — the okoshi-ezu survey sheet as the tab anchor; rooms ink in as they reopen',
      },
      {
        id: 'estate-house-b',
        label: "B · the steward's reckoning",
        blurb:
          'the rooms as day-book lines — open/shut per room, the standing as the footing',
      },
      {
        id: 'estate-house-c',
        label: 'C · the rooms list (interim)',
        blurb: 'the pre-ADR-177 shape — the plain reopened-rooms card',
      },
    ],
  },
  {
    id: 'market',
    hr: 'HR-2A',
    rung: 1,
    label: 'Travelling market',
    variants: [
      {
        id: 'market-a',
        label: 'A · price-button list',
        blurb:
          'Flat rows: name + grant, a bare coin buy-button (the calm, shipped default).',
      },
      {
        id: 'market-b',
        label: 'B · posted price-board',
        blurb:
          'One notice: name … grant · price · 求, with stock/shortfall beneath.',
      },
      {
        id: 'market-c',
        label: "C · pedlar's ground-cloth",
        blurb:
          'Purse up top, emoji goods, remaining stock as continuous ochre ink.',
      },
    ],
  },
  // FB-262 — the Story log's VN GROUPS: HR-24 signed off on A · 幕 card (2026-07-10), so it
  // ships as THE prod rendering (render.ts stamps .scene-line/.scene-open/.scene-close; the
  // 幕-card look is unconditional in styles.css). The B/C alternates were stripped (zero
  // flag-debt); git history keeps the margin-rail + raised-plate takes.
  {
    id: 'quests',
    hr: 'HR-2D',
    rung: 5,
    label: 'Quests',
    variants: [
      {
        id: 'quests-a',
        label: 'A · woodblock cards',
        blurb:
          'Square .frame cards: title, blurb, ☑/☐ checklist, Take this on (the shipped default).',
      },
      {
        id: 'quests-b',
        label: 'B · 高札 notice-board',
        blurb:
          'Commission-bills on a board; a continuous-ink deeds stroke; 請ける to take.',
      },
      {
        id: 'quests-c',
        label: 'C · 用帳 field-ledger',
        blurb:
          'Aligned ledger rows: kind · note · ink tally · right-aligned coin column.',
      },
    ],
  },
  {
    id: 'bestiary',
    hr: 'HR-5',
    rung: 3,
    label: 'Bestiary',
    variants: [
      {
        id: 'bestiary-a',
        label: 'A · field-guide cards',
        blurb:
          'Foe cards: kanji seal · tell · win-rate · haunt; unfaced foes fogged (the default).',
      },
      {
        id: 'bestiary-b',
        label: 'B · danger ledger',
        blurb:
          'A ranked ink table easiest→deadliest, each foe a continuous danger-gauge (A19).',
      },
      {
        id: 'bestiary-c',
        label: 'C · 図鑑 scroll',
        blurb:
          'Diegetic scroll entries: a silhouette that inks into a portrait as you learn a foe.',
      },
    ],
  },
  // FB-102 / ADR-115 / ADR-116 / HR-7 — the Estate map surface is RESOLVED: the human picked
  //   H · 絵図 survey plan from the real-map diverge (2026-07-07, "V7D"), so the sheet now ships
  //   as THE prod map (render.ts imports map-variants/sheet-map.ts directly) and the losing takes
  //   (B/G schematics + I/J/K/L real-map takes) were stripped — ADR-075 zero flag-debt. NOTE:
  //   removing this group renumbered the DEV panel's V-tags for LATER surfaces (home V8→V7).
  // ADR-111 / FB-89 — the home / belongings panel (the deep-housing pass shipped ONE prod default,
  //   renderBelongings; this diverge adds the mandatory live DEV alternates). Every variant shows
  //   the SAME home data (header, owned belongings + comfort badges, the live comfort tally, and the
  //   buyable acquire list wired to `buy_belonging`) — only the PRESENTATION differs.
  {
    id: 'home',
    hr: 'HR-6',
    rung: 3,
    label: 'Home / belongings',
    variants: [
      {
        id: 'home-a',
        label: 'A · functional list',
        blurb:
          'The shipped default — owned keepsakes + furniture as inked rows, a comfort tally, a coin acquire list.',
      },
      {
        id: 'home-b',
        label: 'B · 一間 room cutaway',
        blurb:
          'A diegetic woodblock room: each belonging sits in its corner, comfort read from where it rests; the acquire list is "what the room still lacks".',
      },
      {
        id: 'home-c',
        label: 'C · 持ち物帳 ledger',
        blurb:
          'A household register: what you own as ruled ledger lines, comfort as marginal notes, buyable pieces as unfilled lines.',
      },
    ],
  },
  // ── Workspace layout + framing (multi-panel, M2) — LOCKED, not toggleable. The human picked
  //    屏風 folding-columns (`layout-byobu`) + soft cards (`framing-cards`) as the sole prod
  //    rendering (ADR-075 zero-flag-debt), so the `layout`/`framing` variant surfaces were pruned:
  //    render.ts stamps the two data-attributes as CONSTANTS and CSS does all the arranging. No
  //    dead variant code ships (the classic / 番付 / 巻物 layouts + woodblock-box / hairline
  //    framings were removed here and from styles.css). ──
  // ── FB-340 v2 (HR-31 confirmed 2026-07-11) — the porter piece IS the presence; the
  //    A/B rings toggle was deleted on the human's confirm (ADR-075 zero flag-debt). ──
  {
    // ADR-184 / HR-32b — how a zone ANNOUNCES itself. A MODE surface (see `apply`): the core
    // reads `zoneRevealMode()` when the reveal fires, so the pick bridges to unlock.ts's
    // DEV setter rather than rendering an alternate pane.
    //
    // It lived as a hand-placed section in the SETTINGS tab from a4863592 until 2026-07-13.
    // That put a review toggle in a tool pane — the human never found it, which is the whole
    // of TST1 ("one home for everything"): a thing awaiting a human verdict belongs in the
    // Review tab with every other thing awaiting a human verdict, whatever its mechanism.
    //
    // To feel it: load `rung-R2`, haul at the board until coin ≥ 10 (the gate's `sb-market`),
    // or forage then stand at the board (the kitchen's `sb-cook`), and watch the Story log
    // AFTER the scene closes. PROD ships 'vn' — the toggle strips with this panel.
    id: 'zone-reveal',
    hr: 'HR-32b',
    rung: 2,
    label: 'Zone announce (reveal mode)',
    apply: (id) =>
      __setZoneRevealMode(id === 'zone-reveal-ink' ? 'vn+ink' : 'vn'),
    variants: [
      {
        id: 'zone-reveal-vn',
        label: 'A · VN only',
        blurb:
          'shipped default — the scene that opened the zone IS the reveal; nothing fires after it closes',
      },
      {
        id: 'zone-reveal-ink',
        label: 'B · VN + map-ink',
        blurb:
          'the scene closes, then the zone inks onto the map with a line of its own',
      },
    ],
  },
];
