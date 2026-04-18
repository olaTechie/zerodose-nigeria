/**
 * useScrollProgress — return a 0-to-1 value describing how far an element
 * has travelled through the viewport.
 *
 *   0   = the element's TOP edge is sitting at the BOTTOM edge of the viewport
 *         (just about to scroll into view).
 *   1   = the element's BOTTOM edge has just left the TOP edge of the viewport
 *         (just scrolled out).
 *
 * The hook is built on IntersectionObserver with a dense set of thresholds so
 * the returned `progress` updates smoothly during scroll without us having to
 * attach a `scroll` listener. It also reads `bounding.top` on each fire to
 * compute fractional progress relative to viewport height.
 *
 * Reduced-motion users get progress = 1 immediately so any choreography that
 * keys off this hook degrades to its final state on first paint.
 *
 * Used by Story Act 1 (NigeriaMap state-by-state fade) and any future
 * sequence that wants a continuous scroll-position signal.
 */
import { useEffect, useRef, useState } from 'react';

const THRESHOLDS = Array.from({ length: 21 }, (_, i) => i / 20); // 0, 0.05, ..., 1

function prefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

export function useScrollProgress(options = {}) {
  const { rootMargin = '0px', clamp = true } = options;
  const ref = useRef(null);
  const [progress, setProgress] = useState(prefersReducedMotion() ? 1 : 0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    if (prefersReducedMotion()) {
      setProgress(1);
      return undefined;
    }

    const compute = () => {
      const rect = node.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      // Distance the element has travelled from "just below viewport"
      // to "just above viewport". Total travel = vh + height.
      const total = vh + rect.height;
      const travelled = vh - rect.top;
      let p = travelled / total;
      if (clamp) p = Math.min(1, Math.max(0, p));
      setProgress(p);
    };

    const observer = new IntersectionObserver(
      () => {
        compute();
      },
      { threshold: THRESHOLDS, rootMargin }
    );
    observer.observe(node);

    // Compute immediately so first paint has the right value.
    compute();

    // Top-up: while the element is on screen, IntersectionObserver alone is
    // coarse — listen to scroll while in view, throttled via rAF.
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        compute();
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [rootMargin, clamp]);

  return [ref, progress];
}

export default useScrollProgress;
