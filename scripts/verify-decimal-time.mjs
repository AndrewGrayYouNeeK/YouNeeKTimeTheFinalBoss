import { getDecimalTime } from '../src/lib/decimalTime.js';

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const noon = new Date(2026, 7, 18, 12, 0, 0, 0);
const t = getDecimalTime(noon);
assert(t.units === 50, `noon units expected 50, got ${t.units}`);
assert(t.minutes === 0, `noon minutes expected 0, got ${t.minutes}`);
assert(Math.abs(t.progress - 0.5) < 1e-9, `noon progress ${t.progress}`);
assert(Math.abs(t.unitRotation - 180) < 1e-6, `noon unitRotation ${t.unitRotation}`);
assert(Math.abs(t.armyHourRotation - 180) < 1e-6, `noon armyHourRotation ${t.armyHourRotation}`);
assert(Math.abs(t.regularHourRotation) < 1e-6, `noon regularHourRotation ${t.regularHourRotation}`);
assert(Math.abs(t.regularMinuteRotation) < 1e-6, `noon regularMinuteRotation ${t.regularMinuteRotation}`);

const three = new Date(2026, 7, 18, 15, 0, 0, 0);
const t3 = getDecimalTime(three);
assert(Math.abs(t3.regularHourRotation - 90) < 1e-6, `15:00 regularHour ${t3.regularHourRotation}`);
assert(Math.abs(t3.unitRotation - 225) < 1e-6, `15:00 unitRotation ${t3.unitRotation}`);
assert(Math.abs(t3.armyMinuteRotation) < 1e-6, `15:00 armyMinute ${t3.armyMinuteRotation}`);

const start = new Date(2026, 7, 18, 0, 0, 0, 0);
const z = getDecimalTime(start);
assert(z.display === '00:00:00', `midnight display ${z.display}`);

console.log('decimalTime checks passed');
