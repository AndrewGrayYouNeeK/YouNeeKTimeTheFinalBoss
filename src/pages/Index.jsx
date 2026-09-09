import YouNeekClock from '@/components/YouNeekClock';
import PullToRefresh from '@/components/PullToRefresh';

export default function Index() {
  const handleRefresh = async () => {
    window.dispatchEvent(new Event('refresh-data'));
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  return (
    <div className="relative min-h-screen bg-black text-white">
      <PullToRefresh onRefresh={handleRefresh}>
        <div className="relative z-10">
          <YouNeekClock />
        </div>
      </PullToRefresh>
    </div>
  );
}
