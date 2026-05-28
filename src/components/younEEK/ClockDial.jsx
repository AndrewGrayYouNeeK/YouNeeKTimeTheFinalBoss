import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ClockTicks from './ClockTicks';
import ClockLabels from './ClockLabels';
import ClockHands from './ClockHands';

const DEFAULT_CENTER_IMAGE = 'https://media.base44.com/images/public/69c46a76857b7906981251c6/1f25e836d_IMG_0681.png';

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
      animate={{ scale: [1, 1.08, 1] }}
      transition={{ duration: 8.64, repeat: Infinity, ease: 'easeInOut' }}
      className="relative aspect-square w-full max-w-[32rem]"
    >
      {/* Clock face — transparent to let stars show through */}
      <div className="absolute inset-0 rounded-full border border-[#39ff14] bg-transparent" />

      {/* Center image — darkens when clock shrinks, brightens when it expands */}
      {centerImage && (
        <motion.div
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-[12%] rounded-full overflow-hidden z-10"
          style={{ pointerEvents: 'none' }}
        >
          <img src={centerImage} alt="center" className="w-full h-full object-cover" style={{ opacity: isGlitching ? 0 : 0.7, transition: 'opacity 0.05s' }} />
        </motion.div>
      )}

      <ClockTicks />
      <div className="absolute inset-0 z-20 pointer-events-none">
        <ClockLabels />
        <ClockHands
          unitRotation={time.unitRotation}
          minuteRotation={time.minuteRotation}
          secondRotation={time.secondRotation}
        />
        {/* Red "0" label at 12 o'clock */}
        <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full">
          <text
            x="200" y="60"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#ff2222"
            fontSize="10"
            fontFamily="monospace"
            fontWeight="700"
            style={{ filter: 'drop-shadow(0 0 3px #ff222288)' }}
          >
            0
          </text>
        </svg>
      </div>
    </motion.div>
  );
}