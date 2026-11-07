import { useState } from 'react';
import {
  DIARY_INKS,
  TRAVERSALS_PER_DAY,
  addEntry,
  dateKeyFor,
  readDayEntries,
  realToDecimalMinutes,
  removeEntry,
} from '@/lib/hilbertDiary';
import { FELT_GREEN, IVORY } from './clockConstants';

function dayLabel(dayOffset) {
  if (dayOffset === 0) return 'Today';
  if (dayOffset === 1) return 'Yesterday';
  return `-${dayOffset}d`;
}

export default function DiaryPanel({ dayOffset, traversal, onDayOffset, onTraversal, time }) {
  const dayKey = dateKeyFor(dayOffset, time);
  const entries = readDayEntries(dayKey);

  const [label, setLabel] = useState('');
  const [ink, setInk] = useState(0);
  const [start, setStart] = useState('09:00');
  const [end, setEnd] = useState('10:00');
  const [error, setError] = useState('');

  const totalDecimalMinutes = (time?.progress ?? 0) * 10000;
  const liveTraversal = Math.floor(totalDecimalMinutes / 255);
  const selected = traversal === 'live' ? liveTraversal : traversal;

  const submit = () => {
    const [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);
    if ([sh, sm, eh, em].some((v) => !Number.isFinite(v))) {
      setError('Enter both times as hh:mm.');
      return;
    }
    const startMin = realToDecimalMinutes(sh, sm);
    const endMin = realToDecimalMinutes(eh, em);
    if (endMin <= startMin) {
      setError('End must come after start.');
      return;
    }
    const entry = addEntry(dayKey, { startMin, endMin, label, colorIndex: ink });
    if (!entry) {
      setError('End must come after start.');
      return;
    }
    setError('');
    setLabel('');
  };

  const stepTraversal = (delta) => {
    const next = Math.min(TRAVERSALS_PER_DAY - 1, Math.max(0, selected + delta));
    onTraversal(next);
  };

  const stepDay = (delta) => {
    onDayOffset(Math.min(30, Math.max(0, dayOffset + delta)));
  };

  const chip = (active) => ({
    borderColor: active ? FELT_GREEN : 'rgba(255,255,255,0.18)',
    color: active ? IVORY : 'rgba(255,255,255,0.45)',
    background: active ? 'rgba(46,107,79,0.25)' : 'transparent',
  });

  return (
    <div className="w-full">
      <p className="mb-3 text-center font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: FELT_GREEN }}>
        Spatial diary
      </p>

      <div className="flex flex-wrap items-center justify-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em]">
        <button type="button" aria-label="Previous day" onClick={() => stepDay(1)} className="rounded-full border px-3 py-1.5 text-white/60" style={chip(false)}>
          ‹ Day
        </button>
        <span className="min-w-[5.5rem] text-center text-white/70">{dayLabel(dayOffset)}</span>
        <button type="button" aria-label="Next day" disabled={dayOffset === 0} onClick={() => stepDay(-1)} className="rounded-full border px-3 py-1.5 text-white/60 disabled:opacity-30" style={chip(false)}>
          Day ›
        </button>
        <button type="button" aria-label="Previous pass" onClick={() => stepTraversal(-1)} className="rounded-full border px-3 py-1.5 text-white/60" style={chip(false)}>
          ‹ Pass
        </button>
        <span className="min-w-[6.5rem] text-center text-white/70">
          {traversal === 'live' ? `Live pass ${selected + 1}/${TRAVERSALS_PER_DAY}` : `Pass ${selected + 1}/${TRAVERSALS_PER_DAY}`}
        </span>
        <button type="button" aria-label="Next pass" onClick={() => stepTraversal(1)} className="rounded-full border px-3 py-1.5 text-white/60" style={chip(false)}>
          Pass ›
        </button>
        <button type="button" onClick={() => onTraversal('live')} className="rounded-full border px-3 py-1.5" style={chip(traversal === 'live')}>
          Live
        </button>
      </div>

      <div className="mt-4 flex flex-wrap items-end justify-center gap-2 text-[12px]">
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="What did you do?"
          aria-label="Activity label"
          className="w-40 rounded border border-white/20 bg-black/40 px-2 py-1.5 text-white placeholder:text-white/30"
        />
        <div className="flex gap-1" role="radiogroup" aria-label="Ink color">
          {DIARY_INKS.map((color, i) => (
            <button
              key={color}
              type="button"
              role="radio"
              aria-checked={ink === i}
              onClick={() => setInk(i)}
              className="h-6 w-6 rounded-full border"
              style={{ background: color, borderColor: ink === i ? IVORY : 'rgba(255,255,255,0.25)' }}
            />
          ))}
        </div>
        <input type="time" value={start} onChange={(e) => setStart(e.target.value)} aria-label="Start time" className="rounded border border-white/20 bg-black/40 px-2 py-1.5 text-white" />
        <input type="time" value={end} onChange={(e) => setEnd(e.target.value)} aria-label="End time" className="rounded border border-white/20 bg-black/40 px-2 py-1.5 text-white" />
        <button type="button" onClick={submit} className="rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em]" style={chip(true)}>
          Log
        </button>
      </div>
      {error && <p className="mt-2 text-center text-[11px]" style={{ color: IVORY }}>{error}</p>}

      <ul className="mt-4 space-y-1">
        {entries.length === 0 && (
          <li className="text-center text-[11px] text-white/35">Unlogged time stays neutral on the trace.</li>
        )}
        {entries.map((entry) => (
          <li key={entry.id} className="flex items-center justify-between gap-2 rounded px-2 py-1 text-[12px] text-white/70">
            <span className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded-full" style={{ background: DIARY_INKS[entry.colorIndex] }} />
              {entry.label || 'Untitled'}
            </span>
            <span className="flex items-center gap-2 font-mono text-[10px] text-white/40">
              {String(Math.floor(entry.startMin / 100)).padStart(2, '0')}:{String(Math.round(entry.startMin % 100)).padStart(2, '0')}
              {' – '}
              {String(Math.floor(entry.endMin / 100)).padStart(2, '0')}:{String(Math.round(entry.endMin % 100)).padStart(2, '0')}
              <button type="button" aria-label={`Delete ${entry.label || 'entry'}`} onClick={() => removeEntry(dayKey, entry.id)} className="text-white/40 hover:text-white/80">
                ✕
              </button>
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-3 text-center text-[11px] text-white/35">
        Local only: entries stay in this browser's storage. Nothing syncs, uploads,
        or reads your calendar or location — you log every interval by hand.
      </p>
    </div>
  );
}
