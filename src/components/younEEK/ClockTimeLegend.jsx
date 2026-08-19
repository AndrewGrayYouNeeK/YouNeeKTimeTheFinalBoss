import { WHITE, GREEN } from './clockConstants';

function pad(v) { return String(v).padStart(2, '0'); }

function Row({ color, label, value }) {
  const style = { color, textShadow: `0 0 8px ${color}99` };
  return (
    <>
      <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-right" style={style}>{label}</div>
      <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-center" style={style}>•</div>
      <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-left" style={style}>{value}</div>
    </>
  );
}

export default function ClockTimeLegend({ now, time }) {
  const standardTime = `${pad(time.hours12)}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  const armyStr = `${pad(time.armyHours)}:${pad(time.armyMinutes)}:${pad(time.armySeconds)}`;
  const army12Str = `${pad(time.hours12)}:${pad(time.armyMinutes)}:${pad(time.armySeconds)}`;

  return (
    <div className="mb-3 flex justify-center">
      <div className="inline-grid grid-cols-[1fr_auto_1fr] gap-x-3 gap-y-1 items-center justify-center">
        <Row color={WHITE} label="Regular Time" value={standardTime} />
        <Row color={GREEN} label="YouNeeK Time" value={army12Str} />
        <Row color={WHITE} label="Army YouNeeK Time" value={armyStr} />
      </div>
    </div>
  );
}
