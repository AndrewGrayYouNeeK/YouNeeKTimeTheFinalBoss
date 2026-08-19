export const CLOCK_SOURCES = [
  { id: 'youneek', label: 'YouNeeK Digital' },
  { id: 'youneek12', label: 'YouNeeK Time' },
  { id: 'regular', label: 'Regular Time' },
  { id: 'army', label: 'Pineal Army Time' },
];

export const WATCH_DISPLAYS = [
  { id: 'face', label: 'Clock Face' },
  { id: 'decimal', label: 'Decimal Clock' },
];

export const SOURCE_KEY = 'hapticClockSource';
export const WATCH_DISPLAY_KEY = 'watchDisplay';
export const PREFS_EVENT = 'clock-prefs-updated';

export function readClockSource() {
  const id = localStorage.getItem(SOURCE_KEY);
  return CLOCK_SOURCES.some((s) => s.id === id) ? id : 'youneek';
}

export function readWatchDisplay() {
  const id = localStorage.getItem(WATCH_DISPLAY_KEY);
  return WATCH_DISPLAYS.some((s) => s.id === id) ? id : 'face';
}

export function writeClockSource(id) {
  localStorage.setItem(SOURCE_KEY, id);
  window.dispatchEvent(new Event(PREFS_EVENT));
}

export function writeWatchDisplay(id) {
  localStorage.setItem(WATCH_DISPLAY_KEY, id);
  window.dispatchEvent(new Event(PREFS_EVENT));
}

export function sourceLabel(id) {
  return CLOCK_SOURCES.find((s) => s.id === id)?.label || 'YouNeeK Digital';
}

function pad(value) {
  return String(value).padStart(2, '0');
}

export function getHapticDigits(time, source = 'youneek') {
  if (source === 'regular') {
    return { hours: time.hours12, minutes: time.regularMinutes ?? 0 };
  }
  if (source === 'army') {
    return { hours: time.armyHours, minutes: time.armyMinutes };
  }
  if (source === 'youneek12') {
    return { hours: time.hours12, minutes: time.armyMinutes };
  }
  return { hours: time.units, minutes: time.minutes };
}

export function formatDigital(time, source = 'youneek') {
  const { hours, minutes } = getHapticDigits(time, source);
  const sep = source === 'youneek' ? '•' : ':';
  return `${pad(hours)}${sep}${pad(minutes)}`;
}

export function showsRegularHands(source) {
  return source === 'all' || source === 'regular' || source === 'youneek12';
}

export function showsArmyHands(source) {
  return source === 'all' || source === 'army' || source === 'youneek12';
}

export function showsYouneekHands(source) {
  return source === 'all' || source === 'youneek';
}
