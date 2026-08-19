import { useEffect, useRef, useState } from 'react';
import { Activity, Smartphone, Hand } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  unlockHaptics,
  triggerHourLong,
  triggerTenth,
  triggerOnes,
  playVibratePattern,
  stopHaptics,
  isIOS,
} from '@/lib/haptics';
import { buildTimeTellingSteps, stepsToVibratePattern, PULSE, isQuarterMinute } from '@/lib/hapticPattern';
import { requestWakeLock, releaseWakeLock } from '@/lib/wakeLock';
import {
  CLOCK_SOURCES,
  readClockSource,
  writeClockSource,
  sourceLabel,
  getHapticDigits,
  PREFS_EVENT,
} from '@/lib/clockPrefs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const STORAGE_KEY = 'hapticPocketMode';

export default function HapticTimeManager({ time }) {
  const [enabled, setEnabled] = useState(() => localStorage.getItem(STORAGE_KEY) === 'true');
  const [isPlayingTime, setIsPlayingTime] = useState(false);
  const [wakeLockOn, setWakeLockOn] = useState(false);
  const [clockSource, setClockSource] = useState(readClockSource);
  const enabledRef = useRef(enabled);
  const isPlayingRef = useRef(isPlayingTime);
  const timeRef = useRef(time);
  const sourceRef = useRef(clockSource);
  const lastQuarterKeyRef = useRef('');

  useEffect(() => {
    timeRef.current = time;
  }, [time]);

  useEffect(() => {
    sourceRef.current = clockSource;
  }, [clockSource]);

  useEffect(() => {
    const sync = () => setClockSource(readClockSource());
    window.addEventListener(PREFS_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(PREFS_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

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

  const tellTime = async (currentTime) => {
    if (isPlayingRef.current || !enabledRef.current) return;
    setIsPlayingTime(true);
    isPlayingRef.current = true;

    const { hours, minutes } = getHapticDigits(currentTime, sourceRef.current);
    const steps = buildTimeTellingSteps(hours, minutes);
    const pattern = stepsToVibratePattern(steps);

    if (!isIOS() && playVibratePattern(pattern)) {
      const total = pattern.reduce((sum, n) => sum + n, 0);
      await sleep(total);
      if (enabledRef.current) {
        setIsPlayingTime(false);
        isPlayingRef.current = false;
      }
      return;
    }

    for (const step of steps) {
      if (!enabledRef.current) break;
      if (step.kind === 'pause') {
        await sleep(step.ms);
        continue;
      }
      if (step.kind === 'hour') {
        triggerHourLong();
        await sleep(PULSE.hourOn + PULSE.hourGap);
      } else if (step.kind === 'tenth') {
        triggerTenth();
        await sleep(PULSE.tenthOn + PULSE.tenthGap);
      } else {
        triggerOnes();
        await sleep(PULSE.onesOn + PULSE.onesGap);
      }
    }

    setIsPlayingTime(false);
    isPlayingRef.current = false;
  };

  useEffect(() => {
    if (!enabled) return;
    const { hours, minutes } = getHapticDigits(time, clockSource);
    if (!isQuarterMinute(minutes)) return;
    const key = `${clockSource}:${hours}:${minutes}`;
    if (key === lastQuarterKeyRef.current) return;
    lastQuarterKeyRef.current = key;
    if (!isPlayingRef.current) tellTime(time);
  }, [time.units, time.minutes, time.armyHours, time.armyMinutes, time.hours12, time.regularMinutes, clockSource, enabled]);

  const handleToggle = (event) => {
    unlockHaptics();
    const newState = !enabled;
    enabledRef.current = newState;
    setEnabled(newState);

    if (newState) {
      lastQuarterKeyRef.current = `${clockSource}:${getHapticDigits(timeRef.current, clockSource).hours}:${getHapticDigits(timeRef.current, clockSource).minutes}`;
      tellTime(timeRef.current);
    } else {
      stopHaptics();
      setIsPlayingTime(false);
      isPlayingRef.current = false;
    }
    event?.currentTarget?.blur?.();
  };

  const handleFeelNow = () => {
    if (!enabled) return;
    unlockHaptics();
    tellTime(timeRef.current);
  };

  const SwitchHit = ({ onActivate, disabled }) => (
    <input
      type="checkbox"
      aria-hidden="true"
      tabIndex={-1}
      disabled={disabled}
      className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
      style={{ clipPath: 'inset(0 round 999px)', WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}
      ref={(el) => {
        if (el) el.setAttribute('switch', '');
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (!disabled) onActivate(e);
      }}
    />
  );

  return (
    <div className="flex flex-col items-center justify-center w-full mt-2">
      <div className="relative inline-flex">
        <Button
          variant="outline"
          className={`relative gap-2 rounded-full transition-colors border-2 ${
            enabled
              ? 'bg-[#39ff14]/10 text-[#39ff14] border-[#39ff14]/60 hover:bg-[#39ff14]/20 hover:text-[#39ff14]'
              : 'bg-transparent text-white/50 border-white/20 hover:text-white hover:border-white/40'
          }`}
          onPointerDown={unlockHaptics}
          onClick={handleToggle}
        >
          {enabled ? <Activity className="w-4 h-4 animate-pulse" /> : <Smartphone className="w-4 h-4" />}
          {enabled ? 'Haptic Pocket Mode: ON' : 'Haptic Pocket Mode: OFF'}
        </Button>
        <SwitchHit onActivate={handleToggle} />
      </div>

      {enabled && (
        <div className="mt-4 text-center space-y-3 max-w-xs">
          <div className="space-y-1">
            <p className="text-[10px] text-[#39ff14]/70 font-mono tracking-widest uppercase">
              {isPlayingTime ? 'Playing time…' : `Active — tells ${sourceLabel(clockSource)} every 15 min`}
            </p>
            <p className="text-[9px] text-white/40 font-mono tracking-wide leading-relaxed">
              {wakeLockOn ? 'Screen kept awake' : 'Keep screen on in pocket'}
            </p>
          </div>

          <Select
            value={clockSource}
            onValueChange={(id) => {
              setClockSource(id);
              writeClockSource(id);
            }}
          >
            <SelectTrigger className="w-full bg-black/40 border-[#39ff14]/30 text-[#39ff14] text-[10px] font-mono uppercase tracking-widest">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CLOCK_SOURCES.map((item) => (
                <SelectItem key={item.id} value={item.id}>{item.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="relative inline-flex">
            <Button
              variant="outline"
              size="sm"
              disabled={isPlayingTime}
              onPointerDown={unlockHaptics}
              onClick={handleFeelNow}
              className="gap-2 rounded-full border-[#39ff14]/30 text-[#39ff14]/80 hover:bg-[#39ff14]/10 hover:text-[#39ff14] text-[10px] font-mono uppercase tracking-widest"
            >
              <Hand className="w-3.5 h-3.5" />
              Feel Time Now
            </Button>
            <SwitchHit onActivate={handleFeelNow} disabled={isPlayingTime} />
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left space-y-1.5">
            <p className="text-[9px] text-white/50 font-mono uppercase tracking-widest">How to read by feel</p>
            <p className="text-[9px] text-white/35 font-mono leading-relaxed">
              <span className="text-[#39ff14]/60">Long buzz</span> = each hour digit of {sourceLabel(clockSource)} (tens, then ones)
            </p>
            <p className="text-[9px] text-white/35 font-mono leading-relaxed">
              <span className="text-white/50">Spaced shorts</span> = tens of minutes
            </p>
            <p className="text-[9px] text-white/35 font-mono leading-relaxed">
              <span className="text-white/50">Fast shorts</span> = single minutes
            </p>
            <p className="text-[9px] text-white/35 font-mono leading-relaxed">
              Plays at :00 :15 :30 :45 :60 :75 :90
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
