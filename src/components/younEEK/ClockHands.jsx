import { BLUE, PURPLE, YELLOW } from './clockConstants';
import { getHandRotations } from '@/lib/clockPrefs';

const CX = 200;
const CY = 200;

// Right shoulder of the torso art — the seconds arm pivots here, up and right of center
const SHOULDER_X = 226;
const SHOULDER_Y = 166;

// Trimmed art aspect ratios (width / height)
const ARM_RATIO = 0.166;

const HOUR_LEG_H = 104;
const MIN_LEG_H = 134;
const HOUR_LEG_W = 26;
const MIN_LEG_W = 30;
const ARM_H = 128;
const ROD_TIP = 148;

const TORSO_H = 92;
const TORSO_W = 92 * 0.719;

export default function ClockHands({ time, source = 'youneek' }) {
  const { hour, minute, second } = getHandRotations(time, source);

  const armW = ARM_H * ARM_RATIO;

  return (
    <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full" style={{ overflow: 'visible' }}>
      {/* Hour leg: image points down from the hip, so add 180 to aim it at the hour angle */}
      <g transform={`rotate(${hour + 180} ${CX} ${CY})`} style={{ filter: `drop-shadow(0 0 6px ${PURPLE}) drop-shadow(0 0 12px ${PURPLE}66)` }}>
        <image
          href="/astro-leg.png"
          x={CX - HOUR_LEG_W / 2}
          y={CY - 14}
          width={HOUR_LEG_W}
          height={HOUR_LEG_H}
          preserveAspectRatio="none"
        />
      </g>

      {/* Minute leg */}
      <g transform={`rotate(${minute + 180} ${CX} ${CY})`} style={{ filter: `drop-shadow(0 0 6px ${BLUE}) drop-shadow(0 0 12px ${BLUE}66)` }}>
        <image
          href="/astro-leg.png"
          x={CX - MIN_LEG_W / 2}
          y={CY - 14}
          width={MIN_LEG_W}
          height={MIN_LEG_H}
          preserveAspectRatio="none"
        />
      </g>

      {/* Torso with helmet, backpack, and glowing belt ring sitting on the pivot */}
      <image
        href="/astro-torso.png"
        x={CX - TORSO_W / 2}
        y={CY - TORSO_H * 0.8}
        width={TORSO_W}
        height={TORSO_H}
        preserveAspectRatio="xMidYMid meet"
        style={{ filter: 'drop-shadow(0 2px 8px #000000cc)' }}
      />

      {/* Seconds arm with the glowing rod, swinging from the off-center shoulder */}
      <g transform={`translate(${SHOULDER_X} ${SHOULDER_Y}) rotate(${second})`} style={{ filter: `drop-shadow(0 0 8px ${YELLOW}) drop-shadow(0 0 18px ${YELLOW}aa)` }}>
        <line
          x1="0"
          y1={-ARM_H * 0.55}
          x2="0"
          y2={-ROD_TIP}
          stroke={YELLOW}
          strokeWidth="9"
          strokeLinecap="round"
          opacity="0.35"
          style={{ filter: 'blur(3px)' }}
        />
        <line
          x1="0"
          y1={-ARM_H * 0.55}
          x2="0"
          y2={-ROD_TIP}
          stroke={YELLOW}
          strokeWidth="4"
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 10px ${YELLOW}) drop-shadow(0 0 20px ${YELLOW})` }}
        />
        <line
          x1="0"
          y1={-ARM_H * 0.55}
          x2="0"
          y2={-ROD_TIP + 4}
          stroke="#fffbe2"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <circle
          cx="0"
          cy={-ROD_TIP - 3}
          r="5"
          fill="#fffef2"
          style={{ filter: `drop-shadow(0 0 12px ${YELLOW}) drop-shadow(0 0 24px ${YELLOW})` }}
        />
        <image
          href="/astro-arm.png"
          x={-armW / 2}
          y={-ARM_H}
          width={armW}
          height={ARM_H}
          preserveAspectRatio="xMidYMid meet"
          style={{ filter: 'brightness(1.12)' }}
        />
      </g>

      <circle
        cx={SHOULDER_X}
        cy={SHOULDER_Y}
        r="3.5"
        fill="#e8ecf4"
        stroke={YELLOW}
        strokeWidth="1"
        opacity="0.9"
      />
    </svg>
  );
}
