// ui-demos/shared/data.js — ALL canon T0 (R0–R3) content, English-only.
// Transcribed 1:1 from src/core/content/* (session 47 recon) with every kanji
// stripped per the remaster brief: romanized terms stay (koku, mon/monme/ryo,
// kura, sansai, kami), Japanese glyphs never appear. Numbers are the REAL
// balance numbers so the mock feels like the live game.
//
// This file is DATA ONLY — no DOM, no engine logic (that's engine.js).

// ── Names (src/core/content/names.ts) ──────────────────────────────────────
export const NAMES = {
  house: 'Kurosawa',
  lord: 'Shigemasa',
  heir: 'Naoyuki',
  elder: 'Genemon', // chief steward, first granter
  drillmaster: 'Kihei', // master-at-arms
  steward: 'Chiyo', // Lady Chiyo
  physician: 'Soan',
  pedlar: 'Tokubei', // the Omi pedlar
  rokusuke: 'Rokusuke', // fellow kept-hand met at R2
};

export const HOUSE_MARK = 'House Kurosawa';

// ── Seasons & clock (selectors.ts) ──────────────────────────────────────────
export const DAYS_PER_SEASON = 28;
export const TICKS_PER_DAY = 24;
export const SEASONS = [
  { id: 'spring', label: 'Spring', emoji: '🌸' },
  { id: 'summer', label: 'Summer', emoji: '🎐' },
  { id: 'autumn', label: 'Autumn', emoji: '🍁' },
  { id: 'winter', label: 'Winter', emoji: '❄️' },
];

// ── The rung ladder (ranks.ts; thresholds = balance.RUNG_METER_THRESHOLDS) ──
// R4 is included ONLY as the "Next:" label shown at R3 — never reachable here.
export const RUNGS = [
  {
    id: 'R0',
    title: 'Day-labourer',
    threshold: 1100,
    granter: null,
    storyGateFlag: null, // raking the spilled stores is proof enough
    advanceHint: null,
  },
  {
    id: 'R1',
    title: 'Kept hand',
    threshold: 2150,
    granter: 'Genemon',
    storyGateFlag: 'farmed',
    advanceHint: 'Service enough — now take to the fieldwork. Farm the home paddies.',
    unlocks: [
      'room-gate-forecourt', 'room-home-paddies', 'verb-farm', 'verb-haul',
      'readout-clock', 'readout-stamina', 'panel-rung-ladder', 'panel-estate',
    ],
  },
  {
    id: 'R2',
    title: 'Trusted hand',
    threshold: 2600,
    granter: 'Genemon',
    storyGateFlag: 'first-fight-survived',
    advanceHint: 'Service enough — but the grain-store wolf still waits. Face it to rise.',
    unlocks: [
      'tab-skills', 'room-woodlot-edge', 'room-near-satoyama', 'room-deep-satoyama',
      'verb-woodcut', 'verb-forage', 'verb-face-wolf', 'row-wood', 'row-sansai',
      'skill-conditioning', 'verb-cook',
    ],
  },
  {
    id: 'R3',
    title: 'Gate-watch',
    threshold: 2800,
    granter: 'Kihei',
    storyGateFlag: 'combat-blooded',
    advanceHint: 'Service enough — now blood the blade. Stand a real watch in the field.',
    unlocks: [
      'tab-combat', 'panel-drill-yard', 'readout-combat-level',
      'panel-bestiary', 'panel-house-influence',
    ],
  },
  // Display-only horizon (the ladder's "Next:" line at R3):
  { id: 'R4', title: 'Kura-warden', threshold: 2950, granter: 'Genemon' },
];

export const RUNG_POINTS_PER_ACT = 2;

// ── Balance constants (balance.ts) ──────────────────────────────────────────
export const BALANCE = {
  RICE_PER_RAKE: 3,
  SATIETY_PER_REST: 18,
  SATIETY_PER_ACT: 2,
  EAT_RICE_COST: 3,
  EAT_RICE_SATIETY: 30,
  COOK_SANSAI_COST: 2,
  COOK_HP_RESTORE: 14,
  HP_BASE: 40,
  HP_PER_LEVEL: 8,
  STR_HP: 2, // L1 base with STR 5 → 58 HP
  SATIETY_BASE: 100,
  COLD_OPEN_SATIETY: 64,
  ATTR_BASE: 5,
  RAKE_AUTO_REVEAL_METER: 10, // rake auto-toggle appears after a few rakes
  LOSS_COIN_FRAC: 0.2, // a lost fight takes 20% of CARRIED coin
  RICE_SELL_PRICE: { spring: 6, summer: 5, autumn: 3, winter: 5 },
};

// ── Attributes (balance.ATTR_META) ──────────────────────────────────────────
export const ATTRS = [
  { id: 'str', label: 'STR', name: 'Strength', gloss: 'attack power' },
  { id: 'agi', label: 'AGI', name: 'Agility', gloss: 'evasion & accuracy' },
  { id: 'int', label: 'INT', name: 'Insight', gloss: 'damage & foe-knowledge' },
  { id: 'spd', label: 'SPD', name: 'Speed', gloss: 'swing cadence' },
  { id: 'luck', label: 'LUCK', name: 'Luck', gloss: 'criticals & fortune' },
];

// ── Skills (skills.ts) ───────────────────────────────────────────────────────
export const SKILLS = [
  { id: 'farming', label: 'Farming', blurb: 'Paddy and field work — the house eats by it.' },
  { id: 'foraging', label: 'Foraging', blurb: 'Reading the satoyama for sansai, mushrooms, and medicine.' },
  { id: 'woodcutting', label: 'Woodcutting', blurb: 'Felling and splitting at the woodlot edge — fuel and timber.' },
  { id: 'conditioning', label: 'Conditioning', blurb: 'Hard labour hardens the body — the gate from weak to capable.' },
];
export const SKILL_YIELD_PER_LEVEL = 4; // +4% labour yield per level

// ── Areas & labour activities (areas.ts / activities.ts) ────────────────────
export const AREAS = [
  { id: 'kura', label: 'The grain-store (kura)', blurb: 'Where you woke. Dark, dry, smelling of rice.' },
  { id: 'gate-forecourt', label: 'Gate & forecourt', blurb: 'The estate gate and the swept forecourt — stores come and go here.' },
  { id: 'home-paddies', label: 'Home paddies', blurb: 'The terraced rice paddies that feed the house.' },
  { id: 'woodlot-edge', label: 'Stables & woodlot edge', blurb: 'The stable yard giving onto the woodlot — fuel, timber, and the road out.' },
  { id: 'near-satoyama', label: 'Near satoyama', blurb: 'The managed hill-forest above the estate — sansai, and the first hint of danger.' },
  { id: 'deep-satoyama', label: 'Deep satoyama', blurb: 'The wild hill-forest beyond the edge — a richer forage, and the boar in its wallow.' },
];

export const ACTIVITIES = [
  {
    id: 'farm_paddy', label: 'Work the home paddies', skill: 'farming',
    area: 'home-paddies', yields: { rice: 4 }, satietyCost: 3, xp: 5,
    surface: 'verb-farm',
  },
  {
    id: 'haul_stores', label: 'Haul stores at the forecourt', skill: 'conditioning',
    area: 'gate-forecourt', yields: { coin: 2 }, satietyCost: 4, xp: 5,
    surface: 'verb-haul',
  },
  {
    id: 'woodcut_edge', label: 'Cut wood at the woodlot edge', skill: 'woodcutting',
    area: 'woodlot-edge', yields: { wood: 3 }, satietyCost: 4, xp: 5,
    surface: 'verb-woodcut',
  },
  {
    id: 'forage_satoyama', label: 'Forage the near satoyama', skill: 'foraging',
    area: 'near-satoyama', yields: { sansai: 2, coin: 1 }, satietyCost: 3, xp: 5,
    dangerRing: true, surface: 'verb-forage',
  },
  {
    id: 'forage_deepwoods', label: 'Forage the deep satoyama', skill: 'foraging',
    area: 'deep-satoyama', yields: { sansai: 4, coin: 2 }, satietyCost: 5, xp: 7,
    dangerRing: true, surface: 'verb-forage',
  },
];

// ── The walkable map (map.ts) ────────────────────────────────────────────────
export const MAP_NODES = [
  {
    id: 'kura', label: 'The grain-store (kura)',
    blurb: 'The grain-store where you woke — dark, dry, close with the smell of old rice.',
    neighbors: ['gate-forecourt'],
  },
  {
    id: 'gate-forecourt', label: 'Gate & forecourt',
    blurb: 'The estate gate and its swept forecourt — the ground the whole house turns on.',
    neighbors: ['kura', 'home-paddies', 'woodlot-edge', 'drill-yard'],
    revealFlag: 'room-gate-forecourt',
  },
  {
    id: 'home-paddies', label: 'Home paddies',
    blurb: 'Terraced paddies stepping down the slope — the rice that keeps the house fed.',
    neighbors: ['gate-forecourt', 'near-satoyama'],
    revealFlag: 'room-home-paddies',
  },
  {
    id: 'woodlot-edge', label: 'Stables & woodlot edge',
    blurb: 'The stable yard giving onto the woodlot, and the road that leaves the valley.',
    neighbors: ['gate-forecourt', 'near-satoyama'],
    revealFlag: 'room-woodlot-edge',
  },
  {
    id: 'near-satoyama', label: 'Near satoyama',
    blurb: 'The managed hill-forest above the estate — sansai to gather, and the first teeth of the wild.',
    neighbors: ['home-paddies', 'woodlot-edge', 'deep-satoyama'],
    revealFlag: 'room-near-satoyama',
    dangerRing: true,
  },
  {
    id: 'deep-satoyama', label: 'Deep satoyama',
    blurb: 'The wild hill-forest above the managed edge — the forage runs richer here, and the boar dens in its wallow. Ground you earn by daring it.',
    neighbors: ['near-satoyama'],
    revealFlag: 'room-deep-satoyama',
    dangerRing: true,
  },
  {
    id: 'drill-yard', label: 'Drill yard',
    blurb: 'The cleared yard off the forecourt where the house keeps its hand at arms.',
    neighbors: ['gate-forecourt'],
    revealFlag: 'panel-drill-yard',
  },
];

export const CONDITIONING_GATE_LEVEL = 2; // danger-ring nodes need Conditioning Lv2

// ── People (people.ts) — the pedlar only ≤R3 (the smith is R4-gated) ─────────
export const PEOPLE = [
  {
    id: 'pedlar',
    name: 'Tokubei',
    voice: 'villager',
    node: 'gate-forecourt',
    presenceFlag: 'panel-estate', // present once the estate economy opens (~R1)
    greeting:
      '"Anything for the road, master? Greens for the pot, a bundle of kindling, a hone for the blade — a little of all, and cheap." He unslings his pack.',
    tell: 'an Omi pedlar — greens, wood, a whetstone',
    shop: true,
  },
];

// ── The pedlar's market (market.ts) ─────────────────────────────────────────
export const MARKET_BLURB =
  'A pedlar passes now and then. A little of your OWN coin, for your own needs.';

export const MARKET_ITEMS = [
  {
    id: 'greens_sack', label: 'Sack of mountain greens', coinCost: 10,
    grants: { sansai: 3 }, stockCap: 5,
    blurb: "A travelling forager's sack of sansai — fern-shoots and butterbur, enough for a few hot meals when the satoyama is bare.",
  },
  {
    id: 'wood_bundle', label: 'Bundle of split kindling', coinCost: 16,
    grants: { wood: 4 }, stockCap: 4,
    blurb: "Dry, split wood off a charcoaler's cart — good for a quick mend or to feed the cookfire on a wet day.",
  },
  {
    id: 'whetstone_kit', label: 'Hone and ash-faggot', coinCost: 28,
    grants: { wood: 7 }, stockCap: 3,
    blurb: 'A river-stone whetstone and a faggot of seasoned ash — what a porter needs to keep his carrying-pole sound.',
  },
  {
    id: 'greens_basket', label: "Pedlar's greens-basket", coinCost: 40,
    grants: { sansai: 9 }, stockCap: 2,
    blurb: 'A heaped basket from the valley pedlar — a proper store of sansai laid by against a lean week.',
  },
  {
    id: 'road_rations', label: "Porter's road-rations", coinCost: 55,
    grants: { sansai: 8, wood: 5 }, stockCap: 2,
    blurb: 'A pedlar bundles greens, dried fish, and kindling for the road — a working man revictualling before a long haul.',
  },
  {
    id: 'smith_billet', label: "Smith's seasoned billet", coinCost: 70,
    grants: { wood: 12 }, stockCap: 2,
    blurb: "A dear length of close-grained, kiln-dry timber off the smith's own rack — the good wood, for a blade you mean to keep.",
  },
];

export const RICE_SELL_GLOSS = {
  spring: 'the lean months — rice is dear',
  summer: 'the green season — a fair price',
  autumn: 'harvest glut — rice is cheap',
  winter: 'stores run down — the price firms',
};

// ── Estate kura-works ladder (estate.ts) ────────────────────────────────────
export const ESTATE_STAGE_NAMES = [
  "Foreclosure's edge", // U0
  'U1 · Stabilising',
  'U2 · Recovering',
  'U3 · Prosperous',
  'U4 · Risen',
];

export const ESTATE_STAGES = [
  {
    stage: 1, label: 'Patch the kura', coinCost: 100,
    satietyMaxBonus: 20, yieldBonusNum: 15,
    blurb: 'Mend the cracked storehouse so the rice keeps.',
    logLine: "You spend the house's first surplus mending the cracked kura and re-hanging the rotted door-bar. The stores keep dry now; the estate stops bleeding. (U1 · Stabilising)",
  },
  {
    stage: 2, label: 'Clear the drill yard', coinCost: 300,
    satietyMaxBonus: 20, yieldBonusNum: 20,
    blurb: 'Clear the yard and set a night-watch.',
    logLine: 'The choked drill yard is cleared and a night-watch set. The estate begins to look defended. (U2 · Recovering)',
  },
  {
    stage: 3, label: 'Reclaim the first shinden', coinCost: 700,
    satietyMaxBonus: 30, yieldBonusNum: 30,
    blurb: 'Break new paddy from the fallow ground.',
    logLine: 'The first fallow shinden is broken and put to rice. The house edges toward solvency. (U3 · Prosperous)',
  },
  {
    stage: 4, label: 'Raise the long-house', coinCost: 1400,
    satietyMaxBonus: 30, yieldBonusNum: 30,
    blurb: 'Re-roof the long-house and re-hang the crest.',
    logLine: 'The long-house is re-roofed and the family crest re-hung above a mended gate. The Kurosawa name stands proud again — a house on the rise. (U4 · Risen)',
  },
];

// Estate-tab "house reopens" room rows — ALL still locked ≤R3 (they ink in at
// R4/R6/R7); shown as silhouette rows.
export const HOUSE_ROOMS = [
  { id: 'house-omoya', label: 'The main house (omoya)', lockRung: 'R4' },
  { id: 'house-workshops', label: 'The workshops', lockRung: 'R6' },
  { id: 'house-granary', label: 'The board-granary', lockRung: 'R6' },
  { id: 'house-study', label: 'The study', lockRung: 'R7' },
];

// House-Influence standing panel — LOCKED teaser ≤R3.
export const HOUSE_INFLUENCE = {
  header: "The House's Standing",
  blurb: 'How a house is truly weighed. Earn the trust of the house, and its measure opens to you.',
  lockedFoot: 'Opens when you are Trusted of the house.',
  silhouetteRows: 4, // four unnamed "◆ ————" teaser rows
};

// ── The kura bank (Inventory tab) ────────────────────────────────────────────
export const STOREHOUSE = {
  header: 'The storehouse',
  blurb: 'Stow your coin and rice in the kura, safe from a beating on the road. What you carry, a lost fight can take; what you store, you keep.',
  offNodeBlurb: 'The kura ledger is kept at the grain-store itself — walk back via the Map tab to store or draw.',
};

// ── Weapons (weapons.ts) — only the pole exists ≤R3 ─────────────────────────
export const WEAPONS = [
  {
    id: 'carrying_pole', label: 'Worn carrying-pole',
    archetype: 'reach · blunt', baseAttack: 3, baseSpeed: 0.9, durabilityMax: 40,
    blurb: "A porter's shoulder-pole. Not a weapon — but it has reach, and it is what you have.",
  },
];

// ── Foes (enemies.ts) — the T0 R0–R3 roster ─────────────────────────────────
export const MOBS = [
  {
    id: 'wolf_scripted', label: 'Grain-store wolf', level: 2, area: 'kura',
    scripted: true, coinReward: 0,
    blurb: 'A starving wolf cornered among the rice-sacks. You live through this one on luck alone.',
    tell: 'ribs under winter fur; it has nothing to lose',
    haunts: 'the grain-store, at night',
  },
  {
    id: 'rice_rats', label: 'Grain-rat swarm', level: 1, area: 'gate-forecourt',
    coinReward: 1, baseWinRate: 82,
    blurb: 'A boiling swarm at the grain-stores — a nuisance, not a threat. Good for a first swing.',
    tell: 'fast but scattershot — a mass of small bodies, easy to hit',
    haunts: 'the gate & forecourt stores',
  },
  {
    id: 'monkey', label: 'Crop-raiding monkey', level: 1, area: 'home-paddies',
    coinReward: 3, baseWinRate: 68,
    blurb: 'Bold and quick, a menace to the paddies — but the lightest of the threats.',
    tell: 'quick and dodgy — it slips your blows',
    haunts: 'the home paddies',
  },
  {
    id: 'monkey_troop', label: 'Crop-raiding troop', level: 2, area: 'home-paddies',
    coinReward: 6, baseWinRate: 48,
    blurb: 'Not one raider but a whole troop — they scatter and duck, and you swing at empty air.',
    tell: 'they scatter and duck — you will whiff, a lot',
    haunts: 'the home paddies, in numbers',
  },
  {
    id: 'wolf', label: 'Lean wolf', level: 2, area: 'near-satoyama',
    coinReward: 5, baseWinRate: 44,
    blurb: 'Comes down from the satoyama when the hunting is thin. It means to kill.',
    tell: 'fast, accurate, and hungry — it means to kill',
    haunts: 'the near satoyama trails',
  },
  {
    id: 'mamushi', label: 'Mamushi (pit viper)', level: 2, area: 'near-satoyama',
    coinReward: 4, baseWinRate: 46,
    blurb: 'Coiled in the grass, quick as a whip and sure of its strike. It bites before you see it.',
    tell: 'a lunging strike that rarely misses',
    haunts: 'the hill-grass of the near satoyama',
  },
  {
    id: 'boar', label: 'Wild boar', level: 3, area: 'deep-satoyama',
    coinReward: 8, baseWinRate: 30,
    blurb: 'Tusked and furious, denned in the deep hills it raids from. It will not turn aside.',
    tell: 'slow, heavy, unerring — a wall of muscle',
    haunts: 'the deep satoyama wallow',
  },
];

// Win-rate pips (bestiary + watch rows): ≥55 "Steady" / ≥28 "Even" / else "Risky".
export const WINRATE_BANDS = [
  { min: 55, label: 'Steady', pip: 'good' },
  { min: 28, label: 'Even', pip: 'fair' },
  { min: 0, label: 'Risky', pip: 'risky' },
];

// ── Quests / Undertakings (quests.ts) ────────────────────────────────────────
export const QUESTS_HEADER = 'Undertakings';
export const QUESTS_BLURB =
  'Small goals beyond the grind — the house notices what you take on.';

export const QUESTS = [
  {
    id: 'pest_crop_raiders', kind: 'PEST', title: 'Drive off the crop-raiders',
    blurb: 'Monkeys and boar have come down out of the satoyama to strip the ripening paddies — thin the raiders, then mend what they have trampled before the harvest is lost.',
    steps: [
      { id: 'rout-monkey', label: 'Rout a crop-raiding monkey from the home paddies', event: 'kill:monkey' },
      { id: 'down-boar', label: 'Track the boar to its wallow in the deep satoyama and put it down', event: 'kill:boar' },
      { id: 'mend-fence', label: 'Cut stakes at the woodlot edge and mend the trampled paddy-fence', event: 'gather:wood' },
    ],
    rewardCoin: 30,
    rewardLine: 'The paddies stand quiet again. Genemon counts thirty coin from the house purse into your hand — "for the rice you kept on the stalk."',
  },
  {
    id: 'hunt_satoyama_predators', kind: 'HUNT', title: 'Hunt the satoyama predators',
    blurb: 'The lean wolves and a tusked boar have grown bold on the hill-trails, taking stock and testing the folds. Go up into the satoyama and put the worst of them down before they come to the yard.',
    steps: [
      { id: 'hunt-wolf', label: 'Bring down a lean wolf in the near satoyama', event: 'kill:wolf' },
      { id: 'hunt-boar', label: 'Track the boar to its wallow in the deep satoyama and kill it', event: 'kill:boar' },
    ],
    rewardCoin: 24,
    rewardLine: 'Kihei the drillmaster looks over the hides you bring in and grunts, almost approving. "The hills are quieter for it. Twenty-four coin — a hunter\'s due."',
  },
  {
    id: 'clear_satoyama_trails', kind: 'CLEAR', title: 'Clear the satoyama trails',
    blurb: 'No one can work the far ground while every trail hides a raider. Sweep the whole rising country — monkey, wolf, and boar alike — until a porter can walk the paths unarmed.',
    steps: [
      { id: 'clear-monkey', label: 'Rout a crop-raiding monkey from the trails', event: 'kill:monkey' },
      { id: 'clear-wolf', label: 'Down a lean wolf on the near-satoyama paths', event: 'kill:wolf' },
      { id: 'clear-boar', label: 'Kill the boar that dens in the deep satoyama', event: 'kill:boar' },
    ],
    rewardCoin: 40,
    rewardLine: 'Word goes round that the satoyama trails are safe to walk. Genemon marks it in the house book and hands you forty coin — "a road cleared is a road that earns."',
  },
  {
    id: 'defend_the_stores', kind: 'DEFEND', title: 'Defend the grain-store',
    blurb: 'Raiders have found the granary. Hold the stores through the season — beat back what comes for the rice, and bar the store against the next night.',
    steps: [
      { id: 'defend-monkey', label: 'Drive a raiding monkey off the granary', event: 'kill:monkey' },
      { id: 'defend-wolf', label: 'Kill the wolf that breaks for the stores at night', event: 'kill:wolf' },
      { id: 'defend-bar', label: 'Cut timber and bar the grain-store door', event: 'gather:wood' },
    ],
    rewardCoin: 28,
    rewardLine: 'The stores come through the season whole. Genemon rests a hand on the barred door. "The house eats this winter because you held this. Twenty-eight coin — and the trust that comes with it."',
  },
];

// ── Tabs (the D-112 6-tab IA) ────────────────────────────────────────────────
// gate: the unlock-surface that reveals the tab (null = always once awake).
export const TABS = [
  { id: 'work', label: 'Work', gate: null },
  { id: 'map', label: 'Map', gate: 'room-gate-forecourt' },
  { id: 'estate', label: 'Estate', gate: 'panel-estate' },
  { id: 'inventory', label: 'Inventory', gate: 'panel-estate' },
  { id: 'character', label: 'Character', gate: 'tab-skills' },
  { id: 'combat', label: 'Combat', gate: 'tab-combat' },
];

// ── Log channels & filters (log-filter.ts) ──────────────────────────────────
export const LOG_HEADER = 'The house remembers';
export const LOG_FILTERS = ['story', 'progress', 'combat', 'work', 'all', 'now'];
export const LOG_FILTER_LABELS = {
  story: 'Story', progress: 'Progress', combat: 'Combat',
  work: 'Work', all: 'All', now: 'Now',
};
// channel → which filters show it ('now' is its own ephemeral view)
export const CHANNEL_FILTERS = {
  narration: ['story', 'all'],
  reward: ['work', 'all'],
  combat: ['combat', 'all'],
  system: ['all'],
  milestone: ['story', 'progress', 'all'],
};
export const CHANNEL_BULLET = { reward: '🌾', combat: '⚔️', milestone: '❖' };

// Voice categories → each variant maps these to its own palette.
export const VOICES = ['narrator', 'player', 'physician', 'steward', 'arms', 'official', 'villager'];

// ── UI copy (render.ts headers, English-only) ───────────────────────────────
export const COPY = {
  workHeader: 'What you can do',
  rakeLabel: 'Rake the spilled rice',
  restLabel: 'Rest a moment',
  autoOn: '▶ auto',
  autoOff: '■ stop',
  wolfButton: 'Face the wolf at the grain store',
  wolfAway: 'The wolf is at the grain-store — walk back via the Map tab to face it.',
  noWorkHere: 'No work at this ground — the Map tab knows where your hands are wanted.',
  cookLabel: 'Cook a meal (2 sansai)',
  eatRiceLabel: 'Eat plain rice (3 rice)',
  mapHeader: 'The estate',
  youStandAt: 'You stand at',
  onward: 'Onward',
  whosHere: "Who's here",
  speakWith: (name) => `Speak with ${name}`,
  leave: (name) => `Leave ${name}`,
  needsConditioning: 'Needs Conditioning Lv 2',
  marketHeader: 'The pedlar',
  sellRiceHeader: 'Sell your rice',
  sellRiceLine: (price, seasonLabel, gloss) =>
    `The pedlar pays ${price} the measure now — ${seasonLabel}, ${gloss}.`,
  sellAllRice: (n, coinText) => `Sell all rice (${n} rice → ${coinText})`,
  estateHeader: 'Estate',
  houseReopens: 'The house reopens',
  ladderService: 'Estate service',
  ladderReady: 'Ready to advance.',
  ladderNext: 'Next:',
  ladderEnd: 'Higher service than this is a tale for another season.',
  summons: 'Answer the summons ›',
  trainingHeader: 'Training',
  trainingPoints: (n) => `${n} ${n === 1 ? 'point' : 'points'} to spend`,
  bestiaryHeader: 'Bestiary',
  bestiaryCount: (n, m) => `${n} of ${m} beasts recorded — face a foe to ink its entry.`,
  bestiaryUnknown: 'Unknown foe',
  bestiaryNotFaced: '◇ Not yet faced',
  combatLevel: (n) => `Combat level ${n}`,
  watchHeader: 'The watch',
  watchEmpty: 'Nothing hunts this ground. The Map tab knows where the threats are.',
  fight: 'Fight',
  autoToEnd: '▶ auto · to the end',
  autoFlee: '▶ auto · flee @20%',
  takeThisOn: 'Take this on',
  reward: (coinText) => `Reward: ${coinText}`,
  vitals: { rice: 'rice', coin: 'coin', life: 'life', body: 'body', wood: 'wood', sansai: 'sansai' },
  storeAllCoin: 'Store all coin',
  withdrawAllCoin: 'Withdraw all coin',
  storeAllRice: 'Store all rice',
  withdrawAllRice: 'Withdraw all rice',
  carriedLine: (c, r, bc, br) => `Carried ${c}, ${r} rice · stored ${bc}, ${br} rice (safe)`,
  perkTag: 'Perk unlocked',
  promoted: 'Promoted',
  continueBtn: 'Continue',
  doneQuestioning: 'Done questioning',
};

// ── Cold open (coldOpen.ts) ──────────────────────────────────────────────────
export const COLD_OPEN = {
  title: 'KAMIKAKUSHI',
  subtitle: 'Spirited Away',
  lede: 'Dark. Straw against your cheek, the smell of wet rice, a low roof you do not know. Your name, your past — gone.',
  verb: 'Open your eyes',
  wake: "You open your eyes. Straw beneath you, the smell of wet rice, a low roof you do not know. A cold spring — the ninth year of An'ei — though the year is as lost to you as your name.",
  dream: "Something surfaces and is gone — a porter's knot, a road in grey rain, a name you cannot keep hold of.",
  bodyReveal: 'You take stock of yourself: bruised, hollow, half-starved — but breathing.',
  riceReveal: 'Rice lies scattered across the Kurosawa grain-store floor. Spilled stores are waste — and clearing waste is a kind of work, if you set your hands to it.',
  coinReveal: 'Copper coin, warm from another hand — your first wage. Rice fills a belly; coin is what the world takes in trade for everything a belly is not.',
  restAct: 'You rest against the post. The ache dulls; the light through the slats shifts.',
  rakeLine: (n) => `You rake the spilled rice back toward the basket. (+${n} rice)`,
};

// ── The intro VN (intro.ts) — three scenes, full fidelity ────────────────────
export const INTRO_SCENES = [
  {
    id: 'soan',
    voice: 'physician',
    speaker: 'Soan',
    sealText: 'S', // variants render their own nameplate mark (no kanji)
    greeting: [
      { voice: 'narrator', text: COLD_OPEN.wake },
      { voice: 'physician', speaker: 'Soan', text: '"You\'re awake." Soan the physician sits back on his heels. "No kami carried you off, whatever the village wants to believe. A flood took you, and a blow to the head took the rest. Bodies forget. Given work and rice, they also mend."' },
    ],
    topics: [
      {
        id: 'soan-what-happened', label: '"What happened to me?"',
        answer: [{ voice: 'physician', speaker: 'Soan', text: '"You washed up below the weir three days back, a gash on your scalp and no name to give. The river does that. We fished you out; the rest you\'ll have to earn back."' }],
      },
      {
        id: 'soan-kami', label: '"The village says a kami hid me away."',
        answer: [{ voice: 'physician', speaker: 'Soan', text: '"Kami-kakushi — \'spirited away.\' It\'s the tale they tell for every soul that wanders off and every child the river takes. I\'ve tended enough of the \'spirited-away\' to know it\'s water and cold and bad luck, not spirits. Don\'t let the old women make a haunting of it."' }],
      },
      {
        id: 'soan-fragment', label: '"There\'s a road. Grey rain. A name I can\'t hold."',
        answer: [{ voice: 'physician', speaker: 'Soan', text: '"That\'s the blow talking, not a ghost. Fragments surface as the swelling goes down — chase them if you must, but a name you have to dig for is rarely one worth keeping."' }],
      },
      {
        id: 'soan-mend', label: '"How do I get my strength back?"',
        answer: [{ voice: 'physician', speaker: 'Soan', text: '"Rest, rice, and work — in that order at first, then all at once. The body remembers labour before the mind remembers anything. The wits come back last; don\'t force them."' }],
      },
    ],
    decision: {
      prompt: 'What do you say to him?',
      options: [
        {
          id: 'soan-grateful', label: 'Thank him — ask how to mend',
          say: '"Then I\'ll trust your craft, not the village\'s ghosts."',
          react: '"Sense, at last. Rest, eat, and let the swelling go down. The wits come back last — don\'t force them."',
          stat: { up: 'int', down: 'str' },
          perk: { name: "Soan's Counsel", desc: 'A mind honed sharper than the body it wears.' },
        },
        {
          id: 'soan-curt', label: 'Brush it off — ask for work',
          say: '"Kami or flood, I\'m still breathing. Where\'s the work?"',
          react: '"...Hm. No patience for a physician. Well — the body heals the same whether you thank me or not."',
          stat: { up: 'str', down: 'int' },
          perk: { name: 'Sickbed Grit', desc: 'A back that shoulders the work before the wits can weigh in.' },
        },
        {
          id: 'soan-worried', label: 'Grasp at the fragment',
          say: '"There was a road. Grey rain. A name I can\'t hold. Is that the fever?"',
          react: '"That is the blow talking, not a ghost. It will fade — or it won\'t. Don\'t let the old women make a haunting of it."',
          stat: { up: 'luck', down: 'agi' },
          perk: { name: 'A Waking Fragment', desc: 'A half-caught omen that bends fortune your way, though your step is slower to answer.' },
        },
      ],
    },
  },
  {
    id: 'dream',
    voice: 'narrator',
    speaker: null,
    sealText: '·',
    plateLabel: 'A memory',
    greeting: [{ voice: 'narrator', text: COLD_OPEN.dream }],
    topics: [],
    decision: {
      prompt: 'The fragment tugs. Do you follow it?',
      options: [
        {
          id: 'dream-dwell', label: 'Dwell on it',
          say: '"Hold the road. The rain. Almost a name."',
          react: 'You chase it inward — and the ache in your skull chases you back. The name stays lost, but the habit of looking sets in.',
          stat: { up: 'int', down: 'spd' },
          perk: { name: 'The Inward Turn', desc: 'A mind that deepens by dwelling, at the price of a slower body.' },
        },
        {
          id: 'dream-shake', label: 'Shake it off',
          say: '"Later. The body is here; the past isn\'t."',
          react: 'You let it go and the room sharpens — the slats of light, the way out.',
          stat: { up: 'spd', down: 'int' },
          perk: { name: 'The Clear Room', desc: 'Senses sharpened to the way out — quick where thought is thin.' },
        },
        {
          id: 'dream-hands', label: 'Trust the hands',
          say: '"A porter\'s knot. My hands know this much."',
          react: 'Your fingers move before you decide to — a labourer\'s memory, still in the muscle.',
          stat: { up: 'str', down: 'luck' },
          perk: { name: "The Porter's Hands", desc: 'Hands that remember the work before the head does.' },
        },
      ],
    },
  },
  {
    id: 'genemon',
    voice: 'steward',
    speaker: 'Genemon',
    sealText: 'G',
    greeting: [
      { voice: 'steward', speaker: 'Genemon', text: '"On your feet, are you. Good — the house feeds no idle mouths. I am Genemon, steward of what remains of the Kurosawa. There is rice spilled the length of my grain-store floor, and you are the hands nearest to it."' },
    ],
    topics: [
      {
        id: 'gen-house', label: '"What house is this?"',
        answer: [{ voice: 'steward', speaker: 'Genemon', text: '"The Kurosawa. A great name gone to seed — samurai on the rolls, paupers in the granary. I\'ve kept it upright since the last master could not, and I\'ll keep it upright when you can\'t either."' }],
      },
      {
        id: 'gen-work', label: '"What work is there?"',
        answer: [{ voice: 'steward', speaker: 'Genemon', text: '"Rice to rake, a paddy to tend, a storehouse standing half-empty. Honest labour and no shortage of it. Earn your keep and there\'s a dry corner and a bowl in it — that\'s the whole of what I can promise."' }],
      },
      {
        id: 'gen-you', label: '"And who are you to me?"',
        answer: [{ voice: 'steward', speaker: 'Genemon', text: '"Steward. I run the estate; you\'ll learn it, or you won\'t eat. Do as I say on the house\'s matters and we\'ll get on well enough."' }],
      },
      {
        id: 'gen-danger', label: '"Is it safe here?"', gateTopic: 'gen-work',
        answer: [{ voice: 'steward', speaker: 'Genemon', text: '"Safe as anywhere the lord\'s men don\'t ride. There\'s a wolf gone bold at the grain store, and worse up in the hills. But that\'s tomorrow\'s trouble. Today it\'s rice."' }],
      },
    ],
    decision: {
      prompt: 'How do you answer the steward?',
      options: [
        {
          id: 'genemon-earnest', label: 'Earnest — point me at the work',
          say: '"I\'ll earn my keep. Point me at it."',
          react: '"...Good. The house has had its fill of hands that don\'t. We\'ll see if you mean it."',
          stat: { up: 'str', down: 'agi' },
          perk: { name: "Genemon's Charge", desc: 'Honest muscle set plainly to the task — sure over nimble.' },
        },
        {
          id: 'genemon-wary', label: "Wary — what's in it for me",
          say: '"A samurai house with an empty granary. What\'s in it for me?"',
          react: '"An honest question, and a cold one. Rice and a dry corner — that\'s the whole of what I can promise. Take it or walk."',
          stat: { up: 'agi', down: 'str' },
          perk: { name: 'The Wary Foot', desc: 'A guard kept up and light on the feet — quick to move before committing.' },
        },
        {
          id: 'genemon-steady', label: 'Silent — just get to work',
          say: '(You say nothing, and reach for the spilled rice.)',
          react: '"...A man who works before he talks. Rare. We\'ll get on."',
          stat: { up: 'spd', down: 'luck' },
          perk: { name: 'Hands Before Words', desc: 'A steady quickness that answers with work — trusting to no luck.' },
        },
      ],
    },
  },
];

// ── Rung-up story beats (rungBeats.ts) — R1/R2/R3, full fidelity ─────────────
export const RUNG_BEATS = {
  R1: {
    id: 'rung-r1',
    rank: 'R1',
    voice: 'steward',
    speaker: 'Genemon',
    sealText: 'G',
    greeting: [
      { voice: 'narrator', text: 'Dawn at the gate. The forecourt is swept clean — your doing — and Genemon waits by the posts, watching you the way a man watches weather.' },
      { voice: 'steward', speaker: 'Genemon', text: '"You cleared the stores without being told twice. The house is short of hands and shorter of trustworthy ones. Stay — you\'re no day-hire now. Earn your rice."' },
      { voice: 'steward', speaker: 'Genemon', text: '"The gate and the swept forecourt are yours to work now; stores come and go here. The home paddies too — the rice that feeds the house. And the kura\'s own repair is yours to tend: spend the house\'s small surplus to shore it up."' },
      { voice: 'narrator', text: 'A pack-laden stranger has laid a mat in the lee of the gate-post — an Omi pedlar, come because a tended gate draws trade. He lifts a hand as you pass.' },
      { voice: 'villager', speaker: 'Tokubei', text: '"A tended gate\'s a lucky gate for a man with a pack. Tokubei, of Omi — mind if I keep my mat here a while, young master? Coin of your own spends as well as any lord\'s."' },
    ],
    topics: [],
    decision: {
      prompt: 'How do you take the keeping?',
      options: [
        { id: 'r1-dutiful', label: '"The house has my hands."', say: '"The house has my hands."', react: '"...Good. Hands that don\'t need watching are the rarest thing I keep."' },
        { id: 'r1-practical', label: '"A roof and rice is a fair trade."', say: '"A roof and rice is a fair trade."', react: '"Honest, and cold. A fair trade it is — see that you hold your half."' },
        { id: 'r1-ambitious', label: '"I mean to rise past a kept hand."', say: '"I mean to rise past a kept hand."', react: '"...Ambition, in a hand kept a day. Mind it doesn\'t outrun your worth."' },
      ],
    },
  },
  R2: {
    id: 'rung-r2',
    rank: 'R2',
    voice: 'villager',
    speaker: 'Rokusuke',
    sealText: 'R',
    greeting: [
      { voice: 'narrator', text: 'The near hill in first light. Genemon leads you past the forecourt for the first time, out to where the woodlot meets the wild edge of the satoyama.' },
      { voice: 'steward', speaker: 'Genemon', text: '"You can be set a task and trusted to finish it out of my sight — worth more than a strong back. The woodlot and the near hill are yours to work now; the house needs fuel and forage, and it trusts you to bring them in."' },
      { voice: 'steward', speaker: 'Genemon', text: '"One more thing, and not a small one. A wolf\'s been at the grain stores in the night. Someone must face it — and there is no one else to send. Think on it."' },
      { voice: 'narrator', text: 'A lean man about your own age ambles up from the wood-stack, an axe on one shoulder, grinning as if you two already share a joke.' },
      { voice: 'villager', speaker: 'Rokusuke', text: '"Rokusuke — kept on two winters back, so I know where the bodies are buried. Do the work, keep your head down, don\'t let the old steward catch you idle. That\'s the whole of it."' },
      { voice: 'narrator', text: "Knotting a load for the woodlot, your fingers tie a porter's knot you never learned — quick, certain, a stranger's habit in your own hands. It means nothing. It will not leave you." },
    ],
    topics: [],
    decision: {
      prompt: 'The wolf, and the man beside you — how do you take them?',
      options: [
        { id: 'r2-wolf-heeded', label: '"The stores are the house\'s life. I\'ll face it."', say: '"The stores are the house\'s life. I\'ll face it."', react: '"...Huh. Most men find a reason to be elsewhere. You might do."' },
        { id: 'r2-rokusuke-friend', label: '"Tell me how the house really runs."', say: '"Tell me how the house really runs."', react: '"Now you\'re talking. Stick with me and you\'ll know which pedlar cheats and which steward\'s watching. Speaking of — old Tokubei keeps a softer price for a friend. Tell him I sent you."' },
        { id: 'r2-solitary', label: '"The work\'s enough. I keep to myself."', say: '"The work\'s enough. I keep to myself."', react: '"Suit yourself. Offer stands, if you tire of your own company."' },
      ],
    },
  },
  R3: {
    id: 'rung-r3',
    rank: 'R3',
    voice: 'arms',
    speaker: 'Kihei',
    sealText: 'K',
    greeting: [
      { voice: 'narrator', text: "The drill yard behind the main house, first light. You've stood over the grain-store wolf's carcass; word travels. A hard-faced man is already there, a wooden sword in each hand — and he throws you one without a word of greeting." },
      { voice: 'arms', speaker: 'Kihei', text: '"So. You put down the thing that had the run of our stores. Farmers don\'t do that. There\'s a soldier in you under the farmhand — I\'ve watched it a week and I\'m done pretending I haven\'t."' },
      { voice: 'arms', speaker: 'Kihei', text: '"You\'re gate-watch now: a weapon, a yard to train in, and the estate\'s defence on your shoulders — pests, beasts, and the masterless men who drift down the woodlot road. Keep a field-guide of what you face; a soldier who knows his enemy outlives one who doesn\'t."' },
    ],
    topics: [
      {
        id: 'kihei-why-blade', label: '"Why set me to the blade?"',
        answer: [{ voice: 'arms', speaker: 'Kihei', text: '"The house has walls and no one to stand on them. A great name with an empty granary draws wolves of both kinds. I\'d sooner the man holding the gate be one who chose to."' }],
      },
      {
        id: 'kihei-road', label: '"What\'s out on the woodlot road?"',
        answer: [{ voice: 'arms', speaker: 'Kihei', text: '"Boar and wolf in season. And men — ronin, deserters, the leavings of every lord\'s quarrel — who\'ll take rice off a house too weak to keep it. That last is why you\'re really here."' }],
      },
      {
        id: 'kihei-who', label: '"Who are you, drillmaster?"', gateTopic: 'kihei-why-blade',
        answer: [{ voice: 'arms', speaker: 'Kihei', text: '"A man who soldiered for a house that no longer exists. Genemon kept the granary; I kept the walls. Ask me the rest when you\'ve bled for the place."' }],
      },
    ],
    decision: {
      prompt: 'How do you take up the blade?',
      options: [
        { id: 'r3-aggressive', label: '"Show me how to end a fight fast."', say: '"Show me how to end a fight fast."', react: '"Fast, he says. Fast gets you a spear in the back. But there\'s fire in it — we\'ll aim it before it burns you."' },
        { id: 'r3-disciplined', label: '"Teach me to stand a watch."', say: '"Teach me to stand a watch."', react: '"...Good answer. A wall that holds is worth ten swords that swing wild. Come at dawn — before the others."', statBonus: { attr: 'agi', amount: 1, note: 'Kihei drills you an extra dawn; your feet learn the watch. (+1 AGI)' } },
        { id: 'r3-duty-not-glory', label: '"I\'d rather the paddies — but the house needs it."', say: '"I\'d rather the paddies — but the house needs it."', react: '"Honest. I trust a man who\'d rather not more than one who\'s hungry for it. The house is lucky in you."' },
      ],
    },
  },
};

// ── Staged review states (the depth pick: staged states + live verbs) ───────
export const STAGES = [
  { id: 'cold-open', label: 'Cold open', blurb: 'One verb against the dark — minute one.' },
  { id: 'R0', label: 'R0 · Day-labourer', blurb: 'The rake loop; the world is one room.' },
  { id: 'R1', label: 'R1 · Kept hand', blurb: 'The estate frame: map, coin, the pedlar.' },
  { id: 'R2', label: 'R2 · Trusted hand', blurb: 'The hills open; the wolf waits.' },
  { id: 'R3', label: 'R3 · Gate-watch', blurb: 'Combat live: the watch, bestiary, training.' },
];
