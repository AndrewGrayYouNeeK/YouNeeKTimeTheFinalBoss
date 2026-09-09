import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  if (location.pathname === '/') return null;

  const title =
    location.pathname === '/calendar' ? 'Calendar'
    : location.pathname === '/settings' ? 'Settings'
    : location.pathname === '/watch' ? 'Watch'
    : '';

  return (
    <div
      className="fixed left-0 right-0 top-0 z-40 bg-black/80 backdrop-blur-xl"
      style={{ paddingTop: 'max(0.35rem, env(safe-area-inset-top))', fontFamily: 'system-ui, -apple-system, sans-serif' }}
    >
      <div className="flex items-center px-2 py-1">
        <button
          onClick={() => navigate(-1)}
          className="flex h-11 w-11 items-center justify-center text-[#FF9F0A]"
        >
          <ChevronLeft className="h-7 w-7" />
        </button>
        <h1 className="flex-1 pr-11 text-center text-[17px] font-semibold text-white">
          {title}
        </h1>
      </div>
    </div>
  );
}
