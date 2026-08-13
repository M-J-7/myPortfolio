import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { profile } from "@/data/profile";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { EASE_EXPO, EASE_QUART } from "@/lib/motion";

const SEEN_KEY = "mj:intro-seen";

interface PreloaderProps {
  onComplete: () => void;
}

/**
 * The first two seconds. A counter runs to 100 while fonts load, the name
 * mask-reveals, then the whole panel wipes up off the screen.
 *
 * Three ways to skip it, in order of priority:
 *  1. reduced motion — never shows at all
 *  2. a return visit in the same tab — 400ms fade instead of the full run
 *  3. a hard ceiling, so a stalled font request can't trap anyone
 */
export function Preloader({ onComplete }: PreloaderProps) {
  const reduced = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const finished = useRef(false);

  const returning =
    typeof window !== "undefined" && sessionStorage.getItem(SEEN_KEY) === "1";
  const skip = reduced || returning;

  // Hold the page still behind the curtain, and start every visit at the top —
  // a browser restoring a mid-page scroll position under the intro is jarring.
  useEffect(() => {
    if (skip || done) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.scrollTo(0, 0);
    return () => {
      document.body.style.overflow = previous;
    };
  }, [skip, done]);

  useEffect(() => {
    if (skip) {
      // Still yield a frame so the hero can mount before we hand over.
      const id = window.setTimeout(() => {
        setDone(true);
        onComplete();
      }, reduced ? 0 : 400);
      return () => window.clearTimeout(id);
    }

    let raf = 0;
    const start = performance.now();
    const MIN_MS = 1500;
    const MAX_MS = 3200;

    let assetsReady = false;
    void document.fonts.ready.then(() => {
      assetsReady = true;
    });

    const tick = (now: number) => {
      const elapsed = now - start;

      // Ease toward 100 but hold just short until the fonts land, so the
      // number means something rather than being pure theatre.
      const timeRatio = Math.min(elapsed / MIN_MS, 1);
      const ceiling = assetsReady || elapsed > MAX_MS ? 1 : 0.92;
      const eased = 1 - Math.pow(1 - timeRatio, 3);
      const next = Math.min(eased, ceiling);

      setProgress(next);

      const complete = next >= 1 && elapsed >= MIN_MS;
      if (complete || elapsed > MAX_MS) {
        if (!finished.current) {
          finished.current = true;
          setProgress(1);
          sessionStorage.setItem(SEEN_KEY, "1");
          // Brief beat on "100", then release. The hero starts animating as
          // the curtain wipes, so the two overlap instead of queuing.
          window.setTimeout(() => {
            setDone(true);
            onComplete();
          }, 420);
        }
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [skip, reduced, onComplete]);

  if (skip) return null;

  const pct = Math.round(progress * 100);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[200] flex flex-col justify-between bg-void px-5 py-6 md:px-10 md:py-10"
          initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
          exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
          transition={{ duration: 1, ease: EASE_QUART }}
        >
          <div className="label">Portfolio — 2026</div>

          <div className="flex flex-col items-start">
            <span className="mask-line">
              <motion.span
                className="block font-display text-[clamp(2.75rem,9vw,7rem)] text-paper"
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 1, ease: EASE_EXPO, delay: 0.15 }}
              >
                {profile.firstName}
              </motion.span>
            </span>
            <span className="mask-line">
              <motion.span
                className="block font-display text-[clamp(2.75rem,9vw,7rem)] italic text-paper-dim"
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 1, ease: EASE_EXPO, delay: 0.28 }}
              >
                {profile.lastName}
              </motion.span>
            </span>
          </div>

          <div className="flex items-end justify-between gap-6">
            <div className="label hidden sm:block">{profile.role} — {profile.company}</div>

            <div className="flex flex-1 flex-col items-end gap-3">
              <div className="relative h-px w-full max-w-md overflow-hidden bg-line">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-accent"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="font-mono text-2xl tabular-nums text-paper md:text-4xl">
                {String(pct).padStart(3, "0")}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
