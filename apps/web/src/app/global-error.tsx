'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif' }}>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          background: '#FAFAF7',
          color: '#0B1220',
          textAlign: 'center',
          gap: 12,
        }}>
          <div style={{ fontSize: 28, fontWeight: 600 }}>Something went wrong</div>
          <div style={{ fontSize: 14, color: '#6B7280', maxWidth: 540 }}>
            An unexpected error occurred at the application root.
          </div>
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
            whiteSpace: 'pre-wrap',
          }}>
            {error?.name}: {error?.message}
            {error?.digest ? `\nDigest: ${error.digest}` : ''}
          </pre>
          <button
            onClick={() => reset()}
            style={{
              marginTop: 8,
              padding: '10px 20px',
              borderRadius: 10,
              background: 'var(--accent)',
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
      </body>
    </html>
  );
}
