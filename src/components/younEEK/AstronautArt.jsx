export default function AstronautArt({ className = '', style, thruster = false }) {
  return (
    <div className={`relative ${className}`} style={style} aria-hidden="true">
      <img
        src="/astro-leg.png"
        alt=""
        className="absolute"
        style={{ left: '28%', top: '48%', width: '18%', height: '48%', transform: 'rotate(18deg)', transformOrigin: 'top center' }}
      />
      <img
        src="/astro-leg.png"
        alt=""
        className="absolute"
        style={{ left: '54%', top: '48%', width: '18%', height: '48%', transform: 'rotate(-18deg)', transformOrigin: 'top center' }}
      />
      <img
        src="/astro-torso.png"
        alt=""
        className="absolute left-1/2 top-0 -translate-x-1/2"
        style={{ width: '72%', height: '58%', objectFit: 'contain' }}
      />
      <img
        src="/astro-arm.png"
        alt=""
        className="absolute"
        style={{ left: '4%', top: '22%', width: '22%', height: '42%', transform: 'rotate(-28deg) scaleX(-1)', transformOrigin: 'top center' }}
      />
      <img
        src="/astro-arm.png"
        alt=""
        className="absolute"
        style={{ right: '4%', top: '22%', width: '22%', height: '42%', transform: 'rotate(28deg)', transformOrigin: 'top center' }}
      />
      {thruster && (
        <div
          className="absolute left-1/2 rounded-full"
          style={{
            bottom: '-8%',
            width: '34%',
            height: '22%',
            transform: 'translateX(-50%)',
            background: 'radial-gradient(circle, #ffe600cc 0%, #00b7ff66 45%, transparent 70%)',
            filter: 'blur(2px)',
            opacity: 0.85,
          }}
        />
      )}
    </div>
  );
}
