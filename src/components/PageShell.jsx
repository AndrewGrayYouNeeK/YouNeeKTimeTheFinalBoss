import StarsBackground from '@/components/younEEK/StarsBackground';

export default function PageShell({ children, wide = false, topPad = false }) {
  return (
    <div className="relative min-h-screen text-white" style={{ background: '#000' }}>
      <StarsBackground />
      <div
        className={`relative z-10 mx-auto w-full px-4 pb-28 ${wide ? 'max-w-2xl' : 'max-w-[36rem]'} ${
          topPad ? 'pt-24' : 'pt-6'
        }`}
      >
        {children}
      </div>
    </div>
  );
}
