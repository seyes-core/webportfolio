import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/motion/reveal";
import { WritingList } from "@/components/sections/writing-list";
import { CTA } from "@/components/sections/cta";
import { writing } from "@/content/experience";

export const metadata: Metadata = {
  title: "Build Log",
  description: "Notes from real engineering problems — infrastructure, payments, and AI tooling.",
};

export default function WritingPage() {
  return (
    <>
      <section className="py-(--spacing-section-sm) md:py-(--spacing-section)">
        <Container>
          <Reveal>
            <Eyebrow index="03">Build log</Eyebrow>
            <h1 className="mt-6 max-w-2xl text-balance text-[var(--text-display-m)] font-semibold text-(--color-text-high) md:text-[var(--text-display-l)]">
              Notes from the work, not marketing copy about it.
            </h1>
          </Reveal>

          <div className="mt-16">
            <WritingList entries={writing} />
          </div>
        </Container>
      </section>
      <CTA />
    </>
  );
}
