import Link from "next/link";
import { Container } from "@/components/ui/container";
import { siteConfig } from "@/lib/site-config";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-(--color-hairline)">
      <Container className="flex flex-col gap-8 py-14 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="font-mono text-sm text-(--color-text-high)">
            seye-o<span className="text-(--color-signal)">.</span>dev
          </p>
          <p className="mt-3 max-w-xs text-sm text-(--color-text-muted)">
            {siteConfig.shortBio}
          </p>
          <p className="mt-4 font-mono text-xs uppercase tracking-[0.1em] text-(--color-text-faint)">
            {siteConfig.location}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-3 sm:gap-x-12">
          <FooterColumn
            title="Sitemap"
            links={siteConfig.nav.map((n) => ({ label: n.label, href: n.href }))}
          />
          <FooterColumn
            title="Elsewhere"
            links={[
              { label: "GitHub", href: siteConfig.social.github },
              { label: "LinkedIn", href: siteConfig.social.linkedin },
              { label: "X / Twitter", href: siteConfig.social.x },
            ]}
          />
          <FooterColumn
            title="Contact"
            links={[{ label: siteConfig.email, href: `mailto:${siteConfig.email}` }]}
            className="col-span-2 sm:col-span-1"
          />
        </div>
      </Container>

      <Container className="flex flex-col gap-2 border-t border-(--color-hairline) py-6 font-mono text-xs text-(--color-text-faint) sm:flex-row sm:items-center sm:justify-between">
        <p>© {year} {siteConfig.name}. Built with Next.js, deployed on Vercel.</p>
        <p>Status: <span className="text-(--color-success)">available for work</span></p>
      </Container>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
  className,
}: {
  title: string;
  links: { label: string; href: string }[];
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="font-mono text-xs uppercase tracking-[0.12em] text-(--color-text-faint)">
        {title}
      </p>
      <ul className="mt-4 space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="break-words text-sm text-(--color-text-mid) transition-colors hover:text-(--color-signal)"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
