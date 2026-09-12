const GREEN = '#7CFF6B';

function pad(v) {
  return String(v).padStart(2, '0');
}

function Row({ label, value, active }) {
  const style = {
    color: GREEN,
    textShadow: active ? `0 0 8px ${GREEN}99` : 'none',
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

export default function ClockTimeLegend({ now, time, source = 'youneek' }) {
  const regular = `${pad(time.hours12)}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  const youneek = `${pad(time.units)}•${pad(time.minutes)}•${pad(time.seconds)}`;

  return (
    <div className="mb-3 flex justify-center">
      <div className="inline-grid grid-cols-[1fr_auto_1fr] items-center justify-center gap-x-3 gap-y-1">
        <Row label="100.100.100" value={youneek} active={source !== 'regular'} />
        <Row label="Regular Time" value={regular} active={source === 'regular'} />
      </div>
    </div>
  );
}
