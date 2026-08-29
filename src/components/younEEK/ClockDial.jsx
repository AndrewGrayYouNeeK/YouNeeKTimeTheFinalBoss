import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ClockTicks from './ClockTicks';
import ClockLabels from './ClockLabels';
import ClockHands from './ClockHands';
import { BLUE, PURPLE } from './clockConstants';

const DEFAULT_CENTER_IMAGE = '/astronaut-dial-bg.png';
const BANNED_FACES = ['/clock-face-default.jpg', 'clock-face-default'];

function resolveFace() {
  const stored = localStorage.getItem('clockFaceUrl');
  if (!stored || BANNED_FACES.some((b) => stored.includes(b))) {
    if (stored) localStorage.removeItem('clockFaceUrl');
    return DEFAULT_CENTER_IMAGE;
  }
  return stored;
}

export default function ClockDial({ time, isGlitching, source = 'youneek' }) {
  const [centerImage, setCenterImage] = useState(resolveFace);

  useEffect(() => {
    const handleUpdate = () => setCenterImage(resolveFace());
    window.addEventListener('clock-face-updated', handleUpdate);
    return () => window.removeEventListener('clock-face-updated', handleUpdate);
  }, []);

  return (
    <motion.div
      animate={{ scale: [1, 1.018, 1] }}
      transition={{ duration: 8.64, repeat: Infinity, ease: 'easeInOut' }}
      className="relative aspect-square w-full max-w-[32rem]"
    >
      {centerImage && (
        <div
          className="absolute inset-[12%] rounded-full overflow-hidden z-10"
          style={{ pointerEvents: 'none' }}
        >
          <img
            src={centerImage}
            alt=""
            className="volcano-erupt-img w-full h-full object-cover"
            style={{
              opacity: isGlitching ? 0 : 1,
              transition: 'opacity 0.05s, filter 0.05s',
            }}
          />
          <div className="volcano-erupt-glow" aria-hidden="true" />
        </div>
      )}

      <ClockTicks />

      <div className="absolute inset-0 z-30 pointer-events-none">
        <ClockLabels />
        <ClockHands time={time} source={source} />
      </div>

      <div
        className="absolute inset-0 rounded-full pointer-events-none z-40"
        style={{
          border: `1px solid ${PURPLE}`,
          boxShadow: `0 0 8px ${PURPLE}66, 0 0 14px ${BLUE}44, inset 0 0 12px ${BLUE}22`,
        }}
      />
    </motion.div>
  );
}
