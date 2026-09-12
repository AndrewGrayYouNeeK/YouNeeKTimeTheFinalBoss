export function getDecimalTime(now = new Date()) {
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);

  const elapsedMs = now.getTime() - startOfDay.getTime();
  const dayProgress = (((elapsedMs % 86400000) + 86400000) % 86400000) / 86400000;

  // YouNeeK Time: 100 hours, 100 minutes, 100 seconds per civilian day
  const totalUnits = dayProgress * 100;
  const totalBaseMinutes = dayProgress * 10000;
  const totalBaseSeconds = dayProgress * 1000000;
  const units = Math.floor(totalUnits);
  const minutes = Math.floor(totalBaseMinutes) % 100;
  const seconds = Math.floor(totalBaseSeconds) % 100;

  // Real decimal time: 10 hours, 100 minutes, 100 seconds per civilian day
  const totalDecHours = dayProgress * 10;
  const totalDecMinutes = dayProgress * 1000;
  const totalDecSeconds = dayProgress * 100000;
  const decimalHours = Math.floor(totalDecHours);
  const decimalMinutes = Math.floor(totalDecMinutes) % 100;
  const decimalSeconds = Math.floor(totalDecSeconds) % 100;

  const realHours = now.getHours();
  const realMinutes = now.getMinutes();
  const realSeconds = now.getSeconds();
  const realMs = now.getMilliseconds();
  const fractionalRealMinutes = realMinutes + (realSeconds + realMs / 1000) / 60;
  const fractionalRealSeconds = realSeconds + realMs / 1000;

  const hours12 = realHours % 12 === 0 ? 12 : realHours % 12;
  const ampm = realHours < 12 ? 'AM' : 'PM';

  const unitRotation = dayProgress * 360;
  const minuteRotation = (totalBaseMinutes % 100) * 3.6;
  const secondRotation = (totalBaseSeconds % 100) * 3.6;

  const decimalHourRotation = dayProgress * 360;
  const decimalMinuteRotation = (totalDecMinutes % 100) * 3.6;
  const decimalSecondRotation = (totalDecSeconds % 100) * 3.6;

  const hours12Frac = (realHours % 12) + fractionalRealMinutes / 60;
  const regularHourRotation = hours12Frac * 30;
  const regularMinuteRotation = fractionalRealMinutes * 6;
  const regularSecondRotation = fractionalRealSeconds * 6;

  return {
    progress: dayProgress,
    units,
    minutes,
    seconds,
    decimalHours,
    decimalMinutes,
    decimalSeconds,
    hours12,
    ampm,
    display: [units, minutes, seconds].map((v) => String(v).padStart(2, '0')).join(':'),
    decimalDisplay: [decimalHours, decimalMinutes, decimalSeconds].map((v) => String(v).padStart(2, '0')).join(':'),
    dayPercent: (dayProgress * 100).toFixed(2),
    unitRotation,
    minuteRotation,
    secondRotation,
    decimalHourRotation,
    decimalMinuteRotation,
    decimalSecondRotation,
    regularHourRotation,
    regularMinuteRotation,
    regularSecondRotation,
    regularMinutes: realMinutes,
    regularSeconds: realSeconds,
    armyHours: realHours,
    armyMinutes: Math.floor(fractionalRealMinutes * (100 / 60)) % 100,
    armySeconds: Math.floor(fractionalRealSeconds * (100 / 60)) % 100,
  };
}
