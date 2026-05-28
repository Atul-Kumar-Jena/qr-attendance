# Attendly Web

Next.js 14 (App Router) — landing page + admin dashboard shell.

## Animation stack (deliberate)

Pure GSAP + ScrollTrigger throughout. Effects in use (most uncommon on
"day-to-day" sites called out):

- **Word-mask split reveal** on every section heading
  (`reveal-mask` + `reveal-line`, `expo.out`)
- **Char scramble** on the hero subtitle (random glyph → final char)
- **Self-assembling 21×21 QR mosaic** — random stagger, `back.out`,
  rotation, continuous breathing tween
- **Cursor-follow parallax orb** in the hero
- **Custom magnetic cursor** with lagging ring + scale on `[data-magnetic]`
  hot spots
- **Magnetic CTA buttons** with `elastic.out` return
- **Velocity-skewed marquee** — skews on scroll-velocity, settles back
- **Pinned horizontal-scroll feature carousel** (desktop)
- **SVG path draw-on** on the hero squiggle, security connector, and CTA
- **Scroll-scrubbed 3D dashboard tilt** (perspective + rotateX/Y unwind)
- **Animated bar chart + live-scan ticker** inside the mockup
- **Concentric security rings** that stagger in
- **Strike-through draw** on each "problem" title
- **Number counters** (hero stats, problem strip, pricing) tweened with
  `expo.out`
- **Phone parallax pair** — two phones scroll at different speeds
- **Sweeping scanner line** inside the mobile scanner preview
- **FAQ height animation** with `expo.inOut`
- **Giant text scale + letter-spacing reveal** in the CTA
- **Scroll progress bar** along the top edge
- **Inertia smooth-scroll** lerp (no Lenis dep)

## Dev

```bash
npm install
npm run dev
```

Pages:

- `/` — landing page
- `/admin` — dashboard shell (overview, sessions, students, reports, audit)
- `/admin/qr/demo` — full-screen rotating QR display (for projecting in class)
