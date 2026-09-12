export const CLOCK_SOURCES = [
  { id: 'youneek', label: 'YouNeeK Time 100:100:100' },
  { id: 'decimal', label: 'Decimal Time 10:100:100' },
  { id: 'regular', label: 'Regular Time' },
];

export const WATCH_DISPLAYS = [
  { id: 'face', label: 'Clock Face' },
  { id: 'decimal', label: 'Decimal Clock' },
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
  if (id === 'youneek12' || id === 'army') return 'youneek';
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
  return CLOCK_SOURCES.find((s) => s.id === id)?.label || 'YouNeeK Time 100:100:100';
}

export function handStyleLabel(id) {
  return HAND_STYLES.find((s) => s.id === id)?.label || 'Needle';
}

function pad(value) {
  return String(value).padStart(2, '0');
}

export function getHapticDigits(time, source = 'youneek') {
  if (source === 'regular') {
    return { hours: time.hours12, minutes: time.regularMinutes ?? 0, seconds: time.regularSeconds ?? 0 };
  }
  if (source === 'decimal') {
    return { hours: time.decimalHours, minutes: time.decimalMinutes, seconds: time.decimalSeconds };
  }
  return { hours: time.units, minutes: time.minutes, seconds: time.seconds };
}

export function formatDigital(time, source = 'youneek') {
  const { hours, minutes } = getHapticDigits(time, source);
  return `${pad(hours)}•${pad(minutes)}`;
}

export function formatFull(time, source = 'youneek') {
  const { hours, minutes, seconds } = getHapticDigits(time, source);
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

export function getHandRotations(time, source = 'youneek') {
  if (source === 'regular') {
    return {
      hour: time.regularHourRotation,
      minute: time.regularMinuteRotation,
      second: time.regularSecondRotation,
    };
  }
  if (source === 'decimal') {
    return {
      hour: time.decimalHourRotation,
      minute: time.decimalMinuteRotation,
      second: time.decimalSecondRotation,
    };
  }
  return {
    hour: time.unitRotation,
    minute: time.minuteRotation,
    second: time.secondRotation,
  };
}
