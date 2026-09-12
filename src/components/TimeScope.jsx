import { useEffect, useRef, useState } from 'react';
import {
  MS_PHASE,
  MS_YN_HOUR,
  MS_YN_MINUTE,
  MS_369_CYCLE,
  eventToTimeModeArc,
  formatYouNeekTime,
  getPersistenceOpacity,
  getYouNeek369Angle,
  getYouNeek369Flash,
  getYouNeek369Phase,
  getYouNeekHourIndex,
  getYouNeekTimeAngle,
  localMidnightMs,
  meetingToArc,
  msSinceLocalMidnight,
  stackBlips,
} from '@/lib/youneekEpoch';

const BG = '#05010a';
const PHOSPHOR = '#c026ff';
const PHASE_COLOR = ['#c026ff', '#7d5fff', '#00b7ff'];
const FLASH_HOLD_MS = 400;

function polar(cx, cy, r, angleDeg) {
  const a = ((angleDeg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}

function degToCanvas(deg) {
  return ((deg - 90) * Math.PI) / 180;
}

function demoEvents(now, mode) {
  const midnight = localMidnightMs(now);
  const off = msSinceLocalMidnight(now);
  if (mode === 'time') {
    const hourStart = midnight + Math.floor(off / MS_YN_HOUR) * MS_YN_HOUR;
    return [
      {
        id: 'cross',
        label: 'CROSS',
        startMs: hourStart + 8 * MS_YN_MINUTE,
        endMs: hourStart + 30 * MS_YN_MINUTE,
        kind: 'anchor',
      },
      {
        id: 'trans',
        label: 'T',
        startMs: hourStart + 45 * MS_YN_MINUTE,
        kind: 'transition',
      },
      {
        id: 'short',
        label: 'A',
        startMs: hourStart + 60 * MS_YN_MINUTE,
        endMs: hourStart + 62 * MS_YN_MINUTE,
        kind: 'anchor',
      },
      {
        id: 'out',
        label: 'OUT',
        startMs: hourStart - MS_YN_HOUR + 10_000,
        endMs: hourStart - MS_YN_HOUR + 20_000,
        kind: 'anchor',
      },
    ];
  }
  const cycleStart = midnight + Math.floor(off / MS_369_CYCLE) * MS_369_CYCLE;
  return [
    {
      id: 'cross',
      label: 'MEET',
      startMs: cycleStart + MS_PHASE - 400_000,
      endMs: cycleStart + MS_PHASE + 400_000,
      kind: 'anchor',
    },
    {
      id: 'trans',
      label: 'T',
      startMs: cycleStart + MS_PHASE * 1.5,
      kind: 'transition',
    },
    {
      id: 'short',
      label: 'A',
      startMs: cycleStart + 200_000,
      endMs: cycleStart + 260_000,
      kind: 'anchor',
    },
    {
      id: 'out',
      label: 'OUT',
      startMs: cycleStart - 1_000_000,
      endMs: cycleStart - 900_000,
      kind: 'anchor',
    },
  ];
}

function isInstant(ev) {
  return ev.endMs == null || ev.endMs <= ev.startMs;
}

function instantInWindow(startMs, now, mode) {
  const midnight = localMidnightMs(now);
  const off = msSinceLocalMidnight(now);
  if (mode === 'time') {
    const hourStart = midnight + Math.floor(off / MS_YN_HOUR) * MS_YN_HOUR;
    return startMs >= hourStart && startMs < hourStart + MS_YN_HOUR;
  }
  const cycleStart = midnight + Math.floor(off / MS_369_CYCLE) * MS_369_CYCLE;
  return startMs >= cycleStart && startMs < cycleStart + MS_369_CYCLE;
}

function instantAngle(startMs, now, mode) {
  const midnight = localMidnightMs(now);
  const off = msSinceLocalMidnight(now);
  if (mode === 'time') {
    const hourStart = midnight + Math.floor(off / MS_YN_HOUR) * MS_YN_HOUR;
    return ((startMs - hourStart) / MS_YN_HOUR) * 360;
  }
  const cycleStart = midnight + Math.floor(off / MS_369_CYCLE) * MS_369_CYCLE;
  return ((startMs - cycleStart) / MS_369_CYCLE) * 360;
}

function segmentOpacity(startA, endA, beamAngle) {
  const mid = startA + (endA - startA) / 2;
  return Math.max(
    getPersistenceOpacity(startA, beamAngle),
    getPersistenceOpacity(mid, beamAngle),
    getPersistenceOpacity(endA, beamAngle),
  );
}

function splitPhaseSegments(startA, endA) {
  const bounds = [0, 120, 240, 360];
  const segs = [];
  let a = startA;
  const stop = endA <= startA ? endA + 360 : endA;
  for (let i = 0; i < bounds.length - 1; i++) {
    const lo = bounds[i];
    const hi = bounds[i + 1];
    const from = Math.max(a, lo);
    const to = Math.min(stop, hi);
    if (to > from) segs.push({ start: from % 360, end: to > 360 ? to % 360 || 360 : to, phase: i });
  }
  if (stop > 360) {
    for (let i = 0; i < bounds.length - 1; i++) {
      const lo = bounds[i];
      const hi = bounds[i + 1];
      const from = Math.max(0, lo);
      const to = Math.min(stop - 360, hi);
      if (to > from && to > 0) segs.push({ start: from, end: to, phase: i });
    }
  }
  return segs.filter((s) => s.end !== s.start);
}

function strokeArc(ctx, cx, cy, r, startA, endA, color, alpha) {
  if (alpha <= 0) return;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = color;
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  if (endA < startA) {
    ctx.arc(cx, cy, r, degToCanvas(startA), degToCanvas(360), false);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy, r, degToCanvas(0), degToCanvas(endA), false);
    ctx.stroke();
  } else {
    ctx.arc(cx, cy, r, degToCanvas(startA), degToCanvas(endA), false);
    ctx.stroke();
  }
  ctx.restore();
}

export default function TimeScope() {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const readoutRef = useRef(null);
  const subRef = useRef(null);
  const flashElRef = useRef(null);
  const [mode, setMode] = useState('time');
  const modeRef = useRef(mode);
  modeRef.current = mode;

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext('2d');
    let raf = 0;
    let lastFlash = { text: null, until: 0 };

    const paint = () => {
      const now = Date.now();
      const modeNow = modeRef.current;
      const css = Math.max(240, wrap.clientWidth);
      const dpr = window.devicePixelRatio || 1;
      const px = Math.floor(css * dpr);
      if (canvas.width !== px) {
        canvas.width = px;
        canvas.height = px;
        canvas.style.width = `${css}px`;
        canvas.style.height = `${css}px`;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const size = css;
      const cx = size / 2;
      const cy = size / 2;
      const maxR = size / 2 * 0.78;
      const innerR = maxR * 0.28;
      const midR = maxR * 0.58;
      const outerR = maxR * 0.86;
      const beamAngle = modeNow === 'time' ? getYouNeekTimeAngle(now) : getYouNeek369Angle(now);

      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, size, size);

      ctx.save();
      ctx.strokeStyle = PHOSPHOR;
      ctx.globalAlpha = 0.15;
      ctx.lineWidth = 1;
      for (const r of [innerR, midR, outerR]) {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();

      for (let i = 0; i < 12; i++) {
        const deg = i * 30;
        const cardinal = deg % 90 === 0;
        const long = modeNow === 'time' && cardinal;
        const tickLen = long ? 14 : cardinal ? 10 : 6;
        const [x1, y1] = polar(cx, cy, outerR - tickLen, deg);
        const [x2, y2] = polar(cx, cy, outerR + 2, deg);
        ctx.save();
        ctx.globalAlpha = 0.45;
        ctx.strokeStyle = PHOSPHOR;
        ctx.lineWidth = long ? 2 : 1;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.restore();
      }

      ctx.save();
      ctx.fillStyle = PHOSPHOR;
      ctx.globalAlpha = 0.7;
      ctx.font = `600 ${Math.max(10, size * 0.035)}px ui-monospace, monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      if (modeNow === 'time') {
        const labels = [
          [0, '00'],
          [90, '25'],
          [180, '50'],
          [270, '75'],
        ];
        for (const [deg, text] of labels) {
          const [lx, ly] = polar(cx, cy, outerR + size * 0.06, deg);
          ctx.fillText(text, lx, ly);
        }
      } else {
        for (const [deg, text] of [
          [0, '9'],
          [120, '3'],
          [240, '6'],
        ]) {
          const [lx, ly] = polar(cx, cy, outerR + size * 0.06, deg);
          ctx.fillText(text, lx, ly);
        }
      }
      ctx.restore();

      const events = demoEvents(now, modeNow);
      const arcs = [];
      const rawBlips = [];
      for (const ev of events) {
        if (isInstant(ev)) {
          if (!instantInWindow(ev.startMs, now, modeNow)) continue;
          rawBlips.push({
            id: ev.id,
            label: ev.label,
            angle: instantAngle(ev.startMs, now, modeNow),
            kind: ev.kind,
            stackOffset: 0,
          });
          continue;
        }
        const arc = modeNow === '369'
          ? meetingToArc(ev.startMs, ev.endMs, now)
          : eventToTimeModeArc(ev.startMs, ev.endMs, now);
        if (!arc) continue;
        arcs.push({ ...arc, id: ev.id, label: ev.label });
      }

      for (const arc of arcs) {
        const pieces = [];
        if (arc.wraps) {
          pieces.push({ start: arc.startAngle, end: 360 });
          pieces.push({ start: 0, end: arc.endAngle });
        } else {
          pieces.push({ start: arc.startAngle, end: arc.endAngle });
        }
        for (const piece of pieces) {
          if (arc.crossesPhase) {
            for (const seg of splitPhaseSegments(piece.start, piece.end)) {
              const alpha = segmentOpacity(seg.start, seg.end === 360 ? 360 : seg.end, beamAngle);
              strokeArc(ctx, cx, cy, midR, seg.start, seg.end === 360 ? 359.999 : seg.end, PHASE_COLOR[seg.phase] || PHOSPHOR, Math.max(alpha, 0.22));
            }
          } else {
            const alpha = segmentOpacity(piece.start, piece.end, beamAngle);
            strokeArc(ctx, cx, cy, midR, piece.start, piece.end, PHOSPHOR, Math.max(alpha, 0.22));
          }
        }
      }

      const blips = stackBlips(rawBlips);
      for (const blip of blips) {
        const baseR = blip.kind === 'transition' ? outerR : midR;
        const r = baseR + (blip.stackOffset || 0);
        const [bx, by] = polar(cx, cy, r, blip.angle);
        const alpha = getPersistenceOpacity(blip.angle, beamAngle);
        if (alpha <= 0) continue;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = PHOSPHOR;
        ctx.shadowColor = PHOSPHOR;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(bx, by, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      ctx.save();
      ctx.strokeStyle = PHOSPHOR;
      ctx.globalAlpha = 0.18;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      const [fanA, fanB] = polar(cx, cy, outerR, beamAngle - 8);
      const [tipX, tipY] = polar(cx, cy, outerR, beamAngle);
      ctx.lineTo(fanA, fanB);
      ctx.lineTo(tipX, tipY);
      ctx.closePath();
      ctx.fillStyle = PHOSPHOR;
      ctx.fill();
      ctx.restore();

      ctx.save();
      ctx.strokeStyle = PHOSPHOR;
      ctx.globalAlpha = 0.95;
      ctx.lineWidth = 1.5;
      ctx.shadowColor = PHOSPHOR;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(tipX, tipY);
      ctx.stroke();
      ctx.restore();

      ctx.save();
      ctx.strokeStyle = PHOSPHOR;
      ctx.globalAlpha = 0.55;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx - 8, cy);
      ctx.lineTo(cx + 8, cy);
      ctx.moveTo(cx, cy - 8);
      ctx.lineTo(cx, cy + 8);
      ctx.stroke();
      ctx.restore();

      if (readoutRef.current) readoutRef.current.textContent = formatYouNeekTime(now);
      if (subRef.current) {
        subRef.current.textContent = modeNow === 'time'
          ? `HOUR ${String(getYouNeekHourIndex(now)).padStart(2, '0')} / 100`
          : getYouNeek369Phase(now).name;
      }

      const hit = getYouNeek369Flash(now);
      if (hit) lastFlash = { text: hit, until: now + FLASH_HOLD_MS };
      const showFlash = lastFlash.text && now < lastFlash.until;
      if (flashElRef.current) {
        flashElRef.current.textContent = showFlash ? lastFlash.text : '';
        flashElRef.current.style.opacity = showFlash ? '1' : '0';
      }

      raf = requestAnimationFrame(paint);
    };

    raf = requestAnimationFrame(paint);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="time-scope w-full" data-scope="youneek-time">
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#c026ff]/80">TIME SCOPE</p>
        <div className="flex overflow-hidden rounded border border-[#c026ff]/35 font-mono text-[10px] uppercase tracking-[0.2em]">
          <button
            type="button"
            onClick={() => setMode('369')}
            className={`px-3 py-1 ${mode === '369' ? 'bg-[#c026ff] text-[#140018]' : 'text-[#c026ff]/70'}`}
          >
            369
          </button>
          <button
            type="button"
            onClick={() => setMode('time')}
            className={`px-3 py-1 ${mode === 'time' ? 'bg-[#c026ff] text-[#140018]' : 'text-[#c026ff]/70'}`}
          >
            TIME
          </button>
        </div>
      </div>
      <div ref={wrapRef} className="relative mx-auto aspect-square w-full max-w-[28rem]" style={{ background: BG }}>
        <canvas ref={canvasRef} className="block h-full w-full" />
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <p
            ref={flashElRef}
            className="absolute font-mono text-4xl font-bold tracking-[0.2em] text-[#c026ff] transition-opacity duration-75"
            style={{ opacity: 0, textShadow: '0 0 18px #c026ff' }}
          />
          <p
            ref={readoutRef}
            className="font-mono text-3xl font-semibold tracking-[0.12em] text-[#c026ff]"
            style={{ textShadow: '0 0 12px #c026ff88' }}
          />
          <p ref={subRef} className="mt-1 font-mono text-[10px] uppercase tracking-[0.28em] text-[#00b7ff]/70" />
        </div>
      </div>
    </div>
  );
}
