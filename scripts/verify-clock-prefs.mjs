import { getDecimalTime } from '../src/lib/decimalTime.js';
import { getHapticDigits, formatDigital } from '../src/lib/clockPrefs.js';

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

console.log('clockPrefs checks passed');
