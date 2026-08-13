import { useEffect, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { projects } from "@/data/projects";
import type { Project } from "@/types";
import { SectionHeading } from "@/components/primitives/SectionHeading";
import { EASE_EXPO } from "@/lib/motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

/** Deterministic hue per project, so each plate is distinct but the set stays coherent. */
const plateGradient = (index: number) => {
  const hue = 68 + index * 42;
  return `radial-gradient(120% 120% at 20% 15%, hsl(${hue} 70% 22% / 0.9) 0%, #0f1113 55%, #08090a 100%)`;
};

/**
 * The floating preview that trails the cursor across the project list.
 * One element for the whole list — it swaps content on hover rather than
 * mounting a plate per row.
 */
function HoverPlate({ active }: { active: Project | null }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const px = useSpring(x, { stiffness: 220, damping: 26, mass: 0.5 });
  const py = useSpring(y, { stiffness: 220, damping: 26, mass: 0.5 });

  // Track the pointer at the window level so the plate keeps following even
  // as the pointer crosses between rows.
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [x, y]);

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-40 hidden lg:block"
      style={{ x: px, y: py }}
    >
      <AnimatePresence>
        {active && (
          <motion.div
            key={active.id}
            initial={{ opacity: 0, scale: 0.85, rotate: -4 }}
            animate={{ opacity: 1, scale: 1, rotate: -2 }}
            exit={{ opacity: 0, scale: 0.85, rotate: -4 }}
            transition={{ duration: 0.4, ease: EASE_EXPO }}
            className="relative -translate-x-1/2 -translate-y-1/2 overflow-hidden border border-line"
            style={{ width: 380, height: 250 }}
          >
            {active.image ? (
              <img
                src={active.image}
                alt=""
                width={380}
                height={250}
                className="h-full w-full object-cover"
              />
            ) : (
              <div
                className="flex h-full w-full flex-col justify-between p-6"
                style={{ background: plateGradient(Number(active.index)) }}
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
                  {active.index} / {active.year}
                </span>
                <span className="font-display text-3xl leading-[0.95] text-paper">
                  {active.title}
                </span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ProjectRow({
  project,
  isOpen,
  onToggle,
  onHover,
}: {
  project: Project;
  isOpen: boolean;
  onToggle: () => void;
  onHover: (p: Project | null) => void;
}) {
  return (
    <div
      className="group border-b border-line"
      onPointerEnter={() => onHover(project)}
      onPointerLeave={() => onHover(null)}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`project-${project.id}`}
        data-cursor="media"
        data-cursor-label={isOpen ? "Close" : "View"}
        className="flex w-full items-baseline gap-4 py-7 text-left md:gap-8 md:py-10"
      >
        <span className="font-mono text-[11px] text-paper-faint transition-colors group-hover:text-accent">
          {project.index}
        </span>

        <span className="flex-1">
          <span className="block font-display text-[length:var(--text-title)] leading-[0.95] text-paper transition-colors duration-500 group-hover:text-accent">
            {project.title}
          </span>
          <span className="mt-2 block max-w-2xl text-sm leading-relaxed text-paper-dim">
            {project.blurb}
          </span>
        </span>

        <span className="hidden shrink-0 items-center gap-6 md:flex">
          <span className="font-mono text-[11px] text-paper-faint">{project.year}</span>
          <span
            className={`text-lg text-paper-dim transition-transform duration-500 ${
              isOpen ? "rotate-45" : "group-hover:rotate-90"
            }`}
          >
            +
          </span>
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`project-${project.id}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.6, ease: EASE_EXPO }}
            className="overflow-hidden"
          >
            <div className="grid gap-8 pb-10 md:grid-cols-12 md:gap-12 md:pl-16">
              <p className="text-sm leading-relaxed text-paper-dim md:col-span-7 md:text-base">
                {project.detail}
              </p>

              <div className="flex flex-col gap-6 md:col-span-5">
                <div>
                  <span className="label">Stack</span>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {project.stack.map((tech) => (
                      <span
                        key={tech}
                        className="border border-line px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-paper-dim"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-5">
                  {project.live && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cursor="link"
                      className="group/link inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-paper transition-colors hover:text-accent"
                    >
                      Visit site
                      <span className="transition-transform group-hover/link:translate-x-1">
                        &#8599;
                      </span>
                    </a>
                  )}
                  {project.repo && (
                    <a
                      href={project.repo}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cursor="link"
                      className="group/link inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-paper transition-colors hover:text-accent"
                    >
                      Source
                      <span className="transition-transform group-hover/link:translate-x-1">
                        &#8599;
                      </span>
                    </a>
                  )}
                  {project.isPrivate && (
                    <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-paper-faint">
                      <span className="h-1 w-1 rounded-full bg-paper-faint" />
                      Enterprise — no public repo
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Work() {
  const [openId, setOpenId] = useState<string | null>(projects[0]?.id ?? null);
  const [hovered, setHovered] = useState<Project | null>(null);
  const reduced = useReducedMotion();

  return (
    <section id="work" className="shell scroll-mt-24 py-24 md:py-36">
      <SectionHeading
        index="01"
        label="Selected Work"
        title={
          <>
            Things I&#8217;ve <span className="italic text-accent">shipped</span>
          </>
        }
        className="max-w-3xl"
      />

      <div className="mt-16 md:mt-24">
        {projects.map((project) => (
          <ProjectRow
            key={project.id}
            project={project}
            isOpen={openId === project.id}
            onToggle={() => setOpenId(openId === project.id ? null : project.id)}
            onHover={reduced ? () => {} : setHovered}
          />
        ))}
      </div>

      {!reduced && <HoverPlate active={openId ? null : hovered} />}
    </section>
  );
}
