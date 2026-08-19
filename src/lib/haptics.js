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

function canVibrate() {
  return typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function';
}

let audioCtx = null;
let buzzGen = 0;

function getAudioCtx() {
  if (audioCtx) return audioCtx;
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return null;
  audioCtx = new Ctx();
  return audioCtx;
}

export function unlockHaptics() {
  const ctx = getAudioCtx();
  if (ctx?.state === 'suspended') {
    ctx.resume().catch(() => {});
  }
  if (canVibrate()) {
    try { navigator.vibrate(10); } catch { /* ignore */ }
  }
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

function buzzAt(ctx, start, dur, freq, gainValue) {
  const osc = ctx.createOscillator();
  const filter = ctx.createBiquadFilter();
  const g = ctx.createGain();
  osc.type = 'square';
  osc.frequency.value = freq;
  filter.type = 'lowpass';
  filter.frequency.value = 180;
  g.gain.setValueAtTime(0.0001, start);
  g.gain.exponentialRampToValueAtTime(gainValue, start + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, start + Math.max(0.02, dur - 0.01));
  osc.connect(filter);
  filter.connect(g);
  g.connect(ctx.destination);
  osc.start(start);
  osc.stop(start + dur + 0.03);
}

function scheduleAudioBuzzes(steps) {
  const ctx = getAudioCtx();
  if (!ctx) return 0;
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  const gen = buzzGen;
  let t = ctx.currentTime + 0.03;
  for (const step of steps) {
    if (gen !== buzzGen) break;
    if (step.kind === 'pause') {
      t += step.ms / 1000;
      continue;
    }
    const dur = onMs(step.kind) / 1000;
    const freq = step.kind === 'hour' ? 52 : step.kind === 'tenth' ? 88 : 120;
    const gain = step.kind === 'hour' ? 0.45 : 0.32;
    buzzAt(ctx, t, dur, freq, gain);
    t += dur + gapMs(step.kind) / 1000;
  }
  return Math.max(0, (t - ctx.currentTime) * 1000);
}

export function playHapticSteps(steps, vibratePattern) {
  unlockHaptics();
  let vibrated = false;
  if (vibratePattern?.length && canVibrate()) {
    try {
      vibrated = navigator.vibrate(vibratePattern) !== false;
    } catch {
      vibrated = false;
    }
  }
  const audioMs = scheduleAudioBuzzes(steps);
  const vibeMs = vibratePattern?.length ? vibratePattern.reduce((a, b) => a + b, 0) : 0;
  return Math.max(audioMs, vibeMs);
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
  buzzGen += 1;
  if (canVibrate()) {
    try { navigator.vibrate(0); } catch { /* ignore */ }
  }
  if (audioCtx) {
    const ctx = audioCtx;
    audioCtx = null;
    ctx.close().catch(() => {});
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
