"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { journey } from "@/lib/site-config";

export function JourneyTimeline({ index = "05" }: { index?: string }) {
  return (
    <section className="py-(--spacing-section-sm) md:py-(--spacing-section)">
      <Container>
        <Reveal>
          <SectionHeading
            index={index}
            eyebrow="Journey"
            title="How I got here."
            description="Not a straight line — a series of pivots toward the same question."
          />
        </Reveal>

        <div className="relative pl-4">
          <motion.div
            className="absolute left-4 top-2 w-px bg-(--color-hairline-strong)"
            style={{ height: "calc(100% - 1rem)", transformOrigin: "top" }}
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          />

          <ol className="space-y-10">
            {journey.map((step, i) => (
              <Reveal key={step.id} delay={i * 0.06}>
                <li className="relative flex gap-6 pl-6">
                  <motion.span
                    className="absolute -left-[1.55rem] top-1.5 h-3 w-3 shrink-0 rounded-full border-2 border-(--color-signal) bg-(--color-base)"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.06 }}
                  />
                  <div>
                    <p className="font-mono text-xs uppercase tracking-[0.1em] text-(--color-text-faint)">
                      Step {String(i + 1).padStart(2, "0")}
                    </p>
                    <h3 className="mt-1 font-display text-lg font-medium text-(--color-text-high) md:text-xl">
                      {step.label}
                    </h3>
                    <p className="mt-2 max-w-lg text-sm leading-relaxed text-(--color-text-muted)">
                      {step.note}
                    </p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
