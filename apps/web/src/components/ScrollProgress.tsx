'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const p = window.scrollY / h;
      gsap.to(bar.current!, { scaleX: p, duration: 0.2, ease: 'power2.out', overwrite: true });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-px bg-transparent pointer-events-none">
      <div ref={bar} className="origin-left h-full w-full bg-accent" style={{ transform: 'scaleX(0)' }} />
    </div>
  );
}
