import { GREEN, HAND_RED, YELLOW } from './clockConstants';
import { getHandRotations } from '@/lib/clockPrefs';

function SwordHand({ rotation, length, tail, color, width }) {
  const tip = 200 - length;
  const back = 200 + tail;
  const w = width;
  return (
    <g transform={`rotate(${rotation}, 200, 200)`}>
      <polygon
        points={`${200 - w * 0.38},${back} ${200 + w * 0.38},${back} ${200 + w * 0.55},${200 + 10} ${200 + w * 0.28},${tip + 22} 200,${tip} ${200 - w * 0.28},${tip + 22} ${200 - w * 0.55},${200 + 10}`}
        fill={color}
        style={{ filter: `drop-shadow(0 0 8px ${color})` }}
      />
      <polygon
        points={`${200 - w * 0.16},${back - 2} ${200 + w * 0.16},${back - 2} ${200 + w * 0.12},${tip + 36} ${200 - w * 0.12},${tip + 36}`}
        fill="rgba(255,255,255,0.28)"
      />
      <circle cx="200" cy={tip + 26} r={Math.max(2.2, w * 0.18)} fill="#050505" stroke={color} strokeWidth="1.15" />
    </g>
  );
}

function SecondsHand({ rotation }) {
  return (
    <g transform={`rotate(${rotation}, 200, 200)`}>
      <line
        x1="200"
        y1="238"
        x2="200"
        y2="22"
        stroke={YELLOW}
        strokeWidth="1.6"
        strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 8px ${YELLOW}) drop-shadow(0 0 18px ${YELLOW})` }}
      />
      <circle cx="200" cy="238" r="4.6" fill={YELLOW} style={{ filter: `drop-shadow(0 0 8px ${YELLOW})` }} />
    </g>
  );
}

export default function ClockHands({ time, source = 'youneek' }) {
  const { hour, minute, second } = getHandRotations(time, source);

  return (
    <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full" style={{ overflow: 'visible' }}>
      <SwordHand rotation={hour} length={122} tail={32} color={GREEN} width="16" />
      <SwordHand rotation={minute} length={164} tail={36} color={HAND_RED} width="10" />
      <SecondsHand rotation={second} />
      <circle
        cx="200"
        cy="200"
        r="10"
        fill="#0a0a0a"
        stroke={GREEN}
        strokeWidth="2.2"
        style={{ filter: `drop-shadow(0 0 8px ${GREEN})` }}
      />
      <circle cx="200" cy="200" r="3.6" fill={YELLOW} style={{ filter: `drop-shadow(0 0 8px ${YELLOW})` }} />
    </svg>
  );
}
