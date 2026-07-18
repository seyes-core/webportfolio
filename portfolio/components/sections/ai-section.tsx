import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { StaggerList, StaggerItem } from "@/components/motion/stagger-list";
import { aiCapabilities } from "@/lib/site-config";

export function AISection() {
  return (
    <section className="py-(--spacing-section-sm) md:py-(--spacing-section)">
      <Container>
        <Reveal>
          <SectionHeading
            index="AI"
            eyebrow="Artificial intelligence"
            title="Building with Artificial Intelligence"
            description="I design workflows where AI becomes part of the product rather than a feature — the difference between “I use ChatGPT” and a system that reasons over your data, on your terms."
          />
        </Reveal>

        <StaggerList className="flex flex-wrap gap-3">
          {aiCapabilities.map((capability) => (
            <StaggerItem key={capability}>
              <span className="inline-flex items-center rounded-[var(--radius-md)] border border-(--color-dataline)/30 bg-(--color-dataline)/[0.06] px-4 py-2.5 font-mono text-sm text-(--color-text-high)">
                {capability}
              </span>
            </StaggerItem>
          ))}
        </StaggerList>
      </Container>
    </section>
  );
}
