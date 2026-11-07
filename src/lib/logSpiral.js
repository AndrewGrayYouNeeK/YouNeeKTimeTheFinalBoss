export const SPIRAL_VOID_R = 0.05;

const LOG_VOID = Math.log(SPIRAL_VOID_R);

export function spiralRadiusFraction(phi, k) {
  const logR = -phi / k;
  if (logR <= LOG_VOID) return SPIRAL_VOID_R;
  return Math.exp(logR);
}

export function spiralTurnsToVoid(k) {
  return (k / (2 * Math.PI)) * Math.log(1 / SPIRAL_VOID_R);
}
