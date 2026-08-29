import React, { useState } from 'react';

export default function PullToRefresh({ onRefresh, children }) {
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const pullDistance = Math.max(0, currentY - startY);
  const maxPull = 100;
  const threshold = 60;
  const isPulling = startY > 0 && pullDistance > 0 && window.scrollY <= 0;

  const handleTouchStart = (e) => {
    if (window.scrollY <= 0) {
      setStartY(e.touches[0].clientY);
      setCurrentY(e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e) => {
    if (startY > 0 && window.scrollY <= 0) {
      setCurrentY(e.touches[0].clientY);
    }
  };

  const handleTouchEnd = async () => {
    if (isPulling && pullDistance > threshold && !refreshing) {
      setRefreshing(true);
      if (onRefresh) {
        await onRefresh();
      }
      setRefreshing(false);
    }
    setStartY(0);
    setCurrentY(0);
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative w-full min-h-screen"
    >
      <div 
        className="absolute top-0 w-full flex justify-center items-center overflow-hidden transition-all duration-200 z-50 pointer-events-none"
        style={{ 
          height: isPulling || refreshing ? `${Math.min(pullDistance, maxPull)}px` : '0px',
          opacity: isPulling || refreshing ? 1 : 0
        }}
      >
        <div className={`w-8 h-8 rounded-full border-2 border-white/20 border-t-[#ff6a00] ${refreshing ? 'animate-spin' : ''}`} 
             style={{ transform: `rotate(${pullDistance * 2}deg)` }} />
      </div>
      <div 
        className="transition-transform duration-200 w-full h-full"
        style={{ transform: isPulling && !refreshing ? `translateY(${Math.min(pullDistance, maxPull)}px)` : 'none' }}
      >
        {children}
      </div>
    </div>
  );
}