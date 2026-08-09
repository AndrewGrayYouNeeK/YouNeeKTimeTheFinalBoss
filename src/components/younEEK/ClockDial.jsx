import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ClockTicks from './ClockTicks';
import ClockLabels from './ClockLabels';
import ClockHands from './ClockHands';
import { GREEN } from './clockConstants';

const DEFAULT_CENTER_IMAGE = '/clock-face-default.jpg';

export default function ClockDial({ time, isGlitching }) {
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
      className="relative mx-auto aspect-square w-full max-w-[min(100%,32rem)]"
    >
      {/* Volcano center image — sits inside the red dashed ring */}
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
        <ClockHands
          unitRotation={time.unitRotation}
          minuteRotation={time.minuteRotation}
          secondRotation={time.secondRotation}
        />
      </div>

      {/* Outer neon green bezel */}
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
