import { getDecimalTime } from '../src/lib/decimalTime.js';
import { getHapticDigits, formatDigital, getHandRotations } from '../src/lib/clockPrefs.js';

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const three = new Date(2026, 7, 18, 15, 30, 0, 0);
const t = getDecimalTime(three);

assert(getHapticDigits(t, 'regular').hours === 3, 'regular hours');
assert(getHapticDigits(t, 'regular').minutes === 30, 'regular mins');
assert(formatDigital(t, 'youneek') === '64•58•33', formatDigital(t, 'youneek'));
assert(formatDigital(t, 'regular') === '03:30:00', formatDigital(t, 'regular'));
assert(formatDigital(t, 'youneek').split('•').length === 3, '100.100.100 fields');

const yn = getHandRotations(t, 'youneek');
assert(Math.abs(yn.hour - t.unitRotation) < 1e-9, 'YouNeeK hour is 100-scale');
assert(Math.abs(yn.minute - t.minuteRotation) < 1e-9, 'YouNeeK minute is 100-scale');

const hands = getHandRotations(t, 'regular');
assert(Math.abs(hands.hour - 105) < 1e-9, `3:30 hour angle ${hands.hour}`);
assert(Math.abs(hands.minute - 180) < 1e-9, `3:30 minute angle ${hands.minute}`);
assert(Math.abs(hands.second) < 1e-9, `3:30 second angle ${hands.second}`);

console.log('clockPrefs checks passed');
