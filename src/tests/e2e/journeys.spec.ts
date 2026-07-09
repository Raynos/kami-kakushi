// Story-beat journeys — the reachability net (fable-2026-07-05-desktop-journey-e2e P2).
// Every test boots a fixture checkpoint (FB-6 — never grinds a meter), drives ONLY
// visible player controls via `press` (tap on touch, click on desktop), and asserts
// BOTH the state outcome (`__qa.state()` observation, never action) and the surface
// outcome (the thing a player would see). Runs on ALL projects.
//
// Each test's RED-proof is the plan's table row: choose/Continue wiring dead, a
// promotion that doesn't land, a talk-to-open gate broken, a stranded recovery loop —
// the reducer-level tests stay green while these go RED.
import { expect, test, type Page } from '@playwright/test';
import { boot, expectNoHorizontalOverflow, expectNoPageErrors, press } from './helpers';

/** Hurry the typewriter exactly as a player would — clicking the transcript
 *  advances a line — until one of the scene's interactive controls is visible. */
async function hurryTypewriter(page: Page): Promise<void> {
  // ':visible' matters: a plain .first() picks the first matching element in
  // DOM order EVEN IF HIDDEN, so the loop never saw the visible control behind
  // it and burned its full budget (60×40ms, several times per scene).
  const visibleControls = page.locator(
    'button.intro-ask:visible, button.intro-done:visible, button.intro-choice:visible, button.intro-continue:visible',
  );
  for (let i = 0; i < 60; i++) {
    if ((await visibleControls.count().catch(() => 0)) > 0) return;
    await page.locator('.vn-story').click({ position: { x: 20, y: 20 } });
    await page.waitForTimeout(40);
  }
}

/** Walk one VN scene through its ask → decide → Continue arc using only visible
 *  controls. Asks at most one topic (when the ask panel is up), declares "heard
 *  enough", picks the FIRST choice, presses Continue. Returns once the scene
 *  advanced (the next scene mounted, or the VN closed). */
async function playVnScene(page: Page): Promise<void> {
  await hurryTypewriter(page);
  const ask = page.locator('.vn-ask button.intro-ask:not(.asked):visible').first();
  if (await ask.isVisible().catch(() => false)) {
    await press(ask); // ask ≥1 topic — the decide grid must survive the detour
    await hurryTypewriter(page); // the answer types out too
  }
  const done = page.locator('button.intro-done:visible').first();
  if (await done.isVisible().catch(() => false)) {
    await press(done); // "I've heard enough" — flips the panel to decide
  }
  const choice = page.locator('button.intro-choice').first();
  await expect(choice, 'the decide grid never offered a choice').toBeVisible();
  await press(choice); // latches the option
  await hurryTypewriter(page); // the outcome types out before Continue shows
  const cont = page.locator('button.intro-continue');
  await expect(cont.first(), 'Continue never appeared after choosing').toBeVisible();
  await press(cont.first()); // intro: dispatches · rung: "Rung up" performs the ceremony (FB-153)
  // FB-153 — a rung beat holds its promotion ceremony IN the modal: a second
  // Continue (inside .vn-rung-ceremony) is the dispatching control there.
  const ceremonyCont = page.locator('.vn-rung-ceremony button.intro-continue');
  if (await ceremonyCont.isVisible().catch(() => false)) await press(ceremonyCont);
}

test('intro VN completes: cold boot to the working shell', async ({ page }) => {
  // The longest journey by design — the WHOLE intro, scene by scene. Boots with
  // instant text (the DEV QA affordance): what this test guards is the CHAIN
  // (every scene's decide grid enables → Continue dispatches → the shell
  // reveals), not the cadence; at 32ms/char it paid ~25s of typewriter. The
  // cold-open + rung-beat tests keep the real pacing + hurry-click path covered.
  test.setTimeout(120_000);
  const errors = await boot(page, undefined, { instantText: true });
  await press(page.locator('button.verb.primary')); // Open your eyes
  await page.waitForFunction('window.__qa.state().flags.awake === true');

  // every intro scene in sequence — ask, decide, Continue — until the VN yields
  // the shell. Bounded: the intro is a handful of scenes; 12 is generous.
  for (let i = 0; i < 12; i++) {
    if (
      !(await page
        .locator('.vn-scene')
        .isVisible()
        .catch(() => false))
    )
      break;
    await playVnScene(page);
    await page.waitForTimeout(150); // scene transition beat
  }

  // the shell must be revealed: the VN gone, the workspace live
  await expect(page.locator('.vn-scene'), 'the intro never released the shell').toBeHidden();
  await expect(page.locator('.workspace')).toBeVisible();
  await expectNoHorizontalOverflow(page, 'shell after intro');
  expectNoPageErrors(errors);
});

test('rung-beat completes: summons → choice → promotion lands', async ({ page }) => {
  const errors = await boot(page, 'rung-beat-ready');
  const rungBefore = await page.evaluate<string>('__qa.state().rung');

  await press(page.locator('.rung-head-trigger'));
  await page.waitForFunction('window.__qa.state().rungBeat !== null');
  await expect(page.locator('.vn-scene')).toBeVisible();

  await playVnScene(page);

  // the promotion applied — rung advanced — and the shell restored
  await page.waitForFunction(`window.__qa.state().rung !== ${JSON.stringify(rungBefore)}`);
  await expect(page.locator('.vn-scene'), 'the beat never released the shell').toBeHidden();
  await expect(page.locator('.workspace')).toBeVisible();
  await expectNoHorizontalOverflow(page, 'shell after rung beat');
  expectNoPageErrors(errors);
});

test('market loop: speak with Yohei, sell the rice, the coin rises', async ({ page }) => {
  const errors = await boot(page, 'rice-at-gate');
  const coinBefore = await page.evaluate<number>('__qa.state().resources.coin ?? 0');

  // Yohei stands the gate only on his MARKET DAYS (day % 7 ∈ {2,5} — YOHEI_MARKET_DAYS).
  // The fixture may land off-market; rest at the gate (rest never moves) until a market
  // day so the stall is open when we talk. Bounded well past a full week of days.
  await page.evaluate(`
    for (let i = 0; i < 200 && ![2, 5].includes(window.__qa.state().clock.day % 7); i++) {
      window.__qa.dispatch({ type: 'rest' });
    }
  `);

  await press(page.locator('.nav-tab', { hasText: '地図' })); // Map
  // ADR-114 talk-to-open: the market shows ONLY after speaking with the pedlar
  await expect(page.locator('.market-sell')).toBeHidden();
  await press(page.locator('button.person-talk', { hasText: 'Speak with Yohei' }));
  const sell = page.locator('.market-sell button.auto-toggle');
  await expect(sell, 'the market never opened from the talk').toBeVisible();
  await expect(sell).toBeEnabled();

  await press(sell); // Sell all rice
  await expect
    .poll(() => page.evaluate<number>('__qa.state().resources.coin ?? 0'), {
      message: 'the sale must land as carried coin',
    })
    .toBeGreaterThan(coinBefore);
  // the surface outcome (FB-171 — coin left the header; the Inventory kura card is
  // its readout home): the storehouse carried-coin line shows the new sum (not stale)
  const coinNow = await page.evaluate<number>('__qa.state().resources.coin ?? 0');
  await press(page.locator('.nav-tab', { hasText: '蔵' })); // Inventory
  const kuraCard = page.locator('.slice-do .rung-card, .rung-card').first();
  await expect(kuraCard, 'the kura card must surface the carried coin').toContainText('coin');
  expect(coinNow).toBeGreaterThan(coinBefore);
  expectNoPageErrors(errors);
});

test('kura deposit: store the coin, the banked figure updates', async ({ page }) => {
  const errors = await boot(page, 'at-kura-with-coin');
  const bankedBefore = await page.evaluate<number>('__qa.state().banked.coin ?? 0');

  await press(page.locator('.nav-tab', { hasText: '蔵' })); // Inventory
  await press(page.locator('button.auto-toggle', { hasText: 'Store all coin' }));

  await expect
    .poll(() => page.evaluate<number>('__qa.state().banked.coin ?? 0'), {
      message: 'the deposit must land in the kura',
    })
    .toBeGreaterThan(bankedBefore);
  // surface outcome: the storehouse footer line shows the stored sum
  await expect(page.locator('.rung-card .influence-when').first()).toContainText('stored');
  expectNoPageErrors(errors);
});

test('cook/heal cue: hurt MC cooks a meal, HP rises (D-076)', async ({ page }) => {
  const errors = await boot(page, 'post-loss-broke');
  const hpBefore = await page.evaluate<number>('__qa.state().character.hp');

  const cook = page.locator('button.verb', { hasText: 'Cook a meal' }).first();
  await expect(cook).toBeVisible();
  // hurt ⇒ the cook verb must read as the PRIMARY affordance (the cue, not just the verb)
  await expect(cook, 'a hurt MC must see Cook as primary').toHaveClass(/\bprimary\b/);
  await expect(cook).toBeEnabled();

  await press(cook);
  await expect
    .poll(() => page.evaluate<number>('__qa.state().character.hp'), {
      message: 'the meal must heal',
    })
    .toBeGreaterThan(hpBefore);
  expectNoPageErrors(errors);
});

test('repair bind: chop wood, mend the blade, durability rises', async ({ page }) => {
  const errors = await boot(page, 'worn-weapon-no-wood');
  const duraBefore = await page.evaluate<number>('__qa.state().weaponDurability');

  // walk to the woodlot through the REAL map (sickroom → forecourt → paddies → woodlot).
  await press(page.locator('.nav-tab', { hasText: '地図' }));
  // the survey-plan sheet (ADR-151): each zone's seal is an SVG travel control, not a <button>;
  // move_to is single-hop, so tap the adjacency chain in order (forecourt is the estate hub).
  await press(page.locator('.map-nav [data-node="forecourt"]:not([data-locked])'));
  await press(page.locator('.map-nav [data-node="paddies"]:not([data-locked])'));
  await press(page.locator('.map-nav [data-node="woodlot"]:not([data-locked])'));
  await page.waitForFunction(`window.__qa.state().location === 'woodlot'`);

  // chop twice (3 wood each; repair costs 5) — the recovery loop must not strand
  await press(page.locator('.nav-tab', { hasText: 'Work' }));
  const chop = page.locator('button.verb', { hasText: 'Cut wood' }).first();
  await expect(chop).toBeVisible();
  await press(chop);
  await press(chop);
  await page.waitForFunction('(window.__qa.state().resources.wood ?? 0) >= 5');

  await press(page.locator('.nav-tab', { hasText: '武' })); // Combat
  const repair = page.locator('button.auto-toggle', { hasText: 'Repair' });
  await expect(repair, 'the repair CTA must be reachable').toBeVisible();
  await expect(repair).toBeEnabled();
  await press(repair);

  await expect
    .poll(() => page.evaluate<number>('__qa.state().weaponDurability'), {
      message: 'the mend must raise durability',
    })
    .toBeGreaterThan(duraBefore);
  expectNoPageErrors(errors);
});

test('quest slice: take it on, do its act, the step marks done', async ({ page }) => {
  const errors = await boot(page, 'wealthy-idler');

  await press(page.locator('.nav-tab', { hasText: '用' })); // Quests
  // Target a quest whose FIRST step is a MAP fight: the night-round quest's first step is a
  // night-round-only foe (unreachable on the map), so pick the orchard chain — it opens on a
  // feral-dog kill at the orchard node (kill:feral_dog → the FIGHT→quest event seam).
  const orchard = page.locator('.quest-card', { hasText: 'Take back the orchard' });
  await expect(orchard, 'the orchard quest must offer itself at R7').toBeVisible();
  const accept = orchard.locator('button.verb', { hasText: 'Take this on' });
  await expect(accept, 'an acceptable quest must offer itself').toBeVisible();
  await press(accept);
  await expect
    .poll(() => page.evaluate<number>('__qa.state().quests.accepted.length'), {
      message: 'the accept must land',
    })
    .toBeGreaterThan(0);

  // orchard_chain is ORDER-FREE (quests.ts): its `reclaim-rows` step listens for gather:wood, so
  // a wood-chop completes a step WITHOUT the feral-dog fight (an idler never trained combat).
  // Walk kura → forecourt → paddies → woodlot. The survey-plan sheet (ADR-151): each zone's seal
  // is an SVG travel control, not a <button>; move_to is single-hop, so tap the chain in order.
  await press(page.locator('.nav-tab', { hasText: '地図' }));
  await press(page.locator('.map-nav [data-node="forecourt"]:not([data-locked])'));
  await press(page.locator('.map-nav [data-node="paddies"]:not([data-locked])'));
  await press(page.locator('.map-nav [data-node="woodlot"]:not([data-locked])'));
  await page.waitForFunction(`window.__qa.state().location === 'woodlot'`);
  await press(page.locator('.nav-tab', { hasText: 'Work' }));
  await press(page.locator('button.verb', { hasText: 'Cut wood' }).first());

  // progress is VISIBLE (T4): back on Quests, the gather step reads ☑
  await press(page.locator('.nav-tab', { hasText: '用' }));
  await expect
    .poll(() => page.locator('.quest-card .quest-step.ok').count(), {
      message: 'the done step must mark visibly',
    })
    .toBeGreaterThan(0);
  expectNoPageErrors(errors);
});

test('ascension ceremony: the arc pays off, tier turns over', async ({ page }) => {
  const errors = await boot(page, 'pre-ascension');

  await press(page.locator('.nav-tab', { hasText: '家' })); // Estate
  const ascend = page.locator('button.ascend-cta');
  await expect(ascend, 'the ascend affordance must be reachable').toBeVisible();
  await expect(ascend).toBeEnabled();
  await press(ascend);

  await page.waitForFunction('window.__qa.state().tier === 1');
  // the ceremony surface — the title-card seal — actually showed
  await expect(page.locator('.rankup-seal.ascension')).toBeVisible();
  // and the post-ascension surface follows it (the seal auto-clears)
  await expect(page.locator('.rankup-seal.ascension')).toBeHidden({ timeout: 6_000 });
  // the payoff is VISIBLE (T4): back on Estate, the boon waits to be spent
  await press(page.locator('.nav-tab', { hasText: '家' }));
  await expect(
    page.locator('.influence-when', { hasText: /boon|man of the house/ }).first(),
    'the post-ascension surface must show the payoff',
  ).toBeVisible();
  await expectNoHorizontalOverflow(page, 'post-ascension');
  expectNoPageErrors(errors);
});
