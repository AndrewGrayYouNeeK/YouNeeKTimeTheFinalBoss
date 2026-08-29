import { BLUE, PURPLE, YELLOW } from './clockConstants';
import { getHandRotations } from '@/lib/clockPrefs';

const CX = 200;
const CY = 200;

// Right shoulder of the torso art — the seconds arm pivots here, up and right of center
const SHOULDER_X = 226;
const SHOULDER_Y = 166;

const LEG_H = 126;
const LEG_W = 28;

const ARM_RATIO = 0.166;
const ARM_H = 128;
const ROD_TIP = 148;

export default function ClockHands({ time, source = 'youneek' }) {
  const { hour, minute, second } = getHandRotations(time, source);

  const armW = ARM_H * ARM_RATIO;

  return (
    <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full" style={{ overflow: 'visible' }}>
      <defs>
        {/* Hide the painted rod above the fist so only the clean beam shows */}
        <clipPath id="armClip">
          <rect x={-armW / 2 - 3} y={-ARM_H * 0.72} width={armW + 6} height={ARM_H * 0.72 + 4} />
        </clipPath>
      </defs>

      {/* Hour leg: image points down from the hip, so add 180 to aim it at the hour angle */}
      <g transform={`rotate(${hour + 180} ${CX} ${CY})`} style={{ filter: `drop-shadow(0 0 6px ${PURPLE}) drop-shadow(0 0 12px ${PURPLE}66)` }}>
        <image
          href="/astro-leg.png"
          x={CX - LEG_W / 2}
          y={CY - 14}
          width={LEG_W}
          height={LEG_H}
          preserveAspectRatio="none"
        />
      </g>

      {/* Minute leg */}
      <g transform={`rotate(${minute + 180} ${CX} ${CY})`} style={{ filter: `drop-shadow(0 0 6px ${BLUE}) drop-shadow(0 0 12px ${BLUE}66)` }}>
        <image
          href="/astro-leg.png"
          x={CX - LEG_W / 2}
          y={CY - 14}
          width={LEG_W}
          height={LEG_H}
          preserveAspectRatio="none"
        />
      </g>

      {/* Torso with helmet, backpack, and glowing belt ring sitting on the pivot */}
      <image
        href="/astro-torso.png"
        x={CX - (92 * 0.719) / 2}
        y={CY - 92 * 0.8}
        width={92 * 0.719}
        height={92}
        preserveAspectRatio="xMidYMid meet"
        style={{ filter: 'drop-shadow(0 2px 8px #000000cc)' }}
      />

      {/* Seconds arm holding a bright solid beam — no glow */}
      <g transform={`translate(${SHOULDER_X} ${SHOULDER_Y}) rotate(${second})`}>
        <image
          href="/astro-arm.png"
          x={-armW / 2}
          y={-ARM_H}
          width={armW}
          height={ARM_H}
          preserveAspectRatio="xMidYMid meet"
          clipPath="url(#armClip)"
        />
        <line
          x1="0"
          y1={-ARM_H * 0.58}
          x2="0"
          y2={-ROD_TIP}
          stroke={YELLOW}
          strokeWidth="4.5"
          strokeLinecap="round"
        />
        <line
          x1="0"
          y1={-ARM_H * 0.58}
          x2="0"
          y2={-ROD_TIP + 3}
          stroke="#fff9d0"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
