import { GREEN, HAND_RED, YELLOW } from './clockConstants';
import { getHandRotations } from '@/lib/clockPrefs';

function FancyHand({ rotation, length, tail, color, width, hole = true }) {
  const tip = 200 - length;
  const back = 200 + tail;
  const w = width;
  return (
    <g transform={`rotate(${rotation}, 200, 200)`}>
      <polygon
        points={`200,${back} ${200 + w * 0.55},${200 + tail * 0.35} ${200 + w * 0.22},${tip + 18} 200,${tip} ${200 - w * 0.22},${tip + 18} ${200 - w * 0.55},${200 + tail * 0.35}`}
        fill={color}
        style={{ filter: `drop-shadow(0 0 7px ${color})` }}
      />
      <polygon
        points={`200,${back - 4} ${200 + w * 0.18},${200 + 8} ${200 - w * 0.18},${200 + 8}`}
        fill="#111"
        opacity="0.35"
      />
      <line
        x1="200"
        y1={back - 2}
        x2="200"
        y2={tip + 22}
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="0.9"
      />
      {hole && (
        <ellipse cx="200" cy={tip + 28} rx={w * 0.22} ry="5.5" fill="#050505" stroke={color} strokeWidth="1.1" />
      )}
    </g>
  );
}

function SecondsHand({ rotation }) {
  return (
    <g transform={`rotate(${rotation}, 200, 200)`}>
      <line
        x1="200"
        y1="236"
        x2="200"
        y2="28"
        stroke={YELLOW}
        strokeWidth="1.35"
        strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 8px ${YELLOW}) drop-shadow(0 0 16px ${YELLOW})` }}
      />
      <circle cx="200" cy="236" r="4.2" fill={YELLOW} style={{ filter: `drop-shadow(0 0 6px ${YELLOW})` }} />
      <circle cx="200" cy="200" r="3.2" fill={YELLOW} />
    </g>
  );
}

export default function ClockHands({ time, source = 'youneek' }) {
  const { hour, minute, second } = getHandRotations(time, source);

  return (
    <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full" style={{ overflow: 'visible' }}>
      <FancyHand rotation={hour} length={118} tail={28} color={GREEN} width="14" />
      <FancyHand rotation={minute} length={158} tail={32} color={HAND_RED} width="9" />
      <SecondsHand rotation={second} />
      <circle
        cx="200"
        cy="200"
        r="9.5"
        fill="#0a0a0a"
        stroke={GREEN}
        strokeWidth="2.4"
        style={{ filter: `drop-shadow(0 0 8px ${GREEN})` }}
      />
      <circle cx="200" cy="200" r="3.4" fill={YELLOW} style={{ filter: `drop-shadow(0 0 6px ${YELLOW})` }} />
    </svg>
  );
}
