import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ClockHeader from '@/components/younEEK/ClockHeader';
import { getDecimalTime } from '@/lib/decimalTime';
import { formatDigital, readClockSource } from '@/lib/clockPrefs';
import {
  getLunarDate,
  getLunarMonthDays,
  lunarNoteKey,
} from '@/lib/lunarCalendar';

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

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
  const lead = month.start.getDay();

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
    <div
      className="relative min-h-screen bg-black pb-28 text-white"
      style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
    >
      <div className="relative z-10 mx-auto flex w-full max-w-[36rem] flex-col px-4 pt-20">
        <ClockHeader />
        <h1 className="mt-4 text-[34px] font-bold tracking-tight">Calendar</h1>
        <p className="text-[15px] text-white/45">Lunar months · in-app YouNeeK time {formatDigital(time, source).replace('•', ':')}</p>

        <div className="mt-5 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setIndex((v) => v - 1)}
            className="flex h-11 w-11 items-center justify-center text-[#FF3B30]"
            aria-label="Previous lunation"
          >
            <ChevronLeft className="h-7 w-7" />
          </button>
          <div className="text-center">
            <p className="text-[22px] font-semibold text-[#FF3B30]">
              {headerDate.year} Lunar {headerDate.monthInYear}
            </p>
            <p className="text-[12px] text-white/40">
              {month.start.toLocaleDateString()} – {month.end.toLocaleDateString()}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIndex((v) => v + 1)}
            className="flex h-11 w-11 items-center justify-center text-[#FF3B30]"
            aria-label="Next lunation"
          >
            <ChevronRight className="h-7 w-7" />
          </button>
        </div>

        <button
          type="button"
          onClick={goToday}
          className="mt-1 self-end text-[17px] font-semibold text-[#FF3B30]"
        >
          Today
        </button>

        <div className="mt-3 grid grid-cols-7 text-center text-[12px] font-semibold text-white/35">
          {WEEKDAYS.map((d, i) => (
            <div key={`${d}-${i}`} className="py-2">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {Array.from({ length: lead }).map((_, i) => (
            <div key={`pad-${i}`} className="aspect-square" />
          ))}
          {month.days.map((d) => {
            const hasNote = !!readNote(index, d.day);
            const active = selected?.day === d.day;
            return (
              <button
                key={d.key}
                type="button"
                onClick={() => setSelectedDay(d.day)}
                className="flex aspect-square flex-col items-center justify-center"
              >
                <span
                  className={`flex h-[34px] w-[34px] items-center justify-center rounded-full text-[20px] ${
                    d.isToday
                      ? 'bg-[#FF3B30] text-white'
                      : active
                        ? 'bg-[#2c2c2e] text-white'
                        : 'text-white'
                  }`}
                >
                  {d.day}
                </span>
                {hasNote ? <span className="mt-0.5 h-1 w-1 rounded-full bg-[#FF3B30]" /> : <span className="mt-0.5 h-1 w-1" />}
              </button>
            );
          })}
        </div>

        {selected ? (
          <section className="mt-6 rounded-2xl bg-[#1c1c1e] p-4">
            <p className="text-[13px] font-semibold uppercase tracking-wide text-white/40">Selected</p>
            <h2 className="mt-1 text-[20px] font-semibold">{selectedLunar.longLabel}</h2>
            <p className="mt-1 text-[15px] text-white/55">
              {selected.date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
              {' · '}
              {selectedLunar.phase}
            </p>
            <label className="mt-4 block text-[13px] text-white/40" htmlFor="lunar-note">
              Note
            </label>
            <textarea
              id="lunar-note"
              value={note}
              onChange={(e) => saveNote(e.target.value)}
              rows={4}
              placeholder="Add a note for this lunar day"
              className="mt-2 w-full rounded-xl bg-black/40 p-3 text-[17px] text-white placeholder:text-white/30 outline-none"
            />
          </section>
        ) : null}
      </div>
    </div>
  );
}
