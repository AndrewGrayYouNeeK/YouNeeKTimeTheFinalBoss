import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  if (location.pathname === '/') return null;

  return (
    <div className="fixed top-0 left-0 right-0 border-b border-[#00ff88]/10 bg-[#050505]/95 backdrop-blur-md z-40" style={{ paddingTop: 'max(0.5rem, env(safe-area-inset-top))' }}>
      <div className="flex items-center gap-2 p-4">
        <button
          onClick={() => navigate(-1)}
          className="h-10 w-10 flex items-center justify-center rounded-xl text-[#00ff88]/70 hover:text-[#00ff88] hover:bg-[#00ff88]/10 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="font-mono text-sm uppercase tracking-[0.3em] text-[#00ff88]/70 flex-1">
          {location.pathname === '/widget' && 'Widget'}
          {location.pathname === '/settings' && 'Settings'}
          {location.pathname === '/watch' && 'Watch'}
        </h1>
      </div>
    </div>
  );
}
