import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/motion/reveal";
import { StaggerList, StaggerItem } from "@/components/motion/stagger-list";
import { Counter } from "@/components/motion/counter";
import { metrics } from "@/lib/site-config";

export function Metrics() {
  return (
    <section className="border-y border-(--color-hairline) py-(--spacing-section-sm)">
      <Container>
        <Reveal>
          <p className="mb-10 font-mono text-xs uppercase tracking-[0.14em] text-(--color-text-faint)">
            06 / By the numbers
          </p>
        </Reveal>

        <StaggerList className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6">
          {metrics.map((metric) => (
            <StaggerItem key={metric.id}>
              <p className="font-display text-3xl font-semibold text-(--color-text-high) md:text-4xl">
                <Counter value={metric.value} suffix="+" />
              </p>
              <p className="mt-2 text-xs leading-snug text-(--color-text-muted)">
                {metric.label}
              </p>
            </StaggerItem>
          ))}
        </StaggerList>
      </Container>
    </section>
  );
}
