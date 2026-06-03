'use client';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let initialized = false;

export function initGSAP() {
  if (typeof window === 'undefined' || initialized) return;
  initialized = true;

  gsap.registerPlugin(ScrollTrigger);

  // Fewer console warnings + force GSAP to use the single rAF we drive.
  gsap.config({ nullTargetWarn: false, force3D: true });

  // Mobile browsers fire `resize` whenever the URL bar shows/hides while
  // scrolling. Letting that re-run ScrollTrigger.refresh() mid-scroll is the #1
  // cause of mobile scroll jank + animation desync — ignore it.
  ScrollTrigger.config({ ignoreMobileResize: true });

  // Don't let GSAP try to "catch up" after a slow/backgrounded frame — that's
  // what makes scrubbed animations lurch after a stall. One tick = one frame.
  gsap.ticker.lagSmoothing(0);

  // A tab opened in the background pauses GSAP's global timeline. On first
  // focus, replay entrance animations cleanly from 0 and recalc triggers.
  let firstFocus = true;
  const onVisible = () => {
    if (document.hidden) return;
    if (firstFocus) {
      firstFocus = false;
      gsap.globalTimeline.time(0, true);
      gsap.globalTimeline.resume();
      ScrollTrigger.refresh();
    } else {
      gsap.globalTimeline.resume();
    }
  };
  document.addEventListener('visibilitychange', onVisible);
}
