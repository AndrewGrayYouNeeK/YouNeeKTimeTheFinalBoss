import { ARMY_CYAN, PURPLE, YELLOW } from './clockConstants';
import { getHandRotations } from '@/lib/clockPrefs';

const CX = 200;
const CY = 200;
const CYAN = ARMY_CYAN;
const MAGENTA = PURPLE;
const L_SHOULDER_X = 174;
const L_SHOULDER_Y = 166;
const R_SHOULDER_X = 226;
const R_SHOULDER_Y = 166;
const LEG_H = 122;
const LEG_W = 28;
const LEG_SPREAD_DEG = 32;
const HIP_Y = CY - 2;
const ARM_RATIO = 0.166;
const ARM_H = 104;
const ROD_TIP = 148;
const LEFT_ARM_ANGLE = 168;

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

function PurpleYHub() {
  return (
    <g>
      <circle cx={CX} cy={CY} r="18" fill="#050505" stroke={PURPLE} strokeWidth="2.8"
        style={{ filter: `drop-shadow(0 0 6px ${PURPLE}88)` }} />
      <circle cx={CX} cy={CY} r="12.5" fill="#0a0a0a" stroke={PURPLE} strokeWidth="1.2" opacity="0.95" />
      <path
        d={`M ${CX - 5.5} ${CY - 7} L ${CX} ${CY - 0.5} L ${CX + 5.5} ${CY - 7} M ${CX} ${CY - 0.5} L ${CX} ${CY + 7.5}`}
        stroke={PURPLE}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        style={{ filter: `drop-shadow(0 0 4px ${PURPLE})` }}
      />
    </g>
  );
}

function YellowPip({ second }) {
  const a = ((second - 90) * Math.PI) / 180;
  const r = 188;
  const x = CX + Math.cos(a) * r;
  const y = CY + Math.sin(a) * r;
  return (
    <circle
      cx={x}
      cy={y}
      r="4.5"
      fill={YELLOW}
      style={{ filter: `drop-shadow(0 0 10px ${YELLOW})` }}
    />
  );
}

function GlowStick({ angle }) {
  const armW = ARM_H * ARM_RATIO;
  return (
    <g transform={`translate(${R_SHOULDER_X} ${R_SHOULDER_Y}) rotate(${angle})`}>
      <line x1="0" y1={-ARM_H * 0.45} x2="0" y2={-ROD_TIP} stroke={YELLOW} strokeWidth="5" strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 12px ${YELLOW})` }} />
      <line x1="0" y1={-ARM_H * 0.45} x2="0" y2={-ROD_TIP + 4} stroke="#fff6a0" strokeWidth="1.8" strokeLinecap="round" />
      <g>
        <image
          href="/astro-arm.png"
          x={-armW / 2}
          y={-ARM_H}
          width={armW}
          height={ARM_H}
          preserveAspectRatio="xMidYMid meet"
        />
      </g>
    </g>
  );
}

function AstronautHands({ hour, minute, second, omitSeconds }) {
  const hourSpan = ((hour % 360) + 360) % 360 || 0.01;
  const minuteSpan = ((minute % 360) + 360) % 360 || 0.01;
  const armW = ARM_H * ARM_RATIO;
  return (
    <g>
      <path d={ringArc(154, hourSpan)} fill="none" stroke={CYAN} strokeWidth="7" strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 6px ${CYAN})` }} />
      <path d={ringArc(168, minuteSpan)} fill="none" stroke={MAGENTA} strokeWidth="3" strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 5px ${MAGENTA})` }} />

      <g transform={`rotate(${LEG_SPREAD_DEG} ${CX - 10} ${HIP_Y})`} style={{ filter: 'drop-shadow(0 2px 6px #000000aa)' }}>
        <image href="/astro-leg.png" x={CX - 10 - LEG_W / 2} y={HIP_Y - 6} width={LEG_W} height={LEG_H} preserveAspectRatio="none" />
      </g>
      <g transform={`rotate(${-LEG_SPREAD_DEG} ${CX + 10} ${HIP_Y})`} style={{ filter: 'drop-shadow(0 2px 6px #000000aa)' }}>
        <image href="/astro-leg.png" x={CX + 10 - LEG_W / 2} y={HIP_Y - 6} width={LEG_W} height={LEG_H} preserveAspectRatio="none" />
      </g>
      <g transform={`translate(${L_SHOULDER_X} ${L_SHOULDER_Y}) rotate(${LEFT_ARM_ANGLE})`}>
        <image href="/astro-arm.png" x={-armW / 2} y={-ARM_H} width={armW} height={ARM_H} preserveAspectRatio="xMidYMid meet" transform="scale(-1 1)" />
      </g>
      <image
        href="/astro-torso.png"
        x={CX - (92 * 0.719) / 2}
        y={CY - 92 * 0.8}
        width={92 * 0.719}
        height={92}
        preserveAspectRatio="xMidYMid meet"
        style={{ filter: 'drop-shadow(0 2px 8px #000000cc)' }}
      />
      <circle cx={CX} cy={CY} r="9" fill="#050505" stroke={CYAN} strokeWidth="2"
        style={{ filter: `drop-shadow(0 0 6px ${CYAN}88)` }} />
      <circle cx={CX} cy={CY} r="4" fill="#0a0a0a" stroke={PURPLE} strokeWidth="1.2" />

      {!omitSeconds && <GlowStick angle={second} />}
      {!omitSeconds && <YellowPip second={second} />}
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
  return null;
}

function RingDartHands({ hour, minute }) {
  const hourSpan = ((hour % 360) + 360) % 360 || 0.01;
  const minuteSpan = ((minute % 360) + 360) % 360 || 0.01;
  return (
    <g>
      <path d={ringArc(118, hourSpan)} fill="none" stroke={CYAN} strokeWidth="8" strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 4px ${CYAN}99)` }} />
      <path d={ringArc(148, minuteSpan)} fill="none" stroke={MAGENTA} strokeWidth="5" strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 4px ${MAGENTA}99)` }} />
      <PurpleYHub />
    </g>
  );
}

function Blade({ angle, length, width, color }) {
  return (
    <g transform={`rotate(${angle} ${CX} ${CY})`}>
      <polygon
        points={`${CX},${CY - length} ${CX - width},${CY + 8} ${CX + width},${CY + 8}`}
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
      <Blade angle={hour} length={96} width={7} color={CYAN} />
      <Blade angle={minute} length={128} width={5} color={MAGENTA} />
      <PurpleYHub />
    </g>
  );
}

function PulseHands({ hour, minute }) {
  return (
    <g>
      <Blade angle={hour} length={90} width={6} color={CYAN} />
      <Blade angle={minute} length={122} width={4.5} color={MAGENTA} />
      <PurpleYHub />
    </g>
  );
}

export default function ClockHands({ time, source = 'youneek', handStyle = 'needle', omitSeconds = false }) {
  const { hour, minute, second } = getHandRotations(time, source);
  const props = { hour, minute };
  const astronaut = handStyle === 'needle' || !['ring', 'comet', 'pulse'].includes(handStyle);

  return (
    <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full" style={{ overflow: 'visible' }}>
      {handStyle === 'ring' && <RingDartHands {...props} />}
      {handStyle === 'comet' && <CometHands {...props} />}
      {handStyle === 'pulse' && <PulseHands {...props} />}
      {astronaut && <AstronautHands hour={hour} minute={minute} second={second} omitSeconds={omitSeconds} />}
      {!omitSeconds && !astronaut && <YellowSeconds second={second} handStyle={handStyle} />}
    </svg>
  );
}
