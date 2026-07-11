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

say: "…"
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

You: "What do I carry?"

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

You: "Ask the steward."

Shinnosuke: "I asked everyone. Grandmother said mind the lamp. Genemon wrote
in his book. Mother said if I've time for petals I've time for copywork.
Nobody answers me. You ask. You work here — they have to answer you."

> Asking costs you something every time. You pay it at the board that evening.

You: "The kura's crest. It has one petal more than the gate's."

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

<!-- ── The works discovery beats (works-cause bundle, ADR-139/ADR-177) ─────────
  Estate plan Phase 1 (fable-2026-07-10-estate-upgrades-redesign.md): the day-book
  NAMES a concern → the walk SEES it (works.ts sighting lines) → these beats PRICE
  it (flags works-open-u1..u4 gate the ladder). works-intro is `scripted` — worksPass
  enqueues it on forecourt presence at R2+; the four project beats fire off their
  works-seen-u<N> flags, ladder-ordered. Canon = take C ("the land keeps its own
  book" — the c5a land-first register), redlined per Pass-2 (the sill→weir fix; the
  kura fullness claim softened in flavor.md). Alternates: takes/works-cause/. -->

## scene-def works-intro
trigger: scripted
once: true
speaker: genemon
voice: steward

> The board, an evening some weeks into the rice terms. The day's wages are
> footed and the book should be closed, but Genemon has turned instead to a
> page ruled off from the rest — older ink at the head of it, this morning's
> at the foot.

Genemon: "The wages are settled. This is the other page."

Genemon: "Gate: the west post takes water at the foot, second winter
running. Paddies: three bunds slumped, the water going through them at its
own level. Woodshed: rain through the north corner of the roof, over where
you sleep. None of that is news to the land. It is only now news to the book."

> He enters nothing. The lines are already there, dated, the way a man
> records frost.

Genemon: "And one line the house carries whether I write it or not. The weir
screens are Matsuzō's — leased, and the keeping of them ours. River rats gnaw
them at the waterline; every slat through is coin owed across the water. The
river feeds the rats and the house pays the difference. That account was open
before the river gave you up at the weir."

Genemon: "I commission nothing that has not been looked at. Walk the three,
and the weir path, and look with your own eyes. Rot reads better by daylight.
The book will keep."

### ask works-intro-ask-a · "Why now? It's stood this long."

Genemon: "Stood is the wrong word. It has been going, at the pace rot keeps,
which is slow enough that a busy man calls it standing. There is ground on
the far side of the orchard where nobody argued with the rain. Roofs, once.
The land entered it line by line, and no hand wrote anything against it.
I do not intend to copy that page."

### ask works-intro-ask-b · "Whose coin mends it?"

Genemon: "Not the house's; the house's coin is spoken for before it reaches
the yard — you were told that the first morning, and it has not improved.
What goes against the land here is labour, and whatever coin the labourer
chooses to set beside it. The book credits what is put in, under the name
that put it."

### decide · The page is read out. What do you do with it?

#### works-intro-go · "I'll walk it today, while the light holds."

Genemon: "Then the page has an answerer. Take it in the land's own order —
water first. It is the oldest hand the land has."

memory: genemon +1 (walked-the-book)
flags: works-named-u1, works-named-weir

#### works-intro-hold · "The land got there first. It can wait for me a day."

Genemon: "It can. It will not return the courtesy. The lines stand entered;
walk them when you walk them, and know the land is not resting meanwhile."

flags: works-named-u1, works-named-weir

## scene-def works-u1
trigger: flag works-seen-u1
once: true
speaker: genemon
voice: steward

> The board again. Genemon watches you cross the forecourt, sets the day-book
> open at the ruled-off page, and takes up the brush before you have spoken.

Genemon: "You walked it. Your face says the page is honest."

Genemon: "Then hear the work. Post, one, drawn and reset on dry footing.
Bunds, three, cut back to sound earth and rammed. Roof, one corner — boards
and thatch. One work, the three together. The land does not press in single
file, and I will not mend in it."

> He rules the line and leaves it open, the brush held off the paper.

Genemon: "Taken up, it goes against your name — your labour, and any coin
you put beside it. The book credits what is put in."

### ask works-u1-ask-a · "Why the three together?"

Genemon: "Because they are one entry on the land's side, whatever they are
on ours. Water at the post, water through the bunds, water through the roof.
Mend one and the water keeps its other appointments. Close the account whole
or watch it reopen."

### ask works-u1-ask-b · "Where do I begin?"

Genemon: "Water first, always. The post and the bunds while the weather
holds; the roof before the autumn rains, or the autumn will inspect the work
for us. The land sets the order. I only copy it."

### decide · The line is ruled and open.

#### works-u1-begin · "Set it against my name."

Genemon: "Entered. Three concerns, one work, your name on the answering
side. It is the first entry this page has carried against the land in some
years. We will see whose line stands."

memory: genemon +1 (set-to-it)
flags: works-open-u1

#### works-u1-hold · "When the yard can spare me. It's slow work, losing."

Genemon: "Slow is the land's own gait; do not admire it too long. The line
stays open. So, be sure, does the land's."

flags: works-open-u1

## scene-def works-u2
trigger: flag works-seen-u2
once: true
speaker: genemon
voice: steward

> Genemon finds you at the forecourt with the orchard's brambles still on
> your sleeves, and does not ask where you have been. The day-book comes to
> the ruled page as if it had been waiting open.

Genemon: "The orchard. That is the land's longest entry on this side of the
wall — taken a row at a time, over years, and no hand wrote a word against
it. Trees a household set out with paths in mind, gone under the choke, and
dogs denned in the hollow where fruit was dried once."

Genemon: "The work: the wild rows cut back to the sound wood, and the dens
broken and emptied. Not a mending — a taking-back. The land will contest it."

### ask works-u2-ask-a · "The dogs first, or the cutting?"

Genemon: "The dens first, or every arm that swings a billhook is feeding
them. Bold from lean winters — they hold ground the way roots do, by staying.
Break the pack and what is left is dogs. Kihei will tell you the same, in
fewer words, and drill you for it if you ask him plainly."

### ask works-u2-ask-b · "Is anything left in there worth the taking?"

Genemon: "Sound trees under the choke — the stock outlasts the state of it;
that is usually the way. Whoever planted them expected paths between the
rows, and lanterns. The land has spent thirty years unwriting that. It did
not finish."

### decide · The orchard's line stands the oldest on the page.

#### works-u2-begin · "Cut it back. Row by row, the way it was lost."

Genemon: "Entered. Ground taken back is a line I have not written since I
was a younger man's clerk. Mind the dogs, and bring me the rows one at a
time. I will strike the land's entry as they come."

memory: genemon +1 (ground-taken-back)
flags: works-open-u2

#### works-u2-hold · "Thirty years of choke. It'll keep another season."

Genemon: "It will keep the way it has kept — by growing. Every season the
cutting is a season heavier. The line is entered; take it up before the
bramble takes the arithmetic out of your hands."

flags: works-open-u2

## scene-def works-u3
trigger: flag works-seen-u3
once: true
speaker: genemon
voice: steward

> Evening at the board. Genemon has the kura's tallies out beside the
> day-book, one read against the other, and he speaks without looking up —
> the way he speaks when the figures have already argued the matter.

Genemon: "You have seen it. The kura is sound and full, and those are two
different worries. It holds this year's rice and not a measure over. A poor
year starves the house; a good year would embarrass it — grain standing in
the damp for want of a roof. The land collects either way."

Genemon: "So: a second granary, raised at the kura, on its own footings.
Stores past the winter's need. Every work on this page till now has answered
a loss the land already entered. This one is made before the loss. I have
waited a long time to rule a line of that kind."

### ask works-u3-ask-a · "Why a second? Widen the one that stands."

Genemon: "The kura is sound, and sound is kept, not cut open. A second
stands on its own feet, its own roof, its own lock — two roofs do not fail
in one night, and two counts keep each other honest. The land takes buildings
one at a time. Give it two."

### ask works-u3-ask-b · "Stores past need — for what, exactly?"

Genemon: "For the year the valley has instead of the year we plan for. The
land keeps no schedule and sends no word ahead. A full storehouse is the one
argument it hears; everything else is entered under losses. Ask the ground
past the orchard how far a lean year reaches when nothing stands in its way."

### decide · The footings can be cut this season or not at all.

#### works-u3-begin · "Raise it. Board by board, ahead of the weather."

Genemon: "Entered — and mark it: the first line on this page the land did
not write first. Green wood dries crooked; buy seasoned, or cut early and
wait. The winter will weigh the work, whichever."

memory: genemon +1 (past-winters-need)
flags: works-open-u3

#### works-u3-hold · "A whole granary. That's past my scale of mending."

Genemon: "It is past mending altogether; that is its virtue. The line is
ruled and stands open. Footings before the frost, or the year is lost and
the land holds the page another winter."

flags: works-open-u3

## scene-def works-u4
trigger: flag works-seen-u4
once: true
speaker: genemon
voice: steward

> Past supper, the board, the lamp low. Genemon has the day-book open to the
> ruled page, and for once he is not writing — he is reading it back, line by
> line, the way a man walks a fence he mended himself.

Genemon: "Gonbei. Stand where I can see you; this is the last of the page."

Genemon: "The omoya. You have seen it from the forecourt — half this house
shut, moss on the ridge, rooms going back to the land indoors, which is the
quiet way: dust, damp, screens that no hand slides. The land does not need
weather to take a room. It only needs the room left alone."

Genemon: "I told you I rule a second reckoning from this season — walls that
held, ground taken back, one line a season in plain words. This is that
reckoning's first great line. The house set in order: roofs sound, screens
mended, air and use in every room. Thirty-one years I have written this
house's losses. The land has kept the better book all that time. I mean to
even the ledgers before I am done."

### ask works-u4-ask-a · "Why the omoya last?"

Genemon: "Because the rest holds now, and it did not. The gate is dry at the
foot, the bunds carry their water, the orchard bears, grain stands past the
winter's need. The land's book against this house is shorter than it has
been in thirty years. The omoya is the longest line left on it — and a house
is answered from the outside in."

### ask works-u4-ask-b · "What does 'in order' come to, in the doing?"

Genemon: "Roof and ridge first — a room is lost from above. Then the shut
rooms, opened one at a time: screens repapered, boards taken up where the
damp has been under them, braziers lit until the walls forget the wet. Then
use. A room is kept by being lived in; there is no other keeping. The doing
is long. The entry is one line."

### decide · The last line of the page waits on an answer.

#### works-u4-begin · "Open the rooms. All of them."

Genemon: "Entered. When it is done, the season-line writes itself, and it
will not be a loss. The land may have the far bank and the winter. This
ground is spoken for."

memory: genemon +1 (the-house-stands)
flags: works-open-u4

#### works-u4-hold · "A whole house. Give me the winter to look at it."

Genemon: "Look, then — but look as the land looks, every day, without
tiring. The line is ruled. The omoya has waited years for a hand; it can
wait a season more. It should not wait two."

flags: works-open-u4

<!-- ── The zone-reveal beats (ADR-184, the `zone-reveals` bundle) ─────────────
  THE LAW (human, 2026-07-12): a zone opens only inside a VN, and a rung-up VN
  may open at most two. These four are the side-quest VNs that open the four
  zones which LEFT the rung schedule — the gate (FB-408: empty five days in
  seven), the kitchen threshold (FB-407: named by the R1 terms and holding
  nothing), the field margins (no verb until a blade exists), and Sōan's
  sickroom (FB-382's own intent: it should reveal when hurt starts existing).
  A fifth zone, the weir reeds, needed no new beat: `sb-lease` above already IS
  it (Matsuzō, the gnawed screens, "send your man down"), so its CLOSE latches
  the flag (scenes.ts applySceneCompletionEffects).

  Each is `scripted` — core/reveals.ts enqueues it the tick its fictional moment
  arrives (coin in the fist with nowhere to spend it · greens you cannot eat raw
  · the raided racks seen from the rows you work · the first wound). BOTH options
  of every scene set the reveal flag: the pick colours the relationship, never
  the map — a player may be graceless, never locked out.

  Canon = take A ("the house tells you what it needs" — the institutional
  register: each zone opens because the estate has an open account and you are
  the instrument that closes it). It carries the mechanics diegetically, which
  these four beats must (they are the player's only teaching for coin, the pot,
  the hunt and the mend). Alternates: takes/zone-reveals/ (B — "somebody notices
  you"; C — "the thing itself is wrong"). -->

## scene-def sb-market
trigger: scripted
once: true
speaker: genemon
voice: steward

> The forecourt, mid-morning. The week's coppers ride knotted in a rag at
> your belt, and they have ridden there for days, because there is nowhere
> on this estate to put a single one of them down.

> Genemon hears the knot before he sees it. He looks up from the board
> anyway, which is not the same as being interrupted.

Genemon: "Coin. Yours — entered against your name, every mon of it, so I
know what you are carrying to the piece. And you have carried it about the
yard a week now and bought nothing with it, because nobody has told you
where coin goes."

Genemon: "Then hear it. Coin does one thing on this estate: it crosses the
gate. Yohei sets his stall in the gateyard on market days, and what he
unloads off his back is the whole of the buying and selling this house can
reach without a cart. A sack of mountain greens is ten mon. That is the
smallest thing sold here; below it there is nothing to want."

Genemon: "You were never told. That is my omission and not your fault, and
I am closing it. A hand who cannot price a sack of greens cannot be sent
with a purse that is not his. Go down and learn the prices on your own
coin. It is the cheapest schooling this house will ever buy."

### ask sb-market-ask-a · "Which days does he come?"

Genemon: "Two days in seven, the same two all year. If you walk down and
the gateyard is empty, you have walked fifty paces for nothing and learned
one of the two days by subtraction. That is not the worst way to learn it."

### ask sb-market-ask-b · "Why does it matter what I know?"

Genemon: "Because a day is coming when the book sends a man to that gate
with money that is not his, and the book would rather send a man who has
stood at the stall before. Nobody is being kind to you. I am shortening an
argument about a purse that has not happened yet."

### decide · The coin is yours. Genemon waits to hear what you will do with it.

#### sb-market-go · "Then I'll learn what things cost."

Genemon: "You will. Yohei will price you as a stray the first time and as a
regular the fourth, and the whole of the lesson is the difference between
those two prices. Your own coin, mind. The house's is not loose yet."

memory: genemon +1 (counts-his-coin)
flags: told-of-the-stall

#### sb-market-hold · "It keeps. I need nothing."

Genemon: "Then it sits, and it is yours to sit on. The stall goes up on its
days whether you come to it or not, and the prices will not have improved
by the time you do. You know the gate now. That was the errand."

memory: genemon +0 (keeps-his-coin)
flags: told-of-the-stall

## scene-def sb-cook
trigger: scripted
once: true
speaker: ohisa
voice: steward

> The greens have been in your hand since the woodlot: fern-shoots and
> butterbur, cut this morning, wilting by noon. Raw, they are worth nothing.
> Tomorrow they will be worth less.

> O-Hisa is at the kitchen threshold across the yard with the household's
> rice on. She has watched you carry a handful of fern back and forth over
> the forecourt for about as long as it takes a pot to come to the boil.

O-Hisa: "Boiled. That is what they are for. Bring them over here — I am not
crossing a yard for a handful of fern, and you are not eating them like a
goat."

O-Hisa: "There is one pot in this house that anything is cooked in, and it
is standing behind me, and nobody has shown it to you. That is nobody's
fault and it still wants mending. The fire is lit before dawn for the
house's rice. While it burns, it costs the house nothing to boil your
greens on it. That is the whole of the reason, and it is reason enough."

O-Hisa: "And you will want it. Rice keeps a man upright; it does not mend
him. A hot meal does — the greens boiled soft, the water drunk off, and sat
down for the length of it. There is nothing else in this house that mends a
body. There is the pot, and there is what you carry to it."

### ask sb-cook-ask-a · "Why greens?"

O-Hisa: "Because they grow at the woodlot edge and cost nobody anything,
and because Sōan says a man mends on hot food and green stuff, and I have
watched him be right about it as long as I have been in this house. The
rice is the house's. The greens you cut are yours. Boiled, they are a meal.
Left in your hand, they are a wilted handful, and I sweep them out of my
doorway."

### ask sb-cook-ask-b · "Whose pot is it?"

O-Hisa: "The house's. The fire is the house's. The greens are yours — that
is the whole of the difference, and it is the difference the steward would
want made, so I have made it aloud and you have heard me make it. What
comes out of the pot is yours as well. Nobody enters that against you."

### decide · The pot is behind her. The greens are wilting in your hand.

#### sb-cook-learn · "Show me the pot."

O-Hisa: "Stand where you can see, then, and do not crowd the fire. Water to
the scratch inside the rim, not above it. Greens in when it moves, not
before. Two handfuls — the pot is smaller than it looks and it will not
forgive a third — and off the heat while the stalks still hold their shape.
There. You can feed yourself now. A man who can feed himself is a man who —
the handle takes the heat. Use the cloth."

memory: ohisa +1 (learns-the-pot)
flags: taught-to-cook

#### sb-cook-thanks · "Boil them, then. I'll take the bowl."

O-Hisa: "You will. Two handfuls, no more, and I will not be doing it for
you twice. The pot is there. The fire is there. I will not always be
standing at it on the day you come across that yard needing it. Eat it
sitting down — standing, it does you half the good."

memory: ohisa +0 (takes-the-bowl)
flags: taught-to-cook

## scene-def sb-racks
trigger: scripted
once: true
speaker: rokusuke
voice: villager

> The rows, past noon. Rokusuke works the row over from yours, no nearer,
> the way he has worked it every day since you came. Then he is at the end
> of your row with his hands where you can see them, which is how he stands
> when he means to say something.

Rokusuke: "That is a blade you are carrying. Not saying anything about it.
Only — you carry one and I do not, and that is the whole difference between
us this week."

Rokusuke: "Four bundles off the drying racks last night. Barley. The seed
store gnawed open at the corner, second time. Every night this week, and
every night the same road: up out of the margin, along the bunds, from the
setts at the paddy's edge where the ground goes soft."

Rokusuke: "And at the week's end the steward asks me for the number,
because I keep it — I keep it same as any day — and the number I hand him
is four, and then twenty-eight for the week, and I would rather hand him a
smaller one. That is all this is. I do not say what work gets done. I keep
the count."

### ask sb-racks-ask-a · "What comes up out of the margin?"

Rokusuke: "Tanuki. Badgers where the ground goes soft. Big ones this year —
they have been eating well, and what they have been eating is ours. The old
women at the well will tell you what a tanuki is when it grows fat and bold
and comes at a house nightly, and you may listen to them if you like. It is
a tanuki. There is a sett under every third bund down there, dug in since
before my time, and nobody has ever gone at them, because nobody had a
reason to be down there with a blade."

### ask sb-racks-ask-b · "Why tell me and not the board?"

Rokusuke: "I told the board. I tell the board everything — that is why I am
still here and better men are not. The steward entered it. Entered is
entered and I am not saying it is wrong. Only the entry does not come out
at night and stand at the racks. You might."

### decide · Four bundles a night, and the margin lies at the end of your row.

#### sb-racks-take · "Show me where they come in."

Rokusuke: "End of the third bund, where the ground goes soft. Follow the
drag-marks — they do not hide them, they have never had call to. Go before
dark or after; they do not keep our hours. And you had it off the racks,
not off me. The racks are there for anyone to count."

memory: rokusuke +1 (walks-the-margin)
flags: racks-raided

#### sb-racks-ask · "The board should hear it before I go."

Rokusuke: "It has heard it. It heard it three days ago and it will hear it
again at the week's end and it will say what the board says. Tell them
again if you like — tell them the number is four; four is the number. Then
walk down past the third bund, since you are going that way regardless. The
ground goes soft there. That is where they come up."

memory: rokusuke +0 (asks-first)
flags: racks-raided

## scene-def sb-sickroom
trigger: scripted
once: true
speaker: soan
voice: physician

> The lean-to off the outer court: a plank bed, a brazier gone low, a shelf
> of jars with their labels worn off and written again in a smaller hand,
> and a low table with a ledger closed on it.

> You have been in this room once before, on your back, with the river still
> in you. You did not look at it then. You look at it now. Sōan does not
> look up from the wrap he is rolling.

Sōan: "Breathe in. Again — shallower. Now turn toward me. Which of the two
was worse?"

> You tell him. He puts two fingers somewhere you did not name, and stops
> there, and does not say anything about being right.

Sōan: "Two of your ribs are cracked. Neither is through, and that is the
whole of your luck; you may keep it. Six days in the wrap. Twelve before
you carry a full load without paying for it afterwards. There is nothing
for the pain worth what it costs. Sleep on the side that hurts — the other
side is worse."

Sōan: "Now the cost, since nobody else in this house will put it to you
plainly. A cracked rib mends in one of two places: in this room, in six
days — or out in the rows, over a season, crooked. The house pays for it
either way, and for six days it pays without getting anything back. That is
not a reproach. It is an entry. I keep the book of what this estate spends
on keeping its people whole, and you have a page in it now, the same as the
mule."

> He writes. The brush stops, and starts again, and puts down a second line
> that is not about your ribs. You do not ask what it says.

### ask sb-sickroom-ask-a · "What are you writing?"

> You ask it from the plank bed, and it comes out flatter than you meant it.

Sōan: "A physician's book. What came in, what it cost, what mended and how
fast. Yours is not the only page in it, and it is not the longest."

> He closes the book with the hand that is not on your wrap. It does not go
> back on the shelf until you are looking at the ceiling.

### ask sb-sickroom-ask-b · "What does it cost?"

Sōan: "You? Nothing you have. The house physics its own, and you are its
own now, whatever the day-book calls you. When you draw a wage — and you
will; they all do in the end — it will come out of the wage, and you will
find you resent that less than you resent lying here. Ask me again then."

### decide · Sōan holds the wrap and waits.

#### sb-sickroom-mend · "Then I'll hold still."

Sōan: "Good. Arms down. Down. It goes on tight or it does nothing, and I
would rather do it once. Six days. You will be in this room again before
the year turns, and next time you will know the way — which is worth rather
more to this house than the six days cost it."

memory: soan +1 (holds-still)
flags: tended-by-soan

#### sb-sickroom-refuse · "It'll mend while I work."

Sōan: "It will not. It will knit crooked and you will carry it the rest of
a life spent carrying things — but you are not mine to keep, and a man who
will not lie down cannot be made to. Take the wrap with you and put it on
before the swelling does the arguing. The room is the lean-to off the outer
court; the door is the one you came through. You will come back through it.
They all do. I would rather you came in on your feet."

memory: soan +0 (walks-it-off)
flags: tended-by-soan
