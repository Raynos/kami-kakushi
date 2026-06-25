# Decision Log (ADRs)

Append-only record of **locked decisions** and *why*. One entry per decision, numbered `D-000…`,
**IDs never reused**.

**Status:** ✅ Decided · 🛠 In design · ⏭ Deferred

**Reversing a decision:** don't delete it. Mark the old entry `⛔ REVERSED by D-XXX ({date})`, strike
its claim with `~~strikethrough~~`, and add a new ADR with the new call. History stays intact.

> Resolved [`human-in-the-loop`](../../human-in-the-loop/decisions.md) `H`-items graduate into ADRs here.

---

## Template (copy for each new decision)

### D-0XX ✅ — {short title}
- **Context:** {the forces at play — what made this worth recording}
- **Options:** {A / B / C, each in a phrase}
- **Decision:** {what we chose}
- **Why:** {the deciding rationale}
- **Consequences:** {what this commits us to; follow-on work it spawns}

---

<!-- Real entries below, newest at the bottom. -->

### D-001 ✅ — Grounded, non-magical story; mundane cause for the amnesia
- **Context:** The README seeds an Edo-era incremental RPG where a 17-year-old farmhand wakes amnesiac on a samurai estate. An early AI-generated design leaned magical (a tengu spirited the protagonist away; an otherworld trained/altered them). The human rejected this.
- **Options:** (A) Magical/folkloric truth (tengu, spirits) · (B) Soft isekai / reincarnation · (C) Fully grounded, mundane human truth.
- **Decision:** **(C)** The protagonist's amnesia and the whole mystery have ordinary, human causes (blunt head trauma + near-drowning + exposure from a flood). No tengu, spirits, reincarnation, isekai, or magic anywhere in the canon.
- **Why:** The human wants a grounded story; magic undercuts the intended tone and the earned-competence fantasy (D-003).
- **Consequences:** Every mystery must resolve to a human/natural cause. Story bible is the grounded spine in [`brainstorms/2026-06-25-grounded-story-spine.md`](../../brainstorms/2026-06-25-grounded-story-spine.md). The original magical framing is archived as superseded.

### D-002 ✅ — Pure Edo folk-mystery tone; folklore as believed-atmosphere only
- **Context:** The setting is rich in folklore (kamikakushi, yokai, kami). We need a rule for how it appears given D-001.
- **Options:** (A) Folklore literally real · (B) Folklore as belief/atmosphere with human causes · (C) No folklore at all.
- **Decision:** **(B)** Folklore appears only as what people *believe and fear* (superstition, rumor, ritual). Every folk-belief resolves one-to-one to a human/natural cause (a "kappa ford" is an undertow + a smugglers' sinking-spot, etc.). A thin margin of unresolved *ambiguity* is allowed for unease, but never confirmed magic and **never magic powers for the player**.
- **Why:** Keeps the world authentic and respectful (folklore as grief-coping/cover) while honoring D-001.
- **Consequences:** Maintain a belief→cause table for every yokai; debunk with dawning dread, not gotchas; cap residual ambiguity (≤1 unresolved token per playthrough) and keep it mundane-readable.

### D-003 ✅ — Mediocre-start protagonist; growth only through perseverance
- **Context:** A core character-fantasy decision. The early design implied the protagonist was secretly capable (combat skill from otherworld training).
- **Options:** (A) Secret talent / hidden power / bloodline · (B) Genuinely ordinary, gets strong only through effort.
- **Decision:** **(B)** The protagonist starts as a normal, average, even mediocre 17-year-old farmhand with **no hidden power, talent, or training**. All growth comes from perseverance, repetition, training, and refusing to quit. The first real fight is humbling/near-fatal and motivates training.
- **Why:** The zero-to-competent-through-effort arc *is* the core fantasy, and it maps perfectly onto the incremental grind (every number is earned sweat).
- **Consequences:** **Systems guardrail:** no returning memory or instinctive habit ever grants a starting stat, recipe, or combat bonus — every number starts at the bottom. Combat capacity is gated behind labor-built conditioning. The talent-foil antagonist (Hanzaki) must be shown as *trained*, not innately gifted, so the "effort > talent" thesis is never undercut.

### D-004 ✅ — One grounded diegetic late-game reset (no magical prestige)
- **Context:** Incremental games use prestige/resets for a long tail; we need one that fits a grounded single-player story.
- **Options:** (A) No reset (linear ending) · (B) One diegetic, grounded reset carrying meta-progress · (C) Classic repeatable magical/abstract prestige loop.
- **Decision:** **(B)** A single, grounded, story-justified reset late-game — a season-cycle time-skip in which the veteran protagonist starts a bigger venture (re-founding the drowned hamlet / accepting estate stewardship and teaching others). It carries hard-won skill, reputation, recipes, tools, and relationships forward as meta-progress and a teaching/management layer. **Not** reincarnation or a magic time-loop.
- **Why:** Gives the genre's long-tail loop without betraying the grounded, no-magic canon; makes "effort over talent" literally generational.
- **Consequences:** Save schema must carry meta-progress across the reset. Pick one canonical-default branch (recommend re-founding Kuzuhara) with identical carry-over so neither branch reads as lesser.

### D-005 ✅ — Working title: *Kamikakushi*
- **Context:** Need a working title for the repo/build; revisitable before launch.
- **Options:** *Kamikakushi* · *Mizuho* · *The Borrowed Year* · defer.
- **Decision:** **Kamikakushi** (神隠し, "spirited away") — the *village's superstition* for the protagonist's arrival; the truth is mundane and human.
- **Why:** Folklore-accurate, evocative of the core mystery, and thematically ironic (the comforting lie the story dismantles).
- **Consequences:** Low-stakes/reversible; finalize before the itch.io deploy.

### D-006 ✅ — Protagonist identity: true name *Tahei*; male; fixed (no rename)
- **Context:** PRD §1 left the protagonist's true name and customization open. The synthesis used "Ren" (flagged by the authenticity pass as faintly modern for an Edo peasant). The legend's gender-drift clue — the village misremembers the real lost child (Tama, a girl) as a boy — depends on the protagonist's gender.
- **Options:** Name: *Tahei* / *Ren* / *Kichizō* / *Sutekichi*. Customization: fixed name · player picks true name · player picks name + gender.
- **Decision:** True name **Tahei** (a plain, period-typical commoner name), revealed in **Act 4**; the borrowed village-name **"Tama"** is used until then; the protagonist is **male with a fixed name — no player rename**.
- **Why:** *Tahei* reads grounded and humble for a poor porter (Ren felt modern). A fixed gender protects the load-bearing gender-drift clue; a fixed name keeps the late-reveal beat authored and impactful.
- **Consequences:** Dialogue/story is authored around the "Tama" → "Tahei" reveal; no name/gender customization UI. The brainstorms story-spine doc drafted the placeholder "Ren" — read it as "Tahei".
