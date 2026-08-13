/**
 * Fixed film-grain wash over the whole page. This is the single cheapest
 * thing that separates "a dark theme" from "an editorial dark theme" —
 * it breaks up the flat black and gives the gradients something to sit on.
 *
 * Inline SVG turbulence, so there's no image request and nothing to load.
 * Hidden under reduced motion via the `.grain` rule in index.css.
 */
export function Grain() {
  return (
    <div
      aria-hidden
      className="grain pointer-events-none fixed inset-0 z-[90] opacity-[0.035] mix-blend-overlay"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
      }}
    />
  );
}

/**
 * The masked grid from the original site, restyled: a faint rule grid that
 * fades out radially so it reads as texture near the top and disappears
 * before it competes with the content below.
 */
export function GridField() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-void">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(244,241,234,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(244,241,234,0.045) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 0%, #000 55%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 60% at 50% 0%, #000 55%, transparent 100%)",
        }}
      />
    </div>
  );
}
