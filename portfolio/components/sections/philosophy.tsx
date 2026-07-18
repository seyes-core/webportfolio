import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { StaggerList, StaggerItem } from "@/components/motion/stagger-list";
import { principles } from "@/lib/site-config";

export function Philosophy({ index = "04" }: { index?: string }) {
  return (
    <section className="py-(--spacing-section-sm) md:py-(--spacing-section)">
      <Container>
        <Reveal>
          <SectionHeading index={index} eyebrow="Philosophy" title="Principles." />
        </Reveal>

        <StaggerList className="grid grid-cols-1 gap-px overflow-hidden rounded-[var(--radius-lg)] border border-(--color-hairline) bg-(--color-hairline) sm:grid-cols-2 lg:grid-cols-3">
          {principles.map((principle, i) => (
            <StaggerItem key={principle.id}>
              <div className="group h-full bg-(--color-surface) p-7 transition-colors hover:bg-(--color-surface-raised)">
                <span className="font-mono text-xs text-(--color-text-faint)">
                  0{i + 1}
                </span>
                <h3 className="mt-4 font-display text-lg font-medium text-(--color-text-high)">
                  {principle.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-(--color-text-muted)">
                  {principle.body}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerList>
      </Container>
    </section>
  );
}
