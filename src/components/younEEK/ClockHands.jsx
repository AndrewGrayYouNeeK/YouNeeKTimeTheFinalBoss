import { getHandRotations } from '@/lib/clockPrefs';

const CX = 200;
const CY = 200;
const ORANGE = '#FF9F0A';

function Hub() {
  return (
    <g>
      <circle cx={CX} cy={CY} r="11" fill="#1c1c1e" />
      <circle cx={CX} cy={CY} r="5.5" fill={ORANGE} />
    </g>
  );
}

function AppleHands({ hour, minute, second, omitSeconds }) {
  return (
    <g>
      <g transform={`rotate(${hour} ${CX} ${CY})`}>
        <line x1={CX} y1={CY + 18} x2={CX} y2={CY - 88} stroke="#ffffff" strokeWidth="14" strokeLinecap="round" />
        <line x1={CX} y1={CY + 18} x2={CX} y2={CY - 88} stroke="#1c1c1e" strokeWidth="10" strokeLinecap="round" />
      </g>
      <g transform={`rotate(${minute} ${CX} ${CY})`}>
        <line x1={CX} y1={CY + 22} x2={CX} y2={CY - 132} stroke="#ffffff" strokeWidth="11" strokeLinecap="round" />
        <line x1={CX} y1={CY + 22} x2={CX} y2={CY - 132} stroke="#1c1c1e" strokeWidth="7" strokeLinecap="round" />
      </g>
      {!omitSeconds && (
        <g transform={`rotate(${second} ${CX} ${CY})`}>
          <line x1={CX} y1={CY + 32} x2={CX} y2={CY - 148} stroke={ORANGE} strokeWidth="2.6" strokeLinecap="round" />
        </g>
      )}
      <Hub />
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

function RingDartHands({ hour, minute, second, omitSeconds }) {
  const hourSpan = ((hour % 360) + 360) % 360 || 0.01;
  const minuteSpan = ((minute % 360) + 360) % 360 || 0.01;
  return (
    <g>
      <path d={ringArc(118, hourSpan)} fill="none" stroke="#1c1c1e" strokeWidth="8" strokeLinecap="round" />
      <path d={ringArc(148, minuteSpan)} fill="none" stroke="#8e8e93" strokeWidth="5" strokeLinecap="round" />
      {!omitSeconds && (
        <g transform={`rotate(${second} ${CX} ${CY})`}>
          <line x1={CX} y1={CY + 20} x2={CX} y2={CY - 148} stroke={ORANGE} strokeWidth="2.6" strokeLinecap="round" />
        </g>
      )}
      <Hub />
    </g>
  );
}

function Blade({ angle, length, width, color }) {
  return (
    <g transform={`rotate(${angle} ${CX} ${CY})`}>
      <polygon points={`${CX},${CY - length} ${CX - width},${CY + 8} ${CX + width},${CY + 8}`} fill={color} />
    </g>
  );
}

function CometHands({ hour, minute, second, omitSeconds }) {
  return (
    <g>
      <Blade angle={hour} length={96} width={7} color="#1c1c1e" />
      <Blade angle={minute} length={128} width={5} color="#3a3a3c" />
      {!omitSeconds && (
        <g transform={`rotate(${second} ${CX} ${CY})`}>
          <line x1={CX} y1={CY + 20} x2={CX} y2={CY - 148} stroke={ORANGE} strokeWidth="2.6" strokeLinecap="round" />
        </g>
      )}
      <Hub />
    </g>
  );
}

export default function ClockHands({ time, source = 'youneek', handStyle = 'needle', omitSeconds = false }) {
  const { hour, minute, second } = getHandRotations(time, source);
  const props = { hour, minute, second, omitSeconds };

  return (
    <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full" style={{ overflow: 'visible' }}>
      {handStyle === 'ring' && <RingDartHands {...props} />}
      {(handStyle === 'comet' || handStyle === 'pulse') && <CometHands {...props} />}
      {(handStyle === 'needle' || !['ring', 'comet', 'pulse'].includes(handStyle)) && <AppleHands {...props} />}
    </svg>
  );
}
