export default function LightningFlash() {
  return (
    <div
      className="fixed inset-0 bg-white opacity-0 pointer-events-none z-[65] animate-lightning-flash"
      style={{ mixBlendMode: 'screen' }}
      aria-hidden="true"
    />
  );
}
