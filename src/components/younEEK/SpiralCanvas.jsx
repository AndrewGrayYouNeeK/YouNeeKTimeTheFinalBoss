import { useEffect, useRef, useState } from 'react';
import { CHARCOAL, FELT_GREEN, IVORY, hexAlpha, mixHex } from './clockConstants';
import { SPIRAL_VOID_R, spiralRadiusFraction, spiralTurnsToVoid } from '@/lib/logSpiral';
import { getSoundPrefs, playSpiralTick } from '@/lib/segmentAudio';

const TAU = Math.PI * 2;
const SAMPLES_PER_TURN = 90;
const RECENT_TURNS = 0.6;

// Two competing inward arms. k is in radians: r = r0 * e^(-phi / k), phi the
// accumulated winding. Larger k decays slower, so arm 2 stays outside longer
// and spins slower — the "slow outer arm".
const ARMS = [
  { k: Math.PI * 6, secondsPerTurn: 9, windowTurns: 2.5, width: 2.2, hot: true },
  { k: Math.PI * 15, secondsPerTurn: 21, windowTurns: 1.75, width: 1.4, hot: false },
];

export default function SpiralCanvas({ time }) {
  const canvasRef = useRef(null);
  const sizeRef = useRef({ w: 0, h: 0, dpr: 1 });
  const lastTickRef = useRef(null);
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas.parentElement;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      sizeRef.current = { w, h, dpr };
      setFrame((n) => n + 1);
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(parent);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { w, h, dpr } = sizeRef.current;
    if (!w || !h) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    ctx.fillStyle = CHARCOAL;
    ctx.fillRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h / 2;
    const r0 = (Math.min(w, h) / 2) * 0.94;

    // Decimal seconds since local midnight (100 decimal hours x 100 x 100).
    const dsec = (time?.progress ?? 0) * 1e6;

    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    const hotGradient = ctx.createRadialGradient(cx, cy, SPIRAL_VOID_R * r0, cx, cy, r0);
    hotGradient.addColorStop(0, CHARCOAL);
    hotGradient.addColorStop(0.3, FELT_GREEN);
    hotGradient.addColorStop(0.62, mixHex(FELT_GREEN, IVORY, 0.55));
    hotGradient.addColorStop(1, IVORY);

    for (const arm of ARMS) {
      // One visible inward journey runs r0 -> void in spiralTurnsToVoid(k)
      // turns; the cycle is that journey's duration. The wrap is deliberate
      // and visible (envelope fade over the end turns), not a hidden reset.
      // The curve itself stays r = r0 * e^(-phi/k): mathematically infinite
      // inward, rendered only over its finite on-canvas window.
      const cycleSeconds = spiralTurnsToVoid(arm.k) * arm.secondsPerTurn;
      const inCycle = dsec % cycleSeconds;
      const phiHead = (TAU * inCycle) / arm.secondsPerTurn;
      const turnsIn = inCycle / arm.secondsPerTurn;
      const turnsLeft = (cycleSeconds - inCycle) / arm.secondsPerTurn;
      const envelope = Math.max(0, Math.min(1, turnsIn, turnsLeft));

      const trace = (windowPhi) => {
        ctx.beginPath();
        let started = false;
        const steps = Math.ceil((windowPhi / TAU) * SAMPLES_PER_TURN);
        for (let i = 0; i <= steps; i++) {
          const phi = phiHead - (windowPhi * i) / steps;
          if (phi < 0) break;
          const rFrac = spiralRadiusFraction(phi, arm.k);
          if (rFrac <= SPIRAL_VOID_R) break;
          const ang = -Math.PI / 2 + phi;
          const x = cx + Math.cos(ang) * rFrac * r0;
          const y = cy + Math.sin(ang) * rFrac * r0;
          if (!started) {
            ctx.moveTo(x, y);
            started = true;
          } else {
            ctx.lineTo(x, y);
          }
        }
      };

      trace(arm.windowTurns * TAU);
      if (arm.hot) {
        ctx.strokeStyle = hotGradient;
        ctx.globalAlpha = 0.3 * envelope;
      } else {
        ctx.strokeStyle = hexAlpha(FELT_GREEN, 0.5 * envelope);
      }
      ctx.lineWidth = arm.width;
      ctx.stroke();

      trace(RECENT_TURNS * TAU);
      if (arm.hot) {
        ctx.strokeStyle = hotGradient;
        ctx.globalAlpha = 0.95 * envelope;
      } else {
        ctx.strokeStyle = hexAlpha(FELT_GREEN, 0.85 * envelope);
      }
      ctx.lineWidth = arm.width * 1.6;
      ctx.stroke();

      const rHead = spiralRadiusFraction(phiHead, arm.k) * r0;
      if (rHead > SPIRAL_VOID_R * r0) {
        const ang = -Math.PI / 2 + phiHead;
        const hx = cx + Math.cos(ang) * rHead;
        const hy = cy + Math.sin(ang) * rHead;
        ctx.globalAlpha = envelope;
        ctx.beginPath();
        ctx.arc(hx, hy, Math.max(2, r0 * 0.012), 0, Math.PI * 2);
        ctx.fillStyle = arm.hot ? IVORY : FELT_GREEN;
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    // Soft tick per decimal second; pitch rises slowly with day progress and
    // stays bounded (180-440 Hz, low gain). Missed ticks (throttled background
    // tab, midnight wrap) are never replayed as a backlog.
    const tick = Math.floor(dsec);
    const prevTick = lastTickRef.current;
    if (prevTick !== null && tick !== prevTick && tick - prevTick === 1) {
      const prefs = getSoundPrefs();
      playSpiralTick(time?.progress ?? 0, prefs.gain);
    }
    lastTickRef.current = tick;
  }, [time, frame]);

  return <canvas ref={canvasRef} className="h-full w-full" />;
}
