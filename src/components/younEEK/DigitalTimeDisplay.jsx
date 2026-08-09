const GREEN = '#39ff14';

function pad(value) {
  return String(value).padStart(2, '0');
}

function DigitCard({ digit }) {
  return (
    <div
      className="digit-card flex items-center justify-center rounded-2xl border bg-black"
      style={{
        borderColor: `${GREEN}44`,
        boxShadow: `inset 0 0 0 1px rgba(255,255,255,0.03), 0 0 24px ${GREEN}33`,
      }}
    >
      <span
        className="digit-value font-mono font-semibold"
        style={{ color: GREEN, textShadow: `0 0 18px ${GREEN}cc` }}
      >
        {digit}
      </span>
    </div>
  );
}

export default function DigitalTimeDisplay({ time }) {
  const digits = [...pad(time.units), ...pad(time.minutes)];

  return (
    <div className="w-full overflow-hidden">
      <div className="digital-time-row mx-auto flex max-w-full items-center justify-center">
        <DigitCard digit={digits[0]} />
        <DigitCard digit={digits[1]} />
        <div
          className="digital-time-separator font-mono"
          style={{ color: GREEN, textShadow: `0 0 10px ${GREEN}` }}
        >
          •
        </div>
        <DigitCard digit={digits[2]} />
        <DigitCard digit={digits[3]} />
      </div>
    </div>
  );
}
