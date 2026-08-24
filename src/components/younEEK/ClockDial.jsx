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
      animate={{ scale: [1, 1.018, 1] }}
      transition={{ duration: 8.64, repeat: Infinity, ease: 'easeInOut' }}
      className="relative aspect-square w-full max-w-[32rem] overflow-visible"
    >
      {centerImage && (
        <div
          className="absolute inset-[38%] rounded-full overflow-hidden z-10"
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
        className="absolute inset-0 rounded-full pointer-events-none z-40"
        style={{
          border: `1px solid ${GREEN}`,
          boxShadow: `0 0 8px ${GREEN}66, inset 0 0 12px ${GREEN}22`,
        }}
      />
    </motion.div>
  );
}
