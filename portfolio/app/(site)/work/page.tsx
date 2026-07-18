import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/motion/reveal";
import { StaggerList, StaggerItem } from "@/components/motion/stagger-list";
import { ProjectCard } from "@/components/sections/project-card";
import { CTA } from "@/components/sections/cta";
import { projects } from "@/content/projects";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Production systems: a payments platform, infrastructure-as-code lab provisioner, and AI developer tooling.",
};

export default function WorkPage() {
  return (
    <>
      <section className="py-(--spacing-section-sm) md:py-(--spacing-section)">
        <Container>
          <Reveal>
            <Eyebrow index="02">Work</Eyebrow>
            <h1 className="mt-6 max-w-2xl text-balance text-[var(--text-display-m)] font-semibold text-(--color-text-high) md:text-[var(--text-display-l)]">
              Things I've shipped, with the problem they actually solved.
            </h1>
            <p className="mt-6 max-w-xl text-balance text-lg text-(--color-text-mid)">
              Every project here includes the constraint that shaped it and
              the outcome it produced — not just a screenshot and a stack
              list.
            </p>
          </Reveal>

          <StaggerList className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-2">
            {projects.map((project) => (
              <StaggerItem key={project.slug}>
                <ProjectCard project={project} />
              </StaggerItem>
            ))}
          </StaggerList>
        </Container>
      </section>
      <CTA />
    </>
  );
}
