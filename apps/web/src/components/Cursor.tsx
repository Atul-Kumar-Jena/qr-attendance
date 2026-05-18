'use client';

import { useEffect, useRef, useState } from 'react';

const RING_LERP = 0.09;   // ring chases at 9% per frame — buttery lag
const SCALE_MAG = 2.5;    // ring scale on magnetic elements

export function Cursor() {
  const dot  = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  // Tooltip state
  const [tip, setTip] = useState('');
  const [tipPos, setTipPos] = useState({ x: 0, y: 0 });
  const [tipVisible, setTipVisible] = useState(false);
  const tipTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const _dot  = dot.current!;
    const _ring = ring.current!;

    // State held outside React to avoid re-renders
    let cx = -200, cy = -200;   // cursor world position
    let rx = -200, ry = -200;   // ring lerped position
    let scale = 1;
    let targetScale = 1;
    let raf: number;
    let clicked = false;

    // Move ring off-screen until first move
    _ring.style.transform = 'translate(-200px,-200px) scale(1)';
    _dot.style.transform  = 'translate(-200px,-200px)';

    const onMove = (e: MouseEvent) => {
      cx = e.clientX;
      cy = e.clientY;
      // Dot is instant — direct style set (no GSAP, no lag)
      _dot.style.transform = `translate(calc(${cx}px - 50%), calc(${cy}px - 50%))`;

      // Update tooltip position
      setTipPos({ x: cx + 16, y: cy + 8 });
    };

    const loop = () => {
      // Exponential lerp towards cursor
      rx += (cx - rx) * RING_LERP;
      ry += (cy - ry) * RING_LERP;
      scale += (targetScale - scale) * 0.1;
      _ring.style.transform =
        `translate(calc(${rx}px - 50%), calc(${ry}px - 50%)) scale(${scale})`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // Click pulse
    const onDown = () => {
      clicked = true;
      _dot.style.transform = `translate(calc(${cx}px - 50%), calc(${cy}px - 50%)) scale(0.7)`;
    };
    const onUp = () => {
      clicked = false;
      _dot.style.transform = `translate(calc(${cx}px - 50%), calc(${cy}px - 50%)) scale(1)`;
    };

    // Magnetic / interactive hover
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

    // Tooltip — shows after 2 s on any element with data-tip or title
    const setupTooltip = (el: HTMLElement) => {
      const label = el.getAttribute('data-tip') || el.getAttribute('aria-label') || el.getAttribute('title');
      if (!label) return () => {};

      // Remove browser native tooltip
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

    // Observe DOM for dynamic elements
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
      {/* Ring — lags behind via RAF lerp. z above all dialogs (Radix Dialog uses 9999). */}
      <div
        ref={ring}
        className="pointer-events-none fixed left-0 top-0 z-[100000] w-8 h-8 rounded-full border border-ink/25 dark:border-white/20 hidden md:block"
        style={{ willChange: 'transform', transition: 'border-color 0.3s, width 0.3s, height 0.3s' }}
      />
      {/* Dot — instant */}
      <div
        ref={dot}
        className="pointer-events-none fixed left-0 top-0 z-[100001] w-2 h-2 rounded-full bg-ink dark:bg-[#F0EDE6] hidden md:block"
        style={{ willChange: 'transform', transition: 'transform 0.08s, background-color 0.3s' }}
      />
      {/* Hover tooltip */}
      <div
        className={`pointer-events-none fixed z-[99999] hidden md:block px-2.5 py-1 rounded-lg text-[11.5px] font-medium bg-ink dark:bg-[#F0EDE6] text-cream-50 dark:text-ink shadow-lg whitespace-nowrap transition-opacity duration-200 ${
          tipVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ left: tipPos.x, top: tipPos.y }}
      >
        {tip}
      </div>
    </>
  );
}
