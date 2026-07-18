import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { WritingList } from "@/components/sections/writing-list";
import { writing } from "@/content/experience";

export function BlogPreview() {
  return (
    <section className="py-(--spacing-section-sm) md:py-(--spacing-section)">
      <Container>
        <Reveal>
          <div className="mb-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading
              index="09"
              eyebrow="Blog"
              title="Latest Articles"
              className="mb-0"
            />
            <Link
              href="/writing"
              className="flex shrink-0 items-center gap-1.5 font-mono text-xs uppercase tracking-[0.1em] text-(--color-text-muted) transition-colors hover:text-(--color-signal)"
            >
              All articles
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </Reveal>

        <WritingList entries={writing.slice(0, 3)} />
      </Container>
    </section>
  );
}
