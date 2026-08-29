import { Link, useLocation } from 'react-router-dom';
import { Clock, Smartphone, Settings } from 'lucide-react';

export default function BottomTab() {
  const location = useLocation();

  const tabs = [
    { path: '/', icon: Clock, label: 'Clock' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div
      className="fixed bottom-0 left-0 right-0 border-t border-[#ff6a00]/10 bg-[#050505]/95 backdrop-blur-md flex justify-around z-40"
      style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = location.pathname === tab.path;
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
            className={`flex flex-col items-center justify-center py-3 px-4 flex-1 transition-colors ${
              isActive
                ? 'text-[#ff6a00]'
                : 'text-white/30 hover:text-white/60'
            }`}
          >
            <Icon className={`w-6 h-6 ${isActive ? 'drop-shadow-[0_0_8px_rgba(255,106,0,0.8)]' : ''}`} />
            <span className="font-mono text-[10px] mt-1 uppercase tracking-[0.2em]">{tab.label}</span>
          </Link>
        );
      })}
    </div>
  );
}