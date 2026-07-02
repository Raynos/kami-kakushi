# Kami-kakushi — mock-data pack for UI prototypes (real copy, real numbers)

Everything below is verbatim or derived from the game's pure core. Use ONLY
this content in mocks — no lorem ipsum, no invented anachronisms.

## Setting & cast

Spring, the ninth year of An'ei (1780). Rural Edo Japan. House: the Kurosawa
黒沢家 — proud, threadbare lower-samurai (gōshi), two generations past its
grandeur. You: a nameless ~18yo farmhand pulled half-drowned from the river.
Cast: **Genemon** (steward, elder), **Kihei** (master-at-arms), **Sōan**
(physician), **Lady Chiyo** (lady steward), **lord Shigemasa**, heir Naoyuki.
Village of Asagiri: chief Yagōemon, girl Sayo; they believe you are "Tama",
their child spirited away ten years ago. Nothing supernatural ever happens.
Your true name (reclaimed late, missable): Tahei.

## Voice — verbatim lines (the register: spare, dignified, concrete)

Work/system:
- "You rake the spilled rice back toward the basket. (+3 rice)"
- "Work the home paddies. (+4 rice)"
- "Haul stores at the forecourt. (+2 coin)"
- "Cut wood at the woodlot edge. (+3 wood)"
- "Forage the near satoyama. (+2 sansai, +1 coin)"
- "Forage the deep satoyama. (+4 sansai, +2 coin)"
- "You rest against the post. The ache dulls; the light through the slats shifts."
- "You could boil the wild greens into a hot meal — plain fare, but a warm meal is what closes wounds and mends a body after a fight."
- "You begin to mark the turning of the days, and the four seasons with them."
- "Copper coin, warm from another hand — your first wage."
- "Rice lies scattered across the Kurosawa grain-store floor. Spilled stores are waste — and clearing waste is a kind of work, if you set your hands to it."

Combat:
- Win: "You bring down the crop-raiding monkey. ✓ (HP 58→41 · +3 coin, +1 beast sinew)"
- Retreat: "You break off the fight with the lean wolf and fall back — winded, blade up, but whole. (HP 58→11)"
- Loss: "The wild boar overcomes you; you limp home badly used. (HP 45→1) You drop 6 coin, 2 rice and 1 of your spoils in the rout. Eat and mend before you take the field again."
- Level-up: "Your body has hardened with the fighting. Combat level 3."
- Too hurt: "You are too hurt to hold the line — eat and mend before you take the field."
- The scripted first wolf: "The wolf comes out of the dark among the rice-sacks. You swing the pole, miss, swing again — and somehow, more luck than skill, it bolts bleeding into the night. You are alive. You should not be."
- Aftermath (Kihei): "You lived. That's the only talent that matters in the end. Come to the yard at dawn — I'll teach you the rest."

NPC / story:
- Cold open (wake): "You open your eyes. Straw beneath you, the smell of wet rice, a low roof you do not know. A cold spring — the ninth year of An'ei — though the year is as lost to you as your name."
- Sōan: "'You're awake.' Sōan the physician sits back on his heels. 'No kami carried you off, whatever the village wants to believe. A flood took you, and a blow to the head took the rest. Bodies forget. Given work and rice, they also mend.'"
- Genemon: "On your feet, then. I am Genemon, steward of this house, and I keep the little it has left to keep."
- Genemon (rice): "We reckon a samurai house's worth in koku — a year's eating for one man — and every basket you save us is a measure we need not go begging to the lord to make good."
- Kihei: "Kihei, master-at-arms — what's left of the office. I keep a drill yard of warped poles and grey-haired men, and I wait on someone with the spine to swing them."
- Dream fragment (use Klee hand): "Something surfaces and is gone — a porter's knot, a road in grey rain, a name you cannot keep hold of."
- Dream 2 (Klee hand): "The grey rain, the road — and now a load on your back, roped with the porter's knot your hands already knew. Water rising over the planks of a low bridge. A woman's voice behind you, calling a name through the flood — your name, you are almost sure, though the water closes over it before you can catch its shape."
- Porter's knot: "Knotting a load for the woodlot, your fingers tie a porter's knot you never learned — quick, certain, a stranger's habit in your own hands. It means nothing. It will not leave you."

Log channels: narration · reward · combat · system · milestone. Filters:
Story / Progress / Combat / Work / All / Now.

## Resources

carried vs banked (banked lives in the kura; deposit/withdraw only there).
- rice 米 (+3/rake, +4/farm) · coin 文 mon (+2/haul; fight spoils 1–12) ·
  wood 薪 (+3/woodcut) · sansai 菜 (+2 near / +4 deep forage) ·
  hardwood 堅木 (boar/bandit drop, qty 2–3) · beast sinew 腱 (drop, qty 1).
- koku 石 is NOT a resource — it is House standing, restated by the seasonal
  judge. Never labour-earned, never spent.

## Activities (label · yield · place)

- Rake the spilled rice · +3 rice · kura (cold-open meta-verb)
- Work the home paddies · +4 rice · home paddies (autumn ×1.3)
- Haul stores at the forecourt · +2 coin · gate & forecourt
- Cut wood at the woodlot edge · +3 wood · woodlot edge
- Forage the near satoyama · +2 sansai +1 coin · near satoyama (danger ring)
- Forage the deep satoyama · +4 sansai +2 coin · deep satoyama (danger ring)
- Rest (meta-verb) · Cook a meal (2 sansai → +14 HP; the ONLY heal)

## Skills (surface by-doing; 5 XP/act; L1→2 at 12 XP, ×1.3/level)

- Farming 農 "Paddy and field work — the house eats by it."
- Foraging 採 "Reading the satoyama for sansai, mushrooms, and medicine."
- Woodcutting 樵 "Felling and splitting at the woodlot edge — fuel and timber."
- Conditioning 鍛 "Hard labour hardens the body — the gate from weak to capable." (Lv2 gates the danger rings / combat-capable)

## Attributes & vitals

STR 力 (+atk) · AGI 敏 (+eva·acc) · INT 智 (+dmg·known) · SPD 速 (+speed) ·
LUCK 運 (+crit·luck). All start 5. Spend lines, e.g. STR: "You drill the cut
until your shoulders burn. (STR +1)". HP max = 58 at level 1. Satiety ~64/100
early. HP carries between fights; meals are the only heal.

## Combat

Stances (kendo kamae): gedan 下段 defensive (atk ×0.8, taken ×0.85) ·
chudan 中段 balanced (identity) · jodan 上段 aggressive (atk ×1.35, taken
×1.15). Fight auto-resolves as a seeded race of swings; the whole fight logs
as ONE summarised line. Win-rate forecast shown before committing.
Weapons: Worn carrying-pole 天秤棒 (atk 3, spd 0.9) → Woodlot axe 斧 (atk 5,
spd 0.85; craft: 3 hardwood + 1 sinew) → Forged yari 槍 (atk 4, spd 1.0;
craft: 2 hardwood + 3 sinew). Durability: Pristine ≥75 · Worn ≥50 · Battered
≥1 · Broken 0 (atk ×1.0/×0.9/×0.75/×0.55); wear 2/fight; repair 5 wood + 6 coin.

Enemies (name · kanji · lvl · place · win% at combat L1..L5 · blurb):
- Grain-rat swarm 稲鼠 L1 · gate · 66/96/99/100/100 · "A boiling swarm at the grain-stores — a nuisance, not a threat. Good for a first swing."
- Crop-raiding monkey 猿 L1 · paddies · 29/69/78/90/93 · "Bold and quick, a menace to the paddies — but the lightest of the threats."
- Crop-raiding troop 猿群 L2 · paddies · "Not one raider but a whole troop — they scatter and duck, and you swing at empty air."
- Lean wolf 狼 L2 · near satoyama · 3/35/51/70/80 · "Comes down from the satoyama when the hunting is thin. It means to kill."
- Mamushi (pit viper) 蝮 L2 · near satoyama · "Coiled in the grass, quick as a whip and sure of its strike. It bites before you see it."
- Wild boar 猪 L3 · deep satoyama · 7/45/62/79/88 · "Tusked and furious, denned in the deep hills it raids from. It will not turn aside."
- Road bandit 野伏 L5 · woodlot edge · ~0 until L8 · "A masterless man gone to robbery on the woodlot road — a threat for a later season."
Forecast display idea: 勝目 二分九厘 (29%) or 勝算 三割弱. Derived "tells":
fast / heavy / evasive / unerring / plain. Bestiary un-fogs per foe faced.

## Quests (kōsatsu board; steps are deeds)

- PEST · "Drive off the crop-raiders" · +30 coin · rout monkey / down boar / mend fence (gather wood). Reward copy: "The paddies stand quiet again. Genemon counts thirty coin from the house purse into your hand — 'for the rice you kept on the stalk.'"
- HUNT · "Hunt the satoyama predators" · +24 coin · wolf, boar. Reward: "Kihei looks over the hides you bring in and grunts, almost approving. 'The hills are quieter for it. Twenty-four coin — a hunter's due.'"
- CLEAR · "Clear the satoyama trails" · +40 coin · monkey, wolf, boar.
- DEFEND · "Defend the grain-store" · +28 coin · monkey, wolf, cut timber & bar the door.

## Estate — 7 walkable places (adjacency) + repairs

kura 蔵 (grain-store) ↔ gate & forecourt 門前 ↔ {home paddies 田圃, woodlot
edge 杣, drill yard 稽古場}; paddies & woodlot ↔ near satoyama 里山 ↔ deep
satoyama 奥山 (danger rings beyond the near hill). Walking costs ticks.
Repairs (coin sink): U1 Patch the kura · 100 · "You spend the house's first
surplus mending the cracked kura and re-hanging the rotted door-bar. The
stores keep dry now; the estate stops bleeding. (U1 · Stabilising)" — U2
Clear the drill yard · 300 (Recovering) — U3 Reclaim the first shinden · 700
(Prosperous) — U4 Raise the long-house · 1400 · "The long-house is re-roofed
and the family crest re-hung above a mended gate. The Kurosawa name stands
proud again — a house on the rise. (U4 · Risen)"

## Market (travelling pedlar; per-visit stock caps)

Sack of mountain greens · 10 coin · 3 sansai — "A travelling forager's sack of sansai — fern-shoots and butterbur, enough for a few hot meals when the satoyama is bare."
Bundle of split kindling · 16 · 4 wood — Hone and ash-faggot · 28 · 7 wood —
Pedlar's greens-basket · 40 · 9 sansai — Porter's road-rations · 55 · 8
sansai + 5 wood — Smith's seasoned billet · 70 · 12 wood — "the good wood,
for a blade you mean to keep."

## Rungs R0–R7 (meter fills +2/eligible deed; ceremony on rung-up)

R0 Day-labourer 日雇 (meter 1100) → R1 Kept hand 下人 (2150, Genemon) → R2
Trusted hand 手代 (2600, Genemon) → R3 Gate-watch 門番 (2800, Kihei) → R4
Kura-warden 蔵番 (2950, Genemon) → R5 House-servant 家人 (3100, Genemon) →
R6 Steward's man 用人 (3250, Lady Chiyo) → R7 Trusted of the house 内衆
(3400, lord Shigemasa).

Ceremony copy (verbatim):
- R1: "Genemon the elder watches you clear the stores without being told twice. 'The house is short of hands and shorter of trustworthy ones. Stay. Earn your rice.' You are taken on as a kept hand."
- R2: "You can be set to a task and trusted to finish it. Genemon gives you the run of the woodlot and the near hill. A way to track what your hands are learning appears."
- R3: "Kihei sets you to the estate's defence — pests, beasts, and the masterless men on the woodlot road. A weapon, a yard to train in, and a duty that is yours. You are the gate-watch now."
- R4: "Genemon hands you the key to the kura. 'Mind the stores as if the rice were your own. The house is forgetting you were ever a stranger.' You are the kura-warden now."
- R5: "Genemon takes you onto the household staff proper — no longer a season-hired hand, but one who answers to the house day and night. The work is the same; the standing is not."
- R6: "Lady Chiyo sets you to the steward's errands — ledgers carried, messages run, the house's small business put in your hands. They are weighing you for something larger than a servant."
- R7: "The lord Shigemasa himself calls you to the inner rooms. 'You came to us with no name and nothing in your hands. Look what those hands have done.' For the first time the house reckons your worth — not as a servant, but as a man who might one day carry its standing."

## Pillars, judge, koku

After R7: four pillars — Arms 武威 · Estate & Wealth 家産 · Standing & Office
官威 · Name & Honour 家格 → House Influence 家威. Bands: GOOD 240 · GREAT 360
· EXCELLENT 480. The seasonal judge restates the koku standing 石 (a score,
never spent). Ascension copy (T0→T1): "The house gathers in the main hall.
The lord Shigemasa names you a man of the Kurosawa — no longer a servant
earning his rice, but one entrusted with the house's own standing. (You
ascend — the Estate rises.)"

## Calendar

24 ticks/day · 7-day weeks · 28-day seasons · spring 春 / summer 夏 / autumn
秋 (×1.3 harvest) / winter 冬 · continuous lunar phase (29.53-day period).
Date style: 安永九年 春 · 十四日 (An'ei 9, spring, day 14).

## Mock state presets (use these EXACT states so all prototypes compare)

- **minute-one**: pre-dawn dark. R0. No resources visible yet. HP hidden.
  ONE verb: "Rake the spilled rice." Everything else unrevealed/mysterious.
- **hour-three** (DEFAULT on load): R3 gate-watch just earned. Rung meter
  620/2950 toward R4 蔵番. Carried: rice 12 · coin 34 · wood 5 · sansai 3.
  Banked: rice 210 · coin 60. HP 46/58, satiety 51/64. Skills: Farming L3,
  Foraging L2, Woodcutting L2, Conditioning L2. Weapon: carrying-pole, Worn
  34/40. Combat L1 (XP 15/40). Bestiary: rat + monkey seen; wolf/mamushi
  fogged shapes; boar/bandit unknown. Quest active: Drive off the
  crop-raiders 1/3. Nodes known: kura, gate, paddies, woodlot, drill yard;
  near satoyama newly open, deep satoyama fogged. Date: 安永九年 春 · 十四日,
  waxing moon. Koku standing: 8 石. Estate: U0 (U1 affordable soon).
- **hour-ten**: R5 house-servant. Meter 2 210/3 250 toward R6. Carried: rice
  38 · coin 156 · wood 21 · sansai 9 · hardwood 4 · sinew 2. Banked: rice
  890 · coin 240. HP 66/66. Skills: Farming L7, Foraging L5, Woodcutting L6,
  Conditioning L5. Weapon: forged yari 槍 Pristine. Combat L4. Bestiary 5/8.
  Quests: 2 done, CLEAR active 2/3. All 7 nodes known. Estate U2
  (Recovering). Date: 安永九年 秋 · 三日 (autumn). Koku 47 石. Pillars
  visible: Estate 家産 218 (→GOOD 240).

## Demo beats (each prototype must play these on its dev-strip triggers)

- **tick**: one deed at the current place (yield line + eased count + the
  concept's physical feedback). Auto-tick ~every 2.5s when enabled.
- **fight**: monkey 猿, forecast 29% (勝目 二分九厘), stance choosable, 3–4
  exchange beats, win: HP 58→41 (use current HP proportions), log the
  verbatim win line, +3 coin +1 sinew.
- **rung**: play the NEXT rung ceremony with its real copy (from hour-three:
  R4, Genemon and the kura key) — the loud, sealed, milestone moment.
- **judge**: the seasonal audit: count/restate koku 8 石 → 11 石, season
  advances (spring→summer), palette/scene re-inks.
- **reveal**: reveal the next locked surface the concept's way (e.g.
  bestiary, market, a new place) with one narrated line.
- **season**: advance season only (re-theme without the audit).
- **reset / stage-1min / stage-3hr / stage-10hr**: jump between presets.
