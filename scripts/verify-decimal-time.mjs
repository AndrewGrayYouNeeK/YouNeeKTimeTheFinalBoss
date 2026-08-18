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

const start = new Date(2026, 7, 18, 0, 0, 0, 0);
const z = getDecimalTime(start);
assert(z.display === '00:00:00', `midnight display ${z.display}`);

console.log('decimalTime checks passed');
