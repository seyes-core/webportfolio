"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const ROLES = [
  "systems architect",
  "cloud engineer",
  "AI product thinker",
  "future technical founder",
] as const;

/**
 * Terminal-style rotating role line: "root@seye:~$ building as a ...".
 * Reinforces the engineer/systems identity without a literal typewriter
 * effect on every character (cheaper, calmer, and more accessible than
 * per-character typing animation).
 *
 * The role slot is sized to the longest label via an invisible grid sizer
 * so text never clips and the layout does not shift between roles.
 */
export function RoleRotator() {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion || paused) return;
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % ROLES.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [prefersReducedMotion, paused]);

  const role = prefersReducedMotion ? ROLES[0] : ROLES[index];

  return (
    <div
      className="inline-flex max-w-full flex-wrap items-baseline gap-x-1.5 gap-y-1 font-mono text-[11px] leading-snug text-(--color-signal-dim) sm:gap-x-2 sm:text-sm sm:leading-normal"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <span className="text-(--color-signal)" aria-hidden="true">
        $
      </span>
      <span className="shrink-0">building as a</span>

      {/*
        CSS grid sizer: every role occupies the same cell invisibly so the
        visible slot is always as wide/tall as the longest label. Avoids the
        old fixed ch-width which clipped "future technical founder" on every
        breakpoint and caused jumpiness when roles swapped.
      */}
      <span
        className="relative inline-grid min-w-0 align-baseline text-(--color-signal)"
        aria-live="polite"
        aria-atomic="true"
      >
        {ROLES.map((label) => (
          <span
            key={`sizer-${label}`}
            className="invisible col-start-1 row-start-1 whitespace-nowrap"
            aria-hidden="true"
          >
            {label}
          </span>
        ))}

        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={role}
            initial={
              prefersReducedMotion
                ? false
                : { opacity: 0, y: "0.35em" }
            }
            animate={{ opacity: 1, y: 0 }}
            exit={
              prefersReducedMotion
                ? undefined
                : { opacity: 0, y: "-0.35em" }
            }
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="col-start-1 row-start-1 whitespace-nowrap"
          >
            {role}
          </motion.span>
        </AnimatePresence>
      </span>

      <motion.span
        aria-hidden="true"
        className="inline-block h-[1em] w-[2px] shrink-0 translate-y-px bg-(--color-signal)"
        animate={prefersReducedMotion ? undefined : { opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
      />
    </div>
  );
}
