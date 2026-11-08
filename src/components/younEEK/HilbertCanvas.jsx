import { useEffect, useRef, useState } from 'react';
import {
  DIARY_INKS, FELT_PATH, PATH_IVORY, PALE_CYAN, VOID, mixHex,
} from './clockConstants';
import { HILBERT_SEGMENTS, hilbertCells, hilbertPointAt } from '@/lib/hilbert';
import { dateKeyFor, traversalCoverage } from '@/lib/hilbertDiary';
import { getSoundPrefs, playSegmentClick } from '@/lib/segmentAudio';
import { drawVoidDrift } from './voidDrift';
import { useMidnightVeil } from './useMidnightVeil';

const TRAIL = 8;

// TIME MAPPING — unchanged. Not the single day-weave.
// Head = (dayProgress * 10000) % 255. One decimal minute = one segment.
// A day is ~39.2 passes. Passes are not drawn on top of each other.
// NOT APPLIED (needs approval): head = dayProgress * 255, one weave per day.
// Midnight veil only holds the pre-midnight frame while it fades.

export default function HilbertCanvas({ time, diary = null }) {
  const canvasRef = useRef(null);
  const sizeRef = useRef({ w: 0, h: 0, dpr: 1 });
  const lastSegmentRef = useRef(null);
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

    const side = Math.min(w, h);
    const pad = side * 0.1;
    const cell = (side - pad * 2) / 16;
    const originX = (w - side) / 2 + pad;
    const originY = (h - side) / 2 + pad;
    const px = (p) => ({ x: originX + (p.x + 0.5) * cell, y: originY + (p.y + 0.5) * cell });
    const cells = hilbertCells();

    const totalDecimalMinutes = drawProgress * 10000;
    const t = totalDecimalMinutes % HILBERT_SEGMENTS;
    const liveTraversal = Math.floor(totalDecimalMinutes / HILBERT_SEGMENTS);
    const head = hilbertPointAt(t);
    const first = Math.floor(t);

    let showLiveHead = true;
    let coverage = null;
    if (diary) {
      const traversal = diary.traversal === 'live' ? liveTraversal : diary.traversal;
      showLiveHead = diary.dayOffset === 0 && diary.traversal === 'live';
      coverage = traversalCoverage(dateKeyFor(diary.dayOffset), traversal);
    }

    const ghostEnd = showLiveHead ? Math.max(0, first - TRAIL) : HILBERT_SEGMENTS;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    for (let s = 0; s < ghostEnd; s++) {
      const mark = coverage ? coverage[s] : null;
      const p0 = px(cells[s]);
      const p1 = px(cells[s + 1] || cells[s]);
      ctx.strokeStyle = mark
        ? mixHex(FELT_PATH, DIARY_INKS[mark.colorIndex] || FELT_PATH, 0.28)
        : FELT_PATH;
      ctx.globalAlpha = (mark ? 0.2 : 0.09) * pathAlpha;
      ctx.lineWidth = Math.max(1.1, side * 0.006);
      ctx.beginPath();
      ctx.moveTo(p0.x, p0.y);
      ctx.lineTo(p1.x, p1.y);
      ctx.stroke();
    }

    if (showLiveHead) {
      const hp = px(head);
      for (let i = TRAIL - 1; i >= 0; i--) {
        const s = first - i;
        if (s < 0) continue;
        const near = 1 - i / TRAIL;
        const ramp = near * near * (3 - 2 * near);
        const p0 = px(cells[s]);
        const p1 = i === 0 ? hp : px(cells[s + 1]);
        if (i < 3) {
          ctx.strokeStyle = PATH_IVORY;
          ctx.globalAlpha = 0.14 * ramp * pathAlpha;
          ctx.lineWidth = Math.max(3.5, side * 0.016 * ramp);
          ctx.beginPath();
          ctx.moveTo(p0.x, p0.y);
          ctx.lineTo(p1.x, p1.y);
          ctx.stroke();
        }
        ctx.strokeStyle = mixHex(FELT_PATH, i < 4 ? PATH_IVORY : PALE_CYAN, 0.35 + 0.65 * ramp);
        ctx.globalAlpha = (0.34 + 0.62 * ramp) * pathAlpha;
        ctx.lineWidth = Math.max(1.15, side * (0.005 + 0.005 * ramp));
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.stroke();
      }
      const glowR = side * 0.028;
      const glow = ctx.createRadialGradient(hp.x, hp.y, 0, hp.x, hp.y, glowR);
      glow.addColorStop(0, 'rgba(244,240,230,0.95)');
      glow.addColorStop(0.35, 'rgba(215,239,233,0.28)');
      glow.addColorStop(1, 'rgba(215,239,233,0)');
      ctx.globalAlpha = pathAlpha;
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(hp.x, hp.y, glowR, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(hp.x, hp.y, Math.max(2.2, side * 0.011), 0, Math.PI * 2);
      ctx.fillStyle = PATH_IVORY;
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    const liveT = ((time?.progress ?? 0) * 10000) % HILBERT_SEGMENTS;
    const segment = Math.floor(liveT);
    const prevSegment = lastSegmentRef.current;
    if (prevSegment !== null && segment !== prevSegment) {
      const delta = ((segment - prevSegment) % HILBERT_SEGMENTS + HILBERT_SEGMENTS) % HILBERT_SEGMENTS;
      if (delta === 1) playSegmentClick(getSoundPrefs().gain);
    }
    lastSegmentRef.current = segment;
  }, [time, diary, frame, drawProgress, pathAlpha]);

  return <canvas ref={canvasRef} className="h-full w-full" />;
}
