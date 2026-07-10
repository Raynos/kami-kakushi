// Thin DOM renderer (PRD §6.9). Reads GameState, dispatches intents — zero game logic.
//
// `styles.css` is NOT imported here (FB-257) — index.html links it. See the note there: a
// JS-imported stylesheet becomes a JS module in dev, and that module imports `@vite/client`.

export { mount } from './render';
