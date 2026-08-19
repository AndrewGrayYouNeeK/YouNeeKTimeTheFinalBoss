import YouNeekClock from '@/components/YouNeekClock';
import StarsBackground from '@/components/younEEK/StarsBackground';
import LightningBackdrop from '@/components/younEEK/LightningBackdrop';
import PullToRefresh from '@/components/PullToRefresh';

export default function Index() {
  const handleRefresh = async () => {
    window.dispatchEvent(new Event('refresh-data'));
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  return (
    <div className="min-h-screen relative text-white" style={{ background: 'transparent' }}>
      <StarsBackground />
      <LightningBackdrop />
      <PullToRefresh onRefresh={handleRefresh}>
        <div className="relative z-10">
          <YouNeekClock />
        </div>
      </PullToRefresh>
    </div>
  );
}
