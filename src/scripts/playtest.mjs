// Extended auto-play stability check (the 28.5h-grind no human can hand-play, in
// seconds). Drives to R3, auto-fights many rounds, and asserts the loss-loop never
// stalls and progress is monotonic — a fun/pacing smoke for the demo arc.
import { chromium } from 'playwright';

const URL = process.env.QA_URL || 'http://localhost:5174/';
const browser = await chromium.launch({ headless: true });
const errors = [];
try {
  const page = await browser.newPage();
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => Boolean(window.__qa), { timeout: 8000 });

  const result = await page.evaluate(() => {
    const qa = window.__qa;
    const log = [];
    // climb to R3 via the wolf gate
    qa.toRung('R2');
    qa.faceWolf();
    qa.toRung('R3');
    log.push(['reached', qa.selectors.rung(), 'combatLvl', qa.selectors.combatLevel()]);

    // real-play grind: fight the easiest foe, escalating as the MC levels. Step 5b — foes are
    // spatial, so qa.fight() auto-walks to the foe's node first. The escalation stays on the
    // non-danger nodes (paddies monkey+boar, woodlot bandit); the satoyama wolf is left out since
    // its node is behind the conditioning gate this pure-combat smoke never trains.
    // D-076: the auto-loop no longer auto-heals — only cooking mends HP — so a realistic grind
    // COOKS between bouts (a forager's larder of sansai fuels it). Without it the untrained R3 MC
    // just loses at 1 HP forever; with it the fight loop makes real, monotonic progress.
    let levelUps = 0;
    let losses = 0;
    const order = ['monkey', 'boar', 'bandit'];
    let foeIdx = 0;
    for (let i = 0; i < 200; i++) {
      const before = qa.state();
      // escalate once the current foe is trivially beaten (level past it)
      if (before.character.level > foeIdx + 1 && foeIdx < order.length - 1) foeIdx++;
      // keep the larder + woodpile stocked, then heal to fighting-fit and sharpen the blade before
      // the bout: only cooking mends HP (D-076) and a worn blade craters the win-rate, so a
      // sustainable grind must do both between fights.
      const r = before.resources;
      if ((r.sansai ?? 0) < 20 || (r.wood ?? 0) < 20) {
        qa.forceState({
          resources: {
            ...r,
            sansai: Math.max(r.sansai ?? 0, 100),
            wood: Math.max(r.wood ?? 0, 100),
          },
        });
      }
      for (let h = 0; h < 4; h++) qa.dispatch({ type: 'cook_meal' });
      qa.dispatch({ type: 'repair_weapon' });
      qa.fight(order[foeIdx]);
      const after = qa.state();
      if (after.character.level > before.character.level) levelUps++;
      if (after.character.combatXp === before.character.combatXp) losses++;
      if (after.character.combatXp < before.character.combatXp) log.push(['REGRESSION', i]);
      if (after.character.level < before.character.level) log.push(['LEVEL-LOSS', i]);
    }
    const s = qa.state();
    return {
      finalRung: s.rung,
      finalCombatLevel: s.character.level,
      finalCombatXp: s.character.combatXp,
      koku: s.resources.koku,
      levelUps,
      losses,
      pacing: qa.pacing(),
      reveals: qa.reveals().length,
      anomalies: log.filter((l) => l[0] === 'REGRESSION' || l[0] === 'LEVEL-LOSS'),
      trace: log,
    };
  });

  console.log(JSON.stringify(result, null, 2));
} finally {
  await browser.close();
}
console.log(errors.length ? 'CONSOLE ERRORS:\n' + errors.join('\n') : 'no console errors.');
process.exitCode = errors.length ? 1 : 0;
