import { useEffect, useState } from 'react';
import { disposeAudio, ensureAudio, getSoundPrefs, setSoundPrefs } from '@/lib/segmentAudio';
import { BLUE } from './clockConstants';

export default function SoundControls() {
  const [enabled, setEnabled] = useState(getSoundPrefs().enabled);
  const [gain, setGain] = useState(Math.round(getSoundPrefs().gain * 100));

  useEffect(() => () => disposeAudio(), []);

  const toggle = () => {
    const next = !enabled;
    if (next) {
      ensureAudio();
    } else {
      disposeAudio();
    }
    setSoundPrefs({ enabled: next, gain: gain / 100 });
    setEnabled(next);
  };

  const changeGain = (value) => {
    const next = Number(value);
    setGain(next);
    setSoundPrefs({ enabled, gain: next / 100 });
  };

  return (
    <div className="w-full">
      <p className="mb-2 text-center font-mono text-[10px] uppercase tracking-widest text-white/40">
        Mode sound
      </p>
      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={toggle}
          aria-pressed={enabled}
          className="rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors"
          style={{
            borderColor: enabled ? BLUE : 'rgba(255,255,255,0.18)',
            color: enabled ? BLUE : 'rgba(255,255,255,0.45)',
            background: enabled ? 'rgba(124,255,107,0.08)' : 'transparent',
            boxShadow: enabled ? `0 0 12px ${BLUE}44` : 'none',
          }}
        >
          {enabled ? 'Sound on' : 'Sound off'}
        </button>
        {enabled && (
          <label className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">
            Gain
            <input
              type="range"
              min="0"
              max="100"
              value={gain}
              onChange={(e) => changeGain(e.target.value)}
              className="w-24 accent-[#7CFF6B]"
            />
          </label>
        )}
      </div>
      <p className="mt-2 text-center text-[11px] text-white/35">
        Reflect clicks once per segment; Move ticks each decimal second with a
        pitch that rises through the day. Audio starts only from this button and
        mobile systems may silence it in the background.
      </p>
    </div>
  );
}
