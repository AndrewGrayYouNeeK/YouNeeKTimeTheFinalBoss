import { RENDER_MODES, writeRenderMode } from '@/lib/clockPrefs';
import { BLUE } from './clockConstants';

export default function RenderModeSelect({ value }) {
  return (
    <div className="w-full">
      <p className="mb-2 text-center font-mono text-[10px] uppercase tracking-widest text-white/40">
        Render mode
      </p>
      <div className="mx-auto flex max-w-md flex-wrap justify-center gap-2">
        {RENDER_MODES.map((mode) => {
          const active = value === mode.id;
          return (
            <button
              key={mode.id}
              type="button"
              onClick={() => writeRenderMode(mode.id)}
              aria-pressed={active}
              className="rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors"
              style={{
                borderColor: active ? BLUE : 'rgba(255,255,255,0.18)',
                color: active ? BLUE : 'rgba(255,255,255,0.45)',
                background: active ? 'rgba(124,255,107,0.08)' : 'transparent',
                boxShadow: active ? `0 0 12px ${BLUE}44` : 'none',
              }}
            >
              {mode.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
