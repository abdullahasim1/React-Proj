const INDEX_ENTRIES_KEY = "index_entries";
const INDEX_MASTER_KEY = "index_master";

export function loadIndexEntries() {
  try {
    const raw = localStorage.getItem(INDEX_ENTRIES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveIndexEntries(entries) {
  localStorage.setItem(INDEX_ENTRIES_KEY, JSON.stringify(entries));
}

export function loadIndexMaster() {
  try {
    const raw = localStorage.getItem(INDEX_MASTER_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveIndexMaster(indexNames) {
  const unique = [...new Set(indexNames.map((x) => String(x || "").trim()).filter(Boolean))];
  unique.sort((a, b) => a.localeCompare(b));
  localStorage.setItem(INDEX_MASTER_KEY, JSON.stringify(unique));
}

export function getLatestEntryByIndex(entries) {
  const latest = new Map();
  for (const entry of entries) {
    const key = entry.indexName;
    if (!key) continue;
    const existing = latest.get(key);
    if (!existing) {
      latest.set(key, entry);
      continue;
    }
    if (entry.date > existing.date) {
      latest.set(key, entry);
      continue;
    }
    if (entry.date === existing.date) {
      const a = new Date(entry.createdAt).getTime();
      const b = new Date(existing.createdAt).getTime();
      if (a > b) latest.set(key, entry);
    }
  }
  return latest;
}

export function ensureSeedFromMock(mockIndexes = []) {
  const existingEntries = loadIndexEntries();
  const existingMaster = loadIndexMaster();

  if (existingEntries.length || existingMaster.length) return;

  const now = new Date().toISOString();
  const seedEntries = mockIndexes
    .filter((x) => x && x.indexName && x.currentDate !== undefined && x.currentValue !== undefined)
    .map((x, idx) => ({
      id: Date.now() + idx,
      indexName: x.indexName,
      date: x.currentDate,
      value: x.currentValue,
      notes: "seed",
      createdBy: "seed",
      createdAt: now,
    }));

  saveIndexEntries(seedEntries);
  saveIndexMaster(mockIndexes.map((x) => x.indexName));
}

