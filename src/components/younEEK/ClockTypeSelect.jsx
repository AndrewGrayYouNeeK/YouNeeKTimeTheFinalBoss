import { CLOCK_SOURCES, writeClockSource, sourceLabel } from '@/lib/clockPrefs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ClockTypeSelect({ value, className = '' }) {
  return (
    <Select value={value} onValueChange={writeClockSource}>
      <SelectTrigger className={`w-full max-w-xs mx-auto bg-black/40 border-[#00b7ff]/30 text-[#00b7ff] text-[10px] font-mono uppercase tracking-widest ${className}`}>
        <SelectValue>{sourceLabel(value)}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {CLOCK_SOURCES.map((item) => (
          <SelectItem key={item.id} value={item.id}>{item.label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
