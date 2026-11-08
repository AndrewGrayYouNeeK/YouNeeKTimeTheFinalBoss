import { useEffect, useRef, useState } from 'react';
import {
  DIARY_INKS, FELT_PATH, FELT_PATH_BRIGHT, PATH_IVORY, PALE_CYAN, VOID, mixHex,
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

    const end = showLiveHead ? first : HILBERT_SEGMENTS;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.lineWidth = Math.max(1.25, side * 0.008);

    for (let s = 0; s < end; s++) {
      const mark = coverage ? coverage[s] : null;
      const along = end <= 1 ? 1 : s / (end - 1);
      const color = mark
        ? mixHex(FELT_PATH, DIARY_INKS[mark.colorIndex] || FELT_PATH_BRIGHT, 0.35)
        : mixHex(FELT_PATH, FELT_PATH_BRIGHT, along * 0.85);
      const p0 = px(cells[s]);
      const p1 = px(cells[s + 1] || cells[s]);
      ctx.strokeStyle = color;
      ctx.globalAlpha = (mark ? 0.42 : 0.07 + 0.16 * along) * pathAlpha;
      ctx.beginPath();
      ctx.moveTo(p0.x, p0.y);
      ctx.lineTo(p1.x, p1.y);
      ctx.stroke();
    }

    if (showLiveHead) {
      const hp = px(head);
      for (let i = 0; i < TRAIL; i++) {
        const s = first - i;
        if (s < 0) break;
        const p0 = px(cells[s]);
        const p1 = i === 0 ? hp : px(cells[s + 1]);
        const alpha = (1 - i / TRAIL) * pathAlpha;
        ctx.strokeStyle = i < 2 ? PATH_IVORY : PALE_CYAN;
        ctx.globalAlpha = alpha * 0.9;
        ctx.lineWidth = Math.max(1.2, side * (0.006 + 0.008 * (1 - i / TRAIL)));
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.stroke();
      }
      ctx.globalAlpha = pathAlpha;
      const glow = ctx.createRadialGradient(hp.x, hp.y, 0, hp.x, hp.y, side * 0.04);
      glow.addColorStop(0, PATH_IVORY);
      glow.addColorStop(0.35, 'rgba(215,239,233,0.55)');
      glow.addColorStop(1, 'rgba(215,239,233,0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(hp.x, hp.y, side * 0.04, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(hp.x, hp.y, Math.max(1.6, side * 0.008), 0, Math.PI * 2);
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
