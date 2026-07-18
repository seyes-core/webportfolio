"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const ROLES = [
  "systems architect",
  "cloud engineer",
  "AI product thinker",
  "future technical founder",
];

/**
 * Terminal-style rotating role line: "root@seye:~$ building as a ...".
 * Reinforces the engineer/systems identity without a literal typewriter
 * effect on every character (cheaper, calmer, and more accessible than
 * per-character typing animation).
 */
export function RoleRotator() {
  const [index, setIndex] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);

    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % ROLES.length);
    }, 2600);
    return () => clearInterval(interval);
  }, [prefersReducedMotion]);

  const role = prefersReducedMotion ? ROLES[0] : ROLES[index];

  return (
    <div className="inline-flex max-w-full items-center gap-1.5 whitespace-nowrap font-mono text-[11px] text-(--color-text-muted) sm:gap-2 sm:text-sm">
      <span className="text-(--color-dataline)" aria-hidden="true">
        $
      </span>
      <span className="shrink-0">building as a</span>
      <span className="relative inline-flex h-5 w-[11ch] items-center overflow-hidden sm:w-[13ch]">
        <AnimatePresence mode="wait">
          <motion.span
            key={role}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-0 whitespace-nowrap text-(--color-signal)"
          >
            {role}
          </motion.span>
        </AnimatePresence>
      </span>
      <motion.span
        aria-hidden="true"
        className="inline-block h-4 w-[2px] bg-(--color-signal)"
        animate={prefersReducedMotion ? undefined : { opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
      />
    </div>
  );
}
