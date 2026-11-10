import assert from 'node:assert/strict';
import { test } from 'node:test';
import { dialFace, getHandRotations } from '../src/lib/clockPrefs.js';

test('12-hour mode keeps 12 hour marks plus a 0-100 scale', () => {
  assert.equal(dialFace('youneek12'), 'twelve');
});

test('every other mode uses a single 0-100 scale', () => {
  assert.equal(dialFace('youneek'), 'hundred');
  assert.equal(dialFace('regular'), 'hundred');
  assert.equal(dialFace('army'), 'hundred');
});

test('12-hour hands walk the 12-hour circle and the 0-100 minute circle', () => {
  const time = {
    unitRotation: 10,
    minuteRotation: 20,
    secondRotation: 30,
    regularHourRotation: 90,
    regularMinuteRotation: 180,
    regularSecondRotation: 270,
  };
  assert.deepEqual(getHandRotations(time, 'youneek12'), {
    hour: 90,
    minute: 180,
    second: 270,
  });
  assert.deepEqual(getHandRotations(time, 'youneek'), {
    hour: 10,
    minute: 20,
    second: 30,
  });
});
