import { createPortal } from 'react-dom';

const lettering = (
  <div className="header-lettering">
    <p className="font-mono text-4xl sm:text-5xl md:text-6xl uppercase tracking-[0.35em] sm:tracking-[0.45em] font-bold lightning-reveal-title">
      YouNeeK Time
    </p>
    <p className="mt-3 font-mono text-[10px] sm:text-xs uppercase tracking-[0.25em] sm:tracking-[0.3em] font-bold lightning-reveal-subtitle">
      by Andrew Gray
    </p>
  </div>
);

export default function ClockHeader() {
  return (
    <>
      <div className="header" aria-hidden="true" />
      {createPortal(lettering, document.body)}
    </>
  );
}
