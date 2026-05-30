'use client';

/**
 * Aurora — the ambient backdrop that replaces the old reactive grid.
 *
 * It is a continuously-moving field of soft, blurred light. Pure CSS:
 * no rAF, no scroll/mouse listeners, no canvas — so it can never jank,
 * leak, or crash the page (it renders fine even if JS later errors).
 *
 * The palette is the brand's own warm light (accent + amber) balanced by
 * a cool sage/periwinkle so it reads as natural northern-light glow rather
 * than a flat tint. Tuned for both the cream light theme and the near-black
 * dark theme via CSS variables, and frozen under prefers-reduced-motion.
 */
export function Aurora() {
  return (
    <div className="aurora-root" aria-hidden>
      <div className="aurora-field">
        <span className="aurora-blob aurora-b1" />
        <span className="aurora-blob aurora-b2" />
        <span className="aurora-blob aurora-b3" />
        <span className="aurora-blob aurora-b4" />
        <span className="aurora-blob aurora-b5" />
      </div>
      {/* Melts the light into the page background at the edges */}
      <div className="aurora-vignette" />
    </div>
  );
}
