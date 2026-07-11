# The quest shapes that actually emerged (ADR-184's zone-reveal wave)

**Status:** discovery notes, deliberately **not canon**. The human's call when signing
ADR-184: the quest taxonomy is **emergent, not pre-declared** — *"author the five, then
record the shapes that actually emerged"* — and it is **too early for an ADR**. This is
that record. If a T1 wave finds the same shapes, they graduate; if it finds different
ones, this doc was the cheap way to learn that.

## What we actually built

Five zones left the rung schedule. Four needed a new VN; the fifth turned out to already
have one. Written out, they are **not** five instances of one thing — they are four
distinct shapes, and the differences are load-bearing.

### 1 · The "you now hold a thing you cannot use" beat (`sb-market`, `sb-cook`)

The trigger is **an item in your hands with no home**: coin you have nowhere to spend,
greens you cannot eat raw. The NPC does not summon you and nothing is wrong; the world
simply notices you have crossed a threshold of *having*, and explains the institution
that answers it (the stall; the pot).

- **The reveal is a capability**, and the zone is where that capability lives.
- These fire **early** (R2) and are the game's real tutorial for its two economies.
- The trigger is **derived, not authored**: `coin ≥ CHEAPEST_STALL_ITEM_COST`, `sansai ≥
  COOK_SANSAI_COST` — a re-priced market moves the beat for free.

### 2 · The "something is wrong and now you can answer it" beat (`sb-racks`)

The trigger is **a standing problem that predates you**, plus the *means* to act arriving
(the blade at R3). The raids on the drying racks have been happening all along; what
changed is you.

- The reveal is a **hunting ground** — the zone is the problem's source, not its symptom.
- This is the shape that most wants a **quest entry** (there is already a `pest_field_margins`
  PEST quest with the same fiction), and the one place the four shapes press against the
  Quests tab's R5 home: the beat fires at R3, into a UI that does not exist yet.

### 3 · The "someone else's account, charged to you" beat (`sb-lease`)

Matsuzō walks up from the river on the lease day; the screens are the house's to keep and
the rats are eating them; *"send your man down while the year turns."* Two old men settle
a season of your evenings between them and nobody asks you.

- **It already existed.** It was authored long before this law, fired at the season turn,
  and revealed nothing. Making it the reeds' reveal cost a completion-effect flag.
- The shape: **an obligation contracted over your head**. Distinct from #2 because the
  problem is not the estate's — it is *owed* to someone outside it.
- **The lesson worth keeping:** before authoring a reveal beat, check whether the fiction
  already wrote one. One of five was already there, and it was the best of the five.

### 4 · The "consequence lands on your body" beat (`sb-sickroom`)

The trigger is **state, not an item and not a place**: you are hurt, and hurt now exists
as a category (combat is open). Sōan tends a body he has mended once already.

- The reveal is a **service**, not a resource or a ground — the zone is where consequences
  are carried.
- This shape is the one that **bit us**: a naive `hp < hpMax` fired in the cold open,
  because the intro's stat pick raises max HP without raising current HP. A body-state
  trigger needs a *second* clause naming what kind of hurt counts.

## What the four shapes have in common (the only rules worth generalising yet)

1. **Every option sets the reveal flag.** A player may be graceless, sceptical or rude —
   the pick colours the relationship, never the map. (The `works-intro` pattern; now five
   for five.)
2. **The trigger is made of labour the player is already doing.** Not a rule we invented —
   the human's, and it is the only stated failure mode: *"I don't think there's a risk of a
   soft lock, unless the criteria for starting the side quest is really obtuse."*
3. **The trigger derives from a registry, never a magic number** (the stall's cheapest
   item; a meal's cost; the rung's own requirement list).
4. **Each is a place the fiction was already pointing at.** None of the four invents a
   reason for its zone; each cashes one the world had already stated.

## The open questions (deliberately left open)

- **Do these become QUEST entries?** Today they are scenes only. Two of them (`sb-racks`,
  `sb-lease`) shadow real `PEST` quests that already exist in `quests.ts` with the same
  fiction. The Quests tab opens at R5 and shows completed quests retroactively — so a beat
  that fires at R2 is simply untracked. That is *fine* today and *odd* later; it is the
  first thing a T1 wave should settle.
- **Is "shape" even the right unit?** Four shapes from four beats is a suspicious ratio. It
  may mean the taxonomy is real, or it may mean four is too few to see the repeats. Do not
  canonise until a second wave (T1's zones) either repeats these or doesn't.
- **The `sb-lease` lesson generalised:** how much *already-authored* fiction is sitting in
  `scenes.md` doing nothing mechanical? That audit is cheap and has now paid once.
