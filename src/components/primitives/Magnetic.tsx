import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

interface MagneticProps {
  children: ReactNode;
  /** How far the element is allowed to travel toward the pointer, in px. */
  strength?: number;
  className?: string;
}

/**
 * Pulls its child toward the pointer while hovered, then springs it back.
 *
 * The element only moves a fraction of the pointer's offset, which is what
 * makes it feel weighted rather than glued to the cursor. Inert under
 * reduced motion — the child renders untouched.
 */
export function Magnetic({ children, strength = 14, className }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 18, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 200, damping: 18, mass: 0.4 });

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const offsetX = event.clientX - (rect.left + rect.width / 2);
    const offsetY = event.clientY - (rect.top + rect.height / 2);
    // Normalise against the element's own size so big and small targets
    // both feel the same amount of pull.
    x.set((offsetX / (rect.width / 2)) * strength);
    y.set((offsetY / (rect.height / 2)) * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x: springX, y: springY }}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
      onPointerCancel={reset}
    >
      {children}
    </motion.div>
  );
}
