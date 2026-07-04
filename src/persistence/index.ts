// Multi-backend redundant save layer (PRD §6.8). Side-effectful; never imported BY
// core. The browser app wires IndexedDB + localStorage + sessionStorage; tests inject
// MemoryBackends + a fake clock.

import {
  MemoryBackend,
  IndexedDBBackend,
  localStorageBackend,
  sessionStorageBackend,
  type StorageBackend,
} from './backends';
import { SaveManager, type SaveManagerOptions } from './saveManager';

export { SaveManager } from './saveManager';
export type { SaveResult, LoadResult, SaveManagerOptions } from './saveManager';
export {
  MemoryBackend,
  IndexedDBBackend,
  localStorageBackend,
  sessionStorageBackend,
} from './backends';
export type { StorageBackend } from './backends';
export type { SaveEnvelope } from './codec';
export { exportBase64, importBase64, toBase64 } from './codec';
export { migrate } from './migrate';

/** The real browser save manager: three redundant backends + the wall clock. */
export function createBrowserSaveManager(overrides: Partial<SaveManagerOptions> = {}): SaveManager {
  const backends: StorageBackend[] = [
    new IndexedDBBackend(),
    localStorageBackend(),
    sessionStorageBackend(),
  ];
  return new SaveManager({ backends, now: () => Date.now(), ...overrides });
}

/** A memory-backed manager for tests / headless Node. */
export function createMemorySaveManager(
  backends: StorageBackend[] = [new MemoryBackend()],
  now: () => number = () => 0,
): SaveManager {
  return new SaveManager({ backends, now });
}
