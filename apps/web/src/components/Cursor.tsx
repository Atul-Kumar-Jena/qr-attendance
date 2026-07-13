'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { initGSAP } from '@/lib/gsap-init';

/**
 * Performance-tuned custom cursor.
 *
 *  - No React state in the move path: every cursor render is direct DOM write.
 *  - No MutationObserver scanning the document on every change. Hover/magnetic
 *    detection uses document-level event delegation via target.closest().
 *  - Mounts via Portal directly under <body> with the maximum safe z-index so
 *    no dialog, popover, or error boundary can hide it.
 *  - Hides on document mouseleave so the dot doesn't get stuck at the last
 *    in-window position when you leave the tab/window.
 */
const RING_LERP = 0.18;   // ring chases at 18% per frame — still buttery, less lag

export function Cursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef  = useRef<HTMLDivElement>(null);
  const tipRef  = useRef<HTMLDivElement>(null);
  // Gate portal render until after hydration — server outputs nothing, so we
  // also output nothing on the first client render to avoid a mismatch.
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    if (typeof window === 'undefined') return;
    // touch devices get no cursor
    if (window.matchMedia('(pointer: coarse)').matches) return;

    // Respect users who prefer reduced motion — keep the native cursor.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ring = ringRef.current!;
    const dot  = dotRef.current!;
    const tip  = tipRef.current!;
    if (!ring || !dot || !tip) return;

    // Only now — once the custom cursor is genuinely mounted and running — do we
    // let CSS hide the system cursor. If this code never runs (JS error, old
    // browser), the native cursor stays visible. No more "missing cursor".
    document.documentElement.classList.add('cursor-ready');

    // Cursor state — held outside React
    let cx = -200, cy = -200;
    let rx = -200, ry = -200;
    let scale = 1, targetScale = 1;
    let visible = false;
    let tipTimer: ReturnType<typeof setTimeout> | null = null;
    let tipShown = false;

    const setVisible = (v: boolean) => {
      if (visible === v) return;
      visible = v;
      ring.style.opacity = v ? '1' : '0';
      dot.style.opacity  = v ? '1' : '0';
    };

    const onMove = (e: MouseEvent) => {
      cx = e.clientX;
      cy = e.clientY;
      // Direct style write — no React render
      dot.style.transform = `translate3d(${cx - 4}px, ${cy - 4}px, 0)`;
      if (tipShown) {
        tip.style.transform = `translate3d(${cx + 16}px, ${cy + 8}px, 0)`;
      }
      if (!visible) setVisible(true);
    };

    const onLeave = () => setVisible(false);
    const onEnterWin = () => setVisible(true);

    // Run the ring lerp on GSAP's single shared ticker instead of a separate
    // rAF — one animation loop for the whole site, batched into one frame.
    initGSAP();
    const loop = () => {
      rx += (cx - rx) * RING_LERP;
      ry += (cy - ry) * RING_LERP;
      scale += (targetScale - scale) * 0.18;
      ring.style.transform =
        `translate3d(${rx - 16}px, ${ry - 16}px, 0) scale(${scale})`;
    };
    gsap.ticker.add(loop);

    const onDown = () => {
      dot.style.transform = `translate3d(${cx - 4}px, ${cy - 4}px, 0) scale(0.65)`;
      ring.style.borderWidth = '2px';
    };
    const onUp = () => {
      dot.style.transform = `translate3d(${cx - 4}px, ${cy - 4}px, 0) scale(1)`;
      ring.style.borderWidth = '1px';
    };

    // Event-delegated hover detection (no MutationObserver scan)
    const INTERACTIVE_SEL = '[data-magnetic], button, a, input, select, textarea, [role="button"], [data-tip], label';
    let hoverEl: HTMLElement | null = null;
    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const interactive = target.closest(INTERACTIVE_SEL) as HTMLElement | null;
      if (interactive === hoverEl) return;
      hoverEl = interactive;
      if (interactive) {
        targetScale = interactive.hasAttribute('data-magnetic') ? 2.4 : 1.6;
        // Tooltip — 2s delay
        const label = interactive.getAttribute('data-tip')
          || interactive.getAttribute('aria-label')
          || interactive.getAttribute('title');
        if (label) {
          // Suppress native title tooltip
          if (interactive.getAttribute('title')) {
            interactive.setAttribute('data-orig-title', interactive.getAttribute('title')!);
            interactive.removeAttribute('title');
          }
          if (tipTimer) clearTimeout(tipTimer);
          tipTimer = setTimeout(() => {
            tip.textContent = label;
            tip.style.opacity = '1';
            tip.style.transform = `translate3d(${cx + 16}px, ${cy + 8}px, 0)`;
            tipShown = true;
          }, 1200);
        }
      } else {
        targetScale = 1;
        if (tipTimer) { clearTimeout(tipTimer); tipTimer = null; }
        tip.style.opacity = '0';
        tipShown = false;
      }
    };

    // Restore title when leaving an element that had one
    const onOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const orig = target.getAttribute?.('data-orig-title');
      if (orig) {
        target.setAttribute('title', orig);
        target.removeAttribute('data-orig-title');
      }
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnterWin);
    document.addEventListener('mouseover', onOver, { passive: true });
    document.addEventListener('mouseout', onOut, { passive: true });

    return () => {
      document.documentElement.classList.remove('cursor-ready');
      gsap.ticker.remove(loop);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnterWin);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      if (tipTimer) clearTimeout(tipTimer);
    };
  }, [mounted]);

  // SSR + first client render: nothing. After hydration: portal under <body>.
  if (!mounted || typeof window === 'undefined') return null;

  const node = (
    <>
      <div
        ref={ringRef}
        className="atd-cursor-ring"
        style={{
          position: 'fixed',
          left: 0, top: 0,
          width: 32, height: 32,
          borderRadius: '50%',
          // White + mix-blend-mode: difference → always inverts to a contrasting
          // colour on whatever's behind (cream bg, ink bg, white driver.js
          // popover, accent buttons — visible on all).
          border: '1.5px solid #FFFFFF',
          mixBlendMode: 'difference',
          opacity: 0,
          pointerEvents: 'none',
          zIndex: 2147483646,
          willChange: 'transform',
          transition: 'border-color 0.25s, border-width 0.15s, opacity 0.2s',
        }}
      />
      <div
        ref={dotRef}
        className="atd-cursor-dot"
        style={{
          position: 'fixed',
          left: 0, top: 0,
          width: 8, height: 8,
          borderRadius: '50%',
          background: '#FFFFFF',
          mixBlendMode: 'difference',
          opacity: 0,
          pointerEvents: 'none',
          zIndex: 2147483647,
          willChange: 'transform',
          transition: 'transform 0.08s, opacity 0.2s',
        }}
      />
      <div
        ref={tipRef}
        className="atd-cursor-tip"
        style={{
          position: 'fixed',
          left: 0, top: 0,
          padding: '4px 10px',
          borderRadius: 8,
          fontSize: 11.5,
          fontWeight: 500,
          background: 'currentColor',
          color: 'var(--cream, #FAFAF7)',
          opacity: 0,
          pointerEvents: 'none',
          zIndex: 2147483647,
          whiteSpace: 'nowrap',
          willChange: 'transform',
          transition: 'opacity 0.18s',
          boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
        }}
      />
    </>
  );

  return createPortal(node, document.body);
}
