import { SPIRAL_VOID_R, spiralRadiusFraction, spiralTurnsToVoid } from '@/lib/logSpiral';

const TAU = Math.PI * 2;

// Same arms and cycle as the shipped Move mode. k and secondsPerTurn are the
// time mapping. Do not retune them here.
export const SPIRAL_ARMS = [
  { k: Math.PI * 6, secondsPerTurn: 9, windowTurns: 2.5, width: 2.2, hot: true },
  { k: Math.PI * 15, secondsPerTurn: 21, windowTurns: 1.75, width: 1.4, hot: false },
];

export function armState(dsec, arm) {
  const cycleSeconds = spiralTurnsToVoid(arm.k) * arm.secondsPerTurn;
  const inCycle = dsec % cycleSeconds;
  const phiHead = (TAU * inCycle) / arm.secondsPerTurn;
  const turnsIn = inCycle / arm.secondsPerTurn;
  const turnsLeft = (cycleSeconds - inCycle) / arm.secondsPerTurn;
  const envelope = Math.max(0, Math.min(1, turnsIn, turnsLeft));
  const windowPhi = arm.windowTurns * TAU;
  const steps = Math.ceil(arm.windowTurns * 90);
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const phi = phiHead - (windowPhi * i) / steps;
    if (phi < 0) break;
    const rFrac = spiralRadiusFraction(phi, arm.k);
    if (rFrac <= SPIRAL_VOID_R) break;
    pts.push({ rFrac, ang: -Math.PI / 2 + phi });
  }
  return { pts, envelope, phiHead };
}
