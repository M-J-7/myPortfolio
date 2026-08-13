import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

interface ScrollLitTextProps {
  text: string;
  className?: string;
  /** Words to accent instead of resolving to `paper`. Matched case-insensitively. */
  highlight?: string[];
}

/**
 * A statement that lights up word by word as it passes through the viewport.
 *
 * Each word owns a slice of the container's scroll progress and fades from
 * near-invisible to full brightness across it, with a slight overlap so the
 * effect reads as a wave rather than a row of switches. It slows the reader
 * down, which for the one paragraph that is actually about Mihir is the point.
 */
function Word({
  children,
  progress,
  range,
  accent,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  accent: boolean;
}) {
  const opacity = useTransform(progress, range, [0.14, 1]);

  return (
    <span className="relative mr-[0.28em] inline-block">
      {/* Dim ghost underneath keeps the line's shape readable before it lights,
          so the paragraph never looks like it failed to load. */}
      <span aria-hidden className="absolute inset-0 text-paper-faint/25">
        {children}
      </span>
      <motion.span
        aria-hidden
        style={{ opacity }}
        className={accent ? "italic text-accent" : "text-paper"}
      >
        {children}
      </motion.span>
    </span>
  );
}

export function ScrollLitText({
  text,
  className,
  highlight = [],
}: ScrollLitTextProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion();

  // Start once the block is well into view and finish before it leaves, so the
  // last word lights while the statement is still comfortably on screen.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.55"],
  });

  const words = text.split(" ");
  const accentSet = new Set(highlight.map((w) => w.toLowerCase()));
  const isAccent = (word: string) =>
    accentSet.has(word.toLowerCase().replace(/[^a-z0-9']/gi, ""));

  if (reduced) {
    return (
      <p ref={ref} className={className}>
        {words.map((word, i) => (
          <span
            key={`${word}-${i}`}
            className={isAccent(word) ? "italic text-accent" : "text-paper"}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </span>
        ))}
      </p>
    );
  }

  return (
    <p ref={ref} className={className} aria-label={text}>
      {words.map((word, i) => {
        const start = i / words.length;
        // Overlap each word into the next slot so the wave is continuous.
        const end = Math.min((i + 1.6) / words.length, 1);
        return (
          <Word
            key={`${word}-${i}`}
            progress={scrollYProgress}
            range={[start, end]}
            accent={isAccent(word)}
          >
            {word}
          </Word>
        );
      })}
    </p>
  );
}
