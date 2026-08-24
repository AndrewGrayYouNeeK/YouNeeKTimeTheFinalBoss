import { hapticTrigger as iosHapticTrigger } from 'ios-haptics';
import { PULSE } from '@/lib/hapticPattern';

export function hapticTrigger(element) {
  if (!element || element.querySelector('input[switch]')) return;
  iosHapticTrigger(element);
}

export function isIOS() {
  if (typeof navigator === 'undefined') return false;
  return (
    /iPhone|iPad|iPod/i.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  );
}

function isAndroid() {
  return typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent);
}

function canVibrate() {
  return (
    !isIOS() &&
    typeof navigator !== 'undefined' &&
    typeof navigator.vibrate === 'function'
  );
}

function onMs(kind) {
  if (kind === 'hour') return PULSE.hourOn;
  if (kind === 'tenth') return PULSE.tenthOn;
  return PULSE.onesOn;
}

function gapMs(kind) {
  if (kind === 'hour') return PULSE.hourGap;
  if (kind === 'tenth') return PULSE.tenthGap;
  return PULSE.onesGap;
}

let iosHapticNode = null;
let pulseGen = 0;

function ensureIosHapticNode() {
  if (iosHapticNode) return iosHapticNode;
  if (typeof document === 'undefined') return null;

  const label = document.createElement('label');
  label.setAttribute('aria-hidden', 'true');
  label.style.cssText = 'position:fixed;left:0;bottom:0;width:44px;height:44px;overflow:hidden;opacity:0.01;pointer-events:none;z-index:-1;';

  const input = document.createElement('input');
  input.type = 'checkbox';
  input.setAttribute('switch', '');
  input.tabIndex = -1;
  Object.assign(input.style, {
    position: 'absolute',
    inset: '0',
    width: '44px',
    height: '44px',
    margin: '0',
    opacity: '0.01',
  });

  label.appendChild(input);
  document.body.appendChild(label);
  iosHapticNode = { label, input };
  return iosHapticNode;
}

function iosSwitchTap() {
  if (!isIOS()) return;
  try {
    const node = ensureIosHapticNode();
    if (!node) return;
    node.input.checked = !node.input.checked;
    node.label.click();
  } catch {
    /* ignore */
  }
}

export function unlockHaptics() {
  if (isIOS()) ensureIosHapticNode();
  if (canVibrate()) {
    try { navigator.vibrate(1); } catch { /* ignore */ }
  }
}

function playIosSteps(steps) {
  const gen = pulseGen;
  let delay = 0;

  const tap = (at) => {
    const run = () => {
      if (gen !== pulseGen) return;
      iosSwitchTap();
    };
    if (at <= 0) run();
    else window.setTimeout(run, at);
  };

  for (const step of steps) {
    if (step.kind === 'pause') {
      delay += step.ms;
      continue;
    }
    const on = onMs(step.kind);
    if (step.kind === 'hour') {
      const n = Math.max(6, Math.round(on / 80));
      for (let i = 0; i < n; i += 1) tap(delay + i * 80);
    } else if (step.kind === 'tenth') {
      tap(delay);
      tap(delay + 70);
    } else {
      tap(delay);
    }
    delay += on + gapMs(step.kind);
  }

  return delay;
}

export function playHapticSteps(steps, vibratePattern) {
  unlockHaptics();
  pulseGen += 1;
  const list = steps?.length ? steps : [{ kind: 'ones' }];

  if (canVibrate()) {
    const pattern = vibratePattern?.length ? vibratePattern : [40];
    try {
      navigator.vibrate(0);
      navigator.vibrate(pattern);
    } catch { /* ignore */ }
    return pattern.reduce((a, b) => a + b, 0);
  }

  if (isIOS()) return playIosSteps(list);
  return 0;
}

export function triggerFaint() {
  playHapticSteps([{ kind: 'tenth' }], [50, 100, 80]);
}

export function triggerStrong() {
  playHapticSteps([{ kind: 'hour' }], [80, 100, 120]);
}

export function triggerSingle() {
  playHapticSteps([{ kind: 'ones' }], [50]);
}

export function triggerConfirm() {
  playHapticSteps([{ kind: 'tenth' }, { kind: 'tenth' }], [50, 70, 50]);
}

export function stopHaptics() {
  pulseGen += 1;
  if (canVibrate()) {
    try { navigator.vibrate(0); } catch { /* ignore */ }
  }
}

export function bindIosHapticButton(element, onActivate) {
  if (!element || !isIOS()) return;
  hapticTrigger(element);
  const sw = element.querySelector('input[switch]');
  if (!sw || sw.dataset.hapticBound === '1') return;
  sw.dataset.hapticBound = '1';
  sw.addEventListener('click', (event) => {
    event.stopPropagation();
    onActivate();
  });
}
