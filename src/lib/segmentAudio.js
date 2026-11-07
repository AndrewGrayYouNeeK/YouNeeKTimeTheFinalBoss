// Soft segment/tick audio for the Reflect and Move render modes.
//
// Strictly opt-in: the AudioContext is only created (or resumed) inside a user
// gesture from the Sound toggle. Missed ticks are never replayed as a backlog —
// callers pass the live transition and stay silent when segments were skipped
// (e.g. a throttled background tab). Mobile OSes may still suspend or silence
// audio in background tabs; nothing here promises otherwise.

const STORAGE_KEY = 'modeSoundPrefs';
const MIN_GAIN = 0;
const MAX_GAIN = 1;

function clampGain(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0.5;
  return Math.min(MAX_GAIN, Math.max(MIN_GAIN, n));
}

let prefs = { enabled: false, gain: 0.5 };
try {
  const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
  if (raw) {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.enabled === 'boolean') {
      prefs = { enabled: parsed.enabled, gain: clampGain(parsed.gain) };
    }
  }
} catch {
  prefs = { enabled: false, gain: 0.5 };
}

let ctx = null;
let master = null;

export function getSoundPrefs() {
  return prefs;
}

export function setSoundPrefs(next) {
  prefs = { enabled: !!next.enabled, gain: clampGain(next.gain) };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // Preference not persisted; session-only fallback.
  }
}

// Must be called from a user gesture (the Sound button click).
export function ensureAudio() {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  if (!ctx) {
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 1;
    master.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

export function disposeAudio() {
  if (ctx) {
    ctx.close();
    ctx = null;
    master = null;
  }
}

export function isAudioActive() {
  return !!ctx && ctx.state === 'running';
}

function blip({ freq, gain, duration }) {
  if (!prefs.enabled || !ctx || ctx.state !== 'running' || !(gain > 0)) return;
  const osc = ctx.createOscillator();
  const env = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.value = freq;
  env.gain.setValueAtTime(gain, ctx.currentTime);
  env.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
  osc.connect(env);
  env.connect(master);
  osc.start();
  osc.stop(ctx.currentTime + duration + 0.02);
  osc.onended = () => {
    osc.disconnect();
    env.disconnect();
  };
}

// Reflect mode: one soft click per Hilbert segment advance.
export function playSegmentClick(gain) {
  blip({ freq: 540, gain: gain * 0.12, duration: 0.09 });
}

// Move mode: soft tick per decimal second; pitch rises slowly with day
// progress but stays in a bounded, comfortable band (180-440 Hz) at low gain.
export function playSpiralTick(dayProgress, gain) {
  const freq = 180 + 260 * Math.min(1, Math.max(0, dayProgress));
  blip({ freq, gain: gain * 0.07, duration: 0.06 });
}
