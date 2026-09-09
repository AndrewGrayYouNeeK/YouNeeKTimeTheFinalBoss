import SunCalc from 'suncalc';
import { getMoonPhase } from '@/lib/moonPhase';

export const SYNODIC_MS = 29.530588853 * 86400000;
export const KNOWN_NEW_MS = Date.UTC(2000, 0, 6, 18, 14, 0);

function phaseDistanceFromNew(date) {
  const phase = SunCalc.getMoonIllumination(date).phase;
  return Math.min(phase, 1 - phase);
}

function refineNewMoon(approxMs) {
  let best = approxMs;
  let bestDist = phaseDistanceFromNew(new Date(approxMs));
  const start = approxMs - 2 * 86400000;
  const end = approxMs + 2 * 86400000;
  for (let t = start; t <= end; t += 3600000) {
    const dist = phaseDistanceFromNew(new Date(t));
    if (dist < bestDist) {
      bestDist = dist;
      best = t;
    }
  }
  let lo = best - 3600000;
  let hi = best + 3600000;
  for (let i = 0; i < 24; i += 1) {
    const mid = (lo + hi) / 2;
    const left = phaseDistanceFromNew(new Date((lo + mid) / 2));
    const right = phaseDistanceFromNew(new Date((mid + hi) / 2));
    if (left < right) hi = mid;
    else lo = mid;
  }
  return Math.round((lo + hi) / 2);
}

export function meanLunationIndex(date) {
  return Math.floor((date.getTime() - KNOWN_NEW_MS) / SYNODIC_MS);
}

const boundsCache = new Map();

export function lunationBounds(index) {
  const cached = boundsCache.get(index);
  if (cached) return cached;
  const startMs = refineNewMoon(KNOWN_NEW_MS + index * SYNODIC_MS);
  const endMs = refineNewMoon(KNOWN_NEW_MS + (index + 1) * SYNODIC_MS);
  const value = { start: new Date(startMs), end: new Date(endMs), startMs, endMs };
  boundsCache.set(index, value);
  return value;
}

function startOfLocalDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function lunationIndexForDate(date) {
  const dayStart = startOfLocalDay(date);
  let index = meanLunationIndex(dayStart);
  let bounds = lunationBounds(index);
  const startDay = startOfLocalDay(bounds.start).getTime();
  const endDay = startOfLocalDay(bounds.end).getTime();
  if (dayStart.getTime() < startDay) {
    index -= 1;
    bounds = lunationBounds(index);
  } else if (dayStart.getTime() >= endDay) {
    index += 1;
    bounds = lunationBounds(index);
  }
  return { index, bounds, dayStart };
}

export function getLunarDate(date = new Date()) {
  const { index, bounds, dayStart } = lunationIndexForDate(date);
  const dayMs = 86400000;
  const day = Math.floor((dayStart.getTime() - startOfLocalDay(bounds.start).getTime()) / dayMs) + 1;
  const moon = getMoonPhase({ date });
  const year = bounds.start.getFullYear();
  const firstOfYear = lunationIndexForDate(new Date(year, 0, 1)).index;
  const monthInYear = index - firstOfYear + 1;

  return {
    index,
    day,
    length: Math.max(1, Math.round((bounds.endMs - bounds.startMs) / dayMs)),
    year,
    monthInYear,
    start: bounds.start,
    end: bounds.end,
    phase: moon.phase,
    illumination: moon.illumination,
    label: `L${String(monthInYear).padStart(2, '0')}·D${String(day).padStart(2, '0')}`,
    longLabel: `YouNeeK Lunar ${year} · Month ${monthInYear} · Day ${day}`,
  };
}

export function getLunarMonthDays(index) {
  const { start, end, endMs } = lunationBounds(index);
  const days = [];
  const cursor = startOfLocalDay(start);
  const last = startOfLocalDay(new Date(endMs - 1));
  const today = startOfLocalDay(new Date()).getTime();
  let day = 1;
  while (cursor.getTime() <= last.getTime()) {
    const gregorian = new Date(cursor);
    days.push({
      day,
      date: gregorian,
      key: `${index}:${day}`,
      isToday: today === gregorian.getTime(),
    });
    cursor.setDate(cursor.getDate() + 1);
    day += 1;
  }
  return { start, end, days, length: days.length };
}

export function lunarNoteKey(index, day) {
  return `lunarNote:${index}:${day}`;
}
