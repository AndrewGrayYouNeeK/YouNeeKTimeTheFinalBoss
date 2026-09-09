import { formatDigital } from '@/lib/clockPrefs';

export default function DigitalTimeDisplay({ time, source = 'youneek' }) {
  const text = formatDigital(time, source).replace('•', ':');

  return (
    <div className="w-full text-center">
      <p
        className="select-none text-[5.4rem] font-thin leading-none tracking-tight text-white sm:text-[6.5rem]"
        style={{ fontFamily: 'system-ui, -apple-system, "SF Pro Display", sans-serif', fontVariantNumeric: 'tabular-nums' }}
      >
        {text}
      </p>
      <p className="mt-2 text-[13px] font-medium text-[#FF9F0A]" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        Timer
      </p>
    </div>
  );
}
