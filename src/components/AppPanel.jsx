export default function AppPanel({ children, className = '' }) {
  return (
    <section className={`w-full rounded-2xl border border-[#7CFF6B]/15 bg-white/[0.04] p-5 ${className}`}>
      {children}
    </section>
  );
}
