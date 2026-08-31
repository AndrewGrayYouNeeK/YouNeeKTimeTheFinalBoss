import { PURPLE, BLUE } from './clockConstants';

export default function ShipHangarScene({ sceneFade, dock, parallax, army = false }) {
  const hull = army ? '#3a3d42' : '#1a1528';
  const hullDeep = army ? '#22252a' : '#0e0a18';
  const rib = army ? '#4a5058' : '#2a2240';
  const bay = army ? '#6b7280' : '#14101f';
  const glowA = army ? '#9aa3ad' : BLUE;
  const glowB = army ? '#7a828c' : PURPLE;
  const planetOpacity = 0.45 + dock * 0.4;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[1] overflow-hidden"
      style={{ opacity: sceneFade }}
      aria-hidden="true"
    >
      <div
        className="absolute inset-[-10%] will-change-transform"
        style={{
          backgroundImage: 'url(/astronaut-dial-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 55%',
          opacity: planetOpacity * 0.5,
          filter: 'brightness(0.5) saturate(0.8)',
          transform: `translate3d(0, ${parallax * 0.4}px, 0) scale(1.1)`,
        }}
      />

      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 390 844"
        preserveAspectRatio="xMidYMid slice"
        style={{ transform: `translate3d(0, ${parallax * 0.22}px, 0)` }}
      >
        <defs>
          <radialGradient id="bayGlow" cx="50%" cy="58%" r="42%">
            <stop offset="0%" stopColor={glowA} stopOpacity="0.55" />
            <stop offset="45%" stopColor={glowB} stopOpacity="0.22" />
            <stop offset="100%" stopColor="#000" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="hullShade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={hullDeep} />
            <stop offset="50%" stopColor={hull} />
            <stop offset="100%" stopColor={hullDeep} />
          </linearGradient>
          <linearGradient id="bayMouth" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={glowA} stopOpacity="0.9" />
            <stop offset="100%" stopColor={glowB} stopOpacity="0.75" />
          </linearGradient>
          <linearGradient id="topFade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#000" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#000" stopOpacity="0" />
          </linearGradient>
        </defs>

        <path d="M0 120 L70 220 L70 844 L0 844 Z" fill="url(#hullShade)" opacity="0.92" />
        <path d="M390 120 L320 220 L320 844 L390 844 Z" fill="url(#hullShade)" opacity="0.92" />
        {Array.from({ length: 14 }).map((_, i) => {
          const y = 240 + i * 42;
          return (
            <g key={i} opacity="0.55">
              <line x1="12" y1={y} x2="68" y2={y + 8} stroke={rib} strokeWidth="3" />
              <line x1="378" y1={y} x2="322" y2={y + 8} stroke={rib} strokeWidth="3" />
            </g>
          );
        })}

        <path
          d="M40 200 Q195 110 350 200 L320 230 Q195 160 70 230 Z"
          fill={hullDeep}
          opacity="0.88"
        />

        <path d="M55 250 L20 520 L55 520 Z" fill={bay} opacity="0.85" />
        <path d="M335 250 L370 520 L335 520 Z" fill={bay} opacity="0.85" />

        <ellipse cx="195" cy="520" rx="118" ry="78" fill="url(#bayGlow)" />
        <ellipse
          cx="195"
          cy="520"
          rx="92"
          ry="56"
          fill="#050508"
          stroke="url(#bayMouth)"
          strokeWidth="3.5"
          opacity="0.95"
        />
        <ellipse cx="195" cy="520" rx="70" ry="40" fill="#000" opacity="0.75" />

        <g opacity={0.35 + sceneFade * 0.4}>
          <rect x="150" y="620" width="8" height="90" rx="2" fill={glowA} opacity="0.35" />
          <rect x="232" y="620" width="8" height="90" rx="2" fill={glowB} opacity="0.35" />
          <rect x="110" y="700" width="170" height="4" rx="2" fill={glowA} opacity="0.25" />
        </g>

        <rect x="0" y="0" width="390" height="220" fill="url(#topFade)" />
      </svg>

      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, #000 0%, transparent 22%, transparent 70%, #000000bb 100%)',
        }}
      />
    </div>
  );
}
