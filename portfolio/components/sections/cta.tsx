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
          <div className="rounded-[var(--radius-lg)] border border-(--color-hairline) bg-(--color-surface) px-8 py-14 text-center md:px-16 md:py-20">
            <Eyebrow index="10" className="justify-center">
              Contact
            </Eyebrow>
            <h2 className="mx-auto mt-6 max-w-xl text-balance text-[var(--text-display-s)] font-semibold text-(--color-text-high) md:text-[var(--text-display-m)]">
              Let's Build Something Worth Remembering.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-balance text-(--color-text-muted)">
              Open to internships, founding-engineer roles, and focused
              contract work in cloud, data, and AI products.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/contact">
                  Start a conversation
                  <ArrowUpRight size={16} />
                </Link>
              </Button>
              <Button asChild variant="ghost" size="lg">
                <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
              </Button>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
