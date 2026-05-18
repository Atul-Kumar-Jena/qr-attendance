'use client';

import { useEffect, useRef, useState } from 'react';

const RING_LERP = 0.15;   // ring chases at 15% per frame — responsive but still smooth
const SCALE_MAG = 2.5;    // ring scale on magnetic elements

export function Cursor() {
  const dot  = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  const [tip, setTip] = useState('');
  const [tipPos, setTipPos] = useState({ x: 0, y: 0 });
  const [tipVisible, setTipVisible] = useState(false);
  const tipTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const _dot  = dot.current!;
    const _ring = ring.current!;

    let cx = -200, cy = -200;
    let rx = -200, ry = -200;
    let scale = 1;
    let targetScale = 1;
    let raf: number;

    _ring.style.transform = 'translate(-200px,-200px) scale(1)';
    _dot.style.transform  = 'translate(-200px,-200px)';

    const onMove = (e: MouseEvent) => {
      cx = e.clientX;
      cy = e.clientY;
      _dot.style.transform = `translate(calc(${cx}px - 50%), calc(${cy}px - 50%))`;
      setTipPos({ x: cx + 16, y: cy + 8 });
    };

    const loop = () => {
      rx += (cx - rx) * RING_LERP;
      ry += (cy - ry) * RING_LERP;
      scale += (targetScale - scale) * 0.12;
      _ring.style.transform =
        `translate(calc(${rx}px - 50%), calc(${ry}px - 50%)) scale(${scale})`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onDown = () => {
      _dot.style.transform = `translate(calc(${cx}px - 50%), calc(${cy}px - 50%)) scale(0.7)`;
    };
    const onUp = () => {
      _dot.style.transform = `translate(calc(${cx}px - 50%), calc(${cy}px - 50%)) scale(1)`;
    };

    const setupElement = (el: HTMLElement) => {
      const isMag = el.hasAttribute('data-magnetic');
      const onEnter = () => { targetScale = isMag ? SCALE_MAG : 1.6; };
      const onLeave = () => { targetScale = 1; };
      el.addEventListener('pointerenter', onEnter);
      el.addEventListener('pointerleave', onLeave);
      return () => {
        el.removeEventListener('pointerenter', onEnter);
        el.removeEventListener('pointerleave', onLeave);
      };
    };

    const setupTooltip = (el: HTMLElement) => {
      const label = el.getAttribute('data-tip') || el.getAttribute('aria-label') || el.getAttribute('title');
      if (!label) return () => {};
      if (el.getAttribute('title')) {
        el.setAttribute('data-native-title', el.getAttribute('title')!);
        el.removeAttribute('title');
      }
      const onEnter = (e: Event) => {
        const me = e as MouseEvent;
        setTipPos({ x: me.clientX + 16, y: me.clientY + 8 });
        tipTimer.current = setTimeout(() => {
          setTip(label);
          setTipVisible(true);
        }, 2000);
      };
      const onLeave = () => {
        if (tipTimer.current) clearTimeout(tipTimer.current);
        setTipVisible(false);
        setTip('');
      };
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
      return () => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
        if (el.getAttribute('data-native-title')) {
          el.setAttribute('title', el.getAttribute('data-native-title')!);
        }
      };
    };

    const cleanups: (() => void)[] = [];
    const attach = (el: Element) => {
      if (!(el instanceof HTMLElement)) return;
      if (el.matches('[data-magnetic], button, a, input, select, textarea, [role="button"], [data-tip], label'))
        cleanups.push(setupElement(el));
      cleanups.push(setupTooltip(el));
    };
    document.querySelectorAll<HTMLElement>('[data-magnetic], button, a, input, select, textarea, [role="button"], [data-tip], label').forEach(attach);

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((m) => m.addedNodes.forEach((n) => {
        if (n instanceof HTMLElement) {
          attach(n);
          n.querySelectorAll('[data-magnetic], button, a, input, select, textarea, [data-tip], label').forEach(attach);
        }
      }));
    });
    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      observer.disconnect();
      cleanups.forEach((fn) => fn());
      if (tipTimer.current) clearTimeout(tipTimer.current);
    };
  }, []);

  return (
    <>
      {/* Ring — lags behind via RAF lerp */}
      <div
        ref={ring}
        className="pointer-events-none fixed left-0 top-0 z-[99998] w-9 h-9 rounded-full border border-ink/50 dark:border-white/40 hidden md:block"
        style={{ willChange: 'transform', transition: 'border-color 0.3s, width 0.3s, height 0.3s' }}
      />
      {/* Dot — instant */}
      <div
        ref={dot}
        className="pointer-events-none fixed left-0 top-0 z-[99999] w-2.5 h-2.5 rounded-full bg-ink dark:bg-[#F0EDE6] hidden md:block"
        style={{ willChange: 'transform', transition: 'transform 0.08s, background-color 0.3s' }}
      />
      {/* Hover tooltip */}
      <div
        className={`pointer-events-none fixed z-[99997] hidden md:block px-2.5 py-1 rounded-lg text-[11.5px] font-medium bg-ink dark:bg-[#F0EDE6] text-cream-50 dark:text-ink shadow-lg whitespace-nowrap transition-opacity duration-200 ${
          tipVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ left: tipPos.x, top: tipPos.y }}
      >
        {tip}
      </div>
    </>
  );
}
