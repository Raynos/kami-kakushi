// ADR-139 · the "Explore story" full-page script-reader (split out of dev.ts, 2026-07-13
// render-split) — DEV-only, riding dev.ts's DEV fold; READ-ONLY (sign-off stays
// conversational; no canon writes).
import {
  DIALOGUES,
  DIALOGUE_SCENES,
  NPC_NAME,
  NPC_VOICE,
  PLAYER_SPEAKER,
  RUNG_BEATS,
  sceneById,
  RUNG_REQUIREMENTS,
  getRank,
  type RankId,
} from '../../core';
import { el } from '../render';
import { COLD_OPEN } from '../../core/content/coldOpen';
import { FLAVOR } from '../../core/content/flavor';
import type { RungScene } from '../../core/content/rungBeats';
import type { DialogueScene } from '../../core/content/intro';
import type { StoryTake, StoryTakeBundle } from '../storyTakes';
import { takeSceneView, unitOfKey } from './take-subs';
import { DEV_SENTINEL } from './widgets';
import type { DevApi } from '../dev';

// not t0-story.md in an editor). READ-ONLY: sign-off stays conversational; no canon writes.
//
// FULL ADR-075 diverge (the locked split): three genuinely-distinct reading experiences,
// switchable live via the R/G/S pills in the modal header — each its own R-item:
//   annotated — the play-order script, canon inline, alternates nested under each unit;
//   galley    — units as rows, takes as columns (side-by-side compare at a glance);
//   stage     — ONE take read end-to-end (closest to how a player will hear it), local
//               take pills; units the take lacks fall back to canon, marked.
// Taste brief (Pass 1) — brainstorms/2026-07-06-narrative-diverge-design.md build appendix:
// clones .modal-scrim/.modal-card/.modal-close, speaker colour via `log-line voice-*`,
// instant paint (NOT story scope — no typewriter), script breathes / chrome dense (P19).
// ═══════════════════════════════════════════════════════════════════════════════════════════

interface ReaderLine {
  readonly voice: string;
  readonly speaker?: string | undefined;
  readonly text: string;
  readonly kind: 'line' | 'prompt' | 'option';
}

type ReaderScene = RungScene | DialogueScene;

/** Flatten a VN scene (rung beat / intro scene) into instant-paint script lines. */
function readerSceneLines(scene: ReaderScene): ReaderLine[] {
  const out: ReaderLine[] = [];
  const speakerName = scene.speaker ? NPC_NAME[scene.speaker] : undefined;
  for (const g of scene.greeting) {
    out.push({
      voice: g.voice,
      speaker: g.speaker,
      text: g.text,
      kind: 'line',
    });
  }
  for (const t of scene.topics) {
    out.push({
      voice: 'player',
      speaker: PLAYER_SPEAKER,
      text: t.label,
      kind: 'line',
    });
    for (const a of t.answer) {
      out.push({
        voice: a.voice,
        speaker: a.speaker,
        text: a.text,
        kind: 'line',
      });
    }
  }
  out.push({ voice: 'narrator', text: scene.decision.prompt, kind: 'prompt' });
  for (const o of scene.decision.options) {
    out.push({
      voice: 'player',
      speaker: PLAYER_SPEAKER,
      text: o.say,
      kind: 'option',
    });
    const rn = 'reactNpc' in o && o.reactNpc ? o.reactNpc : undefined;
    out.push({
      voice: rn ? NPC_VOICE[rn] : scene.voice,
      speaker: rn ? NPC_NAME[rn] : speakerName,
      text: o.react,
      kind: 'line',
    });
  }
  return out;
}

/** Every unit key a bundle's takes touch, in reading order (cold-open → intro → rungs → dialogue). */
function readerUnitsOf(bundle: StoryTakeBundle): string[] {
  const keys = new Set<string>();
  for (const t of bundle.takes) {
    for (const k of [
      ...Object.keys(t.text ?? {}),
      ...Object.keys(t.seq ?? {}),
    ]) {
      keys.add(unitOfKey(k));
    }
  }
  // a req-flavor / req-objective bundle reads as the WHOLE ladder: include every registry
  // requirement, canon-only ones too (their alternate columns show "no take — canon plays"),
  // so a rung's section is its complete set, never just the diverged subset.
  const hasNs = (ns: string): boolean =>
    bundle.takes.some((t) =>
      Object.keys(t.text ?? {}).some((k) => k.startsWith(`${ns}.`)),
    );
  if (hasNs('requirement')) {
    for (const reqs of Object.values(RUNG_REQUIREMENTS)) {
      for (const r of reqs) keys.add(`req-flavor:${r.id}`);
    }
  }
  if (hasNs('req-objective')) {
    for (const reqs of Object.values(RUNG_REQUIREMENTS)) {
      for (const r of reqs) keys.add(`req-objective:${r.id}`);
    }
  }
  const order = (k: string): number =>
    k.startsWith('cold-open:')
      ? 0
      : k.startsWith('intro:') || k.startsWith('intro-title:')
        ? 1
        : k.startsWith('scene:')
          ? 2
          : k.startsWith('rung:')
            ? 2
            : k.startsWith('flavor:')
              ? 4
              : k.startsWith('req-flavor:') || k.startsWith('req-objective:')
                ? 5
                : 3;
  // req-flavor / req-objective keys order by their REGISTRY placement (rung, then authored
  // position), never alphabetically — the explore page reads as the ladder.
  const sub = (k: string): number =>
    k.startsWith('req-flavor:')
      ? (reqFlavorPlacement(k.slice('req-flavor:'.length))?.order ?? 9999)
      : k.startsWith('req-objective:')
        ? (reqFlavorPlacement(k.slice('req-objective:'.length))?.order ?? 9999)
        : 0;
  return [...keys].sort(
    (a, b) => order(a) - order(b) || sub(a) - sub(b) || a.localeCompare(b),
  );
}

/** The content of `unit` in `take` ('canon' reads the LIVE registries). Null ⇒ absent. */
function readerUnitLines(
  unit: string,
  take: StoryTake | 'canon',
): ReaderLine[] | null {
  const [kind, key] = [
    unit.slice(0, unit.indexOf(':')),
    unit.slice(unit.indexOf(':') + 1),
  ];
  // step B2 — a take is a flat text map + narration-run sequences on CANON structure:
  // scene columns rebuild the canon def with the take's words (takeSceneView), flat
  // classes are one lookup into take.text.
  const flat = (
    contentKey: string,
    canon: string | undefined,
  ): string | undefined => (take === 'canon' ? canon : take.text?.[contentKey]);
  if (kind === 'rung') {
    const canon = RUNG_BEATS[key as RankId];
    if (!canon) return null;
    const s =
      take === 'canon' ? canon : takeSceneView(`beat.${key}`, canon, take);
    return s ? readerSceneLines(s) : null;
  }
  if (kind === 'intro') {
    const canon = DIALOGUE_SCENES.find((x) => x.id === key);
    if (!canon) return null;
    const s =
      take === 'canon' ? canon : takeSceneView(`intro.${key}`, canon, take);
    return s ? readerSceneLines(s) : null;
  }
  if (kind === 'scene') {
    // generalized scene-defs (season-exit / scripted VN beats) — canon is the LIVE
    // SCENES registry body; trigger/once stay canon (state-compatible takes).
    const canon = sceneById(key)?.scene;
    if (!canon) return null;
    const s =
      take === 'canon' ? canon : takeSceneView(`scene.${key}`, canon, take);
    return s ? readerSceneLines(s) : null;
  }
  if (kind === 'dialogue') {
    const d = DIALOGUES.find((x) => x.id === key);
    if (!d) return null;
    // a dialogue take re-voices a SUBSET by canon line id — show exactly the covered lines.
    const lines =
      take === 'canon'
        ? d.lines
        : d.lines
            .filter((l) => take.text?.[`dialogue.${key}.${l.id}`] !== undefined)
            .map((l) => ({
              ...l,
              text: take.text![`dialogue.${key}.${l.id}`]!,
            }));
    return lines.length > 0
      ? lines.map((l) => ({
          voice: l.voice ?? 'villager',
          speaker: d.speaker,
          text: l.text,
          kind: 'line' as const,
        }))
      : null;
  }
  if (kind === 'flavor') {
    const text = flat(`flavor.${key}`, (FLAVOR as Record<string, string>)[key]);
    return text ? [{ voice: 'narrator', text, kind: 'line' }] : null;
  }
  if (kind === 'intro-title') {
    // FB-362 — the scene's 幕-head label; canon reads the LIVE scene's `title:` (intro.gen).
    const text = flat(
      `intro-title.${key}`,
      DIALOGUE_SCENES.find((x) => x.id === key)?.title,
    );
    return text
      ? [{ voice: 'narrator', text: `— ${text} —`, kind: 'line' }]
      : null;
  }
  if (kind === 'req-flavor') {
    // FB-121 requirement-completion lines — canon reads the LIVE registry by requirement id.
    const canon = Object.values(RUNG_REQUIREMENTS)
      .flat()
      .find((r) => r.id === key)?.flavor;
    const text = flat(`requirement.${key}`, canon);
    return text ? [{ voice: 'narrator', text, kind: 'line' }] : null;
  }
  if (kind === 'req-objective') {
    // HD-41 — the Progress-tab statement of the finished work; canon reads the LIVE registry.
    const canon = Object.values(RUNG_REQUIREMENTS)
      .flat()
      .find((r) => r.id === key)?.objective;
    const text = flat(`req-objective.${key}`, canon);
    return text ? [{ voice: 'narrator', text, kind: 'line' }] : null;
  }
  const text = flat(
    `cold-open.${key}`,
    (COLD_OPEN as Record<string, string>)[key],
  );
  return text ? [{ voice: 'narrator', text, kind: 'line' }] : null;
}

/** Append `lines` as an instant-paint script block (the reading register — it breathes).
 *  A line whose text is byte-identical to canon (`canonTexts`) DIMS and labels itself —
 *  deliberate sharing must never read as a failed substitution (FB-124, TST4). */
function readerScriptBlock(
  host: HTMLElement,
  lines: readonly ReaderLine[],
  canonTexts?: ReadonlySet<string>,
): void {
  const block = el('div');
  block.style.cssText =
    'display:flex;flex-direction:column;gap:.5rem;max-width:62ch;';
  for (const l of lines) {
    const line = el('div');
    line.className = `log-line voice-${l.voice}`;
    line.style.cssText = 'font-size:1rem;line-height:1.65;';
    if (l.kind === 'prompt')
      line.style.cssText +=
        'font-weight:700;color:var(--ink);margin-top:.35rem;';
    if (l.kind === 'option') line.style.cssText += 'margin-top:.4rem;';
    line.textContent =
      (l.kind === 'option' ? '▸ ' : '') +
      (l.speaker ? `${l.speaker}: ${l.text}` : l.text);
    if (canonTexts?.has(l.text)) {
      line.style.opacity = '.45';
      line.title = 'identical to canon (shared line)';
    }
    block.append(line);
  }
  host.append(block);
}

/** A tight chrome chip (the dense register — labels, takes, briefs). */
function readerChip(
  text: string,
  tone: 'pick' | 'alt' | 'mute' = 'mute',
): HTMLElement {
  const c = el('span', undefined, text);
  const bg =
    tone === 'pick'
      ? 'var(--rokusho)'
      : tone === 'alt'
        ? 'var(--ai)'
        : 'var(--ink-faint)';
  c.style.cssText =
    `display:inline-block;background:${bg};color:var(--washi);border-radius:3px;` +
    'padding:.05rem .45rem;font-size:11px;letter-spacing:.08em;text-transform:uppercase;';
  return c;
}

// FB-121 req-flavor placement: units group PER RUNG (human, 2026-07-07 — the explore
// page reads as the ladder, not 23 flat items), ordered by rung then authored position.
function reqFlavorPlacement(
  reqId: string,
): { section: string; order: number } | null {
  const rungs = Object.keys(
    RUNG_REQUIREMENTS,
  ) as (keyof typeof RUNG_REQUIREMENTS)[];
  for (let r = 0; r < rungs.length; r++) {
    const reqs = RUNG_REQUIREMENTS[rungs[r]!];
    const i = reqs.findIndex((x) => x.id === reqId);
    if (i >= 0) {
      const rank = getRank(rungs[r]!);
      return {
        section: `${rungs[r]} · ${rank.title} ${rank.kanji}`,
        order: r * 100 + i,
      };
    }
  }
  return null;
}

// Unit kinds that swap LIVE in the running game (rung/intro/flavor at render time;
// req-flavor/dialogue via the CORE overlays — ADR-139: every diverge unit reviews in
// the switcher).
// 2026-07-13 ruling (session-200, dialogue live-swap plan): a DEV take flip re-renders
// EVERYTHING, logged lines included — the log repaint (render.ts renderLog epoch check)
// re-derives every KEYED entry from the current registries + overlays, superseding the
// old "logged history never rewrites" carve-out FOR DEV SWITCHING (T2 still protects
// the prod player: all of this folds away in a strip build).
// dialogue: M7 — live via the CORE overlay (__setDialogueTextOverride), whole-dialogue
// units, text-only (ids/gates stay canon).
// cold-open: the RENDER-READ title-card keys swap live (subColdOpen); its one core-emitted
// key (`coldOpen.rake`) is canon LOGIC (parametrized, carried by no take), and the
// intro-reused keys ride their scene's own intro: swap.
// intro-title: FB-362 — live via the CORE overlay (__setIntroTitleOverride); a logged
// line's 幕-head `context` is baked UNKEYED, so history keeps its heads until context
// gains a key (known residue, plan §Risks).
export const LIVE_UNITS =
  /^(rung|intro|intro-title|scene|flavor|req-flavor|req-objective|dialogue):|^cold-open:(lede|cta)$/;

function readerUnitHeader(
  host: HTMLElement,
  unit: string,
  extra?: HTMLElement,
): void {
  const h = el('div');
  h.style.cssText =
    'display:flex;align-items:center;gap:.5rem;margin:1.4rem 0 .6rem;padding-top:.9rem;' +
    'border-top:1px solid var(--ink-faint);';
  h.append(readerChip(unit, 'mute'));
  if (extra) h.append(extra);
  host.append(h);
}

/** Variant "galley" — units as rows, takes as columns (side-by-side compare). */
function renderReaderGalley(
  host: HTMLElement,
  bundle: StoryTakeBundle,
  dev?: DevApi,
): void {
  let lastSection: string | null = null;
  for (const unit of readerUnitsOf(bundle)) {
    // grouped sections (req-flavor groups per rung; other kinds are groupless today):
    // a heading lands whenever the section changes — the page reads as the ladder.
    const section = unit.startsWith('req-flavor:')
      ? (reqFlavorPlacement(unit.slice('req-flavor:'.length))?.section ?? null)
      : unit.startsWith('req-objective:')
        ? (reqFlavorPlacement(unit.slice('req-objective:'.length))?.section ??
          null)
        : null;
    if (section !== null && section !== lastSection) {
      const sh = el('div', undefined, section);
      sh.style.cssText =
        'margin:2rem 0 .2rem;font-weight:700;color:var(--gold, #b08d4f);' +
        'letter-spacing:.08em;text-transform:uppercase;font-size:13px;' +
        'border-bottom:1px solid var(--ink-faint);padding-bottom:.3rem;';
      host.append(sh);
    }
    lastSection = section;
    // the per-unit override lives HERE, beside the unit it pins (human, 2026-07-07 —
    // the DEV panel section stays a clean set toggle). '·' = follow the bundle set.
    let extra: HTMLElement | undefined;
    if (dev) {
      extra = el('div');
      extra.style.cssText = 'display:flex;gap:.25rem;align-items:center;';
      const uBtns = new Map<string | undefined, HTMLButtonElement>();
      const uRefresh = (): void => {
        const cur = dev.getStoryUnit(bundle.id, unit);
        for (const [id, b] of uBtns) {
          const on = id === cur;
          b.style.background = on ? 'var(--gold, #b08d4f)' : 'transparent';
          b.style.color = on ? '#1c1814' : 'var(--ink, #e7d9bc)';
        }
      };
      const uBtn = (
        id: string | undefined,
        label: string,
        title: string,
      ): void => {
        const b = el('button', undefined, label) as HTMLButtonElement;
        b.type = 'button';
        b.title = title;
        b.style.cssText =
          'border:1px solid var(--ink-faint);border-radius:3px;padding:.05rem .35rem;' +
          'font:inherit;font-size:11px;cursor:pointer;background:transparent;color:var(--ink);';
        b.addEventListener('click', () => {
          dev.setStoryUnit(bundle.id, unit, id);
          uRefresh();
        });
        uBtns.set(id, b);
        extra!.append(b);
      };
      uBtn(undefined, '·', 'follow the bundle set');
      uBtn(
        'canon',
        `canon — ${bundle.canonLabel ?? 'the pick'}`,
        'pin this unit to canon',
      );
      for (const t of bundle.takes)
        uBtn(t.id, t.id.toUpperCase(), `${t.id} — ${t.label}`);
      uRefresh();
    }
    const chipLabel = unit.startsWith('req-flavor:')
      ? unit.slice('req-flavor:'.length)
      : unit.startsWith('req-objective:')
        ? unit.slice('req-objective:'.length)
        : unit;
    readerUnitHeader(
      host,
      LIVE_UNITS.test(unit) ? chipLabel : `${chipLabel} (reader-only)`,
      extra,
    );
    const scroll = el('div');
    scroll.style.cssText = 'overflow-x:auto;';
    const row = el('div');
    const cols = 1 + bundle.takes.length;
    row.style.cssText = `display:grid;grid-template-columns:repeat(${cols},minmax(17rem,1fr));gap:1rem;`;
    const cell = (
      head: HTMLElement,
      lines: ReaderLine[] | null,
      canonTexts?: ReadonlySet<string>,
    ): void => {
      const c = el('div');
      c.style.cssText =
        'border:1px solid var(--ink-faint);padding:.7rem .8rem;min-width:0;';
      const hd = el('div');
      hd.style.cssText =
        'margin-bottom:.5rem;display:flex;gap:.5rem;flex-wrap:wrap;';
      hd.append(head);
      c.append(hd);
      if (lines) readerScriptBlock(c, lines, canonTexts);
      else {
        const none = el(
          'div',
          undefined,
          '— no take for this unit (canon plays) —',
        );
        none.style.cssText = 'color:var(--ink-faint);font-size:12px;';
        c.append(none);
      }
      row.append(c);
    };
    const canonLines = readerUnitLines(unit, 'canon');
    const canonTexts = new Set((canonLines ?? []).map((l) => l.text));
    cell(
      readerChip(`canon · ${bundle.canonLabel ?? 'the pick'}`, 'pick'),
      canonLines,
    );
    for (const t of bundle.takes) {
      cell(
        readerChip(`${t.id} · ${t.label}`, 'alt'),
        readerUnitLines(unit, t),
        canonTexts,
      );
    }
    scroll.append(row);
    host.append(scroll);
  }
}

/** Open the full-page reader. Returns the scrim (exposed for tests).
 *  Galley-only since FB-125: the human picked Galley columns FIRM (HR-9 ✅);
 *  the annotated/stage variants were retired (recoverable from git history +
 *  the HR-9 archive record). */
export function openStoryReader(
  bundle: StoryTakeBundle,
  dev?: DevApi,
): HTMLElement {
  const scrim = el('div');
  scrim.className = 'modal-scrim';
  scrim.dataset['dev'] = DEV_SENTINEL;
  const card = el('div');
  card.className = 'modal-card frame';
  // FB-122/FB-123 — a true full-page reading surface. The CARD never scrolls (the .frame
  // key-lines stay intact — scrolling the frame itself left its absolute ::after border
  // stranded mid-content); title + pills pin, and the content pane below scrolls internally
  // (the "chrome pinned, panes scroll" idiom).
  card.style.cssText =
    'max-width:none;width:100%;height:calc(100dvh - 2rem);overflow:hidden;' +
    'display:flex;flex-direction:column;';
  scrim.append(card);

  const close = el('button', undefined, '×');
  close.className = 'modal-close';
  close.type = 'button';
  close.setAttribute('aria-label', 'Close the story reader');
  card.append(close);

  const title = el('div');
  title.className = 'modal-title';
  const kami = el('span', undefined, '物語');
  kami.className = 'kami';
  // ONE explore page per diverge (human, 2026-07-07) — the page IS the bundle, titled by its id.
  const roman = el(
    'span',
    undefined,
    `Explore story — ${bundle.id} · ${bundle.title}`,
  );
  roman.className = 'roman';
  title.append(kami, roman);
  card.append(title);

  // galley-only since FB-125 (HR-9 ✅ — the human picked Galley columns firm).
  // the ONE scrolling region (FB-123) — the frame + title above never move.
  const content = el('div');
  content.style.cssText =
    'flex:1 1 auto;min-height:0;overflow-y:auto;padding-right:.5rem;margin-top:1rem;';
  if (bundle.review) {
    const rv = el('div', undefined, `review doc: ${bundle.review}`);
    rv.style.cssText = 'color:var(--ink-faint);font-size:12px;';
    content.append(rv);
  }
  renderReaderGalley(content, bundle, dev);
  card.append(content);

  const dismiss = (): void => {
    document.removeEventListener('keydown', onKey);
    scrim.remove();
  };
  const onKey = (e: KeyboardEvent): void => {
    if (e.key === 'Escape') dismiss();
  };
  close.addEventListener('click', dismiss);
  scrim.addEventListener('click', (e) => {
    if (e.target === scrim) dismiss();
  });
  document.addEventListener('keydown', onKey);

  document.body.append(scrim);
  return scrim;
}
