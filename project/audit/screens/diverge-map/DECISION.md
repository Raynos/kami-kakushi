# Diverge — the walkable estate map (T0-M4-F4, D-065/D-073)

**Surface:** a new top-level **Estate 地図** tab — the estate as areas you MOVE BETWEEN (the
node-graph in `content/map.ts`, 6 nodes under the ceiling of 7), not a menu.

**Two approaches considered:**
- **Variant A — focused "you are here + paths" (WINNER).** A location card (name + place-kanji + blurb) and the
  *reachable* neighbours as ink walk-affordances ("→ Home paddies 田圃"), danger-ring marked ⚠ + conditioning-gated.
  Screenshot: `A-forecourt.png`.
- **Variant B — whole-revealed-map grid.** Every known node shown at once as a cell grid, current highlighted,
  reachable cells clickable, non-adjacent revealed cells dimmed. Designed, not screenshotted (overnight time-box).

**Pick: A.** The T0 estate is a 6-node hamlet — small enough that the focused "here + the paths that lead off it"
reads cleaner and is more woodblock-faithful (ink place-names with kanji) than B's grid, which reads as generic
game-UI and adds spatial chrome the tiny graph doesn't need. The map GROWS in T1 (NQ-3); B's whole-map view becomes
the better fit once the graph is large — revisit then. Winner shipped to `main` flag-free; **R3** filed (non-blocking).
