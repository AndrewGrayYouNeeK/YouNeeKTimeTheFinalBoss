import YouNeekClock from '@/components/YouNeekClock';
import CosmicBackground from '@/components/younEEK/CosmicBackground';
import ShootingStar from '@/components/younEEK/ShootingStar';
import PullToRefresh from '@/components/PullToRefresh';

export default function Index() {
  const handleRefresh = async () => {
    window.dispatchEvent(new Event('refresh-data'));
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  return (
    <div className="min-h-screen relative bg-black text-white">
      <CosmicBackground />
      <ShootingStar />
      <PullToRefresh onRefresh={handleRefresh}>
        <div className="relative z-10">
          <YouNeekClock />
        </div>
      </PullToRefresh>
    </div>
  );
}