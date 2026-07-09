<!-- The GENERALIZED VN scenes (storywave G3.5 / FB-5) — the AUTHORING SOURCE OF
  TRUTH for scenes NOT tied to a rung promotion: the season-exit ceremony (nengu),
  the R5 Count's scene body, and the authored side-beats (U8). Compiled to
  src/core/content/scenes.gen.ts by `pnpm run gen:narrative`; re-exported by
  ../scenes.ts (which keeps the types + sceneById). Format spec: ./README.md.

  Fiction-voiced text is drawn VERBATIM from picked ADR-139 takes (register law
  §0.5 — never invented): the Count from u5 take-c; the side-beats from
  u8 take-c base + take-a grafts (per u8 VERDICT.md THE PICK); the nengu frame
  from the HD-30 diverge; the five per-season overlays from the C5a diverge
  (unit 1 — closing the 05-world per-season-overlay lock). -->

<!-- ── The season-exit ceremony ─────────────────────────────────────────────
  The nengu (land-tax) reckoning is Autumn's REFUSING exit gate (ADR-166,
  human-ruled 2026-07-09; economy spec ADR-163): `trigger: scripted` — the
  REFUSED Autumn exit enqueues it (intents.ts advance_season), its completion
  performs the reckoning (nengu.ts — kura draw; latches `nengu-reckoned` that
  R7 gates on + the per-year re-arm flag), and the next exit attempt passes.
  REPEATABLE (no `once`): the board comes out every Autumn — the felt frame
  of the annual tax. The board, the MC as furniture, felt-never-numbered.
  AUTHORED via the HD-30 narrative-diverge
  (2026-07-09): a 3-take blind fleet → self-pick TAKE C (the speakerless
  MC-as-furniture take — tightest to the bible's "pays by inches we SHOW, never
  discussed" + "the MC as furniture"), with one grafted image from take A ("the
  house's true size"). Alternates A & B live in the OPEN bundle
  takes/hd30-nengu/ — swappable LIVE in DEV → Story (ADR-139, HR-17); the dir is
  pruned on sign-off. The five other per-season overlays shipped at C5a (the
  `turn-*` scene-defs below — ADR-167). -->


## scene-def nengu-autumn-frame
trigger: scripted
voice: narrator

> Autumn thins to its last day, and the board comes out at an hour it does not
> usually keep. The whole house comes with it: the family by the book, the hands
> by the door, and you in the corner — counted as part of the room, and not
> asked into it.

> Genemon reads the year against the house. The harvest in and weighed, the
> lease, the winter's wood — and then the one thing the house owes the land, that
> must be answered before the season is allowed to turn.

> Nobody reads the sum aloud. It arrives the way weather arrives: the room goes
> still around it, a breath drawn and not let go, every eye on the book and none
> on one another.

> Chiyo looks once, and briefly, at a screen that will not be in its room by
> spring. That is all that is shown of it, and none of it is explained. You are
> learning the house's true size by what it will let itself be seen without.

> The book closes. The house has answered for the land; its autumn can end. You
> are still in the corner. Nobody tells you the season is over. It is.

<!-- ── The R5 Count (u5 take-c) ──────────────────────────────────────────────
  The accusation night — a `scripted` night-interrupt (the engine pulls the MC
  from sleep at nightfall of the R5 earning day). Migrated VERBATIM from
  t0v2/u5-r5-accused/take-c.md with the redlines: Naoyuki break-offs trimmed to
  ≤ 2; "It takes as long as it takes." and "It is not malice." deleted; one
  narration epigram kept. The scene continues past the decide (the tally, Toku,
  the morning wage) — split at the take's marked native seam into the chained
  `count-resolve` beat (README: "If the grammar's decide must end a scene, split
  at the seam into a chained second beat"). -->

## scene-def count
trigger: scripted
once: true
speaker: genemon
voice: steward

> A hand shakes you awake in the dark of the woodshed. Rokusuke, with a
> lantern, looking mostly at the door.

Rokusuke: "Board room. The whole house is called. You as well. I only
fetch."

> Lamps at the board at the wrong hour. The household stands in two rows —
> the hands by the door, the house by the book — and between the rows there
> is more floor than the room usually has. You are shown to the middle of it.
> Nobody arranged that.

Genemon: "The alcove chest stands open. One item short against the book. A
packet — cloth, bound with cord, a hand's length — entered as lamp-oil for
the shrine. Counted at the evening rice. Gone since. The house will be
counted before it sleeps."

> Naoyuki stands at his father's place at the board. He does not look at you
> until he does.

Naoyuki: "If the house must do this, then it does it properly — in order of
service, eldest hands first, so that no one can say—"

Naoyuki: "No. The weir man. Him first."

> Nobody objects. Some of the hands look at you; more look at the floor. It
> is the order the room was already thinking in.

### ask r5-accused · "Am I accused?"

> The question costs you something to ask. Genemon does not notice the price.

Genemon: "You are counted. The whole house is counted. Accusation is for
after the book speaks."

### ask r5-why-first · "Why me first?"

Naoyuki: "Because the book carries ten years on every other man here, and on
you it carries—"

Naoyuki: "Because nobody in this house knows what you are."

### decide · The room waits on you.

#### r5-stand · "Say nothing. Stand for the count."

Naoyuki: "Asked before the whole house, and he offers— note it down, steward.
He offers nothing. Note that."

memory: naoyuki -1 (unreadable)
flags: r5-stood

#### r5-account · "Give your day, hour by hour."

Genemon: "Say it slower. I am writing."

memory: genemon +0 (exact)
flags: r5-accounted

#### r5-search · "Offer your corner to be searched."

Genemon: "It was searched while Rokusuke fetched you. A mat, a bowl, a
whetstone, a mended cord. Nothing of the house's past its keep."

memory: genemon +0 (open-handed)
flags: r5-offered-search

## scene-def count-resolve
trigger: scripted
once: true
speaker: genemon
voice: steward

Genemon: "The kura tally. Who kept it today?"

> Rokusuke has been standing where the lantern light mostly isn't. He comes
> forward the way a man wades cold water.

Rokusuke: "Eleven loads in by dark, steward. His mark against each. Last mark
at lamp-lighting, and the rice was long cleared by then. He never left the
kura side of the yard. That's what the board says. The board's there to look
at."

> Genemon sets the tally board beside the day-book and reads one against the
> other. The room watches him do arithmetic.

Genemon: "The packet was counted at the evening rice, in the inner house.
From mid-day to lamp-lighting this man was under grain. The book holds no gap
with him in it."

Naoyuki: "Then it is someone of the house."

> The door to the inner corridor slides. Toku stands in it, in her
> night-clothes, her hair down — a woman nobody sent for. She looks at no one
> in particular, and at the book last.

Toku: "It went up at the new moon."

> Nobody asks what went up. Nobody asks where. Genemon dips his brush, enters
> one line, and closes the day-book.

<!-- redline 2 (VERDICT §2): the "Twice, on the new-moon rounds, you have seen a
  hooded lantern…" beat is CUT. The judge forbade shipping it as unconditional
  narration — the player may never have walked a new-moon round, so the claimed
  memory is false — and ruled it must be flag-gated on a real sighting or cut.
  No `saw-hooded-lantern` flag exists to gate on (the crossing is night-round
  texture only, never latched), so it is cut here, the authorized option. The
  new-moon lantern crossing still lives as night-round flavor (sb-dog-coda). -->

Genemon: "The count is answered. The house is not short. Take the lamps."

> The rows break up around you. Naoyuki passes you last.

Naoyuki: "You were counted. That is all it was."

> At the morning board nobody speaks of the night. The hands keep a little
> more room around you than the work needs — for a day, then two — and then
> it is spent, needing nothing from you to end.

Genemon: "From today the book carries you at a day-wage, in mon, paid against
each day worked. It was due at the season's turn. It is the season's turn."

> At the paddy Rokusuke works the row over from yours, as he did before, no
> nearer. You thank him for the tally.

Rokusuke: "Kept it same as any day. It would have read the same if it hanged
you."

> He bends back to the row.

> That evening the wage enters the day-book: so many mon, and against the
> entry, where a name would go, a mark. It is still not a name.

<!-- ── U8 side-beats ─────────────────────────────────────────────────────────
  Per u8 VERDICT.md THE PICK: take-c base + two take-a grafts (Bon whole from A;
  the fed-dog new-moon coda from A). All fiction VERBATIM from the named take +
  the required redlines. The `native:` aftermath log-line blocks in both source
  takes have NO FB-5 grammar form — they are flag-keyed engine log lines for a
  later chunk (G4.8/G4.9), DROPPED from these scene-defs and noted (HD-30). Each
  scene keeps greeting + optional decide only. MC label is `Nameless:`
  throughout (all five beats sit pre-R7). -->

<!-- Beat 1 · the grove — TAKE C. A bamboo-grove patrol between R2 and R4; no
  clean flag/season trigger in the grammar, so `scripted` (note). -->

## scene-def sb-grove
trigger: scripted
once: true
speaker: shinnosuke
voice: steward

> The grove, past noon. Yesterday's cut stalks lie where the work stopped.
> The troop is loud up the slope — and under the troop, smaller, a voice that
> has no business being here.

> Shinnosuke stands with his back to green bamboo, holding a stripped branch
> out in front of him the way nobody taught him. The big male is down on the
> ground. It is closer to the boy than monkeys come when things are going
> well.

Shinnosuke: "You're the new one. Do they bite? They bite, don't they — don't
tell anyone I'm here."

> You come up the slow way, on the uphill side, and stand where the male can
> weigh you. It goes when going is its own idea. It takes a seed-pouch with
> it.

Shinnosuke: "I had a plan. Did you see it take the pouch? That wasn't my
fault."

### decide · The boy is looking at you.

#### sb-grove-report · "The house will hear it from me. Walk home ahead."

Shinnosuke: "Fine. Tell them. See if I mind."

memory: kihei +1 (post-kept)
flags: sb-grove-reported

#### sb-grove-cover · "I count one pouch lost. That's all I count."

Shinnosuke: "You won't say? Why won't you say — you're not so bad. Don't
expect anything."

memory: shinnosuke +1 (kept-quiet)
flags: sb-grove-covered

#### sb-grove-teach · "Stand uphill of them. Watch."

Shinnosuke: "Like this? Why uphill — so they can't get above you, or so you
look bigger?"

memory: shinnosuke +1 (taught)
flags: sb-grove-taught

<!-- Beat 2 · the first Bon — TAKE A (sb-bon whole), POV-converted to 2nd
  person (redline 1: "before he asks it" → "before you ask it"; "The forecourt
  is his all day" → "yours all day"). Fires at the first Bon season the MC is on
  the books; grammar has only season triggers, so `season-exit bon` (note). -->

## scene-def sb-bon
trigger: season-exit bon
once: true
speaker: ohisa
voice: steward

> Loads cross the forecourt all morning: trays, lamp-oil, cut flowers, a
> bundle of incense sticks O-Yae carries two-handed like a caught bird.
> Everyone is given something.

> The third load goes past before you ask it.

> "What do I carry?"

O-Hisa: "Not this. If a year from now — well. Not this."

> The house files toward the alcove corridor. The forecourt is yours all day.
> For once, nobody crosses it.

> At dusk, from the weir path: O-Ume sets her lantern on the water and talks
> it out past the reeds, the way you'd see a guest to the road.

> At the gate, the monk Iori has his lodging and his one small fire.

Iori: "Sit. Two bowls, one mouth. I'll be gone before you learn my face."

> Through the corridor screen, past shoulders: a small tray set out for
> somebody, and straw sandals beside it, toes toward the gate.

> Morning. The trays are cleared, the lanterns down, the monk gone north. The
> sandals are new.

<!-- Beat 3 · the lease day — TAKE C, with redline 2: CUT the banked line
  ("It was quiet that night. Quietest all year." — T3's origin clue, stays
  banked). Fires at the season's lease day after R3; `scripted` (note). -->

## scene-def sb-lease
trigger: scripted
once: true
speaker: matsuzo
voice: villager

> Matsuzō comes up from the river at the pace of a man nothing has hurried in
> sixty years. Genemon meets him in the forecourt with the day-book already
> open — which is how you learn the house knew it was short before the knock.

Genemon: "The weir lease. Due today: rice, one koku. In the store, against
it: seven to. The house is short a third, and I will not count it smaller
than it is."

Matsuzō: "Screens took a beating in the spring water. Rats after. Hard year
on everything downstream."

> He does not say: on you too. He looks at the gate's paint, and at you, and
> back toward the river, the way he looks at everything — weather that will
> pass over his weir eventually.

Genemon: "Three to owing. I ask the season's grace on it. The house asks."

> Genemon bows. Not deeply — the exact depth a Kurosawa steward has never
> before had to measure for a weir-keeper, measured now, got right the first
> time because he will not let it be seen twice.

Matsuzō: "The river can wait a season. The screens can't — rats are in them
now. Send your man down while the year turns and we'll call it even weight by
winter."

> Nobody asks you. A line in the day-book, a nod toward the water, and a
> season of your evenings is settled between two old men. Three to of rice.
> It is the first time you have been worth a number. The number is small.

> At the gate the old man stops, level with you, and looks at you the way he
> looked at the paint. He goes back down the way he came, having made nothing
> of it. He has been making nothing of it for a year.

<!-- Beat 4 · the dog — TAKE C (scene + decide), with redline 3: the fed dog's
  rice re-priced onto the MC's own measure (Genemon's entry agrees with "from
  my share"). The fed-branch new-moon payoff is TAKE A's `sb-dog-coda` (below),
  the only rendering of "the ONLY one who barks". Fires at the end of the
  orchard-reclamation chain — keyed to the REAL flag the quest's completion
  sets (`quest_orchard_chain_done`; the earlier `orchard-reclaimed` name had
  no setter — the C4.1 dark-beat fix). -->

## scene-def sb-dog
trigger: flag quest_orchard_chain_done
once: true
speaker: kihei
voice: arms

> The last of the pack went over the wall two days ago. This one stayed. An
> old dog, grey to the jaw, one ear ragged from winters, lying in the dead
> leaves under the far fruit trees like the orchard is a post it was never
> relieved from.

> It does not run and it does not beg. When you work, it watches. When you
> eat, it watches the food, then you — and then it looks away first.

> Kihei crosses the cleared ground on his round and stops beside you, reading
> the dog the way he reads a blade for rust.

Kihei: "The old one. Too slow for the pack, too proud for the village
middens. Drive it, feed it, or bring it to me. Don't leave it half-decided."

### decide · The dog watches you decide.

#### sb-dog-drive · "The orchard's cleared. All of it."

Kihei: "Cleared is cleared. Stop the gap in the wall behind it."

memory: kihei +1 (thorough)
flags: sb-dog-driven

#### sb-dog-feed · "It stays. I'll feed it from my share."

Genemon: "A dog. Old, one ear. Rice: a handful, mornings, from your measure —
entered. If it earns, it stays entered."

memory: genemon +1 (accountable)
flags: sb-dog-fed

#### sb-dog-kihei · "Take it to Kihei."

Kihei: "Give me your belt-cord. Go rake the leaves. This isn't a lesson."

memory: kihei +1 (clear-eyed)
flags: sb-dog-ended

<!-- Beat 4 coda · the new-moon bark — TAKE A's `sb-dog-coda` (graft, redline
  5). Fires on the first NEW-MOON night round carrying `sb-dog-fed` (the
  night-round engine enqueues it — a bare flag trigger fired the moment the
  dog was fed, ahead of its own fiction; the C4.1 re-key); binds to the
  seeded hooded-lantern crossing (answered at the Count). Speakerless
  narration-only beat (ADR-165) — no decide. -->

## scene-def sb-dog-coda
trigger: scripted
once: true
voice: narrator

> New moon, and the round goes out into it. Rats in the store: cleared. The
> store settles. Then, at the yard's far edge, a lantern crosses with its
> light hooded, going upstream, unhurried, sure of the path.

> The rats said nothing. The marten, the time it came, said nothing. The dog
> barks once — once — at the lantern, and then is quiet.

> The lantern does not stop. Kihei does not turn his head. The dog watches it
> the whole way upstream, and nobody enters a bark in any book.

<!-- Beat 5 · the crest — TAKE C, with redline 4: the petal count kept RELATIVE
  ("one more"), no absolute number enters canon before T2's reveal. Fires at
  the kura after R3; `scripted` (note). -->

## scene-def sb-crest
trigger: scripted
once: true
speaker: shinnosuke
voice: steward

> Loading at the kura. Shinnosuke is up on the stacked bales, where he is not
> allowed, counting something over your head.

Shinnosuke: "Count them. The storehouse has one more than the gate. Why does
the storehouse get one more petal than the gate? Who changes a crest — you
can't just change a crest, can you?"

> You look. Above the seal-plate the mon is cut deep and old: the same flower
> as the gate's, and not the same flower. You count twice, because counting
> is the one kind of reading you trust.

> "Ask the steward."

Shinnosuke: "I asked everyone. Grandmother said mind the lamp. Genemon wrote
in his book. Mother said if I've time for petals I've time for copywork.
Nobody answers me. You ask. You work here — they have to answer you."

> Asking costs you something every time. You pay it at the board that evening.

> "The kura's crest. It has one petal more than the gate's."

> It is not even a question, the way you say it. Genemon looks at you the way
> he looked at the river-wet stranger the first morning — a thing to be
> entered under the correct heading. Then he opens the day-book, writes — not
> long — and closes it.

Genemon: "The kura wants its hinges oiled before the rains. Take the small
ladder."

> That is the answer. It is the same answer the boy got, in a different hand.

> Shinnosuke is waiting on the woodpile to hear what you learned. You tell
> him: hinges. He nods like a man twice his age confirming a debt gone bad.

Shinnosuke: "See. You're the other one they don't tell. What did he write —
did you see what he wrote?"

> You didn't. The boy climbs down and goes in to his copywork, and you oil the
> hinges under the crest, and the kura keeps whatever it keeps.

<!-- ── The silent R2 (u2 take-c) ─────────────────────────────────────────────
  R2 "the yard-hand" is the SILENT rung (ADR-165 / map): no granter, no decision
  — the promotion is the absence of dismissal (a task simply not taken back). A
  `## rung` block cannot express this (the compiler requires a decide), so it is
  a speakerless narration-only scene-def, `trigger: rung R2`. Migrated from
  t0v2/u2-r2-yard-hand/take-c.md with the redlines: the rice narration ends at
  "Rice keeps."; one aphorism; Genemon's "One measure the day" kept unit-vague.
  The social lines (O-Yae's wedding news, Rokusuke, Kihei's glance) and the
  decision are DROPPED to keep the rung silent — they route to dialogue in a
  later chunk; the `r2-first-mark` / yard-round log texture is DEFERRED. -->

## scene-def r2-yard-hand
trigger: rung R2
once: true
voice: narrator

> First light. The broom stands against the gatepost where you left it. The hand
> who kept the yard's round quit for the lowlands; nobody has said whose it is
> now.

> You take the broom. Nobody takes it back.

> The round takes the morning: the gate swept, the forecourt raked, the water
> in, the wood up off the ground. Dusk round, then the kitchen threshold, the
> bowl. Genemon comes past with the day-book under his arm and does not slow.

Genemon: "Rice from the new moon. One measure the day, dry, weighed at the kura
door. Meals were terms for a man staying a week."

> He is through the door before you can set the bowl down.

> A meal ends with the eating. Rice keeps.

<!-- ── The first dream (u7 take-b) ───────────────────────────────────────────
  THE FIRST DREAM fires at T0-R7 (01-laws §0.5.4, canon) — the engine chains it
  directly off rung-r7's close, a sleep transition. Not a `## rung` (a `## scene`
  would break the intro scene-order check), so a `scripted` scene-def. Migrated
  from t0v2/u7-r7-named-hand/take-b.md with the redline: the dream simile "fine
  as sieved ash" is CUT. The MC's closing line renders under the post-R7 label
  via the ambient `Gonbei (player):` speaker (the pre-R7 `Nameless` label has no
  ambient NAMES entry, so it cannot carry a speech line). -->

## scene-def r7-dream
trigger: scripted
once: true
voice: narrator

> The woodshed, late. On the doorstep, folded under a stone against the wind:
> his straw coat, mended at the shoulder in small even stitches that no one will
> own to. He carries it in, lies down on the mat, and for once sleeps at once.

> — a road, climbing. Rain on it.

> The weight across his shoulders is right. Two loads and the pole, and his feet
> know the next stone without being asked. Below the road, water — he cannot see
> it, but it is there the way a wall is there in a dark room.

> Behind him on the climb, somebody calls a name. Short, worn smooth, thrown
> easy — a name that has landed a thousand times and expects to land now.

> He turns to answer.

> The mountain moves.

> After that there is only the water, and the road going away upward, and the
> voice still calling — smaller, and smaller. He knows the name is his. He
> cannot hear it.

> He wakes in the woodshed with his mouth open around a word that is not there.
> Rain, real rain, small on the roof. The coat is where he left it.

Gonbei (player): "There was a road."

> Nobody answers. It is a long while before he sleeps again, and the dream, that
> night, does not come back.

<!-- ── The five per-season overlays (C5a unit 1 · ADR-167/ADR-139) ──────────
  05-world.md locks a per-season VN overlay on the manual season change; only
  Autumn (the nengu frame) shipped. These five close the set. AUTHORED via the
  C5a 3-take blind diverge — self-picked TAKE C ("the land first": the land
  moves first, people enter late and small), redlined per its Pass-2 verdict
  (one stacked ornament trimmed; the season-handoff closing template broken in
  3 of 5 scenes). Alternates A & B live in takes/c5a-overlays/ — swappable
  LIVE in DEV → Story until the HR sign-off. All five narration-only
  (ADR-165), `once: true` (first-turn ceremony; later turns instant — the
  echo rule forbids a verbatim annual replay), each firing on ITS season's
  exit (the wheel turning is announced by the closing beat — TST4). -->

## scene-def turn-winter
trigger: season-exit winter
once: true
voice: narrator

> The snow quits the valley floor first — gray at the edges, then standing water in the wheel-ruts. The ridge keeps its white and means to keep it.

> The river runs black and narrow between its shelves of ice. Past the rope, the old garden's snow lies whole: a winter's worth, and not one track across it.

> The light stretches. Work that used to end at the woodshed door now ends past it, and the cold stays on, but it has stopped arguing.

> Small on the road below, a man comes up from the village with new straw rope coiled over his shoulder, for the gates. The year is going out. The New Year comes up the valley behind him.

## scene-def turn-new-year
trigger: season-exit new-year
once: true
voice: narrator

> Ice lets go of the shaded bank a plate at a time, each one turning once in the current and gone.

> The ground gives underfoot where all winter it rang. The well-path grows a margin of mud, and the mud holds each footprint till noon.

> Up the woodlot, the bark of the young trees is chewed to the pale — deer, down off the ridge in the dark and gone again by light. Whatever they came for, the ridge no longer had it.

> Last, and small under all that water-light, the villagers walk their field-bunds, looking at what the thaw left them. Spring is on the valley, and everything from here on is work.

## scene-def turn-spring
trigger: season-exit spring
once: true
voice: narrator

> The green closes ranks. What was rows in the paddies is one surface now, and when the wind crosses it, the whole valley floor moves together.

> The river drops slow over its gravel, clear and warm in the shallows by noon.

> In the grove, the new bamboo has gone up taller than a man in a fortnight — pale among the old canes, then not.

> People show late in this weather, and low: hats in the deep green, moving slow along the rows. Summer has the valley now.

## scene-def turn-summer
trigger: season-exit summer
once: true
voice: narrator

> The heat loosens its grip at the edges first: a haze on the river that burns off later each morning, and at dusk the cicadas trade their noon voice for the thin evening one.

> The light comes in slantwise now and finds the dust hanging in the forecourt air. The ridge stands closer in it, the way it does before weather.

> On the hill above the village, small figures move among the stones with sickles and water-buckets, tidying — one household first, then by week's end all of them.

> Smoke stands over the village at dusk, more fires than there are suppers. Bon is here, and the valley is making itself ready to be visited.

## scene-def turn-bon
trigger: season-exit bon
once: true
voice: narrator

> The river carries the first leaves down from the ridge, one and two at a time, red before anything on the valley floor has thought of turning.

> The mornings come in cold enough to name. Mist stands knee-deep in the paddies, and the heavy heads of rice bow through it, all leaning the same way.

> The road empties back out over the pass. The valley keeps what belongs to it and lets the rest go.

> From the village at dusk, the sound of whetstones — one, then several, no hurry in any of them. Bon has gone home. It is autumn, and the valley's whole year is standing out in the fields, waiting to be carried in.
