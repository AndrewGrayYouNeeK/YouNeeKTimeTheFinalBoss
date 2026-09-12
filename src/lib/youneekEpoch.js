export const MS_DAY = 86_400_000;
export const YN_HOURS_PER_DAY = 100;
export const YN_MINS_PER_HOUR = 100;
export const YN_SECS_PER_MIN = 100;
export const MS_YN_SECOND = 86.4;
export const MS_YN_MINUTE = 8_640;
export const MS_YN_HOUR = 864_000;
export const MS_369_CYCLE = 14_400_000;
export const MS_PHASE = 4_800_000;
export const TRAIL_DEG = 18;
export const STACK_PX = 8;
export const STACK_DEG = 2;
export const FLASH_WINDOW_MS = 50;

export function posMod(n, m) {
  return ((n % m) + m) % m;
}

export function localMidnightMs(now = Date.now()) {
  const d = new Date(now);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export function msSinceLocalMidnight(now = Date.now()) {
  return posMod(now - localMidnightMs(now), MS_DAY);
}

export function getYouNeekTimeParts(now = Date.now()) {
  const ms = msSinceLocalMidnight(now);
  const totalYNSeconds = Math.floor(ms / MS_YN_SECOND);
  const h = Math.floor(totalYNSeconds / (YN_MINS_PER_HOUR * YN_SECS_PER_MIN)) % YN_HOURS_PER_DAY;
  const m = Math.floor(totalYNSeconds / YN_SECS_PER_MIN) % YN_MINS_PER_HOUR;
  const s = totalYNSeconds % YN_SECS_PER_MIN;
  return { h, m, s };
}

export function formatYouNeekTime(now = Date.now()) {
  const { h, m, s } = getYouNeekTimeParts(now);
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

export function getYouNeekTimeAngle(now = Date.now()) {
  return (posMod(msSinceLocalMidnight(now), MS_YN_HOUR) / MS_YN_HOUR) * 360;
}

export function getYouNeekHourIndex(now = Date.now()) {
  return Math.floor(msSinceLocalMidnight(now) / MS_YN_HOUR);
}

export function getYouNeek369Angle(now = Date.now()) {
  return (posMod(msSinceLocalMidnight(now), MS_369_CYCLE) / MS_369_CYCLE) * 360;
}

export function getYouNeek369Phase(now = Date.now()) {
  const ms = posMod(msSinceLocalMidnight(now), MS_369_CYCLE);
  if (ms < MS_PHASE) return { id: 0, name: 'creation' };
  if (ms < MS_PHASE * 2) return { id: 1, name: 'harmony' };
  return { id: 2, name: 'completion' };
}

export function getYouNeek369Flash(now = Date.now()) {
  const sinceMidnight = msSinceLocalMidnight(now);
  const ms = posMod(sinceMidnight, MS_369_CYCLE);
  if (sinceMidnight < FLASH_WINDOW_MS) return '3.6.9';
  if (Math.abs(ms - MS_PHASE) < FLASH_WINDOW_MS) return '3';
  if (Math.abs(ms - MS_PHASE * 2) < FLASH_WINDOW_MS) return '6';
  if (ms + FLASH_WINDOW_MS >= MS_369_CYCLE) return '9';
  return null;
}

export function meetingToArc(startMs, endMs, now = Date.now()) {
  if (endMs <= startMs) return null;
  const midnight = localMidnightMs(now);
  const nowOff = posMod(now - midnight, MS_DAY);
  const cycleStart = midnight + Math.floor(nowOff / MS_369_CYCLE) * MS_369_CYCLE;
  const cycleEnd = cycleStart + MS_369_CYCLE;
  const visStart = Math.max(startMs, cycleStart);
  const visEnd = Math.min(endMs, cycleEnd);
  if (visEnd <= visStart) return null;
  const startCycleMs = visStart - cycleStart;
  const endCycleMs = visEnd - cycleStart;
  const startAngle = (startCycleMs / MS_369_CYCLE) * 360;
  const endAngle = (endCycleMs / MS_369_CYCLE) * 360;
  const wraps = endAngle < startAngle;
  const startPhase = Math.floor(startCycleMs / MS_PHASE);
  const endPhase = Math.max(0, Math.floor((endCycleMs - 1) / MS_PHASE));
  return {
    startAngle,
    endAngle,
    wraps,
    crossesPhase: wraps || startPhase !== endPhase,
    startPhase,
    endPhase,
  };
}

export function eventToTimeModeArc(startMs, endMs, now = Date.now()) {
  if (endMs <= startMs) return null;
  const midnight = localMidnightMs(now);
  const nowOff = posMod(now - midnight, MS_DAY);
  const hourStart = midnight + Math.floor(nowOff / MS_YN_HOUR) * MS_YN_HOUR;
  const hourEnd = hourStart + MS_YN_HOUR;
  const visStart = Math.max(startMs, hourStart);
  const visEnd = Math.min(endMs, hourEnd);
  if (visEnd <= visStart) return null;
  const startA = ((visStart - hourStart) / MS_YN_HOUR) * 360;
  const endA = ((visEnd - hourStart) / MS_YN_HOUR) * 360;
  return { startAngle: startA, endAngle: endA, wraps: endA < startA, crossesPhase: false };
}

export function getPersistenceOpacity(targetAngle, beamAngle, trailDeg = TRAIL_DEG) {
  const lag = posMod(beamAngle - targetAngle, 360);
  if (lag > trailDeg) return 0;
  return 1 - lag / trailDeg;
}

export function stackBlips(blips) {
  const sorted = [...blips].sort((a, b) => a.angle - b.angle);
  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1];
    const cur = sorted[i];
    if (Math.abs(cur.angle - prev.angle) < STACK_DEG) {
      cur.stackOffset = (prev.stackOffset || 0) + STACK_PX;
    } else {
      cur.stackOffset = 0;
    }
  }
  return sorted;
}
