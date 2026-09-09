import { HAND_STYLES, writeHandStyle } from '@/lib/clockPrefs';

export default function HandStyleSelect({ value }) {
  return (
    <div className="w-full">
      <p className="mb-2 text-center text-[13px] text-white/45">Hand style</p>
      <div className="mx-auto flex max-w-md justify-center gap-1 rounded-lg bg-[#1c1c1e] p-1">
        {HAND_STYLES.map((style) => {
          const active = value === style.id;
          return (
            <button
              key={style.id}
              type="button"
              onClick={() => writeHandStyle(style.id)}
              className={`flex-1 rounded-md px-2 py-1.5 text-[12px] font-medium ${
                active ? 'bg-[#3a3a3c] text-white' : 'text-white/50'
              }`}
            >
              {style.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
