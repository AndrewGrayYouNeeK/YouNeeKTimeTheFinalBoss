import { useEffect, useState } from 'react';
import YouNeekClock from '@/components/YouNeekClock';
import StarsBackground from '@/components/younEEK/StarsBackground';
import ShipHangarScene from '@/components/younEEK/ShipHangarScene';
import PullToRefresh from '@/components/PullToRefresh';
import useLaunchScroll from '@/hooks/useLaunchScroll';
import { PREFS_EVENT, readClockSource } from '@/lib/clockPrefs';

export default function Index() {
  const { sceneFade, launch, dock, parallax } = useLaunchScroll();
  const [source, setSource] = useState(readClockSource);
  const army = source === 'army';

  useEffect(() => {
    const sync = () => setSource(readClockSource());
    window.addEventListener(PREFS_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(PREFS_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const handleRefresh = async () => {
    window.dispatchEvent(new Event('refresh-data'));
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  return (
    <div className="relative min-h-screen text-white" style={{ background: '#000' }}>
      <StarsBackground starOpacity={sceneFade * 0.55} />
      <ShipHangarScene sceneFade={sceneFade} dock={dock} parallax={parallax} army={army} />
      <PullToRefresh onRefresh={handleRefresh}>
        <div className="relative z-10">
          <YouNeekClock launch={launch} dock={dock} />
        </div>
      </PullToRefresh>
    </div>
  );
}
