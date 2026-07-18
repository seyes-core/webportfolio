"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { RoleRotator } from "@/components/motion/role-rotator";
import { SystemMap } from "@/components/motion/system-map";
import { AnimatedBackground } from "@/components/motion/animated-background";
import { EASE_SIGNATURE } from "@/lib/motion";
import { siteConfig } from "@/lib/site-config";

const headline = ["Building intelligent software", "that solves problems worth solving."];

export function Hero() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);

    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  return (
    <section className="relative overflow-hidden pb-20 pt-16 md:pb-28 md:pt-24">
      <AnimatedBackground />

      <Container className="grid items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <RoleRotator />
          </motion.div>

          <h1 className="mt-6 text-[var(--text-display-m)] font-semibold leading-[1.05] text-(--color-text-high) sm:text-[var(--text-display-l)] lg:text-[4.25rem]">
            {headline.map((line, i) => (
              <span key={line} className="block overflow-hidden">
                <motion.span
                  className="block"
                  initial={{ y: 0, opacity: 0 }}
                  animate={
                    prefersReducedMotion
                      ? { y: 0, opacity: 1 }
                      : { y: "0%", opacity: 1 }
                  }
                  transition={{ duration: 0.8, ease: EASE_SIGNATURE, delay: 0.15 + i * 0.1 }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE_SIGNATURE, delay: 0.5 }}
            className="mt-6 max-w-lg text-balance text-lg text-(--color-text-mid)"
          >
            {siteConfig.shortBio}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE_SIGNATURE, delay: 0.65 }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <Button asChild size="lg">
              <Link href="/work">
                Explore Projects
                <ArrowUpRight size={16} />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/about">
                Read My Story
                <ArrowDownRight size={16} />
              </Link>
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: EASE_SIGNATURE, delay: 0.3 }}
          className="mx-auto w-full max-w-md lg:max-w-none"
        >
          <SystemMap />
        </motion.div>
      </Container>
    </section>
  );
}
