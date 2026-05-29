'use client';

import { useEffect, useRef, useState } from 'react';
import { Cpu, MapPin, ScanFace, ShieldCheck } from 'lucide-react';
import { SplineScene } from '@/components/ui/splite';
import { Spotlight } from '@/components/ui/spotlight';
import { InteractiveSpotlight } from '@/components/ui/interactive-spotlight';
import { Aurora } from '@/components/Aurora';

const SCENE = 'https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode';

const CHIPS = [
  { icon: ScanFace,   label: 'Identity verified' },
  { icon: MapPin,     label: 'Inside geofence' },
  { icon: Cpu,        label: 'Device attested' },
  { icon: ShieldCheck,label: 'Signed in 184ms' },
];

export function Interactive3D() {
  const ref = useRef<HTMLDivElement>(null);
  const [show3D, setShow3D] = useState(false);
  const [allowed, setAllowed] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Never load the heavy 3D scene on touch / small screens.
    const heavyOff =
      window.matchMedia('(pointer: coarse)').matches ||
      window.matchMedia('(max-width: 767px)').matches;
    if (heavyOff) { setAllowed(false); return; }

    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setShow3D(true); io.disconnect(); } },
      { rootMargin: '200px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={ref} className="section-dark relative overflow-hidden py-24 lg:py-32">
      <Aurora variant="soft" />
      <Spotlight className="-top-40 left-0 md:left-1/3 md:-top-20" fill="#FF6B3D" />
      <InteractiveSpotlight size={460} className="from-accent/20 via-accent-violet/10 to-transparent" />

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center min-h-[440px]">
          {/* Copy */}
          <div>
            <span data-reveal className="text-[11px] tracking-[0.3em] text-white/40 uppercase">[ the system ]</span>
            <h2 data-reveal className="font-display text-[2.6rem] lg:text-[4rem] leading-[1.04] tracking-tightish mt-6 text-white">
              Attendance that
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent via-accent-rose to-accent-violet">
                runs itself.
              </span>
            </h2>
            <p data-reveal className="mt-6 max-w-[440px] text-[14px] leading-[1.75] text-white/55">
              While you teach, Attendly watches every scan — checking device, location and
              identity in milliseconds, then writing an immutable record. No roll call.
              No proxies. No busywork.
            </p>

            <div data-reveal className="mt-8 flex flex-wrap gap-2.5">
              {CHIPS.map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-3.5 py-2 text-[12px] text-white/75"
                >
                  <Icon size={14} className="text-accent" strokeWidth={1.8} />
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* 3D / fallback */}
          <div className="relative h-[340px] lg:h-[500px]">
            {allowed && show3D ? (
              <SplineScene scene={SCENE} className="w-full h-full" />
            ) : (
              <Fallback />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/** Lightweight animated orb shown on mobile / before the 3D scene mounts. */
function Fallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative w-44 h-44">
        <div
          className="absolute inset-0 rounded-full"
          style={{ background: 'radial-gradient(circle at 38% 32%, #FF6B3D, #FF4D6D 45%, #7C5CFF 100%)', filter: 'blur(2px)' }}
        />
        <div
          className="absolute inset-0 rounded-full opacity-60"
          style={{ background: 'radial-gradient(circle at 65% 70%, rgba(255,255,255,0.35), transparent 55%)' }}
        />
        <div className="absolute -inset-6 rounded-full border border-white/10 animate-[loaderSpin_8s_linear_infinite]" />
        <div className="absolute -inset-12 rounded-full border border-white/5" />
      </div>
    </div>
  );
}
