import { useState, useEffect, useRef, forwardRef } from 'react';
import ClockTicks from './ClockTicks';
import ClockLabels from './ClockLabels';
import ClockHands from './ClockHands';
import AstronautBody from './AstronautBody';
import DialSmoke from './DialSmoke';
import HilbertCanvas from './HilbertCanvas';
import SpiralCanvas from './SpiralCanvas';
import PathMorph from './PathMorph';
import { VOID } from './clockConstants';

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
  const [shown, setShown] = useState(renderMode);
  const [morph, setMorph] = useState(null);
  const shownRef = useRef(renderMode);

  useEffect(() => {
    shownRef.current = shown;
  }, [shown]);

  useEffect(() => {
    const handleUpdate = () => setCenterImage(resolveFace());
    window.addEventListener('clock-face-updated', handleUpdate);
    return () => window.removeEventListener('clock-face-updated', handleUpdate);
  }, []);

  useEffect(() => {
    if (renderMode === shownRef.current) return;
    const isPath = (mode) => mode === 'hilbert' || mode === 'spiral';
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isPath(renderMode) && isPath(shownRef.current) && !reduce) {
      setMorph({ from: shownRef.current, to: renderMode, id: Date.now() });
      return;
    }
    setMorph(null);
    setShown(renderMode);
  }, [renderMode]);

  const pathFace = morph || shown === 'hilbert' || shown === 'spiral';

  return (
    <div ref={ref} className={`relative mx-auto aspect-square w-full ${maxWidthClass}`}>
      {pathFace ? (
        <div
          className="pointer-events-none absolute inset-[4%] z-[22] overflow-hidden rounded-2xl"
          style={{ background: VOID }}
        >
          {morph ? (
            <PathMorph
              key={morph.id}
              time={time}
              from={morph.from}
              to={morph.to}
              onDone={() => {
                setShown(morph.to);
                setMorph(null);
              }}
            />
          ) : shown === 'hilbert' ? (
            <HilbertCanvas time={time} diary={diaryView} />
          ) : (
            <SpiralCanvas time={time} />
          )}
        </div>
      ) : (
        <>
          <div className="absolute inset-[8%] z-0 rounded-full bg-black" aria-hidden="true" />

          {centerImage && (
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

          <div className="pointer-events-none absolute inset-0 z-[25]">
            <AstronautBody />
          </div>

          <div className="pointer-events-none absolute inset-0 z-30">
            <ClockLabels source={source} />
            <ClockHands time={time} source={source} handStyle={handStyle} omitSeconds={omitSeconds} />
          </div>
        </>
      )}
    </div>
  );
});

export default ClockDial;
