import { BLUE, PURPLE, YELLOW, ARMY_CYAN } from './clockConstants';
import { getHandRotations } from '@/lib/clockPrefs';
import {
  L_SHOULDER, R_SHOULDER, ARM_RATIO, HOUR_ARM_LEN, MINUTE_ARM_LEN,
} from './astronautGeometry';

const CX = 200;
const CY = 200;
const CYAN = ARMY_CYAN;
const MAGENTA = PURPLE;

function ShoulderPivots({ color }) {
  return (
    <g>
      {[L_SHOULDER, R_SHOULDER].map((p) => (
        <circle key={p.x} cx={p.x} cy={p.y} r="4" fill="#0a0a0a" stroke={color} strokeWidth="1.6"
          style={{ filter: `drop-shadow(0 0 4px ${color})` }} />
      ))}
    </g>
  );
}

// The astronaut's arm (with its glowing saber) is the hand. It rotates around the shoulder.
function AstroArm({ shoulder, angle, length, color, mirror }) {
  const w = length * ARM_RATIO;
  return (
    <g transform={`translate(${shoulder.x} ${shoulder.y}) rotate(${angle})`}
      style={{ filter: `drop-shadow(0 0 5px ${color}) drop-shadow(0 0 2px ${color})` }}>
      <g transform={mirror ? 'scale(-1 1)' : undefined}>
        <image href="/astro-arm.webp" x={-w / 2} y={-length} width={w} height={length} />
      </g>
    </g>
  );
}

function GlowHands({ hour, minute }) {
  return (
    <g>
      <AstroArm shoulder={L_SHOULDER} angle={hour} length={HOUR_ARM_LEN} color={BLUE} mirror />
      <AstroArm shoulder={R_SHOULDER} angle={minute} length={MINUTE_ARM_LEN} color={PURPLE} />
    </g>
  );
}

function YellowSeconds({ second, handStyle }) {
  if (handStyle === 'pulse') {
    const tick = Math.floor((((second % 360) + 360) % 360) / 6);
    const pulseAngle = tick * 6;
    const rad = ((pulseAngle - 90) * Math.PI) / 180;
    return (
      <g>
        <line
          x1={CX + Math.cos(rad) * 186}
          y1={CY + Math.sin(rad) * 186}
          x2={CX + Math.cos(rad) * 198}
          y2={CY + Math.sin(rad) * 198}
          stroke={YELLOW}
          strokeWidth="4.5"
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 10px ${YELLOW})` }}
        />
        <circle cx={CX + Math.cos(rad) * 198} cy={CY + Math.sin(rad) * 198} r="3" fill={YELLOW} />
      </g>
    );
  }
  if (handStyle === 'comet') {
    const a = ((second - 90) * Math.PI) / 180;
    const r = 176;
    const x = CX + Math.cos(a) * r;
    const y = CY + Math.sin(a) * r;
    const tx = CX + Math.cos(a) * (r - 28);
    const ty = CY + Math.sin(a) * (r - 28);
    return (
      <g>
        <defs>
          <linearGradient id="handCometTrail" x1={tx} y1={ty} x2={x} y2={y} gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={YELLOW} stopOpacity="0" />
            <stop offset="100%" stopColor={YELLOW} stopOpacity="1" />
          </linearGradient>
        </defs>
        <line x1={tx} y1={ty} x2={x} y2={y} stroke="url(#handCometTrail)" strokeWidth="3.2" strokeLinecap="round" />
        <circle cx={x} cy={y} r="4.2" fill={YELLOW} style={{ filter: `drop-shadow(0 0 8px ${YELLOW})` }} />
      </g>
    );
  }
  if (handStyle === 'ring') {
    return (
      <g transform={`rotate(${second} ${CX} ${CY})`}>
        <polygon points={`${CX},${CY - 178} ${CX - 5},${CY - 152} ${CX + 5},${CY - 152}`} fill={YELLOW}
          style={{ filter: `drop-shadow(0 0 6px ${YELLOW})` }} />
        <line x1={CX} y1={CY - 20} x2={CX} y2={CY - 152} stroke={YELLOW} strokeWidth="1.8" strokeLinecap="round" />
      </g>
    );
  }
  return (
    <g transform={`rotate(${second} ${CX} ${CY})`}>
      <line x1={CX} y1={CY + 16} x2={CX} y2={CY - 162} stroke={YELLOW} strokeWidth="1.7" strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 5px ${YELLOW})` }} />
    </g>
  );
}

function ringArc(radius, angleDeg) {
  const start = -Math.PI / 2;
  const end = start + (angleDeg * Math.PI) / 180;
  const x1 = CX + Math.cos(start) * radius;
  const y1 = CY + Math.sin(start) * radius;
  const x2 = CX + Math.cos(end) * radius;
  const y2 = CY + Math.sin(end) * radius;
  const large = angleDeg > 180 ? 1 : 0;
  return `M ${x1} ${y1} A ${radius} ${radius} 0 ${large} 1 ${x2} ${y2}`;
}

function RingDartHands({ hour, minute }) {
  const hourSpan = ((hour % 360) + 360) % 360 || 0.01;
  const minuteSpan = ((minute % 360) + 360) % 360 || 0.01;
  return (
    <g>
      <path d={ringArc(120, hourSpan)} fill="none" stroke={CYAN} strokeWidth="6" strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 4px ${CYAN}99)` }} />
      <path d={ringArc(131, minuteSpan)} fill="none" stroke={MAGENTA} strokeWidth="4" strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 4px ${MAGENTA}99)` }} />
      <ShoulderPivots color={PURPLE} />
    </g>
  );
}

function Blade({ shoulder, angle, length, width, color }) {
  const { x, y } = shoulder;
  return (
    <g transform={`rotate(${angle} ${x} ${y})`}>
      <polygon
        points={`${x},${y - length} ${x - width},${y + 4} ${x + width},${y + 4}`}
        fill={color}
        opacity="0.92"
        style={{ filter: `drop-shadow(0 0 5px ${color}aa)` }}
      />
    </g>
  );
}

function CometHands({ hour, minute }) {
  return (
    <g>
      <Blade shoulder={L_SHOULDER} angle={hour} length={92} width={6} color={CYAN} />
      <Blade shoulder={R_SHOULDER} angle={minute} length={124} width={4.5} color={MAGENTA} />
      <ShoulderPivots color={PURPLE} />
    </g>
  );
}

function PulseHands({ hour, minute }) {
  return (
    <g>
      <Blade shoulder={L_SHOULDER} angle={hour} length={88} width={5} color={CYAN} />
      <Blade shoulder={R_SHOULDER} angle={minute} length={120} width={4} color={MAGENTA} />
      <ShoulderPivots color={PURPLE} />
    </g>
  );
}

export default function ClockHands({ time, source = 'youneek', handStyle = 'needle', omitSeconds = false }) {
  const { hour, minute, second } = getHandRotations(time, source);
  const props = { hour, minute };
  const glow = handStyle === 'needle' || !['ring', 'comet', 'pulse'].includes(handStyle);

  return (
    <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full" style={{ overflow: 'visible' }}>
      {handStyle === 'ring' && <RingDartHands {...props} />}
      {handStyle === 'comet' && <CometHands {...props} />}
      {handStyle === 'pulse' && <PulseHands {...props} />}
      {glow && <GlowHands hour={hour} minute={minute} />}
      {!omitSeconds && !glow && <YellowSeconds second={second} handStyle={handStyle} />}
    </svg>
  );
}
