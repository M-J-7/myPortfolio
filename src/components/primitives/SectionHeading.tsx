import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { MaskReveal } from "./Reveal";
import { EASE_EXPO } from "@/lib/motion";

interface SectionHeadingProps {
  index: string;
  label: string;
  /**
   * Optional. Omit it where the section supplies its own display heading —
   * About leads with a scroll-lit statement, and stacking two large serif
   * blocks would have them competing.
   */
  title?: ReactNode;
  className?: string;
}

/**
 * The repeating editorial header: a mono index and label above a hairline
 * that draws itself, with the serif title revealed underneath. Used by every
 * section so the page reads as one system.
 */
export function SectionHeading({
  index,
  label,
  title,
  className,
}: SectionHeadingProps) {
  return (
    <div className={className}>
      <div className="flex items-baseline gap-4">
        <span className="label text-accent">{index}</span>
        <span className="label">{label}</span>
      </div>

      <motion.div
        className="mt-4 h-px origin-left bg-line"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 1.2, ease: EASE_EXPO }}
      />

      {title && (
        <h2 className="mt-8 font-display text-[length:var(--text-headline)] text-paper">
          <MaskReveal as="div" delay={0.1}>
            {title}
          </MaskReveal>
        </h2>
      )}
    </div>
  );
}
