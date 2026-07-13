// The Review pane's STORY half (split out of dev.ts, 2026-07-13 render-split): the ADR-139
// story take-set switcher. DEV-only, riding dev.ts's DEV fold.
import { el } from '../render';
import type { StoryTake, StoryTakeBundle } from '../storyTakes';
import { mono, hrChip } from './widgets';
import { openStoryReader } from './story-reader';
import type { DevApi } from '../dev';

export function buildStoryPane(opts: {
  pane: HTMLElement;
  dev: DevApi;
  rerender: () => void;
}): void {
  const { pane, dev, rerender } = opts;

  // ── ADR-139 — the STORY pane: one block per OPEN narrative-diverge bundle. Coarse
  //    set-switch (Canon / take …) keeps a whole coherent take live so pacing reads true;
  //    per-unit override rows below mix within the set. Swaps are display-only (takes are
  //    state-compatible) and re-render immediately; live swap covers the VN scene types
  //    (rung beats + intro scenes + generalized scene-defs — season-exit/scripted beats) +
  //    UI flavor lines (lock-hints) — dialogue/cold-open units read in the script-reader. ──
  if (dev.storyBundles.length === 0) {
    const empty = el('div', undefined, 'No open story diverges — nothing awaiting review.');
    empty.style.cssText = 'color:#9b8e78;padding:.3rem .1rem;';
    pane.append(empty);
  }
  // ONE explore page per diverge (human, 2026-07-07): each bundle section below carries
  // its OWN "⤢ Explore" link — no combined all-bundles modal.
  // FB-307 — rung-ordered with `— rung RX —` headers, mirroring the Variants pane: bundles
  // sort by the rung a player first meets them (authored as `rung:` in bundle.md). FB-312 —
  // NO catch-all "other" group: a rungless bundle carries its own `rungReason`, and each
  // distinct reason renders as its own `— other · <reason> —` header (reason'd bundles sort
  // after the numbered rungs, in registry order).
  // A bundle's reference is its ID (ADR-192 — the positional SV-tag is dead: an insert/prune
  // renumbered every tag after it). The row leads with the id; the human references a take as
  // "sleep-announce take b".

  const bundleHeader = (b: StoryTakeBundle): string =>
    b.rung !== undefined ? `— rung R${b.rung} —` : `— other · ${b.rungReason ?? '?'} —`;
  const rungOrderedBundles = dev.storyBundles
    .slice()
    .sort((a, b) => (a.rung ?? 99) - (b.rung ?? 99));
  let shownBundleHeader: string | undefined;
  for (const bundle of rungOrderedBundles) {
    if (bundleHeader(bundle) !== shownBundleHeader) {
      shownBundleHeader = bundleHeader(bundle);
      const rh = el('div', undefined, shownBundleHeader);
      rh.style.cssText =
        'color:#b08d4f;font-size:10px;text-transform:uppercase;letter-spacing:.08em;margin:.35rem 0 .1rem;opacity:.85;';
      pane.append(rh);
    }
    const sec = el('div');
    sec.style.cssText = 'border:1px solid #3a322a;border-radius:3px;';

    // ── the row reads EXACTLY like a Variants row (human, 2026-07-13: "I like the variants UI
    //    with click to expand, but the story review UI is always expanded"). Same collapsed
    //    two-line summary, same caret, same details fold. Two idioms for one job is the TST1
    //    failure this whole tab exists to fix — a story diverge and a UI diverge are different
    //    THINGS, but "pick one of these" is one gesture, so it gets one shape. ──
    const summary = el('div');
    summary.style.cssText =
      'display:flex;flex-direction:column;gap:.05rem;padding:.28rem .4rem;cursor:pointer;user-select:none;min-width:0;';
    const sTitle = el('div');
    sTitle.style.cssText = 'display:flex;align-items:baseline;gap:.35rem;min-width:0;';
    const sCaret = el('span', undefined, '▸');
    sCaret.style.cssText = 'color:#b08d4f;flex:0 0 auto;';
    const sLabel = el('span', undefined, `${bundle.id} · ${bundle.title}`);
    sLabel.style.cssText = 'color:#b08d4f;text-transform:uppercase;font-size:11px;min-width:0;';
    sTitle.append(sCaret, sLabel, hrChip(bundle.hr));
    // line 2 — the take currently live, so a collapsed row still says where the story stands
    const sPick = el('span', undefined, '');
    sPick.style.cssText =
      'color:#9b8e78;font-size:11px;padding-left:1.05rem;overflow-wrap:anywhere;min-width:0;';
    summary.append(sTitle, sPick);
    sec.append(summary);

    const details = el('div');
    details.style.cssText = 'display:none;flex-direction:column;gap:.25rem;padding:0 .4rem .35rem;';
    const explore = mono('⤢ Explore this diverge', () => {
      openStoryReader(bundle, dev);
    });
    explore.style.cssText += 'margin:.2rem 0;';
    details.append(explore);

    // the active take's brief (or the pick rationale on Canon) — refreshed on every click.
    const brief = el('div', undefined, '');
    brief.style.cssText = 'color:#9b8e78;font-size:11px;margin:.15rem 0;';

    const takeOf = (id: string): StoryTake | undefined => bundle.takes.find((t) => t.id === id);
    const setRow = el('div');
    setRow.style.cssText = 'display:flex;flex-wrap:wrap;gap:.25rem;margin-top:.2rem;';
    const setBtns = new Map<string, HTMLButtonElement>();
    const refresh = (): void => {
      const active = dev.getStoryTake(bundle.id);
      for (const [id, b] of setBtns) {
        const on = id === active;
        b.style.background = on ? '#b08d4f' : '#3a322a';
        b.style.color = on ? '#1c1814' : '#e7d9bc';
        b.style.fontWeight = on ? '700' : 'normal';
      }
      brief.textContent =
        active === 'canon'
          ? (bundle.rationale ?? 'Canon — the live pick.')
          : (takeOf(active)?.brief ?? '');
      // the collapsed row's second line: which take is live right now
      sPick.textContent = setBtns.get(active)?.textContent ?? '';
    };
    const takeBtn = (id: string, label: string): void => {
      const b = mono(label, () => {
        dev.setStoryTake(bundle.id, id);
        refresh();
        rerender();
      });
      setBtns.set(id, b);
      setRow.append(b);
    };
    // every option carries its textual label — canon included (human, 2026-07-07).
    takeBtn('canon', `Canon — ${bundle.canonLabel ?? 'the pick'}`);
    for (const t of bundle.takes) takeBtn(t.id, `${t.id.toUpperCase()} — ${t.label}`);
    details.append(setRow, brief);
    // Per-unit overrides moved to the per-diverge explore page (human, 2026-07-07) —
    // this section stays focused: the labeled set toggle + the explore link.
    const hint = el(
      'div',
      undefined,
      'Swaps are display-only. To see a rung beat live: Settings → Rung → jump to it.',
    );
    hint.style.cssText = 'color:#9b8e78;font-size:10px;margin-top:.25rem;opacity:.8;';
    details.append(hint);
    sec.append(details);

    summary.addEventListener('click', () => {
      const hidden = details.style.display === 'none';
      details.style.display = hidden ? 'flex' : 'none';
      sCaret.textContent = hidden ? '▾' : '▸';
    });

    refresh();
    pane.append(sec);
  }
}
