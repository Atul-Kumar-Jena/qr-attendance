'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

/**
 * Performance-tuned custom cursor.
 *
 *  - No React state in the move path: every cursor render is direct DOM write.
 *  - No MutationObserver. Hover detection uses event delegation via closest().
 *  - Portal under <body> with max z-index — no overlay can hide it.
 *  - Hides on document mouseleave AND visibilitychange so the dot never sticks.
 *  - No mix-blend-mode (was causing disappear-behind-overlay bug due to
 *    stacking context isolation). CSS custom properties auto-flip in dark mode.
 */
const RING_LERP = 0.26;

export function Cursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef  = useRef<HTMLDivElement>(null);
  const tipRef  = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const ring = ringRef.current!;
    const dot  = dotRef.current!;
    const tip  = tipRef.current!;
    if (!ring || !dot || !tip) return;

    let cx = -200, cy = -200;
    let rx = -200, ry = -200;
    let scale = 1, targetScale = 1;
    let visible = false;
    let raf = 0;
    let tipTimer: ReturnType<typeof setTimeout> | null = null;
    let tipShown = false;

    const setVisible = (v: boolean) => {
      if (visible === v) return;
      visible = v;
      ring.style.opacity = v ? '1' : '0';
      dot.style.opacity  = v ? '1' : '0';
    };

    const onMove = (e: MouseEvent) => {
      cx = e.clientX; cy = e.clientY;
      dot.style.transform = `translate3d(${cx - 4}px, ${cy - 4}px, 0)`;
      if (tipShown) tip.style.transform = `translate3d(${cx + 16}px, ${cy + 8}px, 0)`;
      if (!visible) setVisible(true);
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => { if (!document.hidden) setVisible(true); };
    const onVisChange = () => { if (document.hidden) setVisible(false); };

    const loop = () => {
      rx += (cx - rx) * RING_LERP;
      ry += (cy - ry) * RING_LERP;
      scale += (targetScale - scale) * 0.20;
      ring.style.transform = `translate3d(${rx - 16}px, ${ry - 16}px, 0) scale(${scale})`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onDown = () => {
      dot.style.transform = `translate3d(${cx - 4}px, ${cy - 4}px, 0) scale(0.65)`;
      ring.style.borderWidth = '2px';
    };
    const onUp = () => {
      dot.style.transform = `translate3d(${cx - 4}px, ${cy - 4}px, 0) scale(1)`;
      ring.style.borderWidth = '1.5px';
    };

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
        const label = interactive.getAttribute('data-tip')
          || interactive.getAttribute('aria-label')
          || interactive.getAttribute('title');
        if (label) {
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

    const onOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const orig = target.getAttribute?.('data-orig-title');
      if (orig) {
        target.setAttribute('title', orig);
        target.removeAttribute('data-orig-title');
      }
    };

    window.addEventListener('mousemove',  onMove,     { passive: true });
    window.addEventListener('mousedown',  onDown);
    window.addEventListener('mouseup',    onUp);
    document.addEventListener('mouseleave',       onLeave);
    document.addEventListener('mouseenter',       onEnter);
    document.addEventListener('mouseover',        onOver,  { passive: true });
    document.addEventListener('mouseout',         onOut,   { passive: true });
    document.addEventListener('visibilitychange', onVisChange);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove',  onMove);
      window.removeEventListener('mousedown',  onDown);
      window.removeEventListener('mouseup',    onUp);
      document.removeEventListener('mouseleave',       onLeave);
      document.removeEventListener('mouseenter',       onEnter);
      document.removeEventListener('mouseover',        onOver);
      document.removeEventListener('mouseout',         onOut);
      document.removeEventListener('visibilitychange', onVisChange);
      if (tipTimer) clearTimeout(tipTimer);
    };
  }, [mounted]);

  if (!mounted || typeof window === 'undefined') return null;

  const node = (
    <>
      {/* Ring — var(--ink) auto-flips dark ↔ light */}
      <div
        ref={ringRef}
        className="atd-cursor-ring"
        style={{
          position: 'fixed', left: 0, top: 0,
          width: 32, height: 32, borderRadius: '50%',
          border: '1.5px solid var(--ink)',
          opacity: 0, pointerEvents: 'none',
          zIndex: 2147483646, willChange: 'transform',
          transition: 'border-color 0.25s, border-width 0.15s, opacity 0.2s',
        }}
      />
      {/* Dot — accent orange, visible on any background */}
      <div
        ref={dotRef}
        className="atd-cursor-dot"
        style={{
          position: 'fixed', left: 0, top: 0,
          width: 8, height: 8, borderRadius: '50%',
          background: 'var(--accent)',
          boxShadow: '0 0 6px var(--accent)',
          opacity: 0, pointerEvents: 'none',
          zIndex: 2147483647, willChange: 'transform',
          transition: 'opacity 0.2s',
        }}
      />
      <div
        ref={tipRef}
        className="atd-cursor-tip"
        style={{
          position: 'fixed', left: 0, top: 0,
          padding: '4px 10px', borderRadius: 8,
          fontSize: 11.5, fontWeight: 500,
          background: 'var(--ink)', color: 'var(--bg)',
          opacity: 0, pointerEvents: 'none',
          zIndex: 2147483647, whiteSpace: 'nowrap',
          willChange: 'transform',
          transition: 'opacity 0.18s',
          boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
        }}
      />
    </>
  );

  return createPortal(node, document.body);
}
