import { cn } from "@/lib/utils";

/**
 * Mono-set "spec section" label, e.g. "01 / System". Reinforces the
 * document-as-specification framing used across the site's IA.
 */
export function Eyebrow({
  index,
  children,
  className,
}: {
  index?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 font-mono text-xs uppercase tracking-[0.18em] text-(--color-text-faint)",
        className,
      )}
    >
      {index && (
        <span className="text-(--color-signal)" aria-hidden="true">
          {index}
        </span>
      )}
      <span>{children}</span>
      <span className="h-px flex-1 bg-(--color-hairline)" aria-hidden="true" />
    </div>
  );
}
