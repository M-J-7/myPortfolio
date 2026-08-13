import { Suspense, lazy } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { profile } from "@/data/profile";
import { Clock } from "@/components/primitives/Clock";
import { Magnetic } from "@/components/primitives/Magnetic";
import { useDeviceTier } from "@/lib/useDeviceTier";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { EASE_EXPO } from "@/lib/motion";

// three.js lives in its own chunk and is never in the entry payload.
const Scene = lazy(() =>
  import("@/three/Scene").then((m) => ({ default: m.Scene })),
);

interface HeroProps {
  /** Held false until the preloader clears, so nothing animates behind it. */
  ready: boolean;
}

/**
 * What stands in for the 3D object on phones, weak GPUs and under reduced
 * motion: two soft colour fields in pure CSS. Costs nothing, and keeps the
 * hero from reading as a half-empty page when the canvas never arrives.
 */
function AmbientFallback() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div
        className="absolute right-[-10%] top-[8%] h-[38rem] w-[38rem] rounded-full opacity-40 blur-[110px]"
        style={{
          background:
            "radial-gradient(circle, rgba(199,249,78,0.28) 0%, rgba(199,249,78,0) 68%)",
        }}
      />
      <div
        className="absolute right-[12%] top-[32%] h-[26rem] w-[26rem] rounded-full opacity-35 blur-[100px]"
        style={{
          background:
            "radial-gradient(circle, rgba(138,180,255,0.22) 0%, rgba(138,180,255,0) 70%)",
        }}
      />
    </div>
  );
}

export function Hero({ ready }: HeroProps) {
  const tier = useDeviceTier();
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();

  // The hero content drifts up and dims as you leave it; the 3D object
  // stays behind, shrinking rather than disappearing.
  const contentY = useTransform(scrollYProgress, [0, 0.18], ["0%", "-18%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.14], [1, 0]);

  const showScene = tier === "high" && ready && !reduced;

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden pb-8 pt-28 md:pb-12 md:pt-32"
    >
      {showScene ? (
        <Suspense fallback={<AmbientFallback />}>
          <Scene />
        </Suspense>
      ) : (
        <AmbientFallback />
      )}

      <motion.div
        className="shell relative z-10 flex flex-1 flex-col justify-center"
        style={reduced ? undefined : { y: contentY, opacity: contentOpacity }}
      >
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, ease: EASE_EXPO, delay: 0.1 }}
        >
          <span className="label text-accent">&#10216;001&#10217;</span>
          <span className="label">
            {profile.role} — {profile.company}
          </span>
        </motion.div>

        <h1 className="mt-6 font-display text-[length:var(--text-display)] text-paper md:mt-8">
          <span className="sr-only">
            {profile.name} — {profile.headline.map((w) => w.text).join(" ")}
          </span>

          {profile.headline.map((word, i) => (
            <span key={word.text} className="mask-line" aria-hidden>
              <motion.span
                className={`block ${word.italic ? "italic text-accent" : ""}`}
                initial={{ y: "110%" }}
                animate={ready ? { y: "0%" } : {}}
                transition={{
                  duration: 1.1,
                  ease: EASE_EXPO,
                  delay: 0.25 + i * 0.08,
                }}
              >
                {word.text}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          className="mt-8 max-w-xl text-base leading-relaxed text-paper-dim md:mt-10 md:text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: EASE_EXPO, delay: 0.7 }}
        >
          {profile.intro}
        </motion.p>

        <motion.div
          className="mt-10 flex flex-wrap items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: EASE_EXPO, delay: 0.85 }}
        >
          <Magnetic strength={12}>
            <a
              href="#work"
              data-cursor="link"
              className="group inline-flex items-center gap-3 bg-paper px-6 py-3.5 font-mono text-[10px] uppercase tracking-[0.18em] text-void transition-colors hover:bg-accent"
            >
              Selected Work
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                &#8594;
              </span>
            </a>
          </Magnetic>

          <Magnetic strength={12}>
            <a
              href="#contact"
              data-cursor="link"
              className="inline-flex items-center gap-3 border border-paper/25 px-6 py-3.5 font-mono text-[10px] uppercase tracking-[0.18em] text-paper transition-colors hover:border-accent hover:text-accent"
            >
              Get in touch
            </a>
          </Magnetic>
        </motion.div>
      </motion.div>

      <motion.div
        className="shell relative z-10 flex flex-wrap items-end justify-between gap-4 border-t border-line pt-5"
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : {}}
        transition={{ duration: 0.9, ease: EASE_EXPO, delay: 1 }}
      >
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <span className="label">{profile.location}</span>
          <Clock className="label" />
          {profile.availableForWork && (
            <span className="label flex items-center gap-2 text-paper">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
              </span>
              Open to work
            </span>
          )}
        </div>

        <span className="label hidden sm:block">Scroll &#8595;</span>
      </motion.div>
    </section>
  );
}
