'use client';
import { useEffect, useRef, useState } from 'react';

export function GlobalAurora() {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
    >
      {mounted && (
        <>
          <div className="aurora-blob-g" style={{
            width: '75vw', height: '75vw', left: '-15vw', top: '-20vh',
            background: 'radial-gradient(circle at 50% 50%, #606068 0%, #38383F 35%, transparent 70%)',
            animation: 'auroraDrift1 22s ease-in-out infinite',
          }} />
          <div className="aurora-blob-g" style={{
            width: '65vw', height: '65vw', right: '-10vw', top: '-10vh',
            background: 'radial-gradient(circle at 50% 50%, #7A7A84 0%, #45454E 35%, transparent 70%)',
            animation: 'auroraDrift2 28s ease-in-out infinite',
          }} />
          <div className="aurora-blob-g" style={{
            width: '70vw', height: '70vw', left: '20vw', bottom: '-25vh',
            background: 'radial-gradient(circle at 50% 50%, #4E4E58 0%, #2C2C33 38%, transparent 72%)',
            animation: 'auroraDrift3 34s ease-in-out infinite',
          }} />
          <div style={{
            position: 'absolute', inset: 0,
            backdropFilter: 'blur(60px) saturate(100%)',
            WebkitBackdropFilter: 'blur(60px) saturate(100%)',
            background: 'rgba(0,0,0,0.15)',
          }} />
        </>
      )}
    </div>
  );
}
