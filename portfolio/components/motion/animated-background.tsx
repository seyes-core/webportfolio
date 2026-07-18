"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

const CODE_SNIPPETS = [
  "const system = design(problem);",
  "await deploy(cloud.region);",
  "agent.run(task, { tools });",
  "SELECT * FROM impact;",
  "docker build -t product .",
  "vector.search(query, k=5);",
];

interface Particle {
  id: number;
  left: number;
  top: number;
  size: number;
  duration: number;
  delay: number;
}

/**
 * Layered hero background: a static schematic grid (from globals.css body),
 * plus — client-side only, and skipped entirely under prefers-reduced-motion —
 * drifting particles, two slow aurora blobs, a cursor-tracked spotlight, and
 * a handful of faint floating code fragments. Purely atmospheric: none of it
 * competes with the SystemMap, which stays the one focal animation.
 */
export function AnimatedBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [spotlight, setSpotlight] = useState({ x: 50, y: 30 });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => {
      setPrefersReducedMotion(mediaQuery.matches);
      setMounted(true);
    };

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);

    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  const shouldAnimate = mounted && !prefersReducedMotion;

  const particles = useMemo<Particle[]>(() => {
    if (!shouldAnimate) return [];
    return Array.from({ length: 18 }, (_, i) => ({
      id: i,
      left: (i * 23) % 100,
      top: (i * 17) % 100,
      size: i % 3 === 0 ? 3 : 2,
      duration: 10 + (i % 6) * 2.5,
      delay: -(i % 8) * 2.5,
    }));
  }, [shouldAnimate]);

  const snippets = useMemo(() => {
    if (!shouldAnimate) return [];
    return CODE_SNIPPETS.map((text, i) => ({
      text,
      left: 8 + ((i * 37) % 84),
      top: 10 + ((i * 53) % 80),
      delay: i * 1.8,
    }));
  }, [shouldAnimate]);

  useEffect(() => {
    if (!shouldAnimate) return;
    const el = containerRef.current;
    if (!el) return;

    function handlePointerMove(e: PointerEvent) {
      const rect = el?.getBoundingClientRect();
      if (!rect) return;

      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setSpotlight({ x, y });
    }

    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [shouldAnimate]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      {/* Aurora gradients — two slow-drifting blurred blobs */}
      <motion.div
        className="absolute -left-1/4 -top-1/4 h-[38rem] w-[38rem] rounded-full opacity-25 blur-[110px]"
        style={{
          background:
            "radial-gradient(circle, var(--color-signal) 0%, transparent 70%)",
        }}
        animate={
          shouldAnimate ? { x: [0, 60, -20, 0], y: [0, 40, -30, 0] } : undefined
        }
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-1/4 top-1/3 h-[34rem] w-[34rem] rounded-full opacity-20 blur-[110px]"
        style={{
          background:
            "radial-gradient(circle, var(--color-dataline) 0%, transparent 70%)",
        }}
        animate={
          shouldAnimate ? { x: [0, -50, 30, 0], y: [0, -30, 50, 0] } : undefined
        }
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Cursor-following spotlight */}
      {shouldAnimate && (
        <div
          className="absolute inset-0 transition-[background] duration-300 ease-out"
          style={{
            background: `radial-gradient(480px circle at ${spotlight.x}% ${spotlight.y}%, rgba(255,180,84,0.06), transparent 65%)`,
          }}
        />
      )}

      {/* Floating particles */}
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full bg-(--color-dataline)"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            opacity: 0.35,
          }}
          animate={{
            y: [0, -24, 0],
            opacity: [0.15, 0.5, 0.15],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Floating code fragments */}
      {snippets.map((s) => (
        <motion.span
          key={s.text}
          className="absolute whitespace-nowrap font-mono text-[0.7rem] text-(--color-text-faint)"
          style={{ left: `${s.left}%`, top: `${s.top}%` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 0] }}
          transition={{
            duration: 9,
            delay: s.delay,
            repeat: Infinity,
            repeatDelay: CODE_SNIPPETS.length * 1.8,
            ease: "easeInOut",
          }}
        >
          {s.text}
        </motion.span>
      ))}
    </div>
  );
}
