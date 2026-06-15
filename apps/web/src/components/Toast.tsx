'use client';
import { useEffect, useRef } from 'react';
import { useToast, ToastItem } from '@/context/ToastContext';
import gsap from 'gsap';

function ToastEntry({ item, onDismiss }: { item: ToastItem; onDismiss: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      ref.current,
      { x: 80, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.4, ease: 'power3.out' }
    );
  }, []);

  const bgMap = {
    success: 'bg-[#1a2e1a] border-[#2d5c2d] text-[#7ecf7e]',
    error:   'bg-[#2e1a1a] border-[#5c2d2d] text-[#cf7e7e]',
    info:    'bg-cream-50 dark:bg-[#0C1C14] border-ink/10 text-ink-mute',
  };

  const iconMap = {
    success: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
        <path d="M2 7l3.5 3.5L12 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    error: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
        <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
    info: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
        <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M7 6.5v4M7 4.5v.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
    ),
  };

  return (
    <div
      ref={ref}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg text-[13px] font-medium min-w-[220px] max-w-[340px] cursor-pointer ${bgMap[item.type]}`}
      onClick={onDismiss}
      role="alert"
    >
      <span className="flex-shrink-0">{iconMap[item.type]}</span>
      <span className="flex-1">{item.message}</span>
      <button
        onClick={onDismiss}
        className="opacity-50 hover:opacity-100 transition-opacity ml-1"
        aria-label="Dismiss"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
          <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  );
}

export function ToastContainer() {
  const { toasts, dismiss } = useToast();

  return (
    <div
      className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 items-end"
      aria-live="polite"
    >
      {toasts.map((t) => (
        <ToastEntry key={t.id} item={t} onDismiss={() => dismiss(t.id)} />
      ))}
    </div>
  );
}

export { useToast } from '@/context/ToastContext';
