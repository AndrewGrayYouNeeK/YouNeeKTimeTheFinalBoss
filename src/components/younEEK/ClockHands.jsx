import { LAVA, HAND_RED, YELLOW } from './clockConstants';
import { getHandRotations } from '@/lib/clockPrefs';

const CX = 200;
const CY = 200;

// Body sits lower so the shoulder pivots land at center height, offset left/right
const BODY_DROP = 30;
const L_SHOULDER_X = 174;
const L_SHOULDER_Y = 196;
const R_SHOULDER_X = 226;
const R_SHOULDER_Y = 196;

// Wide preview-style stance
const LEG_H = 122;
const LEG_W = 28;
const LEG_SPREAD_DEG = 34;
const HIP_Y = CY + 26;

const ARM_RATIO = 0.166;
const HOUR_ARM_H = 104;
const HOUR_ROD_TIP = 150;
const MIN_ARM_H = 122;
const MIN_ROD_TIP = 175;
const SEC_ROD_TIP = 178;

function BeamArm({ x, y, angle, armH, rodTip, color, clipId, mirror }) {
  const armW = armH * ARM_RATIO;
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle})`} style={{ filter: `drop-shadow(0 0 5px ${color}aa)` }}>
      {/* Beam first so the fist and fingers paint over it — the hand grips the bar */}
      <line x1="0" y1={-armH * 0.5} x2="0" y2={-rodTip} stroke={color} strokeWidth="4.5" strokeLinecap="round" />
      <line x1="0" y1={-armH * 0.5} x2="0" y2={-rodTip + 3} stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" opacity="0.85" />
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

      {/* Wide static stance like the concept art */}
      <g transform={`rotate(${LEG_SPREAD_DEG} ${CX - 10} ${HIP_Y})`} style={{ filter: 'drop-shadow(0 2px 6px #000000aa)' }}>
        <image
          href="/astro-leg.png"
          x={CX - 10 - LEG_W / 2}
          y={HIP_Y - 6}
          width={LEG_W}
          height={LEG_H}
          preserveAspectRatio="none"
        />
      </g>
      <g transform={`rotate(${-LEG_SPREAD_DEG} ${CX + 10} ${HIP_Y})`} style={{ filter: 'drop-shadow(0 2px 6px #000000aa)' }}>
        <image
          href="/astro-leg.png"
          x={CX + 10 - LEG_W / 2}
          y={HIP_Y - 6}
          width={LEG_W}
          height={LEG_H}
          preserveAspectRatio="none"
        />
      </g>

      {/* Torso with helmet, backpack, and glowing belt ring */}
      <image
        href="/astro-torso.png"
        x={CX - (92 * 0.719) / 2}
        y={CY - 92 * 0.8 + BODY_DROP}
        width={92 * 0.719}
        height={92}
        preserveAspectRatio="xMidYMid meet"
        style={{ filter: 'drop-shadow(0 2px 8px #000000cc)' }}
      />

      {/* Hour hand: left arm gripping a red beam */}
      <BeamArm x={L_SHOULDER_X} y={L_SHOULDER_Y} angle={hour} armH={HOUR_ARM_H} rodTip={HOUR_ROD_TIP} color={HAND_RED} clipId="armClipHour" mirror />

      {/* Minute hand: right arm gripping an orange beam */}
      <BeamArm x={R_SHOULDER_X} y={R_SHOULDER_Y} angle={minute} armH={MIN_ARM_H} rodTip={MIN_ROD_TIP} color={LAVA} clipId="armClipMin" />

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
