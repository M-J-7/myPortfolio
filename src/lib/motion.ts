import type { Variants, Transition } from "framer-motion";

export const EASE_EXPO = [0.16, 1, 0.3, 1] as const;
export const EASE_QUART = [0.77, 0, 0.175, 1] as const;

export const spring: Transition = {
  type: "spring",
  stiffness: 120,
  damping: 20,
  mass: 0.6,
};

/** Text sliding up from behind a `.mask-line` clipping edge. */
export const maskUp: Variants = {
  hidden: { y: "110%" },
  visible: (i: number = 0) => ({
    y: "0%",
    transition: { duration: 0.9, ease: EASE_EXPO, delay: i * 0.06 },
  }),
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE_EXPO, delay: i * 0.08 },
  }),
};

export const fade: Variants = {
  hidden: { opacity: 0 },
  visible: (i: number = 0) => ({
    opacity: 1,
    transition: { duration: 0.6, ease: EASE_EXPO, delay: i * 0.05 },
  }),
};

/** Shared `whileInView` config — fire once, slightly before fully on screen. */
export const inView = {
  initial: "hidden",
  whileInView: "visible",
  viewport: { once: true, margin: "-12% 0px -12% 0px" },
} as const;
