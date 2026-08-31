import { PURPLE, BLUE } from './clockConstants';
import { LAYER_SPEED, layerOffsetY, sceneOpacity } from '@/lib/parallax';

/** Dark volcano / lunar scene — the original hangar backdrop. */
export default function ShipHangarScene({ p, screenHeight, army = false }) {
  const opacity = sceneOpacity(p);
  const glowA = army ? '#9aa3ad' : BLUE;
  const glowB = army ? '#7a828c' : PURPLE;
  const hull = army ? '#2a2e34' : '#120c1c';
  const hullDeep = army ? '#1a1d22' : '#0a0610';

  const planetY = layerOffsetY(p, LAYER_SPEED.planet, screenHeight);
  const hullY = layerOffsetY(p, LAYER_SPEED.hull, screenHeight);
  const bayY = layerOffsetY(p, LAYER_SPEED.bay, screenHeight);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[1] overflow-hidden"
      style={{ opacity }}
      aria-hidden="true"
    >
      {/* Far-slow: volcano planet — main scene */}
      <div
        className="absolute inset-[-16%] will-change-transform"
        style={{
          backgroundImage: 'url(/astronaut-dial-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 45%',
          opacity: army ? 0.55 : 0.88,
          filter: army ? 'brightness(0.55) saturate(0.35) grayscale(0.35)' : 'brightness(0.72) saturate(0.9)',
          transform: `translate3d(0, ${planetY}px, 0)`,
        }}
      />

      {/* Soft volcano wash from the erupting bg asset */}
      <div
        className="absolute inset-[-10%] will-change-transform"
        style={{
          backgroundImage: 'url(/volcano-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center bottom',
          opacity: army ? 0.18 : 0.28,
          mixBlendMode: 'screen',
          filter: army ? 'grayscale(0.5) brightness(0.6)' : 'brightness(0.65) saturate(0.85)',
          transform: `translate3d(0, ${planetY * 0.85}px, 0)`,
        }}
      />

      {/* Medium: dark ship framing — stays darker than the dial */}
      <svg
        className="absolute inset-0 h-full w-full will-change-transform"
        viewBox="0 0 390 844"
        preserveAspectRatio="xMidYMid slice"
        style={{ transform: `translate3d(0, ${hullY}px, 0)` }}
      >
        <defs>
          <linearGradient id="hullShade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={hullDeep} stopOpacity="0.75" />
            <stop offset="100%" stopColor={hull} stopOpacity="0.55" />
          </linearGradient>
        </defs>
        <path d="M0 80 L55 200 L55 900 L0 900 Z" fill="url(#hullShade)" />
        <path d="M390 80 L335 200 L335 900 L390 900 Z" fill="url(#hullShade)" />
        <path
          d="M30 160 Q195 90 360 160 L335 200 Q195 140 55 200 Z"
          fill={hullDeep}
          opacity="0.55"
        />
      </svg>

      {/* Near-faster: hangar bay mouth + floor lights */}
      <svg
        className="absolute inset-0 h-full w-full will-change-transform"
        viewBox="0 0 390 844"
        preserveAspectRatio="xMidYMid slice"
        style={{ transform: `translate3d(0, ${bayY}px, 0)` }}
      >
        <defs>
          <radialGradient id="bayGlow" cx="50%" cy="58%" r="42%">
            <stop offset="0%" stopColor={glowA} stopOpacity="0.4" />
            <stop offset="45%" stopColor={glowB} stopOpacity="0.18" />
            <stop offset="100%" stopColor="#000" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="bayMouth" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={glowA} stopOpacity="0.85" />
            <stop offset="100%" stopColor={glowB} stopOpacity="0.7" />
          </linearGradient>
        </defs>
        <ellipse cx="195" cy="560" rx="120" ry="80" fill="url(#bayGlow)" />
        <ellipse
          cx="195"
          cy="560"
          rx="88"
          ry="52"
          fill="#050508"
          stroke="url(#bayMouth)"
          strokeWidth="3"
          opacity="0.9"
        />
        <ellipse cx="195" cy="560" rx="64" ry="36" fill="#000" opacity="0.7" />
        <rect x="148" y="660" width="7" height="80" rx="2" fill={glowA} opacity="0.28" />
        <rect x="235" y="660" width="7" height="80" rx="2" fill={glowB} opacity="0.28" />
      </svg>

      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, #000 0%, transparent 20%, transparent 70%, #000000bb 100%)',
        }}
      />
    </div>
  );
}
