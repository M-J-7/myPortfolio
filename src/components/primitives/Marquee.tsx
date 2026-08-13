import { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  useMotionValueEvent,
} from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

interface MarqueeProps {
  items: string[];
  baseVelocity?: number;
  className?: string;
}

const wrap = (min: number, max: number, value: number) => {
  const range = max - min;
  return ((((value - min) % range) + range) % range) + min;
};

/**
 * A band of text that drifts on its own and reacts to scrolling — scroll
 * faster and it speeds up; scroll backwards and it reverses direction.
 *
 * That coupling is the point: the marquee acknowledges the reader instead
 * of looping obliviously, which is what makes people scrub up and down to
 * play with it.
 */
export function Marquee({ items, baseVelocity = 2, className }: MarqueeProps) {
  const reduced = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 4], {
    clamp: false,
  });

  // The row is rendered four times; -25% is exactly one copy, so wrapping
  // there is seamless regardless of how long the content is.
  const x = useTransform(baseX, (v) => `${wrap(-25, 0, v)}%`);

  const directionFactor = useRef(1);
  const velocity = useRef(0);
  useMotionValueEvent(velocityFactor, "change", (v) => {
    velocity.current = v;
  });

  useAnimationFrame((_, delta) => {
    if (reduced) return;
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    if (velocity.current < 0) {
      directionFactor.current = -1;
    } else if (velocity.current > 0) {
      directionFactor.current = 1;
    }
    moveBy += directionFactor.current * moveBy * velocity.current;

    baseX.set(baseX.get() + moveBy);
  });

  const row = (
    <>
      {items.map((item, i) => (
        <span key={`${item}-${i}`} className="flex items-center gap-8 md:gap-14">
          <span>{item}</span>
          <span className="text-accent/70" aria-hidden>
            &#8226;
          </span>
        </span>
      ))}
    </>
  );

  return (
    <div className="flex overflow-hidden whitespace-nowrap" aria-hidden>
      <motion.div
        className={`flex flex-none items-center gap-8 pr-8 md:gap-14 md:pr-14 ${className ?? ""}`}
        style={reduced ? undefined : { x }}
      >
        {row}
        {row}
        {row}
        {row}
      </motion.div>
    </div>
  );
}
