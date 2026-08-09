import SunCalc from 'suncalc';

function phaseNameFromValue(phaseValue) {
  if (phaseValue < 0.03) return 'New Moon';
  if (phaseValue < 0.22) return 'Waxing Crescent';
  if (phaseValue < 0.28) return 'First Quarter';
  if (phaseValue < 0.47) return 'Waxing Gibbous';
  if (phaseValue < 0.53) return 'Full Moon';
  if (phaseValue < 0.72) return 'Waning Gibbous';
  if (phaseValue < 0.78) return 'Last Quarter';
  if (phaseValue < 0.97) return 'Waning Crescent';
  return 'New Moon';
}

function formatTime(date) {
  if (!date || Number.isNaN(date.getTime?.())) return '—';
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Computes the current moon phase entirely in the browser. When geolocation is
// available we also compute moonrise/moonset for the user's coordinates.
export function getMoonPhase({ date = new Date(), latitude, longitude } = {}) {
  const illumination = SunCalc.getMoonIllumination(date);

  let moonrise = '—';
  let moonset = '—';
  if (typeof latitude === 'number' && typeof longitude === 'number') {
    const times = SunCalc.getMoonTimes(date, latitude, longitude);
    moonrise = formatTime(times.rise);
    moonset = formatTime(times.set);
  }

  return {
    phase: phaseNameFromValue(illumination.phase),
    illumination: Math.round(illumination.fraction * 100),
    moonrise,
    moonset,
  };
}
