import { BLUE, PURPLE, YELLOW } from './clockConstants';
import { getHandRotations } from '@/lib/clockPrefs';

const CX = 200;
const CY = 200;

// Shoulder pivots on the torso art — both off-center
const L_SHOULDER_X = 174;
const L_SHOULDER_Y = 166;
const R_SHOULDER_X = 226;
const R_SHOULDER_Y = 166;

// Static standing legs
const LEG_H = 118;
const LEG_W = 28;
const LEG_SPREAD_DEG = 20;

const ARM_RATIO = 0.166;
const HOUR_ARM_H = 104;
const HOUR_ROD_TIP = 118;
const MIN_ARM_H = 122;
const MIN_ROD_TIP = 150;
const SEC_ROD_TIP = 152;

function BeamArm({ x, y, angle, armH, rodTip, color, clipId, mirror }) {
  const armW = armH * ARM_RATIO;
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle})`} style={{ filter: `drop-shadow(0 0 5px ${color}aa)` }}>
      <g transform={mirror ? 'scale(-1 1)' : undefined}>
        <image
          href="/astro-arm.png"
          x={-armW / 2}
          y={-armH}
          width={armW}
          height={armH}
          preserveAspectRatio="xMidYMid meet"
          clipPath={`url(#${clipId})`}
        />
      </g>
      <line x1="0" y1={-armH * 0.58} x2="0" y2={-rodTip} stroke={color} strokeWidth="4.5" strokeLinecap="round" />
      <line x1="0" y1={-armH * 0.58} x2="0" y2={-rodTip + 3} stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" opacity="0.85" />
    </g>
  );
}

export default function ClockHands({ time, source = 'youneek' }) {
  const { hour, minute, second } = getHandRotations(time, source);

  return (
    <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full" style={{ overflow: 'visible' }}>
      <defs>
        {/* Hide the painted rod above each fist so only the clean colored beam shows */}
        <clipPath id="armClipHour">
          <rect x={-HOUR_ARM_H * ARM_RATIO} y={-HOUR_ARM_H * 0.72} width={HOUR_ARM_H * ARM_RATIO * 2} height={HOUR_ARM_H * 0.72 + 5} />
        </clipPath>
        <clipPath id="armClipMin">
          <rect x={-MIN_ARM_H * ARM_RATIO} y={-MIN_ARM_H * 0.72} width={MIN_ARM_H * ARM_RATIO * 2} height={MIN_ARM_H * 0.72 + 5} />
        </clipPath>
      </defs>

      {/* Static legs in a natural standing stance */}
      <g transform={`rotate(${LEG_SPREAD_DEG} ${CX - 9} ${CY})`} style={{ filter: 'drop-shadow(0 2px 6px #000000aa)' }}>
        <image
          href="/astro-leg.png"
          x={CX - 9 - LEG_W / 2}
          y={CY - 6}
          width={LEG_W}
          height={LEG_H}
          preserveAspectRatio="none"
        />
      </g>
      <g transform={`rotate(${-LEG_SPREAD_DEG} ${CX + 9} ${CY})`} style={{ filter: 'drop-shadow(0 2px 6px #000000aa)' }}>
        <image
          href="/astro-leg.png"
          x={CX + 9 - LEG_W / 2}
          y={CY - 6}
          width={LEG_W}
          height={LEG_H}
          preserveAspectRatio="none"
        />
      </g>

      {/* Torso with helmet, backpack, and glowing belt ring */}
      <image
        href="/astro-torso.png"
        x={CX - (92 * 0.719) / 2}
        y={CY - 92 * 0.8}
        width={92 * 0.719}
        height={92}
        preserveAspectRatio="xMidYMid meet"
        style={{ filter: 'drop-shadow(0 2px 8px #000000cc)' }}
      />

      {/* Hour hand: left arm holding a purple beam */}
      <BeamArm x={L_SHOULDER_X} y={L_SHOULDER_Y} angle={hour} armH={HOUR_ARM_H} rodTip={HOUR_ROD_TIP} color={PURPLE} clipId="armClipHour" mirror />

      {/* Minute hand: right arm holding a blue beam */}
      <BeamArm x={R_SHOULDER_X} y={R_SHOULDER_Y} angle={minute} armH={MIN_ARM_H} rodTip={MIN_ROD_TIP} color={BLUE} clipId="armClipMin" />

      {/* Seconds: extra-bright yellow beam from the right shoulder */}
      <g transform={`translate(${R_SHOULDER_X} ${R_SHOULDER_Y}) rotate(${second})`}>
        <line
          x1="0"
          y1="-8"
          x2="0"
          y2={-SEC_ROD_TIP}
          stroke={YELLOW}
          strokeWidth="5"
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 5px ${YELLOW}) drop-shadow(0 0 10px ${YELLOW}cc)` }}
        />
        <line
          x1="0"
          y1="-10"
          x2="0"
          y2={-SEC_ROD_TIP + 3}
          stroke="#ffffff"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
