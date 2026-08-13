import { motion } from "framer-motion";
import { experiences } from "@/data/experience";
import { profile } from "@/data/profile";
import { SectionHeading } from "@/components/primitives/SectionHeading";
import { fadeUp, inView, EASE_EXPO } from "@/lib/motion";

export function Experience() {
  return (
    <section id="experience" className="shell scroll-mt-24 py-24 md:py-36">
      <SectionHeading
        index="02"
        label="Experience"
        title={
          <>
            Where I&#8217;ve <span className="italic text-accent">worked</span>
          </>
        }
        className="max-w-3xl"
      />

      <div className="mt-16 md:mt-24">
        {experiences.map((job) => (
          <motion.article
            key={job.id}
            // Each entry reveals on its own as it enters — no index stagger,
            // or the last card would sit blank for a second when linked directly.
            custom={0}
            variants={fadeUp}
            {...inView}
            className="grid gap-6 border-t border-line py-10 md:grid-cols-12 md:gap-10 md:py-14"
          >
            {/* Sticky year rail — stays with you while the entry scrolls past. */}
            <div className="md:col-span-3">
              <div className="md:sticky md:top-28">
                <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
                  {job.start} &#8212; {job.end}
                </div>
                <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-paper-faint">
                  {job.kind} &#183; {job.location}
                </div>
              </div>
            </div>

            <div className="md:col-span-9">
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <h3 className="font-display text-3xl leading-none text-paper md:text-4xl">
                  {job.company}
                </h3>
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-paper-dim">
                  {job.role}
                </span>
              </div>

              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-paper-dim md:text-base">
                {job.summary}
              </p>

              <ul className="mt-6 space-y-2.5">
                {job.highlights.map((point, j) => (
                  <motion.li
                    key={point}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-10% 0px" }}
                    transition={{
                      duration: 0.6,
                      ease: EASE_EXPO,
                      delay: 0.1 + j * 0.07,
                    }}
                    className="flex gap-3 text-sm leading-relaxed text-paper-dim"
                  >
                    <span className="mt-2 h-px w-4 shrink-0 bg-paper-faint" />
                    {point}
                  </motion.li>
                ))}
              </ul>

              <div className="mt-6 flex flex-wrap gap-2">
                {job.stack.map((tech) => (
                  <span
                    key={tech}
                    className="border border-line px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-paper-faint transition-colors hover:border-accent/40 hover:text-paper-dim"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </motion.article>
        ))}

        {/* Education closes the timeline. */}
        <motion.article
          variants={fadeUp}
          {...inView}
          className="grid gap-6 border-y border-line py-10 md:grid-cols-12 md:gap-10 md:py-14"
        >
          <div className="md:col-span-3">
            <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
              {profile.education.start} &#8212; {profile.education.end}
            </div>
            <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-paper-faint">
              Education
            </div>
          </div>

          <div className="md:col-span-9">
            <h3 className="font-display text-3xl leading-none text-paper md:text-4xl">
              {profile.education.school}
            </h3>
            <p className="mt-3 text-sm text-paper-dim md:text-base">
              {profile.education.degree} &#183; {profile.education.faculty}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {profile.education.roles.map((role) => (
                <span
                  key={role}
                  className="border border-line px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-paper-faint"
                >
                  {role}
                </span>
              ))}
            </div>
          </div>
        </motion.article>
      </div>
    </section>
  );
}
