import { Link, useLocation } from 'react-router-dom';
import { Clock, CalendarDays, Settings } from 'lucide-react';

export default function BottomTab() {
  const location = useLocation();

  const tabs = [
    { path: '/', icon: Clock, label: 'Clock' },
    { path: '/calendar', icon: CalendarDays, label: 'Calendar' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 flex justify-around border-t border-white/10 bg-[#1c1c1e]/92 backdrop-blur-xl"
      style={{ paddingBottom: 'max(0.35rem, env(safe-area-inset-bottom))', fontFamily: 'system-ui, -apple-system, sans-serif' }}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = location.pathname === tab.path;
        const color = tab.path === '/calendar' ? '#FF3B30' : '#FF9F0A';
        return (
          <Link
            key={tab.path}
            to={tab.path}
            onClick={(e) => {
              if (isActive) {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className="flex flex-1 flex-col items-center justify-center py-2"
            style={{ color: isActive ? color : '#8e8e93' }}
          >
            <Icon className="h-[22px] w-[22px]" strokeWidth={isActive ? 2.2 : 1.8} />
            <span className="mt-0.5 text-[10px] font-medium">{tab.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
