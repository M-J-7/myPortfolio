import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

type CursorState = "default" | "link" | "media" | "text";

/**
 * Two-part cursor: a dot that tracks the pointer exactly, and a ring that
 * lags behind on a spring. The gap between them is the whole effect.
 *
 * Elements opt into states with `data-cursor="link" | "media" | "text"`.
 * Hidden entirely on touch devices and under reduced motion — there is no
 * pointer to decorate in the first case, and it's pure motion in the second.
 */
export function Cursor() {
  const reduced = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [state, setState] = useState<CursorState>("default");
  const [label, setLabel] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 380, damping: 32, mass: 0.5 });
  const ringY = useSpring(y, { stiffness: 380, damping: 32, mass: 0.5 });

  useEffect(() => {
    if (reduced) {
      setEnabled(false);
      return;
    }
    // A fine pointer means a real mouse. Touch and stylus get nothing.
    const query = window.matchMedia("(pointer: fine)");
    const apply = () => setEnabled(query.matches);
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, [reduced]);

  useEffect(() => {
    if (!enabled) return;

    const onMove = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      // React bails out when the value is unchanged, so this is cheaper than
      // reading `visible` here and re-subscribing whenever it flips.
      setVisible(true);

      const target = (event.target as HTMLElement | null)?.closest?.(
        "[data-cursor], a, button, input, textarea",
      ) as HTMLElement | null;

      if (!target) {
        setState("default");
        setLabel(null);
        return;
      }

      const declared = target.dataset.cursor as CursorState | undefined;
      if (declared) {
        setState(declared);
        setLabel(target.dataset.cursorLabel ?? null);
        return;
      }

      const tag = target.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") {
        setState("text");
      } else {
        setState("link");
      }
      setLabel(null);
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerenter", onEnter);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerenter", onEnter);
    };
  }, [enabled, x, y]);

  // Hide the native cursor only once ours is actually running, so a
  // failure here can never leave the page with no cursor at all.
  useEffect(() => {
    if (!enabled) return;
    document.documentElement.style.cursor = "none";
    return () => {
      document.documentElement.style.cursor = "";
    };
  }, [enabled]);

  if (!enabled) return null;

  const ringSize = state === "media" ? 76 : state === "link" ? 56 : state === "text" ? 2 : 34;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100]">
      <motion.div
        className="absolute rounded-full bg-accent"
        style={{
          x,
          y,
          width: 5,
          height: 5,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{ opacity: visible && state !== "text" ? 1 : 0 }}
        transition={{ duration: 0.15 }}
      />

      <motion.div
        className="absolute flex items-center justify-center rounded-full border border-paper/60"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
          mixBlendMode: state === "link" ? "difference" : "normal",
        }}
        animate={{
          width: state === "text" ? 2 : ringSize,
          height: state === "text" ? 26 : ringSize,
          borderRadius: state === "text" ? 1 : 999,
          opacity: visible ? 1 : 0,
          backgroundColor:
            state === "media"
              ? "rgba(199,249,78,0.95)"
              : state === "text"
                ? "rgba(244,241,234,0.9)"
                : "rgba(244,241,234,0)",
          borderColor:
            state === "text" ? "rgba(244,241,234,0)" : "rgba(244,241,234,0.6)",
        }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      >
        <AnimatePresence>
          {state === "media" && label && (
            <motion.span
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.2 }}
              className="font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-void"
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
