import { ARMY_CYAN, PURPLE, YELLOW } from './clockConstants';
import { getHandRotations } from '@/lib/clockPrefs';

const CX = 200;
const CY = 200;
const CYAN = ARMY_CYAN;
const MAGENTA = PURPLE;

function PurpleYHub() {
  return (
    <g>
      <circle cx={CX} cy={CY} r="18" fill="#050505" stroke={PURPLE} strokeWidth="2.8"
        style={{ filter: `drop-shadow(0 0 6px ${PURPLE}88)` }} />
      <circle cx={CX} cy={CY} r="12.5" fill="#0a0a0a" stroke={PURPLE} strokeWidth="1.2" opacity="0.95" />
      {/* Purple Y */}
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
  // Thin yellow needle with hot tip
  return (
    <g transform={`rotate(${second} ${CX} ${CY})`}>
      <line
        x1={CX}
        y1={CY + 16}
        x2={CX}
        y2={CY - 162}
        stroke={YELLOW}
        strokeWidth="1.7"
        strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 5px ${YELLOW})` }}
      />
      <circle
        cx={CX}
        cy={CY - 166}
        r="3.2"
        fill="#fff6a0"
        stroke={YELLOW}
        strokeWidth="1.2"
        style={{ filter: `drop-shadow(0 0 8px ${YELLOW})` }}
      />
    </g>
  );
}

function NeedleHands({ hour, minute }) {
  return (
    <g>
      {/* Hour: short, fat, cyan */}
      <line x1={CX} y1={CY + 6} x2={CX} y2={CY - 78} stroke={CYAN} strokeWidth="7.5" strokeLinecap="round"
        transform={`rotate(${hour} ${CX} ${CY})`} style={{ filter: `drop-shadow(0 0 5px ${CYAN}aa)` }} />
      {/* Minute: long, thin, magenta */}
      <line x1={CX} y1={CY + 8} x2={CX} y2={CY - 138} stroke={MAGENTA} strokeWidth="2.8" strokeLinecap="round"
        transform={`rotate(${minute} ${CX} ${CY})`} style={{ filter: `drop-shadow(0 0 4px ${MAGENTA}aa)` }} />
      <PurpleYHub />
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

  return (
    <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full" style={{ overflow: 'visible' }}>
      {handStyle === 'ring' && <RingDartHands {...props} />}
      {handStyle === 'comet' && <CometHands {...props} />}
      {handStyle === 'pulse' && <PulseHands {...props} />}
      {(handStyle === 'needle' || !['ring', 'comet', 'pulse'].includes(handStyle)) && <NeedleHands {...props} />}
      {!omitSeconds && <YellowSeconds second={second} handStyle={handStyle} />}
    </svg>
  );
}
