export const PULSE = {
  hourOn: 1500,
  hourGap: 650,
  tenthOn: 400,
  tenthGap: 550,
  onesOn: 200,
  onesGap: 320,
  groupGap: 1400,
};

export function buildTimeTellingSteps(units, minutes) {
  const groups = [
    [Math.floor(units / 10), 'hour'],
    [units % 10, 'hour'],
    [Math.floor(minutes / 10), 'tenth'],
    [minutes % 10, 'ones'],
  ];
  const steps = [];
  let started = false;
  for (const [count, kind] of groups) {
    if (count === 0) continue;
    if (started) steps.push({ kind: 'pause', ms: PULSE.groupGap });
    started = true;
    for (let i = 0; i < count; i += 1) {
      steps.push({ kind });
    }
  }
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
