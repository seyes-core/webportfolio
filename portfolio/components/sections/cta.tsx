import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { Eyebrow } from "@/components/ui/eyebrow";
import { siteConfig } from "@/lib/site-config";

export function CTA() {
  return (
    <section id="contact" className="py-(--spacing-section-sm) md:py-(--spacing-section)">
      <Container>
        <Reveal>
          <div className="rounded-[var(--radius-lg)] border border-(--color-hairline) bg-(--color-surface) px-5 py-12 text-center sm:px-8 sm:py-14 md:px-16 md:py-20">
            <Eyebrow index="10" className="justify-center">
              Contact
            </Eyebrow>
            <h2 className="mx-auto mt-6 max-w-xl text-balance text-[clamp(1.5rem,5vw,2rem)] font-semibold text-(--color-text-high) md:text-[var(--text-display-m)]">
              Let's Build Something Worth Remembering.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-pretty text-sm text-(--color-text-muted) sm:text-base">
              Open to internships, founding-engineer roles, and focused
              contract work in cloud, data, and AI products.
            </p>
            <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/contact">
                  Start a conversation
                  <ArrowUpRight size={16} />
                </Link>
              </Button>
              <Button asChild variant="ghost" size="lg" className="w-full sm:w-auto">
                <a href={`mailto:${siteConfig.email}`} className="max-w-full truncate">
                  {siteConfig.email}
                </a>
              </Button>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
