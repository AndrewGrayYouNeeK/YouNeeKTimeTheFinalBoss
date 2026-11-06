import { formatDigital } from '@/lib/clockPrefs';

const GREEN = '#7CFF6B';

function DigitCard({ digit }) {
  return (
    <div
      className="flex h-14 w-[2.1rem] items-center justify-center rounded-lg border bg-black/80 sm:h-[4.5rem] sm:w-[2.75rem] sm:rounded-xl"
      style={{
        borderColor: `${GREEN}55`,
        boxShadow: `inset 0 0 0 1px rgba(255,255,255,0.03), 0 0 14px ${GREEN}22`,
      }}
    >
      <span
        className="font-mono text-3xl font-bold tracking-[0.04em] sm:text-5xl"
        style={{ color: GREEN, textShadow: `0 0 10px ${GREEN}88` }}
      >
        {digit}
      </span>
    </div>
  );
}

const UNIT_LABELS = ['UNITS', '/100', '/100'];

export default function DigitalTimeDisplay({ time, source = 'youneek' }) {
  const chars = [...formatDigital(time, source)];
  // group into 3 digit-pairs for labels
  const groups = [];
  let buf = [];
  chars.forEach((ch, i) => {
    if (ch === '•' || ch === ':') {
      groups.push(buf);
      buf = [];
      groups.push([{ sep: ch, i }]);
    } else {
      buf.push({ ch, i });
    }
  });
  if (buf.length) groups.push(buf);

  let labelIdx = 0;

  return (
    <div className="w-full text-center">
      <div className="flex items-end justify-center gap-1.5 sm:gap-2.5">
        {groups.map((g, gi) => {
          if (g[0]?.sep) {
            return (
              <div
                key={`sep-${gi}`}
                className="self-center px-0.5 font-mono text-4xl sm:text-5xl"
                style={{ color: GREEN }}
              >
                {g[0].sep}
              </div>
            );
          }
          const label = source === 'regular'
            ? ['H', 'M', 'S'][labelIdx++]
            : UNIT_LABELS[labelIdx++] || '';
          return (
            <div key={`g-${gi}`} className="flex flex-col items-center gap-1.5">
              <div className="flex gap-1 sm:gap-1.5">
                {g.map(({ ch, i }) => (
                  <DigitCard key={`${ch}-${i}`} digit={ch} />
                ))}
              </div>
              <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-white/35 sm:text-[10px]">
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
