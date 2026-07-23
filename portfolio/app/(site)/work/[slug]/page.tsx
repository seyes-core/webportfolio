import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, Github } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { StaggerList, StaggerItem } from "@/components/motion/stagger-list";
import { CTA } from "@/components/sections/cta";
import { getAllProjectSlugs, getProjectBySlug } from "@/content/projects";
import type { Project } from "@/types/content";

export function generateStaticParams() {
  return getAllProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    openGraph: { title: project.title, description: project.summary },
  };
}

const narrativeSections: { key: keyof Project; label: string; index: string }[] = [
  { key: "problem", label: "The problem", index: "01" },
  { key: "challenges", label: "The challenges", index: "03" },
  { key: "outcome", label: "The results", index: "04" },
  { key: "lessons", label: "The lessons", index: "05" },
];

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const problemSection = narrativeSections.find((s) => s.key === "problem")!;
  const restSections = narrativeSections.filter((s) => s.key !== "problem");

  return (
    <>
      <section className="py-(--spacing-section-sm) md:py-(--spacing-section)">
        <Container>
          <Reveal>
            <Link
              href="/work"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.1em] text-(--color-text-muted) hover:text-(--color-signal)"
            >
              <ArrowLeft size={14} />
              All work
            </Link>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Badge tone="signal">{project.status.replace("-", " ")}</Badge>
              <span className="font-mono text-xs text-(--color-text-faint)">
                {project.year} · {project.role}
              </span>
            </div>

            <h1 className="mt-5 max-w-3xl text-balance text-[var(--text-display-m)] font-semibold text-(--color-text-high) md:text-[var(--text-display-l)]">
              {project.title}
            </h1>
            <p className="mt-4 max-w-xl text-balance text-lg text-(--color-signal)">
              {project.tagline}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {project.links.live && (
                <Button asChild>
                  <a href={project.links.live} target="_blank" rel="noopener noreferrer">
                    Live demo
                    <ArrowUpRight size={16} />
                  </a>
                </Button>
              )}
              {project.links.repo && (
                <Button asChild variant="outline">
                  <a href={project.links.repo} target="_blank" rel="noopener noreferrer">
                    <Github size={16} />
                    GitHub
                  </a>
                </Button>
              )}
            </div>
          </Reveal>

          {/* Large cover image — product launch framing */}
          <Reveal delay={0.1}>
            <div className="relative mt-14 aspect-[16/9] w-full overflow-hidden rounded-[var(--radius-lg)] border border-(--color-hairline)">
              <Image
                src={project.coverImage}
                alt={`${project.title} cover`}
                fill
                priority
                className="object-cover"
                sizes="100vw"
              />
            </div>
          </Reveal>

          {/* Problem */}
          <Reveal>
            <div className="mt-16 grid grid-cols-1 gap-4 border-t border-(--color-hairline) pt-8 md:grid-cols-[10rem_1fr]">
              <p className="font-mono text-xs uppercase tracking-[0.1em] text-(--color-text-faint)">
                {problemSection.index} / {problemSection.label}
              </p>
              <p className="max-w-2xl text-balance text-base leading-relaxed text-(--color-text-mid) md:text-lg">
                {project.problem}
              </p>
            </div>
          </Reveal>

          {/* Architecture — animated pipeline diagram */}
          <Reveal>
            <div className="mt-14 grid grid-cols-1 gap-4 border-t border-(--color-hairline) pt-8 md:grid-cols-[10rem_1fr]">
              <p className="font-mono text-xs uppercase tracking-[0.1em] text-(--color-text-faint)">
                02 / The architecture
              </p>
              <div>
                <p className="max-w-2xl text-balance text-base leading-relaxed text-(--color-text-mid) md:text-lg">
                  {project.approach}
                </p>
                {/* Edge-to-edge scroll on phones so the pipeline reads as one
                    continuous sequence instead of wrapping mid-arrow; settles
                    into a wrapping row once there's room at sm+. */}
                <StaggerList className="hide-scrollbar full-bleed-sm mt-8 flex items-center gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
                  {project.architecture.map((layer, i) => (
                    <StaggerItem key={layer} className="flex shrink-0 items-center gap-2">
                      <span className="whitespace-nowrap rounded-[var(--radius-sm)] border border-(--color-dataline)/40 bg-(--color-dataline)/[0.06] px-4 py-2.5 font-mono text-sm text-(--color-text-high)">
                        {layer}
                      </span>
                      {i < project.architecture.length - 1 && (
                        <ArrowRight size={16} className="shrink-0 text-(--color-text-faint)" />
                      )}
                    </StaggerItem>
                  ))}
                </StaggerList>
              </div>
            </div>
          </Reveal>

          {/* Challenges / Results / Lessons */}
          <div className="mt-14 space-y-14">
            {restSections.map((section) => (
              <Reveal key={section.index}>
                <div className="grid grid-cols-1 gap-4 border-t border-(--color-hairline) pt-8 md:grid-cols-[10rem_1fr]">
                  <p className="font-mono text-xs uppercase tracking-[0.1em] text-(--color-text-faint)">
                    {section.index} / {section.label}
                  </p>
                  <p className="max-w-2xl text-balance text-base leading-relaxed text-(--color-text-mid) md:text-lg">
                    {project[section.key] as string}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Metrics */}
          {project.metrics.length > 0 && (
            <Reveal>
              <div className="mt-14 border-t border-(--color-hairline) pt-8">
                <p className="font-mono text-xs uppercase tracking-[0.1em] text-(--color-text-faint)">
                  06 / Metrics
                </p>
                <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-lg)] border border-(--color-hairline) bg-(--color-hairline) sm:grid-cols-4">
                  {project.metrics.map((metric) => (
                    <div key={metric.label} className="bg-(--color-surface) p-6">
                      <p className="font-mono text-2xl font-medium text-(--color-text-high)">
                        {metric.value}
                      </p>
                      <p className="mt-1 text-xs text-(--color-text-muted)">{metric.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          )}

          {/* Tech stack */}
          <Reveal>
            <div className="mt-14 border-t border-(--color-hairline) pt-8">
              <p className="font-mono text-xs uppercase tracking-[0.1em] text-(--color-text-faint)">
                07 / Tech stack
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {project.stack.map((tech) => (
                  <li
                    key={tech}
                    className="rounded-[var(--radius-sm)] border border-(--color-hairline-strong) px-3 py-1.5 font-mono text-xs text-(--color-text-mid)"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </Container>
      </section>
      <CTA />
    </>
  );
}
