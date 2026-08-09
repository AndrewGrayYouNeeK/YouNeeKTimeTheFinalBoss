let wakeLock = null;

export async function requestWakeLock() {
  if (!('wakeLock' in navigator)) return false;
  try {
    wakeLock = await navigator.wakeLock.request('screen');
    wakeLock.addEventListener('release', () => {
      wakeLock = null;
    });
    return true;
  } catch {
    return false;
  }
}

export async function releaseWakeLock() {
  if (wakeLock) {
    try {
      await wakeLock.release();
    } catch {
      // ignore
    }
    wakeLock = null;
  }
}

export function isWakeLockActive() {
  return wakeLock !== null;
}
