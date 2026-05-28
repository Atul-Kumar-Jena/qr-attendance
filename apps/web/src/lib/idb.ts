/**
 * Minimal Promise-based IndexedDB wrapper.
 * Three object stores:
 *   keys     — institution + device keypairs
 *   ledger   — append-only hash-chained attendance records
 *   meta     — misc key/value (device id, last sync, etc.)
 */

const DB_NAME = 'attendly_local_v1';
const DB_VERSION = 1;

let dbPromise: Promise<IDBDatabase> | null = null;

function openDb(): Promise<IDBDatabase> {
  if (typeof window === 'undefined' || !window.indexedDB) {
    return Promise.reject(new Error('IndexedDB not available'));
  }
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const req = window.indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains('keys')) {
        db.createObjectStore('keys', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('ledger')) {
        db.createObjectStore('ledger', { keyPath: 'seq', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains('meta')) {
        db.createObjectStore('meta', { keyPath: 'k' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbPromise;
}

function tx<T>(
  store: 'keys' | 'ledger' | 'meta',
  mode: IDBTransactionMode,
  fn: (s: IDBObjectStore) => IDBRequest<T> | Promise<T>,
): Promise<T> {
  return openDb().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const t = db.transaction(store, mode);
        const s = t.objectStore(store);
        const r = fn(s);
        if (r instanceof Promise) {
          r.then(resolve, reject);
          return;
        }
        r.onsuccess = () => resolve(r.result as T);
        r.onerror = () => reject(r.error);
      }),
  );
}

// ─── keys store ──────────────────────────────────────────────────────────────

export interface StoredKey {
  id: string;             // e.g. "inst:<institutionId>" or "device"
  publicKey: string;
  privateKey: string;
  algo: string;
  createdAt: number;
  meta?: Record<string, unknown>;
}

export function putKey(k: StoredKey): Promise<unknown> {
  return tx('keys', 'readwrite', (s) => s.put(k));
}

export function getKey(id: string): Promise<StoredKey | undefined> {
  return tx<StoredKey | undefined>('keys', 'readonly', (s) => s.get(id));
}

export function listKeys(): Promise<StoredKey[]> {
  return tx<StoredKey[]>('keys', 'readonly', (s) => s.getAll());
}

export function deleteKey(id: string): Promise<unknown> {
  return tx('keys', 'readwrite', (s) => s.delete(id));
}

// ─── ledger store ────────────────────────────────────────────────────────────

export interface LedgerRecord {
  seq?: number;
  prevHash: string;
  hash: string;
  ts: number;
  kind: string;
  payload: unknown;
  sig?: string;
  signerPub?: string;
  synced?: boolean;
}

export function appendLedger(r: LedgerRecord): Promise<number> {
  return tx<number>('ledger', 'readwrite', (s) => s.add(r) as IDBRequest<number>);
}

export function getLedger(): Promise<LedgerRecord[]> {
  return tx<LedgerRecord[]>('ledger', 'readonly', (s) => s.getAll());
}

export function getLastLedgerRecord(): Promise<LedgerRecord | null> {
  return openDb().then(
    (db) =>
      new Promise((resolve, reject) => {
        const t = db.transaction('ledger', 'readonly');
        const cursorReq = t.objectStore('ledger').openCursor(null, 'prev');
        cursorReq.onsuccess = () => {
          const c = cursorReq.result;
          resolve(c ? (c.value as LedgerRecord) : null);
        };
        cursorReq.onerror = () => reject(cursorReq.error);
      }),
  );
}

export function clearLedger(): Promise<unknown> {
  return tx('ledger', 'readwrite', (s) => s.clear());
}

export function markSynced(seq: number): Promise<unknown> {
  return openDb().then(
    (db) =>
      new Promise((resolve, reject) => {
        const t = db.transaction('ledger', 'readwrite');
        const s = t.objectStore('ledger');
        const r = s.get(seq);
        r.onsuccess = () => {
          const rec = r.result as LedgerRecord | undefined;
          if (!rec) return resolve(undefined);
          rec.synced = true;
          const p = s.put(rec);
          p.onsuccess = () => resolve(undefined);
          p.onerror = () => reject(p.error);
        };
        r.onerror = () => reject(r.error);
      }),
  );
}

// ─── meta store ──────────────────────────────────────────────────────────────

export function putMeta(k: string, v: unknown): Promise<unknown> {
  return tx('meta', 'readwrite', (s) => s.put({ k, v }));
}

export function getMeta<T = unknown>(k: string): Promise<T | undefined> {
  return tx<{ k: string; v: T } | undefined>('meta', 'readonly', (s) => s.get(k)).then(
    (r) => (r ? r.v : undefined),
  );
}

export async function purgeAllLocal(): Promise<void> {
  if (typeof window === 'undefined' || !window.indexedDB) return;
  try {
    await openDb().then((db) => {
      ['keys', 'ledger', 'meta'].forEach((name) => {
        try {
          const t = db.transaction(name, 'readwrite');
          t.objectStore(name).clear();
        } catch {}
      });
    });
  } catch {}
}
