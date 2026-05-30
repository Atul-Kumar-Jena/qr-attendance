'use client';
import { useEffect, useState } from 'react';

/**
 * Site-wide grey moving aurora — visible only in dark mode (matte black bg).
 * Fixed full-screen, sits behind all content. Three large grey blobs drift
 * slowly with `screen` blend so they glow softly against pure black.
 */
export function GlobalAurora() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <div
      aria-hidden
      className="global-aurora fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
    >
      {mounted && (
        <>
          <div className="aurora-blob-g" style={{
            width: '75vw', height: '75vw', left: '-15vw', top: '-20vh',
            background: 'radial-gradient(circle at 40% 40%, #A0A8B8 0%, #5A5E70 35%, transparent 68%)',
            animation: 'auroraDrift1 22s ease-in-out infinite',
          }} />
          <div className="aurora-blob-g" style={{
            width: '65vw', height: '65vw', right: '-12vw', top: '-10vh',
            background: 'radial-gradient(circle at 60% 55%, #B0B8CC 0%, #606880 33%, transparent 68%)',
            animation: 'auroraDrift2 28s ease-in-out infinite',
          }} />
          <div className="aurora-blob-g" style={{
            width: '70vw', height: '70vw', left: '20vw', bottom: '-25vh',
            background: 'radial-gradient(circle at 50% 50%, #808898 0%, #404450 38%, transparent 70%)',
            animation: 'auroraDrift3 34s ease-in-out infinite',
          }} />
        </>
      )}
    </div>
  );
}
