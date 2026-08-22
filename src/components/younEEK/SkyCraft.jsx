import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MIN_WAIT = 8 * 60 * 1000;
const MAX_WAIT = 22 * 60 * 1000;

function nextDelay() {
  return MIN_WAIT + Math.random() * (MAX_WAIT - MIN_WAIT);
}

function Airplane() {
  return (
    <svg width="72" height="22" viewBox="0 0 72 22" fill="none">
      <path d="M2 12 L28 11 L40 3 L44 3 L38 11 L58 11 L66 7 L70 7 L64 12 L70 16 L66 16 L58 13 L38 13 L44 20 L40 20 L28 13 L2 12 Z" fill="#d8dde6" opacity="0.85" />
      <circle cx="22" cy="12" r="1.2" fill="#9ad8ff" />
    </svg>
  );
}

function Ufo() {
  return (
    <svg width="64" height="28" viewBox="0 0 64 28" fill="none">
      <ellipse cx="32" cy="16" rx="26" ry="7" fill="#8ea0b8" opacity="0.9" />
      <ellipse cx="32" cy="12" rx="12" ry="8" fill="#b8f0ff" opacity="0.75" />
      <circle cx="18" cy="16" r="1.6" fill="#39ff14" />
      <circle cx="32" cy="17" r="1.6" fill="#ffff00" />
      <circle cx="46" cy="16" r="1.6" fill="#ff2a2a" />
    </svg>
  );
}

export default function SkyCraft() {
  const [craft, setCraft] = useState(null);

  const fly = (kind) => {
    const id = Date.now();
    const type = kind || (Math.random() < 0.5 ? 'plane' : 'ufo');
    const top = 6 + Math.random() * 28;
    const fromLeft = Math.random() < 0.5;
    setCraft({ id, type, top, fromLeft });
    window.setTimeout(() => setCraft(null), 9000);
  };

  useEffect(() => {
    let timer = window.setTimeout(function schedule() {
      fly();
      timer = window.setTimeout(schedule, nextDelay());
    }, nextDelay());
    window.triggerSkyCraft = (kind) => fly(kind);
    return () => {
      window.clearTimeout(timer);
      delete window.triggerSkyCraft;
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[8] overflow-hidden">
      <AnimatePresence>
        {craft && (
          <motion.div
            key={craft.id}
            initial={{
              opacity: 0,
              x: craft.fromLeft ? '-12vw' : '112vw',
              y: 0,
              rotate: craft.fromLeft ? -8 : 8,
            }}
            animate={{
              opacity: [0, 1, 1, 0],
              x: craft.fromLeft ? '112vw' : '-12vw',
              y: ['0vh', '4vh', '2vh'],
              rotate: craft.fromLeft ? 6 : -6,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 7.5, ease: 'linear' }}
            className="absolute"
            style={{ top: `${craft.top}%`, left: 0 }}
          >
            {craft.type === 'plane' ? <Airplane /> : <Ufo />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
