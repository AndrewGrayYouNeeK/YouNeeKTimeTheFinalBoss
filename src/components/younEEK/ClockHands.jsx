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
          <stop offset="0%" stopColor="#e2e6ef" />
          <stop offset="55%" stopColor="#aab2c4" />
          <stop offset="100%" stopColor="#646c80" />
        </linearGradient>
        <linearGradient id="legPurp" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e0e4ee" />
          <stop offset="45%" stopColor={PURPLE} />
          <stop offset="100%" stopColor="#6a00b8" />
        </linearGradient>
        <linearGradient id="legBlue" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e0e4ee" />
          <stop offset="45%" stopColor={BLUE} />
          <stop offset="100%" stopColor="#0068c0" />
        </linearGradient>
        <radialGradient id="visorGrad" cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#1e3a5c" />
          <stop offset="45%" stopColor="#0a1a30" />
          <stop offset="100%" stopColor="#030a16" />
        </radialGradient>
        <radialGradient id="glowTip" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fffef0" />
          <stop offset="45%" stopColor={YELLOW} />
          <stop offset="100%" stopColor="#ffb300" />
        </radialGradient>
      </defs>

      <g transform={`rotate(${hour} ${CX} ${CY})`} style={{ filter: `drop-shadow(0 0 6px ${PURPLE}) drop-shadow(0 0 14px ${PURPLE}88)` }}>
        <path
          d={`M ${CX - 10} ${CY + 8}
             C ${CX - 16} ${CY - 20} ${CX - 18} ${CY - 50} ${CX - 14} ${CY - 78}
             L ${CX - 22} ${CY - 96}
             L ${CX - 2} ${CY - 96}
             L ${CX - 6} ${CY - 78}
             C ${CX - 4} ${CY - 50} ${CX - 2} ${CY - 20} ${CX} ${CY + 8}
             Z`}
          fill="url(#legPurp)"
          stroke="#ffffff2e"
          strokeWidth="0.8"
        />
        <ellipse cx={CX - 11} cy={CY - 98} rx="12" ry="5" fill="#20202e" stroke={PURPLE} strokeWidth="1.4" />
        <ellipse cx={CX - 11} cy={CY - 99} rx="7" ry="2.4" fill={`${PURPLE}55`} />
      </g>

      <g transform={`rotate(${minute} ${CX} ${CY})`} style={{ filter: `drop-shadow(0 0 6px ${BLUE}) drop-shadow(0 0 14px ${BLUE}88)` }}>
        <path
          d={`M ${CX + 8} ${CY + 8}
             C ${CX + 16} ${CY - 30} ${CX + 18} ${CY - 70} ${CX + 14} ${CY - 108}
             L ${CX + 24} ${CY - 128}
             L ${CX + 2} ${CY - 128}
             L ${CX + 6} ${CY - 108}
             C ${CX + 8} ${CY - 70} ${CX + 6} ${CY - 30} ${CX - 2} ${CY + 8}
             Z`}
          fill="url(#legBlue)"
          stroke="#ffffff2e"
          strokeWidth="0.8"
        />
        <ellipse cx={CX + 12} cy={CY - 130} rx="13" ry="5" fill="#20202e" stroke={BLUE} strokeWidth="1.4" />
        <ellipse cx={CX + 12} cy={CY - 131} rx="8" ry="2.4" fill={`${BLUE}55`} />
      </g>

      <g style={{ filter: 'drop-shadow(0 2px 6px #00000088)' }}>
        <rect x={CX - 20} y={CY - 8} width="12" height="30" rx="4" fill="#767e92" stroke="#565e72" strokeWidth="1" />
        <ellipse cx={CX} cy={CY + 22} rx="20" ry="26" fill="url(#suitGrad)" stroke="#9aa3b5" strokeWidth="1.2" />
        <rect x={CX - 16} y={CY + 4} width="32" height="36" rx="10" fill="#c4cbd9" stroke="#8a93a8" strokeWidth="1" />
        <rect x={CX - 10} y={CY + 10} width="20" height="12" rx="3" fill="#2a3040" stroke="#565e72" strokeWidth="0.8" />
        <circle cx={CX - 5} cy={CY + 16} r="1.6" fill={BLUE} style={{ filter: `drop-shadow(0 0 3px ${BLUE})` }} />
        <circle cx={CX} cy={CY + 16} r="1.6" fill={YELLOW} style={{ filter: `drop-shadow(0 0 3px ${YELLOW})` }} />
        <circle cx={CX + 5} cy={CY + 16} r="1.6" fill={PURPLE} style={{ filter: `drop-shadow(0 0 3px ${PURPLE})` }} />
        <rect x={CX + 12} y={CY + 8} width="14" height="22" rx="4" fill="#767e92" stroke={PURPLE} strokeWidth="1" />

        <circle cx={CX} cy={CY - 18} r="22" fill="url(#suitGrad)" stroke="#9aa3b5" strokeWidth="2" />
        <circle cx={CX} cy={CY - 18} r="18" fill="url(#visorGrad)" stroke={BLUE} strokeWidth="1.6" style={{ filter: `drop-shadow(0 0 6px ${BLUE}66)` }} />
        <ellipse cx={CX - 6} cy={CY - 25} rx="7" ry="4" fill="#4af0ff33" transform={`rotate(-24 ${CX - 6} ${CY - 25})`} />
        <ellipse cx={CX + 4} cy={CY - 12} rx="10" ry="6" fill="#4af0ff14" transform={`rotate(-24 ${CX + 4} ${CY - 12})`} />

        <path
          d={`M ${CX + 14} ${CY + 10}
             Q ${CX + 32} ${CY - 2} ${SHOULDER_X} ${SHOULDER_Y}`}
          fill="none"
          stroke="url(#suitGrad)"
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
        fill="url(#suitGrad)"
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
          strokeWidth="10"
          strokeLinecap="round"
          opacity="0.28"
          style={{ filter: 'blur(3px)' }}
        />
        <line
          x1="0"
          y1="0"
          x2="0"
          y2="-70"
          stroke={YELLOW}
          strokeWidth="4.5"
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 12px ${YELLOW}) drop-shadow(0 0 22px ${YELLOW})` }}
        />
        <line
          x1="0"
          y1="-6"
          x2="0"
          y2="-66"
          stroke="#fffcdc"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <circle
          cx="0"
          cy="-76"
          r="6.5"
          fill="url(#glowTip)"
          style={{ filter: `drop-shadow(0 0 14px ${YELLOW}) drop-shadow(0 0 26px ${YELLOW}aa)` }}
        />
        <circle cx="0" cy="0" r="5" fill="#fff6a0" stroke={YELLOW} strokeWidth="1.5" style={{ filter: `drop-shadow(0 0 8px ${YELLOW})` }} />
      </g>
    </svg>
  );
}
