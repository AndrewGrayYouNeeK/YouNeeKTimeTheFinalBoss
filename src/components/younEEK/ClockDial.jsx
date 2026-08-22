import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ClockTicks from './ClockTicks';
import ClockLabels from './ClockLabels';
import ClockHands from './ClockHands';
import { GREEN } from './clockConstants';

const DEFAULT_CENTER_IMAGE = '/clock-face-default.jpg';

export default function ClockDial({ time, isGlitching, source = 'youneek' }) {
  const [centerImage, setCenterImage] = useState(
    localStorage.getItem('clockFaceUrl') || DEFAULT_CENTER_IMAGE
  );

  useEffect(() => {
    const handleUpdate = () => {
      setCenterImage(localStorage.getItem('clockFaceUrl') || DEFAULT_CENTER_IMAGE);
    };
    window.addEventListener('clock-face-updated', handleUpdate);
    return () => window.removeEventListener('clock-face-updated', handleUpdate);
  }, []);

  return (
    <motion.div
      animate={{ scale: [1, 1.038, 1] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      className="relative aspect-square w-full max-w-[32rem] overflow-visible"
    >
      {centerImage && (
        <div
          className="absolute inset-[12%] rounded-full overflow-hidden z-10"
          style={{ pointerEvents: 'none' }}
        >
          <img
            src={centerImage}
            alt="YouNeek volcano"
            className="w-full h-full object-cover"
            style={{
              opacity: isGlitching ? 0 : 1,
              transition: 'opacity 0.05s',
            }}
          />
        </div>
      )}

      <ClockTicks />

      <div className="absolute inset-0 z-30 pointer-events-none">
        <ClockLabels />
        <ClockHands time={time} source={source} />
      </div>

      <div
        className="clock-heartbeat absolute inset-0 rounded-full pointer-events-none z-40"
        style={{
          border: `1px solid ${GREEN}`,
          boxShadow: `0 0 8px ${GREEN}66, inset 0 0 12px ${GREEN}22`,
        }}
      />
      <svg viewBox="0 0 400 400" className="clock-heartbeat-heart pointer-events-none absolute inset-0 z-50 h-full w-full">
        <path
          d="M200 318 C196 308 176 294 164 306 C154 316 158 332 200 354 C242 332 246 316 236 306 C224 294 204 308 200 318 Z"
          fill="#ff2a2a"
          stroke={GREEN}
          strokeWidth="1.2"
          style={{ filter: 'drop-shadow(0 0 8px #ff2a2a)' }}
        />
      </svg>
    </motion.div>
  );
}
