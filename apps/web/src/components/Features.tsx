'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initGSAP } from '@/lib/gsap-init';

if (typeof window !== 'undefined') initGSAP();

// ── Animated SVG illustrations ─────────────────────────────────────────────

function IlluMultiTenant() {
  return (
    <svg width="52" height="44" viewBox="0 0 52 44" fill="none" aria-hidden>
      <style>{`
        .mt-l3 { animation: mtRise 3s ease-in-out infinite; animation-delay: 0s; }
        .mt-l2 { animation: mtRise 3s ease-in-out infinite; animation-delay: 0.18s; }
        .mt-l1 { animation: mtRise 3s ease-in-out infinite; animation-delay: 0.36s; }
        @keyframes mtRise {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-4px); }
        }
      `}</style>
      <rect className="mt-l3" x="6" y="26" width="40" height="10" rx="3" fill="rgba(46,138,92,0.20)" stroke="rgba(46,138,92,0.5)" strokeWidth="1.2"/>
      <rect className="mt-l2" x="10" y="16" width="32" height="10" rx="3" fill="rgba(46,138,92,0.32)" stroke="rgba(46,138,92,0.65)" strokeWidth="1.2"/>
      <rect className="mt-l1" x="14" y="6"  width="24" height="10" rx="3" fill="rgba(46,138,92,0.55)" stroke="rgba(46,138,92,0.9)"  strokeWidth="1.2"/>
    </svg>
  );
}

function IlluDynamicQR() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden>
      <style>{`
        .qr-cell { animation: qrPop 2.2s ease-in-out infinite; }
        @keyframes qrPop {
          0%,80%,100% { opacity:1; transform: scale(1); }
          40%          { opacity:0.3; transform: scale(0.5); }
        }
      `}</style>
      {/* Finder squares */}
      {[[2,2],[30,2],[2,30]].map(([x,y],i) => (
        <g key={i}>
          <rect x={x} y={y} width={16} height={16} rx="2" fill="none" stroke="rgba(46,138,92,0.8)" strokeWidth="1.5"/>
          <rect x={x+4} y={y+4} width={8} height={8} rx="1" fill="rgba(46,138,92,0.7)"/>
        </g>
      ))}
      {/* Data cells */}
      {[
        [32,32],[38,32],[44,32],
        [32,38],[38,38],
        [32,44],[44,44],
        [44,38],
      ].map(([x,y],i) => (
        <rect
          key={i}
          className="qr-cell"
          x={x} y={y} width={5} height={5} rx="1"
          fill="rgba(46,138,92,0.75)"
          style={{ animationDelay: `${i * 0.18}s` }}
        />
      ))}
      {/* Scan beam */}
      <line x1="2" y1="24" x2="46" y2="24" stroke="rgba(46,138,92,0.9)" strokeWidth="1.5" strokeDasharray="4 2" style={{ animation: 'scanMove 2s linear infinite' }}/>
      <style>{`@keyframes scanMove { 0%{stroke-dashoffset:0} 100%{stroke-dashoffset:48} }`}</style>
    </svg>
  );
}

function IlluGeofence() {
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none" aria-hidden>
      <style>{`
        .geo-ring { animation: geoExpand 2.4s ease-out infinite; transform-origin: 26px 26px; }
        .geo-r2   { animation-delay: 0.8s; }
        .geo-r3   { animation-delay: 1.6s; }
        @keyframes geoExpand {
          0%   { opacity:0.8; transform: scale(0.3); }
          100% { opacity:0;   transform: scale(1.0); }
        }
      `}</style>
      <circle cx="26" cy="26" r="4" fill="rgba(46,138,92,0.9)"/>
      <circle className="geo-ring"     cx="26" cy="26" r="10" stroke="rgba(46,138,92,0.7)" strokeWidth="1.5" fill="none"/>
      <circle className="geo-ring geo-r2" cx="26" cy="26" r="18" stroke="rgba(46,138,92,0.45)" strokeWidth="1.2" fill="none"/>
      <circle className="geo-ring geo-r3" cx="26" cy="26" r="24" stroke="rgba(46,138,92,0.25)" strokeWidth="1" fill="none"/>
    </svg>
  );
}

function IlluDeviceBinding() {
  return (
    <svg width="52" height="44" viewBox="0 0 52 44" fill="none" aria-hidden>
      <style>{`
        .db-link { animation: dbPulse 2.5s ease-in-out infinite; }
        @keyframes dbPulse {
          0%,100% { stroke-dashoffset: 20; opacity: 0.5; }
          50%      { stroke-dashoffset: 0;  opacity: 1; }
        }
      `}</style>
      {/* Phone */}
      <rect x="2" y="8" width="16" height="28" rx="3" fill="none" stroke="rgba(46,138,92,0.8)" strokeWidth="1.4"/>
      <rect x="5" y="12" width="10" height="14" rx="1.5" fill="rgba(46,138,92,0.2)"/>
      <rect x="8" y="31" width="4" height="2" rx="1" fill="rgba(46,138,92,0.5)"/>
      {/* Chain link */}
      <line x1="18" y1="22" x2="34" y2="22" stroke="rgba(46,138,92,0.7)" strokeWidth="1.5" strokeDasharray="4 3" className="db-link"/>
      <circle cx="26" cy="22" r="3" fill="rgba(46,138,92,0.55)" stroke="rgba(46,138,92,0.9)" strokeWidth="1"/>
      {/* Lock */}
      <rect x="34" y="14" width="16" height="16" rx="3" fill="none" stroke="rgba(46,138,92,0.8)" strokeWidth="1.4"/>
      <path d="M39 14v-3a4 4 0 018 0v3" stroke="rgba(46,138,92,0.8)" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
      <circle cx="42" cy="22" r="2" fill="rgba(46,138,92,0.7)"/>
      <line x1="42" y1="24" x2="42" y2="27" stroke="rgba(46,138,92,0.7)" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}

function IlluAppAttestation() {
  return (
    <svg width="44" height="50" viewBox="0 0 44 50" fill="none" aria-hidden>
      <style>{`
        .shield-check { stroke-dasharray: 30; stroke-dashoffset: 30; animation: drawPath 1.2s ease forwards 0.3s; }
        .shield-scan  { animation: shieldScan 3s ease-in-out infinite; }
        @keyframes drawPath { to { stroke-dashoffset: 0; } }
        @keyframes shieldScan { 0%,100%{transform:translateY(0)} 50%{transform:translateY(16px)} }
      `}</style>
      <path d="M22 2L4 9v14c0 10 8 18 18 21 10-3 18-11 18-21V9L22 2z" fill="rgba(46,138,92,0.12)" stroke="rgba(46,138,92,0.75)" strokeWidth="1.5"/>
      {/* Scan beam inside shield */}
      <line className="shield-scan" x1="8" y1="20" x2="36" y2="20" stroke="rgba(46,138,92,0.55)" strokeWidth="1.2" strokeDasharray="3 2" style={{ transformOrigin: '22px 20px' }}/>
      {/* Checkmark */}
      <path className="shield-check" d="M12 24l7 7 13-13" stroke="rgba(46,138,92,0.95)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  );
}

function IlluFraudDetection() {
  return (
    <svg width="52" height="48" viewBox="0 0 52 48" fill="none" aria-hidden>
      <style>{`
        .fraud-eye { animation: eyeBlink 3s ease-in-out infinite; transform-origin: 26px 22px; }
        @keyframes eyeBlink {
          0%,90%,100% { scaleY: 1; }
          95%          { transform: scaleY(0.1); }
        }
        .fraud-alert { animation: alertPulse 1.8s ease-in-out infinite; }
        @keyframes alertPulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
      `}</style>
      {/* Eye */}
      <ellipse className="fraud-eye" cx="26" cy="22" rx="14" ry="9" fill="none" stroke="rgba(46,138,92,0.7)" strokeWidth="1.4"/>
      <circle cx="26" cy="22" r="5" fill="rgba(46,138,92,0.3)" stroke="rgba(46,138,92,0.8)" strokeWidth="1.2"/>
      <circle cx="26" cy="22" r="2.5" fill="rgba(46,138,92,0.9)"/>
      {/* Alert triangle */}
      <path className="fraud-alert" d="M26 34l-8 12h16L26 34z" fill="rgba(239,68,68,0.25)" stroke="rgba(239,68,68,0.8)" strokeWidth="1.2"/>
      <line className="fraud-alert" x1="26" y1="38" x2="26" y2="42" stroke="rgba(239,68,68,0.9)" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="26" cy="44" r="1" fill="rgba(239,68,68,0.9)"/>
    </svg>
  );
}

function IlluReports() {
  return (
    <svg width="44" height="52" viewBox="0 0 44 52" fill="none" aria-hidden>
      <style>{`
        .doc-line { animation: lineGrow 2.4s ease-in-out infinite; transform-origin: left center; }
        @keyframes lineGrow {
          0%,100% { transform: scaleX(0.3); opacity: 0.4; }
          50%      { transform: scaleX(1);   opacity: 1; }
        }
      `}</style>
      <path d="M6 2h22l10 10v38H6V2z" fill="rgba(46,138,92,0.08)" stroke="rgba(46,138,92,0.6)" strokeWidth="1.4"/>
      <path d="M28 2v10h10" stroke="rgba(46,138,92,0.6)" strokeWidth="1.4" fill="none"/>
      {[18, 26, 34, 40].map((y, i) => (
        <rect key={y} className="doc-line" x="10" y={y} height="3" rx="1.5"
          width="24" fill="rgba(46,138,92,0.65)"
          style={{ animationDelay: `${i * 0.2}s` }} />
      ))}
      {/* Checkmark badge */}
      <circle cx="34" cy="44" r="7" fill="rgba(46,138,92,0.85)"/>
      <path d="M30 44l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
    </svg>
  );
}

function IlluAuditTrail() {
  return (
    <svg width="52" height="44" viewBox="0 0 52 44" fill="none" aria-hidden>
      <style>{`
        .chain-link { animation: chainAppear 2.8s ease-in-out infinite; }
        .chain-l2   { animation-delay: 0.5s; }
        .chain-l3   { animation-delay: 1.0s; }
        .chain-con  { animation: chainLine 2.8s ease-in-out infinite; }
        .chain-cn2  { animation-delay: 0.5s; }
        @keyframes chainAppear {
          0%,20%  { opacity: 0.2; transform: scale(0.85); }
          40%,100%{ opacity: 1;   transform: scale(1); }
        }
        @keyframes chainLine {
          0%,20%  { stroke-dashoffset: 20; opacity: 0.2; }
          40%,100%{ stroke-dashoffset: 0;  opacity: 0.8; }
        }
      `}</style>
      {/* Block 1 */}
      <rect className="chain-link" x="2" y="14" width="14" height="16" rx="3" fill="rgba(46,138,92,0.2)" stroke="rgba(46,138,92,0.8)" strokeWidth="1.3"/>
      <rect x="5" y="19" width="8" height="2" rx="1" fill="rgba(46,138,92,0.6)"/>
      <rect x="5" y="23" width="5" height="2" rx="1" fill="rgba(46,138,92,0.4)"/>
      {/* Connector 1 */}
      <line className="chain-con" x1="16" y1="22" x2="22" y2="22" stroke="rgba(46,138,92,0.7)" strokeWidth="1.3" strokeDasharray="4 2"/>
      {/* Block 2 */}
      <rect className="chain-link chain-l2" x="22" y="14" width="14" height="16" rx="3" fill="rgba(46,138,92,0.2)" stroke="rgba(46,138,92,0.8)" strokeWidth="1.3"/>
      <rect x="25" y="19" width="8" height="2" rx="1" fill="rgba(46,138,92,0.6)"/>
      <rect x="25" y="23" width="5" height="2" rx="1" fill="rgba(46,138,92,0.4)"/>
      {/* Connector 2 */}
      <line className="chain-con chain-cn2" x1="36" y1="22" x2="42" y2="22" stroke="rgba(46,138,92,0.7)" strokeWidth="1.3" strokeDasharray="4 2"/>
      {/* Block 3 */}
      <rect className="chain-link chain-l3" x="36" y="14" width="14" height="16" rx="3" fill="rgba(46,138,92,0.2)" stroke="rgba(46,138,92,0.8)" strokeWidth="1.3"/>
      <rect x="39" y="19" width="8" height="2" rx="1" fill="rgba(46,138,92,0.6)"/>
      <rect x="39" y="23" width="5" height="2" rx="1" fill="rgba(46,138,92,0.4)"/>
      {/* Hash label */}
      <text x="2" y="40" fontSize="7" fill="rgba(46,138,92,0.55)" fontFamily="monospace">#a3f · #7c2 · #9e1</text>
    </svg>
  );
}

const FEATS = [
  { t: 'Multi-tenant SaaS',    d: 'One platform, fully isolated workspaces per institution.',           Illu: IlluMultiTenant },
  { t: 'Dynamic signed QR',    d: '1.5-second rotation, ECDSA-P256 signed, single-use nonce.',         Illu: IlluDynamicQR },
  { t: 'Geofencing',           d: 'Server-side Haversine + accuracy thresholds.',                      Illu: IlluGeofence },
  { t: 'Device binding',       d: 'One device per student. Reset is admin-only.',                       Illu: IlluDeviceBinding },
  { t: 'App attestation',      d: 'Play Integrity + DeviceCheck/App Attest.',                          Illu: IlluAppAttestation },
  { t: 'Fraud detection',      d: 'Weighted signals, suspicious queue, admin review.',                  Illu: IlluFraudDetection },
  { t: 'PDF / Excel reports',  d: 'Branded, async, signed download URLs.',                             Illu: IlluReports },
  { t: 'Audit trail',          d: 'Append-only hash-chained logs for every sensitive action.',          Illu: IlluAuditTrail },
];

export function Features() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.feat-card').forEach((card, i) => {
        gsap.from(card, {
          opacity: 0, y: 30, scale: 0.96,
          duration: 0.7, ease: 'power3.out',
          delay: (i % 4) * 0.06,
          scrollTrigger: { trigger: card, start: 'top 90%' },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="features" ref={root} className="py-24 md:py-32">
      <div className="container mb-14 md:mb-16">
        <span className="text-[11px] tracking-[0.3em] text-ink-mute uppercase">[ 03 — features ]</span>
        <h2 className="mt-4 font-display text-[2.5rem] lg:text-[4rem] leading-[1.02] tracking-tightish max-w-3xl">
          Eight building blocks. <em className="not-italic iri-text">One verdict.</em>
        </h2>
      </div>

      <div className="container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {FEATS.map((f, i) => (
          <article
            key={f.t}
            className="feat-card group relative rounded-3xl glass p-6 md:p-7 flex flex-col gap-5 min-h-[230px] hover:-translate-y-1.5 transition-transform duration-300 will-change-transform"
          >
            <div className="flex items-start justify-between">
              <div className="p-3 rounded-2xl bg-accent/8 border border-accent/15 group-hover:bg-accent/14 group-hover:border-accent/30 transition-colors">
                <f.Illu />
              </div>
              <div className="font-mono text-[10.5px] text-ink-mute tracking-wider pt-1">
                {String(i + 1).padStart(2, '0')}
              </div>
            </div>
            <div className="mt-auto">
              <h3 className="font-display text-[1.5rem] md:text-[1.6rem] leading-tight">{f.t}</h3>
              <p className="mt-2 text-[12.5px] leading-relaxed text-ink-mute">{f.d}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
