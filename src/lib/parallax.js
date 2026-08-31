export function clamp(n, a = 0, b = 1) {
  return Math.min(b, Math.max(a, n));
}

export function lerp(a, b, t) {
  return a + (b - a) * t;
}

export function smoothstep(edge0, edge1, x) {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

export function easeInOutCubic(t) {
  const x = clamp(t, 0, 1);
  return x < 0.5 ? 4 * x * x * x : 1 - ((-2 * x + 2) ** 3) / 2;
}

/** Layer speeds far → near. Clock is pinned (0). */
export const LAYER_SPEED = {
  stars: 0.15,
  planet: 0.3,
  hull: 0.55,
  bay: 0.8,
  clock: 0,
};

export function layerOffsetY(p, speed, screenHeight) {
  return p * screenHeight * speed;
}

/**
 * Keyed astronaut path from scene progress p.
 * Not a constant parallax multiplier — a staged flight curve.
 */
export function astronautPose(p) {
  const progress = clamp(p, 0, 1);

  if (progress < 0.2) {
    return {
      opacity: 0,
      yUnit: 0,
      scale: 0.85,
      trail: false,
      phase: 'hub',
    };
  }

  if (progress < 0.45) {
    const t = (progress - 0.2) / 0.25;
    const e = easeInOutCubic(t);
    return {
      opacity: smoothstep(0.2, 0.24, progress),
      yUnit: e * 0.42,
      scale: lerp(0.9, 1.12, e),
      trail: t > 0.08 && t < 0.95,
      phase: 'launch',
    };
  }

  if (progress < 0.8) {
    const t = (progress - 0.45) / 0.35;
    const e = easeInOutCubic(t);
    return {
      opacity: 1,
      yUnit: lerp(0.42, 0.72, e),
      scale: lerp(1.12, 0.48, e),
      trail: t < 0.85,
      phase: 'bay',
    };
  }

  const t = (progress - 0.8) / 0.2;
  const e = easeInOutCubic(t);
  return {
    opacity: 1,
    yUnit: lerp(0.72, 0.78, e),
    scale: lerp(0.48, 0.28, e),
    trail: false,
    phase: 'inside',
  };
}

export function clockScale(p) {
  return lerp(1, 0.42, smoothstep(0.3, 0.6, p));
}

export function sceneOpacity(p) {
  return smoothstep(0, 0.25, p);
}
