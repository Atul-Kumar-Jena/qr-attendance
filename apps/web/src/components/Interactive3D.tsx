'use client';

import { useRef } from 'react';
import { Cpu, MapPin, ScanFace, ShieldCheck } from 'lucide-react';
import { Spotlight } from '@/components/ui/spotlight';
import { InteractiveSpotlight } from '@/components/ui/interactive-spotlight';
import { Aurora } from '@/components/Aurora';

const CHIPS = [
  { icon: ScanFace,   label: 'Identity verified' },
  { icon: MapPin,     label: 'Inside geofence' },
  { icon: Cpu,        label: 'Device attested' },
  { icon: ShieldCheck,label: 'Signed in 184ms' },
];

export function Interactive3D() {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <section ref={ref} className="section-dark relative overflow-hidden py-24 lg:py-32">
      <Aurora variant="soft" />
      <Spotlight className="-top-40 left-0 md:left-1/3 md:-top-20" fill="#F4F2EE" />
      <InteractiveSpotlight size={460} />

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center min-h-[440px]">
          {/* Copy */}
          <div>
            <span data-reveal className="text-[11px] tracking-[0.3em] text-white/40 uppercase">[ the system ]</span>
            <h2 data-reveal className="font-display text-[2.6rem] lg:text-[4rem] leading-[1.04] tracking-tightish mt-6 text-white">
              Attendance that
              <br />
              <span className="text-gradient-silver italic">
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

          {/* Monochrome orb showcase */}
          <div className="relative h-[360px] lg:h-[520px]">
            {/* glowing pedestal beneath the object */}
            <div
              aria-hidden
              className="absolute left-1/2 top-1/2 w-[68%] h-[68%] rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(circle, rgba(244,242,238,0.16), rgba(244,242,238,0.05) 45%, transparent 68%)',
                filter: 'blur(26px)',
                animation: 'pedestalPulse 6s ease-in-out infinite',
              }}
            />
            <div className="relative h-full w-full" style={{ animation: 'float3d 7s ease-in-out infinite' }}>
              <Fallback />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Lightweight animated monochrome orb. */
function Fallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative w-44 h-44">
        <div
          className="absolute inset-0 rounded-full"
          style={{ background: 'radial-gradient(circle at 38% 32%, #5A5A60, #1A1A1D 60%, #08080A 100%)', filter: 'blur(2px)' }}
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
