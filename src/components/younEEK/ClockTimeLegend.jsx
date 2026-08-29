import { LAVA, GOLD, HAND_WHITE, HAND_RED } from './clockConstants';

function pad(v) { return String(v).padStart(2, '0'); }

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
  const standardTime = `${pad(time.hours12)}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  const armyStr = `${pad(time.armyHours)}:${pad(time.armyMinutes)}:${pad(time.armySeconds)}`;
  const army12Str = `${pad(time.hours12)}:${pad(time.armyMinutes)}:${pad(time.armySeconds)}`;
  const digitalStr = `${pad(time.units)}•${pad(time.minutes)}•${pad(time.seconds)}`;

  return (
    <div className="mb-3 flex justify-center">
      <div className="inline-grid grid-cols-[1fr_auto_1fr] gap-x-3 gap-y-1 items-center justify-center">
        <Row color={LAVA} label="YouNeeK Digital" value={digitalStr} active={source === 'youneek'} />
        <Row color={HAND_WHITE} label="Regular Time" value={standardTime} active={source === 'regular'} />
        <Row color={GOLD} label="YouNeeK Time" value={army12Str} active={source === 'youneek12'} />
        <Row color={HAND_RED} label="Army YouNeeK Time" value={armyStr} active={source === 'army'} />
      </div>
    </div>
  );
}
