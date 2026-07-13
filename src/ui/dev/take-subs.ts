// ADR-139 take-substitution helpers (split out of dev.ts, 2026-07-13 render-split): rebuild
// a canon scene with a take's words on canon structure. DEV-only, riding dev.ts's DEV fold.
import { storyText, storySeq, type IntroSetupLine } from '../../core';
import type { RungScene } from '../../core/content/rungBeats';
import type { StoryTake } from '../storyTakes';
import type { DialogueScene } from '../../core/content/intro';

/** A gen-canonicalized contentKey → its switcher UNIT (`beat.R3.opt.x.say` → `rung:R3`). */
export function unitOfKey(key: string): string {
  const [ns, a] = key.split('.');
  if (ns === 'beat') return `rung:${a}`;
  if (ns === 'intro') return `intro:${a}`;
  if (ns === 'scene') return `scene:${a}`;
  if (ns === 'dialogue') return `dialogue:${a}`;
  if (ns === 'requirement') return `req-flavor:${a}`;
  if (ns === 'req-objective') return `req-objective:${a}`;
  if (ns === 'cold-open') return `cold-open:${a}`;
  if (ns === 'intro-title') return `intro-title:${a}`;
  return `flavor:${a}`;
}

/** Rebuild a VN scene with a take's words on CANON structure (ids, gates, mechanics
 *  untouched — the prose-only law). Identity when the lookups cover nothing, so canon
 *  renders keep their object-equality fast paths. Serves both scene shapes (RungScene
 *  and DialogueScene share greeting/topics/decision structurally); the lookups are the
 *  GLOBAL overlay for the live subs, or one specific take's maps for the reader galley. */
export function rebuildScene<S extends RungScene | DialogueScene>(
  ns: string,
  scene: S,
  text: (key: string) => string | undefined,
  seq: (key: string) => readonly IntroSetupLine[] | undefined,
): S {
  let touched = false;
  const greeting = seq(`${ns}.greeting`) ?? scene.greeting;
  if (greeting !== scene.greeting) touched = true;
  const topics = scene.topics.map((t) => {
    const label = text(`${ns}.topic.${t.id}.ask`);
    const answer = seq(`${ns}.topic.${t.id}.answer`);
    if (label === undefined && answer === undefined) return t;
    touched = true;
    return { ...t, label: label ?? t.label, answer: answer ?? t.answer };
  });
  const prompt = text(`${ns}.prompt`);
  if (prompt !== undefined) touched = true;
  const options = scene.decision.options.map((o) => {
    const label = text(`${ns}.opt.${o.id}.label`);
    const say = text(`${ns}.opt.${o.id}.say`);
    const react = text(`${ns}.opt.${o.id}.react`);
    const bonus = text(`${ns}.opt.${o.id}.bonus`);
    if (label === undefined && say === undefined && react === undefined && bonus === undefined) {
      return o;
    }
    touched = true;
    const next = {
      ...o,
      label: label ?? o.label,
      say: say ?? o.say,
      react: react ?? o.react,
    };
    if (bonus !== undefined && 'statBonus' in o && o.statBonus) {
      return { ...next, statBonus: { ...o.statBonus, note: bonus } };
    }
    return next;
  });
  if (!touched) return scene;
  const optionsChanged = options.some((o, i) => o !== scene.decision.options[i]);
  const decision =
    prompt !== undefined || optionsChanged
      ? { ...scene.decision, prompt: prompt ?? scene.decision.prompt, options }
      : scene.decision;
  return { ...scene, greeting, topics, decision } as S;
}

/** The live-sub view: rebuild on the GLOBAL overlay (what the switcher selected). */
export function overlayScene<S extends RungScene | DialogueScene>(ns: string, scene: S): S {
  return rebuildScene(ns, scene, storyText, storySeq);
}

/** The reader-galley view: rebuild one SPECIFIC take's column from its own maps,
 *  or null when the take does not touch this unit ("no take — canon plays"). */
export function takeSceneView<S extends RungScene | DialogueScene>(
  ns: string,
  canon: S,
  take: StoryTake,
): S | null {
  const covers = (k: string): boolean => k.startsWith(`${ns}.`);
  const touched =
    Object.keys(take.text ?? {}).some(covers) || Object.keys(take.seq ?? {}).some(covers);
  if (!touched) return null;
  return rebuildScene(
    ns,
    canon,
    (k) => take.text?.[k],
    (k) => take.seq?.[k],
  );
}
