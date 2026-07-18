import { cn } from "@/lib/utils";
import { Eyebrow } from "./eyebrow";

export function SectionHeading({
  index,
  eyebrow,
  title,
  description,
  className,
}: {
  index?: string;
  eyebrow: string;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={cn("mb-12 md:mb-16", className)}>
      <Eyebrow index={index}>{eyebrow}</Eyebrow>
      <h2 className="mt-5 max-w-2xl text-balance text-[clamp(1.5rem,5vw,2rem)] font-semibold text-(--color-text-high) md:text-[var(--text-display-m)]">
        {title}
      </h2>
      {description && (
        <p className="mt-4 max-w-xl text-pretty text-sm text-(--color-text-muted) sm:text-base md:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}
