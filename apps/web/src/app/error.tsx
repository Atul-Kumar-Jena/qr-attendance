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
    if (typeof window !== 'undefined') {
      console.error('[Attendly:GlobalError]', error?.name, error?.message, error?.stack);
    }
  }, [error]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      fontFamily: 'system-ui, sans-serif',
      background: '#FAFAF7',
      color: '#0B1220',
      textAlign: 'center',
      gap: 12,
    }}>
      <div style={{ fontSize: 28, fontWeight: 600 }}>Something went wrong</div>
      <div style={{ fontSize: 14, color: '#6B7280', maxWidth: 540 }}>
        We hit an unexpected error while loading the page. The team has been notified.
      </div>
      {error?.message && (
        <pre style={{
          marginTop: 12,
          padding: 12,
          background: '#0B1220',
          color: '#F0EDE6',
          borderRadius: 8,
          fontSize: 11,
          maxWidth: '90%',
          overflow: 'auto',
          textAlign: 'left',
        }}>
          {error.name}: {error.message}
        </pre>
      )}
      <button
        onClick={() => reset()}
        style={{
          marginTop: 8,
          padding: '10px 20px',
          borderRadius: 10,
          background: '#FF6B3D',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          fontSize: 13,
          fontWeight: 500,
        }}
      >
        Try again
      </button>
    </div>
  );
}
