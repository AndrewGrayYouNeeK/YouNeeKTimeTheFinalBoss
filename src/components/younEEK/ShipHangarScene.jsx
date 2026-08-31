import { PURPLE, BLUE } from './clockConstants';
import { LAYER_SPEED, layerOffsetY, sceneOpacity } from '@/lib/parallax';

export default function ShipHangarScene({ p, screenHeight, army = false }) {
  const opacity = sceneOpacity(p);
  const hull = army ? '#3a3d42' : '#1a1528';
  const hullDeep = army ? '#22252a' : '#0e0a18';
  const rib = army ? '#4a5058' : '#2a2240';
  const bay = army ? '#6b7280' : '#14101f';
  const glowA = army ? '#9aa3ad' : BLUE;
  const glowB = army ? '#7a828c' : PURPLE;

  const planetY = layerOffsetY(p, LAYER_SPEED.planet, screenHeight);
  const hullY = layerOffsetY(p, LAYER_SPEED.hull, screenHeight);
  const bayY = layerOffsetY(p, LAYER_SPEED.bay, screenHeight);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[1] overflow-hidden"
      style={{ opacity }}
      aria-hidden="true"
    >
      {/* 2. Volcano planet — slow */}
      <div
        className="absolute inset-[-14%] will-change-transform"
        style={{
          backgroundImage: 'url(/astronaut-dial-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 55%',
          opacity: 0.42,
          filter: 'brightness(0.48) saturate(0.75)',
          transform: `translate3d(0, ${planetY}px, 0)`,
        }}
      />

      {/* 3. Ship hull — medium */}
      <svg
        className="absolute inset-0 h-full w-full will-change-transform"
        viewBox="0 0 390 844"
        preserveAspectRatio="xMidYMid slice"
        style={{ transform: `translate3d(0, ${hullY}px, 0)` }}
      >
        <defs>
          <linearGradient id="hullShade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={hullDeep} />
            <stop offset="50%" stopColor={hull} />
            <stop offset="100%" stopColor={hullDeep} />
          </linearGradient>
          <linearGradient id="hallCyan" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={glowA} stopOpacity="0.5" />
            <stop offset="100%" stopColor={glowA} stopOpacity="0" />
          </linearGradient>
          <linearGradient id="hallMagenta" x1="1" y1="0" x2="0" y2="0">
            <stop offset="0%" stopColor={glowB} stopOpacity="0.5" />
            <stop offset="100%" stopColor={glowB} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M0 120 L70 220 L70 900 L0 900 Z" fill="url(#hullShade)" opacity="0.9" />
        <path d="M390 120 L320 220 L320 900 L390 900 Z" fill="url(#hullShade)" opacity="0.9" />
        <path d="M0 220 L70 280 L70 900 L0 900 Z" fill="url(#hallCyan)" opacity="0.32" />
        <path d="M390 220 L320 280 L320 900 L390 900 Z" fill="url(#hallMagenta)" opacity="0.32" />
        {Array.from({ length: 14 }).map((_, i) => {
          const y = 240 + i * 42;
          return (
            <g key={i} opacity="0.48">
              <line x1="12" y1={y} x2="68" y2={y + 8} stroke={rib} strokeWidth="3" />
              <line x1="378" y1={y} x2="322" y2={y + 8} stroke={rib} strokeWidth="3" />
            </g>
          );
        })}
        <path
          d="M40 200 Q195 110 350 200 L320 230 Q195 160 70 230 Z"
          fill={hullDeep}
          opacity="0.85"
        />
        <path d="M55 250 L20 520 L55 520 Z" fill={bay} opacity="0.78" />
        <path d="M335 250 L370 520 L335 520 Z" fill={bay} opacity="0.78" />
      </svg>

      {/* 4. Hangar bay + lights — faster */}
      <svg
        className="absolute inset-0 h-full w-full will-change-transform"
        viewBox="0 0 390 844"
        preserveAspectRatio="xMidYMid slice"
        style={{ transform: `translate3d(0, ${bayY}px, 0)` }}
      >
        <defs>
          <radialGradient id="bayGlow" cx="50%" cy="58%" r="42%">
            <stop offset="0%" stopColor={glowA} stopOpacity="0.6" />
            <stop offset="45%" stopColor={glowB} stopOpacity="0.28" />
            <stop offset="100%" stopColor="#000" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="bayMouth" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={glowA} stopOpacity="0.95" />
            <stop offset="100%" stopColor={glowB} stopOpacity="0.8" />
          </linearGradient>
        </defs>
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
        <rect x="150" y="620" width="8" height="90" rx="2" fill={glowA} opacity="0.4" />
        <rect x="232" y="620" width="8" height="90" rx="2" fill={glowB} opacity="0.4" />
        <rect x="110" y="700" width="170" height="4" rx="2" fill={glowA} opacity="0.28" />
      </svg>

      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, #000 0%, transparent 18%, transparent 72%, #000000bb 100%)',
        }}
      />
    </div>
  );
}
