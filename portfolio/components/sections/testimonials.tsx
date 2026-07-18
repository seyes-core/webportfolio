import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { StaggerList, StaggerItem } from "@/components/motion/stagger-list";
import { testimonials } from "@/lib/site-config";

export function Testimonials() {
  return (
    <section className="py-(--spacing-section-sm) md:py-(--spacing-section)">
      <Container>
        <Reveal>
          <SectionHeading index="08" eyebrow="Testimonials" title="What it's like to work with me." />
        </Reveal>

        <StaggerList className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {testimonials.map((t) => (
            <StaggerItem key={t.id}>
              <div className="h-full rounded-[var(--radius-lg)] border border-white/[0.08] bg-white/[0.03] p-7 backdrop-blur-md">
                <svg width="28" height="20" viewBox="0 0 28 20" fill="none" className="text-(--color-signal)/50" aria-hidden="true">
                  <path d="M0 20V11.6C0 7.73333 0.933333 4.66667 2.8 2.4C4.66667 0.8 7.06667 0 10 0V4.4C8.13333 4.4 6.73333 4.93333 5.8 6C4.86667 7.06667 4.4 8.66667 4.4 10.8H10V20H0ZM17.6 20V11.6C17.6 7.73333 18.5333 4.66667 20.4 2.4C22.2667 0.8 24.6667 0 27.6 0V4.4C25.7333 4.4 24.3333 4.93333 23.4 6C22.4667 7.06667 22 8.66667 22 10.8H27.6V20H17.6Z" fill="currentColor"/>
                </svg>
                <p className="mt-4 text-sm leading-relaxed text-(--color-text-mid)">
                  {t.quote}
                </p>
                <div className="mt-6 border-t border-white/[0.08] pt-4">
                  <p className="font-mono text-xs text-(--color-text-high)">{t.name}</p>
                  <p className="mt-0.5 text-xs text-(--color-text-faint)">{t.context}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerList>
      </Container>
    </section>
  );
}
