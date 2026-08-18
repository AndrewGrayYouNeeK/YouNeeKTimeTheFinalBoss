export const PULSE = {
  hourOn: 900,
  hourGap: 380,
  tenthOn: 90,
  tenthGap: 320,
  onesOn: 45,
  onesGap: 70,
  groupGap: 900,
};

export function buildTimeTellingSteps(units, minutes) {
  const hTens = Math.floor(units / 10);
  const hOnes = units % 10;
  const mTens = Math.floor(minutes / 10);
  const mOnes = minutes % 10;

  const steps = [];
  const pushGroup = (count, kind) => {
    for (let i = 0; i < count; i += 1) {
      steps.push({ kind });
    }
    steps.push({ kind: 'pause', ms: PULSE.groupGap });
  };

  pushGroup(hTens, 'hour');
  pushGroup(hOnes, 'hour');
  pushGroup(mTens, 'tenth');
  pushGroup(mOnes, 'ones');
  return steps;
}

export function stepsToVibratePattern(steps) {
  const pattern = [];
  let pendingPause = 0;

  const gapFor = (kind) => {
    if (kind === 'hour') return PULSE.hourGap;
    if (kind === 'tenth') return PULSE.tenthGap;
    return PULSE.onesGap;
  };

  const onFor = (kind) => {
    if (kind === 'hour') return PULSE.hourOn;
    if (kind === 'tenth') return PULSE.tenthOn;
    return PULSE.onesOn;
  };

  for (const step of steps) {
    if (step.kind === 'pause') {
      pendingPause += step.ms;
      continue;
    }
    if (pattern.length === 0) {
      pattern.push(onFor(step.kind));
    } else {
      pattern.push(pendingPause + gapFor(step.kind));
      pattern.push(onFor(step.kind));
      pendingPause = 0;
      continue;
    }
    pendingPause = 0;
  }

  return pattern;
}

export function isQuarterMinute(minutes) {
  return minutes % 15 === 0;
}
