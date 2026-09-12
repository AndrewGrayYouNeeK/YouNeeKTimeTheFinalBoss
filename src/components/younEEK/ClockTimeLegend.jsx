import { BLUE } from './clockConstants';

function pad(v) { return String(v).padStart(2, '0'); }

function Row({ label, value, active }) {
  const style = {
    color: BLUE,
    textShadow: active ? `0 0 8px ${BLUE}99` : 'none',
    opacity: active ? 1 : 0.4,
  };
  return (
    <>
      <div className="text-right font-mono text-[11px] uppercase tracking-[0.18em]" style={style}>{label}</div>
      <div className="text-center font-mono text-[11px] uppercase tracking-[0.18em]" style={style}>•</div>
      <div className="text-left font-mono text-[11px] uppercase tracking-[0.18em]" style={style}>{value}</div>
    </>
  );
}

export default function ClockTimeLegend({ now, time, source = 'youneek', lunar }) {
  const standardTime = `${pad(time.hours12)}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  const armyStr = `${pad(time.armyHours)}:${pad(time.armyMinutes)}:${pad(time.armySeconds)}`;
  const army12Str = `${pad(time.hours12)}:${pad(time.armyMinutes)}:${pad(time.armySeconds)}`;
  const digitalStr = `${pad(time.units)}•${pad(time.minutes)}•${pad(time.seconds)}`;

  return (
    <div className="mb-3 flex justify-center">
      <div className="inline-grid grid-cols-[1fr_auto_1fr] items-center justify-center gap-x-3 gap-y-1">
        <Row label="YouNeeK Digital" value={digitalStr} active={source === 'youneek'} />
        <Row label="Regular Time" value={standardTime} active={source === 'regular'} />
        <Row label="YouNeeK Time" value={army12Str} active={source === 'youneek12'} />
        <Row label="Army YouNeeK Time" value={armyStr} active={source === 'army'} />
        {lunar?.label ? <Row label="YouNeeK Lunar" value={lunar.label} active /> : null}
      </div>
    </div>
  );
}
