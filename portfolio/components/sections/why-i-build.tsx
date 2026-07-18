import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/motion/reveal";

const paragraphs = [
  "Technology has never been just about writing code for me.",
  "I'm fascinated by the intersection of software, artificial intelligence, automation, and real-world problem solving.",
  "From my background in Estate Management to my transition into software engineering, I've become obsessed with one question: how can technology improve the lives of thousands instead of dozens?",
  "Today I build intelligent systems that combine cloud computing, AI, automation, and modern software engineering to solve meaningful problems in agriculture, real estate, education, and beyond.",
];

const closing = [
  "I believe great software disappears into the background.",
  "People shouldn't notice the technology.",
  "They should notice how much easier their lives become.",
];

export function WhyIBuild({
  variant = "full",
  index = "01",
}: {
  variant?: "full" | "compact";
  index?: string;
}) {
  const isCompact = variant === "compact";

  return (
    <section className="py-(--spacing-section-sm) md:py-(--spacing-section)">
      <Container>
        <Reveal>
          <Eyebrow index={index}>Why I Build</Eyebrow>

          <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1fr]">
            <div className="space-y-5">
              {(isCompact ? paragraphs.slice(0, 3) : paragraphs).map((p) => (
                <p
                  key={p}
                  className="max-w-lg text-balance text-lg leading-relaxed text-(--color-text-mid) first:text-[var(--text-display-s)] first:font-display first:font-medium first:text-(--color-text-high)"
                >
                  {p}
                </p>
              ))}
            </div>

            <div className="flex flex-col justify-between gap-8 border-l border-(--color-hairline) pl-8">
              <div className="space-y-2">
                {closing.map((line, i) => (
                  <p
                    key={line}
                    className={
                      i === closing.length - 1
                        ? "font-display text-xl font-medium text-(--color-signal) md:text-2xl"
                        : "font-display text-xl font-medium text-(--color-text-high) md:text-2xl"
                    }
                  >
                    {line}
                  </p>
                ))}
              </div>

              {isCompact && (
                <Link
                  href="/about"
                  className="inline-flex w-fit items-center gap-1.5 font-mono text-xs uppercase tracking-[0.1em] text-(--color-text-muted) transition-colors hover:text-(--color-signal)"
                >
                  Read the full story
                  <ArrowUpRight size={14} />
                </Link>
              )}
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
