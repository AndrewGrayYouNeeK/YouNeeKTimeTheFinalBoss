import { useEffect, useRef, useState } from 'react';
import { FELT_PATH, PATH_IVORY, VOID, mixHex } from './clockConstants';
import { HILBERT_SEGMENTS, hilbertCells, hilbertPointAt } from '@/lib/hilbert';
import { SPIRAL_ARMS, armState } from './spiralPath';

const DURATION = 1250;
const SAMPLES = 96;

function smooth(u) {
  return u * u * (3 - 2 * u);
}

function resample(pts, n) {
  if (!pts.length) return Array.from({ length: n }, () => ({ x: 0, y: 0 }));
  const out = [];
  for (let i = 0; i < n; i++) {
    const f = n === 1 ? 0 : (i / (n - 1)) * (pts.length - 1);
    const a = Math.floor(f);
    const b = Math.min(pts.length - 1, a + 1);
    const t = f - a;
    out.push({
      x: pts[a].x + (pts[b].x - pts[a].x) * t,
      y: pts[a].y + (pts[b].y - pts[a].y) * t,
    });
  }
  return out;
}

function hilbertPts(progress, layout) {
  const t = (progress * 10000) % HILBERT_SEGMENTS;
  const cells = hilbertCells();
  const pts = [];
  const last = Math.max(0, Math.floor(t));
  for (let s = 0; s <= last && s < cells.length; s++) {
    const p = cells[s];
    pts.push({
      x: layout.originX + (p.x + 0.5) * layout.cell,
      y: layout.originY + (p.y + 0.5) * layout.cell,
    });
  }
  const head = hilbertPointAt(t);
  pts.push({
    x: layout.originX + (head.x + 0.5) * layout.cell,
    y: layout.originY + (head.y + 0.5) * layout.cell,
  });
  return pts;
}

function spiralPts(progress, layout) {
  const { pts } = armState(progress * 1e6, SPIRAL_ARMS[0]);
  const mapped = pts.map((p) => ({
    x: layout.cx + Math.cos(p.ang) * p.rFrac * layout.r0,
    y: layout.cy + Math.sin(p.ang) * p.rFrac * layout.r0,
  }));
  if (mapped.length < 2) {
    const c = { x: layout.cx, y: layout.cy - layout.r0 };
    return [c, c];
  }
  mapped.reverse();
  return mapped;
}

export default function PathMorph({ time, from, to, onDone }) {
  const canvasRef = useRef(null);
  const sizeRef = useRef({ w: 0, h: 0, dpr: 1 });
  const [u, setU] = useState(0);
  const [frame, setFrame] = useState(0);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

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
    const t0 = performance.now();
    let raf = 0;
    const step = (now) => {
      const raw = Math.min(1, (now - t0) / DURATION);
      setU(raw);
      if (raw < 1) raf = requestAnimationFrame(step);
      else doneRef.current();
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [from, to]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { w, h, dpr } = sizeRef.current;
    if (!w || !h) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = VOID;
    ctx.fillRect(0, 0, w, h);

    const side = Math.min(w, h);
    const pad = side * 0.1;
    const cell = (side - pad * 2) / 16;
    const layout = {
      cell,
      originX: (w - side) / 2 + pad,
      originY: (h - side) / 2 + pad,
      cx: w / 2,
      cy: h / 2,
      r0: side * 0.45,
    };
    const progress = time?.progress ?? 0;
    const sample = (mode) => (mode === 'hilbert' ? hilbertPts(progress, layout) : spiralPts(progress, layout));
    const a = resample(sample(from), SAMPLES);
    const b = resample(sample(to), SAMPLES);
    const e = smooth(u);
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.strokeStyle = mixHex(FELT_PATH, PATH_IVORY, e * 0.35);
    ctx.globalAlpha = 0.9;
    ctx.lineWidth = Math.max(1.4, side * 0.008);
    ctx.beginPath();
    for (let i = 0; i < SAMPLES; i++) {
      const x = a[i].x + (b[i].x - a[i].x) * e;
      const y = a[i].y + (b[i].y - a[i].y) * e;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    const headA = a[SAMPLES - 1];
    const headB = b[SAMPLES - 1];
    const hx = headA.x + (headB.x - headA.x) * e;
    const hy = headA.y + (headB.y - headA.y) * e;
    ctx.fillStyle = PATH_IVORY;
    ctx.beginPath();
    ctx.arc(hx, hy, Math.max(2, side * 0.01), 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }, [u, frame, time, from, to]);

  return <canvas ref={canvasRef} className="h-full w-full" />;
}
