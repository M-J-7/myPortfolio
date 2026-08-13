import { motion, useScroll, useSpring } from "framer-motion";

/** Hairline read-progress bar pinned to the top of the viewport. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 40,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[95] h-px origin-left bg-accent"
      style={{ scaleX }}
    />
  );
}
