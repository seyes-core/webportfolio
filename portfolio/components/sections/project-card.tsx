import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@/types/content";

const statusLabel: Record<Project["status"], string> = {
  live: "Live in production",
  "in-progress": "In progress",
  archived: "Archived",
};

const statusTone: Record<Project["status"], "signal" | "dataline" | "neutral"> = {
  live: "signal",
  "in-progress": "dataline",
  archived: "neutral",
};

/**
 * Product-launch style card: large cover image up top, then the pitch —
 * status, title, one-line positioning, and a stack preview. Full narrative
 * (problem/architecture/challenges/results/lessons) lives on the detail page.
 */
export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)] border border-(--color-hairline) bg-(--color-surface) transition-all duration-300 hover:border-(--color-hairline-strong) hover:bg-(--color-surface-raised)"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-(--color-hairline) bg-(--color-base)">
        <Image
          src={project.coverImage}
          alt=""
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          sizes="(min-width: 768px) 50vw, 100vw"
        />
      </div>

      <div className="flex flex-1 flex-col justify-between p-7 md:p-8">
        <div>
          <div className="flex items-center justify-between gap-4">
            <Badge tone={statusTone[project.status]}>{statusLabel[project.status]}</Badge>
            <span className="font-mono text-xs text-(--color-text-faint)">{project.year}</span>
          </div>

          <h3 className="mt-6 font-display text-2xl font-semibold text-(--color-text-high) md:text-[1.75rem]">
            {project.title}
          </h3>
          <p className="mt-2 text-sm text-(--color-signal)">{project.tagline}</p>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-(--color-text-muted)">
            {project.summary}
          </p>
        </div>

        <div className="mt-8 flex items-center justify-between gap-4">
          <ul className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-[0.7rem] uppercase tracking-[0.06em] text-(--color-text-faint)">
            {project.stack.slice(0, 4).map((tech) => (
              <li key={tech}>{tech}</li>
            ))}
          </ul>
          <ArrowUpRight
            size={20}
            className="shrink-0 text-(--color-text-faint) transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-(--color-signal)"
          />
        </div>
      </div>
    </Link>
  );
}
