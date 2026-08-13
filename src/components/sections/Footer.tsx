import { motion } from "framer-motion";
import { profile } from "@/data/profile";
import { Clock } from "@/components/primitives/Clock";
import { EASE_EXPO } from "@/lib/motion";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-line pt-16">
      <div className="shell flex flex-wrap items-start justify-between gap-8 pb-16">
        <div className="flex flex-col gap-2">
          <span className="label">Local time</span>
          <Clock className="font-mono text-sm text-paper" />
        </div>

        <div className="flex flex-col gap-2">
          <span className="label">Elsewhere</span>
          <div className="flex flex-col gap-1 text-sm text-paper-dim">
            <a
              href={profile.links.github}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="link"
              className="transition-colors hover:text-accent"
            >
              GitHub
            </a>
            <a
              href={profile.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="link"
              className="transition-colors hover:text-accent"
            >
              LinkedIn
            </a>
            <a
              href={profile.links.x}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="link"
              className="transition-colors hover:text-accent"
            >
              X
            </a>
          </div>
        </div>

        {/* Colophon — the detail that signals the type was chosen, not defaulted. */}
        <div className="flex max-w-xs flex-col gap-2">
          <span className="label">Colophon</span>
          <p className="text-xs leading-relaxed text-paper-faint">
            Set in Instrument Serif, Inter and JetBrains Mono. Built with React,
            Vite and three.js. Designed and coded in Delhi.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <span className="label">&#169; {year}</span>
          <a
            href="#top"
            data-cursor="link"
            className="group inline-flex items-center gap-2 text-sm text-paper-dim transition-colors hover:text-accent"
          >
            Back to top
            <span className="transition-transform duration-300 group-hover:-translate-y-1">
              &#8593;
            </span>
          </a>
        </div>
      </div>

      {/* Oversized wordmark, clipped by the bottom of the page. */}
      <motion.div
        aria-hidden
        initial={{ y: 40, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, margin: "-5% 0px" }}
        transition={{ duration: 1.2, ease: EASE_EXPO }}
        className="shell"
      >
        <div className="translate-y-[18%] select-none font-display text-[clamp(4rem,20vw,18rem)] leading-[0.8] tracking-[-0.04em] text-paper/[0.07]">
          {profile.name}
        </div>
      </motion.div>
    </footer>
  );
}
