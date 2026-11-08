import { SPIRAL_VOID_R, spiralRadiusFraction } from '@/lib/logSpiral';

const TAU = Math.PI * 2;
const SAMPLES_PER_TURN = 72;

// One inward journey per decimal day. k is chosen so r = e^(-φ/k) equals
// endRadius when φ has wound `turns` times. The inner arm ends at the void
// floor. The outer arm uses a larger k and fewer turns, so it stays outside
// and moves more slowly. Radius is clamped in spiralRadiusFraction; the
// curve does not continue to r = 0. Decimal midnight (progress 0) starts
// again at the rim. That reset is the day boundary, not a mid-day cycle.
export const SPIRAL_ARMS = [
  { turns: 7, endRadius: SPIRAL_VOID_R, width: 2.3, hot: true },
  { turns: 2.6, endRadius: 0.46, width: 1.45, hot: false },
];

export function armK(arm) {
  return (arm.turns * TAU) / Math.log(1 / arm.endRadius);
}

export function armState(progress, arm) {
  const p = Math.min(1, Math.max(0, progress));
  const k = armK(arm);
  const phiHead = p * arm.turns * TAU;
  const steps = Math.max(12, Math.ceil(Math.max(p, 0.04) * arm.turns * SAMPLES_PER_TURN));
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const phi = (phiHead * i) / steps;
    pts.push({
      rFrac: spiralRadiusFraction(phi, k),
      ang: -Math.PI / 2 + phi,
    });
  }
  return { pts, phiHead, k };
}
