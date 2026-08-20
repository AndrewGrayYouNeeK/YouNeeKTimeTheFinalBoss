import { createPortal } from 'react-dom';

const lettering = (
  <div className="header-lettering">
    <p className="font-mono text-6xl sm:text-8xl md:text-9xl uppercase tracking-[0.18em] sm:tracking-[0.22em] font-bold lightning-reveal-title leading-none">
      YouNeeK Time
    </p>
    <p className="mt-5 font-mono text-sm sm:text-base uppercase tracking-[0.35em] sm:tracking-[0.4em] font-bold lightning-reveal-subtitle">
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
