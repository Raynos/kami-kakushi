import { describe, it, expect } from 'vitest';
import {
  HARNESS_TAINTS,
  isHarnessRun,
  originMarks,
  timeTaints,
} from './taints';

// Classification proofs: the auto-drop guard (index.ts) and the report's soften/exclude
// split (report.ts) both key on these sets — a membership change alters which files land
// on the human's disk and which runs enter the vs-sim comparison, so the intended
// classification is pinned here (RED on any reclassification).

describe('taint taxonomy', () => {
  it('harness taints suppress the auto-drop; human DEV-tool taints do not', () => {
    expect(isHarnessRun(['fixture'])).toBe(true);
    expect(isHarnessRun(['qa-drive', 'save-import'])).toBe(true);
    expect(isHarnessRun(['forceState'])).toBe(true);
    expect(isHarnessRun(['speed>1', 'toRung', 'save-import'])).toBe(false);
    expect(isHarnessRun([])).toBe(false);
  });

  it('save-import is an origin mark, never a time taint', () => {
    expect(timeTaints(['save-import', 'speed>1'])).toEqual(['speed>1']);
    expect(originMarks(['save-import', 'speed>1'])).toEqual(['save-import']);
    expect(timeTaints(['save-import'])).toEqual([]);
  });

  it('every harness taint is also a time taint (a harness run never reads as clean)', () => {
    for (const t of HARNESS_TAINTS) expect(timeTaints([t])).toEqual([t]);
  });
});
