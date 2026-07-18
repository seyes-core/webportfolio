"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { revealUp } from "@/lib/motion";

/**
 * Scroll-triggered reveal used for section headings, cards, and paragraphs.
 * Falls back to a plain opacity fade when the user prefers reduced motion.
 */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);

    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={prefersReducedMotion ? { hidden: { opacity: 0 }, visible: { opacity: 1 } } : revealUp}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}
