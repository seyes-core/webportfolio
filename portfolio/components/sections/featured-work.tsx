import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { StaggerList, StaggerItem } from "@/components/motion/stagger-list";
import { ProjectCard } from "@/components/sections/project-card";
import { getFeaturedProjects } from "@/content/projects";

export function FeaturedWork() {
  const projects = getFeaturedProjects();

  return (
    <section id="work" className="py-(--spacing-section-sm) md:py-(--spacing-section)">
      <Container>
        <Reveal>
          <div className="mb-12 flex flex-col items-start justify-between gap-6 md:mb-16 md:flex-row md:items-end">
            <SectionHeading
              index="03"
              eyebrow="Selected work"
              title="Systems shipped to production."
              description="Not side-project screenshots — things that took real traffic, real payments, or real infrastructure decisions."
              className="mb-0"
            />
            <Link
              href="/work"
              className="flex shrink-0 items-center gap-1.5 font-mono text-xs uppercase tracking-[0.1em] text-(--color-text-muted) transition-colors hover:text-(--color-signal)"
            >
              View all work
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </Reveal>

        <StaggerList className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {projects.map((project) => (
            <StaggerItem key={project.slug}>
              <ProjectCard project={project} />
            </StaggerItem>
          ))}
        </StaggerList>
      </Container>
    </section>
  );
}
