import { BLUE, PURPLE, YELLOW } from './clockConstants';
import { getHandRotations } from '@/lib/clockPrefs';

const CX = 200;
const CY = 200;
const SHOULDER_X = 248;
const SHOULDER_Y = 168;

export default function ClockHands({ time, source = 'youneek' }) {
  const { hour, minute, second } = getHandRotations(time, source);

  return (
    <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full" style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="suitGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#c8cdd8" />
          <stop offset="100%" stopColor="#6b7388" />
        </linearGradient>
        <linearGradient id="legPurp" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d0d4e0" />
          <stop offset="55%" stopColor={PURPLE} />
          <stop offset="100%" stopColor="#7a00c8" />
        </linearGradient>
        <linearGradient id="legBlue" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d0d4e0" />
          <stop offset="55%" stopColor={BLUE} />
          <stop offset="100%" stopColor="#0077cc" />
        </linearGradient>
      </defs>

      <g transform={`rotate(${hour} ${CX} ${CY})`} style={{ filter: `drop-shadow(0 0 8px ${PURPLE})` }}>
        <path
          d={`M ${CX - 10} ${CY + 8}
             C ${CX - 16} ${CY - 20} ${CX - 18} ${CY - 50} ${CX - 14} ${CY - 78}
             L ${CX - 22} ${CY - 96}
             L ${CX - 2} ${CY - 96}
             L ${CX - 6} ${CY - 78}
             C ${CX - 4} ${CY - 50} ${CX - 2} ${CY - 20} ${CX} ${CY + 8}
             Z`}
          fill="url(#legPurp)"
        />
        <ellipse cx={CX - 11} cy={CY - 98} rx="12" ry="5" fill="#2a2a38" stroke={PURPLE} strokeWidth="1.2" />
      </g>

      <g transform={`rotate(${minute} ${CX} ${CY})`} style={{ filter: `drop-shadow(0 0 8px ${BLUE})` }}>
        <path
          d={`M ${CX + 8} ${CY + 8}
             C ${CX + 16} ${CY - 30} ${CX + 18} ${CY - 70} ${CX + 14} ${CY - 108}
             L ${CX + 24} ${CY - 128}
             L ${CX + 2} ${CY - 128}
             L ${CX + 6} ${CY - 108}
             C ${CX + 8} ${CY - 70} ${CX + 6} ${CY - 30} ${CX - 2} ${CY + 8}
             Z`}
          fill="url(#legBlue)"
        />
        <ellipse cx={CX + 12} cy={CY - 130} rx="13" ry="5" fill="#2a2a38" stroke={BLUE} strokeWidth="1.2" />
      </g>

      <g>
        <ellipse cx={CX} cy={CY + 22} rx="20" ry="26" fill="url(#suitGrad)" stroke="#9aa3b5" strokeWidth="1.2" />
        <rect x={CX - 16} y={CY + 4} width="32" height="36" rx="10" fill="#b8bfce" stroke="#8a93a8" strokeWidth="1" />
        <rect x={CX + 12} y={CY + 8} width="14" height="22" rx="4" fill="#6a7184" stroke={PURPLE} strokeWidth="1" />
        <circle cx={CX} cy={CY - 18} r="22" fill="#d6dbe6" stroke="#9aa3b5" strokeWidth="2" />
        <circle cx={CX} cy={CY - 18} r="18" fill="#1a2438" stroke={BLUE} strokeWidth="1.5" />
        <ellipse cx={CX} cy={CY - 20} rx="12" ry="10" fill="#0a1528" stroke="#4af0ff66" strokeWidth="1" />
        <path
          d={`M ${CX + 14} ${CY + 10}
             Q ${CX + 32} ${CY - 2} ${SHOULDER_X} ${SHOULDER_Y}`}
          fill="none"
          stroke="#b8bfce"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path
          d={`M ${CX + 14} ${CY + 10}
             Q ${CX + 32} ${CY - 2} ${SHOULDER_X} ${SHOULDER_Y}`}
          fill="none"
          stroke={PURPLE}
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.7"
        />
        <circle
          cx={CX}
          cy={CY + 16}
          r="7"
          fill="#0a0a12"
          stroke={PURPLE}
          strokeWidth="2"
          style={{ filter: `drop-shadow(0 0 6px ${PURPLE}) drop-shadow(0 0 4px ${BLUE})` }}
        />
        <circle cx={CX} cy={CY + 16} r="3" fill={BLUE} />
      </g>

      <circle
        cx={SHOULDER_X}
        cy={SHOULDER_Y}
        r="8"
        fill="#c8cdd8"
        stroke={PURPLE}
        strokeWidth="2"
        style={{ filter: `drop-shadow(0 0 6px ${PURPLE})` }}
      />

      <g transform={`translate(${SHOULDER_X} ${SHOULDER_Y}) rotate(${second})`}>
        <line
          x1="0"
          y1="0"
          x2="0"
          y2="-70"
          stroke={YELLOW}
          strokeWidth="4"
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 12px ${YELLOW}) drop-shadow(0 0 22px ${YELLOW})` }}
        />
        <circle
          cx="0"
          cy="-76"
          r="6"
          fill={YELLOW}
          style={{ filter: `drop-shadow(0 0 14px ${YELLOW}) drop-shadow(0 0 24px ${YELLOW})` }}
        />
        <circle cx="0" cy="0" r="5" fill="#fff6a0" stroke={YELLOW} strokeWidth="1.5" />
      </g>
    </svg>
  );
}
