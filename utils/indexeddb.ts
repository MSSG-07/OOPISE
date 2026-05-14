const DB_NAME = 'pcos-db';
const DB_VERSION = 3;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains('models')) db.createObjectStore('models', { keyPath: 'id' });
      if (!db.objectStoreNames.contains('predictions')) db.createObjectStore('predictions', { keyPath: 'id', autoIncrement: true });
      if (!db.objectStoreNames.contains('profile')) db.createObjectStore('profile', { keyPath: 'id' });
      if (!db.objectStoreNames.contains('logs')) db.createObjectStore('logs', { keyPath: 'id', autoIncrement: true });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function saveModel(id: string, model: any) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('models', 'readwrite');
    const store = tx.objectStore('models');
    store.put({ id, model });
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
}

export async function getModel(id: string) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('models', 'readonly');
    const store = tx.objectStore('models');
    const req = store.get(id);
    req.onsuccess = () => resolve(req.result?.model ?? null);
    req.onerror = () => reject(req.error);
  });
}

export async function addPrediction(record: any) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('predictions', 'readwrite');
    const store = tx.objectStore('predictions');
    const req = store.add(record);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function getAllPredictions() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('predictions', 'readonly');
    const store = tx.objectStore('predictions');
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export type LogEntry = {
  id?: number;
  createdAt: string;
  painLevel: number;
  symptoms: string;
  notes: string;
  tags: string[];
};

export async function saveLogEntry(entry: LogEntry) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('logs', 'readwrite');
    const store = tx.objectStore('logs');
    const req = store.add(entry);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function getAllLogEntries() {
  const db = await openDB();
  return new Promise<LogEntry[]>((resolve, reject) => {
    const tx = db.transaction('logs', 'readonly');
    const store = tx.objectStore('logs');
    const req = store.getAll();
    req.onsuccess = () => resolve((req.result as LogEntry[]) ?? []);
    req.onerror = () => reject(req.error);
  });
}

export type BodyMapEntry = {
  id?: number;
  createdAt: string;
  markedAreas: string[];
  painTypes: string[];
};

export async function saveBodyMapEntry(entry: BodyMapEntry) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('logs', 'readwrite');
    const store = tx.objectStore('logs');
    const record = {
      createdAt: entry.createdAt,
      painLevel: -1,
      symptoms: 'body-map-entry',
      notes: JSON.stringify({ markedAreas: entry.markedAreas, painTypes: entry.painTypes }),
      tags: entry.painTypes,
    };
    const req = store.add(record);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export type StoredProfile = {
  id: string;
  name: string;
  age: number;
  weight: number;
  height: number;
  lastPeriod: string;
  cycleLength: number;
  isRegular: boolean;
  hasConcerns: boolean;
};

export async function saveUserProfile(profile: StoredProfile) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('profile', 'readwrite');
    const store = tx.objectStore('profile');
    store.put(profile);
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
}

export async function getUserProfile(id = 'current-user') {
  const db = await openDB();
  return new Promise<StoredProfile | null>((resolve, reject) => {
    const tx = db.transaction('profile', 'readonly');
    const store = tx.objectStore('profile');
    const req = store.get(id);
    req.onsuccess = () => resolve((req.result as StoredProfile | undefined) ?? null);
    req.onerror = () => reject(req.error);
  });
}
