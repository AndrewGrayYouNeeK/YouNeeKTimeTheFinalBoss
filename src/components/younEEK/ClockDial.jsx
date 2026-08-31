import { useState, useEffect, forwardRef } from 'react';
import ClockTicks from './ClockTicks';
import ClockLabels from './ClockLabels';
import ClockHands from './ClockHands';

const BANNED_FACES = ['/clock-face-default.jpg', 'clock-face-default', 'astronaut-dial-bg'];

function resolveFace() {
  const stored = localStorage.getItem('clockFaceUrl');
  if (!stored || BANNED_FACES.some((b) => stored.includes(b))) {
    if (stored && BANNED_FACES.some((b) => stored.includes(b))) {
      localStorage.removeItem('clockFaceUrl');
    }
    return null;
  }
  return stored;
}

const ClockDial = forwardRef(function ClockDial(
  {
    time,
    isGlitching,
    source = 'youneek',
    handStyle = 'needle',
    hubRef,
    omitSeconds = false,
    maxWidthClass = 'max-w-[22rem] sm:max-w-[24rem]',
  },
  ref
) {
  const [centerImage, setCenterImage] = useState(resolveFace);

  useEffect(() => {
    const handleUpdate = () => setCenterImage(resolveFace());
    window.addEventListener('clock-face-updated', handleUpdate);
    return () => window.removeEventListener('clock-face-updated', handleUpdate);
  }, []);

  return (
    <div ref={ref} className={`relative mx-auto aspect-square w-full ${maxWidthClass}`}>
      <div className="absolute inset-[6%] z-0 rounded-full bg-black" aria-hidden="true" />

      {centerImage && (
        <div className="absolute inset-[6%] z-10 overflow-hidden rounded-full" style={{ pointerEvents: 'none' }}>
          <img
            src={centerImage}
            alt=""
            className="h-full w-full object-cover"
            style={{ opacity: isGlitching ? 0 : 0.55, transition: 'opacity 0.05s' }}
          />
        </div>
      )}

      <div
        ref={hubRef}
        className="absolute left-1/2 top-1/2 z-[15] h-[22%] w-[22%] -translate-x-1/2 -translate-y-1/2 rounded-full"
        aria-hidden="true"
      />

      <ClockTicks />

      <div className="pointer-events-none absolute inset-0 z-30">
        <ClockLabels />
        <ClockHands time={time} source={source} handStyle={handStyle} omitSeconds={omitSeconds} />
      </div>
    </div>
  );
});

export default ClockDial;
