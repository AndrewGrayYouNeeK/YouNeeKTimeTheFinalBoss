import { buildTimeTellingSteps, stepsToVibratePattern, isQuarterMinute } from '../src/lib/hapticPattern.js';

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

assert(isQuarterMinute(0) && isQuarterMinute(15) && isQuarterMinute(90), 'quarters');
assert(!isQuarterMinute(1) && !isQuarterMinute(14), 'non-quarters');

const steps = buildTimeTellingSteps(23, 45);
const kinds = steps.filter((s) => s.kind !== 'pause').map((s) => s.kind);
assert(kinds.filter((k) => k === 'hour').length === 2 + 3, `hours ${kinds}`);
assert(kinds.filter((k) => k === 'tenth').length === 4, 'tens');
assert(kinds.filter((k) => k === 'ones').length === 5, 'ones');

const zero = buildTimeTellingSteps(0, 0).filter((s) => s.kind !== 'pause');
assert(zero.length === 0, 'midnight silent digits');

const pattern = stepsToVibratePattern(buildTimeTellingSteps(1, 15));
assert(pattern.length >= 3 && pattern[0] > 500, `pattern ${pattern}`);

console.log('hapticPattern checks passed');
