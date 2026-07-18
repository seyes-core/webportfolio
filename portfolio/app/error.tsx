"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="flex min-h-[70vh] items-center py-24">
      <Container className="text-center">
        <p className="font-mono text-sm text-(--color-danger)">Runtime error</p>
        <h1 className="mt-4 text-[var(--text-display-s)] font-semibold text-(--color-text-high)">
          Something broke on this page.
        </h1>
        <p className="mt-4 text-(--color-text-muted)">
          The error's been logged. Try again, or head back to the index.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button onClick={() => reset()}>Try again</Button>
          <Button variant="outline" asChild>
            <Link href="/">Back to index</Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
