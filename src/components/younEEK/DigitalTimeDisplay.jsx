import { formatDigital } from '@/lib/clockPrefs';

const GREEN = '#39ff14';

function DigitCard({ digit }) {
  return (
    <div className="flex h-24 w-[4.8rem] items-center justify-center rounded-2xl border bg-black sm:h-28 sm:w-[5.4rem]"
      style={{
        borderColor: `${GREEN}44`,
        boxShadow: `inset 0 0 0 1px rgba(255,255,255,0.03), 0 0 24px ${GREEN}33`,
      }}>
      <span className="font-mono text-6xl font-semibold tracking-[0.08em] sm:text-7xl"
        style={{ color: GREEN, textShadow: `0 0 18px ${GREEN}cc` }}>
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
                style={{ color: GREEN, textShadow: `0 0 10px ${GREEN}` }}>{ch}</div>
            )
            : <DigitCard key={`${ch}-${i}`} digit={ch} />
        ))}
      </div>
    </div>
  );
}
