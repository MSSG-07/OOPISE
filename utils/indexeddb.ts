const DB_NAME = 'pcos-db';
const DB_VERSION = 5;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains('models')) db.createObjectStore('models', { keyPath: 'id' });
      if (!db.objectStoreNames.contains('predictions')) db.createObjectStore('predictions', { keyPath: 'id', autoIncrement: true });
      if (!db.objectStoreNames.contains('profile')) db.createObjectStore('profile', { keyPath: 'id' });
      if (!db.objectStoreNames.contains('logs')) db.createObjectStore('logs', { keyPath: 'id', autoIncrement: true });
      if (!db.objectStoreNames.contains('community')) db.createObjectStore('community', { keyPath: 'id', autoIncrement: true });
      if (!db.objectStoreNames.contains('communityInteractions')) db.createObjectStore('communityInteractions', { keyPath: 'id' });
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

export type PcosTreeNode = {
  featureIndex?: number;
  threshold?: number;
  left?: PcosTreeNode | number;
  right?: PcosTreeNode | number;
  value?: number;
  probability?: number;
};

export type PcosModel = {
  kind?: 'random-forest' | 'logistic';
  trees?: PcosTreeNode[];
  weights?: number[];
  bias?: number;
  mean?: number[];
  std?: number[];
};

function sigmoid(z: number) {
  return 1 / (1 + Math.exp(-z));
}

function clampChance(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(1, value));
}

function readLeafValue(node: PcosTreeNode | number | undefined): number {
  if (typeof node === 'number') return node;
  if (!node) return 0;
  if (typeof node.value === 'number') return node.value;
  if (typeof node.probability === 'number') return node.probability;
  return 0;
}

function traverseTree(node: PcosTreeNode | number | undefined, features: number[]): number {
  if (typeof node === 'number' || !node) {
    return readLeafValue(node);
  }

  const hasChildren = node.left != null || node.right != null;
  if (!hasChildren) {
    return readLeafValue(node);
  }

  const featureIndex = node.featureIndex ?? 0;
  const threshold = node.threshold ?? 0;
  const value = features[featureIndex] ?? 0;
  const nextNode = value <= threshold ? node.left : node.right;
  return traverseTree(nextNode, features);
}

function normalizeLinearFeatures(model: PcosModel, features: number[]) {
  const weightsLength = model.weights?.length ?? features.length;
  return Array.from({ length: weightsLength }, (_, index) => {
    const raw = features[index] ?? 0;
    const mean = model.mean?.[index] ?? 0;
    const std = model.std?.[index] ?? 1;
    return (raw - mean) / (std || 1);
  });
}

export function predictPcosChance(model: PcosModel | null | undefined, features: number[]) {
  if (!model) {
    return null;
  }

  const treeSet = Array.isArray(model.trees) ? model.trees : [];
  if (treeSet.length > 0) {
    const votes = treeSet.map((tree) => traverseTree(tree, features));
    const averageVote = votes.reduce((sum, vote) => sum + vote, 0) / votes.length;
    const chance = clampChance(averageVote > 1 ? sigmoid(averageVote) : averageVote);
    return {
      chance,
      label: chance >= 0.5 ? 1 : 0,
      method: 'random-forest',
    };
  }

  if (Array.isArray(model.weights) && model.weights.length > 0) {
    const normalized = normalizeLinearFeatures(model, features);
    let z = model.bias ?? 0;
    for (let index = 0; index < model.weights.length; index++) {
      z += model.weights[index] * (normalized[index] ?? 0);
    }
    const chance = clampChance(sigmoid(z));
    return {
      chance,
      label: chance >= 0.5 ? 1 : 0,
      method: 'logistic',
    };
  }

  return null;
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
  entryType: 'daily' | 'body-map';
  dateKey: string;
  createdAt: string;
  painLevel: number;
  flow: string;
  mood: string;
  symptoms: string;
  notes: string;
  tags: string[];
};

export async function saveLogEntry(entry: LogEntry) {
  const db = await openDB();
  const existingEntries = await getAllLogEntries();
  const existingToday = existingEntries.find(
    (item) => item.entryType === 'daily' && item.dateKey === entry.dateKey
  );
  return new Promise((resolve, reject) => {
    const tx = db.transaction('logs', 'readwrite');
    const store = tx.objectStore('logs');
    const req = existingToday?.id != null ? store.put({ ...entry, id: existingToday.id }) : store.add(entry);
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
      entryType: 'body-map' as const,
      dateKey: entry.createdAt.slice(0, 10),
      createdAt: entry.createdAt,
      painLevel: -1,
      flow: '',
      mood: '',
      symptoms: 'body-map-entry',
      notes: JSON.stringify({ markedAreas: entry.markedAreas, painTypes: entry.painTypes }),
      tags: entry.painTypes,
    };
    const req = store.add(record);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export type CommunityPost = {
  id?: number;
  user: string;
  text: string;
  createdAt: string;
  isMine?: boolean;
};

export async function saveCommunityPost(post: CommunityPost) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('community', 'readwrite');
    const store = tx.objectStore('community');
    const req = store.add(post);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function getAllCommunityPosts() {
  const db = await openDB();
  return new Promise<CommunityPost[]>((resolve, reject) => {
    const tx = db.transaction('community', 'readonly');
    const store = tx.objectStore('community');
    const req = store.getAll();
    req.onsuccess = () => resolve((req.result as CommunityPost[]) ?? []);
    req.onerror = () => reject(req.error);
  });
}

export type CommunityReply = {
  id?: string;
  user: string;
  text: string;
  createdAt: string;
  isMine?: boolean;
};

export type CommunityInteraction = {
  id: string;
  likes: number;
  replies: CommunityReply[];
  updatedAt?: string;
};

export async function getAllCommunityInteractions() {
  const db = await openDB();
  return new Promise<CommunityInteraction[]>((resolve, reject) => {
    const tx = db.transaction('communityInteractions', 'readonly');
    const store = tx.objectStore('communityInteractions');
    const req = store.getAll();
    req.onsuccess = () => resolve((req.result as CommunityInteraction[]) ?? []);
    req.onerror = () => reject(req.error);
  });
}

export async function saveCommunityInteraction(interaction: CommunityInteraction) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('communityInteractions', 'readwrite');
    const store = tx.objectStore('communityInteractions');
    const req = store.put({ ...interaction, updatedAt: new Date().toISOString() });
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
  updatedAt?: string;
};

export async function saveUserProfile(profile: StoredProfile) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('profile', 'readwrite');
    const store = tx.objectStore('profile');
    store.put({ ...profile, updatedAt: new Date().toISOString() });
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

export async function deleteUserProfile(id = 'current-user') {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('profile', 'readwrite');
    const store = tx.objectStore('profile');
    const req = store.delete(id);
    req.onsuccess = () => resolve(true);
    req.onerror = () => reject(req.error);
  });
}
