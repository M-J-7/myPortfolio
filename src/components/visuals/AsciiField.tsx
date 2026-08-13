import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useDeviceTier } from "@/lib/useDeviceTier";

/** Density ramp — sparse to solid. Index maps directly from field strength. */
const RAMP = " ·:-=+*#%@";
const CELL = 11;
const MONOGRAM = "Mj";

/** Cheap value noise. No dependency, deterministic, good enough for texture. */
function hash(x: number, y: number, seed: number) {
  const n = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453;
  return n - Math.floor(n);
}

function smoothNoise(x: number, y: number, t: number) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);

  const a = hash(xi, yi, t);
  const b = hash(xi + 1, yi, t);
  const c = hash(xi, yi + 1, t);
  const d = hash(xi + 1, yi + 1, t);

  return a * (1 - u) * (1 - v) + b * u * (1 - v) + c * (1 - u) * v + d * u * v;
}

/**
 * A character grid that resolves out of noise into Mihir's monogram as the
 * section scrolls into view, and brightens under the pointer.
 *
 * Replaces the stock photograph that used to sit here. Nothing is fetched and
 * nothing is licensed — the image is computed, which also means it can respond
 * to the reader in a way a JPEG cannot.
 *
 * Cost control mirrors the WebGL scene: the loop only runs while the canvas is
 * on screen and the tab is focused, and devices that shouldn't be animating a
 * per-frame character grid get a single resolved frame instead.
 */
export function AsciiField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const tier = useDeviceTier();

  // Live values the draw loop reads without re-subscribing to React state.
  const reveal = useRef(0);
  const pointer = useRef({ x: -999, y: -999 });

  const animate = !reduced && tier === "high";

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let cols = 0;
    let rows = 0;
    let mask: Float32Array = new Float32Array(0);
    let raf = 0;
    let running = false;
    let disposed = false;

    /**
     * Rasterise the monogram once at grid resolution. Drawing the glyph to an
     * offscreen canvas and reading its alpha is far simpler — and far more
     * faithful to the actual typeface — than trying to describe the letterforms
     * with maths.
     */
    const buildMask = () => {
      const off = document.createElement("canvas");
      off.width = cols;
      off.height = rows;
      const octx = off.getContext("2d");
      if (!octx) return;

      octx.clearRect(0, 0, cols, rows);
      octx.fillStyle = "#fff";
      octx.textAlign = "center";
      octx.textBaseline = "middle";

      // Character cells are taller than wide, so the glyph is drawn into a
      // squashed grid and comes out correctly proportioned on screen.
      const size = Math.min(cols * 1.05, rows * 1.75);
      octx.font = `400 ${size}px "Instrument Serif", Georgia, serif`;
      octx.setTransform(1, 0, 0, 0.62, 0, rows * 0.5);
      octx.fillText(MONOGRAM, cols / 2, 0);

      const data = octx.getImageData(0, 0, cols, rows).data;
      mask = new Float32Array(cols * rows);
      for (let i = 0; i < cols * rows; i++) {
        mask[i] = data[i * 4 + 3] / 255;
      }
    };

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      cols = Math.max(1, Math.floor(rect.width / CELL));
      rows = Math.max(1, Math.floor(rect.height / (CELL * 1.6)));
      buildMask();
    };

    const draw = (time: number) => {
      const rect = wrap.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      if (w === 0 || h === 0) return;

      ctx.clearRect(0, 0, w, h);
      ctx.font = `500 ${CELL}px "JetBrains Mono Variable", ui-monospace, monospace`;
      ctx.textBaseline = "top";

      const t = time * 0.00016;
      const r = reveal.current;
      const cellH = CELL * 1.6;

      // Pointer position in grid space.
      const pxCol = (pointer.current.x / w) * cols;
      const pyRow = (pointer.current.y / h) * rows;

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const n = smoothNoise(x * 0.16, y * 0.26 - t * 4, Math.floor(t) % 8);
          const glyph = mask[y * cols + x] ?? 0;

          // Noise drifts on its own; the monogram fades in over the top of it
          // as the section is scrolled through.
          let v = n * (1 - r) * 0.75 + glyph * r;

          // Local lift under the cursor so the field acknowledges the reader.
          const dx = x - pxCol;
          const dy = (y - pyRow) * 1.5;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 9) v += (1 - dist / 9) * 0.5;

          if (v <= 0.06) continue;

          const idx = Math.min(RAMP.length - 1, Math.floor(v * RAMP.length));
          const char = RAMP[idx];
          if (char === " ") continue;

          // Cells that belong to the monogram burn accent; the noise field
          // stays muted, so the letterforms read even at low reveal.
          const onGlyph = glyph > 0.4 && r > 0.15;
          ctx.fillStyle = onGlyph
            ? `rgba(199, 249, 78, ${Math.min(1, v * 0.95)})`
            : `rgba(138, 135, 129, ${Math.min(0.72, v * 0.6)})`;

          ctx.fillText(char, x * CELL, y * cellH);
        }
      }
    };

    const loop = (time: number) => {
      if (disposed) return;
      draw(time);
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (running || disposed || !animate) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };

    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    // Scroll drives how far the monogram has resolved.
    const onScroll = () => {
      const rect = wrap.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // 0 when the block is a screen away, 1 once it is comfortably centred.
      const p = 1 - (rect.top - vh * 0.15) / (vh * 0.75);
      reveal.current = Math.max(0, Math.min(1, p));
      if (!animate) draw(performance.now());
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = wrap.getBoundingClientRect();
      pointer.current = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
    };

    const onPointerLeave = () => {
      pointer.current = { x: -999, y: -999 };
    };

    resize();
    onScroll();

    if (animate) {
      // Only run while visible — a character grid redrawing off screen is pure
      // waste, and this is the same guard the WebGL scene uses.
      const observer = new IntersectionObserver(
        ([entry]) => (entry.isIntersecting && !document.hidden ? start() : stop()),
        { threshold: 0 },
      );
      observer.observe(wrap);

      const onVisibility = () => (document.hidden ? stop() : start());

      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", resize);
      document.addEventListener("visibilitychange", onVisibility);
      wrap.addEventListener("pointermove", onPointerMove);
      wrap.addEventListener("pointerleave", onPointerLeave);

      return () => {
        disposed = true;
        stop();
        observer.disconnect();
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", resize);
        document.removeEventListener("visibilitychange", onVisibility);
        wrap.removeEventListener("pointermove", onPointerMove);
        wrap.removeEventListener("pointerleave", onPointerLeave);
      };
    }

    // Static path: paint the resolved monogram once and leave it alone.
    reveal.current = 1;
    draw(performance.now());
    window.addEventListener("resize", resize);
    return () => {
      disposed = true;
      window.removeEventListener("resize", resize);
    };
  }, [animate]);

  return (
    <div
      ref={wrapRef}
      className={`relative ${className ?? ""}`}
      role="img"
      aria-label="Mihir Jha's monogram, drawn as a field of characters"
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
