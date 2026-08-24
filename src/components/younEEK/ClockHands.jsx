import { GREEN, YELLOW } from './clockConstants';
import { getHandRotations } from '@/lib/clockPrefs';

const RED = '#ff2222';

export default function ClockHands({ time, source = 'youneek' }) {
  const { hour, minute, second } = getHandRotations(time, source);

  return (
    <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full" style={{ overflow: 'visible' }}>
      <g transform={`rotate(${hour}, 200, 200)`}>
        <line
          x1="200" y1="230" x2="200" y2="18"
          stroke={GREEN} strokeWidth="3.5" strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 6px ${GREEN})` }}
        />
      </g>

      <g transform={`rotate(${minute}, 200, 200)`}>
        <line
          x1="200" y1="230" x2="200" y2="52"
          stroke={RED} strokeWidth="3.5" strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 6px ${RED})` }}
        />
      </g>

      <g transform={`rotate(${second}, 200, 200)`}>
        <line
          x1="200" y1="218" x2="200" y2="100"
          stroke={YELLOW} strokeWidth="3" strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 4px ${YELLOW})` }}
        />
      </g>

      <circle
        cx="200" cy="200" r="5" fill={YELLOW}
        style={{ filter: `drop-shadow(0 0 8px ${YELLOW}) drop-shadow(0 0 4px ${YELLOW})` }}
      />
    </svg>
  );
}
