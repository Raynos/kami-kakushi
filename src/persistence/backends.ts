// Storage backends for the multi-backend redundant save (PRD §6.8.1 / D-030). Each
// autosave writes to ALL available backends; on load we read ALL and pick the
// newest. This survives itch's cross-origin-iframe partition/eviction better than
// any single backend (with the honest caveat, §6.8.1: inside one iframe partition
// the three may share storage — the crash-recovery ring + export/import are the real
// durability guarantee). Side-effectful (this is the persistence layer, not core).

export interface StorageBackend {
  readonly name: string;
  available(): boolean;
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  remove(key: string): Promise<void>;
  keys(): Promise<string[]>;
}

/** Always-available in-memory backend — the Node/test fallback. */
export class MemoryBackend implements StorageBackend {
  readonly name = 'memory';
  private readonly map = new Map<string, string>();
  available(): boolean {
    return true;
  }
  async get(key: string): Promise<string | null> {
    return this.map.has(key) ? this.map.get(key)! : null;
  }
  async set(key: string, value: string): Promise<void> {
    this.map.set(key, value);
  }
  async remove(key: string): Promise<void> {
    this.map.delete(key);
  }
  async keys(): Promise<string[]> {
    return [...this.map.keys()];
  }
}

class WebStorageBackend implements StorageBackend {
  constructor(
    readonly name: string,
    private readonly store: () => Storage | undefined,
  ) {}
  available(): boolean {
    try {
      const s = this.store();
      if (!s) return false;
      const probe = '__kk_probe__';
      s.setItem(probe, '1');
      s.removeItem(probe);
      return true;
    } catch {
      return false;
    }
  }
  async get(key: string): Promise<string | null> {
    try {
      return this.store()?.getItem(key) ?? null;
    } catch {
      return null;
    }
  }
  async set(key: string, value: string): Promise<void> {
    try {
      this.store()?.setItem(key, value);
    } catch {
      /* quota / disabled — a sibling backend still holds the save */
    }
  }
  async remove(key: string): Promise<void> {
    try {
      this.store()?.removeItem(key);
    } catch {
      /* ignore */
    }
  }
  async keys(): Promise<string[]> {
    try {
      const s = this.store();
      if (!s) return [];
      const out: string[] = [];
      for (let i = 0; i < s.length; i++) {
        const k = s.key(i);
        if (k !== null) out.push(k);
      }
      return out;
    } catch {
      return [];
    }
  }
}

export function localStorageBackend(): StorageBackend {
  return new WebStorageBackend('localStorage', () =>
    typeof localStorage !== 'undefined' ? localStorage : undefined,
  );
}

export function sessionStorageBackend(): StorageBackend {
  return new WebStorageBackend('sessionStorage', () =>
    typeof sessionStorage !== 'undefined' ? sessionStorage : undefined,
  );
}

/** IndexedDB backend — a single key/value object store. Degrades to unavailable. */
export class IndexedDBBackend implements StorageBackend {
  readonly name = 'indexedDB';
  private readonly dbName = 'kami-kakushi';
  private readonly storeName = 'saves';

  available(): boolean {
    return typeof indexedDB !== 'undefined';
  }

  private open(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(this.dbName, 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(this.storeName)) db.createObjectStore(this.storeName);
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  private async tx<T>(
    mode: IDBTransactionMode,
    fn: (store: IDBObjectStore) => IDBRequest<T>,
  ): Promise<T> {
    const db = await this.open();
    try {
      return await new Promise<T>((resolve, reject) => {
        const t = db.transaction(this.storeName, mode);
        const req = fn(t.objectStore(this.storeName));
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      });
    } finally {
      db.close();
    }
  }

  async get(key: string): Promise<string | null> {
    try {
      const v = await this.tx<string | undefined>(
        'readonly',
        (s) => s.get(key) as IDBRequest<string | undefined>,
      );
      return v ?? null;
    } catch {
      return null;
    }
  }
  async set(key: string, value: string): Promise<void> {
    try {
      await this.tx('readwrite', (s) => s.put(value, key));
    } catch {
      /* ignore — sibling backends still hold the save */
    }
  }
  async remove(key: string): Promise<void> {
    try {
      await this.tx('readwrite', (s) => s.delete(key));
    } catch {
      /* ignore */
    }
  }
  async keys(): Promise<string[]> {
    try {
      const ks = await this.tx<IDBValidKey[]>('readonly', (s) => s.getAllKeys());
      return ks.map((k) => String(k));
    } catch {
      return [];
    }
  }
}
