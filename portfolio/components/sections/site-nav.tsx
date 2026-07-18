"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Container } from "@/components/ui/container";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-(--color-hairline) bg-(--color-base)/85 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between">
        <Link
          href="/"
          className="font-mono text-sm font-medium tracking-tight text-(--color-text-high)"
          onClick={() => setOpen(false)}
        >
          seye<span className="text-(--color-signal)">.</span>dev
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {siteConfig.nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-2 rounded-[var(--radius-sm)] px-3 py-2 font-mono text-xs uppercase tracking-[0.12em] transition-colors",
                  active
                    ? "text-(--color-signal)"
                    : "text-(--color-text-muted) hover:text-(--color-text-high)",
                )}
                aria-current={active ? "page" : undefined}
              >
                <span className="text-(--color-text-faint) group-hover:text-(--color-signal)">
                  {item.id}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:block">
          <Link
            href="/contact"
            className="rounded-[var(--radius-sm)] border border-(--color-hairline-strong) px-4 py-2 font-mono text-xs uppercase tracking-[0.12em] text-(--color-text-high) transition-colors hover:border-(--color-signal) hover:text-(--color-signal)"
          >
            Let's talk
          </Link>
        </div>

        <button
          type="button"
          className="-mr-2 inline-flex h-11 w-11 items-center justify-center text-(--color-text-high) md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </Container>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-nav"
            aria-label="Primary"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-(--color-hairline) md:hidden"
          >
            <Container className="flex flex-col gap-1 py-4">
              {siteConfig.nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-[var(--radius-sm)] px-2 py-3 font-mono text-sm uppercase tracking-[0.1em] text-(--color-text-mid)"
                >
                  <span className="text-(--color-signal)">{item.id}</span>
                  {item.label}
                </Link>
              ))}
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="mt-2 rounded-[var(--radius-sm)] bg-(--color-signal) px-4 py-3 text-center font-mono text-xs uppercase tracking-[0.12em] text-(--color-signal-ink)"
              >
                Let's talk
              </Link>
            </Container>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
