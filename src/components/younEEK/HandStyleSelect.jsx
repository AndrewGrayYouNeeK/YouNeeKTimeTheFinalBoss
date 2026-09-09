import { HAND_STYLES, writeHandStyle } from '@/lib/clockPrefs';
import { YELLOW } from './clockConstants';

export default function HandStyleSelect({ value }) {
  return (
    <div className="w-full">
      <p className="mb-2 text-center font-mono text-[10px] uppercase tracking-widest text-white/40">
        Hand style
      </p>
      <div className="mx-auto flex max-w-md flex-wrap justify-center gap-2">
        {HAND_STYLES.map((style) => {
          const active = value === style.id;
          return (
            <button
              key={style.id}
              type="button"
              onClick={() => writeHandStyle(style.id)}
              className="rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors"
              style={{
                borderColor: active ? YELLOW : 'rgba(255,255,255,0.18)',
                color: active ? YELLOW : 'rgba(255,255,255,0.45)',
                background: active ? 'rgba(255,230,0,0.08)' : 'transparent',
                boxShadow: active ? `0 0 12px ${YELLOW}44` : 'none',
              }}
            >
              {style.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
