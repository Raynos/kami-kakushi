// The DEV panel's PROTOTYPES pane (split out of dev.ts, 2026-07-13 render-split): the six
// `⤢` full-screen launchers. DEV-only, riding dev.ts's DEV fold.
import { el } from '../render';
import { openT1Map, openT2Map } from '../map-sheets/sheet';
import { openStampBook } from '../stamp-book/book';
import { openEstateSheet } from '../estate-sheet/demo';
import { openSceneCards } from '../scene-cards/cards';
import { openSceneCardsV1 } from '../scene-cards/cards-v1';
import { mono } from './widgets';

export function buildProtosPane(opts: { pane: HTMLElement }): void {
  const { pane } = opts;

  // ── FB-305/FB-306 — the PROTOTYPES pane: the six `⤢` full-screen launchers, moved out of
  //    Story (they drowned the diverge bundles) and grouped by shelf. The per-button history
  //    comments ride along:
  //    · Map sheets — T0/T1 review maps (2026-07-07 story reboot): the rebooted tier-sheet
  //      zone rosters as full-screen survey sheets, read-only, self-contained in map-sheets/
  //      (T0 + T1 side by side on purpose; T2 the valley downstream).
  //    · New UI — E3 stamp book (fable-2026-07-08-graphics-explorations.md; fixture-fed) and
  //      E1 estate sheet (okoshi-ezu cutaway, STANDALONE of map-sheets — spec in
  //      src/ui/estate-sheet/README.md, HR-16). Prototype-first law: zero game integration.
  //    · Parked — E2 scene-card pilots, human-parked 2026-07-08 with BOTH versions kept as
  //      concept references: v2 (kage-e + press — the kept look) and v1 (figurative — ruled slop).
  const protoGroup = (title: string): void => {
    const hdr = el('div', undefined, title);
    hdr.style.cssText =
      'font-weight:700;color:#b08d4f;text-transform:uppercase;letter-spacing:.05em;font-size:10px;' +
      `margin-top:${pane.childElementCount === 0 ? '0' : '.5rem'};padding-bottom:.15rem;border-bottom:1px solid #b08d4f;margin-bottom:.2rem;`;
    pane.append(hdr);
  };
  const protoBtn = (label: string, open: () => void): void => {
    const b = mono(label, open);
    b.style.cssText += 'margin-bottom:.2rem;text-align:left;';
    pane.append(b);
  };
  protoGroup('Map sheets');
  protoBtn('⤢ T1 map — the estate at its true scale', () => openT1Map());
  protoBtn('⤢ T2 map — the valley, Asagiri downstream', () => openT2Map());
  protoGroup('New UI (E3 / E1)');
  protoBtn('⤢ Stamp book — E3 progression prototype', () => openStampBook());
  protoBtn('⤢ Estate sheet — E1 okoshi-ezu prototype', () => openEstateSheet());
  protoGroup('Parked UI prototypes');
  protoBtn('⤢ Scene cards v2 — kage-e (E2 · parked)', () => openSceneCards());
  protoBtn('⤢ Scene cards v1 — figurative (E2 · parked)', () =>
    openSceneCardsV1(),
  );
}
