import { HILBERT_SEGMENTS } from './hilbert';

// Personal spatial diary for the Reflect (Hilbert) mode.
//
// Local-only by design: entries live in this browser's localStorage under
// DIARY_KEY. There is no backend, no sync, and no automatic source of activity
// data — every entry is typed by the user with an explicit start and end.
// Unlogged time stays neutral (unlit segments).

export const DIARY_KEY = 'hilbertDiaryV1';

// Decimal minutes per day (100 decimal hours x 100). A Hilbert traversal is
// HILBERT_SEGMENTS (255) decimal minutes long, so a day holds 10000/255 ≈ 39.2
// traversals: 39 full passes plus a 55-minute partial 40th pass. Diary records
// are keyed (day, traversal, segment), so repeated passes over the same cell
// never overwrite older records — each pass is its own layer.
export const MINUTES_PER_DAY = 10000;
export const TRAVERSALS_PER_DAY = Math.ceil(MINUTES_PER_DAY / HILBERT_SEGMENTS);

function clampMinute(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  return Math.min(MINUTES_PER_DAY, Math.max(0, n));
}

function readStore() {
  try {
    const raw = localStorage.getItem(DIARY_KEY);
    if (!raw) return { version: 1, days: {} };
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || typeof parsed.days !== 'object') {
      return { version: 1, days: {} };
    }
    return parsed;
  } catch {
    return { version: 1, days: {} };
  }
}

function writeStore(store) {
  try {
    localStorage.setItem(DIARY_KEY, JSON.stringify(store));
  } catch {
    // Storage full or blocked: diary stays in-memory for this session only.
  }
}

export function dateKeyFor(dayOffset = 0, now = new Date()) {
  const d = new Date(now);
  d.setDate(d.getDate() - dayOffset);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
}

export function readDayEntries(dayKey) {
  const day = readStore().days[dayKey];
  return Array.isArray(day?.entries) ? day.entries : [];
}

export function addEntry(dayKey, { startMin, endMin, label, colorIndex }) {
  if (!(endMin > startMin)) return null;
  const store = readStore();
  const day = store.days[dayKey] || { entries: [] };
  const entry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    startMin: clampMinute(startMin),
    endMin: clampMinute(endMin),
    label: String(label || '').slice(0, 40),
    colorIndex: Math.min(3, Math.max(0, Math.trunc(colorIndex) || 0)),
  };
  day.entries.push(entry);
  store.days[dayKey] = day;
  writeStore(store);
  return entry;
}

export function removeEntry(dayKey, id) {
  const store = readStore();
  const day = store.days[dayKey];
  if (!Array.isArray(day?.entries)) return;
  day.entries = day.entries.filter((e) => e.id !== id);
  writeStore(store);
}

// Real wall-clock hh:mm -> decimal minutes of day (0..10000).
export function realToDecimalMinutes(hours, minutes) {
  return ((hours * 60 + minutes) / 1440) * MINUTES_PER_DAY;
}

// Which (segment, coverage) of one traversal an entry set lights up. Minutes
// are the resolution; a segment is lit when at least one logged minute of the
// selected traversal falls inside an entry. Overlapping entries resolve
// last-wins in array order, so a cell never shows a blend of two timestamps.
export function traversalCoverage(dayKey, traversal) {
  const coverage = new Array(HILBERT_SEGMENTS).fill(null);
  if (traversal < 0 || traversal >= TRAVERSALS_PER_DAY) return coverage;
  const lo = traversal * HILBERT_SEGMENTS;
  const hi = lo + HILBERT_SEGMENTS;
  for (const entry of readDayEntries(dayKey)) {
    const from = Math.max(clampMinute(entry.startMin), lo);
    const to = Math.min(clampMinute(entry.endMin), hi);
    for (let m = Math.floor(from); m < to; m++) {
      const segment = m - lo;
      if (segment >= 0 && segment < HILBERT_SEGMENTS) {
        coverage[segment] = { colorIndex: entry.colorIndex, label: entry.label };
      }
    }
  }
  return coverage;
}
