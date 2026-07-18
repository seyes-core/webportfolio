import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/ui/container";

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] items-center py-(--spacing-section-sm)">
      <Container className="text-center">
        <p className="font-mono text-sm text-(--color-signal)">404</p>
        <h1 className="mt-4 text-[var(--text-display-m)] font-semibold text-(--color-text-high)">
          This route doesn't resolve.
        </h1>
        <p className="mt-4 text-(--color-text-muted)">
          The page you're looking for doesn't exist, or moved.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 font-mono text-sm text-(--color-signal)"
        >
          <ArrowLeft size={16} />
          Back to index
        </Link>
      </Container>
    </section>
  );
}
