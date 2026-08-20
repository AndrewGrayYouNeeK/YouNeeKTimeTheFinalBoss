export default function ClockHeader() {
  return (
    <div className="header relative">
      <div className="text-center relative z-10 px-2">
        <p className="font-mono text-4xl sm:text-5xl md:text-6xl uppercase tracking-[0.35em] sm:tracking-[0.45em] font-bold lightning-reveal-title">
          YouNeeK Time
        </p>
        <p className="mt-3 font-mono text-[10px] sm:text-xs uppercase tracking-[0.25em] sm:tracking-[0.3em] font-bold lightning-reveal-subtitle">
          by Andrew Gray
        </p>
      </div>
    </div>
  );
}
