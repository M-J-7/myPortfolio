import { useEffect, useState } from "react";

export type DeviceTier = "high" | "low" | "none";

/**
 * Decides whether this device gets the WebGL scene or a static poster.
 *
 * - "none" — no WebGL context at all, or the visitor asked for reduced motion.
 * - "low"  — touch device, few cores, or a software/known-weak renderer.
 * - "high" — everything else; render the real scene.
 *
 * Runs once after mount (it touches the GPU, so it must not run during
 * render) and returns "none" until it has an answer, which keeps the
 * canvas out of the critical path.
 */
function detectTier(): DeviceTier {
  if (typeof window === "undefined") return "none";

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return "none";
  }

  let canvas: HTMLCanvasElement | null = document.createElement("canvas");
  let gl: WebGLRenderingContext | null = null;

  try {
    gl = (canvas.getContext("webgl2") ||
      canvas.getContext("webgl")) as WebGLRenderingContext | null;
  } catch {
    gl = null;
  }

  if (!gl) {
    canvas = null;
    return "none";
  }

  let tier: DeviceTier = "high";

  // Coarse pointer means phone or tablet: real GPUs there vary wildly and
  // the payoff is smallest on the smallest screen.
  if (window.matchMedia("(pointer: coarse)").matches) tier = "low";

  const cores = navigator.hardwareConcurrency;
  if (typeof cores === "number" && cores > 0 && cores <= 4) tier = "low";

  // Save-Data / slow connection: respect the hint.
  const connection = (
    navigator as Navigator & { connection?: { saveData?: boolean } }
  ).connection;
  if (connection?.saveData) tier = "low";

  try {
    const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
    if (debugInfo) {
      const renderer = String(
        gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) ?? "",
      ).toLowerCase();
      if (
        renderer.includes("swiftshader") ||
        renderer.includes("llvmpipe") ||
        renderer.includes("software") ||
        renderer.includes("microsoft basic")
      ) {
        tier = "none";
      }
    }
  } catch {
    // Extension unavailable — keep whatever tier we already have.
  }

  // Release the probe context rather than leaving it to the GC; browsers
  // cap the number of live WebGL contexts per page.
  const loseContext = gl.getExtension("WEBGL_lose_context");
  loseContext?.loseContext();
  canvas = null;

  return tier;
}

export function useDeviceTier(): DeviceTier {
  const [tier, setTier] = useState<DeviceTier>("none");

  useEffect(() => {
    // Defer past first paint — probing the GPU is not worth blocking LCP.
    const id = window.setTimeout(() => setTier(detectTier()), 0);
    return () => window.clearTimeout(id);
  }, []);

  return tier;
}
