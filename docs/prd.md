# Kamikakushi — Product Requirements Document (PRD)

> **Status: DRAFT — under section-by-section review.** Nothing here is locked until it is reviewed
> with the human and recorded as an ADR in [`history/decisions.md`](history/decisions.md). No code is
> written until §7 (the roadmap) is approved.
>
> **Working title:** *Kamikakushi* (神隠し, "spirited away"). A single-player, story-driven
> **incremental RPG** set in Edo-period rural Japan, built as a static HTML5 + TypeScript web game,
> deployable to itch.io.

## How to read this document

This PRD plans the **whole saga in full detail up front**, but is **authored and reviewed one section
at a time**. Each section is drafted in full, walked through with the human, revised, and its load-bearing
decisions locked as ADRs before the next section is drafted.

| § | Section | Status |
|---|---------|--------|
| 1 | Vision, pillars & grounded story spine | **✅ Locked** (ADRs D-001…D-006) |
| 2 | Systems & mechanics catalog | _not started_ |
| 3 | Incremental unlock ladder (UI-as-progression) | _not started_ |
| 4 | Combat, progression & balance model | _not started_ |
| 5 | Full act-by-act narrative & content | _not started_ |
| 6 | Tech architecture & data model | _not started_ |
| 7 | Milestone roadmap, v1 scope & deployment | _not started_ |

---

# §1 — Vision, Pillars & Grounded Story Spine

## 1.1 Vision statement

You are a **mediocre 17-year-old farmhand** who wakes injured and nameless at a remote lower-samurai
(*goshi*) estate in a mountain valley, with no memory of how you got there. A grieving village is
certain you are **Tama**, the child "spirited away by the kami" ten years ago — but you are not, and
nothing supernatural ever happens. Through nothing but **daily toil and a refusal to quit**, you rebuild
yourself from useless to barely-capable, and in doing so peel back the wholly human truths the
*kamikakushi* legend was invented to hide: who you really are, what really happened to the lost child,
and why the road and river that nearly killed you still run — lethal and lied-about — right past your
new home.

The **signature feature is that the UI itself is incremental.** Minute one is a single line of
narration, a persistent event log, and one verb. Over hours and days, every panel, tab, resource,
skill, and area fades in **one at a time — and every reveal is a story beat**, never silent menu growth.
Peaceful Edo labour (farm, forage, woodcut, fish, craft) is the daily texture and the **rice (*koku*)
economy** is the numbers-go-up heartbeat; idle, auto-resolving combat is the rare, dangerous exception
(vermin, bandits, the mountains). The **human mystery is the retention engine**, and it is bought with
the same currency as everything else: **trust and competence, both earned only through grind.**

Built as a **pure, deterministic TypeScript core** (one seeded RNG, data as single source of truth)
with a thin DOM renderer, shipped as a static build.

## 1.2 Design pillars

1. **UI-as-progression — the interface is the reward.** Start with one verb and a story log; reveal each
   panel / tab / resource / skill exactly when first earned, and announce every reveal **diegetically**
   through the log, so feature unlocks read as *plot*, not menu inflation.
2. **Numbers-go-up is a training montage you earn.** The protagonist starts genuinely **mediocre** —
   low stats, slow labour, blistered hands — and rises *only* through repetition, rest, better technique,
   and crafted tools. There is **no hidden talent, bloodline, or secret training**. The zero-to-competent
   grind *is* the fantasy; every climbing number is sweat the player chose to spend.
3. **Story and systems are one dependency graph.** A single rewards/unlock bus — emitted by dialogue,
   quests, labour thresholds, and combat — drives **both** the narrative flags **and** the UI reveals.
   **Trust (reputation, earned by sustained labour) and competence (skills) are the currency that
   unlocks the truth.** Mystery progress is literally purchased with grind.
4. **Folklore is believed-atmosphere, never physics.** Yokai are how frightened, grieving, powerless
   people explain a dangerous world — treated with respect, never mockery. **Every "yokai" resolves to a
   concrete human or natural cause** (a one-to-one belief→cause table). A thin, deliberately-rare margin
   of *unresolved* ambiguity is kept for unease, but it is **always off-screen, mundane-readable, never
   mechanized, and never grants the player anything.**
5. **Deterministic, testable, generated.** Pure-core boundary (no DOM in logic), one seeded RNG, save
   only non-derivable state, generate balance/content docs from the same data the game runs on, and a
   DEV-only play API so every unlock and pacing beat is headlessly regression-tested.

## 1.3 Premise & tone

> *A mediocre 17-year-old farmhand wakes injured and nameless at a remote lower-samurai estate where a
> grieving valley is certain he is Tama, the child "spirited away by the kami" ten years ago — and
> through nothing but daily toil and a refusal to quit he must rebuild himself from useless to
> barely-capable while uncovering the wholly human truths the kamikakushi legend was invented to hide.*

**Tone:** grounded, bittersweet **Edo folk-mystery**. Cozy daily labour with a quiet, grim undercurrent;
warmth and found-family (Sayo, Obaa Sato, Jūbei, Kiku) deliberately counter-weighting dark material
(a drowned hamlet, a child nearly sold for debt, official negligence) which is handled with **off-screen
restraint**. The catharsis is **never power** — it is a nobody becoming someone real by his own hands,
and forcing a forgotten village's name to be spoken aloud. Justice is **partial**: the reachable culprits
answer; the truly powerful largely escape, because that is how the world is.

## 1.4 The protagonist & the "mediocre-start" contract

The protagonist is **plainly, mechanically ordinary** from the first minute, and the game says so in text
and numbers. The opening "gameplay" is literally **convalescence** — he is a concussed, feverish invalid
who can barely stand. When he can work, his hands blister on the first hoe; he is slower than the
ten-year-old who shows him the paddy. His one genuine asset is **temperament**: stubbornness, a strong
back, a patient temper, a refusal to stop getting up — exactly what the incremental grind rewards.

**Hard guardrails (locked design constraints, enforced in writing _and_ code):**

- **No hidden edge, ever.** No bloodline, no secret training, no weapon that "answers to him," no body
  that "remembers" combat. The one thing the village treats as special about him — that he is the
  returned Tama — is **false**.
- **The porter's-knot rule.** He sometimes ties a porter's load-knot on instinct. This is **procedural
  body-memory** (like still knowing how to walk after amnesia), framed as a labourer's habit ("huh,
  you've hauled before") — it is a **narrative identity clue only and confers ZERO mechanical bonus.**
- **The dream rule.** The recurring half-drowning dream only ever returns **memories of things he
  actually lived** (his name, "Kuzuhara", the caravan, the flood). It **never** surfaces external facts
  he could not have known firsthand — it is ordinary returning memory, **not clairvoyance.**
- **Growth is grind, not gift.** Plateaus are real; the answer to a wall is never a magic item, only more
  reps, better technique, rest, and better tools. Combat capacity is **gated behind labour-built
  conditioning** ("the spear is just a long hoe held with intent").

**Naming note (locked — ADR D-006):** the village calls him **"Tama"** (the borrowed name) for most of
the game; his **true name — _Tahei_ — is a late reveal** (Act 4). *Tahei* is a plain, period-typical
commoner name (the synthesis's "Ren" was dropped as faintly modern). The protagonist is **male, with a
fixed name and no player rename** — the legend's gender-drift clue (the village misremembers the real
Tama as a boy) depends on it.

## 1.5 The central mystery & the grounded truth

The mystery is **four nested, deliberately-tangled human questions**, with the valley's supernatural
certainty as the red herring blocking every mundane answer:

1. **Am I Tama?** The village insists the kami returned their lost child.
2. **If not, who am I?** The calluses, the porter's knots, a name surfacing in a dream demand an origin.
3. **What really happened to the real Tama?** If he isn't her, the original disappearance reopens as an
   unsolved human case.
4. **Why does the valley — and the power above it — need all of this buried?** The same flood, road, and
   officials that nearly killed him are still moving rice and silver, still calling their crimes "the
   will of the kami."

**The grounded truth (revealed piece by mundane piece):**

- **He is _not_ Tama.** The resemblance is real but coincidental and suggestible (right age, similar
  build, a birthmark near the same place); a decade of grief and guilt did the rest. *The legend has even
  drifted on details — it "remembers" the child as a boy — a fair, re-readable clue.*
- **His real identity:** an orphaned tenant-farmhand-turned-**porter** from **Kuzuhara**, an upstream
  hamlet, indentured to a transport guild to work off a dead parent's debt. His amnesia is ordinary head
  trauma: a **neglected upstream embankment** failed in a flash flood that tore through the porters'
  caravan; he was struck, half-drowned, swept downriver, and snagged at a weir below the estate.
- **Kuzuhara did not "anger the gods."** During a famine, the deputy magistrate's office quietly diverted
  the corvée labour and relief-rice that maintained the upstream embankment to protect the downstream
  **tax fields**; a frightened headman doctored the ledgers. When the monsoon came, the undermined weir
  failed and the poorest hamlet drowned while the protected fields held — **negligence shading into a
  chosen sacrifice of the expendable**, then blamed on the kami.
- **The real Tama was never taken.** Tama (a **girl** — the gender drift is the clue) **ran** from a
  violent stepfather and a household about to **sell her into service** to clear a rice debt owed to the
  Kurosawa estate. A midwife and a peddler helped her flee; she has been **alive and grown the whole
  decade**, working in a down-valley post-town, too ashamed to return. The adults let "the kami took her"
  stand because a tragic miracle is easier to live with than "we were about to sell a child."
- **One rotten root.** The rice debt that nearly sold Tama is the same **debt-and-quota machine** that
  drowned Kuzuhara — which is why the estate's own old guilt and the magistrate's racket are one thing.
- **Resolution is human and partial.** Ren can undo none of it. He recovers his ordinary, sad past
  (his family did not survive), reunites the valley with the living, grown Tama, and forces the buried
  truths open through **evidence and testimony** — a doctored ledger, a corvée tally-stick, a rigged
  *masu* measuring-box, a guilt-sick clerk, a porter-witness — via a formal over-the-head petition
  (*osso*, historically **deadly**). The reachable culprits answer (headman, steward, enforcer); the
  **untouchable magistrate largely escapes.** Kuzuhara's drowned are named at last; Tama is freed to
  choose; Ren claims a true name and a life he built by hand.

## 1.6 Folklore handling — the belief→cause table

Every named "yokai" is introduced as **genuine, respected village dread**, investigated through ordinary
work, and resolved to a concrete cause — but the game **lingers in the unease before resolving**, and
debunks with **dawning dread, never a Scooby-Doo unmasking**.

| Folk belief | Grounded cause |
|---|---|
| **Kamikakushi** (the master lie) | People who fled debt / violence / conscription, or died on a lethal fog-blind road — and the protagonist himself (flood trauma). |
| **Kappa** at the weir/ford | A real undertow + undercut bank; a poacher's weighted nets; **the smugglers' sinking-spot** for evidence and inconvenient witnesses (the player physically recovers a weighted bundle, and once a corpse). |
| **Tanuki** stealing rice | A skimming foreman feeding the racket. |
| **Fox-fire / ghost-lights** on the ridge | A charcoal-burner's hidden kiln; later, the magistrate's men moving through forbidden ground at night. |
| **One-eyed mountain god** of the pass | The scarred *rōnin* enforcer's lookout. |
| **Yamanba** of the high woods | A flood-burned widow surviving feral — "defeated" by being **fed and resettled** (a mercy quest, not a kill). |
| **Tengu** of the high cedars | A fugitive ex-foot-soldier who becomes a wary teacher of mountain-craft and a key witness. |
| **Yearly soul-calling rite** | Grief-work that nonetheless yields hard evidence (the priest's register ties the disappearances to the road). |

**Residual ambiguity (capped at two unresolved, off-screen beats):** an **unidentified hand** that leaves
an offering at the boundary-stone where he was found; and one **dream-edge** that lands a shade too neatly.
The "helpful fox" is **de-fanged** to flatly explicable behaviour (foxes path toward water and low ground;
he followed because he was desperate). Nothing is ever confirmed supernatural; nothing is mechanized.

## 1.7 Act structure

The saga is six acts; **each act gates the next tier of UI/systems diegetically** (see §3 for the full
ladder). Story access and UI unlocks are the **same currency — trust and competence, both bought with
labour** — so the incremental reveal and the truth-coming-out advance in lockstep.

- **Act 0 — The Weir (Prologue / onboarding).** He wakes feverish and nameless in the estate storehouse,
  pulled half-drowned from the river. The steward's daughter **Sayo** names him "Tama" on sight; word
  races that the kami have returned the spirited-away child. UI is near-bare and diegetic — a body/rest
  bar, a rice counter, one or two survival tasks — because he is an **invalid earning his keep**. Recovery
  *is* the tutorial. Ends when he survives his first task and earns a sleeping-place: he has **chosen to
  stay and find out who he is.**
- **Act 1 — Earning Your Rice (the labour economy unlocks).** Recovery through repetition. Season by
  season, farming → foraging → woodcutting → fishing → basic crafting unlock **one panel at a time**, each
  gated by rising stamina and by NPCs literally granting access. The *koku* economy comes online. Folklore
  texture thickens (the soul-calling rite, the feared ford, the "tanuki", offerings at the stone). He
  grows attached to the estate — to old **Jūbei**, the herbalist **Obaa Sato**, and especially **Sayo**,
  whose desperate hope that he *is* her lost friend is the warm hook and the engine of the red herring.
  Act ends with the **humbling, near-fatal first fight**.
- **Act 2 — Calluses (training & the first threads).** Shamed by the beating, he begs aging guardsman
  **Jūbei** for drills; the **training / idle-combat / conditioning** systems unlock as a grind loop he
  keeps failing — all gated behind labour-built stamina. Investigating the thieves and the "tanuki" leads
  to a skimming foreman and the first hard fact: **the road moves more rice than the books admit.** A
  recovered manifest scrap, the porter's-knot habit, and a debt-token surface; the dream-name resolves to
  **"Kuzuhara."** The deputy's man takes a too-keen interest, and the legend starts not adding up.
- **Act 3 — The Things People Remember (investigation & the mountains).** Now capable enough to range, he
  pushes into the forbidden upstream ruins and the dangerous mountains, unlocking **deep gathering,
  expeditions/logistics, and an investigation layer.** The "haunting" of the dead valley resolves into a
  feral survivor, **Kiku**, who recognizes him — both were Kuzuhara children. Together they uncover the
  disaster's shape and its cover-up; the kappa-ford and one-eyed-god resolve. He finds proof **Tama was a
  girl who ran** — the gut-punch that detonates the village's miracle — and confirms his own ordinary
  porter's past. The two buried lies reveal themselves as **one rice-quota machine.**
- **Act 4 — The Ledger and Your Own Name (climax — the case).** Not a magic duel but a **case against
  power.** He tracks the threads down-valley to the peddler, the post-town, and the **living, grown Tama
  ("Oharu")**, and confirms his name. With allies he assembles mundane proof; the powerful now hunt him as
  a troublesome witness. He still **cannot win by force** (proven again in a losing skirmish with the
  enforcer) — only by getting the truth above the guilty via formal **petition (*osso*)**. Reachable
  culprits answer; the untouchable magistrate escapes; Kuzuhara's dead are named and shrined; Tama is
  freed to choose. He learns there was **never anything heroic to go back to.**
- **Act 5 — Spring Again (diegetic reset / new cycle).** A grounded **season-cycle time-skip** — *not*
  reincarnation, *not* a loop. The valley is safer but scarred; Jūbei is too old. Ren is given standing of
  his own and **chooses**: take stewardship of the estate's fields and trails, **or** set out with Kiku to
  re-found Kuzuhara as a tiny resettlement and open a humble **training-and-workhouse** for other famine
  orphans and strays. The cramped tenant UI and its early caps are left behind; the map and economy expand
  to a higher tier; and **all hard-won skill, reputation, recipes, tools, and relationships carry forward**
  as meta-progress and as the baseline he now **teaches** to NPC students (who become idle
  producers/fighters). Effort-over-talent becomes literally generational. Farther-off *kamikakushi*
  rumours seed the next cycle on the same grounded promise.

## 1.8 The diegetic reset (Act 5) in detail

A grounded season-cycle time-skip framed as **a veteran starting a bigger venture** — the natural Edo
rhythm of seasons and of an apprentice becoming a master. Mechanically it is the **meta-progress
carry-over**: early UI/caps are retired; the map, season, and economy reset fresh to spring planting at a
**higher tier**; but **every skill rank, reputation point, recipe, tool, *koku* stockpile, and
relationship persists** as the new baseline — and now also as bonuses he **teaches** to NPC students, a
light teaching/management layer (students become idle producers and fighters).

> **Guardrail:** the carried meta-progress must be **visually explicit at the transition** (a kept
> skills/reputation/recipe panel that persists on screen across the time-skip) so it unmistakably reads as
> "a master who climbed once, now teaching from the same zero" — **never a wipe, never a soft rebirth**
> that muddies the no-magic promise.

## 1.9 Cast — key NPCs

Most NPCs do **double duty** (a yokai-debunk *and* a mystery clue in the same beat) to keep the web legible.

| NPC | Role | Function |
|---|---|---|
| **Jūbei** | Aging lone retainer/guardsman; a competent-but-never-great old foot-soldier | Mentor & combat-training gatekeeper; embodiment of *effort over talent* ("Talent is a story the lucky tell. You are not lucky. So you will work."). Carries famine-era guilt; his decline motivates the Act 5 training hall. |
| **Sayo** | The steward's daughter, ~16, sharp and kind; keeper of the valley's news | Guide, emotional anchor, **living heart of the red herring** — names him "Tama" and needs him to be her lost friend. Tutorializes the farm/economy loop; channels rumour-as-gameplay; her reckoning with the truth (and her family's complicity) is the emotional spine. |
| **Obaa Sato** | Village herbalist / wise-woman | Grounding voice — treats the scalp wound (anchoring the mundane amnesia), names symptoms not visions, gently debunks superstition, teaches early foraging/crafting. The warm face of the village's denial. |
| **Kiku** | A feral survivor in the ruins of the drowned upstream valley | Mystery-key & found-family — the "vengeful spirit" resolved into a person; a fellow Kuzuhara child who holds the memory he lost. Co-founder of the Act 5 resettlement. |
| **Genza** ("the tengu") | A fugitive ex-foot-soldier living rough in the high cedars | Grounded-yokai reveal + mountain-craft teacher + key witness in one. A gentler second model of the effort theme (survives on hard-learned skill, not gift). |
| **Kuroiwa** | The deputy magistrate's agent (*tedai*) — polite, patient, dangerous | **Primary human antagonist**; local architect of the tax-quota cover-up & smuggling racket; benefits from the comforting myth; hunts the protagonist as a witness. Defeated by **evidence, not violence**. |
| **Headman Yagōemon** | District village headman (*shōya/nanushi*) | Antagonist-of-record and the **humanly-reachable culprit** — a frightened middle-man who chose his own village over Kuzuhara, not a monster. |
| **Hanzaki** | A scarred *rōnin* enforcer — the "one-eyed mountain god" | Recurring physical threat and the **thematic mirror**: real, natural talent **gone rotten**. Out-fights Ren early; the finale is survived by **trained endurance**, never by out-talenting him. |
| **Clerk Naozane** | A guilt-sick junior clerk in the magistrate's office | Mystery-key & witness — the crack in the cover-up; supplies the documentary proof that makes the petition possible. |
| **Oharu** (the real Tama) | The "spirited-away" child, alive and grown in a post-town | Mystery payoff & living proof; her existence detonates the red herring. Reunion kept **costly and incomplete** (she may not forgive). |
| **Sōkichi** | An itinerant medicine-peddler | Quest-giver & information broker; the engine that lets the player chase clues beyond the home village; grounded source of many yokai tales. |

## 1.10 Emotional hook

The ache of being **handed an identity you didn't earn and can't be sure you want** — and the harder
dignity of **becoming someone real anyway, by your own hands.** A whole grieving valley *needs* him to be
their lost child; the kindest people (Sayo above all) will be hurt by the truth. The growth-through-toil
loop makes the dignity tangible: **every number that climbs is proof he is building an honest self rather
than wearing a dead child's.** The hours of grind *are* the character's hard-won belonging — so the
numbers going up feel like a person growing roots.

## 1.11 Risks & guardrails (from the adversarial constraint review)

The story passed the adversarial check on all six hard constraints; these are **drift hazards** to hold
the line on while authoring:

- **Ambiguity stacking** → cap unresolved supernatural beats at **two, off-screen**; de-fang the fox.
- **Dream as info-channel** → enforce the **memory-only, never-clairvoyance** rule (§1.4).
- **Porter's-knot creep** → **zero mechanical bonus**, identity clue only (§1.4).
- **Hanzaki "talent" mirror** → write the win as **trained-ordinary-beats-squandered-talent**, never luck.
- **Reset feeling like a wipe** → meta-progress **visibly kept** on screen across the time-skip (§1.8).
- **Tonal whiplash** → off-screen restraint for the darkest beats; warm daily-loop counterweight.
- **Scooby-Doo anticlimax** → debunk with dread, not gotcha; keep the valley's hush.
- **Partial justice must land as deliberate** → reachable culprits answer, the untouchable escapes.
- **Authenticity** → research-harden *goshi* status, the *daikan/tedai/shōya* chain, *osso*'s lethal risk,
  corvée & embankment upkeep, *masu*/*koku* measurement and the rigged-*masu* fraud, *kaidō* porter
  culture — specific and correct **without lecturing**. Child-selling-for-debt kept off-screen and
  framed as human tragedy, not exploitation.

## 1.12 Decisions for §1 — all locked

| Decision | Resolution | ADR |
|---|---|---|
| **D-§1-a — Story spine** | Adopt the grounded mistaken-identity / kamikakushi-red-herring / rice-quota cover-up spine as canon | D-001 |
| **D-§1-b — Mediocre-start contract & guardrails** | No-hidden-edge rules (porter's-knot = zero bonus, dream = memory-only, grind-not-gift) binding on writing *and* code | D-003 |
| **D-§1-c — Folklore = belief→cause** | Every yokai resolves to a human/natural cause; residual ambiguity capped at two off-screen, mundane-readable beats; the fox is de-fanged | D-002 |
| **D-§1-d — Bittersweet partial justice + one grounded reset** | Reachable culprits answer; the untouchable magistrate escapes; one diegetic season-cycle reset carries meta-progress | D-001, D-004 |
| **D-§1-e — Protagonist identity** | True name **Tahei** (revealed Act 4); borrowed village-name "Tama" until then; **male, fixed name, no rename** (protects the gender-drift clue) | D-006 |
| **D-§1-f — Working title** | *Kamikakushi* (revisit the store title before launch) | D-005 |

---

_§1 is locked. §2 (Systems & mechanics catalog) is authored next._
