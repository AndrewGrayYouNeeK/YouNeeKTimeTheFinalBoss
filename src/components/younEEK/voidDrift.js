// Bounded specks. No allocations. Skipped when the user prefers reduced motion.
export function drawVoidDrift(ctx, w, h, now, reduced) {
  if (reduced || !w || !h) return;
  ctx.save();
  for (let i = 0; i < 22; i++) {
    const spd = 0.006 + (i % 4) * 0.002;
    const x = (i * 53.7 + now * spd) % w;
    const y = (i * 31.2 + now * spd * 0.57) % h;
    ctx.globalAlpha = 0.028 + (i % 5) * 0.007;
    ctx.fillStyle = '#f4f0e6';
    ctx.fillRect(x, y, 1, 1);
  }
  ctx.restore();
}
