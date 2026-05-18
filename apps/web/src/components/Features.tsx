'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initGSAP } from '@/lib/gsap-init';

if (typeof window !== 'undefined') initGSAP();

/* ─── Per-feature illustrations ─────────────────────────────────────────── */

function IlluMultiTenant() {
  return (
    <svg viewBox="0 0 280 180" fill="none" className="w-full h-full" aria-hidden>
      <style>{`
        @keyframes ft-float0 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
        @keyframes ft-float1 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
        @keyframes ft-float2 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
        @keyframes ft-shield-pulse { 0%,100%{opacity:0.15} 50%{opacity:0.35} }
      `}</style>
      {/* Isolation shield */}
      <ellipse cx="140" cy="155" rx="110" ry="12" fill="rgba(255,107,61,0.07)" style={{animation:'ft-shield-pulse 3s ease-in-out infinite'}} />
      {/* Building 1 */}
      <g style={{animation:'ft-float0 4s ease-in-out infinite', transformOrigin:'70px 130px'}}>
        <rect x="40" y="70" width="60" height="80" rx="6" fill="rgba(255,107,61,0.12)" stroke="rgba(255,107,61,0.5)" strokeWidth="1.5"/>
        <rect x="52" y="85" width="12" height="12" rx="2" fill="rgba(255,107,61,0.4)"/>
        <rect x="70" y="85" width="12" height="12" rx="2" fill="rgba(255,107,61,0.2)"/>
        <rect x="52" y="103" width="12" height="12" rx="2" fill="rgba(255,107,61,0.2)"/>
        <rect x="70" y="103" width="12" height="12" rx="2" fill="rgba(255,107,61,0.4)"/>
        <rect x="57" y="125" width="16" height="25" rx="2" fill="rgba(255,107,61,0.3)"/>
        <text x="70" y="65" textAnchor="middle" fill="rgba(255,107,61,0.7)" fontSize="9" fontFamily="monospace">Inst A</text>
      </g>
      {/* Building 2 — center/tallest */}
      <g style={{animation:'ft-float1 4.4s ease-in-out infinite 0.6s', transformOrigin:'140px 120px'}}>
        <rect x="107" y="50" width="66" height="100" rx="6" fill="rgba(255,107,61,0.18)" stroke="rgba(255,107,61,0.7)" strokeWidth="1.5"/>
        <rect x="120" y="65" width="12" height="12" rx="2" fill="rgba(255,107,61,0.6)"/>
        <rect x="138" y="65" width="12" height="12" rx="2" fill="rgba(255,107,61,0.3)"/>
        <rect x="120" y="83" width="12" height="12" rx="2" fill="rgba(255,107,61,0.3)"/>
        <rect x="138" y="83" width="12" height="12" rx="2" fill="rgba(255,107,61,0.6)"/>
        <rect x="120" y="101" width="12" height="12" rx="2" fill="rgba(255,107,61,0.4)"/>
        <rect x="138" y="101" width="12" height="12" rx="2" fill="rgba(255,107,61,0.2)"/>
        <rect x="128" y="122" width="24" height="28" rx="2" fill="rgba(255,107,61,0.4)"/>
        <text x="140" y="44" textAnchor="middle" fill="rgba(255,107,61,0.9)" fontSize="9" fontFamily="monospace">Inst B</text>
      </g>
      {/* Building 3 */}
      <g style={{animation:'ft-float2 3.8s ease-in-out infinite 1.1s', transformOrigin:'210px 130px'}}>
        <rect x="180" y="75" width="60" height="75" rx="6" fill="rgba(255,107,61,0.12)" stroke="rgba(255,107,61,0.5)" strokeWidth="1.5"/>
        <rect x="192" y="90" width="12" height="12" rx="2" fill="rgba(255,107,61,0.2)"/>
        <rect x="210" y="90" width="12" height="12" rx="2" fill="rgba(255,107,61,0.4)"/>
        <rect x="192" y="108" width="12" height="12" rx="2" fill="rgba(255,107,61,0.4)"/>
        <rect x="210" y="108" width="12" height="12" rx="2" fill="rgba(255,107,61,0.2)"/>
        <rect x="198" y="126" width="16" height="24" rx="2" fill="rgba(255,107,61,0.3)"/>
        <text x="210" y="70" textAnchor="middle" fill="rgba(255,107,61,0.7)" fontSize="9" fontFamily="monospace">Inst C</text>
      </g>
      {/* Isolation barriers */}
      <line x1="105" y1="40" x2="105" y2="155" stroke="rgba(255,107,61,0.2)" strokeWidth="1" strokeDasharray="3 4"/>
      <line x1="175" y1="40" x2="175" y2="155" stroke="rgba(255,107,61,0.2)" strokeWidth="1" strokeDasharray="3 4"/>
    </svg>
  );
}

function IlluDynamicQR() {
  return (
    <svg viewBox="0 0 280 180" fill="none" className="w-full h-full" aria-hidden>
      <style>{`
        @keyframes ft-qr-flip { 0%,100%{transform:rotateY(0)} 50%{transform:rotateY(180deg)} }
        @keyframes ft-qr-beam { 0%,100%{y:20} 50%{y:155} }
        @keyframes ft-qr-orbit { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes ft-qr-timer { 0%{stroke-dashoffset:0} 100%{stroke-dashoffset:125.6} }
      `}</style>
      {/* Timer ring */}
      <circle cx="140" cy="95" r="75" fill="none" stroke="rgba(255,107,61,0.08)" strokeWidth="1.5" strokeDasharray="2 5"/>
      <circle cx="140" cy="95" r="70" fill="none" stroke="rgba(255,107,61,0.5)" strokeWidth="1.5"
        strokeDasharray="125.6" strokeLinecap="round"
        transform="rotate(-90 140 95)"
        style={{animation:'ft-qr-timer 7s linear infinite'}}/>
      {/* Orbiting dot */}
      <circle r="3.5" fill="#FF6B3D" style={{animation:'ft-qr-orbit 7s linear infinite', transformOrigin:'140px 95px', transform:'translateX(70px)'}}>
        <animateMotion dur="7s" repeatCount="indefinite">
          <mpath href="#orbit-path"/>
        </animateMotion>
      </circle>
      <path id="orbit-path" d="M140,25 A70,70 0 1,1 139.99,25" fill="none"/>
      {/* QR grid cells — deterministic pattern (no Math.random during render
          or hydration mismatches cascade into GSAP ScrollTrigger crashes) */}
      {Array.from({length:9}, (_,row) => Array.from({length:9}, (_,col) => {
        const isFnd = (row<3&&col<3)||(row<3&&col>=6)||(row>=6&&col<3);
        // Seeded pseudo-random from indices; same value SSR and CSR
        const seed = Math.sin(row * 12.9898 + col * 78.233) * 43758.5453;
        const on = isFnd || (seed - Math.floor(seed)) > 0.45;
        const x = 95 + col*10;
        const y = 50 + row*10;
        return on ? (
          <rect key={`${row}-${col}`} x={x} y={y} width="8" height="8" rx="1.5"
            fill={isFnd ? '#FF6B3D' : 'rgba(240,237,230,0.9)'}
            opacity={isFnd ? 0.9 : 0.7}/>
        ) : null;
      }))}
      {/* Scan beam */}
      <rect x="95" y="20" width="90" height="2" rx="1"
        fill="rgba(255,107,61,0.7)"
        style={{
          filter:'drop-shadow(0 0 4px rgba(255,107,61,0.6))',
          animation:'ft-qr-beam 2.5s ease-in-out infinite'
        }}
      />
      {/* Token label */}
      <text x="140" y="168" textAnchor="middle" fill="rgba(255,107,61,0.6)" fontSize="8" fontFamily="monospace">
        HMAC·SHA256 · 7s TTL · single-use nonce
      </text>
    </svg>
  );
}

function IlluGeofence() {
  return (
    <svg viewBox="0 0 280 180" fill="none" className="w-full h-full" aria-hidden>
      <style>{`
        @keyframes ft-ring1 { 0%,100%{r:35;opacity:0.5} 50%{r:45;opacity:0.15} }
        @keyframes ft-ring2 { 0%,100%{r:55;opacity:0.4} 50%{r:68;opacity:0.1} }
        @keyframes ft-pin-bounce { 0%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} 60%{transform:translateY(-3px)} }
        @keyframes ft-allowed { 0%,100%{opacity:0.6} 50%{opacity:1} }
        @keyframes ft-denied { 0%,100%{opacity:0.3} 50%{opacity:0.8} }
      `}</style>
      {/* Haversine rings */}
      <circle cx="140" cy="90" r="35" fill="rgba(255,107,61,0.06)" stroke="rgba(255,107,61,0.4)" strokeWidth="1"
        style={{animation:'ft-ring1 3s ease-in-out infinite'}}/>
      <circle cx="140" cy="90" r="55" fill="none" stroke="rgba(255,107,61,0.25)" strokeWidth="1" strokeDasharray="4 3"
        style={{animation:'ft-ring2 3.5s ease-in-out infinite 0.5s'}}/>
      <circle cx="140" cy="90" r="72" fill="none" stroke="rgba(255,107,61,0.1)" strokeWidth="0.8" strokeDasharray="2 6"/>
      {/* Center pin */}
      <g style={{animation:'ft-pin-bounce 2.5s ease-in-out infinite', transformOrigin:'140px 90px'}}>
        <circle cx="140" cy="90" r="8" fill="rgba(255,107,61,0.9)" />
        <circle cx="140" cy="90" r="3" fill="white"/>
        <line x1="140" y1="98" x2="140" y2="108" stroke="rgba(255,107,61,0.6)" strokeWidth="2" strokeLinecap="round"/>
      </g>
      {/* Allowed device — inside fence */}
      <g style={{animation:'ft-allowed 2s ease-in-out infinite'}}>
        <circle cx="115" cy="68" r="9" fill="rgba(34,197,94,0.15)" stroke="rgba(34,197,94,0.6)" strokeWidth="1.2"/>
        <text x="115" y="72" textAnchor="middle" fontSize="9" fill="rgba(34,197,94,0.9)">✓</text>
      </g>
      {/* Denied device — outside fence */}
      <g style={{animation:'ft-denied 2s ease-in-out infinite 0.8s'}}>
        <circle cx="202" cy="55" r="9" fill="rgba(239,68,68,0.15)" stroke="rgba(239,68,68,0.6)" strokeWidth="1.2"/>
        <text x="202" y="59" textAnchor="middle" fontSize="9" fill="rgba(239,68,68,0.9)">✕</text>
      </g>
      {/* Labels */}
      <text x="140" y="172" textAnchor="middle" fill="rgba(255,107,61,0.5)" fontSize="8" fontFamily="monospace">
        Server-side Haversine · accuracy threshold
      </text>
    </svg>
  );
}

function IlluDeviceBinding() {
  return (
    <svg viewBox="0 0 280 180" fill="none" className="w-full h-full" aria-hidden>
      <style>{`
        @keyframes ft-chain { 0%,100%{stroke-dashoffset:0} 50%{stroke-dashoffset:12} }
        @keyframes ft-lock-glow { 0%,100%{filter:drop-shadow(0 0 2px rgba(255,107,61,0.3))} 50%{filter:drop-shadow(0 0 8px rgba(255,107,61,0.7))} }
        @keyframes ft-phone-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
      `}</style>
      {/* Phone */}
      <g style={{animation:'ft-phone-float 3s ease-in-out infinite', transformOrigin:'100px 95px'}}>
        <rect x="72" y="40" width="56" height="95" rx="10" fill="rgba(255,107,61,0.12)" stroke="rgba(255,107,61,0.6)" strokeWidth="1.5"/>
        <rect x="80" y="52" width="40" height="55" rx="4" fill="rgba(255,107,61,0.08)"/>
        <circle cx="100" cy="121" r="5" fill="rgba(255,107,61,0.3)" stroke="rgba(255,107,61,0.5)" strokeWidth="1"/>
        {/* Screen content */}
        <rect x="84" y="58" width="28" height="3" rx="1" fill="rgba(255,107,61,0.4)"/>
        <rect x="84" y="65" width="20" height="2" rx="1" fill="rgba(255,107,61,0.2)"/>
        <rect x="84" y="71" width="24" height="2" rx="1" fill="rgba(255,107,61,0.2)"/>
        <text x="100" y="88" textAnchor="middle" fontSize="16" fill="rgba(255,107,61,0.6)">🔒</text>
      </g>
      {/* Chain */}
      <path d="M128 95 Q155 95 165 95" stroke="rgba(255,107,61,0.5)" strokeWidth="2" strokeDasharray="6 4"
        style={{animation:'ft-chain 2s linear infinite'}}/>
      {/* Lock/bind badge */}
      <g style={{animation:'ft-lock-glow 2s ease-in-out infinite', transformOrigin:'195px 90px'}}>
        <rect x="168" y="65" width="54" height="50" rx="8" fill="rgba(255,107,61,0.15)" stroke="rgba(255,107,61,0.7)" strokeWidth="1.5"/>
        <rect x="182" y="60" width="26" height="22" rx="6" fill="none" stroke="rgba(255,107,61,0.6)" strokeWidth="2"/>
        <rect x="186" y="72" width="18" height="16" rx="3" fill="rgba(255,107,61,0.5)"/>
        <circle cx="195" cy="80" r="3" fill="white"/>
        <line x1="195" y1="80" x2="195" y2="85" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      </g>
      <text x="140" y="172" textAnchor="middle" fill="rgba(255,107,61,0.5)" fontSize="8" fontFamily="monospace">
        1 device per student · admin-only reset
      </text>
    </svg>
  );
}

function IlluAppAttestation() {
  return (
    <svg viewBox="0 0 280 180" fill="none" className="w-full h-full" aria-hidden>
      <style>{`
        @keyframes ft-shield-draw { from{stroke-dashoffset:300} to{stroke-dashoffset:0} }
        @keyframes ft-check-draw { from{stroke-dashoffset:60} to{stroke-dashoffset:0} }
        @keyframes ft-shield-bg { 0%,100%{opacity:0.12} 50%{opacity:0.25} }
      `}</style>
      {/* Shield body */}
      <path d="M140 20 L190 42 L190 105 Q190 145 140 162 Q90 145 90 105 L90 42 Z"
        fill="rgba(255,107,61,0.12)" stroke="rgba(255,107,61,0.8)" strokeWidth="2.5"
        strokeDasharray="300"
        style={{animation:'ft-shield-draw 1.5s ease-out forwards', strokeDashoffset:300}}/>
      {/* Shield inner fill pulse */}
      <path d="M140 28 L183 48 L183 103 Q183 137 140 152 Q97 137 97 103 L97 48 Z"
        fill="rgba(255,107,61,0.08)" style={{animation:'ft-shield-bg 2.5s ease-in-out infinite'}}/>
      {/* Checkmark */}
      <polyline points="116,95 132,115 164,78" stroke="#FF6B3D" strokeWidth="5"
        strokeLinecap="round" strokeLinejoin="round" fill="none"
        strokeDasharray="60"
        style={{animation:'ft-check-draw 0.8s ease-out forwards 1.2s', strokeDashoffset:60}}/>
      {/* Attestation labels */}
      <rect x="90" y="16" width="36" height="10" rx="2" fill="rgba(255,107,61,0.1)" stroke="rgba(255,107,61,0.3)" strokeWidth="0.8"/>
      <text x="108" y="23" textAnchor="middle" fontSize="6" fill="rgba(255,107,61,0.7)" fontFamily="monospace">Play Integrity</text>
      <rect x="154" y="16" width="36" height="10" rx="2" fill="rgba(255,107,61,0.1)" stroke="rgba(255,107,61,0.3)" strokeWidth="0.8"/>
      <text x="172" y="23" textAnchor="middle" fontSize="6" fill="rgba(255,107,61,0.7)" fontFamily="monospace">DeviceCheck</text>
      <text x="140" y="172" textAnchor="middle" fill="rgba(255,107,61,0.5)" fontSize="8" fontFamily="monospace">
        Play Integrity · App Attest · DeviceCheck
      </text>
    </svg>
  );
}

function IlluFraudDetection() {
  return (
    <svg viewBox="0 0 280 180" fill="none" className="w-full h-full" aria-hidden>
      <style>{`
        @keyframes ft-scan { 0%,100%{transform:translateX(-20px) scaleX(0.6) opacity(0.3)} 50%{transform:translateX(0) scaleX(1) opacity(1)} }
        @keyframes ft-eye-blink { 0%,100%{transform:scaleY(1)} 45%,50%{transform:scaleY(0.05)} }
        @keyframes ft-signal { 0%,100%{opacity:0.2;transform:scale(0.9)} 50%{opacity:1;transform:scale(1)} }
        @keyframes ft-alert-flash { 0%,100%{opacity:0.5} 50%{opacity:1} }
      `}</style>
      {/* Eye outline */}
      <ellipse cx="140" cy="85" rx="65" ry="38" fill="rgba(255,107,61,0.05)" stroke="rgba(255,107,61,0.4)" strokeWidth="1.5"
        style={{animation:'ft-eye-blink 4s ease-in-out infinite'}}/>
      {/* Iris */}
      <circle cx="140" cy="85" r="22" fill="rgba(255,107,61,0.12)" stroke="rgba(255,107,61,0.6)" strokeWidth="1.5"/>
      <circle cx="140" cy="85" r="10" fill="rgba(255,107,61,0.25)"/>
      <circle cx="140" cy="85" r="4" fill="rgba(255,107,61,0.8)"/>
      {/* Scan lines */}
      <line x1="76" y1="85" x2="215" y2="85" stroke="rgba(255,107,61,0.15)" strokeWidth="1" strokeDasharray="3 5"/>
      <line x1="140" y1="48" x2="140" y2="122" stroke="rgba(255,107,61,0.15)" strokeWidth="1" strokeDasharray="3 5"/>
      {/* Signal indicators */}
      {[{x:68,y:50,ok:true},{x:70,y:115,ok:false},{x:195,y:50,ok:true},{x:200,y:118,ok:false}].map((s,i)=>(
        <g key={i} style={{animation:`ft-signal 2s ease-in-out infinite ${i*0.4}s`}}>
          <circle cx={s.x} cy={s.y} r="8" fill={s.ok?'rgba(34,197,94,0.15)':'rgba(239,68,68,0.15)'}
            stroke={s.ok?'rgba(34,197,94,0.5)':'rgba(239,68,68,0.5)'} strokeWidth="1.2"/>
          <text x={s.x} y={s.y+3.5} textAnchor="middle" fontSize="8"
            fill={s.ok?'rgba(34,197,94,0.9)':'rgba(239,68,68,0.9)'}>{s.ok?'✓':'!'}</text>
        </g>
      ))}
      {/* Alert badge */}
      <rect x="104" y="140" width="72" height="18" rx="4" fill="rgba(239,68,68,0.1)" stroke="rgba(239,68,68,0.4)" strokeWidth="1"
        style={{animation:'ft-alert-flash 1.5s ease-in-out infinite'}}/>
      <text x="140" y="152" textAnchor="middle" fontSize="8" fill="rgba(239,68,68,0.8)" fontFamily="monospace">SUSPICIOUS · review queue</text>
      <text x="140" y="172" textAnchor="middle" fill="rgba(255,107,61,0.5)" fontSize="8" fontFamily="monospace">
        Weighted signals · admin review
      </text>
    </svg>
  );
}

function IlluReports() {
  return (
    <svg viewBox="0 0 280 180" fill="none" className="w-full h-full" aria-hidden>
      <style>{`
        @keyframes ft-bar1 { from{height:0;y:150} to{height:60;y:90} }
        @keyframes ft-bar2 { from{height:0;y:150} to{height:80;y:70} }
        @keyframes ft-bar3 { from{height:0;y:150} to{height:45;y:105} }
        @keyframes ft-bar4 { from{height:0;y:150} to{height:70;y:80} }
        @keyframes ft-doc-slide { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
      {/* Document outline */}
      <rect x="55" y="18" width="130" height="155" rx="8" fill="rgba(255,107,61,0.06)" stroke="rgba(255,107,61,0.3)" strokeWidth="1.5"/>
      {/* Fold corner */}
      <path d="M155 18 L185 48 L155 48 Z" fill="rgba(255,107,61,0.15)" stroke="rgba(255,107,61,0.3)" strokeWidth="1"/>
      {/* Title line */}
      <rect x="68" y="30" width="72" height="5" rx="2" fill="rgba(255,107,61,0.5)" style={{animation:'ft-doc-slide 0.8s ease-out forwards'}}/>
      {/* Bar chart */}
      <line x1="78" y1="150" x2="175" y2="150" stroke="rgba(255,107,61,0.2)" strokeWidth="1"/>
      <rect x="84" y="90" width="16" height="60" rx="2" fill="rgba(255,107,61,0.5)"
        style={{animation:'ft-bar1 1s ease-out forwards 0.3s', height:0, y:150}}/>
      <rect x="108" y="70" width="16" height="80" rx="2" fill="rgba(255,107,61,0.7)"
        style={{animation:'ft-bar2 1s ease-out forwards 0.5s', height:0, y:150}}/>
      <rect x="132" y="105" width="16" height="45" rx="2" fill="rgba(255,107,61,0.4)"
        style={{animation:'ft-bar3 1s ease-out forwards 0.7s', height:0, y:150}}/>
      <rect x="156" y="80" width="16" height="70" rx="2" fill="rgba(255,107,61,0.6)"
        style={{animation:'ft-bar4 1s ease-out forwards 0.9s', height:0, y:150}}/>
      {/* Percentage labels */}
      <text x="92" y="87" textAnchor="middle" fontSize="7" fill="rgba(255,107,61,0.7)" fontFamily="monospace">87%</text>
      <text x="116" y="67" textAnchor="middle" fontSize="7" fill="rgba(255,107,61,0.9)" fontFamily="monospace">94%</text>
      <text x="140" y="102" textAnchor="middle" fontSize="7" fill="rgba(255,107,61,0.6)" fontFamily="monospace">72%</text>
      <text x="164" y="77" textAnchor="middle" fontSize="7" fill="rgba(255,107,61,0.8)" fontFamily="monospace">91%</text>
      {/* PDF/Excel badge */}
      <rect x="190" y="25" width="30" height="14" rx="3" fill="rgba(255,107,61,0.2)" stroke="rgba(255,107,61,0.5)" strokeWidth="1"/>
      <text x="205" y="35" textAnchor="middle" fontSize="7" fill="rgba(255,107,61,0.9)" fontFamily="monospace">PDF</text>
      <text x="140" y="172" textAnchor="middle" fill="rgba(255,107,61,0.5)" fontSize="8" fontFamily="monospace">
        Branded PDFs · async · signed URLs
      </text>
    </svg>
  );
}

function IlluAuditTrail() {
  return (
    <svg viewBox="0 0 280 180" fill="none" className="w-full h-full" aria-hidden>
      <style>{`
        @keyframes ft-block-in { from{opacity:0;transform:scale(0.8)} to{opacity:1;transform:scale(1)} }
        @keyframes ft-hash-flow { from{stroke-dashoffset:20} to{stroke-dashoffset:0} }
        @keyframes ft-ledger-glow { 0%,100%{filter:drop-shadow(0 0 1px rgba(255,107,61,0.2))} 50%{filter:drop-shadow(0 0 5px rgba(255,107,61,0.5))} }
      `}</style>
      {/* Chain blocks */}
      {[
        {x:20,  label:'#001', delay:'0s',  clr:'rgba(255,107,61,0.7)'},
        {x:90,  label:'#002', delay:'0.2s', clr:'rgba(255,107,61,0.6)'},
        {x:160, label:'#003', delay:'0.4s', clr:'rgba(255,107,61,0.5)'},
        {x:230, label:'#004', delay:'0.6s', clr:'rgba(255,107,61,0.4)'},
      ].map((b,i) => (
        <g key={i} style={{animation:`ft-block-in 0.5s ease-out forwards ${b.delay}, ft-ledger-glow 3s ease-in-out infinite ${b.delay}`, opacity:0}}>
          <rect x={b.x} y="55" width="48" height="60" rx="7"
            fill="rgba(255,107,61,0.08)" stroke={b.clr} strokeWidth="1.5"/>
          <text x={b.x+24} y="72" textAnchor="middle" fontSize="8" fill={b.clr} fontFamily="monospace" fontWeight="bold">{b.label}</text>
          <rect x={b.x+6} y="78" width="36" height="3" rx="1" fill="rgba(255,107,61,0.3)"/>
          <rect x={b.x+6} y="85" width="28" height="2" rx="1" fill="rgba(255,107,61,0.2)"/>
          <rect x={b.x+6} y="91" width="32" height="2" rx="1" fill="rgba(255,107,61,0.15)"/>
          <text x={b.x+24} y="107" textAnchor="middle" fontSize="6" fill="rgba(255,107,61,0.5)" fontFamily="monospace">SHA256</text>
        </g>
      ))}
      {/* Chain links */}
      {[68,138,208].map((x,i)=>(
        <line key={i} x1={x} y1="85" x2={x+22} y2="85" stroke="rgba(255,107,61,0.4)" strokeWidth="2"
          strokeDasharray="4 3" style={{animation:'ft-hash-flow 1s linear infinite'}}/>
      ))}
      {/* Tamper-proof label */}
      <rect x="72" y="135" width="136" height="18" rx="5" fill="rgba(34,197,94,0.08)" stroke="rgba(34,197,94,0.3)" strokeWidth="1"/>
      <text x="140" y="147" textAnchor="middle" fontSize="8" fill="rgba(34,197,94,0.8)" fontFamily="monospace">append-only · tamper-evident</text>
      <text x="140" y="172" textAnchor="middle" fill="rgba(255,107,61,0.5)" fontSize="8" fontFamily="monospace">
        Every action signed &amp; chained
      </text>
    </svg>
  );
}

const FEATS = [
  { t: 'Multi-tenant SaaS',  d: 'Fully isolated workspaces per institution. No data bleeds between tenants — ever.', Illu: IlluMultiTenant },
  { t: 'Dynamic signed QR',  d: 'HMAC-signed tokens rotate every 7 s with a single-use nonce. Screenshots are useless.', Illu: IlluDynamicQR },
  { t: 'Geofencing',         d: 'Server-side Haversine with accuracy thresholds blocks anyone outside the classroom.', Illu: IlluGeofence },
  { t: 'Device binding',     d: 'Lock each student to their registered device. Only admins can rebind.', Illu: IlluDeviceBinding },
  { t: 'App attestation',    d: 'Play Integrity, DeviceCheck and App Attest verify the app is genuine and unmodified.', Illu: IlluAppAttestation },
  { t: 'Fraud detection',    d: 'Weighted signals feed a suspicious-scan queue for human review.', Illu: IlluFraudDetection },
  { t: 'PDF / Excel reports', d: 'Branded async exports with signed download URLs. Ready in seconds.', Illu: IlluReports },
  { t: 'Audit trail',        d: 'Append-only, hash-chained log. Any tampering breaks every subsequent record.', Illu: IlluAuditTrail },
];

export function Features() {
  const root  = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(max-width: 900px)').matches) return;
    if (!root.current || !track.current) return;
    let ctx: ReturnType<typeof gsap.context> | undefined;
    try {
      ctx = gsap.context(() => {
        const cards = gsap.utils.toArray<HTMLElement>('.feat-card');
        if (cards.length === 0 || !track.current || !root.current) return;
        const total = (cards.length - 1) * 380;
        gsap.to(track.current, {
          x: () => `-${total}px`,
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            pin: true,
            start: 'top top',
            end: () => `+=${total + 200}`,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
      }, root);
    } catch { /* GSAP failure must not crash the page */ }
    return () => { try { ctx?.revert(); } catch {} };
  }, []);

  return (
    <section id="features" ref={root} className="py-24">
      <div className="container mb-16">
        <span className="text-[11px] tracking-[0.3em] text-ink-mute uppercase">[ 02 — features ]</span>
        <h2 className="mt-4 font-display text-[2.5rem] lg:text-[4rem] leading-[1.02] tracking-tightish max-w-3xl">
          Eight building blocks. <em className="not-italic text-accent">One verdict.</em>
        </h2>
      </div>

      {/* Desktop — horizontal scroll carousel.
          Fixed card height so footer height differences don't squeeze the
          illustration area. All illustrations have viewBox 280x180. */}
      <div className="hidden md:block overflow-hidden">
        <div ref={track} className="flex gap-5 pl-[8vw] will-change-transform">
          {FEATS.map((f, i) => (
            <article
              key={f.t}
              className="feat-card relative shrink-0 w-[360px] h-[460px] rounded-3xl glass border border-ink/8 dark:border-white/10 flex flex-col overflow-hidden hover:border-accent/30 transition-colors duration-300 group"
            >
              {/* Illustration: fixed height */}
              <div className="relative h-[240px] flex items-center justify-center px-5 pt-5 overflow-hidden">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background:'radial-gradient(ellipse at 50% 50%, rgba(255,107,61,0.06) 0%, transparent 70%)' }} />
                <f.Illu />
              </div>
              {/* Footer fills the rest */}
              <div className="flex-1 px-7 pt-5 pb-7 border-t border-ink/6 dark:border-white/6 flex flex-col">
                <div className="font-mono text-[10px] text-ink-mute tracking-wider mb-2">
                  {String(i + 1).padStart(2, '0')} / {FEATS.length}
                </div>
                <h3 className="font-display text-[1.55rem] leading-tight text-ink dark:text-cream-50">{f.t}</h3>
                <p className="mt-2 text-[12.5px] text-ink-mute leading-relaxed">{f.d}</p>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Mobile grid — also fixed illustration height for consistency */}
      <div className="container grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
        {FEATS.map((f) => (
          <div key={f.t} className="rounded-2xl glass border border-ink/8 overflow-hidden">
            <div className="h-[170px] flex items-center justify-center px-4 pt-4">
              <f.Illu />
            </div>
            <div className="p-5 border-t border-ink/6">
              <h3 className="font-display text-[1.3rem] leading-tight">{f.t}</h3>
              <p className="mt-1.5 text-[12px] text-ink-mute leading-relaxed">{f.d}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
