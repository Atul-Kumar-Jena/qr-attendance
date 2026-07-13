import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20 text-center overflow-hidden">
      <div className="relative z-10 max-w-lg">
        {/* Brand mark */}
        <Link href="/" className="inline-flex items-center gap-2.5 mb-10 text-ink">
          <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden className="flex-shrink-0">
            <rect x="0" y="0" width="9" height="9" rx="2" fill="currentColor" />
            <rect x="13" y="0" width="9" height="9" rx="2" fill="currentColor" />
            <rect x="0" y="13" width="9" height="9" rx="2" fill="currentColor" />
            <rect x="15" y="15" width="7" height="7" rx="2" fill="var(--accent)" />
          </svg>
          <span className="font-display text-[1.25rem] tracking-tight">Attendly</span>
        </Link>

        {/* Glitched QR motif → 404 */}
        <div aria-hidden className="mx-auto mb-8 grid grid-cols-7 gap-1.5 w-[140px] opacity-60">
          {Array.from({ length: 49 }).map((_, i) => {
            const on = [0, 1, 2, 6, 8, 12, 14, 16, 18, 20, 24, 28, 30, 32, 34, 40, 42, 46, 47, 48, 3, 9, 21, 27, 36].includes(i);
            return (
              <span
                key={i}
                className="aspect-square rounded-[2px]"
                style={{
                  background: on ? 'var(--ink)' : 'transparent',
                  border: on ? 'none' : '1px solid var(--line)',
                  animation: on ? `iconPulse ${2 + (i % 5) * 0.3}s ease-in-out infinite` : undefined,
                  animationDelay: `${(i % 7) * 0.08}s`,
                }}
              />
            );
          })}
        </div>

        <div className="font-display text-[5.5rem] sm:text-[7rem] leading-none tracking-tightest text-ink">
          404
        </div>
        <h1 className="mt-4 font-display text-[1.6rem] sm:text-[2rem] tracking-tight text-ink">
          This page wandered off.
        </h1>
        <p className="mt-3 text-[14px] leading-relaxed text-ink-mute max-w-sm mx-auto">
          The link may be broken, or the page may have moved. Let&apos;s get you
          back to something that scans.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link href="/" className="btn-solid rounded-full px-6 py-3 text-[13.5px] font-semibold">
            Back to home
          </Link>
          <Link href="/#features" className="btn-outline-soft rounded-full px-6 py-3 text-[13.5px] font-medium">
            Explore features
          </Link>
        </div>

        <div className="mt-10 font-mono text-[11px] tracking-[0.18em] uppercase text-ink-mute/70">
          error · token not found · 404
        </div>
      </div>
    </main>
  );
}
