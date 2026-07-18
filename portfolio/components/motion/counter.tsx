"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";

/** Counts up to `value` once it scrolls into view. Static under reduced motion. */
export function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(true);
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { duration: 1.6, bounce: 0 });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);

    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    if (inView && !prefersReducedMotion) {
      motionValue.set(value);
    }
  }, [inView, motionValue, value, prefersReducedMotion]);

  useEffect(() => {
    if (!ref.current) return;
    if (prefersReducedMotion) {
      ref.current.textContent = `${value.toLocaleString()}${suffix}`;
      return;
    }
    const unsubscribe = spring.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = `${Math.round(latest).toLocaleString()}${suffix}`;
      }
    });
    return unsubscribe;
  }, [spring, value, suffix, prefersReducedMotion]);

  return (
    <motion.span ref={ref} className="font-tabular">
      0{suffix}
    </motion.span>
  );
}
