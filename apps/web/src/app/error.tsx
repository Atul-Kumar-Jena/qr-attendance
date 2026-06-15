'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[GlobalError]', error);
  }, [error]);

  const clearAndReload = () => {
    try {
      localStorage.removeItem('attendly_site_config');
      localStorage.removeItem('attendly-theme-mode');
    } catch {}
    window.location.href = '/qr-attendance/';
  };

  return (
    <html lang="en">
      <head><title>Something went wrong — Attendly</title></head>
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', background: '#fafaf8', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ maxWidth: 480, padding: '2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>⚠️</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem', color: '#0A1810' }}>
            Something went wrong
          </h1>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            A site configuration error caused the page to crash. Resetting the config will restore it to defaults.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={clearAndReload}
              style={{ background: '#6366f1', color: '#fff', border: 'none', borderRadius: '0.75rem', padding: '0.65rem 1.25rem', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer' }}
            >
              Reset config &amp; reload
            </button>
            <button
              onClick={reset}
              style={{ background: 'transparent', color: '#6b7280', border: '1px solid #e5e7eb', borderRadius: '0.75rem', padding: '0.65rem 1.25rem', fontSize: '0.875rem', cursor: 'pointer' }}
            >
              Try again
            </button>
          </div>
          {error.message && (
            <p style={{ marginTop: '1.5rem', fontSize: '0.75rem', color: '#9ca3af', fontFamily: 'monospace', wordBreak: 'break-all' }}>
              {error.message}
            </p>
          )}
        </div>
      </body>
    </html>
  );
}
