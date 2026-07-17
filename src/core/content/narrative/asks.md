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
  future takes-overlay address `ask.<id>.<line-id>`.

  STEP-2 SEED (R0–R2, per the plan's sparse matrix): 1–3 asks for
  the people a player actually stands with early — placeholder-grade
  voice, each ask pending its ADR-139 takes bundle. Later rungs join
  per authored wave; the step-4 re-homing carries the full-T0 floor
  meanwhile. -->

## ask genemon-house-standing · genemon
rungs: R0+
refresh: rung
label: “How do I stand with the house?”

<!--#the-book-says-->
Genemon: “The book says what it says. My ledger holds one line for
you — what you are to this house today is written there, and today
it reads: nothing more, nothing less.”

## ask genemon-house-wants · genemon
rungs: R0+
refresh: rung
native: house-wants
label: “What does the house want of me?”

## ask soan-body-mend · soan
rungs: R0+
refresh: health
native: body-mend
label: “Have a look at me, would you?”

## ask ohisa-kitchen-season · ohisa
rungs: R0+
refresh: season
label: “What’s the kitchen cooking?”

<!--#what-the-season-gives-->
O-Hisa: “What the season gives, we cook. The pot doesn’t argue with
the calendar and neither do I — come at mealtime and you’ll see for
yourself.”

## ask oyae-village-news · oyae
rungs: R1+
refresh: season
label: “Any word from the village?”

<!--#word-comes-up-the-road-->
O-Yae: “Word comes up the road with me every morning — most of it
not worth the carrying. Ask me again when the season turns; that’s
when the village finds things worth saying.”

## ask shinnosuke-what-are-you-doing · shinnosuke
rungs: R0+
label: “What are you up to?”

<!--#watching-you-->
Shinnosuke: “Watching you. Grandfather says you came from the weir
with no name on you. I’ve never met anyone who wasn’t anyone
before.”
