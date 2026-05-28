import { useEffect, useRef } from 'react';

export default function CosmicBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Multi-layer parallax starfield
    const layers = [
      { count: 200, speed: 0.02, size: [0.3, 0.8], opacity: [0.3, 0.7] },
      { count: 120, speed: 0.05, size: [0.5, 1.2], opacity: [0.5, 0.9] },
      { count: 60, speed: 0.1, size: [0.8, 1.8], opacity: [0.7, 1] },
    ];

    const stars = layers.flatMap((layer) =>
      Array.from({ length: layer.count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: layer.size[0] + Math.random() * (layer.size[1] - layer.size[0]),
        baseOpacity: layer.opacity[0] + Math.random() * (layer.opacity[1] - layer.opacity[0]),
        twinkleSpeed: 0.005 + Math.random() * 0.02,
        twinkleOffset: Math.random() * Math.PI * 2,
        speed: layer.speed,
        color: Math.random() > 0.85
          ? `hsl(${200 + Math.random() * 60}, 80%, 80%)`
          : Math.random() > 0.7
          ? `hsl(${30 + Math.random() * 20}, 90%, 85%)`
          : '#ffffff',
      }))
    );

    // Distant galaxies / nebulas (soft glowing blobs)
    const nebulas = [
      { x: 0.2, y: 0.15, r: 280, color: 'rgba(139, 92, 246, 0.18)', drift: 0 },
      { x: 0.8, y: 0.25, r: 340, color: 'rgba(236, 72, 153, 0.13)', drift: 1 },
      { x: 0.5, y: 0.55, r: 420, color: 'rgba(34, 211, 238, 0.10)', drift: 2 },
      { x: 0.15, y: 0.78, r: 300, color: 'rgba(34, 197, 94, 0.10)', drift: 3 },
      { x: 0.85, y: 0.85, r: 360, color: 'rgba(251, 146, 60, 0.10)', drift: 4 },
      { x: 0.4, y: 0.3, r: 220, color: 'rgba(59, 130, 246, 0.12)', drift: 5 },
    ];

    // Spiral galaxy
    const galaxy = {
      x: width * 0.78,
      y: height * 0.18,
      arms: 3,
      particles: Array.from({ length: 600 }, (_, i) => {
        const arm = i % 3;
        const dist = Math.random();
        const angle = arm * ((Math.PI * 2) / 3) + dist * Math.PI * 4;
        return {
          dist,
          angle,
          size: 0.4 + Math.random() * 1.2,
          opacity: 0.3 + Math.random() * 0.6,
        };
      }),
      rotation: 0,
    };

    // Shooting stars
    const shootingStars = [];
    const spawnShootingStar = () => {
      shootingStars.push({
        x: Math.random() * width,
        y: Math.random() * height * 0.5,
        len: 80 + Math.random() * 120,
        speed: 8 + Math.random() * 6,
        angle: Math.PI / 4 + (Math.random() - 0.5) * 0.3,
        life: 1,
      });
    };

    let frame = 0;
    let animationId;

    const render = () => {
      frame++;

      // Deep space gradient base
      const grad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.5,
        0,
        width * 0.5,
        height * 0.5,
        Math.max(width, height)
      );
      grad.addColorStop(0, '#0a0820');
      grad.addColorStop(0.4, '#050415');
      grad.addColorStop(1, '#000000');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Nebulas — soft glowing clouds
      nebulas.forEach((n, i) => {
        const t = frame * 0.0008 + n.drift;
        const cx = n.x * width + Math.sin(t) * 25;
        const cy = n.y * height + Math.cos(t * 0.7) * 20;
        const pulseR = n.r + Math.sin(frame * 0.005 + i) * 30;

        const nebGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, pulseR);
        nebGrad.addColorStop(0, n.color);
        nebGrad.addColorStop(0.5, n.color.replace(/[\d.]+\)/, '0.05)'));
        nebGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = nebGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, pulseR, 0, Math.PI * 2);
        ctx.fill();
      });

      // Spiral galaxy
      galaxy.rotation += 0.0008;
      ctx.save();
      ctx.translate(galaxy.x, galaxy.y);
      ctx.rotate(galaxy.rotation);

      // Galaxy core glow
      const coreGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, 60);
      coreGrad.addColorStop(0, 'rgba(255, 230, 180, 0.8)');
      coreGrad.addColorStop(0.4, 'rgba(255, 180, 120, 0.3)');
      coreGrad.addColorStop(1, 'rgba(180, 100, 200, 0)');
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(0, 0, 60, 0, Math.PI * 2);
      ctx.fill();

      galaxy.particles.forEach((p) => {
        const radius = p.dist * 140;
        const px = Math.cos(p.angle) * radius;
        const py = Math.sin(p.angle) * radius * 0.35; // flatten
        const hue = 220 + p.dist * 100;
        ctx.fillStyle = `hsla(${hue}, 70%, 80%, ${p.opacity * (1 - p.dist * 0.5)})`;
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();

      // Stars with twinkling
      stars.forEach((s) => {
        const twinkle = Math.sin(frame * s.twinkleSpeed + s.twinkleOffset);
        const opacity = s.baseOpacity * (0.5 + twinkle * 0.5);
        ctx.fillStyle = s.color.includes('hsl')
          ? s.color.replace(')', `, ${opacity})`).replace('hsl', 'hsla')
          : `rgba(255, 255, 255, ${opacity})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();

        // Glow on bigger stars
        if (s.r > 1.3) {
          ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.15})`;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r * 3, 0, Math.PI * 2);
          ctx.fill();
        }

        // Slow drift
        s.y += s.speed * 0.3;
        if (s.y > height) {
          s.y = 0;
          s.x = Math.random() * width;
        }
      });

      // Shooting stars
      if (Math.random() < 0.004) spawnShootingStar();
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        const dx = Math.cos(ss.angle) * ss.speed;
        const dy = Math.sin(ss.angle) * ss.speed;
        ss.x += dx;
        ss.y += dy;
        ss.life -= 0.01;

        const tailX = ss.x - Math.cos(ss.angle) * ss.len;
        const tailY = ss.y - Math.sin(ss.angle) * ss.len;
        const tailGrad = ctx.createLinearGradient(ss.x, ss.y, tailX, tailY);
        tailGrad.addColorStop(0, `rgba(255, 255, 255, ${ss.life})`);
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

      animationId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      galaxy.x = width * 0.78;
      galaxy.y = height * 0.18;
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
      {/* Dark gradient at top to keep header readable */}
      <div className="absolute inset-x-0 top-0 h-[350px] bg-gradient-to-b from-black via-black/80 to-transparent" />
    </div>
  );
}