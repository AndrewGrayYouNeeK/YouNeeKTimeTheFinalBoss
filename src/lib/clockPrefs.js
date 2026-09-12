export const CLOCK_SOURCES = [
  { id: 'youneek', label: '100.100.100' },
  { id: 'youneek12', label: 'YouNeeK Time' },
  { id: 'regular', label: 'Regular Time' },
  { id: 'army', label: 'Army YouNeeK Time' },
];

export const WATCH_DISPLAYS = [
  { id: 'face', label: 'Clock Face' },
  { id: 'decimal', label: '100.100.100' },
];

export const HAND_STYLES = [
  { id: 'needle', label: 'Needle' },
  { id: 'ring', label: 'Ring + Dart' },
  { id: 'comet', label: 'Comet' },
  { id: 'pulse', label: 'Pulse' },
];

export const SOURCE_KEY = 'hapticClockSource';
export const WATCH_DISPLAY_KEY = 'watchDisplay';
export const HAND_STYLE_KEY = 'clockHandStyle';
export const PREFS_EVENT = 'clock-prefs-updated';

export function readClockSource() {
  const id = localStorage.getItem(SOURCE_KEY);
  return CLOCK_SOURCES.some((s) => s.id === id) ? id : 'youneek';
}

export function readWatchDisplay() {
  const id = localStorage.getItem(WATCH_DISPLAY_KEY);
  return WATCH_DISPLAYS.some((s) => s.id === id) ? id : 'face';
}

export function readHandStyle() {
  const id = localStorage.getItem(HAND_STYLE_KEY);
  return HAND_STYLES.some((s) => s.id === id) ? id : 'needle';
}

export function writeClockSource(id) {
  localStorage.setItem(SOURCE_KEY, id);
  window.dispatchEvent(new Event(PREFS_EVENT));
}

export function writeWatchDisplay(id) {
  localStorage.setItem(WATCH_DISPLAY_KEY, id);
  window.dispatchEvent(new Event(PREFS_EVENT));
}

export function writeHandStyle(id) {
  localStorage.setItem(HAND_STYLE_KEY, id);
  window.dispatchEvent(new Event(PREFS_EVENT));
}

export function sourceLabel(id) {
  return CLOCK_SOURCES.find((s) => s.id === id)?.label || '100.100.100';
}

export function handStyleLabel(id) {
  return HAND_STYLES.find((s) => s.id === id)?.label || 'Needle';
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
  if (source === 'regular') {
    return `${pad(time.hours12)}:${pad(time.regularMinutes)}:${pad(time.regularSeconds ?? 0)}`;
  }
  if (source === 'army') {
    return `${pad(time.armyHours)}:${pad(time.armyMinutes)}:${pad(time.armySeconds)}`;
  }
  if (source === 'youneek12') {
    return `${pad(time.hours12)}:${pad(time.armyMinutes)}:${pad(time.armySeconds)}`;
  }
  return `${pad(time.units)}•${pad(time.minutes)}•${pad(time.seconds)}`;
}

export function getHandRotations(time) {
  return {
    hour: time.regularHourRotation,
    minute: time.regularMinuteRotation,
    second: time.regularSecondRotation,
  };
}
