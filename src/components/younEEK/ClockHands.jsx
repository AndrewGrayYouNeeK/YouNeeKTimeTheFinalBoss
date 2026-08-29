import { BLUE, PURPLE, YELLOW } from './clockConstants';
import { getHandRotations } from '@/lib/clockPrefs';

const CX = 200;
const CY = 200;
const SHOULDER_X = 268;
const SHOULDER_Y = 138;

export default function ClockHands({ time, source = 'youneek' }) {
  const { hour, minute, second } = getHandRotations(time, source);

  return (
    <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full" style={{ overflow: 'visible' }}>
      <g transform={`rotate(${hour} ${CX} ${CY})`} style={{ filter: `drop-shadow(0 0 7px ${PURPLE})` }}>
        <path
          d={`M ${CX - 7} ${CY + 2}
             C ${CX - 11} ${CY - 28} ${CX - 12} ${CY - 55} ${CX - 10} ${CY - 72}
             L ${CX - 16} ${CY - 84}
             L ${CX + 1} ${CY - 84}
             L ${CX - 3} ${CY - 72}
             C ${CX - 2} ${CY - 55} ${CX - 1} ${CY - 28} ${CX + 1} ${CY + 2}
             Z`}
          fill={PURPLE}
        />
        <ellipse cx={CX - 7} cy={CY - 86} rx="10" ry="4" fill={PURPLE} />
      </g>

      <g transform={`rotate(${minute} ${CX} ${CY})`} style={{ filter: `drop-shadow(0 0 7px ${BLUE})` }}>
        <path
          d={`M ${CX + 6} ${CY + 2}
             C ${CX + 11} ${CY - 40} ${CX + 12} ${CY - 80} ${CX + 9} ${CY - 108}
             L ${CX + 16} ${CY - 122}
             L ${CX - 2} ${CY - 122}
             L ${CX + 2} ${CY - 108}
             C ${CX + 3} ${CY - 80} ${CX + 2} ${CY - 40} ${CX - 1} ${CY + 2}
             Z`}
          fill={BLUE}
        />
        <ellipse cx={CX + 6} cy={CY - 124} rx="11" ry="4" fill={BLUE} />
      </g>

      <g>
        <ellipse cx={CX - 2} cy={CY + 14} rx="14" ry="18" fill="#12121a" stroke={PURPLE} strokeWidth="1.2" />
        <rect x={CX - 12} y={CY + 2} width="22" height="24" rx="7" fill="#1c1c28" stroke={BLUE} strokeWidth="1" />
        <circle cx={CX - 2} cy={CY - 18} r="16" fill="#222230" stroke={PURPLE} strokeWidth="1.6" />
        <ellipse cx={CX - 2} cy={CY - 18} rx="9.5" ry="7.5" fill="#050e18" stroke={BLUE} strokeWidth="1.3" />
        <rect x={CX + 8} y={CY} width="10" height="14" rx="2" fill="#16161e" stroke={PURPLE} strokeWidth="0.8" />
        <path
          d={`M ${CX + 16} ${CY + 4}
             Q ${CX + 36} ${CY - 10} ${SHOULDER_X} ${SHOULDER_Y}`}
          fill="none"
          stroke="#4a3a5a"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <path
          d={`M ${CX + 16} ${CY + 4}
             Q ${CX + 36} ${CY - 10} ${SHOULDER_X} ${SHOULDER_Y}`}
          fill="none"
          stroke={PURPLE}
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.85"
        />
        <circle cx={CX - 2} cy={CY + 10} r="2.6" fill={BLUE} style={{ filter: `drop-shadow(0 0 5px ${BLUE})` }} />
      </g>

      <circle
        cx={SHOULDER_X}
        cy={SHOULDER_Y}
        r="9"
        fill="#1a1020"
        stroke={PURPLE}
        strokeWidth="2"
        style={{ filter: `drop-shadow(0 0 6px ${PURPLE})` }}
      />

      <g transform={`translate(${SHOULDER_X} ${SHOULDER_Y}) rotate(${second})`}>
        <line
          x1="0"
          y1="0"
          x2="0"
          y2="-58"
          stroke={YELLOW}
          strokeWidth="3.8"
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 10px ${YELLOW}) drop-shadow(0 0 16px ${YELLOW})` }}
        />
        <circle
          cx="0"
          cy="-64"
          r="6.5"
          fill={YELLOW}
          style={{ filter: `drop-shadow(0 0 12px ${YELLOW}) drop-shadow(0 0 20px ${YELLOW})` }}
        />
        <circle cx="0" cy="0" r="5" fill="#fff6a0" stroke={YELLOW} strokeWidth="2" />
      </g>
    </svg>
  );
}
