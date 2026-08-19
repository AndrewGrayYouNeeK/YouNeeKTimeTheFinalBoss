import { hapticTrigger as iosHapticTrigger } from 'ios-haptics';
import { PULSE } from '@/lib/hapticPattern';

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

function canVibrate() {
  return typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function';
}

let iosHapticNode = null;
let audioCtx = null;

function ensureIosHapticNode() {
  if (iosHapticNode?.input?.isConnected) return iosHapticNode;

  const label = document.createElement('label');
  label.setAttribute('aria-hidden', 'true');
  label.htmlFor = 'younEEK-ios-haptic';
  label.style.cssText = 'position:fixed;top:0;left:0;width:1px;height:1px;overflow:hidden;opacity:0;pointer-events:none;';

  const input = document.createElement('input');
  input.id = 'younEEK-ios-haptic';
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
  });

  label.appendChild(input);
  document.body.appendChild(label);
  iosHapticNode = { label, input };
  return iosHapticNode;
}

function iosSwitchTap() {
  if (!isIOS()) return;
  try {
    const { label, input } = ensureIosHapticNode();
    input.checked = !input.checked;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    label.click();
    input.click();
  } catch {
    // Haptics are optional
  }
}

function getAudioCtx() {
  if (audioCtx) return audioCtx;
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return null;
  audioCtx = new Ctx();
  return audioCtx;
}

/** Must run inside a tap so iOS Safari unlocks audio + switch haptics. */
export function unlockHaptics() {
  ensureIosHapticNode();
  iosSwitchTap();
  const ctx = getAudioCtx();
  if (ctx?.state === 'suspended') ctx.resume();
}

function rumble(ms) {
  if (!isIOS()) return;
  const ctx = getAudioCtx();
  if (!ctx || ctx.state === 'suspended') return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'square';
  osc.frequency.value = 72;
  gain.gain.value = 0.12;
  osc.connect(gain);
  gain.connect(ctx.destination);
  const now = ctx.currentTime;
  osc.start(now);
  gain.gain.setValueAtTime(0.12, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + ms / 1000);
  osc.stop(now + ms / 1000 + 0.02);
}

function vibrateOr(pattern) {
  if (canVibrate() && (isAndroid() || !isIOS())) {
    try {
      navigator.vibrate(pattern);
      return true;
    } catch {
      return false;
    }
  }
  return false;
}

function iosLongBuzz(ms) {
  const taps = Math.max(1, Math.round(ms / 45));
  rumble(ms);
  for (let i = 0; i < taps; i += 1) {
    setTimeout(iosSwitchTap, i * 45);
  }
}

export function triggerHourLong() {
  if (!vibrateOr(PULSE.hourOn)) iosLongBuzz(PULSE.hourOn);
}

export function triggerTenth() {
  if (!vibrateOr(PULSE.tenthOn)) {
    rumble(PULSE.tenthOn);
    iosSwitchTap();
  }
}

export function triggerOnes() {
  if (!vibrateOr(PULSE.onesOn)) {
    rumble(PULSE.onesOn);
    iosSwitchTap();
  }
}

export function triggerFaint() {
  if (!vibrateOr([50, 100, 80])) {
    rumble(50);
    iosSwitchTap();
    setTimeout(iosSwitchTap, 200);
  }
}

export function triggerStrong() {
  if (!vibrateOr([80, 100, 120])) {
    rumble(120);
    iosSwitchTap();
    setTimeout(iosSwitchTap, 120);
    setTimeout(iosSwitchTap, 240);
  }
}

export function triggerSingle() {
  if (!vibrateOr(50)) {
    rumble(50);
    iosSwitchTap();
  }
}

export function triggerConfirm() {
  if (!vibrateOr([50, 70, 50])) {
    rumble(50);
    iosSwitchTap();
    setTimeout(iosSwitchTap, 120);
  }
}

export function playVibratePattern(pattern) {
  if (!pattern?.length) return false;
  if (canVibrate() && (isAndroid() || !isIOS())) {
    try {
      navigator.vibrate(pattern);
      return true;
    } catch {
      return false;
    }
  }
  return false;
}

export function stopHaptics() {
  if (canVibrate()) {
    try { navigator.vibrate(0); } catch { /* ignore */ }
  }
}

export { isIOS };
