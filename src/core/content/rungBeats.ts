// The rung-up STORY BEATS (D-110) — DATA, not script, parallel to the intro's DIALOGUE_SCENES.
// EVERY rung R1→R7 is a player-TRIGGERED VN beat that narratively MOTIVATES its unlocks (F97) and
// discovers its people (F99); SOME rungs introduce a new face (Tokubei R1, Rokusuke R2, Kihei R3,
// Tōzō R4, Chiyo R6, Shigemasa R7), others deepen a known one (the Genemon rungs). R0 has NO beat —
// the intro's Genemon scene IS the R0 beat (§6.6 R0); you never "promote into R0".
//
// Choices are relationship/flag-FIRST (§0): they mainly move `npcMemory` (via `deepenNpc`) + story
// `flags`, with only THREE rare, varied bonuses (BQ2): R2 `pedlar-favour` (a story flag), R3
// `statBonus` (+1 AGI), R4 `smith-whetstone` (a keepsake flag). The prose is the Kurosawa house,
// 1780 voice (the intro's register); each beat's `motivates` list is verbatim from the matching
// `ranks.ts` `rewardOnReach.unlock`. Pure-core: no DOM, no Math/Date — this module only carries data.

import type { AttrId, StanceId } from './balance';
import { NPC_NAME, type NpcId, type VoiceCategory } from './voices';
import type { RankId } from './ranks';
import type { IntroSetupLine, DialogueTopic } from './intro'; // reused verbatim
import { NAMES } from './names';

/** A rung-beat decision option: relationship + story-flag FIRST (§0). Unlike the intro's
 *  `IntroOption`, neither a perk nor a net-zero stat swap is required. */
export interface RungOption {
  readonly id: string; // stable, globally unique, e.g. 'r1-dutiful'
  readonly label: string; // the button copy (diegetic)
  readonly say: string; // the MC's spoken reply → Story, voice 'player'
  readonly react: string; // the speaker's reaction → Story, voice = the react speaker's
  /** For the two-voice beats (R4): the NPC whose voice/nameplate the `react` line speaks in, when it
   *  is NOT the scene's default decision speaker. Absent ⇒ the react uses the scene's speaker. */
  readonly reactNpc?: NpcId;
  /** ACCUMULATING relationship write(s) — an array so a two-voice beat can touch two NPCs (R4
   *  Genemon+Tōzō). `warmthDelta` ADDS (clamped -3..+3); `regard` overwrites only when present. */
  readonly memory?: readonly {
    readonly npc: NpcId;
    readonly warmthDelta: number;
    readonly regard?: string;
  }[];
  /** Story flags this choice sets — the durable record of the pick + any flag-backed bonus
   *  (`pedlar-favour`, `smith-whetstone`). Read by later beats / surfaces. */
  readonly flags?: readonly string[];
  /** The RARE small stat nudge (BQ2) — a modest one-time +attr, smaller than an intro perk. Present
   *  on EXACTLY ONE option (R3 'disciplined'); everything else omits it. `note` is the delight line. */
  readonly statBonus?: { readonly attr: AttrId; readonly amount: number; readonly note: string };
  /** For R5 only: the opening stance this pick makes your default (a story-DEFAULT, NOT a bonus). */
  readonly setStance?: StanceId;
}

export interface RungDecision {
  readonly prompt: string;
  readonly options: readonly RungOption[];
}

/** One rung beat. Mirrors `DialogueScene` but with a `RungDecision`. `topics: []` ⇒ a light-VN beat
 *  (greeting + decision, no ask-hub); a non-empty `topics` ⇒ a full VN meet (R3/R6/R7). The
 *  greeting's per-line `voice`/`speaker` carry two-voice beats (R4/R5). */
export interface RungScene {
  readonly id: string; // 'rung-r1' … 'rung-r7'
  readonly rank: RankId; // the TARGET rank this beat promotes INTO
  readonly voice: VoiceCategory; // the react/nameplate colour of the decision (fallback)
  readonly speaker?: NpcId; // the primary decision speaker (react nameplate)
  readonly greeting: readonly IntroSetupLine[];
  readonly topics: readonly DialogueTopic[]; // [] ⇒ light beat; else the ask-hub
  readonly decision: RungDecision;
  /** The `rewardOnReach.unlock` ids this beat narrates — a DOC/echo cross-check (a verify-content
   *  assert can pin beat↔unlock coherence, mirroring the surface check). */
  readonly motivates: readonly string[];
}

// convenience line builders (single-source the nameplates from NPC_NAME / NAMES)
const narr = (text: string): IntroSetupLine => ({ voice: 'narrator', text });
const says = (npc: NpcId, voice: VoiceCategory, text: string): IntroSetupLine => ({
  voice,
  speaker: NPC_NAME[npc],
  text,
});
/** Tokubei is an AMBIENT trader (no NpcId / no npcMemory slot — BQ6); his lines carry the name
 *  directly from NAMES, in the `villager` colour. */
const pedlar = (text: string): IntroSetupLine => ({
  voice: 'villager',
  speaker: NAMES.pedlar,
  text,
});

/** Keyed by TARGET rank. R0 has NO beat (the intro is the R0 beat). Partial ⇒ `begin_rung_beat`
 *  no-ops on a rank with no registered beat. */
export const RUNG_BEATS: Partial<Record<RankId, RungScene>> = {
  // ── R1 · Kept hand 下人 — Genemon (deepen; light-VN) ──
  R1: {
    id: 'rung-r1',
    rank: 'R1',
    voice: 'steward',
    speaker: 'genemon',
    motivates: [
      'room-gate-forecourt',
      'room-home-paddies',
      'verb-farm',
      'verb-haul',
      'readout-clock',
      'readout-stamina',
      'panel-rung-ladder',
    ],
    greeting: [
      narr(
        'Dawn at the gate. The forecourt is swept clean — your doing — and Genemon waits by the posts, watching you the way a man watches weather.',
      ),
      says(
        'genemon',
        'steward',
        `"You cleared the stores without being told twice. The house is short of hands and shorter of trustworthy ones. Stay — you're no day-hire now. Earn your rice."`,
      ),
      says(
        'genemon',
        'steward',
        `"The gate and the swept forecourt are yours to work now; stores come and go here. The home paddies too — the rice that feeds the house. And the kura's own repair is yours to tend: spend the house's small surplus to shore it up."`,
      ),
      narr(
        'A pack-laden stranger has laid a mat in the lee of the gate-post — an Ōmi pedlar, come because a tended gate draws trade. He lifts a hand as you pass.',
      ),
      pedlar(
        `"A tended gate's a lucky gate for a man with a pack. Tokubei, of Ōmi — mind if I keep my mat here a while, young master? Coin of your own spends as well as any lord's."`,
      ),
    ],
    topics: [],
    decision: {
      prompt: 'How do you take the keeping?',
      options: [
        {
          id: 'r1-dutiful',
          label: `"The house has my hands."`,
          say: `"The house has my hands."`,
          react: `"...Good. Hands that don't need watching are the rarest thing I keep."`,
          memory: [{ npc: 'genemon', warmthDelta: 1, regard: 'dutiful' }],
          flags: ['r1-dutiful'],
        },
        {
          id: 'r1-practical',
          label: `"A roof and rice is a fair trade."`,
          say: `"A roof and rice is a fair trade."`,
          react: `"Honest, and cold. A fair trade it is — see that you hold your half."`,
          memory: [{ npc: 'genemon', warmthDelta: 0 }],
          flags: ['r1-practical'],
        },
        {
          id: 'r1-ambitious',
          label: `"I mean to rise past a kept hand."`,
          say: `"I mean to rise past a kept hand."`,
          react: `"...Ambition, in a hand kept a day. Mind it doesn't outrun your worth."`,
          memory: [{ npc: 'genemon', warmthDelta: -1, regard: 'ambitious' }],
          flags: ['r1-ambitious'],
        },
      ],
    },
  },

  // ── R2 · Trusted hand 手代 — Genemon (deepen) + Rokusuke (new peer; light-VN) ──
  R2: {
    id: 'rung-r2',
    rank: 'R2',
    voice: 'villager',
    speaker: 'rokusuke', // the decision reacts in Rokusuke's voice
    motivates: [
      'tab-skills',
      'room-woodlot-edge',
      'room-near-satoyama',
      'room-deep-satoyama',
      'verb-woodcut',
      'verb-forage',
      'verb-face-wolf',
      'row-wood',
      'row-sansai',
      'skill-conditioning',
    ],
    greeting: [
      narr(
        'The near hill in first light. Genemon leads you past the forecourt for the first time, out to where the woodlot meets the wild edge of the satoyama.',
      ),
      says(
        'genemon',
        'steward',
        `"You can be set a task and trusted to finish it out of my sight — worth more than a strong back. The woodlot and the near hill are yours to work now; the house needs fuel and forage, and it trusts you to bring them in."`,
      ),
      says(
        'genemon',
        'steward',
        `"One more thing, and not a small one. A wolf's been at the grain stores in the night. Someone must face it — and there is no one else to send. Think on it."`,
      ),
      narr(
        'A lean man about your own age ambles up from the wood-stack, an axe on one shoulder, grinning as if you two already share a joke.',
      ),
      says(
        'rokusuke',
        'villager',
        `"Rokusuke — kept on two winters back, so I know where the bodies are buried. Do the work, keep your head down, don't let the old steward catch you idle. That's the whole of it."`,
      ),
      // F103: the porters-knot narration moved here off ranks.ts (§7.4), so all of R2's prose is Story.
      narr(
        "Knotting a load for the woodlot, your fingers tie a porter's knot you never learned — quick, certain, a stranger's habit in your own hands. It means nothing. It will not leave you.",
      ),
    ],
    topics: [],
    decision: {
      prompt: 'The wolf, and the man beside you — how do you take them?',
      options: [
        {
          id: 'r2-wolf-heeded',
          label: `"The stores are the house's life. I'll face it."`,
          say: `"The stores are the house's life. I'll face it."`,
          react: `"...Huh. Most men find a reason to be elsewhere. You might do."`,
          memory: [{ npc: 'rokusuke', warmthDelta: 0, regard: 'respected' }],
          flags: ['r2-wolf-heeded'],
        },
        {
          id: 'r2-rokusuke-friend',
          label: `"Tell me how the house really runs."`,
          say: `"Tell me how the house really runs."`,
          react: `"Now you're talking. Stick with me and you'll know which pedlar cheats and which steward's watching. Speaking of — old Tokubei keeps a softer price for a friend. Tell him I sent you."`,
          memory: [{ npc: 'rokusuke', warmthDelta: 1, regard: 'friend' }],
          // ⭐ rare STORY-FLAG bonus (BQ2): the market read honours `pedlar-favour` (Tokubei's friend-price).
          flags: ['r2-rokusuke-friend', 'pedlar-favour'],
        },
        {
          id: 'r2-solitary',
          label: `"The work's enough. I keep to myself."`,
          say: `"The work's enough. I keep to myself."`,
          react: `"Suit yourself. Offer stands, if you tire of your own company."`,
          memory: [{ npc: 'rokusuke', warmthDelta: -1, regard: 'solitary' }],
          flags: ['r2-solitary'],
        },
      ],
    },
  },

  // ── R3 · Gate-watch 門番 — Kihei (NEW · full VN meet; combat goes live) ──
  R3: {
    id: 'rung-r3',
    rank: 'R3',
    voice: 'arms',
    speaker: 'kihei',
    motivates: [
      'tab-combat',
      'panel-drill-yard',
      'readout-combat-level',
      'panel-bestiary',
      'panel-house-influence',
    ],
    greeting: [
      narr(
        `The drill yard behind the omoya, first light. You've stood over the grain-store wolf's carcass; word travels. A hard-faced man is already there, a bokken in each hand — and he throws you one without a word of greeting.`,
      ),
      says(
        'kihei',
        'arms',
        `"So. You put down the thing that had the run of our stores. Farmers don't do that. There's a soldier in you under the farmhand — I've watched it a week and I'm done pretending I haven't."`,
      ),
      says(
        'kihei',
        'arms',
        `"You're gate-watch now: a weapon, a yard to train in, and the estate's defence on your shoulders — pests, beasts, and the masterless men who drift down the woodlot road. Keep a field-guide of what you face; a soldier who knows his enemy outlives one who doesn't."`,
      ),
    ],
    topics: [
      {
        id: 'kihei-why-blade',
        label: `"Why set me to the blade?"`,
        answer: [
          says(
            'kihei',
            'arms',
            `"The house has walls and no one to stand on them. A great name with an empty granary draws wolves of both kinds. I'd sooner the man holding the gate be one who chose to."`,
          ),
        ],
      },
      {
        id: 'kihei-road',
        label: `"What's out on the woodlot road?"`,
        answer: [
          says(
            'kihei',
            'arms',
            `"Boar and wolf in season. And men — ronin, deserters, the leavings of every lord's quarrel — who'll take rice off a house too weak to keep it. That last is why you're really here."`,
          ),
        ],
      },
      {
        id: 'kihei-who',
        label: `"Who are you, drillmaster?"`,
        gate: (asked) => asked.has('kihei-why-blade'),
        answer: [
          says(
            'kihei',
            'arms',
            `"A man who soldiered for a house that no longer exists. Genemon kept the granary; I kept the walls. Ask me the rest when you've bled for the place."`,
          ),
        ],
      },
    ],
    decision: {
      prompt: 'How do you take up the blade?',
      options: [
        {
          id: 'r3-aggressive',
          label: `"Show me how to end a fight fast."`,
          say: `"Show me how to end a fight fast."`,
          react: `"Fast, he says. Fast gets you a spear in the back. But there's fire in it — we'll aim it before it burns you."`,
          memory: [{ npc: 'kihei', warmthDelta: -1, regard: 'eager' }],
          flags: ['r3-aggressive'],
        },
        {
          id: 'r3-disciplined',
          label: `"Teach me to stand a watch."`,
          say: `"Teach me to stand a watch."`,
          react: `"...Good answer. A wall that holds is worth ten swords that swing wild. Come at dawn — before the others."`,
          memory: [{ npc: 'kihei', warmthDelta: 1, regard: 'disciplined' }],
          flags: ['r3-disciplined'],
          // ⭐ rare STAT bonus (BQ2) — a modest one-time +1 AGI, smaller than an intro perk.
          statBonus: {
            attr: 'agi',
            amount: 1,
            note: 'Kihei drills you an extra dawn; your feet learn the watch. (+1 AGI)',
          },
        },
        {
          id: 'r3-duty-not-glory',
          label: `"I'd rather the paddies — but the house needs it."`,
          say: `"I'd rather the paddies — but the house needs it."`,
          react: `"Honest. I trust a man who'd rather not more than one who's hungry for it. The house is lucky in you."`,
          memory: [{ npc: 'kihei', warmthDelta: 1, regard: 'reluctant' }],
          flags: ['r3-duty-not-glory'],
        },
      ],
    },
  },

  // ── R4 · Kura-warden 蔵番 — Genemon (deepen) + Tōzō (new smith; light-VN, two-voice) ──
  R4: {
    id: 'rung-r4',
    rank: 'R4',
    voice: 'steward',
    speaker: 'genemon', // the decision defaults to Genemon; option 2 reacts in Tōzō's voice
    motivates: ['readout-durability', 'panel-equipment', 'verb-repair', 'house-omoya'],
    greeting: [
      narr(
        'Genemon meets you at the kura door with an iron key on a cord, worn smooth by other hands before yours.',
      ),
      says(
        'genemon',
        'steward',
        `"The kura key. Mind the stores as if the rice were your own — from today it half is. The house is forgetting you were ever a stranger. So am I."`,
      ),
      narr(
        "He walks you on to the woodlot smithy, where a bent old man coaxes an edge back onto a mattock. He doesn't look up.",
      ),
      says(
        'tozo',
        'arms',
        `"Tōzō. I keep the estate's iron. A blade you don't tend turns on you — bring me the hides and the metal off what you kill, and I'll show you what an edge wants. The forge is yours to use now; try not to ruin my fire."`,
      ),
      says(
        'genemon',
        'steward',
        `"And the omoya's shuttered rooms are aired and swept — the house rises, and you'll walk floors the family walks. Don't let it turn your head."`,
      ),
    ],
    topics: [],
    decision: {
      prompt: `How do you hold the key, and the house's surplus?`,
      options: [
        {
          id: 'r4-thrifty',
          label: `"Every grain accounted."`,
          say: `"Every grain accounted."`,
          react: `"Spoken like a steward. Good — the house was bled white once by hands that weren't."`,
          memory: [{ npc: 'genemon', warmthDelta: 1, regard: 'thrifty' }],
          flags: ['r4-thrifty'],
        },
        {
          id: 'r4-generous',
          label: `"Spend it on the house's needs — a mended kura feeds everyone."`,
          say: `"Spend it on the house's needs — a mended kura feeds everyone."`,
          react: `"Hah — the lad'd sooner fix the roof than count the rice. Here: a whetstone that's outlived three wardens. Keep your edge keen and it'll keep you."`,
          reactNpc: 'tozo', // the smith answers this one (two-voice R4)
          memory: [
            { npc: 'genemon', warmthDelta: 0 },
            { npc: 'tozo', warmthDelta: 1, regard: 'friend' },
          ],
          // ⭐ rare KEEPSAKE bonus (BQ2): the repair loop reads `smith-whetstone` (a small durability edge).
          flags: ['r4-generous', 'smith-whetstone'],
        },
        {
          id: 'r4-self-keeping',
          label: `"Keep a little back for myself."`,
          say: `"Keep a little back for myself."`,
          react: `"...I'll pretend I didn't hear that. See that I go on not hearing it."`,
          memory: [{ npc: 'genemon', warmthDelta: -1, regard: 'self-keeping' }],
          flags: ['r4-self-keeping'],
        },
      ],
    },
  },

  // ── R5 · House-servant 家人 — Genemon confers + Kihei teaches (deepen; light-VN, two-voice; BQ3) ──
  R5: {
    id: 'rung-r5',
    rank: 'R5',
    voice: 'arms',
    speaker: 'kihei', // the decision (the stance teach) reacts in Kihei's voice
    motivates: ['stance-control'],
    greeting: [
      narr(`Genemon calls you to the omoya's inner room — a place season-hands never see.`),
      says(
        'genemon',
        'steward',
        `"No longer a season-hired hand. From today you answer to the house day and night, and it answers for you. The work is the same. The standing is not."`,
      ),
      narr(
        'Then he walks you out to the yard, where Kihei waits with two bokken and something that might, on another man, be a smile.',
      ),
      says(
        'kihei',
        'arms',
        `"The standing means the house trusts your judgment now — so I'll trust you with the last of it. Set your stance before a foe: press to end it fast, or guard to outlast it. The call is yours, fight by fight. Show me you understand the choice."`,
      ),
    ],
    topics: [],
    decision: {
      prompt: 'What stance do you make your own?',
      options: [
        {
          id: 'r5-stance-aggressive',
          label: `"Press every fight — end it, don't outlast it."`,
          say: `"Press every fight — end it, don't outlast it."`,
          react: `"The tiger's way. Fast and final. It'll serve — until the day it doesn't. Mind that day."`,
          memory: [{ npc: 'kihei', warmthDelta: 0, regard: 'aggressive' }],
          flags: ['r5-stance-aggressive'],
          setStance: 'jodan',
        },
        {
          id: 'r5-stance-guard',
          label: `"Guard first — a live watchman beats a dead hero."`,
          say: `"Guard first — a live watchman beats a dead hero."`,
          react: `"The bear's way. Unglamorous. It's also why I'm old enough to teach you."`,
          memory: [{ npc: 'kihei', warmthDelta: 1, regard: 'steady' }],
          flags: ['r5-stance-guard'],
          setStance: 'gedan',
        },
        {
          id: 'r5-stance-adaptive',
          label: `"Read the foe — the call changes fight by fight."`,
          say: `"Read the foe — the call changes fight by fight."`,
          react: `"...The answer I hoped for and rarely get. There's a swordsman in you now, not just a gate-watch. Chūdan — the middle. Everything opens from it."`,
          memory: [{ npc: 'kihei', warmthDelta: 1, regard: 'adaptive' }],
          flags: ['r5-stance-adaptive'],
          setStance: 'chudan',
        },
      ],
    },
  },

  // ── R6 · Steward's man 用人 — Lady Chiyo (NEW · full VN meet) ──
  R6: {
    id: 'rung-r6',
    rank: 'R6',
    voice: 'steward',
    speaker: 'chiyo',
    motivates: ['house-workshops', 'house-granary'],
    greeting: [
      narr(
        `The omoya's formal room. Lady Chiyo sits behind a low table stacked with the house's ledgers, and studies you the way she'd study a column of figures that doesn't yet add up.`,
      ),
      says(
        'chiyo',
        'steward',
        `"So you are the river's foundling Genemon would not stop mentioning. Sit. I've errands that need a hand I can trust with more than a hoe — ledgers carried, messages run, the house's small business held close."`,
      ),
      says(
        'chiyo',
        'steward',
        `"The workshops wake again on the strength of your work — a forge, a joiner's bench — and a second granary rises behind the kura. They fall under your oversight now. You are being weighed for something larger than a servant. Do not disappoint the scales."`,
      ),
    ],
    topics: [
      {
        id: 'chiyo-need',
        label: `"What does the inner house need?"`,
        answer: [
          says(
            'chiyo',
            'steward',
            `"Order. A great name is a heavy thing to carry with an empty purse — I keep the two from crushing us. I need a man who does what's asked and asks nothing back he hasn't earned."`,
          ),
        ],
      },
      {
        id: 'chiyo-trust',
        label: `"Why trust an outsider?"`,
        answer: [
          says(
            'chiyo',
            'steward',
            `"An outsider owes no old faction and carries no old grudge. You are loyal to this house or to nothing — and a man loyal to nothing is easy to read. I prefer easy to read."`,
          ),
        ],
      },
      {
        id: 'chiyo-lord',
        label: `"The lord — is he well?"`,
        gate: (asked) => asked.has('chiyo-need'),
        answer: [
          says(
            'chiyo',
            'steward',
            `"Shigemasa is old, and tired, and prouder than either. His heir Naoyuki is young and wary and not yet ready to carry it. Between them the house needs steady hands more than another sword. Remember that when the drillmaster fills your head."`,
          ),
        ],
      },
    ],
    decision: {
      prompt: 'How do you serve the inner house?',
      options: [
        {
          id: 'r6-loyal',
          label: `"The house's name is my name now."`,
          say: `"The house's name is my name now."`,
          react: `"A large thing to say. Larger to mean. We shall see which you've done."`,
          memory: [{ npc: 'chiyo', warmthDelta: 1, regard: 'loyal' }],
          flags: ['r6-loyal'],
        },
        {
          id: 'r6-ambitious',
          label: `"I'd carry more than errands."`,
          say: `"I'd carry more than errands."`,
          react: `"Ambition. I neither trust it nor waste it. Carry the errands first; the more comes to those who don't ask for it."`,
          memory: [{ npc: 'chiyo', warmthDelta: 0, regard: 'ambitious' }],
          flags: ['r6-ambitious'],
        },
        {
          id: 'r6-discreet',
          label: `"A steward's man keeps the house's silences."`,
          say: `"A steward's man keeps the house's silences."`,
          react: `"...Yes. That, more than the errands, is the post. You understand it already. Good."`,
          memory: [{ npc: 'chiyo', warmthDelta: 1, regard: 'discreet' }],
          flags: ['r6-discreet'],
        },
      ],
    },
  },

  // ── R7 · Trusted of the house 内衆 — Shigemasa (NEW · full VN meet — capstone) ──
  R7: {
    id: 'rung-r7',
    rank: 'R7',
    voice: 'official',
    speaker: 'shigemasa',
    motivates: ['house-study'],
    greeting: [
      narr(
        `The shoin — the lord's own writing-room, where the house's real business is done and few servants ever cross the threshold. Shigemasa is smaller than his name, and older, and his eyes miss nothing.`,
      ),
      says(
        'shigemasa',
        'official',
        `"Come in. Sit — no, closer. I would see the man Chiyo and Genemon and even that flint Kihei agree upon, which they have not done in twenty years."`,
      ),
      says(
        'shigemasa',
        'official',
        `"You came to us with no name and nothing in your hands. Look what those hands have done — the kura full, the walls kept, the workshops loud again. I admit you to this room. The measure of the House itself takes shape before you now. Few servants ever stand where you stand."`,
      ),
    ],
    topics: [
      {
        id: 'shigemasa-house',
        label: `"How is a house weighed?"`,
        answer: [
          says(
            'shigemasa',
            'official',
            `"Not in koku alone, though the granary matters. In its name, its arms, its office, the memory it leaves. I have spent my life keeping one pillar from pulling down the rest. Soon that reckoning will lie open before you — and you will see how far a house can yet rise."`,
          ),
        ],
      },
      {
        id: 'shigemasa-of-me',
        label: `"What would you have of me?"`,
        answer: [
          says(
            'shigemasa',
            'official',
            `"More than I have the right to ask of a servant, and less than I suspect you'll one day give. For now — carry the house's standing as if it were your own name. Perhaps, in time, it will be."`,
          ),
        ],
      },
      {
        id: 'shigemasa-heir',
        label: `"And your heir?"`,
        gate: (asked) => asked.has('shigemasa-house'),
        answer: [
          says(
            'shigemasa',
            'official',
            `"Naoyuki. He is young, and he watches you already — not all of it kindly. A house has room for an heir and an able man both, if both are wise. See that you are the wise one; I cannot always be here to remind him."`,
          ),
        ],
      },
    ],
    decision: {
      prompt: 'How do you answer the lord?',
      options: [
        {
          id: 'r7-devoted',
          label: `"I'll carry the Kurosawa name as far as it can go."`,
          say: `"I'll carry the Kurosawa name as far as it can go."`,
          react: `"The house before the man. It is what I would have said at your age. Whether it was wisdom or only habit, I have never decided."`,
          memory: [{ npc: 'shigemasa', warmthDelta: 1, regard: 'devoted' }],
          flags: ['r7-devoted'],
        },
        {
          id: 'r7-ambitious',
          label: `"A name can be made as well as served."`,
          say: `"A name can be made as well as served."`,
          react: `"...Bold. To my face, no less. I'll not pretend it pleases me less than the safe answer would have."`,
          memory: [{ npc: 'shigemasa', warmthDelta: 0, regard: 'ambitious' }],
          flags: ['r7-ambitious'],
        },
        {
          id: 'r7-humble',
          label: `"I only did the work in front of me."`,
          say: `"I only did the work in front of me."`,
          react: `"And that, I think, is why it came to so much. Remember it when louder men tell you otherwise."`,
          memory: [{ npc: 'shigemasa', warmthDelta: 1, regard: 'humble' }],
          flags: ['r7-humble'],
        },
      ],
    },
  },
};

/** The beat that promotes INTO `target`, or undefined when the target has no registered beat. */
export function rungBeatFor(target: RankId): RungScene | undefined {
  return RUNG_BEATS[target];
}

/** The topics askable RIGHT NOW in a rung beat — those whose `gate` passes over the asked-set.
 *  Mirrors the intro's `availableTopics`; asked topics STAY + are re-askable (the caller dims them). */
export function availableRungTopics(scene: RungScene, asked: ReadonlySet<string>): DialogueTopic[] {
  return scene.topics.filter((t) => (t.gate ? t.gate(asked) : true));
}

/** Find a rung-beat topic by id (the `ask_rung_topic` reducer looks up the asked topic). */
export function rungTopic(scene: RungScene, topicId: string): DialogueTopic | undefined {
  return scene.topics.find((t) => t.id === topicId);
}

/** Find a rung-beat decision option by id (the `choose_rung_option` reducer looks up the pick). */
export function rungOption(scene: RungScene, optionId: string): RungOption | undefined {
  return scene.decision.options.find((o) => o.id === optionId);
}
