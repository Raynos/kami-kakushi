<!-- The GENERALIZED VN scenes (storywave G3.5 / FB-5) — the AUTHORING SOURCE OF
  TRUTH for scenes NOT tied to a rung promotion: the six season-exit overlays,
  the nengu Autumn-exit ceremony, the R5 Count's scene body, and the authored
  side-beats. Compiled to src/core/content/scenes.gen.ts by
  `pnpm run gen:narrative`; re-exported by ../scenes.ts (which keeps the types +
  sceneById). Format spec: ./README.md.

  STUB — filled at G4.1. The two blocks below EXERCISE the two grammar forms
  G3.5 adds (the speakerless narration-only beat + the scene-def block); the
  real content — the season overlays, the nengu reckoning, the Count, and U8's
  side-beats — migrates in from t0v2/*/VERDICT.md picks at G4.1. The scene
  TRIGGERS stay unwired until G4, so nothing here fires in the live arc yet.

  Fiction-voiced sample text is drawn VERBATIM from picked t0v2 takes (register
  law §0.5 — never invented): block 1's narration is a PLACEHOLDER borrowed from
  u2 take-c (the picked R2 silent-rung take) pending the real nengu prose;
  block 2 is the U8 "dog that stays" side-beat, take C (the U8 pick). -->

<!-- FORM 1 · the speakerless narration-only beat (ADR-165): a VN frame whose
  greeting is narrator-voiced only (no granter speaker) and which carries NO
  decision — the engine drives it via the empty-options continue path. Here the
  season-exit ceremony (the nengu reckoning is Autumn's; gap-inventory item 2),
  once per year. STUB narration (verbatim u2 take-c) — replaced at G4.1 by the
  authored nengu scene body (the board; the MC as furniture; felt, never
  numbered). -->

## scene-def nengu-autumn-frame
trigger: season-exit autumn
once: true
voice: narrator

> First light. The broom stands against the gatepost where you left it.
> The hand who kept the yard's round quit for the lowlands; nobody has
> said whose it is now.

> You take the broom. Nobody takes it back.

<!-- FORM 2 · the scene-def block with a decision (trigger + once). The U8 "dog
  that stays" side-beat — take C, the pick — fired when the overgrown-orchard
  chain completes (a discovered flag). Verbatim from t0v2/u8-side-beats/take-c
  (scene + decide only; the flag-keyed aftermath log lines + the fed-branch
  new-moon native payoff are texture that migrates at G4.1). A `native:` sidecar
  is NOT built at G3.5 — DEFERRED with this note; the pick marks one (the
  new-moon bark), which lands as a hand-written scenes.native.ts at G4.1. -->

## scene-def sb-dog
trigger: flag orchard-reclaimed
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

Genemon: "A dog. Old, one ear. Rice: a handful, mornings, from the sweepings
— entered against rats. If it earns, it stays entered."

memory: genemon +1 (accountable)
flags: sb-dog-fed

#### sb-dog-kihei · "Take it to Kihei."

Kihei: "Give me your belt-cord. Go rake the leaves. This isn't a lesson."

memory: kihei +1 (clear-eyed)
flags: sb-dog-ended
