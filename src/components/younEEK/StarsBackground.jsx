import { useEffect, useRef } from 'react';

export default function StarsBackground({ starOpacity = 1 }) {
  const canvasRef = useRef(null);
  const opacityRef = useRef(starOpacity);
  opacityRef.current = starOpacity;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Multi-layer twinkling starfield
    const layers = [
      { count: 200, size: [0.3, 0.8], opacity: [0.3, 0.7] },
      { count: 120, size: [0.5, 1.2], opacity: [0.5, 0.9] },
      { count: 60, size: [0.8, 1.8], opacity: [0.7, 1] },
    ];

    const stars = layers.flatMap((layer) =>
      Array.from({ length: layer.count }, () => {
        // ~30% of stars are "strong twinklers" — faster, deeper twinkle
        const isStrongTwinkler = Math.random() < 0.3;
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          r: layer.size[0] + Math.random() * (layer.size[1] - layer.size[0]),
          baseOpacity: layer.opacity[0] + Math.random() * (layer.opacity[1] - layer.opacity[0]),
          twinkleSpeed: isStrongTwinkler ? 0.04 + Math.random() * 0.05 : 0.005 + Math.random() * 0.015,
          twinkleOffset: Math.random() * Math.PI * 2,
          twinkleDepth: isStrongTwinkler ? 0.95 : 0.4,
        };
      })
    );

    // Shooting stars
    const shootingStars = [];
    const spawnShootingStar = () => {
      shootingStars.push({
        x: Math.random() * width,
        y: Math.random() * height * 0.5,
        len: 120 + Math.random() * 160,
        speed: 18 + Math.random() * 10,
        angle: Math.PI / 4 + (Math.random() - 0.5) * 0.3,
        life: 1,
      });
    };

    let frame = 0;
    let animationId;

    const render = () => {
      frame++;

      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      const field = Math.max(0, Math.min(1, opacityRef.current));
      if (field > 0.001) {
        const globalPulse = 0.85 + Math.sin(frame * 0.0175) * 0.15;

        stars.forEach((s) => {
          const twinkle = Math.sin(frame * s.twinkleSpeed + s.twinkleOffset);
          const opacity = Math.max(
            0,
            s.baseOpacity * (1 - s.twinkleDepth + twinkle * s.twinkleDepth) * globalPulse * field
          );
          ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fill();

          if (s.r > 1.3) {
            ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.15})`;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r * 3, 0, Math.PI * 2);
            ctx.fill();
          }
        });

        if (Math.random() < 0.004 * field) spawnShootingStar();
        for (let i = shootingStars.length - 1; i >= 0; i--) {
          const ss = shootingStars[i];
          ss.x += Math.cos(ss.angle) * ss.speed;
          ss.y += Math.sin(ss.angle) * ss.speed;
          ss.life -= 0.01;

          const tailX = ss.x - Math.cos(ss.angle) * ss.len;
          const tailY = ss.y - Math.sin(ss.angle) * ss.len;
          const tailGrad = ctx.createLinearGradient(ss.x, ss.y, tailX, tailY);
          tailGrad.addColorStop(0, `rgba(255, 255, 255, ${ss.life * field})`);
          tailGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
          ctx.strokeStyle = tailGrad;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(ss.x, ss.y);
          ctx.lineTo(tailX, tailY);
          ctx.stroke();

          if (ss.life <= 0 || ss.x > width || ss.y > height) {
            shootingStars.splice(i, 1);
          }
        }
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}