export default function AnimatedStars() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 bg-black">
      <div className="absolute inset-0 star-layer-1"></div>
      <div className="absolute inset-0 star-layer-2"></div>
      <div className="absolute inset-0 star-layer-3"></div>
      <div className="absolute inset-x-0 top-0 h-[350px] bg-gradient-to-b from-black via-black/90 to-transparent" />
    </div>
  );
}