import { formatDigital } from '@/lib/clockPrefs';

const BLUE = '#7CFF6B';

function DigitCard({ digit }) {
  return (
    <div className="flex h-16 w-[2.35rem] items-center justify-center rounded-xl border bg-black sm:h-20 sm:w-[2.9rem]"
      style={{
        borderColor: `${BLUE}66`,
        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.03)',
      }}>
      <span className="font-mono text-4xl font-bold tracking-[0.04em] sm:text-5xl"
        style={{ color: BLUE }}>
        {digit}
      </span>
    </div>
  );
}

export default function DigitalTimeDisplay({ time, source = 'youneek' }) {
  const chars = [...formatDigital(time, source)];

  return (
    <div className="w-full text-center">
      <div className="flex items-center justify-center gap-2 sm:gap-3">
        {chars.map((ch, i) => (
          ch === '•' || ch === ':'
            ? (
              <div key={`${ch}-${i}`} className="px-1 font-mono text-5xl sm:text-6xl"
                style={{ color: BLUE }}>{ch}</div>
            )
            : <DigitCard key={`${ch}-${i}`} digit={ch} />
        ))}
      </div>
    </div>
  );
}
