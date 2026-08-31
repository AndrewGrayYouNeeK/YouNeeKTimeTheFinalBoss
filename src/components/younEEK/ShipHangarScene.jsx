import { PURPLE, BLUE } from './clockConstants';
import { LAYER_SPEED, layerOffsetY, sceneOpacity } from '@/lib/parallax';

/** Magenta-left / cyan-right neon hangar corridor — darker than the dial. */
export default function ShipHangarScene({ p, screenHeight, army = false }) {
  const opacity = sceneOpacity(p);
  const glowA = army ? '#8b939c' : BLUE; // cyan / muted
  const glowB = army ? '#6b7280' : '#ff2bd6'; // magenta / muted gray for army
  const hull = army ? '#2a2e34' : '#0c0814';
  const hullMid = army ? '#353a42' : '#161022';
  const panel = army ? '#3a4048' : '#1c1430';

  const planetY = layerOffsetY(p, LAYER_SPEED.planet, screenHeight);
  const hullY = layerOffsetY(p, LAYER_SPEED.hull, screenHeight);
  const bayY = layerOffsetY(p, LAYER_SPEED.bay, screenHeight);

  // Perspective pillars receding to vanishing point (195, 420)
  const pillars = Array.from({ length: 9 }, (_, i) => {
    const t = i / 8;
    const depth = t * t; // tighter near horizon
    const y0 = 180 + depth * 220;
    const y1 = 780 - depth * 280;
    const leftX = 8 + depth * 170;
    const rightX = 382 - depth * 170;
    const w = 14 - depth * 10;
    const op = 0.85 - depth * 0.55;
    return { leftX, rightX, y0, y1, w, op, i };
  });

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[1] overflow-hidden"
      style={{ opacity }}
      aria-hidden="true"
    >
      {/* Far: volcano / void peek at corridor end — slow */}
      <div
        className="absolute inset-[-14%] will-change-transform"
        style={{
          backgroundImage: 'url(/astronaut-dial-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 60%',
          opacity: 0.28,
          filter: 'brightness(0.4) saturate(0.7)',
          transform: `translate3d(0, ${planetY}px, 0)`,
        }}
      />

      {/* Medium: corridor hull + neon pillars */}
      <svg
        className="absolute inset-0 h-full w-full will-change-transform"
        viewBox="0 0 390 844"
        preserveAspectRatio="xMidYMid slice"
        style={{ transform: `translate3d(0, ${hullY}px, 0)` }}
      >
        <defs>
          <linearGradient id="ceilGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={hull} />
            <stop offset="100%" stopColor={hullMid} />
          </linearGradient>
          <linearGradient id="floorGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#05040a" />
            <stop offset="100%" stopColor="#0a0612" />
          </linearGradient>
          <linearGradient id="floorReflectL" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={glowB} stopOpacity="0.35" />
            <stop offset="100%" stopColor={glowB} stopOpacity="0" />
          </linearGradient>
          <linearGradient id="floorReflectR" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={glowA} stopOpacity="0.35" />
            <stop offset="100%" stopColor={glowA} stopOpacity="0" />
          </linearGradient>
          <linearGradient id="wallL" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={panel} />
            <stop offset="100%" stopColor={hull} />
          </linearGradient>
          <linearGradient id="wallR" x1="1" y1="0" x2="0" y2="0">
            <stop offset="0%" stopColor={panel} />
            <stop offset="100%" stopColor={hull} />
          </linearGradient>
          <filter id="neonSoft" x="-40%" y="-20%" width="180%" height="140%">
            <feGaussianBlur stdDeviation="2.2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ceiling + floor planes */}
        <path d="M0 0 L390 0 L300 420 L90 420 Z" fill="url(#ceilGrad)" opacity="0.95" />
        <path d="M0 844 L390 844 L300 420 L90 420 Z" fill="url(#floorGrad)" opacity="0.98" />

        {/* Side walls in perspective */}
        <path d="M0 0 L90 420 L90 420 L0 844 Z" fill="url(#wallL)" opacity="0.92" />
        <path d="M390 0 L300 420 L300 420 L390 844 Z" fill="url(#wallR)" opacity="0.92" />

        {/* Panel grid lines on walls */}
        {Array.from({ length: 8 }).map((_, i) => {
          const t = (i + 1) / 9;
          const lx0 = t * 90;
          const ly0 = t * 420;
          const lx1 = t * 90;
          const ly1 = 844 - t * (844 - 420);
          const rx0 = 390 - t * 90;
          return (
            <g key={`grid-${i}`} opacity="0.22">
              <line x1={lx0} y1={ly0} x2={lx1} y2={ly1} stroke={glowB} strokeWidth="1" />
              <line x1={rx0} y1={ly0} x2={rx0} y2={ly1} stroke={glowA} strokeWidth="1" />
            </g>
          );
        })}

        {/* Floor center path */}
        <path
          d="M195 420 L160 844 L230 844 Z"
          fill="#000"
          opacity="0.45"
        />

        {/* Reflective floor washes */}
        <path d="M20 500 L160 844 L40 844 Z" fill="url(#floorReflectL)" opacity="0.55" />
        <path d="M370 500 L230 844 L350 844 Z" fill="url(#floorReflectR)" opacity="0.55" />

        {/* Neon pillars — magenta left, cyan right */}
        {pillars.map((col) => (
          <g key={col.i} filter="url(#neonSoft)" opacity={col.op}>
            <rect
              x={col.leftX}
              y={col.y0}
              width={col.w}
              height={col.y1 - col.y0}
              rx={col.w / 2}
              fill={glowB}
            />
            <rect
              x={col.leftX + col.w * 0.25}
              y={col.y0}
              width={col.w * 0.35}
              height={col.y1 - col.y0}
              rx={2}
              fill="#ff9ae8"
              opacity="0.55"
            />
            {/* floor reflection stubs */}
            <rect
              x={col.leftX}
              y={col.y1}
              width={col.w}
              height={(col.y1 - col.y0) * 0.28}
              rx={col.w / 2}
              fill={glowB}
              opacity="0.22"
            />

            <rect
              x={col.rightX - col.w}
              y={col.y0}
              width={col.w}
              height={col.y1 - col.y0}
              rx={col.w / 2}
              fill={glowA}
            />
            <rect
              x={col.rightX - col.w * 0.6}
              y={col.y0}
              width={col.w * 0.35}
              height={col.y1 - col.y0}
              rx={2}
              fill="#b8f0ff"
              opacity="0.55"
            />
            <rect
              x={col.rightX - col.w}
              y={col.y1}
              width={col.w}
              height={(col.y1 - col.y0) * 0.28}
              rx={col.w / 2}
              fill={glowA}
              opacity="0.22"
            />
          </g>
        ))}
      </svg>

      {/* Near: bay doors at vanishing point — faster */}
      <svg
        className="absolute inset-0 h-full w-full will-change-transform"
        viewBox="0 0 390 844"
        preserveAspectRatio="xMidYMid slice"
        style={{ transform: `translate3d(0, ${bayY}px, 0)` }}
      >
        <defs>
          <radialGradient id="bayMouthGlow" cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor={glowA} stopOpacity="0.45" />
            <stop offset="50%" stopColor={glowB} stopOpacity="0.2" />
            <stop offset="100%" stopColor="#000" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="doorRing" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={glowA} />
            <stop offset="100%" stopColor={glowB} />
          </linearGradient>
        </defs>

        <ellipse cx="195" cy="430" rx="70" ry="48" fill="url(#bayMouthGlow)" />
        {/* Open bay — darkest hole, brightest rim */}
        <ellipse cx="195" cy="430" rx="48" ry="32" fill="#020208" stroke="url(#doorRing)" strokeWidth="2.5" opacity="0.95" />
        <ellipse cx="195" cy="430" rx="34" ry="22" fill="#000" opacity="0.85" />

        {/* Soft top vignette so sticky clock still wins */}
        <defs>
          <linearGradient id="topKeep" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#000" stopOpacity="0.92" />
            <stop offset="100%" stopColor="#000" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="390" height="180" fill="url(#topKeep)" />
      </svg>

      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, #000 0%, transparent 16%, transparent 78%, #000000cc 100%)',
        }}
      />
    </div>
  );
}
