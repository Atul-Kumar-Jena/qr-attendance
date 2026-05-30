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
            width: '70vw', height: '70vw', left: '-12vw', top: '-18vh',
            background: 'radial-gradient(circle at 50% 50%, #8A8A95 0%, #4A4A55 38%, transparent 70%)',
            animation: 'auroraDrift1 24s ease-in-out infinite',
          }} />
          <div className="aurora-blob-g" style={{
            width: '62vw', height: '62vw', right: '-10vw', top: '-8vh',
            background: 'radial-gradient(circle at 50% 50%, #9DA0AC 0%, #54545F 36%, transparent 70%)',
            animation: 'auroraDrift2 30s ease-in-out infinite',
          }} />
          <div className="aurora-blob-g" style={{
            width: '68vw', height: '68vw', left: '22vw', bottom: '-22vh',
            background: 'radial-gradient(circle at 50% 50%, #6E6E7A 0%, #3A3A44 40%, transparent 72%)',
            animation: 'auroraDrift3 36s ease-in-out infinite',
          }} />
        </>
      )}
    </div>
  );
}
