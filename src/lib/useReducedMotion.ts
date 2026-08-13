import { useEffect, useState } from "react";

/**
 * Tracks `prefers-reduced-motion` live, so a visitor toggling the OS
 * setting mid-session gets the change immediately.
 *
 * Every motion system in the app gates on this: Lenis, the preloader,
 * the custom cursor and the WebGL canvas all stand down when it's true.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return reduced;
}
