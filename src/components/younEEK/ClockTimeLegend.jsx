import { BLUE, PURPLE, HAND_WHITE } from './clockConstants';

function pad(v) {
  return String(v).padStart(2, '0');
}

function Row({ color, label, value, active }) {
  const style = {
    color,
    textShadow: `0 0 8px ${color}99`,
    opacity: active ? 1 : 0.45,
  };
  return (
    <>
      <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-right" style={style}>{label}</div>
      <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-center" style={style}>•</div>
      <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-left" style={style}>{value}</div>
    </>
  );
}

export default function ClockTimeLegend({ now, time, source = 'youneek' }) {
  const regular = `${pad(time.hours12)}:${pad(now.getMinutes())}:${pad(now.getSeconds())} ${time.ampm}`;
  const decimal = `${pad(time.decimalHours)}:${pad(time.decimalMinutes)}:${pad(time.decimalSeconds)}`;
  const youneek = `${pad(time.units)}:${pad(time.minutes)}:${pad(time.seconds)}`;

  return (
    <div className="mb-3 flex justify-center">
      <div className="inline-grid grid-cols-[1fr_auto_1fr] gap-x-3 gap-y-1 items-center justify-center">
        <Row color={BLUE} label="YouNeeK Time" value={youneek} active={source === 'youneek'} />
        <Row color={PURPLE} label="Decimal Time" value={decimal} active={source === 'decimal'} />
        <Row color={HAND_WHITE} label="Regular Time" value={regular} active={source === 'regular'} />
      </div>
    </div>
  );
}
