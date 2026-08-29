export default function ClockHeader() {
  return (
    <div className="header">
      <div className="header-lettering">
        <p className="font-mono w-full text-[clamp(2.75rem,11vw,9.5rem)] uppercase tracking-[0.08em] sm:tracking-[0.12em] font-black erupt-reveal-title leading-[0.9]">
          YouNeeK Time
        </p>
        <p className="mt-6 font-mono text-base sm:text-xl uppercase tracking-[0.4em] sm:tracking-[0.5em] font-bold erupt-reveal-subtitle">
          by Andrew Gray
        </p>
      </div>
    </div>
  );
}
