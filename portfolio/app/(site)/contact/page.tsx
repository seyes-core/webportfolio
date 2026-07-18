import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/motion/reveal";
import { ContactForm } from "@/components/sections/contact-form";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch about internships, founding-engineer roles, or contract work.",
};

export default function ContactPage() {
  return (
    <section className="py-(--spacing-section-sm) md:py-(--spacing-section)">
      <Container className="grid grid-cols-1 gap-16 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <Eyebrow index="04">Contact</Eyebrow>
          <h1 className="mt-6 max-w-md text-balance text-[var(--text-display-m)] font-semibold text-(--color-text-high) md:text-[var(--text-display-l)]">
            Tell me what you're building.
          </h1>
          <p className="mt-5 max-w-sm text-balance text-(--color-text-mid)">
            I read every message myself. Include enough context — the
            problem, the stage, the timeline — and I'll reply within a
            couple of days.
          </p>

          <dl className="mt-10 space-y-5 font-mono text-sm">
            <div>
              <dt className="text-(--color-text-faint)">Email</dt>
              <dd className="mt-1">
                <a href={`mailto:${siteConfig.email}`} className="text-(--color-signal)">
                  {siteConfig.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-(--color-text-faint)">Location</dt>
              <dd className="mt-1 text-(--color-text-mid)">{siteConfig.location}</dd>
            </div>
            <div>
              <dt className="text-(--color-text-faint)">Status</dt>
              <dd className="mt-1 text-(--color-success)">Available for work</dd>
            </div>
          </dl>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="rounded-[var(--radius-lg)] border border-(--color-hairline) bg-(--color-surface) p-8 md:p-10">
            <ContactForm />
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
