import {
  isIOS,
  isVibrationSupported,
  schedulePattern,
  toVibrateSequence,
} from '@haptics/core';

export const HAPTIC_PATTERNS = {
  tickMinute: [{ duration: 35, intensity: 0.4 }],
  tickHour: [{ duration: 70, intensity: 0.95 }],
  tickZero: [
    { duration: 40, intensity: 0.5 },
    { delay: 90, duration: 40, intensity: 0.5 },
  ],
  heartbeat: [{ duration: 28, intensity: 0.35 }],
  timeStart: [
    { duration: 75, intensity: 1 },
    { delay: 160, duration: 75, intensity: 1 },
    { delay: 160, duration: 75, intensity: 1 },
  ],
  timeEnd: [
    { duration: 35, intensity: 0.4 },
    { delay: 130, duration: 35, intensity: 0.4 },
  ],
  single: [{ duration: 45, intensity: 0.65 }],
  confirm: [
    { duration: 45, intensity: 0.65 },
    { delay: 65, duration: 45, intensity: 0.65 },
  ],
};

function firePattern(name) {
  const pattern = HAPTIC_PATTERNS[name];
  if (!pattern) return;
  if (isVibrationSupported()) {
    navigator.vibrate(toVibrateSequence(pattern));
  } else if (isIOS()) {
    schedulePattern(pattern);
  }
}

export function triggerTickMinute() {
  firePattern('tickMinute');
}

export function triggerTickHour() {
  firePattern('tickHour');
}

export function triggerTickZero() {
  firePattern('tickZero');
}

export function triggerHeartbeat() {
  firePattern('heartbeat');
}

export function triggerTimeStart() {
  firePattern('timeStart');
}

export function triggerTimeEnd() {
  firePattern('timeEnd');
}

export function triggerSingle() {
  firePattern('single');
}

export function triggerConfirm() {
  firePattern('confirm');
}
