export default function ClockHeader() {
  return (
    <div className="w-full py-3 text-center">
      <h1
        className="font-mono text-[1.65rem] font-bold uppercase tracking-[0.22em] text-[#7CFF6B] sm:text-4xl sm:tracking-[0.28em]"
        style={{ textShadow: '0 0 18px #7CFF6B88' }}
      >
        YouNeeK Time
      </h1>
      <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.34em] text-[#7CFF6B]/65">
        by Andrew Gray
      </p>
    </div>
  );
}
