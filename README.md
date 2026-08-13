# Mihir Jha — Portfolio

Personal portfolio. Dark editorial design with scroll-driven WebGL, a cinematic
intro and a magnetic cursor.

**Stack:** React 19 · TypeScript · Vite 6 · Tailwind CSS 4 · Framer Motion ·
three.js / react-three-fiber · Lenis

---

## Running it

```bash
npm install
npm run dev        # http://localhost:5173
```

```bash
npm run build      # production build to dist/
npm run preview    # serve the built output
npx tsc --noEmit   # typecheck
```

---

## Contact form

The form posts through [EmailJS](https://dashboard.emailjs.com). Copy the
template and fill in your own IDs:

```bash
cp .env.example .env
```

| Variable | Where to find it |
| --- | --- |
| `VITE_EMAILJS_SERVICE_ID` | Email Services |
| `VITE_EMAILJS_TEMPLATE_ID` | Email Templates |
| `VITE_EMAILJS_PUBLIC_KEY` | Account → API Keys |

The template must accept `name`, `email` and `query` parameters.

Without these the form still renders, but tells visitors to use LinkedIn
instead of failing silently. **These are build-time variables — anything in a
`VITE_*` var ships to the browser.** That is fine for an EmailJS public key
(it is designed to be public) but never put a private secret here.

---

## Editing content

All copy lives in `src/data/` — no text is hardcoded in components.

| File | Contents |
| --- | --- |
| `profile.ts` | Name, headline, intro, about paragraphs, links, education |
| `experience.ts` | Work history |
| `projects.ts` | Selected work — the Work section renders this in order |
| `skills.ts` | Stack groups and the two marquee rows |
| `certifications.ts` | Certifications |

**Adding a project:** append to the array in `projects.ts`. `image` is
optional — without one the card renders a generated typographic plate keyed to
its index, so you never need a screenshot to ship.

---

## Design system

Tokens are defined once in the `@theme` block of `src/styles/index.css` and
consumed as normal Tailwind utilities (`bg-void`, `text-paper`, `border-line`,
`text-accent`).

| Token | Value | Role |
| --- | --- | --- |
| `--color-void` | `#08090A` | page ground |
| `--color-raise` | `#0F1113` | elevated surfaces |
| `--color-line` | `#1C1F23` | hairlines |
| `--color-paper` | `#F4F1EA` | primary text — warm, never pure white |
| `--color-paper-dim` | `#8A8781` | secondary text |
| `--color-paper-faint` | `#55534F` | mono labels |
| `--color-accent` | `#C7F94E` | one accent, used sparingly |

Type: **Instrument Serif** (display) · **Inter** (body) · **JetBrains Mono**
(labels), all self-hosted through `@fontsource` — no CDN request, no layout
shift.

Tailwind 4 is CSS-first: there is no `tailwind.config.js` and no
`postcss.config.js`. Everything is in the stylesheet.

---

## Performance and accessibility

- **three.js is code-split** into its own chunk and lazy-imported. It is never
  in the entry payload, and only mounts after the intro finishes on devices
  that pass `useDeviceTier()`.
- `useDeviceTier()` (`src/lib/`) probes WebGL support, pointer type, core count
  and the GPU renderer string. Phones, weak GPUs and software renderers get a
  CSS gradient fallback instead of the canvas.
- The render loop **stops** when the canvas scrolls off screen or the tab is
  hidden.
- `prefers-reduced-motion` disables the intro, the cursor, Lenis, the marquee
  and the canvas. Content appears immediately.
- The custom cursor only activates for `pointer: fine`, and the native cursor
  is only hidden once ours is confirmed running.
- Keyboard: skip link, visible `:focus-visible` rings, project rows are real
  `<button>`s with `aria-expanded`.

---

## Deploying

Static build — any host works.

**Vercel / Netlify:** build `npm run build`, publish `dist`. Add the three
`VITE_EMAILJS_*` variables in the dashboard.

**GitHub Pages project site:** set `base: "/<repo-name>/"` in `vite.config.ts`
first, or asset paths will 404.

Update the absolute URLs in `index.html` (`og:url`, `og:image`, canonical) to
the real domain — social scrapers do not resolve relative paths.
