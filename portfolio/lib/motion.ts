import type { Transition, Variants } from "framer-motion";

/**
 * ANIMATION SPECIFICATION
 * -----------------------------------------------------------------------
 * Every motion primitive used on the site is defined here so animation
 * stays consistent and purposeful rather than ad-hoc per component.
 *
 * Principles:
 * 1. Motion signals hierarchy (what to look at next), not decoration.
 * 2. One signature choreographed sequence (hero system-map) carries the
 *    "wow" — everything else is quiet: short reveals, no bounce, no
 *    gratuitous parallax.
 * 3. Every animated component must respect prefers-reduced-motion; the
 *    `useReducedMotionSafe` hook + variants below fall back to instant
 *    opacity changes.
 * -----------------------------------------------------------------------
 */

export const EASE_SIGNATURE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const transitions = {
  fast: { duration: 0.15, ease: EASE_SIGNATURE },
  base: { duration: 0.4, ease: EASE_SIGNATURE },
  slow: { duration: 0.8, ease: EASE_SIGNATURE },
} satisfies Record<string, Transition>;

/** Fade + rise used for scroll-triggered section and card reveals. */
export const revealUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE_SIGNATURE },
  },
};

/** Stagger container for lists of cards / nav items / timeline rows. */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE_SIGNATURE },
  },
};

/** Simple opacity-only fade, used where vertical motion would be distracting. */
export const fade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: EASE_SIGNATURE } },
};

/** Hero headline letters/words — subtle clip reveal, not a bounce-in. */
export const clipReveal: Variants = {
  hidden: { opacity: 0, y: "100%" },
  visible: {
    opacity: 1,
    y: "0%",
    transition: { duration: 0.7, ease: EASE_SIGNATURE },
  },
};

/** Node pulse used in the System Map signature component. */
export const nodePulse: Variants = {
  idle: { scale: 1, opacity: 0.85 },
  active: {
    scale: [1, 1.15, 1],
    opacity: [0.85, 1, 0.85],
    transition: { duration: 2.4, repeat: Infinity, ease: "easeInOut" },
  },
};
