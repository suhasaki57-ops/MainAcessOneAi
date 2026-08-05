import { useState, useEffect } from 'react';

export const ReadingRuler = ({ enabled = false }) => {
  const [position, setPosition] = useState({ y: 200 });

  useEffect(() => {
    if (!enabled) return;

    const handleMouseMove = (e) => {
      setPosition({ y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      className="fixed left-0 right-0 h-10 pointer-events-none z-40 bg-cyan-400/10 border-y border-cyan-400/40 shadow-[0_0_15px_rgba(2,132,199,0.3)] transition-all duration-75"
      style={{ top: `${position.y - 20}px` }}
    />
  );
};

export default ReadingRuler;
