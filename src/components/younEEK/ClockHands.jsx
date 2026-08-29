import { BLUE, PURPLE, YELLOW } from './clockConstants';
import { getHandRotations } from '@/lib/clockPrefs';

const CX = 200;
const CY = 200;
const SHOULDER_X = 224;
const SHOULDER_Y = 176;

export default function ClockHands({ time, source = 'youneek' }) {
  const { hour, minute, second } = getHandRotations(time, source);

  return (
    <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full" style={{ overflow: 'visible' }}>
      <defs>
        <filter id="yellowGlow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g transform={`rotate(${hour}, ${CX}, ${CY})`} style={{ filter: `drop-shadow(0 0 7px ${PURPLE})` }}>
        <path
          d={`M ${CX - 6} ${CY}
             L ${CX - 9} ${CY - 70}
             L ${CX - 14} ${CY - 82}
             L ${CX + 2} ${CY - 82}
             L ${CX - 2} ${CY - 70}
             L ${CX} ${CY}
             Z`}
          fill={PURPLE}
        />
        <ellipse cx={CX - 5} cy={CY - 84} rx="9" ry="3.8" fill={PURPLE} />
      </g>

      <g transform={`rotate(${minute}, ${CX}, ${CY})`} style={{ filter: `drop-shadow(0 0 7px ${BLUE})` }}>
        <path
          d={`M ${CX + 4} ${CY}
             L ${CX + 7} ${CY - 105}
             L ${CX + 13} ${CY - 120}
             L ${CX - 3} ${CY - 120}
             L ${CX + 1} ${CY - 105}
             L ${CX - 1} ${CY}
             Z`}
          fill={BLUE}
        />
        <ellipse cx={CX + 4} cy={CY - 122} rx="10" ry="3.8" fill={BLUE} />
      </g>

      <g>
        <ellipse cx={CX} cy={CY + 10} rx="15" ry="20" fill="#14141c" stroke={PURPLE} strokeWidth="1.2" />
        <rect x={CX - 11} y={CY} width="22" height="26" rx="7" fill="#1e1e2a" stroke={BLUE} strokeWidth="1" />
        <circle cx={CX} cy={CY - 20} r="17" fill="#252533" stroke={PURPLE} strokeWidth="1.5" />
        <ellipse cx={CX} cy={CY - 20} rx="10" ry="8" fill="#061018" stroke={BLUE} strokeWidth="1.3" />
        <rect x={CX + 9} y={CY - 2} width="9" height="16" rx="2.5" fill="#181822" stroke={PURPLE} strokeWidth="0.8" />
        <circle cx={CX} cy={CY + 8} r="2.8" fill={BLUE} style={{ filter: `drop-shadow(0 0 5px ${BLUE})` }} />
      </g>

      <g transform={`rotate(${second}, ${SHOULDER_X}, ${SHOULDER_Y})`} filter="url(#yellowGlow)">
        <line
          x1={SHOULDER_X}
          y1={SHOULDER_Y}
          x2={SHOULDER_X}
          y2={SHOULDER_Y - 68}
          stroke={YELLOW}
          strokeWidth="3.4"
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 10px ${YELLOW}) drop-shadow(0 0 18px ${YELLOW})` }}
        />
        <circle
          cx={SHOULDER_X}
          cy={SHOULDER_Y - 74}
          r="5.5"
          fill={YELLOW}
          style={{ filter: `drop-shadow(0 0 12px ${YELLOW}) drop-shadow(0 0 22px ${YELLOW})` }}
        />
        <circle cx={SHOULDER_X} cy={SHOULDER_Y} r="4.2" fill="#fff6a0" stroke={YELLOW} strokeWidth="1.2" />
      </g>
    </svg>
  );
}
