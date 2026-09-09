import { CLOCK_SOURCES, writeClockSource, sourceLabel } from '@/lib/clockPrefs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ClockTypeSelect({ value, className = '' }) {
  return (
    <Select value={value} onValueChange={writeClockSource}>
      <SelectTrigger className={`mx-auto w-full max-w-xs rounded-xl border-white/10 bg-[#1c1c1e] text-[15px] text-white ${className}`}>
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
