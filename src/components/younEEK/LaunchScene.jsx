export default function LaunchScene({ sceneFade, parallax }) {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[1] overflow-hidden"
      style={{ opacity: sceneFade }}
      aria-hidden="true"
    >
      <div
        className="absolute inset-[-12%] will-change-transform"
        style={{
          backgroundImage: 'url(/astronaut-dial-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 40%',
          transform: `translate3d(0, ${parallax * 0.55}px, 0) scale(1.08)`,
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, #000 0%, transparent 28%, transparent 62%, #000000cc 100%)',
        }}
      />
    </div>
  );
}
