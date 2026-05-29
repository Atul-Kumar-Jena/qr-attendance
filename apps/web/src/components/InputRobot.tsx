'use client';

import { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';

/**
 * H-01 — a matte-black humanoid robot that floats near any focused input or
 * textarea. When the user types it tilts its head down (looking at the keys).
 * After 1.5 s of silence it snaps back up and "looks" at the user with a
 * subtle bounce. It blinks on a natural random loop.
 *
 * Desktop: hovers beside/above the active field.
 * Mobile:  a smaller head peeks from the bottom-right corner of the viewport
 *          (above the on-screen keyboard) so it never overlaps the field.
 */
export function InputRobot() {
  const root    = useRef<HTMLDivElement>(null);
  const headG   = useRef<SVGGElement>(null);
  const eyeL    = useRef<SVGEllipseElement>(null);
  const eyeR    = useRef<SVGEllipseElement>(null);
  const bodyG   = useRef<SVGGElement>(null);

  const idleTimer  = useRef<ReturnType<typeof setTimeout>>();
  const blinkLoop  = useRef<ReturnType<typeof setTimeout>>();
  const floatAnim  = useRef<gsap.core.Tween>();
  const swayAnim   = useRef<gsap.core.Tween>();
  const activeEl   = useRef<HTMLElement | null>(null);
  const showing    = useRef(false);
  const isMobile   = useRef(false);

  /* ── Animation helpers ────────────────────────────────────────────── */

  const lookDown = useCallback(() => {
    gsap.to(headG.current, {
      rotation: 18, y: 4,
      transformOrigin: '50% 88%',
      duration: 0.28, ease: 'power2.out',
    });
    // Eyes shift down slightly
    gsap.to([eyeL.current, eyeR.current], {
      attr: { cy: 21 }, duration: 0.25, ease: 'power2.out',
    });
  }, []);

  const lookUp = useCallback(() => {
    gsap.to(headG.current, {
      rotation: 0, y: 0,
      transformOrigin: '50% 88%',
      duration: 0.55, ease: 'back.out(1.7)',
    });
    gsap.to([eyeL.current, eyeR.current], {
      attr: { cy: 18 }, duration: 0.5, ease: 'back.out(1.5)',
    });
  }, []);

  const scheduleBlink = useCallback(() => {
    const delay = 2200 + Math.random() * 3200;
    blinkLoop.current = setTimeout(() => {
      // Squash eyes to a flat line then restore
      gsap.timeline()
        .to([eyeL.current, eyeR.current], { attr: { ry: 0.4 }, duration: 0.06, ease: 'power2.in' })
        .to([eyeL.current, eyeR.current], { attr: { ry: 2.6 }, duration: 0.1,  ease: 'power2.out' })
        .call(scheduleBlink);
    }, delay);
  }, []);

  /* ── Position near the active input ──────────────────────────────── */
  const reposition = useCallback(() => {
    const el = activeEl.current;
    const wrap = root.current;
    if (!el || !wrap) return;
    if (isMobile.current) return; // mobile: fixed corner, no repositioning needed

    const r  = el.getBoundingClientRect();
    const rw = 90;   // robot width
    const rh = 140;  // robot height

    let x = r.right - rw / 2;          // default: right-centre of input
    let y = r.top - rh - 12;           // above input

    // Clamp to viewport
    if (x + rw > window.innerWidth - 8)  x = window.innerWidth - rw - 8;
    if (x < 8)                            x = 8;
    if (y < 8)                            y = r.bottom + 12;   // flip below

    gsap.to(wrap, { left: x, top: y, duration: 0.45, ease: 'power3.out' });
  }, []);

  /* ── Show / hide ──────────────────────────────────────────────────── */
  const show = useCallback((target: HTMLElement) => {
    const wrap = root.current;
    if (!wrap) return;
    activeEl.current = target;

    // Mobile: fixed to bottom-right corner
    if (isMobile.current) {
      gsap.set(wrap, { left: 'auto', right: 16, top: 'auto', bottom: 110, position: 'fixed' });
    } else {
      reposition();
    }

    if (showing.current) return;
    showing.current = true;

    gsap.fromTo(wrap,
      { opacity: 0, scale: 0.78, y: 18 },
      { opacity: 1, scale: 1,    y: 0,  duration: 0.5, ease: 'back.out(1.8)' },
    );
    gsap.set(wrap, { display: 'block' });

    // Float bob
    floatAnim.current?.kill();
    floatAnim.current = gsap.to(wrap, {
      y: '-=10', duration: 2.6, ease: 'sine.inOut', yoyo: true, repeat: -1,
    });

    // Gentle sway
    swayAnim.current?.kill();
    swayAnim.current = gsap.to(bodyG.current, {
      rotation: 1.4, transformOrigin: '50% 95%',
      duration: 3.8, ease: 'sine.inOut', yoyo: true, repeat: -1,
    });

    scheduleBlink();
  }, [reposition, scheduleBlink]);

  const hide = useCallback(() => {
    const wrap = root.current;
    if (!wrap || !showing.current) return;
    showing.current = false;
    clearTimeout(idleTimer.current);
    clearTimeout(blinkLoop.current);
    floatAnim.current?.kill();
    swayAnim.current?.kill();
    gsap.to(wrap, {
      opacity: 0, scale: 0.82, y: 14,
      duration: 0.35, ease: 'power2.in',
      onComplete: () => gsap.set(wrap, { display: 'none' }),
    });
  }, []);

  /* ── Global event listeners ───────────────────────────────────────── */
  useEffect(() => {
    if (typeof window === 'undefined') return;

    isMobile.current =
      window.matchMedia('(pointer: coarse)').matches ||
      window.matchMedia('(max-width: 767px)').matches;

    // Start hidden
    if (root.current) gsap.set(root.current, { display: 'none', opacity: 0 });

    const onFocusIn = (e: FocusEvent) => {
      const t = e.target as HTMLElement;
      if (t.tagName !== 'INPUT' && t.tagName !== 'TEXTAREA') return;
      const type = (t as HTMLInputElement).type || '';
      // Skip password / hidden / checkbox / radio / file
      if (['hidden','checkbox','radio','file','submit','button','reset'].includes(type)) return;
      show(t);
    };

    const onFocusOut = () => {
      lookUp();
      clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(hide, 600);
    };

    const onInput = () => {
      lookDown();
      clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(lookUp, 1500);
    };

    const onResize = () => { if (showing.current) reposition(); };

    document.addEventListener('focusin',  onFocusIn,  true);
    document.addEventListener('focusout', onFocusOut, true);
    document.addEventListener('input',    onInput,    true);
    window.addEventListener('resize',     onResize);

    return () => {
      document.removeEventListener('focusin',  onFocusIn,  true);
      document.removeEventListener('focusout', onFocusOut, true);
      document.removeEventListener('input',    onInput,    true);
      window.removeEventListener('resize',     onResize);
      clearTimeout(idleTimer.current);
      clearTimeout(blinkLoop.current);
    };
  }, [show, hide, lookDown, lookUp, reposition]);

  /* ── Render ───────────────────────────────────────────────────────── */
  return (
    <div
      ref={root}
      aria-hidden
      className="fixed z-[9997] pointer-events-none select-none"
      style={{ width: 90, height: 140 }}
    >
      <svg
        viewBox="0 0 80 130"
        width="90"
        height="140"
        role="presentation"
        style={{ filter: 'drop-shadow(0 12px 28px rgba(0,0,0,0.55))' }}
      >
        <defs>
          <radialGradient id="ir-head" cx="0.38" cy="0.28" r="0.9">
            <stop offset="0"   stopColor="#2D2D32" />
            <stop offset="0.55" stopColor="#1A1A1E" />
            <stop offset="1"   stopColor="#0D0D10" />
          </radialGradient>
          <radialGradient id="ir-body" cx="0.5" cy="0.15" r="0.95">
            <stop offset="0"   stopColor="#262629" />
            <stop offset="1"   stopColor="#101012" />
          </radialGradient>
          <radialGradient id="ir-limb" cx="0.5" cy="0.2" r="0.9">
            <stop offset="0"   stopColor="#222225" />
            <stop offset="1"   stopColor="#0E0E11" />
          </radialGradient>
          <filter id="ir-eye-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="1.4" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="ir-body-shadow" x="-20%" y="-10%" width="140%" height="130%">
            <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#000" floodOpacity="0.5" />
          </filter>
        </defs>

        {/* ── Full robot body — sways as one piece ── */}
        <g ref={bodyG}>

          {/* ── Head group — rotates to look up/down ── */}
          <g ref={headG} filter="url(#ir-body-shadow)">
            {/* Crown ridge line */}
            <line x1="40" y1="4" x2="40" y2="7" stroke="#3A3A3F" strokeWidth="1.5" strokeLinecap="round" />
            {/* Head dome — smooth matte */}
            <ellipse cx="40" cy="21" rx="15" ry="17" fill="url(#ir-head)" />
            {/* Subtle side panel crease */}
            <path d="M26 20 Q25 26 27 32" fill="none" stroke="#2A2A2E" strokeWidth="0.8" strokeOpacity="0.7" />
            <path d="M54 20 Q55 26 53 32" fill="none" stroke="#2A2A2E" strokeWidth="0.8" strokeOpacity="0.7" />
            {/* Eyes — small white dots with glow */}
            <g filter="url(#ir-eye-glow)">
              <ellipse ref={eyeL} cx="34" cy="18" rx="2.6" ry="2.6" fill="#FFFFFF" />
              <ellipse ref={eyeR} cx="46" cy="18" rx="2.6" ry="2.6" fill="#FFFFFF" />
            </g>
            {/* Inner specular */}
            <circle cx="33.2" cy="17.2" r="0.9" fill="#FFFFFF" fillOpacity="0.45" />
            <circle cx="45.2" cy="17.2" r="0.9" fill="#FFFFFF" fillOpacity="0.45" />
          </g>

          {/* ── Neck ── */}
          <rect x="35" y="37" width="10" height="7" rx="2.5" fill="#1C1C20" stroke="#2A2A2E" strokeWidth="0.5" />
          {/* Neck cable details */}
          <line x1="37.5" y1="38" x2="37.5" y2="43" stroke="#2E2E33" strokeWidth="0.7" />
          <line x1="40"   y1="38" x2="40"   y2="43" stroke="#2E2E33" strokeWidth="0.7" />
          <line x1="42.5" y1="38" x2="42.5" y2="43" stroke="#2E2E33" strokeWidth="0.7" />

          {/* ── Torso ── */}
          <path
            d="M20 44 C20 42 26 41 40 41 C54 41 60 42 60 44 L62 82 C62 84 58 85 40 85 C22 85 18 84 18 82 Z"
            fill="url(#ir-body)" stroke="#252528" strokeWidth="0.6"
          />
          {/* Center seam line */}
          <line x1="40" y1="44" x2="40" y2="84" stroke="#2E2E33" strokeWidth="0.6" strokeOpacity="0.7" />
          {/* Shoulder edge crease */}
          <path d="M20 44 C20 50 22 56 22 62" fill="none" stroke="#2A2A2E" strokeWidth="0.7" />
          <path d="M60 44 C60 50 58 56 58 62" fill="none" stroke="#2A2A2E" strokeWidth="0.7" />
          {/* Chest crosshair/target — key H-01 detail */}
          <circle cx="40" cy="61" r="9" fill="none" stroke="#E8E6E2" strokeWidth="0.9" strokeOpacity="0.85" />
          <circle cx="40" cy="61" r="2.5" fill="none" stroke="#E8E6E2" strokeWidth="0.8" strokeOpacity="0.7" />
          {/* Crosshair ticks */}
          <line x1="40" y1="51" x2="40" y2="55.5" stroke="#E8E6E2" strokeWidth="0.7" strokeOpacity="0.8" />
          <line x1="40" y1="66.5" x2="40" y2="71"  stroke="#E8E6E2" strokeWidth="0.7" strokeOpacity="0.8" />
          <line x1="30" y1="61"   x2="34.5" y2="61" stroke="#E8E6E2" strokeWidth="0.7" strokeOpacity="0.8" />
          <line x1="45.5" y1="61" x2="50"   y2="61" stroke="#E8E6E2" strokeWidth="0.7" strokeOpacity="0.8" />
          {/* H-01 label */}
          <text x="40" y="78" textAnchor="middle" fontSize="4.5"
            fill="#E8E6E2" fillOpacity="0.55" fontFamily="ui-monospace,monospace" letterSpacing="0.8">H-01</text>

          {/* ── Left arm ── */}
          <path d="M20 47 C15 53 13 64 14 76 C14 79 17 80 18 77 C17 66 20 56 24 52 Z"
            fill="url(#ir-limb)" stroke="#202023" strokeWidth="0.5" />
          {/* Left elbow */}
          <circle cx="14.5" cy="70" r="3.5" fill="#1C1C1F" stroke="#2A2A2E" strokeWidth="0.6" />
          {/* Left forearm */}
          <path d="M13 72 C12 78 13 84 14 88 L18 88 C18 84 17 78 16 72 Z"
            fill="url(#ir-limb)" stroke="#202023" strokeWidth="0.5" />
          {/* Left hand */}
          <ellipse cx="16" cy="91" rx="4" ry="4.5" fill="#1A1A1D" stroke="#252528" strokeWidth="0.5" />

          {/* ── Right arm ── */}
          <path d="M60 47 C65 53 67 64 66 76 C66 79 63 80 62 77 C63 66 60 56 56 52 Z"
            fill="url(#ir-limb)" stroke="#202023" strokeWidth="0.5" />
          {/* Right elbow */}
          <circle cx="65.5" cy="70" r="3.5" fill="#1C1C1F" stroke="#2A2A2E" strokeWidth="0.6" />
          {/* Right forearm */}
          <path d="M67 72 C68 78 67 84 66 88 L62 88 C62 84 63 78 64 72 Z"
            fill="url(#ir-limb)" stroke="#202023" strokeWidth="0.5" />
          {/* Right hand */}
          <ellipse cx="64" cy="91" rx="4" ry="4.5" fill="#1A1A1D" stroke="#252528" strokeWidth="0.5" />

          {/* ── Hip / belt ── */}
          <path d="M21 84 C21 82 27 81 40 81 C53 81 59 82 59 84 L57 92 C57 94 52 95 40 95 C28 95 23 94 23 92 Z"
            fill="#141417" stroke="#222225" strokeWidth="0.6" />
          {/* Belt detail V mark */}
          <path d="M37 87 L40 91 L43 87" fill="none" stroke="#3A3A3E" strokeWidth="0.8" strokeLinecap="round" />

          {/* ── Left leg ── */}
          <path d="M25 93 C24 103 24 112 25 120 L33 120 C33 112 32 103 31 93 Z"
            fill="url(#ir-limb)" stroke="#1E1E21" strokeWidth="0.5" />
          {/* Left knee */}
          <path d="M23 106 C22 109 23 112 25 112 L32 112 C34 112 35 109 34 106 Z"
            fill="#141417" stroke="#202023" strokeWidth="0.5" />
          <line x1="28.5" y1="107" x2="28.5" y2="111" stroke="#2A2A2D" strokeWidth="0.7" />
          {/* Left shin */}
          <path d="M25 112 C25 116 26 120 27 124 L31 124 C32 120 32 116 32 112 Z"
            fill="url(#ir-limb)" stroke="#1E1E21" strokeWidth="0.5" />
          {/* Left foot */}
          <path d="M23 122 C22 124 23 128 27 128 L33 128 C35 126 34 123 33 122 Z"
            fill="#111114" stroke="#1E1E21" strokeWidth="0.5" />
          {/* Foot detail circle */}
          <circle cx="26" cy="125" r="1.4" fill="none" stroke="#2E2E32" strokeWidth="0.6" />

          {/* ── Right leg ── */}
          <path d="M47 93 C48 103 48 112 47 120 L55 120 C55 112 56 103 55 93 Z"
            fill="url(#ir-limb)" stroke="#1E1E21" strokeWidth="0.5" />
          {/* Right knee */}
          <path d="M45 106 C44 109 45 112 47 112 L54 112 C56 112 57 109 56 106 Z"
            fill="#141417" stroke="#202023" strokeWidth="0.5" />
          <line x1="50.5" y1="107" x2="50.5" y2="111" stroke="#2A2A2D" strokeWidth="0.7" />
          {/* Right shin */}
          <path d="M47 112 C47 116 47 120 48 124 L52 124 C52 120 54 116 54 112 Z"
            fill="url(#ir-limb)" stroke="#1E1E21" strokeWidth="0.5" />
          {/* Right foot */}
          <path d="M45 122 C44 124 45 128 49 128 L55 128 C57 126 56 123 55 122 Z"
            fill="#111114" stroke="#1E1E21" strokeWidth="0.5" />
          {/* Foot detail circle */}
          <circle cx="52" cy="125" r="1.4" fill="none" stroke="#2E2E32" strokeWidth="0.6" />

        </g>
      </svg>
    </div>
  );
}
