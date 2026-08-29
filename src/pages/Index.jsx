import YouNeekClock from '@/components/YouNeekClock';
import StarsBackground from '@/components/younEEK/StarsBackground';
import VolcanoEruptFlash from '@/components/landing/VolcanoEruptFlash';
import AshCoalOverlay from '@/components/landing/AshCoalOverlay';
import SkyCraft from '@/components/younEEK/SkyCraft';
import PullToRefresh from '@/components/PullToRefresh';

export default function Index() {
  const handleRefresh = async () => {
    window.dispatchEvent(new Event('refresh-data'));
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  return (
    <div className="min-h-screen relative text-white" style={{ background: 'transparent' }}>
      <StarsBackground />
      <VolcanoEruptFlash />
      <AshCoalOverlay />
      <SkyCraft />
      <PullToRefresh onRefresh={handleRefresh}>
        <div className="relative z-10">
          <YouNeekClock />
        </div>
      </PullToRefresh>
    </div>
  );
}
