import { useEffect, useState } from 'react';
import AstronautArt from './AstronautArt';

function lerp(a, b, t) {
  return a + (b - a) * t;
}

export default function AstronautFlyer({ hubRef, landRef, launch }) {
  const [pose, setPose] = useState({ x: 0, y: 0, size: 96, rot: 0, ready: false });

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const hub = hubRef?.current?.getBoundingClientRect();
      const sticky = document.querySelector('.clock-sticky')?.getBoundingClientRect();
      if (!hub || !sticky) {
        raf = requestAnimationFrame(tick);
        return;
      }

      const t = Math.min(1, Math.max(0, launch));
      // Linear with a light lead so the unhook feels like a launch, not a scroll drag
      const fly = Math.min(1, t * 1.08);
      const hubSize = Math.min(hub.width, hub.height) * 1.55;
      const landSize = Math.min(window.innerWidth * 0.4, 200);
      const size = lerp(hubSize, landSize, fly);

      const hx = hub.left + hub.width / 2;
      const hy = hub.top + hub.height / 2;
      const sceneTop = sticky.bottom + 8;
      const sceneBottom = window.innerHeight - 96;
      const parkY = sceneTop + (sceneBottom - sceneTop) * 0.55;
      const parkX = window.innerWidth / 2;
      const x = lerp(hx, parkX, fly);
      const y = lerp(hy, parkY, fly);
      const rot = lerp(0, -14, Math.sin(fly * Math.PI));

      setPose({ x, y, size, rot, ready: true });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [hubRef, landRef, launch]);

  if (!pose.ready || launch < 0.03) return null;

  const w = pose.size;
  const h = pose.size * 1.35;

  return (
    <AstronautArt
      arms={false}
      thruster={launch > 0.04 && launch < 0.92}
      className="pointer-events-none fixed z-[35]"
      style={{
        left: pose.x,
        top: pose.y,
        width: w,
        height: h,
        transform: `translate(-50%, -50%) rotate(${pose.rot}deg)`,
        filter: 'brightness(0.55) contrast(1.12) drop-shadow(0 8px 18px #000c)',
        willChange: 'transform, left, top',
      }}
    />
  );
}
