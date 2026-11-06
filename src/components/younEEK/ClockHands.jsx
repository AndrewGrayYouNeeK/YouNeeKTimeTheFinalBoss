import { PURPLE, YELLOW, ARMY_CYAN } from './clockConstants';
import { getHandRotations } from '@/lib/clockPrefs';
import {
  L_SHOULDER, R_SHOULDER, ARM_RATIO, HOUR_ARM_LEN, MINUTE_ARM_LEN, ARM_SEG,
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

const LASER_BLUE = '#2f8bff';
const LASER_PURPLE = '#b84dff';

// Arm = short suit-arm from the shoulder + a lightning laser out to the tip. Rotates around the shoulder.
function AstroArm({ shoulder, angle, length, color, mirror }) {
  const segW = ARM_SEG * ARM_RATIO * 1.9;
  const beam = length - ARM_SEG + 6;
  const y0 = -ARM_SEG + 4;
  const zig = [];
  const n = 7;
  for (let i = 0; i <= n; i++) {
    const y = y0 - (beam * i) / n;
    const x = i === 0 || i === n ? 0 : (i % 2 ? 3.2 : -3.2);
    zig.push(`${x},${y}`);
  }
  return (
    <g transform={`translate(${shoulder.x} ${shoulder.y}) rotate(${angle})`}>
      <line x1="0" y1={y0} x2="0" y2={y0 - beam} stroke={color} strokeWidth="7" strokeLinecap="round" opacity="0.35"
        style={{ filter: `blur(2px)` }} />
      <line x1="0" y1={y0} x2="0" y2={y0 - beam} stroke={color} strokeWidth="3.2" strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 6px ${color}) drop-shadow(0 0 3px ${color})` }} />
      <polyline points={zig.join(' ')} fill="none" stroke="#ffffff" strokeWidth="1.1" strokeLinejoin="round" opacity="0.95" />
      <circle cx="0" cy={y0 - beam} r="3.4" fill="#fff" style={{ filter: `drop-shadow(0 0 6px ${color})` }} />
      <g transform={mirror ? 'scale(-1 1)' : undefined} style={{ filter: 'drop-shadow(0 0 2px #000)' }}>
        <image href="/astro-arm.webp" x={-segW / 2} y={-ARM_SEG - 2} width={segW} height={ARM_SEG + 6} preserveAspectRatio="none" />
      </g>
      <circle cx="0" cy={y0} r="3.6" fill={color} stroke="#fff" strokeWidth="0.8" style={{ filter: `drop-shadow(0 0 5px ${color})` }} />
    </g>
  );
}

function GlowHands({ hour, minute }) {
  return (
    <g>
      <AstroArm shoulder={L_SHOULDER} angle={hour} length={HOUR_ARM_LEN} color={LASER_BLUE} mirror />
      <AstroArm shoulder={R_SHOULDER} angle={minute} length={MINUTE_ARM_LEN} color={LASER_PURPLE} />
    </g>
  );
}

// Seconds: a lit notch travelling continuously around the rim, with a fading trail.
function RimSeconds({ second, count }) {
  const a = ((second % 360) + 360) % 360;
  const step = 360 / count;
  const trail = Array.from({ length: 8 }, (_, i) => i);
  const notch = (ang, op, w, key) => {
    const r = ((ang - 90) * Math.PI) / 180;
    return (
      <line key={key} x1={CX + Math.cos(r) * 184} y1={CY + Math.sin(r) * 184} x2={CX + Math.cos(r) * 198} y2={CY + Math.sin(r) * 198}
        stroke={YELLOW} strokeWidth={w} strokeLinecap="round" opacity={op}
        style={{ filter: `drop-shadow(0 0 ${op > 0.9 ? 9 : 4}px ${YELLOW})` }} />
    );
  };
  const lit = Math.floor(a / step) * step;
  return (
    <g>
      {trail.map((i) => notch(lit - i * step, i === 0 ? 1 : 0.55 - i * 0.065, i === 0 ? 4.5 : 2.6, `t${i}`))}
      {notch(a, 1, 3, 'smooth')}
      <circle cx={CX + Math.cos(((a - 90) * Math.PI) / 180) * 199} cy={CY + Math.sin(((a - 90) * Math.PI) / 180) * 199} r="3.2" fill="#fff8b0"
        style={{ filter: `drop-shadow(0 0 8px ${YELLOW})` }} />
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
      {!omitSeconds && <RimSeconds second={second} count={source === 'regular' ? 60 : 100} />}
    </svg>
  );
}
