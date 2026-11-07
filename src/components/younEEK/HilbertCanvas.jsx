import { useEffect, useRef } from 'react';
import { CHARCOAL, FELT_GREEN, IVORY, DIARY_INKS, hexAlpha } from './clockConstants';
import { HILBERT_SEGMENTS, hilbertCells, hilbertPointAt } from '@/lib/hilbert';
import { dateKeyFor, traversalCoverage } from '@/lib/hilbertDiary';
import { getSoundPrefs, playSegmentClick } from '@/lib/segmentAudio';

const TRAIL_SEGMENTS = 8;

export default function HilbertCanvas({ time, diary = null }) {
  const canvasRef = useRef(null);
  const sizeRef = useRef({ w: 0, h: 0, dpr: 1 });
  const pathCacheRef = useRef({ key: '', path: null });
  const lastSegmentRef = useRef(null);

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

    const side = Math.min(w, h);
    const pad = side * 0.07;
    const cell = (side - pad * 2) / 16;
    const originX = (w - side) / 2 + pad;
    const originY = (h - side) / 2 + pad;
    const px = (p) => ({ x: originX + (p.x + 0.5) * cell, y: originY + (p.y + 0.5) * cell });

    const cacheKey = `${w}x${h}`;
    if (pathCacheRef.current.key !== cacheKey) {
      const path = new Path2D();
      hilbertCells().forEach((p, i) => {
        const q = px(p);
        if (i === 0) path.moveTo(q.x, q.y);
        else path.lineTo(q.x, q.y);
      });
      pathCacheRef.current = { key: cacheKey, path };
    }

    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    ctx.strokeStyle = FELT_GREEN;
    ctx.globalAlpha = 0.18;
    ctx.lineWidth = Math.max(1, side * 0.003);
    ctx.stroke(pathCacheRef.current.path);
    ctx.globalAlpha = 1;

    // Decimal minutes since local midnight: 0..10000, monotonic across hour
    // boundaries. 100 decimal minutes per hour vs 255 curve segments: the trace
    // advances one segment per decimal minute continuously (2.55 h per full
    // traversal, ~39.2 traversals per day) and wraps at 255 by design. No
    // fictitious connector from the last cell back to the first: the head
    // re-enters at cell 0.
    const totalDecimalMinutes = (time?.progress ?? 0) * 10000;
    const t = totalDecimalMinutes % HILBERT_SEGMENTS;
    const liveTraversal = Math.floor(totalDecimalMinutes / HILBERT_SEGMENTS);

    // Diary overlay: exactly one traversal at a time (the selected day/pass, or
    // today's live pass). Cells repeat across passes, so mixing passes would
    // color one cell with conflicting timestamps — never done here.
    let showLiveHead = true;
    if (diary) {
      const traversal = diary.traversal === 'live' ? liveTraversal : diary.traversal;
      showLiveHead = diary.dayOffset === 0 && diary.traversal === 'live';
      const coverage = traversalCoverage(dateKeyFor(diary.dayOffset), traversal);
      for (let s = 0; s < HILBERT_SEGMENTS; s++) {
        const mark = coverage[s];
        if (!mark) continue;
        const p0 = px(hilbertCells()[s]);
        const p1 = px(hilbertCells()[s + 1]);
        ctx.strokeStyle = DIARY_INKS[mark.colorIndex] || IVORY;
        ctx.globalAlpha = 0.95;
        ctx.lineWidth = Math.max(1.5, side * 0.012);
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }

    const cells = hilbertCells();
    const head = hilbertPointAt(t);
    const hp = px(head);
    const first = Math.floor(t);

    if (showLiveHead) {
      for (let s = first; s > first - TRAIL_SEGMENTS - 1; s--) {
        if (s < 0) break;
        const age = t - s;
        const alpha = Math.max(0, 1 - age / (TRAIL_SEGMENTS + 1));
        const p0 = px(cells[s]);
        const p1 = s === first ? hp : px(cells[s + 1]);
        ctx.strokeStyle = IVORY;
        ctx.globalAlpha = alpha * 0.9;
        ctx.lineWidth = Math.max(1, side * (0.005 + 0.009 * alpha));
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      ctx.beginPath();
      ctx.arc(hp.x, hp.y, Math.max(2.5, side * 0.014), 0, Math.PI * 2);
      ctx.fillStyle = hexAlpha(FELT_GREEN, 0.3);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(hp.x, hp.y, Math.max(1.5, side * 0.007), 0, Math.PI * 2);
      ctx.fillStyle = IVORY;
      ctx.fill();
    }

    // Soft click on each live segment advance. Skipped transitions (throttled
    // background tab) are never replayed as a backlog.
    const segment = first;
    const prevSegment = lastSegmentRef.current;
    if (prevSegment !== null && segment !== prevSegment) {
      const delta = ((segment - prevSegment) % HILBERT_SEGMENTS + HILBERT_SEGMENTS) % HILBERT_SEGMENTS;
      const prefs = getSoundPrefs();
      if (delta === 1) playSegmentClick(prefs.gain);
    }
    lastSegmentRef.current = segment;
  }, [time, diary]);

  return <canvas ref={canvasRef} className="h-full w-full" />;
}
