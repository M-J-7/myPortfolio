import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

interface CountUpProps {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}

/**
 * Counts from zero to `value` the first time it scrolls into view.
 *
 * The real number is always in the DOM for assistive tech via `aria-label`,
 * so the animation is decoration on top of a static, correct value.
 */
export function CountUp({
  value,
  suffix = "",
  prefix = "",
  duration = 1400,
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(reduced ? value : 0);

  useEffect(() => {
    if (!inView || reduced) return;

    let raf = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 4);
      setDisplay(Math.round(eased * value));
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduced, value, duration]);

  return (
    <span ref={ref} className={className} aria-label={`${prefix}${value}${suffix}`}>
      <span aria-hidden>
        {prefix}
        {display}
        {suffix}
      </span>
    </span>
  );
}
