'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

/**
 * Attendly's mascot — a sleek black horned-helmet robot with glowing white
 * eyes, a crescent-moon crest and subtle warm line-work (faithful to the
 * reference art). Fully self-animating: it appears, greets with "Hi", blinks,
 * breathes/floats, and tracks the cursor. Pure SVG + GSAP — no 3D payload, so
 * it stays as light and minimal as the rest of the site.
 */
export function HeroRobot() {
  const root = useRef<HTMLDivElement>(null);
  const floatG = useRef<SVGGElement>(null);
  const headG = useRef<SVGGElement>(null);
  const eyeL = useRef<SVGGElement>(null);
  const eyeR = useRef<SVGGElement>(null);
  const bubble = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<'hi' | 'heart'>('hi');

  useEffect(() => {
    if (typeof window === 'undefined' || !root.current) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let ctx: ReturnType<typeof gsap.context> | undefined;
    const cleanups: Array<() => void> = [];

    try {
      ctx = gsap.context(() => {
        // 1) Entrance — the robot materialises from the dark.
        gsap.fromTo(root.current,
          { opacity: 0, y: 26, scale: 0.92 },
          { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: 'expo.out', delay: 0.35 },
        );

        // 2) Greeting bubble: pops in saying "Hi", then settles into a heart.
        gsap.fromTo(bubble.current,
          { opacity: 0, scale: 0.4, y: 8 },
          { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'back.out(2.2)', delay: 1.15 },
        );
        gsap.delayedCall(reduce ? 0 : 2.7, () => setPhase('heart'));

        if (reduce) return;

        // 3) Gentle breathing float.
        gsap.to(floatG.current, {
          y: -12, duration: 3.2, ease: 'sine.inOut', yoyo: true, repeat: -1,
        });

        // 4) Blink loop — squash the eyes on the Y axis.
        const blink = () => {
          gsap.timeline()
            .to([eyeL.current, eyeR.current], { scaleY: 0.08, transformOrigin: 'center', duration: 0.07, ease: 'power2.in' })
            .to([eyeL.current, eyeR.current], { scaleY: 1, duration: 0.12, ease: 'power2.out' })
            .call(() => gsap.delayedCall(gsap.utils.random(2.4, 5), blink));
        };
        gsap.delayedCall(2, blink);

        // 5) Cursor tracking — head tilts, eyes drift toward the pointer.
        const onMove = (e: PointerEvent) => {
          const { innerWidth: w, innerHeight: h } = window;
          const nx = (e.clientX - w / 2) / (w / 2);
          const ny = (e.clientY - h / 2) / (h / 2);
          gsap.to(headG.current, { rotation: nx * 4, x: nx * 6, y: ny * 4, transformOrigin: 'center 70%', duration: 1, ease: 'power3.out' });
          gsap.to([eyeL.current, eyeR.current], { x: nx * 5, y: ny * 4, duration: 1, ease: 'power3.out' });
        };
        window.addEventListener('pointermove', onMove);
        cleanups.push(() => window.removeEventListener('pointermove', onMove));
      }, root);
    } catch { /* never crash the hero on animation failure */ }

    return () => {
      cleanups.forEach((fn) => fn());
      try { ctx?.revert(); } catch {}
    };
  }, []);

  return (
    <div ref={root} className="relative mx-auto w-full max-w-[440px] select-none" style={{ opacity: 0 }}>
      {/* Speech bubble — greets with "Hi", then becomes a heart (per the art). */}
      <div
        ref={bubble}
        className="absolute left-[6%] top-[8%] z-20"
        style={{ opacity: 0 }}
        aria-hidden
      >
        <div className="relative rounded-2xl bg-[#F4F2EE] px-3.5 py-2 shadow-[0_10px_30px_-8px_rgba(0,0,0,0.6)]">
          {phase === 'hi' ? (
            <span className="font-display text-[15px] font-bold tracking-tight text-[#0A0A0B]">Hi 👋</span>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" className="text-[#0A0A0B]">
              <path d="M12 21s-7.5-4.9-10-9.2C.4 9 1.6 5.5 5 5.5c2 0 3.2 1.2 4 2.4.8-1.2 2-2.4 4-2.4 3.4 0 4.6 3.5 3 6.3C19.5 16.1 12 21 12 21Z" fill="currentColor" />
            </svg>
          )}
          {/* bubble tail */}
          <span className="absolute -bottom-1.5 left-5 h-3 w-3 rotate-45 rounded-[3px] bg-[#F4F2EE]" />
        </div>
      </div>

      {/* Soft floor glow behind the robot */}
      <div
        aria-hidden
        className="absolute left-1/2 top-[58%] -z-0 h-[55%] w-[70%] -translate-x-1/2 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(244,242,238,0.10), transparent 65%)', filter: 'blur(30px)' }}
      />

      <svg viewBox="0 0 400 600" className="relative z-10 w-full h-auto" role="img" aria-label="Attendly mascot robot waving hello">
        <defs>
          <linearGradient id="rBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#26262B" />
            <stop offset="0.5" stopColor="#161619" />
            <stop offset="1" stopColor="#08080A" />
          </linearGradient>
          <radialGradient id="rHelmet" cx="0.4" cy="0.3" r="0.85">
            <stop offset="0" stopColor="#33333A" />
            <stop offset="0.55" stopColor="#161619" />
            <stop offset="1" stopColor="#070709" />
          </radialGradient>
          <radialGradient id="rVisor" cx="0.5" cy="0.4" r="0.7">
            <stop offset="0" stopColor="#101013" />
            <stop offset="1" stopColor="#020203" />
          </radialGradient>
          <radialGradient id="rEye" cx="0.5" cy="0.4" r="0.6">
            <stop offset="0" stopColor="#FFFFFF" />
            <stop offset="0.7" stopColor="#FBF6E9" />
            <stop offset="1" stopColor="#E9DEC4" />
          </radialGradient>
          <filter id="rGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* warm hairline accent colour reused throughout */}
        {/* ── FLOATING GROUP ── */}
        <g ref={floatG}>
          {/* ===== BODY (drawn first, behind head) ===== */}
          <g stroke="#B9A57D" strokeWidth="1.1" strokeOpacity="0.55" fill="url(#rBody)">
            {/* legs */}
            <path d="M168 430 C 164 480, 162 520, 168 556 L 192 556 C 194 515, 194 470, 196 432 Z" />
            <path d="M232 430 C 236 480, 238 520, 232 556 L 208 556 C 206 515, 206 470, 204 432 Z" />
            {/* feet */}
            <path d="M150 556 C 150 548, 160 544, 172 545 C 186 546, 196 550, 196 558 C 196 566, 184 568, 168 568 C 156 568, 150 564, 150 556 Z" />
            <path d="M250 556 C 250 548, 240 544, 228 545 C 214 546, 204 550, 204 558 C 204 566, 216 568, 232 568 C 244 568, 250 564, 250 556 Z" />
            {/* torso */}
            <path d="M150 320 C 146 360, 150 410, 168 436 L 232 436 C 250 410, 254 360, 250 320 C 244 305, 156 305, 150 320 Z" />
            {/* arms */}
            <path d="M150 326 C 126 336, 118 380, 122 426 C 124 440, 138 440, 140 428 C 138 388, 146 356, 162 340 Z" />
            <path d="M250 326 C 274 336, 282 380, 278 426 C 276 440, 262 440, 260 428 C 262 388, 254 356, 238 340 Z" />
          </g>

          {/* scarf / cowl over the chest */}
          <path d="M168 300 C 180 320, 220 320, 232 300 C 240 322, 236 352, 224 372 C 214 356, 186 356, 176 372 C 164 352, 160 322, 168 300 Z"
                fill="#1B1B1F" stroke="#B9A57D" strokeWidth="1.1" strokeOpacity="0.6" />

          {/* chest emblem: circle bisected by a vertical line */}
          <g stroke="#C9B68A" strokeWidth="1.4" strokeOpacity="0.85" fill="none" filter="url(#rGlow)">
            <line x1="200" y1="338" x2="200" y2="404" />
            <circle cx="200" cy="368" r="13" />
          </g>
          {/* small lower-body crescents (knees) */}
          <path d="M176 470 a7 7 0 1 0 0.1 0 a5 5 0 1 1 -0.1 0 Z" fill="#C9B68A" fillOpacity="0.6" />
          <path d="M224 470 a7 7 0 1 0 0.1 0 a5 5 0 1 1 -0.1 0 Z" fill="#C9B68A" fillOpacity="0.6" />

          {/* ===== HEAD GROUP (tilts with cursor) ===== */}
          <g ref={headG}>
            {/* horns */}
            <path d="M132 118 C 96 96, 74 60, 70 34 C 86 44, 116 72, 138 104 Z"
                  fill="url(#rHelmet)" stroke="#B9A57D" strokeWidth="1.2" strokeOpacity="0.5" />
            <path d="M268 118 C 304 96, 326 60, 330 34 C 314 44, 284 72, 262 104 Z"
                  fill="url(#rHelmet)" stroke="#B9A57D" strokeWidth="1.2" strokeOpacity="0.5" />

            {/* helmet dome */}
            <path d="M200 60 C 128 60, 92 116, 92 178 C 92 244, 140 286, 200 286 C 260 286, 308 244, 308 178 C 308 116, 272 60, 200 60 Z"
                  fill="url(#rHelmet)" stroke="#B9A57D" strokeWidth="1.3" strokeOpacity="0.55" />

            {/* glossy top highlight */}
            <path d="M150 92 C 178 74, 230 76, 256 96 C 232 86, 176 86, 150 92 Z"
                  fill="#FFFFFF" fillOpacity="0.10" />

            {/* forehead crescent crest */}
            <path d="M200 96 a13 13 0 1 0 6 24 a10 10 0 1 1 -6 -24 Z"
                  fill="#E7DBBE" fillOpacity="0.9" filter="url(#rGlow)" />

            {/* helmet side hairline accents */}
            <path d="M112 150 C 108 180, 112 210, 126 232" fill="none" stroke="#B9A57D" strokeWidth="1" strokeOpacity="0.45" />
            <path d="M288 150 C 292 180, 288 210, 274 232" fill="none" stroke="#B9A57D" strokeWidth="1" strokeOpacity="0.45" />

            {/* visor / face plate */}
            <path d="M200 132 C 150 132, 124 162, 124 198 C 124 240, 160 264, 200 264 C 240 264, 276 240, 276 198 C 276 162, 250 132, 200 132 Z"
                  fill="url(#rVisor)" stroke="#B9A57D" strokeWidth="0.9" strokeOpacity="0.35" />

            {/* eyes — glowing white ovals */}
            <g filter="url(#rGlow)">
              <g ref={eyeL}>
                <ellipse cx="174" cy="196" rx="13" ry="23" fill="url(#rEye)" />
              </g>
              <g ref={eyeR}>
                <ellipse cx="226" cy="196" rx="13" ry="23" fill="url(#rEye)" />
              </g>
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}
