import assert from 'node:assert/strict';
import {
  MS_DAY,
  MS_YN_HOUR,
  MS_YN_MINUTE,
  MS_YN_SECOND,
  YN_HOURS_PER_DAY,
  eventToTimeModeArc,
  formatYouNeekTime,
  getYouNeek369Flash,
  getYouNeekHourIndex,
  getYouNeekTimeAngle,
  getYouNeekTimeParts,
  localMidnightMs,
  meetingToArc,
  msSinceLocalMidnight,
  stackBlips,
} from '../src/lib/youneekEpoch.js';

assert.equal(MS_YN_HOUR, 864_000);
assert.equal(MS_YN_MINUTE, 8_640);
assert.equal(MS_YN_SECOND, 86.4);
assert.equal(YN_HOURS_PER_DAY, 100);
assert.equal(MS_YN_HOUR * 100, MS_DAY);
assert.notEqual(MS_YN_HOUR, 8_640_000);

const src = await import('node:fs').then((fs) => fs.readFileSync(new URL('../src/lib/youneekEpoch.js', import.meta.url), 'utf8'));
assert.equal(src.includes('8640000'), false);
assert.equal(src.includes('8_640_000'), false);

const mid = localMidnightMs(Date.parse('2026-09-12T12:00:00'));
assert.equal(formatYouNeekTime(mid), '00:00:00');
assert.equal(getYouNeekHourIndex(mid), 0);

assert.equal(formatYouNeekTime(mid + MS_YN_HOUR), '01:00:00');
assert.equal(getYouNeekTimeAngle(mid), 0);
assert.ok(Math.abs(getYouNeekTimeAngle(mid + MS_YN_HOUR / 4) - 90) < 1e-9);

const last = mid + MS_DAY - 1;
assert.equal(formatYouNeekTime(last), '99:99:99');
assert.equal(formatYouNeekTime(mid + MS_DAY), '00:00:00');

const parts = getYouNeekTimeParts(mid + 47 * MS_YN_HOUR + 83 * MS_YN_MINUTE + 12 * MS_YN_SECOND);
assert.deepEqual(parts, { h: 47, m: 83, s: 12 });
assert.equal(formatYouNeekTime(mid + 47 * MS_YN_HOUR + 83 * MS_YN_MINUTE + 12 * MS_YN_SECOND), '47:83:12');

assert.equal(getYouNeek369Flash(mid), '3.6.9');
assert.equal(getYouNeek369Flash(mid + 100), null);

const hourStart = mid + 10 * MS_YN_HOUR;
const nowInHour = hourStart + 100_000;
assert.equal(eventToTimeModeArc(hourStart - 50_000, hourStart - 10_000, nowInHour), null);
const vis = eventToTimeModeArc(hourStart + 10_000, hourStart + 200_000, nowInHour);
assert.ok(vis);
assert.equal(vis.crossesPhase, false);

const cycleNow = mid + 1_000_000;
assert.equal(meetingToArc(mid - 2_000_000, mid - 1_000_000, cycleNow), null);

const stacked = stackBlips([
  { angle: 10, id: 'a' },
  { angle: 10.5, id: 'b' },
]);
assert.equal(stacked[1].stackOffset, 8);

assert.equal(msSinceLocalMidnight(mid), 0);
console.log('youneek-epoch ok');
