import { useState, useEffect, forwardRef } from 'react';
import ClockTicks from './ClockTicks';
import ClockLabels from './ClockLabels';
import ClockHands from './ClockHands';
import AstronautBody from './AstronautBody';
import DialSmoke from './DialSmoke';
import HilbertCanvas from './HilbertCanvas';
import SpiralCanvas from './SpiralCanvas';

const DEFAULT_CENTER_IMAGE = '/astronaut-dial-bg.webp';
const BANNED_FACES = ['/clock-face-default.jpg', 'clock-face-default', 'volcano-bg', 'astronaut-concept'];

function resolveFace() {
  const stored = localStorage.getItem('clockFaceUrl');
  if (!stored || BANNED_FACES.some((b) => stored.includes(b))) {
    if (stored && BANNED_FACES.some((b) => stored.includes(b))) {
      localStorage.removeItem('clockFaceUrl');
    }
    return DEFAULT_CENTER_IMAGE;
  }
  return stored;
}

const ClockDial = forwardRef(function ClockDial(
  {
    time,
    isGlitching,
    source = 'youneek',
    handStyle = 'needle',
    renderMode = 'legacy',
    diaryView = null,
    hubRef,
    omitSeconds = false,
    lunar,
    erupting = false,
    maxWidthClass = 'max-w-[26rem] sm:max-w-[32rem]',
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
      <div className="absolute inset-[8%] z-0 rounded-full bg-black" aria-hidden="true" />

      {centerImage && renderMode === 'legacy' && (
        <div className="absolute inset-[8%] z-10 overflow-hidden rounded-full" style={{ pointerEvents: 'none' }}>
          <img
            src={centerImage}
            alt=""
            className="h-full w-full object-cover"
            style={{ opacity: isGlitching ? 0 : 1, transition: 'opacity 0.05s' }}
          />
        </div>
      )}

      <DialSmoke erupting={erupting} />

      <div
        ref={hubRef}
        className="absolute left-1/2 top-1/2 z-[15] h-[22%] w-[22%] -translate-x-1/2 -translate-y-1/2 rounded-full"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute inset-[8%] z-[12] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(0,0,0,0) 52%, rgba(0,0,0,0.55) 70%, rgba(0,0,0,0.8) 100%)' }}
        aria-hidden="true"
      />

      <ClockTicks source={source} />

      {renderMode === 'hilbert' && (
        <div className="pointer-events-none absolute inset-[8%] z-[22] overflow-hidden rounded-full">
          <HilbertCanvas time={time} diary={diaryView} />
        </div>
      )}
      {renderMode === 'spiral' && (
        <div className="pointer-events-none absolute inset-[8%] z-[22] overflow-hidden rounded-full">
          <SpiralCanvas time={time} />
        </div>
      )}

      {renderMode === 'legacy' && (
        <div className="pointer-events-none absolute inset-0 z-[25]">
          <AstronautBody />
        </div>
      )}

      <div className="pointer-events-none absolute inset-0 z-30">
        <ClockLabels source={source} />
        {renderMode === 'legacy' && (
          <ClockHands time={time} source={source} handStyle={handStyle} omitSeconds={omitSeconds} />
        )}
      </div>
    </div>
  );
});

export default ClockDial;
