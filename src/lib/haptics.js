import { hapticTrigger as iosHapticTrigger } from 'ios-haptics';

/** Attach iOS switch overlay once per element (safe for React ref callbacks). */
export function hapticTrigger(element) {
  if (!element || element.querySelector('input[switch]')) return;
  iosHapticTrigger(element);
}

function isAndroid() {
  return typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent);
}

function isIOS() {
  if (typeof navigator === 'undefined') return false;
  return (
    /iPhone|iPad|iPod/i.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  );
}

function supportsTouchHaptics() {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(pointer: coarse)').matches
  );
}

/** Persistent hidden iOS switch used for programmatic pulses. */
let iosHapticNode = null;

function ensureIosHapticNode() {
  if (iosHapticNode) return iosHapticNode;

  const label = document.createElement('label');
  label.setAttribute('aria-hidden', 'true');
  label.style.cssText = 'position:fixed;top:0;left:0;width:1px;height:1px;overflow:hidden;opacity:0;';

  const input = document.createElement('input');
  input.type = 'checkbox';
  input.setAttribute('switch', '');
  input.tabIndex = -1;
  Object.assign(input.style, {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '1px',
    height: '1px',
    margin: '0',
    opacity: '0',
    clipPath: 'inset(0 round 999px)',
    touchAction: 'manipulation',
  });
  input.style.setProperty('-webkit-tap-highlight-color', 'transparent');

  label.appendChild(input);
  document.body.appendChild(label);
  iosHapticNode = { label, input };
  return iosHapticNode;
}

/** iOS Safari checkbox-switch trick (works on iOS 17.4–26.4). */
export function iosSwitchTap() {
  if (!isIOS() || !supportsTouchHaptics()) return;
  try {
    const { label } = ensureIosHapticNode();
    label.click();
  } catch {
    // Haptics are optional — never break the app
  }
}

function androidVibrate(pattern) {
  if (isAndroid() && typeof navigator.vibrate === 'function') {
    navigator.vibrate(pattern);
    return true;
  }
  return false;
}

/** Light double pulse — YouNeeK minutes / heartbeat */
export function triggerFaint() {
  if (!androidVibrate([50, 100, 80])) {
    iosSwitchTap();
    setTimeout(iosSwitchTap, 200);
  }
}

/** Strong double pulse — YouNeeK hours / digit counts */
export function triggerStrong() {
  if (!androidVibrate([80, 100, 120])) {
    iosSwitchTap();
    setTimeout(iosSwitchTap, 120);
    setTimeout(iosSwitchTap, 240);
  }
}

/** Single tap */
export function triggerSingle() {
  if (!androidVibrate(50)) iosSwitchTap();
}

/** Rapid double tap — lightning flashes */
export function triggerConfirm() {
  if (!androidVibrate([50, 70, 50])) {
    iosSwitchTap();
    setTimeout(iosSwitchTap, 120);
  }
}
