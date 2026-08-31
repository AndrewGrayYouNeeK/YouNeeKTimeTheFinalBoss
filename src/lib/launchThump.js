let fired = false;

export function resetLaunchThump() {
  fired = false;
}

export function maybeLaunchThump(launch) {
  if (launch < 0.12) {
    fired = false;
    return;
  }
  if (fired || launch < 0.18) return;
  fired = true;

  try {
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      navigator.vibrate([10, 30, 14]);
    }
  } catch {
    /* ignore */
  }

  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 72;
    gain.gain.value = 0.0001;
    osc.connect(gain);
    gain.connect(ctx.destination);
    const t = ctx.currentTime;
    gain.gain.exponentialRampToValueAtTime(0.045, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
    osc.start(t);
    osc.stop(t + 0.1);
    window.setTimeout(() => ctx.close().catch(() => {}), 200);
  } catch {
    /* ignore */
  }
}
