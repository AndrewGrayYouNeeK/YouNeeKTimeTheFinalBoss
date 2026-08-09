import { useEffect, useRef, useState } from 'react';
import { Activity, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { triggerFaint, triggerStrong } from '@/lib/haptics';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function HapticTimeManager({ time, now }) {
  const [enabled, setEnabled] = useState(false);
  const [isPlayingTime, setIsPlayingTime] = useState(false);
  const enabledRef = useRef(enabled);
  const isPlayingRef = useRef(isPlayingTime);
  const lastUnitRef = useRef(time.units);

  useEffect(() => {
    enabledRef.current = enabled;
  }, [enabled]);

  useEffect(() => {
    isPlayingRef.current = isPlayingTime;
  }, [isPlayingTime]);

  const playDigit = async (digit, isHour) => {
    if (digit === 0) {
      // Represent 0 as a quick double pulse
      isHour ? triggerStrong() : triggerFaint();
      await sleep(150);
      isHour ? triggerStrong() : triggerFaint();
      await sleep(500);
      return;
    }
    
    for (let i = 0; i < digit; i++) {
      if (!enabledRef.current) return;
      isHour ? triggerStrong() : triggerFaint();
      await sleep(isHour ? 500 : 300); // Stronger/slower for hours, faster/fainter for mins
    }
  };

  const tellTime = async (currentTime) => {
    if (isPlayingRef.current || !enabledRef.current) return;
    setIsPlayingTime(true);
    isPlayingRef.current = true;
    
    const hours = currentTime.units;
    const minutes = currentTime.minutes;
    
    await sleep(600); // Intro pause

    const hTens = Math.floor(hours / 10);
    const hOnes = hours % 10;
    
    await playDigit(hTens, true);
    await sleep(700);
    if (!enabledRef.current) { setIsPlayingTime(false); return; }
    await playDigit(hOnes, true);
    
    await sleep(1400); // Distinguishable pause between hours and minutes
    if (!enabledRef.current) { setIsPlayingTime(false); return; }
    
    const mTens = Math.floor(minutes / 10);
    const mOnes = minutes % 10;
    
    await playDigit(mTens, false);
    await sleep(600);
    if (!enabledRef.current) { setIsPlayingTime(false); return; }
    await playDigit(mOnes, false);
    
    await sleep(600);
    setIsPlayingTime(false);
    isPlayingRef.current = false;
  };

  // Heartbeat every time the second hand goes around (1 YouNeeK minute = 8.64s)
  const lastMinuteRef = useRef(time.minutes);

  useEffect(() => {
    if (!enabled) return;
    if (time.minutes !== lastMinuteRef.current) {
      lastMinuteRef.current = time.minutes;
      // Don't beat during time-telling
      if (!isPlayingRef.current) {
        triggerFaint();
      }
    }
  }, [time.minutes, enabled]);

  // Trigger time on YouNeeK Hour
  useEffect(() => {
    if (!enabled) return;
    if (time.units !== lastUnitRef.current) {
      lastUnitRef.current = time.units;
      tellTime(time);
    }
  }, [time.units, enabled]);

  const handleToggle = () => {
    const newState = !enabled;
    setEnabled(newState);
    
    if (newState) {
      triggerStrong();
      // Wait for a second so user can put phone in pocket, then demonstrate the time
      setTimeout(() => {
        if (enabledRef.current) tellTime(time);
      }, 1500);
    } else {
      setIsPlayingTime(false);
      isPlayingRef.current = false;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full mt-2">
      <Button
        variant="outline"
        className={`gap-2 rounded-full transition-colors border-2 ${
          enabled 
            ? 'bg-[#39ff14]/10 text-[#39ff14] border-[#39ff14]/60 hover:bg-[#39ff14]/20 hover:text-[#39ff14]' 
            : 'bg-transparent text-white/50 border-white/20 hover:text-white hover:border-white/40'
        }`}
        onClick={handleToggle}
      >
        {enabled ? <Activity className="w-4 h-4 animate-pulse" /> : <Smartphone className="w-4 h-4" />}
        {enabled ? "Haptic Pocket Mode: ON" : "Haptic Pocket Mode: OFF"}
      </Button>
      {enabled && (
        <div className="mt-4 text-center space-y-1">
          <p className="text-[10px] text-[#39ff14]/60 font-mono tracking-widest uppercase">
            Active: Heartbeat & Hourly Time
          </p>
          <p className="text-[9px] text-[#39ff14]/40 font-mono tracking-widest uppercase">
            Keep screen on in pocket
          </p>
        </div>
      )}
    </div>
  );
}