export const CLOCK_SOURCES = [
  { id: 'youneek', label: '100.100.100' },
  { id: 'youneek12', label: '12 hours' },
  { id: 'regular', label: 'Regular Time' },
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
export const RENDER_MODE_KEY = 'clockRenderMode';
export const PREFS_EVENT = 'clock-prefs-updated';

export const RENDER_MODES = [
  { id: 'legacy', label: 'Classic Dial' },
  { id: 'hilbert', label: 'Reflect' },
  { id: 'spiral', label: 'Move' },
];

export function readClockSource() {
  const id = localStorage.getItem(SOURCE_KEY);
  if (id === 'army' || id === 'decimal') return 'youneek';
  return CLOCK_SOURCES.some((s) => s.id === id) ? id : 'youneek';
}

// youneek12 keeps 12 hour marks plus a 0–100 minute/second scale.
// Every other source is a single 0–100 scale (hours, minutes, and seconds each count to 100).
export function dialFace(source) {
  return source === 'youneek12' ? 'twelve' : 'hundred';
}

export function readWatchDisplay() {
  const id = localStorage.getItem(WATCH_DISPLAY_KEY);
  return WATCH_DISPLAYS.some((s) => s.id === id) ? id : 'face';
}

export function readHandStyle() {
  const id = localStorage.getItem(HAND_STYLE_KEY);
  return HAND_STYLES.some((s) => s.id === id) ? id : 'needle';
}

export function readRenderMode() {
  const id = localStorage.getItem(RENDER_MODE_KEY);
  return RENDER_MODES.some((m) => m.id === id) ? id : 'legacy';
}

export function writeRenderMode(id) {
  localStorage.setItem(RENDER_MODE_KEY, id);
  window.dispatchEvent(new Event(PREFS_EVENT));
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

export function renderModeLabel(id) {
  return RENDER_MODES.find((m) => m.id === id)?.label || 'Classic Dial';
}

function pad(value) {
  return String(value).padStart(2, '0');
}

export function getHapticDigits(time, source = 'youneek') {
  if (source === 'youneek12') {
    return { hours: time.hours12, minutes: time.armyMinutes ?? 0, seconds: time.armySeconds ?? 0 };
  }
  if (source === 'regular') {
    return { hours: time.hours12, minutes: time.regularMinutes ?? 0, seconds: time.regularSeconds ?? 0 };
  }
  return { hours: time.units, minutes: time.minutes, seconds: time.seconds };
}

export function formatDigital(time, source = 'youneek') {
  const { hours, minutes, seconds } = getHapticDigits(time, source);
  const sep = source === 'youneek' ? '•' : ':';
  return `${pad(hours)}${sep}${pad(minutes)}${sep}${pad(seconds)}`;
}

export function getHandRotations(time, source = 'youneek') {
  if (source === 'youneek') {
    return {
      hour: time.unitRotation,
      minute: time.minuteRotation,
      second: time.secondRotation,
    };
  }
  // 12-hour and regular: the hour hand walks the 12-hour circle.
  // Minute and second angles match a 0–100 scale (60 civil units span the same circle).
  return {
    hour: time.regularHourRotation,
    minute: time.regularMinuteRotation,
    second: time.regularSecondRotation,
  };
}
