import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { EASE_EXPO } from "@/lib/motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

interface MaskRevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "span" | "div";
}

/**
 * Slides its child up from behind a clipping edge. The workhorse of the
 * whole site — every heading and label enters this way.
 */
export function MaskReveal({
  children,
  delay = 0,
  className,
  as = "span",
}: MaskRevealProps) {
  const reduced = useReducedMotion();
  const Wrapper = as === "div" ? motion.div : motion.span;

  if (reduced) {
    return <span className={className}>{children}</span>;
  }

  return (
    <span className="mask-line">
      <Wrapper
        className={className}
        style={{ display: "block" }}
        initial={{ y: "110%" }}
        whileInView={{ y: "0%" }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 0.9, ease: EASE_EXPO, delay }}
      >
        {children}
      </Wrapper>
    </span>
  );
}

interface SplitTextProps {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  stagger?: number;
}

/**
 * Splits a string into words, each in its own mask, revealed in sequence.
 *
 * Words stay in their own `<span>`s so the browser still wraps and hyphenates
 * normally, and the whole string is exposed to screen readers as one label
 * rather than as a pile of fragments.
 */
export function SplitText({
  text,
  className,
  wordClassName,
  delay = 0,
  stagger = 0.05,
}: SplitTextProps) {
  const reduced = useReducedMotion();
  const words = text.split(" ");

  if (reduced) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span className={className} aria-label={text}>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          aria-hidden
          className="mask-line"
          style={{ display: "inline-block", verticalAlign: "top" }}
        >
          <motion.span
            className={wordClassName}
            style={{ display: "inline-block" }}
            initial={{ y: "110%" }}
            whileInView={{ y: "0%" }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{
              duration: 0.9,
              ease: EASE_EXPO,
              delay: delay + i * stagger,
            }}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
