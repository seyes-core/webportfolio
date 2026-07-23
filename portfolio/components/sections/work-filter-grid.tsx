"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ProjectCard } from "@/components/sections/project-card";
import type { Project, ProjectStatus } from "@/types/content";
import { cn } from "@/lib/utils";

const STATUS_LABEL: Record<ProjectStatus, string> = {
  live: "Live",
  "in-progress": "In progress",
  archived: "Archived",
};

/** Only surface a stack filter if it actually narrows the list down. */
const MIN_PROJECTS_FOR_STACK_FILTER = 2;

function useProjectFilters(projects: Project[]) {
  const stackOptions = useMemo(() => {
    const counts = new Map<string, number>();
    for (const project of projects) {
      for (const tech of project.stack) {
        counts.set(tech, (counts.get(tech) ?? 0) + 1);
      }
    }
    return Array.from(counts.entries())
      .filter(([, count]) => count >= MIN_PROJECTS_FOR_STACK_FILTER)
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([tech]) => tech);
  }, [projects]);

  const statusOptions = useMemo(() => {
    const seen = new Set<ProjectStatus>();
    for (const project of projects) seen.add(project.status);
    return Array.from(seen);
  }, [projects]);

  return { stackOptions, statusOptions };
}

/**
 * Filterable project grid.
 *
 * Layout pattern adapted from hivesecurity.gitlab.io/cheatsheet's dense
 * reference UI: a filter bar that stays out of the way of the content it
 * controls (sticky, just under the site header, on wider screens) and
 * collapses into a single horizontally-scrollable strip of chips on phones
 * instead of stacking into a tall vertical list. The filtering itself is
 * fully client-side — no navigation, no reload.
 */
export function WorkFilterGrid({ projects }: { projects: Project[] }) {
  const { stackOptions, statusOptions } = useProjectFilters(projects);
  const [stackFilter, setStackFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<"All" | ProjectStatus>("All");

  const filtered = useMemo(() => {
    return projects.filter((project) => {
      const matchesStack = stackFilter === "All" || project.stack.includes(stackFilter);
      const matchesStatus = statusFilter === "All" || project.status === statusFilter;
      return matchesStack && matchesStatus;
    });
  }, [projects, stackFilter, statusFilter]);

  const hasFilters = stackOptions.length > 0 || statusOptions.length > 1;

  return (
    <div className="mt-16">
      {hasFilters && (
        <div className="sticky top-16 z-30 -mx-4 mb-8 border-y border-(--color-hairline) bg-(--color-base)/90 px-4 py-4 backdrop-blur-md sm:mx-0 sm:rounded-[var(--radius-md)] sm:border sm:px-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-3">
            {stackOptions.length > 0 && (
              <FilterRow
                label="Stack"
                options={["All", ...stackOptions]}
                active={stackFilter}
                onChange={setStackFilter}
              />
            )}
            {statusOptions.length > 1 && (
              <FilterRow
                label="Status"
                options={["All", ...statusOptions]}
                active={statusFilter}
                onChange={(value) => setStatusFilter(value as "All" | ProjectStatus)}
                formatLabel={(value) =>
                  value === "All" ? "All" : STATUS_LABEL[value as ProjectStatus]
                }
              />
            )}
          </div>
        </div>
      )}

      {filtered.length > 0 ? (
        <motion.div layout className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => (
              <motion.div
                key={project.slug}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="rounded-[var(--radius-lg)] border border-dashed border-(--color-hairline-strong) py-16 text-center">
          <p className="font-mono text-sm text-(--color-text-muted)">
            No projects match that filter combination.
          </p>
        </div>
      )}
    </div>
  );
}

function FilterRow({
  label,
  options,
  active,
  onChange,
  formatLabel,
}: {
  label: string;
  options: string[];
  active: string;
  onChange: (value: string) => void;
  formatLabel?: (value: string) => string;
}) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <span className="shrink-0 font-mono text-[0.7rem] uppercase tracking-[0.1em] text-(--color-text-faint)">
        {label}
      </span>
      <div className="hide-scrollbar full-bleed-sm flex min-w-0 gap-2 overflow-x-auto px-4 sm:flex-wrap sm:px-0">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            data-active={active === option}
            onClick={() => onChange(option)}
            className={cn("filter-chip")}
          >
            {formatLabel ? formatLabel(option) : option}
          </button>
        ))}
      </div>
    </div>
  );
}
