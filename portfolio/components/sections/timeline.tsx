import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { experience } from "@/content/experience";
import { formatMonthYear } from "@/lib/utils";

export function Timeline() {
  return (
    <section id="log" className="py-(--spacing-section-sm) md:py-(--spacing-section)">
      <Container>
        <Reveal>
          <SectionHeading
            index="04"
            eyebrow="Build log"
            title="How this got built."
          />
        </Reveal>

        <div className="space-y-10">
          {experience.map((entry) => (
            <Reveal key={entry.id}>
              <div className="grid grid-cols-1 gap-4 border-t border-(--color-hairline) pt-8 md:grid-cols-[14rem_1fr]">
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.1em] text-(--color-text-faint)">
                    {formatMonthYear(entry.start)} —{" "}
                    {entry.end === "present" ? "Present" : formatMonthYear(entry.end)}
                  </p>
                  <p className="mt-2 text-sm text-(--color-text-muted)">{entry.location}</p>
                </div>
                <div>
                  <h3 className="font-display text-xl font-medium text-(--color-text-high)">
                    {entry.role}
                  </h3>
                  <p className="mt-1 text-sm text-(--color-signal)">{entry.org}</p>
                  <p className="mt-4 max-w-2xl text-sm leading-relaxed text-(--color-text-muted)">
                    {entry.summary}
                  </p>
                  <ul className="mt-4 space-y-2">
                    {entry.highlights.map((h) => (
                      <li
                        key={h}
                        className="flex gap-3 text-sm leading-relaxed text-(--color-text-mid)"
                      >
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-(--color-dataline)" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
