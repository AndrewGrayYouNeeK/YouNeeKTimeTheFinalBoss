import {
  isIOS,
  isVibrationSupported,
  schedulePattern,
  toVibrateSequence,
} from '@haptics/core';

export const HAPTIC_PATTERNS = {
  tickMinute: [{ duration: 40, intensity: 0.45 }],
  tickHour: [{ duration: 80, intensity: 0.95 }],
  tickSecond: [{ duration: 30, intensity: 0.35 }],
  tickZero: [
    { duration: 45, intensity: 0.5 },
    { delay: 220, duration: 45, intensity: 0.5 },
  ],
  heartbeat: [{ duration: 30, intensity: 0.35 }],
  timeStart: [
    { duration: 80, intensity: 1 },
    { delay: 400, duration: 80, intensity: 1 },
    { delay: 400, duration: 80, intensity: 1 },
  ],
  timeEnd: [
    { duration: 40, intensity: 0.4 },
    { delay: 280, duration: 40, intensity: 0.4 },
  ],
  handGreen: [{ duration: 100, intensity: 0.9 }],
  handRed: [
    { duration: 55, intensity: 0.65 },
    { delay: 280, duration: 55, intensity: 0.65 },
  ],
  handYellow: [
    { duration: 38, intensity: 0.45 },
    { delay: 220, duration: 38, intensity: 0.45 },
    { delay: 220, duration: 38, intensity: 0.45 },
  ],
  single: [{ duration: 45, intensity: 0.65 }],
  confirm: [
    { duration: 45, intensity: 0.65 },
    { delay: 100, duration: 45, intensity: 0.65 },
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

export function triggerTickSecond() {
  firePattern('tickSecond');
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

export function triggerHandGreen() {
  firePattern('handGreen');
}

export function triggerHandRed() {
  firePattern('handRed');
}

export function triggerHandYellow() {
  firePattern('handYellow');
}

export function triggerSingle() {
  firePattern('single');
}

export function triggerConfirm() {
  firePattern('confirm');
}
