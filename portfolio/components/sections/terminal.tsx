"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/motion/reveal";
import { siteConfig, terminal } from "@/lib/site-config";

type Line =
  | { type: "command"; text: string }
  | { type: "output"; text: string }
  | { type: "blank" };

const lines: Line[] = [
  { type: "command", text: "whoami" },
  { type: "output", text: siteConfig.name },
  { type: "blank" },
  { type: "command", text: "interests" },
  ...terminal.interests.map((interest): Line => ({ type: "output", text: `→ ${interest}` })),
  { type: "blank" },
  { type: "command", text: "current_goal" },
  { type: "output", text: terminal.currentGoal },
];

export function Terminal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true, margin: "-100px" });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(true);
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);

    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    if (!inView) return;
    if (prefersReducedMotion) return;
    if (visibleCount >= lines.length) return;

    const timer = setTimeout(() => {
      setVisibleCount((c) => c + 1);
    }, 140);

    return () => clearTimeout(timer);
  }, [inView, visibleCount, prefersReducedMotion]);

  const effectiveVisibleCount = prefersReducedMotion ? lines.length : visibleCount;

  return (
    <section className="py-(--spacing-section-sm) md:py-(--spacing-section)">
      <Container>
        <Reveal>
          <p className="mb-8 font-mono text-xs uppercase tracking-[0.14em] text-(--color-text-faint)">
            07 / Terminal
          </p>
        </Reveal>

        <Reveal>
          <div
            ref={containerRef}
            className="mx-auto max-w-2xl overflow-hidden rounded-[var(--radius-lg)] border border-(--color-hairline-strong) bg-[#080a0d] shadow-(--shadow-panel)"
          >
            <div className="flex items-center gap-1.5 border-b border-(--color-hairline) px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-(--color-danger)/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-(--color-signal)/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-(--color-success)/70" />
              <span className="ml-3 font-mono text-xs text-(--color-text-faint)">
                {siteConfig.name.toLowerCase()}@portfolio:~
              </span>
            </div>

            <div className="min-h-[220px] overflow-x-auto p-4 font-mono text-[0.8rem] leading-relaxed sm:min-h-[260px] sm:p-6 sm:text-sm">
              {lines.slice(0, effectiveVisibleCount).map((line, i) => {
                if (line.type === "blank") return <div key={i} className="h-3" />;
                if (line.type === "command") {
                  return (
                    <p key={i} className="whitespace-nowrap text-(--color-text-high)">
                      <span className="text-(--color-dataline)">$</span> {line.text}
                    </p>
                  );
                }
                return (
                  <p key={i} className="pl-4 text-(--color-signal)">
                    {line.text}
                  </p>
                );
              })}
              {effectiveVisibleCount < lines.length && !prefersReducedMotion && (
                <span className="inline-block h-4 w-2 animate-pulse bg-(--color-signal)" />
              )}
              {effectiveVisibleCount >= lines.length && (
                <p className="mt-2 text-(--color-text-high)">
                  <span className="text-(--color-dataline)">$</span>{" "}
                  <span className="inline-block h-4 w-2 animate-pulse bg-(--color-signal)" />
                </p>
              )}
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
