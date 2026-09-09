import { getDecimalTime } from '../src/lib/decimalTime.js';
import { getHapticDigits, formatDigital, getHandRotations } from '../src/lib/clockPrefs.js';

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const three = new Date(2026, 7, 18, 15, 30, 0, 0);
const t = getDecimalTime(three);

assert(getHapticDigits(t, 'regular').hours === 3, 'regular hours');
assert(getHapticDigits(t, 'regular').minutes === 30, 'regular mins');
assert(getHapticDigits(t, 'army').hours === 15, 'army hours');
assert(formatDigital(t, 'youneek').includes('•'), formatDigital(t, 'youneek'));
assert(formatDigital(t, 'regular') === '03:30', formatDigital(t, 'regular'));

const hands = getHandRotations(t, 'youneek');
assert(Math.abs(hands.hour - t.regularHourRotation) < 1e-9, 'hands follow civil hour');
assert(Math.abs(hands.minute - t.regularMinuteRotation) < 1e-9, 'hands follow civil minute');
assert(Math.abs(hands.second - t.regularSecondRotation) < 1e-9, 'hands follow civil second');
assert(Math.abs(hands.hour - 105) < 1e-9, `3:30 hour angle ${hands.hour}`);
assert(Math.abs(hands.minute - 180) < 1e-9, `3:30 minute angle ${hands.minute}`);
assert(Math.abs(hands.second) < 1e-9, `3:30 second angle ${hands.second}`);

console.log('clockPrefs checks passed');
