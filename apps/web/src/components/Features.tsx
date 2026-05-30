'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initGSAP } from '@/lib/gsap-init';

/* ─── Per-feature illustrations ─────────────────────────────────────────── */

function IlluMultiTenant() {
  return (
    <svg viewBox="0 0 280 180" fill="none" className="w-full h-full" aria-hidden>
      <style>{`
        @keyframes ft-mt-float0 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
        @keyframes ft-mt-float1 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes ft-mt-float2 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
        @keyframes ft-mt-base   { 0%,100%{opacity:0.35} 50%{opacity:0.65} }
      `}</style>
      <ellipse cx="140" cy="160" rx="118" ry="6" fill="var(--accent)" opacity="0.10"
        style={{animation:'ft-mt-base 3s ease-in-out infinite'}}/>
      <g style={{animation:'ft-mt-float0 4s ease-in-out infinite', transformOrigin:'55px 130px'}}>
        <rect x="30" y="85" width="50" height="70" rx="5" fill="var(--accent)" fillOpacity="0.10" stroke="var(--accent)" strokeOpacity="0.55" strokeWidth="1.4"/>
        <rect x="40" y="97" width="9" height="9" rx="1.5" fill="var(--accent)" fillOpacity="0.55"/>
        <rect x="61" y="97" width="9" height="9" rx="1.5" fill="var(--accent)" fillOpacity="0.25"/>
        <rect x="40" y="113" width="9" height="9" rx="1.5" fill="var(--accent)" fillOpacity="0.25"/>
        <rect x="61" y="113" width="9" height="9" rx="1.5" fill="var(--accent)" fillOpacity="0.45"/>
        <rect x="46" y="133" width="18" height="22" rx="1.5" fill="var(--accent)" fillOpacity="0.35"/>
        <text x="55" y="80" textAnchor="middle" fontSize="8" fill="var(--accent)" fillOpacity="0.6" fontFamily="ui-monospace,monospace">A</text>
      </g>
      <g style={{animation:'ft-mt-float1 4.6s ease-in-out infinite 0.4s', transformOrigin:'140px 120px'}}>
        <rect x="110" y="56" width="60" height="99" rx="5" fill="var(--accent)" fillOpacity="0.16" stroke="var(--accent)" strokeOpacity="0.8" strokeWidth="1.6"/>
        {[68, 86, 104].map((y) => (
          <g key={y}>
            <rect x="120" y={y} width="10" height="10" rx="1.5" fill="var(--accent)" fillOpacity={y === 68 ? 0.7 : 0.4}/>
            <rect x="150" y={y} width="10" height="10" rx="1.5" fill="var(--accent)" fillOpacity={y === 68 ? 0.4 : 0.55}/>
          </g>
        ))}
        <rect x="130" y="129" width="20" height="26" rx="1.5" fill="var(--accent)" fillOpacity="0.5"/>
        <text x="140" y="50" textAnchor="middle" fontSize="8" fill="var(--accent)" fillOpacity="0.9" fontFamily="ui-monospace,monospace">B</text>
      </g>
      <g style={{animation:'ft-mt-float2 3.8s ease-in-out infinite 0.9s', transformOrigin:'225px 130px'}}>
        <rect x="200" y="90" width="50" height="65" rx="5" fill="var(--accent)" fillOpacity="0.10" stroke="var(--accent)" strokeOpacity="0.55" strokeWidth="1.4"/>
        <rect x="210" y="102" width="9" height="9" rx="1.5" fill="var(--accent)" fillOpacity="0.25"/>
        <rect x="231" y="102" width="9" height="9" rx="1.5" fill="var(--accent)" fillOpacity="0.45"/>
        <rect x="210" y="118" width="9" height="9" rx="1.5" fill="var(--accent)" fillOpacity="0.45"/>
        <rect x="231" y="118" width="9" height="9" rx="1.5" fill="var(--accent)" fillOpacity="0.25"/>
        <rect x="216" y="135" width="18" height="20" rx="1.5" fill="var(--accent)" fillOpacity="0.35"/>
        <text x="225" y="85" textAnchor="middle" fontSize="8" fill="var(--accent)" fillOpacity="0.6" fontFamily="ui-monospace,monospace">C</text>
      </g>
      <line x1="93"  y1="40" x2="93"  y2="156" stroke="var(--accent)" strokeOpacity="0.18" strokeWidth="1" strokeDasharray="3 4"/>
      <line x1="187" y1="40" x2="187" y2="156" stroke="var(--accent)" strokeOpacity="0.18" strokeWidth="1" strokeDasharray="3 4"/>
    </svg>
  );
}

function IlluDynamicQR() {
  const cells = Array.from({ length: 7 }, (_, r) =>
    Array.from({ length: 7 }, (_, c) => {
      const corner = (r < 2 && c < 2) || (r < 2 && c > 4) || (r > 4 && c < 2);
      const seed = Math.sin(r * 12.9898 + c * 78.233) * 43758.5453;
      const on = corner || (seed - Math.floor(seed)) > 0.48;
      return { r, c, on, corner };
    }),
  ).flat();
  return (
    <svg viewBox="0 0 280 180" fill="none" className="w-full h-full" aria-hidden>
      <style>{`
        @keyframes ft-qr-arc   { 0%{stroke-dashoffset:0} 100%{stroke-dashoffset:-251.3} }
        @keyframes ft-qr-orbit { from{transform:rotate(0)} to{transform:rotate(360deg)} }
        @keyframes ft-qr-pulse { 0%,100%{opacity:0.6} 50%{opacity:1} }
        @keyframes ft-qr-cell  { 0%,100%{opacity:1} 50%{opacity:0.55} }
      `}</style>
      <circle cx="140" cy="86" r="65" fill="none" stroke="var(--accent)" strokeOpacity="0.18" strokeWidth="1" strokeDasharray="2 4"/>
      <g style={{ transformOrigin: '140px 86px', transform: 'rotate(-90deg)' }}>
        <circle cx="140" cy="86" r="58" fill="none" stroke="var(--accent)" strokeOpacity="0.7" strokeWidth="2"
          strokeLinecap="round" strokeDasharray="364.4 364.4"
          style={{ animation: 'ft-qr-arc 7s linear infinite' }}/>
      </g>
      <g style={{ transformOrigin: '140px 86px', animation: 'ft-qr-orbit 7s linear infinite' }}>
        <circle cx="198" cy="86" r="3.2" fill="var(--accent)"/>
      </g>
      <g transform="translate(108, 54)">
        <rect x="-4" y="-4" width="72" height="72" rx="6" fill="rgba(11,18,32,0.04)"/>
        {cells.map(({ r, c, on, corner }) =>
          on ? (
            <rect key={`${r}-${c}`} x={c * 9 + 1} y={r * 9 + 1} width="7.4" height="7.4" rx="1.2"
              fill={corner ? 'var(--accent)' : '#0B1220'}
              opacity={corner ? 0.92 : 0.78}
              style={!corner ? { animation: `ft-qr-cell 3.5s ease-in-out infinite ${(r + c) * 0.04}s` } : undefined}
            />
          ) : null,
        )}
        <rect x="3"  y="3"  width="11" height="11" rx="2" fill="none" stroke="var(--accent)" strokeWidth="1" opacity="0.8"/>
        <rect x="49" y="3"  width="11" height="11" rx="2" fill="none" stroke="var(--accent)" strokeWidth="1" opacity="0.8"/>
        <rect x="3"  y="49" width="11" height="11" rx="2" fill="none" stroke="var(--accent)" strokeWidth="1" opacity="0.8"/>
      </g>
      <text x="140" y="166" textAnchor="middle" fill="var(--accent)" fillOpacity="0.6" fontSize="8" fontFamily="ui-monospace,monospace"
        style={{ animation: 'ft-qr-pulse 3s ease-in-out infinite' }}>
        HMAC·SHA256 · 7s TTL · single-use
      </text>
    </svg>
  );
}

function IlluGeofence() {
  return (
    <svg viewBox="0 0 280 180" fill="none" className="w-full h-full" aria-hidden>
      <style>{`
        @keyframes ft-geo-pulse1 { 0%,100%{transform:scale(1);opacity:0.55} 50%{transform:scale(1.18);opacity:0.15} }
        @keyframes ft-geo-pulse2 { 0%,100%{transform:scale(1);opacity:0.35} 50%{transform:scale(1.10);opacity:0.10} }
        @keyframes ft-geo-pin    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
        @keyframes ft-geo-ok     { 0%,100%{opacity:0.8} 50%{opacity:1} }
        @keyframes ft-geo-deny   { 0%,100%{opacity:0.4} 50%{opacity:0.85} }
      `}</style>
      <g style={{ transformOrigin: '140px 86px' }}>
        <circle cx="140" cy="86" r="62" fill="var(--accent)" fillOpacity="0.04" stroke="var(--accent)" strokeOpacity="0.10" strokeWidth="1" strokeDasharray="2 5"/>
        <circle cx="140" cy="86" r="40" fill="var(--accent)" fillOpacity="0.05" stroke="var(--accent)" strokeOpacity="0.4" strokeWidth="1"
          style={{ animation: 'ft-geo-pulse1 3s ease-in-out infinite', transformOrigin: '140px 86px' }}/>
        <circle cx="140" cy="86" r="40" fill="none" stroke="var(--accent)" strokeOpacity="0.3" strokeWidth="1"
          style={{ animation: 'ft-geo-pulse2 3.5s ease-in-out infinite 0.6s', transformOrigin: '140px 86px' }}/>
      </g>
      <g style={{ animation: 'ft-geo-pin 2.6s ease-in-out infinite', transformOrigin: '140px 86px' }}>
        <path d="M140 70 a10 10 0 1 1 -0.001 0 z M140 80 l-4 6 4 8 4 -8 z" fill="var(--accent)"/>
        <circle cx="140" cy="80" r="3.2" fill="#FAFAF7"/>
      </g>
      <g style={{ animation: 'ft-geo-ok 2.2s ease-in-out infinite' }}>
        <circle cx="113" cy="66" r="11" fill="rgba(124,150,122,0.18)" stroke="#7C967A" strokeWidth="1.4"/>
        <path d="M108 66 l3.5 3.5 6 -7" stroke="#7C967A" strokeWidth="1.7" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
      <g style={{ animation: 'ft-geo-deny 2.2s ease-in-out infinite 0.7s' }}>
        <circle cx="208" cy="52" r="11" fill="rgba(239,68,68,0.16)" stroke="rgba(239,68,68,0.7)" strokeWidth="1.4"/>
        <path d="M204 48 l8 8 M212 48 l-8 8" stroke="rgba(239,68,68,0.95)" strokeWidth="1.6" strokeLinecap="round"/>
      </g>
      <text x="140" y="166" textAnchor="middle" fill="var(--accent)" fillOpacity="0.55" fontSize="8" fontFamily="ui-monospace,monospace">
        Server-side Haversine · accuracy gated
      </text>
    </svg>
  );
}

function IlluDeviceBinding() {
  return (
    <svg viewBox="0 0 280 180" fill="none" className="w-full h-full" aria-hidden>
      <style>{`
        @keyframes ft-bind-phone { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
        @keyframes ft-bind-chain { from{stroke-dashoffset:0} to{stroke-dashoffset:-12} }
        @keyframes ft-bind-lock  { 0%,100%{transform:scale(1)} 50%{transform:scale(1.06)} }
        @keyframes ft-bind-id    { 0%,100%{opacity:0.45} 50%{opacity:1} }
      `}</style>
      <g style={{ animation: 'ft-bind-phone 3.2s ease-in-out infinite', transformOrigin: '78px 90px' }}>
        <rect x="48" y="36" width="60" height="108" rx="11" fill="#FAFAF7" stroke="var(--accent)" strokeWidth="1.6" strokeOpacity="0.7"/>
        <rect x="56" y="48" width="44" height="74" rx="3" fill="var(--accent)" fillOpacity="0.08"/>
        <circle cx="78" cy="133" r="3.5" fill="none" stroke="var(--accent)" strokeOpacity="0.45" strokeWidth="1"/>
        <rect x="60" y="55" width="36" height="22" rx="2.5" fill="var(--accent)" fillOpacity="0.16" stroke="var(--accent)" strokeOpacity="0.5" strokeWidth="0.8"/>
        <circle cx="68" cy="66" r="4" fill="var(--accent)" fillOpacity="0.5"/>
        <rect x="76" y="62" width="16" height="2" rx="1" fill="var(--accent)" fillOpacity="0.45"/>
        <rect x="76" y="66" width="13" height="1.5" rx="0.75" fill="var(--accent)" fillOpacity="0.3"/>
        <rect x="76" y="70" width="10" height="1.5" rx="0.75" fill="var(--accent)" fillOpacity="0.3"/>
        <text x="78" y="92" textAnchor="middle" fontSize="6" fill="var(--accent)" fillOpacity="0.65" fontFamily="ui-monospace,monospace"
          style={{ animation: 'ft-bind-id 2.2s ease-in-out infinite' }}>
          DEVICE-7A2F
        </text>
        <rect x="60" y="100" width="36" height="14" rx="3" fill="var(--accent)" fillOpacity="0.20"/>
        <text x="78" y="109" textAnchor="middle" fontSize="6" fill="var(--accent)" fontFamily="ui-monospace,monospace">BOUND</text>
      </g>
      <path d="M114 90 L168 90" stroke="var(--accent)" strokeOpacity="0.55" strokeWidth="2" strokeDasharray="5 5" strokeLinecap="round"
        style={{ animation: 'ft-bind-chain 1.4s linear infinite' }}/>
      <g style={{ animation: 'ft-bind-lock 2.4s ease-in-out infinite', transformOrigin: '208px 90px' }}>
        <circle cx="208" cy="90" r="32" fill="var(--accent)" fillOpacity="0.10" stroke="var(--accent)" strokeOpacity="0.6" strokeWidth="1.5"/>
        <circle cx="208" cy="80" r="9" fill="var(--accent)" fillOpacity="0.5"/>
        <path d="M191 110 Q208 96 225 110" stroke="var(--accent)" strokeOpacity="0.55" strokeWidth="2.4" strokeLinecap="round" fill="none"/>
        <g transform="translate(220, 70)">
          <circle r="9" fill="#FAFAF7" stroke="var(--accent)" strokeWidth="1.4"/>
          <rect x="-3.5" y="-1.5" width="7" height="6.5" rx="1.5" fill="var(--accent)"/>
          <path d="M-2.6 -1.5 v -2 a 2.6 2.6 0 0 1 5.2 0 v 2" fill="none" stroke="var(--accent)" strokeWidth="1.3"/>
        </g>
      </g>
      <text x="140" y="166" textAnchor="middle" fill="var(--accent)" fillOpacity="0.55" fontSize="8" fontFamily="ui-monospace,monospace">
        1 student · 1 device · admin-only reset
      </text>
    </svg>
  );
}

function IlluAppAttestation() {
  return (
    <svg viewBox="0 0 280 180" fill="none" className="w-full h-full" aria-hidden>
      <style>{`
        @keyframes ft-shield-pulse { 0%,100%{opacity:0.15} 50%{opacity:0.30} }
        @keyframes ft-shield-glow  { 0%,100%{filter:drop-shadow(0 0 0 rgba(140,140,148,0))} 50%{filter:drop-shadow(0 4px 14px rgba(140,140,148,0.35))} }
        @keyframes ft-att-tag-1    { 0%,100%{opacity:0.55} 33%{opacity:1} 66%{opacity:0.55} }
        @keyframes ft-att-tag-2    { 0%,100%{opacity:0.55} 33%{opacity:0.55} 66%{opacity:1} }
        @keyframes ft-att-tag-3    { 0%,100%{opacity:1}    33%{opacity:0.55} 66%{opacity:0.55} }
      `}</style>
      <g style={{ animation: 'ft-shield-glow 3s ease-in-out infinite', transformOrigin: '140px 92px' }}>
        <path d="M140 32 L186 52 L186 103 Q186 138 140 154 Q94 138 94 103 L94 52 Z"
          fill="var(--accent)" fillOpacity="0.10" stroke="var(--accent)" strokeWidth="2"/>
        <path d="M140 40 L179 57 L179 102 Q179 132 140 146 Q101 132 101 102 L101 57 Z"
          fill="var(--accent)" style={{ animation: 'ft-shield-pulse 2.6s ease-in-out infinite' }} fillOpacity="0.15"/>
        <path d="M118 95 L134 112 L162 80" stroke="var(--accent)" strokeWidth="4.5"
          strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      </g>
      <g transform="translate(56, 144)" style={{ animation: 'ft-att-tag-1 3s ease-in-out infinite' }}>
        <rect width="56" height="14" rx="3.5" fill="var(--accent)" fillOpacity="0.10" stroke="var(--accent)" strokeOpacity="0.4" strokeWidth="0.8"/>
        <circle cx="8" cy="7" r="2.5" fill="var(--accent)"/>
        <text x="33" y="10" textAnchor="middle" fontSize="6.5" fill="var(--accent)" fontFamily="ui-monospace,monospace">Play Integrity</text>
      </g>
      <g transform="translate(118, 144)" style={{ animation: 'ft-att-tag-2 3s ease-in-out infinite' }}>
        <rect width="44" height="14" rx="3.5" fill="var(--accent)" fillOpacity="0.10" stroke="var(--accent)" strokeOpacity="0.4" strokeWidth="0.8"/>
        <circle cx="8" cy="7" r="2.5" fill="var(--accent)"/>
        <text x="27" y="10" textAnchor="middle" fontSize="6.5" fill="var(--accent)" fontFamily="ui-monospace,monospace">App Attest</text>
      </g>
      <g transform="translate(168, 144)" style={{ animation: 'ft-att-tag-3 3s ease-in-out infinite' }}>
        <rect width="56" height="14" rx="3.5" fill="var(--accent)" fillOpacity="0.10" stroke="var(--accent)" strokeOpacity="0.4" strokeWidth="0.8"/>
        <circle cx="8" cy="7" r="2.5" fill="var(--accent)"/>
        <text x="33" y="10" textAnchor="middle" fontSize="6.5" fill="var(--accent)" fontFamily="ui-monospace,monospace">DeviceCheck</text>
      </g>
    </svg>
  );
}

function IlluFraudDetection() {
  return (
    <svg viewBox="0 0 280 180" fill="none" className="w-full h-full" aria-hidden>
      <style>{`
        @keyframes ft-fr-pulse { 0%,100%{transform:scale(1);opacity:0.4} 50%{transform:scale(1.15);opacity:0.7} }
        @keyframes ft-fr-radar { from{transform:rotate(0)} to{transform:rotate(360deg)} }
        @keyframes ft-fr-blip  { 0%,90%{opacity:0} 95%{opacity:1} 100%{opacity:0} }
        @keyframes ft-fr-alert { 0%,100%{opacity:0.7;transform:scale(1)} 50%{opacity:1;transform:scale(1.04)} }
      `}</style>
      <g style={{ transformOrigin: '105px 86px' }}>
        <circle cx="105" cy="86" r="56" fill="var(--accent)" fillOpacity="0.05" stroke="var(--accent)" strokeOpacity="0.18" strokeWidth="1"/>
        <circle cx="105" cy="86" r="40" fill="none" stroke="var(--accent)" strokeOpacity="0.18" strokeWidth="1" strokeDasharray="2 3"/>
        <circle cx="105" cy="86" r="24" fill="none" stroke="var(--accent)" strokeOpacity="0.2" strokeWidth="1" strokeDasharray="2 3"/>
        <line x1="49" y1="86" x2="161" y2="86" stroke="var(--accent)" strokeOpacity="0.12" strokeWidth="1"/>
        <line x1="105" y1="30" x2="105" y2="142" stroke="var(--accent)" strokeOpacity="0.12" strokeWidth="1"/>
        <g style={{ transformOrigin: '105px 86px', animation: 'ft-fr-radar 4s linear infinite' }}>
          <defs>
            <linearGradient id="fr-sweep-u" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0"/>
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.55"/>
            </linearGradient>
          </defs>
          <path d="M105 86 L161 86 A56 56 0 0 0 145 47 Z" fill="url(#fr-sweep-u)"/>
          <line x1="105" y1="86" x2="161" y2="86" stroke="var(--accent)" strokeWidth="1.4"/>
        </g>
        <circle cx="78" cy="62" r="2.5" fill="#7C967A" style={{ animation: 'ft-fr-pulse 2.4s ease-in-out infinite' }}/>
        <circle cx="142" cy="76" r="2.5" fill="var(--accent)" style={{ animation: 'ft-fr-pulse 2.6s ease-in-out infinite 0.4s' }}/>
        <circle cx="88" cy="118" r="3" fill="rgba(239,68,68,0.9)" style={{ animation: 'ft-fr-blip 2.4s ease-in-out infinite' }}/>
      </g>
      <g transform="translate(176, 32)">
        <text x="0" y="0" fontSize="7" fill="var(--accent)" fillOpacity="0.6" fontFamily="ui-monospace,monospace">REVIEW QUEUE</text>
        {[
          { y: 12, label: 'spoofed GPS',      bad: true  },
          { y: 32, label: 'duplicate scan',   bad: true  },
          { y: 52, label: 'velocity > 90mph', bad: true  },
          { y: 72, label: 'cleared (manual)', bad: false },
        ].map((r, i) => (
          <g key={i} style={{ animation: `ft-fr-alert 2.4s ease-in-out infinite ${i * 0.3}s` }}>
            <rect x="0" y={r.y} width="92" height="14" rx="3"
              fill={r.bad ? 'rgba(239,68,68,0.08)' : 'rgba(124,150,122,0.10)'}
              stroke={r.bad ? 'rgba(239,68,68,0.4)' : 'rgba(124,150,122,0.5)'} strokeWidth="0.8"/>
            <circle cx="8" cy={r.y + 7} r="2.4" fill={r.bad ? '#EF4444' : '#7C967A'}/>
            <text x="16" y={r.y + 10} fontSize="6.5"
              fill={r.bad ? 'rgba(239,68,68,0.95)' : 'rgba(124,150,122,0.95)'}
              fontFamily="ui-monospace,monospace">{r.label}</text>
          </g>
        ))}
      </g>
    </svg>
  );
}

function IlluReports() {
  return (
    <svg viewBox="0 0 280 180" fill="none" className="w-full h-full" aria-hidden>
      <style>{`
        @keyframes ft-rp-line { from{stroke-dashoffset:280} to{stroke-dashoffset:0} }
        @keyframes ft-rp-bar  { from{transform:scaleY(0)} to{transform:scaleY(1)} }
        @keyframes ft-rp-tab  { 0%,100%{opacity:0.6} 50%{opacity:1} }
      `}</style>
      <g>
        <rect x="34" y="18" width="148" height="148" rx="8" fill="#FAFAF7" stroke="var(--accent)" strokeOpacity="0.35" strokeWidth="1.4"/>
        <path d="M156 18 L182 44 L156 44 Z" fill="var(--accent)" fillOpacity="0.18" stroke="var(--accent)" strokeOpacity="0.4" strokeWidth="1"/>
        <rect x="44" y="30" width="80" height="6" rx="2" fill="var(--accent)" fillOpacity="0.5"/>
        <rect x="44" y="40" width="54" height="3" rx="1.5" fill="var(--accent)" fillOpacity="0.25"/>
        <line x1="46" y1="128" x2="170" y2="128" stroke="var(--accent)" strokeOpacity="0.3" strokeWidth="1"/>
        {[
          { x: 52,  h: 46, c: 0.5  },
          { x: 76,  h: 70, c: 0.75 },
          { x: 100, h: 34, c: 0.4  },
          { x: 124, h: 62, c: 0.65 },
          { x: 148, h: 52, c: 0.55 },
        ].map((b, i) => (
          <g key={i}>
            <rect x={b.x} y={128 - b.h} width="14" height={b.h} rx="2"
              fill="var(--accent)" fillOpacity={b.c}
              style={{ transformOrigin: `${b.x + 7}px 128px`, animation: `ft-rp-bar 1s ease-out ${0.2 + i * 0.1}s both` }}/>
          </g>
        ))}
        <path d="M59 90 Q83 70 107 96 T155 78"
          stroke="var(--accent)" strokeWidth="1.7" fill="none" strokeLinecap="round"
          strokeDasharray="280" style={{ animation: 'ft-rp-line 2.2s ease-out 0.5s both' }}/>
        <rect x="44" y="142" width="60" height="3.5" rx="1.5" fill="var(--accent)" fillOpacity="0.18"/>
        <rect x="44" y="150" width="44" height="3.5" rx="1.5" fill="var(--accent)" fillOpacity="0.18"/>
        <rect x="44" y="158" width="80" height="3.5" rx="1.5" fill="var(--accent)" fillOpacity="0.18"/>
      </g>
      {[
        { dy: 50,  label: 'PDF'  },
        { dy: 82,  label: 'XLSX' },
        { dy: 114, label: 'CSV'  },
      ].map(({ dy, label }, i) => (
        <g key={label} transform={`translate(200, ${dy})`} style={{ animation: `ft-rp-tab 2.6s ease-in-out infinite ${i * 0.4}s` }}>
          <rect width="56" height="22" rx="5" fill="var(--accent)" fillOpacity="0.10" stroke="var(--accent)" strokeOpacity="0.5" strokeWidth="1"/>
          <text x="28" y="15" textAnchor="middle" fontSize="9" fill="var(--accent)" fontFamily="ui-monospace,monospace" fontWeight="600">{label}</text>
        </g>
      ))}
    </svg>
  );
}

function IlluAuditTrail() {
  return (
    <svg viewBox="0 0 280 180" fill="none" className="w-full h-full" aria-hidden>
      <style>{`
        @keyframes ft-audit-block { 0%,100%{opacity:0.9;transform:translateY(0)} 50%{opacity:1;transform:translateY(-2px)} }
        @keyframes ft-audit-link  { from{stroke-dashoffset:0} to{stroke-dashoffset:-14} }
      `}</style>
      {[
        { x: 12,  label: '#0F12', delay: '0s'    },
        { x: 80,  label: '#0F13', delay: '0.25s' },
        { x: 148, label: '#0F14', delay: '0.5s'  },
        { x: 216, label: '#0F15', delay: '0.75s' },
      ].map((b, i) => (
        <g key={i} style={{ animation: `ft-audit-block 2.6s ease-in-out infinite ${b.delay}`, transformOrigin: `${b.x + 26}px 90px` }}>
          <rect x={b.x} y="55" width="52" height="65" rx="7"
            fill="var(--accent)" fillOpacity={0.06 + i * 0.02}
            stroke="var(--accent)" strokeOpacity={0.7 - i * 0.08} strokeWidth="1.5"/>
          <text x={b.x + 26} y="71" textAnchor="middle" fontSize="8" fontFamily="ui-monospace,monospace" fontWeight="600"
            fill="var(--accent)" fillOpacity={0.85 - i * 0.07}>{b.label}</text>
          <rect x={b.x + 6} y="78" width="40" height="2.5" rx="1" fill="var(--accent)" fillOpacity="0.32"/>
          <rect x={b.x + 6} y="84" width="32" height="2"   rx="1" fill="var(--accent)" fillOpacity="0.20"/>
          <rect x={b.x + 6} y="89" width="36" height="2"   rx="1" fill="var(--accent)" fillOpacity="0.20"/>
          <rect x={b.x + 6} y="98" width="40" height="14"  rx="2" fill="var(--accent)" fillOpacity="0.10" stroke="var(--accent)" strokeOpacity="0.3" strokeWidth="0.6"/>
          <text x={b.x + 26} y="108" textAnchor="middle" fontSize="6" fill="var(--accent)" fillOpacity="0.7" fontFamily="ui-monospace,monospace">SHA-256</text>
        </g>
      ))}
      {[64, 132, 200].map((x, i) => (
        <line key={i} x1={x} y1="87" x2={x + 16} y2="87"
          stroke="var(--accent)" strokeOpacity="0.6" strokeWidth="2" strokeDasharray="4 3" strokeLinecap="round"
          style={{ animation: 'ft-audit-link 1.4s linear infinite' }}/>
      ))}
      <rect x="64" y="138" width="152" height="22" rx="5" fill="rgba(124,150,122,0.10)" stroke="rgba(124,150,122,0.5)" strokeWidth="1"/>
      <circle cx="80" cy="149" r="3.5" fill="#7C967A"/>
      <text x="140" y="153" textAnchor="middle" fontSize="9" fill="rgba(124,150,122,0.95)" fontFamily="ui-monospace,monospace">
        append-only · tamper-evident
      </text>
    </svg>
  );
}

/* ─── Feature data ───────────────────────────────────────────────────────── */
const FEATS: Array<{
  t: string; d: string; Illu: () => JSX.Element;
  tags: string[]; bullets: string[];
}> = [
  {
    t: 'Multi-tenant SaaS',
    d: 'Fully isolated workspaces per institution. No data bleeds between tenants — ever.',
    Illu: IlluMultiTenant,
    tags: ['Firestore rules', 'Per-tenant index', 'No data leak'],
    bullets: ['Row-level security via Firestore', 'Separate audit + reports per inst', 'Owner-scoped role hierarchy'],
  },
  {
    t: 'Dynamic signed QR',
    d: 'HMAC-signed tokens rotate every 7 s with a single-use nonce. Screenshots are useless.',
    Illu: IlluDynamicQR,
    tags: ['HMAC-SHA256', '7s TTL', 'single-use'],
    bullets: ['Tokens carry sid, nonce, exp, prev-hash', 'Rolling hash chain (tamper-evident)', 'Server-held signing key'],
  },
  {
    t: 'Geofencing',
    d: 'Server-side Haversine with accuracy thresholds blocks anyone outside the classroom.',
    Illu: IlluGeofence,
    tags: ['Haversine', '±50m radius', 'GPS-accuracy gated'],
    bullets: ['Per-class lat/lon + radius', 'Reject low-accuracy fixes (>50m)', 'Mock-location detection'],
  },
  {
    t: 'Device binding',
    d: 'Lock each student to their registered device. Only admins can rebind.',
    Illu: IlluDeviceBinding,
    tags: ['1:1 binding', 'Admin reset', 'Hardware ID'],
    bullets: ['One student ↔ one device fingerprint', 'Audit trail on every rebind', 'Stops scanning for absent friends'],
  },
  {
    t: 'App attestation',
    d: 'Play Integrity, DeviceCheck and App Attest verify the app is genuine and unmodified.',
    Illu: IlluAppAttestation,
    tags: ['Play Integrity', 'App Attest', 'DeviceCheck'],
    bullets: ['Verify build hasn\'t been tampered with', 'Reject rooted / jailbroken devices', 'Cryptographic device evidence'],
  },
  {
    t: 'Fraud detection',
    d: 'Weighted signals feed a suspicious-scan queue for human review.',
    Illu: IlluFraudDetection,
    tags: ['Heuristics', 'Review queue', 'Auto-flag'],
    bullets: ['Velocity > 90mph between scans', 'Duplicate scans on same nonce', 'Spoofed GPS signal patterns'],
  },
  {
    t: 'PDF / Excel reports',
    d: 'Branded async exports with signed download URLs. Ready in seconds.',
    Illu: IlluReports,
    tags: ['PDF', 'XLSX', 'CSV'],
    bullets: ['Per-class, per-month, per-student', 'Signed time-limited download URLs', 'Background queue, no UI blocking'],
  },
  {
    t: 'Audit trail',
    d: 'Append-only, hash-chained log. Any tampering breaks every subsequent record.',
    Illu: IlluAuditTrail,
    tags: ['Append-only', 'SHA-256', 'Tamper-evident'],
    bullets: ['Every action: who, what, when, hash', 'Hash-chain like a mini-blockchain', 'TTL-configurable retention'],
  },
];

/* ─── Full-screen overlay (click to expand) ─────────────────────────────── */
function FeatureOverlay({
  feat, index, onClose,
}: {
  feat: typeof FEATS[0]; index: number; onClose: () => void;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const el = overlayRef.current;
    const ct = contentRef.current;
    if (!el || !ct) return;
    gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'power2.out' });
    gsap.fromTo(ct,
      { opacity: 0, y: 40, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1, duration: 0.48, ease: 'power4.out', delay: 0.1 },
    );
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', esc);
    return () => {
      window.removeEventListener('keydown', esc);
      document.body.style.overflow = '';
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const close = useCallback(() => {
    const el = overlayRef.current;
    const ct = contentRef.current;
    if (!el || !ct) { onClose(); return; }
    gsap.to(ct, { opacity: 0, y: 30, scale: 0.97, duration: 0.3, ease: 'power3.in' });
    gsap.to(el, { opacity: 0, duration: 0.35, ease: 'power2.in', onComplete: onClose });
  }, [onClose]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8"
      style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) close(); }}
    >
      <div
        ref={contentRef}
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[2rem] border border-white/12"
        style={{ background: 'rgba(8,8,10,0.98)', boxShadow: '0 40px 120px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.08)' }}
      >
        <button
          onClick={close}
          aria-label="Close"
          className="absolute top-5 right-5 z-10 w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.14)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
        <div className="h-[260px] md:h-[320px] flex items-center justify-center px-8 pt-8 pb-4 relative overflow-hidden">
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 60%, rgba(180,180,190,0.06) 0%, transparent 70%)' }} />
          <div className="w-full max-w-[360px]"><feat.Illu /></div>
        </div>
        <div className="px-8 md:px-12 pb-12 pt-6 border-t border-white/8">
          <div className="flex items-start justify-between mb-4 gap-4">
            <div>
              <span className="font-mono text-[10px] text-white/30 tracking-wider block mb-2">
                {String(index + 1).padStart(2, '0')} / {FEATS.length}
              </span>
              <h3 className="font-display text-[2rem] md:text-[2.6rem] leading-tight text-white">{feat.t}</h3>
            </div>
            <div className="flex flex-wrap gap-1.5 justify-end shrink-0 mt-2">
              {feat.tags.map((t) => (
                <span key={t} className="text-[9.5px] tracking-wider uppercase font-mono px-2.5 py-1 rounded-full bg-white/8 text-white/60 border border-white/12">{t}</span>
              ))}
            </div>
          </div>
          <p className="text-[15px] text-white/60 leading-relaxed max-w-2xl mb-8">{feat.d}</p>
          <ul className="space-y-3">
            {feat.bullets.map((b, bi) => (
              <li key={b} className="flex items-start gap-3">
                <span className="mt-1 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold"
                  style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.5)' }}>
                  {bi + 1}
                </span>
                <span className="text-[14px] text-white/70 leading-snug">{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}


/* ─── 3D spiral flythrough gallery ───────────────────────────────────────── */
/*
  Fixed-viewport 3D spiral (à la editorial showreel sites). The page does NOT
  scroll past the cards — the section pins and scrolling winds a spiral of
  warped cards through 3D space: the front card sits large + sharp near centre,
  the rest wind outward and recede, tilted toward the axis, softly blurred. A
  floating pill names the front card, a rotating "showreel" badge sits in the
  corner, a spiral / list toggle switches views, all over a faint grid.
  Wrap-around keeps the spiral full at both ends. Pinned ScrollTrigger (robust
  under Lenis) + gsap.ticker rAF; no React DOM churn in the hot path.
*/
const N_FEATS  = FEATS.length;
const SP_SPIN   = 0.74;   // radians between consecutive cards along the spiral
const SP_R0     = 40;     // radius of the focus seat
const SP_RGROW  = 168;    // radius growth per card away from focus
const SP_ZDEPTH = 178;    // how much each step recedes in Z
const SP_FRONTZ = 340;    // bring the focus card forward → it grows large (hero)
const SP_YFLAT  = 0.58;   // vertical squash of the spiral

const clampSp = (v: number, lo: number, hi: number) => (v < lo ? lo : v > hi ? hi : v);
const wrapRel = (r: number) => { while (r > N_FEATS / 2) r -= N_FEATS; while (r < -N_FEATS / 2) r += N_FEATS; return r; };

// Mixed portrait / landscape sizes, deterministic per card.
const CARD_DIMS = FEATS.map((_, i) => (i % 3 === 1 ? { w: 252, h: 340 } : { w: 360, h: 236 }));

export function Features() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pinRef     = useRef<HTMLDivElement>(null);
  const cardRefs   = useRef<Array<HTMLDivElement | null>>([]);
  const [mode, setMode] = useState<'spiral' | 'list'>('spiral');
  const modeRef = useRef(mode);
  modeRef.current = mode;
  const [focusIdx, setFocusIdx] = useState(0);
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const small  = window.matchMedia('(max-width: 900px)').matches;
    if (reduce || small) return;

    initGSAP();
    const section = sectionRef.current!;
    const pin = pinRef.current!;
    section.classList.add('sp-active');

    let targetF = 0, smoothF = 0, active = false, lastFocus = -1;

    const st = ScrollTrigger.create({
      trigger: pin, start: 'top top',
      end: () => '+=' + Math.round(window.innerHeight * (N_FEATS * 0.92)),
      pin, pinSpacing: true, scrub: true, invalidateOnRefresh: true,
      onUpdate: (s) => { targetF = s.progress * (N_FEATS - 1); },
      onToggle: (s) => { active = s.isActive; },
    });

    const update = (time: number) => {
      if (!active || modeRef.current !== 'spiral') return;
      smoothF += (targetF - smoothF) * 0.085;
      const phase = smoothF;
      const focus = clampSp(Math.round(phase), 0, N_FEATS - 1);
      if (focus !== lastFocus) { lastFocus = focus; setFocusIdx(focus); }

      for (let i = 0; i < N_FEATS; i++) {
        const card = cardRefs.current[i];
        if (!card) continue;
        const rel = wrapRel(i - phase);
        const a = Math.abs(rel);
        const ang = rel * SP_SPIN - Math.PI / 2;
        const rad = SP_R0 + a * SP_RGROW;
        const x = Math.cos(ang) * rad;
        const y = Math.sin(ang) * rad * SP_YFLAT;
        const z = SP_FRONTZ - a * SP_ZDEPTH;
        const idleY = Math.sin(time * 0.6 + i * 1.7) * 3;
        const idleX = Math.cos(time * 0.5 + i * 2.3) * 2.4;
        const rotY = clampSp(-x * 0.045, -32, 32) + idleY;
        const rotX = clampSp(y * 0.05, -22, 22) + idleX;
        const opacity = clampSp(1.16 - a * 0.15, 0, 1);
        const blur = clampSp((a - 0.7) * 1.5, 0, 6);
        card.style.transform =
          `translate(-50%,-50%) translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, ${z.toFixed(1)}px) ` +
          `rotateY(${rotY.toFixed(2)}deg) rotateX(${rotX.toFixed(2)}deg)`;
        card.style.opacity = opacity.toFixed(3);
        card.style.filter = blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : 'none';
        card.style.pointerEvents = a < 0.6 ? 'auto' : 'none';
      }
    };

    gsap.ticker.add(update);
    ScrollTrigger.refresh();
    return () => { gsap.ticker.remove(update); st.kill(); section.classList.remove('sp-active'); };
  }, []);

  const FocusIllu = FEATS[focusIdx].Illu;

  return (
    <>
      {expanded !== null && (
        <FeatureOverlay feat={FEATS[expanded]} index={expanded} onClose={() => setExpanded(null)} />
      )}

      <section id="features" ref={sectionRef} className={`sp-root${mode === 'list' ? ' is-list' : ''}`}>
        <div ref={pinRef} className="sp-pin">
          <div className="sp-scene">
            <div className="sp-grid" aria-hidden />

            {/* spiral / list toggle */}
            <div className="sp-toggle">
              <button type="button" className={mode === 'spiral' ? 'on' : ''} onClick={() => setMode('spiral')}>spiral</button>
              <span className="sp-dot" />
              <button type="button" className={mode === 'list' ? 'on' : ''} onClick={() => setMode('list')}>list</button>
            </div>

            {/* 3D world of warped cards */}
            <div className="sp-world">
              {FEATS.map((f, i) => (
                <div
                  key={f.t}
                  ref={(el) => { cardRefs.current[i] = el; }}
                  onClick={() => setExpanded(i)}
                  className="sp-card"
                  style={{ width: CARD_DIMS[i].w, height: CARD_DIMS[i].h }}
                >
                  <div className="sp-card-illu"><f.Illu /></div>
                  <span className="sp-card-tag">{f.tags[0]}</span>
                </div>
              ))}
            </div>

            {/* floating name pill */}
            <div className="sp-tip">
              <div className="sp-tip-thumb"><FocusIllu /></div>
              <span className="sp-tip-name">{FEATS[focusIdx].t}</span>
            </div>

            {/* rotating showreel badge */}
            <div className="sp-badge" aria-hidden>
              <svg viewBox="0 0 120 120" className="sp-badge-ring">
                <defs>
                  <path id="spBadgePath" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
                </defs>
                <text className="sp-badge-text">
                  <textPath href="#spBadgePath" startOffset="0">showreel · attendly · 2025 · showreel · attendly · 2025 · </textPath>
                </text>
              </svg>
              <span className="sp-badge-core" />
            </div>

            {/* list view */}
            <div className="sp-listview">
              {FEATS.map((f, i) => (
                <div key={f.t} className="sp-listrow" onClick={() => setExpanded(i)}>
                  <span className="sp-listrow-n">{String(i + 1).padStart(2, '0')}</span>
                  <div className="sp-listrow-main">
                    <h3>{f.t}</h3>
                    <p>{f.d}</p>
                  </div>
                  <span className="sp-listrow-tag">{f.tags[0]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* mobile / reduced-motion fallback */}
        <div className="sp-fallback container">
          <div className="sp-fallback-head">
            <span className="text-[10px] tracking-[0.28em] text-ink-mute uppercase">02 — Features</span>
            <h2 className="font-display text-[2rem] leading-tight mt-3 text-ink">Eight building blocks. One verdict.</h2>
          </div>
          {FEATS.map((f, i) => (
            <div key={f.t} onClick={() => setExpanded(i)} className="sp-fallback-card">
              <span className="sp-fallback-num">{String(i + 1).padStart(2, '0')}</span>
              <div className="min-w-0">
                <h3>{f.t}</h3>
                <p>{f.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
