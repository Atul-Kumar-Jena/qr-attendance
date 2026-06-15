'use client';

import { useEffect, useState } from 'react';

/**
 * Palette Studio — a live theme previewer. Pick a palette + fonts, see the whole
 * site recolour instantly (it drives the same CSS variables the site uses), then
 * copy the exact colour codes + font names to lock in. Choice persists.
 */

type Vars = Record<string, string>;
interface Palette { id: string; name: string; swatch: [string, string, string]; vars: Vars; }

const PALETTES: Palette[] = [
  {
    id: 'royal', name: 'Royal Emerald', swatch: ['#2E8A5C', '#D7B65A', '#F2ECD9'],
    vars: {
      '--bg': '#07140E', '--bg-2': '#0C1C14', '--ink': '#F2ECD9', '--ink-soft': '#D8D0B6', '--ink-mute': '#9BA890',
      '--line': 'rgba(205,212,175,0.10)', '--accent': '#2E8A5C', '--accent-rgb': '46 138 92',
      '--accent-2': '#D7B65A', '--accent-2-rgb': '215 182 90', '--accent-3': '#EAD79B',
      '--iri': 'linear-gradient(110deg,#EAD79B,#58C58C,#D7B65A,#F0E4B0)',
      '--glass-bg': 'rgba(255,255,255,0.05)', '--glass-brd': 'rgba(235,225,180,0.14)',
      '--aurora-1': 'rgba(245,236,205,0.55)', '--aurora-2': 'rgba(46,150,95,0.88)', '--aurora-3': 'rgba(201,162,75,0.66)', '--aurora-4': 'rgba(31,110,72,0.45)', '--aurora-base': '#04100A',
      '--atmos-1': 'rgba(234,215,155,0.50)', '--atmos-2': 'rgba(46,138,92,0.55)', '--atmos-3': 'rgba(215,182,90,0.50)', '--atmos-wash': 'rgba(20,54,38,0.35)', '--atmos-grid': 'rgba(205,212,175,0.045)',
    },
  },
  {
    id: 'sapphire', name: 'Sapphire Glass', swatch: ['#5B8CFF', '#9C6BFF', '#3FD8FF'],
    vars: {
      '--bg': '#06070E', '--bg-2': '#0B0E1A', '--ink': '#EAEFFF', '--ink-soft': '#C6D0EA', '--ink-mute': '#828DAC',
      '--line': 'rgba(150,175,255,0.10)', '--accent': '#5B8CFF', '--accent-rgb': '91 140 255',
      '--accent-2': '#9C6BFF', '--accent-2-rgb': '156 107 255', '--accent-3': '#3FD8FF',
      '--iri': 'linear-gradient(110deg,#3FD8FF,#5B8CFF,#9C6BFF,#FF9BE6)',
      '--glass-bg': 'rgba(255,255,255,0.05)', '--glass-brd': 'rgba(180,200,255,0.14)',
      '--aurora-1': 'rgba(168,244,255,0.55)', '--aurora-2': 'rgba(78,128,255,0.88)', '--aurora-3': 'rgba(152,98,255,0.66)', '--aurora-4': 'rgba(60,90,200,0.45)', '--aurora-base': '#04050C',
      '--atmos-1': 'rgba(63,216,255,0.50)', '--atmos-2': 'rgba(91,140,255,0.55)', '--atmos-3': 'rgba(156,107,255,0.50)', '--atmos-wash': 'rgba(30,40,90,0.35)', '--atmos-grid': 'rgba(150,175,255,0.05)',
    },
  },
  {
    id: 'obsidian', name: 'Obsidian Gold', swatch: ['#D9B45A', '#E8D9A8', '#0B0B0C'],
    vars: {
      '--bg': '#0B0B0C', '--bg-2': '#131211', '--ink': '#F3EEE3', '--ink-soft': '#D8D0BE', '--ink-mute': '#9A938A',
      '--line': 'rgba(220,210,180,0.10)', '--accent': '#D9B45A', '--accent-rgb': '217 180 90',
      '--accent-2': '#E8D9A8', '--accent-2-rgb': '232 217 168', '--accent-3': '#C49A3F',
      '--iri': 'linear-gradient(110deg,#E8D9A8,#D9B45A,#C49A3F,#F3EEE3)',
      '--glass-bg': 'rgba(255,255,255,0.045)', '--glass-brd': 'rgba(230,215,170,0.14)',
      '--aurora-1': 'rgba(247,238,210,0.50)', '--aurora-2': 'rgba(190,150,70,0.72)', '--aurora-3': 'rgba(120,95,40,0.55)', '--aurora-4': 'rgba(40,34,22,0.5)', '--aurora-base': '#08080A',
      '--atmos-1': 'rgba(217,180,90,0.45)', '--atmos-2': 'rgba(120,95,40,0.50)', '--atmos-3': 'rgba(232,217,168,0.40)', '--atmos-wash': 'rgba(40,34,18,0.40)', '--atmos-grid': 'rgba(220,210,180,0.04)',
    },
  },
  {
    id: 'plum', name: 'Plum Royale', swatch: ['#B98CF0', '#E6C36B', '#F0A6D6'],
    vars: {
      '--bg': '#120A18', '--bg-2': '#1A1024', '--ink': '#F3EAF2', '--ink-soft': '#D8C8DA', '--ink-mute': '#A091A6',
      '--line': 'rgba(220,200,230,0.10)', '--accent': '#B98CF0', '--accent-rgb': '185 140 240',
      '--accent-2': '#E6C36B', '--accent-2-rgb': '230 195 107', '--accent-3': '#F0A6D6',
      '--iri': 'linear-gradient(110deg,#F0A6D6,#B98CF0,#E6C36B,#F3EAF2)',
      '--glass-bg': 'rgba(255,255,255,0.05)', '--glass-brd': 'rgba(225,200,235,0.14)',
      '--aurora-1': 'rgba(240,200,235,0.50)', '--aurora-2': 'rgba(150,90,210,0.85)', '--aurora-3': 'rgba(230,195,107,0.60)', '--aurora-4': 'rgba(70,40,100,0.5)', '--aurora-base': '#0C0712',
      '--atmos-1': 'rgba(185,140,240,0.50)', '--atmos-2': 'rgba(120,70,170,0.55)', '--atmos-3': 'rgba(230,195,107,0.45)', '--atmos-wash': 'rgba(50,25,70,0.40)', '--atmos-grid': 'rgba(220,200,230,0.04)',
    },
  },
  {
    id: 'crimson', name: 'Crimson Noir', swatch: ['#C8443A', '#E3B55C', '#F4EBE3'],
    vars: {
      '--bg': '#120808', '--bg-2': '#1C0E0E', '--ink': '#F4EBE3', '--ink-soft': '#DCC9C2', '--ink-mute': '#A88E88',
      '--line': 'rgba(230,200,190,0.10)', '--accent': '#C8443A', '--accent-rgb': '200 68 58',
      '--accent-2': '#E3B55C', '--accent-2-rgb': '227 181 92', '--accent-3': '#F0C9A6',
      '--iri': 'linear-gradient(110deg,#E3B55C,#C8443A,#9A2E2E,#F4EBE3)',
      '--glass-bg': 'rgba(255,255,255,0.05)', '--glass-brd': 'rgba(235,200,180,0.14)',
      '--aurora-1': 'rgba(245,225,200,0.50)', '--aurora-2': 'rgba(190,60,55,0.82)', '--aurora-3': 'rgba(210,150,70,0.60)', '--aurora-4': 'rgba(90,30,30,0.5)', '--aurora-base': '#0E0606',
      '--atmos-1': 'rgba(200,68,58,0.45)', '--atmos-2': 'rgba(150,40,40,0.50)', '--atmos-3': 'rgba(227,181,92,0.40)', '--atmos-wash': 'rgba(60,20,20,0.40)', '--atmos-grid': 'rgba(230,200,190,0.04)',
    },
  },
];

interface FontDef { id: string; name: string; stack: string; href?: string; }
const DISPLAY_FONTS: FontDef[] = [
  { id: 'fraunces', name: 'Fraunces', stack: "'Fraunces', serif", href: 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,500&display=swap' },
  { id: 'cormorant', name: 'Cormorant', stack: "'Cormorant Garamond', serif", href: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,500&display=swap' },
  { id: 'playfair', name: 'Playfair', stack: "'Playfair Display', serif", href: 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500&display=swap' },
  { id: 'space', name: 'Space Grotesk', stack: "'Space Grotesk', sans-serif", href: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap' },
];
const BODY_FONTS: FontDef[] = [
  { id: 'inter', name: 'Inter', stack: "'Inter', sans-serif", href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap' },
  { id: 'dmsans', name: 'DM Sans', stack: "'DM Sans', sans-serif", href: 'https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap' },
  { id: 'spaceb', name: 'Space Grotesk', stack: "'Space Grotesk', sans-serif", href: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600&display=swap' },
];

const STORE = 'atd_palette';

function injectFont(href?: string) {
  if (!href || document.querySelector(`link[data-pf="${href}"]`)) return;
  const l = document.createElement('link');
  l.rel = 'stylesheet'; l.href = href; l.dataset.pf = href;
  document.head.appendChild(l);
}

export function PaletteStudio() {
  const [open, setOpen] = useState(false);
  const [pal, setPal] = useState('royal');
  const [disp, setDisp] = useState('fraunces');
  const [body, setBody] = useState('inter');
  const [copied, setCopied] = useState(false);

  const applyPalette = (id: string) => {
    const p = PALETTES.find((x) => x.id === id); if (!p) return;
    Object.entries(p.vars).forEach(([k, v]) => document.documentElement.style.setProperty(k, v));
    document.documentElement.classList.add('dark'); // studio palettes are deep themes
  };
  const applyDisplay = (id: string) => {
    const f = DISPLAY_FONTS.find((x) => x.id === id); if (!f) return;
    injectFont(f.href);
    document.documentElement.style.setProperty('--font-display', f.stack);
  };
  const applyBody = (id: string) => {
    const f = BODY_FONTS.find((x) => x.id === id); if (!f) return;
    injectFont(f.href);
    document.documentElement.style.setProperty('--font-sans', f.stack);
  };

  // restore on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORE);
      if (raw) {
        const s = JSON.parse(raw);
        if (s.pal) { setPal(s.pal); applyPalette(s.pal); }
        if (s.disp) { setDisp(s.disp); applyDisplay(s.disp); }
        if (s.body) { setBody(s.body); applyBody(s.body); }
      }
    } catch {}
  }, []);

  const persist = (next: Partial<{ pal: string; disp: string; body: string }>) => {
    const s = { pal, disp, body, ...next };
    try { localStorage.setItem(STORE, JSON.stringify(s)); } catch {}
  };

  const choosePal = (id: string) => { setPal(id); applyPalette(id); persist({ pal: id }); };
  const chooseDisp = (id: string) => { setDisp(id); applyDisplay(id); persist({ disp: id }); };
  const chooseBody = (id: string) => { setBody(id); applyBody(id); persist({ body: id }); };

  const p = PALETTES.find((x) => x.id === pal)!;
  const dName = DISPLAY_FONTS.find((x) => x.id === disp)?.name;
  const bName = BODY_FONTS.find((x) => x.id === body)?.name;
  const payload =
    `palette: ${p.name}\n` +
    `bg: ${p.vars['--bg']}  bg-2: ${p.vars['--bg-2']}\n` +
    `ink: ${p.vars['--ink']}  ink-mute: ${p.vars['--ink-mute']}\n` +
    `accent: ${p.vars['--accent']}  accent-2: ${p.vars['--accent-2']}  accent-3: ${p.vars['--accent-3']}\n` +
    `display font: ${dName}\nbody font: ${bName}`;

  const copy = () => {
    navigator.clipboard?.writeText(payload).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1600); }).catch(() => {});
  };

  return (
    <>
      {/* Launcher */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Palette studio"
        className="fixed bottom-24 right-4 md:bottom-28 md:right-6 z-[80] h-12 w-12 grid place-items-center rounded-full glass shadow-[0_12px_40px_-12px_rgba(0,0,0,0.6)] hover:scale-105 transition-transform"
      >
        <span className="flex gap-0.5">
          <span className="h-3.5 w-1.5 rounded-full bg-accent" />
          <span className="h-3.5 w-1.5 rounded-full bg-accent-warm" />
          <span className="h-3.5 w-1.5 rounded-full" style={{ background: 'var(--accent-3)' }} />
        </span>
      </button>

      {/* Panel */}
      <div
        className={`fixed bottom-40 right-4 md:bottom-44 md:right-6 z-[80] w-[300px] max-h-[70vh] overflow-y-auto rounded-2xl glass p-4 transition-all duration-300 ${
          open ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-3 pointer-events-none'
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="font-display text-[1.15rem] leading-none">Palette studio</div>
          <button onClick={() => setOpen(false)} aria-label="Close" className="text-ink-mute hover:text-ink text-lg leading-none">×</button>
        </div>
        <p className="text-[11px] text-ink-mute mb-3 leading-snug">Tap a palette & fonts — the whole site updates live. Copy the codes you like and send them to me.</p>

        <div className="text-[10px] tracking-[0.18em] uppercase text-ink-mute mb-2">Palette</div>
        <div className="grid grid-cols-1 gap-1.5 mb-4">
          {PALETTES.map((x) => (
            <button key={x.id} onClick={() => choosePal(x.id)}
              className={`flex items-center gap-2.5 rounded-xl px-2.5 py-2 border transition-colors ${pal === x.id ? 'border-accent bg-accent/10' : 'border-white/10 hover:bg-white/5'}`}>
              <span className="flex gap-1">
                {x.swatch.map((c) => <span key={c} className="h-4 w-4 rounded-full border border-white/20" style={{ background: c }} />)}
              </span>
              <span className="text-[12.5px]">{x.name}</span>
            </button>
          ))}
        </div>

        <div className="text-[10px] tracking-[0.18em] uppercase text-ink-mute mb-2">Display font</div>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {DISPLAY_FONTS.map((f) => (
            <button key={f.id} onClick={() => chooseDisp(f.id)} style={{ fontFamily: f.stack }}
              className={`rounded-lg px-2.5 py-1.5 text-[13px] border transition-colors ${disp === f.id ? 'border-accent bg-accent/10' : 'border-white/10 hover:bg-white/5'}`}>
              {f.name}
            </button>
          ))}
        </div>

        <div className="text-[10px] tracking-[0.18em] uppercase text-ink-mute mb-2">Body font</div>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {BODY_FONTS.map((f) => (
            <button key={f.id} onClick={() => chooseBody(f.id)} style={{ fontFamily: f.stack }}
              className={`rounded-lg px-2.5 py-1.5 text-[12.5px] border transition-colors ${body === f.id ? 'border-accent bg-accent/10' : 'border-white/10 hover:bg-white/5'}`}>
              {f.name}
            </button>
          ))}
        </div>

        <pre className="text-[10.5px] leading-relaxed text-ink-mute bg-white/5 rounded-xl p-3 whitespace-pre-wrap break-words mb-2">{payload}</pre>
        <button onClick={copy} className="btn-glass w-full rounded-xl bg-accent text-white py-2.5 text-[12.5px] font-medium hover:scale-[1.02] transition-transform">
          {copied ? 'Copied ✓' : 'Copy palette payload'}
        </button>
      </div>
    </>
  );
}
