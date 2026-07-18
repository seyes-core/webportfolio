"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function StaggerList({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={staggerContainer}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
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
      className={cn(className)}
      variants={prefersReducedMotion ? { hidden: { opacity: 0 }, visible: { opacity: 1 } } : staggerItem}
    >
      {children}
    </motion.div>
  );
}
