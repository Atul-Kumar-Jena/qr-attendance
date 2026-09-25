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
          {/* Long multi-stop tails stand in for the old blur(80px): same soft
              edge, but rastered once instead of re-blurred every frame. */}
          <div className="aurora-blob-g" style={{
            width: '75vw', height: '75vw', left: '-15vw', top: '-20vh',
            background: 'radial-gradient(circle at 40% 40%, rgba(160,168,184,0.9) 0%, rgba(120,126,142,0.7) 18%, rgba(90,94,112,0.48) 34%, rgba(90,94,112,0.2) 50%, rgba(90,94,112,0.06) 61%, rgba(90,94,112,0) 70%)',
            animation: 'auroraDrift1 22s ease-in-out infinite',
          }} />
          <div className="aurora-blob-g" style={{
            width: '65vw', height: '65vw', right: '-12vw', top: '-10vh',
            background: 'radial-gradient(circle at 60% 55%, rgba(176,184,204,0.9) 0%, rgba(132,140,162,0.7) 17%, rgba(96,104,128,0.48) 33%, rgba(96,104,128,0.2) 49%, rgba(96,104,128,0.06) 60%, rgba(96,104,128,0) 70%)',
            animation: 'auroraDrift2 28s ease-in-out infinite',
          }} />
          <div className="aurora-blob-g" style={{
            width: '70vw', height: '70vw', left: '20vw', bottom: '-25vh',
            background: 'radial-gradient(circle at 50% 50%, rgba(128,136,152,0.9) 0%, rgba(96,102,116,0.7) 20%, rgba(64,68,80,0.48) 38%, rgba(64,68,80,0.2) 53%, rgba(64,68,80,0.06) 63%, rgba(64,68,80,0) 72%)',
            animation: 'auroraDrift3 34s ease-in-out infinite',
          }} />
        </>
      )}
    </div>
  );
}
