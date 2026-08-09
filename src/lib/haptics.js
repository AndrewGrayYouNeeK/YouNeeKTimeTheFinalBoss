import { haptic } from 'ios-haptics';

function vibrate(pattern) {
  if (typeof navigator.vibrate === 'function') {
    navigator.vibrate(pattern);
    return true;
  }
  return false;
}

/** Light double pulse — YouNeeK minutes / heartbeat */
export function triggerFaint() {
  if (!vibrate([50, 100, 80])) {
    haptic();
    setTimeout(() => haptic(), 200);
  }
}

/** Strong double pulse — YouNeeK hours / digit counts */
export function triggerStrong() {
  if (!vibrate([80, 100, 120])) {
    haptic.confirm();
    setTimeout(() => haptic.confirm(), 200);
  }
}

/** Single tap */
export function triggerSingle() {
  if (!vibrate(50)) {
    haptic();
  }
}

/** Rapid double tap — confirmations / lightning flashes */
export function triggerConfirm() {
  if (!vibrate([50, 70, 50])) {
    haptic.confirm();
  }
}
