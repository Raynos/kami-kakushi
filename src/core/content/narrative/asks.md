<!-- The everyday-ask registry (FB-415, talk-system redesign) — the
  AUTHORING SOURCE OF TRUTH. Compiled to content/asks.gen.ts by
  `pnpm run gen:narrative`; the engine (selector + intent) lives in
  core/asks.ts, the def mapping in content/asks.ts. Spec: ./README.md.

  Shape: `## ask <id> · <npc>` + meta (`rungs:` window · required
  `label:` — the MC's spoken question, quotes verbatim · optional
  `when:` flag/regard gate · `refresh:` from the CLOSED
  ask-refresh.ts vocabulary · `native:` from ask-natives.ts — the
  real-logic escape hatch, exclusive with prose). A static answer is
  prose lines, each carrying a `#slug` line-id comment marker — the
  takes-overlay address `ask.<id>.<line-id>`; the label overlays as
  `ask.<id>.label`.

  VOICE (s218, the ADR-139 ask waves): labels are the W-A pick — the
  ladder is audible (address-first up the house, yard-talk down it);
  house answers are the W-B pick — the man behind the book; village
  answers + discovery hints are the W-C pick — work talk only.
  Alternates: takes/ask-voice/ · takes/ask-house/ · takes/ask-village/
  (HR-49 · HR-50 · HR-51). -->

## ask genemon-house-standing · genemon
rungs: R0+
refresh: rung
label: “What does your book say of me?”

<!--#the-book-says-->
Genemon: “Your line stands where the book set it this morning —
entered, current, carried forward, nothing owing past what the page
shows. Most men wait to be read to. You ask; I have made a note of
that.”

## ask genemon-house-wants · genemon
rungs: R0+
refresh: rung
native: house-wants
label: “Steward. What does the house ask of me?”

## ask soan-body-mend · soan
rungs: R0+
refresh: health
native: body-mend
label: “Doctor. Look me over, when your rounds allow.”

## ask ohisa-kitchen-season · ohisa
rungs: R0+
refresh: season
label: “What’s in the pot?”

<!--#what-the-season-gives-->
O-Hisa: “What comes in the door with the dirt still on it, that goes
in the pot — that and salt, and salt we still have. If the season
means to be kinder than the last one — well. You’ll smell it from the
woodshed before I say a word.”

## ask oyae-village-news · oyae
rungs: R1+
refresh: season
label: “What do they say in the village?”

<!--#word-comes-up-the-road-->
O-Yae: “The baskets go down full of washing and come back up full of
what they say — none of it mine, I only carry. They’re talking, they
always are; when they say a thing worth setting the load down for,
you’ll have it the same morning I do.”

## ask shinnosuke-what-are-you-doing · shinnosuke
rungs: R0+
label: “No work of your own?”

<!--#watching-you-->
Shinnosuke: “My letters — only the ink dries faster than I can write
it, so I’m watching you work instead. How do you tie a load
one-handed, and who taught you?”

<!-- ── The D8 re-homing (plan step 4): each vn person's u9-* cast def
  (dialogue.md) answers through ONE person-ask. The native fn returns
  every gate-satisfied line; a `when:` gate opening later RESHAPES the
  answer, and the default text-digest freshness re-lights the ask —
  the old press-A drip becomes state-driven newness (D6). -->

## ask genemon-word · genemon
rungs: R0+
native: u9-genemon
label: “Steward. Have you a word for me?”

## ask kihei-word · kihei
rungs: R0+
native: u9-kihei
label: “Drillmaster. Have you an order for me?”

## ask soan-word · soan
rungs: R0+
native: u9-soan
label: “Doctor. If you can spare me a moment.”

## ask ohisa-word · ohisa
rungs: R0+
native: u9-ohisa
label: “O-Hisa. A word, if the pot can wait.”

## ask shinnosuke-word · shinnosuke
rungs: R0+
native: u9-shinnosuke
label: “You have questions. Ask one.”

## ask naoyuki-word · naoyuki
rungs: R0+
native: u9-naoyuki
label: “Master Naoyuki. What would you have me do?”

## ask toku-word · toku
rungs: R0+
native: u9-toku
label: “Grandmother. May I have a word?”

## ask oyae-word · oyae
rungs: R0+
native: u9-oyae
label: “What do they say down the road, O-Yae?”

## ask matsuzo-word · matsuzo
rungs: R0+
native: u9-matsuzo
label: “What news at the weir, Matsuzō?”

## ask iori-word · iori
rungs: R0+
native: u9-iori
label: “A word before you go, traveler?”

## ask oume-word · oume
rungs: R0+
native: u9-oume
label: “How do the fields stand, O-Ume?”

## ask rokusuke-word · rokusuke
rungs: R0+
native: u9-rokusuke
label: “Anything doing, Rokusuke?”

<!-- ── D2 discovery-hint asks (s218, wave C): a person points at what
  their work has made them notice — P15: the hint POINTS while the
  thing is undiscovered, the settled branch may name it. Answers are
  native (branch on the discovery latch, ask-natives.ts); branch
  prose lives in flavor.md (askWaters*/askMargins*/askTimber*), so
  each branch is take-switchable. Default text-digest freshness
  re-lights the ask when a latch flips a branch. -->

## ask matsuzo-waters · matsuzo
rungs: R0+
native: waters-hint
label: “Is the weir holding?”

## ask oume-margins · oume
rungs: R0+
native: margins-hint
label: “Hard ground this year?”

## ask rokusuke-timber · rokusuke
rungs: R0+
native: timber-hint
label: “Does the wood cut clean?”
