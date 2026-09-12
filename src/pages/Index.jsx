import YouNeekClock from '@/components/YouNeekClock';
import PageShell from '@/components/PageShell';
import PullToRefresh from '@/components/PullToRefresh';

export default function Index() {
  const handleRefresh = async () => {
    window.dispatchEvent(new Event('refresh-data'));
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  return (
    <PageShell>
      <PullToRefresh onRefresh={handleRefresh}>
        <YouNeekClock />
      </PullToRefresh>
    </PageShell>
  );
}
