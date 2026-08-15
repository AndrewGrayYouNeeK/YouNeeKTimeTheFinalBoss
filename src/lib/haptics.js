import {
  isIOS,
  isVibrationSupported,
  schedulePattern,
  toVibrateSequence,
} from '@haptics/core';

export const HAPTIC_PATTERNS = {
  faint: [
    { duration: 50, intensity: 0.5 },
    { delay: 100, duration: 80, intensity: 0.5 },
  ],
  strong: [
    { duration: 80, intensity: 1 },
    { delay: 100, duration: 120, intensity: 0.8 },
  ],
  single: [{ duration: 50, intensity: 0.7 }],
  confirm: [
    { duration: 50, intensity: 0.7 },
    { delay: 70, duration: 50, intensity: 0.7 },
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

export function triggerFaint() {
  firePattern('faint');
}

export function triggerStrong() {
  firePattern('strong');
}

export function triggerSingle() {
  firePattern('single');
}

export function triggerConfirm() {
  firePattern('confirm');
}
