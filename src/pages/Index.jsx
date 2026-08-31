import YouNeekClock from '@/components/YouNeekClock';
import StarsBackground from '@/components/younEEK/StarsBackground';
import VolcanoBackground from '@/components/landing/VolcanoBackground';
import AshCoalOverlay from '@/components/landing/AshCoalOverlay';
import LaunchScene from '@/components/younEEK/LaunchScene';
import SkyCraft from '@/components/younEEK/SkyCraft';
import PullToRefresh from '@/components/PullToRefresh';
import useLaunchScroll from '@/hooks/useLaunchScroll';

export default function Index() {
  const { sceneFade, launch, parallax } = useLaunchScroll();

  const handleRefresh = async () => {
    window.dispatchEvent(new Event('refresh-data'));
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  return (
    <div className="relative min-h-screen text-white" style={{ background: '#000' }}>
      <StarsBackground starOpacity={sceneFade} />
      <LaunchScene sceneFade={sceneFade} parallax={parallax} />
      <div style={{ opacity: sceneFade * 0.85 }}>
        <VolcanoBackground parallax={parallax} />
      </div>
      <div style={{ opacity: sceneFade }}>
        <AshCoalOverlay />
        <SkyCraft />
      </div>
      <PullToRefresh onRefresh={handleRefresh}>
        <div className="relative z-10">
          <YouNeekClock launch={launch} />
        </div>
      </PullToRefresh>
    </div>
  );
}
