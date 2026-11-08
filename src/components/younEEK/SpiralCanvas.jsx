import { useEffect, useRef, useState } from 'react';
import {
  COOL_MIST, FELT_PATH, PATH_AMBER, PATH_IVORY, PATH_RED, PALE_CYAN, VOID, mixHex,
} from './clockConstants';
import { getSoundPrefs, playSpiralTick } from '@/lib/segmentAudio';
import { SPIRAL_ARMS, armState } from './spiralPath';
import { drawVoidDrift } from './voidDrift';
import { useMidnightVeil } from './useMidnightVeil';

const TRAIL = 8;

// TIME MAPPING — unchanged. dsec = dayProgress * 1e6. Each arm still cycles on
// its own k and secondsPerTurn (inner ~81s, outer ~472s of decimal time) and
// fades at the void. That mid-day cycle is NOT removed.
// NOT APPLIED (needs approval): one inward journey across the decimal day that
// only restarts at midnight.
// Color DOES change: outer cool mist/ivory, amber mid, muted red at the center.
// Midnight veil only holds the pre-midnight frame while it fades.

export default function SpiralCanvas({ time }) {
  const canvasRef = useRef(null);
  const sizeRef = useRef({ w: 0, h: 0, dpr: 1 });
  const lastTickRef = useRef(null);
  const reducedRef = useRef(false);
  const [frame, setFrame] = useState(0);
  const { drawProgress, pathAlpha } = useMidnightVeil(time?.progress ?? 0);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => { reducedRef.current = media.matches; };
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);

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
    ctx.fillStyle = VOID;
    ctx.fillRect(0, 0, w, h);
    drawVoidDrift(ctx, w, h, performance.now(), reducedRef.current);

    const cx = w / 2;
    const cy = h / 2;
    const r0 = (Math.min(w, h) / 2) * 0.9;
    const dsec = drawProgress * 1e6;
    const xy = (p) => ({ x: cx + Math.cos(p.ang) * p.rFrac * r0, y: cy + Math.sin(p.ang) * p.rFrac * r0 });

    const heat = ctx.createRadialGradient(cx, cy, r0 * 0.05, cx, cy, r0);
    heat.addColorStop(0, PATH_RED);
    heat.addColorStop(0.22, PATH_AMBER);
    heat.addColorStop(0.55, FELT_PATH);
    heat.addColorStop(1, mixHex(COOL_MIST, PATH_IVORY, 0.7));

    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    for (const arm of SPIRAL_ARMS) {
      const { pts, envelope } = armState(dsec, arm);
      if (pts.length < 2) continue;
      ctx.beginPath();
      pts.forEach((p, i) => {
        const q = xy(p);
        if (i === 0) ctx.moveTo(q.x, q.y);
        else ctx.lineTo(q.x, q.y);
      });
      ctx.globalAlpha = (arm.hot ? 0.85 : 0.4) * envelope * pathAlpha;
      ctx.lineWidth = arm.width;
      ctx.strokeStyle = arm.hot ? heat : mixHex(COOL_MIST, PATH_IVORY, 0.45);
      ctx.stroke();

      if (arm.hot) {
        const n = Math.min(TRAIL, pts.length - 1);
        for (let i = 0; i < n; i++) {
          const a = xy(pts[i]);
          const b = xy(pts[i + 1]);
          ctx.strokeStyle = i < 2 ? PATH_IVORY : PALE_CYAN;
          ctx.globalAlpha = (1 - i / TRAIL) * envelope * pathAlpha;
          ctx.lineWidth = arm.width * (1.3 - i / TRAIL);
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
        const h = xy(pts[0]);
        ctx.globalAlpha = envelope * pathAlpha;
        const glow = ctx.createRadialGradient(h.x, h.y, 0, h.x, h.y, r0 * 0.06);
        glow.addColorStop(0, PATH_IVORY);
        glow.addColorStop(0.4, 'rgba(215,239,233,0.45)');
        glow.addColorStop(1, 'rgba(215,239,233,0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(h.x, h.y, r0 * 0.06, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(h.x, h.y, Math.max(1.6, r0 * 0.012), 0, Math.PI * 2);
        ctx.fillStyle = PATH_IVORY;
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;

    const live = Math.floor((time?.progress ?? 0) * 1e6);
    const prev = lastTickRef.current;
    if (prev !== null && live !== prev && live - prev === 1) {
      playSpiralTick(time?.progress ?? 0, getSoundPrefs().gain);
    }
    lastTickRef.current = live;
  }, [time, frame, drawProgress, pathAlpha]);

  return <canvas ref={canvasRef} className="h-full w-full" />;
}
