'use client';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let initialized = false;

export function initGSAP() {
  if (typeof window === 'undefined' || initialized) return;
  initialized = true;

  gsap.registerPlugin(ScrollTrigger);

  // Web fonts (Cormorant Garamond / DM Sans) load asynchronously and change
  // element heights once they swap in — especially the large display text.
  // ScrollTrigger computes every start/end at first paint, so without a
  // recompute those positions go stale and triggers far down the page (e.g. the
  // CTA scrub reveal) can get stuck. Refresh across several points — refresh()
  // is idempotent, and the last one lands after the layout stops moving.
  const refresh = () => ScrollTrigger.refresh();
  if (typeof document !== 'undefined' && document.fonts?.ready) {
    document.fonts.ready.then(refresh);
  }
  window.addEventListener('load', refresh);
  requestAnimationFrame(() => requestAnimationFrame(refresh));
  setTimeout(refresh, 1200);

  // Prevent GSAP from trying to compensate for time skipped while tab was hidden.
  // Without this, a page opened in a background tab plays all animations instantly
  // when the user finally focuses it.
  gsap.ticker.lagSmoothing(0);

  // GSAP pauses its global timeline when document.hidden = true.
  // On first focus (tab was opened in background) we seek back to 0 so
  // entrance animations replay cleanly from the start.
  let firstFocus = true;
  const onVisible = () => {
    if (!document.hidden) {
      if (firstFocus) {
        firstFocus = false;
        // Restart entrance animations by seeking globalTimeline to 0
        gsap.globalTimeline.time(0, true);
        gsap.globalTimeline.resume();
        ScrollTrigger.refresh();
      } else {
        gsap.globalTimeline.resume();
      }
    }
  };
  document.addEventListener('visibilitychange', onVisible);
}
