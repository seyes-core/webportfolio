import { Reveal } from "@/components/motion/reveal";
import { formatMonthYear } from "@/lib/utils";
import type { WritingEntry } from "@/types/content";

export function WritingList({ entries }: { entries: WritingEntry[] }) {
  return (
    <div className="divide-y divide-(--color-hairline)">
      {entries.map((entry) => (
        <Reveal key={entry.slug}>
          <a
            href={entry.externalUrl ?? `/writing/${entry.slug}`}
            className="group flex flex-col gap-2 py-6 md:flex-row md:items-center md:justify-between md:gap-6"
          >
            <div className="min-w-0">
              <h3 className="truncate font-display text-lg font-medium text-(--color-text-high) group-hover:text-(--color-signal)">
                {entry.title}
              </h3>
              <p className="mt-1 max-w-xl text-sm text-(--color-text-muted)">
                {entry.excerpt}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-4 font-mono text-xs text-(--color-text-faint)">
              <span>{formatMonthYear(entry.date)}</span>
              <span>{entry.readingMinutes} min</span>
            </div>
          </a>
        </Reveal>
      ))}
    </div>
  );
}
