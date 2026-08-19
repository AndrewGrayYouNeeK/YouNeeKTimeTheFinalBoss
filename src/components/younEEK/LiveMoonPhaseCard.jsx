import { useEffect, useMemo, useState } from 'react';
import { getMoonPhase } from '@/lib/moonPhase';

function normalizePhase(phase) {
  const value = (phase || '').toLowerCase();

  if (value.includes('new')) return 'New Moon';
  if (value.includes('waxing') && value.includes('crescent')) return 'Waxing Crescent';
  if (value.includes('first')) return 'First Quarter';
  if (value.includes('waxing') && value.includes('gibbous')) return 'Waxing Gibbous';
  if (value.includes('full')) return 'Full Moon';
  if (value.includes('waning') && value.includes('gibbous')) return 'Waning Gibbous';
  if (value.includes('last') || value.includes('third')) return 'Last Quarter';
  if (value.includes('waning') && value.includes('crescent')) return 'Waning Crescent';

  return phase || 'Moon Phase';
}

export default function LiveMoonPhaseCard() {
  const [moon, setMoon] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMoon = () => {
      setLoading(true);
      try {
        setMoon(getMoonPhase());

        if (typeof navigator !== 'undefined' && navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              setMoon(getMoonPhase({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              }));
            },
            () => {},
            { timeout: 5000 }
          );
        }
      } catch (error) {
        console.error('Failed to compute moon phase:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMoon();

    const handleRefresh = () => loadMoon();
    window.addEventListener('refresh-data', handleRefresh);
    return () => window.removeEventListener('refresh-data', handleRefresh);
  }, []);

  const phaseName = useMemo(() => normalizePhase(moon?.phase), [moon?.phase]);
  const isWaxing = useMemo(() => {
    const p = phaseName.toLowerCase();
    return p.includes('waxing') || p.includes('first') || p.includes('new');
  }, [phaseName]);

  if (loading) {
    return (
      <section className="w-full relative rounded-[1.6rem] overflow-hidden border border-emerald-200/15 bg-[#101010] p-6 sm:p-8 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04),0_0_26px_rgba(74,222,128,0.06)]">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 rounded bg-white/10" />
          <div className="space-y-4 pt-4">
            <div className="h-6 w-24 rounded bg-white/5" />
            <div className="h-6 w-24 rounded bg-white/5" />
            <div className="h-6 w-24 rounded bg-white/5" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full relative rounded-[1.6rem] overflow-hidden border border-emerald-200/15 bg-[#101010] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04),0_0_26px_rgba(74,222,128,0.06)]">
      <div className="absolute top-[-25%] left-1/2 -translate-x-1/2 w-[160%] aspect-square rounded-full overflow-hidden pointer-events-none opacity-80">
        <img
          src="https://images.unsplash.com/photo-1522030299830-16b8d3d049fe?auto=format&fit=crop&w=800&q=80"
          className="absolute inset-0 w-full h-full object-cover"
          alt="Moon"
          style={{ filter: 'grayscale(100%) contrast(1.1) brightness(1.2)' }}
        />
        <div
          className="absolute bg-[#101010]"
          style={{
            top: '-5%',
            bottom: '-5%',
            width: '100%',
            left: isWaxing ? `-${moon?.illumination || 0}%` : `${moon?.illumination || 0}%`,
            filter: 'blur(20px)',
            borderRadius: '50%',
          }}
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-[#101010] from-35% via-[#101010]/80 via-55% to-transparent pointer-events-none" />

      <div className="relative z-10 px-6 sm:px-8 pt-44 pb-8 flex flex-col items-center text-center">
        <div className="mb-8">
          <p className="font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.4em] text-[#39ff14] drop-shadow-[0_0_8px_rgba(57,255,20,0.4)]">Live moon phase</p>
          <h2 className="mt-3 font-mono text-xl sm:text-2xl font-bold uppercase tracking-[0.35em] text-white drop-shadow-lg">{phaseName}</h2>
        </div>

        <div className="flex flex-col gap-4 items-center">
          <div>
            <p className="font-mono text-[9px] font-bold uppercase tracking-[0.3em] text-white/40">Illumination</p>
            <p className="mt-1 font-mono text-sm tracking-widest text-white/80">{moon?.illumination || 0}%</p>
          </div>
          <div>
            <p className="font-mono text-[9px] font-bold uppercase tracking-[0.3em] text-white/40">Moonrise</p>
            <p className="mt-1 font-mono text-sm tracking-widest text-white/80">{moon?.moonrise || '—'}</p>
          </div>
          <div>
            <p className="font-mono text-[9px] font-bold uppercase tracking-[0.3em] text-white/40">Moonset</p>
            <p className="mt-1 font-mono text-sm tracking-widest text-white/80">{moon?.moonset || '—'}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
