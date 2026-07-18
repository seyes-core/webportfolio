"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { siteConfig } from "@/lib/site-config";

/**
 * SIGNATURE ELEMENT
 * -----------------------------------------------------------------------
 * The site's one deliberate "wow" moment: a live schematic of the four
 * domains this engineer works across (AI, Cloud, Data, Product), each
 * connected to a central node with pulsing signal lines. It's a visual
 * thesis statement — "I think in systems" — rendered literally rather
 * than illustrated with a stock hero image or gradient blob.
 *
 * Fully static (no animation) when prefers-reduced-motion is set.
 * -----------------------------------------------------------------------
 */

const NODE_POSITIONS = [
  { x: 260, y: 60 }, // AI — top
  { x: 460, y: 220 }, // Cloud — right
  { x: 320, y: 400 }, // Data — bottom
  { x: 80, y: 220 }, // Product — left
];

const CENTER = { x: 270, y: 230 };

export function SystemMap() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const domains = siteConfig.domains;

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);

    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  return (
    <div
      className="relative mx-auto aspect-[540/460] w-full max-w-[540px]"
      role="img"
      aria-label="Diagram showing four connected engineering domains: AI Products, Cloud Infrastructure, Data Engineering, and Full-Stack Product, converging on a central node."
    >
      <svg
        viewBox="0 0 540 460"
        fill="none"
        className="h-full w-full"
        aria-hidden="true"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Connection lines */}
        {NODE_POSITIONS.map((pos, i) => (
          <g key={`line-${i}`}>
            <line
              x1={CENTER.x}
              y1={CENTER.y}
              x2={pos.x}
              y2={pos.y}
              stroke="var(--color-hairline-strong)"
              strokeWidth={1}
            />
            {!prefersReducedMotion && (
              <motion.circle
                r={3}
                fill="var(--color-dataline)"
                animate={{
                  cx: [CENTER.x, pos.x, CENTER.x],
                  cy: [CENTER.y, pos.y, CENTER.y],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2.8,
                  repeat: Infinity,
                  ease: "linear",
                  delay: i * 0.5,
                }}
              />
            )}
          </g>
        ))}

        {/* Center node — "you" */}
        <motion.circle
          cx={CENTER.x}
          cy={CENTER.y}
          r={10}
          fill="var(--color-signal)"
          animate={
            prefersReducedMotion
              ? undefined
              : { scale: [1, 1.12, 1] }
          }
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: `${CENTER.x}px ${CENTER.y}px` }}
        />
        <circle
          cx={CENTER.x}
          cy={CENTER.y}
          r={20}
          stroke="var(--color-signal)"
          strokeOpacity={0.3}
          strokeWidth={1}
          fill="none"
        />

        {/* Domain nodes */}
        {NODE_POSITIONS.map((pos, i) => (
          <motion.circle
            key={`node-${i}`}
            cx={pos.x}
            cy={pos.y}
            r={7}
            fill="var(--color-dataline)"
            animate={
              prefersReducedMotion
                ? undefined
                : { opacity: [0.7, 1, 0.7] }
            }
            transition={{
              duration: 2.8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
          />
        ))}
      </svg>

      {/* Domain labels, positioned over the SVG nodes */}
      {domains.map((domain, i) => {
        const pos = NODE_POSITIONS[i];
        if (!pos) return null;
        const isLeft = pos.x < CENTER.x;
        return (
          <div
            key={domain.id}
            className="absolute w-[5.25rem] -translate-y-1/2 text-center sm:w-40"
            style={{
              left: `${(pos.x / 540) * 100}%`,
              top: `${(pos.y / 460) * 100}%`,
              textAlign: isLeft ? "right" : "left",
              transform: isLeft
                ? "translate(calc(-100% - 0.25rem), -50%)"
                : "translate(0.25rem, -50%)",
            }}
          >
            <p className="font-mono text-[0.58rem] leading-tight uppercase tracking-[0.08em] text-(--color-text-high) sm:text-[0.7rem] sm:leading-normal sm:tracking-[0.1em]">
              {domain.label}
            </p>
          </div>
        );
      })}
    </div>
  );
}
