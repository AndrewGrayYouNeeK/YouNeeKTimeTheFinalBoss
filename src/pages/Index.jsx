import { useEffect, useState } from 'react';
import YouNeekClock from '@/components/YouNeekClock';
import StarsBackground from '@/components/younEEK/StarsBackground';
import ShipHangarScene from '@/components/younEEK/ShipHangarScene';
import PullToRefresh from '@/components/PullToRefresh';
import useSceneProgress from '@/hooks/useSceneProgress';
import { PREFS_EVENT, readClockSource } from '@/lib/clockPrefs';
import { LAYER_SPEED, layerOffsetY, sceneOpacity } from '@/lib/parallax';

export default function Index() {
  const { p, screenHeight, overscroll } = useSceneProgress();
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

  const starsY = layerOffsetY(p, LAYER_SPEED.stars, screenHeight);
  const starsOpacity = sceneOpacity(p) * 0.55;

  return (
    <div className="relative min-h-screen text-white" style={{ background: '#000' }}>
      {/* 1. Stars — almost stuck */}
      <StarsBackground starOpacity={starsOpacity} offsetY={starsY} />
      {/* 2–4. Planet / hull / bay — differential offsets from p */}
      <ShipHangarScene p={p} screenHeight={screenHeight} army={army} />
      {/* 5–6. Astronaut (keyed) + sticky clock (pinned) */}
      <PullToRefresh onRefresh={handleRefresh}>
        <div className="relative z-10">
          <YouNeekClock p={p} overscroll={overscroll} />
        </div>
      </PullToRefresh>
    </div>
  );
}
