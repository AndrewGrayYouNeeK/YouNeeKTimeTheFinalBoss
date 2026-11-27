export const COPYRIGHT_LINE = 'YouNeeK™ · © 2026 Andrew Gray';

export default function SiteFooter() {
  return (
    <footer
      className="relative z-10 bg-black px-4 pt-6 text-center"
      style={{ paddingBottom: 'calc(7rem + env(safe-area-inset-bottom))' }}
    >
      <p className="font-mono text-[10px] leading-relaxed tracking-[0.14em] text-white/35">
        {COPYRIGHT_LINE}
      </p>
    </footer>
  );
}
