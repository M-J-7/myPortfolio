import { motion } from "framer-motion";
import { profile } from "@/data/profile";
import { SectionHeading } from "@/components/primitives/SectionHeading";
import { ScrollLitText } from "@/components/primitives/ScrollLitText";
import { CountUp } from "@/components/primitives/CountUp";
import { Clock } from "@/components/primitives/Clock";
import { AsciiField } from "@/components/visuals/AsciiField";
import { fadeUp, inView } from "@/lib/motion";

/**
 * Renders `*asterisk*` spans as italic emphasis. Italic in a text serif is the
 * oldest trick in editorial typography and it costs one split — worth far more
 * than another colour or weight would be here.
 */
function withEmphasis(text: string) {
  return text.split(/(\*[^*]+\*)/g).map((part, i) =>
    part.startsWith("*") && part.endsWith("*") && part.length > 2 ? (
      <em key={i} className="italic text-paper">
        {part.slice(1, -1)}
      </em>
    ) : (
      part
    ),
  );
}

/** Rows with an empty value hide themselves rather than shipping a blank. */
const currentlyRows = [
  { key: "Building", value: profile.currently.building },
  { key: "Learning", value: profile.currently.learning },
  { key: "Playing", value: profile.currently.playing },
].filter((row) => row.value.length > 0);

export function About() {
  return (
    <section id="about" className="shell scroll-mt-24 py-24 md:py-36">
      {/* No `title` here — the scroll-lit statement below is the real heading. */}
      <SectionHeading index="03" label="About" />

      <h2 className="mt-10 md:mt-14">
        <ScrollLitText
          text={profile.aboutLead}
          highlight={["inherit"]}
          className="max-w-5xl font-display text-[length:var(--text-headline)] leading-[1.04] tracking-[-0.02em]"
        />
      </h2>

      {/* Editorial rail: mono annotations in the gutter, serif copy alongside. */}
      <div className="mt-20 border-t border-line md:mt-28">
        {profile.about.map((paragraph, i) => {
          const note = profile.aboutNotes[i];
          return (
            <motion.div
              key={i}
              custom={0}
              variants={fadeUp}
              {...inView}
              className="grid gap-3 border-b border-line py-8 md:grid-cols-12 md:gap-10 md:py-10"
            >
              <div className="md:col-span-3">
                {note?.href ? (
                  <a
                    href={note.href}
                    data-cursor="link"
                    className="label whitespace-pre-line text-accent transition-colors hover:text-paper"
                  >
                    {note.text}
                  </a>
                ) : (
                  <span className="label whitespace-pre-line">{note?.text}</span>
                )}
              </div>

              <p className="font-text text-lg leading-[1.65] text-paper-dim md:col-span-9 md:text-xl">
                {withEmphasis(paragraph)}
              </p>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-16 grid gap-12 md:mt-20 md:grid-cols-12 md:gap-16">
        {/* Generative monogram — resolves out of noise as this scrolls in. */}
        <div className="md:col-span-5">
          <AsciiField className="aspect-4/3 w-full overflow-hidden border border-line bg-raise/40" />
          <div className="mt-4 flex items-center justify-between">
            <span className="label">{profile.location}</span>
            <span className="label">{profile.pronouns}</span>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-12 md:col-span-7">
          <div>
            <span className="label text-accent">Currently</span>
            <dl className="mt-6">
              {currentlyRows.map((row) => (
                <div
                  key={row.key}
                  className="flex flex-wrap items-baseline gap-x-6 gap-y-1 border-t border-line py-3.5"
                >
                  <dt className="label w-24 shrink-0">{row.key}</dt>
                  <dd className="font-text text-base text-paper md:text-lg">
                    {row.value}
                  </dd>
                </div>
              ))}
              <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1 border-y border-line py-3.5">
                <dt className="label w-24 shrink-0">Local</dt>
                <dd className="flex items-center gap-3 font-mono text-sm text-paper">
                  <Clock />
                  {profile.availableForWork && (
                    <span className="flex items-center gap-2 text-paper-dim">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
                      </span>
                      open to work
                    </span>
                  )}
                </dd>
              </div>
            </dl>
          </div>

          {/* Hairline band, not boxed cells — Stack already owns that pattern. */}
          <div className="grid grid-cols-1 sm:grid-cols-3 sm:divide-x sm:divide-line">
            {profile.metrics.map((metric, i) => (
              <div
                key={metric.label}
                className={`flex flex-col border-t border-line py-5 sm:border-t-0 sm:py-0 ${
                  i === 0 ? "sm:pr-6" : "sm:px-6"
                }`}
              >
                {/* Set large: these are single- and double-digit figures, and
                    at a smaller size a lone "3" reads as an afterthought.
                    tabular-nums keeps 1- and 2-digit values on a shared width. */}
                <CountUp
                  value={metric.value}
                  suffix={metric.suffix}
                  className="font-display text-6xl leading-none tabular-nums text-accent md:text-7xl"
                />
                <p className="mt-3 flex-1 text-xs leading-relaxed text-paper-dim">
                  {metric.label}
                </p>
                {/* Provenance. A number with an employer and year attached
                    cannot be misread the way a bare "114" was. */}
                <p className="label mt-3 text-[9px] text-paper-faint/80">
                  {metric.source}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
