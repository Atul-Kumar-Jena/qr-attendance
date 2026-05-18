'use client';

import { useEffect, useRef } from 'react';

export function GridBackground() {
  const glowRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const glow = glowRef.current!;
    const canvas = canvasRef.current!;
    const ctx2d = canvas.getContext('2d')!;

    // Dot grid config
    const SPACING = 28;
    const DOT_R = 1.1;
    const GLOW_RADIUS = 180;
    const COLORS = [
      [255, 107, 61],   // orange
      [139, 92, 246],   // violet
      [99, 102, 241],   // indigo
      [236, 72, 153],   // pink
    ] as const;

    let W = 0, H = 0;
    let mx = -999, my = -999;
    let raf = 0;
    let isDark = document.documentElement.classList.contains('dark');

    const resize = () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    resize();

    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };
    const onLeave = () => { mx = -999; my = -999; };

    const draw = () => {
      isDark = document.documentElement.classList.contains('dark');
      ctx2d.clearRect(0, 0, W, H);

      const cols = Math.ceil(W / SPACING) + 1;
      const rows = Math.ceil(H / SPACING) + 1;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * SPACING;
          const y = r * SPACING;
          const dx = x - mx;
          const dy = y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < GLOW_RADIUS && mx > 0) {
            const t = 1 - dist / GLOW_RADIUS;
            const t2 = t * t;
            // pick color based on angle
            const angle = Math.atan2(dy, dx);
            const colorIdx = Math.floor(((angle + Math.PI) / (2 * Math.PI)) * COLORS.length) % COLORS.length;
            const [rr, gg, bb] = COLORS[colorIdx];
            const baseAlpha = isDark ? 0.15 : 0.1;
            const alpha = baseAlpha + t2 * (isDark ? 0.7 : 0.55);
            const radius = DOT_R + t2 * 2.5;
            ctx2d.beginPath();
            ctx2d.arc(x, y, radius, 0, Math.PI * 2);
            ctx2d.fillStyle = `rgba(${rr},${gg},${bb},${alpha})`;
            ctx2d.fill();
          } else {
            // static dim dot
            const alpha = isDark ? 0.08 : 0.06;
            ctx2d.beginPath();
            ctx2d.arc(x, y, DOT_R, 0, Math.PI * 2);
            ctx2d.fillStyle = isDark ? `rgba(240,237,230,${alpha})` : `rgba(11,18,32,${alpha})`;
            ctx2d.fill();
          }
        }
      }

      // Soft radial glow following mouse
      if (mx > 0) {
        glow.style.background = `radial-gradient(600px circle at ${mx}px ${my}px, rgba(139,92,246,0.07) 0%, rgba(255,107,61,0.04) 40%, transparent 70%)`;
      } else {
        glow.style.background = '';
      }

      raf = requestAnimationFrame(draw);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseleave', onLeave, { passive: true });
    window.addEventListener('resize', resize, { passive: true });
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0" aria-hidden>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 1 }}
      />
      <div ref={glowRef} className="absolute inset-0 transition-none" />
      {/* Fade edges */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 80% 50% at 50% 0%, transparent 60%, var(--bg, #FAFAF7) 100%)',
      }} />
    </div>
  );
}
