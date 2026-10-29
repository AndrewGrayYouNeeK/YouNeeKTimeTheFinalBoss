import {
  CX, TORSO_X, TORSO_Y, TORSO_W, TORSO_H, LEG_H, LEG_W,
} from './astronautGeometry';

// Static astronaut (legs + torso) in the centre of the dial. The arms are the clock hands (ClockHands).
export default function AstronautBody() {
  const legTop = TORSO_Y + TORSO_H - 10;
  const leg = (dir) => (
    <image
      href="/astro-leg.webp"
      x={CX + dir * 14 - LEG_W / 2}
      y={legTop}
      width={LEG_W}
      height={LEG_H}
      transform={`rotate(${dir * -7} ${CX + dir * 14} ${legTop})`}
    />
  );
  return (
    <svg viewBox="0 0 400 400" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
      <defs>
        <radialGradient id="astroGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#7CFF6B" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#7CFF6B" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx={CX} cy={200} r="118" fill="url(#astroGlow)" />
      {leg(-1)}
      {leg(1)}
      <image href="/astro-torso.webp" x={TORSO_X} y={TORSO_Y} width={TORSO_W} height={TORSO_H} />
    </svg>
  );
}
