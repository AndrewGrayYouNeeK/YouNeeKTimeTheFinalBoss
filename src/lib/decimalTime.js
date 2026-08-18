export function getDecimalTime(now = new Date()) {
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);

  const elapsedMs = now.getTime() - startOfDay.getTime();
  const dayProgress = ((elapsedMs % 86400000) + 86400000) % 86400000 / 86400000;

  // YouNeeK decimal time: 100 units/day, 100 minutes/unit, 100 seconds/minute
  const totalUnits = dayProgress * 100;
  const totalBaseMinutes = dayProgress * 10000;
  const totalBaseSeconds = dayProgress * 1000000;

  const units = Math.floor(totalUnits);
  const minutes = Math.floor(totalBaseMinutes) % 100;
  const seconds = Math.floor(totalBaseSeconds) % 100;

  // YouNeeK Army Time: 24 real hours, but each hour divided into 100 YouNeeK minutes
  // Each real minute = 100/60 = 1.6667 YouNeeK army minutes
  // So armyMinutes = floor((realMinutes + realSeconds/60) * (100/60))
  const realHours = now.getHours();
  const realMinutes = now.getMinutes();
  const realSeconds = now.getSeconds();
  const realMs = now.getMilliseconds();

  // Real fractional minutes into the current hour
  const fractionalRealMinutes = realMinutes + (realSeconds + realMs / 1000) / 60;
  // Convert to YouNeeK army minutes (100 per hour instead of 60)
  const armyMinutesFrac = fractionalRealMinutes * (100 / 60);
  const armyMinutes = Math.floor(armyMinutesFrac) % 100;

  // YouNeeK army seconds: 100 per YouNeeK-army-minute
  // Each real second = (100/60) * (100/60) YouNeeK army seconds
  const fractionalRealSeconds = realSeconds + realMs / 1000;
  const armySecondsFrac = fractionalRealSeconds * (100 / 60);
  const armySeconds = Math.floor(armySecondsFrac) % 100;

  // YouNeeK 12-hour (same logic but 12h format)
  const hours12 = realHours % 12 === 0 ? 12 : realHours % 12;
  const ampm = realHours < 12 ? 'AM' : 'PM';

  // Clock hand rotations
  // Green hour hand: full 360 = full day (100 units)
  const unitRotation = dayProgress * 360;
  // Red minute hand: 360 = 1 YouNeeK unit (100 minutes of inner ring)
  const minuteRotation = (totalBaseMinutes % 100) * 3.6;
  // Second hand: 360 = 1 YouNeeK minute
  const secondRotation = (totalBaseSeconds % 100) * 3.6;

  // Army 24h hour hand: full 360 = one day (same sweep as YouNeeK units)
  const armyHourRotation = dayProgress * 360;
  // Army minute hand rotation: 360 = 1 real hour (100 army minutes)
  const armyMinuteRotation = armyMinutesFrac * 3.6;
  // Army second hand rotation: 360 = 1 army minute (100 army seconds)
  const armySecondRotation = armySecondsFrac * 3.6;

  const hours12Frac = (realHours % 12) + fractionalRealMinutes / 60;
  const regularHourRotation = hours12Frac * 30;
  const regularMinuteRotation = fractionalRealMinutes * 6;
  const regularSecondRotation = fractionalRealSeconds * 6;

  return {
    progress: dayProgress,
    units,
    minutes,
    seconds,
    armyHours: realHours,
    armyMinutes,
    armySeconds,
    hours12,
    ampm,
    display: [units, minutes, seconds].map((v) => String(v).padStart(2, '0')).join(':'),
    dayPercent: (dayProgress * 100).toFixed(2),
    unitRotation,
    minuteRotation,
    secondRotation,
    armyHourRotation,
    armyMinuteRotation,
    armySecondRotation,
    regularHourRotation,
    regularMinuteRotation,
    regularSecondRotation,
  };
}
