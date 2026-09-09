function pad(v) { return String(v).padStart(2, '0'); }

function Row({ label, value, active }) {
  return (
    <>
      <div className={`text-right text-[13px] ${active ? 'text-white' : 'text-white/35'}`}>{label}</div>
      <div className={`text-center text-[13px] ${active ? 'text-[#FF9F0A]' : 'text-white/25'}`}>·</div>
      <div className={`text-left text-[13px] tabular-nums ${active ? 'text-white' : 'text-white/35'}`}>{value}</div>
    </>
  );
}

export default function ClockTimeLegend({ now, time, source = 'youneek', lunar }) {
  const standardTime = `${pad(time.hours12)}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  const armyStr = `${pad(time.armyHours)}:${pad(time.armyMinutes)}:${pad(time.armySeconds)}`;
  const army12Str = `${pad(time.hours12)}:${pad(time.armyMinutes)}:${pad(time.armySeconds)}`;
  const digitalStr = `${pad(time.units)}:${pad(time.minutes)}:${pad(time.seconds)}`;

  return (
    <div className="mb-3 flex justify-center">
      <div className="inline-grid grid-cols-[1fr_auto_1fr] items-center gap-x-3 gap-y-1">
        <Row label="YouNeeK Digital" value={digitalStr} active={source === 'youneek'} />
        <Row label="Regular Time" value={standardTime} active={source === 'regular'} />
        <Row label="YouNeeK Time" value={army12Str} active={source === 'youneek12'} />
        <Row label="Army YouNeeK Time" value={armyStr} active={source === 'army'} />
        {lunar?.label ? <Row label="YouNeeK Lunar" value={lunar.label} active /> : null}
      </div>
    </div>
  );
}
