import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { useReducedMotion } from "./useReducedMotion";

/**
 * Smooth scrolling, and the in-page anchor navigation that goes with it.
 *
 * Skipped entirely under reduced motion — hijacking the scrollbar is
 * exactly the kind of thing that setting exists to prevent, so those
 * visitors get native scrolling and native anchor jumps.
 */
export function useLenis(enabled = true) {
  const lenisRef = useRef<Lenis | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !enabled) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
    });
    lenisRef.current = lenis;

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    // Route same-page anchor clicks through Lenis so they ease instead of jump.
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement | null)?.closest?.(
        'a[href^="#"]',
      ) as HTMLAnchorElement | null;
      if (!anchor) return;

      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;

      const target = document.querySelector(id);
      if (!target) return;

      event.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -16 });
    };

    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(frame);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reduced, enabled]);

  return lenisRef;
}
