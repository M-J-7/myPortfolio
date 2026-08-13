import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { profile, navItems } from "@/data/profile";
import { Magnetic } from "@/components/primitives/Magnetic";
import { EASE_EXPO } from "@/lib/motion";

const socials = [
  { href: profile.links.github, label: "GitHub", Icon: FaGithub },
  { href: profile.links.linkedin, label: "LinkedIn", Icon: FaLinkedin },
  { href: profile.links.x, label: "X", Icon: FaSquareXTwitter },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Trap the page behind the mobile sheet, and let Escape close it.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[120] focus:bg-accent focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:uppercase focus:tracking-widest focus:text-void"
      >
        Skip to content
      </a>

      <motion.header
        className={`fixed inset-x-0 top-0 z-[80] transition-colors duration-500 ${
          scrolled ? "bg-void/70 backdrop-blur-xl" : "bg-transparent"
        }`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: EASE_EXPO, delay: 0.2 }}
      >
        <div
          className={`shell flex items-center justify-between transition-all duration-500 ${
            scrolled ? "py-3" : "py-5"
          }`}
        >
          <a
            href="#top"
            className="font-display text-2xl leading-none text-paper transition-colors hover:text-accent"
            aria-label={`${profile.name} — back to top`}
          >
            M<span className="italic text-paper-dim">j</span>
          </a>

          <nav aria-label="Sections" className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                data-cursor="link"
                className="group flex items-baseline gap-1.5 text-sm text-paper-dim transition-colors hover:text-paper"
              >
                <span className="font-mono text-[10px] text-paper-faint transition-colors group-hover:text-accent">
                  {item.index}
                </span>
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-4 text-lg text-paper-dim sm:flex">
              {socials.map(({ href, label, Icon }) => (
                <Magnetic key={label} strength={8}>
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

            <Magnetic strength={10} className="hidden sm:block">
              <a
                href={profile.links.resume}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="link"
                className="border border-paper/25 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-paper transition-colors hover:border-accent hover:bg-accent hover:text-void"
              >
                Résumé
              </a>
            </Magnetic>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 md:hidden"
            >
              <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
              <span
                className={`h-px w-5 bg-paper transition-transform duration-300 ${
                  open ? "translate-y-[3.5px] rotate-45" : ""
                }`}
              />
              <span
                className={`h-px w-5 bg-paper transition-transform duration-300 ${
                  open ? "-translate-y-[3.5px] -rotate-45" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav"
            className="fixed inset-0 z-[79] flex flex-col justify-center bg-void px-6 md:hidden"
            initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
            transition={{ duration: 0.6, ease: EASE_EXPO }}
          >
            <nav aria-label="Sections" className="flex flex-col gap-2">
              {navItems.map((item, i) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.06, duration: 0.5, ease: EASE_EXPO }}
                  className="flex items-baseline gap-4 border-b border-line py-4 font-display text-4xl text-paper"
                >
                  <span className="font-mono text-xs text-paper-faint">{item.index}</span>
                  {item.label}
                </motion.a>
              ))}
            </nav>

            <div className="mt-10 flex items-center gap-6 text-xl text-paper-dim">
              {socials.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                >
                  <Icon />
                </a>
              ))}
              <a
                href={profile.links.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent"
              >
                Résumé
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
