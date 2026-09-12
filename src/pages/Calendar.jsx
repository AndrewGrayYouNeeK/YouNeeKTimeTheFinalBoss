import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import PageShell from '@/components/PageShell';
import { getDecimalTime } from '@/lib/decimalTime';
import { formatDigital, readClockSource } from '@/lib/clockPrefs';
import {
  getLunarDate,
  getLunarMonthDays,
  lunarNoteKey,
} from '@/lib/lunarCalendar';

function readNote(index, day) {
  return localStorage.getItem(lunarNoteKey(index, day)) || '';
}

function writeNote(index, day, text) {
  const key = lunarNoteKey(index, day);
  if (text.trim()) localStorage.setItem(key, text);
  else localStorage.removeItem(key);
}

export default function Calendar() {
  const todayLunar = useMemo(() => getLunarDate(new Date()), []);
  const [index, setIndex] = useState(todayLunar.index);
  const [selectedDay, setSelectedDay] = useState(todayLunar.day);
  const [note, setNote] = useState(() => readNote(todayLunar.index, todayLunar.day));
  const [now, setNow] = useState(() => new Date());
  const source = readClockSource();
  const time = getDecimalTime(now);

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 250);
    return () => window.clearInterval(id);
  }, []);

  const month = useMemo(() => getLunarMonthDays(index), [index]);
  const headerDate = useMemo(() => getLunarDate(month.start), [month.start]);
  const selected = month.days.find((d) => d.day === selectedDay) || month.days[0];
  const selectedLunar = selected ? getLunarDate(selected.date) : headerDate;

  useEffect(() => {
    if (!month.days.some((d) => d.day === selectedDay)) {
      setSelectedDay(month.days[0]?.day || 1);
    }
  }, [month, selectedDay]);

  useEffect(() => {
    if (selected) setNote(readNote(index, selected.day));
  }, [index, selected]);

  const saveNote = (value) => {
    setNote(value);
    if (selected) writeNote(index, selected.day, value);
  };

  const goToday = () => {
    const fresh = getLunarDate(new Date());
    setIndex(fresh.index);
    setSelectedDay(fresh.day);
  };

  return (
    <PageShell topPad>
      <div className="flex flex-col gap-6">
        <section className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#7CFF6B]">Lunar calendar</p>
          <p className="mt-2 font-mono text-lg uppercase tracking-[0.2em]">{todayLunar.longLabel}</p>
          <p className="mt-1 font-mono text-sm text-white/70">{todayLunar.phase} · {todayLunar.illumination}% lit</p>
          <p className="mt-3 font-mono text-2xl tracking-widest text-[#ffe600]">{formatDigital(time, source)}</p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">YouNeeK time · device clock is only a sensor</p>
        </section>

        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setIndex((v) => v - 1)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#7CFF6B]/20 text-[#7CFF6B]"
            aria-label="Previous lunation"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex-1 text-center">
            <p className="font-mono text-sm uppercase tracking-[0.25em]">
              {headerDate.year} · Month {headerDate.monthInYear}
            </p>
            <p className="font-mono text-[10px] text-white/40">
              {month.start.toLocaleDateString()} → {month.end.toLocaleDateString()} · {month.length} days
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIndex((v) => v + 1)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#7CFF6B]/20 text-[#7CFF6B]"
            aria-label="Next lunation"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <button
          type="button"
          onClick={goToday}
          className="self-center rounded-full border border-[#7CFF6B]/30 px-4 py-1 font-mono text-[10px] uppercase tracking-[0.3em] text-[#7CFF6B]"
        >
          Today
        </button>

        <div className="grid grid-cols-7 gap-1.5">
          {month.days.map((d) => {
            const hasNote = !!readNote(index, d.day);
            const active = selected?.day === d.day;
            return (
              <button
                key={d.key}
                type="button"
                onClick={() => setSelectedDay(d.day)}
                className={`flex aspect-square flex-col items-center justify-center rounded-xl border font-mono text-xs ${
                  active
                    ? 'border-[#7CFF6B] bg-[#7CFF6B]/20 text-white'
                    : d.isToday
                      ? 'border-[#ffe600]/60 bg-[#ffe600]/10 text-[#ffe600]'
                      : 'border-white/10 bg-black/40 text-white/80'
                }`}
              >
                <span>{d.day}</span>
                <span className="text-[8px] text-white/40">{d.date.getDate()}</span>
                {hasNote ? <span className="mt-0.5 h-1 w-1 rounded-full bg-[#7CFF6B]" /> : null}
              </button>
            );
          })}
        </div>

        {selected ? (
          <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#7CFF6B]">Selected day</p>
            <h2 className="mt-2 font-mono text-lg">{selectedLunar.longLabel}</h2>
            <p className="mt-1 text-sm text-white/60">
              Gregorian {selected.date.toLocaleDateString()} · {selectedLunar.phase} · {selectedLunar.illumination}%
            </p>
            <label className="mt-4 block font-mono text-[10px] uppercase tracking-[0.25em] text-white/40" htmlFor="lunar-note">
              Note (this device)
            </label>
            <textarea
              id="lunar-note"
              value={note}
              onChange={(e) => saveNote(e.target.value)}
              rows={4}
              placeholder="Add a note for this lunar day"
              className="mt-2 w-full rounded-xl border border-white/15 bg-black/50 p-3 font-mono text-sm text-white placeholder:text-white/30"
            />
          </section>
        ) : null}
      </div>
    </PageShell>
  );
}
