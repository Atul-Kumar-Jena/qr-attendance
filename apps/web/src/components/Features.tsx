'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';

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
        <circle cx="105" cy="86" r="24" fill="none" stroke="var(--accent)" strokeOpacity="0.2"  strokeWidth="1" strokeDasharray="2 3"/>
        <line x1="49"  y1="86" x2="161" y2="86" stroke="var(--accent)" strokeOpacity="0.12" strokeWidth="1"/>
        <line x1="105" y1="30" x2="105" y2="142" stroke="var(--accent)" strokeOpacity="0.12" strokeWidth="1"/>
        <g style={{ transformOrigin: '105px 86px', animation: 'ft-fr-radar 4s linear infinite' }}>
          <defs>
            <linearGradient id="fr-sweep-g" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%"   stopColor="var(--accent)" stopOpacity="0"/>
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.55"/>
            </linearGradient>
          </defs>
          <path d="M105 86 L161 86 A56 56 0 0 0 145 47 Z" fill="url(#fr-sweep-g)"/>
          <line x1="105" y1="86" x2="161" y2="86" stroke="var(--accent)" strokeWidth="1.4"/>
        </g>
        <circle cx="78"  cy="62" r="2.5" fill="#7C967A" style={{ animation: 'ft-fr-pulse 2.4s ease-in-out infinite' }}/>
        <circle cx="142" cy="76" r="2.5" fill="var(--accent)" style={{ animation: 'ft-fr-pulse 2.6s ease-in-out infinite 0.4s' }}/>
        <circle cx="88"  cy="118" r="3" fill="rgba(239,68,68,0.9)" style={{ animation: 'ft-fr-blip 2.4s ease-in-out infinite' }}/>
      </g>
      <g transform="translate(176, 32)">
        <text x="0" y="0" fontSize="7" fill="var(--accent)" fillOpacity="0.6" fontFamily="ui-monospace,monospace">REVIEW QUEUE</text>
        {[
          { y: 12, label: 'spoofed GPS',     bad: true  },
          { y: 32, label: 'duplicate scan',  bad: true  },
          { y: 52, label: 'velocity > 90mph',bad: true  },
          { y: 72, label: 'cleared (manual)',bad: false },
        ].map((r, i) => (
          <g key={i} style={{ animation: `ft-fr-alert 2.4s ease-in-out infinite ${i * 0.3}s` }}>
            <rect x="0" y={r.y} width="92" height="14" rx="3"
              fill={r.bad ? 'rgba(239,68,68,0.08)' : 'rgba(124,150,122,0.10)'}
              stroke={r.bad ? 'rgba(239,68,68,0.4)' : 'rgba(124,150,122,0.5)'} strokeWidth="0.8"/>
            <circle cx="8" cy={r.y + 7} r="2.4" fill={r.bad ? '#EF4444' : '#7C967A'}/>
            <text x="16" y={r.y + 10} fontSize="6.5" fill={r.bad ? 'rgba(239,68,68,0.95)' : 'rgba(124,150,122,0.95)'}
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
        @keyframes ft-rp-line  { from{stroke-dashoffset:280} to{stroke-dashoffset:0} }
        @keyframes ft-rp-bar   { from{transform:scaleY(0)} to{transform:scaleY(1)} }
        @keyframes ft-rp-tab   { 0%,100%{opacity:0.6} 50%{opacity:1} }
      `}</style>
      <g>
        <rect x="34" y="18" width="148" height="148" rx="8" fill="#FAFAF7" stroke="var(--accent)" strokeOpacity="0.35" strokeWidth="1.4"/>
        <path d="M156 18 L182 44 L156 44 Z" fill="var(--accent)" fillOpacity="0.18" stroke="var(--accent)" strokeOpacity="0.4" strokeWidth="1"/>
        <rect x="44" y="30" width="80" height="6" rx="2" fill="var(--accent)" fillOpacity="0.5"/>
        <rect x="44" y="40" width="54" height="3" rx="1.5" fill="var(--accent)" fillOpacity="0.25"/>
        <line x1="46" y1="128" x2="170" y2="128" stroke="var(--accent)" strokeOpacity="0.3" strokeWidth="1"/>
        {[
          { x: 52,  h: 46, c: 0.5 },
          { x: 76,  h: 70, c: 0.75 },
          { x: 100, h: 34, c: 0.4 },
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
          strokeDasharray="280"
          style={{ animation: 'ft-rp-line 2.2s ease-out 0.5s both' }}/>
        <rect x="44" y="142" width="60" height="3.5" rx="1.5" fill="var(--accent)" fillOpacity="0.18"/>
        <rect x="44" y="150" width="44" height="3.5" rx="1.5" fill="var(--accent)" fillOpacity="0.18"/>
        <rect x="44" y="158" width="80" height="3.5" rx="1.5" fill="var(--accent)" fillOpacity="0.18"/>
      </g>
      <g transform="translate(200, 50)" style={{ animation: 'ft-rp-tab 2.6s ease-in-out infinite' }}>
        <rect width="56" height="22" rx="5" fill="var(--accent)" fillOpacity="0.10" stroke="var(--accent)" strokeOpacity="0.5" strokeWidth="1"/>
        <text x="28" y="15" textAnchor="middle" fontSize="9" fill="var(--accent)" fontFamily="ui-monospace,monospace" fontWeight="600">PDF</text>
      </g>
      <g transform="translate(200, 82)" style={{ animation: 'ft-rp-tab 2.6s ease-in-out infinite 0.4s' }}>
        <rect width="56" height="22" rx="5" fill="var(--accent)" fillOpacity="0.10" stroke="var(--accent)" strokeOpacity="0.5" strokeWidth="1"/>
        <text x="28" y="15" textAnchor="middle" fontSize="9" fill="var(--accent)" fontFamily="ui-monospace,monospace" fontWeight="600">XLSX</text>
      </g>
      <g transform="translate(200, 114)" style={{ animation: 'ft-rp-tab 2.6s ease-in-out infinite 0.8s' }}>
        <rect width="56" height="22" rx="5" fill="var(--accent)" fillOpacity="0.10" stroke="var(--accent)" strokeOpacity="0.5" strokeWidth="1"/>
        <text x="28" y="15" textAnchor="middle" fontSize="9" fill="var(--accent)" fontFamily="ui-monospace,monospace" fontWeight="600">CSV</text>
      </g>
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
        { x: 12,  label: '#0F12', delay: '0s'   },
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
      <rect x="64" y="138" width="152" height="22" rx="5"
        fill="rgba(124,150,122,0.10)" stroke="rgba(124,150,122,0.5)" strokeWidth="1"/>
      <circle cx="80" cy="149" r="3.5" fill="#7C967A"/>
      <text x="140" y="153" textAnchor="middle" fontSize="9" fill="rgba(124,150,122,0.95)" fontFamily="ui-monospace,monospace">
        append-only · tamper-evident
      </text>
    </svg>
  );
}

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

/* ─── Full-screen overlay ────────────────────────────────────────────────── */
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
          className="absolute top-5 right-5 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-200"
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
          <div className="w-full max-w-[360px]">
            <feat.Illu />
          </div>
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
                <span
                  className="mt-1 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold"
                  style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.5)' }}
                >
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

/* ─── 3D spiral constants (module-level, stable) ─────────────────────────── */
const Z_STEP    = 600;  // Z gap between cards (px)
const CARD_W    = 400;
const CARD_H    = 520;
const THETA_INC = 0.75; // radians per card
const R_BASE    = 160;  // starting radius
const R_INC     = 44;   // logarithmic radius growth per card

// Precomputed card positions — pure math, safe on SSR
const SPIRAL_POS = FEATS.map((_, i) => {
  const theta  = i * THETA_INC;
  const radius = R_BASE + i * R_INC;
  return {
    x: Math.cos(theta) * radius,
    y: Math.sin(theta) * radius,
    z: i * -Z_STEP,
  };
});

// CSS height of the scroll container (gives 1 Z_STEP of scroll per card)
const SPIRAL_H = `calc(100vh + ${FEATS.length * Z_STEP}px)`;

/* ─── Main component ─────────────────────────────────────────────────────── */
export function Features() {
  const sectionRef  = useRef<HTMLDivElement>(null);
  const spiralRef   = useRef<HTMLDivElement>(null); // tall scroll container
  const trackRef    = useRef<HTMLDivElement>(null); // preserve-3d track
  const cardRefs    = useRef<Array<HTMLDivElement | null>>([]);
  const dotRefs     = useRef<Array<HTMLDivElement | null>>([]);
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(max-width: 900px)').matches) return;

    const spiral = spiralRef.current;
    const track  = trackRef.current;
    if (!spiral || !track) return;

    const n = FEATS.length;

    // Update card styles based on current trackZ progress
    const updateCards = (progress: number) => {
      const trackZ  = progress * n * Z_STEP;

/* ─── 3D flythrough scene constants ──────────────────────────────────────── */
/* The camera (a #rig div) travels forward along +Z as you scroll. Cards sit at
   fixed world positions scattered across X/Y/Z. As the camera passes each card
   it grows sharp + large, flashes its label, then flies past and fades.       */

const PERSPECTIVE  = 900;   // must match CSS perspective on the viewport
const CARD_SPACING = 850;   // Z gap between consecutive cards
const FIRST_Z      = -700;  // world-Z of the first (nearest) card
const TOTAL_DEPTH  =        // how far the camera travels over the full scroll
  Math.abs(FIRST_Z) + FEATS.length * CARD_SPACING + 700;
const FOCUS_DIST   = 360;   // within this Z-distance a card is "in focus"
const MAX_BLUR     = 11;    // px of blur at the far plane
const BLUR_DIST    = 1500;  // distance at which blur reaches MAX_BLUR

/* Deterministic pseudo-random so server + client markup match (no hydration
   mismatch). Same seed → same value on every render. */
function rand(seed: number) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

type CardPos = {
  x: number; y: number; z: number;          // fixed world position
  w: number; h: number;                      // card size (varied)
  baseRotX: number; baseRotY: number;        // static tilt
  rotSpeedX: number; rotSpeedY: number;      // idle float speed
  rotPhaseX: number; rotPhaseY: number;      // idle float phase
};

// Precompute every card's scene placement — pure math, SSR-safe.
const SCENE: CardPos[] = FEATS.map((_, i) => {
  const portrait = rand(i * 3 + 5) > 0.5;
  return {
    x: (rand(i * 2 + 1) - 0.5) * 1500,
    y: (rand(i * 3 + 7) - 0.5) * 680,
    z: FIRST_Z - i * CARD_SPACING + (rand(i * 5 + 9) - 0.5) * 220,
    w: portrait ? 330 : 420,
    h: portrait ? 460 : 320,
    baseRotX: (rand(i * 17 + 2) - 0.5) * 16,
    baseRotY: (rand(i * 19 + 4) - 0.5) * 26,
    rotSpeedX: (rand(i * 5 + 2) - 0.5) * 0.45,
    rotSpeedY: (rand(i * 7 + 4) - 0.5) * 0.45,
    rotPhaseX: rand(i * 11 + 1) * Math.PI * 2,
    rotPhaseY: rand(i * 13 + 6) * Math.PI * 2,
  };
});

// Scroll container height: enough scroll distance to fly through every card.
const SCENE_H = `${FEATS.length * 95 + 110}vh`;

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

/* ─── Main component ─────────────────────────────────────────────────────── */
export function Features() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const sceneRef   = useRef<HTMLDivElement>(null);  // tall scroll container
  const rigRef     = useRef<HTMLDivElement>(null);  // the moving "camera rig"
  const labelRef   = useRef<HTMLDivElement>(null);  // project-name flash
  const cardRefs   = useRef<Array<HTMLDivElement | null>>([]);
  const focusRef   = useRef<boolean[]>(FEATS.map(() => false));
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(max-width: 900px)').matches) return;

    const scene = sceneRef.current;
    const rig   = rigRef.current;
    const label = labelRef.current;
    if (!scene || !rig || !label) return;

    let raf = 0;
    let smoothProg = 0;
    let labelTimer: ReturnType<typeof setTimeout> | null = null;
    let running = true;

    const loop = (ts: number) => {
      if (!running) return;
      raf = requestAnimationFrame(loop);
      const t = ts * 0.001; // seconds

      // ── Scroll → normalized progress for THIS section ──────────────────
      const rect  = scene.getBoundingClientRect();
      const total = scene.offsetHeight - window.innerHeight;
      const raw   = total > 0 ? clamp(-rect.top / total, 0, 1) : 0;
      // Inertial smoothing (layered on top of Lenis for extra silkiness)
      smoothProg += (raw - smoothProg) * 0.09;
      const progress = smoothProg;

      // ── Camera rig movement ────────────────────────────────────────────
      const cameraZ = progress * TOTAL_DEPTH;                 // forward travel
      const cameraX = Math.sin(progress * Math.PI * 4.5) * 190; // pan L/R
      const cameraY = Math.sin(progress * Math.PI * 3 + 1) * 70; // subtle up/down
      rig.style.transform =
        `translate3d(${-cameraX}px, ${-cameraY}px, ${cameraZ}px)`;

      // ── Per-card update ────────────────────────────────────────────────
      let focusIdx = -1;
      let focusMin = Infinity;

      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        const p = SCENE[i];
        const net      = p.z + cameraZ;        // <0 ahead, ~0 at camera, >0 passed
        const distance = Math.abs(net);

        // Blur grows with distance
        const blur = clamp((distance / BLUR_DIST) * MAX_BLUR, 0, MAX_BLUR);

        // Opacity: approaching cards fade slowly; passed cards vanish fast
        const fadeRange = net > 0 ? 520 : 2100;
        const opacity   = clamp(1 - distance / fadeRange, 0, 1);

        // Independent idle float
        const rx = p.baseRotX + Math.sin(t * p.rotSpeedX + p.rotPhaseX) * 8;
        const ry = p.baseRotY + Math.sin(t * p.rotSpeedY + p.rotPhaseY) * 10;

        el.style.opacity = String(opacity);
        el.style.filter  = blur > 0.15 ? `blur(${blur.toFixed(1)}px)` : 'none';
        el.style.transform =
          `translate(-50%, -50%) translate3d(${p.x}px, ${p.y}px, ${p.z}px) ` +
          `rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
        // Cards behind the camera shouldn't catch clicks
        el.style.pointerEvents = opacity > 0.25 && net < 250 ? 'auto' : 'none';

        if (distance < focusMin) { focusMin = distance; focusIdx = i; }
      });

      // ── Project-name label flash ───────────────────────────────────────
      cardRefs.current.forEach((_, i) => {
        const p = SCENE[i];
        const distance = Math.abs(p.z + cameraZ);
        const inFocus  = distance < FOCUS_DIST;
        if (inFocus && !focusRef.current[i]) {
          focusRef.current[i] = true;
          label.textContent = FEATS[i].t;
          label.style.opacity = '1';
          if (labelTimer) clearTimeout(labelTimer);
          labelTimer = setTimeout(() => { label.style.opacity = '0'; }, 650);
        } else if (!inFocus) {
          focusRef.current[i] = false;
        }
      });
    };

    raf = requestAnimationFrame(loop);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      if (labelTimer) clearTimeout(labelTimer);
    };
  }, []);

  return (
    <>
      {expanded !== null && (
        <FeatureOverlay feat={FEATS[expanded]} index={expanded} onClose={() => setExpanded(null)} />
      )}

      <section id="features" ref={sectionRef}>
        {/* ── Heading ──────────────────────────────────────────────────────── */}
        <div className="feat-head container pt-24 pb-6 md:pt-32 md:pb-8">
          <span className="inline-block text-[10px] tracking-[0.28em] text-ink-mute uppercase mb-4 px-3 py-1 rounded-full border border-ink/10 dark:border-white/10">
            02 — Features
          </span>
          <h2 className="font-display text-[2.4rem] lg:text-[4rem] leading-[1.02] tracking-tightish max-w-3xl">
            Eight building blocks. <em className="not-italic text-accent">One verdict.</em>
          </h2>
          <p className="mt-4 text-[14px] text-ink-mute max-w-lg leading-relaxed hidden md:block">
            Scroll to fly through the gallery · click any card to read more
          </p>
        </div>

        {/* ── Desktop: 3D cinematic flythrough ─────────────────────────────── */}
        {/*
            scene  — tall scroll container (gives scroll distance)
            sticky — 100vh viewport, the fixed "camera lens" (perspective here)
            rig    — preserve-3d; rAF moves this in Z (forward) + X/Y (pan)
            cards  — fixed world positions; rAF sets rotation/blur/opacity
            No GSAP/React DOM mutation → no insertBefore crashes.
        */}
        <div ref={sceneRef} className="hidden md:block" style={{ height: SCENE_H }}>
          <div
            className="sticky top-0 h-screen overflow-hidden"
            style={{ perspective: `${PERSPECTIVE}px`, perspectiveOrigin: '50% 50%' }}
          >
            <div
              ref={rigRef}
              className="absolute inset-0"
              style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
            >
              {FEATS.map((f, i) => (
                <div
                  key={f.t}
                  ref={el => { cardRefs.current[i] = el; }}
                  onClick={() => setExpanded(i)}
                  className="feat-card absolute rounded-[28px] overflow-hidden cursor-pointer"
                  style={{
                    width: SCENE[i].w,
                    height: SCENE[i].h,
                    top: '50%',
                    left: '50%',
                    background: 'rgba(10,10,12,0.97)',
                    border: '1px solid rgba(255,255,255,0.10)',
                    boxShadow: '0 40px 100px -20px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.08)',
                    transformStyle: 'preserve-3d',
                    backfaceVisibility: 'hidden',
                    willChange: 'transform, filter, opacity',
                    opacity: 0,
                    transform: `translate(-50%, -50%) translate3d(${SCENE[i].x}px, ${SCENE[i].y}px, ${SCENE[i].z}px)`,
                  }}
                >
                  {/* Ghost number */}
                  <div className="absolute top-4 left-6 font-display font-extrabold select-none pointer-events-none"
                    style={{ fontSize: '4.6rem', lineHeight: 1, color: 'rgba(255,255,255,0.05)', letterSpacing: '-0.06em' }}>
                    {String(i + 1).padStart(2, '0')}
                  </div>

                  {/* Tag */}
                  <div className="absolute top-6 right-6 z-10">
                    <span style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.09)' }}
                      className="text-[9px] tracking-[0.18em] uppercase font-mono px-2.5 py-1 rounded-full">
                      {f.tags[0]}
                    </span>
                  </div>

                  {/* Illustration */}
                  <div className="absolute inset-0 flex items-center justify-center px-8 pt-12 pb-36 overflow-hidden">
                    <div className="w-full opacity-85">
                      <f.Illu />
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="absolute bottom-0 left-0 right-0 px-7 pb-7 pt-12"
                    style={{ background: 'linear-gradient(to top, rgba(8,8,10,1) 55%, transparent)' }}>
                    <h3 className="font-display text-[1.4rem] leading-tight text-white font-bold tracking-tight">{f.t}</h3>
                    <p className="mt-1.5 text-[12px] leading-relaxed line-clamp-2" style={{ color: 'rgba(255,255,255,0.42)' }}>{f.d}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="font-mono text-[9px] tracking-[0.22em] uppercase" style={{ color: 'rgba(255,255,255,0.18)' }}>
                        {String(i + 1).padStart(2, '0')} / {FEATS.length}
                      </span>
                      <div className="flex items-center gap-1.5" style={{ color: 'rgba(255,255,255,0.35)', fontSize: '10px' }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                          <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
                        </svg>
                        <span className="font-mono tracking-widest uppercase text-[9px]">Expand</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Project-name flash — bottom center */}
            <div
              ref={labelRef}
              className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 pointer-events-none select-none font-mono text-white"
              style={{
                fontSize: '13px', letterSpacing: '0.28em', textTransform: 'uppercase',
                opacity: 0, transition: 'opacity 0.35s ease',
                textShadow: '0 2px 20px rgba(0,0,0,0.8)',
              }}
            />

            {/* Hint */}
            <p className="absolute bottom-7 right-8 text-[10px] font-mono text-white/20 tracking-widest pointer-events-none select-none z-20">
              ↓ scroll to fly through
            </p>

            {/* Depth vignette */}
            <div aria-hidden className="absolute inset-0 pointer-events-none z-[1]"
              style={{ background: 'radial-gradient(ellipse 75% 65% at 50% 50%, transparent 38%, rgba(0,0,0,0.72) 100%)' }} />
          </div>
        </div>

        {/* ── Mobile: vertical list ────────────────────────────────────────── */}
        <div className="container space-y-2.5 md:hidden pb-10">
          {FEATS.map((f, i) => (
            <div
              key={f.t}
              onClick={() => setExpanded(i)}
              className="relative rounded-[20px] overflow-hidden cursor-pointer active:scale-[0.99] transition-transform duration-100 flex items-center gap-4 px-5 py-4"
              style={{
                background: 'rgba(10,10,12,0.94)',
                border: '1px solid rgba(255,255,255,0.07)',
                boxShadow: '0 2px 16px rgba(0,0,0,0.35)',
              }}
            >
              <span className="font-display font-extrabold shrink-0"
                style={{ fontSize: '2.4rem', lineHeight: 1, color: 'rgba(255,255,255,0.06)', letterSpacing: '-0.06em', width: '2.5rem' }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-[1.05rem] leading-tight text-white font-bold">{f.t}</h3>
                <p className="mt-0.5 text-[11px] leading-relaxed line-clamp-2" style={{ color: 'rgba(255,255,255,0.35)' }}>{f.d}</p>
              </div>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="2.2" strokeLinecap="round" className="shrink-0">
                <path d="M7 17L17 7M17 7H7M17 7v10"/>
              </svg>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
