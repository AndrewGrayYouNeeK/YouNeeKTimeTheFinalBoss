export default function ClockHeader() {
  return (
    <div className="header relative">
      <div className="relative z-10 w-full px-2 text-center">
        <div className="header-title-reveal mx-auto max-w-lg relative">
          <p className="lightning-reveal-title font-mono text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-[0.16em] leading-tight">
            YouNeeK Time
          </p>
          <p className="lightning-reveal-subtitle mt-3 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-[0.22em]">
            by Andrew Gray
          </p>
          <div className="header-rain-trickle" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
