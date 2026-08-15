import { useEffect, useRef, useState } from 'react';
import { Activity, Smartphone, Hand } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { triggerFaint, triggerStrong } from '@/lib/haptics';
import { requestWakeLock, releaseWakeLock } from '@/lib/wakeLock';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const STORAGE_KEY = 'hapticPocketMode';

export default function HapticTimeManager({ time }) {
  const [enabled, setEnabled] = useState(() => localStorage.getItem(STORAGE_KEY) === 'true');
  const [isPlayingTime, setIsPlayingTime] = useState(false);
  const [wakeLockOn, setWakeLockOn] = useState(false);
  const enabledRef = useRef(enabled);
  const isPlayingRef = useRef(isPlayingTime);
  const timeRef = useRef(time);
  const lastUnitRef = useRef(time.units);

  useEffect(() => {
    timeRef.current = time;
  }, [time]);

  useEffect(() => {
    enabledRef.current = enabled;
    localStorage.setItem(STORAGE_KEY, enabled ? 'true' : 'false');
  }, [enabled]);

  useEffect(() => {
    isPlayingRef.current = isPlayingTime;
  }, [isPlayingTime]);

  useEffect(() => {
    if (!enabled) {
      releaseWakeLock();
      setWakeLockOn(false);
      return;
    }

    let cancelled = false;
    requestWakeLock().then((ok) => {
      if (!cancelled) setWakeLockOn(ok);
    });

    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && enabledRef.current) {
        requestWakeLock().then((ok) => setWakeLockOn(ok));
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      cancelled = true;
      document.removeEventListener('visibilitychange', handleVisibility);
      releaseWakeLock();
      setWakeLockOn(false);
    };
  }, [enabled]);

  const playDigit = async (digit, isHour) => {
    if (digit === 0) {
      isHour ? triggerStrong() : triggerFaint();
      await sleep(150);
      isHour ? triggerStrong() : triggerFaint();
      await sleep(500);
      return;
    }

    for (let i = 0; i < digit; i++) {
      if (!enabledRef.current) return;
      isHour ? triggerStrong() : triggerFaint();
      await sleep(isHour ? 500 : 300);
    }
  };

  const tellTime = async (currentTime) => {
    if (isPlayingRef.current || !enabledRef.current) return;
    setIsPlayingTime(true);
    isPlayingRef.current = true;

    const hours = currentTime.units;
    const minutes = currentTime.minutes;

    // Opening signal — three strong pulses so you know time is starting
    triggerStrong();
    await sleep(200);
    triggerStrong();
    await sleep(200);
    triggerStrong();
    await sleep(800);

    const hTens = Math.floor(hours / 10);
    const hOnes = hours % 10;

    await playDigit(hTens, true);
    await sleep(700);
    if (!enabledRef.current) { setIsPlayingTime(false); isPlayingRef.current = false; return; }
    await playDigit(hOnes, true);

    await sleep(1400);
    if (!enabledRef.current) { setIsPlayingTime(false); isPlayingRef.current = false; return; }

    const mTens = Math.floor(minutes / 10);
    const mOnes = minutes % 10;

    await playDigit(mTens, false);
    await sleep(600);
    if (!enabledRef.current) { setIsPlayingTime(false); isPlayingRef.current = false; return; }
    await playDigit(mOnes, false);

    // Closing signal — two faint pulses
    await sleep(600);
    triggerFaint();
    await sleep(200);
    triggerFaint();

    setIsPlayingTime(false);
    isPlayingRef.current = false;
  };

  const lastMinuteRef = useRef(time.minutes);

  useEffect(() => {
    if (!enabled) return;
    if (time.minutes !== lastMinuteRef.current) {
      lastMinuteRef.current = time.minutes;
      if (!isPlayingRef.current) {
        triggerFaint();
      }
    }
  }, [time.minutes, enabled]);

  useEffect(() => {
    if (!enabled) return;
    if (time.units !== lastUnitRef.current) {
      lastUnitRef.current = time.units;
      if (!isPlayingRef.current) {
        tellTime(time);
      }
    }
  }, [time.units, enabled]);

  const handleToggle = () => {
    const newState = !enabled;
    setEnabled(newState);

    if (newState) {
      setTimeout(() => {
        if (enabledRef.current) tellTime(timeRef.current);
      }, 1500);
    } else {
      setIsPlayingTime(false);
      isPlayingRef.current = false;
    }
  };

  const handleFeelNow = () => {
    if (!enabled) return;
    setTimeout(() => tellTime(timeRef.current), 400);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full mt-2">
      <Button
        data-haptic="strong"
        variant="outline"
        className={`gap-2 rounded-full transition-colors border-2 ${
          enabled
            ? 'bg-[#39ff14]/10 text-[#39ff14] border-[#39ff14]/60 hover:bg-[#39ff14]/20 hover:text-[#39ff14]'
            : 'bg-transparent text-white/50 border-white/20 hover:text-white hover:border-white/40'
        }`}
        onClick={handleToggle}
      >
        {enabled ? <Activity className="w-4 h-4 animate-pulse" /> : <Smartphone className="w-4 h-4" />}
        {enabled ? 'Haptic Pocket Mode: ON' : 'Haptic Pocket Mode: OFF'}
      </Button>

      {enabled && (
        <div className="mt-4 text-center space-y-3 max-w-xs">
          <div className="space-y-1">
            <p className="text-[10px] text-[#39ff14]/70 font-mono tracking-widest uppercase">
              {isPlayingTime ? 'Playing time…' : 'Active — feel the time by pulse'}
            </p>
            <p className="text-[9px] text-white/40 font-mono tracking-wide leading-relaxed">
              {wakeLockOn ? 'Screen kept awake' : 'Keep screen on in pocket'}
            </p>
          </div>

          <Button
            data-haptic="faint"
            variant="outline"
            size="sm"
            disabled={isPlayingTime}
            onClick={handleFeelNow}
            className="gap-2 rounded-full border-[#39ff14]/30 text-[#39ff14]/80 hover:bg-[#39ff14]/10 hover:text-[#39ff14] text-[10px] font-mono uppercase tracking-widest"
          >
            <Hand className="w-3.5 h-3.5" />
            Feel Time Now
          </Button>

          <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left space-y-1.5">
            <p className="text-[9px] text-white/50 font-mono uppercase tracking-widest">How to read by feel</p>
            <p className="text-[9px] text-white/35 font-mono leading-relaxed">
              <span className="text-[#39ff14]/60">Strong</span> pulses = YouNeeK hour digits (tens, then ones)
            </p>
            <p className="text-[9px] text-white/35 font-mono leading-relaxed">
              <span className="text-white/50">Soft</span> pulses = minute digits (tens, then ones)
            </p>
            <p className="text-[9px] text-white/35 font-mono leading-relaxed">
              Double pulse = zero · Soft heartbeat every ~8 sec
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
