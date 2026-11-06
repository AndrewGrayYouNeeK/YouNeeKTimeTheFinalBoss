import { useCallback, useEffect, useRef, useState } from 'react';

const HOUR_MS = 86400000 / 100; // one YouNeeK hour
const STORAGE_KEY = 'ynt:lastEruptionHour';
const NOTIF_ASKED_KEY = 'ynt:eruptNotifAsked';
const ERUPT_MS = 9000;

function dayKey(d = new Date()) {
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

export function getYouNeekHour(now = new Date()) {
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  const elapsed = (((now.getTime() - start.getTime()) % 86400000) + 86400000) % 86400000;
  return Math.floor(elapsed / HOUR_MS);
}

function msUntilNextYouNeekHour(now = new Date()) {
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  const elapsed = (((now.getTime() - start.getTime()) % 86400000) + 86400000) % 86400000;
  const into = elapsed % HOUR_MS;
  return Math.max(50, HOUR_MS - into);
}

function hourStamp(now = new Date()) {
  return `${dayKey(now)}:${getYouNeekHour(now)}`;
}

function maybeNotify(hour) {
  if (typeof window === 'undefined' || !('Notification' in window)) return;
  if (Notification.permission !== 'granted') return;
  try {
    const n = new Notification('YouNeeK volcano erupted', {
      body: `Hour ${String(hour).padStart(2, '0')} — ashes across the sky.`,
      icon: '/favicon.svg',
      tag: 'ynt-eruption',
      silent: false,
    });
    window.setTimeout(() => n.close(), 6000);
  } catch {
    /* ignore */
  }
}

function politelyAskNotification() {
  if (typeof window === 'undefined' || !('Notification' in window)) return;
  if (Notification.permission !== 'default') return;
  if (localStorage.getItem(NOTIF_ASKED_KEY) === '1') return;
  localStorage.setItem(NOTIF_ASKED_KEY, '1');
  // Delay so we don't nag on first paint; one soft prompt only.
  window.setTimeout(() => {
    try {
      Notification.requestPermission().catch(() => {});
    } catch {
      /* ignore */
    }
  }, 8000);
}

/**
 * Fires a full-viewport ash eruption on each YouNeeK hour rollover.
 * Persists last hour so a backgrounded tab still catches up on return.
 */
export default function useYouNeekHourEruption() {
  const [erupting, setErupting] = useState(false);
  const timerRef = useRef(0);
  const clearRef = useRef(0);
  const eruptingRef = useRef(false);

  const erupt = useCallback((hour, { notify = true } = {}) => {
    const stamp = `${dayKey()}:${hour}`;
    const last = localStorage.getItem(STORAGE_KEY);
    if (last === stamp && eruptingRef.current) return;
    localStorage.setItem(STORAGE_KEY, stamp);
    eruptingRef.current = true;
    setErupting(true);
    if (notify) maybeNotify(hour);
    window.clearTimeout(clearRef.current);
    clearRef.current = window.setTimeout(() => {
      eruptingRef.current = false;
      setErupting(false);
    }, ERUPT_MS);
  }, []);

  const checkMissed = useCallback(() => {
    const now = new Date();
    const stamp = hourStamp(now);
    const last = localStorage.getItem(STORAGE_KEY);
    if (!last) {
      // First visit this browser: seed current hour without erupting.
      localStorage.setItem(STORAGE_KEY, stamp);
      return;
    }
    if (last !== stamp) {
      erupt(getYouNeekHour(now), { notify: document.visibilityState !== 'visible' });
    }
  }, [erupt]);

  const scheduleNext = useCallback(() => {
    window.clearTimeout(timerRef.current);
    const wait = msUntilNextYouNeekHour();
    timerRef.current = window.setTimeout(() => {
      const hour = getYouNeekHour();
      erupt(hour, { notify: true });
      scheduleNext();
    }, wait + 30);
  }, [erupt]);

  useEffect(() => {
    politelyAskNotification();
    checkMissed();
    scheduleNext();

    const onVis = () => {
      if (document.visibilityState === 'visible') {
        checkMissed();
        scheduleNext();
      }
    };
    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('focus', onVis);

    return () => {
      window.clearTimeout(timerRef.current);
      window.clearTimeout(clearRef.current);
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('focus', onVis);
    };
  }, [checkMissed, scheduleNext]);

  useEffect(() => {
    window.__yntForceErupt = () => erupt(getYouNeekHour(), { notify: false });
    window.__yntYouNeekHour = () => getYouNeekHour();
    return () => {
      delete window.__yntForceErupt;
      delete window.__yntYouNeekHour;
    };
  }, [erupt]);

  return { erupting, forceErupt: () => erupt(getYouNeekHour(), { notify: false }) };
}
