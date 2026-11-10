import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { createServer } from 'vite';

let server;
let getLunarDate;

before(async () => {
  server = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
    logLevel: 'error',
  });
  ({ getLunarDate } = await server.ssrLoadModule('/src/lib/lunarCalendar.js'));
});

after(async () => {
  await server?.close();
});

function datesInYear(year) {
  const dates = [];
  for (let month = 0; month < 12; month += 1) {
    const last = new Date(year, month + 1, 0).getDate();
    for (let day = 1; day <= last; day += 1) {
      dates.push(new Date(year, month, day, 12, 0, 0));
    }
  }
  return dates;
}

test('every date is month 1 through 12', () => {
  for (const year of [2024, 2025, 2026, 2027, 2028]) {
    for (const date of datesInYear(year)) {
      const lunar = getLunarDate(date);
      assert.ok(
        lunar.monthInYear >= 1 && lunar.monthInYear <= 12,
        `${date.toDateString()} showed month ${lunar.monthInYear}`,
      );
      assert.ok(lunar.day >= 1, `${date.toDateString()} showed day ${lunar.day}`);
    }
  }
});

test('2026 includes months 1 through 12 and does not skip month 1', () => {
  const months = new Set();
  for (const date of datesInYear(2026)) {
    const lunar = getLunarDate(date);
    if (lunar.year === 2026) months.add(lunar.monthInYear);
  }
  assert.deepEqual([...months].sort((a, b) => a - b), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
});

test('January and December stay inside 1 through 12', () => {
  const samples = [
    [2024, 0, 1],
    [2024, 11, 31],
    [2025, 0, 1],
    [2025, 0, 15],
    [2025, 11, 31],
    [2026, 0, 1],
    [2026, 0, 20],
    [2026, 11, 15],
    [2026, 11, 31],
    [2027, 0, 1],
    [2027, 11, 31],
  ];
  for (const [year, month, day] of samples) {
    const lunar = getLunarDate(new Date(year, month, day, 12, 0, 0));
    assert.ok(lunar.monthInYear >= 1 && lunar.monthInYear <= 12, lunar.longLabel);
    assert.equal(lunar.longLabel.includes('Month 13'), false, lunar.longLabel);
    assert.equal(lunar.longLabel.includes('Month 0'), false, lunar.longLabel);
  }

  const firstOf2026 = getLunarDate(new Date(2026, 0, 20, 12, 0, 0));
  assert.equal(firstOf2026.year, 2026);
  assert.equal(firstOf2026.monthInYear, 1);

  const endOf2026 = getLunarDate(new Date(2026, 11, 20, 12, 0, 0));
  assert.equal(endOf2026.year, 2026);
  assert.equal(endOf2026.monthInYear, 12);

  const newYear = getLunarDate(new Date(2026, 0, 1, 12, 0, 0));
  assert.ok(newYear.monthInYear <= 12);
  assert.notEqual(newYear.monthInYear, 13);
});
