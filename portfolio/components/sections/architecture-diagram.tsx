"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { architecture } from "@/lib/site-config";

/**
 * Skills rendered as a system diagram rather than a logo wall — each layer
 * connects downward into the next, echoing how these tools actually compose
 * in a real deployment (frontend -> backend -> cloud -> ai -> data all feed
 * the same running system).
 */
export function ArchitectureDiagram() {
  return (
    <section id="stack" className="py-(--spacing-section-sm) md:py-(--spacing-section)">
      <Container>
        <Reveal>
          <SectionHeading
            index="02"
            eyebrow="Toolchain"
            title="How the pieces connect."
            description="Not a list of logos — the actual layers a request passes through, and what runs each one."
          />
        </Reveal>

        <div className="relative">
          {architecture.map((layer, layerIndex) => (
            <Reveal key={layer.id} delay={layerIndex * 0.08}>
              <div className="flex gap-6 md:gap-10">
                {/* Rail: node + connecting line down to the next layer */}
                <div className="flex flex-col items-center">
                  <motion.div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-(--color-signal)/40 bg-(--color-surface)"
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: layerIndex * 0.08 }}
                  >
                    <span className="h-2 w-2 rounded-full bg-(--color-signal)" />
                  </motion.div>
                  {layerIndex < architecture.length - 1 && (
                    <motion.div
                      className="w-px flex-1 bg-(--color-hairline-strong)"
                      initial={{ scaleY: 0 }}
                      whileInView={{ scaleY: 1 }}
                      viewport={{ once: true }}
                      style={{ transformOrigin: "top" }}
                      transition={{ duration: 0.5, delay: layerIndex * 0.08 + 0.15 }}
                    />
                  )}
                </div>

                {/* Layer content */}
                <div className="min-w-0 flex-1 pb-10">
                  <h3 className="font-mono text-xs uppercase tracking-[0.14em] text-(--color-text-faint)">
                    {layer.label}
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {layer.tools.map((tool, toolIndex) => (
                      <motion.span
                        key={tool}
                        className="rounded-[var(--radius-sm)] border border-(--color-hairline-strong) bg-(--color-surface) px-3 py-1.5 font-mono text-xs text-(--color-text-mid) transition-colors hover:border-(--color-signal) hover:text-(--color-signal)"
                        initial={{ opacity: 0, x: -8 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 0.3,
                          delay: layerIndex * 0.08 + toolIndex * 0.04 + 0.1,
                        }}
                      >
                        {tool}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
