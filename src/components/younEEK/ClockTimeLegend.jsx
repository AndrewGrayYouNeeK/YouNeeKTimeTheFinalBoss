import { GREEN, HAND_RED, YELLOW } from './clockConstants';
import { formatDigital, sourceLabel } from '@/lib/clockPrefs';

function pad(v) { return String(v).padStart(2, '0'); }

export default function ClockTimeLegend({ now, time, source }) {
  const seconds =
    source === 'regular'
      ? pad(now.getSeconds())
      : source === 'youneek'
        ? pad(time.seconds)
        : pad(time.armySeconds);

  return (
    <div className="mb-3 flex justify-center">
      <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-center" style={{ color: GREEN, textShadow: `0 0 8px ${GREEN}99` }}>
        {sourceLabel(source)}
        <span className="mx-2" style={{ color: HAND_RED }}>•</span>
        {formatDigital(time, source)}
        <span className="mx-1" style={{ color: YELLOW }}>:</span>
        <span style={{ color: YELLOW }}>{seconds}</span>
      </div>
    </div>
  );
}
