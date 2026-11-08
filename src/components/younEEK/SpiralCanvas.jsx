import { useEffect, useRef, useState } from 'react';
import {
  COOL_MIST, FELT_PATH, PATH_AMBER, PATH_IVORY, PATH_RED, PALE_CYAN, VOID, mixHex,
} from './clockConstants';
import { getSoundPrefs, playSpiralTick } from '@/lib/segmentAudio';
import { SPIRAL_ARMS, armState } from './spiralPath';
import { drawVoidDrift } from './voidDrift';
import { useMidnightVeil } from './useMidnightVeil';

const TRAIL = 8;

// The inner arm tightens from the rim to the void floor across the decimal
// day. It is not an infinite drawing: r is clamped at 0.05, and local midnight
// fades this frame and starts the next day at the rim. The outer arm uses a
// different, larger k and fewer turns, so it lags outside.

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
    const xy = (p) => ({ x: cx + Math.cos(p.ang) * p.rFrac * r0, y: cy + Math.sin(p.ang) * p.rFrac * r0 });

    const heat = ctx.createRadialGradient(cx, cy, r0 * 0.05, cx, cy, r0);
    heat.addColorStop(0, PATH_RED);
    heat.addColorStop(0.22, PATH_AMBER);
    heat.addColorStop(0.55, FELT_PATH);
    heat.addColorStop(1, mixHex(COOL_MIST, PATH_IVORY, 0.7));

    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    for (const arm of SPIRAL_ARMS) {
      const { pts } = armState(drawProgress, arm);
      if (pts.length < 2) continue;
      ctx.beginPath();
      pts.forEach((p, i) => {
        const q = xy(p);
        if (i === 0) ctx.moveTo(q.x, q.y);
        else ctx.lineTo(q.x, q.y);
      });
      ctx.globalAlpha = (arm.hot ? 0.9 : 0.42) * pathAlpha;
      ctx.lineWidth = arm.width;
      ctx.strokeStyle = arm.hot ? heat : mixHex('#6e8f7c', PATH_IVORY, 0.55);
      ctx.stroke();

      if (!arm.hot) continue;
      const start = Math.max(0, pts.length - 1 - TRAIL);
      for (let i = start; i < pts.length - 1; i++) {
        const age = pts.length - 2 - i;
        const fade = 1 - age / TRAIL;
        const a = xy(pts[i]);
        const b = xy(pts[i + 1]);
        ctx.strokeStyle = fade > 0.75 ? PATH_IVORY : PALE_CYAN;
        ctx.globalAlpha = fade * pathAlpha;
        ctx.lineWidth = arm.width * (0.8 + fade);
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
      const h = xy(pts[pts.length - 1]);
      ctx.globalAlpha = pathAlpha;
      const glow = ctx.createRadialGradient(h.x, h.y, 0, h.x, h.y, r0 * 0.055);
      glow.addColorStop(0, PATH_IVORY);
      glow.addColorStop(0.4, 'rgba(215,239,233,0.45)');
      glow.addColorStop(1, 'rgba(215,239,233,0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(h.x, h.y, r0 * 0.055, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(h.x, h.y, Math.max(1.6, r0 * 0.012), 0, Math.PI * 2);
      ctx.fillStyle = PATH_IVORY;
      ctx.fill();
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
