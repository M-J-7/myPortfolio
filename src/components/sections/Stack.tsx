import { motion } from "framer-motion";
import { skillGroups, marqueeRows } from "@/data/skills";
import { certifications } from "@/data/certifications";
import { SectionHeading } from "@/components/primitives/SectionHeading";
import { Marquee } from "@/components/primitives/Marquee";
import { fadeUp, inView } from "@/lib/motion";

export function Stack() {
  return (
    <section id="stack" className="scroll-mt-24 py-24 md:py-36">
      <div className="shell">
        <SectionHeading
          index="04"
          label="Stack"
          title={
            <>
              What I <span className="italic text-accent">build</span> with
            </>
          }
          className="max-w-3xl"
        />
      </div>

      {/* Two bands drifting in opposite directions, both reacting to scroll velocity. */}
      <div className="my-16 space-y-3 md:my-24 md:space-y-5">
        <Marquee
          items={marqueeRows[0]}
          baseVelocity={1.6}
          className="font-display text-[clamp(2.5rem,7vw,6rem)] leading-none text-paper"
        />
        <Marquee
          items={marqueeRows[1]}
          baseVelocity={-1.6}
          className="font-display text-[clamp(2.5rem,7vw,6rem)] italic leading-none text-paper-faint"
        />
      </div>

      <div className="shell">
        <div className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {skillGroups.map((group, i) => (
            <motion.div
              key={group.label}
              custom={i}
              variants={fadeUp}
              {...inView}
              className="bg-void p-6 md:p-8"
            >
              <div className="flex items-baseline gap-3">
                <span className="label text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="label">{group.label}</span>
              </div>

              <ul className="mt-6 space-y-2.5">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="text-sm text-paper-dim transition-colors hover:text-paper"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Certifications ride along under the stack rather than owning a section. */}
        <div className="mt-20 md:mt-28">
          <div className="flex items-baseline gap-4">
            <span className="label text-accent">05</span>
            <span className="label">Certifications</span>
          </div>

          <div className="mt-8 grid gap-px border border-line bg-line md:grid-cols-3">
            {certifications.map((cert, i) => (
              <motion.article
                key={cert.id}
                custom={i}
                variants={fadeUp}
                {...inView}
                className="group bg-void p-6 transition-colors hover:bg-raise md:p-8"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent">
                    {cert.issuer}
                  </span>
                  <span className="font-mono text-[10px] text-paper-faint">
                    {cert.date}
                  </span>
                </div>

                <h3 className="mt-4 font-display text-2xl leading-tight text-paper">
                  {cert.title}
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-paper-dim">
                  {cert.description}
                </p>

                <div className="mt-5 flex flex-wrap gap-1.5">
                  {cert.stack.map((tech) => (
                    <span
                      key={tech}
                      className="border border-line px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-paper-faint"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {cert.credentialId && (
                  <p className="mt-5 font-mono text-[9px] uppercase tracking-[0.14em] text-paper-faint">
                    ID {cert.credentialId}
                  </p>
                )}
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
