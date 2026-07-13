'use client';

import { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';

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

  const lookDown = useCallback(() => {
    gsap.to(headG.current, {
      rotation: 18, y: 4,
      transformOrigin: '50% 88%',
      duration: 0.28, ease: 'power2.out',
    });
    gsap.to([eyeL.current, eyeR.current], {
      attr: { cy: 46 }, duration: 0.25, ease: 'power2.out',
    });
  }, []);

  const lookUp = useCallback(() => {
    gsap.to(headG.current, {
      rotation: 0, y: 0,
      transformOrigin: '50% 88%',
      duration: 0.55, ease: 'back.out(1.7)',
    });
    gsap.to([eyeL.current, eyeR.current], {
      attr: { cy: 42 }, duration: 0.5, ease: 'back.out(1.5)',
    });
  }, []);

  const scheduleBlink = useCallback(() => {
    const delay = 2200 + Math.random() * 3200;
    blinkLoop.current = setTimeout(() => {
      gsap.timeline()
        .to([eyeL.current, eyeR.current], { attr: { ry: 0.4 }, duration: 0.06, ease: 'power2.in' })
        .to([eyeL.current, eyeR.current], { attr: { ry: 9 }, duration: 0.1, ease: 'power2.out' })
        .call(scheduleBlink);
    }, delay);
  }, []);

  const reposition = useCallback(() => {
    const el = activeEl.current;
    const wrap = root.current;
    if (!el || !wrap) return;
    if (isMobile.current) return;

    const r  = el.getBoundingClientRect();
    const rw = 90;
    const rh = 110;

    let x = r.right - rw / 2;
    let y = r.top - rh - 12;

    if (x + rw > window.innerWidth - 8)  x = window.innerWidth - rw - 8;
    if (x < 8)                            x = 8;
    if (y < 8)                            y = r.bottom + 12;

    gsap.to(wrap, { left: x, top: y, duration: 0.45, ease: 'power3.out' });
  }, []);

  const show = useCallback((target: HTMLElement) => {
    const wrap = root.current;
    if (!wrap) return;
    activeEl.current = target;

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

    floatAnim.current?.kill();
    floatAnim.current = gsap.to(wrap, {
      y: '-=10', duration: 2.6, ease: 'sine.inOut', yoyo: true, repeat: -1,
    });

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

  useEffect(() => {
    if (typeof window === 'undefined') return;

    isMobile.current =
      window.matchMedia('(pointer: coarse)').matches ||
      window.matchMedia('(max-width: 767px)').matches;

    if (root.current) gsap.set(root.current, { display: 'none', opacity: 0 });

    const onFocusIn = (e: FocusEvent) => {
      const t = e.target as HTMLElement;
      if (t.tagName !== 'INPUT' && t.tagName !== 'TEXTAREA') return;
      const type = (t as HTMLInputElement).type || '';
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

  return (
    <div
      ref={root}
      aria-hidden
      className="fixed z-[9997] pointer-events-none select-none"
      style={{ width: 90, height: 110 }}
    >
      <svg
        viewBox="0 0 80 100"
        width="90"
        height="110"
        role="presentation"
        style={{ filter: 'drop-shadow(0 8px 20px rgba(0,180,216,0.25)) drop-shadow(0 4px 12px rgba(0,0,0,0.5))' }}
      >
        <defs>
          <radialGradient id="ir-head-g" cx="0.38" cy="0.28" r="0.9">
            <stop offset="0" stopColor="#1E1E24" />
            <stop offset="0.55" stopColor="#111114" />
            <stop offset="1" stopColor="#0D0D0F" />
          </radialGradient>
          <radialGradient id="ir-iris-l-g" cx="0.35" cy="0.3" r="0.85">
            <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="0.25" stopColor="#80EFFF" />
            <stop offset="0.6" stopColor="#00B4D8" />
            <stop offset="1" stopColor="#023E8A" />
          </radialGradient>
          <radialGradient id="ir-iris-r-g" cx="0.35" cy="0.3" r="0.85">
            <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="0.25" stopColor="#80EFFF" />
            <stop offset="0.6" stopColor="#00B4D8" />
            <stop offset="1" stopColor="#023E8A" />
          </radialGradient>
          <filter id="ir-eye-glow-g" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="ir-shadow-g" x="-20%" y="-10%" width="140%" height="130%">
            <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#000" floodOpacity="0.5" />
          </filter>
          <clipPath id="ir-eye-clip-l">
            <ellipse cx="27" cy="42" rx="12" ry="7" />
          </clipPath>
          <clipPath id="ir-eye-clip-r">
            <ellipse cx="53" cy="42" rx="12" ry="7" />
          </clipPath>
        </defs>

        <g ref={bodyG}>
          <g ref={headG} filter="url(#ir-shadow-g)">
            {/* Head */}
            <ellipse cx="40" cy="42" rx="30" ry="36" fill="url(#ir-head-g)" />

            {/* Center crease */}
            <line x1="40" y1="8" x2="40" y2="76" stroke="#1A1A1E" strokeWidth="0.5" opacity="0.6" />

            {/* Left eye socket */}
            <ellipse cx="27" cy="42" rx="13" ry="8" fill="#080808" />

            {/* Left eye glow */}
            <ellipse cx="27" cy="42" rx="11" ry="13" fill="#00B4D8" opacity="0.35" filter="url(#ir-eye-glow-g)" />

            {/* Left iris */}
            <ellipse ref={eyeL} cx="27" cy="42" rx="8" ry="9" fill="url(#ir-iris-l-g)" clipPath="url(#ir-eye-clip-l)" />

            {/* Left pupil */}
            <circle cx="27" cy="42" r="3" fill="#001233" clipPath="url(#ir-eye-clip-l)" />

            {/* Left highlight */}
            <circle cx="24.5" cy="39.5" r="2" fill="white" opacity="0.7" clipPath="url(#ir-eye-clip-l)" />

            {/* Left eye socket rim */}
            <ellipse cx="27" cy="42" rx="13" ry="8" fill="none" stroke="#00D4FF" strokeWidth="0.6" opacity="0.5" />

            {/* Right eye socket */}
            <ellipse cx="53" cy="42" rx="13" ry="8" fill="#080808" />

            {/* Right eye glow */}
            <ellipse cx="53" cy="42" rx="11" ry="13" fill="#00B4D8" opacity="0.35" filter="url(#ir-eye-glow-g)" />

            {/* Right iris */}
            <ellipse ref={eyeR} cx="53" cy="42" rx="8" ry="9" fill="url(#ir-iris-r-g)" clipPath="url(#ir-eye-clip-r)" />

            {/* Right pupil */}
            <circle cx="53" cy="42" r="3" fill="#001233" clipPath="url(#ir-eye-clip-r)" />

            {/* Right highlight */}
            <circle cx="50.5" cy="39.5" r="2" fill="white" opacity="0.7" clipPath="url(#ir-eye-clip-r)" />

            {/* Right eye socket rim */}
            <ellipse cx="53" cy="42" rx="13" ry="8" fill="none" stroke="#00D4FF" strokeWidth="0.6" opacity="0.5" />

            {/* Neck */}
            <rect x="33" y="77" width="14" height="12" rx="3" fill="#0D0D0F" stroke="#1A1A1E" strokeWidth="0.5" />

            {/* Collar */}
            <line x1="28" y1="88" x2="52" y2="88" stroke="#00D4FF" strokeWidth="0.6" opacity="0.5" />
          </g>
        </g>
      </svg>
    </div>
  );
}
