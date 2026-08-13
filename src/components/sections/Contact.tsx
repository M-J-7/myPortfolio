import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { profile } from "@/data/profile";
import { Magnetic } from "@/components/primitives/Magnetic";
import { MaskReveal } from "@/components/primitives/Reveal";
import { EASE_EXPO } from "@/lib/motion";

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID as string | undefined;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string | undefined;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string | undefined;

const isConfigured = Boolean(SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY);

// Loud in dev, silent in production — a blank form that quietly refuses to send
// is exactly how this went unnoticed before.
if (import.meta.env.DEV && !isConfigured) {
  const missing = [
    !SERVICE_ID && "VITE_EMAILJS_SERVICE_ID",
    !TEMPLATE_ID && "VITE_EMAILJS_TEMPLATE_ID",
    !PUBLIC_KEY && "VITE_EMAILJS_PUBLIC_KEY",
  ].filter(Boolean);
  console.warn(
    `[contact] EmailJS not configured — missing ${missing.join(", ")}. ` +
      `Copy .env.example to .env and fill it in, then restart the dev server ` +
      `(Vite inlines VITE_* at build time, so a hot reload is not enough).`,
  );
}

/**
 * EmailJS rejects with `EmailJSResponseStatus`, a plain class that does **not**
 * extend Error — so an `instanceof Error` check misses it entirely and the real
 * reason ("The service ID is invalid", "The template ID not found") is lost.
 * Read `status`/`text` off it directly instead.
 */
function describeSendError(err: unknown): string {
  if (typeof err === "object" && err !== null && "text" in err) {
    const { status, text } = err as { status?: number; text?: string };
    // The SDK uses status 0 for "never left the browser".
    if (!status) {
      return "Couldn't reach the mail service — check your connection and try again.";
    }
    return `Couldn't send that (${status}) — ${text}`;
  }
  if (err instanceof Error) return `Couldn't send that — ${err.message}`;
  return "Couldn't send that. Reach me on LinkedIn instead?";
}

type Status = "idle" | "sending" | "sent" | "error";

const fieldClass =
  "w-full border-b border-line bg-transparent py-3 text-paper placeholder:text-paper-faint transition-colors focus:border-accent focus:outline-none";

export function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    // Honeypot: real people never fill a field they cannot see.
    if (data.get("company")) {
      setStatus("sent");
      return;
    }

    if (!isConfigured) {
      setStatus("error");
      setError(
        "The form isn't connected yet. Reach me on LinkedIn in the meantime.",
      );
      return;
    }

    setStatus("sending");
    setError(null);

    try {
      await emailjs.send(
        SERVICE_ID!,
        TEMPLATE_ID!,
        {
          name: data.get("name"),
          email: data.get("email"),
          query: data.get("query"),
        },
        { publicKey: PUBLIC_KEY! },
      );
      setStatus("sent");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(describeSendError(err));
      // Keep the raw object around — the message shown to visitors is
      // deliberately short, but the console should have everything.
      console.error("[contact] EmailJS send failed:", err);
    }
  };

  return (
    <section id="contact" className="shell scroll-mt-24 py-24 md:py-36">
      <div className="grid gap-16 md:grid-cols-12 md:gap-20">
        <div className="md:col-span-6">
          <div className="flex items-baseline gap-4">
            <span className="label text-accent">06</span>
            <span className="label">Contact</span>
          </div>

          <h2 className="mt-8 font-display text-[length:var(--text-headline)] text-paper">
            <MaskReveal as="div">Let&#8217;s build</MaskReveal>
            <MaskReveal as="div" delay={0.08}>
              <span className="italic text-accent">something.</span>
            </MaskReveal>
          </h2>

          <p className="mt-8 max-w-md text-base leading-relaxed text-paper-dim">
            I&#8217;m open to roles and interesting problems — backend systems,
            full-stack product work, or anything where the hard part is making it
            hold up in production.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Magnetic strength={12}>
              <a
                href={profile.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="link"
                className="group inline-flex items-center gap-3 bg-paper px-6 py-3.5 font-mono text-[10px] uppercase tracking-[0.18em] text-void transition-colors hover:bg-accent"
              >
                Message on LinkedIn
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  &#8599;
                </span>
              </a>
            </Magnetic>

            <Magnetic strength={12}>
              <a
                href={profile.links.resume}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="link"
                className="inline-flex items-center gap-3 border border-paper/25 px-6 py-3.5 font-mono text-[10px] uppercase tracking-[0.18em] text-paper transition-colors hover:border-accent hover:text-accent"
              >
                Résumé
              </a>
            </Magnetic>
          </div>

          <div className="mt-12 flex items-center gap-6 text-xl text-paper-dim">
            {[
              { href: profile.links.github, label: "GitHub", Icon: FaGithub },
              { href: profile.links.linkedin, label: "LinkedIn", Icon: FaLinkedin },
              { href: profile.links.x, label: "X", Icon: FaSquareXTwitter },
            ].map(({ href, label, Icon }) => (
              <Magnetic key={label} strength={10}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  data-cursor="link"
                  className="block transition-colors hover:text-accent"
                >
                  <Icon />
                </a>
              </Magnetic>
            ))}
          </div>
        </div>

        <div className="md:col-span-6">
          {status === "sent" ? (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE_EXPO }}
              className="flex h-full flex-col justify-center border border-line p-10"
            >
              <span className="label text-accent">Sent</span>
              <p className="mt-4 font-display text-3xl leading-tight text-paper">
                Thanks — that reached me.
              </p>
              <p className="mt-3 text-sm text-paper-dim">
                I&#8217;ll get back to you shortly.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
              {/* Honeypot — off-screen, not display:none, so bots still fill it. */}
              <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
                <label htmlFor="company">Company</label>
                <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
              </div>

              <div>
                <label htmlFor="name" className="label block">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="Your name"
                  className={fieldClass}
                />
              </div>

              <div>
                <label htmlFor="email" className="label block">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@company.com"
                  className={fieldClass}
                />
              </div>

              <div>
                <label htmlFor="query" className="label block">
                  Message
                </label>
                <textarea
                  id="query"
                  name="query"
                  required
                  rows={5}
                  placeholder="What are you building?"
                  className={`${fieldClass} resize-none`}
                />
              </div>

              {error && (
                <p role="alert" className="text-sm text-accent">
                  {error}
                </p>
              )}

              <Magnetic strength={8} className="self-start">
                <button
                  type="submit"
                  disabled={status === "sending"}
                  data-cursor="link"
                  className="group inline-flex items-center gap-3 border border-paper/25 px-8 py-4 font-mono text-[10px] uppercase tracking-[0.18em] text-paper transition-colors hover:border-accent hover:bg-accent hover:text-void disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {status === "sending" ? "Sending…" : "Send message"}
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    &#8594;
                  </span>
                </button>
              </Magnetic>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
