import {
  CX, TORSO_X, TORSO_Y, TORSO_W, TORSO_H, LEG_H, LEG_W, LEG_DX,
} from './astronautGeometry';

// Static astronaut (legs + torso) in the centre of the dial. The arms are the clock hands (ClockHands).
export default function AstronautBody() {
  const legTop = TORSO_Y + TORSO_H - 16;
  const leg = (dir) => (
    <image
      href="/astro-leg.webp"
      x={CX + dir * LEG_DX - LEG_W / 2}
      y={legTop}
      width={LEG_W}
      height={LEG_H}
      preserveAspectRatio="none"
      filter="url(#astroShadow)"
      transform={`rotate(${dir * -3} ${CX + dir * LEG_DX} ${legTop})`}
    />
  );
  return (
    <svg viewBox="0 0 400 400" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
      <defs>
        <radialGradient id="astroGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#7CFF6B" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#7CFF6B" stopOpacity="0" />
        </radialGradient>
        <filter id="astroShadow" x="-30%" y="-10%" width="160%" height="130%">
          <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#000" floodOpacity="0.7" />
        </filter>
      </defs>
      <circle cx={CX} cy={200} r="118" fill="url(#astroGlow)" />
      {leg(-1)}
      {leg(1)}
      <image filter="url(#astroShadow)" href="/astro-torso.webp" x={TORSO_X} y={TORSO_Y} width={TORSO_W} height={TORSO_H} />
    </svg>
  );
}
