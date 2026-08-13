import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  MeshTransmissionMaterial,
  Environment,
  Lightformer,
  Float,
} from "@react-three/drei";
import * as THREE from "three";

/**
 * The glass knot behind the hero.
 *
 * Transmission gives the refraction and chromatic aberration that make it read
 * as a physical object rather than a shader trick. It rotates slowly on its own,
 * leans toward the pointer, and shrinks as the page scrolls away from it.
 */
function Knot({ scrollRef }: { scrollRef: React.RefObject<number> }) {
  const mesh = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();

  useFrame((state, delta) => {
    const node = mesh.current;
    if (!node) return;

    node.rotation.x += delta * 0.09;
    node.rotation.y += delta * 0.13;

    // Damped lean toward the pointer — pointer coords are already -1..1.
    const targetX = state.pointer.x * 0.35;
    const targetY = state.pointer.y * 0.25;
    node.position.x = THREE.MathUtils.damp(node.position.x, targetX, 3, delta);
    node.position.y = THREE.MathUtils.damp(node.position.y, targetY, 3, delta);

    // Scroll drives scale: full size at the top, receding as you leave.
    const progress = scrollRef.current ?? 0;
    const target = 1 - Math.min(progress, 1) * 0.45;
    const scale = THREE.MathUtils.damp(node.scale.x, target, 4, delta);
    node.scale.setScalar(scale);
  });

  // Keep the object proportional to the viewport so it never crowds the text
  // on a narrow screen or float away on a wide one.
  const base = Math.min(viewport.width, viewport.height) * 0.19;

  return (
    <Float speed={1.2} rotationIntensity={0.35} floatIntensity={0.6}>
      <mesh ref={mesh} scale={1}>
        <torusKnotGeometry args={[base, base * 0.3, 220, 40]} />
        <MeshTransmissionMaterial
          samples={6}
          resolution={512}
          thickness={base * 0.85}
          roughness={0.08}
          anisotropy={0.4}
          chromaticAberration={0.22}
          distortion={0.25}
          distortionScale={0.4}
          temporalDistortion={0.1}
          ior={1.42}
          color="#f4f1ea"
          attenuationColor="#c7f94e"
          attenuationDistance={base * 3}
        />
      </mesh>
    </Float>
  );
}

export function Scene() {
  const scrollRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);

  // Track scroll without subscribing the r3f loop to React state.
  useEffect(() => {
    const onScroll = () => {
      scrollRef.current = window.scrollY / Math.max(window.innerHeight, 1);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Stop rendering entirely when the canvas is off screen or the tab is
  // hidden. Transmission is expensive; there is no reason to pay for it
  // while nobody is looking at it.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting && !document.hidden),
      { threshold: 0 },
    );
    observer.observe(el);

    const onVisibility = () => setActive(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0"
    >
      <Canvas
        camera={{ position: [0, 0, 6], fov: 42 }}
        dpr={[1, 1.75]}
        frameloop={active ? "always" : "never"}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[4, 5, 3]} intensity={2.2} color="#f4f1ea" />
        <directionalLight position={[-5, -2, -3]} intensity={1.4} color="#c7f94e" />
        <Knot scrollRef={scrollRef} />

        {/*
          Environment built from in-scene Lightformers rather than a `preset`.
          The drei presets fetch an HDRI from a third-party CDN at runtime —
          an external request that can be slow, blocked, or simply disappear.
          These panels are what the glass actually reflects, so they double as
          the art direction: warm paper above, the lime accent raking in from
          the left, a cold rim on the right to pick out the silhouette.
        */}
        <Environment resolution={256} frames={1}>
          <Lightformer
            intensity={2.4}
            color="#f4f1ea"
            position={[0, 5, -6]}
            scale={[12, 6, 1]}
          />
          <Lightformer
            intensity={3}
            color="#c7f94e"
            position={[-6, 1, -2]}
            rotation={[0, Math.PI / 2, 0]}
            scale={[8, 4, 1]}
          />
          <Lightformer
            intensity={1.6}
            color="#8ab4ff"
            position={[6, -1, -2]}
            rotation={[0, -Math.PI / 2, 0]}
            scale={[8, 4, 1]}
          />
          <Lightformer
            intensity={1.2}
            color="#f4f1ea"
            position={[0, -5, -4]}
            scale={[10, 4, 1]}
          />
        </Environment>
      </Canvas>
    </div>
  );
}
